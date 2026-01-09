import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { X, Plus, Loader2, ChevronLeft, Check, BookOpen } from "lucide-react";
import type { VocabularyLevel, CreateVocabularyInput, Vocabulary } from "@/types";
import { useCreateVocabulary, useUpdateVocabulary } from "@/hooks/useVocabulary";
import { toast } from "sonner";

interface VocabularyFormProps {
  vocabulary?: Vocabulary;
  mode?: "create" | "edit";
}

const levels: { value: VocabularyLevel; label: string; color: string }[] = [
  { value: "A1", label: "A1", color: "bg-emerald-500" },
  { value: "A2", label: "A2", color: "bg-green-500" },
  { value: "B1", label: "B1", color: "bg-amber-500" },
  { value: "B2", label: "B2", color: "bg-orange-500" },
  { value: "C1", label: "C1", color: "bg-rose-500" },
  { value: "C2", label: "C2", color: "bg-purple-500" },
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

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden  bg-gray-50 dark:bg-gray-900">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/vocabulary" })}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">
            {mode === "edit" ? "Sửa từ" : "Thêm từ mới"}
          </h1>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !formData.word.trim() || !formData.meaning.trim()}
            className="p-2 -mr-2 text-brand-700 disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Check size={24} />
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-24">
          {/* Word Input - Large */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Input
              placeholder="Từ vựng tiếng Anh..."
              value={formData.word}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, word: e.target.value }))
              }
              className="text-2xl font-semibold h-14 bg-white dark:bg-gray-800 border-0 shadow-sm focus-visible:ring-brand-500"
              autoFocus
            />
          </motion.div>

          {/* Meaning */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Textarea
              placeholder="Nghĩa của từ..."
              value={formData.meaning}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, meaning: e.target.value }))
              }
              className="text-base bg-white dark:bg-gray-800 border-0 shadow-sm min-h-[80px] focus-visible:ring-brand-500"
              rows={3}
            />
          </motion.div>

          {/* Level Selection - Horizontal chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground mb-3">Trình độ</p>
            <div className="flex gap-2">
              {levels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, level: level.value }))
                  }
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    formData.level === level.value
                      ? `${level.color} text-white shadow-md scale-105`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Example */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Textarea
              placeholder="Ví dụ câu..."
              value={formData.example}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, example: e.target.value }))
              }
              className="bg-white dark:bg-gray-800 border-0 shadow-sm min-h-[60px] focus-visible:ring-brand-500"
              rows={2}
            />
          </motion.div>

          {/* Synonyms */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground mb-3">Từ đồng nghĩa</p>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Thêm synonym..."
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSynonym();
                  }
                }}
                className="border-0 bg-gray-100 dark:bg-gray-700 focus-visible:ring-brand-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={addSynonym}
                className="shrink-0 bg-brand-100 text-brand-700 hover:bg-brand-200"
              >
                <Plus size={20} />
              </Button>
            </div>
            {formData.synonyms && formData.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.synonyms.map((synonym) => (
                  <motion.div
                    key={synonym}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="px-3 py-1.5 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                    >
                      {synonym}
                      <button
                        type="button"
                        onClick={() => removeSynonym(synonym)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Textarea
              placeholder="Ghi chú thêm..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="bg-white dark:bg-gray-800 border-0 shadow-sm min-h-[60px] focus-visible:ring-brand-500"
              rows={2}
            />
          </motion.div>
        </form>
      </div>

      {/* Desktop Layout - Compact Grid */}
      <div className="hidden lg:block">
        <Card className="max-w-4xl mx-auto shadow-lg border-0 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
          <CardHeader className="border-b bg-white/50 dark:bg-gray-800/50 pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="bg-brand-100 text-brand-700 p-2 rounded-lg">
                {mode === "edit" ? <BookOpen size={24} /> : <Plus size={24} />}
              </span>
              {mode === "edit" ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Main Info */}
                <div className="col-span-7 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="word" className="text-base font-semibold text-brand-900 dark:text-brand-100">
                      Từ vựng <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="word"
                      placeholder="Nhập từ tiếng Anh..."
                      value={formData.word}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, word: e.target.value }))
                      }
                      className="text-lg font-medium h-12 border-brand-200 focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meaning" className="text-base font-semibold text-brand-900 dark:text-brand-100">
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
                      className="resize-none border-brand-200 focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-brand-900 dark:text-brand-100">Từ đồng nghĩa</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập từ đồng nghĩa..."
                        value={synonymInput}
                        onChange={(e) => setSynonymInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSynonym();
                          }
                        }}
                        className="border-brand-200 focus:border-brand-500 focus:ring-brand-500"
                      />
                      <Button
                        type="button"
                        onClick={addSynonym}
                        className="bg-brand-100 text-brand-700 hover:bg-brand-200"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.synonyms && formData.synonyms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 p-3 bg-brand-50/50 rounded-lg border border-brand-100 dark:border-brand-800 dark:bg-brand-900/10 min-h-[60px]">
                        {formData.synonyms.map((synonym) => (
                          <Badge
                            key={synonym}
                            variant="secondary"
                            className="px-2 py-1 bg-white text-brand-700 shadow-sm border border-brand-100 dark:bg-gray-800 dark:text-brand-300 dark:border-gray-700"
                          >
                            {synonym}
                            <button
                              type="button"
                              onClick={() => removeSynonym(synonym)}
                              className="ml-1 hover:text-red-500 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="col-span-5 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-brand-900 dark:text-brand-100">Trình độ</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value: VocabularyLevel) =>
                        setFormData((prev) => ({ ...prev, level: value }))
                      }
                    >
                      <SelectTrigger className="h-12 border-brand-200 focus:border-brand-500 focus:ring-brand-500">
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${level.color}`} />
                              <span className="font-medium">{level.label}</span>
                              <span className="text-muted-foreground text-xs">
                                - {level.value === "A1" ? "Cơ bản" : level.value === "C2" ? "Thành thạo" : "Trung cấp"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="example" className="text-base font-semibold text-brand-900 dark:text-brand-100">
                      Ví dụ
                    </Label>
                    <Textarea
                      id="example"
                      placeholder="Nhập câu ví dụ..."
                      value={formData.example}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, example: e.target.value }))
                      }
                      rows={3}
                      className="resize-none border-brand-200 focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base font-semibold text-brand-900 dark:text-brand-100">
                      Ghi chú
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Ghi chú thêm..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      rows={3}
                      className="resize-none border-brand-200 focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/vocabulary" })}
                  disabled={isLoading}
                  className="w-32 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="w-48 bg-brand-700 hover:bg-brand-900 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === "edit" ? "Lưu thay đổi" : "Thêm từ vựng"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
