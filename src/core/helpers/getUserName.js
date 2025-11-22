/**
 * Obtiene el nombre de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @param {Array} users - Array de usuarios (puede incluir currentUser del contexto)
 * @param {Object} currentUser - Usuario actual del contexto (opcional)
 * @returns {string} - Nombre del usuario o "Proveedor {id}" si no se encuentra
 */
export function getUserName(userId, users = [], currentUser = null) {
  // Primero verificar si es el usuario actual
  if (currentUser && currentUser.id === userId) {
    return currentUser.nombre || `Usuario ${userId}`;
  }

  // Buscar en el array de usuarios
  const user = users.find((u) => u.id === userId);
  if (user) {
    return user.nombre || `Usuario ${userId}`;
  }

  // Si no se encuentra, intentar cargar desde localStorage
  try {
    const allUsers = JSON.parse(localStorage.getItem("usersDB")) || [];
    const foundUser = allUsers.find((u) => u.id === userId);
    if (foundUser) {
      return foundUser.nombre || `Usuario ${userId}`;
    }
  } catch (error) {
    console.warn("Error al cargar usuarios desde localStorage:", error);
  }

  // Fallback: retornar ID formateado
  return `Proveedor ${userId.substring(0, 8)}...`;
}

/**
 * Obtiene información completa de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @param {Array} users - Array de usuarios
 * @param {Object} currentUser - Usuario actual del contexto
 * @returns {Object|null} - Objeto usuario o null si no se encuentra
 */
export function getUserById(userId, users = [], currentUser = null) {
  if (currentUser && currentUser.id === userId) {
    return currentUser;
  }

  const user = users.find((u) => u.id === userId);
  if (user) return user;

  try {
    const allUsers = JSON.parse(localStorage.getItem("usersDB")) || [];
    return allUsers.find((u) => u.id === userId) || null;
  } catch {
    return null;
  }
}

