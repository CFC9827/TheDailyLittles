/**
 * Admin Dashboard
 * 
 * Preview today's and tomorrow's puzzle answers for all games
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getRandomPhrase, type Difficulty as CipherDifficulty } from '../data/phrases';
import { getDailyPuzzle as getSortPuzzle } from '../games/sort/data/puzzles';
import { getDailyPuzzle as getGridPuzzle } from '../games/grid/utils/solutionGenerator';
import { getDailyPuzzle as getShiftPuzzle, type Difficulty as ShiftDifficulty } from '../games/shift/utils/puzzleGenerator';
import { getDailyPuzzle as getMiniPuzzle } from '../games/mini/data/puzzles';
import './AdminDashboard.css';

// Helper to get cipher puzzle number
function getCipherPuzzleNumber(date: Date): number {
    const epoch = new Date('2026-01-11');
    return Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

// Helper to get cipher seed from date
function getCipherSeed(date: Date): number {
    const dateStr = date.toISOString().split('T')[0];
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
        seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
        seed = seed & seed;
    }
    return Math.abs(seed);
}

export const AdminDashboard: React.FC = () => {
    const [dayOffset, setDayOffset] = useState(0);

    const selectedDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        return date;
    }, [dayOffset]);

    const dateStr = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get cipher puzzle
    const cipherDifficulty: CipherDifficulty = 'medium'; // Default for admin preview
    const cipherSeed = getCipherSeed(selectedDate);
    const cipherPhrase = getRandomPhrase(cipherDifficulty, cipherSeed);
    const cipherPuzzleNumber = getCipherPuzzleNumber(selectedDate);

    // Get other puzzles
    const sortPuzzle = useMemo(() => getSortPuzzle(selectedDate), [selectedDate]);
    const gridPuzzle = useMemo(() => getGridPuzzle(selectedDate), [selectedDate]);
    const shiftDifficulty: ShiftDifficulty = 'medium';
    const shiftPuzzle = useMemo(() => getShiftPuzzle(shiftDifficulty, selectedDate), [selectedDate]);
    const miniPuzzle = useMemo(() => getMiniPuzzle(selectedDate), [selectedDate]);

    return (
        <div className="admin">
            <header className="admin__header">
                <Link to="/" className="admin__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="admin__title">Puzzle Preview</h1>
            </header>

            <main className="admin__main">
                {/* Date Navigation */}
                <div className="admin__date-nav">
                    <button
                        className="admin__nav-btn"
                        onClick={() => setDayOffset(d => d - 1)}
                    >
                        ← Previous
                    </button>
                    <div className="admin__date">
                        <span className="admin__date-label">
                            {dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : dayOffset === -1 ? 'Yesterday' : `${dayOffset > 0 ? '+' : ''}${dayOffset} days`}
                        </span>
                        <span className="admin__date-full">{dateStr}</span>
                    </div>
                    <button
                        className="admin__nav-btn"
                        onClick={() => setDayOffset(d => d + 1)}
                    >
                        Next →
                    </button>
                </div>

                {/* CIPHER */}
                <section className="admin__section">
                    <h2 className="admin__section-title">
                        CIPHER
                        <span className="admin__puzzle-num">Little #{cipherPuzzleNumber}</span>
                    </h2>
                    <div className="admin__content">
                        <div className="admin__row">
                            <span className="admin__label">Difficulty</span>
                            <span className="admin__value">{cipherDifficulty}</span>
                        </div>
                        <div className="admin__row">
                            <span className="admin__label">Hint</span>
                            <span className="admin__value">{cipherPhrase.hint}</span>
                        </div>
                        <div className="admin__row admin__row--answer">
                            <span className="admin__label">Answer</span>
                            <span className="admin__value admin__answer">{cipherPhrase.phrase}</span>
                        </div>
                    </div>
                </section>

                {/* SORT */}
                <section className="admin__section">
                    <h2 className="admin__section-title">
                        SORT
                        <span className="admin__puzzle-num">Little #{sortPuzzle.puzzleNumber}</span>
                    </h2>
                    <div className="admin__content">
                        {sortPuzzle.groups.map((group, i) => (
                            <div key={i} className="admin__row">
                                <span className="admin__label">
                                    {group.category}
                                    <span className={`admin__diff admin__diff--${group.difficulty}`}>
                                        D{group.difficulty}
                                    </span>
                                </span>
                                <span className="admin__value admin__words">
                                    {group.words.join(', ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* GRIDGRAM */}
                <section className="admin__section">
                    <h2 className="admin__section-title">
                        GRIDGRAM
                        <span className="admin__puzzle-num">Little #{gridPuzzle.puzzleNumber}</span>
                    </h2>
                    <div className="admin__content">
                        <div className="admin__row">
                            <span className="admin__label">Letters</span>
                            <span className="admin__value admin__letters">
                                {gridPuzzle.letters.join(' ')}
                            </span>
                        </div>
                        <div className="admin__row admin__row--answer">
                            <span className="admin__label">Note</span>
                            <span className="admin__value">
                                Letters form valid crossword (procedurally generated)
                            </span>
                        </div>
                    </div>
                </section>

                {/* SHIFT */}
                <section className="admin__section">
                    <h2 className="admin__section-title">
                        SHIFT
                        <span className="admin__puzzle-num">Little #{shiftPuzzle.puzzleNumber}</span>
                    </h2>
                    <div className="admin__content">
                        <div className="admin__row">
                            <span className="admin__label">Solution Grid</span>
                            <div className="admin__grid admin__grid--shift">
                                {shiftPuzzle.solution.map((row: string[], i: number) => (
                                    <div key={i} className="admin__grid-row">
                                        {row.map((cell: string, j: number) => (
                                            <span key={j} className="admin__grid-cell">
                                                {cell}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* MINI */}
                <section className="admin__section">
                    <h2 className="admin__section-title">
                        MINI
                        <span className="admin__puzzle-num">Little #{miniPuzzle.puzzleNumber}</span>
                    </h2>
                    <div className="admin__content">
                        <div className="admin__grid admin__grid--mini">
                            {miniPuzzle.solution.map((row, i) => (
                                <div key={i} className="admin__grid-row">
                                    {row.map((cell, j) => (
                                        <span
                                            key={j}
                                            className={`admin__grid-cell ${cell === null ? 'admin__grid-cell--black' : ''}`}
                                        >
                                            {cell || ''}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="admin__clues">
                            <div className="admin__clue-section">
                                <h4>Across</h4>
                                {miniPuzzle.clues.across.map(c => (
                                    <div key={c.number} className="admin__clue">
                                        <span>{c.number}.</span> {c.clue} → <strong>{c.answer}</strong>
                                    </div>
                                ))}
                            </div>
                            <div className="admin__clue-section">
                                <h4>Down</h4>
                                {miniPuzzle.clues.down.map(c => (
                                    <div key={c.number} className="admin__clue">
                                        <span>{c.number}.</span> {c.clue} → <strong>{c.answer}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
