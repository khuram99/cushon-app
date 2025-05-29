import React from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Refresh, WifiOff, Warning } from "@mui/icons-material";

interface ErrorFallbackProps {
  error?: {
    status?: number;
    message?: string;
    data?: {
      message?: string;
    };
  };
  isLoading?: boolean;
  onRetry: () => void;
  title?: string;
  description?: string;
  showRetry?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  isLoading = false,
  onRetry,
  title,
  description,
  showRetry = true,
}) => {
  const getErrorContent = () => {
    if (isLoading) {
      return {
        icon: <CircularProgress size={48} color="primary" />,
        title: "Loading...",
        description: "Please wait while we fetch your data.",
        severity: "info" as const,
        showButton: false,
      };
    }

    if (!error) {
      return {
        icon: <Warning sx={{ fontSize: 48, color: "warning.main" }} />,
        title: title || "Something went wrong",
        description:
          description || "An unexpected error occurred. Please try again.",
        severity: "warning" as const,
        showButton: showRetry,
      };
    }

    // Network errors
    if (error.status === 0 || error.message?.includes("network")) {
      return {
        icon: <WifiOff sx={{ fontSize: 48, color: "error.main" }} />,
        title: "Connection Problem",
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
        severity: "error" as const,
        showButton: true,
      };
    }

    // Server errors
    if (error.status && error.status >= 500) {
      return {
        icon: <Warning sx={{ fontSize: 48, color: "error.main" }} />,
        title: "Server Error",
        description:
          "Our servers are experiencing issues. Please try again in a few moments.",
        severity: "error" as const,
        showButton: true,
      };
    }

    // Client errors
    if (error.status === 401) {
      return {
        icon: <Warning sx={{ fontSize: 48, color: "warning.main" }} />,
        title: "Authentication Required",
        description: "Your session has expired. Please log in again.",
        severity: "warning" as const,
        showButton: false,
      };
    }

    if (error.status === 403) {
      return {
        icon: <Warning sx={{ fontSize: 48, color: "warning.main" }} />,
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
        severity: "warning" as const,
        showButton: false,
      };
    }

    if (error.status === 404) {
      return {
        icon: <Warning sx={{ fontSize: 48, color: "warning.main" }} />,
        title: "Not Found",
        description: "The requested resource could not be found.",
        severity: "warning" as const,
        showButton: true,
      };
    }

    // Generic error
    const errorMessage =
      error.data?.message || error.message || "An unexpected error occurred";

    return {
      icon: <Warning sx={{ fontSize: 48, color: "error.main" }} />,
      title: title || "Error",
      description: description || errorMessage,
      severity: "error" as const,
      showButton: showRetry,
    };
  };

  const {
    icon,
    title: errorTitle,
    description: errorDescription,
    severity,
    showButton,
  } = getErrorContent();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 4,
        px: 2,
        minHeight: 200,
      }}
    >
      {icon}

      <Typography
        variant="h6"
        component="h3"
        sx={{ mt: 2, mb: 1, fontWeight: "medium" }}
        color={severity === "info" ? "text.primary" : `${severity}.main`}
      >
        {errorTitle}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {errorDescription}
      </Typography>

      {showButton && !isLoading && (
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRetry}
          size="large"
          color={severity === "warning" ? "warning" : "primary"}
        >
          Try Again
        </Button>
      )}

      {/* Development error details */}
      {import.meta.env.DEV && error && (
        <Alert
          severity="error"
          sx={{ mt: 3, textAlign: "left", maxWidth: 500 }}
        >
          <Typography variant="caption" component="div">
            <strong>Debug Info:</strong>
          </Typography>
          <Typography
            variant="caption"
            component="pre"
            sx={{ fontSize: "0.7rem" }}
          >
            Status: {error.status}
            {"\n"}Message: {error.message}
            {"\n"}Data: {JSON.stringify(error.data, null, 2)}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
