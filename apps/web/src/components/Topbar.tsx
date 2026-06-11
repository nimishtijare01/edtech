"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 glass sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center text-sm font-medium text-muted-foreground">
        Admin Dashboard
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-9 w-64 rounded-md border border-border bg-accent/30 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-accent/50 transition-all placeholder:text-muted-foreground/70"
          />
        </div>
        
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>

        <button 
          onClick={handleSignOut}
          className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
