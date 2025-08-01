import React, { useState, useCallback } from 'react';
import { useNotifications, useUnreadNotifications, useNotificationStats, useNotificationPreferences } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Check, 
  X, 
  Filter, 
  Search, 
  Settings, 
  Clock, 
  AlertCircle, 
  Info, 
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  EntityType,
  ActionType,
  NotificationLevel,
  getNotificationIcon,
  getNotificationColor,
  formatNotificationTimestamp,
  mapNotificationLevelToType
} from '@/types/notification';

interface NotificationCenterProps {
  className?: string;
  variant?: 'dropdown' | 'fullscreen' | 'sidebar';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className,
  variant = 'dropdown'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    entity_type: undefined as EntityType | undefined,
    action_type: undefined as ActionType | undefined,
    notification_level: undefined as NotificationLevel | undefined,
    is_read: undefined as boolean | undefined,
  });

  const {
    notifications,
    unreadNotifications,
    stats,
    preferences,
    unreadCount,
    totalCount,
    isLoading,
    unreadLoading,
    statsLoading,
    preferencesLoading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    updatePreferences,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDismissing,
    isUpdatingPreferences,
  } = useNotifications(filters);

  const { preferences: userPreferences, updatePreferences: updateUserPreferences } = useNotificationPreferences();

  // Filter notifications based on active tab and search
  const filteredNotifications = useCallback(() => {
    let filtered = notifications;

    // Filter by tab
    switch (activeTab) {
      case 'unread':
        filtered = unreadNotifications;
        break;
      case 'read':
        filtered = notifications.filter(n => n.isRead);
        break;
      case 'dismissed':
        filtered = notifications.filter(n => n.isDismissed);
        break;
      default:
        filtered = notifications;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [notifications, unreadNotifications, activeTab, searchQuery]);

  const handleMarkAsRead = useCallback((notificationId: string) => {
    markAsRead(notificationId);
  }, [markAsRead]);

  const handleDismiss = useCallback((notificationId: string) => {
    dismissNotification(notificationId);
  }, [dismissNotification]);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  }, []);

  const handlePreferenceChange = useCallback((key: string, value: boolean) => {
    if (userPreferences) {
      updateUserPreferences({
        [key]: value
      });
    }
  }, [userPreferences, updateUserPreferences]);

  const getNotificationIcon = (notification: any) => {
    const IconComponent = getNotificationIcon(notification.entityType);
    return <IconComponent className="w-4 h-4" />;
  };

  const renderNotificationItem = (notification: any) => (
    <div
      key={notification.id}
      className={cn(
        "flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
        !notification.isRead && "bg-blue-50",
        notification.isDismissed && "opacity-60"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full",
        getNotificationColor(notification.level)
      )}>
        {getNotificationIcon(notification)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {notification.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {notification.entityType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {notification.level}
              </Badge>
              <span className="text-xs text-gray-400">
                {formatNotificationTimestamp(notification.timestamp)}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.isRead && (
                <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                  <Check className="w-4 h-4 mr-2" />
                  Mark as read
                </DropdownMenuItem>
              )}
              {!notification.isDismissed && (
                <DropdownMenuItem onClick={() => handleDismiss(notification.id)}>
                  <X className="w-4 h-4 mr-2" />
                  Dismiss
                </DropdownMenuItem>
              )}
              {notification.link && (
                <DropdownMenuItem onClick={() => window.location.href = notification.link}>
                  <Eye className="w-4 h-4 mr-2" />
                  View details
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dismissed</p>
              <p className="text-2xl font-bold text-gray-500">{stats?.dismissed || 0}</p>
            </div>
            <X className="w-8 h-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification Filters</DialogTitle>
              <DialogDescription>
                Customize which notifications you want to see.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Entity Type</Label>
                <Select value={filters.entity_type || 'all'} onValueChange={(value) => handleFilterChange('entity_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {Object.values(EntityType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Action Type</Label>
                <Select value={filters.action_type || 'all'} onValueChange={(value) => handleFilterChange('action_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {Object.values(ActionType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Notification Level</Label>
                <Select value={filters.notification_level || 'all'} onValueChange={(value) => handleFilterChange('notification_level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {Object.values(NotificationLevel).map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Preferences
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>
            Customize your notification settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-enabled">Email Notifications</Label>
            <Switch
              id="email-enabled"
              checked={userPreferences?.email_enabled ?? true}
              onCheckedChange={(checked) => handlePreferenceChange('email_enabled', checked)}
              disabled={isUpdatingPreferences}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-enabled">Push Notifications</Label>
            <Switch
              id="push-enabled"
              checked={userPreferences?.push_enabled ?? true}
              onCheckedChange={(checked) => handlePreferenceChange('push_enabled', checked)}
              disabled={isUpdatingPreferences}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="in-app-enabled">In-App Notifications</Label>
            <Switch
              id="in-app-enabled"
              checked={userPreferences?.in_app_enabled ?? true}
              onCheckedChange={(checked) => handlePreferenceChange('in_app_enabled', checked)}
              disabled={isUpdatingPreferences}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderContent = () => (
    <div className="space-y-4">
      {renderStats()}
      {renderFilters()}
      
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          {renderPreferences()}
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isMarkingAllAsRead}>
              {isMarkingAllAsRead ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Mark all read
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="h-96">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading notifications...</span>
          </div>
        ) : filteredNotifications().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mb-4" />
            <p>No notifications found</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredNotifications().map(renderNotificationItem)}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  if (variant === 'dropdown') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96 p-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={isMarkingAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="h-80">
            {unreadLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell className="w-8 h-8 mb-2" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              <div className="space-y-0">
                {unreadNotifications.map(renderNotificationItem)}
              </div>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Center
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter; 