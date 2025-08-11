// import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Style from './ProtectedRoute.module.css';

export default function ProtectedRoute({ children }) {

  if (localStorage.getItem('token')) {
    return children;
  } else {
    return <Navigate to="/login" />
  }

}
