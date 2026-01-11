/**
 * RulesModal Component
 * 
 * Instructions on how to play the current game
 */

import React from 'react';
import { Modal } from './Modal';
import './RulesModal.css';

interface Rule {
    icon?: string;
    title?: string;
    description: string;
}

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    rules: Rule[];
}

export const RulesModal: React.FC<RulesModalProps> = ({
    isOpen,
    onClose,
    title,
    rules,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
            <div className="rules-modal">
                <h3 className="rules-modal__game-title">{title}</h3>
                <div className="rules-modal__list">
                    {rules.map((rule, index) => (
                        <div key={index} className="rules-modal__item">
                            {rule.icon && <span className="rules-modal__icon">{rule.icon}</span>}
                            <div className="rules-modal__content">
                                {rule.title && <p><strong>{rule.title}:</strong></p>}
                                <p>{rule.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="rules-modal__btn" onClick={onClose}>
                    Got it!
                </button>
            </div>
        </Modal>
    );
};
