"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Building2, CreditCard, Settings, Calendar, BookOpen } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Institutes", href: "/institutes", icon: Building2 },
  { name: "Batches", href: "/batches", icon: Calendar },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Users", href: "/users", icon: Users },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-border bg-card/50 glass flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">A</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">Alpha Platform</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <span className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={18} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium">
            SA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Super Admin</span>
            <span className="text-xs text-muted-foreground">admin@alpha.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
