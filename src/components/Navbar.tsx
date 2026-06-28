import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
  Animated,
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
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.navContainer}>
        <View style={styles.logoRow}>
          <View style={[styles.logoBadge, { backgroundColor: theme.accent }]}>
            <Text style={styles.logoBadgeText}>$</Text>
          </View>
          <View>
            <Text style={[styles.brandName, { color: theme.textPrimary }]}>
              VeneConvert
            </Text>
            <Text style={[styles.brandSubtitle, { color: theme.textMuted }]}>
              Cambio inteligente
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[styles.themeTrigger, { backgroundColor: theme.surface }]}
              onPress={() => setIsMenuOpen((prev) => !prev)}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.themeTriggerText, { color: theme.textPrimary }]}
              >
                {themeOptions.find((item) => item.value === themeMode)?.icon ||
                  "⚙️"}
              </Text>
            </TouchableOpacity>

            {isMenuOpen && (
              <View
                style={[
                  styles.dropdownMenu,
                  { backgroundColor: theme.surface },
                ]}
              >
                {themeOptions.map((item) => {
                  const isSelected = themeMode === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.dropdownItem,
                        isSelected && {
                          backgroundColor: `${theme.accent}22`,
                        },
                      ]}
                      onPress={() => {
                        onThemeChange(item.value);
                        setIsMenuOpen(false);
                      }}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.dropdownIcon}>{item.icon}</Text>
                      <Text
                        style={[
                          styles.dropdownText,
                          {
                            color: isSelected
                              ? theme.accent
                              : theme.textPrimary,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {onClear && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: theme.surface }]}
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
    height: Platform.OS === "web" ? 74 : 74 + (RNStatusBar.currentHeight || 0),
    paddingTop: Platform.OS === "web" ? 0 : RNStatusBar.currentHeight || 0,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
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
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBadgeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  brandName: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 20,
  },
  themeTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    gap: 6,
  },
  themeTriggerText: {
    fontSize: 14,
  },
  themeTriggerLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  dropdownMenu: {
    position: "absolute",
    top: "110%",
    right: 0,
    minWidth: 124,
    padding: 6,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  dropdownIcon: {
    fontSize: 13,
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: "700",
  },
  clearButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
