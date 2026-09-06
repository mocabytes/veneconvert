import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TasasEntrada } from "../utils/calculations";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import {
  getRateHistory,
  saveRateHistoryPoint,
  RateHistoryPoint,
} from "../utils/ratesHistory";
import { RateAlert, checkAlerts } from "../utils/alerts";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const DEFAULT_RATES: TasasEntrada = {
  bcv: 36.5,
  binanceBuy: 40.1,
  binanceSell: 39.5,
};

export function useRates() {
  const [tasas, setTasas] = useState<TasasEntrada>(DEFAULT_RATES);
  const [cargandoTasas, setCargandoTasas] = useState(true);
  const [modoOffline, setModoOffline] = useState(false);
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState("");
  const [ratesHistory, setRatesHistory] = useState<RateHistoryPoint[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<RateAlert[]>([]);
  const syncEnProgreso = useRef(false);

  const cargarHistory = useCallback(async () => {
    try {
      const history = await getRateHistory();
      setRatesHistory(history);
    } catch {
      setRatesHistory([]);
    }
  }, []);

  const sincronizarTasas = useCallback(async (): Promise<RateAlert[] | null> => {
    if (syncEnProgreso.current) {
      return null;
    }
    syncEnProgreso.current = true;
    try {
      const [resBcv, resParalelo] = await Promise.all([
        fetchWithTimeout("https://ve.dolarapi.com/v1/dolares/oficial"),
        fetchWithTimeout("https://ve.dolarapi.com/v1/dolares/paralelo"),
      ]);
      if (!resBcv.ok || !resParalelo.ok) {
        throw new Error("Fallo de red");
      }

      const dataBcv = await resBcv.json();
      const dataParalelo = await resParalelo.json();

      const nuevasTasas: TasasEntrada = {
        bcv: Number(dataBcv.promedio),
        binanceBuy: Number(dataParalelo.promedio * 1.008),
        binanceSell: Number(dataParalelo.promedio * 0.992),
      };

      if (
        !isFinite(nuevasTasas.bcv) ||
        !isFinite(nuevasTasas.binanceBuy) ||
        !isFinite(nuevasTasas.binanceSell) ||
        nuevasTasas.bcv <= 0 ||
        nuevasTasas.binanceBuy <= 0 ||
        nuevasTasas.binanceSell <= 0
      ) {
        throw new Error("Tasas inválidas en la respuesta");
      }

      const fechaActual = new Date().toISOString();

      await AsyncStorage.setItem("cached_rates", JSON.stringify(nuevasTasas));
      await AsyncStorage.setItem("cached_sync_time", fechaActual);
      await saveRateHistoryPoint({
        bcv: nuevasTasas.bcv,
        binance: nuevasTasas.binanceBuy,
      });

      setTasas(nuevasTasas);
      setUltimaSincronizacion(fechaActual);
      setModoOffline(false);
      await cargarHistory();

      const alerts = await checkAlerts(nuevasTasas);
      setTriggeredAlerts(alerts);
      return alerts;
    } catch {
      try {
        const tasasLocales = await AsyncStorage.getItem("cached_rates");
        const tiempoLocal = await AsyncStorage.getItem("cached_sync_time");
        if (tasasLocales && tiempoLocal) {
          const cached = JSON.parse(tasasLocales);
          if (
            !isFinite(Number(cached.bcv)) ||
            !isFinite(Number(cached.binanceBuy)) ||
            !isFinite(Number(cached.binanceSell)) ||
            Number(cached.bcv) <= 0 ||
            Number(cached.binanceBuy) <= 0 ||
            Number(cached.binanceSell) <= 0
          ) {
            throw new Error("Cache inválido");
          }
          setTasas({
            bcv: Number(cached.bcv),
            binanceBuy: Number(cached.binanceBuy),
            binanceSell: Number(cached.binanceSell),
          });
          setUltimaSincronizacion(tiempoLocal);
          setModoOffline(true);
        } else {
          setTasas(DEFAULT_RATES);
          setUltimaSincronizacion(new Date().toISOString());
          setModoOffline(true);
        }
        await cargarHistory();
      } catch {
        setTasas(DEFAULT_RATES);
        setModoOffline(true);
      }
      setTriggeredAlerts([]);
      return null;
    } finally {
      syncEnProgreso.current = false;
      setCargandoTasas(false);
    }
  }, [cargarHistory]);

  const clearTriggeredAlerts = useCallback(() => {
    setTriggeredAlerts([]);
  }, []);

  useEffect(() => {
    sincronizarTasas();
  }, [sincronizarTasas]);

  useEffect(() => {
    const interval = setInterval(() => {
      sincronizarTasas();
    }, REFRESH_INTERVAL_MS);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        sincronizarTasas();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [sincronizarTasas]);

  return {
    tasas,
    cargandoTasas,
    modoOffline,
    ultimaSincronizacion,
    ratesHistory,
    triggeredAlerts,
    sincronizarTasas,
    clearTriggeredAlerts,
  };
}
