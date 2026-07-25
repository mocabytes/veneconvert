import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const isTablet = () => {
  const aspectRatio = width / height;
  return (
    (Platform.OS === "ios" || Platform.OS === "android") &&
    (width >= 768 || aspectRatio < 1)
  );
};

export const isDesktop = () => {
  return Platform.OS === "web" && width >= 1024;
};

export const isMobile = () => {
  return !isTablet() && !isDesktop();
};

export const getBreakpoint = () => {
  if (width >= 1280) {
    return "xl";
  }
  if (width >= 1024) {
    return "lg";
  }
  if (width >= 768) {
    return "md";
  }
  return "sm";
};

export const getSpacing = (base: number) => {
  const breakpoint = getBreakpoint();
  const multipliers: Record<string, number> = {
    xl: 1.5,
    lg: 1.3,
    md: 1.1,
    sm: 1,
  };
  return base * multipliers[breakpoint];
};

export const getFontSize = (base: number) => {
  const breakpoint = getBreakpoint();
  const multipliers: Record<string, number> = {
    xl: 1.2,
    lg: 1.1,
    md: 1.05,
    sm: 1,
  };
  return base * multipliers[breakpoint];
};

export const getContainerWidth = () => {
  const breakpoint = getBreakpoint();
  const widths: Record<string, number> = {
    xl: 1200,
    lg: 1024,
    md: 768,
    sm: width,
  };
  return Math.min(widths[breakpoint], width - 32);
};

export const getGridColumns = () => {
  const breakpoint = getBreakpoint();
  const columns: Record<string, number> = {
    xl: 4,
    lg: 3,
    md: 2,
    sm: 1,
  };
  return columns[breakpoint];
};
