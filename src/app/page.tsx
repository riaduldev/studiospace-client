"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Star,
  Building2,
  Search,
  Clock,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  Headphones,
  CheckCircle,
  Camera,
  Mic,
  Music,
  Palette,
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api-url";
import { StudioCardSkeletonGrid } from "@/components/shared/loading-state";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  rating?: number;
}

const HERO_SLIDES = [
  {
    title: "Curated Cinema & Production Stages",
    subtitle: "Book professional soundstages, cyclorama lofts, and acoustic suites on demand.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop",
    category: "Film Stage"
  },
  {
    title: "Daylight Lofts & Infinity Cycloramas",
    subtitle: "Engineered for high-end fashion, commercial photo shoots, and creative directors.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop",
    category: "Photo Studio"
  },
  {
    title: "Acoustic Podcast & Vocal Booths",
    subtitle: "Broadcast-ready recording spaces equipped with pristine studio monitoring.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop",
    category: "Podcast Lounge"
  }
];

const CATEGORIES = [
  { name: "Photo Studio", icon: Camera, count: "190+ Spaces" },
  { name: "Film Stage", icon: Film, count: "85+ Stages" },
  { name: "Podcast Lounge", icon: Mic, count: "210+ Rooms" },
  { name: "Music Suite", icon: Music, count: "65+ Suites" },
  { name: "Workshop", icon: Palette, count: "40+ Lofts" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const loading = !featuredLoaded;

  // Hero Slider Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadFeaturedStudios() {
      try {
        const response = await fetch(getApiUrl("/api/studios"), {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
          throw new Error(data?.message || "Failed to fetch featured studios.");
        }

        if (active) setFeaturedStudios(data.slice(0, 6));
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error("Failed to fetch featured studios:", error);
        }
      } finally {
        if (active) setFeaturedLoaded(true);
      }
    }

    void loadFeaturedStudios();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">

      {/* 1. HERO SLIDER SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-zinc-950">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-zinc-950/60 to-zinc-950/40 z-10" />
            <img src={slide.image} alt={slide.title} className="h-full w-full object-cover scale-105 animate-pulse duration-1000" />

            <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
              <div className="max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>The Ultimate Creator Network</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-white">
                  {slide.title}
                </h1>
                <p className="mx-auto max-w-2xl text-base text-zinc-300 sm:text-lg">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button
                    render={<Link href="/studios" />}
                    className="h-12 rounded-xl bg-amber-400 px-8 text-sm font-semibold text-zinc-950 hover:bg-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.35)]"
                  >
                    Explore Studios <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    render={<Link href="/add-studio" />}
                    variant="outline"
                    className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-8 text-sm font-semibold text-white hover:bg-white/[0.08] backdrop-blur-md"
                  >
                    Host Your Space
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-amber-400" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* 2. BROWSE BY STUDIO CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Curated Spaces</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-white">Browse by Category</h2>
          </div>
          <Link href="/studios" className="mt-4 md:mt-0 flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300">
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={idx}
                href={`/studios?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/85 p-6 transition-all hover:border-amber-400/50 hover:bg-amber-400/[0.03] hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-amber-400 group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="mt-8">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">{cat.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED STUDIOS SECTION (Dynamic .limit(6)) */}
      <section className="border-t border-white/[0.08] bg-zinc-950/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Featured Stages</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-white">Top Rated &amp; Newest Studios</h2>
            </div>
            <Button
              render={<Link href="/studios" />}
              variant="ghost"
              className="mt-4 md:mt-0 text-amber-400 hover:text-amber-300 hover:bg-transparent"
            >
              Explore All Studios <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <StudioCardSkeletonGrid count={3} />
          ) : featuredStudios.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-zinc-600" />
              <p className="mt-4 text-base font-medium text-zinc-300">No studios listed yet.</p>
              <Button
                render={<Link href="/add-studio" />}
                className="mt-4 bg-amber-400 text-zinc-950 font-semibold"
              >
                Publish First Studio
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredStudios.map((studio) => (
                <div
                  key={studio._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950 transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={studio.imageUrl}
                      alt={studio.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-zinc-950/75 px-3 py-1 text-[11px] font-medium text-amber-300 backdrop-blur-md">
                      {studio.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        {studio.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {studio.rating || "5.0"}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {studio.title}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <div>
                        <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Rate</span>
                        <p className="text-base font-bold text-white">
                          ${studio.hourlyRate} <span className="text-xs font-normal text-zinc-400">/ hr</span>
                        </p>
                      </div>

                      <Button
                        render={<Link href={`/studios/${studio._id}`} />}
                        className="rounded-xl bg-white/[0.08] text-xs font-semibold text-white hover:bg-amber-400 hover:text-zinc-950"
                      >
                        View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. EXTRA SECTION 1: HOW BOOKING WORKS (4-STEP WORKFLOW) */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Seamless Process</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">How Booking Works</h2>
          <p className="mt-2 text-sm text-zinc-400">Book professional creative spaces in 4 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "01", title: "Discover Spaces", desc: "Browse verified acoustic suites, cyclorama lofts, and film stages.", icon: Search },
            { step: "02", title: "Select Shoot Hours", desc: "Choose your preferred date, production duration, and equipment needs.", icon: Clock },
            { step: "03", title: "Book Instantly", desc: "Secure your reservation with instant host confirmation and safe deposits.", icon: CalendarCheck },
            { step: "04", title: "Create & Produce", desc: "Arrive on set and bring your creative vision to life effortlessly.", icon: Sparkles }
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="relative rounded-3xl border border-white/[0.08] bg-zinc-950/80 p-8">
                <span className="absolute right-6 top-6 text-2xl font-black text-white/10">{item.step}</span>
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

      {/* 5. EXTRA SECTION 2: HOST GUARANTEE & CREATOR SUPPORT */}
      <section className="border-t border-white/[0.08] bg-gradient-to-b from-zinc-950/40 to-[#09090B] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-amber-300">
                <ShieldCheck className="h-3 w-3" />
                <span>Enterprise Grade Security</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Host Guarantee &amp; Creator Support
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                We safeguard every booking with comprehensive liability protection, rigorously verified host profiles, and 24/7 dedicated production assistance.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  "Comprehensive liability protection covering property & equipment.",
                  "100% verified creator and host identity badges.",
                  "Instant dispute resolution and equipment safety standards.",
                  "24/7 dedicated VIP host support for live productions."
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-400 shrink-0" />
                    <span className="text-sm text-zinc-200">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 flex flex-col justify-between">
                <ShieldCheck className="h-8 w-8 text-amber-400 mb-8" />
                <div>
                  <h4 className="text-xl font-bold text-white">$1M+</h4>
                  <p className="text-xs text-zinc-400 mt-1">Liability Protection on all active sessions.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 flex flex-col justify-between mt-6">
                <Headphones className="h-8 w-8 text-amber-400 mb-8" />
                <div>
                  <h4 className="text-xl font-bold text-white">24/7 Support</h4>
                  <p className="text-xs text-zinc-400 mt-1">Direct hotline for directors &amp; studio owners.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}