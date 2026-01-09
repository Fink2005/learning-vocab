import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import type { VocabularyLevel, CreateVocabularyInput, Vocabulary } from "@/types";
import { useCreateVocabulary, useUpdateVocabulary } from "@/hooks/useVocabulary";
import { toast } from "sonner";

interface VocabularyFormProps {
  vocabulary?: Vocabulary;
  mode?: "create" | "edit";
}

const levels: { value: VocabularyLevel; label: string }[] = [
  { value: "A1", label: "A1 - Beginner" },
  { value: "A2", label: "A2 - Elementary" },
  { value: "B1", label: "B1 - Intermediate" },
  { value: "B2", label: "B2 - Upper Intermediate" },
  { value: "C1", label: "C1 - Advanced" },
  { value: "C2", label: "C2 - Proficient" },
];

export function VocabularyForm({ vocabulary, mode = "create" }: VocabularyFormProps) {
  const navigate = useNavigate();
  const createMutation = useCreateVocabulary();
  const updateMutation = useUpdateVocabulary();

  const [formData, setFormData] = useState<CreateVocabularyInput>({
    word: vocabulary?.word || "",
    meaning: vocabulary?.meaning || "",
    example: vocabulary?.example || "",
    level: vocabulary?.level || "B1",
    notes: vocabulary?.notes || "",
    synonyms: vocabulary?.synonyms?.map((s) => s.synonym) || [],
  });

  const [synonymInput, setSynonymInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.word.trim() || !formData.meaning.trim()) {
      toast.error("Vui lòng nhập từ và nghĩa");
      return;
    }

    try {
      if (mode === "edit" && vocabulary) {
        await updateMutation.mutateAsync({
          id: vocabulary.id,
          ...formData,
        });
        toast.success("Đã cập nhật từ vựng!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Đã thêm từ vựng mới!");
      }
      navigate({ to: "/vocabulary" });
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const addSynonym = () => {
    if (synonymInput.trim() && !formData.synonyms?.includes(synonymInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        synonyms: [...(prev.synonyms || []), synonymInput.trim()],
      }));
      setSynonymInput("");
    }
  };

  const removeSynonym = (synonym: string) => {
    setFormData((prev) => ({
      ...prev,
      synonyms: prev.synonyms?.filter((s) => s !== synonym),
    }));
  };

  const handleSynonymKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSynonym();
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === "edit" ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Word */}
          <div className="space-y-2">
            <Label htmlFor="word" className="text-base font-medium">
              Từ vựng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="word"
              placeholder="Nhập từ tiếng Anh..."
              value={formData.word}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, word: e.target.value }))
              }
              className="text-lg"
            />
          </div>

          {/* Meaning */}
          <div className="space-y-2">
            <Label htmlFor="meaning" className="text-base font-medium">
              Nghĩa <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="meaning"
              placeholder="Nhập nghĩa của từ..."
              value={formData.meaning}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, meaning: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Example */}
          <div className="space-y-2">
            <Label htmlFor="example" className="text-base font-medium">
              Ví dụ
            </Label>
            <Textarea
              id="example"
              placeholder="Nhập câu ví dụ..."
              value={formData.example}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, example: e.target.value }))
              }
              rows={2}
            />
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Trình độ</Label>
            <Select
              value={formData.level}
              onValueChange={(value: VocabularyLevel) =>
                setFormData((prev) => ({ ...prev, level: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trình độ" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Synonyms */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Từ đồng nghĩa</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập từ đồng nghĩa..."
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                onKeyDown={handleSynonymKeyDown}
              />
              <Button type="button" variant="outline" onClick={addSynonym}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.synonyms && formData.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.synonyms.map((synonym) => (
                  <Badge
                    key={synonym}
                    variant="secondary"
                    className="px-3 py-1 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                  >
                    {synonym}
                    <button
                      type="button"
                      onClick={() => removeSynonym(synonym)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Ghi chú
            </Label>
            <Textarea
              id="notes"
              placeholder="Ghi chú thêm..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Cập nhật" : "Thêm từ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/vocabulary" })}
              disabled={isLoading}
            >
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
