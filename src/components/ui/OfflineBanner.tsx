import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "../../theme/colors";
import { spacing, radius } from "../../theme/tokens";
import { WifiOffIcon } from "../Icons";

interface OfflineBannerProps {
  theme: Theme;
  onRetry?: () => void;
  retrying?: boolean;
}

export default function OfflineBanner({
  theme,
  onRetry,
  retrying = false,
}: OfflineBannerProps) {
  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.warningBg,
          borderColor: theme.warningBorder,
        },
      ]}
    >
      <WifiOffIcon size={16} color={theme.warning} />
      <Text style={[styles.text, { color: theme.warning }]}>
        Sin conexión: mostrando últimas tasas
      </Text>
      {onRetry ? (
        <TouchableOpacity
          style={[styles.retry, { borderColor: theme.warningBorder }]}
          onPress={onRetry}
          disabled={retrying}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Reintentar"
        >
          {retrying ? (
            <ActivityIndicator size="small" color={theme.warning} />
          ) : (
            <Text style={[styles.retryText, { color: theme.warning }]}>
              Reintentar
            </Text>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  retry: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 30,
    justifyContent: "center",
  },
  retryText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
