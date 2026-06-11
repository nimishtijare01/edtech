"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "EdScale Beta",
    description: "For Solo Tutors",
    price: "Free to start",
    features: [
      "60-second landing page builder",
      "Simple fee collection & reminders",
      "Digital attendance tracking",
      "1-on-1 and group chat",
      "Doubt resolution portal",
      "Broadcast announcements"
    ],
    cta: "Start as Tutor",
    popular: false,
  },
  {
    name: "EdScale Alpha",
    description: "For Coaching Institutes",
    price: "Custom Pricing",
    features: [
      "Everything in Beta, plus:",
      "DRM-protected video hosting",
      "Advanced Assessment Engine (JEE/NEET)",
      "Multi-batch & Teacher management",
      "Advanced E-Commerce routing & GST",
      "AI Syllabus & Quiz Builder"
    ],
    cta: "Contact Sales",
    popular: true,
  }
];

export function Tiers() {
  return (
    <div id="solutions" className="py-24 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Solutions</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            Built for your scale
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Whether you are an independent tutor or a large coaching franchise, we have the right tier for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative p-8 rounded-3xl border ${tier.popular ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'} backdrop-blur-sm flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-muted-foreground font-medium mb-6">{tier.description}</p>
                <div className="text-3xl font-extrabold text-foreground">{tier.price}</div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1 mr-3">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={tier.popular ? "/contact" : "/signup"}
                className={`w-full text-center py-3 px-6 rounded-xl font-medium transition-colors ${tier.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/10 text-foreground hover:bg-white/20'}`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
