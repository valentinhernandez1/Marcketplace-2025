import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import { AppContext } from "../../../context/AppContext.js";
import { createCotizacionApi } from "../api/cotizacionesApi.js";
import { v4 as uuid } from "uuid";
import EmptyState from "../../../ui/components/EmptyState.jsx";
import { handleError, logError, getFriendlyErrorMessage } from "../../../core/helpers/errorHandler.js";

export default function CrearCotizacion() {
  const { id } = useParams(); // ID del servicio
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);

  const servicio = state.services.find((s) => s.id === id);

  const [form, setForm] = useState({
    precio: "",
    plazoDias: "",
    detalle: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar si ya cotizó este servicio
  const yaCotizado = state.quotes.some(
    (q) => q.serviceId === id && q.proveedorId === state.currentUser.id
  );

  useEffect(() => {
    if (yaCotizado) {
      setError("Ya enviaste una cotización para este servicio.");
    }
  }, [yaCotizado]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();

    // Validar que no haya cotizado ya
    if (yaCotizado) {
      setError("Ya enviaste una cotización para este servicio.");
      return;
    }

    // Validaciones
    if (!form.precio || Number(form.precio) <= 0) {
      setError("El precio debe ser mayor a 0.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const cotizacion = {
        id: uuid(),
        serviceId: id,
        proveedorId: state.currentUser.id,
        precio: Number(form.precio),
        plazoDias: Number(form.plazoDias) || 0,
        detalle: form.detalle.trim(),
        ratingProveedorMock: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date().toISOString(),
      };

      const nueva = await createCotizacionApi(cotizacion);
      dispatch({ type: "ADD_QUOTE", payload: nueva });

      alert("✅ Cotización enviada correctamente");
      navigate("/cotizaciones");
    } catch (error) {
      logError(error, "CrearCotizacion.enviar");
      const errorMessage = getFriendlyErrorMessage(error, "enviar la cotización");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Si ya cotizó, mostrar mensaje
  if (yaCotizado) {
    return (
      <>
        <Navbar />
        <div className="container mt-4" style={{ maxWidth: "700px" }}>
          <EmptyState
            title="Ya cotizaste este servicio"
            subtitle="No podés enviar más de una cotización por servicio."
          />
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/servicios/para-cotizar")}
          >
            Volver a servicios disponibles
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "700px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-1">💰 Enviar cotización</h2>
            {servicio && (
              <p className="text-muted mb-0">{servicio.titulo}</p>
            )}
          </div>
          <button
            className="btn btn-outline-secondary rounded-4"
            onClick={() => navigate("/servicios/para-cotizar")}
          >
            ← Volver
          </button>
        </div>

        <form className="card p-4 shadow-sm rounded-4" onSubmit={enviar}>
          {error && (
            <div className="alert alert-danger rounded-4">
              <strong>⚠️</strong> {error}
            </div>
          )}

          {servicio && (
            <div className="alert alert-info rounded-4 mb-4">
              <strong>📋 Servicio:</strong> {servicio.titulo}
              <br />
              <small className="text-muted">{servicio.descripcion}</small>
            </div>
          )}
          
          <div className="mb-3">
            <label className="fw-bold mb-2">
              Precio (UYU) <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                name="precio"
                className="form-control form-control-lg"
                placeholder="0"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">Plazo de entrega (días)</label>
            <input
              type="number"
              name="plazoDias"
              className="form-control form-control-lg"
              placeholder="Ej: 7"
              min="1"
              value={form.plazoDias}
              onChange={handleChange}
            />
            <small className="text-muted">Días estimados para completar el servicio</small>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-2">Detalle adicional (opcional)</label>
            <textarea
              name="detalle"
              className="form-control"
              rows="4"
              placeholder="Agregá detalles sobre cómo realizarías el trabajo, materiales, condiciones, etc."
              value={form.detalle}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Enviando...
                </>
              ) : (
                "📤 Enviar presupuesto"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-4"
              onClick={() => navigate("/servicios/para-cotizar")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
