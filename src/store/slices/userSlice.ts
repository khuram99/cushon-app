import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "../api/authApi";

export interface UserState {
  email: string | null;
  userType: "employee" | "retail" | null;
  isLoggedIn: boolean;
  sessionId: string | null;
  isInitialized: boolean;
}

// Initialize state from session storage
const getInitialState = (): UserState => {
  const session = getSession();

  if (session) {
    return {
      email: session.email,
      userType: session.userType,
      isLoggedIn: true,
      sessionId: session.sessionId,
      isInitialized: true,
    };
  }

  return {
    email: null,
    userType: null,
    isLoggedIn: false,
    sessionId: null,
    isInitialized: true,
  };
};

const initialState: UserState = getInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<{
        email: string;
        userType: "employee" | "retail";
        sessionId: string;
      }>
    ) => {
      state.email = action.payload.email;
      state.userType = action.payload.userType;
      state.sessionId = action.payload.sessionId;
      state.isLoggedIn = true;
      state.isInitialized = true;
    },
    clearUserData: (state) => {
      state.email = null;
      state.userType = null;
      state.sessionId = null;
      state.isLoggedIn = false;
      state.isInitialized = true;
    },
    initializeAuth: (state) => {
      const session = getSession();
      if (session) {
        state.email = session.email;
        state.userType = session.userType;
        state.sessionId = session.sessionId;
        state.isLoggedIn = true;
      }
      state.isInitialized = true;
    },
  },
});

export const { setUserData, clearUserData, initializeAuth } = userSlice.actions;
export default userSlice.reducer;
