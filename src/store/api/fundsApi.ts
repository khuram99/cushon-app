import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Fund {
  fundName: string;
  fundId: string;
}

export const fundsApi = createApi({
  reducerPath: "fundsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/funds/",
  }),
  endpoints: (builder) => ({
    getFunds: builder.query<Fund[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock response
        const mockFunds: Fund[] = [
          {
            fundName: "Cushon Equity Fund",
            fundId: "demo_fund_cushon",
          },
        ];

        return { data: mockFunds };
      },
    }),
  }),
});

export const { useGetFundsQuery, useLazyGetFundsQuery } = fundsApi;
