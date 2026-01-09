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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/vocabulary/$id")({
  component: VocabularyDetailPage,
});

function VocabularyDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: vocabulary, isLoading, error } = useVocabulary(id);
  const deleteMutation = useDeleteVocabulary();
  const addSynonymMutation = useAddSynonym();
  const deleteSynonymMutation = useDeleteSynonym();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newSynonym, setNewSynonym] = useState("");

  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Đã xóa từ vựng!");
      navigate({ to: "/vocabulary" });
    } catch {
      toast.error("Có lỗi xảy ra khi xóa");
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
      toast.success("Đã thêm từ đồng nghĩa!");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDeleteSynonym = async (synonymId: string) => {
    try {
      await deleteSynonymMutation.mutateAsync({
        id: synonymId,
        vocabularyId: id,
      });
      toast.success("Đã xóa từ đồng nghĩa!");
    } catch {
      toast.error("Có lỗi xảy ra khi xóa");
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
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {vocabulary.word}
                </CardTitle>
                <LevelBadge level={vocabulary.level} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to="/vocabulary/$id" params={{ id: vocabulary.id }}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa từ "{vocabulary.word}"? Hành động này
              không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
