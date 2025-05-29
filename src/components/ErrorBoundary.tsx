import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Container,
} from "@mui/material";
import { ErrorOutline, Refresh } from "@mui/icons-material";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props;

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.handleReset}
          />
        );
      }

      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <Card sx={{ maxWidth: 600, width: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <ErrorOutline
                  sx={{
                    fontSize: 64,
                    color: "error.main",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  color="error.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Oops! Something went wrong
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  We're sorry, but something unexpected happened. Please try
                  refreshing the page or contact support if the problem
                  persists.
                </Typography>

                {import.meta.env.DEV && this.state.error && (
                  <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
                    <Typography variant="caption" component="div">
                      <strong>Error:</strong> {this.state.error.message}
                    </Typography>
                    {this.state.error.stack && (
                      <Typography
                        variant="caption"
                        component="pre"
                        sx={{
                          mt: 1,
                          fontSize: "0.7rem",
                          maxHeight: 200,
                          overflow: "auto",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {this.state.error.stack}
                      </Typography>
                    )}
                  </Alert>
                )}

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={this.handleReset}
                    size="large"
                  >
                    Try Again
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                    size="large"
                  >
                    Refresh Page
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
