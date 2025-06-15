
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  trialSubscriptions: number;
  totalCoaches: number;
  avgRevenuePerCoach: number;
  growthRate: number;
}

interface TierStats {
  tier: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface RevenueByMonth {
  month: string;
  revenue: number;
  subscriptions: number;
}

export const useAdminRevenueStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-revenue-stats'],
    queryFn: async () => {
      console.log('Fetching admin revenue stats');

      // Get all subscriptions with billing data
      const { data: subscriptions, error: subsError } = await supabase
        .from('coach_subscriptions')
        .select(`
          *,
          billing_history (
            amount,
            status,
            created_at
          )
        `);

      if (subsError) {
        console.error('Error fetching subscriptions:', subsError);
        throw subsError;
      }

      // Calculate revenue stats
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
      const canceledSubscriptions = subscriptions?.filter(s => s.status === 'inactive').length || 0;
      const trialSubscriptions = subscriptions?.filter(s => s.status === 'trial').length || 0;

      // Calculate total and monthly revenue from billing history
      let totalRevenue = 0;
      let monthlyRevenue = 0;

      subscriptions?.forEach(sub => {
        sub.billing_history?.forEach((bill: any) => {
          if (bill.status === 'paid') {
            totalRevenue += Number(bill.amount);
            
            const billDate = new Date(bill.created_at);
            if (billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
              monthlyRevenue += Number(bill.amount);
            }
          }
        });
      });

      const totalCoaches = subscriptions?.length || 0;
      const avgRevenuePerCoach = totalCoaches > 0 ? totalRevenue / totalCoaches : 0;
      
      // Simple growth rate calculation (this month vs last month)
      const growthRate = 15; // Placeholder - would need historical data

      const stats: RevenueStats = {
        totalRevenue,
        monthlyRevenue,
        activeSubscriptions,
        canceledSubscriptions,
        trialSubscriptions,
        totalCoaches,
        avgRevenuePerCoach,
        growthRate
      };

      console.log('Revenue stats:', stats);
      return stats;
    },
    enabled: !!user,
  });
};

export const useAdminTierStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-tier-stats'],
    queryFn: async () => {
      console.log('Fetching tier stats');

      const { data: subscriptions, error } = await supabase
        .from('coach_subscriptions')
        .select(`
          tier,
          price,
          status,
          billing_history (
            amount,
            status
          )
        `);

      if (error) {
        console.error('Error fetching tier stats:', error);
        throw error;
      }

      // Group by tier and calculate stats
      const tierMap = new Map<string, { count: number; revenue: number }>();

      subscriptions?.forEach(sub => {
        const tier = sub.tier;
        if (!tierMap.has(tier)) {
          tierMap.set(tier, { count: 0, revenue: 0 });
        }

        const tierData = tierMap.get(tier)!;
        tierData.count += 1;

        // Sum paid billing amounts for this subscription
        sub.billing_history?.forEach((bill: any) => {
          if (bill.status === 'paid') {
            tierData.revenue += Number(bill.amount);
          }
        });
      });

      const totalRevenue = Array.from(tierMap.values()).reduce((sum, tier) => sum + tier.revenue, 0);

      const tierStats: TierStats[] = Array.from(tierMap.entries()).map(([tier, data]) => ({
        tier,
        count: data.count,
        revenue: data.revenue,
        percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0
      }));

      console.log('Tier stats:', tierStats);
      return tierStats;
    },
    enabled: !!user,
  });
};

export const useAdminRevenueByMonth = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-revenue-by-month'],
    queryFn: async () => {
      console.log('Fetching revenue by month');

      const { data: billingHistory, error } = await supabase
        .from('billing_history')
        .select('amount, status, created_at')
        .eq('status', 'paid')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching billing history:', error);
        throw error;
      }

      // Group by month
      const monthlyData = new Map<string, { revenue: number; count: number }>();

      billingHistory?.forEach(bill => {
        const date = new Date(bill.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { revenue: 0, count: 0 });
        }

        const data = monthlyData.get(monthKey)!;
        data.revenue += Number(bill.amount);
        data.count += 1;
      });

      const revenueByMonth: RevenueByMonth[] = Array.from(monthlyData.entries())
        .map(([month, data]) => ({
          month,
          revenue: data.revenue,
          subscriptions: data.count
        }))
        .slice(-12); // Last 12 months

      console.log('Revenue by month:', revenueByMonth);
      return revenueByMonth;
    },
    enabled: !!user,
  });
};
