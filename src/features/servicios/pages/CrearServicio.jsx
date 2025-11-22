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

  const [insumosRequeridos, setInsumosRequeridos] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState({ nombre: "", cantidad: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const agregarInsumo = () => {
    if (!nuevoInsumo.nombre.trim() || !nuevoInsumo.cantidad.trim()) {
      setError("El nombre y la cantidad del insumo son obligatorios.");
      return;
    }
    setInsumosRequeridos([...insumosRequeridos, { ...nuevoInsumo }]);
    setNuevoInsumo({ nombre: "", cantidad: "" });
    setError("");
  };

  const eliminarInsumo = (index) => {
    setInsumosRequeridos(insumosRequeridos.filter((_, i) => i !== index));
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
        insumosRequeridos: insumosRequeridos.map((i) => ({
          nombre: i.nombre.trim(),
          cantidad: i.cantidad.trim(),
        })),
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

          {/* INSUMOS REQUERIDOS */}
          <div className="mb-4">
            <label className="fw-bold mb-2">
              Insumos requeridos (opcional)
            </label>
            <p className="text-muted small mb-3">
              Si el servicio requiere insumos específicos, agregalos acá. Los proveedores de insumos podrán crear packs basados en estos requerimientos.
            </p>

            <div className="card p-3 mb-3 bg-light">
              <div className="row g-2">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del insumo (ej: Pala)"
                    value={nuevoInsumo.nombre}
                    onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value })}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cantidad (ej: 2 unidades)"
                    value={nuevoInsumo.cantidad}
                    onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, cantidad: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={agregarInsumo}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>

            {insumosRequeridos.length > 0 && (
              <div className="mt-3">
                <strong className="small d-block mb-2">Insumos agregados:</strong>
                <div className="list-group">
                  {insumosRequeridos.map((insumo, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <strong>{insumo.nombre}</strong> — {insumo.cantidad}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarInsumo(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
