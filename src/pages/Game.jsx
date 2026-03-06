import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Chessboard } from 'react-chessboard'
import { useChessGame } from '../chess/useChessGame'
import { useStockfish } from '../engine/useStockfish'
import { EvalBar } from '../components/Board/EvalBar'
import { MoveList } from '../components/Board/MoveList'
import { SageCharacter } from '../components/Tutor/SageCharacter'
import { SpeechBubble } from '../components/Tutor/SpeechBubble'
import { useGameStore } from '../store/useGameStore'
import { getRandomMessage, getOpeningMessage } from '../components/Tutor/tutorMessages'
import './Game.css'

const DIFFICULTY_NAMES = {
    1: { name: 'Beginner', elo: '~400', color: '#5cb85c' },
    2: { name: 'Novice', elo: '~600', color: '#5bc0de' },
    3: { name: 'Casual', elo: '~900', color: '#5bc0de' },
    4: { name: 'Intermediate', elo: '~1200', color: '#f0ad4e' },
    5: { name: 'Advanced', elo: '~1600', color: '#f0ad4e' },
    6: { name: 'Expert', elo: '~2000', color: '#d9534f' },
    7: { name: 'Master', elo: '~2500', color: '#a855f7' },
}

export function Game() {
    const { difficulty, setDifficulty, playerColor, soundEnabled } = useGameStore()

    const {
        fen, history, lastMove, capturedPieces, openingName,
        isInCheck, isGameOver, gameOver, turn, game,
        makeMove, makeMoveFromUCI, undoTwoMoves, resetGame, getLegalMoves
    } = useChessGame()

    const {
        isReady, isThinking, evaluation, getBestMove, stopSearch, newGame, setDifficulty: setEngineDifficulty
    } = useStockfish()

    const [selectedSquare, setSelectedSquare] = useState(null)
    const [legalMoveSquares, setLegalMoveSquares] = useState({})
    const [tutorState, setTutorState] = useState('idle')
    const [tutorMessage, setTutorMessage] = useState('')
    const [showBubble, setShowBubble] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [showGameOverModal, setShowGameOverModal] = useState(false)
    const [prevEval, setPrevEval] = useState(0)
    const bubbleTimerRef = useRef(null)

    // ── Show tutor message ──
    const showTutorMessage = useCallback((message, state = 'explaining', duration = 5000) => {
        clearTimeout(bubbleTimerRef.current)
        setTutorMessage(message)
        setTutorState(state)
        setShowBubble(true)
        bubbleTimerRef.current = setTimeout(() => {
            setShowBubble(false)
            setTutorState('idle')
        }, duration)
    }, [])

    // ── Opening detection ──
    useEffect(() => {
        if (openingName && history.length >= 2 && history.length <= 8) {
            showTutorMessage(getOpeningMessage(openingName), 'explaining', 6000)
        }
    }, [openingName])

    // ── Engine difficulty sync ──
    useEffect(() => {
        if (isReady) setEngineDifficulty(difficulty)
    }, [difficulty, isReady, setEngineDifficulty])

    // ── AI turn ──
    useEffect(() => {
        if (!gameStarted || !isReady || isGameOver) return
        const isAITurn = (playerColor === 'w' && turn === 'b') || (playerColor === 'b' && turn === 'w')
        if (!isAITurn) return

        // Small delay so UI updates first
        const timer = setTimeout(() => {
            setTutorState('thinking')
            getBestMove(fen, (aiMove) => {
                if (!aiMove || aiMove === '(none)') return
                const result = makeMoveFromUCI(aiMove)
                if (!result) return

                // Evaluate quality of AI move for commentary
                const evalDelta = evaluation - prevEval
                setPrevEval(evaluation)

                if (Math.abs(evaluation) > 900) {
                    showTutorMessage(getRandomMessage('idle'), 'idle', 3000)
                } else {
                    setTimeout(() => {
                        setTutorState('idle')
                    }, 500)
                }
            })
        }, 300)

        return () => clearTimeout(timer)
    }, [turn, gameStarted, isReady, isGameOver, fen, playerColor])

    // ── Game over handling ──
    useEffect(() => {
        if (!isGameOver || !gameOver) return
        const isPlayerWin = gameOver.result === (playerColor === 'w' ? 'white' : 'black')
        const isDraw = gameOver.result === 'draw'

        if (isPlayerWin) {
            showTutorMessage(getRandomMessage('playerWin'), 'celebrating', 8000)
        } else if (isDraw) {
            showTutorMessage(getRandomMessage('draw'), 'explaining', 6000)
        } else {
            showTutorMessage(getRandomMessage('playerLose'), 'error', 8000)
        }
        setTimeout(() => setShowGameOverModal(true), 2000)
    }, [isGameOver, gameOver])

    // ── Handle player piece click ──
    const handleSquareClick = useCallback((square) => {
        const isPlayerTurn = (playerColor === 'w' && turn === 'w') || (playerColor === 'b' && turn === 'b')
        if (!isPlayerTurn || !gameStarted || isGameOver || isThinking) return

        if (selectedSquare) {
            // Try to make the move
            const result = makeMove(selectedSquare, square)
            if (result) {
                setSelectedSquare(null)
                setLegalMoveSquares({})

                // Commentary on move quality (simplified — eval diff via Stockfish)
                const evalDelta = evaluation - prevEval
                setPrevEval(evaluation)

                if (result.move.san?.includes('O-O')) {
                    showTutorMessage(getRandomMessage('castling'), 'explaining', 4000)
                } else if (result.move.san?.includes('=')) {
                    showTutorMessage(getRandomMessage('promotion'), 'celebrating', 5000)
                } else if (result.move.captured) {
                    if (Math.random() < 0.4) {
                        showTutorMessage(getRandomMessage('capturePiece'), 'explaining', 3000)
                    }
                }
                return
            }
            // Not a valid destination — select new piece
            setSelectedSquare(null)
            setLegalMoveSquares({})
        }

        // Select piece
        const piece = game.get(square)
        if (!piece) return
        const isOwnPiece = piece.color === (playerColor === 'w' ? 'w' : 'b')
        if (!isOwnPiece) return

        const legalDests = getLegalMoves(square)
        if (legalDests.length === 0) return

        setSelectedSquare(square)
        const highlights = {}
        legalDests.forEach(sq => {
            highlights[sq] = {
                background: game.get(sq)
                    ? 'radial-gradient(circle, rgba(224,92,106,0.6) 36%, transparent 40%)'
                    : 'radial-gradient(circle, rgba(63,182,140,0.5) 25%, transparent 28%)',
                borderRadius: '50%',
            }
        })
        highlights[square] = { background: 'rgba(63,182,140,0.4)', borderRadius: '4px' }
        setLegalMoveSquares(highlights)
    }, [selectedSquare, playerColor, turn, gameStarted, isGameOver, isThinking, game, makeMove, getLegalMoves, evaluation, prevEval, showTutorMessage])

    // ── Handle drag-and-drop ──
    const handlePieceDrop = useCallback((sourceSquare, targetSquare) => {
        const isPlayerTurn = (playerColor === 'w' && turn === 'w') || (playerColor === 'b' && turn === 'b')
        if (!isPlayerTurn || !gameStarted || isGameOver || isThinking) return false

        const result = makeMove(sourceSquare, targetSquare)
        if (!result) return false

        setSelectedSquare(null)
        setLegalMoveSquares({})
        return true
    }, [playerColor, turn, gameStarted, isGameOver, isThinking, makeMove])

    const startNewGame = (color = 'w', diff = difficulty) => {
        stopSearch()
        newGame()
        resetGame()
        setGameStarted(true)
        setShowGameOverModal(false)
        setSelectedSquare(null)
        setLegalMoveSquares({})
        setPrevEval(0)
        setEngineDifficulty(diff)
        showTutorMessage(getRandomMessage('gameStart'), 'welcome', 5000)

        // If AI plays white (player is black), trigger first AI move
        if (color === 'b') {
            setTimeout(() => {
                getBestMove('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', (aiMove) => {
                    if (aiMove) makeMoveFromUCI(aiMove)
                })
            }, 1200)
        }
    }

    const handleUndo = () => {
        if (history.length < 2) return
        stopSearch()
        undoTwoMoves()
        showTutorMessage("Move undone! Take your time and think it through.", 'explaining', 3000)
    }

    // Highlight last move squares
    const lastMoveHighlight = lastMove ? {
        [lastMove.from]: { background: 'rgba(212,175,55,0.35)' },
        [lastMove.to]: { background: 'rgba(212,175,55,0.35)' },
    } : {}

    const customSquareStyles = { ...lastMoveHighlight, ...legalMoveSquares }
    const diffInfo = DIFFICULTY_NAMES[difficulty] || DIFFICULTY_NAMES[4]

    return (
        <div className="game-page">
            {/* Left: Eval Bar */}
            <div className="game-eval-bar">
                <EvalBar evaluation={evaluation} isThinking={isThinking} />
            </div>

            {/* Center: Board */}
            <div className="game-board-section">
                {/* Player info bars */}
                <div className="game-player-bar game-player-bar--top">
                    <span className="game-player-avatar">{playerColor === 'w' ? '🤖' : '👤'}</span>
                    <span className="game-player-name">{playerColor === 'w' ? `ChessBot (${diffInfo.elo})` : 'You'}</span>
                    {isThinking && <span className="game-thinking-badge animate-shimmer">Thinking...</span>}
                </div>

                <div className="game-board-wrapper">
                    <Chessboard
                        position={fen}
                        onSquareClick={handleSquareClick}
                        onPieceDrop={handlePieceDrop}
                        boardOrientation={playerColor === 'w' ? 'white' : 'black'}
                        customSquareStyles={customSquareStyles}
                        customBoardStyle={{
                            borderRadius: '8px',
                            boxShadow: isInCheck
                                ? '0 0 30px rgba(224,92,106,0.6)'
                                : '0 8px 40px rgba(0,0,0,0.6)',
                            overflow: 'hidden',
                        }}
                        customLightSquareStyle={{ backgroundColor: '#F0D9B5' }}
                        customDarkSquareStyle={{ backgroundColor: '#B58863' }}
                        animationDuration={200}
                        arePiecesDraggable={gameStarted && !isGameOver}
                    />
                </div>

                <div className="game-player-bar game-player-bar--bottom">
                    <span className="game-player-avatar">{playerColor === 'w' ? '👤' : '🤖'}</span>
                    <span className="game-player-name">{playerColor === 'w' ? 'You' : `ChessBot (${diffInfo.elo})`}</span>
                    {isInCheck && turn === (playerColor === 'w' ? 'w' : 'b') && (
                        <span className="game-check-badge">⚠ CHECK!</span>
                    )}
                </div>

                {/* Controls */}
                <div className="game-controls">
                    {!gameStarted ? (
                        <div className="game-start-panel">
                            <h3 className="font-display">Ready to Play?</h3>
                            <div className="game-color-select">
                                <button className="btn btn-secondary" onClick={() => { useGameStore.getState().setPlayerColor('w'); startNewGame('w') }}>
                                    ♔ Play as White
                                </button>
                                <button className="btn btn-secondary" onClick={() => { useGameStore.getState().setPlayerColor('b'); startNewGame('b') }}>
                                    ♚ Play as Black
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="game-action-bar">
                            <button className="btn btn-ghost" onClick={handleUndo} disabled={history.length < 2 || isThinking}>
                                ↩ Undo
                            </button>
                            <button className="btn btn-ghost" onClick={() => { stopSearch(); startNewGame(playerColor, difficulty) }}>
                                ↺ New Game
                            </button>
                            <div className="game-turn-indicator">
                                <span className={`turn-dot ${turn === 'w' ? 'turn-dot--white' : 'turn-dot--black'}`} />
                                {turn === (playerColor === 'w' ? 'w' : 'b') ? "Your turn" : "AI thinking..."}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right panel: Move list + Tutor */}
            <div className="game-right-panel">
                {/* Opening badge */}
                {openingName && (
                    <div className="game-opening-badge animate-fade-up">
                        <span>📖</span>
                        <span>{openingName}</span>
                    </div>
                )}

                {/* Difficulty selector */}
                <div className="game-difficulty-strip">
                    <span className="text-muted text-xs">Difficulty:</span>
                    <div className="difficulty-buttons">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                            <button
                                key={d}
                                className={`diff-btn ${difficulty === d ? 'diff-btn--active' : ''}`}
                                onClick={() => setDifficulty(d)}
                                style={difficulty === d ? { borderColor: DIFFICULTY_NAMES[d].color, color: DIFFICULTY_NAMES[d].color } : {}}
                            >
                                {DIFFICULTY_NAMES[d].name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Move list */}
                <div className="game-move-list">
                    <MoveList history={history} currentIndex={history.length - 1} />
                </div>

                {/* Sage tutor */}
                <div className="game-tutor">
                    <div className="tutor-inner relative">
                        <SageCharacter state={tutorState} size={100} />
                        <SpeechBubble message={tutorMessage} visible={showBubble} side="left" />
                    </div>
                    <div className="tutor-name font-display text-jade text-sm">Sage</div>
                </div>
            </div>

            {/* Game Over Modal */}
            {showGameOverModal && gameOver && (
                <div className="game-over-overlay animate-fade-in">
                    <div className="game-over-modal animate-fade-up">
                        <div className="game-over-icon">
                            {gameOver.result === (playerColor === 'w' ? 'white' : 'black') ? '🏆' :
                                gameOver.result === 'draw' ? '🤝' : '♟'}
                        </div>
                        <h2 className="font-display">
                            {gameOver.result === (playerColor === 'w' ? 'white' : 'black') ? 'You Won!' :
                                gameOver.result === 'draw' ? 'Draw!' : 'Game Over'}
                        </h2>
                        <p className="game-over-reason">
                            {gameOver.reason === 'checkmate' ? 'By checkmate' :
                                gameOver.reason === 'stalemate' ? 'By stalemate' :
                                    gameOver.reason === 'insufficient-material' ? 'Insufficient material' :
                                        gameOver.reason}
                        </p>
                        <div className="game-over-actions">
                            <button className="btn btn-primary" onClick={() => startNewGame(playerColor, difficulty)}>
                                Play Again
                            </button>
                            <button className="btn btn-secondary" onClick={() => setShowGameOverModal(false)}>
                                View Board
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
