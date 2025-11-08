import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />; // redirect về trang Login
  }
  return children;
}
