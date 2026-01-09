import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useVocabularies } from "@/hooks/useVocabulary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Plus,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { VocabularyLevel } from "@/types";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const { data: vocabularies } = useVocabularies();

  // Calculate stats
  const levelCounts = vocabularies?.reduce(
    (acc, vocab) => {
      acc[vocab.level] = (acc[vocab.level] || 0) + 1;
      return acc;
    },
    {} as Record<VocabularyLevel, number>
  );

  const totalWords = vocabularies?.length || 0;
  const totalSynonyms =
    vocabularies?.reduce(
      (acc, vocab) => acc + (vocab.synonyms?.length || 0),
      0
    ) || 0;

  const recentWords = vocabularies?.slice(0, 5) || [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#BDE8F5]/10 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1C4D8D] dark:text-[#BDE8F5]">
            {user ? `Xin chào, ${user.full_name || "bạn"}!` : "Chào mừng đến VocabMaster!"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user
              ? "Hãy tiếp tục học từ vựng mỗi ngày nhé 📚"
              : "Đăng nhập để bắt đầu hành trình học từ vựng"}
          </p>
        </div>

        {!user && !loading ? (
          // Guest View
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-3 bg-[#1C4D8D] text-white border-0">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Bắt đầu học từ vựng ngay hôm nay!
                    </h2>
                    <p className="text-white/80 mb-4">
                      Ghi chú từ vựng, synonym theo level A1-C2. Đồng bộ trên mọi thiết bị.
                    </p>
                    <Link to="/login">
                      <Button
                        size="lg"
                        className="bg-white text-[#1C4D8D] hover:bg-white/90"
                      >
                        Đăng nhập với Google
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <Sparkles className="h-24 w-24 text-white/40" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#BDE8F5] dark:bg-[#1C4D8D]/30 rounded-xl flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-[#1C4D8D]" />
                </div>
                <CardTitle>Ghi chú từ vựng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Thêm từ vựng mới với nghĩa, ví dụ và ghi chú cá nhân
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#4988C4]/30 dark:bg-[#4988C4]/20 rounded-xl flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-[#1C4D8D]" />
                </div>
                <CardTitle>Quản lý Synonym</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ghi nhớ các từ đồng nghĩa để mở rộng vốn từ vựng
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0F2854]/10 dark:bg-[#0F2854]/20 rounded-xl flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-[#0F2854]" />
                </div>
                <CardTitle>Phân loại Level</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sắp xếp từ vựng theo trình độ IELTS từ A1 đến C2
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Authenticated View
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            <Card className="bg-[#0F2854] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Tổng từ vựng</p>
                    <p className="text-3xl font-bold">{totalWords}</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-white/40" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1C4D8D] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Từ đồng nghĩa</p>
                    <p className="text-3xl font-bold">{totalSynonyms}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-white/40" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#4988C4] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Level cao nhất</p>
                    <p className="text-3xl font-bold">
                      {vocabularies?.length
                        ? Math.max(
                            ...Object.entries(levelCounts || {})
                              .filter(([_, count]) => count > 0)
                              .map(([level]) =>
                                ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(level)
                              )
                          ) >= 0
                          ? ["A1", "A2", "B1", "B2", "C1", "C2"][
                              Math.max(
                                ...Object.entries(levelCounts || {})
                                  .filter(([_, count]) => count > 0)
                                  .map(([level]) =>
                                    ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(level)
                                  )
                              )
                            ]
                          : "--"
                        : "--"}
                    </p>
                  </div>
                  <Target className="h-10 w-10 text-white/40" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#4988C4]/80 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Hôm nay</p>
                    <p className="text-3xl font-bold">
                      {vocabularies?.filter((v) => {
                        const today = new Date();
                        const created = new Date(v.created_at);
                        return created.toDateString() === today.toDateString();
                      }).length || 0}
                    </p>
                  </div>
                  <Clock className="h-10 w-10 text-white/40" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[#1C4D8D]" />
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/vocabulary/new" className="block">
                  <Button className="w-full justify-start gap-2 bg-[#1C4D8D] hover:bg-[#0F2854]">
                    <Plus className="h-4 w-4" />
                    Thêm từ vựng mới
                  </Button>
                </Link>
                <Link to="/vocabulary" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <BookOpen className="h-4 w-4" />
                    Xem danh sách từ vựng
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Words */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#1C4D8D]" />
                  Từ vựng gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentWords.length > 0 ? (
                  <div className="space-y-3">
                    {recentWords.map((word) => (
                      <Link
                        key={word.id}
                        to="/vocabulary/$id"
                        params={{ id: word.id }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{word.word}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {word.meaning}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            word.level === "A1" || word.level === "A2"
                              ? "bg-emerald-100 text-emerald-700"
                              : word.level === "B1" || word.level === "B2"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {word.level}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Chưa có từ vựng nào</p>
                    <Link to="/vocabulary/new">
                      <Button variant="link" className="mt-2">
                        Thêm từ đầu tiên
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Level Distribution */}
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-violet-600" />
                  Phân bố theo trình độ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {(["A1", "A2", "B1", "B2", "C1", "C2"] as VocabularyLevel[]).map(
                    (level) => {
                      const count = levelCounts?.[level] || 0;
                      const percentage = totalWords
                        ? Math.round((count / totalWords) * 100)
                        : 0;
                      const colors = {
                        A1: "bg-emerald-500",
                        A2: "bg-green-500",
                        B1: "bg-amber-500",
                        B2: "bg-orange-500",
                        C1: "bg-rose-500",
                        C2: "bg-purple-500",
                      };
                      return (
                        <div key={level} className="text-center">
                          <div
                            className={`h-24 rounded-lg ${colors[level]} flex items-end justify-center pb-2 mb-2 relative overflow-hidden`}
                          >
                            <div
                              className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
                              style={{
                                transform: `translateY(${100 - (percentage || 5)}%)`,
                              }}
                            />
                            <span className="relative text-white font-bold text-lg">
                              {count}
                            </span>
                          </div>
                          <p className="font-semibold">{level}</p>
                          <p className="text-xs text-muted-foreground">
                            {percentage}%
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
