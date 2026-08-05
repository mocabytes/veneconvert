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
  Pressable,
} from "react-native";
import {
  SunIcon,
  MoonIcon,
  SystemIcon,
  TrashIcon,
  ChevronDownIcon,
} from './Icons';

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
  const [isThemeMenuOpen, setIsThemeMenuOpen] = React.useState(false);
  const themeOptions: Array<{
    label: string;
    value: "light" | "dark" | "system";
    icon: React.ReactNode;
  }> = [
    { label: "Claro", value: "light", icon: <SunIcon size={18} /> },
    { label: "Oscuro", value: "dark", icon: <MoonIcon size={18} /> },
    { label: "Sistema", value: "system", icon: <SystemIcon size={18} /> },
  ];

  const currentThemeIcon = React.useMemo(() => {
    const option = themeOptions.find((opt) => opt.value === themeMode);
    if (!option) {
      return <SystemIcon size={18} />;
    }

    const iconProps = { size: 18, color: theme.textSecondary };
    if (option.value === "light") {
      return <SunIcon {...iconProps} />;
    }
    if (option.value === "dark") {
      return <MoonIcon {...iconProps} />;
    }
    return <SystemIcon {...iconProps} />;
  }, [themeMode, theme.textSecondary]);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <>
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
          <View style={styles.logoSection}>
            <View
              style={[styles.logoBadge, { backgroundColor: theme.surface }]}
            >
              <Image
                source={require("../../assets/favicon.png")}
                style={styles.logoImage as any}
                resizeMode="contain"
              />
            </View>
            <View style={styles.brandColumn}>
              <Text style={[styles.brandName, { color: theme.accent }]}>
                arco
              </Text>
              <Text style={[styles.brandTagline, { color: theme.textMuted }]}>
                conversor
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <View style={styles.dropdownWrapper}>
              <Pressable
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              >
                <View style={styles.themeIconWrapper}>{currentThemeIcon}</View>
                <View
                  style={[
                    styles.chevron,
                    isThemeMenuOpen && styles.chevronRotated,
                  ]}
                >
                  <ChevronDownIcon size={14} color={theme.textSecondary} />
                </View>
              </Pressable>

              {isThemeMenuOpen && (
                <Animated.View
                  style={[
                    styles.dropdownMenu,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      shadowColor: themeMode === "dark" ? "#000" : "#53A548",
                    },
                  ]}
                >
                  {themeOptions.map((option) => {
                    const iconProps = { size: 18, color: theme.textSecondary };
                    let icon;
                    if (option.value === "light") {
                      icon = <SunIcon {...iconProps} />;
                    } else if (option.value === 'dark') {
                      icon = <MoonIcon {...iconProps} />;
                    } else {
                      icon = <SystemIcon {...iconProps} />;
                    }

                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          themeMode === option.value && {
                            backgroundColor: theme.accent + "15",
                          },
                        ]}
                        onPress={() => {
                          onThemeChange(option.value);
                          setIsThemeMenuOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        {icon}
                        <Text
                          style={[
                            styles.dropdownText,
                            { color: theme.textPrimary },
                            themeMode === option.value && {
                              color: theme.accent,
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                        {themeMode === option.value && (
                          <View
                            style={[
                              styles.activeIndicator,
                              { backgroundColor: theme.accent },
                            ]}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </Animated.View>
              )}
            </View>

            {onClear && (
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={onClear}
                activeOpacity={0.7}
              >
                <TrashIcon size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {isThemeMenuOpen && Platform.OS === "web" && (
        <Pressable
          style={styles.overlay}
          onPress={() => setIsThemeMenuOpen(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 20,
    height: Platform.OS === "web" ? 72 : 72 + (RNStatusBar.currentHeight || 0),
    paddingTop: Platform.OS === "web" ? 0 : RNStatusBar.currentHeight || 0,
    justifyContent: "center",
    borderBottomWidth: 1,

    ...(Platform.OS === "web"
      ? {
          position: "relative" as const,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          boxShadow:
            '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 4px 12px rgba(0, 0, 0, 0.03)',
        }
      : {
          position: "absolute" as const,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        }),
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  brandColumn: {
    justifyContent: "center",
  },
  brandName: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    fontFamily: "League Spartan, sans-serif",
    lineHeight: 24,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
    marginTop: 1,
    textTransform: "uppercase",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 200,
  },
  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  themeIconWrapper: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {},
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  dropdownMenu: {
    position: "absolute",
    top: 56,
    right: 0,
    minWidth: 160,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }),
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 150,
  },
});
