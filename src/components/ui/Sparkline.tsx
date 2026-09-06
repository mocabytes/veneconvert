import React from "react";
import { StyleSheet, View, LayoutChangeEvent } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Theme } from "../../theme/colors";
import { getChartData, RateHistoryPoint } from "../../utils/ratesHistory";
import { radius } from "../../theme/tokens";

interface SparklineProps {
  history: RateHistoryPoint[];
  theme: Theme;
  height?: number;
}

export default function Sparkline({
  history,
  theme,
  height = 72,
}: SparklineProps) {
  const [width, setWidth] = React.useState(260);

  if (history.length < 2) {
    return null;
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next > 0) {
      setWidth(next);
    }
  };

  const data = getChartData(history, {
    bcv: theme.accent,
    p2p: theme.info,
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <LineChart
        data={data}
        width={width}
        height={height}
        fromZero={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
        withOuterLines={false}
        withInnerLines={false}
        withShadow={false}
        bezier
        chartConfig={{
          backgroundColor: "transparent",
          backgroundGradientFrom: "transparent",
          backgroundGradientTo: "transparent",
          decimalPlaces: 0,
          color: () => theme.textSecondary,
          labelColor: () => theme.textMuted,
          propsForBackgroundLines: {
            stroke: theme.divider,
          },
          propsForDots: {
            r: "2",
            strokeWidth: "1.5",
            stroke: theme.surface,
          },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  chart: {
    borderRadius: radius.sm,
  },
});
