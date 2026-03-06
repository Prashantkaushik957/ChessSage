import React from 'react'
import { SageCharacter } from '../components/Tutor/SageCharacter'
import { useProgressStore } from '../store/useGameStore'
import './Lessons.css'

const LESSONS = [
    { id: 'board-basics', icon: '♟', title: 'The Chess Board', desc: 'Learn about ranks, files, and how the board is set up.', difficulty: 'Beginner', topics: ['Ranks & files', '64 squares', 'Board orientation'] },
    { id: 'piece-movement', icon: '♞', title: 'How Pieces Move', desc: 'Master how each of the 6 chess pieces moves.', difficulty: 'Beginner', topics: ['Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'] },
    { id: 'special-moves', icon: '♔', title: 'Special Moves', desc: 'Castling, en passant, and pawn promotion explained.', difficulty: 'Beginner', topics: ['Castling', 'En passant', 'Promotion'] },
    { id: 'opening-principles', icon: '📖', title: 'Opening Principles', desc: 'The 3 golden rules for a strong chess opening.', difficulty: 'Intermediate', topics: ['Control the center', 'Develop pieces', 'King safety'] },
    { id: 'tactics-intro', icon: '⚔️', title: 'Tactics: Forks & Pins', desc: 'Learn the most common tactical patterns.', difficulty: 'Intermediate', topics: ['Fork', 'Pin', 'Skewer', 'Discovered attack'] },
    { id: 'endgame-basics', icon: '♛', title: 'Endgame Fundamentals', desc: 'King + Pawn endings and basic checkmates.', difficulty: 'Advanced', topics: ['King & Pawn', 'King & Rook', 'Opposition'] },
]

const LESSON_CONTENT = {
    'board-basics': `
🏁 **The Chess Board**

The board has 64 squares (8×8) alternating in two colors.
- **Files** run vertically, labeled a–h from left to right
- **Ranks** run horizontally, labeled 1–8 from bottom to top  
- Each square has a unique name (e.g., e4, d5, g7)

**Setup**: White pieces start on ranks 1-2, Black on ranks 7-8.
White's queen goes on d1 (light square), Black's queen on d8 (dark square).
Remember: "Queen on her own color" 👑
  `,
    'piece-movement': `
♟ **How Chess Pieces Move**

**Pawn**: Moves 1 square forward (2 on first move). Captures diagonally.
**Knight** ♞: Moves in an "L" shape (2+1). The only piece that jumps!
**Bishop** ♝: Moves diagonally any number of squares. Stays on one color.
**Rook** ♜: Moves horizontally or vertically any number of squares.
**Queen** ♛: Most powerful! Combines Rook + Bishop movement.
**King** ♚: Moves 1 square in any direction. Must always be kept safe!

**Check**: When the King is under attack.
**Checkmate**: When the King can't escape check. Game over!
  `,
    'special-moves': `
✨ **Special Moves**

**Castling**: The King moves 2 squares toward a Rook, and the Rook jumps to the other side of the King.
- Requires: King & Rook haven't moved, King not in check, no pieces between them
- Kingside (short): O-O | Queenside (long): O-O-O

**En Passant**: If a pawn moves 2 squares and lands beside an enemy pawn, that enemy pawn can capture it as if it only moved 1 square. Must be done immediately!

**Promotion**: When a pawn reaches the 8th rank, it promotes to any piece (usually a Queen). This is extremely powerful!
  `,
    'opening-principles': `
📚 **The 3 Golden Opening Rules**

1. **Control the center** — Place pawns on e4/d4 (White) or e5/d5 (Black). 
   Center pawns give your pieces more space and mobility.

2. **Develop your pieces** — Get your Knights and Bishops off the back rank quickly.
   Don't move the same piece twice. Don't bring the Queen out too early.

3. **Castle early** — Castle within the first 10 moves to protect your King and connect your Rooks.

**DON'T**: Move pawns randomly. Move the same piece repeatedly. Ignore King safety.
  `,
    'tactics-intro': `
⚔️ **Tactical Patterns**

**Fork**: One piece attacks two enemy pieces simultaneously.
→ Knights are the best at forks! Look for "N+2 targets"

**Pin**: Attacking a piece that cannot move without exposing a more valuable piece behind it.
→ Absolute pin: The King is behind the pinned piece
→ Relative pin: A more valuable piece is behind

**Skewer**: Like a pin but works on the more valuable piece in front.
→ "The reverse pin" — the valuable piece must move, exposing the piece behind.

**Discovered Attack**: Moving one piece reveals an attack from another piece.

Look for these patterns in the Puzzles section to practice! 🧩
  `,
    'endgame-basics': `
♛ **Endgame Fundamentals**

In the endgame, your **King becomes a powerful fighting piece**! Activate it.

**King + Pawn**: Use "Opposition" — place your King directly opposite the enemy King
to force it away and escort your pawn to promotion.

**King activity**: Centralize your King. A central King dominates the endgame.

**Rook endings** (most common): Rooks belong behind passed pawns (yours or theirs).

**Passed pawn**: A pawn with no enemy pawns blocking or capturing it. 
These must be pushed to promotion!

Basic checkmates to know: K+Q vs K, K+R vs K, K+2B vs K.
  `,
}

export function Lessons() {
    const { lessonsCompleted, completeLesson } = useProgressStore()
    const [activeLesson, setActiveLesson] = React.useState(null)

    return (
        <div className="lessons-page page">
            <div className="lessons-header">
                <div>
                    <h2 className="font-display">Chess Lessons</h2>
                    <p className="text-muted text-sm">Learn with Sage — your personal chess tutor</p>
                </div>
                <span className="badge badge-jade">{lessonsCompleted.length}/{LESSONS.length} completed</span>
            </div>

            <div className="lessons-layout">
                {/* List */}
                <div className="lessons-list">
                    {LESSONS.map((lesson) => {
                        const done = lessonsCompleted.includes(lesson.id)
                        return (
                            <div
                                key={lesson.id}
                                className={`lesson-card card ${activeLesson?.id === lesson.id ? 'lesson-card--active' : ''} ${done ? 'lesson-card--done' : ''}`}
                                onClick={() => setActiveLesson(lesson)}
                            >
                                <div className="lesson-card__icon">{lesson.icon}</div>
                                <div className="lesson-card__body">
                                    <div className="lesson-card__title">{lesson.title} {done && '✓'}</div>
                                    <div className="lesson-card__desc text-muted text-sm">{lesson.desc}</div>
                                    <span className={`badge ${lesson.difficulty === 'Beginner' ? 'badge-jade' : lesson.difficulty === 'Intermediate' ? 'badge-gold' : 'badge-red'}`}>
                                        {lesson.difficulty}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Content */}
                <div className="lessons-content card">
                    {activeLesson ? (
                        <>
                            <div className="lesson-content-header">
                                <span className="lesson-content-icon">{activeLesson.icon}</span>
                                <h2 className="font-display">{activeLesson.title}</h2>
                            </div>

                            <div className="lesson-content-tutor">
                                <SageCharacter state="explaining" size={80} />
                                <div className="lesson-content-text">
                                    {LESSON_CONTENT[activeLesson.id]?.split('\n').filter(Boolean).map((line, i) => (
                                        <p key={i} className={line.startsWith('**') && line.endsWith('**') ? 'lesson-section-title' : ''}>
                                            {line.replace(/\*\*/g, '')}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className="lesson-topics">
                                {activeLesson.topics.map(t => <span key={t} className="badge badge-jade">{t}</span>)}
                            </div>

                            {!lessonsCompleted.includes(activeLesson.id) && (
                                <button className="btn btn-primary" onClick={() => completeLesson(activeLesson.id)}>
                                    ✓ Mark as Complete
                                </button>
                            )}
                            {lessonsCompleted.includes(activeLesson.id) && (
                                <div className="lesson-done-banner">✓ Lesson Completed!</div>
                            )}
                        </>
                    ) : (
                        <div className="lessons-welcome">
                            <SageCharacter state="idle" size={130} />
                            <h3 className="font-display">Select a Lesson</h3>
                            <p className="text-muted">Choose a lesson from the list to start learning chess with Sage!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
