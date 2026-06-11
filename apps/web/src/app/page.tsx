"use client";

import { motion } from "framer-motion";
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight"
        >
          Overview
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          Here's what's happening across the Alpha Platform today.
        </motion.p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Institutes"
          value="1,248"
          trend="12%"
          trendUp={true}
          icon={Building2}
          delay={0.1}
        />
        <DashboardCard
          title="Active Students"
          value="45,231"
          trend="8.2%"
          trendUp={true}
          icon={Users}
          delay={0.2}
        />
        <DashboardCard
          title="Total Revenue"
          value="₹12.4M"
          trend="24%"
          trendUp={true}
          icon={CreditCard}
          delay={0.3}
        />
        <DashboardCard
          title="Course Enrollments"
          value="89,432"
          trend="2.1%"
          trendUp={false}
          icon={TrendingUp}
          delay={0.4}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border h-96 flex flex-col items-center justify-center"
        >
          <div className="text-muted-foreground text-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <TrendingUp size={24} className="opacity-50" />
            </div>
            <p>Revenue chart will appear here</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 rounded-xl bg-card border border-border h-96 flex flex-col items-center justify-center"
        >
          <div className="text-muted-foreground text-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <Users size={24} className="opacity-50" />
            </div>
            <p>User growth chart will appear here</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
