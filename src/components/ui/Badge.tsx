import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Theme } from "../../theme/colors";

interface BadgeProps {
  label: string;
  tone?: "success" | "error" | "warning" | "info" | "neutral" | "accent";
  icon?: React.ReactNode;
  theme: Theme;
  style?: ViewStyle;
}

const toneStyles = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
  neutral: "textSecondary",
  accent: "accent",
} as const;

export default function Badge({
  label,
  tone = "neutral",
  icon,
  theme,
  style,
}: BadgeProps) {
  const key = toneStyles[tone];
  const color = theme[key];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}1F`,
          borderColor: `${color}40`,
        },
        style,
      ]}
    >
      {icon ? <React.Fragment>{icon}</React.Fragment> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
