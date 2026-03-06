import React, { useEffect } from 'react'
import { useGameStore, useProgressStore } from '../store/useGameStore'
import './Settings.css'

const BOARD_THEMES = [
    { id: 'classic', name: 'Classic', light: '#F0D9B5', dark: '#B58863' },
    { id: 'ocean', name: 'Ocean', light: '#DEE3E6', dark: '#788FA5' },
    { id: 'green', name: 'Forest', light: '#FFFFDD', dark: '#86A666' },
    { id: 'purple', name: 'Amethyst', light: '#E8D8F5', dark: '#7C5CBF' },
]

const DIFFICULTY_INFO = {
    1: { name: 'Beginner', elo: '~400', desc: 'Just learning the rules' },
    2: { name: 'Novice', elo: '~600', desc: 'Learning basic strategy' },
    3: { name: 'Casual', elo: '~900', desc: 'Knows the fundamentals' },
    4: { name: 'Intermediate', elo: '~1200', desc: 'Club player level' },
    5: { name: 'Advanced', elo: '~1600', desc: 'Strong tournament player' },
    6: { name: 'Expert', elo: '~2000', desc: 'Expert level' },
    7: { name: 'Master', elo: '~2500', desc: 'Grandmaster strength' },
}

export function Settings() {
    const { difficulty, setDifficulty, boardTheme, setBoardTheme, soundEnabled, setSoundEnabled } = useGameStore()
    const { userElo, updateElo, solvedPuzzleCount } = useProgressStore()

    const handleResetProgress = () => {
        if (confirm('Reset all progress? This cannot be undone.')) {
            updateElo(800)
        }
    }

    return (
        <div className="settings-page page">
            <h2 className="font-display">Settings</h2>

            {/* Difficulty */}
            <div className="settings-section card animate-fade-up">
                <h3>AI Difficulty</h3>
                <p className="text-muted text-sm">Choose how strong the AI opponent is</p>
                <div className="difficulty-grid">
                    {Object.entries(DIFFICULTY_INFO).map(([level, info]) => (
                        <div
                            key={level}
                            className={`difficulty-option ${difficulty === Number(level) ? 'difficulty-option--active' : ''}`}
                            onClick={() => setDifficulty(Number(level))}
                        >
                            <div className="diff-name">{info.name}</div>
                            <div className="diff-elo text-gold">{info.elo}</div>
                            <div className="diff-desc text-muted text-xs">{info.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Board theme */}
            <div className="settings-section card animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <h3>Board Theme</h3>
                <div className="board-themes">
                    {BOARD_THEMES.map(theme => (
                        <div
                            key={theme.id}
                            className={`board-theme-option ${boardTheme === theme.id ? 'board-theme-option--active' : ''}`}
                            onClick={() => setBoardTheme(theme.id)}
                        >
                            <div className="theme-preview">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} style={{ width: 14, height: 14, background: i % 2 === 0 ? theme.light : theme.dark }} />
                                ))}
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i + 4} style={{ width: 14, height: 14, background: i % 2 === 0 ? theme.dark : theme.light }} />
                                ))}
                            </div>
                            <span className="theme-name">{theme.name}</span>
                            {boardTheme === theme.id && <span className="theme-check">✓</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Audio */}
            <div className="settings-section card animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <h3>Audio</h3>
                <div className="settings-toggle">
                    <span>Sound Effects</span>
                    <button
                        className={`toggle-btn ${soundEnabled ? 'toggle-btn--on' : ''}`}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                        <div className="toggle-knob" />
                    </button>
                </div>
            </div>

            {/* Progress */}
            <div className="settings-section card animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <h3>Your Progress</h3>
                <div className="progress-stats">
                    <div className="progress-stat"><span>Current Rating</span><strong className="text-gold">{userElo}</strong></div>
                    <div className="progress-stat"><span>Puzzles Solved</span><strong className="text-jade">{solvedPuzzleCount}</strong></div>
                </div>
                <button className="btn btn-ghost" style={{ color: 'var(--accent-red)', borderColor: 'rgba(224,92,106,0.3)' }} onClick={handleResetProgress}>
                    Reset Progress
                </button>
            </div>
        </div>
    )
}
