import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import { AppContext } from "../../../context/AppContext.js";
import { calculatePackPrice } from "../../../core/logic/calculatePackPrice.js";
import { createPackApi, getInsumosProveedorApi } from "../api/insumosApi.js";
import { v4 as uuid } from "uuid";
import { handleError, logError, getFriendlyErrorMessage } from "../../../core/helpers/errorHandler.js";

export default function CrearPackInsumos() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;

  const [serviceId, setServiceId] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);

  // Filtrar servicios que requieren insumos
  const serviciosConInsumos = state.services.filter(
    (s) => s.insumosRequeridos && s.insumosRequeridos.length > 0
  );

  // Insumos del proveedor actual
  const misInsumos = state.supplies.filter((s) => s.vendedorId === user.id);

  const servicioSeleccionado = state.services.find((s) => s.id === serviceId);

  // Agregar insumo manualmente
  const agregarManual = () => {
    setItems([...items, { nombre: "", cantidad: 1, precioUnit: 0, tipo: "manual" }]);
    setError("");
    setMostrarAgregar(false);
  };

  // Agregar desde mis insumos publicados
  const agregarDesdeInsumo = (insumo) => {
    // Verificar si ya está agregado
    const yaAgregado = items.some((item) => item.insumoId === insumo.id);
    if (yaAgregado) {
      setError("Este insumo ya está en el pack.");
      return;
    }

    const nuevoItem = {
      nombre: insumo.nombre,
      cantidad: 1,
      precioUnit: insumo.precioUnit,
      unidad: insumo.unidad,
      insumoId: insumo.id,
      categoria: insumo.categoria,
      stock: insumo.stock,
      tipo: "publicado",
    };

    const nuevosItems = [...items, nuevoItem];
    setItems(nuevosItems);
    setTotal(calculatePackPrice(nuevosItems));
    setError("");
    setMostrarAgregar(false);
  };

  const eliminar = (index) => {
    const nuevosItems = items.filter((_, i) => i !== index);
    setItems(nuevosItems);
    setTotal(calculatePackPrice(nuevosItems));
  };

  const cambiar = (i, campo, valor) => {
    const copia = [...items];
    const valorNumero = campo === "cantidad" || campo === "precioUnit" 
      ? Number(valor) || 0 
      : valor;
    
    copia[i][campo] = valorNumero;
    
    // Si cambia la cantidad, verificar stock si es insumo publicado
    if (campo === "cantidad" && copia[i].tipo === "publicado" && copia[i].stock) {
      if (valorNumero > copia[i].stock) {
        setError(`⚠️ La cantidad no puede ser mayor al stock disponible (${copia[i].stock})`);
      } else {
        setError("");
      }
    }
    
    setItems(copia);
    setTotal(calculatePackPrice(copia));
  };

  const validar = () => {
    const errores = [];

    if (!serviceId) {
      errores.push("Debés seleccionar un servicio.");
    }

    if (items.length === 0) {
      errores.push("Debés agregar al menos un insumo al pack.");
    }

    items.forEach((item, index) => {
      if (!item.nombre || item.nombre.trim().length < 2) {
        errores.push(`El insumo #${index + 1} necesita un nombre válido.`);
      }
      if (!item.cantidad || item.cantidad <= 0) {
        errores.push(`El insumo #${index + 1} necesita una cantidad mayor a 0.`);
      }
      if (!item.precioUnit || item.precioUnit < 0) {
        errores.push(`El insumo #${index + 1} necesita un precio válido.`);
      }
    });

    return errores;
  };

  const enviarPack = async () => {
    setError("");
    setLoading(true);

    const errores = validar();
    if (errores.length > 0) {
      setError(errores.join("\n"));
      setLoading(false);
      return;
    }

    try {
      // Validar stock antes de crear el pack
      for (const item of items) {
        if (item.tipo === "publicado" && item.insumoId) {
          const insumo = state.supplies.find((s) => s.id === item.insumoId);
          if (insumo && item.cantidad > insumo.stock) {
            setError(
              `⚠️ No hay stock suficiente de "${item.nombre}". Stock disponible: ${insumo.stock}, solicitado: ${item.cantidad}`
            );
            setLoading(false);
            return;
          }
        }
      }

      const pack = {
        id: uuid(),
        vendedorId: user.id,
        serviceId,
        items: items.map((item) => ({
          nombre: item.nombre.trim(),
          cantidad: Number(item.cantidad),
          precioUnit: Number(item.precioUnit),
          insumoId: item.insumoId || null, // Incluir insumoId para actualizar stock
        })),
        precioTotal: total,
        createdAt: new Date().toISOString(),
      };

      const nuevo = await createPackApi(pack);
      
      // Actualizar estado global
      dispatch({ type: "ADD_SUPPLY_OFFER", payload: nuevo });
      
      // Recargar insumos para reflejar stock actualizado
      const insumosActualizados = await getInsumosProveedorApi(user.id);
      // Actualizar solo los insumos del proveedor actual, mantener los demás
      const otrosInsumos = state.supplies.filter(s => s.vendedorId !== user.id);
      dispatch({ type: "SET_SUPPLIES", payload: [...otrosInsumos, ...insumosActualizados] });

      alert("✅ Pack de insumos creado exitosamente. El stock se actualizó automáticamente.");
      navigate("/insumos");
    } catch (error) {
      logError(error, "CrearPackInsumos.enviarPack");
      const errorMessage = getFriendlyErrorMessage(error, "crear el pack de insumos");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "800px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold mb-0">📦 Crear pack de insumos</h2>
          <button
            className="btn btn-outline-secondary rounded-4"
            onClick={() => navigate("/insumos")}
          >
            ← Volver
          </button>
        </div>

        <div className="card p-4 shadow-sm rounded-4">
          {error && (
            <div className="alert alert-danger">
              <strong>⚠️ Errores:</strong>
              <pre className="mb-0 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                {error}
              </pre>
            </div>
          )}

          <div className="mb-4">
            <label className="fw-bold mb-2">
              Seleccionar servicio <span className="text-danger">*</span>
            </label>
            <select
              className="form-select form-select-lg"
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setError("");
              }}
            >
              <option value="">Seleccionar servicio...</option>
              {serviciosConInsumos.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.titulo} {s.insumosRequeridos && `(${s.insumosRequeridos.length} insumos requeridos)`}
                </option>
              ))}
            </select>
            {servicioSeleccionado && servicioSeleccionado.insumosRequeridos && (
              <div className="mt-2 p-3 bg-light rounded-3">
                <small className="fw-bold d-block mb-2">💡 Insumos requeridos por el servicio:</small>
                <ul className="mb-0 small">
                  {servicioSeleccionado.insumosRequeridos.map((req, idx) => (
                    <li key={idx}>{req.nombre} — {req.cantidad}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Insumos del pack</h5>
            <div className="btn-group">
              {misInsumos.length > 0 && (
                <button
                  className="btn btn-primary rounded-4"
                  onClick={() => setMostrarAgregar(!mostrarAgregar)}
                  type="button"
                >
                  📦 Agregar desde mis insumos
                </button>
              )}
              <button
                className="btn btn-outline-primary rounded-4"
                onClick={agregarManual}
                type="button"
              >
                + Agregar manualmente
              </button>
            </div>
          </div>

          {/* Modal/Dropdown para agregar desde insumos */}
          {mostrarAgregar && misInsumos.length > 0 && (
            <div className="card p-3 mb-4 border-primary border-2 rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Seleccionar de mis insumos publicados</h6>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setMostrarAgregar(false)}
                  type="button"
                >
                  ✕ Cerrar
                </button>
              </div>
              <div className="row g-2">
                {misInsumos.map((insumo) => {
                  const yaAgregado = items.some((item) => item.insumoId === insumo.id);
                  return (
                    <div key={insumo.id} className="col-md-6">
                      <div
                        className={`card p-3 rounded-3 border ${
                          yaAgregado ? "bg-light opacity-50" : "cursor-pointer"
                        }`}
                        onClick={() => !yaAgregado && agregarDesdeInsumo(insumo)}
                        style={{ cursor: yaAgregado ? "not-allowed" : "pointer" }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-bold">{insumo.nombre}</div>
                            <div className="small text-muted">
                              {insumo.categoria} • ${insumo.precioUnit}/{insumo.unidad}
                            </div>
                            <div className="small text-muted">
                              Stock: {insumo.stock} {insumo.unidad}
                            </div>
                          </div>
                          {yaAgregado && (
                            <span className="badge bg-success">✓ Agregado</span>
                          )}
                          {!yaAgregado && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                agregarDesdeInsumo(insumo);
                              }}
                              type="button"
                            >
                              + Agregar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sugerencias basadas en insumos requeridos */}
          {servicioSeleccionado && 
           servicioSeleccionado.insumosRequeridos && 
           servicioSeleccionado.insumosRequeridos.length > 0 && 
           items.length === 0 && (
            <div className="alert alert-info rounded-4 mb-4">
              <strong>💡 Sugerencia:</strong> El servicio requiere estos insumos. 
              Podés agregarlos desde tus insumos publicados o crear packs personalizados.
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center p-5 border border-dashed rounded-4">
              <div className="fs-1 mb-3">📦</div>
              <p className="text-muted mb-0">
                No hay insumos agregados. Hacé clic en "Agregar insumo" para comenzar.
              </p>
            </div>
          ) : (
            <div className="mb-4">
              {items.map((item, i) => (
                <div className="card p-3 mb-3 shadow-sm rounded-4 border" key={i}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary">Insumo #{i + 1}</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminar(i)}
                      type="button"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                  {item.tipo === "publicado" && (
                    <div className="alert alert-success small mb-2 py-2">
                      ✓ Insumo desde tu catálogo • Stock: {item.stock} {item.unidad}
                    </div>
                  )}
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="small fw-bold">
                        Nombre del insumo
                        {item.tipo === "publicado" && (
                          <span className="badge bg-success ms-2">Desde catálogo</span>
                        )}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Pintura blanca"
                        value={item.nombre}
                        onChange={(e) => cambiar(i, "nombre", e.target.value)}
                        disabled={item.tipo === "publicado"}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold">
                        Cantidad
                        {item.tipo === "publicado" && item.stock && (
                          <span className="text-muted small d-block">
                            (Max: {item.stock})
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="1"
                        min="1"
                        max={item.tipo === "publicado" ? item.stock : undefined}
                        value={item.cantidad}
                        onChange={(e) => cambiar(i, "cantidad", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold">Precio unitario</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          value={item.precioUnit}
                          onChange={(e) => cambiar(i, "precioUnit", e.target.value)}
                        />
                      </div>
                      {item.unidad && (
                        <small className="text-muted">/{item.unidad}</small>
                      )}
                    </div>
                  </div>
                  {item.precioUnit > 0 && item.cantidad > 0 && (
                    <div className="mt-2 text-end">
                      <small className="text-muted">
                        Subtotal: <strong>${(item.precioUnit * item.cantidad).toLocaleString()}</strong>
                      </small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {total > 0 && (
            <div className="card p-4 bg-primary text-white rounded-4 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small opacity-75">Precio total del pack</div>
                  <div className="fw-bold fs-2">${total.toLocaleString()}</div>
                </div>
                <div className="fs-1">💰</div>
              </div>
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              className="btn btn-primary btn-lg rounded-4"
              onClick={enviarPack}
              disabled={loading || items.length === 0 || !serviceId}
              type="button"
            >
              {loading ? "Creando pack..." : "✅ Crear pack de insumos"}
            </button>
            <button
              className="btn btn-outline-secondary rounded-4"
              onClick={() => navigate("/insumos")}
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
