import { AccessibilityInfo, Platform } from "react-native";

export function announceForAccessibility(message: string) {
  if (Platform.OS === "web") {
    return;
  }
  AccessibilityInfo.announceForAccessibility(message);
}

export function isScreenReaderEnabled(): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(false);
  }
  return AccessibilityInfo.isScreenReaderEnabled();
}

export function getAccessibilityLabel(
  type: string,
  value?: string | number,
  additional?: string
): string {
  let label = "";

  switch (type) {
    case "button":
      label = "Botón";
      break;
    case "input":
      label = "Campo de texto";
      break;
    case "tab":
      label = "Pestaña";
      break;
    case "card":
      label = "Tarjeta";
      break;
    case "rate":
      label = "Tasa de cambio";
      break;
    case "conversion":
      label = "Conversión";
      break;
    default:
      label = type;
  }

  if (value !== undefined) {
    label += `: ${value}`;
  }

  if (additional) {
    label += `. ${additional}`;
  }

  return label;
}

export function getAccessibilityHint(action: string): string {
  const hints: Record<string, string> = {
    convert: "Toca para realizar la conversión",
    delete: "Toca para eliminar este elemento",
    share: "Toca para compartir esta conversión",
    swap: "Toca para intercambiar las monedas",
    select: "Toca para seleccionar esta opción",
    navigate: "Toca para navegar a esta sección",
    clear: "Toca para limpiar todos los campos",
    close: "Toca para cerrar",
    save: "Toca para guardar",
    edit: "Toca para editar",
  };

  return hints[action] || "Toca para interactuar";
}
