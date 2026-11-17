"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Host a Studio", href: "/studios/new" },
];

const POPULAR_CATEGORIES = [
  { label: "Cyclorama Lofts", href: "/studios?category=cyclorama", count: "140+" },
  { label: "Cinema Soundstages", href: "/studios?category=soundstage", count: "85+" },
  { label: "Podcast & Vocal Booths", href: "/studios?category=podcast", count: "210+" },
  { label: "Daylight Photo Studios", href: "/studios?category=daylight", count: "190+" },
  { label: "Mixing & Mastering Suites", href: "/studios?category=mixing", count: "65+" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Host Guarantee", href: "/guarantee" },
];

function StudioApertureLogo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3 focus:outline-none">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-b from-zinc-800/90 to-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_14px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:border-amber-400/50 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_22px_rgba(245,158,11,0.3)]">
        <div className="pointer-events-none absolute -top-2 h-4 w-7 rounded-full bg-amber-400/35 blur-md opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

        <svg
          viewBox="0 0 36 36"
          fill="none"
          className="h-6 w-6 text-amber-400 transition-transform duration-700 ease-out group-hover:rotate-45"
        >
          <circle
            cx="18"
            cy="18"
            r="14"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.35"
          />
          <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="5" x2="23.5" y2="14.5" />
            <line x1="27.2" y1="8.8" x2="22.8" y2="18.8" />
            <line x1="31" y1="18" x2="21.5" y2="23.5" />
            <line x1="27.2" y1="27.2" x2="17.2" y2="22.8" />
            <line x1="18" y1="31" x2="12.5" y2="21.5" />
            <line x1="8.8" y1="27.2" x2="13.2" y2="17.2" />
            <line x1="5" y1="18" x2="14.5" y2="12.5" />
            <line x1="8.8" y1="8.8" x2="18.8" y2="13.2" />
          </g>
          <circle
            cx="18"
            cy="18"
            r="4.2"
            fill="#F59E0B"
            fillOpacity="0.18"
            stroke="#FBBF24"
            strokeWidth="1.3"
          />
        </svg>

        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-zinc-950" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-0.5 text-lg font-bold tracking-tight text-white">
          <span>Studio</span>
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            Space
          </span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-zinc-400">
          Creative Stages
        </span>
      </div>
    </Link>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubscribing(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubscribed(true);
      setEmail("");
      toast.success("Subscribed to the StudioSpace Stage Dispatch!");
    } catch {
      toast.error("Could not subscribe right now. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#09090B] text-zinc-300">
      {/* Top Specular Amber Hairline & Ambient Glow */}
      <div className="pointer-events-none absolute inset-x-1/4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[680px] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-8">
        {/* Main 12-Column Footer Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand Identity, Mission & Socials (4 cols) */}
          <div className="space-y-5 lg:col-span-4">
            <StudioApertureLogo />

            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Curated cinema soundstages, acoustic recording suites, and
              daylight cyclorama lofts—engineered for directors, photographers,
              and independent creators to book on demand.
            </p>

            {/* Live Stage Network Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
              <span>680+ Verified Stages Active Worldwide</span>
            </div>

            {/* Social Media Icons (Modern X Logo, Instagram, YouTube, LinkedIn) */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* New X Logo (Not Twitter Bird) */}
              <Link
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow StudioSpace on X"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>

              {/* Instagram */}
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow StudioSpace on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>

              {/* YouTube */}
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Subscribe to StudioSpace on YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Connect with StudioSpace on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-zinc-400 transition-colors hover:text-amber-300"
                  >
                    <span className="mr-0 h-1 w-0 rounded-full bg-amber-400 transition-all duration-300 group-hover:mr-2 group-hover:w-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Studio Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Popular Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {POPULAR_CATEGORIES.map((category) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className="group flex items-center justify-between rounded-lg py-0.5 text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    <span className="transition-colors group-hover:text-amber-300">
                      {category.label}
                    </span>
                    <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 transition-colors group-hover:border-amber-400/30 group-hover:text-amber-300">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stage Dispatch Newsletter Card (3 cols) */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3 w-3" />
                Stage Dispatch
              </div>

              <h3 className="mt-3 text-base font-semibold text-white">
                New Stages &amp; Off-Peak Rates
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Get weekly drops on newly verified soundstages and last-minute
                production slots.
              </p>

              <form onSubmit={handleSubscribe} noValidate className="mt-4 space-y-2.5">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="email"
                    placeholder="producer@studio.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subscribed) setSubscribed(false);
                    }}
                    className="h-10 rounded-xl border-white/10 bg-zinc-950/80 pl-9 text-xs text-white placeholder:text-zinc-500 focus-visible:border-amber-400/60 focus-visible:ring-amber-400/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="group h-10 w-full rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-xs font-semibold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_16px_rgba(245,158,11,0.28)] transition-all hover:brightness-105"
                >
                  {isSubscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : subscribed ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Subscribed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>Subscribe</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs text-zinc-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} StudioSpace Inc. All rights
            reserved. Built for creators &amp; production teams.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-zinc-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}