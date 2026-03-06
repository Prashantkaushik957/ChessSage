import { useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'
import { OPENINGS } from './openings'

export function useChessGame() {
    const gameRef = useRef(new Chess())
    const [fen, setFen] = useState(gameRef.current.fen())
    const [history, setHistory] = useState([])
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
    const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] })
    const [openingName, setOpeningName] = useState(null)
    const [lastMove, setLastMove] = useState(null)
    const [gameOver, setGameOver] = useState(null) // null | { result, reason }

    const updateState = useCallback(() => {
        const game = gameRef.current
        const newFen = game.fen()
        setFen(newFen)

        const hist = game.history({ verbose: true })
        setHistory(hist)
        setCurrentMoveIndex(hist.length - 1)

        // Compute captured pieces
        const captured = { white: [], black: [] }
        hist.forEach(move => {
            if (move.captured) {
                if (move.color === 'w') captured.white.push(move.captured)
                else captured.black.push(move.captured)
            }
        })
        setCapturedPieces(captured)

        // Detect opening
        const fenPrefix = newFen.split(' ')[0]
        const opening = OPENINGS[fenPrefix]
        if (opening) setOpeningName(opening)

        // Check game over
        if (game.isGameOver()) {
            let result, reason
            if (game.isCheckmate()) {
                result = game.turn() === 'w' ? 'black' : 'white'
                reason = 'checkmate'
            } else if (game.isDraw()) {
                result = 'draw'
                reason = game.isStalemate() ? 'stalemate'
                    : game.isInsufficientMaterial() ? 'insufficient-material'
                        : game.isThreefoldRepetition() ? 'threefold-repetition'
                            : 'fifty-move-rule'
            }
            setGameOver({ result, reason })
        } else {
            setGameOver(null)
        }

        // Track last move
        if (hist.length > 0) {
            const last = hist[hist.length - 1]
            setLastMove({ from: last.from, to: last.to })
        }
    }, [])

    const makeMove = useCallback((from, to, promotion = 'q') => {
        const game = gameRef.current
        try {
            const prevFen = game.fen()
            const move = game.move({ from, to, promotion })
            if (!move) return null
            updateState()
            return { move, prevFen }
        } catch {
            return null
        }
    }, [updateState])

    const makeMoveFromUCI = useCallback((uciMove) => {
        const from = uciMove.slice(0, 2)
        const to = uciMove.slice(2, 4)
        const promotion = uciMove.length > 4 ? uciMove[4] : 'q'
        return makeMove(from, to, promotion)
    }, [makeMove])

    const undoMove = useCallback(() => {
        const game = gameRef.current
        game.undo()
        updateState()
    }, [updateState])

    const undoTwoMoves = useCallback(() => {
        const game = gameRef.current
        game.undo()
        game.undo()
        updateState()
    }, [updateState])

    const resetGame = useCallback((fen = null) => {
        const game = gameRef.current
        if (fen) game.load(fen)
        else game.reset()
        setOpeningName(null)
        setLastMove(null)
        setGameOver(null)
        updateState()
    }, [updateState])

    const loadPGN = useCallback((pgn) => {
        const game = gameRef.current
        try {
            game.loadPgn(pgn)
            updateState()
            return true
        } catch {
            return false
        }
    }, [updateState])

    const getLegalMoves = useCallback((square) => {
        const game = gameRef.current
        const moves = game.moves({ square, verbose: true })
        return moves.map(m => m.to)
    }, [])

    const isInCheck = gameRef.current.inCheck()
    const turn = gameRef.current.turn() // 'w' | 'b'
    const isGameOver = !!gameOver

    return {
        fen,
        history,
        lastMove,
        capturedPieces,
        openingName,
        isInCheck,
        isGameOver,
        gameOver,
        turn,
        game: gameRef.current,
        makeMove,
        makeMoveFromUCI,
        undoMove,
        undoTwoMoves,
        resetGame,
        loadPGN,
        getLegalMoves,
    }
}
