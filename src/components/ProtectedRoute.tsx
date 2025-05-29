import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { ROUTES } from "../constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: "employee" | "retail";
}

export const ProtectedRoute = ({ children, userType }: ProtectedRouteProps) => {
  const userState = useAppSelector((state) => state.user);

  // If user is not logged in, redirect to login page
  if (!userState.isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If user type doesn't match required type, redirect to login page
  if (userState.userType !== userType) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If everything is valid, render the protected component
  return <>{children}</>;
};
