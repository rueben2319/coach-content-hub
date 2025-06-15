
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

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 10000, // MWK
    features: {
      maxCourses: 5,
      maxStudents: 50,
      storageGB: 10,
      analytics: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50000, // MWK
    features: {
      maxCourses: 20,
      maxStudents: 200,
      storageGB: 50,
      analytics: true,
      prioritySupport: false,
      customBranding: false,
    },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 100000, // MWK
    features: {
      maxCourses: -1, // Unlimited
      maxStudents: -1, // Unlimited
      storageGB: 500,
      analytics: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
];

export const SUBSCRIPTION_TIERS = subscriptionTiers;

export const getTierById = (id: string): SubscriptionTier | undefined =>
  subscriptionTiers.find((tier) => tier.id === id);

export const getYearlyPrice = (monthlyPrice: number): number => {
  return Math.round(monthlyPrice * 12 * 0.8); // 20% discount for yearly
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
