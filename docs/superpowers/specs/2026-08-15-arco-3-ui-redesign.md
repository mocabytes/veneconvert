# Arco 3.0 — Rediseño de interfaz (UI Redesign)

**Fecha:** 2026-08-15
**Estado:** Aprobado por el usuario (decisiones vía pregunta)
**Clasificación:** Arquitectónico (navegación + sistema de diseño + features)

## Objetivo

Resolver la sensación de interfaz "desfasada": rediseñar BottomTabs, unificar el
sistema de diseño, centralizar las funciones en un Hub (eliminar el botón "Más"),
reducir padding y mejorar legibilidad, corregir el autoFocus del Comparador y sumar
mejoras de producto.

## Decisiones tomadas

1. **IA de navegación:** `Inicio | Conversor | Comparador | Herramientas`.
   El Hub (Herramientas) reemplaza al menú "Más" y reúne: Multi-moneda, Alertas,
   Tendencias, Historial y Ajustes.
2. **BottomTabs:** barra fija full-width translúcida, píldora accent animada en el
   tab activo, hover-follow en web, dot de alertas.
3. **Home limpio:** tasas + chips + compartir. El grid "Herramientas" y el tip
   migran al Hub.
4. **Features (todas aprobadas):**
   - Auto-refresh de tasas cada 5 min + "actualizado hace X" + reintentar offline.
   - Compartir tasas desde Home.
   - Historial: tocar un registro lo carga en el Conversor ("repetir").
   - Comparador: tira de tasas BCV/P2P de contexto.
   - Alerta → toast in-app (sin `Alert.alert` intrusivo; y arregla el re-alerta
     al cambiar tasas consumiendo `triggeredAlerts`).
   - PWA web instalable (config `app.json`).

## Sistema de diseño

- `src/theme/tokens.ts`: `radius` = `{ xs: 8, sm: 12, md: 16, lg: 20, pill: 999 }`,
  `type` con roles (display 36/44, title 22/28, heading 18/24, body 14/21,
  caption 12/18, micro 11/16), `layout` = `{ screenGutter: 16, cardGap: 12,
  sectionGap: 20, contentBottom: 140 }`.
- `src/theme/colors.ts`: `textMuted` dark `#6B7A74` → `#7C8B85`.
- **Nuevo `src/components/ui/ScreenHeader.tsx`**: título + subtítulo + slot derecho.
  Reemplaza `ScreenSubtitle` en todos los tabs. `ScreenSubtitle.tsx` se borra.
- Normalizar `Card, AmountInput, PrimaryButton, StatCard, SegmentedControl,
  ClearButton, OfflineBanner, EmptyState` a los tokens (radios 8/12/16/20, menos
  padding).
- **Nuevo `src/components/ui/Toast.tsx`**: toast animado sobre la barra de tabs.

## Navegación

- `src/types.ts`: `TabMode` += `'herramientas'`.
- **Nuevo `src/components/HubTab.tsx`**: título "Herramientas", grid de 6 tools
  (Comparador, Multi-moneda, Alertas con dot, Tendencias, Historial con contador,
  Ajustes) + tip del día.
- `src/components/MoreMenu.tsx` se elimina (y su lazy import en App).
- `src/components/BottomTabs.tsx`: reescritura a barra full-width translúcida con
  píldora animada medida por botón, hover-follow web, dot de alertas.

## Features

- `src/hooks/useRates.ts`: `setInterval` 5 min + `AppState` resume +
  `clearTriggeredAlerts` (consume alertas disparadas para evitar re-alerta).
- `src/utils/time.ts` (nuevo): `formatRelativeTime(iso, now?)` → "ahora",
  "hace X min", "hace X h", "hace X d". Con tests.
- Home: share (RN `Share`) con tasas BCV/P2P + hora; "actualizado hace X";
  se quita Badge "En vivo" y el grid de herramientas.
- Historial: `onRepeat` → App carga montos en Conversor según `record.type`
  (BS_TO_USD_BCV, USD_BCV_TO_BS, USDT_TO_BS).
- Comparador: eliminar `autoFocus` (`ComparatorTab.tsx:124`); recibir `tasas`
  y mostrar tira BCV/P2P.
- Trends: ancho del chart por `onLayout` del contenedor (no window).
- Iconos nuevos en `Icons.tsx`: `CloseIcon`, `PlusIcon`, `ShareIcon`, `GridIcon`.
  Fuera los glyphs "✕" y "+".
- `app.json`: sección `web` con name/shortName/themeColor/backgroundColor/standalone.

## Archivos

~25: tokens, colors, 10 ui/* (ScreenHeader, Toast nuevos), Icons, BottomTabs,
HubTab (nuevo), 8 tabs, MoreMenu (borrado), App, types, useRates, time (nuevo),
app.json, tests.

## Verificación

`npx tsc --noEmit`, `npm test` (58 + nuevos), `npx eslint .`, `expo export --platform web`.
