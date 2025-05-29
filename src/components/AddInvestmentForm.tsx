import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useGetFundsQuery } from "../store/api/fundsApi";
import { useGetRegionConfigQuery } from "../store/api/regionApi";
import type { UserInvestment } from "../store/api/retailApi";

interface AddInvestmentFormProps {
  open: boolean;
  onClose: () => void;
  currentInvestment: UserInvestment;
  onSubmit: (data: InvestmentFormData) => void;
  isSubmitting?: boolean;
}

export interface InvestmentFormData {
  amount: number;
  fundId: string;
}

export const AddInvestmentForm: React.FC<AddInvestmentFormProps> = ({
  open,
  onClose,
  currentInvestment,
  onSubmit,
  isSubmitting = false,
}) => {
  const { data: funds, isLoading: fundsLoading } = useGetFundsQuery();
  const { data: regionConfig, isLoading: regionLoading } =
    useGetRegionConfigQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<InvestmentFormData>({
    defaultValues: {
      amount: 0,
      fundId: "",
    },
  });

  const watchAmount = watch("amount");

  // Use region config for max investment and currency
  const maxInvestment = regionConfig?.maxInvestmentAmount || 20000;
  const currencySymbol = regionConfig?.currencySymbol || "£";

  const newTotalInvestment =
    currentInvestment.totalInvestment + (watchAmount || 0);
  const remainingAmount = maxInvestment - currentInvestment.totalInvestment;

  const validateAmount = (value: number) => {
    if (!value || value <= 0)
      return "Investment amount is required and must be greater than 0";
    if (value > remainingAmount)
      return `Maximum additional investment allowed: ${currencySymbol}${remainingAmount.toLocaleString()}`;
    if (newTotalInvestment > maxInvestment)
      return `Total investment cannot exceed ${currencySymbol}${maxInvestment.toLocaleString()}`;
    return true;
  };

  const validateFund = (value: string) => {
    if (!value) return "Please select a fund";
    return true;
  };

  const handleFormSubmit = (data: InvestmentFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isLoading = regionLoading || fundsLoading;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Investment</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Current investment info */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Current investment:{" "}
              <strong>
                {currencySymbol}
                {currentInvestment.totalInvestment?.toLocaleString()}
              </strong>
            </Typography>
            <Typography variant="body2">
              Remaining capacity:{" "}
              <strong>
                {currencySymbol}
                {remainingAmount.toLocaleString()}
              </strong>
            </Typography>
          </Alert>

          {/* Amount field */}
          <Controller
            name="amount"
            control={control}
            rules={{ validate: validateAmount }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Investment Amount"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.amount}
                helperText={errors.amount?.message}
                InputProps={{
                  startAdornment: currencySymbol,
                }}
                inputProps={{
                  min: 1,
                  max: remainingAmount,
                  step: 1,
                }}
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
                disabled={isLoading}
              />
            )}
          />

          {/* Fund selection */}
          <FormControl fullWidth margin="normal" error={!!errors.fundId}>
            <InputLabel>Select Fund</InputLabel>
            <Controller
              name="fundId"
              control={control}
              rules={{ validate: validateFund }}
              render={({ field }) => (
                <Select {...field} label="Select Fund" disabled={isLoading}>
                  {isLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    funds?.map((fund) => (
                      <MenuItem key={fund.fundId} value={fund.fundId}>
                        {fund.fundName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              )}
            />
            {errors.fundId && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 2 }}
              >
                {errors.fundId.message}
              </Typography>
            )}
          </FormControl>

          {/* Preview total */}
          {watchAmount > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                New total investment:{" "}
                <strong>
                  {currencySymbol}
                  {newTotalInvestment.toLocaleString()}
                </strong>
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? "Investing..." : "Invest"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
