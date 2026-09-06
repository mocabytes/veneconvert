import { analizarCompra } from "../calculations";

const TASAS = { bcv: 36.5, binanceBuy: 40.1, binanceSell: 39.5 };

describe("analizarCompra", () => {
  it("devuelve null con tasas o precios inválidos", () => {
    expect(analizarCompra("VES", 0, 0, TASAS)).toBeNull();
    expect(analizarCompra("USD", -1, 100, TASAS)).toBeNull();
    expect(analizarCompra("VES", 100, 50, { ...TASAS, bcv: 0 })).toBeNull();
  });

  it("no produce Infinity con comisión de 100%", () => {
    const result = analizarCompra("USD", 1000, 25, TASAS, 100);
    expect(result).not.toBeNull();
    const costos = result!.desgloseOpciones.map((o) => o.costoEquivalente);
    expect(costos.every((c) => isFinite(c) && c > 0)).toBe(true);
    expect(isFinite(result!.ahorroEstimado)).toBe(true);
  });

  it("no produce costos negativos con comisión mayor a 100%", () => {
    const result = analizarCompra("USD", 1000, 25, TASAS, 150);
    expect(result).not.toBeNull();
    const costos = result!.desgloseOpciones.map((o) => o.costoEquivalente);
    expect(costos.every((c) => c > 0)).toBe(true);
  });

  it("devuelve IGUAL cuando ambas opciones cuestan lo mismo", () => {
    const result = analizarCompra("VES", 401, 10, TASAS, 0);
    expect(result!.recomendacion).toBe("IGUAL");
  });
});
