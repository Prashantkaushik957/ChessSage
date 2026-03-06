import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/UI/Sidebar'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Puzzles } from './pages/Puzzles'
import { Lessons } from './pages/Lessons'
import { Analysis } from './pages/Analysis'
import { Settings } from './pages/Settings'
import { useGameStore, useProgressStore } from './store/useGameStore'
import './App.css'

function App() {
    const [currentPage, setCurrentPage] = useState('home')
    const { loadSettings } = useGameStore()
    const { loadProgress } = useProgressStore()

    useEffect(() => {
        // Load persisted settings from electron-store on startup
        loadSettings()
        loadProgress()
    }, [])

    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <Home onNavigate={setCurrentPage} />
            case 'game': return <Game />
            case 'puzzles': return <Puzzles />
            case 'lessons': return <Lessons />
            case 'analysis': return <Analysis />
            case 'settings': return <Settings />
            default: return <Home onNavigate={setCurrentPage} />
        }
    }

    return (
        <div className="app-layout">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <div className="main-content">
                <div className="titlebar-drag" />
                <div className="page-wrapper">
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}

export default App
