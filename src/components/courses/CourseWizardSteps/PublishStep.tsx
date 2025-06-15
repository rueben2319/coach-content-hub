
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CourseWizardData } from "../CourseCreationWizard";

const PublishStep: React.FC<{ data: CourseWizardData; isSubmitting: boolean; setIsSubmitting: (v: boolean) => void; onSuccess?: () => void }> = ({
  data,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
}) => {
  const { toast } = useToast();

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("courses")
        .insert([{
          ...data,
          subscription_price: data.pricing_model === "subscription" ? data.subscription_price : null,
        }]);
      if (error) throw error;
      toast({ title: "Course published!" });
      onSuccess?.();
    } catch (error: any) {
      toast({ title: "Error publishing", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <p>Ready to publish your course?</p>
      <Button onClick={handlePublish} disabled={isSubmitting}>
        {isSubmitting ? "Publishing..." : "Publish"}
      </Button>
    </div>
  );
};

export default PublishStep;
