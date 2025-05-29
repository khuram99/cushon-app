import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface FundInvestment {
  fundName: string;
  fundId: string;
  investedAmount: number;
}

export interface UserInvestment {
  totalInvestment: number;
  fundsList: FundInvestment[];
}

export interface RetailCustomerData {
  firstName: string;
  lastName: string;
  memberSince: string;
  userInvestment: UserInvestment;
}

// Helper function to save user investment data to localStorage
export const saveUserInvestmentToStorage = (
  userInvestment: UserInvestment
): void => {
  try {
    localStorage.setItem("userInvestment", JSON.stringify(userInvestment));
  } catch (error) {
    console.error("Failed to save userInvestment to localStorage:", error);
  }
};

// Helper function to get user investment data from localStorage
const getUserInvestmentFromStorage = (): UserInvestment => {
  try {
    const storedData = localStorage.getItem("userInvestment");
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Failed to parse userInvestment from localStorage:", error);
  }

  // Return default if no data or error
  return {
    totalInvestment: 0,
    fundsList: [],
  };
};

export const retailApi = createApi({
  reducerPath: "retailApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/", // This would be your actual API base URL
  }),
  tagTypes: ["RetailCustomerData"],
  endpoints: (builder) => ({
    getRetailCustomerData: builder.query<RetailCustomerData, void>({
      queryFn: async () => {
        // Get user investment data from localStorage
        const userInvestment = getUserInvestmentFromStorage();
        // Return stub response with localStorage data
        return {
          data: {
            firstName: "John",
            lastName: "Doe",
            memberSince: "2023",
            userInvestment,
          },
        };
      },
      providesTags: ["RetailCustomerData"],
    }),

    updateInvestment: builder.mutation<
      RetailCustomerData,
      { amount: number; fundId: string; fundName: string }
    >({
      queryFn: async ({ amount, fundId, fundName }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
          // Get current investment data from localStorage
          const currentData = getUserInvestmentFromStorage();

          // Calculate new total investment
          const newTotalInvestment = currentData.totalInvestment + amount;

          // Check if fund already exists in the list
          const existingFundIndex = currentData.fundsList.findIndex(
            (fund) => fund.fundId === fundId
          );

          let updatedFundsList;
          if (existingFundIndex >= 0) {
            // Update existing fund
            updatedFundsList = currentData.fundsList.map((fund, index) =>
              index === existingFundIndex
                ? { ...fund, investedAmount: fund.investedAmount + amount }
                : fund
            );
          } else {
            // Add new fund
            updatedFundsList = [
              ...currentData.fundsList,
              { fundId, fundName, investedAmount: amount },
            ];
          }

          // Save updated investment data
          const updatedInvestment = {
            totalInvestment: newTotalInvestment,
            fundsList: updatedFundsList,
          };

          saveUserInvestmentToStorage(updatedInvestment);

          // Return updated customer data
          return {
            data: {
              firstName: "John",
              lastName: "Doe",
              memberSince: "2023",
              userInvestment: updatedInvestment,
            },
          };
        } catch {
          return {
            error: {
              status: 500,
              data: { message: "Failed to update investment" },
            },
          };
        }
      },
      invalidatesTags: ["RetailCustomerData"],
    }),

    clearInvestment: builder.mutation<RetailCustomerData, void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          // Reset investment data to empty state
          const clearedInvestment = {
            totalInvestment: 0,
            fundsList: [],
          };

          // Save cleared investment data to localStorage
          saveUserInvestmentToStorage(clearedInvestment);

          // Return updated customer data with cleared investment
          return {
            data: {
              firstName: "John",
              lastName: "Doe",
              memberSince: "2023",
              userInvestment: clearedInvestment,
            },
          };
        } catch {
          return {
            error: {
              status: 500,
              data: { message: "Failed to clear investment" },
            },
          };
        }
      },
      invalidatesTags: ["RetailCustomerData"],
    }),
  }),
});

export const {
  useLazyGetRetailCustomerDataQuery,
  useUpdateInvestmentMutation,
  useClearInvestmentMutation,
} = retailApi;
