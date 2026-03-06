import React, { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { SageCharacter } from '../components/Tutor/SageCharacter'
import { SpeechBubble } from '../components/Tutor/SpeechBubble'
import { useProgressStore } from '../store/useGameStore'
import { getRandomMessage } from '../components/Tutor/tutorMessages'
import puzzles from '../assets/puzzles_1000.json'
import './Puzzles.css'

function getPuzzlesByRating(elo) {
    const range = Math.max(400, elo)
    return puzzles.filter(p => p.rating >= range - 200 && p.rating <= range + 200)
}

export function Puzzles() {
    const { userElo, solvePuzzle } = useProgressStore()
    const [currentPuzzle, setCurrentPuzzle] = useState(null)
    const [puzzleGame, setPuzzleGame] = useState(null)
    const [fen, setFen] = useState(null)
    const [moveIndex, setMoveIndex] = useState(0)
    const [solved, setSolved] = useState(false)
    const [failed, setFailed] = useState(false)
    const [tutorState, setTutorState] = useState('idle')
    const [tutorMsg, setTutorMsg] = useState('')
    const [showBubble, setShowBubble] = useState(false)
    const [legalMoves, setLegalMoves] = useState({})
    const [selectedSq, setSelectedSq] = useState(null)
    const [streak, setStreak] = useState(0)

    const showMsg = (msg, state, duration = 4000) => {
        setTutorMsg(msg); setTutorState(state); setShowBubble(true)
        setTimeout(() => { setShowBubble(false); setTutorState('idle') }, duration)
    }

    const loadNewPuzzle = () => {
        const pool = getPuzzlesByRating(userElo)
        const puzzle = pool[Math.floor(Math.random() * pool.length)] || puzzles[0]
        const game = new Chess(puzzle.fen)

        // Make the opponent's first move (the "setup" move)
        const moves = puzzle.moves.split(' ')
        game.move({ from: moves[0].slice(0, 2), to: moves[0].slice(2, 4), promotion: moves[0][4] || undefined })

        setCurrentPuzzle({ ...puzzle, solutionMoves: moves.slice(1) })
        setPuzzleGame(game)
        setFen(game.fen())
        setMoveIndex(0)
        setSolved(false)
        setFailed(false)
        setSelectedSq(null)
        setLegalMoves({})
        showMsg("Find the best move! Think carefully...", 'explaining', 4000)
    }

    useEffect(() => { loadNewPuzzle() }, [])

    const handleSquareClick = (square) => {
        if (!puzzleGame || solved || failed) return

        if (selectedSq) {
            attemptMove(selectedSq, square)
            setSelectedSq(null)
            setLegalMoves({})
            return
        }

        const piece = puzzleGame.get(square)
        if (!piece) return
        if (piece.color !== puzzleGame.turn()) return

        const dests = puzzleGame.moves({ square, verbose: true }).map(m => m.to)
        setSelectedSq(square)
        const highlights = {}
        dests.forEach(sq => {
            highlights[sq] = { background: 'radial-gradient(circle, rgba(63,182,140,0.5) 25%, transparent 28%)', borderRadius: '50%' }
        })
        highlights[square] = { background: 'rgba(63,182,140,0.3)', borderRadius: '4px' }
        setLegalMoves(highlights)
    }

    const handleDrop = (from, to) => {
        if (!puzzleGame || solved || failed) return false
        return attemptMove(from, to)
    }

    const attemptMove = (from, to) => {
        if (!currentPuzzle) return false
        const expectedUCI = currentPuzzle.solutionMoves[moveIndex]
        const madeUCI = from + to

        const move = puzzleGame.move({ from, to, promotion: 'q' })
        if (!move) return false

        if (madeUCI === expectedUCI) {
            // Correct!
            const nextIndex = moveIndex + 1
            if (nextIndex >= currentPuzzle.solutionMoves.length) {
                // Puzzle solved!
                setSolved(true)
                setSelectedSq(null)
                setStreak(s => s + 1)
                solvePuzzle(currentPuzzle.id, true)
                showMsg(getRandomMessage('puzzleSolve'), 'celebrating', 5000)
            } else {
                // Make opponent's reply automatically
                const replyUCI = currentPuzzle.solutionMoves[nextIndex]
                setTimeout(() => {
                    puzzleGame.move({ from: replyUCI.slice(0, 2), to: replyUCI.slice(2, 4), promotion: replyUCI[4] || undefined })
                    setFen(puzzleGame.fen())
                    setMoveIndex(nextIndex + 1)
                }, 500)
            }
            setFen(puzzleGame.fen())
            setMoveIndex(nextIndex)
            setSelectedSq(null)
            return true
        } else {
            // Wrong move
            puzzleGame.undo()
            setFailed(true)
            setSelectedSq(null)
            setStreak(0)
            solvePuzzle(currentPuzzle.id, false)
            showMsg(getRandomMessage('puzzleFail'), 'error', 5000)
            setFen(puzzleGame.fen())
            return false
        }
    }

    return (
        <div className="puzzles-page page">
            <div className="puzzles-header">
                <div>
                    <h2 className="font-display">Tactical Puzzles</h2>
                    <p className="text-muted text-sm">Training for rating ~{userElo} · Streak: {streak} 🔥</p>
                </div>
                <button className="btn btn-primary" onClick={loadNewPuzzle}>Next Puzzle →</button>
            </div>

            <div className="puzzles-layout">
                {/* Board */}
                <div className="puzzles-board-section">
                    {currentPuzzle && (
                        <div className="puzzles-turn-info">
                            <span className={`turn-dot ${puzzleGame?.turn() === 'w' ? 'turn-dot--white' : 'turn-dot--black'}`} />
                            <span>{puzzleGame?.turn() === 'w' ? 'White' : 'Black'} to move</span>
                            {currentPuzzle.themes && <span className="puzzle-theme-badge">{currentPuzzle.themes.split(' ')[0]}</span>}
                        </div>
                    )}
                    <div className="puzzles-board-wrap">
                        {fen && (
                            <Chessboard
                                position={fen}
                                onSquareClick={handleSquareClick}
                                onPieceDrop={handleDrop}
                                boardOrientation={puzzleGame?.turn() === 'w' ? 'white' : 'black'}
                                customSquareStyles={legalMoves}
                                customLightSquareStyle={{ backgroundColor: '#F0D9B5' }}
                                customDarkSquareStyle={{ backgroundColor: '#B58863' }}
                                customBoardStyle={{ borderRadius: '8px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)', overflow: 'hidden' }}
                                animationDuration={200}
                                arePiecesDraggable={!solved}
                            />
                        )}
                    </div>

                    {/* Result banner */}
                    {solved && (
                        <div className="puzzle-result puzzle-result--success animate-fade-up">
                            🎉 Puzzle Solved! +15 rating
                            <button className="btn btn-primary" onClick={loadNewPuzzle}>Next →</button>
                        </div>
                    )}
                    {failed && (
                        <div className="puzzle-result puzzle-result--fail animate-fade-up">
                            ❌ Not quite! Try the next one.
                            <button className="btn btn-secondary" onClick={loadNewPuzzle}>Next →</button>
                        </div>
                    )}
                </div>

                {/* Sidebar: Tutor + info */}
                <div className="puzzles-info-panel">
                    <div className="puzzle-info-card card">
                        <h4>Puzzle Info</h4>
                        {currentPuzzle && (
                            <>
                                <div className="puzzle-stat"><span>Rating</span><strong className="text-gold">{currentPuzzle.rating}</strong></div>
                                <div className="puzzle-stat"><span>Themes</span><strong className="text-jade">{currentPuzzle.themes?.replace(/ /g, ', ')}</strong></div>
                            </>
                        )}
                    </div>
                    <div className="puzzle-tutor card">
                        <div className="relative flex justify-center">
                            <SageCharacter state={tutorState} size={100} />
                            <SpeechBubble message={tutorMsg} visible={showBubble} side="left" />
                        </div>
                        <p className="text-center text-sm text-jade font-display">Sage</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
