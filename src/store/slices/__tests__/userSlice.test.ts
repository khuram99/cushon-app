import { describe, it, expect, beforeEach, vi } from "vitest";
import userSlice, {
  setUserData,
  clearUserData,
  initializeAuth,
} from "../userSlice";
import type { UserState } from "../userSlice";
import * as authApi from "../../api/authApi";

// Mock the authApi module
vi.mock("../../api/authApi", () => ({
  getSession: vi.fn(),
}));

const mockGetSession = vi.mocked(authApi.getSession);

describe("userSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should return initial state with no session", () => {
      mockGetSession.mockReturnValue(null);

      // Since the initial state is created at module load, we need to test the reducer behavior
      const state = userSlice(undefined, { type: "@@INIT" });

      expect(state.email).toBeNull();
      expect(state.userType).toBeNull();
      expect(state.isLoggedIn).toBe(false);
      expect(state.sessionId).toBeNull();
      expect(state.isInitialized).toBe(true);
    });
  });

  describe("setUserData action", () => {
    it("should set user data and login status", () => {
      const initialState: UserState = {
        email: null,
        userType: null,
        isLoggedIn: false,
        sessionId: null,
        isInitialized: false,
      };

      const userData = {
        email: "test@example.com",
        userType: "employee" as const,
        sessionId: "session123",
      };

      const action = setUserData(userData);
      const newState = userSlice(initialState, action);

      expect(newState.email).toBe("test@example.com");
      expect(newState.userType).toBe("employee");
      expect(newState.sessionId).toBe("session123");
      expect(newState.isLoggedIn).toBe(true);
      expect(newState.isInitialized).toBe(true);
    });

    it("should handle retail user type", () => {
      const initialState: UserState = {
        email: null,
        userType: null,
        isLoggedIn: false,
        sessionId: null,
        isInitialized: false,
      };

      const userData = {
        email: "retail@example.com",
        userType: "retail" as const,
        sessionId: "session456",
      };

      const action = setUserData(userData);
      const newState = userSlice(initialState, action);

      expect(newState.userType).toBe("retail");
    });
  });

  describe("clearUserData action", () => {
    it("should clear all user data and set logged out status", () => {
      const initialState: UserState = {
        email: "test@example.com",
        userType: "employee",
        isLoggedIn: true,
        sessionId: "session123",
        isInitialized: true,
      };

      const action = clearUserData();
      const newState = userSlice(initialState, action);

      expect(newState.email).toBeNull();
      expect(newState.userType).toBeNull();
      expect(newState.sessionId).toBeNull();
      expect(newState.isLoggedIn).toBe(false);
      expect(newState.isInitialized).toBe(true);
    });
  });

  describe("initializeAuth action", () => {
    it("should initialize with session data when session exists", () => {
      const mockSession = {
        email: "session@example.com",
        userType: "retail" as const,
        sessionId: "session789",
        timestamp: Date.now(),
      };

      mockGetSession.mockReturnValue(mockSession);

      const initialState: UserState = {
        email: null,
        userType: null,
        isLoggedIn: false,
        sessionId: null,
        isInitialized: false,
      };

      const action = initializeAuth();
      const newState = userSlice(initialState, action);

      expect(newState.email).toBe("session@example.com");
      expect(newState.userType).toBe("retail");
      expect(newState.sessionId).toBe("session789");
      expect(newState.isLoggedIn).toBe(true);
      expect(newState.isInitialized).toBe(true);
    });

    it("should initialize without session data when no session exists", () => {
      mockGetSession.mockReturnValue(null);

      const initialState: UserState = {
        email: null,
        userType: null,
        isLoggedIn: false,
        sessionId: null,
        isInitialized: false,
      };

      const action = initializeAuth();
      const newState = userSlice(initialState, action);

      expect(newState.email).toBeNull();
      expect(newState.userType).toBeNull();
      expect(newState.sessionId).toBeNull();
      expect(newState.isLoggedIn).toBe(false);
      expect(newState.isInitialized).toBe(true);
    });
  });
});
