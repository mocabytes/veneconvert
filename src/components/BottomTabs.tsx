import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";

interface BottomTabsProps {
  currentTab: "inicio" | "conversor" | "comparador";
  setCurrentTab: (tab: "inicio" | "conversor" | "comparador") => void;
  theme: {
    accent: string;
    tabBarBackground: string;
    textMuted: string;
    textPrimary: string;
  };
}

export default function BottomTabs({
  currentTab,
  setCurrentTab,
  theme,
}: BottomTabsProps) {
  const iconScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentTab, iconScale]);

  const obtenerFondoConOpacidad = (hexColor: string, opacidadHex: string) => {
    if (hexColor.startsWith("#"))
      return `${hexColor.slice(0, 7)}${opacidadHex}`;
    return hexColor;
  };

  const renderTab = (
    tab: "inicio" | "conversor" | "comparador",
    label: string,
    icon: string,
  ) => {
    const isActive = currentTab === tab;

    return (
      <TouchableOpacity
        key={tab}
        style={[
          styles.tabButton,
          isActive && {
            backgroundColor: obtenerFondoConOpacidad(theme.accent, "22"),
          },
        ]}
        onPress={() => setCurrentTab(tab)}
        activeOpacity={0.85}
      >
        <Animated.View
          style={[
            styles.iconCircle,
            isActive && { transform: [{ scale: iconScale }] },
          ]}
        >
          <Text style={styles.iconText}>{icon}</Text>
        </Animated.View>
        <Text
          style={[
            styles.tabText,
            isActive && { color: theme.accent, fontWeight: "800" },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: obtenerFondoConOpacidad(
            theme.tabBarBackground,
            "D9",
          ),
          borderColor: obtenerFondoConOpacidad(theme.textPrimary, "15"),
        },
      ]}
    >
      {renderTab("inicio", "Inicio", "🏠")}
      {renderTab("conversor", "Conversor", "↺")}
      {renderTab("comparador", "Comparador", "⚖")}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    alignSelf: "center",
    width: "92%",
    position: "absolute",
    bottom: 24,
    padding: 6,
    borderRadius: 999,
    gap: 4,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 7,
    minHeight: 46,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  iconText: { fontSize: 13, fontWeight: "700" },
  tabText: { fontSize: 11, fontWeight: "600", color: "#94A3B8" },
});
