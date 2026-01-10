import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  GraduationCap
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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguages } from "@/hooks/useLanguages";
import { getLanguageFlag } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Header() {
  const { user, signOut } = useAuth();
  const { currentLanguageId, setLanguageId } = useLanguage();
  const { data: languages = [] } = useLanguages();

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
          to="/study"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
          activeProps={{ className: "bg-white/20" }}
        >
          <GraduationCap size={18} />
          Study
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

      <div className="flex items-center gap-3">
        {/* Language Selector Desktop */}
        {languages.length > 0 && (
          <div className="hidden lg:block">
            <Select
              value={currentLanguageId || "all"}
              onValueChange={(value) => setLanguageId(value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-[180px] bg-brand-800 border-brand-600 text-white focus:ring-brand-400">
                <SelectValue placeholder="Tất cả ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngôn ngữ</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    <span className="mr-2">{getLanguageFlag(lang.code)}</span>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 w-9 rounded-full bg-brand-800 ring-2 ring-brand-600 hover:bg-brand-700 md:flex hidden"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar_url} alt={user.full_name || ""} />
                  <AvatarFallback className="bg-brand-800 text-white font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.full_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  Hồ sơ cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                Đăng nhập
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
