import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleProp, ViewStyle } from "react-native";
import { motion } from "../../theme/tokens";

const useNativeDriver = Platform.OS !== "web";

interface StaggerInProps {
  index?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export default function StaggerIn({
  index = 0,
  style,
  children,
}: StaggerInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(motion.enterDistance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.enterDuration,
        delay: index * motion.staggerStep,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.enterDuration,
        delay: index * motion.staggerStep,
        useNativeDriver,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View
      style={[style, { opacity, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  );
}
