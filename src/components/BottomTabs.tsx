import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";

interface BottomTabsProps {
  currentTab: "conversor" | "comparador";
  setCurrentTab: (tab: "conversor" | "comparador") => void;
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

  const renderTab = (
    tab: "conversor" | "comparador",
    label: string,
    icon: string,
  ) => {
    const isActive = currentTab === tab;

    return (
      <TouchableOpacity
        key={tab}
        style={[
          styles.tabButton,
          isActive && [
            styles.activeTabButton,
            { backgroundColor: `${theme.accent}22` },
          ],
        ]}
        onPress={() => setCurrentTab(tab)}
        activeOpacity={0.85}
      >
        <Animated.View
          style={[
            styles.iconCircle,
            { backgroundColor: "rgba(255,255,255,0.12)" },
            isActive && { transform: [{ scale: iconScale }] },
          ]}
        >
          <Text style={styles.iconText}>{icon}</Text>
        </Animated.View>
        <Text
          style={[
            styles.tabText,
            isActive && [
              styles.activeTabText,
              { color: theme.accent, fontWeight: "800" },
            ],
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
          backgroundColor: `${theme.tabBarBackground}E6`,
          borderColor: `${theme.textPrimary}22`,
        },
      ]}
    >
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
    marginBottom: 10,
    padding: 6,
    borderRadius: 999,
    gap: 6,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 7,
    minHeight: 46,
  },
  activeTabButton: {},
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  iconText: {
    color: "#F8FAFC",
    fontSize: 12,
    fontWeight: "700",
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  activeTabText: {
    fontWeight: "700",
  },
});
