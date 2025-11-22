import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import ServicioCard from "../components/ServicioCard.jsx";
import EmptyState from "../../../ui/components/EmptyState.jsx";
import { AppContext } from "../../../context/AppContext.js";
import { getServiciosApi } from "../api/serviciosApi.js";
import { filterServices } from "../../../core/logic/filterServices.js";

export default function ListaServicios() {
  const { state } = useContext(AppContext);
  const user = state.currentUser;

  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const data = await getServiciosApi();
      const misServicios = filterServices(data, { solicitanteId: user.id });
      setServicios(misServicios);
    };

    cargar();
  }, [user.id]);
  const serviciosPublicados = servicios.filter((s) => s.estado === "PUBLICADO").length;
  const serviciosAsignados = servicios.filter((s) => s.estado === "ASIGNADO").length;

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "1200px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">📋 Mis servicios</h2>
            <p className="text-muted mb-0">
              Gestioná tus servicios publicados
            </p>
          </div>
          <Link
            to="/servicios/nuevo"
            className="btn btn-primary rounded-4"
          >
            + Publicar servicio
          </Link>
        </div>

        {/* Estadísticas */}
        {servicios.length > 0 && (
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none"
              }}>
                <div className="d-flex align-items-center">
                  <div className="fs-1 me-3" style={{ opacity: 0.9 }}>📋</div>
                  <div>
                    <div className="fw-bold fs-3">{servicios.length}</div>
                    <div className="small" style={{ opacity: 0.9 }}>Total servicios</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                border: "none"
              }}>
                <div className="d-flex align-items-center">
                  <div className="fs-1 me-3" style={{ opacity: 0.9 }}>📢</div>
                  <div>
                    <div className="fw-bold fs-3">{serviciosPublicados}</div>
                    <div className="small" style={{ opacity: 0.9 }}>Publicados</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                color: "white",
                border: "none"
              }}>
                <div className="d-flex align-items-center">
                  <div className="fs-1 me-3" style={{ opacity: 0.9 }}>✅</div>
                  <div>
                    <div className="fw-bold fs-3">{serviciosAsignados}</div>
                    <div className="small" style={{ opacity: 0.9 }}>Asignados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {servicios.length === 0 ? (
          <EmptyState
            title="No tenés servicios publicados"
            subtitle={
              <>
                Publicá tu primer servicio para comenzar a recibir cotizaciones.
                <br />
                <Link
                  to="/servicios/nuevo"
                  className="btn btn-primary mt-3 rounded-4"
                >
                  + Publicar mi primer servicio
                </Link>
              </>
            }
          />
        ) : (
          <div className="row g-4">
            {servicios.map((s) => (
              <div className="col-md-6 col-lg-4" key={s.id}>
                <ServicioCard servicio={s} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

