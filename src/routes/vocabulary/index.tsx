import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useVocabularies, useDeleteVocabulary } from "@/hooks/useVocabulary";
import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  BookOpen,
  Filter,
  X,
  AlertCircle,
} from "lucide-react";
import type { VocabularyLevel } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/vocabulary/")({
  component: VocabularyListPage,
});

const levels: VocabularyLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function VocabularyListPage() {
  const { user, loading: authLoading } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<VocabularyLevel | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: vocabularies, isLoading, error } = useVocabularies({
    level: selectedLevel,
    search: searchQuery || undefined,
  });

  const deleteMutation = useDeleteVocabulary();

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Đã xóa từ vựng!");
      setDeleteId(null);
    } catch {
      toast.error("Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-linear-to-br from-slate-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Danh sách từ vựng
            </h1>
            <p className="text-muted-foreground mt-1">
              {vocabularies?.length || 0} từ vựng
            </p>
          </div>
          <Link to="/vocabulary/new">
            <Button className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 gap-2">
              <Plus className="h-4 w-4" />
              Thêm từ mới
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm từ vựng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setSelectedLevel(selectedLevel === level ? undefined : level)
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedLevel === level
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
                {selectedLevel && (
                  <button
                    onClick={() => setSelectedLevel(undefined)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
            <p className="text-muted-foreground">Không thể tải danh sách từ vựng</p>
          </div>
        ) : vocabularies && vocabularies.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vocabularies.map((vocab) => (
              <VocabularyCard
                key={vocab.id}
                vocabulary={vocab}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Chưa có từ vựng nào</h3>
            <p className="text-muted-foreground mb-4">
              Bắt đầu thêm từ vựng đầu tiên của bạn
            </p>
            <Link to="/vocabulary/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm từ mới
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa từ vựng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
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
