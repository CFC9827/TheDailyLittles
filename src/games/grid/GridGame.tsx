/**
 * GRIDGRAM Game - Word Construction Puzzle
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDailyPuzzle } from './utils/solutionGenerator';
import { validateGrid, type GridPosition } from './utils/gridValidator';
import { calculateScore, type ScoreResult } from './utils/scoring';
import { loadStats, updateStatsOnWin, loadGameProgress, saveGameProgress } from './utils/storage';
import { RulesModal } from '../../components/RulesModal';
import { registerCompletion } from '../../utils/dailyChallenge';
import './GridGame.css';

export const GridGame: React.FC = () => {
    const puzzle = useMemo(() => getDailyPuzzle(), []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const [rackLetters, setRackLetters] = useState<(string | null)[]>(puzzle.letters);
    const [gridPositions, setGridPositions] = useState<GridPosition[]>([]);
    const [selectedRackIndex, setSelectedRackIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [lastScore, setLastScore] = useState<ScoreResult | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [draggedGridPos, setDraggedGridPos] = useState<{ row: number; col: number } | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [stats, setStats] = useState(() => loadStats());
    const timerRef = useRef<number | null>(null);

    // Grid bounds - maintain minimum size from empty state
    const MIN_BOUNDS = { minRow: -3, maxRow: 3, minCol: -5, maxCol: 5 };

    const gridBounds = useMemo(() => {
        if (gridPositions.length === 0) return MIN_BOUNDS;

        const rows = gridPositions.map(p => p.row);
        const cols = gridPositions.map(p => p.col);

        // Expand beyond tiles, but never shrink below minimum
        return {
            minRow: Math.min(MIN_BOUNDS.minRow, Math.min(...rows) - 2),
            maxRow: Math.max(MIN_BOUNDS.maxRow, Math.max(...rows) + 2),
            minCol: Math.min(MIN_BOUNDS.minCol, Math.min(...cols) - 2),
            maxCol: Math.max(MIN_BOUNDS.maxCol, Math.max(...cols) + 2),
        };
    }, [gridPositions]);

    // Current validation
    const validation = useMemo(() => {
        return validateGrid(gridPositions, puzzle.letters);
    }, [gridPositions, puzzle.letters]);

    // Timer
    useEffect(() => {
        if (isStarted && !showResult) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(t => t + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isStarted, showResult]);

    // Load saved progress
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const saved = loadGameProgress(today);
        if (saved && !saved.completed) {
            setGridPositions(saved.gridPositions);
            setRackLetters(saved.letters);
            setElapsedTime(saved.elapsedTime);
            setIsStarted(true);
        }
    }, [puzzle]);

    // Save progress
    useEffect(() => {
        if (isStarted) {
            const today = new Date().toISOString().split('T')[0];
            saveGameProgress({
                gridPositions,
                letters: rackLetters,
                elapsedTime,
                completed: showResult,
                date: today,
            });
        }
    }, [gridPositions, rackLetters, elapsedTime, showResult, isStarted]);

    // Shuffle rack letters
    const shuffleRack = useCallback(() => {
        setRackLetters(prev => {
            const letters = prev.filter(l => l !== null) as string[];
            for (let i = letters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [letters[i], letters[j]] = [letters[j], letters[i]];
            }
            // Rebuild with nulls at end
            const nullCount = prev.filter(l => l === null).length;
            return [...letters, ...Array(nullCount).fill(null)];
        });
    }, []);



    // Handle placing a tile on the grid
    const placeTile = useCallback((row: number, col: number, rackIdx?: number) => {
        const idx = rackIdx ?? selectedRackIndex;
        if (idx === null || rackLetters[idx] === null) return;

        const existing = gridPositions.find(p => p.row === row && p.col === col);
        if (existing) return;

        const letter = rackLetters[idx]!;

        if (!isStarted) setIsStarted(true);
        setGridPositions(prev => [...prev, { row, col, letter }]);
        setRackLetters(prev => {
            const next = [...prev];
            next[idx] = null;
            return next;
        });
        setSelectedRackIndex(null);
        setDraggedIndex(null);
    }, [selectedRackIndex, rackLetters, gridPositions, isStarted]);

    // Remove tile from grid back to rack
    const removeTile = useCallback((row: number, col: number) => {
        const tile = gridPositions.find(p => p.row === row && p.col === col);
        if (!tile) return;

        setGridPositions(prev => prev.filter(p => !(p.row === row && p.col === col)));
        setRackLetters(prev => {
            const emptyIndex = prev.findIndex(l => l === null);
            if (emptyIndex >= 0) {
                const next = [...prev];
                next[emptyIndex] = tile.letter;
                return next;
            }
            return [...prev, tile.letter];
        });
    }, [gridPositions]);

    // Submit solution
    const submitSolution = useCallback(() => {
        const score = calculateScore(validation.words);
        setLastScore(score);
        setShowResult(true);

        const newStats = updateStatsOnWin(score.totalScore);
        setStats(newStats);

        // Register daily challenge completion
        // Score = 1000 - (seconds / 2), min 100
        const timeSeconds = Math.floor(elapsedTime / 1000);
        const normalizedScore = Math.max(100, 1000 - Math.floor(timeSeconds / 2));
        registerCompletion('gridgram', normalizedScore, elapsedTime);
    }, [validation, elapsedTime]);

    // Reset puzzle
    const resetPuzzle = useCallback(() => {
        setRackLetters(puzzle.letters);
        setGridPositions([]);
        setSelectedRackIndex(null);
        setShowResult(false);
        setLastScore(null);
        setElapsedTime(0);
        setIsStarted(false);
    }, [puzzle.letters]);

    // Drag handlers for rack tiles
    const handleRackDragStart = (index: number) => {
        setDraggedIndex(index);
        setDraggedGridPos(null);
    };

    // Drag handlers for grid tiles
    const handleGridDragStart = (row: number, col: number) => {
        setDraggedGridPos({ row, col });
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDraggedGridPos(null);
    };

    const handleDrop = (row: number, col: number) => {
        // Check if cell is already occupied
        const existing = gridPositions.find(p => p.row === row && p.col === col);
        if (existing) return;

        if (draggedIndex !== null) {
            // Dragging from rack
            placeTile(row, col, draggedIndex);
        } else if (draggedGridPos !== null) {
            // Dragging from grid - move the tile
            const tile = gridPositions.find(p => p.row === draggedGridPos.row && p.col === draggedGridPos.col);
            if (tile) {
                setGridPositions(prev =>
                    prev.map(p =>
                        p.row === draggedGridPos.row && p.col === draggedGridPos.col
                            ? { ...p, row, col }
                            : p
                    )
                );
            }
        }
        setDraggedIndex(null);
        setDraggedGridPos(null);
    };

    return (
        <div className="grid-game">
            <header className="grid-game__header">
                <Link to="/" className="grid-game__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="grid-game__title">GRIDGRAM</h1>
                <div className="grid-game__header-actions">
                    <button className="grid-game__header-btn" onClick={() => setShowLeaderboard(true)} title="Leaderboard">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                        </svg>
                    </button>
                    <button className="grid-game__header-btn" onClick={() => setShowStats(true)} title="Statistics">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </button>
                    <button className="grid-game__header-btn" onClick={() => setShowRules(true)} title="How to Play">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                        </svg>
                    </button>
                </div>
            </header>
            <main className="grid-game__main">
                <div className="grid-game__puzzle-info">
                    <span className="grid-game__puzzle-number">Little #{puzzle.puzzleNumber}</span>
                </div>

                <div className="grid-game__controls">
                    <button className="grid-game__control-btn" onClick={shuffleRack} title="Shuffle Letters">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 3 21 3 21 8"></polyline>
                            <line x1="4" y1="20" x2="21" y2="3"></line>
                            <polyline points="21 16 21 21 16 21"></polyline>
                            <line x1="15" y1="15" x2="21" y2="21"></line>
                            <line x1="4" y1="4" x2="9" y2="9"></line>
                        </svg>
                        Shuffle
                    </button>
                    <button className="grid-game__control-btn" onClick={resetPuzzle} title="Clear Board and Restart">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Clear Board
                    </button>
                </div>

                <div className="grid-game__rack">
                    {rackLetters.map((letter, index) => (
                        <button
                            key={index}
                            className={`grid-game__rack-tile ${letter === null ? 'grid-game__rack-tile--empty' : ''} ${selectedRackIndex === index ? 'grid-game__rack-tile--selected' : ''} ${draggedIndex === index ? 'grid-game__rack-tile--dragging' : ''}`}
                            onClick={() => letter !== null && setSelectedRackIndex(selectedRackIndex === index ? null : index)}
                            disabled={letter === null}
                            draggable={letter !== null}
                            onDragStart={() => letter !== null && handleRackDragStart(index)}
                            onDragEnd={handleDragEnd}
                        >
                            {letter || ''}
                        </button>
                    ))}
                </div>

                {selectedRackIndex !== null && (
                    <p className="grid-game__hint">Tap a grid cell to place the letter</p>
                )}

                <div className="grid-game__board">
                    {Array.from({ length: gridBounds.maxRow - gridBounds.minRow + 1 }).map((_, rowIdx) => {
                        const row = gridBounds.minRow + rowIdx;
                        return (
                            <div key={row} className="grid-game__row">
                                {Array.from({ length: gridBounds.maxCol - gridBounds.minCol + 1 }).map((_, colIdx) => {
                                    const col = gridBounds.minCol + colIdx;
                                    const tile = gridPositions.find(p => p.row === row && p.col === col);
                                    return (
                                        <button
                                            key={col}
                                            className={`grid-game__cell ${tile ? 'grid-game__cell--filled' : ''} ${draggedGridPos?.row === row && draggedGridPos?.col === col ? 'grid-game__cell--dragging' : ''}`}
                                            onClick={() => tile ? removeTile(row, col) : placeTile(row, col)}
                                            draggable={!!tile}
                                            onDragStart={() => tile && handleGridDragStart(row, col)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => { e.preventDefault(); }}
                                            onDrop={(e) => { e.preventDefault(); handleDrop(row, col); }}
                                        >
                                            {tile?.letter || ''}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                <div className="grid-game__status">
                    <div className="grid-game__stat">
                        <span className="grid-game__stat-label">Words</span>
                        <span className="grid-game__stat-value">{validation.words.length}</span>
                    </div>
                    <div className="grid-game__stat">
                        <span className="grid-game__stat-label">Letters Used</span>
                        <span className="grid-game__stat-value">{gridPositions.length}/{puzzle.letters.length}</span>
                    </div>
                    {validation.invalidWords.length > 0 && (
                        <div className="grid-game__invalid">
                            Invalid: {validation.invalidWords.join(', ')}
                        </div>
                    )}
                </div>

                <button
                    className="grid-game__submit"
                    onClick={submitSolution}
                    disabled={!validation.isValid}
                >
                    {validation.isValid ? 'Submit Solution' :
                        !validation.allLettersUsed ? 'Use All Letters' :
                            !validation.isConnected ? 'Grid Must Be Connected' :
                                validation.invalidWords.length > 0 ? 'Fix Invalid Words' : 'Build Your Grid'}
                </button>
            </main>

            {/* Result Modal */}
            {showResult && lastScore && (
                <div className="grid-game__modal-overlay" onClick={() => setShowResult(false)}>
                    <div className="grid-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>🎉 Solved!</h2>
                        <div className="grid-game__score-display">
                            <div className="grid-game__score-large">{lastScore.totalScore}</div>
                            <div className="grid-game__score-time">in {formatTime(elapsedTime)}</div>
                        </div>
                        <div className="grid-game__score-details">
                            <p>Words: {lastScore.wordCount}</p>
                            <p>Longest: {lastScore.longestWord}</p>
                        </div>
                        <button className="grid-game__modal-close" onClick={() => setShowResult(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Modal */}
            {showStats && (
                <div className="grid-game__modal-overlay" onClick={() => setShowStats(false)}>
                    <div className="grid-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>Statistics</h2>
                        <div className="grid-game__stats-grid">
                            <div className="grid-game__stat-item">
                                <span className="grid-game__stat-value">{stats.gamesWon}</span>
                                <span className="grid-game__stat-label">Played</span>
                            </div>
                            <div className="grid-game__stat-item">
                                <span className="grid-game__stat-value">{stats.currentStreak}</span>
                                <span className="grid-game__stat-label">Streak</span>
                            </div>
                            <div className="grid-game__stat-item">
                                <span className="grid-game__stat-value">{stats.maxStreak}</span>
                                <span className="grid-game__stat-label">Max Streak</span>
                            </div>
                        </div>
                        <div className="grid-game__stats-bests">
                            <div className="grid-game__best-row">
                                <span>Best Score:</span>
                                <span>{stats.bestScore || 0}</span>
                            </div>
                            <div className="grid-game__best-row">
                                <span>Total Points:</span>
                                <span>{stats.totalScore}</span>
                            </div>
                        </div>
                        <button className="grid-game__modal-close" onClick={() => setShowStats(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <div className="grid-game__modal-overlay" onClick={() => setShowLeaderboard(false)}>
                    <div className="grid-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>Daily Leaderboard</h2>
                        <p className="grid-game__leaderboard-date">Today's Rankings</p>
                        <div className="grid-game__leaderboard">
                            {[
                                { name: "GridGod", score: 2450, words: 12, streak: 8 },
                                { name: "WordSmith", score: 2100, words: 10, streak: 4 },
                                { name: "TileTinker", score: 1850, words: 9, streak: 6 },
                                { name: "LetterLex", score: 1600, words: 8, streak: 2 },
                                { name: "AlphaBee", score: 1450, words: 7, streak: 11 }
                            ].map((entry, i) => (
                                <div key={i} className="grid-game__leaderboard-entry">
                                    <span className="grid-game__rank">{i + 1}</span>
                                    <span className="grid-game__leader-name">{entry.name}</span>
                                    <span className="grid-game__leader-score">{entry.score}</span>
                                    <span className="grid-game__leader-streak">🔥{entry.streak}</span>
                                </div>
                            ))}
                        </div>
                        <p className="grid-game__leaderboard-footer">Complete today's puzzle to join!</p>
                        <button className="grid-game__modal-close" onClick={() => setShowLeaderboard(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <RulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="GRIDGRAM"
                rules={[
                    {
                        title: "Goal",
                        description: "Connect all your letters into a single grid of valid words."
                    },
                    {
                        title: "Placement",
                        description: "Drag letters from the rack to the grid. Tap a grid cell to remove the letter."
                    },
                    {
                        title: "Connection",
                        description: "All letters must be connected horizontally or vertically into a single cohesive structure."
                    },
                    {
                        title: "Validation",
                        description: "Every sequence of 2 or more letters horizontally or vertically must form a valid English word."
                    },
                    {
                        title: "Scoring",
                        description: "Longer words and using all your letters earns more points!"
                    }
                ]}
            />
        </div>
    );
};
