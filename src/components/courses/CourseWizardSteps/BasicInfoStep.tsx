
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CourseWizardData } from "../CourseCreationWizard";

const BasicInfoStep: React.FC<{ data: CourseWizardData, setData: React.Dispatch<React.SetStateAction<CourseWizardData>> }> = ({ data, setData }) => {
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
        <Input value={data.category} onChange={e => setData(d => ({ ...d, category: e.target.value }))} required />
      </div>
      <div>
        <Label>Difficulty Level</Label>
        <Input value={data.difficulty_level} onChange={e => setData(d => ({ ...d, difficulty_level: e.target.value }))} required />
      </div>
      <div>
        <Label>Estimated Duration (minutes)</Label>
        <Input type="number" value={data.estimated_duration} onChange={e => setData(d => ({ ...d, estimated_duration: parseInt(e.target.value) || 0 }))} min={1} />
      </div>
    </div>
  );
};

export default BasicInfoStep;
