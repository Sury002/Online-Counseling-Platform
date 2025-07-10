import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}