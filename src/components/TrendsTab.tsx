import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  RateHistoryPoint,
  getChartData,
  getRateStats,
} from "../utils/ratesHistory";
import { Theme } from "../theme/colors";
import { spacing, radius } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import Card from "./ui/Card";
import StatCard from "./ui/StatCard";
import EmptyState from "./ui/EmptyState";
import Badge from "./ui/Badge";
import { TrendIcon } from "./Icons";

interface TrendsTabProps {
  ratesHistory: RateHistoryPoint[];
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function TrendsTab({
  ratesHistory,
  theme,
  fadeAnim,
  slideAnim,
}: TrendsTabProps) {
  const stats = getRateStats(ratesHistory);
  const [chartWidth, setChartWidth] = React.useState(280);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Tendencias"
          subtitle="Evolución diaria de la tasa BCV y P2P."
          theme={theme}
        />

        {ratesHistory.length === 0 ? (
          <EmptyState
            icon={<TrendIcon size={26} color={theme.accent} />}
            title="Aún no hay datos de tasas"
            description="Las tendencias se llenan con cada actualización. Tira para refrescar."
            theme={theme}
          />
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatCard
                label="BCV actual"
                value={`Bs. ${stats.bcv.current.toFixed(2)}`}
                theme={theme}
                compact
                sub={
                  stats.bcv.change !== 0 ? (
                    <Badge
                      label={`${stats.bcv.change >= 0 ? "▲" : "▼"} ${Math.abs(
                        stats.bcv.change
                      ).toFixed(2)}%`}
                      tone={stats.bcv.change >= 0 ? "success" : "error"}
                      theme={theme}
                    />
                  ) : null
                }
              />
              <StatCard
                label="Promedio"
                value={`Bs. ${stats.bcv.average.toFixed(2)}`}
                theme={theme}
                compact
              />
              <StatCard
                label="Máx / Mín"
                value={`${stats.bcv.max.toFixed(0)} / ${stats.bcv.min.toFixed(0)}`}
                theme={theme}
                compact
              />
            </View>

            <Card
              theme={theme}
              padding={spacing.lg}
              onLayout={(e) =>
                setChartWidth(
                  Math.max(200, e.nativeEvent.layout.width - spacing.lg * 2)
                )
              }
            >
              <View style={styles.legend}>
                <View style={styles.legendLeft}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: theme.accent },
                      ]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      BCV
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: theme.info }]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      P2P
                    </Text>
                  </View>
                </View>
                <Text style={[styles.periodText, { color: theme.textMuted }]}>
                  Últimos {ratesHistory.length} días
                </Text>
              </View>
              <LineChart
                data={getChartData(ratesHistory, {
                  bcv: theme.accent,
                  p2p: theme.info,
                })}
                width={chartWidth}
                height={220}
                fromZero={false}
                withShadow={false}
                chartConfig={{
                  backgroundColor: theme.surface,
                  backgroundGradientFrom: theme.surface,
                  backgroundGradientTo: theme.surface,
                  decimalPlaces: 2,
                  color: () => theme.textSecondary,
                  labelColor: () => theme.textMuted,
                  propsForBackgroundLines: {
                    stroke: theme.divider,
                  },
                  propsForLabels: {
                    fontSize: 10,
                  },
                  propsForDots: {
                    r: "3",
                    strokeWidth: "2",
                    stroke: theme.surface,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </Card>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    width: "100%",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  legendLeft: {
    flexDirection: "row",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
  },
  periodText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: radius.md,
  },
});
