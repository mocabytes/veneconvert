import { recomendarOperacion } from "../recomendacion";

describe("recomendarOperacion", () => {
  it("recomienda P2P para comprar cuando su compra es más barata que BCV", () => {
    const result = recomendarOperacion({
      bcv: 100,
      binanceBuy: 95,
      binanceSell: 101,
    });

    expect(result.compra).toEqual({
      mejor: "P2P",
      valor: 95,
      ahorro: 5,
    });
  });

  it("recomienda BCV para comprar cuando su tasa es más baja", () => {
    const result = recomendarOperacion({
      bcv: 90,
      binanceBuy: 95,
      binanceSell: 96,
    });

    expect(result.compra).toEqual({
      mejor: "BCV",
      valor: 90,
      ahorro: 5,
    });
  });

  it("recomienda P2P para vender cuando su venta paga más", () => {
    const result = recomendarOperacion({
      bcv: 100,
      binanceBuy: 95,
      binanceSell: 104,
    });

    expect(result.venta).toEqual({
      mejor: "P2P",
      valor: 104,
      ahorro: 4,
    });
  });

  it("recomienda BCV para vender cuando paga más que P2P", () => {
    const result = recomendarOperacion({
      bcv: 100,
      binanceBuy: 98,
      binanceSell: 99,
    });

    expect(result.venta).toEqual({
      mejor: "BCV",
      valor: 100,
      ahorro: 1,
    });
  });

  it("empata hacia BCV y ahorro 0 en compra", () => {
    const result = recomendarOperacion({
      bcv: 100,
      binanceBuy: 100,
      binanceSell: 101,
    });

    expect(result.compra).toEqual({
      mejor: "BCV",
      valor: 100,
      ahorro: 0,
    });
  });

  it("empata hacia BCV y ahorro 0 en venta", () => {
    const result = recomendarOperacion({
      bcv: 100,
      binanceBuy: 99,
      binanceSell: 100,
    });

    expect(result.venta).toEqual({
      mejor: "BCV",
      valor: 100,
      ahorro: 0,
    });
  });
});
