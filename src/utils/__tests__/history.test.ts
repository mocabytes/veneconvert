import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveConversion,
  getConversionHistory,
  deleteConversion,
  clearConversionHistory,
  formatConversionRecord,
  ConversionRecord,
} from '../history';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('History Utils', () => {
  const mockConversion = {
    type: 'BS_TO_USD_BCV' as const,
    fromAmount: 1000,
    fromCurrency: 'VES',
    toAmount: 27.4,
    toCurrency: 'USD',
    rateUsed: 36.5,
    rateType: 'BCV' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveConversion', () => {
    it('debe guardar una conversión exitosamente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await saveConversion(mockConversion);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'conversion_history',
        expect.stringContaining('"fromAmount":1000')
      );
    });

    it('debe manejar errores al guardar', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(saveConversion(mockConversion)).resolves.not.toThrow();
    });

    it('debe limitar el historial a 50 items', async () => {
      const existingHistory = Array(50).fill(null).map((_, i) => ({
        ...mockConversion,
        fromAmount: 1000 + i,
        toAmount: 27.4 + i,
        id: (i + 1).toString(),
        timestamp: `2024-01-01T00:00:0${i.toString().padStart(2, '0')}.000Z`,
      }));

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingHistory));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await saveConversion(mockConversion);

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData.length).toBe(50);
    });

    it('debe omitir guardar si el último registro es idéntico y reciente', async () => {
      const recent = {
        ...mockConversion,
        id: '1',
        timestamp: new Date().toISOString(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([recent]));

      await saveConversion(mockConversion);

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getConversionHistory', () => {
    it('debe retornar historial vacío si no hay datos', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const history = await getConversionHistory();

      expect(history).toEqual([]);
    });

    it('debe retornar historial ordenado por fecha descendente', async () => {
      const mockHistory: ConversionRecord[] = [
        {
          ...mockConversion,
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
        },
        {
          ...mockConversion,
          id: '2',
          timestamp: '2024-01-02T00:00:00.000Z',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockHistory));

      const history = await getConversionHistory();

      expect(history[0].id).toBe('2');
      expect(history[1].id).toBe('1');
    });

    it('debe manejar errores al obtener historial', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const history = await getConversionHistory();

      expect(history).toEqual([]);
    });
  });

  describe('deleteConversion', () => {
    it('debe eliminar una conversión específica', async () => {
      const mockHistory: ConversionRecord[] = [
        { ...mockConversion, id: '1', timestamp: new Date().toISOString() },
        { ...mockConversion, id: '2', timestamp: new Date().toISOString() },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockHistory));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await deleteConversion('1');

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData.length).toBe(1);
      expect(savedData[0].id).toBe('2');
    });
  });

  describe('clearConversionHistory', () => {
    it('debe limpiar todo el historial', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await clearConversionHistory();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('conversion_history');
    });
  });

  describe('formatConversionRecord', () => {
    it('debe formatear un registro de conversión', () => {
      const record: ConversionRecord = {
        ...mockConversion,
        id: '1',
        timestamp: '2024-01-15T10:30:00.000Z',
      };

      const formatted = formatConversionRecord(record);

      expect(formatted).toContain('1000');
      expect(formatted).toContain('VES');
      expect(formatted).toContain('27.40');
      expect(formatted).toContain('USD');
      expect(formatted).toContain('BCV');
    });
  });
});
