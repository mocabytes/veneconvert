# Reglas del Proyecto para Agentes IA (AGENTS.md)

Especificación operativa para cualquier agente IA que asista a **Maria Serrano (`MS`)** en **veneconvert** (`arco-conversor`). Adapta `E:\Dev\AGENTS.md` al stack real del repo. Prevalece sobre comportamiento por defecto del agente.

---

## 1. Perfil y Entorno

- **Desarrolladora:** Maria Serrano (`MS`). Solo ella revisa, aprueba y pushea.
- **Repo:** `E:\dev\veneconvert`. Prohibido crear archivos fuera del repo.
- **Stack:** Expo 56 / React Native 0.85 / React 19 / TypeScript estricto (`strict: true`).
- **OS/Shell:** Windows 11 / **PowerShell exclusivamente**. Prohibida sintaxis bash (`head`, `tail`, `grep`, `&&` frágil, `cat`, `rm -rf`). Usar cmdlets o herramientas dedicadas.
- **Package manager:** `npm` (`package-lock.json`). Desviación documentada del maestro (`pnpm`): se respeta lo existente, no migrar.
- **Idioma (Modo Caveman Obligatorio):** Español conciso, directo, técnico. Cero relleno, cero preámbulos. Formato: `[cosa] [acción] [motivo]. [siguiente paso].`
- **Código:** Identificadores, tipos, funciones, tests y comentarios, rigurosamente en **inglés**.

---

## 2. Comandos Permitidos

```powershell
npm start               # dev server Expo
npm run android         # Android
npm run ios             # iOS
npm run web             # Web (Chrome)
npx tsc --noEmit        # type-check
npm run lint            # eslint (legacy .eslintrc.js, respetar formato)
npx jest --watchAll=false  # tests
```

Prohibido agregar dependencias nativas sin aprobación de MS (rompen Expo Go).

---

## 3. Arquitectura (adaptación Clean Architecture al layout real)

Capas (mapeo no negociable):

| Capa | Directorio | Reglas |
|---|---|---|
| `domain` | `src/utils` puros (`calculations`, `parseNumber`, `recomendacion`) + `src/types.ts` | Cero React, cero RN, cero AsyncStorage, cero fetch. Funciones puras. |
| `infrastructure` | `src/utils` con IO (`history`, `alerts`, `ratesHistory`, `multiCurrency`, `fetchWithTimeout`) | Única capa que toca AsyncStorage/red. |
| `application` | `src/hooks` (`useRates`, `useHistory`, `useAlerts`, `useMultiCurrency`, `useTheme`) | Orquesta IO, expone estado. No JSX. |
| `presentation` | `src/components` (+ `ui/`) y `App.tsx` | Consume hooks. **PROHIBIDO** importar IO directo (`AsyncStorage`, `fetch`) desde componentes. Lógica de cálculo vive en `domain`, no en JSX. |
| `design-system` | `src/theme` (`colors`, `tokens`) + `src/constants` | Tokens primero: prohibido hardcodear colores/espaciados/radios teniendo token. Estilos dinámicos (tema) van inline; `StyleSheet.create` solo valores estáticos (RN web crashea con referencias fuera de scope). |

Estándares ("Freddy Campos Mindset"):
1. **YAGNI radical:** nada especulativo, nada hipotético.
2. **Cero comentarios basura:** código auto-descriptivo; comentar solo lo no evidente.
3. **TS estricto:** prohibido `any`. Props y retornos tipados.
4. **RN/Expo:** `useNativeDriver` en `Platform.OS !== "web"`. Sombras vía `boxShadow` (props `shadow*` obsoletas en web), `elevation` solo Android. Sin `Platform` sin importar. Sin props inválidas de StyleSheet (`transition` no existe en RN).
5. **Sin polling propio:** el intervalo de sync vive solo en `useRates` (5 min + AppState). No duplicar timers.

---

## 4. Git: Commits Locales Sí, Push No

> [!IMPORTANT]
> El agente **SÍ** commitea localmente cuando MS lo pide o al cerrar una tarea verificada. **Push prohibido siempre** — MS revisa y pushea.

- Commits atómicos, solo archivos intencionales (`git status` + `git diff` antes; jamás secretos).
- Formato: `<TIPO>/MS/<TITULO>` — título en **inglés**, imperativo, <50 chars.
- Tipos: `FEAT`, `FIX`, `REFACTOR`, `PERF`, `TEST`, `CHORE`, `DOCS`, `ASSETS`.
- Ej: `FIX/MS/Restore navbar active indicator transform`.

---

## 5. Superpowers + Context7 (obligatorio)

1. **Skills primero:** si la tarea calza con un skill disponible, invocarlo antes de actuar.
2. **`brainstorming`:** antes de features nuevas o cambios de comportamiento.
3. **`systematic-debugging`:** ante bug/fallo — evidencia y causa raíz antes de proponer fix.
4. **TDD en `domain`/`utils`:** test rojo → mínimo → verde. Tests existentes: `src/utils/__tests__/`.
5. **`verification-before-completion`:** trío verde antes de afirmar completado (§6).
6. **Context7 MCP** (`resolve-library-id` → `query-docs`): obligatorio al consultar/configurar librerías (Expo, RN, chart-kit, etc.). Memoria histórica no vale para sintaxis de SDKs.

---

## 6. Checklist Pre-Entrega (no negociable)

```powershell
npx tsc --noEmit; npm run lint; npx jest --watchAll=false
```

Todo verde antes de afirmar "listo". Si algo falla, se reporta, no se maquilla.

---

## 7. Estado de Cumplimiento (auditado 2026-09-06)

| Regla | Estado |
|---|---|
| TS `strict: true`, 0 errores `tsc` | ✅ Cumple |
| Tests jest 75/75 | ✅ Cumple |
| ESLint legacy, 0 errores | ✅ Cumple (`no-explicit-any` no enforced — propuesto subir a error) |
| `npm` + scripts doc. | ✅ Cumple |
| Capas domain/application/presentation | ⚠️ Parcial (ver propuestos) |
| Tokens-first en estilos | ⚠️ Parcial (hardcodes residuales) |
| `boxShadow` vs `shadow*` | ✅ Cumple |
| Commits locales / push prohibido | ✅ Vigente desde este archivo |

### Cambios propuestos (planteados, NO ejecutados — MS aprueba)
1. `REFACTOR/MS/Split pure and IO utils` — separar `src/utils/pure/` (sin IO) de `src/utils/io/`; prohibir IO fuera de `io/` + hooks. Evidencia: `Onboarding.tsx` importa `AsyncStorage` directo (capa presentation tocando IO).
2. `CHORE/MS/Enforce no-explicit-any as error` — subir regla en `.eslintrc.js` y limpiar `any` residuales. Evidencia: 2× `as any` en `BottomTabs.tsx` (desaparecen con el fix del navbar pendiente).
3. `REFACTOR/MS/Remove hardcoded style values` — barrido de colores/espaciados hardcodeados a tokens. Evidencia: `LoadingScreen.tsx` hardcodea `#0B0F0E`/`#10B981` (paleta vieja, ignora tema).
4. ✅ `TEST+FEAT/MS/Rate date lookup` — `findRateByDate`/`findNearestRate`/`parseDateInput` con tests + subsección Tasas en Historial.
