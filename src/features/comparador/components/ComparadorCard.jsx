import { useState, useContext } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { v4 as uuid } from "uuid";

export default function CotizacionForm() {
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;

  const servicios = state.services.filter(
    (s) => s.estado === "PUBLICADO" || s.estado === "EVALUACION"
  );

  const [form, setForm] = useState({
    serviceId: "",
    precio: "",
    plazoDias: "",
    detalle: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const nueva = {
      id: uuid(),
      proveedorId: user.id,
      serviceId: form.serviceId,
      precio: Number(form.precio),
      plazoDias: Number(form.plazoDias),
      detalle: form.detalle,
      createdAt: new Date().toISOString(),
      ratingProveedorMock: Math.floor(Math.random() * 5) + 1,
    };

    dispatch({ type: "ADD_QUOTE", payload: nueva });

    alert("Cotización enviada con éxito.");

    setForm({
      serviceId: "",
      precio: "",
      plazoDias: "",
      detalle: "",
    });
  };

  return (
    <form className="card p-4 shadow-sm rounded-4 fade-in" onSubmit={handleSubmit}>
      <label className="fw-bold">Servicio</label>
      <select
        name="serviceId"
        className="form-control mb-3"
        value={form.serviceId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccionar</option>
        {servicios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.titulo}
          </option>
        ))}
      </select>

      <label className="fw-bold">Precio</label>
      <input
        type="number"
        name="precio"
        className="form-control mb-3"
        value={form.precio}
        onChange={handleChange}
        required
      />

      <label className="fw-bold">Plazo (días)</label>
      <input
        type="number"
        name="plazoDias"
        className="form-control mb-3"
        value={form.plazoDias}
        onChange={handleChange}
        required
      />

      <label className="fw-bold">Detalle</label>
      <textarea
        name="detalle"
        className="form-control mb-3"
        value={form.detalle}
        onChange={handleChange}
        rows={3}
      ></textarea>

      <button className="btn btn-primary w-100 rounded-4">
        Enviar cotización
      </button>
    </form>
  );
}
