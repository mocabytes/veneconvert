import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Theme } from "../theme/colors";
import ScreenHeader from "./ui/ScreenHeader";
import ClearButton from "./ui/ClearButton";
import AmountInput from "./ui/AmountInput";
import { CopyIcon } from "./Icons";
import { triggerHapticForAction } from "../utils/haptic";
import { spacing, radius } from "../theme/tokens";

interface ConverterTabProps {
  bs: string;
  usdBcv: string;
  usdtBinance: string;
  tasas: { bcv: number; binanceBuy: number; binanceSell: number };
  onBsChange: (value: string) => void;
  onBsEnd: () => void;
  onBcvChange: (value: string) => void;
  onBcvEnd: () => void;
  onBinanceChange: (value: string) => void;
  onBinanceEnd: () => void;
  onClear: () => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function ConverterTab({
  bs,
  usdBcv,
  usdtBinance,
  tasas,
  onBsChange,
  onBsEnd,
  onBcvChange,
  onBcvEnd,
  onBinanceChange,
  onBinanceEnd,
  onClear,
  theme,
  fadeAnim,
  slideAnim,
}: ConverterTabProps) {
  const copiar = async (value: string, label: string) => {
    if (!value || parseFloat(value) <= 0) {
      return;
    }
    triggerHapticForAction("button");
    await Clipboard.setStringAsync(
      `${label}: ${value} (Arco)`
    );
  };

  const renderCopySlot = (value: string, label: string) => (
    <TouchableOpacity
      style={[styles.copyButton, { backgroundColor: theme.accentSoft }]}
      onPress={() => copiar(value, label)}
      disabled={!value || parseFloat(value) <= 0}
      accessibilityLabel={`Copiar ${label}`}
      accessibilityRole="button"
    >
      <CopyIcon size={18} color={theme.accent} />
    </TouchableOpacity>
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Conversor"
          subtitle="Escribe en cualquier campo y las demás monedas se actualizan al instante."
          theme={theme}
          right={<ClearButton onPress={onClear} theme={theme} />}
        />

        <AmountInput
          label="Bolívares (VES)"
          prefix="Bs."
          value={bs}
          onChangeText={onBsChange}
          onEndEditing={onBsEnd}
          rightSlot={renderCopySlot(bs, "VES")}
          theme={theme}
        />

        <AmountInput
          label="Dólares (tasa BCV)"
          prefix="$"
          value={usdBcv}
          onChangeText={onBcvChange}
          onEndEditing={onBcvEnd}
          rightSlot={renderCopySlot(usdBcv, "USD BCV")}
          theme={theme}
        />

        <AmountInput
          label="USDT (Binance venta)"
          prefix="₮"
          value={usdtBinance}
          onChangeText={onBinanceChange}
          onEndEditing={onBinanceEnd}
          rightSlot={renderCopySlot(usdtBinance, "USDT")}
          theme={theme}
        />

        <View style={styles.ratesStrip}>
          <View style={styles.rateItem}>
            <Text style={[styles.rateKey, { color: theme.textMuted }]}>
              BCV
            </Text>
            <Text style={[styles.rateValue, { color: theme.textPrimary }]}>
              {tasas.bcv.toFixed(2)}
            </Text>
          </View>
          <View style={styles.rateItem}>
            <Text style={[styles.rateKey, { color: theme.textMuted }]}>
              P2P compra
            </Text>
            <Text style={[styles.rateValue, { color: theme.textPrimary }]}>
              {tasas.binanceBuy.toFixed(2)}
            </Text>
          </View>
          <View style={styles.rateItem}>
            <Text style={[styles.rateKey, { color: theme.textMuted }]}>
              P2P venta
            </Text>
            <Text style={[styles.rateValue, { color: theme.textPrimary }]}>
              {tasas.binanceSell.toFixed(2)}
            </Text>
          </View>
        </View>
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
  copyButton: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  ratesStrip: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  rateItem: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
  },
  rateKey: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
