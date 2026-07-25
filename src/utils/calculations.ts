export type MonedaUsuario = "VES" | "USD";

export type RecomendacionOp =
  | "PAGAR_DIRECTO_BS"
  | "PAGAR_DIRECTO_USD"
  | "CAMBIAR_BINANCE"
  | "IGUAL";

export type TasasEntrada = {
  bcv: number;
  binanceBuy: number; // Tasa para COMPRAR USDT con Bolívares
  binanceSell: number; // Tasa para VENDER USDT y recibir Bolívares
};

export type ResultadoAnalisis = {
  recomendacion: RecomendacionOp;
  mensaje: string;
  ahorroEstimado: number; // Expresado en la moneda que TIENE el usuario
  monedaAhorro: MonedaUsuario;
  desgloseOpciones: {
    nombre: string;
    costoEquivalente: number; // Cuánto le cuesta en la moneda que tiene
  }[];
};

/**
 * Analiza la mejor opción de compra considerando qué moneda posee el usuario,
 * los precios en ambas modalidades y las tasas del mercado actual incluyendo comisiones.
 *
 * @param usuarioTiene 'VES' si tiene bolívares, 'USD' si tiene dólares en mano o cuenta digital.
 * @param precioBs El precio final calculado en Bolívares (ya sea directo o convertido de $ BCV).
 * @param precioDivisa El precio si se cancela directamente en divisas (efectivo, Binance USDT, etc).
 * @param tasas Objeto con las tasas vigentes de BCV y Binance.
 * @param comisionBinancePct Porcentaje de comisión estimado para Binance (ej. 0.2 para 0.2%). Por defecto 0.
 */
export function analizarCompra(
  usuarioTiene: MonedaUsuario,
  precioBs: number,
  precioDivisa: number,
  tasas: TasasEntrada,
  comisionBinancePct: number = 0
): ResultadoAnalisis | null {
  // Validación de seguridad para evitar divisiones por cero o cálculos inválidos
  if (
    precioBs <= 0 ||
    precioDivisa <= 0 ||
    tasas.bcv <= 0 ||
    tasas.binanceBuy <= 0 ||
    tasas.binanceSell <= 0
  ) {
    return null;
  }

  const factorBinance = 1 + comisionBinancePct / 100;

  // ==========================================
  // CASO 1: EL USUARIO TIENE BOLÍVARES (VES)
  // ==========================================
  if (usuarioTiene === "VES") {
    const costoDirectoBs = precioBs;
    const costoViaBinance = precioDivisa * tasas.binanceBuy * factorBinance;

    const opciones = [
      {
        id: "PAGAR_DIRECTO_BS" as RecomendacionOp,
        nombre: "Pagar en Bolívares (Punto/Efectivo)",
        costo: costoDirectoBs,
      },
      {
        id: "CAMBIAR_BINANCE" as RecomendacionOp,
        nombre: "Comprar USDT en Binance para pagar",
        costo: costoViaBinance,
      },
    ];

    opciones.sort((a, b) => a.costo - b.costo);

    const mejor = opciones[0];
    const peor = opciones[opciones.length - 1];
    const ahorro = peor.costo - mejor.costo;

    let mensaje = "";
    if (mejor.id === "PAGAR_DIRECTO_BS") {
      mensaje = "Te conviene pagar directamente en Bolívares.";
    } else {
      mensaje =
        "Es mejor cambiar tus Bolívares a USDT en Binance y pagar en Divisas.";
    }

    return {
      recomendacion: ahorro === 0 ? "IGUAL" : mejor.id,
      mensaje,
      ahorroEstimado: Number(ahorro.toFixed(2)),
      monedaAhorro: "VES",
      desgloseOpciones: opciones.map((o) => ({
        nombre: o.nombre,
        costoEquivalente: Number(o.costo.toFixed(2)),
      })),
    };
  }

  // ==========================================
  // CASO 2: EL USUARIO TIENE DÓLARES (USD)
  // ==========================================
  else {
    const costoDirectoUSD = precioDivisa;
    const costoViaBinance =
      precioBs / (tasas.binanceSell * (1 - comisionBinancePct / 100));

    const opciones = [
      {
        id: "PAGAR_DIRECTO_USD" as RecomendacionOp,
        nombre: "Pagar directo en Divisas",
        costo: costoDirectoUSD,
      },
      {
        id: "CAMBIAR_BINANCE" as RecomendacionOp,
        nombre: "Vender USDT en Binance a Bs para pagar",
        costo: costoViaBinance,
      },
    ];

    opciones.sort((a, b) => a.costo - b.costo);

    const mejor = opciones[0];
    const peor = opciones[opciones.length - 1];
    const ahorro = peor.costo - mejor.costo;

    let mensaje = "";
    if (mejor.id === "PAGAR_DIRECTO_USD") {
      mensaje = "Te conviene pagar directamente con tus Divisas/Efectivo.";
    } else {
      mensaje =
        "Te rinde más vender tus USDT en Binance P2P a Bolívares y pagar en Bs.";
    }

    return {
      recomendacion: ahorro === 0 ? "IGUAL" : mejor.id,
      mensaje,
      ahorroEstimado: Number(ahorro.toFixed(2)),
      monedaAhorro: "USD",
      desgloseOpciones: opciones.map((o) => ({
        nombre: o.nombre,
        costoEquivalente: Number(o.costo.toFixed(2)),
      })),
    };
  }
}
