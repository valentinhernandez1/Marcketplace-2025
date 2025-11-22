import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import { AppContext } from "../../../context/AppContext.js";
import { createInsumoApi } from "../api/insumosApi.js";
import { handleError, logError, getFriendlyErrorMessage } from "../../../core/helpers/errorHandler.js";

const CATEGORIAS = ["PINTURA", "JARDINERIA", "PLOMERIA", "ELECTRICIDAD", "CONSTRUCCION", "OTROS"];

export default function CrearInsumo() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;

  const [form, setForm] = useState({
    nombre: "",
    categoria: "PINTURA",
    precioUnit: "",
    unidad: "",
    stock: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validar = () => {
    const errores = [];

    if (!form.nombre || form.nombre.trim().length < 3) {
      errores.push("El nombre debe tener al menos 3 caracteres.");
    }

    if (!form.categoria) {
      errores.push("La categoría es obligatoria.");
    }

    if (!form.precioUnit || Number(form.precioUnit) <= 0) {
      errores.push("El precio unitario debe ser mayor a 0.");
    }

    if (!form.unidad || form.unidad.trim().length < 1) {
      errores.push("La unidad es obligatoria (ej: unidad, kg, litro, etc).");
    }

    if (!form.stock || Number(form.stock) < 0) {
      errores.push("El stock debe ser 0 o mayor.");
    }

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const errores = validar();
    if (errores.length > 0) {
      setError(errores.join("\n"));
      setLoading(false);
      return;
    }

    try {
      const nuevoInsumo = {
        vendedorId: user.id,
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        precioUnit: Number(form.precioUnit),
        unidad: form.unidad.trim(),
        stock: Number(form.stock),
      };

      const creado = await createInsumoApi(nuevoInsumo);
      dispatch({ type: "ADD_SUPPLY", payload: creado });

      alert("✅ Insumo publicado exitosamente");
      navigate("/insumos");
    } catch (error) {
      logError(error, "CrearInsumo.handleSubmit");
      const errorMessage = getFriendlyErrorMessage(error, "crear el insumo");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "700px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold mb-0">Publicar nuevo insumo</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/insumos")}
          >
            ← Volver
          </button>
        </div>

        <form className="card p-4 shadow-sm rounded-4" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger">
              <strong>⚠️ Errores:</strong>
              <pre className="mb-0 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                {error}
              </pre>
            </div>
          )}

          <div className="mb-3">
            <label className="fw-bold mb-2">
              Nombre del insumo <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              className="form-control form-control-lg"
              placeholder="Ej: Pintura blanca 4L"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-2">
              Categoría <span className="text-danger">*</span>
            </label>
            <select
              name="categoria"
              className="form-select form-select-lg"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-2">
                Precio unitario (UYU) <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  name="precioUnit"
                  className="form-control form-control-lg"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={form.precioUnit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold mb-2">
                Unidad <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="unidad"
                className="form-control form-control-lg"
                placeholder="Ej: unidad, kg, litro, balde"
                value={form.unidad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-2">
              Stock disponible <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="stock"
              className="form-control form-control-lg"
              placeholder="0"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
            />
            <small className="text-muted">Cantidad disponible en inventario</small>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-4"
              disabled={loading}
            >
              {loading ? "Publicando..." : "📦 Publicar insumo"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-4"
              onClick={() => navigate("/insumos")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

