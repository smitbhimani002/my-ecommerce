import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Outlet />;
};

export default UserRoute;
