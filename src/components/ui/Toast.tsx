import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text } from "react-native";
import { Theme } from "../../theme/colors";
import { spacing, radius, type, family } from "../../theme/tokens";

interface ToastProps {
  message: string | null;
  theme: Theme;
  bottomOffset?: number;
}

const useNativeDriver = Platform.OS !== "web";

export default function Toast({
  message,
  theme,
  bottomOffset = 96,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const lastMessage = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      lastMessage.current = message;
      setVisible(true);
      opacity.setValue(0);
      translateY.setValue(12);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver,
        }),
      ]).start();
    } else if (lastMessage.current !== null) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver,
        }),
        Animated.timing(translateY, {
          toValue: 12,
          duration: 200,
          useNativeDriver,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [message, opacity, translateY]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          bottom: bottomOffset,
          backgroundColor: theme.surfaceRaised,
          borderColor: theme.borderStrong,
          boxShadow: `0 8px 16px ${theme.shadow}`,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.text, { color: theme.textPrimary }]}>
        {lastMessage.current}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    alignSelf: "center",
    maxWidth: 360,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    elevation: 8,
  },
  text: {
    ...type.body,
    fontFamily: family.semibold,
    textAlign: "center",
  },
});
