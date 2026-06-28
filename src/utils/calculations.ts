export type Resultado = {
  recomendacion: "PAGAR_BS" | "PAGAR_DIVISA" | "IGUAL";
  ahorroUsdt: number;
  costoBsEnUsdt: number;
};

export function calcularMejorOpcion(
  precioBs: number,
  precioDivisa: number,
  tasaP2P: number,
): Resultado | null {
  // Evitamos cálculos si faltan datos o hay ceros
  if (precioBs <= 0 || precioDivisa <= 0 || tasaP2P <= 0) return null;

  // ¿Cuántos USDT te cuesta realmente si vendes en P2P para tener esos bolívares?
  const costoBsEnUsdt = precioBs / tasaP2P;

  const diferencia = Math.abs(precioDivisa - costoBsEnUsdt);
  let recomendacion: "PAGAR_BS" | "PAGAR_DIVISA" | "IGUAL" = "IGUAL";

  if (costoBsEnUsdt < precioDivisa) {
    recomendacion = "PAGAR_BS"; // Vender USDT a Bs y pagar sale más barato
  } else if (precioDivisa < costoBsEnUsdt) {
    recomendacion = "PAGAR_DIVISA"; // Pagar directo en divisa sale más barato
  }

  return {
    recomendacion,
    ahorroUsdt: Number(diferencia.toFixed(2)),
    costoBsEnUsdt: Number(costoBsEnUsdt.toFixed(2)),
  };
}
