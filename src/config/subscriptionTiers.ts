
import { SubscriptionTier } from '@/types/subscription';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    billingCycle: 'monthly',
    features: {
      maxCourses: 5,
      maxStudents: 50,
      storageGB: 1,
      analytics: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    billingCycle: 'monthly',
    popular: true,
    features: {
      maxCourses: 25,
      maxStudents: 250,
      storageGB: 10,
      analytics: true,
      prioritySupport: false,
      customBranding: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    billingCycle: 'monthly',
    features: {
      maxCourses: -1, // unlimited
      maxStudents: -1, // unlimited
      storageGB: 100,
      analytics: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
];

export const YEARLY_DISCOUNT = 0.2; // 20% discount for yearly billing

export function getYearlyPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * (1 - YEARLY_DISCOUNT));
}

export function getTierById(tierId: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find(tier => tier.id === tierId);
}
