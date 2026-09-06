export interface TasasOperacion {
  bcv: number;
  binanceBuy: number;
  binanceSell: number;
}

export interface Recomendacion {
  mejor: "P2P" | "BCV";
  valor: number;
  ahorro: number;
}

export interface RecomendacionResultado {
  compra: Recomendacion;
  venta: Recomendacion;
}

export function recomendarOperacion(
  tasas: TasasOperacion
): RecomendacionResultado {
  const compraP2P = tasas.binanceBuy;
  const compraBCV = tasas.bcv;
  const mejorCompra = Math.min(compraP2P, compraBCV);
  const compra = {
    mejor: compraP2P < compraBCV ? "P2P" : "BCV",
    valor: mejorCompra,
    ahorro: Math.abs(compraP2P - compraBCV),
  } as Recomendacion;

  const ventaP2P = tasas.binanceSell;
  const ventaBCV = tasas.bcv;
  const mejorVenta = Math.max(ventaP2P, ventaBCV);
  const venta = {
    mejor: ventaP2P > ventaBCV ? "P2P" : "BCV",
    valor: mejorVenta,
    ahorro: Math.abs(ventaP2P - ventaBCV),
  } as Recomendacion;

  return { compra, venta };
}
