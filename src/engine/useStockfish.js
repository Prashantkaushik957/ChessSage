import { useState, useEffect, useRef, useCallback } from 'react'

const DIFFICULTY_MAP = {
    1: { skillLevel: 0, moveTime: 100, elo: 250, name: 'Martin' },
    2: { skillLevel: 3, moveTime: 300, elo: 800, name: 'Nelson' },
    3: { skillLevel: 6, moveTime: 500, elo: 1200, name: 'Iron Man' },
    4: { skillLevel: 10, moveTime: 800, elo: 1600, name: 'Captain America' },
    5: { skillLevel: 14, moveTime: 1200, elo: 2700, name: 'Gukesh D' },
    6: { skillLevel: 18, moveTime: 2000, elo: 2800, name: 'Hikaru' },
    7: { skillLevel: 20, moveTime: 3000, elo: 2882, name: 'Magnus Carlsen' },
}

export function useStockfish() {
    const workerRef = useRef(null)
    const [isReady, setIsReady] = useState(false)
    const [isThinking, setIsThinking] = useState(false)
    const [bestMove, setBestMove] = useState(null)
    const [evaluation, setEvaluation] = useState(0)
    const [difficulty, setDifficultyState] = useState(2)
    const pendingCallbackRef = useRef(null)
    const timeoutRef = useRef(null)

    const initWorker = useCallback(() => {
        if (workerRef.current) workerRef.current.terminate()
        const worker = new Worker(new URL('./stockfish.worker.js', import.meta.url), { type: 'classic' })
        workerRef.current = worker

        worker.onmessage = (event) => {
            const { type, move, eval: score, mateIn } = event.data

            switch (type) {
                case 'ready':
                    setIsReady(true)
                    // Set default difficulty
                    worker.postMessage({ type: 'setDifficulty', payload: { level: 2 } })
                    break
                case 'bestmove':
                    clearTimeout(timeoutRef.current)
                    setIsThinking(false)
                    setBestMove(move)
                    if (pendingCallbackRef.current) {
                        pendingCallbackRef.current(move)
                        pendingCallbackRef.current = null
                    }
                    break
                case 'eval':
                    setEvaluation(mateIn ? (score > 0 ? 9999 : -9999) : score)
                    break
                case 'error':
                    console.error('Stockfish error:', event.data.message)
                    setIsThinking(false)
                    break
            }
        }

        worker.onerror = (err) => {
            console.error('Worker error:', err)
        }

        worker.postMessage({ type: 'init' })
    }, [])

    useEffect(() => {
        initWorker()

        return () => {
            if (workerRef.current) workerRef.current.terminate()
            workerRef.current = null
        }
    }, [initWorker])

    const setDifficulty = useCallback((level) => {
        setDifficultyState(level)
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'setDifficulty', payload: { level } })
        }
    }, [])

    const getBestMove = useCallback((fen, callback) => {
        if (!workerRef.current || !isReady) return

        const diff = DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP[4]
        setIsThinking(true)
        setBestMove(null)
        pendingCallbackRef.current = callback || null

        workerRef.current.postMessage({
            type: 'getBestMove',
            payload: { fen, moveTime: diff.moveTime }
        })

        // Timeout Fallback Engine Safety
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            console.warn("Stockfish froze! Triggering timeout failsafe.")
            setIsThinking(false)
            if (pendingCallbackRef.current) {
                pendingCallbackRef.current('timeout')
                pendingCallbackRef.current = null
            }
            initWorker() // Reboot the hung worker
        }, diff.moveTime + 2000)
    }, [isReady, difficulty, initWorker])

    const getEvaluation = useCallback((fen) => {
        if (!workerRef.current || !isReady) return
        workerRef.current.postMessage({ type: 'getEvaluation', payload: { fen } })
    }, [isReady])

    const stopSearch = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'stop' })
            setIsThinking(false)
        }
    }, [])

    const newGame = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'newGame' })
        }
    }, [])

    return {
        isReady,
        isThinking,
        bestMove,
        evaluation,
        difficulty,
        difficultyInfo: DIFFICULTY_MAP[difficulty],
        setDifficulty,
        getBestMove,
        getEvaluation,
        stopSearch,
        newGame,
        DIFFICULTY_MAP,
    }
}
