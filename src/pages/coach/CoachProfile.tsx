
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import { MapPin, Calendar, Users, BookOpen, Star } from 'lucide-react';
import { PaymentSettingsCard } from '@/components/profile/PaymentSettingsCard';
import { DesktopContainer, DesktopGrid, DesktopCard, DesktopSection } from '@/components/layout/DesktopLayoutUtils';

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
      <DesktopContainer>
        <div className="desktop-flex-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
            className="desktop-button-secondary"
          >
            ← Back to Profile
          </Button>
        </div>
        <ProfileForm onSuccess={handleEditSuccess} />
      </DesktopContainer>
    );
  }

  return (
    <DesktopContainer>
      <DesktopSection
        title="Coach Profile"
        subtitle="Manage your coaching profile and settings"
      >
        {/* Profile Header */}
        <DesktopCard className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-10">
              <Avatar className="w-40 h-40 border-4 border-white shadow-2xl">
                <AvatarImage src={profile.avatar_url || ''} alt={fullName} />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-green-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-6">
                <div className="desktop-flex-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h2 className="desktop-heading-primary">{fullName || 'Coach Profile'}</h2>
                      <Badge variant="secondary" className="px-4 py-2 text-base font-semibold">Coach</Badge>
                      {profile.is_public && (
                        <Badge variant="outline" className="px-4 py-2 text-base font-semibold border-green-200 text-green-700 bg-green-50">
                          Public Profile
                        </Badge>
                      )}
                    </div>
                    
                    {profile.bio && (
                      <p className="desktop-text-large max-w-4xl">{profile.bio}</p>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="desktop-button-primary"
                  >
                    Edit Profile
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-8 text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-gray-400" />
                      <span className="desktop-text-body font-semibold">{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.experience_years && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                      <span className="desktop-text-body font-semibold">{profile.experience_years} years experience</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-gray-400" />
                    <span className="desktop-text-body font-semibold">Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </DesktopCard>

        {/* Specialties */}
        {profile.specialties && profile.specialties.length > 0 && (
          <DesktopCard>
            <CardHeader className="pb-6">
              <CardTitle className="desktop-heading-secondary">Specialties</CardTitle>
              <CardDescription className="desktop-text-body">Areas of expertise and focus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profile.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="px-6 py-3 text-base font-semibold">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </DesktopCard>
        )}

        {/* Stats Cards */}
        <DesktopGrid cols={3} gap="xl">
          <div className="desktop-stat-card">
            <div className="flex items-center gap-6">
              <div className="p-6 bg-blue-100 rounded-2xl">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <p className="desktop-stat-value">0</p>
                <p className="desktop-stat-label">Courses Created</p>
              </div>
            </div>
          </div>

          <div className="desktop-stat-card">
            <div className="flex items-center gap-6">
              <div className="p-6 bg-green-100 rounded-2xl">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <p className="desktop-stat-value">0</p>
                <p className="desktop-stat-label">Students</p>
              </div>
            </div>
          </div>

          <div className="desktop-stat-card">
            <div className="flex items-center gap-6">
              <div className="p-6 bg-yellow-100 rounded-2xl">
                <Star className="w-10 h-10 text-yellow-600" />
              </div>
              <div>
                <p className="desktop-stat-value">0</p>
                <p className="desktop-stat-label">Average Rating</p>
              </div>
            </div>
          </div>
        </DesktopGrid>

        {/* Profile Completion */}
        {!profile.profile_completed && (
          <DesktopCard className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader className="pb-6">
              <CardTitle className="desktop-heading-secondary text-yellow-800">Complete Your Profile</CardTitle>
              <CardDescription className="desktop-text-body text-yellow-700">
                Complete your profile to start attracting students and creating courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsEditing(true)} 
                className="bg-yellow-600 hover:bg-yellow-700 desktop-button-primary"
              >
                Complete Profile
              </Button>
            </CardContent>
          </DesktopCard>
        )}

        {/* Payment Settings Card */}
        <PaymentSettingsCard />
      </DesktopSection>
    </DesktopContainer>
  );
};

export default CoachProfile;
