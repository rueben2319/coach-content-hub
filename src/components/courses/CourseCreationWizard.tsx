
import React, { useState } from 'react';
import BasicInfoStep from './CourseWizardSteps/BasicInfoStep';
import PricingStep from './CourseWizardSteps/PricingStep';
import ContentStep from './CourseWizardSteps/ContentStep';
import PreviewStep from './CourseWizardSteps/PreviewStep';
import PublishStep from './CourseWizardSteps/PublishStep';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type WizardStepKey = 'basic' | 'pricing' | 'content' | 'preview' | 'publish';

const stepList: { key: WizardStepKey, label: string }[] = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'content', label: 'Content' },
  { key: 'preview', label: 'Preview' },
  { key: 'publish', label: 'Publish' },
];

export interface CourseWizardData {
  title: string;
  description: string;
  short_description: string;
  category: string;
  difficulty_level: string;
  estimated_duration: number;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  subscription_price?: number;
  currency: string;
  tags: string[];
  thumbnail_url?: string;
  content: any[];
}

const initialData: CourseWizardData = {
  title: '',
  description: '',
  short_description: '',
  category: '',
  difficulty_level: 'beginner',
  estimated_duration: 60,
  pricing_model: 'one_time',
  price: 0,
  subscription_price: 0,
  currency: 'MWK',
  tags: [],
  content: [],
};

const CourseCreationWizard: React.FC<{ onSuccess?: () => void; onCancel?: () => void }> = ({ onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<WizardStepKey>('basic');
  const [data, setData] = useState<CourseWizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepIndex = stepList.findIndex(s => s.key === currentStep);
  const goToStep = (key: WizardStepKey) => setCurrentStep(key);

  // Step content logic
  let StepContent;
  switch (currentStep) {
    case 'basic':
      StepContent = <BasicInfoStep data={data} setData={setData} />;
      break;
    case 'pricing':
      StepContent = <PricingStep data={data} setData={setData} />;
      break;
    case 'content':
      StepContent = <ContentStep data={data} setData={setData} />;
      break;
    case 'preview':
      StepContent = <PreviewStep data={data} />;
      break;
    case 'publish':
      StepContent = <PublishStep data={data} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} onSuccess={onSuccess} />;
      break;
    default:
      StepContent = null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex flex-col space-y-2">
          <CardTitle>Create New Course</CardTitle>
          <Progress value={((stepIndex + 1) / stepList.length) * 100} className="h-2" />
          <div className="flex space-x-2 mt-2">
            {stepList.map((step, i) => (
              <Button
                key={step.key}
                onClick={() => i <= stepIndex ? goToStep(step.key) : undefined}
                variant={currentStep === step.key ? "default" : "ghost"}
                size="sm"
                className={`text-xs ${i > stepIndex ? "opacity-60 pointer-events-none" : ""}`}
              >
                {i + 1}. {step.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="my-4">{StepContent}</div>
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <div>
            {stepIndex > 0 && (
              <Button variant="ghost" onClick={() => goToStep(stepList[stepIndex - 1].key)}>Back</Button>
            )}
            {stepIndex < stepList.length - 1 && (
              <Button onClick={() => goToStep(stepList[stepIndex + 1].key)} className="ml-2">
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCreationWizard;
