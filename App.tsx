import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
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
  Share,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import Navbar from "./src/components/Navbar";
import BottomTabs from "./src/components/BottomTabs";
import AnimatedButton from "./src/components/AnimatedButton";
import LoadingScreen from "./src/components/LoadingScreen";
import {
  ExchangeIcon,
  ScaleIcon,
  ClockIcon,
  BookIcon,
  TrendIcon,
  LightbulbIcon,
  FireIcon,
  TrophyIcon,
  SwapIcon,
  TrashIcon,
  MoonIcon,
  BeachIcon,
  getFlagIcon,
} from "./src/components/Icons";

// Lazy loading de componentes pesados
const MoreMenu = lazy(() => import("./src/components/MoreMenu"));
const Onboarding = lazy(() => import("./src/components/Onboarding"));
const SwipeableHistoryItem = lazy(
  () => import('./src/components/SwipeableHistoryItem')
);
const PulseAnimation = lazy(() => import("./src/components/PulseAnimation"));
import { analizarCompra, TasasEntrada } from "./src/utils/calculations";
import {
  saveConversion,
  getConversionHistory,
  deleteConversion,
  clearConversionHistory,
  ConversionRecord,
} from "./src/utils/history";
import {
  generateHistoricalRates,
  getChartData,
  getRateStats,
  RateHistoryPoint,
} from "./src/utils/ratesHistory";
import {
  saveAlert,
  getAlerts,
  updateAlert,
  deleteAlert,
  RateAlert,
} from "./src/utils/alerts";
import {
  SUPPORTED_CURRENCIES,
  convertCurrency,
  getCurrencyByCode,
  formatCurrency,
  getExchangeRates,
  ConversionResult,
} from "./src/utils/multiCurrency";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { triggerHapticForAction } from "./src/utils/haptic";
import {
  announceForAccessibility,
} from "./src/utils/accessibility";
import {
  isTablet,
  getContainerWidth,
} from "./src/utils/responsive";
import { lightTheme, darkTheme } from "./src/theme/colors";
import { RECOMENDACIONES_FINANCIERAS } from "./src/constants/recommendations";

type TabMode =
  | 'inicio'
  | 'conversor'
  | 'comparador'
  | 'configuracion'
  | 'multimoneda'
  | 'historial'
  | 'tendencias'
  | "alertas";
type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

function MainApp({
  nombreUsuario,
  alCambiarNombre,
}: {
  nombreUsuario: string;
  alCambiarNombre: (nuevo: string) => void;
}) {
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

  const [mostrarDiagnostico, setMostrarDiagnostico] = useState<boolean>(false);
  const [tipAleatorio, setTipAleatorio] = useState<string>("");

  const [nuevoNombreInput, setNuevoNombreInput] =
    useState<string>(nombreUsuario);

  const [conversionHistory, setConversionHistory] = useState<
    ConversionRecord[]
  >([]);
  const [ratesHistory, setRatesHistory] = useState<RateHistoryPoint[]>([]);
  const [rateAlerts, setRateAlerts] = useState<RateAlert[]>([]);
  const [newAlertThreshold, setNewAlertThreshold] = useState<string>("");
  const [newAlertType, setNewAlertType] = useState<
    "BCV" | "BINANCE_BUY" | "BINANCE_SELL"
  >("BCV");
  const [newAlertCondition, setNewAlertCondition] = useState<"ABOVE" | "BELOW">(
    'ABOVE'
  );

  const [selectedFromCurrency, setSelectedFromCurrency] =
    useState<string>("VES");
  const [selectedToCurrency, setSelectedToCurrency] = useState<string>("USD");
  const [multiCurrencyAmount, setMultiCurrencyAmount] = useState<string>("");
  const [multiCurrencyResult, setMultiCurrencyResult] =
    useState<ConversionResult | null>(null);
  const [showFromCurrencySelector, setShowFromCurrencySelector] =
    useState<boolean>(false);
  const [showToCurrencySelector, setShowToCurrencySelector] =
    useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const limpiarCampos = () => {
    setBs("");
    setUsdBcv("");
    setUsdtBinance("");
    setCompPrecioBs("");
    setCompPrecioUsdBcv("");
    setCompPrecioDivisa("");
    setMostrarDiagnostico(false);
  };

  const handleDeleteConversion = async (id: string) => {
    triggerHapticForAction("delete");
    await deleteConversion(id);
    loadConversionHistory();
    announceForAccessibility("Conversión eliminada");
  };

  const handleClearHistory = async () => {
    triggerHapticForAction("delete");
    await clearConversionHistory();
    loadConversionHistory();
    announceForAccessibility("Historial limpiado");
  };

  const handleShareConversion = async (record: ConversionRecord) => {
    triggerHapticForAction("share");
    const message = `Conversión en Arco\n\n${record.fromAmount.toFixed(2)} ${
      record.fromCurrency
    } → ${record.toAmount.toFixed(2)} ${record.toCurrency}\n\nTasa: ${
      record.rateType
    } (${record.rateUsed.toFixed(2)})\nFecha: ${new Date(
      record.timestamp
    ).toLocaleDateString(
      'es-VE'
    )}\n\nDescarga Arco para tus conversiones rápidas`;

    try {
      await Share.share({
        message,
      });
      announceForAccessibility("Conversión compartida");
    } catch (error) {
      console.error("Error compartiendo:", error);
    }
  };

  const handleSelectMoreTab = (
    tab:
      | 'multimoneda'
      | 'historial'
      | 'tendencias'
      | 'alertas'
      | 'configuracion'
  ) => {
    triggerHapticForAction("tab");
    setCurrentTab(tab);
  };

  const guardarNombrePerfil = async () => {
    if (nuevoNombreInput.trim().length >= 2) {
      try {
        await AsyncStorage.setItem("user_name", nuevoNombreInput.trim());
        alCambiarNombre(nuevoNombreInput.trim());
        alert("¡Nombre de perfil actualizado con éxito!");
      } catch (error) {
        console.log("Error guardando el nombre:", error);
      }
    }
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
    if (currentTab === "inicio") {
      const indice = Math.floor(
        Math.random() * RECOMENDACIONES_FINANCIERAS.length
      );
      setTipAleatorio(RECOMENDACIONES_FINANCIERAS[indice]);
    }

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
        if (!resBcv.ok || !resParalelo.ok) {
          throw new Error("Fallo de red");
        }

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

    const checkOnboarding = async () => {
      const onboardingCompleted = await AsyncStorage.getItem(
        'onboarding_completed'
      );
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    };

    sincronizarTasas();
    loadConversionHistory();
    checkOnboarding();
  }, []);

  const loadConversionHistory = async () => {
    const history = await getConversionHistory();
    setConversionHistory(history);
  };

  useEffect(() => {
    const historicalData = generateHistoricalRates(30);
    setRatesHistory(historicalData);
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const alerts = await getAlerts();
    setRateAlerts(alerts);
  };

  const handleAddAlert = async () => {
    const threshold = parseFloat(newAlertThreshold);
    if (isNaN(threshold) || threshold <= 0) {
      return;
    }

    await saveAlert({
      type: newAlertType,
      condition: newAlertCondition,
      threshold,
      enabled: true,
    });

    setNewAlertThreshold("");
    loadAlerts();
  };

  const handleToggleAlert = async (id: string, enabled: boolean) => {
    await updateAlert(id, { enabled });
    loadAlerts();
  };

  const handleDeleteAlert = async (id: string) => {
    await deleteAlert(id);
    loadAlerts();
  };

  const handleMultiCurrencyConvert = async () => {
    const amount = parseFloat(multiCurrencyAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    try {
      const rates = await getExchangeRates("VES", {
        bcv: tasas.bcv,
        binanceBuy: tasas.binanceBuy,
      });
      const result = convertCurrency(
        amount,
        selectedFromCurrency,
        selectedToCurrency,
        rates
      );
      setMultiCurrencyResult(result);
    } catch (error) {
      console.error("Error en conversión multi-moneda:", error);
    }
  };

  const handleSwapCurrencies = () => {
    const temp = selectedFromCurrency;
    setSelectedFromCurrency(selectedToCurrency);
    setSelectedToCurrency(temp);
    setMultiCurrencyResult(null);
  };

  const handleBsChange = async (value: string) => {
    triggerHapticForAction("input");
    setBs(value);
    if (value === "" || tasas.bcv === 0) {
      setUsdBcv("");
      setUsdtBinance("");
      return;
    }
    const numBs = parseFloat(value) || 0;
    const usdBcvValue = (numBs / tasas.bcv).toFixed(2);
    const usdtBinanceValue = (numBs / tasas.binanceBuy).toFixed(2);
    setUsdBcv(usdBcvValue);
    setUsdtBinance(usdtBinanceValue);

    // Guardar conversión en historial
    await saveConversion({
      type: "BS_TO_USD_BCV",
      fromAmount: numBs,
      fromCurrency: "VES",
      toAmount: parseFloat(usdBcvValue),
      toCurrency: "USD",
      rateUsed: tasas.bcv,
      rateType: "BCV",
    });
    loadConversionHistory();
  };

  const handleBcvChange = async (value: string) => {
    triggerHapticForAction("input");
    setUsdBcv(value);
    if (value === "") {
      setBs("");
      setUsdtBinance("");
      return;
    }
    const numUsd = parseFloat(value) || 0;
    const equivalenteBs = numUsd * tasas.bcv;
    const bsValue = equivalenteBs.toFixed(2);
    const usdtValue = (equivalenteBs / tasas.binanceBuy).toFixed(2);
    setBs(bsValue);
    setUsdtBinance(usdtValue);

    // Guardar conversión en historial
    await saveConversion({
      type: "USD_BCV_TO_BS",
      fromAmount: numUsd,
      fromCurrency: "USD",
      toAmount: parseFloat(bsValue),
      toCurrency: "VES",
      rateUsed: tasas.bcv,
      rateType: "BCV",
    });
    loadConversionHistory();
  };

  const handleBinanceChange = async (value: string) => {
    triggerHapticForAction("input");
    setUsdtBinance(value);
    if (value === "") {
      setBs("");
      setUsdBcv("");
      return;
    }
    const numUsdt = parseFloat(value) || 0;
    const equivalenteBs = numUsdt * tasas.binanceSell;
    const bsValue = equivalenteBs.toFixed(2);
    const usdBcvValue = (equivalenteBs / tasas.bcv).toFixed(2);
    setBs(bsValue);
    setUsdBcv(usdBcvValue);

    // Guardar conversión en historial
    await saveConversion({
      type: "USDT_TO_BS",
      fromAmount: numUsdt,
      fromCurrency: "USDT",
      toAmount: parseFloat(bsValue),
      toCurrency: "VES",
      rateUsed: tasas.binanceSell,
      rateType: "BINANCE_SELL",
    });
    loadConversionHistory();
  };

  const handleCompBsChange = (value: string) => {
    setMostrarDiagnostico(false);
    setCompPrecioBs(value);
    if (value === "" || tasas.bcv === 0) {
      setCompPrecioUsdBcv("");
      return;
    }
    setCompPrecioUsdBcv((parseFloat(value) / tasas.bcv).toFixed(2));
  };

  const handleCompUsdBcvChange = (value: string) => {
    setMostrarDiagnostico(false);
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
    comisionBinance
  );

  useEffect(() => {
    if (
      resultadoComparador &&
      currentTab === "comparador" &&
      mostrarDiagnostico
    ) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [resultadoComparador, currentTab, mostrarDiagnostico]);

  const ejecutarAnalisis = () => {
    setMostrarDiagnostico(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const obtenerColorCard = (rec: string) => {
    if (rec.includes("DIRECTO")) {
      return theme.success;
    }
    if (rec.includes("CAMBIAR")) {
      return theme.accent;
    }
    return theme.textSecondary;
  };

  const ContainerView = Platform.OS === "web" ? View : SafeAreaView;

  if (showOnboarding) {
    return (
      <Suspense
        fallback={<ActivityIndicator size="large" color={theme.accent} />}
      >
        <Onboarding onComplete={() => setShowOnboarding(false)} theme={theme} />
      </Suspense>
    );
  }

  return (
    <ContainerView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Navbar
        onClear={currentTab !== 'inicio' ? limpiarCampos : undefined}
        theme={theme}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
      />

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContainer,
          { maxWidth: getContainerWidth(), width: "100%", alignSelf: "center" },
        ]}
      >
        {/* PESTAÑA 1: INICIO */}
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
                  <Suspense
                    fallback={
                      <View
                        style={[
                          styles.rateBox,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <ActivityIndicator size="small" color={theme.accent} />
                      </View>
                    }
                  >
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
                  </Suspense>
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
            <View
              style={[
                styles.quickActionsGrid,
                isTablet() && styles.quickActionsGridTablet,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.quickActionCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() => {
                  triggerHapticForAction("tab");
                  setCurrentTab("conversor");
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
                  setCurrentTab("comparador");
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
                  setCurrentTab("historial");
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
                  setCurrentTab("tendencias");
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
        )}

        {/* PESTAÑA 2: CONVERSOR */}
        {currentTab === "conversor" && (
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
                    onChangeText={handleBinanceChange}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* PESTAÑA 3: COMPARADOR */}
        {currentTab === "comparador" && (
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
                    setMonedaOrigen("VES");
                    setMostrarDiagnostico(false);
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
                    setMonedaOrigen("USD");
                    setMostrarDiagnostico(false);
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
                    onChangeText={(val) => {
                      setCompPrecioDivisa(val);
                      setMostrarDiagnostico(false);
                    }}
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
                  onPress={ejecutarAnalisis}
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
        )}

        {/* PESTAÑA 4: MULTIMONEDA */}
        {currentTab === "multimoneda" && (
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
                Conversor Multi-Moneda
              </Text>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textPrimary, marginBottom: 24 },
                ]}
              >
                Cambio entre monedas
              </Text>

              <View style={styles.currencySelectorRow}>
                <View style={styles.currencySelectorHalf}>
                  <Text
                    style={[
                      styles.label,
                      { color: theme.textSecondary, marginBottom: 8 },
                    ]}
                  >
                    De
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.currencySelectorButton,
                      {
                        backgroundColor: theme.surfaceAlt,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setShowFromCurrencySelector(true)}
                  >
                    {getFlagIcon(
                      getCurrencyByCode(selectedFromCurrency)?.flagCode || 'us',
                      18
                    )}
                    <Text
                      style={[
                        styles.currencySelectorCode,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {selectedFromCurrency}
                    </Text>
                    <Text style={styles.currencySelectorArrow}>▼</Text>
                  </TouchableOpacity>
                </View>

                <AnimatedButton
                  style={styles.swapButton}
                  onPress={handleSwapCurrencies}
                  hapticType="medium"
                >
                  <SwapIcon size={24} color={theme.textPrimary} />
                </AnimatedButton>

                <View style={styles.currencySelectorHalf}>
                  <Text
                    style={[
                      styles.label,
                      { color: theme.textSecondary, marginBottom: 8 },
                    ]}
                  >
                    A
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.currencySelectorButton,
                      {
                        backgroundColor: theme.surfaceAlt,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setShowToCurrencySelector(true)}
                  >
                    {getFlagIcon(
                      getCurrencyByCode(selectedToCurrency)?.flagCode || 'us',
                      18
                    )}
                    <Text
                      style={[
                        styles.currencySelectorCode,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {selectedToCurrency}
                    </Text>
                    <Text style={styles.currencySelectorArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showFromCurrencySelector && (
                <>
                  <TouchableOpacity
                    style={styles.currencyBackdrop}
                    activeOpacity={1}
                    onPress={() => setShowFromCurrencySelector(false)}
                  />
                  <View
                    style={[
                      styles.currencyModal,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyModalTitle,
                        { color: theme.textPrimary },
                      ]}
                    >
                      Seleccionar moneda origen
                    </Text>
                    <ScrollView
                      style={styles.currencyModalList}
                      nestedScrollEnabled={true}
                    >
                      {SUPPORTED_CURRENCIES.map((currency) => (
                        <TouchableOpacity
                          key={currency.code}
                          style={[
                            styles.currencyModalItem,
                            selectedFromCurrency === currency.code && {
                              backgroundColor: theme.accent,
                            },
                          ]}
                          onPress={() => {
                            setSelectedFromCurrency(currency.code);
                            setShowFromCurrencySelector(false);
                          }}
                        >
                          {getFlagIcon(currency.flagCode, 20)}
                          <Text
                            style={[
                              styles.currencyModalCode,
                              selectedFromCurrency === currency.code &&
                                styles.currencyModalCodeActive,
                            ]}
                          >
                            {currency.code}
                          </Text>
                          <Text
                            style={[
                              styles.currencyModalName,
                              { color: theme.textSecondary },
                            ]}
                          >
                            {currency.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={[
                        styles.currencyModalClose,
                        { backgroundColor: theme.surfaceAlt },
                      ]}
                      onPress={() => setShowFromCurrencySelector(false)}
                    >
                      <Text
                        style={[
                          styles.currencyModalCloseText,
                          { color: theme.textPrimary },
                        ]}
                      >
                        Cerrar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {showToCurrencySelector && (
                <>
                  <TouchableOpacity
                    style={styles.currencyBackdrop}
                    activeOpacity={1}
                    onPress={() => setShowToCurrencySelector(false)}
                  />
                  <View
                    style={[
                      styles.currencyModal,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyModalTitle,
                        { color: theme.textPrimary },
                      ]}
                    >
                      Seleccionar moneda destino
                    </Text>
                    <ScrollView
                      style={styles.currencyModalList}
                      nestedScrollEnabled={true}
                    >
                      {SUPPORTED_CURRENCIES.map((currency) => (
                        <TouchableOpacity
                          key={currency.code}
                          style={[
                            styles.currencyModalItem,
                            selectedToCurrency === currency.code && {
                              backgroundColor: theme.success,
                            },
                          ]}
                          onPress={() => {
                            setSelectedToCurrency(currency.code);
                            setShowToCurrencySelector(false);
                          }}
                        >
                          {getFlagIcon(currency.flagCode, 20)}
                          <Text
                            style={[
                              styles.currencyModalCode,
                              selectedToCurrency === currency.code &&
                                styles.currencyModalCodeActive,
                            ]}
                          >
                            {currency.code}
                          </Text>
                          <Text
                            style={[
                              styles.currencyModalName,
                              { color: theme.textSecondary },
                            ]}
                          >
                            {currency.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={[
                        styles.currencyModalClose,
                        { backgroundColor: theme.surfaceAlt },
                      ]}
                      onPress={() => setShowToCurrencySelector(false)}
                    >
                      <Text
                        style={[
                          styles.currencyModalCloseText,
                          { color: theme.textPrimary },
                        ]}
                      >
                        Cerrar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Monto
                </Text>
                <View
                  style={[
                    styles.flatInputWrapper,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surfaceAlt,
                    },
                  ]}
                >
                  <Text
                    style={[styles.currencyPrefix, { color: theme.textMuted }]}
                  >
                    {getCurrencyByCode(selectedFromCurrency)?.symbol}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { color: theme.textPrimary, height: 48 },
                    ]}
                    keyboardType="numeric"
                    value={multiCurrencyAmount}
                    onChangeText={setMultiCurrencyAmount}
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.calculateButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={handleMultiCurrencyConvert}
              >
                <Text style={styles.calculateButtonText}>Convertir</Text>
              </TouchableOpacity>

              {multiCurrencyResult && (
                <View
                  style={[
                    styles.multiCurrencyResult,
                    {
                      backgroundColor: theme.successBg,
                      borderColor: theme.successBorder,
                    },
                  ]}
                >
                  <View style={styles.multiCurrencyResultRow}>
                    <Text
                      style={[
                        styles.multiCurrencyResultLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {getCurrencyByCode(selectedFromCurrency)?.name}
                    </Text>
                    <Text
                      style={[
                        styles.multiCurrencyResultValue,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {formatCurrency(
                        multiCurrencyResult.fromAmount,
                        selectedFromCurrency
                      )}
                    </Text>
                  </View>
                  <View style={styles.multiCurrencyResultArrow}>
                    <Text
                      style={[
                        styles.multiCurrencyArrowText,
                        { color: theme.accent },
                      ]}
                    >
                      ↓
                    </Text>
                  </View>
                  <View style={styles.multiCurrencyResultRow}>
                    <Text
                      style={[
                        styles.multiCurrencyResultLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {getCurrencyByCode(selectedToCurrency)?.name}
                    </Text>
                    <Text
                      style={[
                        styles.multiCurrencyResultValue,
                        { color: theme.success, fontWeight: '800' },
                      ]}
                    >
                      {formatCurrency(
                        multiCurrencyResult.toAmount,
                        selectedToCurrency
                      )}
                    </Text>
                  </View>
                  <View style={styles.multiCurrencyRate}>
                    <Text
                      style={[
                        styles.multiCurrencyRateText,
                        { color: theme.textMuted },
                      ]}
                    >
                      Tasa: 1 {selectedFromCurrency} ={' '}
                      {multiCurrencyResult.rateUsed.toFixed(4)}{' '}
                      {selectedToCurrency}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* PESTAÑA 5: HISTORIAL */}
        {currentTab === "historial" && (
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
                Historial
              </Text>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textPrimary, marginBottom: 24 },
                ]}
              >
                Conversiones recientes
              </Text>

              {conversionHistory.length > 0 && (
                <View style={styles.historyList}>
                  {conversionHistory.slice(0, 10).map((record) => (
                    <Suspense
                      key={record.id}
                      fallback={
                        <ActivityIndicator size="small" color={theme.accent} />
                      }
                    >
                      <SwipeableHistoryItem
                        record={record}
                        onDelete={() => handleDeleteConversion(record.id)}
                        onShare={() => handleShareConversion(record)}
                        theme={theme}
                      />
                    </Suspense>
                  ))}
                  {conversionHistory.length > 10 && (
                    <TouchableOpacity
                      style={[
                        styles.historyClear,
                        { backgroundColor: theme.surface },
                      ]}
                      onPress={handleClearHistory}
                      accessible={true}
                      accessibilityLabel="Limpiar todo el historial"
                      accessibilityHint="Elimina todas las conversiones guardadas"
                    >
                      <Text
                        style={[
                          styles.historyClearText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        Limpiar todo el historial
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {conversionHistory.length === 0 && (
                <View
                  style={[
                    styles.historyEmpty,
                    { backgroundColor: theme.surfaceAlt },
                  ]}
                >
                  <Text style={styles.historyEmptyText}>
                    No hay conversiones recientes
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* PESTAÑA 6: TENDENCIAS */}
        {currentTab === "tendencias" && (
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
                Tendencias
              </Text>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textPrimary, marginBottom: 24 },
                ]}
              >
                Tasa de cambio (30 días)
              </Text>

              {ratesHistory.length > 0 && (
                <View
                  style={[
                    styles.chartContainer,
                    { backgroundColor: theme.surface },
                  ]}
                >
                  <View style={styles.chartLegend}>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: '#2c6bbd' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.legendText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        BCV
                      </Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: '#8EA5FF' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.legendText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        P2P
                      </Text>
                    </View>
                  </View>
                  <LineChart
                    data={getChartData(ratesHistory)}
                    width={Dimensions.get("window").width - 60}
                    height={220}
                    chartConfig={{
                      backgroundColor: theme.surface,
                      backgroundGradientFrom: theme.surface,
                      backgroundGradientTo: theme.surface,
                      decimalPlaces: 2,
                      color: () => theme.textSecondary,
                      labelColor: () => theme.textMuted,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: "3",
                        strokeWidth: "2",
                        stroke: theme.accent,
                      },
                    }}
                    bezier
                    style={styles.chart}
                  />
                  {(() => {
                    const stats = getRateStats(ratesHistory);
                    return (
                      <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                          <Text
                            style={[
                              styles.statLabel,
                              { color: theme.textMuted },
                            ]}
                          >
                            BCV Actual
                          </Text>
                          <Text
                            style={[
                              styles.statValue,
                              { color: theme.textPrimary },
                            ]}
                          >
                            Bs. {stats.bcv.current.toFixed(2)}
                          </Text>
                          <Text
                            style={[
                              styles.statChange,
                              {
                                color:
                                  stats.bcv.change >= 0
                                    ? theme.success
                                    : '#EF4444',
                              },
                            ]}
                          >
                            {stats.bcv.change >= 0 ? "▲" : "▼"}{' '}
                            {Math.abs(stats.bcv.change).toFixed(2)}%
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text
                            style={[
                              styles.statLabel,
                              { color: theme.textMuted },
                            ]}
                          >
                            Promedio 30d
                          </Text>
                          <Text
                            style={[
                              styles.statValue,
                              { color: theme.textPrimary },
                            ]}
                          >
                            Bs. {stats.bcv.average.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text
                            style={[
                              styles.statLabel,
                              { color: theme.textMuted },
                            ]}
                          >
                            Máx/Mín
                          </Text>
                          <Text
                            style={[
                              styles.statValue,
                              { color: theme.textPrimary },
                            ]}
                          >
                            {stats.bcv.max.toFixed(0)} /{' '}
                            {stats.bcv.min.toFixed(0)}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* PESTAÑA 7: ALERTAS */}
        {currentTab === "alertas" && (
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
                Alertas
              </Text>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textPrimary, marginBottom: 24 },
                ]}
              >
                Alertas de tasa
              </Text>

              <View style={styles.alertsContainer}>
                <View
                  style={[
                    styles.alertForm,
                    {
                      backgroundColor: theme.surfaceAlt,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.label,
                      { color: theme.textSecondary, marginBottom: 8 },
                    ]}
                  >
                    Nueva Alerta
                  </Text>
                  <View style={styles.alertFormRow}>
                    <View style={styles.alertFormHalf}>
                      <Text
                        style={[
                          styles.alertFormLabel,
                          { color: theme.textMuted },
                        ]}
                      >
                        Tipo
                      </Text>
                      <View
                        style={[
                          styles.toggleContainer,
                          { backgroundColor: theme.surface, marginBottom: 0 },
                        ]}
                      >
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            newAlertType === "BCV" && {
                              backgroundColor: theme.accent,
                            },
                          ]}
                          onPress={() => setNewAlertType("BCV")}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              newAlertType === "BCV" && styles.toggleTextActive,
                            ]}
                          >
                            BCV
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            newAlertType === "BINANCE_BUY" && {
                              backgroundColor: theme.accent,
                            },
                          ]}
                          onPress={() => setNewAlertType("BINANCE_BUY")}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              newAlertType === "BINANCE_BUY" &&
                                styles.toggleTextActive,
                            ]}
                          >
                            P2P C
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            newAlertType === "BINANCE_SELL" && {
                              backgroundColor: theme.accent,
                            },
                          ]}
                          onPress={() => setNewAlertType("BINANCE_SELL")}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              newAlertType === "BINANCE_SELL" &&
                                styles.toggleTextActive,
                            ]}
                          >
                            P2P V
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.alertFormHalf}>
                      <Text
                        style={[
                          styles.alertFormLabel,
                          { color: theme.textMuted },
                        ]}
                      >
                        Condición
                      </Text>
                      <View
                        style={[
                          styles.toggleContainer,
                          { backgroundColor: theme.surface, marginBottom: 0 },
                        ]}
                      >
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            newAlertCondition === "ABOVE" && {
                              backgroundColor: theme.success,
                            },
                          ]}
                          onPress={() => setNewAlertCondition("ABOVE")}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              newAlertCondition === "ABOVE" &&
                                styles.toggleTextActive,
                            ]}
                          >
                            ▲ Arriba
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            newAlertCondition === "BELOW" && {
                              backgroundColor: '#EF4444',
                            },
                          ]}
                          onPress={() => setNewAlertCondition("BELOW")}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              newAlertCondition === "BELOW" &&
                                styles.toggleTextActive,
                            ]}
                          >
                            ▼ Abajo
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.alertInputRow}>
                    <Text
                      style={[
                        styles.alertFormLabel,
                        { color: theme.textMuted },
                      ]}
                    >
                      Umbral (Bs)
                    </Text>
                    <View
                      style={[
                        styles.flatInputWrapper,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.surface,
                          flex: 1,
                        },
                      ]}
                    >
                      <TextInput
                        style={[
                          styles.input,
                          { color: theme.textPrimary, height: 44 },
                        ]}
                        keyboardType="numeric"
                        value={newAlertThreshold}
                        onChangeText={setNewAlertThreshold}
                        placeholder="0.00"
                        placeholderTextColor={theme.textMuted}
                      />
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.alertAddButton,
                        { backgroundColor: theme.accent },
                      ]}
                      onPress={handleAddAlert}
                    >
                      <Text style={styles.alertAddButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {rateAlerts.length === 0 ? (
                  <View
                    style={[
                      styles.historyEmpty,
                      { backgroundColor: theme.surfaceAlt },
                    ]}
                  >
                    <Text style={styles.historyEmptyText}>
                      No hay alertas configuradas
                    </Text>
                  </View>
                ) : (
                  <View style={styles.alertsList}>
                    {rateAlerts.map((alert) => (
                      <View
                        key={alert.id}
                        style={[
                          styles.alertItem,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                          },
                          !alert.enabled && { opacity: 0.6 },
                        ]}
                      >
                        <View style={styles.alertItemLeft}>
                          <View style={styles.alertItemHeader}>
                            <Text
                              style={[
                                styles.alertType,
                                { color: theme.textPrimary },
                              ]}
                            >
                              {alert.type === "BCV"
                                ? "BCV"
                                : alert.type === "BINANCE_BUY"
                                ? "P2P Compra"
                                : "P2P Venta"}
                            </Text>
                            <Text
                              style={[
                                styles.alertCondition,
                                {
                                  color:
                                    alert.condition === 'ABOVE'
                                      ? theme.success
                                      : '#EF4444',
                                },
                              ]}
                            >
                              {alert.condition === "ABOVE" ? "▲" : "▼"}{' '}
                              {alert.threshold.toFixed(2)}
                            </Text>
                          </View>
                          {alert.triggeredAt && (
                            <Text
                              style={[
                                styles.alertTriggered,
                                { color: theme.textMuted },
                              ]}
                            >
                              Activada:{' '}
                              {new Date(alert.triggeredAt).toLocaleDateString(
                                'es-VE'
                              )}
                            </Text>
                          )}
                        </View>
                        <View style={styles.alertItemActions}>
                          <TouchableOpacity
                            style={[
                              styles.alertAction,
                              {
                                backgroundColor: alert.enabled
                                  ? theme.successBg
                                  : theme.surface,
                              },
                            ]}
                            onPress={() =>
                              handleToggleAlert(alert.id, !alert.enabled)
                            }
                          >
                            <Text
                              style={[
                                styles.alertActionText,
                                {
                                  color: alert.enabled
                                    ? theme.success
                                    : theme.textMuted,
                                },
                              ]}
                            >
                              {alert.enabled ? "ON" : "OFF"}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.alertAction,
                              { backgroundColor: theme.surface },
                            ]}
                            onPress={() => handleDeleteAlert(alert.id)}
                          >
                            <TrashIcon size={22} color={theme.textSecondary} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        )}

        {/* PESTAÑA 8: CONFIGURACIÓN GENERAL */}
        {currentTab === "configuracion" && (
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
                Ajustes
              </Text>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textPrimary, marginBottom: 24 },
                ]}
              >
                Configuración de la App
              </Text>

              <Text
                style={[
                  styles.label,
                  { color: theme.textSecondary, marginBottom: 8 },
                ]}
              >
                Tu Nombre de Perfil
              </Text>
              <View
                style={[
                  styles.flatInputWrapper,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                    marginBottom: 16,
                    paddingRight: 8,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.textPrimary, height: 50 },
                  ]}
                  value={nuevoNombreInput}
                  onChangeText={setNuevoNombreInput}
                  maxLength={20}
                  placeholder="Modifica tu nombre"
                  placeholderTextColor={theme.textMuted}
                />
                <TouchableOpacity
                  style={[
                    styles.inlineSaveButton,
                    { backgroundColor: theme.accent },
                  ]}
                  onPress={guardarNombrePerfil}
                >
                  <Text style={styles.inlineSaveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.label,
                  { color: theme.textSecondary, marginBottom: 8 },
                ]}
              >
                Tema Visual de la Interfaz
              </Text>
              <View
                style={[
                  styles.toggleContainer,
                  { backgroundColor: theme.surfaceAlt, marginBottom: 24 },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    themeMode === "light" && { backgroundColor: theme.accent },
                  ]}
                  onPress={() => setThemeMode("light")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      themeMode === "light" && styles.toggleTextActive,
                    ]}
                  >
                    ☀️ Claro
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    themeMode === "dark" && { backgroundColor: theme.accent },
                  ]}
                  onPress={() => setThemeMode("dark")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      themeMode === "dark" && styles.toggleTextActive,
                    ]}
                  >
                    <MoonIcon size={20} color={theme.textSecondary} /> Oscuro
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    themeMode === "system" && { backgroundColor: theme.accent },
                  ]}
                  onPress={() => setThemeMode("system")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      themeMode === "system" && styles.toggleTextActive,
                    ]}
                  >
                    ⚙️ Auto
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.quickActionDesc,
                  {
                    color: theme.textMuted,
                    textAlign: "center",
                    marginTop: 32,
                  },
                ]}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                >
                  <Text>Arco v1.0 • Hecho en Margarita</Text>
                  <BeachIcon size={20} color={theme.textMuted} />
                </View>
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <BottomTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onMorePress={() => setShowMoreMenu(true)}
        theme={theme}
      />

      <MoreMenu
        visible={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        onSelectTab={handleSelectMoreTab}
        theme={theme}
      />
    </ContainerView>
  );
}

export default function App() {
  const [nombreUsuario, setNombreUsuario] = useState<string>("Usuario");
  const [comprobandoRegistro, setComprobandoRegistro] = useState<boolean>(true);

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const nombreGuardado = await AsyncStorage.getItem("user_name");
        setNombreUsuario(nombreGuardado || "Usuario");
      } catch (e) {
        console.log(e);
        setNombreUsuario("Usuario");
      } finally {
        setComprobandoRegistro(false);
      }
    };
    cargarNombre();
  }, []);

  if (comprobandoRegistro) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <MainApp
        nombreUsuario={nombreUsuario}
        alCambiarNombre={setNombreUsuario}
      />
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
        ? RNStatusBar.currentHeight + 45
        : 50,
    paddingBottom: 160,
    flexGrow: 1,
  },
  heroCard: {
    borderRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    marginBottom: 24,
    overflow: "hidden",
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#53A548",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  heroGlow: {
    position: "absolute",
    top: -60,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#91CB3E",
    opacity: 0.18,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 34 : 30,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.6,
    lineHeight: Platform.OS === "web" ? 40 : 36,
  },
  heroSubtitle: { fontSize: 15, lineHeight: 24, maxWidth: 380 },
  heroPills: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
  heroPill: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999 },
  heroPillText: { fontSize: 12, fontWeight: "700", color: "#F3F4F6" },
  headerWithSyncRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  syncTimeText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.2 },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 14,
    marginLeft: 4,
  },
  ratesContainer: { flexDirection: "row", gap: 10, marginBottom: 18 },
  loadingBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 18,
  },
  rateBox: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    minHeight: 92,
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#53A548",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  rateLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  quickActionsGridTablet: { flexWrap: "wrap" },
  quickActionCard: {
    flex: 1,
    minWidth: "45%",
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#53A548",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  quickActionIcon: { marginBottom: 10 },
  quickActionEmoji: { fontSize: 28, marginBottom: 10 },
  quickActionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  quickActionDesc: { fontSize: 12, fontWeight: "500", lineHeight: 16 },
  tipCard: { padding: 24, borderRadius: 32, borderWidth: 1, marginBottom: 16 },
  tipTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    color: lightTheme.accent,
  },
  tipText: { fontSize: 13, lineHeight: 20, fontWeight: "500" },
  flatContainer: { paddingVertical: 8, paddingHorizontal: 4, width: "100%" },
  flatInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  inlineSaveButton: {
    paddingHorizontal: 18,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  inlineSaveButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  calculateButton: {
    width: "100%",
    height: 62,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
    elevation: 5,
    shadowColor: "#53A548",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", marginBottom: 8, marginLeft: 2 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  currencyPrefix: { fontSize: 17, fontWeight: "700", marginRight: 12 },
  input: { flex: 1, height: 58, fontSize: 18, fontWeight: "600" },
  toggleContainer: {
    flexDirection: "row",
    padding: 6,
    borderRadius: 18,
    marginBottom: 22,
    gap: 6,
  },
  toggleButton: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  toggleTextActive: { color: "#FFFFFF", fontWeight: "700" },
  diagnosisCard: {
    marginTop: 28,
    padding: 24,
    borderRadius: 28,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  diagnosisTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  diagnosisText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
    lineHeight: 24,
  },
  diagnosisAhorroContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 6,
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
    maxWidth: 380,
    alignItems: "center",
    padding: 28,
    borderRadius: 32,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    elevation: 8,
  },
  welcomeEmoji: { fontSize: 44, marginBottom: 18 },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.6,
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
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    elevation: 4,
  },
  welcomeButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  historyToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#53A548",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  historyToggleText: { fontSize: 14, fontWeight: "700" },
  historyCount: { fontSize: 12, fontWeight: "600" },
  historyList: { gap: 8, marginBottom: 12 },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  historyItemLeft: { flex: 1 },
  historyDate: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  historyConversion: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  historyRate: { fontSize: 11, fontWeight: "500" },
  historyItemActions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 8,
  },
  historyAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  historyActionText: { fontSize: 14 },
  historyDelete: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  historyDeleteText: { fontSize: 14 },
  historyClear: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  historyClearText: { fontSize: 13, fontWeight: "600" },
  historyEmpty: {
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  historyEmptyText: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  chartContainer: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 12,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: { fontSize: 12, fontWeight: "600" },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  statChange: { fontSize: 11, fontWeight: "700" },
  alertsContainer: { gap: 12, marginBottom: 12 },
  alertForm: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  alertFormRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  alertFormHalf: { flex: 1 },
  alertFormLabel: { fontSize: 11, fontWeight: "600", marginBottom: 6 },
  alertInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertAddButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  alertAddButtonText: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  alertsList: { gap: 8 },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  alertItemLeft: { flex: 1 },
  alertItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  alertType: { fontSize: 14, fontWeight: "700" },
  alertCondition: { fontSize: 13, fontWeight: "700" },
  alertTriggered: { fontSize: 11, fontWeight: "500" },
  alertItemActions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 8,
  },
  alertAction: {
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
  },
  alertActionText: { fontSize: 11, fontWeight: "700" },
  multiCurrencyCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  multiCurrencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  loadingText: { fontSize: 11, fontWeight: "600" },
  currencyBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  currencySelectorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  currencySelectorHalf: { flex: 1 },
  currencySelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  currencySelectorFlag: { fontSize: 18 },
  currencySelectorCode: { fontSize: 14, fontWeight: "700" },
  currencySelectorArrow: { fontSize: 12, color: "#64748B" },
  currencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    gap: 4,
  },
  currencyFlag: { fontSize: 14 },
  currencyCode: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  currencyCodeActive: { color: "#FFFFFF", fontWeight: "700" },
  currencyModal: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    maxHeight: 300,
    zIndex: 1001,
  },
  currencyModalTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  currencyModalList: {
    maxHeight: 200,
    marginBottom: 12,
  },
  currencyModalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 6,
    gap: 10,
  },
  currencyModalFlag: { fontSize: 20 },
  currencyModalCode: { fontSize: 14, fontWeight: "700", color: "#64748B" },
  currencyModalCodeActive: { color: "#FFFFFF", fontWeight: "700" },
  currencyModalName: { fontSize: 13, fontWeight: "500", flex: 1 },
  currencyModalClose: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  currencyModalCloseText: { fontSize: 13, fontWeight: "700" },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  swapButtonText: { fontSize: 18 },
  multiCurrencyResult: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  multiCurrencyResultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  multiCurrencyResultLabel: { fontSize: 13, fontWeight: "600" },
  multiCurrencyResultValue: { fontSize: 15, fontWeight: "700" },
  multiCurrencyResultArrow: {
    alignItems: "center",
    paddingVertical: 4,
  },
  multiCurrencyArrowText: { fontSize: 16 },
  multiCurrencyRate: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
  },
  multiCurrencyRateText: { fontSize: 11, fontWeight: "600" },
});
