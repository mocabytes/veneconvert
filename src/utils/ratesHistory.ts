import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RateHistoryPoint {
  date: string;
  bcv: number;
  binance: number;
}

const RATES_HISTORY_KEY = 'rates_history';
const MAX_HISTORY_DAYS = 60;

export async function saveRateHistoryPoint(point: {
  bcv: number;
  binance: number;
}): Promise<void> {
  try {
    const history = await getRateHistory();
    const date = new Date().toISOString().split('T')[0];
    const todayIndex = history.findIndex((h) => h.date === date);

    let next: RateHistoryPoint[];
    if (todayIndex >= 0) {
      next = history.slice();
      next[todayIndex] = { date, ...point };
    } else {
      next = [...history, { date, ...point }];
    }

    next = next.slice(-MAX_HISTORY_DAYS);
    await AsyncStorage.setItem(RATES_HISTORY_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Error saving rate history:', error);
  }
}

export async function getRateHistory(): Promise<RateHistoryPoint[]> {
  try {
    const data = await AsyncStorage.getItem(RATES_HISTORY_KEY);
    if (!data) {
      return [];
    }
    const parsed = JSON.parse(data) as RateHistoryPoint[];
    return parsed.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error getting rate history:', error);
    return [];
  }
}

export async function clearRateHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RATES_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing rate history:', error);
  }
}

export function findRateByDate(
  history: RateHistoryPoint[],
  isoDate: string
): RateHistoryPoint | null {
  return history.find((point) => point.date === isoDate) ?? null;
}

export function findNearestRate(
  history: RateHistoryPoint[],
  isoDate: string
): RateHistoryPoint | null {
  if (history.length === 0) {
    return null;
  }
  const target = Date.parse(`${isoDate}T00:00:00Z`);
  let best: RateHistoryPoint | null = null;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const point of history) {
    const diff = Math.abs(Date.parse(`${point.date}T00:00:00Z`) - target);
    if (
      diff < bestDiff ||
      (diff === bestDiff && best !== null && point.date < best.date)
    ) {
      best = point;
      bestDiff = diff;
    }
  }
  return best;
}

export function parseDateInput(input: string): string | null {
  const match = input.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`;
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (iso > todayIso) {
    return null;
  }
  return iso;
}

function withOpacity(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
  if (color.startsWith('rgb')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  return color;
}

export function getChartData(
  history: RateHistoryPoint[],
  colors?: { bcv: string; p2p: string }
) {
  const bcvColor = colors?.bcv ?? 'rgba(44, 107, 189, 1)';
  const p2pColor = colors?.p2p ?? 'rgba(142, 165, 255, 1)';
  return {
    labels: history.map((point, index) => {
      const step = Math.max(1, Math.ceil(history.length / 6));
      if (index % step !== 0 && index !== history.length - 1) {
        return "";
      }
      const [, month, day] = point.date.split("-");
      return `${Number(day)}/${Number(month)}`;
    }),
    datasets: [
      {
        data: history.map((point) => point.bcv),
        color: (opacity = 1) => withOpacity(bcvColor, opacity),
        strokeWidth: 2,
      },
      {
        data: history.map((point) => point.binance),
        color: (opacity = 1) => withOpacity(p2pColor, opacity),
        strokeWidth: 2,
      },
    ],
  };
}

export function getRateStats(history: RateHistoryPoint[]) {
  if (history.length === 0) {
    return {
      bcv: { current: 0, average: 0, max: 0, min: 0, change: 0 },
      binance: { current: 0, average: 0, max: 0, min: 0 },
    };
  }

  const bcvValues = history.map((h) => h.bcv);
  const binanceValues = history.map((h) => h.binance);

  const bcvAvg = bcvValues.reduce((a, b) => a + b, 0) / bcvValues.length;
  const binanceAvg =
    binanceValues.reduce((a, b) => a + b, 0) / binanceValues.length;

  const bcvMax = Math.max(...bcvValues);
  const bcvMin = Math.min(...bcvValues);
  const binanceMax = Math.max(...binanceValues);
  const binanceMin = Math.min(...binanceValues);

  const currentBcv = bcvValues[bcvValues.length - 1];
  const previousBcv = bcvValues[bcvValues.length - 2];
  const bcvChange =
    previousBcv && previousBcv > 0
      ? ((currentBcv - previousBcv) / previousBcv) * 100
      : 0;

  return {
    bcv: {
      current: currentBcv,
      average: bcvAvg,
      max: bcvMax,
      min: bcvMin,
      change: bcvChange,
    },
    binance: {
      current: binanceValues[binanceValues.length - 1],
      average: binanceAvg,
      max: binanceMax,
      min: binanceMin,
    },
  };
}
