import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "nutrione-theme";

// Apply theme to DOM immediately
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

// Get initial theme from localStorage (synchronous, before React renders)
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  
  // Check system preference as fallback
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  
  return "light";
};

// Apply theme immediately before React hydration
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with database on mount
  useEffect(() => {
    const syncWithDatabase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("dark_mode")
            .eq("user_id", user.id)
            .single();

          if (data?.dark_mode !== null && data?.dark_mode !== undefined) {
            const dbTheme: Theme = data.dark_mode ? "dark" : "light";
            setThemeState(dbTheme);
            applyTheme(dbTheme);
            localStorage.setItem(THEME_KEY, dbTheme);
          }
        }
      } catch (error) {
        console.error("Failed to sync theme with database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    syncWithDatabase();

    // Listen for auth changes to re-sync theme
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        syncWithDatabase();
      } else if (event === "SIGNED_OUT") {
        // Keep current theme but stop syncing
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    // Sync to database if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ dark_mode: newTheme === "dark" })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Failed to save theme to database:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
