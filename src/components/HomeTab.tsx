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
import { Theme } from "../theme/colors";
import { spacing, radius, type, family } from "../theme/tokens";
import { RateHistoryPoint, getRateStats } from "../utils/ratesHistory";
import { TabMode } from "../types";
import Card from "./ui/Card";
import AmountText from "./ui/AmountText";
import AnimatedRateNumber from "./ui/AnimatedRateNumber";
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

      <Card
        theme={theme}
        elevated
        style={{
          backgroundColor: theme.accentSoft,
          borderColor: theme.successBorder,
        }}
      >
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
        <AnimatedRateNumber
          value={tasas.bcv}
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
                    style={[
                      styles.legendDot,
                      { backgroundColor: theme.info },
                    ]}
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
});
