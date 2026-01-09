import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useVocabulary } from "@/hooks/useVocabulary";
import { VocabularyForm } from "@/components/vocabulary/VocabularyForm";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/vocabulary/edit/$id")({
  component: EditVocabularyPage,
});

function EditVocabularyPage() {
  const { id } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const { data: vocabulary, isLoading, error } = useVocabulary(id);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (error || !vocabulary) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy từ vựng</h2>
          <p className="text-muted-foreground">Có thể từ này đã bị xóa hoặc bạn không có quyền truy cập.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <VocabularyForm mode="edit" vocabulary={vocabulary} />
      </div>
    </div>
  );
}
