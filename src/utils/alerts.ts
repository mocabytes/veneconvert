import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RateAlert {
  id: string;
  type: "BCV" | "BINANCE_BUY" | "BINANCE_SELL";
  condition: "ABOVE" | "BELOW";
  threshold: number;
  enabled: boolean;
  createdAt: string;
  triggeredAt?: string;
}

const ALERTS_KEY = "rate_alerts";

export async function saveAlert(
  alert: Omit<RateAlert, 'id' | 'createdAt'>
): Promise<void> {
  try {
    const existingAlerts = await getAlerts();
    const newAlert: RateAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedAlerts = [...existingAlerts, newAlert];
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
  } catch (error) {
    console.error("Error saving alert:", error);
  }
}

export async function getAlerts(): Promise<RateAlert[]> {
  try {
    const alertsData = await AsyncStorage.getItem(ALERTS_KEY);
    if (!alertsData) {
      return [];
    }

    return JSON.parse(alertsData) as RateAlert[];
  } catch (error) {
    console.error("Error getting alerts:", error);
    return [];
  }
}

export async function updateAlert(
  id: string,
  updates: Partial<RateAlert>
): Promise<void> {
  try {
    const existingAlerts = await getAlerts();
    const updatedAlerts = existingAlerts.map((alert) =>
      alert.id === id ? { ...alert, ...updates } : alert
    );
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
  } catch (error) {
    console.error("Error updating alert:", error);
  }
}

export async function deleteAlert(id: string): Promise<void> {
  try {
    const existingAlerts = await getAlerts();
    const updatedAlerts = existingAlerts.filter((alert) => alert.id !== id);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
  } catch (error) {
    console.error("Error deleting alert:", error);
  }
}

export async function checkAlerts(currentRates: {
  bcv: number;
  binanceBuy: number;
  binanceSell: number;
}): Promise<RateAlert[]> {
  try {
    const alerts = await getAlerts();
    const triggeredAlerts: RateAlert[] = [];

    for (const alert of alerts) {
      if (!alert.enabled || alert.triggeredAt) {
        continue;
      }

      let currentRate: number;
      switch (alert.type) {
        case "BCV":
          currentRate = currentRates.bcv;
          break;
        case "BINANCE_BUY":
          currentRate = currentRates.binanceBuy;
          break;
        case "BINANCE_SELL":
          currentRate = currentRates.binanceSell;
          break;
        default:
          continue;
      }

      let shouldTrigger = false;
      if (alert.condition === "ABOVE" && currentRate > alert.threshold) {
        shouldTrigger = true;
      } else if (alert.condition === "BELOW" && currentRate < alert.threshold) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        triggeredAlerts.push(alert);
        await updateAlert(alert.id, { triggeredAt: new Date().toISOString() });
      }
    }

    return triggeredAlerts;
  } catch (error) {
    console.error("Error checking alerts:", error);
    return [];
  }
}

export function formatAlertMessage(
  alert: RateAlert,
  currentRate: number
): string {
  const conditionText = alert.condition === "ABOVE" ? "superó" : "bajó de";
  const rateName =
    alert.type === 'BCV'
      ? 'BCV'
      : alert.type === 'BINANCE_BUY'
      ? 'P2P Compra'
      : "P2P Venta";

  return `¡Alerta de Tasa!\n\nLa tasa ${rateName} ha ${conditionText} tu umbral de ${alert.threshold.toFixed(
    2
  )}\n\nTasa actual: ${currentRate.toFixed(2)}`;
}
