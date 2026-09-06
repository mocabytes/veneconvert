import { fetchWithTimeout } from "./fetchWithTimeout";

const FX_API_URL = "https://open.er-api.com/v6/latest/USD";
const FX_CACHE_TTL_MS = 60_000;
const EXTRA_FX_CURRENCIES = ["PEN", "BRL", "MXN", "CRC", "CAD", "AUD"];

let fxRatesCache: { timestamp: number; rates: { [key: string]: number } } | null =
  null;

export function resetFXRatesCache(): void {
  fxRatesCache = null;
}

async function fetchFXRatesUSD(): Promise<{ [key: string]: number } | null> {
  if (
    fxRatesCache &&
    Date.now() - fxRatesCache.timestamp < FX_CACHE_TTL_MS
  ) {
    return fxRatesCache.rates;
  }

  const res = await fetchWithTimeout(FX_API_URL);
  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const rawRates: unknown = data?.rates;
  if (!rawRates || typeof rawRates !== "object") {
    return null;
  }

  const rates: { [key: string]: number } = {};
  for (const [code, value] of Object.entries(
    rawRates as { [key: string]: unknown }
  )) {
    const num = Number(value);
    if (isFinite(num) && num > 0) {
      rates[code] = num;
    }
  }
  if (!rates.USD || rates.USD <= 0) {
    return null;
  }

  fxRatesCache = { timestamp: Date.now(), rates };
  return rates;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flagCode: string;
  rateToVES?: number;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "VES", symbol: "Bs.", name: "Bolívar", flagCode: "ve" },
  { code: "USD", symbol: "$", name: "Dólar", flagCode: "us" },
  { code: "EUR", symbol: "€", name: "Euro", flagCode: "eu" },
  { code: "COP", symbol: "$", name: "Peso", flagCode: "co" },
  { code: "PEN", symbol: "S/", name: "Sol", flagCode: "pe" },
  { code: "BRL", symbol: "R$", name: "Real", flagCode: "br" },
  { code: "MXN", symbol: "$", name: "Peso", flagCode: "mx" },
  { code: "USDT", symbol: "₮", name: "Tether", flagCode: "usdt" },
  { code: "CRC", symbol: "₡", name: "Colón", flagCode: "cr" },
  { code: "CAD", symbol: "$", name: "Dólar", flagCode: "ca" },
  { code: "AUD", symbol: "$", name: "Dólar", flagCode: "au" },
];

export interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rateUsed: number;
  path: string[];
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: { [key: string]: number }
): ConversionResult | null {
  if (fromCurrency === toCurrency) {
    return {
      fromAmount: amount,
      fromCurrency,
      toAmount: amount,
      toCurrency,
      rateUsed: 1,
      path: [fromCurrency],
    };
  }

  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return null;
  }

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  const rateUsed = fromRate / toRate;
  const toAmount = amount * rateUsed;

  return {
    fromAmount: amount,
    fromCurrency,
    toAmount,
    toCurrency,
    rateUsed,
    path: [fromCurrency, toCurrency],
  };
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code);
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = getCurrencyByCode(currency);
  const symbol = currencyInfo?.symbol || currency;
  return `${symbol} ${amount.toFixed(2)}`;
}

function buildBaseRates(bcvRate: number, paraleloRate: number): { [key: string]: number } {
  return {
    VES: 1,
    USD: bcvRate,
    EUR: bcvRate * 1.08,
    COP: bcvRate * 0.00025,
    PEN: bcvRate * 0.27,
    BRL: bcvRate * 0.2,
    MXN: bcvRate * 0.055,
    USDT: paraleloRate,
    CRC: bcvRate * 0.0018,
    CAD: bcvRate * 0.73,
    AUD: bcvRate * 0.65,
  };
}

function normalizeRates(
  baseRates: { [key: string]: number },
  baseCurrency: string
): { [key: string]: number } {
  const baseRate = baseRates[baseCurrency];
  if (!baseRate) {
    return {};
  }

  const rates: { [key: string]: number } = {};
  for (const [code, rate] of Object.entries(baseRates)) {
    rates[code] = rate / baseRate;
  }
  return rates;
}

export async function getExchangeRates(
  baseCurrency: string = 'VES',
  localRates?: { bcv: number; binanceBuy: number }
): Promise<{ [key: string]: number }> {
  const bcvRate = localRates?.bcv || 36.5;
  const paraleloRate = localRates?.binanceBuy || 40.1;
  const baseRates = buildBaseRates(bcvRate, paraleloRate);

  try {
    const [resEuro, resCOP] = await Promise.all([
      fetchWithTimeout("https://ve.dolarapi.com/v1/dolares/euro"),
      fetchWithTimeout("https://ve.dolarapi.com/v1/dolares/peso"),
    ]);

    if (resEuro.ok) {
      const dataEuro = await resEuro.json();
      const euroRate = Number(dataEuro.promedio);
      if (euroRate > 0) {
        baseRates.EUR = euroRate;
      }
    }

    if (resCOP.ok) {
      const dataCOP = await resCOP.json();
      const copRate = Number(dataCOP.promedio);
      if (copRate > 0) {
        baseRates.COP = copRate;
      }
    }
  } catch (error) {
    console.error("Error obteniendo tasas adicionales:", error);
  }

  try {
    const fxRates = await fetchFXRatesUSD();
    if (fxRates) {
      for (const code of EXTRA_FX_CURRENCIES) {
        const usdRate = fxRates[code];
        if (usdRate && usdRate > 0) {
          baseRates[code] = bcvRate / usdRate;
        }
      }
    }
  } catch (error) {
    console.error("Error obteniendo tasas FX:", error);
  }

  return normalizeRates(baseRates, baseCurrency);
}
