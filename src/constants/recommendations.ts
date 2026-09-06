export const RECOMENDACIONES_FINANCIERAS = [
  "Paga en bolívares por punto cuando la tasa BCV sea favorable. Cambia a USDT solo si hay descuento mayor al 8%.",
  "Verifica que la tasa del punto coincida con la BCV oficial del día.",
  "Los vueltos en bolívares deben calcularse a tasa oficial. Guarda billetes pequeños para pagos exactos.",
  "Considera comisiones y márgenes al cambiar a USDT. Mantén fondos líquidos si vas a gastar pronto.",
  "Compara precios en bolívares vs dólares en efectivo. Algunos comercios descuentan pagando en divisas.",
];

export type OnboardingTint = "accent" | "info" | "success";

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: "exchange" | "chart" | "scale";
  tint: OnboardingTint;
}

export const ONBOARDING_DATA: OnboardingSlide[] = [
  {
    id: 1,
    title: "Tu dinero, claro.",
    description:
      "Arco convierte bolívares, dólares y más monedas al instante, con las tasas que sí importan.",
    icon: "exchange",
    tint: "accent",
  },
  {
    id: 2,
    title: "Tasas en vivo, sin adivinar.",
    description: "BCV y P2P actualizadas solas, a cada rato.",
    icon: "chart",
    tint: "info",
  },
  {
    id: 3,
    title: "Paga siempre lo mínimo.",
    description:
      "Arco compara y te dice si conviene pagar en bolívares o en divisas.",
    icon: "scale",
    tint: "success",
  },
];
