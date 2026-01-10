import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useStudySets } from "@/hooks/useStudySets";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  GraduationCap, 
  MoreVertical, 
  Play, 
  Edit, 
  Trash2, 
  Search,
  BookOpen,
} from "lucide-react";
import { getLanguageFlag } from "@/lib/utils";
import { useLanguages } from "@/hooks/useLanguages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDeleteStudySet } from "@/hooks/useStudySets";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/study/")({
  component: StudyPage,
});

function StudyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguageId } = useLanguage();
  const { data: languages = [] } = useLanguages();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch study sets, filter by current global language if selected
  const { data: studySets, isLoading } = useStudySets({
    target_language_id: currentLanguageId || undefined
  });
  
  const deleteMutation = useDeleteStudySet();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation();
    
    if (confirm(t("study.deleteMessage"))) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Study set deleted");
      } catch (error) {
        toast.error("Failed to delete study set");
      }
    }
  };

  const filteredStudySets = studySets?.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (set.description && set.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-8">
      {/* Mobile Sticky Header */}
      <div className="lg:hidden sticky top-[60px] z-30 bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 shadow-sm">
         <div className="flex items-center justify-between gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm bộ từ vựng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-gray-50 dark:bg-gray-900 border-0"
                />
             </div>
             <Link to="/study/new">
                <Button size="icon" className="bg-brand-700 h-10 w-10 shrink-0">
                    <Plus className="h-5 w-5" />
                </Button>
             </Link>
         </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10">
        {/* Desktop Header */}
        <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-400 mb-2">
              {t("study.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
                Quản lý và học tập các bộ từ vựng của bạn
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Tìm kiếm..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"
                 />
            </div>
            <Link to="/study/new">
              <Button size="lg" className="bg-brand-700 hover:bg-brand-800 text-white shadow-lg shadow-brand-200 dark:shadow-none transition-all hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                {t("study.createSet")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ))}
            </div>
        ) : filteredStudySets && filteredStudySets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {filteredStudySets.map((set, index) => {
                  const language = languages.find(l => l.id === set.target_language_id);
                  const itemCount = set._count?.items || 0;
                  
                  return (
                    <motion.div
                        key={set.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                    >
                        <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 h-full flex flex-col">
                          {/* Decorative Top Border */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-400 to-indigo-500" />
                          
                          <CardContent className="p-0 flex-1 flex flex-col">
                             {/* Top Section */}
                            <div className="p-5 flex items-start justify-between">
                                <Link to={`/study/${set.id}/learn` as any} className="flex-1 min-w-0 group-hover:text-brand-700 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-xl leading-none border border-gray-200 dark:border-gray-600">
                                            {getLanguageFlag(language?.code || "en")}
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {language?.name}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl line-clamp-2 leading-tight mb-2">
                                        {set.title}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                                        {itemCount} từ vựng
                                    </div>
                                </Link>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate({ to: `/study/${set.id}/edit` })}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t("study.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600 focus:text-red-600"
                                      onClick={(e) => handleDelete(set.id, e as any)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {t("common.delete")}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Description - Optional */}
                            {set.description && (
                                <div className="px-5 pb-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
                                    {set.description}
                                </div>
                            )}
                            
                            {!set.description && <div className="flex-1" />}

                            {/* Action Area */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                    <Link 
                                        to={`/study/${set.id}/learn` as any} 
                                        className="w-full bg-white dark:bg-gray-700 hover:bg-brand-600 dark:hover:bg-brand-600 text-brand-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-brand-600 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 px-4 py-2 rounded-md h-10"
                                    >
                                         <Play className="h-4 w-4" />
                                         <span className="font-semibold text-sm">{t("study.learn")}</span>
                                    </Link>
                                </div>
                          </CardContent>
                        </Card>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="h-10 w-10 text-brand-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? "Không tìm thấy kết quả" : t("study.noSets")}
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {searchQuery ? "Thử tìm kiếm với từ khóa khác" : t("study.createFirst")}
            </p>
            <Link to="/study/new">
              <Button size="lg" className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl">
                <Plus className="h-5 w-5 mr-2" />
                {t("study.createSet")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
