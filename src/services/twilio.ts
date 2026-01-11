/**
 * Twilio SMS Service
 * 
 * Handles SMS notifications for social features.
 * 
 * Note: SMS sending must happen server-side for security.
 * This file handles the client-side notification preferences
 * and would call a backend API to send actual messages.
 */

export interface NotificationPreferences {
    smsEnabled: boolean;
    phoneNumber: string | null;
    phoneVerified: boolean;
    notifyOnMutualComplete: boolean;
    notifyOnGroupComplete: boolean;
    notifyOnNewFollower: boolean;
}

const STORAGE_KEY = 'notification_preferences';

/**
 * Get notification preferences
 */
export function getNotificationPreferences(): NotificationPreferences {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // ignore
    }

    return {
        smsEnabled: false,
        phoneNumber: null,
        phoneVerified: false,
        notifyOnMutualComplete: true,
        notifyOnGroupComplete: true,
        notifyOnNewFollower: false,
    };
}

/**
 * Save notification preferences
 */
export function saveNotificationPreferences(prefs: NotificationPreferences): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/**
 * Request phone verification
 * 
 * In production, this would call your backend to send a verification code via Twilio
 */
export async function requestPhoneVerification(phoneNumber: string): Promise<{ error?: Error }> {
    // Validate phone number format
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
        return { error: new Error('Invalid phone number') };
    }

    // In production:
    // const { error } = await fetch('/api/send-verification', {
    //     method: 'POST',
    //     body: JSON.stringify({ phoneNumber: cleaned }),
    // }).then(r => r.json());

    console.log('Would send verification code to:', cleaned);

    // Store pending verification
    const prefs = getNotificationPreferences();
    prefs.phoneNumber = cleaned;
    prefs.phoneVerified = false;
    saveNotificationPreferences(prefs);

    return {};
}

/**
 * Verify phone with code
 */
export async function verifyPhone(code: string): Promise<{ error?: Error }> {
    // In production:
    // const { error } = await fetch('/api/verify-phone', {
    //     method: 'POST',
    //     body: JSON.stringify({ code }),
    // }).then(r => r.json());

    if (code.length !== 6) {
        return { error: new Error('Invalid verification code') };
    }

    // For demo, accept any 6-digit code
    const prefs = getNotificationPreferences();
    prefs.phoneVerified = true;
    prefs.smsEnabled = true;
    saveNotificationPreferences(prefs);

    return {};
}

/**
 * Send notification when mutual completes challenge
 * 
 * This would be called from the backend, not client-side
 */
export async function notifyMutualComplete(
    _recipientPhone: string,
    mutualName: string,
    completionTime: string
): Promise<void> {
    // Backend call structure:
    // await fetch('/api/send-notification', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         to: recipientPhone,
    //         message: `${mutualName} just finished The Daily Littles in ${completionTime}! 🎯`,
    //     }),
    // });

    console.log(`SMS Notification: ${mutualName} finished in ${completionTime}`);
}

/**
 * Send notification when group member posts notable score
 */
export async function notifyGroupScore(
    _recipientPhone: string,
    memberName: string,
    groupName: string,
    score: number
): Promise<void> {
    console.log(`SMS Notification: ${memberName} scored ${score} in ${groupName}`);
}

/**
 * Database schema for storing phone verifications (Supabase)
 * 
 * Table: phone_verifications
 * - user_id: uuid (FK to auth.users)
 * - phone_number: text
 * - verified: boolean
 * - verification_code: text (hashed)
 * - code_expires_at: timestamp
 * - created_at: timestamp
 */

// Export helper to check if notifications are available
export function canSendNotifications(): boolean {
    const prefs = getNotificationPreferences();
    return prefs.smsEnabled && prefs.phoneVerified && !!prefs.phoneNumber;
}
