import { useCallback, useState } from "react";
import {
  ConversionResult,
  convertCurrency,
  getExchangeRates,
} from "../utils/multiCurrency";
import { parseNumber } from "../utils/parseNumber";

export function useMultiCurrency(tasas: { bcv: number; binanceBuy: number }) {
  const [selectedFromCurrency, setSelectedFromCurrency] = useState("VES");
  const [selectedToCurrency, setSelectedToCurrency] = useState("USD");
  const [multiCurrencyAmount, setMultiCurrencyAmount] = useState("");
  const [multiCurrencyResult, setMultiCurrencyResult] =
    useState<ConversionResult | null>(null);
  const [showFromCurrencySelector, setShowFromCurrencySelector] =
    useState(false);
  const [showToCurrencySelector, setShowToCurrencySelector] = useState(false);

  const convert = useCallback(async () => {
    const amount = parseNumber(multiCurrencyAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    try {
      const rates = await getExchangeRates("VES", {
        bcv: tasas.bcv,
        binanceBuy: tasas.binanceBuy,
      });
      const result = convertCurrency(
        amount,
        selectedFromCurrency,
        selectedToCurrency,
        rates
      );
      setMultiCurrencyResult(result);
    } catch (error) {
      console.error("Error en conversión multi-moneda:", error);
    }
  }, [multiCurrencyAmount, selectedFromCurrency, selectedToCurrency, tasas.bcv, tasas.binanceBuy]);

  const swap = useCallback(() => {
    setSelectedFromCurrency(selectedToCurrency);
    setSelectedToCurrency(selectedFromCurrency);
    setMultiCurrencyResult(null);
  }, [selectedFromCurrency, selectedToCurrency]);

  const clear = useCallback(() => {
    setMultiCurrencyAmount("");
    setMultiCurrencyResult(null);
    setShowFromCurrencySelector(false);
    setShowToCurrencySelector(false);
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    setMultiCurrencyAmount(value);
    setMultiCurrencyResult(null);
  }, []);

  return {
    selectedFromCurrency,
    setSelectedFromCurrency,
    selectedToCurrency,
    setSelectedToCurrency,
    multiCurrencyAmount,
    setMultiCurrencyAmount: handleAmountChange,
    multiCurrencyResult,
    showFromCurrencySelector,
    setShowFromCurrencySelector,
    showToCurrencySelector,
    setShowToCurrencySelector,
    convert,
    swap,
    clear,
  };
}
