import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useStudySet } from "@/hooks/useStudySets";
import { useStudySetItems, useAddVocabularyToSet, useRemoveVocabularyFromSet } from "@/hooks/useStudySetItems";
import { useVocabularies } from "@/hooks/useVocabulary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
// import VocabularyCard from "@/components/vocabulary/VocabularyCard";

export const Route = createFileRoute("/study/$id/edit")({
  component: EditStudySetPage,
});

function EditStudySetPage() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { data: studySet, isLoading: isSetLoading } = useStudySet(id);
  const { data: setItems, isLoading: isItemsLoading } = useStudySetItems(id);
  
  const addMutation = useAddVocabularyToSet();
  const removeMutation = useRemoveVocabularyFromSet();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all vocabularies for search
  // In a real app with many items, this should be server-side filtered, but client-side is fine for now
  const { data: allVocabularies } = useVocabularies({
     target_language_id: studySet?.target_language_id
  });

  const handleAdd = async (vocabId: string) => {
    try {
      await addMutation.mutateAsync({ studySetId: id, vocabularyId: vocabId });
      toast.success("Added to set");
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleRemove = async (vocabId: string) => {
    try {
      await removeMutation.mutateAsync({ studySetId: id, vocabularyId: vocabId });
      toast.success("Removed from set");
    } catch (error) {
       toast.error("Failed to remove item");
    }
  };

  // Filter out items already in the set
  const availableVocabularies = allVocabularies?.filter(v => 
    !setItems?.some(item => item.vocabulary_id === v.id) &&
    (v.word.toLowerCase().includes(searchTerm.toLowerCase()) || v.meaning.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isSetLoading || isItemsLoading) {
    return <div className="p-8 text-center">{t("common.loading")}</div>;
  }

  if (!studySet) return <div>Not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/study" })}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold line-clamp-1">{studySet.title}</h1>
              <p className="text-sm text-muted-foreground">{setItems?.length || 0} items</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Items
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add Vocabulary</DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search words..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="flex-1 overflow-y-auto pr-4 -mr-4">
                    <div className="space-y-2 pt-2">
                        {availableVocabularies?.map(vocab => (
                            <div key={vocab.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                <div>
                                    <p className="font-medium">{vocab.word}</p>
                                    <p className="text-sm text-muted-foreground">{vocab.meaning}</p>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => handleAdd(vocab.id)}>
                                    Add
                                </Button>
                            </div>
                        ))}
                        {availableVocabularies?.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No matching words found.</p>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
            {setItems?.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                   {item.vocabulary && (
                       <div className="flex-1">
                           <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100">{item.vocabulary.word}</h3>
                           <p className="text-gray-600 dark:text-gray-300">{item.vocabulary.meaning}</p>
                       </div>
                   )}
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                     onClick={() => handleRemove(item.vocabulary_id)}
                    >
                       <X className="h-5 w-5" />
                   </Button>
                </div>
            ))}
            
            {setItems?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    This set is empty. Click "Add Items" to add vocabulary.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
