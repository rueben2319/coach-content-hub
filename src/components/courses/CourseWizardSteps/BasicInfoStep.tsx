
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseWizardData } from "../CourseCreationWizard";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const BasicInfoStep: React.FC<{ data: CourseWizardData, setData: React.Dispatch<React.SetStateAction<CourseWizardData>> }> = ({ data, setData }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(categoriesData || []);
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <Label>Course Title</Label>
        <Input value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} required />
      </div>
      <div>
        <Label>Short Description</Label>
        <Input value={data.short_description} onChange={e => setData(d => ({ ...d, short_description: e.target.value }))} required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} minLength={10} rows={3} />
      </div>
      <div>
        <Label>Category</Label>
        <Select value={data.category_id} onValueChange={value => setData(d => ({ ...d, category_id: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Difficulty Level</Label>
        <Select value={data.difficulty_level} onValueChange={value => setData(d => ({ ...d, difficulty_level: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="all_levels">All Levels</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Banner Image URL</Label>
        <Input value={data.image || ''} onChange={e => setData(d => ({ ...d, image: e.target.value }))} placeholder="Paste image URL or upload below" />
      </div>
      <div>
        <Label>Delivery Type</Label>
        <Select value={data.delivery_type} onValueChange={value => setData(d => ({ ...d, delivery_type: value as 'self_paced' | 'instructor_led' }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select delivery type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self_paced">Self-Paced</SelectItem>
            <SelectItem value="instructor_led">Instructor-Led</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {data.delivery_type === 'instructor_led' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input type="datetime-local" value={data.start_date || ''} onChange={e => setData(d => ({ ...d, start_date: e.target.value }))} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="datetime-local" value={data.end_date || ''} onChange={e => setData(d => ({ ...d, end_date: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Participants</Label>
              <Input type="number" value={data.max_participants || ''} onChange={e => setData(d => ({ ...d, max_participants: parseInt(e.target.value) || undefined }))} min={1} />
            </div>
            <div>
              <Label>Enrollment Deadline</Label>
              <Input type="datetime-local" value={data.enrollment_deadline || ''} onChange={e => setData(d => ({ ...d, enrollment_deadline: e.target.value }))} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BasicInfoStep;
