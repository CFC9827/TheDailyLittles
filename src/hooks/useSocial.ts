/**
 * Social Hooks
 * 
 * Manages following, mutuals, and leaderboard data
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../services/database.types';

export interface FollowStats {
    followersCount: number;
    followingCount: number;
    mutualsCount: number;
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    displayName: string;
    score: number;
    timeSeconds: number;
    rank: number;
    isMutual: boolean;
}

/**
 * Hook for managing follows
 */
export function useFollows() {
    const { user } = useAuth();
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [mutuals, setMutuals] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load follows data
    const loadFollows = useCallback(async () => {
        if (!user) {
            setFollowing([]);
            setFollowers([]);
            setMutuals([]);
            setIsLoading(false);
            return;
        }

        try {
            // Get who I follow
            const { data: followingData } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', user.id);

            const followingIds = followingData?.map((f: { following_id: string }) => f.following_id) || [];

            // Get who follows me
            const { data: followersData } = await supabase
                .from('follows')
                .select('follower_id')
                .eq('following_id', user.id);

            const followerIds = followersData?.map((f: { follower_id: string }) => f.follower_id) || [];

            // Compute mutuals
            const mutualIds = followingIds.filter(id => followerIds.includes(id));

            setFollowing(followingIds);
            setFollowers(followerIds);
            setMutuals(mutualIds);
        } catch (error) {
            console.error('Error loading follows:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadFollows();
    }, [loadFollows]);

    // Follow a user
    const followUser = async (userId: string) => {
        if (!user) return { error: new Error('Not authenticated') };

        const { error } = await supabase
            .from('follows')
            .insert({ follower_id: user.id, following_id: userId } as never);

        if (!error) {
            setFollowing(prev => [...prev, userId]);
            // Check if now mutual
            if (followers.includes(userId)) {
                setMutuals(prev => [...prev, userId]);
            }
        }

        return { error };
    };

    // Unfollow a user
    const unfollowUser = async (userId: string) => {
        if (!user) return { error: new Error('Not authenticated') };

        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', userId);

        if (!error) {
            setFollowing(prev => prev.filter(id => id !== userId));
            setMutuals(prev => prev.filter(id => id !== userId));
        }

        return { error };
    };

    // Check if following a specific user
    const isFollowing = (userId: string) => following.includes(userId);

    // Check if mutual with a specific user
    const isMutual = (userId: string) => mutuals.includes(userId);

    return {
        following,
        followers,
        mutuals,
        isLoading,
        followUser,
        unfollowUser,
        isFollowing,
        isMutual,
        stats: {
            followersCount: followers.length,
            followingCount: following.length,
            mutualsCount: mutuals.length,
        } as FollowStats,
        refresh: loadFollows,
    };
}

/**
 * Hook for leaderboard data
 */
export function useLeaderboard(scope: 'global' | 'mutuals' | 'group', groupId?: string) {
    const { user } = useAuth();
    const { mutuals } = useFollows();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load leaderboard
    const loadLeaderboard = useCallback(async () => {
        if (!user) {
            setEntries([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // Get today's completions
            const today = new Date().toISOString().split('T')[0];

            let query = supabase
                .from('game_completions')
                .select(`
                    user_id,
                    score,
                    time_seconds,
                    profiles:user_id (username, display_name)
                `)
                .eq('date', today)
                .order('score', { ascending: false })
                .limit(50);

            // Filter by scope
            if (scope === 'mutuals' && mutuals.length > 0) {
                query = query.in('user_id', [...mutuals, user.id]);
            } else if (scope === 'group' && groupId) {
                // Get group members first
                const { data: members } = await supabase
                    .from('group_members')
                    .select('user_id')
                    .eq('group_id', groupId);

                if (members) {
                    const memberIds = members.map((m: { user_id: string }) => m.user_id);
                    query = query.in('user_id', memberIds);
                }
            }

            const { data, error } = await query;

            if (error) throw error;

            // Transform to leaderboard entries
            interface LeaderboardData {
                user_id: string;
                score: number;
                time_seconds: number;
                profiles: unknown;
            }
            const leaderboardEntries: LeaderboardEntry[] = ((data || []) as LeaderboardData[]).map((entry, index) => ({
                userId: entry.user_id,
                username: (entry.profiles as Profile)?.username || 'Unknown',
                displayName: (entry.profiles as Profile)?.display_name || 'Unknown',
                score: entry.score,
                timeSeconds: entry.time_seconds,
                rank: index + 1,
                isMutual: mutuals.includes(entry.user_id),
            }));

            setEntries(leaderboardEntries);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, scope, groupId, mutuals]);

    useEffect(() => {
        loadLeaderboard();
    }, [loadLeaderboard]);

    return {
        entries,
        isLoading,
        refresh: loadLeaderboard,
    };
}

/**
 * Hook for user search
 */
export function useUserSearch() {
    const [results, setResults] = useState<Profile[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchUsers = async (query: string) => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        setIsSearching(true);

        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .ilike('username', `%${query}%`)
                .limit(10);

            setResults(data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    return {
        results,
        isSearching,
        searchUsers,
        clearResults: () => setResults([]),
    };
}
