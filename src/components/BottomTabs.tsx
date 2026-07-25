import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { lightTheme, darkTheme } from "../theme/colors";
import { HomeIcon, ExchangeIcon, ScaleIcon, MenuIcon } from "./Icons";

interface BottomTabsProps {
  currentTab:
    | 'inicio'
    | 'conversor'
    | 'comparador'
    | 'multimoneda'
    | 'historial'
    | 'tendencias'
    | 'alertas'
    | 'configuracion';
  setCurrentTab: (
    tab:
      | 'inicio'
      | 'conversor'
      | 'comparador'
      | 'multimoneda'
      | 'historial'
      | 'tendencias'
      | 'alertas'
      | 'configuracion'
  ) => void;
  onMorePress: () => void;
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
  onMorePress,
  theme,
}: BottomTabsProps) {
  const iconScale = React.useRef(new Animated.Value(1)).current;
  const iconOpacity = React.useRef(new Animated.Value(0.6)).current;
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(iconOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const tabPositions = {
      inicio: 0,
      conversor: 1,
      comparador: 2,
      multimoneda: 3,
      historial: 4,
      tendencias: 5,
      alertas: 6,
      configuracion: 7,
    };
    Animated.spring(indicatorPosition, {
      toValue: tabPositions[currentTab],
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [currentTab, iconScale, iconOpacity, indicatorPosition]);

  const obtenerFondoConOpacidad = (hexColor: string, opacidadHex: string) => {
    if (hexColor.startsWith("#")) {
      return `${hexColor.slice(0, 7)}${opacidadHex}`;
    }
    return hexColor;
  };

  const renderTab = (
    tab: "inicio" | "conversor" | "comparador" | "configuracion",
    label: string,
    IconComponent: React.FC<{ size?: number; color?: string }>
  ) => {
    const isActive = currentTab === tab;

    return (
      <TouchableOpacity
        key={tab}
        style={[
          styles.tabButton,
          isActive && {
            backgroundColor: obtenerFondoConOpacidad(theme.accent, "20"),
          },
        ]}
        onPress={() => setCurrentTab(tab)}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={`Ir a la sección de ${label.toLowerCase()}`}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <Animated.View
          style={[
            styles.iconCircle,
            isActive && { transform: [{ scale: iconScale }] },
          ]}
        >
          <Animated.View style={{ opacity: iconOpacity }}>
            <IconComponent
              size={24}
              color={isActive ? theme.accent : theme.textPrimary}
            />
          </Animated.View>
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
    /* Corregimos asignando el color estricto del tema para bloquear transparencias indeseadas */
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.tabBarBackground,
          borderColor: obtenerFondoConOpacidad(theme.textPrimary, "15"),
        },
      ]}
    >
      {renderTab("inicio", "Inicio", HomeIcon)}
      {renderTab("conversor", "Conversor", ExchangeIcon)}
      {renderTab("comparador", "Comparador", ScaleIcon)}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={onMorePress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel="Más"
        accessibilityHint="Abrir menú"
        accessibilityRole="button"
      >
        <View style={styles.iconCircle}>
          <MenuIcon size={24} color={theme.textPrimary} />
        </View>
        <Text style={styles.tabText}>Más</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    alignSelf: "center",
    width: "92%",
    position: "absolute",
    bottom: 28,
    padding: 6,
    borderRadius: 32,
    gap: 4,
    borderWidth: 1,
    shadowColor: "#53A548",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 12,
    minHeight: 56,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  iconText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
});
