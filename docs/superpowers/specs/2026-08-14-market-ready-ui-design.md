# Arco 2.1 — Market-Ready UI

Fecha: 2026-08-14
Estado: aprobado

## Objetivo

Pulir Arco hasta calidad de lanzamiento: sistema de espaciado consistente,
navbar única fina, bottom tabs animados, marca regenerada (arco esmeralda),
pantallas de carga/onboarding profesionales y quick wins de UX en todas las
funciones. Sin features nuevas grandes (YAGNI).

## Decisiones aprobadas

- Navbar única fina: marca en Inicio, título del tab activo en sub-tabs,
  acciones contextuales. Elimina doble header (ScreenHeader).
- Marca nueva generada por script: arco esmeralda (#10B981→#34D399) sobre
  tile #0B0F0E.
- Alcance funciones: pulido + quick wins (no features nuevas).

## F1 — Sistema de tokens

- `src/theme/tokens.ts`: `spacing` = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24,
  xxxl:32 }, `radius` = { sm:10, md:14, lg:16, xl:18, pill:999 }.
- Inyectar `spacing`/`radius` en `Theme` (mismos valores ambas paletas).
- Estandarizar: Card padding 20, radio 18, sin marginBottom interno (gap del
  padre). ScreenHeader marginBottom 24, sin paddingHorizontal. App
  paddingHorizontal 20. Barrer margenes sueltos de todos los componentes.

## F2 — Navbar única fina

- Altura 56 móvil / 60 web, ancho max 900, brand en Inicio (badge 30 + Arco),
  título del tab en sub-tabs, derecha: toggle tema (icon-only) + limpiar solo
  en conversor/comparador/multimoneda.
- Nuevo `ScreenSubtitle` (14px textMuted) para contexto donde aplique.
- Quitar ScreenHeader de Conversor, Comparador, Multi-moneda, Historial,
  Tendencias, Alertas, Ajustes. Home conserva greeting hero.
- Calibrar paddingTop del ScrollView en App.tsx a navbar 56 sin overlap.

## F3 — BottomTabs

- Píldora flotante (92% ancho móvil, max 420), bottom = insets.bottom + 12
  via useSafeAreaInsets.
- Indicador deslizante animado: onLayout mide posición x por tab, Animated
  translateX detrás del icono activo.
- Icono 22, label 12, círculo activo 40 accentSoft + acento, haptic por tab.
- Dot acento en "Más" cuando alerts activas > 0 (prop alertsCount).

## F4 — Marca + assets

- `sharp` devDep + `scripts/generate-assets.mjs`:
  - icon.png 1024 (tile oscuro + arco)
  - android-icon-foreground.png 1024 (transparente, zona segura 66%)
  - splash-icon.png 512 (transparente, marca sin tile)
  - logo.png 512 (tile, uso interno Navbar/Loading/Onboarding)
  - favicon.png 64
- app.json: backgroundColor #0B0F0E, splash backgroundColor #0B0F0E,
  adaptiveIcon backgroundColor #0B0F0E, expo-status-bar backgroundColor
  #0B0F0E. Versión 2.1.0.

## F5 — Carga / onboarding

- LoadingScreen: logo nuevo, float sutil, dots acento.
- Onboarding: reemplazar Alert.prompt por campo nombre inline en último slide
  (funciona en web) + botón Empezar.

## F6 — Pulido por pantalla

- Home: avatar inicial, chips normalizados, grid limpio.
- Conversor: fila tasas inline, botón copiar resultado (expo-clipboard).
- Comparador: recálculo claro.
- Multi-moneda: animación swap.
- Historial: confirmar limpieza, EmptyState.
- Tendencias: label período, EmptyState sin datos.
- Alertas: dot en Más, EmptyState.
- Ajustes: card Datos (borrar historial/alertas, confirmado) + Acerca de
  (versión, fuente BCV/Binance, disclaimer).
- Offline: banner global fino bajo navbar cuando modoOffline.

## F7 — Verificación

- tsc --noEmit, jest (58 verdes), lint, expo export --platform web.
- Assets regenerados deterministas.
