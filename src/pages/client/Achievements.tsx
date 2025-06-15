
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, Medal, Target, Calendar } from 'lucide-react';

const Achievements = () => {
  // Mock achievements data
  const achievements = [
    {
      id: '1',
      title: 'First Course Completed',
      description: 'Successfully completed your first course',
      icon: Award,
      earned_at: '2024-01-10',
      type: 'milestone',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Quick Learner',
      description: 'Completed a course in under 2 weeks',
      icon: Star,
      earned_at: '2024-01-15',
      type: 'achievement',
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Dedicated Student',
      description: 'Studied for 7 consecutive days',
      icon: Trophy,
      earned_at: '2024-01-20',
      type: 'streak',
      rarity: 'uncommon'
    }
  ];

  const upcomingAchievements = [
    {
      id: '4',
      title: 'Course Master',
      description: 'Complete 5 courses',
      icon: Medal,
      progress: 3,
      target: 5,
      type: 'milestone'
    },
    {
      id: '5',
      title: 'Perfect Score',
      description: 'Get 100% on a quiz',
      icon: Target,
      progress: 0,
      target: 1,
      type: 'achievement'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800';
      case 'uncommon':
        return 'bg-green-100 text-green-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'epic':
        return 'bg-purple-100 text-purple-800';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'text-blue-600';
      case 'achievement':
        return 'text-green-600';
      case 'streak':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Achievements</h1>
        <p className="text-gray-600 mt-2">Celebrate your learning milestones and accomplishments</p>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
            <h3 className="text-2xl font-bold text-gray-900">{achievements.length}</h3>
            <p className="text-sm text-gray-600">Total Achievements</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              {achievements.filter(a => a.rarity === 'rare' || a.rarity === 'epic').length}
            </h3>
            <p className="text-sm text-gray-600">Rare Achievements</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Medal className="w-12 h-12 mx-auto mb-3 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">85</h3>
            <p className="text-sm text-gray-600">Achievement Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Earned Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getTypeColor(achievement.type)} bg-opacity-10`}>
                        <IconComponent className={`w-6 h-6 ${getTypeColor(achievement.type)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                          <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(achievement.earned_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No achievements earned yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAchievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.target) * 100;
              
              return (
                <div key={achievement.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-gray-100">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {achievement.progress} / {achievement.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
