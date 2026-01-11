/**
 * Supabase Database Types
 * 
 * Auto-generated types would go here after running:
 * npx supabase gen types typescript --project-id <id> > src/services/database.types.ts
 * 
 * For now, we define the tables we need manually.
 */

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    username: string;
                    display_name: string | null;
                    avatar_url: string | null;
                    is_premium: boolean;
                    premium_until: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    username: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    is_premium?: boolean;
                    premium_until?: string | null;
                };
                Update: {
                    username?: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    is_premium?: boolean;
                    premium_until?: string | null;
                };
            };
            game_completions: {
                Row: {
                    id: string;
                    user_id: string;
                    game_id: string;
                    date: string;
                    score: number;
                    time_seconds: number;
                    moves: number | null;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    game_id: string;
                    date: string;
                    score: number;
                    time_seconds: number;
                    moves?: number | null;
                };
                Update: {
                    score?: number;
                    time_seconds?: number;
                    moves?: number | null;
                };
            };
            follows: {
                Row: {
                    id: string;
                    follower_id: string;
                    following_id: string;
                    created_at: string;
                };
                Insert: {
                    follower_id: string;
                    following_id: string;
                };
                Update: never;
            };
            groups: {
                Row: {
                    id: string;
                    name: string;
                    owner_id: string;
                    invite_code: string;
                    created_at: string;
                };
                Insert: {
                    name: string;
                    owner_id: string;
                    invite_code?: string;
                };
                Update: {
                    name?: string;
                };
            };
            group_members: {
                Row: {
                    id: string;
                    group_id: string;
                    user_id: string;
                    role: 'owner' | 'admin' | 'member';
                    joined_at: string;
                };
                Insert: {
                    group_id: string;
                    user_id: string;
                    role?: 'owner' | 'admin' | 'member';
                };
                Update: {
                    role?: 'owner' | 'admin' | 'member';
                };
            };
            group_messages: {
                Row: {
                    id: string;
                    group_id: string;
                    user_id: string;
                    content: string;
                    created_at: string;
                };
                Insert: {
                    group_id: string;
                    user_id: string;
                    content: string;
                };
                Update: never;
            };
        };
    };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type GameCompletion = Database['public']['Tables']['game_completions']['Row'];
export type Follow = Database['public']['Tables']['follows']['Row'];
export type Group = Database['public']['Tables']['groups']['Row'];
export type GroupMember = Database['public']['Tables']['group_members']['Row'];
export type GroupMessage = Database['public']['Tables']['group_messages']['Row'];
