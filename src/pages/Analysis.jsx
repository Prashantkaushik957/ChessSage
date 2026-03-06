import React from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { useChessGame } from '../chess/useChessGame'
import { useStockfish } from '../engine/useStockfish'
import { EvalBar } from '../components/Board/EvalBar'
import { MoveList } from '../components/Board/MoveList'
import { SageCharacter } from '../components/Tutor/SageCharacter'
import './Analysis.css'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function Analysis() {
    const { fen, history, lastMove, makeMove, resetGame, loadPGN } = useChessGame()
    const { evaluation, getEvaluation, isThinking } = useStockfish()
    const [pgnInput, setPgnInput] = React.useState('')
    const [showPGNInput, setShowPGNInput] = React.useState(false)
    const [legalMoves, setLegalMoves] = React.useState({})
    const [selectedSq, setSelectedSq] = React.useState(null)
    const gameRef = React.useRef(new Chess())

    React.useEffect(() => {
        if (fen) getEvaluation(fen)
    }, [fen])

    const lastMoveHighlight = lastMove ? {
        [lastMove.from]: { background: 'rgba(212,175,55,0.35)' },
        [lastMove.to]: { background: 'rgba(212,175,55,0.35)' },
    } : {}

    const handleDrop = (from, to) => {
        const result = makeMove(from, to)
        if (!result) return false
        setSelectedSq(null)
        setLegalMoves({})
        return true
    }

    const handleLoadPGN = () => {
        if (loadPGN(pgnInput)) {
            setShowPGNInput(false)
            setPgnInput('')
        } else {
            alert('Invalid PGN. Please check the format.')
        }
    }

    return (
        <div className="analysis-page page">
            <div className="analysis-header">
                <div>
                    <h2 className="font-display">Game Analysis</h2>
                    <p className="text-muted text-sm">Analyze positions with Stockfish engine</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={() => setShowPGNInput(!showPGNInput)}>📋 Load PGN</button>
                    <button className="btn btn-ghost" onClick={() => resetGame()}>↺ Reset Board</button>
                </div>
            </div>

            {showPGNInput && (
                <div className="pgn-input-area card animate-fade-up">
                    <textarea
                        placeholder="Paste PGN here..."
                        value={pgnInput}
                        onChange={e => setPgnInput(e.target.value)}
                        className="pgn-textarea"
                        rows={4}
                    />
                    <div className="flex gap-2">
                        <button className="btn btn-primary" onClick={handleLoadPGN}>Load Game</button>
                        <button className="btn btn-ghost" onClick={() => setShowPGNInput(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="analysis-layout">
                <div className="analysis-eval-bar">
                    <EvalBar evaluation={evaluation} isThinking={isThinking} />
                </div>

                <div className="analysis-board-wrap">
                    <Chessboard
                        position={fen}
                        onPieceDrop={handleDrop}
                        customSquareStyles={{ ...lastMoveHighlight, ...legalMoves }}
                        customLightSquareStyle={{ backgroundColor: '#F0D9B5' }}
                        customDarkSquareStyle={{ backgroundColor: '#B58863' }}
                        customBoardStyle={{ borderRadius: '8px', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}
                        animationDuration={150}
                    />
                </div>

                <div className="analysis-right-panel">
                    <div className="analysis-eval-card card">
                        <div className="eval-label text-muted text-xs">Stockfish Evaluation</div>
                        <div className="eval-value font-display text-jade">
                            {isThinking ? '...' : evaluation > 0 ? `+${(evaluation / 100).toFixed(2)}` : (evaluation / 100).toFixed(2)}
                        </div>
                        <div className="eval-hint text-xs text-muted">
                            {evaluation > 200 ? 'White is winning' : evaluation < -200 ? 'Black is winning' : 'Roughly equal'}
                        </div>
                    </div>

                    <div className="analysis-move-list">
                        <MoveList history={history} currentIndex={history.length - 1} />
                    </div>

                    <div className="analysis-tutor card">
                        <SageCharacter state={isThinking ? 'thinking' : 'idle'} size={80} />
                        <p className="text-center text-xs text-muted">Stockfish is analyzing...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
