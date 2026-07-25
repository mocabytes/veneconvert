import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

interface PulseAnimationProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pulseColor?: string;
}

export default function PulseAnimation({
  children,
  style,
  pulseColor = "rgba(44, 107, 189, 0.3)",
}: PulseAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={style}>
      <Animated.View
        style={[
          styles.pulse,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            backgroundColor: pulseColor,
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = {
  pulse: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 999,
  },
};
