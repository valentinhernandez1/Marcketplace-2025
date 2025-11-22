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
