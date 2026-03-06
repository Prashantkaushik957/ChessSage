import React from 'react'
import './EvalBar.css'

export function EvalBar({ evaluation = 0, isThinking = false, orientation = 'white' }) {
    // Clamp eval to ±5 for display (500cp = 5 pawns = full bar)
    const clampedEval = Math.max(-1000, Math.min(1000, evaluation))
    const percentage = 50 + (clampedEval / 1000) * 50
    const whitePercent = orientation === 'white' ? percentage : 100 - percentage

    const getLabel = (eval_) => {
        if (Math.abs(eval_) > 900) {
            return eval_ > 0 ? 'M+' : 'M-'
        }
        const abs = Math.abs(eval_) / 100
        return (eval_ > 0 ? '+' : '-') + abs.toFixed(1)
    }

    return (
        <div className={`eval-bar ${isThinking ? 'eval-bar--thinking' : ''}`}>
            <div className="eval-bar__track">
                <div
                    className="eval-bar__white-fill"
                    style={{ height: `${whitePercent}%` }}
                />
                {isThinking && <div className="eval-bar__thinking-indicator" />}
            </div>
            <div className="eval-bar__label">
                {getLabel(clampedEval)}
            </div>
        </div>
    )
}
