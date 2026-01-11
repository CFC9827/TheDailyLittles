/**
 * CIPHER Game Page
 * 
 * A daily puzzle game based on monoalphabetic substitution ciphers
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { DifficultySelector } from '../components/DifficultySelector';
import { Timer } from '../components/Timer';
import { PhraseDisplay } from '../components/PhraseDisplay';
import { Keyboard } from '../components/Keyboard';
import { CompletionModal } from '../components/CompletionModal';
import { StatsModal } from '../components/StatsModal';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { RulesModal } from '../components/RulesModal';
import { getDateString } from '../utils/dailySeed';
import { loadGameProgress, getLeaderboardForDate } from '../utils/storage';
import { shareResult } from '../utils/share';
import type { Difficulty } from '../data/phrases';
import './CipherGame.css';

export const CipherGame: React.FC = () => {
  const {
    difficulty,
    puzzle,
    guesses,
    selectedCipherLetter,
    selectedTileIndex,
    isComplete,
    isStarted,
    elapsedTime,
    statistics,
    usedPlainLetters,
    selectCipherLetter,
    assignLetter,
    clearLetter,
    changeDifficulty,
  } = useGameState('easy');

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState<Difficulty>('easy');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  React.useEffect(() => {
    setShowHint(false);
  }, [puzzle]);

  const completedToday = useMemo(() => {
    const today = getDateString();
    return {
      easy: loadGameProgress(today, 'easy')?.completed ?? false,
      medium: loadGameProgress(today, 'medium')?.completed ?? false,
      hard: loadGameProgress(today, 'hard')?.completed ?? false,
    };
  }, [isComplete]);

  const leaderboardEntries = useMemo(() => {
    return getLeaderboardForDate(getDateString(), leaderboardDifficulty);
  }, [leaderboardDifficulty, isComplete]);

  React.useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowCompletionModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const handleShare = useCallback(async () => {
    const result = await shareResult({
      puzzleNumber: puzzle.puzzleNumber,
      difficulty,
      timeElapsed: elapsedTime,
      streak: statistics.currentStreak,
    });
    showToast(result.success ? (result.method === 'copy' ? 'Copied!' : 'Shared!') : 'Failed');
  }, [puzzle.puzzleNumber, difficulty, elapsedTime, statistics.currentStreak, showToast]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    if (newDifficulty !== difficulty) changeDifficulty(newDifficulty);
  }, [difficulty, changeDifficulty]);

  return (
    <div className="cipher-game">
      <header className="cipher-game__header">
        <Link to="/" className="cipher-game__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="cipher-game__title">CIPHER</h1>
        <div className="cipher-game__header-actions">
          <button className="cipher-game__header-btn" onClick={() => setShowLeaderboardModal(true)} title="Leaderboard">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
            </svg>
          </button>
          <button className="cipher-game__header-btn" onClick={() => setShowStatsModal(true)} title="Statistics">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </button>
          <button className="cipher-game__header-btn" onClick={() => setShowRulesModal(true)} title="How to Play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
          </button>
        </div>
      </header>

      <main className="cipher-game__main">
        <div className="cipher-game__controls">
          <DifficultySelector currentDifficulty={difficulty} onSelectDifficulty={handleDifficultyChange} completedToday={completedToday} />
          <Timer elapsedTime={elapsedTime} isRunning={isStarted && !isComplete} isComplete={isComplete} />
        </div>

        <div className="cipher-game__puzzle-info">
          <span className="cipher-game__puzzle-number">Little #{puzzle.puzzleNumber}</span>
          {selectedCipherLetter && <span className="cipher-game__selected-hint">Assign a letter to <strong>{selectedCipherLetter}</strong></span>}
        </div>

        <div className="cipher-game__clue-section">
          <button className={`cipher-game__clue-toggle ${showHint ? 'cipher-game__clue-toggle--active' : ''}`} onClick={() => setShowHint(!showHint)} type="button">
            {showHint ? 'Hide Clue' : 'Show Clue'}
          </button>
          {showHint && (
            <div className="cipher-game__clue">
              <span className="cipher-game__clue-label">Clue:</span>
              <span className="cipher-game__clue-text">{puzzle.hint}</span>
            </div>
          )}
        </div>

        <PhraseDisplay
          encodedPhrase={puzzle.encodedPhrase}
          guesses={guesses}
          selectedCipherLetter={selectedCipherLetter}
          selectedTileIndex={selectedTileIndex}
          isComplete={isComplete}
          onSelectLetter={selectCipherLetter}
          onClearLetter={clearLetter}
        />
        <Keyboard usedLetters={usedPlainLetters} onKeyPress={assignLetter} onBackspace={() => clearLetter()} disabled={isComplete} />

        {!isStarted && !isComplete && <p className="cipher-game__start-hint">Tap a letter tile to begin</p>}
      </main>

      <CompletionModal isOpen={showCompletionModal} onClose={() => setShowCompletionModal(false)} difficulty={difficulty} timeElapsed={elapsedTime} streak={statistics.currentStreak} puzzleNumber={puzzle.puzzleNumber} phrase={puzzle.originalPhrase} onShare={handleShare} />
      <StatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} statistics={statistics} />
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        entries={leaderboardEntries}
        currentDifficulty={leaderboardDifficulty}
        onChangeDifficulty={setLeaderboardDifficulty}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        title="CIPHER"
        rules={[
          {
            title: "Goal",
            description: "Decode the secret phrase by replacing 'Cipher' letters with the correct 'Plain' letters."
          },
          {
            title: "Decipher",
            description: "Click a letter in the phrase and then press a key (or use the keyboard) to assign it."
          },
          {
            title: "Consistency",
            description: "Each 'Cipher' letter represents exactly one 'Plain' letter throughout the entire puzzle."
          },
          {
            title: "Visual Cues",
            description: "Letters that match common English frequencies might be good starting points."
          }
        ]}
      />

      {toastMessage && (<div className="cipher-game__toast">{toastMessage}</div>)}
    </div>
  );
};
