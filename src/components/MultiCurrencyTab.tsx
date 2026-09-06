import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import {
  SUPPORTED_CURRENCIES,
  ConversionResult,
  getCurrencyByCode,
} from "../utils/multiCurrency";
import { SwapIcon, ChevronDownIcon } from "./Icons";
import AnimatedButton from "./AnimatedButton";
import { getFlagIcon } from "./Icons";
import { Theme } from "../theme/colors";
import { spacing, radius, family } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import ClearButton from "./ui/ClearButton";
import AmountInput from "./ui/AmountInput";
import PrimaryButton from "./ui/PrimaryButton";
import Card from "./ui/Card";

interface MultiCurrencyTabProps {
  selectedFromCurrency: string;
  selectedToCurrency: string;
  multiCurrencyAmount: string;
  multiCurrencyResult: ConversionResult | null;
  showFromCurrencySelector: boolean;
  showToCurrencySelector: boolean;
  onSelectFromCurrency: (code: string) => void;
  onSelectToCurrency: (code: string) => void;
  setShowFromCurrencySelector: (show: boolean) => void;
  setShowToCurrencySelector: (show: boolean) => void;
  setMultiCurrencyAmount: (value: string) => void;
  onSwap: () => void;
  onConvert: () => void;
  onClear: () => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function MultiCurrencyTab({
  selectedFromCurrency,
  selectedToCurrency,
  multiCurrencyAmount,
  multiCurrencyResult,
  showFromCurrencySelector,
  showToCurrencySelector,
  onSelectFromCurrency,
  onSelectToCurrency,
  setShowFromCurrencySelector,
  setShowToCurrencySelector,
  setMultiCurrencyAmount,
  onSwap,
  onConvert,
  onClear,
  theme,
  fadeAnim,
  slideAnim,
}: MultiCurrencyTabProps) {
  const spin = React.useRef(new Animated.Value(0)).current;

  const handleSwap = () => {
    spin.setValue(0);
    Animated.timing(spin, {
      toValue: 1,
      duration: 250,
      useNativeDriver: Platform.OS !== "web",
    }).start();
    onSwap();
  };

  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const fromCurrency = getCurrencyByCode(selectedFromCurrency);
  const toCurrency = getCurrencyByCode(selectedToCurrency);

  const renderCurrencySelector = (
    label: string,
    code: string,
    onOpen: () => void
  ) => {
    const currency = getCurrencyByCode(code);
    return (
      <View style={styles.selectorHalf}>
        <Text style={[styles.selectorLabel, { color: theme.textSecondary }]}>
          {label}
        </Text>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={onOpen}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Seleccionar moneda ${label.toLowerCase()}`}
        >
          {getFlagIcon(currency?.flagCode || "us", 18)}
          <Text style={[styles.selectorCode, { color: theme.textPrimary }]}>
            {code}
          </Text>
          <ChevronDownIcon size={14} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrencyModal = (
    title: string,
    selectedCode: string,
    onSelect: (code: string) => void,
    onClose: () => void,
    show: boolean
  ) => {
    if (!show) {
      return null;
    }
    return (
      <>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.modal,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
            {title}
          </Text>
          <ScrollView
            style={styles.modalList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {SUPPORTED_CURRENCIES.map((currency) => {
              const isSelected = selectedCode === currency.code;
              return (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.modalItem,
                    isSelected && {
                      backgroundColor: theme.accentSoft,
                    },
                  ]}
                  onPress={() => {
                    onSelect(currency.code);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  {getFlagIcon(currency.flagCode, 20)}
                  <Text
                    style={[
                      styles.modalCode,
                      {
                        color: isSelected ? theme.accent : theme.textPrimary,
                      },
                    ]}
                  >
                    {currency.code}
                  </Text>
                  <Text
                    style={[
                      styles.modalName,
                      { color: theme.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {currency.name}
                  </Text>
                  {isSelected ? (
                    <View
                      style={[styles.selectedDot, { backgroundColor: theme.accent }]}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </>
    );
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Multi-moneda"
          subtitle="Convierte entre más de 10 monedas con tasas actualizadas."
          theme={theme}
          right={<ClearButton onPress={onClear} theme={theme} />}
        />

        <View style={styles.selectorRow}>
          {renderCurrencySelector(
            "De",
            selectedFromCurrency,
            () => setShowFromCurrencySelector(true)
          )}
          <AnimatedButton
            style={[styles.swapButton, { backgroundColor: theme.surfaceAlt }]}
            onPress={handleSwap}
          >
            <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
              <SwapIcon size={20} color={theme.accent} />
            </Animated.View>
          </AnimatedButton>
          {renderCurrencySelector(
            "A",
            selectedToCurrency,
            () => setShowToCurrencySelector(true)
          )}
        </View>

        {renderCurrencyModal(
          "Seleccionar moneda origen",
          selectedFromCurrency,
          onSelectFromCurrency,
          () => setShowFromCurrencySelector(false),
          showFromCurrencySelector
        )}

        {renderCurrencyModal(
          "Seleccionar moneda destino",
          selectedToCurrency,
          onSelectToCurrency,
          () => setShowToCurrencySelector(false),
          showToCurrencySelector
        )}

        <AmountInput
          label="Monto"
          prefix={fromCurrency?.symbol}
          value={multiCurrencyAmount}
          onChangeText={setMultiCurrencyAmount}
          theme={theme}
        />

        <PrimaryButton
          title="Convertir"
          onPress={onConvert}
          theme={theme}
          style={styles.convertButton}
        />

        {multiCurrencyResult ? (
          <Card theme={theme} padding={spacing.lg}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultLabel, { color: theme.textMuted }]}>
                Resultado
              </Text>
              <Text style={[styles.resultRate, { color: theme.textMuted }]}>
                1 {selectedFromCurrency} = {multiCurrencyResult.rateUsed.toFixed(4)}{" "}
                {selectedToCurrency}
              </Text>
            </View>
            <View style={styles.resultAmountRow}>
              {getFlagIcon(toCurrency?.flagCode || "us", 22)}
              <Text
                style={[
                  styles.resultAmount,
                  { color: theme.success, fontFamily: family.extrabold },
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {multiCurrencyResult.toAmount.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {selectedToCurrency}
              </Text>
            </View>
            <View
              style={[styles.resultDivider, { backgroundColor: theme.divider }]}
            />
            <Text style={[styles.resultFrom, { color: theme.textSecondary }]}>
              {multiCurrencyResult.fromAmount.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {selectedFromCurrency} {fromCurrency?.name}
            </Text>
          </Card>
        ) : null}
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
  selectorRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  selectorHalf: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 13,
    fontFamily: family.semibold,
    marginBottom: spacing.sm,
    marginLeft: 2,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.sm,
  },
  selectorCode: {
    fontSize: 15,
    fontFamily: family.bold,
    flex: 1,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  modal: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 14,
    maxHeight: 320,
    zIndex: 1001,
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: family.bold,
    marginBottom: spacing.md,
  },
  modalList: {
    maxHeight: 220,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    borderRadius: radius.sm,
    marginBottom: 6,
    gap: 10,
  },
  modalCode: {
    fontSize: 14,
    fontFamily: family.bold,
    width: 48,
  },
  modalName: {
    fontSize: 13,
    fontFamily: family.medium,
    flex: 1,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  convertButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  resultLabel: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  resultRate: {
    fontSize: 12,
    fontFamily: family.semibold,
    fontVariant: ["tabular-nums"],
  },
  resultAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultAmount: {
    fontSize: 28,
    fontFamily: family.extrabold,
    letterSpacing: -0.6,
    fontVariant: ["tabular-nums"],
    flex: 1,
  },
  resultDivider: {
    height: 1,
    marginVertical: spacing.md,
  },
  resultFrom: {
    fontSize: 13,
    fontFamily: family.semibold,
    fontVariant: ["tabular-nums"],
  },
});
