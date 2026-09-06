import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { Theme } from "../../theme/colors";
import { radius, spacing, family } from "../../theme/tokens";

const useNativeDriver = Platform.OS !== "web";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  icon?: React.ReactNode;
  disabled?: boolean;
  theme: Theme;
  style?: object;
}

export default function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  theme,
  style,
}: PrimaryButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const bg =
    variant === "ghost"
      ? "transparent"
      : variant === "danger"
      ? theme.errorBg
      : theme.accent;

  const borderColor =
    variant === "ghost"
      ? theme.border
      : variant === "danger"
      ? theme.errorBorder
      : "transparent";

  const textColor =
    variant === "ghost"
      ? theme.textPrimary
      : variant === "danger"
      ? theme.error
      : theme.onAccent;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={[
          styles.button,
          { backgroundColor: bg, borderColor },
          disabled && styles.disabled,
        ]}
      >
        {icon ? <React.Fragment>{icon}</React.Fragment> : null}
        <Text
          style={[
            styles.text,
            { color: textColor },
            variant === "primary" && { fontFamily: family.extrabold },
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
  },
  text: {
    fontSize: 16,
    fontFamily: family.bold,
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.45,
  },
});
