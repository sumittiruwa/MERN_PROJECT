import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("pharmaUser"));
  } catch {
    user = null;
  }

  const token = localStorage.getItem("pharmaToken");

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}