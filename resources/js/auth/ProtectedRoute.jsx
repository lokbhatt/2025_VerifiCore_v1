import { Navigate, useLocation  } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token) {
    const fallbackRole = allowedRoles?.[0] || 'member';
    return (
      <Navigate
        to={`/login/${fallbackRole}`}
        state={{ from: location }}
        replace
      />
    );
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
