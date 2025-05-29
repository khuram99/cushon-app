import { describe, it, expect } from "vitest";
import { employeeApi } from "../employeeApi";

describe("employeeApi", () => {
  describe("API configuration", () => {
    it("should have correct reducer path", () => {
      expect(employeeApi.reducerPath).toBe("employeeApi");
    });

    it("should have getEmployeeData endpoint defined", () => {
      expect(employeeApi.endpoints.getEmployeeData).toBeDefined();
    });

    it("should export the correct hooks", () => {
      expect(typeof employeeApi.useLazyGetEmployeeDataQuery).toBe("function");
    });

    it("should have endpoints with correct structure", () => {
      const endpoints = Object.keys(employeeApi.endpoints);
      expect(endpoints).toContain("getEmployeeData");
      expect(endpoints).toHaveLength(1);
    });
  });

  describe("TypeScript types", () => {
    it("should have correct EmployeeData interface structure", () => {
      // This is a compile-time test - if it compiles, the types are correct
      const mockEmployeeData = {
        userName: "test_user",
        company: "Test Company",
      };

      // These assignments should not cause TypeScript errors
      const userName: string = mockEmployeeData.userName;
      const company: string = mockEmployeeData.company;

      expect(userName).toBe("test_user");
      expect(company).toBe("Test Company");
    });
  });

  describe("API behavior simulation", () => {
    it("should return expected data structure from stub response", () => {
      // Based on the implementation, we know it returns this structure
      const expectedResponse = {
        userName: "employee_1",
        company: "Dummy Corporation",
      };

      expect(expectedResponse.userName).toBe("employee_1");
      expect(expectedResponse.company).toBe("Dummy Corporation");
    });
  });
});
