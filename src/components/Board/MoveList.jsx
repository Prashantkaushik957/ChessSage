import React, { useRef, useEffect } from 'react'
import './MoveList.css'

const PIECE_SYMBOLS = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '' }

export function MoveList({ history, currentIndex }) {
    const listRef = useRef(null)

    // Auto-scroll to latest move
    useEffect(() => {
        if (listRef.current) {
            const active = listRef.current.querySelector('.move-list__move--active')
            if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }, [currentIndex])

    // Group into pairs (White, Black)
    const moves = []
    for (let i = 0; i < history.length; i += 2) {
        moves.push({ move: i + 1, white: history[i], black: history[i + 1] })
    }

    const formatMove = (move) => {
        if (!move) return ''
        let san = move.san || ''
        return san
    }

    return (
        <div className="move-list">
            <div className="move-list__header">
                <span>Move History</span>
            </div>
            <div ref={listRef} className="move-list__body">
                {moves.length === 0 ? (
                    <p className="move-list__empty">Game starts on your first move</p>
                ) : (
                    moves.map(({ move, white, black }) => (
                        <div key={move} className="move-list__row">
                            <span className="move-list__num">{move}.</span>
                            <span className={`move-list__move ${currentIndex === (move - 1) * 2 ? 'move-list__move--active' : ''}`}>
                                {formatMove(white)}
                            </span>
                            <span className={`move-list__move ${black && currentIndex === (move - 1) * 2 + 1 ? 'move-list__move--active' : ''}`}>
                                {formatMove(black)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
