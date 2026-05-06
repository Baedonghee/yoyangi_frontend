import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authUserSelector } from 'stores/auth';

interface IGuardRoute {
  code: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8';
}

const GuardRoute: React.FC<IGuardRoute> = ({ code }) => {
  const user = useRecoilValue(authUserSelector);

  if (user?.authorities.some((auth) => auth.code === code)) {
    return <Outlet />;
  }

  return <Navigate to="/404" replace />;
};

export default GuardRoute;
