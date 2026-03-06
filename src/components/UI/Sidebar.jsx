import React, { useState } from 'react'
import { useProgressStore } from '../../store/useGameStore'
import './Sidebar.css'

const NAV_ITEMS = [
    { id: 'home', icon: '🏠', label: 'Home', page: 'home' },
    { id: 'game', icon: '♟️', label: 'Play', page: 'game' },
    { id: 'puzzles', icon: '🧩', label: 'Puzzles', page: 'puzzles' },
    { id: 'lessons', icon: '📚', label: 'Lessons', page: 'lessons' },
    { id: 'analysis', icon: '📊', label: 'Analysis', page: 'analysis' },
    { id: 'settings', icon: '⚙️', label: 'Settings', page: 'settings' },
]

export function Sidebar({ currentPage, onNavigate }) {
    const { userElo } = useProgressStore()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar__logo" onClick={() => onNavigate('home')}>
                <span className="sidebar__logo-icon">♔</span>
                {!collapsed && <span className="sidebar__logo-text font-display">ChessSage</span>}
            </div>

            {/* Nav */}
            <nav className="sidebar__nav">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar__nav-item ${currentPage === item.page ? 'sidebar__nav-item--active' : ''}`}
                        onClick={() => onNavigate(item.page)}
                        title={collapsed ? item.label : ''}
                    >
                        <span className="sidebar__nav-icon">{item.icon}</span>
                        {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* ELO Badge */}
            {!collapsed && (
                <div className="sidebar__elo">
                    <div className="elo-badge">
                        <span className="elo-badge__label">Your Rating</span>
                        <span className="elo-badge__value text-gold font-display">{userElo}</span>
                    </div>
                </div>
            )}

            {/* Collapse button */}
            <button className="sidebar__collapse-btn" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
                {collapsed ? '›' : '‹'}
            </button>
        </aside>
    )
}
