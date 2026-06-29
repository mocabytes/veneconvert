import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
  Animated,
  Image,
} from "react-native";

interface NavbarProps {
  onClear?: () => void;
  theme: {
    background: string;
    surface: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
  };
  themeMode: "light" | "dark" | "system";
  onThemeChange: (mode: "light" | "dark" | "system") => void;
}

export default function Navbar({
  onClear,
  theme,
  themeMode,
  onThemeChange,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const themeOptions: Array<{
    label: string;
    value: "light" | "dark" | "system";
    icon: string;
  }> = [
    { label: "Claro", value: "light", icon: "☀️" },
    { label: "Oscuro", value: "dark", icon: "🌙" },
    { label: "Sistema", value: "system", icon: "⚙️" },
  ];

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.navbar,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.navContainer}>
        <View style={styles.logoRow}>
          <Image
            source={require("../../assets/favicon.png")}
            style={styles.logoBadgeImage}
            resizeMode="contain"
          />
          <View style={styles.textColumn}>
            <Text style={[styles.brandName, { color: theme.textPrimary }]}>
              ARCO
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {onClear && (
            <TouchableOpacity
              style={[
                styles.clearButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              onPress={onClear}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.clearButtonText, { color: theme.textPrimary }]}
              >
                Limpiar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 20,
    height: Platform.OS === "web" ? 76 : 76 + (RNStatusBar.currentHeight || 0),
    paddingTop: Platform.OS === "web" ? 0 : RNStatusBar.currentHeight || 0,
    justifyContent: "center",
    borderBottomWidth: 1,

    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    ...(Platform.OS === "web"
      ? {
          position: "relative" as const,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }
      : {
          position: "absolute" as const,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }),
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadgeImage: {
    width: 36,
    height: 36,
    alignSelf: "center",
  },
  textColumn: {
    justifyContent: "center",
  },
  brandName: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: -1,
    letterSpacing: 0.2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 20,
  },
  themeTrigger: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
  },
  themeTriggerText: {
    fontSize: 16,
  },
  dropdownMenu: {
    position: "absolute",
    top: "120%",
    right: 0,
    minWidth: 130,
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 8,
  },
  dropdownIcon: {
    fontSize: 14,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: "700",
  },
  clearButton: {
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
