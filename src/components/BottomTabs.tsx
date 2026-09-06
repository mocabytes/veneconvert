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
import { HomeIcon, ExchangeIcon, ScaleIcon, GridIcon } from "./Icons";
import { Theme } from "../theme/colors";
import { spacing, radius, family, motion } from "../theme/tokens";
import { triggerHapticForAction } from "../utils/haptic";

type Tab = 'inicio' | 'conversor' | 'comparador' | 'herramientas';

interface BottomTabsProps {
  currentTab: Tab | 'herramientas' | 'multimoneda' | 'historial' | 'tendencias' | 'alertas' | 'configuracion';
  setCurrentTab: (tab: Tab | 'herramientas' | 'multimoneda' | 'historial' | 'tendencias' | 'alertas' | 'configuracion') => void;
  alertsCount?: number;
  theme: Theme;
}

const INDICATOR_WIDTH = 64;
const TAB_HEIGHT = 64;
const ACTIVE_OPACITY = 0.9;

function PopIcon({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: active ? 1.2 : 1,
      ...motion.pop,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [active, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
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
  const tabCenters = React.useRef<number[]>([]);
  const measuredCount = React.useRef(0);
  const indicatorPos = React.useRef(new Animated.Value(0)).current;

  const activeIndex =
    currentTab === 'inicio'
      ? 0
      : currentTab === 'conversor'
      ? 1
      : currentTab === 'comparador'
      ? 2
      : 3;

  const animateIndicator = React.useCallback(
    (index: number) => {
      const centerX = tabCenters.current[index];
      if (centerX == null) {
        return;
      }
      Animated.spring(indicatorPos, {
        toValue: centerX - INDICATOR_WIDTH / 2,
        ...motion.bouncy,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    },
    [indicatorPos]
  );

  const handleTabLayout = React.useCallback(
    (index: number, x: number, width: number) => {
      tabCenters.current[index] = x + width / 2;
      measuredCount.current += 1;
      if (measuredCount.current >= 4) {
        animateIndicator(activeIndex);
      } else if (index === activeIndex) {
        indicatorPos.setValue(
          tabCenters.current[index] - INDICATOR_WIDTH / 2
        );
      }
    },
    [activeIndex, animateIndicator, indicatorPos]
  );

  React.useEffect(() => {
    if (tabCenters.current[activeIndex] != null) {
      animateIndicator(activeIndex);
    }
  }, [activeIndex, animateIndicator]);

  const renderTab = (
    tab: Tab,
    label: string,
    IconComponent: React.FC<{ size?: number; color?: string }>,
    index: number,
    showDot = false
  ) => {
    const isActive = activeIndex === index;

    return (
      <TouchableOpacity
        key={tab}
        style={styles.tabButton}
        onPress={() => {
          triggerHapticForAction("tab");
          setCurrentTab(tab);
        }}
        onLayout={(e) =>
          handleTabLayout(
            index,
            e.nativeEvent.layout.x,
            e.nativeEvent.layout.width
          )
        }
        activeOpacity={ACTIVE_OPACITY}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={`Ir a la sección de ${label.toLowerCase()}`}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <View style={styles.iconArea}>
          <PopIcon active={isActive}>
            <IconComponent
              size={24}
              color={isActive ? theme.accent : theme.textMuted}
            />
          </PopIcon>
          {showDot && alertsCount > 0 ? (
            <View
              style={[styles.dot, { backgroundColor: theme.accent }]}
            />
          ) : null}
        </View>
        <Text
          style={[
            styles.tabText,
            {
              color: isActive ? theme.accent : theme.textMuted,
              fontFamily: isActive ? family.extrabold : family.semibold,
            },
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
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      <View style={styles.inner}>
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.accentSoft,
              height: 36,
              transform: [{ translateX: indicatorPos }],
            },
          ]}
        />
        {renderTab("inicio", "Inicio", HomeIcon, 0)}
        {renderTab("conversor", "Conversor", ExchangeIcon, 1)}
        {renderTab("comparador", "Comparador", ScaleIcon, 2)}
        {renderTab("herramientas", "Herramientas", GridIcon, 3, true)}
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
  indicator: {
    position: "absolute",
    top: 10,
    left: 0,
    width: INDICATOR_WIDTH,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.sm,
    height: TAB_HEIGHT,
  },
  iconArea: {
    width: INDICATOR_WIDTH - 8,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    top: 3,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  tabText: {
    fontSize: 12,
    fontFamily: family.semibold,
    letterSpacing: 0.2,
  },
});
