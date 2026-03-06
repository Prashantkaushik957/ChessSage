# ♟ ChessSage — Offline AI Chess Learning App

A fully offline, desktop-class chess learning application for macOS. Features a Stockfish 18 AI opponent, animated tutor character ("Sage"), tactical puzzles, and a soothing professional UI.

**Zero internet required after installation.**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development mode (opens Electron window)
npm run dev

# Build standalone Mac .dmg
npm run build:mac
```

---

## ✨ Features

- **🤖 Stockfish 18 AI** — 7 difficulty levels (400–2500 ELO), runs entirely offline via WebAssembly
- **👨‍🏫 Sage Tutor** — Animated SVG wizard character with 6 emotional states and 100+ contextual commentary messages
- **🧩 Tactical Puzzles** — 200 rating-matched puzzles covering forks, pins, skewers, back-rank mates, and more
- **📚 Chess Lessons** — 6 structured lessons from board basics to endgame fundamentals
- **📊 Game Analysis** — Free-form board with Stockfish evaluation and PGN import
- **📈 Progress Tracking** — ELO rating system, puzzle streaks, lesson completion (persisted locally)
- **🎨 Soothing UI** — Jade/charcoal/gold theme with 20+ CSS animations

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Electron + React 18 |
| Bundler | Vite 5 |
| Chess Logic | chess.js |
| Chess UI | react-chessboard |
| AI Engine | Stockfish 18 (WASM, Web Worker) |
| State | Zustand + electron-store |
| Animations | CSS keyframes + Framer Motion |

---

## 📁 Project Structure

```
chess/
├── electron/          # Electron main process + preload
├── src/
│   ├── engine/        # Stockfish Web Worker + hook
│   ├── chess/         # chess.js hook + opening DB
│   ├── pages/         # 6 app pages (Home, Game, Puzzles, Lessons, Analysis, Settings)
│   ├── components/    # Tutor (Sage), Board (EvalBar, MoveList), UI (Sidebar)
│   ├── store/         # Zustand stores (game settings, progress)
│   └── assets/        # Puzzle JSON dataset
└── public/stockfish/  # Stockfish 18 WASM binary (bundled)
```

---

## 📷 Pages

| Page | Description |
|------|-------------|
| 🏠 Home | Dashboard with hero, stats, and feature cards |
| ♟ Play | Full game vs AI with difficulty, undo, color choice |
| 🧩 Puzzles | Rating-matched tactical training |
| 📚 Lessons | Structured chess tutorials |
| 📊 Analysis | Free board + Stockfish eval + PGN import |
| ⚙️ Settings | Difficulty, board theme, audio, progress reset |

---

## 📄 License

MIT
