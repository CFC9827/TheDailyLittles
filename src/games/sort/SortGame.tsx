/**
 * SORT - Daily Word Grouping Puzzle
 * 
 * Group 16 words into 4 categories of 4
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSort } from './hooks/useSort';
import { shareResult } from './utils/share';
import { loadStats } from './utils/storage';
import { RulesModal } from '../../components/RulesModal';
import './SortGame.css';

// Difficulty colors
const DIFFICULTY_COLORS: Record<number, string> = {
    1: '#f9df6d', // Yellow
    2: '#a0c35a', // Green
    3: '#b0c4ef', // Blue
    4: '#ba81c5', // Purple
};

export const SortGame: React.FC = () => {
    const {
        puzzleNumber,
        words,
        selectedWords,
        solvedGroups,
        mistakes,
        maxMistakes,
        isComplete,
        elapsedTime,
        shakeWords,
        isLost,
        toggleWord,
        clearSelection,
        submitGuess,
        shuffleWords,
    } = useSort();

    const [showRules, setShowRules] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [copied, setCopied] = useState(false);
    const stats = loadStats();

    // Show completion modal when game ends
    React.useEffect(() => {
        if (isComplete) {
            setTimeout(() => setShowCompletion(true), 500);
        }
    }, [isComplete]);

    const handleShare = async () => {
        const result = await shareResult({
            puzzleNumber,
            solvedGroups,
            mistakes,
            elapsedTime,
            won: !isLost,
        });

        if (result.success && result.method === 'copy') {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="sort-game">
            <header className="sort-game__header">
                <Link to="/" className="sort-game__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="sort-game__title">SORT</h1>
                <div className="sort-game__header-actions">
                    <button className="sort-game__header-btn" onClick={() => setShowStats(true)} title="Statistics">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </button>
                    <button className="sort-game__header-btn" onClick={() => setShowRules(true)} title="How to Play">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="sort-game__main">
                <div className="sort-game__info">
                    <span className="sort-game__puzzle-number">Little #{puzzleNumber}</span>
                    <span className="sort-game__timer">{formatTime(elapsedTime)}</span>
                </div>

                {/* Mistake tracker */}
                <div className="sort-game__mistakes">
                    <span>Mistakes remaining:</span>
                    <div className="sort-game__mistake-dots">
                        {Array.from({ length: maxMistakes }).map((_, i) => (
                            <span
                                key={i}
                                className={`sort-game__mistake-dot ${i < maxMistakes - mistakes ? 'sort-game__mistake-dot--active' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Solved groups */}
                <div className="sort-game__solved-groups">
                    {solvedGroups
                        .sort((a, b) => a.solvedOrder - b.solvedOrder)
                        .map((group, index) => (
                            <div
                                key={index}
                                className="sort-game__solved-group"
                                style={{ backgroundColor: DIFFICULTY_COLORS[group.difficulty] }}
                            >
                                <div className="sort-game__group-category">{group.category}</div>
                                <div className="sort-game__group-words">
                                    {group.words.join(', ')}
                                </div>
                            </div>
                        ))}
                </div>

                {/* Word grid */}
                {words.length > 0 && (
                    <div className={`sort-game__grid ${shakeWords ? 'sort-game__grid--shake' : ''}`}>
                        {words.map((word, index) => (
                            <button
                                key={`${word}-${index}`}
                                className={`sort-game__word ${selectedWords.includes(word) ? 'sort-game__word--selected' : ''
                                    }`}
                                onClick={() => toggleWord(word)}
                                disabled={isComplete}
                            >
                                {word}
                            </button>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
                {!isComplete && (
                    <div className="sort-game__actions">
                        <button
                            className="sort-game__action-btn sort-game__action-btn--secondary"
                            onClick={shuffleWords}
                        >
                            Shuffle
                        </button>
                        <button
                            className="sort-game__action-btn sort-game__action-btn--secondary"
                            onClick={clearSelection}
                            disabled={selectedWords.length === 0}
                        >
                            Deselect All
                        </button>
                        <button
                            className="sort-game__action-btn sort-game__action-btn--primary"
                            onClick={submitGuess}
                            disabled={selectedWords.length !== 4}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </main>

            {/* Completion Modal */}
            {showCompletion && (
                <div className="sort-game__modal-overlay" onClick={() => setShowCompletion(false)}>
                    <div className="sort-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>{isLost ? '😔 Game Over' : '🎉 Solved!'}</h2>

                        <div className="sort-game__result">
                            <div className="sort-game__result-item">
                                <span className="sort-game__result-label">Time</span>
                                <span className="sort-game__result-value">{formatTime(elapsedTime)}</span>
                            </div>
                            <div className="sort-game__result-item">
                                <span className="sort-game__result-label">Mistakes</span>
                                <span className="sort-game__result-value">{mistakes}/{maxMistakes}</span>
                            </div>
                        </div>

                        {/* Emoji grid preview */}
                        <div className="sort-game__share-preview">
                            {solvedGroups
                                .sort((a, b) => a.solvedOrder - b.solvedOrder)
                                .map((group, i) => (
                                    <div key={i} className="sort-game__share-row">
                                        {Array.from({ length: 4 }).map((_, j) => (
                                            <span
                                                key={j}
                                                className="sort-game__share-emoji"
                                                style={{ backgroundColor: DIFFICULTY_COLORS[group.difficulty] }}
                                            />
                                        ))}
                                    </div>
                                ))}
                        </div>

                        <div className="sort-game__modal-actions">
                            <button className="sort-game__share-btn" onClick={handleShare}>
                                {copied ? 'Copied!' : 'Share Result'}
                            </button>
                            <button className="sort-game__close-btn" onClick={() => setShowCompletion(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rules Modal */}
            <RulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="SORT"
                rules={[
                    {
                        title: "Goal",
                        description: "Find groups of 4 words that share something in common."
                    },
                    {
                        title: "Selection",
                        description: "Tap words to select them. Select 4 words, then tap Submit to check your guess."
                    },
                    {
                        title: "Categories",
                        description: "Each group has a hidden category like synonyms, prefixes, rhymes, or word patterns."
                    },
                    {
                        title: "Difficulty",
                        description: "Categories range from straightforward (yellow) to tricky (purple)."
                    },
                    {
                        title: "Mistakes",
                        description: "You have 4 chances. Use them wisely!"
                    }
                ]}
            />

            {/* Stats Modal */}
            {showStats && (
                <div className="sort-game__modal-overlay" onClick={() => setShowStats(false)}>
                    <div className="sort-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>Statistics</h2>
                        <div className="sort-game__stats-grid">
                            <div className="sort-game__stat-item">
                                <span className="sort-game__stat-value">{stats.gamesPlayed}</span>
                                <span className="sort-game__stat-label">Played</span>
                            </div>
                            <div className="sort-game__stat-item">
                                <span className="sort-game__stat-value">
                                    {stats.gamesPlayed > 0
                                        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                                        : 0}%
                                </span>
                                <span className="sort-game__stat-label">Win Rate</span>
                            </div>
                            <div className="sort-game__stat-item">
                                <span className="sort-game__stat-value">{stats.currentStreak}</span>
                                <span className="sort-game__stat-label">Streak</span>
                            </div>
                            <div className="sort-game__stat-item">
                                <span className="sort-game__stat-value">{stats.maxStreak}</span>
                                <span className="sort-game__stat-label">Max Streak</span>
                            </div>
                        </div>
                        <div className="sort-game__stats-row">
                            <span>Perfect Games (0 mistakes):</span>
                            <span>{stats.perfectGames}</span>
                        </div>
                        <button className="sort-game__close-btn" onClick={() => setShowStats(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
