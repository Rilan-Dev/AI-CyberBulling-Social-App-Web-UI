"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { UserProfile } from "@/Model/users.model";

import { userService } from "@/services/user.service";

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token && !refreshToken) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // If we have a token, try to get the current user
        try {
          const userData = await userService.getCurrentUser();
          if (userData) {
            setUserProfile(userData);
            setIsAuthenticated(true);
          } else {
            // If userData is null, clear tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("Error getting current user:", err);
          // Clear tokens if getting user fails
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    console.log("AuthContext: login called for", username);
    setLoading(true);
    setError(null);

    try {
      console.log("AuthContext: calling userService.login");
      const loginResponse = await userService.login(username, password);
      console.log("AuthContext: userService.login response received", loginResponse);

      if (loginResponse) {
        // Get user data
        const userData = await userService.getCurrentUser();
        if (userData) {
          setUserProfile(userData);
          setIsAuthenticated(true);

          // Redirect to home or the original requested page
          const params = new URLSearchParams(window.location.search);
          const redirectPath = params.get("redirect") || "/cyberbulling/home";
          router.push(redirectPath);
        } else {
          return Promise.reject("Failed to get user data after login");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Invalid username or password"
      );
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      await userService.register(userData);
      // After registration, log the user in
      await login(userData.username, userData.password);
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.response?.data) {
        // Format Django REST Framework validation errors
        const errors = err.response.data;
        const errorMessages = Object.entries(errors)
          .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
          .join("; ");
        setError(errorMessages);
      } else {
        setError("Registration failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await userService.logout();
      setUserProfile(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Even if there's an error, clear the user state
      setUserProfile(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
