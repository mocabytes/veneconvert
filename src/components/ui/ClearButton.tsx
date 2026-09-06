import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Theme } from "../../theme/colors";
import { TrashIcon } from "../Icons";
import { spacing, radius } from "../../theme/tokens";

interface ClearButtonProps {
  onPress: () => void;
  theme: Theme;
  label?: string;
}

export default function ClearButton({
  onPress,
  theme,
  label = "Limpiar",
}: ClearButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.surfaceAlt }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <TrashIcon size={15} color={theme.textSecondary} />
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
});
