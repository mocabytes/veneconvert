import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from "react-native";
import { ConversionRecord } from "../utils/history";
import { family } from "../theme/tokens";

interface SwipeableHistoryItemProps {
  record: ConversionRecord;
  onDelete: () => void;
  onShare: () => void;
  onRepeat: () => void;
  theme: {
    surface: string;
    surfaceAlt: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    success: string;
    error: string;
    border: string;
  };
}

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

export default function SwipeableHistoryItem({
  record,
  onDelete,
  onShare,
  onRepeat,
  theme,
}: SwipeableHistoryItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 8;
      },
      onPanResponderMove: (_, gestureState) => {
        const base = isOpen.current ? -SWIPE_THRESHOLD * 2 : 0;
        const next = Math.min(
          0,
          Math.max(-SWIPE_THRESHOLD * 2, base + gestureState.dx)
        );
        translateX.setValue(next);
      },
      onPanResponderRelease: (_, gestureState) => {
        const base = isOpen.current ? -SWIPE_THRESHOLD * 2 : 0;
        const settle = base + gestureState.dx;
        if (settle < -SWIPE_THRESHOLD) {
          isOpen.current = true;
          Animated.spring(translateX, {
            toValue: -SWIPE_THRESHOLD * 2,
            tension: 45,
            friction: 6,
            useNativeDriver: Platform.OS !== "web",
          }).start();
        } else {
          isOpen.current = false;
          Animated.spring(translateX, {
            toValue: 0,
            tension: 45,
            friction: 6,
            useNativeDriver: Platform.OS !== "web",
          }).start();
        }
      },
    })
  ).current;

  const handleReset = () => {
    isOpen.current = false;
    Animated.spring(translateX, {
      toValue: 0,
      tension: 45,
      friction: 6,
      useNativeDriver: Platform.OS !== "web",
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

  const handlePress = () => {
    if (isOpen.current) {
      handleReset();
    } else {
      onRepeat();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.shareButton,
            { backgroundColor: theme.success },
          ]}
          onPress={handleShare}
        >
          <Text style={styles.actionButtonText}>Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.deleteButton,
            { backgroundColor: theme.error },
          ]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

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
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.type,
                { color: theme.textSecondary, textTransform: "capitalize" },
              ]}
            >
              {record.type.replace(/_/g, " ").toLowerCase()}
            </Text>
            <Text style={[styles.date, { color: theme.textMuted }]}>
              {new Date(record.timestamp).toLocaleDateString("es-VE", {
                day: "2-digit",
                month: "short",
              })}
            </Text>
          </View>

          <View style={styles.conversion}>
            <Text
              style={[
                styles.amount,
                { color: theme.textPrimary, fontVariant: ["tabular-nums"] },
              ]}
            >
              {record.fromAmount.toFixed(2)} {record.fromCurrency}
            </Text>
            <Text style={[styles.arrow, { color: theme.textMuted }]}>→</Text>
            <Text
              style={[
                styles.amount,
                { color: theme.textPrimary, fontVariant: ["tabular-nums"] },
              ]}
            >
              {record.toAmount.toFixed(2)} {record.toCurrency}
            </Text>
          </View>

          <View style={styles.rateInfo}>
            <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
              Tasa:
            </Text>
            <Text style={[styles.rateValue, { color: theme.success }]}>
              {record.rateType} ({record.rateUsed.toFixed(2)}
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
    fontFamily: family.bold,
  },
  shareButton: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  deleteButton: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  contentContainer: {
    borderRadius: 16,
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
    fontFamily: family.semibold,
    textTransform: "uppercase",
  },
  date: {
    fontSize: 11,
    fontFamily: family.regular,
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
    fontFamily: family.bold,
  },
  arrow: {
    fontSize: 16,
    fontFamily: family.regular,
  },
  rateInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  rateLabel: {
    fontSize: 12,
    fontFamily: family.regular,
  },
  rateValue: {
    fontSize: 12,
    fontFamily: family.semibold,
  },
});
