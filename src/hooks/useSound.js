import { useCallback, useRef, useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'

export function useSound() {
    const { soundEnabled } = useGameStore()

    const basePath = import.meta.env.BASE_URL
    const soundsRef = useRef({
        move: new Audio(`${basePath}sounds/move.mp3`),
        capture: new Audio(`${basePath}sounds/capture.mp3`),
        check: new Audio(`${basePath}sounds/check.mp3`),
        gameEnd: new Audio(`${basePath}sounds/game-end.mp3`)
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
