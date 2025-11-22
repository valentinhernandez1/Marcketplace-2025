import { mockServices } from "../../../core/models/Service.js";
import { v4 as uuid } from "uuid";

/* -----------------------------------------------------
   BASE DE DATOS PERSISTENTE (localStorage)
----------------------------------------------------- */

// Cargar servicios desde localStorage o usar los mocks
let servicesDB =
  JSON.parse(localStorage.getItem("servicesDB")) || [...mockServices];

// Guardar en localStorage
function saveServices() {
  localStorage.setItem("servicesDB", JSON.stringify(servicesDB));
}

function simulateDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* -----------------------------------------------------
   API DE SERVICIOS
----------------------------------------------------- */

export async function getServiciosApi() {
  await simulateDelay();
  return [...servicesDB];
}

export async function createServicioApi(servicio) {
  await simulateDelay();

  const nuevo = { ...servicio, id: uuid(), estado: "PUBLICADO" };

  servicesDB.push(nuevo);
  saveServices(); // 🔥 PERSISTE

  return nuevo;
}

export async function getServicioByIdApi(id) {
  await simulateDelay();
  return servicesDB.find((s) => s.id === id);
}

/* -----------------------------------------------------
   NUEVO: ACTUALIZAR UN SERVICIO (SELECCIONAR COTIZACIÓN)
----------------------------------------------------- */

export async function updateServicioApi(id, cambios) {
  await simulateDelay();

  servicesDB = servicesDB.map((s) =>
    s.id === id ? { ...s, ...cambios } : s
  );

  saveServices(); // 🔥 GUARDA TODO

  return servicesDB.find((s) => s.id === id);
}
