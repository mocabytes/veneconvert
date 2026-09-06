import React from "react";
import { StyleSheet, View, LayoutChangeEvent } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { Theme } from "../../theme/colors";
import { RateHistoryPoint } from "../../utils/ratesHistory";

interface SparklineProps {
  history: RateHistoryPoint[];
  theme: Theme;
  height?: number;
}

interface Point {
  x: number;
  y: number;
}

function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function Sparkline({
  history,
  theme,
  height = 72,
}: SparklineProps) {
  const [width, setWidth] = React.useState(0);

  if (history.length < 2) {
    return null;
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) {
      setWidth(next);
    }
  };

  const padX = 6;
  const padY = 8;
  const usableWidth = Math.max(10, width - padX * 2);
  const usableHeight = Math.max(10, height - padY * 2);

  const bcvValues = history.map((h) => h.bcv);
  const p2pValues = history.map((h) => h.binance);
  const allValues = [...bcvValues, ...p2pValues].filter((v) => Number.isFinite(v));

  const minVal = allValues.length ? Math.min(...allValues) : 0;
  const maxVal = allValues.length ? Math.max(...allValues) : 1;
  const range = maxVal - minVal || 1;

  const n = history.length;
  const getX = (i: number) => padX + (i / (n - 1)) * usableWidth;
  const getY = (val: number) =>
    padY + usableHeight - ((val - minVal) / range) * usableHeight;

  const bcvPoints: Point[] = bcvValues.map((v, i) => ({
    x: getX(i),
    y: getY(v),
  }));

  const p2pPoints: Point[] = p2pValues.map((v, i) => ({
    x: getX(i),
    y: getY(v),
  }));

  const bcvPath = buildSmoothPath(bcvPoints);
  const p2pPath = buildSmoothPath(p2pPoints);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Path
            d={bcvPath}
            fill="none"
            stroke={theme.accent}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {bcvPoints.map((p, i) => (
            <Circle
              key={`bcv-${i}`}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill={theme.accent}
              stroke={theme.surface}
              strokeWidth={1.5}
            />
          ))}

          <Path
            d={p2pPath}
            fill="none"
            stroke={theme.info}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {p2pPoints.map((p, i) => (
            <Circle
              key={`p2p-${i}`}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill={theme.info}
              stroke={theme.surface}
              strokeWidth={1.5}
            />
          ))}
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
});
