import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService, Notification } from '@/services/notificationService';

export const useNotifications = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch unread notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', user?.id, profile?.role],
    queryFn: async () => {
      if (!user?.id || !profile?.role) return [];
      return await notificationService.getUnreadNotifications(user.id, profile.role as 'coach' | 'client');
    },
    enabled: !!user?.id && !!profile?.role,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async ({ notificationId, source }: { notificationId: string; source: Notification['source'] }) => {
      console.log('Hook: Marking notification as read:', { notificationId, source });
      const result = await notificationService.markNotificationAsRead(notificationId, source);
      console.log('Hook: Mark as read result:', result);
      return result;
    },
    onSuccess: (result) => {
      console.log('Hook: Mark as read success, invalidating queries');
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id, profile?.role] });
    },
    onError: (error) => {
      console.error('Hook: Error marking notification as read:', error);
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !profile?.role) return false;
      return await notificationService.markAllNotificationsAsRead(user.id, profile.role as 'coach' | 'client');
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id, profile?.role] });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
    },
  });

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Helper function to mark notification as read
  const markAsRead = (notificationId: string, source: Notification['source']) => {
    markAsReadMutation.mutate({ notificationId, source });
  };

  // Helper function to mark all as read
  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}; 