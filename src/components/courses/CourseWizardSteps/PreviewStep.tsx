
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CourseWizardData } from "../CourseCreationWizard";

const PreviewStep: React.FC<{ data: CourseWizardData }> = ({ data }) => (
  <Card>
    <CardContent className="space-y-2 py-4">
      <h2 className="text-xl font-bold">{data.title}</h2>
      <p className="text-gray-500">{data.short_description}</p>
      <p className="text-sm">{data.description}</p>
      <ul className="text-xs text-gray-400">
        <li>Category: {data.category}</li>
        <li>Difficulty: {data.difficulty_level}</li>
        <li>Duration: {data.estimated_duration} mins</li>
        <li>Pricing: {data.pricing_model === "one_time" ? `MWK ${data.price}` : `MWK ${data.price} + Sub: MWK ${data.subscription_price}`}</li>
        <li>Tags: {data.tags.join(', ')}</li>
      </ul>
    </CardContent>
  </Card>
);

export default PreviewStep;
