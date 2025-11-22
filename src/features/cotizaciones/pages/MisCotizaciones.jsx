import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import { AppContext } from "../../../context/AppContext.js";
import EmptyState from "../../../ui/components/EmptyState.jsx";
import { getCotizacionesProveedorApi } from "../api/cotizacionesApi.js";

export default function MisCotizaciones() {
  const { state } = useContext(AppContext);
  const user = state.currentUser;

  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      const data = await getCotizacionesProveedorApi(user.id);
      setCotizaciones(data);
      setLoading(false);
    };
    cargar();
  }, [user.id]);

  const getServicioTitulo = (serviceId) => {
    const servicio = state.services.find((s) => s.id === serviceId);
    return servicio?.titulo || `Servicio ${serviceId}`;
  };

  const getEstadoCotizacion = (cotizacion) => {
    const servicio = state.services.find((s) => s.id === cotizacion.serviceId);
    if (servicio?.cotizacionSeleccionadaId === cotizacion.id) {
      return { texto: "✓ Seleccionada", clase: "success" };
    }
    if (servicio?.estado === "ASIGNADO") {
      return { texto: "Servicio asignado", clase: "secondary" };
    }
    return { texto: "En evaluación", clase: "primary" };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4 fade-in" style={{ maxWidth: "1000px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">📋 Mis cotizaciones</h2>
            <p className="text-muted mb-0">
              {cotizaciones.length} cotización{cotizaciones.length !== 1 ? "es" : ""} enviada{cotizaciones.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/servicios/para-cotizar"
            className="btn btn-primary rounded-4"
          >
            + Nueva cotización
          </Link>
        </div>

        {cotizaciones.length === 0 ? (
          <EmptyState
            title="No enviaste cotizaciones aún"
            subtitle={
              <>
                Cuando envíes una cotización, aparecerá acá.
                <br />
                <Link
                  to="/servicios/para-cotizar"
                  className="btn btn-primary mt-3 rounded-4"
                >
                  Ver servicios disponibles
                </Link>
              </>
            }
          />
        ) : (
          <div className="row g-4">
            {cotizaciones.map((c) => {
              const estado = getEstadoCotizacion(c);
              const servicio = state.services.find((s) => s.id === c.serviceId);

              return (
                <div key={c.id} className="col-md-6">
                  <div className="card p-4 shadow-sm rounded-4 h-100 border-0">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">
                          {getServicioTitulo(c.serviceId)}
                        </h5>
                        {servicio && (
                          <Link
                            to={`/servicios/${c.serviceId}`}
                            className="text-muted small text-decoration-none"
                          >
                            Ver servicio →
                          </Link>
                        )}
                      </div>
                      <span className={`badge bg-${estado.clase} fs-6`}>
                        {estado.texto}
                      </span>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="text-muted small">Precio cotizado</div>
                        <div className="fw-bold fs-4 text-primary">
                          ${c.precio.toLocaleString()}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small">Plazo de entrega</div>
                        <div className="fw-bold fs-5">
                          {c.plazoDias} día{c.plazoDias !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    {c.detalle && (
                      <div className="mb-3 p-3 bg-light rounded-3">
                        <div className="text-muted small mb-1">Detalle:</div>
                        <p className="mb-0 small">{c.detalle}</p>
                      </div>
                    )}

                    <div className="d-flex gap-2 small text-muted">
                      {c.ratingProveedorMock && (
                        <span>⭐ Rating: {c.ratingProveedorMock}/5</span>
                      )}
                      {c.createdAt && (
                        <span className="ms-auto">
                          {new Date(c.createdAt).toLocaleDateString("es-UY")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
