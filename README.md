# ♟️ ChessSage (Mac App)

> **An offline, AI-powered desktop chess learning application designed beautifully for macOS. Also available on the web!**

### 🌐 [Play Live on the Web Here: https://Prashantkaushik957.github.io/ChessSage/](https://Prashantkaushik957.github.io/ChessSage/)

![ChessSage Preview](public/icon.png)

Are you tired of requiring an internet connection to practice high-level chess tactics, or dealing with clunky UI? **ChessSage** is a beautifully crafted Electron + React desktop application tailored specifically for Mac. Packed with an offline AI opponent powered by **Stockfish 16.1 Lite**, guided tutoring, and a massive database of premium tactical puzzles—this app has everything you need to improve your rating offline.

---

## ✨ Features

- **🎮 Seamless Offline Play**: Play fully offline against Stockfish with difficulty ranging from 400 ELO (Beginner) to 2500 ELO (Master).
- **💡 Adaptive "Sage" Tutor**: Meet Sage, your interactive chess companion. He analyzes your moves, recognizes openings (e.g. *Ruy Lopez*, *Sicilian Defense*), and provides emotional commentary when you blunder, capture, or play brilliant moves.
- **🧩 Tactical Puzzles (3,000+ Premium Set)**: Integrated 3,000+ high-quality puzzles sourced from the public Lichess dataset. Test your tactical vision. Automatically adapts to your rating streak!
- **📊 Real-time Evaluation Bar**: Visually represents who is winning powered by deep engine evaluation in real-time.
- **📚 Built-in Lessons & Openings**: Expand your repertoire with interactive guided lessons and opening theory right from the sidebar.
- **🖥️ Desktop-Class UI**: Built with modern, glass-morphism dark mode aesthetics and completely responsive window control integration for Mac (hidden title bars, smooth animations).

---

## 🛠️ Tech Stack & Architecture

This application is built using the latest web technologies packaged into a performant native app:

- **Frontend core**: React 18, Vite 5, CSS3 Variables (No heavy frameworks for pure speed)
- **State Management**: Zustand
- **Chess Engine & Logic**: `chess.js` for board logic, `react-chessboard` for SVG rendering, and `stockfish.js` loaded inside a Dedicated Web Worker to ensure UI thread never freezes.
- **Desktop Runtime**: Electron 33 & `electron-store` for persistent settings retention.
- **Packaging**: `electron-builder` optimized for macOS arm64/x64 architectures.

---

## 🚀 Getting Started (Development)

Want to run or tinker with this project locally? It's straightforward:

### Prerequisites:
- Node.js (v20+ recommended)
- npm or yarn

### Setup:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prashantkaushik957/ChessSage.git
   cd ChessSage
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   This runs the Vite server and Electron watcher concurrently.
   ```bash
   npm run dev
   ```

---

## 📦 Building for MacOS (DMG & ZIP)

Want to create an installable Application for your Mac? Build it using the following command:

```bash
npm run build:mac
```

This will run the production Vite build (`npm run build`) and use `electron-builder` to package the app into:
- An installer file: `dist/Chess Learning App-1.0.0-arm64.dmg`
- A portable ZIP: `dist/Chess Learning App-1.0.0-arm64-mac.zip`

---

## 🧠 Why build this?

Most top-tier chess tools (Chess.com, Lichess) require high bandwidth connections and browser real estate. **ChessSage** brings the elite training experience natively to your Mac environment so you can study away from distractions, on airplanes, or during remote commutes. I built this to focus intensely on self-improvement through an engine tutor.

## 📄 License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it.
