export interface RateHistoryPoint {
  date: string;
  bcv: number;
  binance: number;
}

// Simulación de datos históricos - en producción esto vendría de una API real
export function generateHistoricalRates(days: number = 30): RateHistoryPoint[] {
  const data: RateHistoryPoint[] = [];
  const now = new Date();

  // Valores base aproximados para Venezuela
  let bcvRate = 36.5;
  let binanceRate = 40.1;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simular variación diaria
    bcvRate += (Math.random() - 0.5) * 0.3;
    binanceRate += (Math.random() - 0.5) * 0.4;

    // Mantener valores realistas
    bcvRate = Math.max(35, Math.min(38, bcvRate));
    binanceRate = Math.max(38, Math.min(42, binanceRate));

    data.push({
      date: date.toISOString().split("T")[0],
      bcv: parseFloat(bcvRate.toFixed(2)),
      binance: parseFloat(binanceRate.toFixed(2)),
    });
  }

  return data;
}

export function getChartData(history: RateHistoryPoint[]) {
  return {
    labels: history.map((point) => {
      const date = new Date(point.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: history.map((point) => point.bcv),
        color: (opacity = 1) => `rgba(44, 107, 189, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: history.map((point) => point.binance),
        color: (opacity = 1) => `rgba(142, 165, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
}

export function getRateStats(history: RateHistoryPoint[]) {
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
  const previousBcv = bcvValues[bcvValues.length - 2] || currentBcv;
  const bcvChange = ((currentBcv - previousBcv) / previousBcv) * 100;

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
