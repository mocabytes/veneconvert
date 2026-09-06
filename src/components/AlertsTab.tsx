import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { RateAlert } from "../utils/alerts";
import { TrashIcon, BellIcon, PlusIcon } from "./Icons";
import { parseNumber } from "../utils/parseNumber";
import { Theme } from "../theme/colors";
import { spacing, radius } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import Card from "./ui/Card";
import SegmentedControl from "./ui/SegmentedControl";
import AmountInput from "./ui/AmountInput";
import Switch from "./ui/Switch";
import EmptyState from "./ui/EmptyState";

interface AlertsTabProps {
  rateAlerts: RateAlert[];
  newAlertType: RateAlert["type"];
  newAlertCondition: RateAlert["condition"];
  newAlertThreshold: string;
  onSetNewAlertType: (value: RateAlert["type"]) => void;
  onSetNewAlertCondition: (value: RateAlert["condition"]) => void;
  onSetNewAlertThreshold: (value: string) => void;
  onAddAlert: () => void;
  onToggleAlert: (id: string, enabled: boolean) => void;
  onDeleteAlert: (id: string) => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

const alertTypeLabel = (type: RateAlert["type"]) =>
  type === "BCV"
    ? "BCV"
    : type === "BINANCE_BUY"
    ? "P2P Compra"
    : "P2P Venta";

export default function AlertsTab({
  rateAlerts,
  newAlertType,
  newAlertCondition,
  newAlertThreshold,
  onSetNewAlertType,
  onSetNewAlertCondition,
  onSetNewAlertThreshold,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  theme,
  fadeAnim,
  slideAnim,
}: AlertsTabProps) {
  const thresholdValido =
    newAlertThreshold.trim() !== "" &&
    !isNaN(parseNumber(newAlertThreshold)) &&
    parseNumber(newAlertThreshold) > 0;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Alertas"
          subtitle="Recibe un aviso cuando la tasa cruce el valor que elijas."
          theme={theme}
        />

        <Card theme={theme} padding={spacing.lg}>
          <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
            Nueva alerta
          </Text>
          <SegmentedControl<RateAlert["type"]>
            theme={theme}
            value={newAlertType}
            onChange={onSetNewAlertType}
            style={styles.segment}
            options={[
              { label: "BCV", value: "BCV" },
              { label: "P2P Compra", value: "BINANCE_BUY" },
              { label: "P2P Venta", value: "BINANCE_SELL" },
            ]}
          />
          <SegmentedControl<RateAlert["condition"]>
            theme={theme}
            value={newAlertCondition}
            onChange={onSetNewAlertCondition}
            style={styles.segment}
            options={[
              { label: "▲ Sube de", value: "ABOVE", activeColor: theme.success },
              { label: "▼ Baja de", value: "BELOW", activeColor: theme.error },
            ]}
          />
          <AmountInput
            prefix="Bs."
            value={newAlertThreshold}
            onChangeText={onSetNewAlertThreshold}
            placeholder="0.00"
            inputHeight={50}
            rightSlot={
              <TouchableOpacity
                style={[
                  styles.addButton,
                  {
                    backgroundColor: thresholdValido
                      ? theme.accent
                      : theme.surfaceAlt,
                  },
                ]}
                onPress={onAddAlert}
                disabled={!thresholdValido}
                accessibilityLabel="Agregar alerta"
                accessibilityRole="button"
                accessibilityState={{ disabled: !thresholdValido }}
              >
                <PlusIcon
                  size={20}
                  color={thresholdValido ? theme.onAccent : theme.textMuted}
                />
              </TouchableOpacity>
            }
            theme={theme}
          />
        </Card>

        {rateAlerts.length === 0 ? (
          <EmptyState
            icon={<BellIcon size={26} color={theme.accent} />}
            title="No hay alertas configuradas"
            description="Crea tu primera alerta arriba y te avisaremos en pantalla."
            theme={theme}
          />
        ) : (
          <View style={styles.list}>
            {rateAlerts.map((alert) => {
              const conditionColor =
                alert.condition === "ABOVE" ? theme.success : theme.error;
              return (
                <View
                  key={alert.id}
                  style={[
                    styles.alertItem,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                    !alert.enabled && { opacity: 0.55 },
                  ]}
                >
                  <View style={styles.alertItemLeft}>
                    <View style={styles.alertItemHeader}>
                      <Text
                        style={[styles.alertType, { color: theme.textPrimary }]}
                      >
                        {alertTypeLabel(alert.type)}
                      </Text>
                      <Text
                        style={[
                          styles.alertCondition,
                          { color: conditionColor },
                        ]}
                      >
                        {alert.condition === "ABOVE" ? "▲" : "▼"} Bs.{" "}
                        {alert.threshold.toFixed(2)}
                      </Text>
                    </View>
                    {alert.triggeredAt ? (
                      <Text
                        style={[
                          styles.alertTriggered,
                          { color: theme.textMuted },
                        ]}
                      >
                        Activada el{" "}
                        {new Date(alert.triggeredAt).toLocaleDateString("es-VE")}
                      </Text>
                    ) : (
                      <Text
                        style={[styles.alertTriggered, { color: theme.textMuted }]}
                      >
                        {alert.enabled ? "En espera" : "Pausada"}
                      </Text>
                    )}
                  </View>
                  <View style={styles.alertItemActions}>
                    <Switch
                      value={alert.enabled}
                      onValueChange={(enabled) => onToggleAlert(alert.id, enabled)}
                      theme={theme}
                      accessibilityLabel={`Activar alerta ${alertTypeLabel(
                        alert.type
                      )}`}
                    />
                    <TouchableOpacity
                      style={[
                        styles.deleteButton,
                        { backgroundColor: theme.errorBg },
                      ]}
                      onPress={() => onDeleteAlert(alert.id)}
                      accessibilityLabel={`Eliminar alerta ${alertTypeLabel(
                        alert.type
                      )}`}
                      accessibilityRole="button"
                    >
                      <TrashIcon size={18} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
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
  formLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  segment: {
    marginBottom: spacing.md,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    gap: 10,
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  alertItemLeft: {
    flex: 1,
    paddingRight: 10,
  },
  alertItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 4,
    flexWrap: "wrap",
  },
  alertType: {
    fontSize: 14,
    fontWeight: "700",
  },
  alertCondition: {
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  alertTriggered: {
    fontSize: 11,
    fontWeight: "500",
  },
  alertItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
});
