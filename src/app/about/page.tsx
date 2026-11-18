"use client";

import React from "react";
import Link from "next/link";
import { 
  Building2, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Award, 
  Zap 
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white selection:bg-amber-400 selection:text-zinc-950">
      {/* Ambient Spotlight Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[860px] -translate-x-1/2 rounded-full bg-amber-500/[0.08] blur-[140px]" />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The StudioSpace Story</span>
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Empowering Creators,{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Elevating Production Spaces.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          StudioSpace is the premier ecosystem bridging visionary filmmakers, photographers, podcasters, and music artists with the world&apos;s finest professional soundstages and creative lofts.
        </p>
      </section>

      {/* 2. MISSION & VISION GRID */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Mission */}
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/85 p-8 sm:p-10 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
              <Globe className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">Our Core Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              To democratize access to high-end production facilities. We believe every creator—independent or enterprise—deserves a frictionless way to discover, book, and produce in professional acoustic environments without the traditional friction of location scouting.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/85 p-8 sm:p-10 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">The Future We&apos;re Building</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              We envision a global network where studio owners can effortlessly monetize their idle production downtime, while creators find instant inspiration, technical readiness, and secure equipment guarantees under one unified platform.
            </p>
          </div>
        </div>
      </section>

      {/* 3. KEY PLATFORM STATS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: "Active Studios", value: "500+" },
            { label: "Verified Creators", value: "12K+" },
            { label: "Successful Shoots", value: "8,500+" },
            { label: "Liability Protection", value: "$1M+" },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 text-center">
              <p className="text-3xl font-black text-amber-400 sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE STUDIOSPACE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Our Standards</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Studios &amp; Creators Trust Us</h2>
          <p className="mt-2 text-sm text-zinc-400">Built from the ground up for modern media production workflows.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Verified Spaces & Gear",
              desc: "Every studio undergoes rigorous quality checks regarding acoustic treatment, lighting rigs, and cyclorama condition.",
              icon: ShieldCheck,
            },
            {
              title: "Instant Secure Bookings",
              desc: "Streamlined date selection, transparent hourly pricing, and protected security deposits with zero hidden platform fees.",
              icon: Zap,
            },
            {
              title: "Creator Community",
              desc: "Join thousands of directors, photographers, and audio engineers who collaborate and produce content seamlessly.",
              icon: Users,
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="rounded-3xl border border-white/[0.08] bg-zinc-950/80 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-r from-amber-500/[0.12] via-zinc-950 to-zinc-950 p-8 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-2">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to experience StudioSpace?
              </h2>
              <p className="text-sm text-zinc-300">
                Explore our curated list of professional soundstages or list your own space today.
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