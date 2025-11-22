// --------------------------------------------------------
//  MODELO DE SERVICIOS (CON Mocks)
// --------------------------------------------------------

export const mockServices = [
  {
    id: "s1",
    titulo: "Limpieza de jardín",
    descripcion: "Cortar pasto, podar y ordenar plantas del fondo.",
    categoria: "JARDINERIA",
    direccion: "Av. Siempre Viva 742",
    ciudad: "Montevideo",
    fechaPreferida: "2025-11-15",
    solicitanteId: "u1",
    estado: "PUBLICADO",
    cotizacionSeleccionadaId: null,
    insumosRequeridos: [
      { nombre: "Pala", cantidad: "2 unidades" },
      { nombre: "Tierra abonada", cantidad: "10 kg" }
    ]
  }
];

// --------------------------------------------------------
//  FUNCIONES DE UTILIDAD (Opcional)
// --------------------------------------------------------

export function createService({ titulo, descripcion, categoria, direccion, ciudad, fechaPreferida, solicitanteId, insumosRequeridos = [] }) {
  return {
    id: crypto.randomUUID(),
    titulo,
    descripcion,
    categoria,
    direccion,
    ciudad,
    fechaPreferida,
    solicitanteId,
    estado: "PUBLICADO",
    cotizacionSeleccionadaId: null,
    insumosRequeridos,
    createdAt: new Date().toISOString()
  };
}
