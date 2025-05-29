import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { LoginPage } from "../pages";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthRedirect } from "../components/AuthRedirect";
import { ROUTES } from "../constants";

// Lazy load pages for code splitting
const EmployeePage = React.lazy(() =>
  import("../pages/EmployeePage").then((module) => ({
    default: module.EmployeePage,
  }))
);
const RetailCustomerPage = React.lazy(() =>
  import("../pages/RetailCustomerPage").then((module) => ({
    default: module.RetailCustomerPage,
  }))
);

// Loading component for suspense fallback
const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
    }}
  >
    <CircularProgress />
  </Box>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Login route - with auto-redirect for authenticated users */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        }
      />

      {/* Employee dashboard route - protected and lazy loaded */}
      <Route
        path={ROUTES.EMPLOYEE}
        element={
          <ProtectedRoute userType="employee">
            <Suspense fallback={<PageLoader />}>
              <EmployeePage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Retail customer dashboard route - protected and lazy loaded */}
      <Route
        path={ROUTES.RETAIL}
        element={
          <ProtectedRoute userType="retail">
            <Suspense fallback={<PageLoader />}>
              <RetailCustomerPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route - redirect to login */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};
