import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Theme } from "../../theme/colors";
import { spacing, type, family } from "../../theme/tokens";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  theme: Theme;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenHeader({
  title,
  subtitle,
  theme,
  right,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.texts}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  texts: {
    flex: 1,
  },
  title: {
    ...type.title,
    fontFamily: family.extrabold,
    letterSpacing: -0.4,
  },
  subtitle: {
    ...type.labelSmall,
    marginTop: spacing.xs,
  },
  right: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
