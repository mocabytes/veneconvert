import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  withRepeat,
  withTiming,
  Easing,
  scrollTo,
  type SharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { ONBOARDING_DATA, OnboardingTint } from "../constants/recommendations";
import { ExchangeIcon, TrendIcon, ScaleIcon } from "./Icons";
import { Theme } from "../theme/colors";
import { ResolvedTheme } from "../types";
import { spacing, radius, family } from "../theme/tokens";
import { triggerHapticForAction } from "../utils/haptic";
import PrimaryButton from "./ui/PrimaryButton";

interface OnboardingProps {
  onComplete: () => void;
  theme: Theme;
  resolvedTheme: ResolvedTheme;
}

const TOTAL_PAGES = ONBOARDING_DATA.length + 1;

function PageTransition({
  index,
  scrollX,
  width,
  style,
  children,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  style?: ViewStyle;
  children: React.ReactNode;
}) {
  const pageStyle = useAnimatedStyle(() => {
    const progress = scrollX.value / width - index;
    return {
      opacity: interpolate(
        progress,
        [-1, -0.4, 0, 0.4, 1],
        [0, 1, 1, 1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            progress,
            [-1, 0, 1],
            [0.85, 1, 0.85],
            Extrapolation.CLAMP
          ),
        },
        { translateX: progress * -36 },
      ],
    };
  });

  return <Animated.View style={[style, pageStyle]}>{children}</Animated.View>;
}

function PageDot({
  index,
  scrollX,
  width,
  theme,
  onPress,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  theme: Theme;
  onPress: () => void;
}) {
  const dotStyle = useAnimatedStyle(() => {
    const progress = scrollX.value / width;
    return {
      width: interpolate(
        progress,
        [index - 1, index, index + 1],
        [7, 24, 7],
        Extrapolation.CLAMP
      ),
      backgroundColor: interpolateColor(
        progress,
        [index - 1, index, index + 1],
        [theme.textMuted, theme.accent, theme.textMuted]
      ),
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.dotHit}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Ir a la pantalla ${index + 1}`}
    >
      <Animated.View style={[styles.dot, dotStyle]} />
    </TouchableOpacity>
  );
}

export default function Onboarding({
  onComplete,
  theme,
  resolvedTheme,
}: OnboardingProps) {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nombreInput, setNombreInput] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const scrollX = useSharedValue(0);
  const scrollRef = useAnimatedRef<ScrollView>();
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-10, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [floatY]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const glowShift = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value * 0.12 }],
  }));

  const isLast = currentIndex === TOTAL_PAGES - 1;

  const goTo = (index: number) => {
    setCurrentIndex(index);
    scrollTo(scrollRef, width * index, 0, true);
  };

  const handleNext = () => {
    triggerHapticForAction("tab");
    if (currentIndex < TOTAL_PAGES - 1) {
      goTo(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    triggerHapticForAction("tab");
    handleComplete();
  };

  const handleComplete = async () => {
    triggerHapticForAction("success");
    await AsyncStorage.setItem("onboarding_completed", "true");

    const name = nombreInput.trim();
    if (name.length >= 2) {
      try {
        await AsyncStorage.setItem("user_name", name);
      } catch (e) {
        console.log(e);
      }
    }
    onComplete();
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "chart":
        return <TrendIcon size={52} color="#FFFFFF" />;
      case "scale":
        return <ScaleIcon size={52} color="#FFFFFF" />;
      default:
        return <ExchangeIcon size={52} color="#FFFFFF" />;
    }
  };

  const getGradient = (tint: OnboardingTint): [string, string] => {
    switch (tint) {
      case "info":
        return [theme.info, theme.accent];
      case "success":
        return [theme.success, theme.accent];
      default:
        return [theme.accent, theme.success];
    }
  };

  const getGlow = (tint: OnboardingTint): string => {
    const base =
      tint === "info"
        ? theme.info
        : tint === "success"
        ? theme.success
        : theme.accent;
    return `${base}59`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={resolvedTheme === "dark" ? "light-content" : "dark-content"} />

      <Animated.View
        pointerEvents="none"
        style={[styles.blobTop, { backgroundColor: theme.accentSoft }, glowShift]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.blobBottom, { backgroundColor: theme.accentSoft }, glowShift]}
      />

      <View style={styles.header}>
        {isLast ? (
          <View style={styles.skipPlaceholder} />
        ) : (
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            accessibilityRole="button"
          >
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>
              Saltar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {ONBOARDING_DATA.map((item, index) => (
          <View key={item.id} style={[styles.slide, { width }]}>
            <PageTransition
              index={index}
              scrollX={scrollX}
              width={width}
              style={styles.slideInner}
            >
              <Animated.View style={floatStyle}>
                <LinearGradient
                  colors={getGradient(item.tint)}
                  style={[
                    styles.iconTile,
                    { boxShadow: `0 16px 40px ${getGlow(item.tint)}` },
                  ]}
                >
                  {getIconComponent(item.icon)}
                </LinearGradient>
              </Animated.View>

              <Text style={[styles.title, { color: theme.textPrimary }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.description, { color: theme.textSecondary }]}
              >
                {item.description}
              </Text>
            </PageTransition>
          </View>
        ))}

        <View key="finale" style={[styles.slide, { width }]}>
          <PageTransition
            index={ONBOARDING_DATA.length}
            scrollX={scrollX}
            width={width}
            style={styles.slideInner}
          >
            <Animated.View style={floatStyle}>
              <LinearGradient
                colors={[theme.accent, theme.success]}
                style={[
                  styles.iconTile,
                  { boxShadow: `0 16px 40px ${getGlow("accent")}` },
                ]}
              >
                <Text style={styles.avatarLetter}>
                  {(nombreInput.trim() || "?").charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </Animated.View>

            <Text style={[styles.title, { color: theme.textPrimary }]}>
              ¿Cómo te llamamos?
            </Text>
            <Text
              style={[styles.description, { color: theme.textSecondary }]}
            >
              Tu nombre aparece en tu inicio. Puedes saltarlo.
            </Text>

            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: nameFocused ? theme.accent : theme.border,
                  color: theme.textPrimary,
                },
              ]}
              value={nombreInput}
              onChangeText={setNombreInput}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="Tu nombre (opcional)"
              placeholderTextColor={theme.textMuted}
              maxLength={20}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleComplete}
              accessibilityLabel="Tu nombre"
            />
          </PageTransition>
        </View>
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
            <PageDot
              key={index}
              index={index}
              scrollX={scrollX}
              width={width}
              theme={theme}
              onPress={() => {
                triggerHapticForAction("tab");
                goTo(index);
              }}
            />
          ))}
        </View>

        {isLast ? (
          <TouchableOpacity
            onPress={handleComplete}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Empezar"
          >
            <LinearGradient
              colors={[theme.accent, theme.success]}
              style={styles.startButton}
            >
              <Text style={[styles.startButtonText, { color: "#FFFFFF" }]}>
                Empezar
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <PrimaryButton
            title="Siguiente"
            onPress={handleNext}
            theme={theme}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blobTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.5,
  },
  blobBottom: {
    position: "absolute",
    bottom: -100,
    left: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    minHeight: 52,
  },
  skipPlaceholder: {
    height: 40,
  },
  skipButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: 15,
    fontFamily: family.semibold,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  slideInner: {
    alignItems: "center",
    width: "100%",
  },
  iconTile: {
    width: 128,
    height: 128,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  avatarLetter: {
    fontSize: 56,
    fontFamily: family.extrabold,
    color: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontFamily: family.extrabold,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    fontFamily: family.regular,
    textAlign: "center",
    lineHeight: 23,
    paddingHorizontal: 8,
  },
  nameInput: {
    alignSelf: "stretch",
    marginTop: spacing.xxl,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    fontSize: 17,
    fontFamily: family.semibold,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 28,
    paddingTop: spacing.md,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    gap: spacing.sm,
  },
  dotHit: {
    padding: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  startButton: {
    height: 56,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 17,
    fontFamily: family.extrabold,
  },
});
