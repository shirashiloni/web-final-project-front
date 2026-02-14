import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const ProtectedRoute: React.FC = () => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;