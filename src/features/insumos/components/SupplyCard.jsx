export default function SupplyCard({ supply }) {
  const getCategoriaColor = (categoria) => {
    const colors = {
      PINTURA: "bg-info",
      JARDINERIA: "bg-success",
      PLOMERIA: "bg-primary",
      ELECTRICIDAD: "bg-warning",
      CONSTRUCCION: "bg-secondary",
      OTROS: "bg-dark",
    };
    return colors[categoria] || "bg-secondary";
  };

  const stockBajo = supply.stock < 10;
  const sinStock = supply.stock === 0;

  return (
    <div className="card shadow-sm p-4 rounded-4 fade-in scale-hover h-100 border-0" style={{
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      border: "1px solid rgba(102, 126, 234, 0.1)"
    }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="fw-bold mb-0 flex-grow-1" style={{ color: "#2d3748", fontSize: "1.1rem" }}>
          {supply.nombre}
        </h5>
        <span className={`badge ${getCategoriaColor(supply.categoria)} text-white shadow-sm`} style={{ fontSize: "0.7rem" }}>
          {supply.categoria}
        </span>
      </div>

      <div className="mb-4 p-3 rounded-3" style={{
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
      }}>
        <div className="d-flex align-items-baseline">
          <span className="text-muted small me-1" style={{ fontSize: "0.9rem" }}>$</span>
          <span className="fw-bold" style={{ 
            fontSize: "2rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            {supply.precioUnit.toLocaleString()}
          </span>
          <span className="text-muted small ms-2">/{supply.unidad}</span>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: "#e2e8f0" }}>
        <div>
          <span className="text-muted small d-block mb-1">📦 Stock disponible</span>
          <span
            className={`fw-bold fs-5 ${
              sinStock
                ? "text-danger"
                : stockBajo
                ? "text-warning"
                : "text-success"
            }`}
          >
            {supply.stock} {supply.unidad}
          </span>
        </div>
        {sinStock && (
          <span className="badge bg-danger shadow-sm">⚠️ Sin stock</span>
        )}
        {stockBajo && !sinStock && (
          <span className="badge bg-warning text-dark shadow-sm">⚠️ Stock bajo</span>
        )}
        {!sinStock && !stockBajo && (
          <span className="badge bg-success shadow-sm">✓ Disponible</span>
        )}
      </div>
    </div>
  );
}
