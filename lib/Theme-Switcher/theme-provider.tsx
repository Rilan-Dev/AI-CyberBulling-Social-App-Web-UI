"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export interface ExtendedThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({
  children,
  ...props
}: ExtendedThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="default"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme={props.forcedTheme}
      themes={[
        "default",
        "dark",
        "corporate",
        "elegant",
        "tech",
        "warm",
        "royal-blue",
        "sky-blue-dark",
      ]}
      value={{
        default: "theme-default",
        dark: "dark",
        corporate: "theme-corporate",
        elegant: "theme-elegant",
        tech: "theme-tech",
        warm: "theme-warm",
        "royal-blue": "theme-royal-blue",
        "sky-blue-dark": "theme-sky-blue-dark",
      }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  return useNextTheme();
}
