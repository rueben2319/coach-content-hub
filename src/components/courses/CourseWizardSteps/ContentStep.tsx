
import React from "react";
import { CourseWizardData } from "../CourseCreationWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

const ContentStep: React.FC<{ data: CourseWizardData, setData: React.Dispatch<React.SetStateAction<CourseWizardData>> }> = ({ data, setData }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Content
        </CardTitle>
        <CardDescription>
          You can add detailed content after publishing your course. For now, provide a brief outline of what your course will include.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Content Management</h3>
          <p className="text-gray-500 mb-4">
            After publishing your course, you'll be able to add lessons, videos, documents, and other materials through the content manager.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button disabled variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson (Available after publish)
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">What you can do after publishing:</h4>
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

export default ContentStep;
