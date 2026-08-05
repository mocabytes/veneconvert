import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
} from "react-native";

interface ConverterTabProps {
  bs: string;
  usdBcv: string;
  usdtBinance: string;
  onBsChange: (value: string) => void;
  onBcvChange: (value: string) => void;
  onBinanceChange: (value: string) => void;
  theme: {
    accent: string;
    surface: string;
    border: string;
    successBorder: string;
    successBg: string;
    warningBorder: string;
    warningBg: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function ConverterTab({
  bs,
  usdBcv,
  usdtBinance,
  onBsChange,
  onBcvChange,
  onBinanceChange,
  theme,
  fadeAnim,
  slideAnim,
}: ConverterTabProps) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.flatContainer}>
        <Text
          style={[
            styles.cardLabel,
            { color: theme.accent, marginBottom: 2 },
          ]}
        >
          Modo conversor
        </Text>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.textPrimary, marginBottom: 24 },
          ]}
        >
          Conversor rápido
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Bolívares (VES)
          </Text>
          <View
            style={[
              styles.flatInputWrapper,
              {
                borderColor: theme.border,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Text
              style={[styles.currencyPrefix, { color: theme.textMuted }]}
            >
              Bs.
            </Text>
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              keyboardType="numeric"
              value={bs}
              onChangeText={onBsChange}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Dólares (Tasa BCV)
          </Text>
          <View
            style={[
              styles.flatInputWrapper,
              {
                borderColor: theme.successBorder,
                backgroundColor: theme.successBg,
              },
            ]}
          >
            <Text
              style={[styles.currencyPrefix, { color: theme.textMuted }]}
            >
              $
            </Text>
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              keyboardType="numeric"
              value={usdBcv}
              onChangeText={onBcvChange}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            USDT (Tasa Binance Venta)
          </Text>
          <View
            style={[
              styles.flatInputWrapper,
              {
                borderColor: theme.warningBorder,
                backgroundColor: theme.warningBg,
              },
            ]}
          >
            <Text
              style={[styles.currencyPrefix, { color: theme.textMuted }]}
            >
              ₮
            </Text>
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              keyboardType="numeric"
              value={usdtBinance}
              onChangeText={onBinanceChange}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flatContainer: {
    padding: 20,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  flatInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },
});
