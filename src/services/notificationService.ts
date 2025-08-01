import { supabase } from '@/integrations/supabase/client';
import {
  AppNotification,
  UserNotificationPreferences,
  NotificationAggregation,
  Notification,
  CreateNotificationPayload,
  UpdateNotificationPreferencesPayload,
  NotificationFilters,
  NotificationStats,
  EntityType,
  ActionType,
  NotificationLevel,
  mapNotificationLevelToType,
  getNotificationIcon,
  getNotificationColor,
  formatNotificationTimestamp,
  NOTIFICATION_TEMPLATES
} from '@/types/notification';

class EnhancedNotificationService {
  /**
   * Fetch notifications with filtering and pagination
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<Notification[]> {
    try {
      let query = supabase
        .from('app_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      if (filters.action_type) {
        query = query.eq('action_type', filters.action_type);
      }
      if (filters.notification_level) {
        query = query.eq('notification_level', filters.notification_level);
      }
      if (filters.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }
      if (filters.is_dismissed !== undefined) {
        query = query.eq('is_dismissed', filters.is_dismissed);
      }
      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(this.mapAppNotificationToNotification);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Fetch unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.getNotifications({
      is_read: false,
      is_dismissed: false,
      limit: 50
    });
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string): Promise<NotificationStats> {
    try {
      const { data, error } = await supabase
        .from('app_notifications')
        .select('notification_level, entity_type, action_type, is_read, is_dismissed')
        .eq('user_id', userId);

      if (error) throw error;

      const stats: NotificationStats = {
        total: data?.length || 0,
        unread: data?.filter(n => !n.is_read && !n.is_dismissed).length || 0,
        dismissed: data?.filter(n => n.is_dismissed).length || 0,
        by_level: {
          [NotificationLevel.LOW]: 0,
          [NotificationLevel.MEDIUM]: 0,
          [NotificationLevel.HIGH]: 0
        },
        by_entity: {} as Record<EntityType, number>,
        by_action: {} as Record<ActionType, number>
      };

      // Count by level, entity, and action
      data?.forEach(notification => {
        stats.by_level[notification.notification_level]++;
        stats.by_entity[notification.entity_type] = (stats.by_entity[notification.entity_type] || 0) + 1;
        stats.by_action[notification.action_type] = (stats.by_action[notification.action_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return {
        total: 0,
        unread: 0,
        dismissed: 0,
        by_level: {
          [NotificationLevel.LOW]: 0,
          [NotificationLevel.MEDIUM]: 0,
          [NotificationLevel.HIGH]: 0
        },
        by_entity: {} as Record<EntityType, number>,
        by_action: {} as Record<ActionType, number>
      };
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(payload: CreateNotificationPayload): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: payload.user_id,
        p_entity_type: payload.entity_type,
        p_entity_id: payload.entity_id,
        p_action_type: payload.action_type,
        p_notification_level: payload.notification_level || NotificationLevel.MEDIUM,
        p_title: payload.title,
        p_message: payload.message,
        p_metadata: payload.metadata || {},
        p_expires_at: payload.expires_at
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  /**
   * Create notification using template
   */
  async createNotificationFromTemplate(
    templateKey: keyof typeof NOTIFICATION_TEMPLATES,
    userId: string,
    entityId: string,
    metadata: Record<string, any>
  ): Promise<string | null> {
    const template = NOTIFICATION_TEMPLATES[templateKey];
    if (!template) {
      console.error('Template not found:', templateKey);
      return null;
    }

    // Replace placeholders in title and message
    let title = template.title_template;
    let message = template.message_template;
    let link = template.link_template;

    Object.entries(metadata).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      title = title.replace(placeholder, String(value));
      message = message.replace(placeholder, String(value));
      if (link) {
        link = link.replace(placeholder, String(value));
      }
    });

    return this.createNotification({
      user_id: userId,
      entity_type: template.entity_type,
      entity_id: entityId,
      action_type: template.action_type,
      notification_level: template.notification_level,
      title,
      message,
      metadata: { ...metadata, link }
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('mark_notification_read', {
        p_notification_id: notificationId
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('mark_all_notifications_read', {
        p_user_id: userId
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return 0;
    }
  }

  /**
   * Dismiss notification
   */
  async dismissNotification(notificationId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('dismiss_notification', {
        p_notification_id: notificationId
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error dismissing notification:', error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_unread_notification_count', {
        p_user_id: userId
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<UserNotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: UpdateNotificationPreferencesPayload
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .update(preferences)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  /**
   * Create or update user notification preferences
   */
  async upsertUserPreferences(
    userId: string,
    preferences: UpdateNotificationPreferencesPayload
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error upserting user preferences:', error);
      return false;
    }
  }

  /**
   * Get notification aggregations
   */
  async getNotificationAggregations(userId: string): Promise<NotificationAggregation[]> {
    try {
      const { data, error } = await supabase
        .from('notification_aggregations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching notification aggregations:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'app_notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const appNotification = payload.new as AppNotification;
          const notification = this.mapAppNotificationToNotification(appNotification);
          callback(notification);
        }
      )
      .subscribe();
  }

  /**
   * Unsubscribe from real-time notifications
   */
  unsubscribeFromNotifications(userId: string) {
    return supabase.channel(`notifications:${userId}`).unsubscribe();
  }

  /**
   * Map database notification to frontend notification
   */
  private mapAppNotificationToNotification(appNotification: AppNotification): Notification {
    return {
      id: appNotification.id,
      title: appNotification.title,
      message: appNotification.message,
      type: mapNotificationLevelToType(appNotification.notification_level),
      level: appNotification.notification_level,
      entityType: appNotification.entity_type,
      actionType: appNotification.action_type,
      entityId: appNotification.entity_id,
      metadata: appNotification.metadata,
      timestamp: appNotification.created_at,
      isRead: appNotification.is_read,
      isDismissed: appNotification.is_dismissed,
      link: appNotification.metadata?.link,
      expiresAt: appNotification.expires_at || undefined
    };
  }

  /**
   * Cleanup expired notifications (admin function)
   */
  async cleanupExpiredNotifications(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_notifications');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      return 0;
    }
  }

  /**
   * Batch create notifications
   */
  async batchCreateNotifications(payloads: CreateNotificationPayload[]): Promise<string[]> {
    const results: string[] = [];
    
    for (const payload of payloads) {
      const result = await this.createNotification(payload);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(notificationId: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('app_notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (error) throw error;

      return this.mapAppNotificationToNotification(data);
    } catch (error) {
      console.error('Error fetching notification by ID:', error);
      return null;
    }
  }

  /**
   * Search notifications
   */
  async searchNotifications(query: string, filters: NotificationFilters = {}): Promise<Notification[]> {
    try {
      let dbQuery = supabase
        .from('app_notifications')
        .select('*')
        .or(`title.ilike.%${query}%,message.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      // Apply additional filters
      if (filters.entity_type) {
        dbQuery = dbQuery.eq('entity_type', filters.entity_type);
      }
      if (filters.action_type) {
        dbQuery = dbQuery.eq('action_type', filters.action_type);
      }
      if (filters.notification_level) {
        dbQuery = dbQuery.eq('notification_level', filters.notification_level);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;

      return (data || []).map(this.mapAppNotificationToNotification);
    } catch (error) {
      console.error('Error searching notifications:', error);
      return [];
    }
  }
}

export const enhancedNotificationService = new EnhancedNotificationService();

// Legacy compatibility - keep the old service for backward compatibility
export class NotificationService {
  async getUnreadNotifications(userId: string, userRole: 'coach' | 'client'): Promise<Notification[]> {
    return enhancedNotificationService.getUnreadNotifications(userId);
  }

  async markNotificationAsRead(notificationId: string, source: string): Promise<boolean> {
    return enhancedNotificationService.markAsRead(notificationId);
  }

  async markAllNotificationsAsRead(userId: string, userRole: 'coach' | 'client'): Promise<boolean> {
    const count = await enhancedNotificationService.markAllAsRead(userId);
    return count > 0;
  }
}

export const notificationService = new NotificationService(); 