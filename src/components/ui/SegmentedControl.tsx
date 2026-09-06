import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Theme } from "../../theme/colors";
import { radius, spacing, family } from "../../theme/tokens";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
  activeColor?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  theme: Theme;
  style?: ViewStyle;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  theme,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.track, { backgroundColor: theme.surfaceAlt }, style]}>
      {options.map((option) => {
        const isActive = option.value === value;
        const activeBg = option.activeColor ?? theme.accent;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.option,
              isActive && { backgroundColor: activeBg },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: theme.textMuted },
                isActive && { color: theme.onAccent, fontFamily: family.bold },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: spacing.xs,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  option: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontFamily: family.semibold,
    letterSpacing: 0.2,
  },
});
