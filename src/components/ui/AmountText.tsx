import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { family } from "../../theme/tokens";

interface AmountTextProps {
  value: string;
  prefix?: string;
  size?: "xl" | "lg" | "md";
  color?: string;
  align?: "left" | "center" | "right";
  style?: TextProps["style"];
}

function AmountText({
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
    fontFamily: family.extrabold,
    letterSpacing: -0.8,
    fontVariant: ["tabular-nums"],
  },
  prefix: {
    fontFamily: family.bold,
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

export default React.memo(AmountText);
