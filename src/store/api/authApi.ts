import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginRequest {
  email: string;
  password: string;
  userType: "employee" | "retail";
}

export interface LoginResponse {
  success: boolean;
  user: {
    email: string;
    userType: "employee" | "retail";
    sessionId: string;
  };
  message?: string;
}

export interface AuthSession {
  email: string;
  userType: "employee" | "retail";
  sessionId: string;
  timestamp: number;
}

// Session storage key
const SESSION_STORAGE_KEY = "auth_session";

// Helper functions for session storage
export const saveSession = (session: AuthSession): void => {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session to storage:", error);
  }
};

export const getSession = (): AuthSession | null => {
  try {
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;

    const session: AuthSession = JSON.parse(sessionData);

    // Check if session is expired (24 hours)
    const isExpired = Date.now() - session.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to get session from storage:", error);
    return null;
  }
};

export const clearSession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session from storage:", error);
  }
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async (credentials) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { email, password, userType } = credentials;

        // Get credentials from environment variables
        const validCredentials = {
          employee: {
            email: import.meta.env.VITE_EMPLOYEE_EMAIL || "employee@cushon.com",
            password:
              import.meta.env.VITE_EMPLOYEE_PASSWORD || "StrongPassword123",
          },
          retail: {
            email: import.meta.env.VITE_RETAIL_EMAIL || "customer@retail.com",
            password:
              import.meta.env.VITE_RETAIL_PASSWORD || "StrongPassword123",
          },
        };

        const validUser = validCredentials[userType];

        if (email !== validUser.email || password !== validUser.password) {
          return {
            error: {
              status: 401,
              data: {
                success: false,
                message: "Invalid email or password. Please try again.",
              },
            },
          };
        }

        // Generate a mock session ID
        const sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 11)}`;

        // Create session data
        const sessionData: AuthSession = {
          email,
          userType,
          sessionId,
          timestamp: Date.now(),
        };

        // Save to session storage
        saveSession(sessionData);

        // Return successful response
        return {
          data: {
            success: true,
            user: {
              email,
              userType,
              sessionId,
            },
          },
        };
      },
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Clear session storage
        clearSession();

        return {
          data: { success: true },
        };
      },
    }),

    validateSession: builder.query<AuthSession | null, void>({
      queryFn: async () => {
        // Check session storage
        const session = getSession();

        if (!session) {
          return { data: null };
        }

        // In a real app, you might validate the session with the server
        // For now, we'll just return the stored session if it exists and is valid
        return { data: session };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useValidateSessionQuery,
  useLazyValidateSessionQuery,
} = authApi;
