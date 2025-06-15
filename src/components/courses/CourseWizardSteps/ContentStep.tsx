
import React from "react";
import { CourseWizardData } from "../CourseCreationWizard";
import CourseContentManager from "../CourseContentManager";

const ContentStep: React.FC<{ data: CourseWizardData, setData: React.Dispatch<React.SetStateAction<CourseWizardData>> }> = () => (
  <div>
    <CourseContentManager />
  </div>
);

export default ContentStep;
