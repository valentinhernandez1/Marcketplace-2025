# PROMPT PARA CHATGPT - EXPLICACIÓN COMPLETA DEL PROYECTO

Copia y pega este prompt completo en ChatGPT para que te explique todo el código:

---

## PROMPT:

Soy estudiante y necesito que me expliques paso a paso, de manera didáctica y completa, todo el código de mi proyecto React. Quiero entender:

1. **Cada archivo y su propósito**
2. **Por qué elegimos esa estructura de carpetas**
3. **Qué es cada concepto (hooks, context, routes, etc.)**
4. **Cómo funciona cada parte del código**
5. **Para qué sirve cada dependencia en package.json**
6. **Qué es layout, core, features, ui, etc.**
7. **Cómo se relacionan todos los componentes entre sí**

Mi proyecto es un **Marketplace de Servicios con Insumos** desarrollado en React con Vite. 

**IMPORTANTE: Analizá el código que te proporciono abajo y explicame cada parte en detalle.**

---

## 📦 CONFIGURACIÓN DEL PROYECTO

### package.json
```json
{
  "name": "web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "bootstrap": "^5.3.8",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.6",
    "uuid": "^13.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "@vitejs/plugin-react": "^5.1.0",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "vite": "^7.2.2"
  }
}
```

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### eslint.config.js
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>web</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 🚀 PUNTO DE ENTRADA

### src/main.jsx
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AppProvider from "./context/AppProvider.jsx";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>        
      <AppProvider>       
        <App />             
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### src/App.jsx
```javascript
import { useEffect, useContext } from "react";
import { AppContext } from "./context/AppContext.js";
import RouterApp from "./routes/RouterApp.jsx";

import { getProfileApi } from "./features/auth/api/authApi.js";
import { getServiciosApi } from "./features/servicios/api/serviciosApi.js";
import { getCotizacionesApi } from "./features/cotizaciones/api/cotizacionesApi.js";

function AppWithAuth() {
  const { state, dispatch } = useContext(AppContext);

  // 1) Restaurar usuario desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) dispatch({ type: "LOGIN", payload: JSON.parse(saved) });
  }, []);

  // 2) Cargar SIEMPRE servicios y cotizaciones cuando cambia el usuario
  useEffect(() => {
    if (!state.currentUser) return;

    const cargarTodo = async () => {
      const servicios = await getServiciosApi();
      const cotizaciones = await getCotizacionesApi();
      const supplies = JSON.parse(localStorage.getItem("suppliesDB")) || [];
      const packs = JSON.parse(localStorage.getItem("packDB")) || [];

      dispatch({ type: "SET_SERVICES", payload: servicios });
      dispatch({ type: "SET_QUOTES", payload: cotizaciones });
      dispatch({ type: "SET_SUPPLIES", payload: supplies });
      dispatch({ type: "SET_SUPPLY_OFFERS", payload: packs });
    };

    cargarTodo();
  }, [state.currentUser?.id]);

  // 3) Cargar perfil desde token 
  useEffect(() => {
    const token = state?.currentUser?.token;
    if (!token) return;

    const cargarPerfil = async () => {
      const profile = await getProfileApi(token);
      dispatch({ type: "LOGIN", payload: profile });
    };

    cargarPerfil();
  }, [state.currentUser?.token]);

  return <RouterApp />;
}

export default function App() {
  return <AppWithAuth />;
}
```

---

## 🎯 CONTEXT API

### src/context/AppContext.js
```javascript
import { createContext } from "react";

export const AppContext = createContext(null);
```

### src/context/initialState.js
```javascript
export const initialState = {
  currentUser: null,
  services: [],
  quotes: [],
  supplies: [], 
  supplyOffers: [],
};
```

### src/context/AppProvider.jsx
```javascript
import { useReducer } from "react";
import { AppContext } from "./AppContext.js";
import { initialState } from "./initialState.js";
import { appReducer } from "./AppReducer.js";

export default function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
```

### src/context/AppReducer.js
```javascript
export function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };

    case "LOGOUT":
      localStorage.removeItem("user");
      return { ...state, currentUser: null };

    case "ADD_SERVICE":
      return { ...state, services: [...state.services, action.payload] };

    case "SELECT_QUOTE":
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.serviceId
            ? {
                ...s,
                estado: "ASIGNADO",
                cotizacionSeleccionadaId: action.payload.quoteId,
              }
            : s
        ),
      };

    case "ADD_QUOTE":
      return { ...state, quotes: [...state.quotes, action.payload] };

    case "ADD_SUPPLY_OFFER":
      return {
        ...state,
        supplyOffers: [...state.supplyOffers, action.payload],
      };
    case "SET_SERVICES":
      return { ...state, services: action.payload };

    case "SET_QUOTES":
      return { ...state, quotes: action.payload };
    
    case "SET_SUPPLIES":
      return { ...state, supplies: action.payload };
    case "ADD_SUPPLY":
      return { ...state, supplies: [...state.supplies, action.payload] };
    case "SET_SUPPLY_OFFERS":
      return { ...state, supplyOffers: action.payload };

    default:
      return state;
  }
}
```

---

## 🛣️ ROUTING

### src/routes/RouterApp.jsx
```javascript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import ListaServicios from "../features/servicios/pages/ListaServicios.jsx";
import CrearServicio from "../features/servicios/pages/CrearServicio.jsx";
import DetalleServicio from "../features/servicios/pages/DetalleServicio.jsx";
import MisCotizaciones from "../features/cotizaciones/pages/MisCotizaciones.jsx";
import MisInsumos from "../features/insumos/pages/MisInsumos.jsx";
import CrearPackInsumos from "../features/insumos/pages/CrearPackInsumos.jsx";
import CrearInsumo from "../features/insumos/pages/CrearInsumo.jsx";
import ServiciosParaCotizar from "../features/cotizaciones/pages/ServiciosParaCotizar.jsx";
import CrearCotizacion from "../features/cotizaciones/pages/CrearCotizacion.jsx";
import Comparador from "../features/comparador/pages/Comparador.jsx";

export default function RouterApp() {
  return (
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Solicitante */}
        <Route element={<ProtectedRoute allowedRoles={["SOLICITANTE"]} />}>
          <Route path="/servicios" element={<ListaServicios />} />
          <Route path="/servicios/nuevo" element={<CrearServicio />} />
          <Route path="/servicios/:id" element={<DetalleServicio />} />
          <Route path="/comparar/:id" element={<Comparador />} />
        </Route>

        {/* Proveedor servicio */}
        <Route element={<ProtectedRoute allowedRoles={["PROVEEDOR_SERVICIO"]} />}>
          <Route path="/cotizaciones" element={<MisCotizaciones />} />
        </Route>

        {/* Proveedor insumos */}
        <Route element={<ProtectedRoute allowedRoles={["PROVEEDOR_INSUMOS"]} />}>
          <Route path="/insumos" element={<MisInsumos />} />
          <Route path="/insumos/nuevo" element={<CrearInsumo />} />
          <Route path="/insumos/nuevo-pack" element={<CrearPackInsumos />} />
        </Route>
        {/* Proveedor servicio */}
        <Route element={<ProtectedRoute allowedRoles={["PROVEEDOR_SERVICIO"]} />}>
          <Route path="/servicios/para-cotizar" element={<ServiciosParaCotizar />} />
          <Route path="/servicios/:id/cotizar" element={<CrearCotizacion />} />
          <Route path="/cotizaciones" element={<MisCotizaciones />} />
        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
  );
}
```

### src/routes/ProtectedRoute.jsx
```javascript
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { state } = useContext(AppContext);
  const user = state.currentUser;

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.rol)) return <Navigate to="/login" />;

  return <Outlet />;
}
```

---

## 🎨 UI COMPONENTS

### src/ui/layout/DashboardLayout.jsx
```javascript
import Navbar from "../components/Navbar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="container mt-4 fade-in">{children}</div>
    </>
  );
}
```

### src/ui/layout/AuthLayout.jsx
```javascript
export default function AuthLayout({ children }) {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div style={{ width: "400px" }} className="fade-in">
        {children}
      </div>
    </div>
  );
}
```

### src/ui/components/Navbar.jsx
```javascript
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
```

### src/ui/components/EmptyState.jsx
```javascript
export default function EmptyState({ title, subtitle }) {
  return (
    <div className="empty-state fade-in">
      <div className="mb-4" style={{ fontSize: "5rem", opacity: 0.6 }}>
        📭
      </div>
      <h4 className="fw-bold mb-3" style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        {title}
      </h4>
      {subtitle && (
        <p className="text-muted fs-5" style={{ maxWidth: "500px", margin: "0 auto" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

---

## 🔐 AUTHENTICATION

### src/features/auth/pages/LoginPage.jsx
```javascript
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
```

### src/features/auth/api/authApi.js
```javascript
import { mockUsers } from "../../../core/models/User.js";

function simulateDelay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginApi(email, password) {
  await simulateDelay();

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  return {
    ...user,
    token: "fake-jwt-token-" + user.id,
  };
}

export async function getProfileApi(token) {
  await simulateDelay();

  const id = token?.replace("fake-jwt-token-", "");
  return mockUsers.find((u) => u.id === id) || null;
}
```

---

## 📋 SERVICIOS

### src/features/servicios/pages/ListaServicios.jsx
```javascript
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../ui/components/Navbar.jsx";
import ServicioCard from "../components/ServicioCard.jsx";
import EmptyState from "../../../ui/components/EmptyState.jsx";
import { AppContext } from "../../../context/AppContext.js";
import { getServiciosApi } from "../api/serviciosApi.js";
import { filterServices } from "../../../core/logic/filterServices.js";

export default function ListaServicios() {
  const { state } = useContext(AppContext);
  const user = state.currentUser;

  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const data = await getServiciosApi();
      const misServicios = filterServices(data, { solicitanteId: user.id });
      setServicios(misServicios);
    };

    cargar();
  }, [user.id]);
  const serviciosPublicados = servicios.filter((s) => s.estado === "PUBLICADO").length;
  const serviciosAsignados = servicios.filter((s) => s.estado === "ASIGNADO").length;

  return (
    <>
      <Navbar />

      <div className="container mt-4 fade-in" style={{ maxWidth: "1200px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">📋 Mis servicios</h2>
            <p className="text-muted mb-0">
              Gestioná tus servicios publicados
            </p>
          </div>
          <Link
            to="/servicios/nuevo"
            className="btn btn-primary rounded-4"
          >
            + Publicar servicio
          </Link>
        </div>

        {/* Estadísticas */}
        {servicios.length > 0 && (
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none"
              }}>
                <div className="d-flex align-items-center">
                  <div className="fs-1 me-3" style={{ opacity: 0.9 }}>📋</div>
                  <div>
                    <div className="fw-bold fs-3">{servicios.length}</div>
                    <div className="small" style={{ opacity: 0.9 }}>Total servicios</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow-sm scale-hover" style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                border: "none"
              }}>
                <div className="d-flex align-items-center">
                  <div className="fs-1 me-3" style={{ opacity: 0.9 }}>📢</div>
                  <div>
                    <div className="fw-bold fs-3">{serviciosPublicados}</div>
                    <div className="small" style={{ opacity: 0.9 }}>Publicados</div>
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
                  <div className="fs-1 me-3" style={{ opacity: 0.9 }}>✅</div>
                  <div>
                    <div className="fw-bold fs-3">{serviciosAsignados}</div>
                    <div className="small" style={{ opacity: 0.9 }}>Asignados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {servicios.length === 0 ? (
          <EmptyState
            title="No tenés servicios publicados"
            subtitle={
              <>
                Publicá tu primer servicio para comenzar a recibir cotizaciones.
                <br />
                <Link
                  to="/servicios/nuevo"
                  className="btn btn-primary mt-3 rounded-4"
                >
                  + Publicar mi primer servicio
                </Link>
              </>
            }
          />
        ) : (
          <div className="row g-4">
            {servicios.map((s) => (
              <div className="col-md-6 col-lg-4" key={s.id}>
                <ServicioCard servicio={s} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
```

### src/features/servicios/components/ServicioCard.jsx
```javascript
import { Link } from "react-router-dom";

export default function ServicioCard({ servicio }) {
  const getEstadoBadge = (estado) => {
    const estados = {
      PUBLICADO: { clase: "bg-primary", texto: "📢 Publicado" },
      ASIGNADO: { clase: "bg-success", texto: "✅ Asignado" },
      EVALUACION: { clase: "bg-warning text-dark", texto: "⏳ En evaluación" },
    };
    return estados[estado] || { clase: "bg-secondary", texto: estado };
  };

  const estado = getEstadoBadge(servicio.estado);
  const cotizacionesCount = 0; // Se puede calcular si se pasa como prop

  return (
    <div className="card shadow-sm border-0 p-4 rounded-4 fade-in scale-hover h-100" style={{
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      border: "1px solid rgba(102, 126, 234, 0.1)"
    }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="fw-bold mb-0 flex-grow-1" style={{ color: "#2d3748", fontSize: "1.2rem" }}>
          {servicio.titulo}
        </h5>
        <span className={`badge ${estado.clase} px-3 py-2 shadow-sm`} style={{ fontSize: "0.7rem" }}>
          {estado.texto}
        </span>
      </div>

      <p className="text-muted small mb-3" style={{ minHeight: "50px", lineHeight: "1.6" }}>
        {servicio.descripcion.length > 100
          ? servicio.descripcion.slice(0, 100) + "..."
          : servicio.descripcion}
      </p>

      <div className="mb-3">
        <span className="badge px-3 py-2 shadow-sm" style={{
          background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)",
          color: "#4a5568",
          fontSize: "0.7rem"
        }}>
          🏷️ {servicio.categoria}
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: "#e2e8f0" }}>
        <div className="small text-muted">
          <div className="mb-1">📍 <strong>{servicio.ciudad}</strong></div>
          {servicio.fechaPreferida && (
            <div>📅 {new Date(servicio.fechaPreferida).toLocaleDateString("es-UY")}</div>
          )}
        </div>
        <Link
          to={`/servicios/${servicio.id}`}
          className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
        >
          Ver detalles →
        </Link>
      </div>
    </div>
  );
}
```

### src/features/servicios/api/serviciosApi.js
```javascript
import { mockServices } from "../../../core/models/Service.js";
import { v4 as uuid } from "uuid";

/* -----------------------------------------------------
   BASE DE DATOS PERSISTENTE (localStorage)
----------------------------------------------------- */

// Cargar servicios desde localStorage o usar los mocks
let servicesDB =
  JSON.parse(localStorage.getItem("servicesDB")) || [...mockServices];

// Guardar en localStorage
function saveServices() {
  localStorage.setItem("servicesDB", JSON.stringify(servicesDB));
}

function simulateDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* -----------------------------------------------------
   API DE SERVICIOS
----------------------------------------------------- */

export async function getServiciosApi() {
  await simulateDelay();
  return [...servicesDB];
}

export async function createServicioApi(servicio) {
  await simulateDelay();

  const nuevo = { ...servicio, id: uuid(), estado: "PUBLICADO" };

  servicesDB.push(nuevo);
  saveServices(); // 🔥 PERSISTE

  return nuevo;
}

export async function getServicioByIdApi(id) {
  await simulateDelay();
  return servicesDB.find((s) => s.id === id);
}

/* -----------------------------------------------------
   NUEVO: ACTUALIZAR UN SERVICIO (SELECCIONAR COTIZACIÓN)
----------------------------------------------------- */

export async function updateServicioApi(id, cambios) {
  await simulateDelay();

  servicesDB = servicesDB.map((s) =>
    s.id === id ? { ...s, ...cambios } : s
  );

  saveServices(); // 🔥 GUARDA TODO

  return servicesDB.find((s) => s.id === id);
}
```

---

## 💰 COTIZACIONES

### src/features/cotizaciones/api/cotizacionesApi.js
```javascript
import { mockQuotes } from "../../../core/models/Quote.js";
import { v4 as uuid } from "uuid";

// Base de datos persistente
let quotesDB = JSON.parse(localStorage.getItem("quotesDB")) || [...mockQuotes];

// Guardar en localStorage
function saveDB() {
  localStorage.setItem("quotesDB", JSON.stringify(quotesDB));
}

function simulateDelay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

// 🔥 Obtener TODAS las cotizaciones
export async function getCotizacionesApi() {
  await simulateDelay();
  return [...quotesDB];
}

// 🔥 Obtener cotizaciones de un servicio por ID
export async function getCotizacionesByServiceApi(serviceId) {
  await simulateDelay();
  return quotesDB.filter((c) => c.serviceId === serviceId);
}

// 🔥 Crear (PERSISTIR) cotización nueva
export async function createCotizacionApi(cotizacion) {
  await simulateDelay();

  const nueva = { ...cotizacion, id: uuid() };
  quotesDB.push(nueva);

  saveDB(); // ← NECESARIO

  return nueva;
}

// 🔥 Obtener todas las cotizaciones creadas por un proveedor
export async function getCotizacionesProveedorApi(proveedorId) {
  await simulateDelay();
  return quotesDB.filter((c) => c.proveedorId === proveedorId);
}
```

---

## 🧩 CORE - MODELOS Y HELPERS

### src/core/models/User.js
```javascript
// Mock de usuarios con roles según la consigna
export const mockUsers = [
  {
    id: "u1",
    nombre: "Ana Solicitante",
    email: "solicitante@mail.com",
    password: "123",
    rol: "SOLICITANTE",
  },
  {
    id: "u2",
    nombre: "Bruno Servicio",
    email: "servicio@mail.com",
    password: "123",
    rol: "PROVEEDOR_SERVICIO",
  },
  {
    id: "u3",
    nombre: "Cami Insumos",
    email: "insumos@mail.com",
    password: "123",
    rol: "PROVEEDOR_INSUMOS",
  },
];
```

### src/core/models/Service.js
```javascript
// --------------------------------------------------------
//  MODELO DE SERVICIOS (CON Mocks)
// --------------------------------------------------------

export const mockServices = [
  {
    id: "s1",
    titulo: "Limpieza de jardín",
    descripcion: "Cortar pasto, podar y ordenar plantas del fondo.",
    categoria: "JARDINERIA",
    direccion: "Av. Siempre Viva 742",
    ciudad: "Montevideo",
    fechaPreferida: "2025-11-15",
    solicitanteId: "u1",
    estado: "PUBLICADO",
    cotizacionSeleccionadaId: null,
    insumosRequeridos: [
      { nombre: "Pala", cantidad: "2 unidades" },
      { nombre: "Tierra abonada", cantidad: "10 kg" }
    ]
  }
];

// --------------------------------------------------------
//  FUNCIONES DE UTILIDAD (Opcional)
// --------------------------------------------------------

export function createService({ titulo, descripcion, categoria, direccion, ciudad, fechaPreferida, solicitanteId, insumosRequeridos = [] }) {
  return {
    id: crypto.randomUUID(),
    titulo,
    descripcion,
    categoria,
    direccion,
    ciudad,
    fechaPreferida,
    solicitanteId,
    estado: "PUBLICADO",
    cotizacionSeleccionadaId: null,
    insumosRequeridos,
    createdAt: new Date().toISOString()
  };
}
```

### src/core/models/Quote.js
```javascript
// --------------------------------------------------------
//  MODELO DE COTIZACIONES (CON Mocks)
// --------------------------------------------------------

export const mockQuotes = [
  {
    id: "q1",
    serviceId: "s1",
    proveedorId: "p1",
    precio: 1500,
    plazoDias: 3,
    detalle: "Trabajo rápido",
    ratingProveedorMock: 4
  }
];

// --------------------------------------------------------
//  FUNCIONES DE UTILIDAD (Opcional)
// --------------------------------------------------------

export function createQuote({ serviceId, proveedorId, precio, plazoDias, detalle }) {
  return {
    id: crypto.randomUUID(),
    serviceId,
    proveedorId,
    precio,
    plazoDias,
    detalle,
    ratingProveedorMock: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date().toISOString()
  };
}
```

### src/core/models/Supply.js
```javascript
export const mockSupplies = [
  {
    id: "sup1",
    vendedorId: "u3",
    nombre: "Pintura blanca 4L",
    categoria: "PINTURA",
    precioUnit: 750,
    unidad: "balde",
    stock: 20,
  },
  {
    id: "sup2",
    vendedorId: "u3",
    nombre: "Rodillo profesional",
    categoria: "PINTURA",
    precioUnit: 250,
    unidad: "unidad",
    stock: 50,
  },
  {
    id: "sup3",
    vendedorId: "u3",
    nombre: "Tierra abonada 5kg",
    categoria: "JARDINERIA",
    precioUnit: 180,
    unidad: "bolsa",
    stock: 40,
  },
];
```

### src/core/logic/filterServices.js
```javascript
export function filterServices(services, filtros = {}) {
  if (!Array.isArray(services)) return [];

  return services.filter((s) => {
    if (filtros.solicitanteId && s.solicitanteId !== filtros.solicitanteId)
      return false;

    if (filtros.estado && s.estado !== filtros.estado)
      return false;

    if (filtros.categoria && s.categoria !== filtros.categoria)
      return false;

    return true;
  });
}
```

### src/core/helpers/errorHandler.js
```javascript
/**
 * Maneja errores de manera consistente en toda la aplicación
 * @param {Error|string|Object} error - Error a manejar
 * @param {string} defaultMessage - Mensaje por defecto si no se puede extraer del error
 * @returns {string} - Mensaje de error formateado para mostrar al usuario
 */
export function handleError(error, defaultMessage = "Ocurrió un error. Por favor, intenta nuevamente.") {
  // Si es un string, retornarlo directamente
  if (typeof error === "string") {
    return error;
  }

  // Si es un objeto Error
  if (error instanceof Error) {
    // Si tiene un mensaje específico, usarlo
    if (error.message) {
      return error.message;
    }
    return defaultMessage;
  }

  // Si es un objeto con propiedad message
  if (error && typeof error === "object" && error.message) {
    return error.message;
  }

  // Si es un objeto con propiedad error
  if (error && typeof error === "object" && error.error) {
    return error.error;
  }

  // Fallback al mensaje por defecto
  return defaultMessage;
}

/**
 * Loggea errores para debugging (solo en desarrollo)
 * @param {Error|string|Object} error - Error a loggear
 * @param {string} context - Contexto donde ocurrió el error
 */
export function logError(error, context = "Unknown") {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}] Error:`, error);
    
    // Si es un Error, mostrar stack trace
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
  }
}

/**
 * Crea un mensaje de error amigable para el usuario
 * @param {Error|string|Object} error - Error original
 * @param {string} action - Acción que se estaba realizando (ej: "crear servicio")
 * @returns {string} - Mensaje amigable
 */
export function getFriendlyErrorMessage(error, action = "realizar esta acción") {
  const errorMessage = handleError(error);
  
  // Mensajes comunes y sus traducciones amigables
  const friendlyMessages = {
    "Network Error": "No hay conexión a internet. Verificá tu conexión.",
    "Failed to fetch": "No se pudo conectar con el servidor. Intentá nuevamente.",
    "Unauthorized": "No tenés permisos para realizar esta acción.",
    "Not Found": "El recurso que buscás no existe.",
  };

  // Buscar si hay un mensaje amigable predefinido
  for (const [key, friendly] of Object.entries(friendlyMessages)) {
    if (errorMessage.includes(key)) {
      return friendly;
    }
  }

  // Si el mensaje ya es amigable, retornarlo
  if (errorMessage.length < 100 && !errorMessage.includes("Error:")) {
    return errorMessage;
  }

  // Mensaje genérico con contexto
  return `No se pudo ${action}. ${errorMessage}`;
}
```

### src/core/helpers/getUserName.js
```javascript
/**
 * Obtiene el nombre de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @param {Array} users - Array de usuarios (puede incluir currentUser del contexto)
 * @param {Object} currentUser - Usuario actual del contexto (opcional)
 * @returns {string} - Nombre del usuario o "Proveedor {id}" si no se encuentra
 */
export function getUserName(userId, users = [], currentUser = null) {
  // Primero verificar si es el usuario actual
  if (currentUser && currentUser.id === userId) {
    return currentUser.nombre || `Usuario ${userId}`;
  }

  // Buscar en el array de usuarios
  const user = users.find((u) => u.id === userId);
  if (user) {
    return user.nombre || `Usuario ${userId}`;
  }

  // Si no se encuentra, intentar cargar desde localStorage
  try {
    const allUsers = JSON.parse(localStorage.getItem("usersDB")) || [];
    const foundUser = allUsers.find((u) => u.id === userId);
    if (foundUser) {
      return foundUser.nombre || `Usuario ${userId}`;
    }
  } catch (error) {
    console.warn("Error al cargar usuarios desde localStorage:", error);
  }

  // Fallback: retornar ID formateado
  return `Proveedor ${userId.substring(0, 8)}...`;
}

/**
 * Obtiene información completa de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @param {Array} users - Array de usuarios
 * @param {Object} currentUser - Usuario actual del contexto
 * @returns {Object|null} - Objeto usuario o null si no se encuentra
 */
export function getUserById(userId, users = [], currentUser = null) {
  if (currentUser && currentUser.id === userId) {
    return currentUser;
  }

  const user = users.find((u) => u.id === userId);
  if (user) return user;

  try {
    const allUsers = JSON.parse(localStorage.getItem("usersDB")) || [];
    return allUsers.find((u) => u.id === userId) || null;
  } catch {
    return null;
  }
}
```

---

## ❓ PREGUNTAS ESPECÍFICAS

**Por favor, explicame:**

### 1. CONFIGURACIÓN DEL PROYECTO
- ¿Qué es `package.json` y para qué sirve cada campo (name, version, scripts, dependencies, devDependencies)?
- ¿Qué es Vite y por qué lo usamos en lugar de Create React App?
- ¿Qué hace `vite.config.js`?
- ¿Qué es ESLint y para qué sirve `eslint.config.js`?
- ¿Qué es `index.html` y por qué tiene un `<div id="root">`?

### 2. PUNTO DE ENTRADA (main.jsx)
- ¿Qué hace `ReactDOM.createRoot()`?
- ¿Por qué usamos `React.StrictMode`?
- ¿Qué es `BrowserRouter` y por qué lo envolvemos aquí?
- ¿Por qué importamos Bootstrap y los CSS aquí?
- ¿Cómo funciona el flujo desde `main.jsx` → `AppProvider` → `App`?

### 3. CONTEXT API (context/)
- ¿Qué es Context API y por qué lo usamos?
- ¿Qué hace `AppContext.js` (solo tiene `createContext(null)`)?
- ¿Qué es un Provider y cómo funciona `AppProvider.jsx`?
- ¿Qué es un Reducer y cómo funciona `AppReducer.js`?
- ¿Qué es `initialState.js` y por qué lo separamos?
- ¿Cómo se relacionan `useContext`, `dispatch`, y `state`?

### 4. ESTRUCTURA DE CARPETAS
- ¿Por qué separamos en `core/`, `features/`, `ui/`, `routes/`?
- ¿Qué va en `core/` y por qué?
  - `core/models/`: ¿Qué son los modelos y por qué los separamos?
  - `core/logic/`: ¿Qué tipo de funciones van aquí?
  - `core/helpers/`: ¿Qué diferencia hay entre helpers y logic?
- ¿Qué va en `features/` y por qué?
  - ¿Por qué cada feature tiene su propia carpeta `api/`, `components/`, `pages/`?
- ¿Qué va en `ui/` y por qué?
  - ¿Qué diferencia hay entre `ui/components/` y `features/*/components/`?
- ¿Qué es `layout/` y para qué sirve `AuthLayout` vs `DashboardLayout`?

### 5. REACT HOOKS
- ¿Qué es `useState` y cómo funciona?
- ¿Qué es `useEffect` y cuándo se ejecuta?
- ¿Qué es `useContext` y cómo accede al estado global?
- ¿Qué es `useParams` y para qué lo usamos?
- ¿Qué es `useNavigate` y cómo funciona?
- ¿Cuál es la diferencia entre hooks y funciones normales?

### 6. ROUTING (routes/)
- ¿Qué es React Router DOM y para qué sirve?
- ¿Cómo funciona `RouterApp.jsx`?
- ¿Qué es `ProtectedRoute.jsx` y cómo protege las rutas?
- ¿Qué es `Navigate` y cuándo lo usamos?
- ¿Cómo funcionan los parámetros de ruta (`:id`)?

### 7. COMPONENTES
- ¿Qué es un componente en React?
- ¿Cuál es la diferencia entre componente funcional y de clase?
- ¿Qué son las props y cómo se pasan?
- ¿Qué es JSX y cómo se diferencia de HTML?
- ¿Cómo funciona la renderización condicional?

### 8. ESTADO Y DATOS
- ¿Cómo funciona el estado local (`useState`) vs estado global (`Context`)?
- ¿Qué es `localStorage` y cómo lo usamos?
- ¿Cómo funcionan las APIs mock (simuladas)?
- ¿Qué es `dispatch` y cómo enviamos acciones al reducer?

### 9. FLUJO DE DATOS
- ¿Cómo fluyen los datos desde el usuario → componente → API → estado global → otros componentes?
- ¿Cómo se actualiza la UI cuando cambian los datos?
- ¿Qué es la "elevación de estado" (lifting state up)?

### 10. CONCEPTOS AVANZADOS
- ¿Qué es el patrón de diseño "Feature-based architecture"?
- ¿Qué es "separation of concerns" (separación de responsabilidades)?
- ¿Qué es "DRY" (Don't Repeat Yourself) y cómo lo aplicamos?
- ¿Qué es "Single Responsibility Principle"?

**IMPORTANTE:**
- Explicá cada concepto como si fuera la primera vez que lo veo
- Usá ejemplos concretos de mi código
- Mostrá cómo se relacionan las partes entre sí
- Respondé todas las preguntas de manera clara y didáctica
- Si algo no está claro, preguntame antes de asumir

**Empieza explicando desde lo más básico (qué es React, qué es un componente) hasta lo más avanzado (arquitectura, patrones de diseño).**

---

## INSTRUCCIONES DE USO:

1. Copiá todo el contenido desde "## PROMPT:" hasta el final
2. Pegalo en ChatGPT
3. ChatGPT te explicará todo paso a paso
4. Podés hacerle preguntas de seguimiento sobre cualquier parte específica

**Ejemplo de preguntas de seguimiento que podés hacer:**
- "Explícame más sobre cómo funciona el AppReducer"
- "¿Por qué usamos Context en lugar de props?"
- "Muéstrame cómo se actualiza el estado cuando creo un servicio"
- "¿Qué pasa si dos componentes usan el mismo hook?"
