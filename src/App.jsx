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
  }, [dispatch]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentUser?.id, dispatch]);

  // 3) Cargar perfil desde token 
  useEffect(() => {
    const token = state?.currentUser?.token;
    if (!token) return;

    const cargarPerfil = async () => {
      const profile = await getProfileApi(token);
      dispatch({ type: "LOGIN", payload: profile });
    };

    cargarPerfil();
  }, [state.currentUser?.token, dispatch]);

  return <RouterApp />;
}

export default function App() {
  return <AppWithAuth />;
}
