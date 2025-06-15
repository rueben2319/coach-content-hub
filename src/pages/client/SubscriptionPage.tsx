
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Layers } from 'lucide-react';

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    coach_id: string;
    price: number;
    currency: string;
  } | null;
  enrolled_at: string;
  amount: number;
  payment_status: string;
  expires_at: string | null;
}

const fetchEnrollments = async (userId: string): Promise<Enrollment[]> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id,
      course:course_id (
        id,
        title,
        coach_id,
        price,
        currency
      ),
      enrolled_at,
      amount,
      payment_status,
      expires_at
    `)
    .eq('client_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) {
    throw error;
  }
  // Filter out enrollments where course is null
  return (data || []).filter((enr: any) => enr.course) as Enrollment[];
};

// Helper for payment status badge
const getStatusBadge = (status: string) => {
  const statusConfig = {
    completed: { label: 'Active', variant: 'default' as const },
    active: { label: 'Active', variant: 'default' as const },
    pending: { label: 'Pending', variant: 'secondary' as const },
    expired: { label: 'Expired', variant: 'destructive' as const },
    cancelled: { label: 'Cancelled', variant: 'outline' as const },
  };
  return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
};

const ClientSubscriptionPage: React.FC = () => {
  const { user } = useAuth();

  const { data: enrollments, isLoading, error } = useQuery({
    queryKey: ['client-enrollments', user?.id],
    queryFn: () => {
      if (!user) throw new Error('No user found');
      return fetchEnrollments(user.id);
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Layers className="w-7 h-7 text-blue-600" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            My Enrollments &amp; Subscriptions
          </h1>
        </div>

        {/* Enrollments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (enrollments && enrollments.length > 0) ? (
              <div className="divide-y space-y-0">
                {enrollments.map((enr) => (
                  <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" key={enr.id}>
                    <div>
                      <div className="font-semibold text-lg">{enr.course?.title}</div>
                      <div className="text-xs text-gray-500">{new Date(enr.enrolled_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">
                          {enr.course?.price} {enr.course?.currency}
                        </span>
                        <Badge {...getStatusBadge(enr.payment_status)}>
                          {getStatusBadge(enr.payment_status).label}
                        </Badge>
                      </div>
                      {enr.expires_at && (
                        <div className="text-xs text-gray-400">Expires: {new Date(enr.expires_at).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 p-6">
                You are not enrolled in any courses yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Contact our support team if you have questions about payments, subscriptions, or need help choosing the right course.
            </p>
            <Button variant="outline">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSubscriptionPage;
