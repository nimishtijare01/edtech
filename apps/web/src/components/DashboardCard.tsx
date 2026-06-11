"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  delay?: number;
}

export function DashboardCard({ title, value, trend, trendUp, icon: Icon, delay = 0 }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-6 rounded-xl bg-card border border-border flex flex-col justify-between overflow-hidden relative group"
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 rounded-lg bg-accent/50 text-muted-foreground group-hover:text-primary transition-colors">
          <Icon size={18} />
        </div>
      </div>
      
      <div>
        <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
        {trend && (
          <p className={`text-sm mt-1 flex items-center gap-1 font-medium ${trendUp ? "text-emerald-500" : "text-destructive"}`}>
            {trendUp ? "↑" : "↓"} {trend}
            <span className="text-muted-foreground font-normal ml-1">vs last month</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
