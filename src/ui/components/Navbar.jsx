import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.js";

export default function Navbar() {
  const { state, dispatch } = useContext(AppContext);
  const user = state.currentUser;
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3 sticky-top">
      <div className="container">

        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: "1.8rem" }}>🛒</span>
          <span>Marketplace</span>
        </Link>

        {user && (
          <div className="ms-auto d-flex gap-2 align-items-center">

            {user.rol === "SOLICITANTE" && (
              <>
                <Link className="btn btn-outline-primary rounded-pill px-4" to="/servicios">
                  📋 Mis servicios
                </Link>
                <Link className="btn btn-primary rounded-pill px-4 shadow-sm" to="/servicios/nuevo">
                  ➕ Nuevo servicio
                </Link>
              </>
            )}

            {user.rol === "PROVEEDOR_SERVICIO" && (
              <>
                <Link className="btn btn-outline-primary rounded-pill px-4" to="/servicios/para-cotizar">
                  💰 Cotizar servicios
                </Link>
                <Link className="btn btn-outline-secondary rounded-pill px-4" to="/cotizaciones">
                  📊 Mis cotizaciones
                </Link>
              </>
            )}

            {user.rol === "PROVEEDOR_INSUMOS" && (
              <>
                <Link className="btn btn-outline-primary rounded-pill px-4" to="/insumos">
                  📦 Mis Insumos
                </Link>
                <Link className="btn btn-primary rounded-pill px-4 shadow-sm" to="/insumos/nuevo">
                  ➕ Publicar insumo
                </Link>
              </>
            )}

            <div className="vr mx-2" style={{ height: "30px", opacity: 0.3 }}></div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">👤 {user.nombre}</span>
            </div>
            <button className="btn btn-outline-danger rounded-pill px-3" onClick={logout}>
              🚪 Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
