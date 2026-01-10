import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useCreateStudySet } from "@/hooks/useStudySets";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/study/new")({
  component: NewStudySetPage,
});

type FormData = {
  title: string;
  description: string;
};

function NewStudySetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguageId } = useLanguage();
  const createStudySet = useCreateStudySet();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!currentLanguageId) {
        toast.error("Please select a language first");
        return;
    }

    try {
      const newSet = await createStudySet.mutateAsync({
        title: data.title,
        description: data.description,
        target_language_id: currentLanguageId,
      });
      
      toast.success("Study set created");
      // Redirect to edit page to add items
      navigate({ to: `/study/${newSet.id}/edit` });
    } catch (error) {
      toast.error("Failed to create study set");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/study" })}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">{t("study.createSet")}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Food & Drinks"
              {...register("title", { required: "Title is required" })}
              className="bg-white dark:bg-gray-800"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What is this set about?"
              {...register("description")}
              className="bg-white dark:bg-gray-800 resize-none h-24"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("common.loading") : t("study.createSet")}
          </Button>
        </form>
      </div>
    </div>
  );
}
