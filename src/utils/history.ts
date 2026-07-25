import AsyncStorage from '@react-native-async-storage/async-storage';

export type ConversionType =
  | "BS_TO_USD_BCV"
  | "BS_TO_USDT"
  | "USD_BCV_TO_BS"
  | 'USDT_TO_BS';

export interface ConversionRecord {
  id: string;
  timestamp: string;
  type: ConversionType;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rateUsed: number;
  rateType: 'BCV' | 'BINANCE_BUY' | 'BINANCE_SELL';
}

const HISTORY_KEY = 'conversion_history';
const MAX_HISTORY_ITEMS = 50;

export async function saveConversion(
  record: Omit<ConversionRecord, "id" | "timestamp">
): Promise<void> {
  try {
    const existingHistory = await getConversionHistory();

    const newRecord: ConversionRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newRecord, ...existingHistory].slice(
      0,
      MAX_HISTORY_ITEMS
    );

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving conversion:', error);
  }
}

export async function getConversionHistory(): Promise<ConversionRecord[]> {
  try {
    const historyData = await AsyncStorage.getItem(HISTORY_KEY);
    if (!historyData) {
      return [];
    }

    const parsed = JSON.parse(historyData) as ConversionRecord[];
    return parsed.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error getting conversion history:', error);
    return [];
  }
}

export async function deleteConversion(id: string): Promise<void> {
  try {
    const existingHistory = await getConversionHistory();
    const updatedHistory = existingHistory.filter((record) => record.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting conversion:', error);
  }
}

export async function clearConversionHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing conversion history:', error);
  }
}

export function formatConversionRecord(record: ConversionRecord): string {
  const date = new Date(record.timestamp).toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${date}: ${record.fromAmount.toFixed(2)} ${
    record.fromCurrency
  } → ${record.toAmount.toFixed(2)} ${record.toCurrency} (Tasa: ${
    record.rateType
  } ${record.rateUsed.toFixed(2)})`;
}
