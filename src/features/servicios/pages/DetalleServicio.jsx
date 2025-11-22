import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Navbar from "../../../ui/components/Navbar.jsx";
import { AppContext } from "../../../context/AppContext.js";
import EmptyState from "../../../ui/components/EmptyState.jsx";
import { getPacksByServiceApi } from "../../insumos/api/insumosApi.js";
import { getUserName } from "../../../core/helpers/getUserName.js";

export default function DetalleServicio() {
  const { id } = useParams();
  const { state } = useContext(AppContext);
  const [packsInsumos, setPacksInsumos] = useState([]);

  const servicio = state.services.find((s) => s.id === id);

  // Filtrar cotizaciones de este servicio
  const cotizaciones = state.quotes.filter((q) => q.serviceId === id);

  // Cargar packs de insumos para este servicio
  useEffect(() => {
    const cargarPacks = async () => {
      if (id) {
        const packs = await getPacksByServiceApi(id);
        setPacksInsumos(packs);
      }
    };
    cargarPacks();
  }, [id, state.supplyOffers]);

  if (!servicio) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <EmptyState
            title="Servicio no encontrado"
            subtitle="El servicio que buscás ya no existe o fue eliminado."
          />
        </div>
      </>
    );
  }

  const {
    titulo,
    descripcion,
    categoria,
    direccion,
    ciudad,
    fechaPreferida,
    estado,
    insumosRequeridos,
    cotizacionSeleccionadaId,
  } = servicio;

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in">
        <h2 className="fw-bold mb-3">{titulo}</h2>

        <div className="card p-4 shadow-sm rounded-4">
          {/* DESCRIPCIÓN */}
          <h5 className="fw-bold">Descripción</h5>
          <p className="text-muted mb-3">{descripcion}</p>

          {/* INFORMACIÓN DEL SERVICIO */}
          <h5 className="fw-bold">Información</h5>
          <ul className="mt-2">
            <li><strong>Categoría:</strong> {categoria}</li>
            <li><strong>Dirección:</strong> {direccion}</li>
            <li><strong>Ciudad:</strong> {ciudad}</li>
            <li><strong>Fecha preferida:</strong> {fechaPreferida}</li>
          </ul>

          {/* INSUMOS REQUERIDOS */}
          <h5 className="fw-bold mt-4">Insumos requeridos</h5>

          {insumosRequeridos.length === 0 ? (
            <p className="text-muted">Este servicio no requiere insumos.</p>
          ) : (
            <ul className="mt-2">
              {insumosRequeridos.map((i, idx) => (
                <li key={idx}>
                  {i.nombre} — {i.cantidad}
                </li>
              ))}
            </ul>
          )}

          {/* PACKS DE INSUMOS DISPONIBLES */}
          {insumosRequeridos.length > 0 && (
            <>
              <h5 className="fw-bold mt-4">Packs de insumos disponibles</h5>
              
              {packsInsumos.length === 0 ? (
                <p className="text-muted">
                  Aún no hay packs de insumos disponibles para este servicio.
                </p>
              ) : (
                <div className="mt-3">
                  {packsInsumos.map((pack) => (
                    <div key={pack.id} className="card p-3 mb-3 border-primary">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">
                          📦 Pack de {getUserName(pack.vendedorId, [], state.currentUser)}
                        </h6>
                        <span className="badge bg-primary fs-6">
                          ${pack.precioTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>Insumos incluidos:</strong>
                        <ul className="mt-2 mb-0">
                          {pack.items.map((item, idx) => (
                            <li key={idx}>
                              {item.nombre} — {item.cantidad} unidades
                              {item.precioUnit > 0 && (
                                <span className="text-muted ms-2">
                                  (${item.precioUnit} c/u)
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ESTADO */}
          <h5 className="fw-bold mt-4">Estado del servicio</h5>
          <span
            className={`badge ${
              estado === "PUBLICADO"
                ? "bg-primary"
                : estado === "ASIGNADO"
                ? "bg-success"
                : "bg-secondary"
            } fs-6`}
          >
            {estado}
          </span>

          {/* COTIZACIONES RECIBIDAS */}
          <h5 className="fw-bold mt-4">Cotizaciones recibidas</h5>
          
          {cotizaciones.length === 0 ? (
            <p className="text-muted">Aún no hay cotizaciones para este servicio.</p>
          ) : (
            <div className="mt-3">
              {cotizaciones.map((cotizacion) => {
                const isSelected = cotizacionSeleccionadaId === cotizacion.id;
                
                return (
                  <div
                    key={cotizacion.id}
                    className={`card p-3 mb-3 ${
                      isSelected ? "border-success border-2" : ""
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h6 className="fw-bold mb-0">
                            👷 {getUserName(cotizacion.proveedorId, [], state.currentUser)}
                          </h6>
                          {isSelected && (
                            <span className="badge bg-success">✓ Seleccionada</span>
                          )}
                          {cotizacion.ratingProveedorMock && (
                            <span className="badge bg-warning text-dark">
                              ⭐ {cotizacion.ratingProveedorMock}/5
                            </span>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong className="text-primary fs-5">
                            ${cotizacion.precio.toLocaleString()}
                          </strong>
                          <span className="text-muted ms-2">
                            • Plazo: {cotizacion.plazoDias} días
                          </span>
                        </div>
                        {cotizacion.detalle && (
                          <p className="text-muted mb-0">{cotizacion.detalle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* COTIZACIÓN SELECCIONADA */}
          {cotizacionSeleccionadaId && (
            <div className="alert alert-success mt-3">
              <strong>Cotización seleccionada ✓</strong>
              <br />
              <small>ID Cotización: {cotizacionSeleccionadaId}</small>
            </div>
          )}

          {/* BOTÓN DE COMPARAR */}
          {cotizaciones.length > 0 && !cotizacionSeleccionadaId && (
            <Link
              to={`/comparar/${id}`}
              className="btn btn-success w-100 fs-5 mt-3 rounded-4 py-2"
            >
              Comparar cotizaciones
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
