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

export async function getExchangeRates(
  baseCurrency: string = 'VES',
  _localRates?: { bcv: number; binanceBuy: number }
): Promise<{ [key: string]: number }> {
  const rates: { [key: string]: number } = {};

  try {
    // Obtener tasas de la API de Venezuela
    const [resBcv, resParalelo, resEuro, resCOP] = await Promise.all([
      fetch("https://ve.dolarapi.com/v1/dolares/oficial"),
      fetch("https://ve.dolarapi.com/v1/dolares/paralelo"),
      fetch("https://ve.dolarapi.com/v1/dolares/euro"),
      fetch("https://ve.dolarapi.com/v1/dolares/peso"),
    ]);

    if (!resBcv.ok || !resParalelo.ok) {
      throw new Error("Fallo de red");
    }

    const dataBcv = await resBcv.json();
    const dataParalelo = await resParalelo.json();
    const dataEuro = resEuro.ok ? await resEuro.json() : null;
    const dataCOP = resCOP.ok ? await resCOP.json() : null;

    const bcvRate = Number(dataBcv.promedio);
    const paraleloRate = Number(dataParalelo.promedio);
    const euroRate = dataEuro ? Number(dataEuro.promedio) : null;
    const copRate = dataCOP ? Number(dataCOP.promedio) : null;

    // Tasas base en VES (cuántos VES vale 1 unidad de cada moneda)
    const baseRates: { [key: string]: number } = {
      VES: 1,
      USD: bcvRate,
      EUR: euroRate || bcvRate * 1.08,
      COP: copRate || bcvRate * 0.00025,
      PEN: bcvRate * 0.027,
      BRL: bcvRate * 0.2,
      MXN: bcvRate * 0.055,
      USDT: paraleloRate,
      CRC: bcvRate * 0.0018,
      CAD: bcvRate * 0.73,
      AUD: bcvRate * 0.65,
    };

    if (baseCurrency === "VES") {
      return baseRates;
    }

    const baseRate = baseRates[baseCurrency];
    if (!baseRate) {
      return {};
    }

    for (const [code, rate] of Object.entries(baseRates)) {
      rates[code] = rate / baseRate;
    }

    return rates;
  } catch (error) {
    console.error("Error obteniendo tasas de cambio:", error);

    // Fallback a tasas estáticas si falla la API
    const baseRates: { [key: string]: number } = {
      VES: 1,
      USD: 0.027,
      EUR: 0.025,
      COP: 110,
      PEN: 0.1,
      BRL: 0.13,
      MXN: 0.48,
      USDT: 0.025,
      CRC: 0.0018,
      CAD: 0.73,
      AUD: 0.65,
    };

    if (baseCurrency === "VES") {
      return baseRates;
    }

    const baseRate = baseRates[baseCurrency];
    if (!baseRate) {
      return {};
    }

    for (const [code, rate] of Object.entries(baseRates)) {
      rates[code] = rate / baseRate;
    }

    return rates;
  }
}
