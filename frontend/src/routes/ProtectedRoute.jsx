import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = Cookies.get("userData");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  const isAuthenticated = user && user.access_token;

  // 1. Not logged in -> Redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Determine user's role
  const userRole = user.role || (user.user && user.user.role) || (user.data && user.data.role) || 'Customer';

  // 3. Role check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // If the user's role is not in the allowed roles, redirect them to their respective home page
    if (userRole === 'Admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'Vendor') {
      return <Navigate to="/vendor-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // 4. Authorized -> Render the component
  return children;
};

export default ProtectedRoute;
