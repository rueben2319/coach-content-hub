
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Calendar, TrendingUp, BookOpen, Plus, Edit2 } from 'lucide-react';
import { useLearningPaths, useCreateLearningPath, useUpdateLearningPath } from '@/hooks/useLearningPaths';
import { useAuth } from '@/contexts/AuthContext';

interface LearningPathManagerProps {
  userId?: string;
}

const LearningPathManager: React.FC<LearningPathManagerProps> = ({ userId }) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const { data: learningPaths, isLoading } = useLearningPaths(targetUserId);
  const createMutation = useCreateLearningPath();
  const updateMutation = useUpdateLearningPath();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    course_id: '',
    learning_pace: 'normal' as 'slow' | 'normal' | 'fast',
    estimated_completion_date: '',
    goals: [] as string[],
    notes: ''
  });

  const handleCreatePath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) return;

    try {
      await createMutation.mutateAsync({
        user_id: targetUserId,
        course_id: formData.course_id,
        learning_pace: formData.learning_pace,
        estimated_completion_date: formData.estimated_completion_date || undefined,
        goals: formData.goals,
        notes: formData.notes || undefined
      });

      setShowCreateForm(false);
      setFormData({
        course_id: '',
        learning_pace: 'normal',
        estimated_completion_date: '',
        goals: [],
        notes: ''
      });
    } catch (error) {
      console.error('Failed to create learning path:', error);
    }
  };

  const handleUpdatePath = async (pathId: string) => {
    try {
      await updateMutation.mutateAsync({
        id: pathId,
        learning_pace: formData.learning_pace,
        estimated_completion_date: formData.estimated_completion_date || undefined,
        goals: formData.goals,
        notes: formData.notes || undefined
      });

      setEditingPath(null);
    } catch (error) {
      console.error('Failed to update learning path:', error);
    }
  };

  const handleMarkComplete = async (pathId: string) => {
    try {
      await updateMutation.mutateAsync({
        id: pathId,
        actual_completion_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to mark path as complete:', error);
    }
  };

  const startEditing = (path: any) => {
    setEditingPath(path.id);
    setFormData({
      course_id: path.course_id,
      learning_pace: path.learning_pace,
      estimated_completion_date: path.estimated_completion_date?.split('T')[0] || '',
      goals: path.goals || [],
      notes: path.notes || ''
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading learning paths...</div>
        </CardContent>
      </Card>
    );
  }

  const activePaths = learningPaths?.filter(path => !path.actual_completion_date) || [];
  const completedPaths = learningPaths?.filter(path => path.actual_completion_date) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Paths
            </CardTitle>
            <CardDescription>Manage your course learning journeys</CardDescription>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Path
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePath} className="space-y-4">
                  <div>
                    <Label htmlFor="course_id">Course ID</Label>
                    <Input
                      id="course_id"
                      value={formData.course_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, course_id: e.target.value }))}
                      placeholder="Enter course ID"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="learning_pace">Learning Pace</Label>
                    <Select
                      value={formData.learning_pace}
                      onValueChange={(value: 'slow' | 'normal' | 'fast') => 
                        setFormData(prev => ({ ...prev, learning_pace: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimated_completion">Estimated Completion Date</Label>
                    <Input
                      id="estimated_completion"
                      type="date"
                      value={formData.estimated_completion_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_completion_date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add notes about your learning goals..."
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      Create Path
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Active Paths */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Active Paths ({activePaths.length})
            </h3>
            <div className="space-y-3">
              {activePaths.map((path) => (
                <Card key={path.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    {editingPath === path.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdatePath(path.id); }} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Learning Pace</Label>
                            <Select
                              value={formData.learning_pace}
                              onValueChange={(value: 'slow' | 'normal' | 'fast') => 
                                setFormData(prev => ({ ...prev, learning_pace: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="slow">Slow</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="fast">Fast</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Target Completion</Label>
                            <Input
                              type="date"
                              value={formData.estimated_completion_date}
                              onChange={(e) => setFormData(prev => ({ ...prev, estimated_completion_date: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditingPath(null)}>
                            Cancel
                          </Button>
                          <Button type="submit">Save</Button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Course {path.course_id}</span>
                            <Badge variant="outline" className="capitalize">
                              {path.learning_pace}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => startEditing(path)}
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleMarkComplete(path.id)}
                            >
                              Complete
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Started: {new Date(path.started_at).toLocaleDateString()}
                          </div>
                          {path.estimated_completion_date && (
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              Target: {new Date(path.estimated_completion_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        {path.notes && (
                          <p className="text-sm mt-2 p-2 bg-gray-50 rounded">{path.notes}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Completed Paths */}
          {completedPaths.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Completed Paths ({completedPaths.length})
              </h3>
              <div className="space-y-3">
                {completedPaths.map((path) => (
                  <Card key={path.id} className="border-l-4 border-l-green-500 opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Course {path.course_id}</span>
                          <Badge variant="default">Completed</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>Started: {new Date(path.started_at).toLocaleDateString()}</div>
                        <div>Completed: {new Date(path.actual_completion_date!).toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPathManager;
