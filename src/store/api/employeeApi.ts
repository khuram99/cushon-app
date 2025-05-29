import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface EmployeeData {
  userName: string;
  company: string;
}

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/", // This would be your actual API base URL
  }),
  endpoints: (builder) => ({
    getEmployeeData: builder.query<EmployeeData, void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return stub response. This can be replaced with actual API call
        return {
          data: {
            userName: "employee_1",
            company: "Dummy Corporation",
          },
        };
      },
    }),
  }),
});

export const { useLazyGetEmployeeDataQuery } = employeeApi;
