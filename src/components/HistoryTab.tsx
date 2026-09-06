import React, { lazy, Suspense } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { ConversionRecord } from "../utils/history";
import { Theme } from "../theme/colors";
import { radius } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import EmptyState from "./ui/EmptyState";
import { BookIcon, TrashIcon } from "./Icons";

const SwipeableHistoryItem = lazy(
  () => import('./SwipeableHistoryItem')
);

interface HistoryTabProps {
  conversionHistory: ConversionRecord[];
  onDelete: (id: string) => void;
  onShare: (record: ConversionRecord) => void;
  onRepeat: (record: ConversionRecord) => void;
  onClearHistory: () => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function HistoryTab({
  conversionHistory,
  onDelete,
  onShare,
  onRepeat,
  onClearHistory,
  theme,
  fadeAnim,
  slideAnim,
}: HistoryTabProps) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Historial"
          subtitle="Toca una conversión para repetirla."
          theme={theme}
          right={
            conversionHistory.length > 0 ? (
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  {
                    backgroundColor: theme.errorBg,
                    borderColor: theme.errorBorder,
                  },
                ]}
                onPress={onClearHistory}
                accessibilityLabel="Limpiar todo el historial"
                accessibilityRole="button"
              >
                <TrashIcon size={18} color={theme.error} />
              </TouchableOpacity>
            ) : null
          }
        />

        {conversionHistory.length > 0 ? (
          <View style={styles.list}>
            {conversionHistory.slice(0, 20).map((record) => (
              <Suspense
                key={record.id}
                fallback={
                  <ActivityIndicator size="small" color={theme.accent} />
                }
              >
                <SwipeableHistoryItem
                  record={record}
                  onDelete={() => onDelete(record.id)}
                  onShare={() => onShare(record)}
                  onRepeat={() => onRepeat(record)}
                  theme={theme}
                />
              </Suspense>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<BookIcon size={26} color={theme.accent} />}
            title="No hay conversiones aún"
            description="Tus conversiones aparecerán aquí al usarlas en el Conversor."
            theme={theme}
          />
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
  list: {
    gap: 10,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
