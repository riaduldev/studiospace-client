"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  Camera,
  Building2,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Clock,
  Lock,
  Headphones,
  ChevronDown,
  Zap,
} from "lucide-react";

const CREATOR_STEPS = [
  {
    step: "01",
    title: "Discover Curated Spaces",
    description:
      "Filter through verified soundstages, cyclorama lofts, podcast rooms, and acoustic recording suites tailored to your production scale.",
    icon: Search,
    highlight: "Instant filtering by gear, acoustics & rates",
  },
  {
    step: "02",
    title: "Select Date & Production Hours",
    description:
      "Check transparent hourly rates and refundable security deposits upfront—zero hidden fees or surprise studio surcharges.",
    icon: Clock,
    highlight: "Flexible hourly blocks for shoots & sessions",
  },
  {
    step: "03",
    title: "Reserve With Confidence",
    description:
      "Submit your booking request in seconds and track approval status directly from your personal command dashboard.",
    icon: CalendarCheck,
    highlight: "Protected by $1M Production Liability",
  },
  {
    step: "04",
    title: "Arrive, Load In & Produce",
    description:
      "Walk onto a pre-prepped set with freight access, dedicated power, and listed lighting or audio equipment ready to roll.",
    icon: Sparkles,
    highlight: "Verified amenities guaranteed on arrival",
  },
];

const HOST_STEPS = [
  {
    step: "01",
    title: "List Your Creative Space",
    description:
      "Publish your studio in minutes with high-resolution visuals, equipment checklists, crew capacity limits, and hourly pricing.",
    icon: Building2,
    highlight: "Free to list—zero upfront subscription",
  },
  {
    step: "02",
    title: "Review & Manage Bookings",
    description:
      "Maintain full control over your studio calendar. View incoming creator reservations and manage schedules from one dashboard.",
    icon: CalendarCheck,
    highlight: "Complete host control over availability",
  },
  {
    step: "03",
    title: "Host Verified Productions",
    description:
      "Every booking includes security deposit protection and identity-verified filmmakers, photographers, and recording artists.",
    icon: ShieldCheck,
    highlight: "Security deposits & liability coverage",
  },
  {
    step: "04",
    title: "Turn Downtime Into Revenue",
    description:
      "Monetize idle studio hours consistently and grow your reputation through verified creator reviews.",
    icon: DollarSign,
    highlight: "Transparent payouts & earnings tracking",
  },
];

const FAQS = [
  {
    question: "How does the refundable security deposit work?",
    answer:
      "Each host sets a transparent security deposit to protect specialized lighting, acoustic panels, and cyclorama walls. Once your wrap is complete and the space is inspected, the deposit is released cleanly.",
  },
  {
    question: "Can I cancel a pending studio reservation?",
    answer:
      "Yes. Any booking currently in 'Pending' status can be cancelled with a single click directly from your My Bookings dashboard before session confirmation.",
  },
  {
    question: "Are lighting and audio equipment included in the hourly rate?",
    answer:
      "Every studio listing features an 'Included Amenities & Equipment' section detailing exact gear (such as Godox strobes, RGB tubes, or microphones) included at no extra cost.",
  },
  {
    question: "How do I list my own studio on StudioSpace?",
    answer:
      "Create a free account, navigate to 'List Your Space' (/add-studio), upload your studio cover image, select included equipment, and publish immediately.",
  },
];

export default function HowItWorksPage() {
  const [activeRole, setActiveRole] = useState<"creator" | "host">("creator");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const steps = activeRole === "creator" ? CREATOR_STEPS : HOST_STEPS;

  return (
    <div className="relative min-h-screen bg-[#09090B] text-white selection:bg-amber-400 selection:text-zinc-950">
      {/* Ambient Spotlight Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[860px] -translate-x-1/2 rounded-full bg-amber-500/[0.08] blur-[140px]" />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
          <Zap className="h-3.5 w-3.5" />
          <span>Built For Modern Productions</span>
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          From Scouting to Wrap,{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Effortlessly Streamlined.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Whether you are booking an acoustic soundstage for your next shoot or monetizing your studio downtime, StudioSpace connects creators and space owners seamlessly.
        </p>

        {/* Interactive Role Switcher */}
        <div className="mt-10 inline-flex rounded-2xl border border-white/10 bg-zinc-950/90 p-1.5 shadow-xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveRole("creator")}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold transition-all sm:text-sm ${
              activeRole === "creator"
                ? "bg-amber-400 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>For Creators &amp; Directors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("host")}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold transition-all sm:text-sm ${
              activeRole === "host"
                ? "bg-amber-400 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>For Studio Owners</span>
          </button>
        </div>
      </section>

      {/* 2. 4-STEP WORKFLOW GRID */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950/85 p-7 transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300 transition-colors group-hover:bg-amber-400 group-hover:text-zinc-950">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-white/10 transition-colors group-hover:text-amber-400/20">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    {item.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PLATFORM TRUST & PROTECTION PILLARS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-950 to-zinc-950/50 p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              StudioSpace Standard
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineered for Reliability &amp; Peace of Mind
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Every session booked on our platform is backed by strict verification and transparent terms.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <ShieldCheck className="h-7 w-7 text-amber-400" />
              <h3 className="mt-4 text-base font-bold text-white">$1M Liability Coverage</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                Comprehensive protection covering studio property, cycloramas, and rented production gear during active hours.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <Lock className="h-7 w-7 text-amber-400" />
              <h3 className="mt-4 text-base font-bold text-white">Transparent Pricing</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                Clear hourly rates and refundable security deposits calculated upfront before you confirm any booking.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <Headphones className="h-7 w-7 text-amber-400" />
              <h3 className="mt-4 text-base font-bold text-white">24/7 Production Desk</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                Dedicated support for early call times, overnight shoots, and last-minute schedule adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE FAQ SECTION */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Common Questions
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80 transition-colors hover:border-white/15"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-amber-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/[0.06] px-6 pb-5 pt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. BOTTOM DUAL CTA BANNER */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-r from-amber-500/[0.12] via-zinc-950 to-zinc-950 p-8 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-2">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to start your next production?
              </h2>
              <p className="text-sm text-zinc-300">
                Browse verified studios across the city or publish your creative space to start receiving bookings today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/studios"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-amber-400 px-7 text-sm font-semibold text-zinc-950 shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-colors hover:bg-amber-300"
              >
                Explore Studios <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/add-studio"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold text-white transition-colors hover:bg-white/[0.1]"
              >
                List Your Space
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}