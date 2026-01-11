import React from 'react';
import './FrequencyAnalysis.css';

interface FrequencyAnalysisProps {
    cipherFrequencies: Record<string, number>;
    selectedCipherLetter: string | null;
}

// Standard English letter frequency order (ETAOIN SHRDLU...)
const ENGLISH_FREQUENCIES: Record<string, number> = {
    'E': 12.02, 'T': 9.10, 'A': 8.12, 'O': 7.68, 'I': 7.31, 'N': 6.95, 'S': 6.28, 'R': 6.02,
    'H': 5.92, 'D': 4.32, 'L': 3.98, 'U': 2.88, 'C': 2.71, 'M': 2.61, 'F': 2.30, 'Y': 2.11,
    'W': 2.09, 'G': 2.03, 'P': 1.82, 'B': 1.49, 'V': 1.11, 'K': 0.69, 'X': 0.17, 'Q': 0.11,
    'J': 0.10, 'Z': 0.07
};

export const FrequencyAnalysis: React.FC<FrequencyAnalysisProps> = ({
    cipherFrequencies,
    selectedCipherLetter,
}) => {
    const sortedCipher = Object.entries(cipherFrequencies)
        .sort((a, b) => b[1] - a[1]);

    const sortedEnglish = Object.entries(ENGLISH_FREQUENCIES)
        .sort((a, b) => b[1] - a[1]);

    const totalLetters = Object.values(cipherFrequencies).reduce((a, b) => a + b, 0);

    return (
        <div className="frequency-analysis animate-fade-in">
            <div className="frequency-analysis__header">
                <h3 className="frequency-analysis__title">Frequency Analysis</h3>
                <p className="frequency-analysis__subtitle">Compare puzzle letters to English averages</p>
            </div>

            <div className="frequency-analysis__tables">
                <div className="frequency-analysis__table-container">
                    <table className="frequency-analysis__table">
                        <thead>
                            <tr>
                                <th>Puzzle</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCipher.map(([letter, count]) => (
                                <tr
                                    key={letter}
                                    className={selectedCipherLetter === letter ? 'frequency-analysis__row--selected' : ''}
                                >
                                    <td className="frequency-analysis__letter">{letter}</td>
                                    <td className="frequency-analysis__percent">
                                        {((count / totalLetters) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="frequency-analysis__divider">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                    </svg>
                </div>

                <div className="frequency-analysis__table-container">
                    <table className="frequency-analysis__table">
                        <thead>
                            <tr>
                                <th>English</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEnglish.slice(0, sortedCipher.length).map(([letter, percent]) => (
                                <tr key={letter}>
                                    <td className="frequency-analysis__letter">{letter}</td>
                                    <td className="frequency-analysis__percent">{percent}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
