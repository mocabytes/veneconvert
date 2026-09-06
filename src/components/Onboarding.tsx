import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { ONBOARDING_DATA } from "../constants/recommendations";
import {
  ExchangeIcon,
  TrendIcon,
  ScaleIcon,
  GlobeIcon,
  BellIcon,
} from "./Icons";
import { Theme } from "../theme/colors";
import { ResolvedTheme } from "../types";
import { spacing, radius } from "../theme/tokens";

interface OnboardingProps {
  onComplete: () => void;
  theme: Theme;
  resolvedTheme: ResolvedTheme;
}

const useNativeDriver = Platform.OS !== "web";

export default function Onboarding({
  onComplete,
  theme,
  resolvedTheme,
}: OnboardingProps) {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nombreInput, setNombreInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver,
      }),
    ]).start();
  }, [currentIndex]);

  const isLast = currentIndex === ONBOARDING_DATA.length - 1;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
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

  const handleDotPress = (index: number) => {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "exchange":
        return <ExchangeIcon size={40} color={theme.accent} />;
      case "chart":
        return <TrendIcon size={40} color={theme.accent} />;
      case "scale":
        return <ScaleIcon size={40} color={theme.accent} />;
      case "globe":
        return <GlobeIcon size={40} color={theme.accent} />;
      case "bell":
        return <BellIcon size={40} color={theme.accent} />;
      default:
        return <ExchangeIcon size={40} color={theme.accent} />;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={resolvedTheme === "dark" ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityRole="button"
        >
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>
            Saltar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {ONBOARDING_DATA.map((item, index) => (
          <View key={item.id} style={[styles.slide, { width }]}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.accentSoft },
                ]}
              >
                {getIconComponent(item.icon)}
              </View>

              <Text style={[styles.title, { color: theme.textPrimary }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.description, { color: theme.textSecondary }]}
              >
                {item.description}
              </Text>

              {index === ONBOARDING_DATA.length - 1 ? (
                <TextInput
                  style={[
                    styles.nameInput,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    },
                  ]}
                  value={nombreInput}
                  onChangeText={setNombreInput}
                  placeholder="Tu nombre (opcional)"
                  placeholderTextColor={theme.textMuted}
                  maxLength={20}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={handleComplete}
                  accessibilityLabel="Tu nombre"
                />
              ) : null}
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              style={[
                styles.dot,
                { backgroundColor: theme.textMuted },
                index === currentIndex && { backgroundColor: theme.accent },
                index === currentIndex && styles.activeDot,
              ]}
              activeOpacity={0.7}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: theme.accent }]}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={[styles.nextButtonText, { color: theme.onAccent }]}>
            {isLast ? "Empezar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
  },
  skipButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "600",
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
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    paddingHorizontal: 8,
  },
  nameInput: {
    alignSelf: "stretch",
    marginTop: spacing.xxl,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 28,
    paddingTop: spacing.md,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 22,
    gap: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    opacity: 0.5,
  },
  activeDot: {
    width: 22,
    opacity: 1,
  },
  nextButton: {
    height: 56,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
