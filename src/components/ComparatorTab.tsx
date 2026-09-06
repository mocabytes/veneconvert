import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { FireIcon, TrophyIcon } from "./Icons";
import {
  MonedaUsuario,
  ResultadoAnalisis,
} from "../utils/calculations";
import { Theme } from "../theme/colors";
import { spacing, radius, family } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import ClearButton from "./ui/ClearButton";
import AmountInput from "./ui/AmountInput";
import PrimaryButton from "./ui/PrimaryButton";
import SegmentedControl from "./ui/SegmentedControl";

interface ComparatorTabProps {
  monedaOrigen: MonedaUsuario;
  compPrecioBs: string;
  compPrecioUsdBcv: string;
  compPrecioDivisa: string;
  mostrarDiagnostico: boolean;
  resultadoComparador: ResultadoAnalisis | null;
  tasas: { bcv: number; binanceBuy: number; binanceSell: number };
  onMonedaOrigenChange: (value: MonedaUsuario) => void;
  onCompPrecioBsChange: (value: string) => void;
  onCompPrecioUsdBcvChange: (value: string) => void;
  onCompPrecioDivisaChange: (value: string) => void;
  onEjecutarAnalisis: () => void;
  onClear: () => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function ComparatorTab({
  monedaOrigen,
  compPrecioBs,
  compPrecioUsdBcv,
  compPrecioDivisa,
  mostrarDiagnostico,
  resultadoComparador,
  tasas,
  onMonedaOrigenChange,
  onCompPrecioBsChange,
  onCompPrecioUsdBcvChange,
  onCompPrecioDivisaChange,
  onEjecutarAnalisis,
  onClear,
  theme,
  fadeAnim,
  slideAnim,
}: ComparatorTabProps) {
  const obtenerTonoCard = (rec: string): "success" | "accent" | "neutral" => {
    if (rec.includes("DIRECTO")) {
      return "success";
    }
    if (rec.includes("CAMBIAR")) {
      return "accent";
    }
    return "neutral";
  };

  const tono = resultadoComparador
    ? obtenerTonoCard(resultadoComparador.recomendacion)
    : "neutral";

  const tonoColor =
    tono === "success"
      ? theme.success
      : tono === "accent"
      ? theme.accent
      : theme.textSecondary;

  const tonoBg =
    tono === "success"
      ? theme.successBg
      : tono === "accent"
      ? theme.accentSoft
      : theme.surfaceAlt;

  const tonoBorder =
    tono === "success" ? theme.successBorder : theme.border;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Comparador"
          subtitle="Compara precios en bolívares, dólares y USDT para pagar lo mínimo."
          theme={theme}
          right={<ClearButton onPress={onClear} theme={theme} />}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          ¿Qué dinero tienes disponible?
        </Text>
        <SegmentedControl<MonedaUsuario>
          theme={theme}
          value={monedaOrigen}
          onChange={onMonedaOrigenChange}
          style={styles.segment}
          options={[
            { label: "Tengo Bs.", value: "VES" },
            { label: "Tengo $ / Cripto", value: "USD", activeColor: theme.success },
          ]}
        />

        <AmountInput
          label="Precio fijado en dólares oficiales ($ BCV)"
          prefix="$ BCV"
          value={compPrecioUsdBcv}
          onChangeText={onCompPrecioUsdBcvChange}
          theme={theme}
        />

        <AmountInput
          label="Precio total en etiqueta o punto (VES)"
          prefix="Bs."
          value={compPrecioBs}
          onChangeText={onCompPrecioBsChange}
          theme={theme}
        />

        <AmountInput
          label="Precio en divisas ($ efectivo / USDT Binance)"
          prefix="$"
          value={compPrecioDivisa}
          onChangeText={onCompPrecioDivisaChange}
          theme={theme}
        />

        {compPrecioBs !== "" && compPrecioDivisa !== "" ? (
          <PrimaryButton
            title="Calcular la mejor opción"
            onPress={onEjecutarAnalisis}
            theme={theme}
            style={styles.calculate}
          />
        ) : null}

        {mostrarDiagnostico && resultadoComparador ? (
          <View
            style={[
              styles.diagnosisCard,
              {
                backgroundColor: tonoBg,
                borderColor: tonoBorder,
              },
            ]}
          >
            <View style={styles.diagnosisHeader}>
              <View style={[styles.diagnosisBadge, { backgroundColor: tonoColor }]}>
                {resultadoComparador.ahorroEstimado > 0 ? (
                  <TrophyIcon size={18} color={theme.onAccent} />
                ) : (
                  <FireIcon size={18} color={theme.onAccent} />
                )}
              </View>
              <Text
                style={[
                  styles.diagnosisTitle,
                  { color: tono === "neutral" ? theme.textMuted : tonoColor },
                ]}
              >
                Recomendación de pago
              </Text>
            </View>
            <Text style={[styles.diagnosisText, { color: theme.textPrimary }]}>
              {resultadoComparador.mensaje}
            </Text>

            {resultadoComparador.ahorroEstimado > 0 ? (
              <Text style={[styles.diagnosisAhorro, { color: tonoColor }]}>
                Ahorras{" "}
                {resultadoComparador.monedaAhorro === "VES" ? "Bs. " : "$ "}
                {resultadoComparador.ahorroEstimado.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            ) : null}

            <View
              style={[styles.separator, { backgroundColor: theme.divider }]}
            />

            <Text style={[styles.desgloseTitle, { color: theme.textMuted }]}>
              Comparativa de costos
            </Text>
            {resultadoComparador.desgloseOpciones.map((opcion, index) => {
              const isGanador = index === 0;
              return (
                <View
                  key={index}
                  style={[
                    styles.desgloseRow,
                    isGanador && {
                      backgroundColor: tonoColor + "14",
                    },
                  ]}
                >
                  <View style={styles.desgloseNombreRow}>
                    {isGanador && resultadoComparador.ahorroEstimado > 0 ? (
                      <TrophyIcon size={16} color={tonoColor} />
                    ) : null}
                    <Text
                      style={[
                        styles.desgloseNombre,
                        { color: theme.textPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {opcion.nombre}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.desgloseCosto,
                      {
                        color: isGanador ? tonoColor : theme.textPrimary,
                      },
                    ]}
                  >
                    {resultadoComparador.monedaAhorro === "VES" ? "Bs. " : "$ "}
                    {opcion.costoEquivalente.toLocaleString("es-VE", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        <View style={styles.ratesStrip}>
          <View style={[styles.rateChip, { borderColor: theme.border }]}>
            <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
              BCV
            </Text>
            <Text
              style={[
                styles.rateValue,
                { color: theme.textPrimary },
              ]}
            >
              Bs. {tasas.bcv.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rateChip, { borderColor: theme.border }]}>
            <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
              P2P Compra
            </Text>
            <Text
              style={[
                styles.rateValue,
                { color: theme.textPrimary },
              ]}
            >
              Bs. {tasas.binanceBuy.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rateChip, { borderColor: theme.border }]}>
            <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
              P2P Venta
            </Text>
            <Text
              style={[
                styles.rateValue,
                { color: theme.textPrimary },
              ]}
            >
              Bs. {tasas.binanceSell.toFixed(2)}
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
  label: {
    fontSize: 13,
    fontFamily: family.semibold,
    marginBottom: spacing.sm,
    marginLeft: 2,
  },
  segment: {
    marginBottom: spacing.xxl,
  },
  calculate: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  diagnosisCard: {
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  diagnosisHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: spacing.md,
  },
  diagnosisBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  diagnosisTitle: {
    fontSize: 13,
    fontFamily: family.extrabold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  diagnosisText: {
    fontSize: 17,
    fontFamily: family.bold,
    lineHeight: 24,
    marginBottom: 10,
  },
  diagnosisAhorro: {
    fontSize: 14,
    fontFamily: family.extrabold,
    fontVariant: ["tabular-nums"],
    marginBottom: spacing.xs,
  },
  separator: {
    height: 1,
    marginVertical: 14,
  },
  desgloseTitle: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  desgloseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radius.xs,
    marginVertical: 2,
    gap: spacing.sm,
  },
  desgloseNombreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  desgloseNombre: {
    fontSize: 13,
    fontFamily: family.semibold,
    flex: 1,
  },
  desgloseCosto: {
    fontSize: 13,
    fontFamily: family.bold,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  ratesStrip: {
    flexDirection: "row",
    gap: 10,
    marginTop: spacing.xl,
  },
  rateChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 64,
  },
  rateLabel: {
    fontSize: 11,
    fontFamily: family.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 14,
    fontFamily: family.bold,
    fontVariant: ["tabular-nums"],
  },
});
