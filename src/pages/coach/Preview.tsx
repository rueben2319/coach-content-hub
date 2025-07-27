import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, Clock, Star, CheckCircle, Play, Download, Share2, ChevronDown, ChevronRight, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80';

const Preview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [editingChapter, setEditingChapter] = useState<{ moduleIndex: number; chapterIndex: number } | null>(null);

  // Fetch course data
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          coach:profiles!coach_id (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  // Fetch course modules/chapters (you'll need to create this table)
  const { data: modules = [] } = useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      // This is a placeholder - you'll need to create a modules table
      // For now, returning mock data
      return [
        {
          id: 1,
          title: 'Module 1: Introduction to Cybersecurity',
          duration: '4 hours',
          chapters: [
            {
              id: 1,
              title: 'Chapter 1: What is Cybersecurity?',
              duration: '45 minutes',
              topics: [
                'Understanding digital threats',
                'The importance of cybersecurity',
                'Basic security concepts',
                'Quiz: Security fundamentals'
              ]
            },
            {
              id: 2,
              title: 'Chapter 2: Types of Cyber Threats',
              duration: '60 minutes',
              topics: [
                'Malware and viruses',
                'Phishing attacks',
                'Social engineering',
                'DDoS attacks',
                'Practice: Identifying threats'
              ]
            }
          ]
        }
      ];
    },
    enabled: !!courseId,
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async (updatedCourse: any) => {
      const { data, error } = await supabase
        .from('courses')
        .update(updatedCourse)
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Course updated successfully!');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error('Failed to update course');
      console.error('Update error:', error);
    },
  });

  // Handle course update
  const handleCourseUpdate = (field: string, value: any) => {
    if (!course) return;
    
    const updatedCourse = { ...course, [field]: value };
    updateCourseMutation.mutate(updatedCourse);
  };

  // Handle module editing
  const handleModuleEdit = (moduleIndex: number) => {
    setEditingModule(editingModule === moduleIndex ? null : moduleIndex);
  };

  // Handle chapter editing
  const handleChapterEdit = (moduleIndex: number, chapterIndex: number) => {
    setEditingChapter(
      editingChapter?.moduleIndex === moduleIndex && editingChapter?.chapterIndex === chapterIndex
        ? null
        : { moduleIndex, chapterIndex }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/coach')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Check if user is the course owner
  const isCourseOwner = user?.id === course.coach_id;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="mb-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {course.category || 'Technology'}
                  </span>
                  {isCourseOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-white hover:bg-white/20"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={course.title}
                      onChange={(e) => handleCourseUpdate('title', e.target.value)}
                      className="text-4xl lg:text-5xl font-bold bg-white/10 border-white/20 text-white placeholder-white/70"
                      placeholder="Course title"
                    />
                    <Textarea
                      value={course.description || ''}
                      onChange={(e) => handleCourseUpdate('description', e.target.value)}
                      className="text-xl bg-white/10 border-white/20 text-blue-100 placeholder-blue-200 resize-none"
                      placeholder="Course description"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{course.title}</h1>
                    <p className="text-xl text-blue-100 mb-6 leading-relaxed">{course.description || 'Explore the world of learning and gain practical skills.'}</p>
                  </>
                )}
              </div>
              
              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.estimated_duration || '20 hours'}</div>
                  <div className="text-blue-200 text-sm">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.difficulty_level || 'Beginner'}</div>
                  <div className="text-blue-200 text-sm">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-blue-200 text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-blue-200 text-sm">Rating</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-start">
                {course.tags?.map((tag: string, index: number) => (
                  <span key={index} className="bg-blue-800/50 text-blue-100 px-3 py-1 rounded-full text-sm font-medium border border-blue-600/30">
                    {tag}
                  </span>
                )) || (
                  <span className="bg-blue-800/50 text-blue-100 px-3 py-1 rounded-full text-sm font-medium border border-blue-600/30">
                    Technology
                  </span>
                )}
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-24">
                <div className="text-center mb-6">
                  <img 
                    src={PLACEHOLDER_IMG} 
                    alt="Course" 
                    className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 shadow-lg" 
                  />
                  <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
                    ))}
                    <span className="text-gray-600 text-sm ml-1">(4.8)</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {isCourseOwner ? (
                    <>
                      <Button 
                        onClick={() => navigate(`/coach/course/${courseId}/edit`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Course
                      </Button>
                      <Button 
                        onClick={() => navigate(`/coach/course/${courseId}/content`)}
                        className="w-full bg-white border-2 border-blue-600 text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition duration-200 flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Manage Content
                      </Button>
                    </>
                  ) : (
                    <>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Enroll Now
                      </button>
                      <button className="w-full bg-white border-2 border-blue-600 text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition duration-200 flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Preview Course
                      </button>
                    </>
                  )}
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Syllabus
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Share this course</span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview" className="text-left">Overview</TabsTrigger>
                <TabsTrigger value="curriculum" className="text-left">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor" className="text-left">Instructor</TabsTrigger>
                <TabsTrigger value="reviews" className="text-left">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* About This Course */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-left">About This Course</h2>
                    {isCourseOwner && isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCourseMutation.mutate(course)}
                        disabled={updateCourseMutation.isPending}
                      >
                        {updateCourseMutation.isPending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <Textarea
                      value={course.description || ''}
                      onChange={(e) => handleCourseUpdate('description', e.target.value)}
                      className="prose prose-lg max-w-none text-left min-h-[200px]"
                      placeholder="Enter course description..."
                    />
                  ) : (
                    <div className="prose prose-lg max-w-none text-left">
                      <p className="text-gray-700 leading-relaxed mb-6">{course.description || 'No description available.'}</p>
                    </div>
                  )}
                </section>

                {/* What You'll Learn */}
                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-gray-500 italic">No learning objectives defined yet.</div>
                  </div>
                </section>

                {/* Prerequisites */}
                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">Prerequisites</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <ul className="space-y-2">
                      <li className="text-gray-500 italic">No prerequisites listed.</li>
                    </ul>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-8">
                {/* Course Modules */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-left">Course Modules</h2>
                    {isCourseOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/coach/course/${courseId}/content`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Module
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {modules.map((module: any, moduleIndex: number) => (
                      <div key={moduleIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {/* Module Header */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {module.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 justify-start">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {module.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  {module.chapters?.length || 0} chapters
                                </span>
                              </div>
                            </div>
                            {isCourseOwner && (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleModuleEdit(moduleIndex)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Chapters Accordion */}
                        <Accordion type="single" collapsible className="w-full">
                          {module.chapters?.map((chapter: any, chapterIndex: number) => (
                            <AccordionItem key={chapterIndex} value={`module-${moduleIndex}-chapter-${chapterIndex}`}>
                              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 text-left">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-sm">{chapterIndex + 1}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                                    <p className="text-sm text-gray-600">{chapter.duration}</p>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-4">
                                <div className="space-y-3">
                                  {chapter.topics?.map((topic: string, topicIndex: number) => (
                                    <div key={topicIndex} className="flex items-center gap-3 pl-11">
                                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                                      <span className="text-gray-700 text-sm">{topic}</span>
                                    </div>
                                  )) || (
                                    <div className="text-gray-500 italic pl-11">No topics defined.</div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )) || (
                            <div className="p-6 text-gray-500 italic">No chapters defined yet.</div>
                          )}
                        </Accordion>
                      </div>
                    ))}
                    
                    {modules.length === 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules yet</h3>
                        <p className="text-gray-600 mb-4">Start building your course by adding modules and chapters.</p>
                        {isCourseOwner && (
                          <Button onClick={() => navigate(`/coach/course/${courseId}/content`)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Module
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-8">
                {/* Instructor Information */}
                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">Instructor</h2>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-6 justify-start">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {course.coach?.first_name?.[0] || 'C'}
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {course.coach?.first_name} {course.coach?.last_name}
                        </h3>
                        <p className="text-lg text-gray-600 mb-4">Course Instructor</p>
                        <div className="flex items-center gap-1 justify-start mb-4">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-gray-700">4.9 (1,234 reviews)</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Experienced instructor with expertise in this field. Dedicated to helping students 
                          achieve their learning goals through practical, hands-on instruction.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-8">
                {/* Reviews Section */}
                <section>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">Student Reviews</h2>
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">Be the first to review this course!</p>
                    </div>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-left">Course Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-start">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Level</div>
                    <div className="font-medium text-gray-900">{course.difficulty_level || 'Beginner'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-start">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium text-gray-900">{course.estimated_duration || '20 hours'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-start">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Students Enrolled</div>
                    <div className="font-medium text-gray-900">0</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-start">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Rating</div>
                    <div className="font-medium text-gray-900">4.8/5.0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4 justify-start">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-left">Certificate of Completion</h4>
                  <p className="text-sm text-gray-600 text-left">Earn a certificate upon completion</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 text-left">
                Complete all modules and assessments to receive your official certificate of completion.
              </p>
            </div>

            {/* Instructor Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-left">Instructor</h3>
              <div className="flex items-center gap-4 justify-start">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {course.coach?.first_name?.[0] || 'C'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-left">
                    {course.coach?.first_name} {course.coach?.last_name}
                  </h4>
                  <p className="text-sm text-gray-600 text-left">Course Instructor</p>
                  <div className="flex items-center gap-1 mt-1 justify-start">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.9 (1,234 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview; 