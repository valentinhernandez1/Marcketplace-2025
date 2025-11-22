import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import { AppContext } from "../../../context/AppContext.js";
import { createServicioApi } from "../api/serviciosApi.js";
import { validateService } from "../../../core/logic/validateService.js";
import { handleError, logError, getFriendlyErrorMessage } from "../../../core/helpers/errorHandler.js";

const CATEGORIAS = [
  "JARDINERIA",
  "PINTURA",
  "PLOMERIA",
  "ELECTRICIDAD",
  "CONSTRUCCION",
  "LIMPIEZA",
  "OTROS",
];

export default function CrearServicio() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "JARDINERIA",
    direccion: "",
    ciudad: "",
    fechaPreferida: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const errores = validateService(form);
    if (errores.length > 0) {
      setError(errores.join("\n"));
      setLoading(false);
      return;
    }

    try {
      const data = {
        ...form,
        solicitanteId: state.currentUser.id,
        estado: "PUBLICADO",
        cotizacionSeleccionadaId: null,
        insumosRequeridos: [],
      };

      // Llamada API
      const nuevo = await createServicioApi(data);

      // Reducer
      dispatch({ type: "ADD_SERVICE", payload: nuevo });

      alert("✅ Servicio publicado exitosamente");
      navigate("/servicios");
    } catch (error) {
      logError(error, "CrearServicio.handleSubmit");
      const errorMessage = getFriendlyErrorMessage(error, "crear el servicio");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fecha mínima: hoy
  const fechaMinima = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "700px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold mb-0">📋 Publicar nuevo servicio</h2>
          <button
            className="btn btn-outline-secondary rounded-4"
            onClick={() => navigate("/servicios")}
          >
            ← Volver
          </button>
        </div>

        <form className="card p-4 shadow-sm rounded-4" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger rounded-4">
              <strong>⚠️ Errores:</strong>
              <pre className="mb-0 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                {error}
              </pre>
            </div>
          )}

          <div className="mb-3">
            <label className="fw-bold mb-2">
              Título del servicio <span className="text-danger">*</span>
            </label>
            <input
              className="form-control form-control-lg"
              name="titulo"
              placeholder="Ej: Limpieza de jardín"
              onChange={handleChange}
              value={form.titulo}
              required
            />
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">
              Categoría <span className="text-danger">*</span>
            </label>
            <select
              className="form-select form-select-lg"
              name="categoria"
              onChange={handleChange}
              value={form.categoria}
              required
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              name="descripcion"
              rows="4"
              placeholder="Describí el servicio que necesitás..."
              onChange={handleChange}
              value={form.descripcion}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-2">
                Dirección <span className="text-danger">*</span>
              </label>
              <input
                className="form-control form-control-lg"
                name="direccion"
                placeholder="Ej: Av. Siempre Viva 742"
                onChange={handleChange}
                value={form.direccion}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-2">
                Ciudad <span className="text-danger">*</span>
              </label>
              <input
                className="form-control form-control-lg"
                name="ciudad"
                placeholder="Ej: Montevideo"
                onChange={handleChange}
                value={form.ciudad}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-2">
              Fecha preferida <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control form-control-lg"
              name="fechaPreferida"
              min={fechaMinima}
              onChange={handleChange}
              value={form.fechaPreferida}
              required
            />
            <small className="text-muted">Seleccioná la fecha en que preferís que se realice el servicio</small>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-4"
              disabled={loading}
            >
              {loading ? "Publicando..." : "📢 Publicar servicio"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-4"
              onClick={() => navigate("/servicios")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
