/**
 * Stockfish Web Worker
 * Communicates via UCI protocol.
 * Loaded from public/stockfish/stockfish-16.1-lite-single.js
 */

let stockfish = null
let initialized = false

// Load Stockfish from embedded script
function loadStockfish() {
    return new Promise((resolve, reject) => {
        try {
            let scriptPath;
            if (import.meta.env.DEV) {
                scriptPath = import.meta.env.BASE_URL + 'stockfish/stockfish-18-lite-single.js';
            } else {
                scriptPath = new URL('../stockfish/stockfish-18-lite-single.js', self.location.href).href;
            }

            importScripts(scriptPath)

            // eslint-disable-next-line no-undef
            Stockfish({
                locateFile: (path) => {
                    if (path.endsWith('.wasm')) {
                        return import.meta.env.DEV
                            ? import.meta.env.BASE_URL + 'stockfish/' + path
                            : new URL('../stockfish/' + path, self.location.href).href;
                    }
                    return path;
                }
            }).then((sf) => {
                stockfish = sf
                stockfish.addMessageListener((line) => {
                    self.postMessage({ type: 'output', line })
                    parseStockfishOutput(line)
                })
                stockfish.postMessage('uci')
                stockfish.postMessage('isready')
                resolve()
            })
        } catch (err) {
            reject(err)
        }
    })
}

// ELO → Stockfish Skill Level + move time mapping
const DIFFICULTY_MAP = {
    1: { skillLevel: 0, moveTime: 100, elo: 400, name: 'Beginner' },
    2: { skillLevel: 3, moveTime: 200, elo: 600, name: 'Novice' },
    3: { skillLevel: 6, moveTime: 500, elo: 900, name: 'Casual' },
    4: { skillLevel: 10, moveTime: 800, elo: 1200, name: 'Intermediate' },
    5: { skillLevel: 14, moveTime: 1200, elo: 1600, name: 'Advanced' },
    6: { skillLevel: 18, moveTime: 2000, elo: 2000, name: 'Expert' },
    7: { skillLevel: 20, moveTime: 3000, elo: 2500, name: 'Master' },
}

let currentBestMove = null
let currentEval = 0
let currentDepth = 0
let pendingResolve = null

function parseStockfishOutput(line) {
    // Parse evaluation
    if (line.startsWith('info')) {
        const scoreMatch = line.match(/score cp (-?\d+)/)
        const mateMatch = line.match(/score mate (-?\d+)/)
        const depthMatch = line.match(/depth (\d+)/)

        if (depthMatch) currentDepth = parseInt(depthMatch[1])

        if (scoreMatch) {
            currentEval = parseInt(scoreMatch[1])
            self.postMessage({ type: 'eval', score: currentEval, depth: currentDepth })
        }
        if (mateMatch) {
            const mateIn = parseInt(mateMatch[1])
            currentEval = mateIn > 0 ? 9999 : -9999
            self.postMessage({ type: 'eval', score: currentEval, depth: currentDepth, mateIn })
        }
    }

    // Parse best move
    if (line.startsWith('bestmove')) {
        const parts = line.split(' ')
        currentBestMove = parts[1]
        const ponder = parts[3] || null

        self.postMessage({ type: 'bestmove', move: currentBestMove, ponder, eval: currentEval })

        if (pendingResolve) {
            pendingResolve({ move: currentBestMove, eval: currentEval })
            pendingResolve = null
        }
    }

    // Ready confirmation
    if (line === 'readyok') {
        initialized = true
        self.postMessage({ type: 'ready' })
    }
}

// Handle messages from main thread
self.onmessage = async (event) => {
    const { type, payload } = event.data

    if (type === 'init') {
        try {
            await loadStockfish()
        } catch {
            self.postMessage({ type: 'error', message: 'Failed to load Stockfish' })
        }
        return
    }

    if (!stockfish) {
        self.postMessage({ type: 'error', message: 'Stockfish not ready' })
        return
    }

    switch (type) {
        case 'setDifficulty': {
            const diff = DIFFICULTY_MAP[payload.level] || DIFFICULTY_MAP[4]
            stockfish.postMessage('setoption name Skill Level value ' + diff.skillLevel)
            self.postMessage({ type: 'difficultySet', ...diff })
            break
        }

        case 'getBestMove': {
            const { fen, moveTime } = payload
            stockfish.postMessage('position fen ' + fen)
            stockfish.postMessage('go movetime ' + (moveTime || 1000))
            break
        }

        case 'getEvaluation': {
            const { fen } = payload
            stockfish.postMessage('position fen ' + fen)
            stockfish.postMessage('go depth 15')
            break
        }

        case 'stop': {
            stockfish.postMessage('stop')
            break
        }

        case 'newGame': {
            stockfish.postMessage('ucinewgame')
            break
        }

        case 'setOption': {
            const { name, value } = payload
            stockfish.postMessage(`setoption name ${name} value ${value}`)
            break
        }
    }
}
