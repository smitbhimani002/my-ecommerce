import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
