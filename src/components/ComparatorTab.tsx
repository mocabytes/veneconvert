import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from "react-native";
import { FireIcon, TrophyIcon } from "./Icons";
import { analizarCompra, MonedaUsuario, TasasEntrada } from "../utils/calculations";

interface ComparatorTabProps {
  monedaOrigen: MonedaUsuario;
  compPrecioBs: string;
  compPrecioUsdBcv: string;
  compPrecioDivisa: string;
  mostrarDiagnostico: boolean;
  resultadoComparador: ReturnType<typeof analizarCompra> | null;
  onMonedaOrigenChange: (value: MonedaUsuario) => void;
  onCompPrecioBsChange: (value: string) => void;
  onCompPrecioUsdBcvChange: (value: string) => void;
  onCompPrecioDivisaChange: (value: string) => void;
  onEjecutarAnalisis: () => void;
  theme: {
    accent: string;
    success: string;
    surfaceAlt: string;
    surface: string;
    border: string;
    successBorder: string;
    successBg: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  tasas: TasasEntrada;
  comisionBinance: number;
}

export default function ComparatorTab({
  monedaOrigen,
  compPrecioBs,
  compPrecioUsdBcv,
  compPrecioDivisa,
  mostrarDiagnostico,
  resultadoComparador,
  onMonedaOrigenChange,
  onCompPrecioBsChange,
  onCompPrecioUsdBcvChange,
  onCompPrecioDivisaChange,
  onEjecutarAnalisis,
  theme,
  fadeAnim,
  slideAnim,
  tasas,
  comisionBinance,
}: ComparatorTabProps) {
  const obtenerColorCard = (rec: string) => {
    if (rec.includes("DIRECTO")) {
      return theme.success;
    }
    if (rec.includes("CAMBIAR")) {
      return theme.accent;
    }
    return theme.textSecondary;
  };

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
          Modo comparador
        </Text>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.textPrimary, marginBottom: 16 },
          ]}
        >
          ¿Cuál opción sale mejor?
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          ¿Qué dinero tienes disponible?
        </Text>
        <View
          style={[
            styles.toggleContainer,
            { backgroundColor: theme.surfaceAlt },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.toggleButton,
              monedaOrigen === "VES" && { backgroundColor: theme.accent },
            ]}
            onPress={() => {
              onMonedaOrigenChange("VES");
            }}
          >
            <Text
              style={[
                styles.toggleText,
                monedaOrigen === "VES" && styles.toggleTextActive,
              ]}
            >
              Tengo Bolívares
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              monedaOrigen === "USD" && {
                backgroundColor: theme.success,
              },
            ]}
            onPress={() => {
              onMonedaOrigenChange("USD");
            }}
          >
            <Text
              style={[
                styles.toggleText,
                monedaOrigen === "USD" && styles.toggleTextActive,
              ]}
            >
              Tengo Dólares/Cripto
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Precio fijado en Dólares Oficiales ($ BCV)
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
              $ BCV
            </Text>
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              keyboardType="numeric"
              autoFocus={Platform.OS !== "web"}
              value={compPrecioUsdBcv}
              onChangeText={onCompPrecioUsdBcvChange}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Precio total en etiqueta o punto (VES)
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
              value={compPrecioBs}
              onChangeText={onCompPrecioBsChange}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Precio en divisas ($ efectivo / USDT Binance)
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
              value={compPrecioDivisa}
              onChangeText={onCompPrecioDivisaChange}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        {compPrecioBs !== "" && compPrecioDivisa !== "" ? (
          <TouchableOpacity
            style={[
              styles.calculateButton,
              { backgroundColor: theme.accent },
            ]}
            onPress={onEjecutarAnalisis}
            activeOpacity={0.85}
          >
            <Text style={styles.calculateButtonText}>
              Calcular Opción Más Barata ✨
            </Text>
          </TouchableOpacity>
        ) : null}

        {mostrarDiagnostico && resultadoComparador ? (
          <View
            style={[
              styles.diagnosisCard,
              {
                backgroundColor: obtenerColorCard(
                  resultadoComparador.recomendacion
                ),
              },
            ]}
          >
            <Text style={styles.diagnosisTitle}>
              RECOMENDACIÓN DE PAGO
            </Text>
            <Text style={styles.diagnosisText}>
              {resultadoComparador.mensaje}
            </Text>
            {resultadoComparador.ahorroEstimado > 0 ? (
              <View style={styles.diagnosisAhorroContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <FireIcon size={24} color={theme.accent} />
                  <Text style={styles.diagnosisAhorro}>
                    Ahorras:{" "}
                    {resultadoComparador.monedaAhorro === "VES"
                      ? "Bs. "
                      : "$ "}
                    {resultadoComparador.ahorroEstimado.toLocaleString(
                      "es-VE",
                      { minimumFractionDigits: 2 }
                    )}
                  </Text>
                </View>
              </View>
            ) : null}
            <View style={styles.separator} />
            <Text style={styles.desgloseTitle}>
              Comparativa de costos:
            </Text>
            {resultadoComparador.desgloseOpciones.map((opcion, index) => (
              <View
                key={index}
                style={[
                  styles.desgloseRow,
                  index === 0 && styles.desgloseRowGanador,
                ]}
              >
                <Text
                  style={[
                    styles.desgloseNombre,
                    index === 0 && styles.textGanador,
                  ]}
                  numberOfLines={1}
                >
                  {index === 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <TrophyIcon size={20} color={theme.accent} />
                      <Text>{opcion.nombre}</Text>
                    </View>
                  ) : (
                    opcion.nombre
                  )}
                </Text>
                <Text
                  style={[
                    styles.desgloseCosto,
                    index === 0 && styles.textGanador,
                  ]}
                >
                  {resultadoComparador.monedaAhorro === "VES"
                    ? "Bs. "
                    : "$ "}
                  {opcion.costoEquivalente.toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  inputGroup: {
    marginBottom: 16,
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
  calculateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  calculateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  diagnosisCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  diagnosisTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  diagnosisText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  diagnosisAhorroContainer: {
    marginTop: 8,
  },
  diagnosisAhorro: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 16,
  },
  desgloseTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  desgloseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  desgloseRowGanador: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  desgloseNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  desgloseCosto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  textGanador: {
    color: "#FFFFFF",
  },
});
