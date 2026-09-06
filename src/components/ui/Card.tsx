import React from "react";
import { StyleSheet, View, ViewStyle, LayoutChangeEvent, Platform } from "react-native";
import { Theme } from "../../theme/colors";
import { spacing, radius } from "../../theme/tokens";

interface CardProps {
  children: React.ReactNode;
  theme: Theme;
  style?: ViewStyle;
  padding?: number;
  elevated?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export default function Card({
  children,
  theme,
  style,
  padding = spacing.lg,
  elevated = false,
  onLayout,
}: CardProps) {
  return (
    <View
      onLayout={onLayout}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          padding,
          ...(elevated
            ? Platform.OS === "android"
              ? {}
              : {
                  boxShadow: `0 8px 24px ${theme.shadow}`,
                }
            : {}),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
});
