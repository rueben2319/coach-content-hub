
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import { MapPin, Calendar, BookOpen, Trophy, Clock, Camera, Star, Search, Grid, List, Percent, RotateCcw, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const ClientProfile = () => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  
  // State for search, filters, and view toggles
  const [discountSearch, setDiscountSearch] = React.useState('');
  const [discountProvider, setDiscountProvider] = React.useState('All');
  const [discountType, setDiscountType] = React.useState('All');
  const [discountView, setDiscountView] = React.useState<'grid' | 'list'>('grid');
  
  const [historySearch, setHistorySearch] = React.useState('');
  const [historyProvider, setHistoryProvider] = React.useState('All');
  const [historyType, setHistoryType] = React.useState('All');
  const [historyView, setHistoryView] = React.useState<'grid' | 'list'>('grid');
  
  const [transcriptSearch, setTranscriptSearch] = React.useState('');
  const [transcriptProvider, setTranscriptProvider] = React.useState('All');
  const [transcriptType, setTranscriptType] = React.useState('All');
  const [transcriptView, setTranscriptView] = React.useState<'grid' | 'list'>('grid');

  // New state for Badges & Certificates tab
  const [badgesSearch, setBadgesSearch] = React.useState('');
  const [badgesProvider, setBadgesProvider] = React.useState('All');
  const [badgesType, setBadgesType] = React.useState('All');
  const [badgesView, setBadgesView] = React.useState<'grid' | 'list'>('grid');

  if (!profile) return null;

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 relative overflow-hidden">
        {/* Abstract flowing lines background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white/20">
                <AvatarImage src={profile.avatar_url || ''} alt={fullName} />
                <AvatarFallback className="text-2xl bg-white/10 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Camera Icon */}
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Welcome Message & User Info */}
            <div className="flex-1 text-white text-left">
              <p className="text-sm text-white/80 mb-1">Welcome,</p>
              <h1 className="text-3xl font-bold mb-2">{fullName || 'Student'}</h1>
              <p className="text-white/90">Learner • Networking Academy</p>
            </div>
            
            {/* Statistics */}
            <div className="flex gap-6">
              <div className="text-center text-white">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold">1</span>
                </div>
                <p className="text-sm text-white/80">Badges Earned</p>
              </div>
              <div className="text-center text-white">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="w-6 h-6 text-purple-300" />
                  <span className="text-2xl font-bold">0</span>
                </div>
                <p className="text-sm text-white/80">Courses Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-white shadow-sm border">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              Profile
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Badges & Certificates
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Discounts
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Learning History
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Transcript
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {isEditing ? (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="mb-4"
            >
              ← Back to Profile
            </Button>
          <ProfileForm onSuccess={handleEditSuccess} />
        </div>
            ) : (
              <div className="space-y-6">
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
                  <h1 className="text-2xl font-bold">{fullName || 'Student Profile'}</h1>
                  <Badge variant="secondary" className="w-fit">Student</Badge>
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

        {/* Learning Interests */}
        {profile.specialties && profile.specialties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Interests</CardTitle>
              <CardDescription>Areas you're interested in learning about</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}



        {/* Profile Completion */}
        {!profile.profile_completed && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Complete Your Profile</CardTitle>
              <CardDescription className="text-blue-700">
                Complete your profile to get personalized course recommendations and connect with coaches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="badges">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search Badges & Certificates"
                    value={badgesSearch}
                    onChange={e => setBadgesSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={badgesProvider}
                    onChange={e => setBadgesProvider(e.target.value)}
                  >
                    <option value="All">Provider</option>
                    <option value="All">All</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Microsoft">Microsoft</option>
                  </select>
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={badgesType}
                    onChange={e => setBadgesType(e.target.value)}
                  >
                    <option value="All">Type</option>
                    <option value="All">All</option>
                    <option value="Badge">Badge</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>
                {/* View Toggle */}
                <div className="flex gap-1">
                  <Button
                    variant={badgesView === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className={badgesView === 'grid' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setBadgesView('grid')}
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={badgesView === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className={badgesView === 'list' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setBadgesView('list')}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                      <Star className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">No Badges or Certificates Available!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discounts">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search Discounts"
                    value={discountSearch}
                    onChange={e => setDiscountSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={discountProvider}
                    onChange={e => setDiscountProvider(e.target.value)}
                  >
                    <option value="All">Provider</option>
                    <option value="All">All</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Microsoft">Microsoft</option>
                  </select>
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                  >
                    <option value="All">Type</option>
                    <option value="All">All</option>
                    <option value="Student">Student</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                {/* View Toggle */}
                <div className="flex gap-1">
                  <Button
                    variant={discountView === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className={discountView === 'grid' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setDiscountView('grid')}
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={discountView === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className={discountView === 'list' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setDiscountView('list')}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                      <Star className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">No Discounts Available!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search Learning History"
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={historyProvider}
                    onChange={e => setHistoryProvider(e.target.value)}
                  >
                    <option value="All">Provider</option>
                    <option value="All">All</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Microsoft">Microsoft</option>
                  </select>
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={historyType}
                    onChange={e => setHistoryType(e.target.value)}
                  >
                    <option value="All">Type</option>
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                {/* View Toggle */}
                <div className="flex gap-1">
                  <Button
                    variant={historyView === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className={historyView === 'grid' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setHistoryView('grid')}
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={historyView === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className={historyView === 'list' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setHistoryView('list')}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                      <RotateCcw className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">No Learning History Available!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transcript">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search Transcript"
                    value={transcriptSearch}
                    onChange={e => setTranscriptSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={transcriptProvider}
                    onChange={e => setTranscriptProvider(e.target.value)}
                  >
                    <option value="All">Provider</option>
                    <option value="All">All</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Microsoft">Microsoft</option>
                  </select>
                  <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={transcriptType}
                    onChange={e => setTranscriptType(e.target.value)}
                  >
                    <option value="All">Type</option>
                    <option value="All">All</option>
                    <option value="Certificates">Certificates</option>
                    <option value="Courses">Courses</option>
                  </select>
                </div>
                {/* View Toggle */}
                <div className="flex gap-1">
                  <Button
                    variant={transcriptView === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className={transcriptView === 'grid' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setTranscriptView('grid')}
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={transcriptView === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className={transcriptView === 'list' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
                    onClick={() => setTranscriptView('list')}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">No Transcript Data Available!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientProfile;
