import { mockSupplies } from "../../../core/models/Supply.js";
import { v4 as uuid } from "uuid";

/* -----------------------------------------------------
   BASE DE DATOS PERSISTENTE (localStorage)
----------------------------------------------------- */

// Cargar insumos desde localStorage o usar los mocks
let suppliesDB =
  JSON.parse(localStorage.getItem("suppliesDB")) || [...mockSupplies];

// Cargar packs desde localStorage
let packDB = JSON.parse(localStorage.getItem("packDB")) || [];

// Guardar en localStorage
function saveSupplies() {
  localStorage.setItem("suppliesDB", JSON.stringify(suppliesDB));
}

function savePacks() {
  localStorage.setItem("packDB", JSON.stringify(packDB));
}

function simulateDelay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

/* -----------------------------------------------------
   API DE INSUMOS
----------------------------------------------------- */

// Obtener insumos del proveedor actual
export async function getInsumosProveedorApi(vendedorId) {
  await simulateDelay();
  return suppliesDB.filter((i) => i.vendedorId === vendedorId);
}

// Crear un insumo nuevo
export async function createInsumoApi(insumo) {
  await simulateDelay();

  const nuevo = { ...insumo, id: uuid() };
  suppliesDB.push(nuevo);
  saveSupplies(); // ← Persistimos

  return nuevo;
}

/* -----------------------------------------------------
   API DE PACKS DE INSUMOS
----------------------------------------------------- */

// Crear pack de insumos y actualizar stock
export async function createPackApi(pack) {
  await simulateDelay();

  // Actualizar stock de insumos publicados que se usan en el pack
  const itemsConInsumoId = pack.items.filter((item) => item.insumoId);
  
  for (const item of itemsConInsumoId) {
    const insumo = suppliesDB.find((s) => s.id === item.insumoId);
    if (insumo) {
      // Verificar que hay stock suficiente
      if (insumo.stock < item.cantidad) {
        throw new Error(
          `No hay stock suficiente de "${insumo.nombre}". Stock disponible: ${insumo.stock}, solicitado: ${item.cantidad}`
        );
      }
      
      // Reducir stock
      insumo.stock -= item.cantidad;
    }
  }

  // Guardar cambios en insumos
  saveSupplies();

  // Crear el pack
  const nuevo = { ...pack, id: uuid() };
  packDB.push(nuevo);
  savePacks(); // ← Persistimos

  return nuevo;
}

// Actualizar stock de un insumo
export async function updateInsumoStockApi(insumoId, nuevaCantidad) {
  await simulateDelay();
  
  const insumo = suppliesDB.find((s) => s.id === insumoId);
  if (!insumo) {
    throw new Error("Insumo no encontrado");
  }
  
  if (nuevaCantidad < 0) {
    throw new Error("El stock no puede ser negativo");
  }
  
  insumo.stock = nuevaCantidad;
  saveSupplies();
  
  return insumo;
}

// Obtener packs por servicio
export async function getPacksByServiceApi(serviceId) {
  await simulateDelay();
  return packDB.filter((p) => p.serviceId === serviceId);
}
 