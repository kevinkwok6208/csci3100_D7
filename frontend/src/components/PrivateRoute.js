// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isLoggedIn, isAdmin }) => {
  if (!isLoggedIn) {
    // If not logged in, redirect to login
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    // If not an admin, redirect to home or another page
    return <Navigate to="/" />;
  }

  return element; // If logged in and is admin, render the component
};

export default PrivateRoute;
