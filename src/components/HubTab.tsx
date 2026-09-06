import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  ScaleIcon,
  GlobeIcon,
  BellIcon,
  TrendIcon,
  BookIcon,
  SettingsIcon,
  LightbulbIcon,
  ChevronRightIcon,
} from "./Icons";
import { triggerHapticForAction } from "../utils/haptic";
import { isTablet } from "../utils/responsive";
import { TabMode } from "../types";
import { Theme } from "../theme/colors";
import { spacing, radius } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

interface HubTabProps {
  historialCount: number;
  alertsCount: number;
  tipAleatorio: string;
  onNavigateToTab: (tab: TabMode) => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

type ToolTint = "accent" | "info" | "warning" | "neutral";

interface ToolEntry {
  tab: TabMode;
  title: string;
  description: string;
  icon: React.FC<{ size?: number; color?: string }>;
  tint: ToolTint;
  badge?: number;
}

export default function HubTab({
  historialCount,
  alertsCount,
  tipAleatorio,
  onNavigateToTab,
  theme,
  fadeAnim,
  slideAnim,
}: HubTabProps) {
  const tools: ToolEntry[] = [
    {
      tab: "comparador",
      title: "Comparador",
      description: "La mejor opción de cambio",
      icon: ScaleIcon,
      tint: "accent",
    },
    {
      tab: "multimoneda",
      title: "Multi-moneda",
      description: "Cambio entre monedas",
      icon: GlobeIcon,
      tint: "info",
    },
    {
      tab: "alertas",
      title: "Alertas",
      description: "Notificaciones de tasa",
      icon: BellIcon,
      tint: "warning",
      badge: alertsCount,
    },
    {
      tab: "tendencias",
      title: "Tendencias",
      description: "Evolución diaria",
      icon: TrendIcon,
      tint: "accent",
    },
    {
      tab: "historial",
      title: "Historial",
      description: "Conversiones recientes",
      icon: BookIcon,
      tint: "info",
      badge: historialCount,
    },
    {
      tab: "configuracion",
      title: "Ajustes",
      description: "Personaliza tu perfil",
      icon: SettingsIcon,
      tint: "neutral",
    },
  ];

  const tintMap: Record<ToolTint, { color: string; bg: string }> = {
    accent: { color: theme.accent, bg: theme.accentSoft },
    info: { color: theme.info, bg: theme.infoBg },
    warning: { color: theme.warning, bg: theme.warningBg },
    neutral: { color: theme.textSecondary, bg: theme.surfaceAlt },
  };

  const cols = isTablet() ? 2 : 2;
  const minHeight = isTablet() ? 176 : 168;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <ScreenHeader
        title="Herramientas"
        subtitle="Todo para mover tu dinero, en un solo lugar."
        theme={theme}
      />

      <View style={styles.grid}>
        {tools.map((tool) => {
          const tint = tintMap[tool.tint];
          const showBadge = (tool.badge ?? 0) > 0;
          return (
            <TouchableOpacity
              key={tool.tab}
              style={[
                styles.gridItem,
                {
                  flexGrow: 1,
                  flexBasis: cols === 2 ? "45%" : "45%",
                  minHeight,
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => {
                triggerHapticForAction("tab");
                onNavigateToTab(tool.tab);
              }}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={tool.title}
              accessibilityRole="button"
            >
              {showBadge ? (
                <View style={styles.badgeCorner}>
                  <Badge
                    label={String(tool.badge)}
                    tone="success"
                    theme={theme}
                  />
                </View>
              ) : null}
              <View style={[styles.toolIcon, { backgroundColor: tint.bg }]}>
                <tool.icon size={24} color={tint.color} />
              </View>
              <Text style={[styles.toolTitle, { color: theme.textPrimary }]}>
                {tool.title}
              </Text>
              <Text
                style={[styles.toolDescription, { color: theme.textMuted }]}
              >
                {tool.description}
              </Text>
              <View style={styles.toolFooter}>
                <Text style={[styles.toolFooterText, { color: tint.color }]}>
                  Abrir
                </Text>
                <ChevronRightIcon size={14} color={tint.color} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {tipAleatorio ? (
        <Card theme={theme} padding={spacing.lg}>
          <View style={styles.tipHeader}>
            <View
              style={[styles.tipIcon, { backgroundColor: theme.accentSoft }]}
            >
              <LightbulbIcon size={18} color={theme.accent} />
            </View>
            <Text style={[styles.tipTitle, { color: theme.textPrimary }]}>
              Tip del día
            </Text>
          </View>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            {tipAleatorio}
          </Text>
        </Card>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridItem: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  badgeCorner: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  toolFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: "auto",
    paddingTop: spacing.md,
  },
  toolFooterText: {
    fontSize: 12,
    fontWeight: "700",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },
});
