import React from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { useLazyGetEmployeeDataQuery } from "../store/api/employeeApi";
import { useGetRegionConfigQuery } from "../store/api/regionApi";
import { LogoutButton } from "../components";
import { ErrorFallback } from "../components/ErrorFallback";
import { ROUTES } from "../constants";

export const EmployeePage = () => {
  const navigate = useNavigate();
  const userState = useAppSelector((state) => state.user);
  const [
    getEmployeeData,
    { data: employeeData, isLoading, error: employeeError },
  ] = useLazyGetEmployeeDataQuery();
  const { data: regionConfig, error: regionError } = useGetRegionConfigQuery();

  React.useEffect(() => {
    // If user is not logged in or not an employee, redirect to login
    if (!userState.isLoggedIn || userState.userType !== "employee") {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Fetch employee data if not already loaded
    if (!employeeData && !isLoading && !employeeError) {
      getEmployeeData();
    }
  }, [
    userState,
    navigate,
    getEmployeeData,
    employeeData,
    isLoading,
    employeeError,
  ]);

  if (!userState.isLoggedIn || userState.userType !== "employee") {
    return null; // Will redirect via useEffect
  }

  // Handle employee data error
  if (employeeError) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <ErrorFallback
            error={employeeError}
            onRetry={() => getEmployeeData()}
            title="Failed to Load Employee Data"
            description="We couldn't load your employee information. Please try again."
          />
        </Box>
      </Container>
    );
  }

  // Get employee name for display
  const employeeName = employeeData?.userName || "Employee";

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      {/* Employee AppBar */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                Cushon Employee Portal
              </Typography>
              {regionConfig && (
                <Chip
                  label={`${regionConfig.country} - ${regionConfig.currency}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "primary.contrastText",
                    color: "primary.contrastText",
                    fontSize: "0.75rem",
                  }}
                />
              )}
              {regionError && (
                <Chip
                  label="Region data unavailable"
                  size="small"
                  variant="outlined"
                  color="warning"
                  sx={{
                    borderColor: "warning.main",
                    color: "warning.main",
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Welcome back, {isLoading ? "Employee" : employeeName}!
            </Typography>
          </Box>
          <LogoutButton
            variant="outlined"
            sx={{
              borderColor: "primary.contrastText",
              color: "primary.contrastText",
              "&:hover": {
                borderColor: "primary.contrastText",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ py: 4 }}>
          <Card sx={{ maxWidth: "100%", mx: "auto", textAlign: "center" }}>
            <CardContent sx={{ py: 8 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="text.secondary"
              >
                Employee Portal
              </Typography>
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ mt: 3, fontStyle: "italic" }}
              >
                "This section is not part of Demo, only used to show code split
                and usage of shared resources / components"
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                This page demonstrates:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Code splitting with React.lazy()
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Shared authentication components
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Protected routes implementation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Regional configuration usage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Comprehensive error handling
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};
