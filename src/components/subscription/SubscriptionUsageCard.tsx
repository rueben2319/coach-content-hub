
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SubscriptionTier, SubscriptionUsage } from '@/types/subscription';

interface SubscriptionUsageCardProps {
  tier: SubscriptionTier;
  usage: SubscriptionUsage;
}

const SubscriptionUsageCard: React.FC<SubscriptionUsageCardProps> = ({
  tier,
  usage,
}) => {
  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatLimit = (limit: number, unit: string) => {
    if (limit === -1) return 'Unlimited';
    return `${limit} ${unit}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Usage Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Courses */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Courses Created</span>
            <span>{usage.coursesCreated} / {formatLimit(tier.features.maxCourses, 'courses')}</span>
          </div>
          {tier.features.maxCourses !== -1 && (
            <Progress 
              value={getUsagePercentage(usage.coursesCreated, tier.features.maxCourses)} 
              className="h-2"
            />
          )}
        </div>

        {/* Students */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Students Enrolled</span>
            <span>{usage.studentsEnrolled} / {formatLimit(tier.features.maxStudents, 'students')}</span>
          </div>
          {tier.features.maxStudents !== -1 && (
            <Progress 
              value={getUsagePercentage(usage.studentsEnrolled, tier.features.maxStudents)} 
              className="h-2"
            />
          )}
        </div>

        {/* Storage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage Used</span>
            <span>{Math.round(usage.storageUsedMB / 1024 * 100) / 100}GB / {tier.features.storageGB}GB</span>
          </div>
          <Progress 
            value={getUsagePercentage(usage.storageUsedMB / 1024, tier.features.storageGB)} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionUsageCard;
