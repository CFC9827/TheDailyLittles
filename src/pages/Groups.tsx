/**
 * Groups Page
 * 
 * Manage and view groups with leaderboards and chat
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../hooks/useGroups';
import { AuthModal } from '../components/AuthModal';
import './Groups.css';

export const Groups: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { groups, isLoading, createGroup, joinGroup } = useGroups();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!newGroupName.trim()) {
            setError('Group name is required');
            return;
        }

        const { error } = await createGroup(newGroupName.trim());
        if (error) {
            setError(error.message);
        } else {
            setShowCreateModal(false);
            setNewGroupName('');
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await joinGroup(inviteCode);
        if (error) {
            setError(error.message);
        } else {
            setShowJoinModal(false);
            setInviteCode('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="groups-page">
                <header className="groups-page__header">
                    <Link to="/" className="groups-page__back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="groups-page__title">Groups</h1>
                </header>

                <div className="groups-page__auth-prompt">
                    <div className="groups-page__auth-content">
                        <h2>Create and join groups</h2>
                        <p>Compete with friends in private leaderboards and chat.</p>
                        <button
                            className="groups-page__auth-btn"
                            onClick={() => setShowAuthModal(true)}
                        >
                            Sign in to continue
                        </button>
                    </div>
                </div>

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </div>
        );
    }

    return (
        <div className="groups-page">
            <header className="groups-page__header">
                <Link to="/" className="groups-page__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="groups-page__title">Groups</h1>
            </header>

            <main className="groups-page__main">
                {/* Actions */}
                <div className="groups-page__actions">
                    <button
                        className="groups-page__action-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <span>+</span> Create Group
                    </button>
                    <button
                        className="groups-page__action-btn groups-page__action-btn--secondary"
                        onClick={() => setShowJoinModal(true)}
                    >
                        Join Group
                    </button>
                </div>

                {/* Groups list */}
                {isLoading ? (
                    <div className="groups-page__loading">Loading...</div>
                ) : groups.length === 0 ? (
                    <div className="groups-page__empty">
                        <p>You're not in any groups yet.</p>
                        <p>Create one or join with an invite code!</p>
                    </div>
                ) : (
                    <div className="groups-page__list">
                        {groups.map(group => (
                            <div key={group.id} className="groups-page__group">
                                <div className="groups-page__group-info">
                                    <h3 className="groups-page__group-name">{group.name}</h3>
                                    <span className="groups-page__group-members">
                                        {group.memberCount} members
                                    </span>
                                </div>
                                <div className="groups-page__group-actions">
                                    {group.isOwner && (
                                        <span className="groups-page__group-badge">Owner</span>
                                    )}
                                    <span className="groups-page__group-code">
                                        Code: {group.invite_code}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="groups-modal__overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="groups-modal" onClick={e => e.stopPropagation()}>
                        <h2>Create Group</h2>
                        <form onSubmit={handleCreate}>
                            {error && <div className="groups-modal__error">{error}</div>}
                            <input
                                type="text"
                                placeholder="Group name"
                                value={newGroupName}
                                onChange={e => setNewGroupName(e.target.value)}
                                autoFocus
                            />
                            <div className="groups-modal__actions">
                                <button type="button" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="groups-modal__primary">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Join Modal */}
            {showJoinModal && (
                <div className="groups-modal__overlay" onClick={() => setShowJoinModal(false)}>
                    <div className="groups-modal" onClick={e => e.stopPropagation()}>
                        <h2>Join Group</h2>
                        <form onSubmit={handleJoin}>
                            {error && <div className="groups-modal__error">{error}</div>}
                            <input
                                type="text"
                                placeholder="Invite code"
                                value={inviteCode}
                                onChange={e => setInviteCode(e.target.value)}
                                autoFocus
                            />
                            <div className="groups-modal__actions">
                                <button type="button" onClick={() => setShowJoinModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="groups-modal__primary">
                                    Join
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
