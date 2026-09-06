import React, { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet } from "react-native";
import { Theme } from "../../theme/colors";

const useNativeDriver = Platform.OS !== "web";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  theme: Theme;
  color?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export default function Switch({
  value,
  onValueChange,
  theme,
  color,
  disabled = false,
  accessibilityLabel,
}: SwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;
  const bgAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? 20 : 0,
        useNativeDriver,
        speed: 30,
        bounciness: 0,
      }),
      Animated.timing(bgAnim, {
        toValue: value ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value, translateX, bgAnim]);

  const activeColor = color ?? theme.accent;
  const trackColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.surfaceAlt, activeColor],
  });

  return (
    <Pressable
      onPress={() => {
        if (!disabled) {
          onValueChange(!value);
        }
      }}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackColor,
            borderColor: value ? "transparent" : theme.border,
          },
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
              backgroundColor: theme.surface,
              boxShadow: `0 2px 3px ${theme.shadow}`,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 4,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginLeft: 2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
