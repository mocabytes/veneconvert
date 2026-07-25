/**
 * Utilidades para manejo de errores centralizado
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_FETCH_ERROR: 'RATE_FETCH_ERROR',
  CONVERSION_ERROR: 'CONVERSION_ERROR',
} as const;

/**
 * Maneja errores de manera consistente y los loguea
 */
export function handleError(error: unknown, context?: string): AppError {
  console.error(`[Error${context ? ` in ${context}` : ''}]:`, error);

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Determinar tipo de error basado en el mensaje
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return new AppError(
        'Error de conexión. Verifica tu internet.',
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }

    if (error.message.includes('Storage') || error.message.includes('AsyncStorage')) {
      return new AppError(
        'Error al guardar datos localmente.',
        ErrorCodes.STORAGE_ERROR,
        error
      );
    }

    return new AppError(
      error.message || 'Ocurrió un error inesperado.',
      'UNKNOWN_ERROR',
      error
    );
  }

  return new AppError(
    'Ocurrió un error inesperado.',
    'UNKNOWN_ERROR',
    error
  );
}

/**
 * Wrapper para funciones asíncronas con manejo de errores
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleError(error, context) };
  }
}

/**
 * Muestra un mensaje de error amigable al usuario
 */
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.code) {
    case ErrorCodes.NETWORK_ERROR:
      return 'No hay conexión a internet. Usando tasas cacheadas.';
    case ErrorCodes.STORAGE_ERROR:
      return 'Error al guardar datos. Intenta nuevamente.';
    case ErrorCodes.VALIDATION_ERROR:
      return 'Datos inválidos. Verifica los valores ingresados.';
    case ErrorCodes.RATE_FETCH_ERROR:
      return 'Error al obtener tasas. Usando valores anteriores.';
    case ErrorCodes.CONVERSION_ERROR:
      return 'Error en la conversión. Verifica los valores.';
    default:
      return 'Ocurrió un error. Intenta nuevamente.';
  }
}
