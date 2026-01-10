import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Language, Level, LevelSystemCode } from "@/types";

// Query keys
export const languageKeys = {
  all: ["languages"] as const,
  active: () => [...languageKeys.all, "active"] as const,
};

export const levelKeys = {
  all: ["levels"] as const,
  bySystem: (systemCode: LevelSystemCode) =>
    [...levelKeys.all, systemCode] as const,
};

// Fetch active languages
export function useLanguages() {
  return useQuery({
    queryKey: languageKeys.active(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Language[];
    },
  });
}

// Fetch levels by language code
export function useLevels(languageCode?: string) {
  const { data: languages } = useLanguages();
  const language = languages?.find((l) => l.code === languageCode);
  const systemCode = language?.level_system;

  return useQuery({
    queryKey: levelKeys.bySystem(systemCode || "cefr"),
    queryFn: async () => {
      if (!systemCode) return [];
      
      // Get level_system id first
      const { data: systemData, error: systemError } = await supabase
        .from("level_systems")
        .select("id")
        .eq("code", systemCode)
        .single();

      if (systemError) throw systemError;
      if (!systemData) return [];

      // Get levels for this system
      const systemId = (systemData as { id: string }).id;
      const { data, error } = await supabase
        .from("levels")
        .select("*")
        .eq("system_id", systemId)
        .order("sort_order");

      if (error) throw error;
      return data as Level[];
    },
    enabled: !!systemCode,
  });
}

// Get levels for a specific language (simpler version)
export function useLevelsByLanguageId(languageId?: string) {
  const { data: languages } = useLanguages();
  const language = languages?.find((l) => l.id === languageId);
  
  return useLevels(language?.code);
}
