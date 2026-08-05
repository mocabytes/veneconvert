import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const pulseAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const dot1AnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const dot2AnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const dot3AnimRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const scaleUp = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    pulseAnimRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const dotAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([fadeIn, scaleUp]).start();
    pulseAnimRef.current.start();
    dot1AnimRef.current = dotAnimation(dot1Anim, 0);
    dot2AnimRef.current = dotAnimation(dot2Anim, 200);
    dot3AnimRef.current = dotAnimation(dot3Anim, 400);
    dot1AnimRef.current.start();
    dot2AnimRef.current.start();
    dot3AnimRef.current.start();

    return () => {
      pulseAnimRef.current?.stop();
      dot1AnimRef.current?.stop();
      dot2AnimRef.current?.stop();
      dot3AnimRef.current?.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Animated circles */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circleOuter,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Logo container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../../assets/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Loading indicator */}
        <View style={styles.loadingIndicator}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot1Anim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot2Anim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot3Anim,
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        Arco
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        Tasas BCV y P2P en tiempo real
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#060B14",
  },
  circle: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "#53A548",
    opacity: 0.15,
  },
  circleOuter: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#91CB3E",
    opacity: 0.08,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  loadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#53A548",
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
