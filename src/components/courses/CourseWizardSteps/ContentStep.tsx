
import React, { useState } from "react";
import { CourseWizardData } from "../CourseCreationWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, BookOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OutlineItem {
  title: string;
  description?: string;
}

const ContentStep: React.FC<{
  data: CourseWizardData;
  setData: React.Dispatch<React.SetStateAction<CourseWizardData>>;
}> = ({ data, setData }) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Defensive: support empty or legacy structure
  const contentOutline: OutlineItem[] = Array.isArray(data.content)
    ? data.content as OutlineItem[]
    : [];

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditIndex(null);
    setError("");
  };

  const handleAdd = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setData((prev) => ({
      ...prev,
      content: [
        ...(Array.isArray(prev.content) ? prev.content : []),
        { title: title.trim(), description: description.trim() || undefined }
      ]
    }));
    resetForm();
  };

  const handleEdit = (index: number) => {
    const item = contentOutline[index];
    setTitle(item.title);
    setDescription(item.description ?? "");
    setEditIndex(index);
    setError("");
  };

  const handleUpdate = () => {
    if (editIndex === null) return;
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const updatedContent = contentOutline.map((item, idx) =>
      idx === editIndex
        ? { title: title.trim(), description: description.trim() || undefined }
        : item
    );
    setData((prev) => ({
      ...prev,
      content: updatedContent
    }));
    resetForm();
  };

  const handleDelete = (index: number) => {
    const updatedContent = [...contentOutline];
    updatedContent.splice(index, 1);
    setData((prev) => ({
      ...prev,
      content: updatedContent
    }));
    resetForm();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Outline
          </CardTitle>
          <CardDescription>
            Create a brief outline of your course modules or lessons. You can add detailed content after publishing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editIndex !== null) {
                handleUpdate();
              } else {
                handleAdd();
              }
            }}
            className="space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Title (e.g., Introduction or Lesson 1: Getting Started)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="mb-1"
                />
                <Textarea
                  placeholder="Short description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  maxLength={200}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="sm:mt-0 mt-2" variant="default">
                  {editIndex === null ? (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4 mr-1" />
                      Update
                    </>
                  )}
                </Button>
                {editIndex !== null && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="sm:mt-0 mt-2"
                    onClick={resetForm}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </form>
          <div>
            {contentOutline.length === 0 ? (
              <div className="text-gray-500 italic text-sm">No outline items added yet.</div>
            ) : (
              <ul className="space-y-3">
                {contentOutline.map((item, idx) => (
                  <li
                    key={idx}
                    className="border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-gray-600">{item.description}</div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(idx)}
                        className="p-1 h-7 w-7"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(idx)}
                        className="p-1 h-7 w-7"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
            <h4 className="font-semibold text-blue-800 mb-2">After publishing, you'll be able to:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Add video lessons and tutorials</li>
              <li>• Upload documents and resources</li>
              <li>• Create interactive content</li>
              <li>• Organize content in modules</li>
              <li>• Set preview content for free access</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStep;
