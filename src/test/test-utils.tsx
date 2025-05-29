import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../store/slices/userSlice";
import type { UserState } from "../store/slices/userSlice";

// Create a simple mock store for testing
export const createMockStore = (userState?: Partial<UserState>) => {
  const defaultUserState: UserState = {
    email: null,
    userType: null,
    isLoggedIn: false,
    sessionId: null,
    isInitialized: true,
  };

  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: {
      user: { ...defaultUserState, ...userState },
    },
  });
};

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  userState?: Partial<UserState>;
  store?: ReturnType<typeof createMockStore>;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    userState = {},
    store = createMockStore(userState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Re-export everything from React Testing Library
export * from "@testing-library/react";

// Override render export
export { renderWithProviders as render };
