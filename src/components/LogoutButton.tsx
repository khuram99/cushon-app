import React from "react";
import { Button, type SxProps } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { clearUserData } from "../store/slices/userSlice";
import { useLogoutMutation } from "../store/api/authApi";
import { ROUTES } from "../constants";
import type { Theme } from "@emotion/react";

interface LogoutButtonProps {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "outlined",
  size = "medium",
  fullWidth = false,
  sx,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Call the logout API to clear session storage
      await logout().unwrap();

      // Clear Redux state
      dispatch(clearUserData());

      // Navigate to login page
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if API call fails, clear local state and redirect
      dispatch(clearUserData());
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleLogout}
      disabled={isLoading}
      startIcon={<LogoutOutlined />}
      color="secondary"
      sx={sx}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
};
