import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import type { Database } from "@/types/database";
import type {
  Vocabulary,
  VocabularyLevel,
  CreateVocabularyInput,
  UpdateVocabularyInput,
  CreateSynonymInput,
  Synonym,
} from "@/types";

type VocabularyRow = Database["public"]["Tables"]["vocabularies"]["Row"];

// Query keys
export const vocabularyKeys = {
  all: ["vocabularies"] as const,
  lists: () => [...vocabularyKeys.all, "list"] as const,
  list: (filters: { level?: VocabularyLevel; search?: string; target_language_id?: string }) =>
    [...vocabularyKeys.lists(), filters] as const,
  details: () => [...vocabularyKeys.all, "detail"] as const,
  detail: (id: string) => [...vocabularyKeys.details(), id] as const,
};

export const synonymKeys = {
  all: ["synonyms"] as const,
  byVocabulary: (vocabularyId: string) =>
    [...synonymKeys.all, vocabularyId] as const,
};

// Fetch vocabularies with optional filters
export function useVocabularies(filters?: {
  level?: VocabularyLevel;
  search?: string;
  target_language_id?: string;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: vocabularyKeys.list(filters || {}),
    queryFn: async () => {
      let query = supabase
        .from("vocabularies")
        .select("*, synonyms(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (filters?.level) {
        // Type assertion needed until Supabase types are regenerated
        query = query.eq("level", filters.level as any);
      }

      if (filters?.search) {
        query = query.or(
          `word.ilike.%${filters.search}%,meaning.ilike.%${filters.search}%`
        );
      }

      if (filters?.target_language_id) {
        query = query.eq("target_language_id", filters.target_language_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Vocabulary[];
    },
    enabled: !!user,
  });
}

// Fetch single vocabulary with synonyms
export function useVocabulary(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: vocabularyKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vocabularies")
        .select("*, synonyms(*)")
        .eq("id", id)
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;
      return data as Vocabulary;
    },
    enabled: !!user && !!id,
  });
}

// Create vocabulary
export function useCreateVocabulary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateVocabularyInput) => {
      const { synonyms, ...vocabularyData } = input;

      // Insert vocabulary (cast to any for Supabase type compatibility)
      const { data: vocabulary, error: vocabError } = await supabase
        .from("vocabularies")
        .insert({
          ...vocabularyData,
          user_id: user!.id,
          level: vocabularyData.level as string,
        } as any)
        .select()
        .single<VocabularyRow>();

      if (vocabError) throw vocabError;

      // Insert synonyms if provided
      if (synonyms && synonyms.length > 0) {
        const synonymsData = synonyms.map((s) => ({
          vocabulary_id: vocabulary.id,
          synonym: s,
        }));

        const { error: synError } = await supabase
          .from("synonyms")
          .insert(synonymsData);

        if (synError) throw synError;
      }

      return vocabulary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
    },
  });
}

// Update vocabulary
export function useUpdateVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateVocabularyInput) => {
      const { synonyms, ...vocabularyData } = input;

      // Cast to any for Supabase type compatibility 
      const { data, error } = await supabase
        .from("vocabularies")
        .update(vocabularyData as any)
        .eq("id", id)
        .select()
        .single<VocabularyRow>();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.detail(data.id),
      });
    },
  });
}

// Delete vocabulary
export function useDeleteVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vocabularies")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
    },
  });
}

// Add synonym
export function useAddSynonym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSynonymInput) => {
      const { data, error } = await supabase
        .from("synonyms")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as Synonym;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.detail(data.vocabulary_id),
      });
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
    },
  });
}

// Delete synonym
export function useDeleteSynonym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      vocabularyId,
    }: {
      id: string;
      vocabularyId: string;
    }) => {
      const { error } = await supabase.from("synonyms").delete().eq("id", id);

      if (error) throw error;
      return { vocabularyId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.detail(data.vocabularyId),
      });
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
    },
  });
}
