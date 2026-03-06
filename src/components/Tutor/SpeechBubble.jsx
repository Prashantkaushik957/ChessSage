import React, { useState, useEffect, useRef } from 'react'
import './SpeechBubble.css'

export function SpeechBubble({ message, visible, side = 'right' }) {
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!visible || !message) {
            setDisplayText('')
            return
        }

        // Typewriter effect
        setIsTyping(true)
        setDisplayText('')
        let i = 0
        clearInterval(timerRef.current)

        timerRef.current = setInterval(() => {
            if (i < message.length) {
                setDisplayText(message.slice(0, i + 1))
                i++
            } else {
                setIsTyping(false)
                clearInterval(timerRef.current)
            }
        }, 28)

        return () => clearInterval(timerRef.current)
    }, [message, visible])

    if (!visible) return null

    return (
        <div className={`speech-bubble speech-bubble--${side} animate-fade-up`}>
            <div className="speech-bubble__content">
                <p>{displayText}{isTyping && <span className="speech-cursor">|</span>}</p>
            </div>
            <div className={`speech-bubble__tail speech-bubble__tail--${side}`} />
        </div>
    )
}
