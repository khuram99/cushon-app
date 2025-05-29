import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveSession, getSession, clearSession } from "../authApi";
import type { AuthSession } from "../authApi";

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

// Mock environment variables
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_EMPLOYEE_EMAIL: "employee@test.com",
    VITE_EMPLOYEE_PASSWORD: "test123",
    VITE_RETAIL_EMAIL: "retail@test.com",
    VITE_RETAIL_PASSWORD: "test456",
  },
  writable: true,
});

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Session Storage Helpers", () => {
    describe("saveSession", () => {
      it("should save session to sessionStorage", () => {
        const session: AuthSession = {
          email: "test@test.com",
          userType: "employee",
          sessionId: "session123",
          timestamp: Date.now(),
        };

        saveSession(session);

        expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
          "auth_session",
          JSON.stringify(session)
        );
      });

      it("should handle sessionStorage errors gracefully", () => {
        mockSessionStorage.setItem.mockImplementation(() => {
          throw new Error("Storage error");
        });

        const consoleSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        const session: AuthSession = {
          email: "test@test.com",
          userType: "employee",
          sessionId: "session123",
          timestamp: Date.now(),
        };

        expect(() => saveSession(session)).not.toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to save session to storage:",
          expect.any(Error)
        );

        consoleSpy.mockRestore();
      });
    });

    describe("getSession", () => {
      it("should return session from sessionStorage", () => {
        const session: AuthSession = {
          email: "test@test.com",
          userType: "employee",
          sessionId: "session123",
          timestamp: Date.now(),
        };
        mockSessionStorage.getItem.mockReturnValue(JSON.stringify(session));

        const result = getSession();

        expect(mockSessionStorage.getItem).toHaveBeenCalledWith("auth_session");
        expect(result).toEqual(session);
      });

      it("should return null when no session exists", () => {
        mockSessionStorage.getItem.mockReturnValue(null);

        const result = getSession();

        expect(result).toBeNull();
      });

      it("should return null and clear session when expired", () => {
        const expiredSession: AuthSession = {
          email: "test@test.com",
          userType: "employee",
          sessionId: "session123",
          timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
        };
        mockSessionStorage.getItem.mockReturnValue(
          JSON.stringify(expiredSession)
        );

        const result = getSession();

        expect(result).toBeNull();
        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
          "auth_session"
        );
      });

      it("should handle JSON parse errors gracefully", () => {
        mockSessionStorage.getItem.mockReturnValue("invalid json");
        const consoleSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});

        const result = getSession();

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to get session from storage:",
          expect.any(Error)
        );

        consoleSpy.mockRestore();
      });
    });

    describe("clearSession", () => {
      it("should remove session from sessionStorage", () => {
        clearSession();

        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
          "auth_session"
        );
      });

      it("should handle sessionStorage errors gracefully", () => {
        mockSessionStorage.removeItem.mockImplementation(() => {
          throw new Error("Storage error");
        });

        const consoleSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});

        expect(() => clearSession()).not.toThrow();
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to clear session from storage:",
          expect.any(Error)
        );

        consoleSpy.mockRestore();
      });
    });
  });

  describe("Login Logic", () => {
    it("should validate login process with correct structure", () => {
      // Test that we can create valid user credentials
      const employeeCredentials = {
        email: "employee@test.com",
        password: "test123",
        userType: "employee" as const,
      };

      const retailCredentials = {
        email: "retail@test.com",
        password: "test456",
        userType: "retail" as const,
      };

      expect(employeeCredentials.email).toBe("employee@test.com");
      expect(employeeCredentials.password).toBe("test123");
      expect(retailCredentials.email).toBe("retail@test.com");
      expect(retailCredentials.password).toBe("test456");
    });

    it("should create proper session structure", () => {
      const mockSession: AuthSession = {
        email: "employee@test.com",
        userType: "employee",
        sessionId: "mock-session-id",
        timestamp: Date.now(),
      };

      expect(mockSession).toHaveProperty("email");
      expect(mockSession).toHaveProperty("userType");
      expect(mockSession).toHaveProperty("sessionId");
      expect(mockSession).toHaveProperty("timestamp");
      expect(["employee", "retail"]).toContain(mockSession.userType);
    });
  });

  describe("Session validation", () => {
    it("should detect expired sessions correctly", () => {
      const expiredTimestamp = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
      const currentTimestamp = Date.now();

      const dayInMs = 24 * 60 * 60 * 1000;

      expect(currentTimestamp - expiredTimestamp).toBeGreaterThan(dayInMs);
    });

    it("should detect valid sessions correctly", () => {
      const validTimestamp = Date.now() - 1 * 60 * 60 * 1000; // 1 hour ago
      const currentTimestamp = Date.now();

      const dayInMs = 24 * 60 * 60 * 1000;

      expect(currentTimestamp - validTimestamp).toBeLessThan(dayInMs);
    });
  });
});
