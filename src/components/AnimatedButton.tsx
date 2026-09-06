import React, { useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from "react-native";

const useNativeDriver = Platform.OS !== "web";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onPress,
  style,
  disabled = false,
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver,
        tension: 40,
        friction: 3,
      }),
      Animated.spring(opacityAnim, {
        toValue: 1,
        useNativeDriver,
        tension: 40,
        friction: 3,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
      style={[
        styles.button,
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        disabled && styles.disabled,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.5,
  },
});
