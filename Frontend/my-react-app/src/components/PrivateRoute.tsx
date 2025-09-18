import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";


function PrivateRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading session...</div>; // Or a loading spinner
  }

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists → render the child routes
  return <Outlet />;
}

export default PrivateRoute;