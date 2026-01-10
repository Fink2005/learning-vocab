import { createFileRoute, Navigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useVocabularies, useDeleteVocabulary } from "@/hooks/useVocabulary";
import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Search, Loader2, BookOpen, Filter, X, Trash2 } from "lucide-react";
import type { VocabularyLevel } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/vocabulary/")(({
  component: VocabularyListPage,
}));

const levels: VocabularyLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const levelColors: Record<VocabularyLevel, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-green-100 text-green-700 border-green-200",
  B1: "bg-amber-100 text-amber-700 border-amber-200",
  B2: "bg-orange-100 text-orange-700 border-orange-200",
  C1: "bg-rose-100 text-rose-700 border-rose-200",
  C2: "bg-purple-100 text-purple-700 border-purple-200",
};

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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      {/* Mobile: Sticky Search & Filter */}
      <div className="lg:hidden sticky top-[60px] z-30 bg-gray-50 dark:bg-gray-900 px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm từ vựng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-0 shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedLevel(undefined)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
              !selectedLevel
                ? "bg-brand-700 text-white border-brand-700"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            Tất cả
          </button>
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(selectedLevel === level ? undefined : level)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                selectedLevel === level ? levelColors[level] : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Full header & filter bar */}
      <div className="hidden lg:block container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Danh sách từ vựng
            </h1>
            <p className="text-muted-foreground mt-1">{vocabularies?.length || 0} từ vựng</p>
          </div>
          <Link to="/vocabulary/new">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 gap-2">
              <Plus className="h-4 w-4" />
              Thêm từ mới
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm từ vựng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(selectedLevel === level ? undefined : level)}
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
      </div>

      {/* Content */}
      <div className="px-4 lg:container lg:mx-auto lg:px-4 py-4 lg:py-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
            <p className="text-muted-foreground">Không thể tải danh sách từ vựng</p>
          </div>
        ) : vocabularies && vocabularies.length > 0 ? (
          <>
            {/* Mobile: Card list with animations */}
            <div className="lg:hidden space-y-3">
              <AnimatePresence mode="popLayout">
                {vocabularies.map((vocab, index) => {
                  // Gradient backgrounds based on level
                  const levelGradients: Record<VocabularyLevel, string> = {
                    A1: "from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
                    A2: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
                    B1: "from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40",
                    B2: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40",
                    C1: "from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40",
                    C2: "from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40",
                  };

                  const levelBorderColors: Record<VocabularyLevel, string> = {
                    A1: "border-l-emerald-400",
                    A2: "border-l-green-400",
                    B1: "border-l-amber-400",
                    B2: "border-l-orange-400",
                    C1: "border-l-rose-400",
                    C2: "border-l-purple-400",
                  };

                  return (
                    <motion.div
                      key={vocab.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -100, scale: 0.9 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      whileTap={{ scale: 0.98 }}
                      layout
                    >
                      <Link to="/vocabulary/$id" params={{ id: vocab.id }}>
                        <Card
                          className={`
                            bg-gradient-to-r ${levelGradients[vocab.level]}
                            border-0 border-l-4 ${levelBorderColors[vocab.level]}
                            shadow-sm hover:shadow-lg
                            transition-all duration-300
                            overflow-hidden
                            relative
                          `}
                        >
                          {/* Decorative circle */}
                          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/30 dark:bg-white/5 rounded-full blur-2xl" />
                          
                          <CardContent className="p-4 relative">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-bold text-xl text-gray-900 dark:text-white truncate">
                                    {vocab.word}
                                  </h3>
                                  <span
                                    className={`
                                      px-2.5 py-1 rounded-full text-xs font-bold
                                      ${levelColors[vocab.level]}
                                      shadow-sm
                                    `}
                                  >
                                    {vocab.level}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 font-medium">
                                  {vocab.meaning}
                                </p>
                                {vocab.synonyms && vocab.synonyms.length > 0 && (
                                  <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-xs text-brand-500 font-semibold bg-brand-500/10 px-2 py-0.5 rounded-full">
                                      {vocab.synonyms.length} từ đồng nghĩa
                                    </span>
                                  </div>
                                )}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeleteId(vocab.id);
                                }}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all duration-200"
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Desktop: Grid of VocabularyCards */}
            <div className="hidden lg:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vocabularies.map((vocab) => (
                <VocabularyCard
                  key={vocab.id}
                  vocabulary={vocab}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 lg:h-10 lg:w-10 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Chưa có từ vựng nào</h3>
            <p className="text-muted-foreground mb-4">Bắt đầu thêm từ vựng đầu tiên của bạn</p>
            <Link to="/vocabulary/new">
              <Button className="gap-2 bg-brand-700 hover:bg-brand-900">
                <Plus className="h-4 w-4" />
                Thêm từ mới
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa từ vựng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
