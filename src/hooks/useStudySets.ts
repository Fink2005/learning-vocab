import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import type {
  StudySet,
  CreateStudySetInput,
  UpdateStudySetInput,
} from "@/types";

// Query keys
export const studySetKeys = {
  all: ["study_sets"] as const,
  lists: () => [...studySetKeys.all, "list"] as const,
  list: (filters: { target_language_id?: string }) =>
    [...studySetKeys.lists(), filters] as const,
  details: () => [...studySetKeys.all, "detail"] as const,
  detail: (id: string) => [...studySetKeys.details(), id] as const,
};

// Fetch study sets with optional filters
export function useStudySets(filters?: { target_language_id?: string }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: studySetKeys.list(filters || {}),
    queryFn: async () => {
      let query = supabase
        .from("study_sets" as any)
        .select("*, study_set_items(count)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (filters?.target_language_id) {
        query = query.eq("target_language_id", filters.target_language_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Map count to a more usable format if needed, though usually it comes as an array or object depending on Supabase setup
      // With select("*, study_set_items(count)"), data usually looks like { ..., study_set_items: [{ count: 5 }] }
      // We map it to _count: { items: 5 } to match our type definition
      return (data as unknown as any[]).map(set => ({
        ...set,
        _count: {
            items: set.study_set_items?.[0]?.count || 0
        }
      })) as StudySet[];
    },
    enabled: !!user,
  });
}

// Fetch single study set
export function useStudySet(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: studySetKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_sets" as any)
        .select("*")
        .eq("id", id)
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;
      return data as unknown as StudySet;
    },
    enabled: !!user && !!id,
  });
}

// Create study set
export function useCreateStudySet() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateStudySetInput) => {
      const { data, error } = await supabase
        .from("study_sets" as any)
        .insert({
          ...input,
          user_id: user!.id,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as StudySet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studySetKeys.lists() });
    },
  });
}

// Update study set
export function useUpdateStudySet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateStudySetInput) => {
      const { data, error } = await supabase
        .from("study_sets" as any)
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as StudySet;
    },
    onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: studySetKeys.lists() });
        queryClient.invalidateQueries({ queryKey: studySetKeys.detail(data.id) });
    },
  });
}

// Delete study set
export function useDeleteStudySet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("study_sets" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studySetKeys.lists() });
    },
  });
}
