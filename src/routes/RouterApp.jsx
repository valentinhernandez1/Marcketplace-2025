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
