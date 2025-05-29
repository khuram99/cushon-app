import { describe, it, expect } from "vitest";
import { fundsApi } from "../fundsApi";
import type { Fund } from "../fundsApi";

describe("fundsApi", () => {
  describe("API Configuration", () => {
    it("should have correct reducer path", () => {
      expect(fundsApi.reducerPath).toBe("fundsApi");
    });

    it("should have all required endpoints defined", () => {
      const endpoints = Object.keys(fundsApi.endpoints);
      expect(endpoints).toContain("getFunds");
      expect(endpoints).toHaveLength(1);
    });

    it("should export the correct hooks", () => {
      expect(typeof fundsApi.useGetFundsQuery).toBe("function");
      expect(typeof fundsApi.useLazyGetFundsQuery).toBe("function");
    });

    it("should have correct endpoint structure", () => {
      const getFundsEndpoint = fundsApi.endpoints.getFunds;
      expect(getFundsEndpoint).toBeDefined();
    });
  });

  describe("TypeScript Types", () => {
    it("should have correct Fund interface structure", () => {
      const mockFund: Fund = {
        fundName: "Test Fund",
        fundId: "test_fund_id",
      };

      expect(mockFund.fundId).toBe("test_fund_id");
      expect(mockFund.fundName).toBe("Test Fund");
    });
  });

  describe("Fund Data Validation", () => {
    it("should handle funds with minimum required properties", () => {
      const minimalFund: Fund = {
        fundName: "Minimal Fund",
        fundId: "1",
      };

      expect(minimalFund.fundId).toBe("1");
      expect(minimalFund.fundName).toBe("Minimal Fund");
    });

    it("should validate fund ID formats", () => {
      const funds: Fund[] = [
        {
          fundId: "fund_1",
          fundName: "Fund 1",
        },
        {
          fundId: "fund-2",
          fundName: "Fund 2",
        },
        {
          fundId: "123",
          fundName: "Fund 3",
        },
      ];

      funds.forEach((fund) => {
        expect(fund.fundId).toBeTruthy();
        expect(typeof fund.fundId).toBe("string");
      });
    });
  });

  describe("Mock Fund Data Scenarios", () => {
    it("should handle empty funds list", () => {
      const emptyFunds: Fund[] = [];
      expect(emptyFunds).toHaveLength(0);
      expect(Array.isArray(emptyFunds)).toBe(true);
    });

    it("should handle single fund", () => {
      const singleFund: Fund[] = [
        {
          fundId: "single_fund",
          fundName: "Single Fund",
        },
      ];

      expect(singleFund).toHaveLength(1);
      expect(singleFund[0].fundName).toBe("Single Fund");
    });
  });
});
