import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  LogOut,
  User,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between bg-brand-700 text-white shadow-lg">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/logo512.png" alt="" className="rounded-xl w-full h-full" />
        </div>
        <span className="text-xl font-bold">VocabDuck</span>
      </Link>

      {/* Desktop Navigation - hidden on mobile */}
      <nav className="hidden lg:flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
          activeProps={{ className: "bg-white/20" }}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link
          to="/vocabulary"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
          activeProps={{ className: "bg-white/20" }}
        >
          <BookOpen size={18} />
          Vocabulary
        </Link>
        <Link
          to="/vocabulary/new"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
          activeProps={{ className: "bg-white/20" }}
        >
          <PlusCircle size={18} />
          Add Word
        </Link>
      </nav>

      {/* User Menu */}
      <div className="flex items-center gap-3">
        {!loading && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-white/10"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {user.full_name?.charAt(0) || user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-sm font-medium">
                  {user.full_name || user.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {user.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button
              variant="secondary"
              className="bg-white text-brand-700 hover:bg-white/90"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
