import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Navbar from "../../../ui/components/Navbar.jsx";
import EmptyState from "../../../ui/components/EmptyState.jsx";
import { compararCotizacionesApi } from "../api/comparadorApi.js";
import { AppContext } from "../../../context/AppContext.js";
import { updateServicioApi } from "../../servicios/api/serviciosApi.js";
import { getUserName } from "../../../core/helpers/getUserName.js";
import { handleError, logError, getFriendlyErrorMessage } from "../../../core/helpers/errorHandler.js";

export default function Comparador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);

  const [orden, setOrden] = useState("precio");
  const [cotizaciones, setCotizaciones] = useState([]);

  // Cargar cotizaciones ordenadas
  useEffect(() => {
    const cargar = async () => {
      const data = await compararCotizacionesApi(id, orden);
      setCotizaciones(data);
    };
    cargar();
  }, [id, orden]);

  const servicio = state.services.find((s) => s.id === id);

  const seleccionar = async (quoteId) => {
    try {
      // Actualizar en el estado local
      dispatch({
        type: "SELECT_QUOTE",
        payload: { serviceId: id, quoteId },
      });

      // Persistir en localStorage
      await updateServicioApi(id, {
        estado: "ASIGNADO",
        cotizacionSeleccionadaId: quoteId,
      });

      alert("✅ Cotización seleccionada correctamente.");
      navigate(`/servicios/${id}`);
    } catch (error) {
      logError(error, "Comparador.seleccionar");
      const errorMessage = getFriendlyErrorMessage(error, "seleccionar la cotización");
      alert(`⚠️ ${errorMessage}`);
    }
  };

  if (!servicio)
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <EmptyState title="Servicio no encontrado" />
        </div>
      </>
    );

  const mejorPrecio =
    cotizaciones.length > 0
      ? Math.min(...cotizaciones.map((c) => c.precio))
      : null;

  const mejorRating =
    cotizaciones.length > 0
      ? Math.max(...cotizaciones.map((c) => c.ratingProveedorMock))
      : null;

  // Obtener nombres de proveedores usando helper
  const getProveedorNombre = (proveedorId) => {
    return getUserName(proveedorId, [], state.currentUser);
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "900px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">📊 Comparar cotizaciones</h2>
            <p className="text-muted mb-0">{servicio.titulo}</p>
          </div>
          <Link
            to={`/servicios/${id}`}
            className="btn btn-outline-secondary rounded-4"
          >
            ← Volver al servicio
          </Link>
        </div>

        <div className="card p-4 shadow-sm rounded-4">
          {/* Ordenar */}
          <div className="mb-4">
            <label className="fw-bold mb-2 d-block">Ordenar por:</label>
            <select
              className="form-select form-select-lg"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="precio">💰 Precio (menor primero)</option>
              <option value="plazo">⏱️ Plazo (menor primero)</option>
              <option value="rating">⭐ Rating del proveedor (mayor primero)</option>
            </select>
          </div>

          {/* Estadísticas */}
          {cotizaciones.length > 0 && (
            <div className="alert alert-info rounded-4 mb-4">
              <strong>📈 Resumen:</strong> {cotizaciones.length} cotización{cotizaciones.length !== 1 ? "es" : ""} recibida{cotizaciones.length !== 1 ? "s" : ""}
              {mejorPrecio && (
                <span className="ms-3">
                  • Mejor precio: <strong>${mejorPrecio.toLocaleString()}</strong>
                </span>
              )}
            </div>
          )}

          {/* Lista */}
          {cotizaciones.length === 0 ? (
            <EmptyState
              title="No hay cotizaciones aún"
              subtitle="Esperá que los proveedores respondan con sus presupuestos."
            />
          ) : (
            <div className="row g-3">
              {cotizaciones.map((c) => {
                const isMejorPrecio = c.precio === mejorPrecio;
                const isMejorRating = c.ratingProveedorMock === mejorRating;
                const isSelected = servicio.cotizacionSeleccionadaId === c.id;

                return (
                  <div key={c.id} className="col-12">
                    <div
                      className={`card p-4 shadow-sm rounded-4 border-2 ${
                        isSelected
                          ? "border-success"
                          : isMejorPrecio
                          ? "border-primary"
                          : "border-0"
                      }`}
                      style={{
                        background: isSelected 
                          ? "linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)"
                          : isMejorPrecio
                          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
                          : "white",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {/* Cabecera */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="fw-bold mb-1">
                            👷 {getProveedorNombre(c.proveedorId)}
                          </h5>
                          {c.ratingProveedorMock && (
                            <div className="small text-muted">
                              ⭐ Rating: {c.ratingProveedorMock}/5
                            </div>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="d-flex flex-wrap gap-2">
                          {isMejorPrecio && (
                            <span className="badge bg-primary fs-6">
                              💸 Mejor precio
                            </span>
                          )}

                          {isMejorRating && (
                            <span className="badge bg-warning text-dark fs-6">
                              ⭐ Mejor rating
                            </span>
                          )}

                          {isSelected && (
                            <span className="badge bg-success fs-6">
                              ✓ Seleccionada
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info principal */}
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <div className="text-muted small">Precio</div>
                          <div className="fw-bold fs-4 text-primary">
                            ${c.precio.toLocaleString()}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="text-muted small">Plazo de entrega</div>
                          <div className="fw-bold fs-5">
                            {c.plazoDias} día{c.plazoDias !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="text-muted small">Fecha de creación</div>
                          <div className="small">
                            {c.createdAt
                              ? new Date(c.createdAt).toLocaleDateString("es-UY")
                              : "N/A"}
                          </div>
                        </div>
                      </div>

                      {c.detalle && (
                        <div className="mb-3 p-3 bg-light rounded-3">
                          <div className="text-muted small mb-1">Detalle:</div>
                          <p className="mb-0">{c.detalle}</p>
                        </div>
                      )}

                      {/* Botón */}
                      {!isSelected && (
                        <button
                          className="btn btn-success w-100 rounded-4"
                          onClick={() => seleccionar(c.id)}
                        >
                          ✅ Seleccionar esta cotización
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
