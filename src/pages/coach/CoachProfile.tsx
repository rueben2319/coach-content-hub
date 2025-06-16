
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import { MapPin, Calendar, Users, BookOpen, Star } from 'lucide-react';
import { PaymentSettingsCard } from '@/components/profile/PaymentSettingsCard';

const CoachProfile = () => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  if (!profile) return null;

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2"
          >
            ← Back to Profile
          </Button>
        </div>
        <ProfileForm onSuccess={handleEditSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Coach Profile</h1>
        <p className="mt-2 text-gray-600">Manage your coaching profile and settings</p>
      </div>

      {/* Profile Header */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar_url || ''} alt={fullName} />
              <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-green-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">{fullName || 'Coach Profile'}</h2>
                    <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">Coach</Badge>
                    {profile.is_public && (
                      <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-green-200 text-green-700 bg-green-50">
                        Public Profile
                      </Badge>
                    )}
                  </div>
                  
                  {profile.bio && (
                    <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{profile.bio}</p>
                  )}
                </div>
                
                <Button 
                  onClick={() => setIsEditing(true)}
                  size="lg"
                  className="px-6 py-3 font-medium"
                >
                  Edit Profile
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 text-gray-600">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{profile.location}</span>
                  </div>
                )}
                
                {profile.experience_years && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{profile.experience_years} years experience</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      {profile.specialties && profile.specialties.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Specialties</CardTitle>
            <CardDescription className="text-base">Areas of expertise and focus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {profile.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm font-medium">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-base text-gray-600 font-medium">Courses Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-xl">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-base text-gray-600 font-medium">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-xl">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-base text-gray-600 font-medium">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      {!profile.profile_completed && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-yellow-800">Complete Your Profile</CardTitle>
            <CardDescription className="text-base text-yellow-700">
              Complete your profile to start attracting students and creating courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsEditing(true)} 
              className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 font-medium"
              size="lg"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Settings Card */}
      <PaymentSettingsCard />
    </div>
  );
};

export default CoachProfile;
