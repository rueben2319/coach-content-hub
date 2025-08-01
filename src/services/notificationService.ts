import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  link?: string;
  source: 'coaching_insights' | 'subscription_notifications' | 'system';
}

export interface CoachingInsight {
  id: string;
  coach_id: string;
  client_id: string;
  insight_type: 'progress_report' | 'recommendation' | 'concern' | 'achievement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_items: any[];
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

export interface SubscriptionNotification {
  id: string;
  subscription_id: string;
  notification_type: 'trial_expiring' | 'payment_failed' | 'renewal_reminder' | 'cancellation_confirmed';
  sent_at: string;
  email_sent: boolean;
  metadata: any;
}

class NotificationService {
  /**
   * Fetch all unread notifications for a user
   */
  async getUnreadNotifications(userId: string, userRole: 'coach' | 'client'): Promise<Notification[]> {
    try {
      const notifications: Notification[] = [];

      // Fetch coaching insights (for coaches)
      if (userRole === 'coach') {
        const coachingInsights = await this.getUnreadCoachingInsights(userId);
        notifications.push(...coachingInsights);
      }

      // Fetch subscription notifications (for coaches)
      if (userRole === 'coach') {
        const subscriptionNotifications = await this.getUnreadSubscriptionNotifications(userId);
        notifications.push(...subscriptionNotifications);
      }

      // Add some test notifications for debugging
      if (userRole === 'coach' && notifications.length === 0) {
        notifications.push({
          id: 'test-1',
          title: 'Test Notification',
          message: 'This is a test notification to verify the mark as read functionality.',
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false,
          link: '/coach/dashboard',
          source: 'system'
        });
      }

      // Sort by timestamp (newest first)
      return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  }

  /**
   * Fetch unread coaching insights
   */
  private async getUnreadCoachingInsights(coachId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('coaching_insights')
        .select('*')
        .eq('coach_id', coachId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map((insight: any) => ({
        id: insight.id,
        title: insight.title,
        message: insight.description,
        type: this.mapInsightTypeToNotificationType(insight.insight_type, insight.priority),
        timestamp: insight.created_at,
        isRead: insight.is_read,
        link: this.getInsightLink(insight),
        source: 'coaching_insights' as const
      }));
    } catch (error) {
      console.error('Error fetching coaching insights:', error);
      return [];
    }
  }

  /**
   * Fetch unread subscription notifications
   */
  private async getUnreadSubscriptionNotifications(coachId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_notifications')
        .select(`
          *,
          coach_subscriptions!inner(coach_id)
        `)
        .eq('coach_subscriptions.coach_id', coachId)
        .order('sent_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Filter out notifications that are marked as read in metadata
      const unreadNotifications = (data || []).filter((notification: any) => {
        const metadata = notification.metadata || {};
        return !metadata.is_read;
      });

      return unreadNotifications.map((notification: any) => ({
        id: notification.id,
        title: this.getSubscriptionNotificationTitle(notification.notification_type),
        message: this.getSubscriptionNotificationMessage(notification.notification_type, notification.metadata),
        type: this.mapSubscriptionTypeToNotificationType(notification.notification_type),
        timestamp: notification.sent_at,
        isRead: false, // We only return unread notifications
        link: this.getSubscriptionNotificationLink(notification.notification_type),
        source: 'subscription_notifications' as const
      }));
    } catch (error) {
      console.error('Error fetching subscription notifications:', error);
      return [];
    }
  }

  /**
   * Mark a notification as read
   */
  async markNotificationAsRead(notificationId: string, source: Notification['source']): Promise<boolean> {
    try {
      console.log('Marking notification as read:', { notificationId, source });
      
      if (source === 'coaching_insights') {
        const { data, error } = await supabase
          .from('coaching_insights')
          .update({ is_read: true })
          .eq('id', notificationId)
          .select();

        if (error) {
          console.error('Error updating coaching insight:', error);
          throw error;
        }
        
        console.log('Successfully marked coaching insight as read:', data);
        return true;
      }

      if (source === 'subscription_notifications') {
        // For subscription notifications, we'll add an is_read field to the metadata
        const { data, error } = await supabase
          .from('subscription_notifications')
          .update({ 
            metadata: { is_read: true }
          })
          .eq('id', notificationId)
          .select();

        if (error) {
          console.error('Error updating subscription notification:', error);
          throw error;
        }
        
        console.log('Successfully marked subscription notification as read:', data);
        return true;
      }

      if (source === 'system') {
        // For test notifications, just return true
        console.log('Test notification marked as read');
        return true;
      }

      console.log('Unknown notification source:', source);
      return false;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(userId: string, userRole: 'coach' | 'client'): Promise<boolean> {
    try {
      if (userRole === 'coach') {
        const { error } = await supabase
          .from('coaching_insights')
          .update({ is_read: true })
          .eq('coach_id', userId)
          .eq('is_read', false);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Map insight type and priority to notification type
   */
  private mapInsightTypeToNotificationType(insightType: string, priority: string): Notification['type'] {
    if (priority === 'urgent') return 'error';
    if (priority === 'high') return 'warning';
    if (insightType === 'achievement') return 'success';
    return 'info';
  }

  /**
   * Map subscription notification type to notification type
   */
  private mapSubscriptionTypeToNotificationType(notificationType: string): Notification['type'] {
    switch (notificationType) {
      case 'payment_failed':
        return 'error';
      case 'trial_expiring':
      case 'renewal_reminder':
        return 'warning';
      case 'cancellation_confirmed':
        return 'info';
      default:
        return 'info';
    }
  }

  /**
   * Get link for coaching insight
   */
  private getInsightLink(insight: CoachingInsight): string {
    switch (insight.insight_type) {
      case 'progress_report':
        return `/coach/dashboard?client=${insight.client_id}`;
      case 'recommendation':
        return `/coach/content`;
      case 'concern':
        return `/coach/dashboard?client=${insight.client_id}`;
      case 'achievement':
        return `/coach/dashboard?client=${insight.client_id}`;
      default:
        return '/coach/dashboard';
    }
  }

  /**
   * Get link for subscription notification
   */
  private getSubscriptionNotificationLink(notificationType: string): string {
    switch (notificationType) {
      case 'payment_failed':
      case 'trial_expiring':
      case 'renewal_reminder':
        return '/coach/subscriptions';
      case 'cancellation_confirmed':
        return '/coach/subscriptions';
      default:
        return '/coach/subscriptions';
    }
  }

  /**
   * Get title for subscription notification
   */
  private getSubscriptionNotificationTitle(notificationType: string): string {
    switch (notificationType) {
      case 'payment_failed':
        return 'Payment Failed';
      case 'trial_expiring':
        return 'Trial Expiring Soon';
      case 'renewal_reminder':
        return 'Subscription Renewal Reminder';
      case 'cancellation_confirmed':
        return 'Subscription Cancelled';
      default:
        return 'Subscription Update';
    }
  }

  /**
   * Get message for subscription notification
   */
  private getSubscriptionNotificationMessage(notificationType: string, metadata: any): string {
    switch (notificationType) {
      case 'payment_failed':
        return 'Your subscription payment has failed. Please update your payment method to continue accessing premium features.';
      case 'trial_expiring':
        return 'Your free trial will expire soon. Upgrade to a paid plan to continue creating and managing courses.';
      case 'renewal_reminder':
        return 'Your subscription will renew automatically. You can manage your subscription settings anytime.';
      case 'cancellation_confirmed':
        return 'Your subscription has been cancelled. You can reactivate it anytime from your subscription settings.';
      default:
        return 'You have a subscription update. Please check your subscription settings.';
    }
  }
}

export const notificationService = new NotificationService(); 