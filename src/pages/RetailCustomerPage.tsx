import React, { useState } from "react";
import { Container, Box, Button, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import {
  useLazyGetRetailCustomerDataQuery,
  useUpdateInvestmentMutation,
  useClearInvestmentMutation,
} from "../store/api/retailApi";
import { useGetFundsQuery } from "../store/api/fundsApi";
import {
  CustomerAppBar,
  InvestmentCard,
  AddInvestmentForm,
} from "../components";
import { ErrorFallback } from "../components/ErrorFallback";
import { ROUTES } from "../constants";
import type { InvestmentFormData } from "../components/AddInvestmentForm";

export const RetailCustomerPage = () => {
  const navigate = useNavigate();
  const userState = useAppSelector((state) => state.user);
  const [
    getRetailCustomerData,
    { data: retailCustomerData, isLoading, error: customerError },
  ] = useLazyGetRetailCustomerDataQuery();
  const [updateInvestment, { isLoading: isUpdating }] =
    useUpdateInvestmentMutation();
  const [clearInvestment, { isLoading: isClearing }] =
    useClearInvestmentMutation();
  const { data: funds, error: fundsError } = useGetFundsQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Error state management
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  React.useEffect(() => {
    // If user is not logged in or not a retail customer, redirect to login
    if (!userState.isLoggedIn || userState.userType !== "retail") {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Fetch retail customer data if not already loaded
    if (!retailCustomerData && !isLoading && !customerError) {
      getRetailCustomerData();
    }
  }, [
    userState,
    navigate,
    getRetailCustomerData,
    retailCustomerData,
    isLoading,
    customerError,
  ]);

  if (!userState.isLoggedIn || userState.userType !== "retail") {
    return null; // Will redirect via useEffect
  }

  // Handle customer data error
  if (customerError) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <ErrorFallback
            error={customerError}
            onRetry={() => getRetailCustomerData()}
            title="Failed to Load Customer Data"
            description="We couldn't load your account information. Please try again."
          />
        </Box>
      </Container>
    );
  }

  // Get customer name for display
  const customerName = retailCustomerData
    ? `${retailCustomerData.firstName} ${retailCustomerData.lastName}`
    : "Customer";

  // Get user investment data with safe defaults
  const userInvestment = retailCustomerData?.userInvestment || {
    totalInvestment: 0,
    fundsList: [],
  };

  const handleAddInvestment = () => {
    if (fundsError) {
      setErrorMessage("Unable to load funds data. Please try again.");
      return;
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleInvestmentSubmit = async (data: InvestmentFormData) => {
    try {
      // Find the selected fund to get the fund name
      const selectedFund = funds?.find((fund) => fund.fundId === data.fundId);

      if (!selectedFund) {
        setErrorMessage("Selected fund not found. Please try again.");
        return;
      }

      await updateInvestment({
        amount: data.amount,
        fundId: data.fundId,
        fundName: selectedFund.fundName,
      }).unwrap();

      setIsFormOpen(false);
      setSuccessMessage("Investment added successfully!");
    } catch (error: unknown) {
      const errorMsg =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to add investment"
          : "Failed to add investment";
      setErrorMessage(errorMsg);
    }
  };

  const handleClearFunds = async () => {
    try {
      await clearInvestment().unwrap();
      setSuccessMessage("All investments cleared successfully!");
    } catch (error: unknown) {
      const errorMsg =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to clear investments"
          : "Failed to clear investments";
      setErrorMessage(errorMsg);
    }
  };

  // Check if user has investments to show clear button
  const hasInvestments =
    userInvestment.totalInvestment > 0 && userInvestment.fundsList.length > 0;

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <CustomerAppBar customerName={customerName} isLoading={isLoading} />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ py: 4 }}>
          {/* Show funds error if exists */}
          {fundsError && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Unable to load funds data. Some features may be limited.
            </Alert>
          )}

          <InvestmentCard
            userInvestment={userInvestment}
            isLoading={isLoading}
            onAddInvestment={handleAddInvestment}
          />

          {hasInvestments && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearFunds}
                disabled={isClearing}
                sx={{
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    borderColor: "error.dark",
                    backgroundColor: "error.light",
                    color: "error.dark",
                  },
                }}
              >
                {isClearing ? "Clearing..." : "Clear All Funds"}
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <AddInvestmentForm
        open={isFormOpen}
        onClose={handleCloseForm}
        currentInvestment={userInvestment}
        onSubmit={handleInvestmentSubmit}
        isSubmitting={isUpdating}
      />

      {/* Success/Error Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
