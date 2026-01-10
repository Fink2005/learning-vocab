import { createFileRoute, Navigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  useVocabulary,
  useDeleteVocabulary,
  useAddSynonym,
  useDeleteSynonym,
} from "@/hooks/useVocabulary";
import { LevelBadge } from "@/components/vocabulary/LevelBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Trash2,
  Plus,
  X,
  Quote,
  StickyNote,
  Calendar,
  Volume2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSpeech } from "@/hooks/useSpeech";

export const Route = createFileRoute("/vocabulary/$id")({
  component: VocabularyDetailPage,
});

function VocabularyDetailPage() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: vocabulary, isLoading, error } = useVocabulary(id);
  const deleteMutation = useDeleteVocabulary();
  const addSynonymMutation = useAddSynonym();
  const deleteSynonymMutation = useDeleteSynonym();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newSynonym, setNewSynonym] = useState("");
  const { speak, isSpeaking, isSupported } = useSpeech('en-US');

  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t("vocabulary.deleted"));
      navigate({ to: "/vocabulary" });
    } catch {
      toast.error(t("vocabulary.deleteError"));
    }
  };

  const handleAddSynonym = async () => {
    if (!newSynonym.trim()) return;

    try {
      await addSynonymMutation.mutateAsync({
        vocabulary_id: id,
        synonym: newSynonym.trim(),
      });
      setNewSynonym("");
      toast.success(t("vocabulary.synonymAdded"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleDeleteSynonym = async (synonymId: string) => {
    try {
      await deleteSynonymMutation.mutateAsync({
        id: synonymId,
        vocabularyId: id,
      });
      toast.success(t("vocabulary.synonymDeleted"));
    } catch {
      toast.error(t("vocabulary.deleteError"));
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error || !vocabulary) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy từ vựng</h2>
          <Link to="/vocabulary">
            <Button variant="outline">Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Link
          to="/vocabulary"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>

        {/* Main Card */}
        <Card className="border-t-4 border-t-violet-500">
          <CardHeader className="pb-4">
            {/* Title row - responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                    {vocabulary.word}
                  </CardTitle>
                  {isSupported && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 shrink-0 rounded-full transition-colors ${isSpeaking ? 'text-brand-600 bg-brand-100' : 'text-muted-foreground hover:text-brand-600 hover:bg-brand-50'}`}
                      onClick={() => speak(vocabulary.word)}
                      disabled={isSpeaking}
                    >
                      <Volume2 className={`h-5 w-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                    </Button>
                  )}
                </div>
                <LevelBadge level={vocabulary.level} />
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" asChild>
                  <Link to="/vocabulary/edit/$id" params={{ id: vocabulary.id }}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meaning */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Nghĩa
              </h3>
              <p className="text-lg">{vocabulary.meaning}</p>
            </div>

            {/* Example */}
            {vocabulary.example && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Quote className="h-4 w-4" />
                  Ví dụ
                </h3>
                <p className="text-lg italic text-muted-foreground bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-l-violet-500">
                  "{vocabulary.example}"
                </p>
              </div>
            )}

            {/* Synonyms */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Từ đồng nghĩa
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {vocabulary.synonyms && vocabulary.synonyms.length > 0 ? (
                  vocabulary.synonyms.map((syn) => (
                    <Badge
                      key={syn.id}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 group"
                    >
                      {syn.synonym}
                      <button
                        onClick={() => handleDeleteSynonym(syn.id)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                        disabled={deleteSynonymMutation.isPending}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Chưa có từ đồng nghĩa
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Thêm từ đồng nghĩa..."
                  value={newSynonym}
                  onChange={(e) => setNewSynonym(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSynonym()}
                  className="max-w-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddSynonym}
                  disabled={addSynonymMutation.isPending || !newSynonym.trim()}
                >
                  {addSynonymMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Notes */}
            {vocabulary.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  Ghi chú
                </h3>
                <p className="text-muted-foreground">{vocabulary.notes}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Thêm ngày{" "}
                  {new Date(vocabulary.created_at).toLocaleDateString("vi-VN")}
                </span>
                {vocabulary.updated_at !== vocabulary.created_at && (
                  <span>
                    • Cập nhật{" "}
                    {new Date(vocabulary.updated_at).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="p-0 gap-0 sm:max-w-md rounded-2xl overflow-hidden">
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl mb-2">Xóa từ vựng?</DialogTitle>
            <DialogDescription className="text-center text-base">
              Bạn có chắc chắn muốn xóa "{vocabulary.word}"? <br />
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </div>
          <div className="grid grid-cols-2 border-t border-gray-100 dark:border-gray-800 divide-x divide-gray-100 dark:divide-gray-800">
            <button
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300"
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </button>
            <button
              className="p-4 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-bold transition-colors disabled:opacity-50"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Xóa ngay"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
