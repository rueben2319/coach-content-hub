import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { enhancedNotificationService } from '@/services/notificationService';
import {
  Notification,
  NotificationFilters,
  NotificationStats,
  UserNotificationPreferences,
  UpdateNotificationPreferencesPayload,
  EntityType,
  ActionType,
  NotificationLevel
} from '@/types/notification';

export const useNotifications = (filters: NotificationFilters = {}) => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications with filters
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];
      return await enhancedNotificationService.getNotifications(filters);
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Fetch unread notifications
  const {
    data: unreadNotifications = [],
    isLoading: unreadLoading,
    refetch: refetchUnread
  } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await enhancedNotificationService.getUnreadNotifications(user.id);
    },
    enabled: !!user?.id,
    refetchInterval: 15000, // Refetch unread more frequently
    staleTime: 5000,
  });

  // Fetch notification statistics
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['notification-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await enhancedNotificationService.getNotificationStats(user.id);
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refetch stats every minute
    staleTime: 30000,
  });

  // Fetch user preferences
  const {
    data: preferences,
    isLoading: preferencesLoading,
    refetch: refetchPreferences
  } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await enhancedNotificationService.getUserPreferences(user.id);
    },
    enabled: !!user?.id,
    staleTime: 300000, // Preferences don't change often
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await enhancedNotificationService.markAsRead(notificationId);
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats', user?.id] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return 0;
      return await enhancedNotificationService.markAllAsRead(user.id);
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats', user?.id] });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
    },
  });

  // Dismiss notification
  const dismissNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await enhancedNotificationService.dismissNotification(notificationId);
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats', user?.id] });
    },
    onError: (error) => {
      console.error('Error dismissing notification:', error);
    },
  });

  // Update user preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: UpdateNotificationPreferencesPayload) => {
      if (!user?.id) return false;
      return await enhancedNotificationService.updateUserPreferences(user.id, preferences);
    },
    onSuccess: () => {
      // Invalidate preferences
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating notification preferences:', error);
    },
  });

  // Create notification
  const createNotificationMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await enhancedNotificationService.createNotification(payload);
    },
    onSuccess: () => {
      // Invalidate notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats', user?.id] });
    },
    onError: (error) => {
      console.error('Error creating notification:', error);
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const subscription = enhancedNotificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        // Update the cache with the new notification
        queryClient.setQueryData(
          ['unread-notifications', user.id],
          (oldData: Notification[] = []) => [newNotification, ...oldData]
        );

        // Update stats
        queryClient.setQueryData(
          ['notification-stats', user.id],
          (oldStats: NotificationStats | undefined) => {
            if (!oldStats) return oldStats;
            return {
              ...oldStats,
              total: oldStats.total + 1,
              unread: oldStats.unread + 1,
              by_level: {
                ...oldStats.by_level,
                [newNotification.level]: oldStats.by_level[newNotification.level] + 1
              },
              by_entity: {
                ...oldStats.by_entity,
                [newNotification.entityType]: (oldStats.by_entity[newNotification.entityType] || 0) + 1
              },
              by_action: {
                ...oldStats.by_action,
                [newNotification.actionType]: (oldStats.by_action[newNotification.actionType] || 0) + 1
              }
            };
          }
        );
      }
    );

    return () => {
      enhancedNotificationService.unsubscribeFromNotifications(user.id);
    };
  }, [user?.id, queryClient]);

  // Helper functions
  const markAsRead = useCallback((notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const dismissNotification = useCallback((notificationId: string) => {
    dismissNotificationMutation.mutate(notificationId);
  }, [dismissNotificationMutation]);

  const updatePreferences = useCallback((preferences: UpdateNotificationPreferencesPayload) => {
    updatePreferencesMutation.mutate(preferences);
  }, [updatePreferencesMutation]);

  const createNotification = useCallback((payload: any) => {
    createNotificationMutation.mutate(payload);
  }, [createNotificationMutation]);

  // Computed values
  const unreadCount = unreadNotifications.length;
  const totalCount = stats?.total || 0;
  const dismissedCount = stats?.dismissed || 0;

  return {
    // Data
    notifications,
    unreadNotifications,
    stats,
    preferences,
    unreadCount,
    totalCount,
    dismissedCount,

    // Loading states
    isLoading,
    unreadLoading,
    statsLoading,
    preferencesLoading,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDismissing: dismissNotificationMutation.isPending,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    isCreatingNotification: createNotificationMutation.isPending,

    // Error states
    error,
    markAsReadError: markAsReadMutation.error,
    markAllAsReadError: markAllAsReadMutation.error,
    dismissError: dismissNotificationMutation.error,
    updatePreferencesError: updatePreferencesMutation.error,
    createNotificationError: createNotificationMutation.error,

    // Actions
    markAsRead,
    markAllAsRead,
    dismissNotification,
    updatePreferences,
    createNotification,

    // Refetch functions
    refetch,
    refetchUnread,
    refetchStats,
    refetchPreferences,
  };
};

// Specialized hooks for common use cases
export const useUnreadNotifications = () => {
  const { unreadNotifications, unreadCount, unreadLoading, markAsRead, markAllAsRead } = useNotifications();
  
  return {
    notifications: unreadNotifications,
    count: unreadCount,
    isLoading: unreadLoading,
    markAsRead,
    markAllAsRead,
  };
};

export const useNotificationStats = () => {
  const { stats, statsLoading, refetchStats } = useNotifications();
  
  return {
    stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  };
};

export const useNotificationPreferences = () => {
  const { preferences, preferencesLoading, updatePreferences, isUpdatingPreferences } = useNotifications();
  
  return {
    preferences,
    isLoading: preferencesLoading,
    updatePreferences,
    isUpdating: isUpdatingPreferences,
  };
};

// Hook for creating notifications
export const useCreateNotification = () => {
  const { createNotification, isCreatingNotification, createNotificationError } = useNotifications();
  
  return {
    createNotification,
    isCreating: isCreatingNotification,
    error: createNotificationError,
  };
}; 