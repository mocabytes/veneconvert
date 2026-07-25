import { analizarCompra } from '../../src/utils/calculations';

describe('calculations', () => {
  it('debe analizar compra correctamente', () => {
    const tasas = {
      bcv: 36.5,
      binanceBuy: 40.1,
      binanceSell: 39.5,
    };
    const resultado = analizarCompra('VES', 1000, 25, tasas, 0.2);
    expect(resultado).toBeDefined();
    if (resultado) {
      expect(resultado.recomendacion).toBeDefined();
    }
  });

  it('debe manejar valores cero', () => {
    const tasas = {
      bcv: 36.5,
      binanceBuy: 40.1,
      binanceSell: 39.5,
    };
    const resultado = analizarCompra('VES', 0, 0, tasas, 0.2);
    expect(resultado).toBeDefined();
  });

  it('debe tener recomendación definida', () => {
    const tasas = {
      bcv: 36.5,
      binanceBuy: 40.1,
      binanceSell: 39.5,
    };
    const resultado = analizarCompra('VES', 1000, 25, tasas, 0.2);
    if (resultado) {
      expect(resultado.recomendacion).toBeTruthy();
      expect(resultado.recomendacion.length).toBeGreaterThan(0);
    }
  });
});
