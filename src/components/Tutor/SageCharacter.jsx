import React, { useState, useEffect, useRef } from 'react'
import './SageCharacter.css'

/**
 * Sage — animated SVG tutor character
 * states: idle | thinking | celebrating | explaining | error | welcome
 */
export function SageCharacter({ state = 'idle', size = 140 }) {
    const [blinkEyes, setBlinkEyes] = useState(false)
    const [eyePos, setEyePos] = useState({ x: 0, y: 0 })

    // Random blinking
    useEffect(() => {
        const scheduleBlInk = () => {
            const delay = 2000 + Math.random() * 4000
            return setTimeout(() => {
                setBlinkEyes(true)
                setTimeout(() => setBlinkEyes(false), 150)
                scheduleBlInk()
            }, delay)
        }
        const timer = scheduleBlInk()
        return () => clearTimeout(timer)
    }, [])

    // Eye shift based on state
    useEffect(() => {
        const shifts = {
            thinking: { x: 2, y: -1 },
            explaining: { x: 3, y: 0 },
            celebrating: { x: 0, y: -2 },
            error: { x: -2, y: 1 },
            idle: { x: 0, y: 0 },
            welcome: { x: 1, y: -1 },
        }
        setEyePos(shifts[state] || { x: 0, y: 0 })
    }, [state])

    return (
        <div className={`sage-wrapper sage-state-${state}`} style={{ width: size, height: size * 1.4 }}>
            <svg
                width={size}
                height={size * 1.4}
                viewBox="0 0 100 140"
                xmlns="http://www.w3.org/2000/svg"
                className="sage-svg"
            >
                {/* ── Sparkles (celebrating) ── */}
                {state === 'celebrating' && (
                    <g className="sage-sparkles">
                        {[[-15, 20], [18, 15], [-20, 60], [22, 55], [-10, 85], [16, 80]].map(([sx, sy], i) => (
                            <text key={i} x={50 + sx} y={sy} fontSize="10" textAnchor="middle"
                                style={{ animationDelay: `${i * 0.15}s` }} className="sparkle-star">
                                ✦
                            </text>
                        ))}
                    </g>
                )}

                {/* ── Wizard Hat ── */}
                <g className="sage-hat">
                    {/* Hat base brim */}
                    <ellipse cx="50" cy="42" rx="22" ry="5" fill="#1a3d2e" />
                    {/* Hat body */}
                    <polygon points="50,5 33,42 67,42" fill="#2a6048" />
                    {/* Hat stripe */}
                    <line x1="36" y1="33" x2="64" y2="33" stroke="#3FB68C" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Hat star */}
                    <text x="50" y="28" fontSize="8" textAnchor="middle" fill="#D4AF37" className="hat-star">✦</text>
                </g>

                {/* ── Face ── */}
                <ellipse cx="50" cy="62" rx="20" ry="22" fill="#F5DEB3" />
                {/* Cheek blush */}
                <ellipse cx="38" cy="68" rx="5" ry="3" fill="#FFB3BA" opacity="0.5" />
                <ellipse cx="62" cy="68" rx="5" ry="3" fill="#FFB3BA" opacity="0.5" />

                {/* ── Beard ── */}
                <ellipse cx="50" cy="80" rx="14" ry="8" fill="#D0D0D0" />
                <ellipse cx="50" cy="82" rx="10" ry="6" fill="#E0E0E0" />

                {/* ── Eyes ── */}
                {/* Eye whites */}
                <ellipse cx={38 + eyePos.x} cy={58 + eyePos.y} rx="5" ry={blinkEyes ? 0.5 : 4.5} fill="white" />
                <ellipse cx={62 + eyePos.x} cy={58 + eyePos.y} rx="5" ry={blinkEyes ? 0.5 : 4.5} fill="white" />
                {/* Pupils */}
                {!blinkEyes && (
                    <>
                        <circle cx={38 + eyePos.x + 0.5} cy={58 + eyePos.y + 0.5} r="2.5" fill="#2d2d2d" />
                        <circle cx={62 + eyePos.x + 0.5} cy={58 + eyePos.y + 0.5} r="2.5" fill="#2d2d2d" />
                        {/* Eye shine */}
                        <circle cx={39 + eyePos.x} cy={57 + eyePos.y} r="0.8" fill="white" />
                        <circle cx={63 + eyePos.x} cy={57 + eyePos.y} r="0.8" fill="white" />
                    </>
                )}
                {/* Eyebrows */}
                <path
                    d={state === 'error' ? 'M33,52 Q38,55 43,52' : state === 'thinking' ? 'M33,51 Q38,49 43,51' : 'M33,52 Q38,50 43,52'}
                    stroke="#8B7355" strokeWidth="2" fill="none" strokeLinecap="round"
                />
                <path
                    d={state === 'error' ? 'M57,52 Q62,55 67,52' : state === 'thinking' ? 'M57,51 Q62,49 67,51' : 'M57,52 Q62,50 67,52'}
                    stroke="#8B7355" strokeWidth="2" fill="none" strokeLinecap="round"
                />

                {/* ── Mouth ── */}
                {state === 'celebrating' && (
                    <path d="M42,73 Q50,80 58,73" stroke="#8B4513" strokeWidth="2" fill="#FF9999" strokeLinecap="round" />
                )}
                {(state === 'idle' || state === 'welcome' || state === 'explaining') && (
                    <path d="M44,73 Q50,77 56,73" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />
                )}
                {state === 'thinking' && (
                    <path d="M44,74 Q50,73 56,74" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />
                )}
                {state === 'error' && (
                    <path d="M44,76 Q50,72 56,76" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />
                )}

                {/* ── Nose ── */}
                <ellipse cx="50" cy="68" rx="2.5" ry="1.8" fill="#D4A570" />

                {/* ── Body / Robe ── */}
                <path d="M30,88 Q20,130 23,138 H77 Q80,130 70,88 Q60,82 50,82 Q40,82 30,88 Z" fill="#1e4d38" />
                {/* Robe accent */}
                <path d="M50,85 L50,138" stroke="#3FB68C" strokeWidth="1.5" opacity="0.5" />
                {/* Collar */}
                <path d="M38,88 Q50,93 62,88" stroke="#3FB68C" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* ── Arms ── */}
                <path
                    d={state === 'welcome' ? 'M30,95 Q12,80 8,65' : state === 'explaining' ? 'M30,100 Q22,90 30,80' : 'M30,100 Q18,108 20,120'}
                    stroke="#1e4d38" strokeWidth="8" fill="none" strokeLinecap="round"
                    className="sage-left-arm"
                />
                <path
                    d={state === 'explaining' ? 'M70,95 Q85,75 90,68' : 'M70,100 Q82,108 80,120'}
                    stroke="#1e4d38" strokeWidth="8" fill="none" strokeLinecap="round"
                    className="sage-right-arm"
                />

                {/* Hand left */}
                <circle
                    cx={state === 'welcome' ? 8 : state === 'explaining' ? 30 : 20}
                    cy={state === 'welcome' ? 65 : state === 'explaining' ? 80 : 120}
                    r="5" fill="#F5DEB3"
                />
                {/* Hand right — holds staff */}
                <circle
                    cx={state === 'explaining' ? 90 : 80}
                    cy={state === 'explaining' ? 68 : 120}
                    r="5" fill="#F5DEB3"
                />

                {/* ── Staff (when explaining) ── */}
                {(state === 'idle' || state === 'explaining' || state === 'welcome') && (
                    <g className="sage-staff">
                        <line x1="80" y1="100" x2="80" y2="135" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="80" cy="100" r="5" fill="#D4AF37" opacity="0.9" />
                        <text x="80" y="103" fontSize="6" textAnchor="middle" fill="#1a1400">✦</text>
                    </g>
                )}

                {/* ── Thinking dots ── */}
                {state === 'thinking' && (
                    <g className="thinking-indicator">
                        {[0, 1, 2].map(i => (
                            <circle key={i} cx={58 + i * 8} cy="95" r="3" fill="#3FB68C"
                                style={{ animationDelay: `${i * 0.2}s` }}
                                className="thinking-dot"
                            />
                        ))}
                    </g>
                )}
            </svg>
        </div>
    )
}
