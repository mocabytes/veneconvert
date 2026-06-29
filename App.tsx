import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Animated,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import Navbar from "./src/components/Navbar";
import BottomTabs from "./src/components/BottomTabs";
import { analizarCompra, TasasEntrada } from "./src/utils/calculations";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type TabMode = "inicio" | "conversor" | "comparador";
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

function MainApp({ nombreUsuario }: { nombreUsuario: string }) {
  const [currentTab, setCurrentTab] = useState<TabMode>("inicio");
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const colorScheme = useColorScheme();
  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  const [cargandoTasas, setCargandoTasas] = useState<boolean>(true);
  const [modoOffline, setModoOffline] = useState<boolean>(false);
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState<string>("");

  const [tasas, setTasas] = useState<TasasEntrada>({
    bcv: 0,
    binanceBuy: 0,
    binanceSell: 0,
  });

  const [comisionBinance] = useState<number>(0.2);

  // Estados del Conversor
  const [bs, setBs] = useState<string>("");
  const [usdBcv, setUsdBcv] = useState<string>("");
  const [usdtBinance, setUsdtBinance] = useState<string>("");

  // Estados del Comparador
  const [monedaOrigen, setMonedaOrigen] = useState<"VES" | "USD">("VES");
  const [compPrecioBs, setCompPrecioBs] = useState<string>("");
  const [compPrecioUsdBcv, setCompPrecioUsdBcv] = useState<string>("");
  const [compPrecioDivisa, setCompPrecioDivisa] = useState<string>("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  const limpiarCampos = () => {
    setBs("");
    setUsdBcv("");
    setUsdtBinance("");
    setCompPrecioBs("");
    setCompPrecioUsdBcv("");
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
    fadeAnim.setValue(0);
    slideAnim.setValue(12);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentTab, resolvedTheme]);

  useEffect(() => {
    const sincronizarTasas = async () => {
      try {
        const [resBcv, resParalelo] = await Promise.all([
          fetch("https://ve.dolarapi.com/v1/dolares/oficial"),
          fetch("https://ve.dolarapi.com/v1/dolares/paralelo"),
        ]);
        if (!resBcv.ok || !resParalelo.ok) throw new Error("Fallo de red");

        const dataBcv = await resBcv.json();
        const dataParalelo = await resParalelo.json();

        const nuevasTasas: TasasEntrada = {
          bcv: Number(dataBcv.promedio),
          binanceBuy: Number(dataParalelo.promedio * 1.008),
          binanceSell: Number(dataParalelo.promedio * 0.992),
        };
        const fechaActual = new Date().toISOString();

        await AsyncStorage.setItem("cached_rates", JSON.stringify(nuevasTasas));
        await AsyncStorage.setItem("cached_sync_time", fechaActual);

        setTasas(nuevasTasas);
        setUltimaSincronizacion(fechaActual);
        setModoOffline(false);
      } catch (error) {
        const tasasLocales = await AsyncStorage.getItem("cached_rates");
        const tiempoLocal = await AsyncStorage.getItem("cached_sync_time");
        if (tasasLocales && tiempoLocal) {
          setTasas(JSON.parse(tasasLocales));
          setUltimaSincronizacion(tiempoLocal);
          setModoOffline(true);
        } else {
          setTasas({ bcv: 36.5, binanceBuy: 40.1, binanceSell: 39.5 });
          setUltimaSincronizacion(new Date().toISOString());
          setModoOffline(true);
        }
      } finally {
        setCargandoTasas(false);
      }
    };
    sincronizarTasas();
  }, []);

  const handleBsChange = (value: string) => {
    setBs(value);
    if (value === "" || tasas.bcv === 0) {
      setUsdBcv("");
      setUsdtBinance("");
      return;
    }
    const numBs = parseFloat(value) || 0;
    setUsdBcv((numBs / tasas.bcv).toFixed(2));
    setUsdtBinance((numBs / tasas.binanceBuy).toFixed(2));
  };

  const handleBcvChange = (value: string) => {
    setUsdBcv(value);
    if (value === "") {
      setBs("");
      setUsdtBinance("");
      return;
    }
    const numUsd = parseFloat(value) || 0;
    const equivalenteBs = numUsd * tasas.bcv;
    setBs(equivalenteBs.toFixed(2));
    setUsdtBinance((equivalenteBs / tasas.binanceBuy).toFixed(2));
  };

  const handleBinanceChange = (value: string) => {
    setUsdtBinance(value);
    if (value === "") {
      setBs("");
      setUsdBcv("");
      return;
    }
    const numUsdt = parseFloat(value) || 0;
    const equivalenteBs = numUsdt * tasas.binanceSell;
    setBs(equivalenteBs.toFixed(2));
    setUsdBcv((equivalenteBs / tasas.bcv).toFixed(2));
  };

  const handleCompBsChange = (value: string) => {
    setCompPrecioBs(value);
    if (value === "" || tasas.bcv === 0) {
      setCompPrecioUsdBcv("");
      return;
    }
    setCompPrecioUsdBcv((parseFloat(value) / tasas.bcv).toFixed(2));
  };

  const handleCompUsdBcvChange = (value: string) => {
    setCompPrecioUsdBcv(value);
    if (value === "" || tasas.bcv === 0) {
      setCompPrecioBs("");
      return;
    }
    setCompPrecioBs((parseFloat(value) * tasas.bcv).toFixed(2));
  };

  const resultadoComparador = analizarCompra(
    monedaOrigen,
    parseFloat(compPrecioBs) || 0,
    parseFloat(compPrecioDivisa) || 0,
    tasas,
    comisionBinance,
  );
  const ContainerView = Platform.OS === "web" ? View : SafeAreaView;

  return (
    <ContainerView
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
        {/* PESTAÑA 1: INICIO (DASHBOARD LIMPIO Y COMPLETO) */}
        {currentTab === "inicio" && (
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
            >
              <View style={styles.heroGlow} />
              <Text style={[styles.heroEyebrow, { color: theme.accent }]}>
                Panel Principal
              </Text>
              <Text style={[styles.heroTitle, { color: theme.heroText }]}>
                ¡Hola, {nombreUsuario}! 👋
              </Text>
              <Text style={[styles.heroSubtitle, { color: theme.heroSubtext }]}>
                Monitorea el valor del Bolívar y toma decisiones de compra
                inteligentes en segundos.
              </Text>
              <View style={styles.heroPills}>
                <View
                  style={[
                    styles.heroPill,
                    {
                      backgroundColor: modoOffline
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(16, 185, 129, 0.2)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.heroPillText,
                      { color: modoOffline ? "#FCA5A5" : "#34D399" },
                    ]}
                  >
                    {modoOffline ? "⚠️ Modo Offline" : "⚡ Conexión En Vivo"}
                  </Text>
                </View>
                {ultimaSincronizacion && (
                  <View
                    style={[
                      styles.heroPill,
                      { backgroundColor: "rgba(255,255,255,0.12)" },
                    ]}
                  >
                    <Text style={styles.heroPillText}>
                      🕒 Sinc:{" "}
                      {new Date(ultimaSincronizacion).toLocaleTimeString(
                        "es-VE",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
              Tasas de Referencia
            </Text>
            <View style={styles.ratesContainer}>
              {cargandoTasas ? (
                <View
                  style={[
                    styles.loadingBox,
                    { backgroundColor: theme.surfaceAlt },
                  ]}
                >
                  <ActivityIndicator size="small" color={theme.accent} />
                </View>
              ) : (
                <>
                  <View
                    style={[
                      styles.rateBox,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.rateLabel, { color: theme.textMuted }]}
                    >
                      BCV Oficial
                    </Text>
                    <Text
                      style={[styles.rateValue, { color: theme.textPrimary }]}
                    >
                      Bs. {tasas.bcv.toFixed(2)}
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

            {/* SECCIÓN DE RELLENO ATRACTIVO: ACCESOS RÁPIDOS Y TIPS */}
            <Text
              style={[
                styles.sectionHeading,
                { color: theme.textPrimary, marginTop: 14 },
              ]}
            >
              Herramientas Rápidas
            </Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={[
                  styles.quickActionCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() => setCurrentTab("conversor")}
              >
                <Text style={styles.quickActionEmoji}>↺</Text>
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
                onPress={() => setCurrentTab("comparador")}
              >
                <Text style={styles.quickActionEmoji}>⚖</Text>
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
            </View>

            <View
              style={[
                styles.tipCard,
                {
                  backgroundColor: theme.surfaceAlt,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={styles.tipTitle}>💡 Tip Financiero del Día</Text>
              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                Si un comercio calcula los precios a tasa BCV y tienes bolívares
                en tu cuenta, pagar por punto siempre será tu mejor opción.
                Evita cambiar a USDT a menos que la etiqueta de divisas tenga un
                descuento superior al 8%.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* PESTAÑA 2: CONVERSOR (AISLADO Y LIMPIO) */}
        {currentTab === "conversor" && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardLabel, { color: theme.accent }]}>
                    Modo conversor
                  </Text>
                  <Text
                    style={[styles.sectionTitle, { color: theme.textPrimary }]}
                  >
                    Conversiones rápidas
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
                  USDT (Tasa Binance Venta)
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
          </Animated.View>
        )}

        {/* PESTAÑA 3: COMPARADOR (AISLADO Y LIMPIO) */}
        {currentTab === "comparador" && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
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
              </View>

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
                    monedaOrigen === "VES" && {
                      backgroundColor: theme.textPrimary,
                    },
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
                    monedaOrigen === "USD" && {
                      backgroundColor: theme.success,
                    },
                  ]}
                  onPress={() => setMonedaOrigen("USD")}
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
                    $ BCV
                  </Text>
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    keyboardType="numeric"
                    autoFocus={Platform.OS !== "web"}
                    value={compPrecioUsdBcv}
                    onChangeText={handleCompUsdBcvChange}
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
                    onChangeText={handleCompBsChange}
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
                    {
                      backgroundColor: obtenerColorCard(
                        resultadoComparador.recomendacion,
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
                  {resultadoComparador.ahorroEstimado > 0 && (
                    <View style={styles.diagnosisAhorroContainer}>
                      <Text style={styles.diagnosisAhorro}>
                        🔥 Ahorras:{" "}
                        {resultadoComparador.monedaAhorro === "VES"
                          ? "Bs. "
                          : "$ "}
                        {resultadoComparador.ahorroEstimado.toLocaleString(
                          "es-VE",
                          { minimumFractionDigits: 2 },
                        )}
                      </Text>
                    </View>
                  )}
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
                        ellipsizeMode="tail"
                      >
                        {index === 0 ? `🏆 ${opcion.nombre}` : opcion.nombre}
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
              )}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <BottomTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
      />
    </ContainerView>
  );
}

export default function App() {
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [inputNombre, setInputNombre] = useState<string>("");
  const [comprobandoRegistro, setComprobandoRegistro] = useState<boolean>(true);

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const nombreGuardado = await AsyncStorage.getItem("user_name");
        if (nombreGuardado) setNombreUsuario(nombreGuardado);
      } catch (e) {
        console.log(e);
      } finally {
        setComprobandoRegistro(false);
      }
    };
    cargarNombre();
  }, []);

  const guardarRegistroUsuario = async () => {
    if (inputNombre.trim().length < 2) return;
    await AsyncStorage.setItem("user_name", inputNombre.trim());
    setNombreUsuario(inputNombre.trim());
  };

  if (comprobandoRegistro) {
    return (
      <SafeAreaProvider>
        <View style={[styles.welcomeContainer, { backgroundColor: "#060B14" }]}>
          <ActivityIndicator size="large" color="#A78BFA" />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!nombreUsuario) {
    return (
      <SafeAreaProvider>
        <View style={[styles.welcomeContainer, { backgroundColor: "#060B14" }]}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeEmoji}>🇲🇬</Text>
            <Text style={styles.welcomeTitle}>
              ¡Te damos la bienvenida a VeneConvert!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Tu aliado inteligente para calcular tasas y decidir tus compras en
              tiempo real en Margarita. ¿Cómo te llamas?
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: "rgba(255,255,255,0.15)",
                  backgroundColor: "#111827",
                  marginTop: 20,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  { color: "#F9FAFB", fontSize: 16, textAlign: "center" },
                ]}
                placeholder="Ingresa tu nombre o apodo"
                placeholderTextColor="#94A3B8"
                value={inputNombre}
                onChangeText={setInputNombre}
                maxLength={20}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.welcomeButton,
                {
                  backgroundColor:
                    inputNombre.trim().length >= 2
                      ? "#8B5CF6"
                      : "rgba(139, 92, 246, 0.4)",
                },
              ]}
              onPress={guardarRegistroUsuario}
              disabled={inputNombre.trim().length < 2}
            >
              <Text style={styles.welcomeButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <MainApp nombreUsuario={nombreUsuario} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop:
      Platform.OS === "web"
        ? 30
        : RNStatusBar.currentHeight
          ? RNStatusBar.currentHeight + 30
          : 50,
    paddingBottom: 130,
    flexGrow: 1,
  },
  heroCard: {
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 16,
    overflow: "hidden",
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
  heroSubtitle: { fontSize: 14, lineHeight: 21, maxWidth: 320 },
  heroPills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  heroPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  heroPillText: { fontSize: 11, fontWeight: "700", color: "#F3F4F6" },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  ratesContainer: { flexDirection: "row", gap: 8, marginBottom: 16 },
  loadingBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 16,
  },
  rateBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
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
    marginBottom: 4,
  },
  rateValue: { fontSize: 14, fontWeight: "700" },
  quickActionsGrid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
  },
  quickActionEmoji: { fontSize: 24, marginBottom: 6 },
  quickActionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  quickActionDesc: { fontSize: 11, fontWeight: "500" },
  tipCard: { padding: 16, borderRadius: 22, borderWidth: 1, marginBottom: 10 },
  tipTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
    color: "#8B5CF6",
  },
  tipText: { fontSize: 12, lineHeight: 18, fontWeight: "500" },
  card: { borderRadius: 24, padding: 18, elevation: 8 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardHeaderText: { flex: 1 },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.4 },
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
  currencyPrefix: { fontSize: 16, fontWeight: "700", marginRight: 10 },
  input: { flex: 1, height: 54, fontSize: 18, fontWeight: "600" },
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
  diagnosisCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  diagnosisTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  diagnosisText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    lineHeight: 23,
  },
  diagnosisAhorroContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  diagnosisAhorro: { fontSize: 14, fontWeight: "800", color: "#FFFFFF" },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 16,
  },
  desgloseTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  desgloseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  desgloseRowGanador: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
  desgloseNombre: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    flex: 1,
    paddingRight: 12,
  },
  desgloseCosto: {
    fontSize: 13,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "700",
    textAlign: "right",
    minWidth: 90,
  },
  textGanador: { color: "#FFFFFF", fontWeight: "700" },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  welcomeCard: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    padding: 24,
    borderRadius: 28,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    elevation: 10,
  },
  welcomeEmoji: { fontSize: 42, marginBottom: 16 },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  welcomeButton: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  welcomeButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
