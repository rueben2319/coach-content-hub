export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: {
    maxCourses: number;
    maxStudents: number;
    storageGB: number;
    analytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
  popular?: boolean;
}

export interface CoachSubscription {
  id: string;
  coach_id: string;
  tier: string;
  status: 'active' | 'inactive' | 'trial' | 'expired';
  billing_cycle: string;
  price: number;
  currency: string;
  started_at: string;
  expires_at: string | null;
  paychangu_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUsage {
  coursesCreated: number;
  studentsEnrolled: number;
  storageUsedMB: number;
}
