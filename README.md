# Arco - Conversor de Monedas

[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](https://github.com/yourusername/veneconvert)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.85.3-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-56.0.12-purple.svg)](https://expo.dev/)

Una aplicación móvil moderna para conversión de monedas venezolanas, optimizada para tomar decisiones financieras inteligentes en tiempo real.

## 🚀 Características

### Conversión en Tiempo Real
- **Tasas BCV Oficiales**: Acceso a la tasa oficial del Banco Central de Venezuela
- **Tasas P2P Binance**: Tasas de compra y venta de USDT en Binance P2P
- **Modo Offline**: Funciona con tasas cacheadas cuando no hay conexión
- **Sincronización Automática**: Actualización de tasas en tiempo real
- **Pull-to-refresh**: Actualiza las tasas manualmente con un gesto

### Herramientas Financieras
- **Conversor Rápido**: Conversión instantánea entre VES, USD y USDT
- **Comparador Inteligente**: Analiza cuál opción de pago es más conveniente
  - Compara pagar en bolívares vs divisas
  - Considera comisiones de Binance
  - Muestra el ahorro estimado
- **Multi-moneda**: Soporte para más de 10 monedas internacionales
- **Historial de Conversiones**: Registro de todas tus conversiones
- **Alertas de Tasas**: Notificaciones cuando las tasas alcanzan umbrales personalizados
- **Gráficos de Tendencias**: Visualización de historial de tasas

### Experiencia de Usuario
- **Onboarding Guiado**: Tutorial inicial para nuevos usuarios
- **Temas Claro/Oscuro**: Adaptable a preferencias del usuario o sistema
- **Animaciones Fluidas**: Transiciones suaves y feedback háptico
- **Accesibilidad**: Soporte completo para screen readers
- **Responsive**: Optimizado para móviles y tablets
- **Multiplataforma**: Funciona en iOS, Android y Web

## 📦 Instalación

### Prerrequisitos
- Node.js >= 18.x
- npm o yarn
- Expo CLI (opcional)

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/veneconvert.git
cd veneconvert

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

### Ejecutar en Dispositivos

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🛠️ Stack Tecnológico

### Core
- **React Native 0.85.3**: Framework principal
- **Expo 56.0.19**: Plataforma de desarrollo
- **React 19.2.3**: Librería de UI
- **TypeScript 6.0.3**: Tipado estático

### UI/UX
- **React Native Reanimated 4.3.1**: Animaciones de alto rendimiento
- **React Native Gesture Handler 2.31.1**: Gestos táctiles
- **React Native Chart Kit 7.0.2**: Gráficos de tendencias
- **React Native SVG 15.15.4**: Gráficos vectoriales
- **Expo Haptics 56.0.3**: Feedback háptico nativo

### Almacenamiento
- **Async Storage 2.2.0**: Almacenamiento local persistente

### Desarrollo
- **Jest 29.7.0**: Testing
- **Detox 20.20.0**: Testing E2E
- **ESLint 8.57.0**: Linting
- **Prettier 2.8.8**: Formateo de código

## 📁 Estructura del Proyecto

```
veneconvert/
├── src/
│   ├── components/          # Componentes UI reutilizables y pestañas
│   │   ├── AlertsTab.tsx
│   │   ├── AnimatedButton.tsx
│   │   ├── BottomTabs.tsx
│   │   ├── ComparatorTab.tsx
│   │   ├── ConverterTab.tsx
│   │   ├── HistoryTab.tsx
│   │   ├── HomeTab.tsx
│   │   ├── Icons.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── MoreMenu.tsx
│   │   ├── MultiCurrencyTab.tsx
│   │   ├── Navbar.tsx
│   │   ├── Onboarding.tsx
│   │   ├── PulseAnimation.tsx
│   │   ├── SettingsTab.tsx
│   │   ├── SwipeableHistoryItem.tsx
│   │   └── TrendsTab.tsx
│   ├── constants/           # Constantes y configuraciones
│   │   └── recommendations.ts
│   ├── hooks/               # Hooks de lógica reutilizable
│   │   ├── useAlerts.ts
│   │   ├── useHistory.ts
│   │   ├── useMultiCurrency.ts
│   │   ├── useRates.ts
│   │   └── useTheme.ts
│   ├── theme/              # Temas y colores
│   │   └── colors.ts
│   ├── types.ts            # Tipos compartidos
│   └── utils/              # Funciones de utilidad
│       ├── accessibility.ts
│       ├── alerts.ts
│       ├── calculations.ts
│       ├── fetchWithTimeout.ts
│       ├── haptic.ts
│       ├── history.ts
│       ├── multiCurrency.ts
│       ├── ratesHistory.ts
│       └── responsive.ts
├── assets/                 # Imágenes y recursos
├── App.tsx                 # Componente principal (orquestador de pestañas)
├── package.json            # Dependencias
├── tsconfig.json          # Configuración TypeScript
└── eas.json               # Configuración EAS Build
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar servidor de desarrollo
npm run android        # Ejecutar en Android
npm run ios            # Ejecutar en iOS
npm run web            # Ejecutar en Web

# Testing
npm test               # Ejecutar tests unitarios
npm run test:watch     # Ejecutar tests en modo watch
npm run test:coverage  # Ejecutar tests con cobertura
npm run detox:test     # Ejecutar tests E2E
npm run detox:build    # Build para tests E2E

# Calidad de Código
npm run lint           # Ejecutar ESLint
npm run lint:fix       # Corregir problemas de linting
npm run audit          # Auditoría de seguridad
npm run audit:fix      # Corregir vulnerabilidades
```

## 🎨 Temas y Personalización

La aplicación soporta tres modos de tema:
- **Light**: Tema claro para ambientes iluminados
- **Dark**: Tema oscuro para ambientes con poca luz
- **System**: Sigue las preferencias del sistema operativo

Los colores están definidos en `src/theme/colors.ts` y pueden personalizarse fácilmente.

## 📊 Fuentes de Datos

### Tasas de Cambio
- **BCV Oficial**: API de ve.dolarapi.com
- **P2P Binance**: Calculado a partir de tasa paralelo con margen

### Caché Local
Las tasas se almacenan localmente con:
- Timestamp de última sincronización
- Validación de datos obsoletos
- Fallback a valores por defecto

## 🔒 Seguridad

- Validación de inputs en todas las conversiones
- Manejo seguro de errores en llamadas API con timeout y AbortController
- Fallback a tasas cacheadas en modo offline
- Auditoría de dependencias regular

## 🧪 Testing

### Tests Unitarios
```bash
npm test
```

### Tests E2E
```bash
npm run detox:build
npm run detox:test
```

## 📱 Build para Producción

### EAS Build (Recomendado)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build para iOS
eas build --platform ios

# Build para Android
eas build --platform android
```

### Build Local
```bash
# iOS
eas build --platform ios --local

# Android
eas build --platform android --local
```

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Tu Nombre** - *Trabajo inicial* - [Tu GitHub](https://github.com/yourusername)

## 🙏 Agradecimientos

- [Expo](https://expo.dev/) - Por el framework de desarrollo
- [React Native](https://reactnative.dev/) - Por el framework base
- [ve.dolarapi.com](https://ve.dolarapi.com/) - Por los datos de tasas de cambio

## 📞 Soporte

Si tienes algún problema o sugerencia, por favor:
1. Abre un issue en el repositorio
2. Contacta a support@arco.app

## 🗺️ Roadmap

### Versión 2.1 (Próximo)
- [ ] Widgets de inicio
- [ ] Integración con billeteras cripto
- [ ] Modo sin conexión mejorado
- [ ] Soporte para más monedas

### Versión 3.0 (Futuro)
- [ ] Sincronización entre dispositivos
- [ ] Exportación de datos
- [ ] API pública
- [ ] Versión desktop

---

**Hecho con ❤️ para Venezuela**
