/**
 * Mini Crossword Game
 * 
 * 5×5 daily crossword with clean clues
 */

import React, { useState, useEffect } from 'react';
import { useMini } from './hooks/useMini';
import { shareResult } from './utils/share';
import { loadStats } from './utils/storage';
import { RulesModal } from '../../components/RulesModal';
import { Header } from '../../components/Header';
import './MiniGame.css';

export const MiniGame: React.FC = () => {
    const {
        puzzle,
        playerGrid,
        selectedCell,
        direction,
        isComplete,
        elapsedTime,
        currentClue,
        currentWordCells,
        cellNumbers,
        selectCell,
        inputLetter,
        deleteLetter,
        moveSelection,
        jumpToClue,
        setDirection,
    } = useMini();

    const [showRules, setShowRules] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [copied, setCopied] = useState(false);
    const stats = loadStats();

    // Show completion modal
    useEffect(() => {
        if (isComplete) {
            setTimeout(() => setShowCompletion(true), 300);
        }
    }, [isComplete]);

    // Keyboard handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isComplete) return;
            if (showRules || showStats) return;

            // Letters
            if (/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                inputLetter(e.key);
                return;
            }

            // Backspace
            if (e.key === 'Backspace') {
                e.preventDefault();
                deleteLetter();
                return;
            }

            // Arrow keys
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSelection('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSelection('down');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveSelection('left');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveSelection('right');
            }

            // Tab to switch direction
            if (e.key === 'Tab') {
                e.preventDefault();
                setDirection(d => d === 'across' ? 'down' : 'across');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isComplete, showRules, showStats, inputLetter, deleteLetter, moveSelection, setDirection]);

    const handleShare = async () => {
        const result = await shareResult({
            puzzleNumber: puzzle.puzzleNumber,
            solveTime: elapsedTime,
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

    // Check if cell is in current word
    const isInCurrentWord = (row: number, col: number): boolean => {
        return currentWordCells.some(c => c.row === row && c.col === col);
    };

    return (
        <div className="mini-game">
            <Header
                title="MINI"
                showBack
            />

            <main className="mini-game__main">
                <div className="mini-game__info">
                    <span className="mini-game__puzzle-number">Little #{puzzle.puzzleNumber}</span>
                    <span className="mini-game__timer">{formatTime(elapsedTime)}</span>
                </div>

                {/* Current clue display */}
                <div className="mini-game__current-clue">
                    {currentClue ? (
                        <>
                            <span className="mini-game__clue-number">{currentClue.number}{direction === 'across' ? 'A' : 'D'}</span>
                            <span className="mini-game__clue-text">{currentClue.clue}</span>
                        </>
                    ) : (
                        <span className="mini-game__clue-text mini-game__clue-text--placeholder">
                            Click a cell to start
                        </span>
                    )}
                </div>

                {/* Crossword grid */}
                <div className="mini-game__grid">
                    {puzzle.grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="mini-game__row">
                            {row.map((_cell, colIndex) => {
                                const isBlack = puzzle.grid[rowIndex][colIndex] === null;
                                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                                const isWordCell = isInCurrentWord(rowIndex, colIndex);
                                const cellNumber = cellNumbers.get(`${rowIndex},${colIndex}`);
                                const playerLetter = playerGrid[rowIndex]?.[colIndex] || '';

                                return (
                                    <button
                                        key={colIndex}
                                        className={`mini-game__cell ${isBlack ? 'mini-game__cell--black' : ''
                                            } ${isSelected ? 'mini-game__cell--selected' : ''} ${isWordCell && !isSelected ? 'mini-game__cell--word' : ''
                                            }`}
                                        onClick={() => !isBlack && selectCell(rowIndex, colIndex)}
                                        disabled={isBlack}
                                    >
                                        {cellNumber && (
                                            <span className="mini-game__cell-number">{cellNumber}</span>
                                        )}
                                        <span className="mini-game__cell-letter">{playerLetter}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Clue lists */}
                <div className="mini-game__clues">
                    <div className="mini-game__clue-section">
                        <h3 className="mini-game__clue-heading">Across</h3>
                        <ul className="mini-game__clue-list">
                            {puzzle.clues.across.map(clue => (
                                <li
                                    key={clue.number}
                                    className={`mini-game__clue-item ${currentClue?.number === clue.number && direction === 'across'
                                        ? 'mini-game__clue-item--active'
                                        : ''
                                        }`}
                                    onClick={() => jumpToClue(clue, 'across')}
                                >
                                    <span className="mini-game__clue-num">{clue.number}</span>
                                    <span>{clue.clue}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mini-game__clue-section">
                        <h3 className="mini-game__clue-heading">Down</h3>
                        <ul className="mini-game__clue-list">
                            {puzzle.clues.down.map(clue => (
                                <li
                                    key={clue.number}
                                    className={`mini-game__clue-item ${currentClue?.number === clue.number && direction === 'down'
                                        ? 'mini-game__clue-item--active'
                                        : ''
                                        }`}
                                    onClick={() => jumpToClue(clue, 'down')}
                                >
                                    <span className="mini-game__clue-num">{clue.number}</span>
                                    <span>{clue.clue}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>

            {/* Completion Modal */}
            {showCompletion && (
                <div className="mini-game__modal-overlay" onClick={() => setShowCompletion(false)}>
                    <div className="mini-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>🎉 Solved!</h2>

                        <div className="mini-game__result">
                            <div className="mini-game__result-item">
                                <span className="mini-game__result-label">Time</span>
                                <span className="mini-game__result-value">{formatTime(elapsedTime)}</span>
                            </div>
                        </div>

                        <div className="mini-game__modal-actions">
                            <button className="mini-game__share-btn" onClick={handleShare}>
                                {copied ? 'Copied!' : 'Share Result'}
                            </button>
                            <button className="mini-game__close-btn" onClick={() => setShowCompletion(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Modal */}
            {showStats && (
                <div className="mini-game__modal-overlay" onClick={() => setShowStats(false)}>
                    <div className="mini-game__modal" onClick={e => e.stopPropagation()}>
                        <h2>Statistics</h2>
                        <div className="mini-game__stats-grid">
                            <div className="mini-game__stat-item">
                                <span className="mini-game__stat-value">{stats.gamesPlayed}</span>
                                <span className="mini-game__stat-label">Played</span>
                            </div>
                            <div className="mini-game__stat-item">
                                <span className="mini-game__stat-value">{stats.currentStreak}</span>
                                <span className="mini-game__stat-label">Streak</span>
                            </div>
                            <div className="mini-game__stat-item">
                                <span className="mini-game__stat-value">{stats.maxStreak}</span>
                                <span className="mini-game__stat-label">Max Streak</span>
                            </div>
                            <div className="mini-game__stat-item">
                                <span className="mini-game__stat-value">
                                    {stats.bestTime ? formatTime(stats.bestTime) : '—'}
                                </span>
                                <span className="mini-game__stat-label">Best Time</span>
                            </div>
                        </div>
                        <button className="mini-game__close-btn" onClick={() => setShowStats(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Rules Modal */}
            <RulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="MINI"
                rules={[
                    {
                        title: "Goal",
                        description: "Fill in the crossword grid using the clues provided."
                    },
                    {
                        title: "Navigation",
                        description: "Click a cell to select it. Click again to switch between Across and Down."
                    },
                    {
                        title: "Input",
                        description: "Type letters to fill cells. Arrow keys move between cells. Backspace deletes."
                    },
                    {
                        title: "Clues",
                        description: "Click any clue to jump directly to that word."
                    }
                ]}
            />
        </div>
    );
};
