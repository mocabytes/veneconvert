import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Animated,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Navbar from "./src/components/Navbar";
import BottomTabs from "./src/components/BottomTabs";

type TabMode = "conversor" | "comparador";
type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const lightTheme = {
  background: "#F4F7FB",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#64748B",
  accent: "#8B5CF6",
  accentSoft: "#F5F3FF",
  success: "#0F766E",
  successBg: "#F0FDF4",
  successBorder: "#A7F3D0",
  warningBg: "#FFFBEB",
  warningBorder: "#FDE68A",
  shadow: "#000000",
  heroBackground: "#111827",
  heroText: "#F9FAFB",
  heroSubtext: "#D1D5DB",
  tabBarBackground: "#0F172A",
};

const darkTheme = {
  background: "#060B14",
  surface: "#111827",
  surfaceAlt: "#1F2937",
  border: "rgba(255,255,255,0.08)",
  textPrimary: "#F9FAFB",
  textSecondary: "#E5E7EB",
  textMuted: "#94A3B8",
  accent: "#A78BFA",
  accentSoft: "rgba(167, 139, 250, 0.18)",
  success: "#34D399",
  successBg: "rgba(52, 211, 153, 0.12)",
  successBorder: "rgba(52, 211, 153, 0.35)",
  warningBg: "rgba(250, 204, 21, 0.14)",
  warningBorder: "rgba(250, 204, 21, 0.35)",
  shadow: "#000000",
  heroBackground: "#0B1220",
  heroText: "#F9FAFB",
  heroSubtext: "#CBD5E1",
  tabBarBackground: "#020617",
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabMode>("conversor");
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const colorScheme = useColorScheme();
  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  const [cargandoTasas, setCargandoTasas] = useState<boolean>(true);
  const [tasaBcv, setTasaBcv] = useState<string>("0.00");
  const [tasaBinanceCompra, setTasaBinanceCompra] = useState<string>("0.00");
  const [tasaBinanceVenta, setTasaBinanceVenta] = useState<string>("0.00");

  const [bs, setBs] = useState<string>("");
  const [usdBcv, setUsdBcv] = useState<string>("");
  const [usdtBinance, setUsdtBinance] = useState<string>("");

  const [monedaOrigen, setMonedaOrigen] = useState<"VES" | "USD">("VES");
  const [compPrecioBs, setCompPrecioBs] = useState<string>("");
  const [compPrecioDivisa, setCompPrecioDivisa] = useState<string>("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  const limpiarCampos = () => {
    setBs("");
    setUsdBcv("");
    setUsdtBinance("");
    setCompPrecioBs("");
    setCompPrecioDivisa("");
  };

  useEffect(() => {
    const nextTheme =
      themeMode === "system"
        ? colorScheme === "dark"
          ? "dark"
          : "light"
        : themeMode;
    setResolvedTheme(nextTheme);
  }, [themeMode, colorScheme]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentTab, resolvedTheme]);

  useEffect(() => {
    const obtenerTasas = async () => {
      try {
        const [resBcv, resParalelo] = await Promise.all([
          fetch("https://ve.dolarapi.com/v1/dolares/oficial"),
          fetch("https://ve.dolarapi.com/v1/dolares/paralelo"),
        ]);
        if (!resBcv.ok || !resParalelo.ok) throw new Error("Error en API");
        const dataBcv = await resBcv.json();
        const dataParalelo = await resParalelo.json();

        setTasaBcv(Number(dataBcv.promedio).toFixed(2));
        setTasaBinanceCompra((dataParalelo.promedio * 1.008).toFixed(2));
        setTasaBinanceVenta((dataParalelo.promedio * 0.992).toFixed(2));
      } catch (error) {
        console.error("Error de conexión: ", error);
        setTasaBcv("36.50");
        setTasaBinanceCompra("40.10");
        setTasaBinanceVenta("39.50");
      } finally {
        setCargandoTasas(false);
      }
    };
    obtenerTasas();
  }, []);

  const handleBsChange = (value: string) => {
    setBs(value);
    if (value === "") {
      setUsdBcv("");
      setUsdtBinance("");
      return;
    }
    const numBs = parseFloat(value) || 0;
    setUsdBcv((numBs / parseFloat(tasaBcv)).toFixed(2));
    setUsdtBinance((numBs / parseFloat(tasaBinanceCompra)).toFixed(2));
  };

  const handleBcvChange = (value: string) => {
    setUsdBcv(value);
    if (value === "") {
      setBs("");
      setUsdtBinance("");
      return;
    }
    const numUsd = parseFloat(value) || 0;
    const equivalenteBs = numUsd * parseFloat(tasaBcv);
    setBs(equivalenteBs.toFixed(2));
    setUsdtBinance((equivalenteBs / parseFloat(tasaBinanceCompra)).toFixed(2));
  };

  const handleBinanceChange = (value: string) => {
    setUsdtBinance(value);
    if (value === "") {
      setBs("");
      setUsdBcv("");
      return;
    }
    const numUsdt = parseFloat(value) || 0;
    const equivalenteBs = numUsdt * parseFloat(tasaBinanceVenta);
    setBs(equivalenteBs.toFixed(2));
    setUsdBcv((equivalenteBs / parseFloat(tasaBcv)).toFixed(2));
  };

  const realizarComparacion = () => {
    const pBs = parseFloat(compPrecioBs) || 0;
    const pDiv = parseFloat(compPrecioDivisa) || 0;
    const tCompra = parseFloat(tasaBinanceCompra) || 1;
    const tVenta = parseFloat(tasaBinanceVenta) || 1;

    if (pBs <= 0 || pDiv <= 0) return null;

    let diagnostico = "";
    let detalleCalculo = "";
    let colorTarjeta = theme.accent;

    if (monedaOrigen === "VES") {
      const costoRutaBs = pBs;
      const costoRutaDivisa = pDiv * tCompra;

      if (costoRutaBs < costoRutaDivisa) {
        diagnostico = "✅ Quédate con tus bolívares y paga por punto";
        detalleCalculo = `Pagar en Bs te cuesta ${pBs} VES. Si compras dólares para pagar la rebaja, gastarías ${costoRutaDivisa.toFixed(2)} VES.`;
        colorTarjeta = theme.textPrimary;
      } else if (costoRutaDivisa < costoRutaBs) {
        diagnostico = "✅ Te conviene comprar dólares y pagar en divisas";
        detalleCalculo = `Con la tasa P2P compra gastarías ${costoRutaDivisa.toFixed(2)} VES, por debajo de los ${pBs} VES de la opción en bolívares.`;
        colorTarjeta = theme.success;
      } else {
        diagnostico = "⚖️ Ambas opciones te cuestan lo mismo";
      }
    } else {
      const costoRutaDivisa = pDiv;
      const costoRutaBs = pBs / tVenta;

      if (costoRutaBs < costoRutaDivisa) {
        diagnostico = "✅ Te conviene vender tus dólares y pagar en bolívares";
        detalleCalculo = `Cambiando a la tasa de venta, el costo real sería ${costoRutaBs.toFixed(2)} USDT. Pagar directo en divisas te cuesta ${pDiv} USDT.`;
        colorTarjeta = theme.accent;
      } else if (costoRutaDivisa < costoRutaBs) {
        diagnostico = "✅ Mejor pagar directo en divisas";
        detalleCalculo = `Pagar la rebaja te consume ${pDiv} USDT. Vender tus fondos para pagar en Bs te costaría ${costoRutaBs.toFixed(2)} USDT.`;
        colorTarjeta = theme.success;
      } else {
        diagnostico = "⚖️ El costo real es idéntico";
      }
    }

    return { diagnostico, detalleCalculo, colorTarjeta };
  };

  const resultadoComparador = realizarComparacion();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Navbar
        onClear={limpiarCampos}
        theme={theme}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.heroBackground,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <View style={styles.heroGlow} />
          <Text style={[styles.heroEyebrow, { color: theme.accent }]}>
            VeneConvert
          </Text>
          <Text style={[styles.heroTitle, { color: theme.heroText }]}>
            Convierte, compara y decide mejor.
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.heroSubtext }]}>
            La herramienta financiera más clara para moverte entre bolívares,
            dólares y USDT.
          </Text>
          <View style={styles.heroPills}>
            <View
              style={[
                styles.heroPill,
                { backgroundColor: "rgba(255,255,255,0.12)" },
              ]}
            >
              <Text style={styles.heroPillText}>⚡ Actualización en vivo</Text>
            </View>
            <View
              style={[
                styles.heroPill,
                { backgroundColor: "rgba(255,255,255,0.12)" },
              ]}
            >
              <Text style={styles.heroPillText}>📈 Tasa inteligente</Text>
            </View>
          </View>
        </View>

        <View style={styles.ratesContainer}>
          {cargandoTasas ? (
            <View
              style={[styles.loadingBox, { backgroundColor: theme.surfaceAlt }]}
            >
              <ActivityIndicator size="small" color={theme.accent} />
              <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
                Sincronizando tasas...
              </Text>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.rateBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
                  BCV
                </Text>
                <Text style={[styles.rateValue, { color: theme.textPrimary }]}>
                  {tasaBcv}
                </Text>
              </View>
              <View
                style={[
                  styles.rateBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
                  P2P Compra
                </Text>
                <Text style={[styles.rateValue, { color: theme.textPrimary }]}>
                  {tasaBinanceCompra}
                </Text>
              </View>
              <View
                style={[
                  styles.rateBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
                  P2P Venta
                </Text>
                <Text style={[styles.rateValue, { color: theme.textPrimary }]}>
                  {tasaBinanceVenta}
                </Text>
              </View>
            </>
          )}
        </View>

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {currentTab === "conversor" && (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.surface, shadowColor: theme.shadow },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardLabel, { color: theme.accent }]}>
                    Modo conversor
                  </Text>
                  <Text
                    style={[styles.sectionTitle, { color: theme.textPrimary }]}
                  >
                    Conversiones al vuelo
                  </Text>
                </View>
                <View
                  style={[
                    styles.badgeAccent,
                    { backgroundColor: theme.accentSoft },
                  ]}
                >
                  <Text
                    style={[styles.badgeAccentText, { color: theme.accent }]}
                  >
                    Live
                  </Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Bolívares (VES)
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surfaceAlt,
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
                    onChangeText={handleBsChange}
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
                    styles.inputWrapper,
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
                    onChangeText={handleBcvChange}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  USDT (Tasa Binance)
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
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
                    onChangeText={handleBinanceChange}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>
            </View>
          )}

          {currentTab === "comparador" && (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.surface, shadowColor: theme.shadow },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardLabel, { color: theme.accent }]}>
                    Modo comparador
                  </Text>
                  <Text
                    style={[styles.sectionTitle, { color: theme.textPrimary }]}
                  >
                    ¿Cuál opción sale mejor?
                  </Text>
                </View>
                <View
                  style={[
                    styles.badgeAccent,
                    { backgroundColor: theme.accentSoft },
                  ]}
                >
                  <Text
                    style={[styles.badgeAccentText, { color: theme.accent }]}
                  >
                    AI
                  </Text>
                </View>
              </View>

              <Text style={[styles.label, { color: theme.textSecondary }]}>
                ¿Qué dinero tienes disponible en este momento?
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
                    monedaOrigen === "VES" && [
                      styles.toggleActiveVES,
                      { backgroundColor: theme.textPrimary },
                    ],
                  ]}
                  onPress={() => setMonedaOrigen("VES")}
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
                    monedaOrigen === "USD" && [
                      styles.toggleActiveUSD,
                      { backgroundColor: theme.success },
                    ],
                  ]}
                  onPress={() => setMonedaOrigen("USD")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      monedaOrigen === "USD" && styles.toggleTextActive,
                    ]}
                  >
                    Tengo Dólares/USDT
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Precio en etiqueta o punto (VES)
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surfaceAlt,
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
                    onChangeText={setCompPrecioBs}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Precio si pagas en efectivo o Binance ($)
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
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
                    onChangeText={setCompPrecioDivisa}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>

              {resultadoComparador && (
                <View
                  style={[
                    styles.diagnosisCard,
                    { backgroundColor: resultadoComparador.colorTarjeta },
                  ]}
                >
                  <Text style={styles.diagnosisTitle}>
                    DIAGNÓSTICO EN TIEMPO REAL
                  </Text>
                  <Text style={styles.diagnosisText}>
                    {resultadoComparador.diagnostico}
                  </Text>
                  <Text style={styles.diagnosisDetail}>
                    {resultadoComparador.detalleCalculo}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <BottomTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "web" ? 92 : 88,
    paddingBottom: 130,
    flexGrow: 1,
  },
  heroCard: {
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 14,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroGlow: {
    position: "absolute",
    top: -30,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 28 : 24,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.6,
    lineHeight: Platform.OS === "web" ? 34 : 30,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 320,
  },
  heroPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  heroPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F3F4F6",
  },
  ratesContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
    marginTop: 2,
  },
  loadingBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 16,
    gap: 8,
  },
  loadingText: { fontWeight: "600", fontSize: 13 },
  rateBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    minHeight: 74,
    justifyContent: "center",
  },
  rateLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  rateValue: { fontSize: 15, fontWeight: "700" },
  card: {
    borderRadius: 24,
    padding: 18,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  badgeAccent: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeAccentText: {
    fontSize: 12,
    fontWeight: "700",
  },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 18,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    padding: 6,
    borderRadius: 16,
    marginBottom: 18,
    gap: 6,
  },
  toggleButton: {
    flex: 1,
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  toggleText: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  toggleTextActive: { color: "#FFFFFF", fontWeight: "700" },
  toggleActiveVES: {},
  toggleActiveUSD: {},
  diagnosisCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  diagnosisTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1,
    marginBottom: 6,
  },
  diagnosisText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    lineHeight: 22,
  },
  diagnosisDetail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    lineHeight: 18,
    fontWeight: "500",
  },
});
