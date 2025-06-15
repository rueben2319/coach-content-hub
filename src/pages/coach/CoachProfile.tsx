
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import { MapPin, Calendar, Users, BookOpen, Star } from 'lucide-react';

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
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="mb-4"
            >
              ← Back to Profile
            </Button>
          </div>
          <ProfileForm onSuccess={handleEditSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || ''} alt={fullName} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="text-2xl font-bold">{fullName || 'Coach Profile'}</h1>
                  <Badge variant="secondary" className="w-fit">Coach</Badge>
                  {profile.is_public && (
                    <Badge variant="outline" className="w-fit">Public Profile</Badge>
                  )}
                </div>
                
                {profile.bio && (
                  <p className="text-gray-600 max-w-2xl">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  
                  {profile.experience_years && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {profile.experience_years} years experience
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        {profile.specialties && profile.specialties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
              <CardDescription>Areas of expertise and focus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Courses Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        {!profile.profile_completed && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Complete Your Profile</CardTitle>
              <CardDescription className="text-yellow-700">
                Complete your profile to start attracting students and creating courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsEditing(true)} className="bg-yellow-600 hover:bg-yellow-700">
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoachProfile;
