import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface AmountTextProps {
  value: string;
  prefix?: string;
  size?: "xl" | "lg" | "md";
  color?: string;
  align?: "left" | "center" | "right";
  style?: TextProps["style"];
}

export default function AmountText({
  value,
  prefix,
  size = "xl",
  color,
  align = "left",
  style,
}: AmountTextProps) {
  const sizeStyle =
    size === "xl" ? styles.xl : size === "lg" ? styles.lg : styles.md;

  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.6}
      style={[
        sizeStyle,
        styles.base,
        { color: color ?? undefined, textAlign: align },
        style,
      ]}
    >
      {prefix ? (
        <Text style={[sizeStyle, styles.prefix, { color: color ?? undefined }]}>
          {prefix}
        </Text>
      ) : null}
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: "800",
    letterSpacing: -0.8,
    fontVariant: ["tabular-nums"],
  },
  prefix: {
    fontWeight: "700",
    letterSpacing: 0,
    opacity: 0.75,
  },
  xl: {
    fontSize: 40,
    lineHeight: 46,
  },
  lg: {
    fontSize: 28,
    lineHeight: 34,
  },
  md: {
    fontSize: 16,
    lineHeight: 22,
  },
});
