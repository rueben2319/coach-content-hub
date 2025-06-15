
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CourseWizardData } from "../CourseCreationWizard";

const PublishStep: React.FC<{ data: CourseWizardData; isSubmitting: boolean; setIsSubmitting: (v: boolean) => void; onSuccess?: () => void }> = ({
  data,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { profile } = useAuth();

  const handlePublish = async () => {
    if (!profile?.user_id) {
      toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the course data for database insert
      const courseData = {
        title: data.title,
        description: data.description,
        short_description: data.short_description,
        category: data.category,
        difficulty_level: data.difficulty_level,
        estimated_duration: data.estimated_duration,
        pricing_model: data.pricing_model,
        price: data.price,
        subscription_price: data.pricing_model === "subscription" ? data.subscription_price : null,
        currency: data.currency,
        tags: data.tags,
        thumbnail_url: data.thumbnail_url,
        coach_id: profile.user_id,
        is_published: true,
      };

      const { error } = await supabase
        .from("courses")
        .insert([courseData]);
        
      if (error) throw error;
      
      toast({ title: "Course published successfully!" });
      onSuccess?.();
    } catch (error: any) {
      toast({ title: "Error publishing course", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <p>Ready to publish your course?</p>
      <Button onClick={handlePublish} disabled={isSubmitting}>
        {isSubmitting ? "Publishing..." : "Publish Course"}
      </Button>
    </div>
  );
};

export default PublishStep;
