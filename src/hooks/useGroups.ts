/**
 * Groups Hooks
 * 
 * Manages group creation, membership, and real-time chat
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Group, GroupMessage } from '../services/database.types';

export interface GroupWithMembers extends Group {
    memberCount: number;
    isOwner: boolean;
    isMember: boolean;
}

/**
 * Hook for managing groups
 */
export function useGroups() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<GroupWithMembers[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load user's groups
    const loadGroups = useCallback(async () => {
        if (!user) {
            setGroups([]);
            setIsLoading(false);
            return;
        }

        try {
            // Get groups where user is a member
            const { data: memberships } = await supabase
                .from('group_members')
                .select('group_id')
                .eq('user_id', user.id);

            if (!memberships || memberships.length === 0) {
                setGroups([]);
                setIsLoading(false);
                return;
            }

            const groupIds = memberships.map((m: { group_id: string }) => m.group_id);

            // Get group details
            const { data: groupsData } = await supabase
                .from('groups')
                .select('*')
                .in('id', groupIds);

            if (!groupsData) {
                setGroups([]);
                setIsLoading(false);
                return;
            }

            // Get member counts
            const groupsWithMembers: GroupWithMembers[] = await Promise.all(
                (groupsData as Group[]).map(async (group) => {
                    const { count } = await supabase
                        .from('group_members')
                        .select('*', { count: 'exact', head: true })
                        .eq('group_id', group.id);

                    return {
                        ...group,
                        memberCount: count || 0,
                        isOwner: group.owner_id === user.id,
                        isMember: true,
                    };
                })
            );

            setGroups(groupsWithMembers);
        } catch (error) {
            console.error('Error loading groups:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    // Create a new group
    const createGroup = async (name: string): Promise<{ group?: Group; error?: Error }> => {
        if (!user) return { error: new Error('Not authenticated') };

        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const { data, error } = await supabase
            .from('groups')
            .insert({ name, owner_id: user.id, invite_code: inviteCode } as never)
            .select()
            .single();

        if (error) return { error: error as Error };

        // Add creator as owner
        const createdGroup = data as { id: string };
        await supabase
            .from('group_members')
            .insert({ group_id: createdGroup.id, user_id: user.id, role: 'owner' } as never);

        await loadGroups();
        return { group: data };
    };

    // Join a group by invite code
    const joinGroup = async (inviteCode: string): Promise<{ error?: Error }> => {
        if (!user) return { error: new Error('Not authenticated') };

        // Find group by invite code
        const { data: group, error: findError } = await supabase
            .from('groups')
            .select('id')
            .eq('invite_code', inviteCode.toUpperCase())
            .single();

        if (findError || !group) {
            return { error: new Error('Invalid invite code') };
        }

        // Check if already a member
        const groupForCheck = group as { id: string };
        const { data: existing } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupForCheck.id)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return { error: new Error('Already a member of this group') };
        }

        // Join group
        const groupData = group as { id: string };
        const { error } = await supabase
            .from('group_members')
            .insert({ group_id: groupData.id, user_id: user.id, role: 'member' } as never);

        if (error) return { error: error as Error };

        await loadGroups();
        return {};
    };

    // Leave a group
    const leaveGroup = async (groupId: string): Promise<{ error?: Error }> => {
        if (!user) return { error: new Error('Not authenticated') };

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', user.id);

        if (error) return { error: error as Error };

        await loadGroups();
        return {};
    };

    return {
        groups,
        isLoading,
        createGroup,
        joinGroup,
        leaveGroup,
        refresh: loadGroups,
    };
}

/**
 * Hook for group chat
 */
export function useGroupChat(groupId: string) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<GroupMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load messages
    useEffect(() => {
        if (!groupId) return;

        const loadMessages = async () => {
            const { data } = await supabase
                .from('group_messages')
                .select('*')
                .eq('group_id', groupId)
                .order('created_at', { ascending: true })
                .limit(100);

            setMessages(data || []);
            setIsLoading(false);
        };

        loadMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`group-${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'group_messages',
                    filter: `group_id=eq.${groupId}`,
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as GroupMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [groupId]);

    // Send a message
    const sendMessage = async (content: string): Promise<{ error?: Error }> => {
        if (!user) return { error: new Error('Not authenticated') };
        if (!content.trim()) return { error: new Error('Message cannot be empty') };

        const { error } = await supabase
            .from('group_messages')
            .insert({ group_id: groupId, user_id: user.id, content: content.trim() } as never);

        return { error: error as Error | undefined };
    };

    return {
        messages,
        isLoading,
        sendMessage,
    };
}
