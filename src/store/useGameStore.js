import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
    // Settings
    difficulty: 2,
    boardTheme: 'classic',
    pieceTheme: 'classic',
    soundEnabled: true,
    playerColor: 'w',

    // Game state
    gameMode: null, // 'vsAI' | 'puzzle' | 'analysis'
    isGameActive: false,

    // Load from electron-store on startup
    loadSettings: async () => {
        if (window.electronAPI) {
            const diff = await window.electronAPI.store.get('preferredDifficulty')
            const board = await window.electronAPI.store.get('boardTheme')
            const piece = await window.electronAPI.store.get('pieceTheme')
            const sound = await window.electronAPI.store.get('soundEnabled')
            set({
                difficulty: diff || 2,
                boardTheme: board || 'classic',
                pieceTheme: piece || 'classic',
                soundEnabled: sound !== undefined ? sound : true,
            })
        }
    },

    setDifficulty: (level) => {
        set({ difficulty: level })
        if (window.electronAPI) window.electronAPI.store.set('preferredDifficulty', level)
    },

    setBoardTheme: (theme) => {
        set({ boardTheme: theme })
        if (window.electronAPI) window.electronAPI.store.set('boardTheme', theme)
    },

    setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled })
        if (window.electronAPI) window.electronAPI.store.set('soundEnabled', enabled)
    },

    setPlayerColor: (color) => set({ playerColor: color }),
    setGameMode: (mode) => set({ gameMode: mode }),
    setIsGameActive: (active) => set({ isGameActive: active }),
}))

export const useProgressStore = create((set, get) => ({
    userElo: 800,
    solvedPuzzleCount: 0,
    completedPuzzles: [],
    lessonsCompleted: [],

    loadProgress: async () => {
        if (window.electronAPI) {
            const elo = await window.electronAPI.store.get('userElo')
            const count = await window.electronAPI.store.get('solvedPuzzleCount')
            const puzzles = await window.electronAPI.store.get('completedPuzzles')
            const lessons = await window.electronAPI.store.get('lessonsCompleted')
            set({
                userElo: elo || 800,
                solvedPuzzleCount: count || 0,
                completedPuzzles: puzzles || [],
                lessonsCompleted: lessons || [],
            })
        }
    },

    updateElo: (newElo) => {
        set({ userElo: newElo })
        if (window.electronAPI) window.electronAPI.store.set('userElo', newElo)
    },

    solvePuzzle: (puzzleId, success) => {
        const { userElo, solvedPuzzleCount, completedPuzzles } = get()
        const newPuzzles = success ? [...completedPuzzles, puzzleId] : completedPuzzles
        const newElo = success ? Math.min(3000, userElo + 15) : Math.max(400, userElo - 8)
        const newCount = success ? solvedPuzzleCount + 1 : solvedPuzzleCount

        set({ userElo: newElo, solvedPuzzleCount: newCount, completedPuzzles: newPuzzles })
        if (window.electronAPI) {
            window.electronAPI.store.set('userElo', newElo)
            window.electronAPI.store.set('solvedPuzzleCount', newCount)
            window.electronAPI.store.set('completedPuzzles', newPuzzles)
        }
    },

    completeLesson: (lessonId) => {
        const { lessonsCompleted } = get()
        if (lessonsCompleted.includes(lessonId)) return
        const newLessons = [...lessonsCompleted, lessonId]
        set({ lessonsCompleted: newLessons })
        if (window.electronAPI) window.electronAPI.store.set('lessonsCompleted', newLessons)
    },
}))
