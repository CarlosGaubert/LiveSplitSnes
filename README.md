# ⏱️ LiveSplit SNES — Speedrun Timer & Practice Suite

[![Release Builds](https://github.com/CarlosGaubert/LiveSplitSnes/actions/workflows/build.yml/badge.svg)](https://github.com/CarlosGaubert/LiveSplitSnes/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tauri](https://img.shields.io/badge/Tauri-v2-blue.svg?logo=tauri)](https://v2.tauri.app/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/CarlosGaubert/LiveSplitSnes/releases)

A modern, high-precision, cross-platform desktop speedrun timer and practice suite tailored for emulated Super Nintendo (SNES) games, built with **Tauri v2 (Rust)** and **React 19 + TypeScript + Tailwind CSS**.

Designed from the ground up to eliminate Electron bloatware, ensure microsecond timing accuracy, provide an integrated **Practice Mode** with consistency tracking, and deliver full visual customizability for streaming in OBS Studio.

---

## ✨ Features

### 🏁 1. Core LiveSplit Timer
- **Sub-centisecond Precision**: Ultra-smooth rendering without garbage collection jitter.
- **Custom Fonts**: Choose between *Digital 7-Segment*, *8-Bit Pixel*, *Vintage CRT (VT323)*, and *Modern Clean Sans*.
- **Real-time Delta Indicators**: Color-coded (+/-) deltas comparing current pace against Personal Best (PB).
- **Gold Split Detection**: Celebratory gold particle animations when beating your all-time best segment time.
- **Advanced Run Statistics**:
  - **Sum of Best (SoB)**: Your theoretical fastest possible run.
  - **Best Possible Time**: Dynamic projected finish based on your current run and remaining best segments.
  - **Previous Segment Comparison**: Instant feedback on the segment just completed.
- **Preconfigured Game Profiles**:
  - *Super Mario World* (11 Exit / Any%)
  - *Super Metroid* (Any%)
  - *The Legend of Zelda: A Link to the Past* (Any% No Major Glitches)
  - Full in-app editor to create games, add splits, or import/export JSON splits.

---

### 🎯 2. ROM Practice Mode (Trick & Segment Training)
Practice isolated rooms, bosses, or difficult tricks without affecting your main PB run:
- **Dedicated Segment Stopwatch**: Time individual tricks (e.g., *Bowser Fight 2-Cycle*, *Mockball*, *Hell Run*).
- **Consistency Tracker**: Real-time success rate calculation (`Successes / Total Attempts %`).
- **Streak Counter & Timeline**: Track consecutive successful attempts and view your last 20 attempts with visual success/fail badges.
- **Savestate Trigger Integration**: One-click and hotkey (`L`) instant savestate reloading (`LOAD_STATE`) in your emulator.
- **Visual Cue Notebook**: Save strategies, pixel alignments, and frame cues for each practice segment.

---

### 🎨 3. Visual Customization & OBS Overlay Mode
- **Custom Backgrounds**: Select from curated themes (*Cyberpunk Grid*, *Retro Arcade*, *Super Metroid*, *Minimal Dark*) or load any custom image URL.
- **Opacity & Backdrop Blur**: Adjustable background opacity (10%–100%) with acrylic/frosted glass blur.
- **Chroma Key Mode**: Green Screen (`#00ff00`) or Magenta (`#ff00ff`) background mode for clean transparency capture in OBS Studio / Streamlabs.
- **Frameless & Always-on-Top**: Borderless floating window that stays pinned above your emulator with a dedicated drag grip.

---

### 🔌 4. SNES Auto-Splitter Connectivity
- Connects via WebSocket to standard speedrun emulator interfaces:
  - **QUsb2snes / USB2SNES** (Default port `8080` for Snes9x, BizHawk, or flashcarts like FXPAK Pro).
  - **RetroArch Network Interface** (UDP/WebSocket port `55355`).
- **Interactive RAM Simulator Sandbox**: Test auto-split triggers (Game Start, Level Clear, Console Reset) directly inside the app without needing an emulator open.

---

## ⌨️ Global Hotkeys

| Action | Hotkey |
| :--- | :--- |
| **Start / Split** (LiveSplit Mode) | `Space` |
| **Pause / Resume** | `P` |
| **Reset Run** | `R` |
| **Undo Split** | `Backspace` |
| **Start Practice Timer** | `Space` |
| **Mark Practice Success** | `K` or `Space` |
| **Quick Reset + Reload Savestate** | `L` |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (Node 20+ recommended)
- **Rust & Cargo** ([Install Rust](https://www.rust-lang.org/tools/install))

### Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/CarlosGaubert/LiveSplitSnes.git
cd LiveSplitSnes
npm install
```

### Running in Development

```bash
# Run web preview in browser (with fast HMR at http://localhost:1420)
npm run dev

# Run full native desktop app with Tauri (transparency & floating window)
npm run tauri dev
```

### Building for Production

Compile standalone native installers for your current operating system:
```bash
npm run tauri build
```
The output installers will be generated under `src-tauri/target/release/bundle/`:
- **macOS**: `.dmg` and `.app`
- **Windows**: `.exe` (NSIS) and `.msi`
- **Linux**: `.deb` and `.AppImage`

---

## 🏗️ Tech Stack

- **Desktop Framework**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **CI / CD**: GitHub Actions with multiplatform matrix builds (macOS Apple Silicon, Linux, Windows)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
