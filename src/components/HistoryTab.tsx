import React, { lazy, Suspense, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { ConversionRecord } from "../utils/history";
import {
  RateHistoryPoint,
  findRateByDate,
  findNearestRate,
  parseDateInput,
} from "../utils/ratesHistory";
import { Theme } from "../theme/colors";
import { radius, spacing } from "../theme/tokens";
import ScreenHeader from "./ui/ScreenHeader";
import EmptyState from "./ui/EmptyState";
import SegmentedControl from "./ui/SegmentedControl";
import AmountInput from "./ui/AmountInput";
import PrimaryButton from "./ui/PrimaryButton";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { BookIcon, TrashIcon, TrendIcon } from "./Icons";

const SwipeableHistoryItem = lazy(
  () => import('./SwipeableHistoryItem')
);

type HistorySection = "conversiones" | "tasas";

function toLocalIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function isoToDisplay(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const label = new Date(year, month - 1, day).toLocaleDateString("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

interface HistoryTabProps {
  conversionHistory: ConversionRecord[];
  ratesHistory: RateHistoryPoint[];
  onDelete: (id: string) => void;
  onShare: (record: ConversionRecord) => void;
  onRepeat: (record: ConversionRecord) => void;
  onClearHistory: () => void;
  theme: Theme;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function HistoryTab({
  conversionHistory,
  ratesHistory,
  onDelete,
  onShare,
  onRepeat,
  onClearHistory,
  theme,
  fadeAnim,
  slideAnim,
}: HistoryTabProps) {
  const [section, setSection] = useState<HistorySection>("conversiones");
  const [dateInput, setDateInput] = useState("");
  const [searchedIso, setSearchedIso] = useState<string | null>(null);
  const [invalidInput, setInvalidInput] = useState(false);

  const runSearch = (raw: string) => {
    const iso = parseDateInput(raw);
    setInvalidInput(iso === null);
    setSearchedIso(iso);
  };

  const runShortcut = (daysBack: number) => {
    const target = new Date();
    target.setDate(target.getDate() - daysBack);
    const iso = toLocalIso(target);
    setDateInput(isoToDisplay(iso));
    setInvalidInput(false);
    setSearchedIso(iso);
  };

  const exact = searchedIso ? findRateByDate(ratesHistory, searchedIso) : null;
  const nearest =
    searchedIso && !exact ? findNearestRate(ratesHistory, searchedIso) : null;
  const shown = exact ?? nearest;
  const previous = shown
    ? ratesHistory
        .filter((point) => point.date < shown.date)
        .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null
    : null;
  const change =
    shown && previous && previous.bcv > 0
      ? ((shown.bcv - previous.bcv) / previous.bcv) * 100
      : null;
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.container}>
        <ScreenHeader
          title="Historial"
          subtitle={
            section === "tasas"
              ? "Consulta la tasa de cualquier día registrado."
              : "Toca una conversión para repetirla."
          }
          theme={theme}
          right={
            section === "conversiones" && conversionHistory.length > 0 ? (
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  {
                    backgroundColor: theme.errorBg,
                    borderColor: theme.errorBorder,
                  },
                ]}
                onPress={onClearHistory}
                accessibilityLabel="Limpiar todo el historial"
                accessibilityRole="button"
              >
                <TrashIcon size={18} color={theme.error} />
              </TouchableOpacity>
            ) : null
          }
        />

        <SegmentedControl<HistorySection>
          theme={theme}
          value={section}
          onChange={setSection}
          style={styles.segment}
          options={[
            { label: "Conversiones", value: "conversiones" },
            { label: "Tasas por fecha", value: "tasas" },
          ]}
        />

        {section === "tasas" ? (
          <View>
            <AmountInput
              label="Fecha"
              value={dateInput}
              onChangeText={(value) => {
                setDateInput(value);
                setInvalidInput(false);
              }}
              placeholder="DD/MM/AAAA"
              keyboardType="default"
              maxLength={10}
              theme={theme}
            />
            <PrimaryButton
              title="Buscar tasa"
              onPress={() => runSearch(dateInput)}
              theme={theme}
              style={styles.searchButton}
            />
            <View style={styles.shortcutsRow}>
              <PrimaryButton
                title="Ayer"
                variant="ghost"
                onPress={() => runShortcut(1)}
                theme={theme}
                style={styles.shortcut}
              />
              <PrimaryButton
                title="Hace 7 días"
                variant="ghost"
                onPress={() => runShortcut(7)}
                theme={theme}
                style={styles.shortcut}
              />
              <PrimaryButton
                title="Hace 30 días"
                variant="ghost"
                onPress={() => runShortcut(30)}
                theme={theme}
                style={styles.shortcut}
              />
            </View>

            {ratesHistory.length === 0 ? (
              <EmptyState
                icon={<TrendIcon size={26} color={theme.accent} />}
                title="Aún no hay tasas registradas"
                description="Las tasas se guardan cada día al sincronizar. Tira para refrescar."
                theme={theme}
              />
            ) : invalidInput ? (
              <Text style={[styles.errorText, { color: theme.error }]}>
                Fecha inválida. Usa el formato DD/MM/AAAA sin fechas futuras.
              </Text>
            ) : shown ? (
              <Card theme={theme} padding={spacing.lg}>
                <View style={styles.resultHeader}>
                  <Text style={[styles.resultDate, { color: theme.textPrimary }]}>
                    {formatLongDate(shown.date)}
                  </Text>
                  {change !== null && change !== 0 ? (
                    <Badge
                      label={`${change > 0 ? "▲" : "▼"} ${Math.abs(
                        change
                      ).toFixed(2)}%`}
                      tone={change > 0 ? "success" : "error"}
                      theme={theme}
                    />
                  ) : null}
                </View>
                {!exact ? (
                  <Text style={[styles.note, { color: theme.warning }]}>
                    Sin registro ese día. Dato más cercano disponible.
                  </Text>
                ) : null}
                <View style={styles.resultRow}>
                  <Text style={[styles.resultKey, { color: theme.textMuted }]}>
                    BCV
                  </Text>
                  <Text
                    style={[
                      styles.resultValue,
                      { color: theme.textPrimary },
                    ]}
                  >
                    Bs. {shown.bcv.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={[styles.resultKey, { color: theme.textMuted }]}>
                    P2P compra
                  </Text>
                  <Text
                    style={[
                      styles.resultValue,
                      { color: theme.textPrimary },
                    ]}
                  >
                    Bs. {shown.binance.toFixed(2)}
                  </Text>
                </View>
                {previous ? (
                  <Text style={[styles.caption, { color: theme.textMuted }]}>
                    Variación vs. {isoToDisplay(previous.date)}
                  </Text>
                ) : null}
              </Card>
            ) : (
              <EmptyState
                icon={<TrendIcon size={26} color={theme.accent} />}
                title="Busca la tasa de cualquier día"
                description="Escribe una fecha DD/MM/AAAA o usa un atajo."
                theme={theme}
              />
            )}
          </View>
        ) : conversionHistory.length > 0 ? (
          <View style={styles.list}>
            {conversionHistory.slice(0, 20).map((record) => (
              <Suspense
                key={record.id}
                fallback={
                  <ActivityIndicator size="small" color={theme.accent} />
                }
              >
                <SwipeableHistoryItem
                  record={record}
                  onDelete={() => onDelete(record.id)}
                  onShare={() => onShare(record)}
                  onRepeat={() => onRepeat(record)}
                  theme={theme}
                />
              </Suspense>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<BookIcon size={26} color={theme.accent} />}
            title="No hay conversiones aún"
            description="Tus conversiones aparecerán aquí al usarlas en el Conversor."
            theme={theme}
          />
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
  list: {
    gap: 10,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  segment: {
    marginBottom: spacing.lg,
  },
  searchButton: {
    marginBottom: spacing.md,
  },
  shortcutsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  shortcut: {
    flex: 1,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  resultDate: {
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
  },
  note: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  resultKey: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  caption: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
});
