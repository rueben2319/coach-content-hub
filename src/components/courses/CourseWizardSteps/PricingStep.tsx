
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { CourseWizardData } from "../CourseCreationWizard";

const PricingStep: React.FC<{ data: CourseWizardData, setData: React.Dispatch<React.SetStateAction<CourseWizardData>> }> = ({ data, setData }) => (
  <div className="space-y-4">
    <div>
      <Label>Pricing Model</Label>
      <Select
        value={data.pricing_model}
        onValueChange={(v) => setData(d => ({ ...d, pricing_model: v as any }))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one_time">One-time Payment</SelectItem>
          <SelectItem value="subscription">Subscription</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Price (MWK)</Label>
      <Input
        type="number"
        step="1"
        value={data.price}
        onChange={e => setData(d => ({ ...d, price: parseFloat(e.target.value) || 0 }))}
        min="0"
        required
      />
    </div>
    {data.pricing_model === "subscription" && (
      <div>
        <Label>Monthly Subscription Price (MWK)</Label>
        <Input
          type="number"
          step="1"
          value={data.price}
          onChange={e => setData(d => ({ ...d, price: parseFloat(e.target.value) || 0 }))}
          min="0"
        />
      </div>
    )}
  </div>
);

export default PricingStep;
