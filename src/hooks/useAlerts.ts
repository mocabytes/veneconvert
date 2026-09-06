import { useCallback, useEffect, useState } from "react";
import {
  RateAlert,
  deleteAlert,
  getAlerts,
  saveAlert,
  updateAlert,
  clearAllAlerts,
} from "../utils/alerts";

export function useAlerts() {
  const [rateAlerts, setRateAlerts] = useState<RateAlert[]>([]);

  const load = useCallback(async () => {
    const alerts = await getAlerts();
    setRateAlerts(alerts);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addAlert = useCallback(
    async (alert: Omit<RateAlert, "id" | "createdAt">) => {
      await saveAlert(alert);
      await load();
    },
    [load]
  );

  const toggleAlert = useCallback(
    async (id: string, enabled: boolean) => {
      const updates: Partial<RateAlert> = { enabled };
      if (enabled) {
        updates.triggeredAt = undefined;
      }
      await updateAlert(id, updates);
      await load();
    },
    [load]
  );

  const removeAlert = useCallback(
    async (id: string) => {
      await deleteAlert(id);
      await load();
    },
    [load]
  );

  const clearAll = useCallback(async () => {
    await clearAllAlerts();
    await load();
  }, [load]);

  return { rateAlerts, addAlert, toggleAlert, removeAlert, clearAll };
}
