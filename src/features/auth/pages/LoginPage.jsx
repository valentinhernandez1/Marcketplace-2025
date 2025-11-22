import { useState, useContext } from "react";
import { AppContext } from "../../../context/AppContext.js";
import { loginApi } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!email || !email.includes("@")) {
      setError("Por favor ingresá un email válido.");
      return;
    }

    if (!password || password.length < 3) {
      setError("La contraseña debe tener al menos 3 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const user = await loginApi(email.trim(), password);

      // Guardar en global state
      dispatch({ type: "LOGIN", payload: user });

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirección según rol
      if (user.rol === "SOLICITANTE") navigate("/servicios");
      else if (user.rol === "PROVEEDOR_SERVICIO") navigate("/servicios/para-cotizar");
      else if (user.rol === "PROVEEDOR_INSUMOS") navigate("/insumos");
      else navigate("/servicios");

    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Verificá tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "480px" }}>
        <div className="text-center mb-5 fade-in">
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
          <h1 className="fw-bold mb-2" style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Marketplace</h1>
          <p className="text-muted fs-5">Iniciá sesión para continuar</p>
        </div>

        <div className="card p-5 shadow-custom-lg rounded-4 border-0 glass-card fade-in">
          {error && (
            <div className="alert alert-danger rounded-4">
              <strong>⚠️</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold mb-2">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={loading}
                required
              />
            </div>

            <div className="mb-4">
              <label className="fw-bold mb-2">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                required
              />
            </div>

            <button
              className="btn btn-primary btn-lg w-100 rounded-4"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Iniciando sesión...
                </>
              ) : (
                "🔐 Iniciar sesión"
              )}
            </button>
          </form>

          <div className="mt-4 p-4 rounded-4" style={{ 
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            border: "1px solid rgba(102, 126, 234, 0.2)"
          }}>
            <small className="fw-bold d-block mb-3" style={{ color: "#667eea" }}>
              👥 Usuarios de prueba:
            </small>
            <div className="small text-muted">
              <div className="mb-2">👤 <strong>Solicitante:</strong> solicitante@mail.com / 123</div>
              <div className="mb-2">🔧 <strong>Proveedor Servicio:</strong> servicio@mail.com / 123</div>
              <div>📦 <strong>Proveedor Insumos:</strong> insumos@mail.com / 123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
