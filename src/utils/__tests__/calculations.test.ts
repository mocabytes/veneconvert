import { analizarCompra, TasasEntrada } from '../calculations';

describe('analizarCompra', () => {
  const tasasBase: TasasEntrada = {
    bcv: 36.5,
    binanceBuy: 40.1,
    binanceSell: 39.5,
  };

  describe('cuando el usuario tiene bolívares (VES)', () => {
    it('debe recomendar pagar en bolívares cuando es más barato', () => {
      const resultado = analizarCompra(
        'VES',
        1000, // precioBs
        25,   // precioDivisa
        tasasBase,
        0.2   // comisión
      );

      expect(resultado).not.toBeNull();
      expect(resultado?.recomendacion).toBe('PAGAR_DIRECTO_BS');
      expect(resultado?.monedaAhorro).toBe('VES');
      expect(resultado?.ahorroEstimado).toBeGreaterThan(0);
    });

    it('debe recomendar cambiar a USDT cuando es más barato', () => {
      const resultado = analizarCompra(
        'VES',
        1000, // precioBs
        20,   // precioDivisa (más bajo, más conveniente cambiar a USDT)
        tasasBase,
        0.2
      );

      expect(resultado).not.toBeNull();
      expect(resultado?.recomendacion).toBe('CAMBIAR_BINANCE');
    });

    it('debe manejar valores iguales', () => {
      // Usar tasas que generen igualdad exacta
      const tasasIgualdad: TasasEntrada = {
        bcv: 36.5,
        binanceBuy: 50, // Tasa más simple para cálculo exacto
        binanceSell: 39.5,
      };
      const resultado = analizarCompra(
        'VES',
        1000,
        20, // 1000 / 50 = 20, igualdad exacta
        tasasIgualdad,
        0
      );

      expect(resultado?.recomendacion).toBe('IGUAL');
    });
  });

  describe('cuando el usuario tiene dólares (USD)', () => {
    it('debe recomendar pagar en divisas cuando es más barato', () => {
      const resultado = analizarCompra(
        'USD',
        1000, // precioBs convertido
        25,   // precioDivisa
        tasasBase,
        0.2
      );

      expect(resultado).not.toBeNull();
      expect(resultado?.monedaAhorro).toBe('USD');
    });

    it('debe recomendar vender USDT cuando es más conveniente', () => {
      const resultado = analizarCompra(
        'USD',
        1000, // precioBs más bajo para hacer conveniente vender USDT
        30,   // precioDivisa
        tasasBase,
        0.2
      );

      expect(resultado).not.toBeNull();
      expect(resultado?.recomendacion).toBe('CAMBIAR_BINANCE');
    });
  });

  describe('validación de entradas', () => {
    it('debe retornar null con precios inválidos', () => {
      const resultado = analizarCompra(
        'VES',
        0, // precioBs inválido
        25,
        tasasBase,
        0.2
      );

      expect(resultado).toBeNull();
    });

    it('debe retornar null con tasas inválidas', () => {
      const tasasInvalidas: TasasEntrada = {
        bcv: 0,
        binanceBuy: 40.1,
        binanceSell: 39.5,
      };

      const resultado = analizarCompra(
        'VES',
        1000,
        25,
        tasasInvalidas,
        0.2
      );

      expect(resultado).toBeNull();
    });

    it('debe retornar null con valores negativos', () => {
      const resultado = analizarCompra(
        'VES',
        -100,
        25,
        tasasBase,
        0.2
      );

      expect(resultado).toBeNull();
    });
  });

  describe('cálculo de ahorro', () => {
    it('debe calcular el ahorro correctamente', () => {
      const resultado = analizarCompra(
        'VES',
        1000,
        25,
        tasasBase,
        0.2
      );

      expect(resultado).not.toBeNull();
      expect(resultado?.ahorroEstimado).toBeGreaterThan(0);
      expect(resultado?.desgloseOpciones).toHaveLength(2);
      if (resultado?.desgloseOpciones) {
        expect(resultado.desgloseOpciones[0].costoEquivalente).toBeLessThan(
          resultado.desgloseOpciones[1].costoEquivalente
        );
      }
    });
  });

  describe('comisiones', () => {
    it('debe considerar la comisión de Binance', () => {
      const resultadoConComision = analizarCompra(
        'VES',
        1000,
        25,
        tasasBase,
        0.5 // 0.5% de comisión
      );

      expect(resultadoConComision).not.toBeNull();
      // La comisión debe afectar el cálculo
      expect(resultadoConComision?.desgloseOpciones).toBeDefined();
    });
  });
});
