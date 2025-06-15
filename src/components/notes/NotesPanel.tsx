
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title?: string;
  note_text: string;
  timestamp_seconds?: number;
  created_at: string;
  updated_at: string;
}

interface NotesPanelProps {
  courseId: string;
  contentId: string;
  contentType: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  courseId,
  contentId,
  contentType
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', text: '', timestamp: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, [contentId]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('course_notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: 'Error loading notes',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const createNote = async () => {
    if (!user || !newNote.text.trim()) return;

    try {
      const noteData = {
        user_id: user.id,
        course_id: courseId,
        content_id: contentId,
        note_title: newNote.title.trim() || null,
        note_text: newNote.text.trim(),
        timestamp_seconds: newNote.timestamp ? parseInt(newNote.timestamp) : null,
      };

      const { error } = await supabase
        .from('course_notes')
        .insert([noteData]);

      if (error) throw error;

      setNewNote({ title: '', text: '', timestamp: '' });
      setIsCreating(false);
      loadNotes();
      
      toast({
        title: 'Note created',
        description: 'Your note has been saved successfully',
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error creating note',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const { error } = await supabase
        .from('course_notes')
        .update({
          note_title: updates.title,
          note_text: updates.note_text,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId);

      if (error) throw error;

      loadNotes();
      setEditingNote(null);
      
      toast({
        title: 'Note updated',
        description: 'Your changes have been saved',
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: 'Error updating note',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('course_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      loadNotes();
      
      toast({
        title: 'Note deleted',
        description: 'Your note has been removed',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error deleting note',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const formatTimestamp = (seconds?: number) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredNotes = notes.filter(note =>
    note.note_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const supportsTimestamps = contentType === 'video' || contentType === 'audio';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notes</CardTitle>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create Note Form */}
        {isCreating && (
          <Card className="border-blue-200">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Note title (optional)"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              
              {supportsTimestamps && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Timestamp (seconds)"
                    type="number"
                    value={newNote.timestamp}
                    onChange={(e) => setNewNote({ ...newNote, timestamp: e.target.value })}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">Optional</span>
                </div>
              )}
              
              <Textarea
                placeholder="Write your note here..."
                value={newNote.text}
                onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                rows={3}
              />
              
              <div className="flex space-x-2">
                <Button size="sm" onClick={createNote} disabled={!newNote.text.trim()}>
                  Save Note
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewNote({ title: '', text: '', timestamp: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notes yet. Create your first note!</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id} className="border-gray-200">
                <CardContent className="p-4">
                  {editingNote === note.id ? (
                    <EditNoteForm
                      note={note}
                      onSave={(updates) => updateNote(note.id, updates)}
                      onCancel={() => setEditingNote(null)}
                      supportsTimestamps={supportsTimestamps}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {note.title && (
                            <h4 className="font-medium text-gray-900 mb-1">
                              {note.title}
                            </h4>
                          )}
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {note.note_text}
                          </p>
                        </div>
                        
                        <div className="flex space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingNote(note.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(note.created_at).toLocaleDateString()}</span>
                        {note.timestamp_seconds && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(note.timestamp_seconds)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface EditNoteFormProps {
  note: Note;
  onSave: (updates: Partial<Note>) => void;
  onCancel: () => void;
  supportsTimestamps: boolean;
}

const EditNoteForm: React.FC<EditNoteFormProps> = ({
  note,
  onSave,
  onCancel,
  supportsTimestamps
}) => {
  const [title, setTitle] = useState(note.title || '');
  const [text, setText] = useState(note.note_text);
  const [timestamp, setTimestamp] = useState(note.timestamp_seconds?.toString() || '');

  const handleSave = () => {
    onSave({
      title: title.trim() || undefined,
      note_text: text.trim(),
      timestamp_seconds: timestamp ? parseInt(timestamp) : undefined,
    });
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Note title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      {supportsTimestamps && (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Timestamp (seconds)"
            type="number"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-32"
          />
        </div>
      )}
      
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      
      <div className="flex space-x-2">
        <Button size="sm" onClick={handleSave} disabled={!text.trim()}>
          Save Changes
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NotesPanel;
