/**
 * Home Page - Games Hub
 * 
 * PuzzleCentral - NYT Games-style hub page with tiles for each game
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { DailyChallenge } from '../components/DailyChallenge';
import './Home.css';

interface GameCard {
    id: string;
    name: string;
    description: string;
    path: string;
    icon: React.ReactNode;
    color: string;
}

const games: GameCard[] = [
    {
        id: 'cipher',
        name: 'CIPHER',
        description: 'Decode the hidden phrase by deducing letter substitutions',
        path: '/cipher',
        color: '#538d4e',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <path d="M6.5 6.5h.01M17.5 6.5h.01M6.5 17.5h.01M17.5 17.5h.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: 'gridgram',
        name: 'GRIDGRAM',
        description: 'Build a crossword using all 12 letters',
        path: '/gridgram',
        color: '#6366f1',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
        ),
    },
    {
        id: 'shift',
        name: 'SHIFT',
        description: 'Shift rows and columns to form valid words',
        path: '/shift',
        color: '#10b981',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M4 12h16M12 4v16" />
                <path d="M8 8l-2 4 2 4M16 8l2 4-2 4" />
            </svg>
        ),
    },
    {
        id: 'sort',
        name: 'SORT',
        description: 'Group 16 words into 4 categories of 4',
        path: '/sort',
        color: '#f59e0b',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="8" height="4" rx="1" />
                <rect x="13" y="3" width="8" height="4" rx="1" />
                <rect x="3" y="10" width="8" height="4" rx="1" />
                <rect x="13" y="10" width="8" height="4" rx="1" />
                <rect x="3" y="17" width="8" height="4" rx="1" />
                <rect x="13" y="17" width="8" height="4" rx="1" />
            </svg>
        ),
    },
    {
        id: 'mini',
        name: 'MINI',
        description: 'Quick 5×5 crossword puzzle',
        path: '/mini',
        color: '#8b5cf6',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <rect x="3" y="3" width="6" height="6" fill="currentColor" opacity="0.3" />
            </svg>
        ),
    },
];

import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';

export const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = React.useState(false);

    const handleGameClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setIsAuthOpen(true);
        }
    };

    return (
        <div className="home">
            <Header title="The Daily Littles" onOpenAuth={() => setIsAuthOpen(true)} />

            <main className="home__games">
                <DailyChallenge onOpenAuth={() => setIsAuthOpen(true)} />

                <h3 className="section-title">Today's Littles</h3>
                <div className="game-grid">
                    {games.map((game) => {
                        const isLocked = !isAuthenticated;

                        return (
                            <Link
                                key={game.id}
                                to={game.path}
                                className={`game-card ${isLocked ? 'game-card--locked' : ''}`}
                                style={{ '--card-accent': game.color } as React.CSSProperties}
                                onClick={handleGameClick}
                            >
                                <div className="game-card__icon">
                                    {game.icon}
                                </div>
                                <div className="game-card__content">
                                    <div className="game-card__header">
                                        <h2 className="game-card__name">{game.name}</h2>
                                    </div>
                                    <p className="game-card__description">
                                        {isLocked ? 'Login to access Easy, Medium, and Hard puzzles' :
                                            game.description}
                                    </p>
                                </div>
                                <div className="game-card__arrow">
                                    {isLocked ? (
                                        <span className="game-card__lock-text">
                                            LOGIN
                                        </span>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>

            <footer className="home__footer">
                <p>New Littles daily at 10 AM EST</p>
                <p className="home__footer-copyright">© 2026 The Daily Littles</p>
            </footer>

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                mode="soft"
            />
        </div>
    );
};
