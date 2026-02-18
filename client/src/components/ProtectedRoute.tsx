import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
