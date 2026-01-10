import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import type { StudySetItem } from "@/types";
import { studySetKeys } from "./useStudySets";

// Query keys
export const studySetItemKeys = {
  all: ["study_set_items"] as const,
  bySet: (studySetId: string) => [...studySetItemKeys.all, "bySet", studySetId] as const,
};

// Fetch items in a study set
export function useStudySetItems(studySetId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: studySetItemKeys.bySet(studySetId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_set_items" as any)
        .select("*, vocabulary:vocabularies(*)")
        .eq("study_set_id", studySetId);

      if (error) throw error;
      return data as unknown as StudySetItem[];
    },
    enabled: !!user && !!studySetId,
  });
}

// Add vocabulary to study set
export function useAddVocabularyToSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studySetId, vocabularyId }: { studySetId: string; vocabularyId: string }) => {
      const { data, error } = await supabase
        .from("study_set_items" as any)
        .insert({
          study_set_id: studySetId,
          vocabulary_id: vocabularyId,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as StudySetItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: studySetItemKeys.bySet(data.study_set_id) });
      queryClient.invalidateQueries({ queryKey: studySetKeys.lists() }); // Update item counts
    },
  });
}

// Remove vocabulary from study set
export function useRemoveVocabularyFromSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studySetId, vocabularyId }: { studySetId: string; vocabularyId: string }) => {
      const { error } = await supabase
        .from("study_set_items" as any)
        .delete()
        .match({ study_set_id: studySetId, vocabulary_id: vocabularyId });

      if (error) throw error;
      return { studySetId, vocabularyId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: studySetItemKeys.bySet(data.studySetId) });
      queryClient.invalidateQueries({ queryKey: studySetKeys.lists() }); // Update item counts
    },
  });
}
