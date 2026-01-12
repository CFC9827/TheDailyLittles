/**
 * CIPHER Game Page
 * 
 * A daily puzzle game based on monoalphabetic substitution ciphers
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Header } from '../components/Header';
import { useLocation } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { DifficultySelector } from '../components/DifficultySelector';
import { Timer } from '../components/Timer';
import { PhraseDisplay } from '../components/PhraseDisplay';
import { Keyboard } from '../components/Keyboard';
import { CompletionModal } from '../components/CompletionModal';
import { RulesModal } from '../components/RulesModal';
import { getDateString } from '../utils/dailySeed';
import { loadGameProgress } from '../utils/storage';
import { shareResult } from '../utils/share';
import type { Difficulty } from '../data/phrases';
import './CipherGame.css';

export const CipherGame: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDailyMode = searchParams.get('mode') === 'daily';

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
  } = useGameState(isDailyMode ? 'easy' : 'easy');

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
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
      <Header
        title="CIPHER"
        showBack
      />

      <main className="cipher-game__main">
        <div className="cipher-game__controls">
          {!isDailyMode && (
            <DifficultySelector currentDifficulty={difficulty} onSelectDifficulty={handleDifficultyChange} completedToday={completedToday} />
          )}
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

      <CompletionModal isOpen={showCompletionModal} onClose={() => setShowCompletionModal(false)} difficulty={difficulty} timeElapsed={elapsedTime} puzzleNumber={puzzle.puzzleNumber} phrase={puzzle.originalPhrase} onShare={handleShare} />

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
