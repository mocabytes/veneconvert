export const spacing = {
  xs: 3,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 28,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999,
} as const;

export const shadow = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
} as const;

export const family = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
} as const;

export const type = {
  display: { fontSize: 36, lineHeight: 44 },
  title: { fontSize: 22, lineHeight: 28 },
  heading: { fontSize: 18, lineHeight: 24 },
  body: { fontSize: 14, lineHeight: 21 },
  caption: { fontSize: 12, lineHeight: 18 },
  micro: { fontSize: 11, lineHeight: 16 },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: "600" },
  bodySmall: { fontSize: 12, lineHeight: 16 },
  inverse: { fontSize: 14, lineHeight: 20, color: "#FFFFFF" },
} as const;

export const layout = {
  screenGutter: 16,
  cardGap: 12,
  sectionGap: 20,
  contentBottom: 140,
} as const;

export const spacingScale = spacing;
export const radiusScale = radius;
export const shadowScale = shadow;
