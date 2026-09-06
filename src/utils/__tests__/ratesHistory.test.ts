import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveRateHistoryPoint,
  getRateHistory,
  clearRateHistory,
  getChartData,
  getRateStats,
  RateHistoryPoint,
} from '../ratesHistory';

jest.mock('@react-native-async-storage/async-storage');

describe('Rate History Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRateHistoryPoint', () => {
    it('debe guardar un punto nuevo de historial', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await saveRateHistoryPoint({ bcv: 36.5, binance: 40.1 });

      const saved = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved).toHaveLength(1);
      expect(saved[0]).toMatchObject({ bcv: 36.5, binance: 40.1 });
      expect(saved[0].date).toBeDefined();
    });

    it('debe sobrescribir el punto del mismo día en vez de duplicar', async () => {
      const today = new Date().toISOString().split('T')[0];
      const existing: RateHistoryPoint[] = [
        { date: today, bcv: 36.5, binance: 40.1 },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existing)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await saveRateHistoryPoint({ bcv: 36.8, binance: 40.3 });

      const saved = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved).toHaveLength(1);
      expect(saved[0].bcv).toBe(36.8);
    });

    it('debe limitar el historial a 60 días', async () => {
      const old: RateHistoryPoint[] = Array(60)
        .fill(null)
        .map((_, i) => ({
          date: `2024-01-${String(i + 1).padStart(2, '0')}`,
          bcv: 30 + i,
          binance: 32 + i,
        }));
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(old)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await saveRateHistoryPoint({ bcv: 36.5, binance: 40.1 });

      const saved = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved.length).toBeLessThanOrEqual(60);
    });

    it('debe manejar errores al guardar sin lanzar', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      await expect(
        saveRateHistoryPoint({ bcv: 36.5, binance: 40.1 })
      ).resolves.not.toThrow();
    });
  });

  describe('getRateHistory', () => {
    it('debe retornar lista vacía si no hay datos', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const history = await getRateHistory();

      expect(history).toEqual([]);
    });

    it('debe retornar historial ordenado por fecha ascendente', async () => {
      const data: RateHistoryPoint[] = [
        { date: '2024-03-02', bcv: 35, binance: 38 },
        { date: '2024-03-01', bcv: 34, binance: 37 },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(data)
      );

      const history = await getRateHistory();

      expect(history[0].date).toBe('2024-03-01');
      expect(history[1].date).toBe('2024-03-02');
    });

    it('debe manejar errores y retornar lista vacía', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const history = await getRateHistory();

      expect(history).toEqual([]);
    });
  });

  describe('clearRateHistory', () => {
    it('debe eliminar el historial', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await clearRateHistory();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('rates_history');
    });
  });

  describe('getChartData', () => {
    it('debe construir datasets de BCV y P2P', () => {
      const history: RateHistoryPoint[] = [
        { date: '2024-03-01', bcv: 34, binance: 37 },
        { date: '2024-03-02', bcv: 35, binance: 38 },
      ];

      const chart = getChartData(history);

      expect(chart.datasets).toHaveLength(2);
      expect(chart.datasets[0].data).toEqual([34, 35]);
      expect(chart.datasets[1].data).toEqual([37, 38]);
      expect(chart.labels).toEqual(['1/3', '2/3']);
    });
  });

  describe('getRateStats', () => {
    it('debe retornar stats en cero con historial vacío', () => {
      const stats = getRateStats([]);

      expect(stats.bcv.current).toBe(0);
      expect(stats.bcv.average).toBe(0);
      expect(stats.bcv.max).toBe(0);
      expect(stats.bcv.min).toBe(0);
      expect(stats.bcv.change).toBe(0);
    });

    it('debe calcular promedio, max, min y cambio', () => {
      const history: RateHistoryPoint[] = [
        { date: '2024-03-01', bcv: 34, binance: 37 },
        { date: '2024-03-02', bcv: 36, binance: 39 },
      ];

      const stats = getRateStats(history);

      expect(stats.bcv.current).toBe(36);
      expect(stats.bcv.average).toBe(35);
      expect(stats.bcv.max).toBe(36);
      expect(stats.bcv.min).toBe(34);
      expect(stats.bcv.change).toBeCloseTo(5.88, 1);
    });

    it('debe tratar el cambio como 0 con un solo punto', () => {
      const history: RateHistoryPoint[] = [
        { date: '2024-03-01', bcv: 34, binance: 37 },
      ];

      const stats = getRateStats(history);

      expect(stats.bcv.change).toBe(0);
    });
  });
});
