import { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import { AppContext } from "../../../context/AppContext.js";
import SupplyCard from "../components/SupplyCard.jsx";
import EmptyState from "../../../ui/components/EmptyState.jsx";

export default function MisInsumos() {
  const { state } = useContext(AppContext);
  const user = state.currentUser;

  const mis = state.supplies.filter((s) => s.vendedorId === user.id);
  const misPacks = state.supplyOffers.filter((p) => p.vendedorId === user.id);

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "1200px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">📦 Mis Insumos</h2>
            <p className="text-muted mb-0">
              Gestioná tus insumos y packs disponibles
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link
              className="btn btn-primary rounded-4"
              to="/insumos/nuevo"
            >
              + Publicar Insumo
            </Link>
            <Link
              className="btn btn-outline-primary rounded-4"
              to="/insumos/nuevo-pack"
            >
              📦 Crear Pack
            </Link>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="row mb-4 g-3">
          <div className="col-md-4">
            <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none"
            }}>
              <div className="d-flex align-items-center">
                <div className="fs-1 me-3" style={{ opacity: 0.9 }}>📦</div>
                <div>
                  <div className="fw-bold fs-3">{mis.length}</div>
                  <div className="small" style={{ opacity: 0.9 }}>Insumos publicados</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              color: "white",
              border: "none"
            }}>
              <div className="d-flex align-items-center">
                <div className="fs-1 me-3" style={{ opacity: 0.9 }}>📋</div>
                <div>
                  <div className="fw-bold fs-3">{misPacks.length}</div>
                  <div className="small" style={{ opacity: 0.9 }}>Packs creados</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none"
            }}>
              <div className="d-flex align-items-center">
                <div className="fs-1 me-3" style={{ opacity: 0.9 }}>💰</div>
                <div>
                  <div className="fw-bold fs-3">
                    ${mis.reduce((sum, s) => sum + (s.precioUnit * s.stock), 0).toLocaleString()}
                  </div>
                  <div className="small" style={{ opacity: 0.9 }}>Valor total inventario</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insumos individuales */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">Insumos individuales</h4>
          {mis.length === 0 ? (
            <EmptyState
              title="No tenés insumos publicados"
              subtitle={
                <>
                  Publicá insumos individuales para que los solicitantes puedan verlos.
                  <br />
                  <Link to="/insumos/nuevo" className="btn btn-primary mt-3 rounded-4">
                    + Publicar mi primer insumo
                  </Link>
                </>
              }
            />
          ) : (
            <div className="row">
              {mis.map((i) => (
                <div key={i.id} className="col-md-4 col-lg-3 mb-4">
                  <SupplyCard supply={i} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Packs de insumos */}
        <div>
          <h4 className="fw-bold mb-3">Packs de insumos</h4>
          {misPacks.length === 0 ? (
            <div className="card p-4 text-center border-dashed rounded-4">
              <div className="fs-1 mb-3">📋</div>
              <h5 className="fw-bold">No tenés packs creados</h5>
              <p className="text-muted">
                Creá packs personalizados para servicios específicos
              </p>
              <Link
                to="/insumos/nuevo-pack"
                className="btn btn-outline-primary rounded-4 mt-2"
              >
                + Crear mi primer pack
              </Link>
            </div>
          ) : (
            <div className="row">
              {misPacks.map((pack) => {
                const servicio = state.services.find((s) => s.id === pack.serviceId);
                return (
                  <div key={pack.id} className="col-md-6 mb-4">
                    <div className="card p-4 shadow-sm rounded-4 border-primary border-2">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="fw-bold mb-1">📦 Pack de Insumos</h5>
                          {servicio && (
                            <p className="text-muted small mb-0">
                              Para: <strong>{servicio.titulo}</strong>
                            </p>
                          )}
                        </div>
                        <span className="badge bg-primary fs-6">
                          ${pack.precioTotal}
                        </span>
                      </div>
                      <div className="mb-3">
                        <strong className="small">Insumos incluidos:</strong>
                        <ul className="mt-2 mb-0 small">
                          {pack.items.map((item, idx) => (
                            <li key={idx}>
                              {item.nombre} — {item.cantidad} unidades
                              {item.precioUnit > 0 && (
                                <span className="text-muted ms-2">
                                  (${item.precioUnit} c/u)
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
