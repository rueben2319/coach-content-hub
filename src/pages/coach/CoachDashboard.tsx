import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Grid, List, MoreVertical, Play, Eye, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'bg-green-500',
  INTERMEDIATE: 'bg-green-600',
  ADVANCED: 'bg-green-700',
};

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80';

const CoachDashboard = () => {
  const { user, profile } = useAuth();
  const [search, setSearch] = useState('');
  const [academy, setAcademy] = useState('All');
  const [view, setView] = useState<'list' | 'grid'>('list');

  // Fetch coach's courses
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['coach-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        // Use only the basic fields that we know exist
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            difficulty_level,
            is_published,
            created_at
          `)
          .eq('coach_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Exception in course fetching:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
  });

  // Filtered courses
  const filtered = courses.filter((course: any) => {
    const matchesSearch = search === '' || course.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-6 py-8 text-left">
        <div className="flex items-center gap-3 mb-6 justify-start">
          <BookOpen className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">My Work</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-6 py-8 text-left">
        <div className="flex items-center gap-3 mb-6 justify-start">
          <BookOpen className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">My Work</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading courses: {error.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 py-8 text-left">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 justify-start">
        <BookOpen className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">My Work</h1>
      </div>

      {/* Coach Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
          {profile?.first_name?.[0] || 'C'}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-900 leading-tight">
            Welcome back, {profile?.first_name}!
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Manage your courses and track your success
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <Input
          type="text"
          placeholder="Search your courses"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
        <div className="flex gap-2 flex-1">
          <select
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={academy}
            onChange={e => setAcademy(e.target.value)}
          >
            <option value="All">Academy</option>
            <option value="All">All</option>
            {/* Add more academies as needed */}
          </select>
        </div>
        {/* View Toggle */}
        <div className="flex gap-1 ml-auto">
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className={view === 'grid' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
            onClick={() => setView('grid')}
          >
            <Grid className="w-5 h-5" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="icon"
            className={view === 'list' ? 'bg-green-500 hover:bg-green-600 text-white border border-green-500' : 'border border-gray-200'}
            onClick={() => setView('list')}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Course List */}
      {filtered.length === 0 && (
        <div className="text-left text-gray-500 py-12">
          <p>No courses found.</p>
        </div>
      )}
      {view === 'list' ? (
        <div className="flex flex-col gap-6">
          {filtered.map((course: any) => {
            const level = (course.difficulty_level || 'BEGINNER').toUpperCase();
            return (
              <div key={course.id} className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden group">
                {/* Image and Level Badge */}
                <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                  <img
                    src={PLACEHOLDER_IMG}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded text-xs font-semibold text-white ${LEVEL_COLORS[level] || 'bg-green-500'}`}>
                    {level}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/80 drop-shadow-lg" />
                  </span>
                  {/* Dropdown Menu - Top Right Corner */}
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => window.open(`/coach/preview/${course.id}`, '_blank')}
                          className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => alert('Edit Course')}
                          className="flex items-center gap-3 cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                        >
                          <Play className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => alert(course.is_published ? 'Unpublish Course' : 'Publish Course')}
                          className="flex items-center gap-3 cursor-pointer hover:bg-yellow-50 hover:text-yellow-700 transition-colors duration-150"
                        >
                          <X className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium">{course.is_published ? 'Unpublish' : 'Publish'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* Course Info */}
                <div className="flex-1 flex flex-col p-6 gap-2 text-left">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 justify-start">
                    <BookOpen className="w-4 h-4 mr-1 text-primary" />
                    Course
                    <span className="mx-1">|</span>
                    <span>{course.is_published ? 'Published' : 'Draft'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-start">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{course.title}</h2>
                  </div>
                  <div className="text-sm text-gray-700 font-medium mb-1">{course.title}</div>
                  <div className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</div>
                  <div className="flex-1" />
                  <div className="flex items-center justify-between mt-2">
                    <div />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course: any) => {
            const level = (course.difficulty_level || 'BEGINNER').toUpperCase();
            return (
              <div key={course.id} className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden group">
                <div className="relative w-full h-48 flex-shrink-0">
                  <img
                    src={PLACEHOLDER_IMG}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded text-xs font-semibold text-white ${LEVEL_COLORS[level] || 'bg-green-500'}`}>
                    {level}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/80 drop-shadow-lg" />
                  </span>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => window.open(`/coach/preview/${course.id}`, '_blank')}
                          className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => alert('Edit Course')}
                          className="flex items-center gap-3 cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                        >
                          <Play className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => alert(course.is_published ? 'Unpublish Course' : 'Publish Course')}
                          className="flex items-center gap-3 cursor-pointer hover:bg-yellow-50 hover:text-yellow-700 transition-colors duration-150"
                        >
                          <X className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium">{course.is_published ? 'Unpublish' : 'Publish'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-4 gap-2 text-left">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 justify-start">
                    <BookOpen className="w-4 h-4 mr-1 text-primary" />
                    Course
                    <span className="mx-1">|</span>
                    <span>{course.is_published ? 'Published' : 'Draft'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-start">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{course.title}</h2>
                  </div>
                  <div className="text-sm text-gray-700 font-medium mb-1">{course.title}</div>
                  <div className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
