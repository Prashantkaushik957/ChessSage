import React, { useEffect } from 'react'
import { SageCharacter } from '../components/Tutor/SageCharacter'
import { SpeechBubble } from '../components/Tutor/SpeechBubble'
import { useProgressStore } from '../store/useGameStore'
import './Home.css'

const FEATURE_CARDS = [
    { icon: '♟', title: 'Play vs AI', desc: '7 difficulty levels from complete beginner to master-level AI.', page: 'game', cta: 'Play Now' },
    { icon: '🧩', title: 'Puzzles', desc: '1000+ tactical puzzles to sharpen your chess vision.', page: 'puzzles', cta: 'Solve Puzzles' },
    { icon: '📚', title: 'Lessons', desc: 'Learn the fundamentals from Sage, your animated chess tutor.', page: 'lessons', cta: 'Start Learning' },
    { icon: '📊', title: 'Analysis', desc: 'Review your games with Stockfish engine insights.', page: 'analysis', cta: 'Analyse Games' },
]

export function Home({ onNavigate }) {
    const [showBubble, setShowBubble] = React.useState(false)
    const { userElo, solvedPuzzleCount } = useProgressStore()

    useEffect(() => {
        const t = setTimeout(() => setShowBubble(true), 800)
        return () => clearTimeout(t)
    }, [])

    return (
        <div className="home-page page animate-fade-in">
            {/* Hero Banner */}
            <div className="home-hero">
                <div className="home-hero__text">
                    <p className="home-hero__subtitle text-jade">Your Personal Chess Coach</p>
                    <h1 className="home-hero__title font-display">Welcome to<br />ChessSage</h1>
                    <p className="home-hero__desc">
                        Learn chess with Sage — your animated AI tutor. Play offline, solve puzzles,
                        and improve your game with real Stockfish engine analysis. No internet required.
                    </p>
                    <div className="home-hero__ctas">
                        <button className="btn btn-primary btn-lg" onClick={() => onNavigate('game')}>
                            ♟ Start Playing
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('lessons')}>
                            📚 Learn Chess
                        </button>
                    </div>
                </div>

                {/* Sage character in hero */}
                <div className="home-hero__sage">
                    <div className="sage-hero-glow" />
                    <div className="relative">
                        <SageCharacter state="welcome" size={160} />
                        <SpeechBubble
                            message="Hello! I'm Sage, your chess guide. Ready to learn and play?"
                            visible={showBubble}
                            side="left"
                        />
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="home-stats">
                <div className="home-stat-card">
                    <span className="home-stat-value text-gold font-display">{userElo}</span>
                    <span className="home-stat-label">Your Rating</span>
                </div>
                <div className="home-stat-card">
                    <span className="home-stat-value text-jade font-display">{solvedPuzzleCount}</span>
                    <span className="home-stat-label">Puzzles Solved</span>
                </div>
                <div className="home-stat-card">
                    <span className="home-stat-value text-jade font-display">7</span>
                    <span className="home-stat-label">AI Difficulty Levels</span>
                </div>
                <div className="home-stat-card">
                    <span className="home-stat-value text-jade font-display">100%</span>
                    <span className="home-stat-label">Offline</span>
                </div>
            </div>

            {/* Feature cards */}
            <div className="home-features">
                {FEATURE_CARDS.map((card, i) => (
                    <div
                        key={card.page}
                        className="home-feature-card card"
                        style={{ animationDelay: `${i * 0.08}s` }}
                        onClick={() => onNavigate(card.page)}
                    >
                        <div className="feature-icon">{card.icon}</div>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                        <button className="btn btn-ghost feature-cta">{card.cta} →</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
