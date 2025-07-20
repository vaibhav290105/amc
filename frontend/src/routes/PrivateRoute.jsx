import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <h1 className="p-10 text-2xl">Access Denied</h1>;
  }

  return children || <Outlet />;
}
