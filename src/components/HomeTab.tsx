import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Share,
} from "react-native";
import { triggerHapticForAction } from "../utils/haptic";
import {
  ShareIcon,
  ClockIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  WalletIcon,
  TrendingUpIcon,
  BookIcon,
  ScaleIcon,
  SwapIcon,
  SwapVerticalIcon,
} from "./Icons";
import { formatRelativeTime } from "../utils/time";
import { recomendarOperacion } from "../utils/recomendacion";
import { Theme } from "../theme/colors";
import { spacing, radius, type, family } from "../theme/tokens";
import { RateHistoryPoint, getRateStats } from "../utils/ratesHistory";
import { TabMode } from "../types";
import Card from "./ui/Card";
import AmountText from "./ui/AmountText";
import Badge from "./ui/Badge";
import Sparkline from "./ui/Sparkline";

interface HomeTabProps {
  nombreUsuario: string;
  tasas: { bcv: number; binanceBuy: number; binanceSell: number };
  cargandoTasas: boolean;
  ultimaSincronizacion: string;
  ratesHistory: RateHistoryPoint[];
  onNavigateToTab: (tab: TabMode) => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

interface QuickAction {
  tab: TabMode;
  title: string;
  icon: React.FC<{ size?: number; color?: string }>;
}

export default function HomeTab({
  nombreUsuario,
  tasas,
  cargandoTasas,
  ultimaSincronizacion,
  ratesHistory,
  onNavigateToTab,
  theme,
  fadeAnim,
  slideAnim,
}: HomeTabProps) {
  const stats = React.useMemo(() => getRateStats(ratesHistory), [ratesHistory]);
  const change = stats.bcv.change;
  const hasHistory = ratesHistory.length >= 2;
  const spread = Math.max(0, tasas.binanceBuy - tasas.binanceSell);
  const recomendacion = React.useMemo(
    () => recomendarOperacion(tasas),
    [tasas],
  );

  const quickActions: QuickAction[] = [
    { tab: "conversor", title: "Conversor", icon: SwapIcon },
    { tab: "comparador", title: "Comparador", icon: ScaleIcon },
    { tab: "tendencias", title: "Tendencias", icon: TrendingUpIcon },
    { tab: "historial", title: "Historial", icon: BookIcon },
  ];

  const shareTasas = async () => {
    triggerHapticForAction("share");
    const message = `Tasas en Arco\n\nBCV: Bs. ${tasas.bcv.toFixed(
      2,
    )}\nP2P Compra: Bs. ${tasas.binanceBuy.toFixed(
      2,
    )}\nP2P Venta: Bs. ${tasas.binanceSell.toFixed(2)}\n\n${
      ultimaSincronizacion
        ? `Actualizado: ${formatRelativeTime(ultimaSincronizacion)}`
        : ""
    }\n\nDescarga Arco para tus conversiones rápidas`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error("Error compartiendo tasas:", error);
    }
  };

  const handleQuickAction = (tab: TabMode) => {
    triggerHapticForAction("tab");
    onNavigateToTab(tab);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.greetingRow}>
        <View style={[styles.avatar, { backgroundColor: theme.accentSoft }]}>
          <Text style={[styles.avatarText, { color: theme.accent }]}>
            {(nombreUsuario || "U").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.greetingColumn}>
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            Arco • Tasas BCV y P2P en tiempo real
          </Text>
          <Text style={[styles.greeting, { color: theme.textPrimary }]}>
            Hola, {nombreUsuario}
          </Text>
        </View>
      </View>

      <Card theme={theme} elevated>
        <View style={styles.heroHeader}>
          <Text style={[styles.heroEyebrow, { color: theme.textMuted }]}>
            Tasa BCV hoy
          </Text>
          {cargandoTasas ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <TouchableOpacity
              style={[
                styles.shareButton,
                { backgroundColor: theme.surfaceAlt },
              ]}
              onPress={shareTasas}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel="Compartir tasas"
              accessibilityRole="button"
            >
              <ShareIcon size={18} color={theme.accent} />
            </TouchableOpacity>
          )}
        </View>
        <AmountText
          value={tasas.bcv.toFixed(2)}
          prefix="Bs. "
          size="xl"
          color={theme.textPrimary}
        />
        <View style={[styles.heroFooter, { borderTopColor: theme.divider }]}>
          {hasHistory && change !== 0 ? (
            <Badge
              label={`${change > 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(
                2,
              )}%`}
              tone={change > 0 ? "success" : "error"}
              theme={theme}
            />
          ) : null}
          {ultimaSincronizacion ? (
            <View style={styles.syncRow}>
              <ClockIcon size={14} color={theme.textMuted} />
              <Text style={[styles.syncText, { color: theme.textMuted }]}>
                Actualizado {formatRelativeTime(ultimaSincronizacion)}
              </Text>
            </View>
          ) : null}
        </View>

        {hasHistory ? (
          <View
            style={[styles.sparkSection, { borderTopColor: theme.divider }]}
          >
            <View style={styles.sparkHeader}>
              <Text style={[styles.sparkTitle, { color: theme.textSecondary }]}>
                Últimos 7 días
              </Text>
              <View style={styles.legendLeft}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: theme.accent },
                    ]}
                  />
                  <Text style={[styles.legendText, { color: theme.textMuted }]}>
                    BCV
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: theme.info }]}
                  />
                  <Text style={[styles.legendText, { color: theme.textMuted }]}>
                    P2P
                  </Text>
                </View>
              </View>
            </View>
            <Sparkline
              history={ratesHistory.slice(-7)}
              theme={theme}
              height={64}
            />
          </View>
        ) : null}
      </Card>

      <TouchableOpacity
        style={[
          styles.recommendCard,
          {
            backgroundColor: theme.accentSoft,
            borderColor: theme.successBorder,
          },
        ]}
        onPress={() => handleQuickAction("comparador")}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="Ver recomendación de cambio"
        accessibilityRole="button"
      >
        <View style={styles.recommendTop}>
          <View
            style={[styles.recommendIcon, { backgroundColor: theme.successBg }]}
          >
            <WalletIcon size={18} color={theme.success} />
          </View>
          <Text style={[styles.recommendTitle, { color: theme.textPrimary }]}>
            Hoy conviene
          </Text>
          <ArrowRightIcon size={16} color={theme.success} />
        </View>

        <View style={styles.recommendRow}>
          <View style={styles.recommendCol}>
            <Text style={[styles.recommendLabel, { color: theme.textMuted }]}>
              Comprar USD
            </Text>
            <View style={styles.recommendValueRow}>
              <Badge
                label={recomendacion.compra.mejor}
                tone={recomendacion.compra.mejor === "P2P" ? "success" : "info"}
                theme={theme}
              />
              <AmountText
                value={recomendacion.compra.valor.toFixed(2)}
                prefix="Bs. "
                size="md"
                color={theme.textPrimary}
              />
            </View>
            {recomendacion.compra.ahorro > 0 ? (
              <Text style={[styles.recommendHint, { color: theme.success }]}>
                Ahorras Bs. {recomendacion.compra.ahorro.toFixed(2)} por USD
              </Text>
            ) : null}
          </View>

          <View
            style={[
              styles.recommendDivider,
              { backgroundColor: theme.divider },
            ]}
          />

          <View style={styles.recommendCol}>
            <Text style={[styles.recommendLabel, { color: theme.textMuted }]}>
              Vender USD
            </Text>
            <View style={styles.recommendValueRow}>
              <Badge
                label={recomendacion.venta.mejor}
                tone={recomendacion.venta.mejor === "P2P" ? "success" : "info"}
                theme={theme}
              />
              <AmountText
                value={recomendacion.venta.valor.toFixed(2)}
                prefix="Bs. "
                size="md"
                color={theme.textPrimary}
              />
            </View>
            {recomendacion.venta.ahorro > 0 ? (
              <Text style={[styles.recommendHint, { color: theme.success }]}>
                Ganas Bs. {recomendacion.venta.ahorro.toFixed(2)} por USD
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.recommendCta}>
          <Text style={[styles.recommendCtaText, { color: theme.success }]}>
            Comparar opciones
          </Text>
          <ArrowRightIcon size={14} color={theme.success} />
        </View>
      </TouchableOpacity>

      <View style={styles.ratesRow}>
        {cargandoTasas ? (
          <View
            style={[styles.loadingBox, { backgroundColor: theme.surfaceAlt }]}
          >
            <ActivityIndicator size="small" color={theme.accent} />
          </View>
        ) : (
          <>
            <View style={[styles.rateChip, { borderColor: theme.border }]}>
              <View style={styles.rateChipIcon}>
                <ArrowDownIcon size={14} color={theme.success} />
              </View>
              <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
                P2P Compra
              </Text>
              <AmountText
                value={tasas.binanceBuy.toFixed(2)}
                prefix="Bs. "
                size="md"
                color={theme.textPrimary}
              />
            </View>
            <View style={[styles.rateChip, { borderColor: theme.border }]}>
              <View style={styles.rateChipIcon}>
                <ArrowUpIcon size={14} color={theme.warning} />
              </View>
              <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
                P2P Venta
              </Text>
              <AmountText
                value={tasas.binanceSell.toFixed(2)}
                prefix="Bs. "
                size="md"
                color={theme.textPrimary}
              />
            </View>
            <View style={[styles.rateChip, { borderColor: theme.border }]}>
              <View style={styles.rateChipIcon}>
                <SwapVerticalIcon size={12} color={theme.accent} />
              </View>
              <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
                Diferencia
              </Text>
              <AmountText
                value={spread.toFixed(2)}
                prefix="Bs. "
                size="md"
                color={theme.accent}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.quickRow}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.tab}
            style={[
              styles.quickItem,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => handleQuickAction(action.tab)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel={action.title}
            accessibilityRole="button"
          >
            <View
              style={[styles.quickIcon, { backgroundColor: theme.accentSoft }]}
            >
              <action.icon size={18} color={theme.accent} />
            </View>
            <Text style={[styles.quickLabel, { color: theme.textSecondary }]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontFamily: family.extrabold,
  },
  greetingColumn: {
    flex: 1,
    paddingRight: spacing.md,
  },
  eyebrow: {
    ...type.labelSmall,
    marginBottom: spacing.xs,
  },
  greeting: {
    ...type.title,
    fontFamily: family.extrabold,
    lineHeight: 32,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  heroEyebrow: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  syncText: {
    fontSize: 11,
    fontFamily: family.semibold,
  },
  sparkSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  sparkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sparkTitle: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  legendLeft: {
    flexDirection: "row",
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontFamily: family.semibold,
  },
  recommendCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  recommendTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  recommendIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: family.extrabold,
  },
  recommendRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.md,
  },
  recommendCol: {
    flex: 1,
  },
  recommendLabel: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  recommendValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  recommendHint: {
    fontSize: 11,
    fontFamily: family.semibold,
    marginTop: 6,
  },
  recommendDivider: {
    width: 1,
  },
  recommendCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  recommendCtaText: {
    fontSize: 13,
    fontFamily: family.bold,
  },
  ratesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: spacing.xxl,
  },
  rateChip: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 84,
  },
  rateChipIcon: {
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderRadius: radius.md,
    minHeight: 76,
  },
  quickRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: spacing.xxl,
  },
  quickItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 92,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  quickLabel: {
    fontSize: 8,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});
