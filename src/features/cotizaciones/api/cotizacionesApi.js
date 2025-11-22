import { mockQuotes } from "../../../core/models/Quote.js";
import { v4 as uuid } from "uuid";

// Base de datos persistente
let quotesDB = JSON.parse(localStorage.getItem("quotesDB")) || [...mockQuotes];

// Guardar en localStorage
function saveDB() {
  localStorage.setItem("quotesDB", JSON.stringify(quotesDB));
}

function simulateDelay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

// 🔥 Obtener TODAS las cotizaciones
export async function getCotizacionesApi() {
  await simulateDelay();
  return [...quotesDB];
}

// 🔥 Obtener cotizaciones de un servicio por ID
export async function getCotizacionesByServiceApi(serviceId) {
  await simulateDelay();
  return quotesDB.filter((c) => c.serviceId === serviceId);
}

// 🔥 Crear (PERSISTIR) cotización nueva
export async function createCotizacionApi(cotizacion) {
  await simulateDelay();

  const nueva = { ...cotizacion, id: uuid() };
  quotesDB.push(nueva);

  saveDB(); // ← NECESARIO

  return nueva;
}

// 🔥 Obtener todas las cotizaciones creadas por un proveedor
export async function getCotizacionesProveedorApi(proveedorId) {
  await simulateDelay();
  return quotesDB.filter((c) => c.proveedorId === proveedorId);
}
