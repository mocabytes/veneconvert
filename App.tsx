import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
  Animated,
  Share,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync().catch(() => {});

import BottomTabs from "./src/components/BottomTabs";
import LoadingScreen from "./src/components/LoadingScreen";
import OfflineBanner from "./src/components/ui/OfflineBanner";
import Toast from "./src/components/ui/Toast";
import HomeTab from "./src/components/HomeTab";
import ConverterTab from "./src/components/ConverterTab";
import ComparatorTab from "./src/components/ComparatorTab";
import MultiCurrencyTab from "./src/components/MultiCurrencyTab";
import HistoryTab from "./src/components/HistoryTab";
import TrendsTab from "./src/components/TrendsTab";
import AlertsTab from "./src/components/AlertsTab";
import SettingsTab from "./src/components/SettingsTab";
import HubTab from "./src/components/HubTab";

const Onboarding = lazy(() => import("./src/components/Onboarding"));

import { analizarCompra } from "./src/utils/calculations";
import { ConversionRecord } from "./src/utils/history";
import { RateAlert, getAlertCurrentRate } from "./src/utils/alerts";
import { triggerHapticForAction } from "./src/utils/haptic";
import { announceForAccessibility } from "./src/utils/accessibility";
import { useContainerWidth } from "./src/utils/responsive";
import { parseNumber } from "./src/utils/parseNumber";
import { RECOMENDACIONES_FINANCIERAS } from "./src/constants/recommendations";

import { useTheme } from "./src/hooks/useTheme";
import { useRates } from "./src/hooks/useRates";
import { useHistory } from "./src/hooks/useHistory";
import { useAlerts } from "./src/hooks/useAlerts";
import { useMultiCurrency } from "./src/hooks/useMultiCurrency";
import { TabMode } from "./src/types";

function MainApp({
  nombreUsuario,
  alCambiarNombre,
}: {
  nombreUsuario: string;
  alCambiarNombre: (nuevo: string) => void;
}) {
  const { themeMode, setThemeMode, resolvedTheme, theme } = useTheme();
  const {
    tasas,
    cargandoTasas,
    modoOffline,
    ultimaSincronizacion,
    ratesHistory,
    triggeredAlerts,
    sincronizarTasas,
    clearTriggeredAlerts,
  } = useRates();
  const { conversionHistory, addConversion, remove, clearAll } = useHistory();
  const { rateAlerts, addAlert, toggleAlert, removeAlert, clearAll: clearAllAlerts } = useAlerts();
  const multiCurrency = useMultiCurrency({
    bcv: tasas.bcv,
    binanceBuy: tasas.binanceBuy,
  });

  const [currentTab, setCurrentTab] = useState<TabMode>("inicio");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [tipAleatorio, setTipAleatorio] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nuevoNombreInput, setNuevoNombreInput] =
    useState<string>(nombreUsuario);
  const [comisionBinance, setComisionBinance] = useState<number>(0.2);
  const [comisionInput, setComisionInput] = useState<string>("0.20");

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

  // Estados del formulario de alertas
  const [newAlertThreshold, setNewAlertThreshold] = useState<string>("");
  const [newAlertType, setNewAlertType] = useState<RateAlert["type"]>("BCV");
  const [newAlertCondition, setNewAlertCondition] =
    useState<RateAlert["condition"]>("ABOVE");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const containerWidth = useContainerWidth();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await sincronizarTasas();
    } catch (error) {
      console.log('Error refrescando tasas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const limpiarCampos = () => {
    setBs("");
    setUsdBcv("");
    setUsdtBinance("");
    setCompPrecioBs("");
    setCompPrecioUsdBcv("");
    setCompPrecioDivisa("");
    setMostrarDiagnostico(false);
  };

  const mostrarToast = (message: string) => {
    setToastMsg(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const buildAlertToast = (alert: RateAlert, currentRate: number) => {
    const conditionText =
      alert.condition === "ABOVE" ? "superó" : "bajó de";
    const rateName =
      alert.type === 'BCV'
        ? 'BCV'
        : alert.type === 'BINANCE_BUY'
        ? 'P2P Compra'
        : 'P2P Venta';
    return `${rateName} ${conditionText} Bs. ${alert.threshold.toFixed(
      2
    )} (actual: Bs. ${currentRate.toFixed(2)})`;
  };

  const repetirConversion = (record: ConversionRecord) => {
    triggerHapticForAction("tab");
    if (record.type === "BS_TO_USD_BCV") {
      setBs(String(record.fromAmount));
      setUsdBcv(record.toAmount.toFixed(2));
      setUsdtBinance("");
    } else if (record.type === "USD_BCV_TO_BS") {
      setUsdBcv(String(record.fromAmount));
      setBs(record.toAmount.toFixed(2));
      setUsdtBinance("");
    } else if (record.type === "USDT_TO_BS") {
      setUsdtBinance(String(record.fromAmount));
      setBs(record.toAmount.toFixed(2));
      setUsdBcv("");
    } else {
      setBs("");
      setUsdBcv("");
      setUsdtBinance("");
    }
    setCurrentTab("conversor");
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

  const guardarComision = async () => {
    const num = parseNumber(comisionInput);
    if (isNaN(num) || num < 0 || num >= 100) {
      return;
    }
    setComisionBinance(num);
    try {
      await AsyncStorage.setItem('comision_binance', String(num));
    } catch (error) {
      console.log('Error guardando la comisión:', error);
    }
    alert('Comisión de Binance actualizada');
  };

  const handleDeleteConversion = async (id: string) => {
    triggerHapticForAction("delete");
    await remove(id);
    announceForAccessibility("Conversión eliminada");
  };

  const handleClearHistory = async () => {
    if (conversionHistory.length === 0) {
      return;
    }
    Alert.alert(
      "Limpiar historial",
      "Se borrarán todas las conversiones guardadas. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpiar",
          style: "destructive",
          onPress: async () => {
            triggerHapticForAction("delete");
            await clearAll();
            announceForAccessibility("Historial limpiado");
          },
        },
      ]
    );
  };

  const handleClearAlerts = async () => {
    if (rateAlerts.length === 0) {
      return;
    }
    Alert.alert(
      "Borrar alertas",
      "Se eliminarán todas las alertas configuradas. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            triggerHapticForAction("delete");
            await clearAllAlerts();
            announceForAccessibility("Alertas borradas");
          },
        },
      ]
    );
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

  const handleAddAlert = async () => {
    const threshold = parseNumber(newAlertThreshold);
    if (isNaN(threshold) || threshold <= 0) {
      return;
    }
    await addAlert({
      type: newAlertType,
      condition: newAlertCondition,
      threshold,
      enabled: true,
    });
    setNewAlertThreshold("");
  };

  const handleToggleAlert = (id: string, enabled: boolean) => {
    toggleAlert(id, enabled);
  };

  const handleDeleteAlert = (id: string) => {
    removeAlert(id);
  };

  // Toast de alertas disparadas tras cada sincronización
  useEffect(() => {
    if (triggeredAlerts.length === 0) {
      return;
    }
    const first = triggeredAlerts[0];
    const currentRate = getAlertCurrentRate(first, tasas);
    if (currentRate !== null) {
      const extra =
        triggeredAlerts.length > 1
          ? ` (+${triggeredAlerts.length - 1} alerta${
              triggeredAlerts.length - 1 > 1 ? "s" : ""
            } más)`
          : "";
      mostrarToast(`Alerta: ${buildAlertToast(first, currentRate)}${extra}`);
      announceForAccessibility(
        `${buildAlertToast(first, currentRate)}${extra}`
      );
    }
    clearTriggeredAlerts();
  }, [triggeredAlerts, tasas, clearTriggeredAlerts]);

  // Onboarding inicial
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(
          'onboarding_completed'
        );
        if (!onboardingCompleted) {
          setShowOnboarding(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const loadComision = async () => {
      try {
        const saved = await AsyncStorage.getItem('comision_binance');
        if (saved !== null) {
          const num = parseNumber(saved);
          if (!isNaN(num) && num >= 0) {
            setComisionBinance(num);
            setComisionInput(String(num));
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkOnboarding();
    loadComision();
  }, []);

  // Tip del día + animación de transición entre pestañas
  useEffect(() => {
    if (currentTab === "inicio" || currentTab === "herramientas") {
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
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [currentTab, resolvedTheme]);

  // Manejadores del Conversor (el historial se guarda al finalizar la edición)
  const handleBsChange = (value: string) => {
    triggerHapticForAction("input");
    setBs(value);
    if (value === "" || tasas.bcv === 0 || tasas.binanceBuy === 0) {
      setUsdBcv("");
      setUsdtBinance("");
      return;
    }
    const numBs = parseNumber(value) || 0;
    setUsdBcv((numBs / tasas.bcv).toFixed(2));
    setUsdtBinance((numBs / tasas.binanceBuy).toFixed(2));
  };

  const handleBsEnd = async () => {
    const numBs = parseNumber(bs) || 0;
    if (numBs > 0 && tasas.bcv > 0) {
      await addConversion({
        type: "BS_TO_USD_BCV",
        fromAmount: numBs,
        fromCurrency: "VES",
        toAmount: parseNumber(usdBcv) || 0,
        toCurrency: "USD",
        rateUsed: tasas.bcv,
        rateType: "BCV",
      });
    }
  };

  const handleBcvChange = (value: string) => {
    triggerHapticForAction("input");
    setUsdBcv(value);
    if (value === "" || tasas.bcv === 0 || tasas.binanceBuy === 0) {
      setBs("");
      setUsdtBinance("");
      return;
    }
    const numUsd = parseNumber(value) || 0;
    const equivalenteBs = numUsd * tasas.bcv;
    setBs(equivalenteBs.toFixed(2));
    setUsdtBinance((equivalenteBs / tasas.binanceBuy).toFixed(2));
  };

  const handleBcvEnd = async () => {
    const numUsd = parseNumber(usdBcv) || 0;
    if (numUsd > 0 && tasas.bcv > 0) {
      await addConversion({
        type: "USD_BCV_TO_BS",
        fromAmount: numUsd,
        fromCurrency: "USD",
        toAmount: parseNumber(bs) || 0,
        toCurrency: "VES",
        rateUsed: tasas.bcv,
        rateType: "BCV",
      });
    }
  };

  const handleBinanceChange = (value: string) => {
    triggerHapticForAction("input");
    setUsdtBinance(value);
    if (value === "" || tasas.bcv === 0 || tasas.binanceSell === 0) {
      setBs("");
      setUsdBcv("");
      return;
    }
    const numUsdt = parseNumber(value) || 0;
    const equivalenteBs = numUsdt * tasas.binanceSell;
    setBs(equivalenteBs.toFixed(2));
    setUsdBcv((equivalenteBs / tasas.bcv).toFixed(2));
  };

  const handleBinanceEnd = async () => {
    const numUsdt = parseNumber(usdtBinance) || 0;
    if (numUsdt > 0 && tasas.binanceSell > 0) {
      await addConversion({
        type: "USDT_TO_BS",
        fromAmount: numUsdt,
        fromCurrency: "USDT",
        toAmount: parseNumber(bs) || 0,
        toCurrency: "VES",
        rateUsed: tasas.binanceSell,
        rateType: "BINANCE_SELL",
      });
    }
  };

  // Manejadores del Comparador
  const handleCompBsChange = (value: string) => {
    setMostrarDiagnostico(false);
    setCompPrecioBs(value);
    if (value === "" || tasas.bcv === 0) {
      setCompPrecioUsdBcv("");
      return;
    }
    setCompPrecioUsdBcv((parseNumber(value) / tasas.bcv).toFixed(2));
  };

  const handleCompUsdBcvChange = (value: string) => {
    setMostrarDiagnostico(false);
    setCompPrecioUsdBcv(value);
    if (value === "" || tasas.bcv === 0) {
      setCompPrecioBs("");
      return;
    }
    setCompPrecioBs((parseNumber(value) * tasas.bcv).toFixed(2));
  };

  const resultadoComparador = analizarCompra(
    monedaOrigen,
    parseNumber(compPrecioBs) || 0,
    parseNumber(compPrecioDivisa) || 0,
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

  const ContainerView = Platform.OS === "web" ? View : SafeAreaView;

  if (showOnboarding) {
    return (
      <Suspense
        fallback={<ActivityIndicator size="large" color={theme.accent} />}
      >
        <Onboarding
          onComplete={() => setShowOnboarding(false)}
          theme={theme}
          resolvedTheme={resolvedTheme}
        />
      </Suspense>
    );
  }

  return (
    <ContainerView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
            colors={[theme.accent]}
          />
        }
        contentContainerStyle={[
          styles.scrollContainer,
          { maxWidth: containerWidth, width: "100%", alignSelf: "center" },
        ]}
      >
        {modoOffline ? (
          <OfflineBanner
            theme={theme}
            onRetry={onRefresh}
            retrying={refreshing}
          />
        ) : null}

        {currentTab === "inicio" && (
          <HomeTab
            nombreUsuario={nombreUsuario}
            tasas={tasas}
            cargandoTasas={cargandoTasas}
            ultimaSincronizacion={ultimaSincronizacion}
            ratesHistory={ratesHistory}
            onNavigateToTab={setCurrentTab}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "herramientas" && (
          <HubTab
            historialCount={conversionHistory.length}
            alertsCount={rateAlerts.length}
            tipAleatorio={tipAleatorio}
            onNavigateToTab={setCurrentTab}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "conversor" && (
          <ConverterTab
            bs={bs}
            usdBcv={usdBcv}
            usdtBinance={usdtBinance}
            tasas={tasas}
            onBsChange={handleBsChange}
            onBsEnd={handleBsEnd}
            onBcvChange={handleBcvChange}
            onBcvEnd={handleBcvEnd}
            onBinanceChange={handleBinanceChange}
            onBinanceEnd={handleBinanceEnd}
            onClear={limpiarCampos}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "comparador" && (
          <ComparatorTab
            monedaOrigen={monedaOrigen}
            compPrecioBs={compPrecioBs}
            compPrecioUsdBcv={compPrecioUsdBcv}
            compPrecioDivisa={compPrecioDivisa}
            mostrarDiagnostico={mostrarDiagnostico}
            resultadoComparador={resultadoComparador}
            tasas={tasas}
            onMonedaOrigenChange={setMonedaOrigen}
            onCompPrecioBsChange={handleCompBsChange}
            onCompPrecioUsdBcvChange={handleCompUsdBcvChange}
            onCompPrecioDivisaChange={(value) => {
              setMostrarDiagnostico(false);
              setCompPrecioDivisa(value);
            }}
            onEjecutarAnalisis={ejecutarAnalisis}
            onClear={limpiarCampos}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "multimoneda" && (
          <MultiCurrencyTab
            selectedFromCurrency={multiCurrency.selectedFromCurrency}
            selectedToCurrency={multiCurrency.selectedToCurrency}
            multiCurrencyAmount={multiCurrency.multiCurrencyAmount}
            multiCurrencyResult={multiCurrency.multiCurrencyResult}
            showFromCurrencySelector={multiCurrency.showFromCurrencySelector}
            showToCurrencySelector={multiCurrency.showToCurrencySelector}
            onSelectFromCurrency={multiCurrency.setSelectedFromCurrency}
            onSelectToCurrency={multiCurrency.setSelectedToCurrency}
            setShowFromCurrencySelector={
              multiCurrency.setShowFromCurrencySelector
            }
            setShowToCurrencySelector={multiCurrency.setShowToCurrencySelector}
            setMultiCurrencyAmount={multiCurrency.setMultiCurrencyAmount}
            onSwap={multiCurrency.swap}
            onConvert={multiCurrency.convert}
            onClear={multiCurrency.clear}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "historial" && (
          <HistoryTab
            conversionHistory={conversionHistory}
            ratesHistory={ratesHistory}
            onDelete={handleDeleteConversion}
            onShare={handleShareConversion}
            onRepeat={repetirConversion}
            onClearHistory={handleClearHistory}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "tendencias" && (
          <TrendsTab
            ratesHistory={ratesHistory}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "alertas" && (
          <AlertsTab
            rateAlerts={rateAlerts}
            newAlertType={newAlertType}
            newAlertCondition={newAlertCondition}
            newAlertThreshold={newAlertThreshold}
            onSetNewAlertType={setNewAlertType}
            onSetNewAlertCondition={setNewAlertCondition}
            onSetNewAlertThreshold={setNewAlertThreshold}
            onAddAlert={handleAddAlert}
            onToggleAlert={handleToggleAlert}
            onDeleteAlert={handleDeleteAlert}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}

        {currentTab === "configuracion" && (
          <SettingsTab
            nuevoNombreInput={nuevoNombreInput}
            themeMode={themeMode}
            comisionInput={comisionInput}
            historialCount={conversionHistory.length}
            alertsCount={rateAlerts.length}
            onNuevoNombreChange={setNuevoNombreInput}
            onGuardarNombre={guardarNombrePerfil}
            onComisionChange={setComisionInput}
            onGuardarComision={guardarComision}
            onSetThemeMode={setThemeMode}
            onClearHistory={handleClearHistory}
            onClearAlerts={handleClearAlerts}
            theme={theme}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}
      </ScrollView>

      <BottomTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        alertsCount={rateAlerts.filter((a) => a.enabled).length}
        theme={theme}
      />

      <Toast message={toastMsg} theme={theme} />
    </ContainerView>
  );
}

export default function App() {
  const [nombreUsuario, setNombreUsuario] = useState<string>("Usuario");
  const [comprobandoRegistro, setComprobandoRegistro] = useState<boolean>(true);
  const splashHidden = useRef(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

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

  useEffect(() => {
    if (fontError) {
      console.warn("Fonts failed to load, using system font:", fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (!comprobandoRegistro && (fontsLoaded || fontError) && !splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [comprobandoRegistro, fontsLoaded, fontError]);

  if (comprobandoRegistro || (!fontsLoaded && !fontError)) {
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
    flexGrow: 1,
  },
});
