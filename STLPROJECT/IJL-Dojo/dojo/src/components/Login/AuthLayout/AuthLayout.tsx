import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../../store/store';


export const AuthLayout = () => {
  const isAuthenticated = useSelector((state: RootState) => state.StoreTokenData.accessToken !== null);
  
  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};