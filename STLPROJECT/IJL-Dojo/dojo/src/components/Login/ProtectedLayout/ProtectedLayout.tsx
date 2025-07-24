// components/ProtectedLayout.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../../store/store';


const ProtectedLayout = () => {
  const isAuthenticated = useSelector((state: RootState) => state.StoreTokenData.accessToken !== null);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;