import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();

  // Redirect if already logged in
  if (!loading && user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#BDE8F5]/20 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1C4D8D] rounded-2xl shadow-lg mb-4">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1C4D8D] dark:text-[#BDE8F5]">
            VocabMaster
          </h1>
          <p className="text-muted-foreground mt-2">
            Học từ vựng tiếng Anh thông minh
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-xl">Chào mừng bạn!</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Đăng nhập để bắt đầu học từ vựng
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#1C4D8D]" />
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                  onClick={signInWithGoogle}
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Đăng nhập với Google</span>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                      Tính năng
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#BDE8F5]/30 dark:bg-[#1C4D8D]/20">
                    <div className="w-8 h-8 rounded-full bg-[#BDE8F5] dark:bg-[#1C4D8D] flex items-center justify-center">
                      <span className="text-sm">📚</span>
                    </div>
                    <span className="text-sm font-medium">CRUD từ vựng</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#4988C4]/20 dark:bg-[#4988C4]/20">
                    <div className="w-8 h-8 rounded-full bg-[#4988C4]/40 dark:bg-[#4988C4] flex items-center justify-center">
                      <span className="text-sm">🔄</span>
                    </div>
                    <span className="text-sm font-medium">Synonym</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0F2854]/10 dark:bg-[#0F2854]/30">
                    <div className="w-8 h-8 rounded-full bg-[#0F2854]/20 dark:bg-[#0F2854] flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <span className="text-sm font-medium">Level A1-C2</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#BDE8F5]/50 dark:bg-[#BDE8F5]/20">
                    <div className="w-8 h-8 rounded-full bg-[#BDE8F5] dark:bg-[#4988C4] flex items-center justify-center">
                      <span className="text-sm">☁️</span>
                    </div>
                    <span className="text-sm font-medium">Cloud Sync</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Dữ liệu của bạn được lưu trữ an toàn với Supabase
        </p>
      </div>
    </div>
  );
}
