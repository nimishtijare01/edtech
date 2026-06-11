"use client";

import { motion } from "framer-motion";
import { BookOpen, Video, ShieldCheck, Users, LineChart, Zap } from "lucide-react";

const features = [
  {
    name: "DRM-Protected Video",
    description: "Your content is your intellectual property. Our military-grade DRM ensures your videos can't be downloaded or screen-recorded.",
    icon: Video,
  },
  {
    name: "Advanced Assessment Engine",
    description: "Conduct JEE/NEET/UPSC format mock tests with adaptive difficulty, negative marking, and detailed sectional analytics.",
    icon: ShieldCheck,
  },
  {
    name: "Live Classes & WebRTC",
    description: "Host interactive live sessions with built-in polling, hand-raising, and auto-recording capabilities.",
    icon: Users,
  },
  {
    name: "E-Commerce & Sales Funnels",
    description: "Sell your courses directly through a built-in storefront with local payment gateways and split GST routing.",
    icon: Zap,
  },
  {
    name: "Deep Analytics",
    description: "Track student performance, batch progress, and financial health from a single, intuitive dashboard.",
    icon: LineChart,
  },
  {
    name: "AI-Powered Tools",
    description: "Generate quizzes automatically from PDFs and let AI draft your marketing copy for course landing pages.",
    icon: BookOpen,
  },
];

export function Features() {
  return (
    <div id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need to teach online
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Stop stitching together generic tools. EdScale is purpose-built for the unique workflows of coaching institutes and independent tutors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-primary/20 text-primary mb-6">
                  <feature.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
