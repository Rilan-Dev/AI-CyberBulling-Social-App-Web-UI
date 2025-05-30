"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link"
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { EnhancedThemeSwitcher } from "@/lib/Theme-Switcher/enhanced-theme-switcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Icons for the feature panels
const DataCatalogIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 5H21V7H3V5ZM3 11H21V13H3V11ZM3 17H21V19H3V17Z"
      fill="currentColor"
    />
  </svg>
);

const DataQualityIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 19H19V5H5V19ZM3 3H21V21H3V3ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z"
      fill="currentColor"
    />
  </svg>
);

const ReferenceDataIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3H11V11H3V3ZM3 13H11V21H3V13ZM13 3H21V11H13V3ZM13 13H21V21H13V13Z"
      fill="currentColor"
    />
  </svg>
);

// Feature panel data
const featurePanels = [
  {
    title: "Data Catalog Management",
    description:
      "Discover, understand, and manage your data assets through comprehensive metadata management.",
    icon: <DataCatalogIcon />,
    features: [
      "Multiple data source connections",
      "Data profiling and analysis",
      "Advanced validation rules",
      "Role-based access control",
    ],
  },
  {
    title: "Data Quality Management",
    description:
      "Monitor, maintain, and improve your data quality through profiling, validation, and standardization.",
    icon: <DataQualityIcon />,
    features: [
      "Multiple data source connections",
      "Data profiling and analysis",
      "Advanced validation rules",
      "Role-based access control",
    ],
  },
  {
    title: "Reference Data Management",
    description:
      "Centralize and standardize the management of critical data assets, such as reference data and master data.",
    icon: <ReferenceDataIcon />,
    features: [
      "Single source of truth for reference data",
      "Validation rules for data accuracy",
      "Data lineage and change tracking",
      "Versioning for historical changes",
    ],
  },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activePanel, setActivePanel] = useState(0);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-rotate panels every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePanel((prev) => (prev + 1) % featurePanels.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get the redirect path from URL if available
  const redirectTo = searchParams?.get("redirectTo") || "/MasterPage";

  // Check if user is already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push(redirectTo);
  //   }
  // }, [isAuthenticated, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // await login(username, password);
      // After successful login, redirect to the redirectTo path
      router.push(redirectTo);
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if we're in dark mode
  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");

  // Determine if we're using a gradient theme
  const isGradientTheme =
    mounted && (theme === "royal-blue" || theme === "sky-blue-dark");

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <div className="w-full max-w-6xl flex rounded-xl shadow-xl overflow-hidden min-h-[600px]">
        {/* Left side - Login form */}
        <div
          className={cn(
            "w-full md:w-1/2 p-8 flex flex-col justify-center",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}
        >
          <div className="max-w-md mx-auto w-full py-8">
            <h1
              className={cn(
                "text-3xl font-bold text-center mb-8",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              Sign In
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User
                    className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    )}
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Login*"
                  className={cn(
                    "w-full pl-10 pr-3 py-3.5 rounded-md transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:border-transparent",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                    isGradientTheme && "focus:ring-[#0288d1]"
                  )}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock
                    className={cn(
                      "h-5 w-5",
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    )}
                  />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password*"
                  className={cn(
                    "w-full pl-10 pr-10 py-3.5 rounded-md transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:border-transparent",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                    isGradientTheme && "focus:ring-[#0288d1]"
                  )}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isDarkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                      )}
                    />
                  ) : (
                    <Eye
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isDarkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                      )}
                    />
                  )}
                </Button>
              </div>

              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 font-medium rounded-md transition-all duration-300",
                  "shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
                  {
                    // Royal Blue gradient theme
                    "bg-gradient-to-r from-[#0288d1] to-[#01579b] hover:from-[#039be5] hover:to-[#0277bd] text-white":
                      isGradientTheme && theme === "royal-blue",

                    // Sky Blue Dark gradient theme
                    "bg-gradient-to-r from-[#90CAF9] to-[#82B1FF] hover:from-[#82B1FF] hover:to-[#90CAF9] text-[#0f2027]":
                      isGradientTheme && theme === "sky-blue-dark",

                    // Dark mode (non-gradient)
                    "bg-blue-600 hover:bg-blue-700 text-white":
                      isDarkMode && !isGradientTheme,

                    // Light mode (non-gradient)
                    "bg-primary hover:bg-primary/90 text-primary-foreground":
                      !isDarkMode && !isGradientTheme,
                  }
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className={cn(
                    "text-sm hover:underline",
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-500 hover:text-blue-700"
                  )}
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Feature panels with gradient background */}
        <div
          className={cn(
            "hidden md:block w-1/2 text-white p-8 relative overflow-hidden",
            isGradientTheme &&
              theme === "royal-blue" &&
              "bg-gradient-to-br from-[#0288d1] to-[#01579b]",
            isGradientTheme &&
              theme === "sky-blue-dark" &&
              "bg-gradient-to-br from-[#90CAF9] to-[#82B1FF]",
            !isGradientTheme && isDarkMode && "bg-gray-900",
            !isGradientTheme && !isDarkMode && "bg-primary"
          )}
        >
          {featurePanels.map((panel, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 p-8 transition-opacity duration-500 flex flex-col",
                activePanel === index
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <div className="mb-6 text-white">{panel.icon}</div>

              <h2 className="text-2xl font-bold mb-4">{panel.title}</h2>

              <p className="mb-8 opacity-90">{panel.description}</p>

              <ul className="space-y-3">
                {panel.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span
                      className={cn(
                        "mr-2",
                        isGradientTheme ? "text-blue-200" : "text-blue-300"
                      )}
                    >
                      •
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Panel indicators */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                {featurePanels.map((_, i) => (
                  <Button
                    key={i}
                    onClick={() => setActivePanel(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activePanel === i ? "bg-white w-4" : "bg-white/50"
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
