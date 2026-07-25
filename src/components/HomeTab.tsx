import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { triggerHapticForAction } from "../utils/haptic";
import {
  ExchangeIcon,
  ScaleIcon,
  BookIcon,
  TrendIcon,
  ClockIcon,
  LightbulbIcon,
} from "./Icons";
import PulseAnimation from "./PulseAnimation";

interface HomeTabProps {
  nombreUsuario: string;
  tasas: { bcv: number; binanceBuy: number; binanceSell: number };
  cargandoTasas: boolean;
  modoOffline: boolean;
  ultimaSincronizacion: string;
  tipAleatorio: string;
  conversionHistory: { length: number };
  onNavigateToTab: (tab: string) => void;
  theme: {
    heroBackground: string;
    heroText: string;
    heroSubtext: string;
    accent: string;
    accentSoft: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    surface: string;
    surfaceAlt: string;
    border: string;
  };
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function HomeTab({
  nombreUsuario,
  tasas,
  cargandoTasas,
  modoOffline,
  ultimaSincronizacion,
  tipAleatorio,
  conversionHistory,
  onNavigateToTab,
  theme,
  fadeAnim,
  slideAnim,
}: HomeTabProps) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={[
          styles.heroCard,
          { backgroundColor: theme.heroBackground },
        ]}
        accessible={true}
        accessibilityLabel="Inicio"
        accessibilityHint={`Estado: ${
          modoOffline
            ? 'Modo offline, usando tasas cacheadas'
            : 'Conexión en vivo, tasas actualizadas'
        }`}
      >
        <View style={styles.heroGlow} />
        <Text style={[styles.heroEyebrow, { color: theme.accent }]}>
          Inicio
        </Text>
        <Text style={[styles.heroTitle, { color: theme.heroText }]}>
          ¡Hola, {nombreUsuario}!
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.heroSubtext }]}>
          Tasas BCV y P2P en tiempo real
        </Text>
      </View>

      <View style={styles.headerWithSyncRow}>
        <Text
          style={[
            styles.sectionHeading,
            { color: theme.textPrimary, marginBottom: 0 },
          ]}
        >
          Tasas
        </Text>
        {ultimaSincronizacion ? (
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <ClockIcon size={16} color={theme.textMuted} />
            <Text
              style={[styles.syncTimeText, { color: theme.textMuted }]}
            >
              Actualizado:{" "}
              {new Date(ultimaSincronizacion).toLocaleTimeString(
                "es-VE",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.ratesContainer}>
        {cargandoTasas ? (
          <View
            style={[
              styles.loadingBox,
              { backgroundColor: theme.surfaceAlt },
            ]}
            accessible={true}
            accessibilityLabel="Cargando tasas"
            accessibilityRole="progressbar"
          >
            <ActivityIndicator size="small" color={theme.accent} />
          </View>
        ) : (
          <>
            <PulseAnimation pulseColor={theme.accentSoft}>
              <View
                style={[
                  styles.rateBox,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                accessible={true}
                accessibilityLabel={`Tasa BCV Oficial: ${tasas.bcv.toFixed(
                  2
                )} bolívares por dólar`}
              >
                <Text
                  style={[styles.rateLabel, { color: theme.textMuted }]}
                >
                  BCV Oficial
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
            </PulseAnimation>
            <View
              style={[
                styles.rateBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              accessible={true}
              accessibilityLabel={`Tasa P2P Compra: ${tasas.binanceBuy.toFixed(
                2
              )} bolívares por dólar`}
            >
              <Text
                style={[styles.rateLabel, { color: theme.textMuted }]}
              >
                P2P Compra
              </Text>
              <Text
                style={[styles.rateValue, { color: theme.textPrimary }]}
              >
                Bs. {tasas.binanceBuy.toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                styles.rateBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              accessible={true}
              accessibilityLabel={`Tasa P2P Venta: ${tasas.binanceSell.toFixed(
                2
              )} bolívares por dólar`}
            >
              <Text
                style={[styles.rateLabel, { color: theme.textMuted }]}
              >
                P2P Venta
              </Text>
              <Text
                style={[styles.rateValue, { color: theme.textPrimary }]}
              >
                Bs. {tasas.binanceSell.toFixed(2)}
              </Text>
            </View>
          </>
        )}
      </View>

      <Text
        style={[
          styles.sectionHeading,
          { color: theme.textPrimary, marginTop: 14 },
        ]}
      >
        Herramientas
      </Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={[
            styles.quickActionCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={() => {
            triggerHapticForAction("tab");
            onNavigateToTab("conversor");
          }}
          accessible={true}
          accessibilityLabel="Conversor"
          accessibilityHint="Ir a la sección de conversor de monedas"
          accessibilityRole="button"
        >
          <View style={styles.quickActionIcon}>
            <ExchangeIcon size={32} color={theme.textPrimary} />
          </View>
          <Text
            style={[
              styles.quickActionTitle,
              { color: theme.textPrimary },
            ]}
          >
            Conversor
          </Text>
          <Text
            style={[styles.quickActionDesc, { color: theme.textMuted }]}
          >
            Cambios al vuelo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.quickActionCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={() => {
            triggerHapticForAction("tab");
            onNavigateToTab("comparador");
          }}
          accessible={true}
          accessibilityLabel="Comparador"
          accessibilityHint="Ir a la sección de comparador inteligente"
          accessibilityRole="button"
        >
          <View style={styles.quickActionIcon}>
            <ScaleIcon size={32} color={theme.textPrimary} />
          </View>
          <Text
            style={[
              styles.quickActionTitle,
              { color: theme.textPrimary },
            ]}
          >
            Comparador
          </Text>
          <Text
            style={[styles.quickActionDesc, { color: theme.textMuted }]}
          >
            Analizador con AI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.quickActionCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={() => {
            triggerHapticForAction("tab");
            onNavigateToTab("historial");
          }}
          accessible={true}
          accessibilityLabel="Historial"
          accessibilityHint="Ir a la sección de historial de conversiones"
          accessibilityRole="button"
        >
          <View style={styles.quickActionIcon}>
            <BookIcon size={32} color={theme.textPrimary} />
          </View>
          <Text
            style={[
              styles.quickActionTitle,
              { color: theme.textPrimary },
            ]}
          >
            Historial
          </Text>
          <Text
            style={[styles.quickActionDesc, { color: theme.textMuted }]}
          >
            {conversionHistory.length} conversiones
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.quickActionCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={() => {
            triggerHapticForAction("tab");
            onNavigateToTab("tendencias");
          }}
          accessible={true}
          accessibilityLabel="Tendencias"
          accessibilityHint="Ir a la sección de tendencias de tasas"
          accessibilityRole="button"
        >
          <View style={styles.quickActionIcon}>
            <TrendIcon size={32} color={theme.textPrimary} />
          </View>
          <Text
            style={[
              styles.quickActionTitle,
              { color: theme.textPrimary },
            ]}
          >
            Tendencias
          </Text>
          <Text
            style={[styles.quickActionDesc, { color: theme.textMuted }]}
          >
            Gráfico de tasas
          </Text>
        </TouchableOpacity>
      </View>

      {tipAleatorio ? (
        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: theme.surfaceAlt,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <LightbulbIcon size={24} color={theme.accent} />
            <Text style={styles.tipTitle}>
              Tip del día
            </Text>
          </View>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            {tipAleatorio}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  headerWithSyncRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  syncTimeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  ratesContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  loadingBox: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  rateBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  rateLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  quickActionCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(83, 165, 72, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  quickActionDesc: {
    fontSize: 12,
    fontWeight: "500",
  },
  tipCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});
