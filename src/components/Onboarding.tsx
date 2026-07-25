import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../theme/colors";
import { ONBOARDING_DATA } from "../constants/recommendations";
import {
  ExchangeIcon,
  TrendIcon,
  ScaleIcon,
  GlobeIcon,
  BellIcon,
} from "./Icons";

interface OnboardingProps {
  onComplete: () => void;
  theme: {
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentSoft: string;
  };
}

const { width } = Dimensions.get("window");

export default function Onboarding({ onComplete, theme }: OnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

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

    // Pedir nombre mediante alerta
    const userName = await AsyncStorage.getItem("user_name");
    if (!userName) {
      Alert.prompt(
        "¡Bienvenido a Arco!",
        "¿Cómo te gustaría que te llamemos?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Guardar",
            onPress: async (name?: string) => {
              if (name && name.trim().length >= 2) {
                await AsyncStorage.setItem("user_name", name.trim());
                onComplete();
              } else {
                onComplete();
              }
            },
          },
        ],
        "plain-text",
        ""
      );
    } else {
      onComplete();
    }
  };

  const handleDotPress = (index: number) => {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "exchange":
        return <ExchangeIcon size={64} color={theme.accent} />;
      case "chart":
        return <TrendIcon size={64} color={theme.accent} />;
      case "scale":
        return <ScaleIcon size={64} color={theme.accent} />;
      case "globe":
        return <GlobeIcon size={64} color={theme.accent} />;
      case "bell":
        return <BellIcon size={64} color={theme.accent} />;
      default:
        return <ExchangeIcon size={56} color={theme.accent} />;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
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
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {ONBOARDING_DATA.map((item, _index) => (
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
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === ONBOARDING_DATA.length - 1
              ? 'Empezar'
              : "Siguiente"}
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 56,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  activeDot: {
    width: 24,
  },
  nextButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
