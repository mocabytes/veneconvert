import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { ConversionRecord } from "../utils/history";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { lightTheme, darkTheme } from "../theme/colors";

interface SwipeableHistoryItemProps {
  record: ConversionRecord;
  onDelete: () => void;
  onShare: () => void;
  theme: {
    surface: string;
    surfaceAlt: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    success: string;
    border: string;
  };
}

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

export default function SwipeableHistoryItem({
  record,
  onDelete,
  onShare,
  theme,
}: SwipeableHistoryItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 8;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -SWIPE_THRESHOLD * 2));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          Animated.spring(translateX, {
            toValue: -SWIPE_THRESHOLD,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleReset = () => {
    Animated.spring(translateX, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = () => {
    onDelete();
    handleReset();
  };

  const handleShare = () => {
    onShare();
    handleReset();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.actionsContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.shareButton,
            { backgroundColor: theme.accent },
          ]}
          onPress={handleShare}
        >
          <Text style={styles.actionButtonText}>Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.deleteButton,
            { backgroundColor: '#EF4444' },
          ]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.content}
          onPress={handleReset}
          activeOpacity={1}
        >
          <View style={styles.header}>
            <Text style={[styles.type, { color: theme.textSecondary }]}>
              {record.type.replace(/_/g, " ")}
            </Text>
            <Text style={[styles.date, { color: theme.textMuted }]}>
              {new Date(record.timestamp).toLocaleDateString("es-VE")}
            </Text>
          </View>

          <View style={styles.conversion}>
            <Text style={[styles.amount, { color: theme.textPrimary }]}>
              {record.fromAmount.toFixed(2)} {record.fromCurrency}
            </Text>
            <Text style={[styles.arrow, { color: theme.textMuted }]}>→</Text>
            <Text style={[styles.amount, { color: theme.textPrimary }]}>
              {record.toAmount.toFixed(2)} {record.toCurrency}
            </Text>
          </View>

          <View style={styles.rateInfo}>
            <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
              Tasa:
            </Text>
            <Text style={[styles.rateValue, { color: theme.success }]}>
              {record.rateType} ({record.rateUsed.toFixed(2)})
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    overflow: "hidden",
  },
  actionsContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    width: SWIPE_THRESHOLD * 2,
    zIndex: -1,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  shareButton: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  deleteButton: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  contentContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  type: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  date: {
    fontSize: 11,
  },
  conversion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
  },
  arrow: {
    fontSize: 16,
  },
  rateInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  rateLabel: {
    fontSize: 12,
  },
  rateValue: {
    fontSize: 12,
    fontWeight: "600",
  },
});
