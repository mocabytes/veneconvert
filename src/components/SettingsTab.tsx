import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { ThemeMode } from "../types";
import { BeachIcon, TrashIcon, BellIcon } from "./Icons";
import { Theme } from "../theme/colors";
import { spacing, radius, type, family } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import Card from "./ui/Card";
import AmountInput from "./ui/AmountInput";
import SegmentedControl from "./ui/SegmentedControl";

const APP_VERSION = "2.0.0";

interface SettingsTabProps {
  nuevoNombreInput: string;
  themeMode: ThemeMode;
  comisionInput: string;
  historialCount: number;
  alertsCount: number;
  onNuevoNombreChange: (value: string) => void;
  onGuardarNombre: () => void;
  onComisionChange: (value: string) => void;
  onGuardarComision: () => void;
  onSetThemeMode: (mode: ThemeMode) => void;
  onClearHistory: () => void;
  onClearAlerts: () => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function SettingsTab({
  nuevoNombreInput,
  themeMode,
  comisionInput,
  historialCount,
  alertsCount,
  onNuevoNombreChange,
  onGuardarNombre,
  onComisionChange,
  onGuardarComision,
  onSetThemeMode,
  onClearHistory,
  onClearAlerts,
  theme,
  fadeAnim,
  slideAnim,
}: SettingsTabProps) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Ajustes"
          subtitle="Personaliza tu perfil y el comportamiento de la app."
          theme={theme}
        />

        <Card theme={theme} padding={spacing.lg}>
          <AmountInput
            label="Nombre de perfil"
            value={nuevoNombreInput}
            onChangeText={onNuevoNombreChange}
            keyboardType="default"
            maxLength={20}
            placeholder="Tu nombre"
            inputHeight={48}
            rightSlot={
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.accent }]}
                onPress={onGuardarNombre}
                accessibilityLabel="Guardar nombre"
                accessibilityRole="button"
              >
                <Text style={[styles.saveButtonText, { color: theme.onAccent }]}>
                  Guardar
                </Text>
              </TouchableOpacity>
            }
            theme={theme}
          />
          <AmountInput
            label="Comisión Binance P2P (%)"
            value={comisionInput}
            onChangeText={onComisionChange}
            keyboardType="decimal-pad"
            placeholder="0.20"
            inputHeight={48}
            rightSlot={
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.accent }]}
                onPress={onGuardarComision}
                accessibilityLabel="Guardar comisión"
                accessibilityRole="button"
              >
                <Text style={[styles.saveButtonText, { color: theme.onAccent }]}>
                  Guardar
                </Text>
              </TouchableOpacity>
            }
            theme={theme}
          />
        </Card>

        <Card theme={theme} padding={spacing.lg}>
          <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>
            Apariencia
          </Text>
          <SegmentedControl<ThemeMode>
            theme={theme}
            value={themeMode}
            onChange={onSetThemeMode}
            options={[
              { label: "Claro", value: "light" },
              { label: "Oscuro", value: "dark" },
              { label: "Auto", value: "system" },
            ]}
          />
        </Card>

        <Card theme={theme} padding={spacing.lg}>
          <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>
            Datos
          </Text>
          <TouchableOpacity
            style={styles.dataRow}
            onPress={onClearHistory}
            disabled={historialCount === 0}
            accessibilityRole="button"
            accessibilityLabel="Limpiar historial"
          >
            <View style={[styles.dataIcon, { backgroundColor: theme.errorBg }]}>
              <TrashIcon size={18} color={theme.error} />
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataLabel, { color: theme.textPrimary }]}>
                Limpiar historial
              </Text>
              <Text style={[styles.dataCount, { color: theme.textMuted }]}>
                {historialCount} conversiones guardadas
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dataRow}
            onPress={onClearAlerts}
            disabled={alertsCount === 0}
            accessibilityRole="button"
            accessibilityLabel="Borrar alertas"
          >
            <View style={[styles.dataIcon, { backgroundColor: theme.errorBg }]}>
              <BellIcon size={18} color={theme.error} />
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataLabel, { color: theme.textPrimary }]}>
                Borrar alertas
              </Text>
              <Text style={[styles.dataCount, { color: theme.textMuted }]}>
                {alertsCount} alertas configuradas
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        <Card theme={theme} padding={spacing.lg}>
          <Text style={[styles.groupLabel, { color: theme.textSecondary }]}>
            Acerca de
          </Text>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutKey, { color: theme.textMuted }]}>
              Versión
            </Text>
            <Text style={[styles.aboutValue, { color: theme.textPrimary }]}>
              {APP_VERSION}
            </Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutKey, { color: theme.textMuted }]}>
              Fuentes
            </Text>
            <Text style={[styles.aboutValue, { color: theme.textPrimary }]}>
              BCV • Binance P2P
            </Text>
          </View>
          <Text style={[styles.disclaimer, { color: theme.textMuted }]}>
            Las tasas son informativas y pueden variar. Verifica siempre con
            tus fuentes antes de operar.
          </Text>
        </Card>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Arco v{APP_VERSION} • Hecho en Margarita
          </Text>
          <BeachIcon size={16} color={theme.textMuted} />
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
  groupLabel: {
    ...type.label,
    marginBottom: 10,
  },
  saveButton: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    ...type.labelSmall,
    fontFamily: family.bold,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  dataIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  dataContent: {
    flex: 1,
  },
  dataLabel: {
    ...type.label,
    marginBottom: 2,
  },
  dataCount: {
    ...type.labelSmall,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  aboutKey: {
    ...type.label,
  },
  aboutValue: {
    ...type.label,
  },
  disclaimer: {
    ...type.caption,
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 24,
  },
  footerText: {
    ...type.labelSmall,
  },
});
