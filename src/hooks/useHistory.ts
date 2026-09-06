import { useCallback, useEffect, useState } from "react";
import {
  ConversionRecord,
  clearConversionHistory,
  deleteConversion,
  getConversionHistory,
  saveConversion,
} from "../utils/history";

export function useHistory() {
  const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>(
    []
  );

  const load = useCallback(async () => {
    const history = await getConversionHistory();
    setConversionHistory(history);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addConversion = useCallback(
    async (record: Omit<ConversionRecord, "id" | "timestamp">) => {
      await saveConversion(record);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteConversion(id);
      await load();
    },
    [load]
  );

  const clearAll = useCallback(async () => {
    await clearConversionHistory();
    await load();
  }, [load]);

  return { conversionHistory, addConversion, remove, clearAll, load };
}
