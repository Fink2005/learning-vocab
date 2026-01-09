export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      vocabularies: {
        Row: {
          id: string;
          user_id: string;
          word: string;
          meaning: string;
          example: string | null;
          level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word: string;
          meaning: string;
          example?: string | null;
          level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word?: string;
          meaning?: string;
          example?: string | null;
          level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "synonyms_vocabulary_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "synonyms";
            referencedColumns: ["vocabulary_id"];
          }
        ];
      };
      synonyms: {
        Row: {
          id: string;
          vocabulary_id: string;
          synonym: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vocabulary_id: string;
          synonym: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vocabulary_id?: string;
          synonym?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "synonyms_vocabulary_id_fkey";
            columns: ["vocabulary_id"];
            isOneToOne: false;
            referencedRelation: "vocabularies";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      vocabulary_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    };
    CompositeTypes: Record<string, never>;
  };
}
