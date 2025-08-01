// Enhanced Notification Management System Types
// Based on PRD requirements for comprehensive notification infrastructure

export enum EntityType {
  COURSE = 'COURSE',
  MODULE = 'MODULE',
  LESSON = 'LESSON',
  SECTION = 'SECTION',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  RESOURCE = 'RESOURCE',
  USER_PROFILE = 'USER_PROFILE',
  USER_ENROLLMENT = 'USER_ENROLLMENT',
  USER_PROGRESS = 'USER_PROGRESS',
  DISCUSSION = 'DISCUSSION',
  COMMENT = 'COMMENT',
  REVIEW = 'REVIEW',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAYMENT = 'PAYMENT',
  ACCESS_GRANT = 'ACCESS_GRANT',
  CONTENT_BLOCK = 'CONTENT_BLOCK',
  MEDIA_ASSET = 'MEDIA_ASSET'
}

export enum ActionType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  METADATA_UPDATE = 'METADATA_UPDATE',
  REORDER = 'REORDER',
  CONTENT_UPDATE = 'CONTENT_UPDATE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  ENROLLMENT = 'ENROLLMENT',
  PROGRESS_UPDATE = 'PROGRESS_UPDATE',
  RATING = 'RATING',
  COMMENT_ADD = 'COMMENT_ADD',
  SUBSCRIPTION_CHANGE = 'SUBSCRIPTION_CHANGE'
}

export enum NotificationLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface AppNotification {
  id: string;
  user_id: string;
  entity_type: EntityType;
  entity_id: string;
  action_type: ActionType;
  notification_level: NotificationLevel;
  title: string;
  message: string;
  metadata: Record<string, any>;
  is_read: boolean;
  is_dismissed: boolean;
  read_at: string | null;
  dismissed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserNotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  entity_preferences: Record<EntityType, boolean>;
  action_preferences: Record<ActionType, boolean>;
  level_preferences: Record<NotificationLevel, boolean>;
  quiet_hours_start: string; // TIME format
  quiet_hours_end: string; // TIME format
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationAggregation {
  id: string;
  user_id: string;
  aggregation_key: string;
  notification_ids: string[];
  title: string;
  message: string;
  metadata: Record<string, any>;
  is_read: boolean;
  is_dismissed: boolean;
  read_at: string | null;
  dismissed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// Frontend notification interface (simplified for UI)
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  level: NotificationLevel;
  entityType: EntityType;
  actionType: ActionType;
  entityId: string;
  metadata: Record<string, any>;
  timestamp: string;
  isRead: boolean;
  isDismissed: boolean;
  link?: string;
  expiresAt?: string;
}

// Notification creation payload
export interface CreateNotificationPayload {
  user_id: string;
  entity_type: EntityType;
  entity_id: string;
  action_type: ActionType;
  notification_level?: NotificationLevel;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

// Notification preferences update payload
export interface UpdateNotificationPreferencesPayload {
  email_enabled?: boolean;
  push_enabled?: boolean;
  in_app_enabled?: boolean;
  entity_preferences?: Partial<Record<EntityType, boolean>>;
  action_preferences?: Partial<Record<ActionType, boolean>>;
  level_preferences?: Partial<Record<NotificationLevel, boolean>>;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone?: string;
}

// Notification filters for querying
export interface NotificationFilters {
  entity_type?: EntityType;
  action_type?: ActionType;
  notification_level?: NotificationLevel;
  is_read?: boolean;
  is_dismissed?: boolean;
  created_after?: string;
  created_before?: string;
  limit?: number;
  offset?: number;
}

// Notification statistics
export interface NotificationStats {
  total: number;
  unread: number;
  dismissed: number;
  by_level: Record<NotificationLevel, number>;
  by_entity: Record<EntityType, number>;
  by_action: Record<ActionType, number>;
}

// Notification template for creating standardized notifications
export interface NotificationTemplate {
  entity_type: EntityType;
  action_type: ActionType;
  notification_level: NotificationLevel;
  title_template: string;
  message_template: string;
  link_template?: string;
  metadata_schema?: Record<string, any>;
}

// Predefined notification templates
export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  COURSE_ENROLLMENT: {
    entity_type: EntityType.USER_ENROLLMENT,
    action_type: ActionType.ENROLLMENT,
    notification_level: NotificationLevel.MEDIUM,
    title_template: 'Course Enrollment Confirmed',
    message_template: 'You have been successfully enrolled in {course_title}.',
    link_template: '/client/courses/{course_id}',
    metadata_schema: {
      course_id: 'string',
      course_title: 'string',
      enrollment_date: 'string'
    }
  },
  COURSE_PROGRESS: {
    entity_type: EntityType.USER_PROGRESS,
    action_type: ActionType.PROGRESS_UPDATE,
    notification_level: NotificationLevel.MEDIUM,
    title_template: 'Progress Updated',
    message_template: 'You have completed {section_title} in {course_title}.',
    link_template: '/client/courses/{course_id}/progress',
    metadata_schema: {
      course_id: 'string',
      course_title: 'string',
      section_id: 'string',
      section_title: 'string',
      progress_percentage: 'number'
    }
  },
  SUBSCRIPTION_CHANGE: {
    entity_type: EntityType.SUBSCRIPTION,
    action_type: ActionType.SUBSCRIPTION_CHANGE,
    notification_level: NotificationLevel.HIGH,
    title_template: 'Subscription Updated',
    message_template: 'Your subscription has been updated to {tier} plan.',
    link_template: '/coach/subscriptions',
    metadata_schema: {
      subscription_id: 'string',
      tier: 'string',
      status: 'string',
      price: 'number'
    }
  },
  NEW_STUDENT_ENROLLMENT: {
    entity_type: EntityType.USER_ENROLLMENT,
    action_type: ActionType.ENROLLMENT,
    notification_level: NotificationLevel.MEDIUM,
    title_template: 'New Student Enrollment',
    message_template: 'A new student has enrolled in your course {course_title}.',
    link_template: '/coach/courses/{course_id}/students',
    metadata_schema: {
      course_id: 'string',
      course_title: 'string',
      student_id: 'string',
      student_name: 'string',
      enrollment_date: 'string'
    }
  },
  COURSE_PUBLISHED: {
    entity_type: EntityType.COURSE,
    action_type: ActionType.PUBLISH,
    notification_level: NotificationLevel.MEDIUM,
    title_template: 'Course Published',
    message_template: 'Your course "{course_title}" has been successfully published.',
    link_template: '/coach/courses/{course_id}',
    metadata_schema: {
      course_id: 'string',
      course_title: 'string',
      published_at: 'string'
    }
  },
  ASSIGNMENT_SUBMITTED: {
    entity_type: EntityType.ASSIGNMENT,
    action_type: ActionType.INSERT,
    notification_level: NotificationLevel.MEDIUM,
    title_template: 'Assignment Submitted',
    message_template: 'A student has submitted an assignment for {course_title}.',
    link_template: '/coach/courses/{course_id}/assignments',
    metadata_schema: {
      course_id: 'string',
      course_title: 'string',
      assignment_id: 'string',
      assignment_title: 'string',
      student_id: 'string',
      student_name: 'string',
      submitted_at: 'string'
    }
  },
  PAYMENT_RECEIVED: {
    entity_type: EntityType.PAYMENT,
    action_type: ActionType.INSERT,
    notification_level: NotificationLevel.HIGH,
    title_template: 'Payment Received',
    message_template: 'You have received a payment of {amount} {currency} for {course_title}.',
    link_template: '/coach/payments',
    metadata_schema: {
      payment_id: 'string',
      amount: 'number',
      currency: 'string',
      course_id: 'string',
      course_title: 'string',
      student_id: 'string',
      student_name: 'string',
      received_at: 'string'
    }
  }
};

// Helper function to map notification level to UI type
export function mapNotificationLevelToType(level: NotificationLevel): 'info' | 'success' | 'warning' | 'error' {
  switch (level) {
    case NotificationLevel.HIGH:
      return 'error';
    case NotificationLevel.MEDIUM:
      return 'warning';
    case NotificationLevel.LOW:
      return 'info';
    default:
      return 'info';
  }
}

// Helper function to get notification icon based on entity type
export function getNotificationIcon(entityType: EntityType): string {
  switch (entityType) {
    case EntityType.COURSE:
      return 'BookOpen';
    case EntityType.MODULE:
      return 'FolderOpen';
    case EntityType.LESSON:
      return 'FileText';
    case EntityType.SECTION:
      return 'File';
    case EntityType.QUIZ:
      return 'HelpCircle';
    case EntityType.ASSIGNMENT:
      return 'ClipboardList';
    case EntityType.USER_ENROLLMENT:
      return 'UserPlus';
    case EntityType.USER_PROGRESS:
      return 'TrendingUp';
    case EntityType.SUBSCRIPTION:
      return 'CreditCard';
    case EntityType.PAYMENT:
      return 'DollarSign';
    case EntityType.DISCUSSION:
      return 'MessageSquare';
    case EntityType.COMMENT:
      return 'MessageCircle';
    case EntityType.REVIEW:
      return 'Star';
    default:
      return 'Bell';
  }
}

// Helper function to get notification color based on level
export function getNotificationColor(level: NotificationLevel): string {
  switch (level) {
    case NotificationLevel.HIGH:
      return 'border-l-red-500 bg-red-50';
    case NotificationLevel.MEDIUM:
      return 'border-l-yellow-500 bg-yellow-50';
    case NotificationLevel.LOW:
      return 'border-l-blue-500 bg-blue-50';
    default:
      return 'border-l-gray-500 bg-gray-50';
  }
}

// Helper function to format timestamp
export function formatNotificationTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
} 