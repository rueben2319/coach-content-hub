import { supabase } from '@/integrations/supabase/client';

// Simplified notification interfaces
export interface SimpleNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  isDismissed?: boolean;
  level?: string;
  entityType?: string;
  actionType?: string;
}

export interface SimpleNotificationStats {
  total: number;
  unread: number;
  dismissed: number;
}

class SimplifiedNotificationService {
  private subscriptions = new Map<string, any>();

  /**
   * Fetch notifications (simplified)
   */
  async getNotifications(filters: any = {}): Promise<SimpleNotification[]> {
    // Return empty array for now - notifications will be implemented later
    return [];
  }

  /**
   * Fetch unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<SimpleNotification[]> {
    return [];
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string): Promise<SimpleNotificationStats> {
    return {
      total: 0,
      unread: 0,
      dismissed: 0
    };
  }

  /**
   * Create a new notification
   */
  async createNotification(payload: any): Promise<string | null> {
    return null;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    return true;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<number> {
    return 0;
  }

  /**
   * Dismiss notification
   */
  async dismissNotification(notificationId: string): Promise<boolean> {
    return true;
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<any | null> {
    return null;
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(userId: string, preferences: any): Promise<boolean> {
    return true;
  }

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(userId: string, callback: (notification: SimpleNotification) => void) {
    // Simplified subscription that doesn't duplicate
    const channelKey = `notifications:${userId}`;
    
    // Remove existing subscription if it exists
    if (this.subscriptions.has(channelKey)) {
      this.unsubscribeFromNotifications(userId);
    }

    const channel = supabase
      .channel(channelKey)
      .subscribe();

    this.subscriptions.set(channelKey, channel);
    return channel;
  }

  /**
   * Unsubscribe from real-time notifications
   */
  unsubscribeFromNotifications(userId: string) {
    const channelKey = `notifications:${userId}`;
    const channel = this.subscriptions.get(channelKey);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.subscriptions.delete(channelKey);
    }
  }
}

export const enhancedNotificationService = new SimplifiedNotificationService();

// Legacy compatibility exports
export const notificationService = enhancedNotificationService;