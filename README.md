# LiveSplit SNES - Speedrun Timer & Practice Suite

Aplicación de escritorio multiplataforma (macOS, Windows, Linux) para speedrunning de juegos de Super Nintendo (SNES) emulados, construida con **Tauri v2 (Rust)** y **React 19 + TypeScript + Tailwind CSS**.

Diseñada específicamente para ofrecer:
- **Alta precisión y bajo consumo de recursos**: Sin la sobrecarga de Electron, con micro-pausas mínimas para no competir con el emulador ni la transmisión.
- **Personalización visual extrema**: Soporte para fondos personalizados, opacidad graduable, efecto *backdrop blur* (acrílico/vidrio), ventanas transparentes y **Modo Chroma Key** para capturas en OBS Studio / Streamlabs.
- **Módulo de Entrenamiento para ROMs (Practice Mode)**: Cronometraje de trucos y segmentos aislados, contador de consistencia (éxitos/intentos con cálculo de %), racha de aciertos y vinculación rápida con savestates del emulador (`LOAD_STATE`).
- **Auto-Splitter para Emuladores SNES**: Conexión con protocolo WebSocket estándar de la comunidad (QUsb2snes, USB2SNES, RetroArch o modo simulación interactiva).

---

## 🚀 Requisitos Previos

- **Node.js** v18+ (recomendado Node 20 o superior).
- **Rust** y **Cargo** (instalable con `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`).

---

## 📦 Ejecución y Desarrollo

### 1. Modo Navegador / Vista Previa Rápida
Puedes probar y ajustar la interfaz directamente en el navegador con HMR:
```bash
npm run dev
```
Abre en `http://localhost:1420`.

### 2. Modo Escritorio Nativo con Tauri
Para ejecutar la ventana de escritorio con soporte de transparencia nativa, fijado en pantalla (*Always on Top*), sin bordes y control de savestates:
```bash
npm run tauri dev
```

### 3. Compilar el Ejecutable para Distribución
Para generar el instalador nativo (.app en macOS, .exe / .msi en Windows, .deb / AppImage en Linux):
```bash
npm run tauri build
```

---

## 🎮 Características Principales

### 1. Modo LiveSplit (Speedrun Completo)
- Cronómetro con precisión de centésimas de segundo y fuentes seleccionables (Digital 7-segment, Pixel 8-bit, Retro CRT, Sans).
- Indicadores Delta en tiempo real (+/- con código de colores según estés por delante o detrás de tu PB).
- Detección de **Gold Splits** (mejores segmentos históricos) con animación de confeti dorado.
- Métricas avanzadas en el pie de página: **Sum of Best (SoB)**, **Best Possible Time** y tiempo de segmento previo.
- Perfiles de juegos precargados:
  - *Super Mario World (11 Exit / Any%)*
  - *Super Metroid (Any%)*
  - *The Legend of Zelda: A Link to the Past (Any% NMG)*
  - Editor visual para crear cualquier juego, añadir splits o importar/exportar archivos JSON.

### 2. Módulo de Entrenamiento (Practice Mode)
- Accede presionando la pestaña **Entrenamiento** en la cabecera.
- **Cronómetro de Segmento / Truco**: Practica salas difíciles (ej. *Bowser Fight 2-cycle*, *Mockball*, *Hell Run*) sin alterar tus récords globales (PB).
- **Medidor de Consistencia**: Registro del porcentaje de éxito (`éxitos / intentos`), rachas de aciertos continuos y línea de tiempo de los últimos intentos.
- **Integración con Savestates**: Botón y atajo para cargar instantáneamente el savestate del slot configurado en el emulador (`LOAD_STATE`).
- **Cuaderno de Cues y Setup**: Registra notas estratégicas y puntos de referencia visuales (cues) por cada truco.

### 3. Personalización y Streaming (OBS)
- **Fondos Predefinidos**: Cyberpunk Grid, Retro Neon, Super Metroid o Minimalista.
- **Imagen de Fondo Personalizada**: Pega la URL de cualquier fondo o captura de juego.
- **Opacidad y Blur**: Deslizadores para lograr transparencias translúcidas con desenfoque sobre el juego.
- **Modo Chroma Key**: Activa fondos Verde o Magenta para capturar la ventana en OBS y remover el fondo con el filtro Chroma Key.
- **Fijar Siempre Visible**: Botón de anclaje (*Pin*) para mantener la ventana sobre el emulador en todo momento.

---

## ⌨️ Atajos de Teclado (Hotkeys)

| Acción | Atajo |
| :--- | :--- |
| **Iniciar / Split** (Modo LiveSplit) | `Espacio` |
| **Pausar / Reanudar** | `P` |
| **Reiniciar Carrera** | `R` |
| **Deshacer Split** | `Backspace` |
| **Iniciar Cronómetro de Práctica** | `Espacio` |
| **Marcar Intento Logrado (Éxito)** | `K` o `Espacio` |
| **Reinicio Rápido + Cargar Savestate** | `L` |
