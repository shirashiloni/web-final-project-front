import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/http';

export const useLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    delete axiosInstance.defaults.headers.common['Authorization'];

    navigate('/login');
  };

  return handleLogout;
};
