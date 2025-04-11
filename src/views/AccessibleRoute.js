import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AccessibleRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.LoginReducer);
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default AccessibleRoute;


