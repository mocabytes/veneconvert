import { Dimensions, Platform, useWindowDimensions } from "react-native";

const STATIC_WIDTH = Dimensions.get("window").width;
const STATIC_HEIGHT = Dimensions.get("window").height;

const getBreakpointForWidth = (w: number): string => {
  if (w >= 1280) {
    return "xl";
  }
  if (w >= 1024) {
    return "lg";
  }
  if (w >= 768) {
    return "md";
  }
  return "sm";
};

export const isTablet = () => {
  const aspectRatio = STATIC_WIDTH / STATIC_HEIGHT;
  return (
    (Platform.OS === "ios" || Platform.OS === "android") &&
    (STATIC_WIDTH >= 768 || aspectRatio < 1)
  );
};

export const isDesktop = () => {
  return Platform.OS === "web" && STATIC_WIDTH >= 1024;
};

export const isMobile = () => {
  return !isTablet() && !isDesktop();
};

export const getBreakpoint = (width: number = STATIC_WIDTH) => {
  return getBreakpointForWidth(width);
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

export const getContainerWidth = (width: number = STATIC_WIDTH) => {
  const breakpoint = getBreakpointForWidth(width);
  const widths: Record<string, number> = {
    xl: 1200,
    lg: 1024,
    md: 768,
    sm: width,
  };
  return Math.min(widths[breakpoint], width - 32);
};

export const useContainerWidth = (): number => {
  const { width } = useWindowDimensions();
  return getContainerWidth(width);
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
