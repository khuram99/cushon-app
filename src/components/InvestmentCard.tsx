import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
  Button,
  CardActions,
} from "@mui/material";
import {
  TrendingUpOutlined,
  AccountBalanceWalletOutlined,
  AddOutlined,
} from "@mui/icons-material";
import { useGetRegionConfigQuery } from "../store/api/regionApi";
import type { UserInvestment } from "../store/api/retailApi";

interface InvestmentCardProps {
  userInvestment: UserInvestment;
  isLoading?: boolean;
  onAddInvestment?: () => void;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({
  userInvestment,
  isLoading = false,
  onAddInvestment,
}) => {
  const { data: regionConfig } = useGetRegionConfigQuery();

  // Safe destructuring with defaults
  const totalInvestment = userInvestment?.totalInvestment ?? 0;
  const fundsList = userInvestment?.fundsList ?? [];

  // Use region config for max investment and currency
  const maxInvestment = regionConfig?.maxInvestmentAmount || 20000;
  const currencySymbol = regionConfig?.currencySymbol || "$";

  const canAddMore = totalInvestment < maxInvestment;
  const displayLoading = isLoading;

  return (
    <Card sx={{ maxWidth: "100%", mx: "auto" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <TrendingUpOutlined color="primary" />
          Investment Portfolio
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
          >
            <AccountBalanceWalletOutlined color="secondary" />
            Total Investment Amount
          </Typography>
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
            {displayLoading
              ? "Loading..."
              : `${currencySymbol}${totalInvestment.toLocaleString()}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Maximum allowed: {currencySymbol}
            {maxInvestment.toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Investment Funds
        </Typography>

        {displayLoading ? (
          <Typography variant="body2" color="text.secondary">
            Loading funds...
          </Typography>
        ) : fundsList.length > 0 ? (
          <List dense>
            {fundsList.map((fund, index) => (
              <ListItem key={fund.fundId} sx={{ pl: 0 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={`Fund ${index + 1}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium" }}
                        >
                          {fund.fundName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Invested: {currencySymbol}
                          {(fund.investedAmount ?? 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No funds selected yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Start investing to see your funds here
            </Typography>
          </Box>
        )}
      </CardContent>

      {canAddMore && onAddInvestment && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={onAddInvestment}
            disabled={displayLoading}
            size="large"
          >
            Add Investment
          </Button>
        </CardActions>
      )}

      {!canAddMore && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Maximum investment limit reached
          </Typography>
        </CardActions>
      )}
    </Card>
  );
};
