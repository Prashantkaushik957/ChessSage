import { useCallback, useRef, useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'

export function useSound() {
    const { soundEnabled } = useGameStore()

    // We use refs to keep the audio objects in memory so they play instantly
    const soundsRef = useRef({
        move: new Audio('/sounds/move.mp3'),
        capture: new Audio('/sounds/capture.mp3'),
        check: new Audio('/sounds/check.mp3'),
        gameEnd: new Audio('/sounds/game-end.mp3')
    })

    // Preload them
    useEffect(() => {
        Object.values(soundsRef.current).forEach(audio => {
            audio.load()
        })
    }, [])

    const playSound = useCallback((type) => {
        if (!soundEnabled) return

        const audio = soundsRef.current[type]
        if (audio) {
            // Reset to start so it can play rapidly in succession
            audio.currentTime = 0
            audio.play().catch(e => console.log('Audio play failed:', e))
        }
    }, [soundEnabled])

    return { playSound }
}
