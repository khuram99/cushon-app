import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Container } from "@mui/material";
import { LoginTabs } from "../components/LoginTabs";
import { TabPanel } from "../components/TabPanel";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  const [tabValue, setTabValue] = useState(1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Card sx={{ width: "100%", maxWidth: 480, boxShadow: 3, mx: "auto" }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 1 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 3 }}
                >
                  Please sign in to your account
                </Typography>
              </Box>

              <LoginTabs value={tabValue} onChange={handleTabChange} />

              <TabPanel value={tabValue} index={0}>
                <LoginForm userType="employee" />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <LoginForm userType="retail" />
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};
