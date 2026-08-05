import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import {
  GlobeIcon,
  BookIcon,
  TrendIcon,
  BellIcon,
  SettingsIcon,
} from "./Icons";

interface MoreMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectTab: (
    tab:
      | 'multimoneda'
      | 'historial'
      | 'tendencias'
      | 'alertas'
      | 'configuracion'
  ) => void;
  theme: {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentSoft: string;
    overlay: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { width } = Dimensions.get("window");

export default function MoreMenu({
  visible,
  onClose,
  onSelectTab,
  theme,
}: MoreMenuProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const menuItems = [
    {
      id: 'multimoneda',
      label: 'Multi-moneda',
      icon: <GlobeIcon size={24} color={theme.accent} />,
      description: 'Cambio entre monedas',
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: <BookIcon size={24} color={theme.accent} />,
      description: 'Conversiones recientes',
    },
    {
      id: 'tendencias',
      label: 'Tendencias',
      icon: <TrendIcon size={24} color={theme.accent} />,
      description: 'Gráfico de tasas',
    },
    {
      id: 'alertas',
      label: 'Alertas',
      icon: <BellIcon size={24} color={theme.accent} />,
      description: 'Notificaciones de tasa',
    },
    {
      id: 'configuracion',
      label: 'Ajustes',
      icon: <SettingsIcon size={24} color={theme.accent} />,
      description: 'Configuración',
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={[styles.backdrop, { backgroundColor: theme.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.menuContainer,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.menuHeader}>
          <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>
            Más
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: theme.textMuted }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuItems}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: theme.surfaceAlt }]}
              onPress={() => {
                onSelectTab(item.id as any);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.accentSoft },
                ]}
              >
                {item.icon}
              </View>
              <View style={styles.itemContent}>
                <Text style={[styles.itemLabel, { color: theme.textPrimary }]}>
                  {item.label}
                </Text>
                <Text
                  style={[styles.itemDescription, { color: theme.textMuted }]}
                >
                  {item.description}
                </Text>
              </View>
              <Text style={[styles.itemArrow, { color: theme.textMuted }]}>
                ›
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  menuItems: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    fontWeight: "500",
  },
  itemArrow: {
    fontSize: 20,
    fontWeight: "300",
  },
});
