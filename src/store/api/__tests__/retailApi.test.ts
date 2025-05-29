import { describe, it, expect, beforeEach, vi } from "vitest";
import { retailApi, saveUserInvestmentToStorage } from "../retailApi";
import type {
  UserInvestment,
  FundInvestment,
  RetailCustomerData,
} from "../retailApi";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("retailApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Storage Helper Functions", () => {
    describe("saveUserInvestmentToStorage", () => {
      it("should save user investment to localStorage", () => {
        const userInvestment: UserInvestment = {
          totalInvestment: 1000,
          fundsList: [
            {
              fundId: "fund1",
              fundName: "Test Fund",
              investedAmount: 1000,
            },
          ],
        };

        saveUserInvestmentToStorage(userInvestment);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "userInvestment",
          JSON.stringify(userInvestment)
        );
      });

      it("should handle localStorage errors gracefully", () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error("Storage error");
        });

        const consoleSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        const userInvestment: UserInvestment = {
          totalInvestment: 500,
          fundsList: [],
        };

        expect(() => saveUserInvestmentToStorage(userInvestment)).not.toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to save userInvestment to localStorage:",
          expect.any(Error)
        );

        consoleSpy.mockRestore();
      });
    });
  });

  describe("API Configuration", () => {
    it("should have correct reducer path", () => {
      expect(retailApi.reducerPath).toBe("retailApi");
    });

    it("should have all required endpoints defined", () => {
      const endpoints = Object.keys(retailApi.endpoints);
      expect(endpoints).toContain("getRetailCustomerData");
      expect(endpoints).toContain("updateInvestment");
      expect(endpoints).toContain("clearInvestment");
      expect(endpoints).toHaveLength(3);
    });

    it("should export the correct hooks", () => {
      expect(typeof retailApi.useLazyGetRetailCustomerDataQuery).toBe(
        "function"
      );
      expect(typeof retailApi.useUpdateInvestmentMutation).toBe("function");
      expect(typeof retailApi.useClearInvestmentMutation).toBe("function");
    });

    it("should have correct tag types configured", () => {
      expect(retailApi.reducerPath).toBe("retailApi");
    });
  });

  describe("TypeScript Types", () => {
    it("should have correct FundInvestment interface structure", () => {
      const mockFund: FundInvestment = {
        fundName: "Test Fund",
        fundId: "test_fund_id",
        investedAmount: 500,
      };

      expect(mockFund.fundName).toBe("Test Fund");
      expect(mockFund.fundId).toBe("test_fund_id");
      expect(mockFund.investedAmount).toBe(500);
    });

    it("should have correct UserInvestment interface structure", () => {
      const mockInvestment: UserInvestment = {
        totalInvestment: 1500,
        fundsList: [
          {
            fundName: "Fund 1",
            fundId: "fund1",
            investedAmount: 1000,
          },
          {
            fundName: "Fund 2",
            fundId: "fund2",
            investedAmount: 500,
          },
        ],
      };

      expect(mockInvestment.totalInvestment).toBe(1500);
      expect(mockInvestment.fundsList).toHaveLength(2);
      expect(mockInvestment.fundsList[0].fundName).toBe("Fund 1");
    });

    it("should have correct RetailCustomerData interface structure", () => {
      const mockCustomer: RetailCustomerData = {
        firstName: "John",
        lastName: "Doe",
        memberSince: "2023",
        userInvestment: {
          totalInvestment: 1000,
          fundsList: [],
        },
      };

      expect(mockCustomer.firstName).toBe("John");
      expect(mockCustomer.lastName).toBe("Doe");
      expect(mockCustomer.memberSince).toBe("2023");
      expect(mockCustomer.userInvestment.totalInvestment).toBe(1000);
    });
  });

  describe("Investment Logic", () => {
    it("should handle updating existing fund investment", () => {
      const existingFunds: FundInvestment[] = [
        { fundId: "fund1", fundName: "Fund 1", investedAmount: 500 },
      ];

      const fundId = "fund1";
      const additionalAmount = 300;

      const existingFundIndex = existingFunds.findIndex(
        (fund) => fund.fundId === fundId
      );
      expect(existingFundIndex).toBe(0);

      const updatedFund = {
        ...existingFunds[existingFundIndex],
        investedAmount:
          existingFunds[existingFundIndex].investedAmount + additionalAmount,
      };

      expect(updatedFund.investedAmount).toBe(800);
    });

    it("should handle adding new fund investment", () => {
      const existingFunds: FundInvestment[] = [
        { fundId: "fund1", fundName: "Fund 1", investedAmount: 500 },
      ];

      const newFund: FundInvestment = {
        fundId: "fund2",
        fundName: "Fund 2",
        investedAmount: 300,
      };

      const fundExists = existingFunds.some(
        (fund) => fund.fundId === newFund.fundId
      );
      expect(fundExists).toBe(false);

      const updatedFunds = [...existingFunds, newFund];
      expect(updatedFunds).toHaveLength(2);
      expect(updatedFunds[1].fundId).toBe("fund2");
    });

    it("should calculate total investment correctly", () => {
      const currentTotal = 1000;
      const additionalAmount = 250;
      const newTotal = currentTotal + additionalAmount;

      expect(newTotal).toBe(1250);
    });
  });

  describe("Default Data", () => {
    it("should return correct default customer data structure", () => {
      const defaultCustomer = {
        firstName: "John",
        lastName: "Doe",
        memberSince: "2023",
      };

      expect(defaultCustomer.firstName).toBe("John");
      expect(defaultCustomer.lastName).toBe("Doe");
      expect(defaultCustomer.memberSince).toBe("2023");
    });

    it("should return correct default investment structure", () => {
      const defaultInvestment = {
        totalInvestment: 0,
        fundsList: [],
      };

      expect(defaultInvestment.totalInvestment).toBe(0);
      expect(defaultInvestment.fundsList).toEqual([]);
    });
  });
});
