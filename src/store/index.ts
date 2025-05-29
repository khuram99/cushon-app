import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { employeeApi } from "./api/employeeApi";
import { retailApi } from "./api/retailApi";
import { authApi } from "./api/authApi";
import { fundsApi } from "./api/fundsApi";
import { regionApi } from "./api/regionApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [retailApi.reducerPath]: retailApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [fundsApi.reducerPath]: fundsApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      employeeApi.middleware,
      retailApi.middleware,
      authApi.middleware,
      fundsApi.middleware,
      regionApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
