import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkTheme, lightTheme } from "../theme/colors";
import { ResolvedTheme, ThemeMode } from "../types";

const THEME_MODE_KEY = "theme_mode";

export function useTheme() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const colorScheme = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(THEME_MODE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setThemeModeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_MODE_KEY, mode).catch(() => {});
  };

  useEffect(() => {
    const next =
      themeMode === "system"
        ? colorScheme === "dark"
          ? "dark"
          : "light"
        : themeMode;
    setResolvedTheme(next);
  }, [themeMode, colorScheme]);

  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  return { themeMode, setThemeMode, resolvedTheme, theme };
}
