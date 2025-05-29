import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface RegionConfig {
  country: string;
  currency: string;
  currencySymbol: string;
  maxInvestmentAmount: number;
}

export const regionApi = createApi({
  reducerPath: "regionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/region/",
  }),
  endpoints: (builder) => ({
    getRegionConfig: builder.query<RegionConfig, void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Return UK region configuration
        return {
          data: {
            country: "UK",
            currency: "GBP",
            currencySymbol: "£",
            maxInvestmentAmount: 20000,
          },
        };
      },
    }),
  }),
});

export const { useGetRegionConfigQuery } = regionApi;
