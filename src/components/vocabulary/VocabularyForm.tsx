import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { useLanguages } from "@/hooks/useLanguages";
import { getLevelsForSystem, levelColors } from "@/lib/levels";
import { getLanguageFlag } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface VocabularyFormProps {
  vocabulary?: Vocabulary;
  mode?: "create" | "edit";
}



export function VocabularyForm({ vocabulary, mode = "create" }: VocabularyFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreateVocabulary();
  const updateMutation = useUpdateVocabulary();
  const { data: languages = [] } = useLanguages();
  const { currentLanguageId } = useLanguage();

  // Default to English or first available language
  const defaultLanguage = languages.find(l => l.code === "en") || languages[0];
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    vocabulary?.target_language_id || currentLanguageId || defaultLanguage?.id || ""
  );

  // Sync with global context change if not editing existing vocabulary
  useEffect(() => {
    if (!vocabulary && currentLanguageId) {
       setSelectedLanguageId(currentLanguageId);
       setFormData(prev => ({ ...prev, target_language_id: currentLanguageId }));
    }
  }, [currentLanguageId, vocabulary]);

  // Set default language when data loads
  useMemo(() => {
    if (!selectedLanguageId && defaultLanguage) {
      setSelectedLanguageId(defaultLanguage.id);
    }
  }, [defaultLanguage, selectedLanguageId]);

  // Get levels based on selected language
  const selectedLanguage = languages.find(l => l.id === selectedLanguageId);
  const levelSystem = selectedLanguage?.level_system || "cefr";
  const levels = getLevelsForSystem(levelSystem);

  const [formData, setFormData] = useState<CreateVocabularyInput>({
    word: vocabulary?.word || "",
    meaning: vocabulary?.meaning || "",
    example: vocabulary?.example || "",
    ipa: vocabulary?.ipa || "",
    level: vocabulary?.level || levels[2] || "B1", // Default to middle level
    notes: vocabulary?.notes || "",
    synonyms: vocabulary?.synonyms?.map((s) => s.synonym) || [],
    target_language_id: vocabulary?.target_language_id || "",
  });

  const [synonymInput, setSynonymInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.word.trim() || !formData.meaning.trim()) {
      toast.error(t("vocabulary.enterWordMeaning"));
      return;
    }

    try {
      if (mode === "edit" && vocabulary) {
        await updateMutation.mutateAsync({
          id: vocabulary.id,
          ...formData,
        });
        toast.success(t("vocabulary.updated"));
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(t("vocabulary.added"));
      }
      navigate({ to: "/vocabulary" });
    } catch {
      toast.error(t("vocabulary.error"));
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
        <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm">
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
            {/* Language Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                {t("profile.language")}
              </Label>
              
              <div className="flex items-center gap-3 p-3 bg-brand-50/50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800 rounded-xl">
                 <span className="text-2xl drop-shadow-sm">
                   {getLanguageFlag(languages.find(l => l.id === currentLanguageId)?.code || "en")}
                 </span>
                 <div className="flex flex-col">
                   <span className="font-semibold text-brand-900 dark:text-brand-100">
                     {languages.find(l => l.id === currentLanguageId)?.name}
                   </span>
                   <span className="text-xs text-brand-600/80 dark:text-brand-400">
                     Đang thêm từ vào ngôn ngữ này
                   </span>
                 </div>
                 <div className="ml-auto">
                   <Check size={18} className="text-brand-600" />
                 </div>
              </div>
            </motion.div>

            <Input
              placeholder="Từ vựng..."
              value={formData.word}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, word: e.target.value }))
              }
              className="text-2xl font-semibold h-14 bg-white dark:bg-gray-800 border-0 shadow-sm focus-visible:ring-brand-500"
              autoFocus
            />
          </motion.div>

          {/* IPA Input - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 }}
          >
            <Input
              placeholder="IPA (e.g., /həˈloʊ/)"
              value={formData.ipa || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ipa: e.target.value }))
              }
              className="text-lg bg-white dark:bg-gray-800 border-0 shadow-sm focus-visible:ring-brand-500 font-mono text-muted-foreground"
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
            <p className="text-sm font-medium text-muted-foreground mb-3">{t("vocabulary.level")}</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {levels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, level: level as VocabularyLevel }))
                  }
                  className={`flex-1 min-w-[60px] py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    formData.level === level
                      ? `${levelColors[level] || "bg-brand-500"} text-white shadow-md scale-105`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {level}
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
                    <Label htmlFor="ipa" className="text-base font-semibold text-brand-900 dark:text-brand-100">
                      IPA (Phiên âm)
                    </Label>
                    <Input
                      id="ipa"
                      placeholder="e.g., /həˈloʊ/"
                      value={formData.ipa || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, ipa: e.target.value }))
                      }
                      className="text-lg font-mono text-muted-foreground h-12 border-brand-200 focus:border-brand-500 focus:ring-brand-500"
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
                <div className="col-span-12 lg:col-span-5 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-brand-900 dark:text-brand-100">
                      {t("profile.language")}
                    </Label>
                    
                    <div className="flex items-center gap-3 p-3 bg-brand-50/50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800 rounded-lg h-12">
                       <span className="text-2xl drop-shadow-sm">
                         {getLanguageFlag(languages.find(l => l.id === currentLanguageId)?.code || "en")}
                       </span>
                       <span className="font-semibold text-brand-900 dark:text-brand-100">
                         {languages.find(l => l.id === currentLanguageId)?.name}
                       </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-brand-900 dark:text-brand-100">{t("vocabulary.level")}</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value: VocabularyLevel) =>
                        setFormData((prev) => ({ ...prev, level: value }))
                      }
                    >
                      <SelectTrigger className="h-12 border-brand-200 focus:border-brand-500 focus:ring-brand-500 bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${levelColors[level] || "bg-brand-500"}`} />
                              <span className="font-medium">{level}</span>
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
