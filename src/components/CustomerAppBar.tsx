import React from "react";
import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";
import { LogoutButton } from "./LogoutButton";
import { useGetRegionConfigQuery } from "../store/api/regionApi";

interface CustomerAppBarProps {
  customerName: string;
  isLoading?: boolean;
}

export const CustomerAppBar: React.FC<CustomerAppBarProps> = ({
  customerName,
  isLoading = false,
}) => {
  const { data: regionConfig } = useGetRegionConfigQuery();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Cushon Retail Customer
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
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Welcome back, {isLoading ? "Customer" : customerName}!
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
  );
};
