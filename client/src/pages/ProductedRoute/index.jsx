import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Profile from '../Profile/index.jsx';
import AdminHome from '../Admin/index.jsx';

export function ProductedProfile() {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Navigate to="/signin" />;
  return <Profile />;
}

export function ProductedAdmin({ children }) {
  const { loggedIn, user } = useAuth();
  if (!loggedIn) return <Navigate to="/signin" />;
  if (user?.role !== 'admin' && user?.role !== 'superadmin') return <Navigate to="/" />;
  return children ? children : <AdminHome />;
}

export default ProductedProfile;
