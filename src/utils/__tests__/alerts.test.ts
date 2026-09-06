import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RateAlert,
  saveAlert,
  getAlerts,
  updateAlert,
  deleteAlert,
  getAlertCurrentRate,
  checkAlerts,
  formatAlertMessage,
} from '../alerts';

jest.mock('@react-native-async-storage/async-storage');

const baseAlert: Omit<RateAlert, 'id' | 'createdAt'> = {
  type: 'BCV',
  condition: 'ABOVE',
  threshold: 40,
  enabled: true,
};

describe('Alert Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAlertCurrentRate', () => {
    const currentRates = { bcv: 36.5, binanceBuy: 40.1, binanceSell: 39.5 };

    it('debe retornar la tasa BCV', () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        type: 'BCV',
        createdAt: '',
      };
      expect(getAlertCurrentRate(alert, currentRates)).toBe(36.5);
    });

    it('debe retornar la tasa P2P compra', () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        type: 'BINANCE_BUY',
        createdAt: '',
      };
      expect(getAlertCurrentRate(alert, currentRates)).toBe(40.1);
    });

    it('debe retornar la tasa P2P venta', () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        type: 'BINANCE_SELL',
        createdAt: '',
      };
      expect(getAlertCurrentRate(alert, currentRates)).toBe(39.5);
    });
  });

  describe('checkAlerts', () => {
    it('debe disparar alerta ABOVE cuando la tasa supera el umbral', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        condition: 'ABOVE',
        threshold: 36,
        createdAt: '',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const triggered = await checkAlerts({
        bcv: 36.5,
        binanceBuy: 40.1,
        binanceSell: 39.5,
      });

      expect(triggered).toHaveLength(1);
      expect(triggered[0].id).toBe('1');
    });

    it('debe disparar alerta BELOW cuando la tasa baja del umbral', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        condition: 'BELOW',
        threshold: 37,
        createdAt: '',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const triggered = await checkAlerts({
        bcv: 36.5,
        binanceBuy: 40.1,
        binanceSell: 39.5,
      });

      expect(triggered).toHaveLength(1);
    });

    it('NO debe disparar si la condición no se cumple', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        condition: 'ABOVE',
        threshold: 50,
        createdAt: '',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );

      const triggered = await checkAlerts({
        bcv: 36.5,
        binanceBuy: 40.1,
        binanceSell: 39.5,
      });

      expect(triggered).toHaveLength(0);
    });

    it('NO debe disparar alertas deshabilitadas', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        threshold: 36,
        enabled: false,
        createdAt: '',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );

      const triggered = await checkAlerts({
        bcv: 36.5,
        binanceBuy: 40.1,
        binanceSell: 39.5,
      });

      expect(triggered).toHaveLength(0);
    });

    it('NO debe disparar alertas ya activadas', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        threshold: 36,
        triggeredAt: '2024-03-01T00:00:00.000Z',
        createdAt: '',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );

      const triggered = await checkAlerts({
        bcv: 36.5,
        binanceBuy: 40.1,
        binanceSell: 39.5,
      });

      expect(triggered).toHaveLength(0);
    });

    it('debe marcar triggeredAt en la alerta disparada', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        threshold: 36,
        createdAt: '',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await checkAlerts({
        bcv: 36.5,
        binanceBuy: 40.1,
        binanceSell: 39.5,
      });

      const saved = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved[0].triggeredAt).toBeDefined();
    });
  });

  describe('saveAlert / getAlerts / updateAlert / deleteAlert', () => {
    it('debe guardar una alerta nueva', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await saveAlert(baseAlert);

      const saved = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBeDefined();
      expect(saved[0].createdAt).toBeDefined();
    });

    it('debe listar alertas guardadas', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        createdAt: '2024-03-01T00:00:00.000Z',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );

      const alerts = await getAlerts();

      expect(alerts).toHaveLength(1);
      expect(alerts[0].id).toBe('1');
    });

    it('debe actualizar una alerta', async () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        enabled: true,
        createdAt: '2024-03-01T00:00:00.000Z',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([alert])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await updateAlert('1', { enabled: false });

      const saved = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved[0].enabled).toBe(false);
    });

    it('debe eliminar una alerta', async () => {
      const alerts: RateAlert[] = [
        { ...baseAlert, id: '1', createdAt: '' },
        { ...baseAlert, id: '2', createdAt: '' },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(alerts)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await deleteAlert('1');

      const saved = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('2');
    });
  });

  describe('formatAlertMessage', () => {
    it('debe construir mensaje para condición ABOVE', () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        threshold: 40,
        createdAt: '',
      };

      const message = formatAlertMessage(alert, 41.5);

      expect(message).toContain('superó');
      expect(message).toContain('BCV');
      expect(message).toContain('41.50');
    });

    it('debe construir mensaje para condición BELOW', () => {
      const alert: RateAlert = {
        ...baseAlert,
        id: '1',
        type: 'BINANCE_BUY',
        condition: 'BELOW',
        threshold: 40,
        createdAt: '',
      };

      const message = formatAlertMessage(alert, 39);

      expect(message).toContain('bajó de');
      expect(message).toContain('P2P Compra');
    });
  });
});
