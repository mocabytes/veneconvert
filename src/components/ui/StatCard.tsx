import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Theme } from "../../theme/colors";
import { radius, spacing, family } from "../../theme/tokens";

interface StatCardProps {
  label: string;
  value: string;
  sub?: React.ReactNode;
  theme: Theme;
  style?: ViewStyle;
  compact?: boolean;
  glass?: boolean;
}

function StatCard({
  label,
  value,
  sub,
  theme,
  style,
  compact = false,
  glass = false,
}: StatCardProps) {
  return (
    <View
      style={[
        styles.card,
        glass && styles.glass,
        { backgroundColor: glass ? theme.glass : theme.surface, borderColor: glass ? theme.glassBorder : theme.border },
        compact && styles.cardCompact,
        style,
      ]}
    >
      <Text style={[styles.label, { color: theme.textMuted }]} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[
          styles.value,
          compact && styles.valueCompact,
          { color: theme.textPrimary },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      {sub ? <View style={styles.sub}>{sub}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 92,
  },
  cardCompact: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 76,
  },
  label: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  value: {
    fontSize: 17,
    fontFamily: family.bold,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  valueCompact: {
    fontSize: 15,
  },
  sub: {
    marginTop: 6,
  },
  glass: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    padding: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});

export default React.memo(StatCard);
