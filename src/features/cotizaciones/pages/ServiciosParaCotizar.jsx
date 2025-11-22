import { useEffect, useState, useContext } from "react";
import Navbar from "../../../ui/components/Navbar.jsx";
import EmptyState from "../../../ui/components/EmptyState.jsx";
import { AppContext } from "../../../context/AppContext.js";
import { getServiciosApi } from "../../servicios/api/serviciosApi.js";
import { Link } from "react-router-dom";

export default function ServiciosParaCotizar() {
  const { state } = useContext(AppContext);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const data = await getServiciosApi();

      // Obtener IDs de servicios que el usuario ya cotizó
      const serviciosYaCotizados = state.quotes
        .filter((q) => q.proveedorId === state.currentUser.id)
        .map((q) => q.serviceId);

      const filtrados = data.filter(
        (s) =>
          s.estado === "PUBLICADO" &&
          s.solicitanteId !== state.currentUser.id &&
          !serviciosYaCotizados.includes(s.id) // Excluir servicios ya cotizados
      );

      setServicios(filtrados);
    };

    cargar();
  }, [state.quotes, state.currentUser]);

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "1200px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">📋 Servicios disponibles para cotizar</h2>
            <p className="text-muted mb-0">
              {servicios.length} servicio{servicios.length !== 1 ? "s" : ""} disponible{servicios.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {servicios.length === 0 ? (
          <EmptyState
            title="No hay servicios disponibles"
            subtitle="Esperá a que los solicitantes publiquen nuevos servicios para cotizar."
          />
        ) : (
          <div className="row g-4">
            {servicios.map((s) => (
              <div key={s.id} className="col-md-6 col-lg-4">
                <div className="card p-4 shadow-sm rounded-4 h-100 border-0">
                  <div className="mb-3">
                    <span className="badge bg-primary mb-2">{s.categoria}</span>
                    <h4 className="fw-bold mb-2">{s.titulo}</h4>
                    <p className="text-muted small mb-0" style={{ minHeight: "60px" }}>
                      {s.descripcion.length > 120
                        ? s.descripcion.slice(0, 120) + "..."
                        : s.descripcion}
                    </p>
                  </div>

                  <div className="mb-3 small text-muted">
                    <div>📍 {s.ciudad}</div>
                    {s.fechaPreferida && (
                      <div>📅 {new Date(s.fechaPreferida).toLocaleDateString("es-UY")}</div>
                    )}
                    {s.insumosRequeridos && s.insumosRequeridos.length > 0 && (
                      <div>📦 {s.insumosRequeridos.length} insumo{s.insumosRequeridos.length !== 1 ? "s" : ""} requerido{s.insumosRequeridos.length !== 1 ? "s" : ""}</div>
                    )}
                  </div>

                  <Link
                    className="btn btn-primary w-100 rounded-4"
                    to={`/servicios/${s.id}/cotizar`}
                  >
                    💰 Enviar presupuesto
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
