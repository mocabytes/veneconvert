import {
  convertCurrency,
  getExchangeRates,
  getCurrencyByCode,
  formatCurrency,
  SUPPORTED_CURRENCIES,
  resetFXRatesCache,
} from '../multiCurrency';
import { fetchWithTimeout } from '../fetchWithTimeout';

jest.mock('../fetchWithTimeout', () => ({
  fetchWithTimeout: jest.fn(),
}));

const mockedFetchWithTimeout = fetchWithTimeout as jest.Mock;

describe('Multi-Currency Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetFXRatesCache();
  });

  describe('convertCurrency', () => {
    const rates = { VES: 1, USD: 36.5, PEN: 9.855 };

    it('debe convertir entre monedas usando tasas consistentes', () => {
      const result = convertCurrency(100, 'VES', 'USD', rates);

      expect(result).not.toBeNull();
      expect(result?.toAmount).toBeCloseTo(2.7397, 3);
    });

    it('debe retornar 1:1 si es la misma moneda', () => {
      const result = convertCurrency(100, 'USD', 'USD', rates);

      expect(result?.rateUsed).toBe(1);
      expect(result?.toAmount).toBe(100);
      expect(result?.path).toEqual(['USD']);
    });

    it('debe retornar null si falta alguna tasa', () => {
      const result = convertCurrency(100, 'VES', 'XYZ', rates);

      expect(result).toBeNull();
    });

    it('debe convertir entre monedas extranjeras (PEN a USD)', () => {
      const result = convertCurrency(100, 'PEN', 'USD', rates);

      expect(result).not.toBeNull();
      expect(result?.toAmount).toBeCloseTo(100 / 36.5 * 9.855, 3);
    });
  });

  describe('getExchangeRates', () => {
    it('debe usar tasas locales cuando el fetch falla', async () => {
      mockedFetchWithTimeout.mockRejectedValue(new Error('Network timeout'));

      const rates = await getExchangeRates('VES', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });

      expect(rates.VES).toBe(1);
      expect(rates.USD).toBe(36.5);
      expect(rates.USDT).toBe(40.1);
    });

    it('debe normalizar respecto a la moneda base', async () => {
      mockedFetchWithTimeout.mockRejectedValue(new Error('Network timeout'));

      const rates = await getExchangeRates('USD', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });

      expect(rates.USD).toBe(1);
      expect(rates.VES).toBeCloseTo(1 / 36.5, 6);
    });

    it('debe aplicar las tasas de euro/peso si la API responde', async () => {
      mockedFetchWithTimeout
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ promedio: 39.5 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ promedio: 0.0091 }),
        });

      const rates = await getExchangeRates('VES', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });

      expect(rates.EUR).toBe(39.5);
      expect(rates.COP).toBe(0.0091);
    });

    it('debe mantener valores por defecto si la API devuelve datos inválidos', async () => {
      mockedFetchWithTimeout
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ promedio: 0 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ promedio: -5 }),
        });

      const rates = await getExchangeRates('VES', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });

      expect(rates.EUR).toBe(36.5 * 1.08);
      expect(rates.COP).toBe(36.5 * 0.00025);
    });

    it('debe aplicar tasas FX en vivo para PEN/BRL/MXN/CRC/CAD/AUD', async () => {
      mockedFetchWithTimeout
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            result: 'success',
            rates: {
              USD: 1,
              PEN: 3.369025,
              BRL: 5.184431,
              MXN: 17.019231,
              CRC: 451.832071,
              CAD: 1.38728,
              AUD: 1.412299,
            },
          }),
        });

      const rates = await getExchangeRates('VES', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });

      expect(rates.CRC).toBeCloseTo(36.5 / 451.832071, 6);
      expect(rates.PEN).toBeCloseTo(36.5 / 3.369025, 6);
      expect(rates.BRL).toBeCloseTo(36.5 / 5.184431, 6);
      expect(rates.MXN).toBeCloseTo(36.5 / 17.019231, 6);
      expect(rates.CAD).toBeCloseTo(36.5 / 1.38728, 6);
      expect(rates.AUD).toBeCloseTo(36.5 / 1.412299, 6);
    });

    it('debe dar tasa USD→CRC real (≈452) y CRC→USD ≈ 1/452, no la 555.5556 hardcodeada', async () => {
      mockedFetchWithTimeout
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            result: 'success',
            rates: { USD: 1, CRC: 451.832071 },
          }),
        });

      const rates = await getExchangeRates('VES', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });
      const usdToCrc = convertCurrency(1, 'USD', 'CRC', rates);
      const crcToUsd = convertCurrency(1, 'CRC', 'USD', rates);

      expect(usdToCrc?.rateUsed).toBeCloseTo(451.832071, 0);
      expect(usdToCrc?.rateUsed).not.toBeCloseTo(555.5556, 0);
      expect(crcToUsd?.rateUsed).toBeCloseTo(1 / 451.832071, 6);
      expect(crcToUsd?.rateUsed).toBeLessThan(1);
    });

    it('debe usar fallback cuando la FX API falla', async () => {
      mockedFetchWithTimeout
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false })
        .mockRejectedValueOnce(new Error('Network timeout'));

      const rates = await getExchangeRates('VES', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });

      expect(rates.CRC).toBeCloseTo(36.5 * 0.0018, 6);
      expect(rates.PEN).toBeCloseTo(36.5 * 0.27, 6);
    });

    it('debe usar fallback cuando la FX API devuelve datos inválidos', async () => {
      mockedFetchWithTimeout
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            result: 'success',
            rates: { USD: 1, CRC: 0, PEN: -5, BRL: 'nope', MXN: NaN },
          }),
        });

      const rates = await getExchangeRates('VES', {
        bcv: 36.5,
        binanceBuy: 40.1,
      });

      expect(rates.CRC).toBeCloseTo(36.5 * 0.0018, 6);
      expect(rates.PEN).toBeCloseTo(36.5 * 0.27, 6);
      expect(rates.BRL).toBeCloseTo(36.5 * 0.2, 6);
    });

    it('debe cachear las tasas FX y no volver a consultar dentro del TTL', async () => {
      mockedFetchWithTimeout
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            result: 'success',
            rates: { USD: 1, CRC: 451.832071 },
          }),
        });

      await getExchangeRates('VES', { bcv: 36.5, binanceBuy: 40.1 });
      await getExchangeRates('VES', { bcv: 36.5, binanceBuy: 40.1 });

      const fxCalls = mockedFetchWithTimeout.mock.calls.filter((args) =>
        String(args[0]).includes('open.er-api')
      );
      expect(fxCalls).toHaveLength(1);
    });
  });

  describe('getCurrencyByCode / formatCurrency / SUPPORTED_CURRENCIES', () => {
    it('debe encontrar moneda por código', () => {
      expect(getCurrencyByCode('USD')?.symbol).toBe('$');
      expect(getCurrencyByCode('PEN')?.flagCode).toBe('pe');
    });

    it('debe formatear con símbolo', () => {
      expect(formatCurrency(12.345, 'VES')).toBe('Bs. 12.35');
      expect(formatCurrency(1, 'EUR')).toBe('€ 1.00');
    });

    it('debe soportar las monedas esperadas', () => {
      const codes = SUPPORTED_CURRENCIES.map((c) => c.code);
      expect(codes).toContain('VES');
      expect(codes).toContain('USD');
      expect(codes).toContain('EUR');
      expect(codes).toContain('COP');
      expect(codes).toContain('PEN');
      expect(codes).toContain('USDT');
    });
  });
});
