import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HomeIcon,
  HomeFilledIcon,
  ExchangeIcon,
  ExchangeFilledIcon,
  ScaleIcon,
  ScaleFilledIcon,
  GridIcon,
  GridFilledIcon,
} from "./Icons";
import { Theme } from "../theme/colors";
import { spacing, family, motion } from "../theme/tokens";
import { triggerHapticForAction } from "../utils/haptic";

type Tab = 'inicio' | 'conversor' | 'comparador' | 'herramientas';

interface BottomTabsProps {
  currentTab: Tab | 'herramientas' | 'multimoneda' | 'historial' | 'tendencias' | 'alertas' | 'configuracion';
  setCurrentTab: (tab: Tab | 'herramientas' | 'multimoneda' | 'historial' | 'tendencias' | 'alertas' | 'configuracion') => void;
  alertsCount?: number;
  theme: Theme;
}

const TAB_HEIGHT = 60;
const ACTIVE_OPACITY = 0.85;

function TabButton({
  tab,
  label,
  IconComponent,
  isActive,
  showBadge,
  badgeCount,
  theme,
  onPress,
}: {
  tab: Tab;
  label: string;
  IconComponent: React.FC<{ size?: number; color?: string }>;
  isActive: boolean;
  showBadge: boolean;
  badgeCount: number;
  theme: Theme;
  onPress: () => void;
}) {
  const press = React.useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(press, {
      toValue: 0.95,
      ...motion.gentle,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  const pressOut = () => {
    Animated.spring(press, {
      toValue: 1,
      ...motion.gentle,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <Animated.View
      style={[styles.tabButtonWrap, { transform: [{ scale: press }] }]}
    >
      <TouchableOpacity
        key={tab}
        style={styles.tabButton}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={ACTIVE_OPACITY}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={`Ir a la sección de ${label.toLowerCase()}`}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <View style={styles.iconArea}>
          <IconComponent
            size={24}
            color={isActive ? theme.accent : theme.textMuted}
          />
          {showBadge && badgeCount > 0 ? (
            <View
              style={[styles.badge, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.badgeText, { color: theme.onAccent }]}>
                {badgeCount > 99 ? "99+" : String(badgeCount)}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          style={[
            styles.tabText,
            {
              color: isActive ? theme.accent : theme.textSecondary,
              fontFamily: isActive ? family.extrabold : family.semibold,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function BottomTabs({
  currentTab,
  setCurrentTab,
  alertsCount = 0,
  theme,
}: BottomTabsProps) {
  const insets = useSafeAreaInsets();

  const activeIndex =
    currentTab === 'inicio'
      ? 0
      : currentTab === 'conversor'
      ? 1
      : currentTab === 'comparador'
      ? 2
      : 3;

  const renderTab = (
    tab: Tab,
    label: string,
    IconComponent: React.FC<{ size?: number; color?: string }>,
    FilledComponent: React.FC<{ size?: number; color?: string }>,
    index: number,
    showBadge = false
  ) => {
    const isActive = activeIndex === index;

    return (
      <TabButton
        key={tab}
        tab={tab}
        label={label}
        IconComponent={isActive ? FilledComponent : IconComponent}
        isActive={isActive}
        showBadge={showBadge}
        badgeCount={alertsCount}
        theme={theme}
        onPress={() => {
          triggerHapticForAction("tab");
          setCurrentTab(tab);
        }}
      />
    );
  };

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      <View style={styles.inner}>
        {renderTab("inicio", "Inicio", HomeIcon, HomeFilledIcon, 0)}
        {renderTab("conversor", "Conversor", ExchangeIcon, ExchangeFilledIcon, 1)}
        {renderTab("comparador", "Comparador", ScaleIcon, ScaleFilledIcon, 2)}
        {renderTab("herramientas", "Herramientas", GridIcon, GridFilledIcon, 3, true)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  tabButtonWrap: {
    flex: 1,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.sm,
    height: TAB_HEIGHT,
  },
  iconArea: {
    width: 56,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: family.extrabold,
    fontVariant: ["tabular-nums"],
  },
  tabText: {
    fontSize: 12,
    fontFamily: family.semibold,
    letterSpacing: 0.2,
  },
});
