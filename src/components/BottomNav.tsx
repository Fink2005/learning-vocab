import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, Plus, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const pathname = location.pathname;

  const navItems = [
    { href: "/", icon: Home, label: "Trang chủ" },
    { href: "/vocabulary", icon: BookOpen, label: "Từ vựng" },
    { href: "/vocabulary/new", icon: Plus, label: "Thêm", isCenter: true },
    { href: user ? "/profile" : "/login", icon: User, label: user ? "Tôi" : "Đăng nhập" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-[calc(env(safe-area-inset-bottom)+6px)] lg:hidden"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 bg-brand-700 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Icon size={24} className="text-white" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.1 : 1,
                  color: active ? "#1C4D8D" : "#9CA3AF",
                }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-xs font-medium ${active ? "text-brand-700" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </motion.div>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-12 h-1 bg-brand-700 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
