import type { Vocabulary } from "@/types";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelBadge } from "./LevelBadge";
import { MoreHorizontal, Pencil, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpeech } from "@/hooks/useSpeech";

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onDelete?: (id: string) => void;
}

export function VocabularyCard({ vocabulary, onDelete }: VocabularyCardProps) {
  const { speak, isSpeaking, isSupported } = useSpeech('en-US');

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    speak(vocabulary.word);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-violet-500">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to="/vocabulary/$id"
                params={{ id: vocabulary.id }}
                className="block flex-1 min-w-0"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate">
                  {vocabulary.word}
                </h3>
              </Link>
              {isSupported && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 shrink-0 rounded-full transition-colors ${isSpeaking ? 'text-brand-600 bg-brand-100' : 'text-muted-foreground hover:text-brand-600 hover:bg-brand-50'}`}
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                >
                  <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                </Button>
              )}
            </div>
            {vocabulary.ipa && (
              <p className="text-xs text-muted-foreground font-mono mb-1 opacity-80">
                /{vocabulary.ipa}/
              </p>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {vocabulary.meaning}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to="/vocabulary/$id"
                  params={{ id: vocabulary.id }}
                  className="flex items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(vocabulary.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {vocabulary.example && (
          <p className="text-sm italic text-muted-foreground mb-3 line-clamp-2">
            "{vocabulary.example}"
          </p>
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <LevelBadge level={vocabulary.level} />
          {vocabulary.synonyms && vocabulary.synonyms.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {vocabulary.synonyms.slice(0, 3).map((syn) => (
                <Badge
                  key={syn.id}
                  variant="secondary"
                  className="text-xs bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                >
                  {syn.synonym}
                </Badge>
              ))}
              {vocabulary.synonyms.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{vocabulary.synonyms.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
