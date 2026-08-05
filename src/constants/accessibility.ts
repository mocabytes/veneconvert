/**
 * Constantes y utilidades para accesibilidad
 */

export const AccessibilityLabels = {
  // Navegación
  NAVBAR: 'Barra de navegación',
  TAB_BAR: 'Barra de pestañas',

  // Pestañas principales
  TAB_HOME: 'Inicio',
  TAB_CONVERTER: 'Conversor',
  TAB_COMPARATOR: 'Comparador',
  TAB_MORE: 'Más opciones',
  // Acciones
  CLEAR: 'Limpiar campos',
  THEME_CHANGE: 'Cambiar tema',
  SWAP_CURRENCIES: 'Intercambiar monedas',
  DELETE: 'Eliminar',
  SHARE: 'Compartir',
  // Estados
  LOADING_RATES: 'Cargando tasas de cambio',
  OFFLINE_MODE: 'Modo sin conexión',
  ONLINE_MODE: 'Conexión en línea',
  // Componentes específicos
  RATE_BCV: 'Tasa BCV Oficial',
  RATE_P2P_BUY: 'Tasa P2P Compra',
  RATE_P2P_SELL: 'Tasa P2P Venta',
  // Formularios
  INPUT_BS: 'Campo de entrada para bolívares',
  INPUT_USD: 'Campo de entrada para dólares',
  INPUT_USDT: 'Campo de entrada para USDT',
  // Historial
  HISTORY_ITEM: 'Elemento de historial de conversiones',
  CLEAR_HISTORY: 'Limpiar historial completo',
  // Alertas
  ALERT_THRESHOLD: 'Umbral de alerta',
  ALERT_CONDITION: 'Condición de alerta',
  // Onboarding
  ONBOARDING_SKIP: 'Saltar tutorial',
  ONBOARDING_NEXT: 'Siguiente',
  ONBOARDING_COMPLETE: 'Comenzar',
};

export const AccessibilityHints = {
  // Navegación
  TAB_HOME: 'Ver tasas actuales y herramientas rápidas',
  TAB_CONVERTER: 'Convertir entre monedas',
  TAB_COMPARATOR: 'Comparar opciones de pago',
  TAB_MORE: 'Ver más opciones y configuración',

  // Acciones
  CLEAR: 'Borrar todos los campos de entrada',
  THEME_CHANGE: 'Cambiar entre tema claro, oscuro o sistema',
  SWAP_CURRENCIES: 'Intercambiar monedas de origen y destino',
  DELETE: 'Eliminar este elemento',
  SHARE: 'Compartir esta conversión',
  // Estados
  LOADING_RATES: 'Obteniendo las tasas más recientes',
  OFFLINE_MODE: 'Usando tasas guardadas localmente',
  ONLINE_MODE: 'Tasas actualizadas en tiempo real',
  // Componentes específicos
  RATE_BCV: 'Tasa oficial del Banco Central de Venezuela',
  RATE_P2P_BUY: 'Tasa para comprar USDT con bolívares',
  RATE_P2P_SELL: 'Tasa para vender USDT por bolívares',
  // Formularios
  INPUT_BS: 'Ingresa el monto en bolívares venezolanos',
  INPUT_USD: 'Ingresa el monto en dólares estadounidenses',
  INPUT_USDT: 'Ingresa el monto en Tether',
  // Historial
  HISTORY_ITEM: 'Ver detalles de esta conversión',
  CLEAR_HISTORY: 'Eliminar todo el historial de conversiones',
  // Alertas
  ALERT_THRESHOLD: 'Establecer el valor umbral para la alerta',
  ALERT_CONDITION: 'Elegir si alertar cuando la tasa supere o baje del umbral',
  // Onboarding
  ONBOARDING_SKIP: 'Omitir el tutorial y comenzar a usar la app',
  ONBOARDING_NEXT: 'Ir a la siguiente pantalla del tutorial',
  ONBOARDING_COMPLETE: 'Finalizar tutorial y comenzar a usar la app',
} as const;

export const AccessibilityRoles = {
  BUTTON: 'button',
  HEADER: 'header',
  TEXT: 'text',
  IMAGE: 'image',
  TAB: 'tab',
  TABBAR: 'tabbar',
  LIST: 'list',
  ALERT: 'alert',
  PROGRESSBAR: 'progressbar',
  SWITCH: 'switch',
  TEXTFIELD: 'textfield',
} as const;

/**
 * Genera un label de accesibilidad dinámico con valores
 */
export function formatAccessibilityLabel(
  baseLabel: string,
  values: Record<string, string | number>
): string {
  let label = baseLabel;
  Object.entries(values).forEach(([key, value]) => {
    label = label.replace(`{${key}}`, String(value));
  });
  return label;
}

/**
 * Genera un hint de accesibilidad dinámico con valores
 */
export function formatAccessibilityHint(
  baseHint: string,
  values: Record<string, string | number>
): string {
  let hint = baseHint;
  Object.entries(values).forEach(([key, value]) => {
    hint = hint.replace(`{${key}}`, String(value));
  });
  return hint;
}
