import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { ROUTES } from "../constants";

interface AuthRedirectProps {
  children: React.ReactNode;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isLoggedIn, userType, isInitialized } = useAppSelector(
    (state) => state.user
  );

  // Wait for auth initialization to complete
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  // If user is logged in, redirect to appropriate dashboard
  if (isLoggedIn && userType) {
    const redirectPath =
      userType === "employee" ? ROUTES.EMPLOYEE : ROUTES.RETAIL;
    return <Navigate to={redirectPath} replace />;
  }

  // If not logged in, show the login page
  return <>{children}</>;
};
