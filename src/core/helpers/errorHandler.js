/**
 * Maneja errores de manera consistente en toda la aplicación
 * @param {Error|string|Object} error - Error a manejar
 * @param {string} defaultMessage - Mensaje por defecto si no se puede extraer del error
 * @returns {string} - Mensaje de error formateado para mostrar al usuario
 */
export function handleError(error, defaultMessage = "Ocurrió un error. Por favor, intenta nuevamente.") {
  // Si es un string, retornarlo directamente
  if (typeof error === "string") {
    return error;
  }

  // Si es un objeto Error
  if (error instanceof Error) {
    // Si tiene un mensaje específico, usarlo
    if (error.message) {
      return error.message;
    }
    return defaultMessage;
  }

  // Si es un objeto con propiedad message
  if (error && typeof error === "object" && error.message) {
    return error.message;
  }

  // Si es un objeto con propiedad error
  if (error && typeof error === "object" && error.error) {
    return error.error;
  }

  // Fallback al mensaje por defecto
  return defaultMessage;
}

/**
 * Loggea errores para debugging (solo en desarrollo)
 * @param {Error|string|Object} error - Error a loggear
 * @param {string} context - Contexto donde ocurrió el error
 */
export function logError(error, context = "Unknown") {
  if (import.meta.env.MODE === "development") {
    console.error(`[${context}] Error:`, error);
    
    // Si es un Error, mostrar stack trace
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
  }
}

/**
 * Crea un mensaje de error amigable para el usuario
 * @param {Error|string|Object} error - Error original
 * @param {string} action - Acción que se estaba realizando (ej: "crear servicio")
 * @returns {string} - Mensaje amigable
 */
export function getFriendlyErrorMessage(error, action = "realizar esta acción") {
  const errorMessage = handleError(error);
  
  // Mensajes comunes y sus traducciones amigables
  const friendlyMessages = {
    "Network Error": "No hay conexión a internet. Verificá tu conexión.",
    "Failed to fetch": "No se pudo conectar con el servidor. Intentá nuevamente.",
    "Unauthorized": "No tenés permisos para realizar esta acción.",
    "Not Found": "El recurso que buscás no existe.",
  };

  // Buscar si hay un mensaje amigable predefinido
  for (const [key, friendly] of Object.entries(friendlyMessages)) {
    if (errorMessage.includes(key)) {
      return friendly;
    }
  }

  // Si el mensaje ya es amigable, retornarlo
  if (errorMessage.length < 100 && !errorMessage.includes("Error:")) {
    return errorMessage;
  }

  // Mensaje genérico con contexto
  return `No se pudo ${action}. ${errorMessage}`;
}

