// --------------------------------------------------------
//  MODELO DE COTIZACIONES (CON Mocks)
// --------------------------------------------------------

export const mockQuotes = [
  {
    id: "q1",
    serviceId: "s1",
    proveedorId: "p1",
    precio: 1500,
    plazoDias: 3,
    detalle: "Trabajo rápido",
    ratingProveedorMock: 4
  }
];

// --------------------------------------------------------
//  FUNCIONES DE UTILIDAD (Opcional)
// --------------------------------------------------------

export function createQuote({ serviceId, proveedorId, precio, plazoDias, detalle }) {
  return {
    id: crypto.randomUUID(),
    serviceId,
    proveedorId,
    precio,
    plazoDias,
    detalle,
    ratingProveedorMock: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date().toISOString()
  };
}
