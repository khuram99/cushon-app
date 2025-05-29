import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./redux";
import { setUserData } from "../store/slices/userSlice";
import { useLazyGetEmployeeDataQuery } from "../store/api/employeeApi";
import { useLazyGetRetailCustomerDataQuery } from "../store/api/retailApi";
import { useLoginMutation } from "../store/api/authApi";
import { ROUTES } from "../constants";

export interface LoginFormData {
  email: string;
  password: string;
}

export type UserType = "employee" | "retail";

export const useLoginForm = (userType: UserType) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Auth API
  const [login, { isLoading: isLoggingIn, error: loginError }] =
    useLoginMutation();

  // Always call both hooks to maintain consistent hook order
  const [
    getEmployeeData,
    { data: employeeData, isLoading: isLoadingEmployeeData },
  ] = useLazyGetEmployeeDataQuery();

  const [
    getRetailCustomerData,
    { data: retailCustomerData, isLoading: isLoadingRetailData },
  ] = useLazyGetRetailCustomerDataQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return true;
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Call the auth API
      const result = await login({
        email: data.email,
        password: data.password,
        userType,
      }).unwrap();

      if (result.success) {
        // Store user data in Redux
        dispatch(
          setUserData({
            email: result.user.email,
            userType: result.user.userType,
            sessionId: result.user.sessionId,
          })
        );

        // Trigger appropriate API data fetch based on user type
        if (userType === "employee") {
          getEmployeeData();
        } else if (userType === "retail") {
          getRetailCustomerData();
        }

        // Navigate to appropriate page based on user type
        navigate(userType === "employee" ? ROUTES.EMPLOYEE : ROUTES.RETAIL);

        reset();
      }
    } catch (error) {
      // Error is handled by RTK Query and available in loginError
      console.error("Login failed:", error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const getDemoCredentials = () => ({
    email:
      userType === "employee"
        ? import.meta.env.VITE_EMPLOYEE_EMAIL || "employee@cushon.com"
        : import.meta.env.VITE_RETAIL_EMAIL || "customer@retail.com",
    password:
      userType === "employee"
        ? import.meta.env.VITE_EMPLOYEE_PASSWORD || "StrongPassword123"
        : import.meta.env.VITE_RETAIL_PASSWORD || "StrongPassword123",
    userTypeLabel: userType === "employee" ? "Employee" : "Retail Customer",
  });

  // Format login error message
  const getLoginErrorMessage = () => {
    if (loginError && "data" in loginError) {
      const errorData = loginError.data as { message?: string };
      return (
        errorData.message || "An error occurred during login. Please try again."
      );
    }
    if (loginError) {
      return "An error occurred during login. Please try again.";
    }
    return null;
  };

  // Return only relevant data based on user type to avoid confusion
  return {
    control,
    errors,
    isSubmitting: isLoggingIn,
    loginError: getLoginErrorMessage(),
    showPassword,
    handleSubmit: handleSubmit(onSubmit),
    validateEmail,
    validatePassword,
    togglePasswordVisibility,
    getDemoCredentials,
    // Return data based on user type
    ...(userType === "employee"
      ? { employeeData, isLoadingEmployeeData }
      : { retailCustomerData, isLoadingRetailData }),
  };
};
