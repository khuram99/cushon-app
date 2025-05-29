import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Person, Business } from "@mui/icons-material";

interface LoginTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const LoginTabs = ({ value, onChange }: LoginTabsProps) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="login tabs"
        variant="fullWidth"
      >
        <Tab
          icon={<Person />}
          label="Employee"
          id="login-tab-0"
          aria-controls="login-tabpanel-0"
        />
        <Tab
          icon={<Business />}
          label="Retail Customer"
          id="login-tab-1"
          aria-controls="login-tabpanel-1"
        />
      </Tabs>
    </Box>
  );
};
