import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Theme } from "../../theme/colors";
import { radius } from "../../theme/tokens";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  theme: Theme;
  style?: ViewStyle;
}

export default function EmptyState({
  title,
  description,
  icon,
  theme,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon ? (
        <View
          style={[styles.iconCircle, { backgroundColor: theme.accentSoft }]}
        >
          {icon}
        </View>
      ) : null}
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: theme.textMuted }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 36,
    borderRadius: radius.md,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
    textAlign: "center",
  },
});
