import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();

  // If already logged in, redirect to home
  if (!loading && user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#BDE8F5]/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src="/logo512.png" alt="VocabDuck" className="w-full h-full rounded-2xl" />
          </div>
          <CardTitle className="text-2xl text-[#1C4D8D]">
            Đăng nhập VocabDuck
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Học từ vựng tiếng Anh mỗi ngày
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#1C4D8D]" />
            </div>
          ) : (
            <Button
              onClick={signInWithGoogle}
              className="w-full bg-[#1C4D8D] hover:bg-[#0F2854] gap-2"
              size="lg"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
