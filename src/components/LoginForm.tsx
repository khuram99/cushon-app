import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { useLoginForm } from "../hooks/useLoginForm";
import type { UserType } from "../hooks/useLoginForm";

interface LoginFormProps {
  userType: UserType;
}

export const LoginForm = ({ userType }: LoginFormProps) => {
  const hookResult = useLoginForm(userType);

  const {
    control,
    errors,
    isSubmitting,
    loginError,
    showPassword,
    handleSubmit,
    validateEmail,
    validatePassword,
    togglePasswordVisibility,
    getDemoCredentials,
  } = hookResult;

  // Safely access loading states based on user type
  const isLoadingData =
    userType === "employee"
      ? "isLoadingEmployeeData" in hookResult &&
        hookResult.isLoadingEmployeeData
      : "isLoadingRetailData" in hookResult && hookResult.isLoadingRetailData;

  const { email, password, userTypeLabel } = getDemoCredentials();

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        {/* Show loading indicator for data fetching */}
        {isLoadingData && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <Typography variant="caption" color="text.secondary">
              Loading {userType} data...
            </Typography>
          </Box>
        )}

        <Controller
          name="email"
          control={control}
          rules={{ validate: validateEmail }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email Address"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color={errors.email ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ validate: validatePassword }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isSubmitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 2, py: 1.5 }}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>

        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Demo Credentials for {userTypeLabel}:
            <br />
            Email: {email}
            <br />
            Password: {password}
          </Typography>
        </Box>
      </Box>
    </form>
  );
};
