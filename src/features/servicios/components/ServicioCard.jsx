import { Link } from "react-router-dom";

export default function ServicioCard({ servicio }) {
  const getEstadoBadge = (estado) => {
    const estados = {
      PUBLICADO: { clase: "bg-primary", texto: "📢 Publicado" },
      ASIGNADO: { clase: "bg-success", texto: "✅ Asignado" },
      EVALUACION: { clase: "bg-warning text-dark", texto: "⏳ En evaluación" },
    };
    return estados[estado] || { clase: "bg-secondary", texto: estado };
  };

  const estado = getEstadoBadge(servicio.estado);

  return (
    <div className="card shadow-sm border-0 p-4 rounded-4 fade-in scale-hover h-100" style={{
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      border: "1px solid rgba(102, 126, 234, 0.1)"
    }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="fw-bold mb-0 flex-grow-1" style={{ color: "#2d3748", fontSize: "1.2rem" }}>
          {servicio.titulo}
        </h5>
        <span className={`badge ${estado.clase} px-3 py-2 shadow-sm`} style={{ fontSize: "0.7rem" }}>
          {estado.texto}
        </span>
      </div>

      <p className="text-muted small mb-3" style={{ minHeight: "50px", lineHeight: "1.6" }}>
        {servicio.descripcion.length > 100
          ? servicio.descripcion.slice(0, 100) + "..."
          : servicio.descripcion}
      </p>

      <div className="mb-3">
        <span className="badge px-3 py-2 shadow-sm" style={{
          background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)",
          color: "#4a5568",
          fontSize: "0.7rem"
        }}>
          🏷️ {servicio.categoria}
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: "#e2e8f0" }}>
        <div className="small text-muted">
          <div className="mb-1">📍 <strong>{servicio.ciudad}</strong></div>
          {servicio.fechaPreferida && (
            <div>📅 {new Date(servicio.fechaPreferida).toLocaleDateString("es-UY")}</div>
          )}
        </div>
        <Link
          to={`/servicios/${servicio.id}`}
          className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
        >
          Ver detalles →
        </Link>
      </div>
    </div>
  );
}
