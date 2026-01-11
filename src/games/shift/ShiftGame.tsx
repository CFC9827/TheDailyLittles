/**
 * SHIFT - Spatial Word-Logic Puzzle
 * 
 * Shift rows and columns to align letters into valid words
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    getDailyPuzzle,
    shiftRow,
    shiftColumn,
    checkAllRowsValid,
    isRowValid,
    type Difficulty,
    type ShiftPuzzle,
} from './utils/puzzleGenerator';
import { loadStats, updateStatsOnWin, loadGameProgress, saveGameProgress } from './utils/storage';
import { RulesModal } from '../../components/RulesModal';
import { registerCompletion } from '../../utils/dailyChallenge';
import './ShiftGame.css';

export const ShiftGame: React.FC = () => {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [puzzle, setPuzzle] = useState<ShiftPuzzle>(() => getDailyPuzzle('easy'));
    const [grid, setGrid] = useState<string[][]>(puzzle.grid);
    const [moves, setMoves] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [stats, setStats] = useState(() => loadStats());
    const timerRef = useRef<number | null>(null);

    const handleWin = useCallback((finalTime: number, finalMoves: number) => {
        setIsComplete(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const newStats = updateStatsOnWin(difficulty, finalTime, finalMoves);
        setStats(newStats);

        // Register daily challenge completion
        // Score = 1000 - (seconds / 2), min 100
        const timeSeconds = Math.floor(finalTime); // elapsedTime is already in seconds
        const normalizedScore = Math.max(100, 1000 - Math.floor(timeSeconds / 2));
        registerCompletion('shift', normalizedScore, finalTime);

        setTimeout(() => setShowCompletion(true), 300);
    }, [difficulty]);

    // Check for win
    useEffect(() => {
        if (isStarted && !isComplete && checkAllRowsValid(grid)) {
            handleWin(elapsedTime, moves);
        }
    }, [grid, isStarted, isComplete, elapsedTime, moves, handleWin]);

    // Timer
    useEffect(() => {
        if (isStarted && !isComplete) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(t => t + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isStarted, isComplete]);

    // Load saved progress
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const saved = loadGameProgress(today, difficulty);
        if (saved && !saved.completed) {
            setGrid(saved.grid);
            setMoves(saved.moves);
            setElapsedTime(saved.elapsedTime);
            setIsStarted(true);
        }
    }, [difficulty]);

    // Save progress
    useEffect(() => {
        if (isStarted) {
            const today = new Date().toISOString().split('T')[0];
            saveGameProgress({
                grid,
                moves,
                elapsedTime,
                completed: isComplete,
                date: today,
                difficulty,
            });
        }
    }, [grid, moves, elapsedTime, isComplete, isStarted, difficulty]);

    // Change difficulty
    const changeDifficulty = useCallback((newDiff: Difficulty) => {
        if (newDiff === difficulty) return;
        setDifficulty(newDiff);
        const newPuzzle = getDailyPuzzle(newDiff);
        setPuzzle(newPuzzle);
        setGrid(newPuzzle.grid);
        setMoves(0);
        setElapsedTime(0);
        setIsStarted(false);
        setIsComplete(false);
        setShowCompletion(false);
    }, [difficulty]);

    // Shift handlers
    const handleShiftRow = useCallback((row: number, direction: 'left' | 'right') => {
        if (isComplete) return;
        if (!isStarted) setIsStarted(true);
        setGrid(g => shiftRow(g, row, direction));
        setMoves(m => m + 1);
    }, [isComplete, isStarted]);

    const handleShiftColumn = useCallback((col: number, direction: 'up' | 'down') => {
        if (isComplete) return;
        if (!isStarted) setIsStarted(true);
        setGrid(g => shiftColumn(g, col, direction));
        setMoves(m => m + 1);
    }, [isComplete, isStarted]);

    // Reset board to initial scrambled state (keep timer running)
    const resetBoard = useCallback(() => {
        setGrid(puzzle.grid);
        setMoves(0);
    }, [puzzle.grid]);

    // Format time
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Share result
    const handleShare = useCallback(async () => {
        const text = `The Daily Littles — Shift\nLittle #${puzzle.puzzleNumber}\n⏱ ${formatTime(elapsedTime)} • ${moves} moves`;

        if (navigator.share) {
            await navigator.share({ text });
        } else {
            await navigator.clipboard.writeText(text);
        }
    }, [puzzle.puzzleNumber, difficulty, elapsedTime, moves]);

    return (
        <div className="shift-game">
            <header className="shift-game__header">
                <Link to="/" className="shift-game__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="shift-game__title">SHIFT</h1>
                <div className="shift-game__header-actions">
                    <button className="shift-game__header-btn" onClick={() => setShowLeaderboard(true)} title="Leaderboard">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                        </svg>
                    </button>
                    <button className="shift-game__header-btn" onClick={() => setShowStats(true)} title="Statistics">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </button>
                    <button className="shift-game__header-btn" onClick={() => setShowRules(true)} title="How to Play">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="shift-game__main">
                {/* Difficulty Selector */}
                <div className="shift-game__difficulty">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                        <button
                            key={d}
                            className={`shift-game__diff-btn ${difficulty === d ? 'shift-game__diff-btn--active' : ''}`}
                            onClick={() => changeDifficulty(d)}
                        >
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Puzzle Number */}
                <div className="shift-game__puzzle-number">Little #{puzzle.puzzleNumber}</div>

                {/* Stats Bar */}
                <div className="shift-game__info">
                    <div className="shift-game__stat">
                        <span className="shift-game__stat-label">Time</span>
                        <span className="shift-game__stat-value">{formatTime(elapsedTime)}</span>
                    </div>
                    <div className="shift-game__stat">
                        <span className="shift-game__stat-label">Moves</span>
                        <span className="shift-game__stat-value">{moves}</span>
                    </div>
                </div>

                {/* Reset Button */}
                <button className="shift-game__reset-btn" onClick={resetBoard} disabled={isComplete}>
                    Reset Board
                </button>

                {/* Grid */}
                <div className="shift-game__grid-container">
                    {/* Column shift buttons (top) */}
                    <div className="shift-game__col-controls shift-game__col-controls--top">
                        {grid[0].map((_, col) => (
                            <button
                                key={col}
                                className="shift-game__shift-btn"
                                onClick={() => handleShiftColumn(col, 'up')}
                                disabled={isComplete}
                            >
                                ▲
                            </button>
                        ))}
                    </div>

                    {/* Grid rows with side controls */}
                    {grid.map((row, rowIdx) => (
                        <div key={rowIdx} className="shift-game__grid-row">
                            <button
                                className="shift-game__shift-btn"
                                onClick={() => handleShiftRow(rowIdx, 'left')}
                                disabled={isComplete}
                            >
                                ◀
                            </button>

                            <div className={`shift-game__word-row ${isRowValid(grid, rowIdx) ? 'shift-game__word-row--valid' : ''}`}>
                                {row.map((letter, colIdx) => (
                                    <div key={colIdx} className="shift-game__cell">
                                        {letter}
                                    </div>
                                ))}
                            </div>

                            <button
                                className="shift-game__shift-btn"
                                onClick={() => handleShiftRow(rowIdx, 'right')}
                                disabled={isComplete}
                            >
                                ▶
                            </button>
                        </div>
                    ))}

                    {/* Column shift buttons (bottom) */}
                    <div className="shift-game__col-controls shift-game__col-controls--bottom">
                        {grid[0].map((_, col) => (
                            <button
                                key={col}
                                className="shift-game__shift-btn"
                                onClick={() => handleShiftColumn(col, 'down')}
                                disabled={isComplete}
                            >
                                ▼
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Completion Modal */}
            {showCompletion && (
                <div className="shift-game__modal-overlay" onClick={() => setShowCompletion(false)}>
                    <div className="shift-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>🎉 Solved!</h2>
                        <div className="shift-game__result">
                            <div className="shift-game__result-item">
                                <span className="shift-game__result-label">Time</span>
                                <span className="shift-game__result-value">{formatTime(elapsedTime)}</span>
                            </div>
                            <div className="shift-game__result-item">
                                <span className="shift-game__result-label">Moves</span>
                                <span className="shift-game__result-value">{moves}</span>
                            </div>
                        </div>
                        <div className="shift-game__solution">
                            {grid.map((row, i) => (
                                <div key={i} className="shift-game__solution-word">{row.join('')}</div>
                            ))}
                        </div>
                        <div className="shift-game__modal-actions">
                            <button className="shift-game__share-btn" onClick={handleShare}>
                                Share Result
                            </button>
                            <button className="shift-game__close-btn" onClick={() => setShowCompletion(false)}>
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
                title="SHIFT"
                rules={[
                    {
                        title: "Goal",
                        description: "Make every row a valid English word."
                    },
                    {
                        title: "Row Shifts",
                        description: "Press ◀ or ▶ to slide a row left or right. Letters wrap around."
                    },
                    {
                        title: "Column Shifts",
                        description: "Press ▲ or ▼ to slide a column up or down. Letters wrap around and move to different rows."
                    },
                    {
                        title: "Valid Words",
                        description: "When a row forms a valid word, it glows green."
                    },
                    {
                        title: "Tip",
                        description: "Column shifts are the key! They move letters between rows to put them where you need them."
                    }
                ]}
            />

            {/* Stats Modal */}
            {showStats && (
                <div className="shift-game__modal-overlay" onClick={() => setShowStats(false)}>
                    <div className="shift-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>Statistics</h2>
                        <div className="shift-game__stats-grid">
                            <div className="shift-game__stat-item">
                                <span className="shift-game__stat-value">{stats.gamesWon}</span>
                                <span className="shift-game__stat-label">Played</span>
                            </div>
                            <div className="shift-game__stat-item">
                                <span className="shift-game__stat-value">{stats.currentStreak}</span>
                                <span className="shift-game__stat-label">Streak</span>
                            </div>
                            <div className="shift-game__stat-item">
                                <span className="shift-game__stat-value">{stats.maxStreak}</span>
                                <span className="shift-game__stat-label">Max Streak</span>
                            </div>
                        </div>
                        <div className="shift-game__stats-bests">
                            <h3>Personal Bests</h3>
                            <div className="shift-game__best-row">
                                <span>Easy:</span>
                                <span>{formatTime(stats.bestTime.easy || 0)} ({stats.bestMoves.easy || 0} moves)</span>
                            </div>
                            <div className="shift-game__best-row">
                                <span>Medium:</span>
                                <span>{formatTime(stats.bestTime.medium || 0)} ({stats.bestMoves.medium || 0} moves)</span>
                            </div>
                            <div className="shift-game__best-row">
                                <span>Hard:</span>
                                <span>{formatTime(stats.bestTime.hard || 0)} ({stats.bestMoves.hard || 0} moves)</span>
                            </div>
                        </div>
                        <button className="shift-game__close-btn" onClick={() => setShowStats(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <div className="shift-game__modal-overlay" onClick={() => setShowLeaderboard(false)}>
                    <div className="shift-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>Daily Leaderboard</h2>
                        <p className="shift-game__leaderboard-date">Today's Rankings</p>
                        <div className="shift-game__leaderboard">
                            {[
                                { name: "WordWiz", time: "0:28", moves: 14, streak: 12 },
                                { name: "LetterMaster", time: "0:35", moves: 18, streak: 5 },
                                { name: "LogicKing", time: "0:42", moves: 22, streak: 8 },
                                { name: "PuzzlePro", time: "0:58", moves: 31, streak: 3 },
                                { name: "ShiftExpert", time: "1:05", moves: 36, streak: 15 }
                            ].map((entry, i) => (
                                <div key={i} className="shift-game__leaderboard-entry">
                                    <span className="shift-game__rank">{i + 1}</span>
                                    <span className="shift-game__leader-name">{entry.name}</span>
                                    <span className="shift-game__leader-time">{entry.time}</span>
                                    <span className="shift-game__leader-streak">🔥{entry.streak}</span>
                                </div>
                            ))}
                        </div>
                        <p className="shift-game__leaderboard-footer">Complete today's puzzle to join!</p>
                        <button className="shift-game__close-btn" onClick={() => setShowLeaderboard(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
