"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, MapPin, Star, Building2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
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

const CATEGORIES = ["all", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop", "Cyclorama Loft"];

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-5rem)] bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <StudioCardSkeletonGrid className="mt-8" />
          </div>
        </div>
      }
    >
      <StudiosExplorer />
    </Suspense>
  );
}

function StudiosExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const selectedCategory = searchParams.get("category") || "all";

  function updateCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `/studios?${nextQuery}` : "/studios", {
      scroll: false,
    });
  }

  const queryParams = new URLSearchParams();
  if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
  if (search) queryParams.append("search", search);
  const queryString = queryParams.toString();
  const loading = loadedQuery !== queryString;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadStudios() {
      try {
        const query = queryString ? `?${queryString}` : "";
        const response = await fetch(getApiUrl(`/api/studios${query}`), {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
          throw new Error(data?.message || "Failed to fetch studios.");
        }

        if (active) setStudios(data);
      } catch (error) {
        if (active && !controller.signal.aborted) {
          const message =
            error instanceof Error ? error.message : "Failed to fetch studios.";
          toast.error(message);
        }
      } finally {
        if (active) setLoadedQuery(queryString);
      }
    }

    void loadStudios();
    return () => {
      active = false;
      controller.abort();
    };
  }, [queryString]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient Spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header & Search */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Explore Creative Studios</h1>
            <p className="mt-1 text-sm text-zinc-400">Book professional soundstages, cyclorama lofts, and recording spaces.</p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-sm text-white placeholder:text-zinc-500 focus-visible:border-amber-400/60"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-amber-400 text-zinc-950 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "All Studios" : cat}
            </button>
          ))}
        </div>

        {/* Studio Grid */}
        {loading ? (
          <StudioCardSkeletonGrid className="mt-8" />
        ) : studios.length === 0 ? (
          <div className="mt-20 text-center">
            <Building2 className="mx-auto h-12 w-12 text-zinc-600" />
            <h2 className="mt-4 text-lg font-semibold text-zinc-200">
              {queryString ? "No studios match your search" : "No studios listed yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              {queryString
                ? "Try another search or clear your filters to see all available spaces."
                : "Be the first to share a creative space with the StudioSpace community."}
            </p>
            {queryString ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  updateCategory("all");
                }}
                className="mt-5 rounded-xl border-white/15 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.08]"
              >
                <SearchX className="mr-2 size-4" />
                Clear search and filters
              </Button>
            ) : (
              <Link
                href="/add-studio"
                className={buttonVariants({
                  className:
                    "mt-5 rounded-xl bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300",
                })}
              >
                List your studio
                <ArrowRight className="ml-2 size-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80 transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              >
                <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={studio.imageUrl}
                    alt={studio.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-zinc-950/70 px-3 py-1 text-[11px] font-medium text-amber-300 backdrop-blur-md">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                      {studio.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {studio.rating || "New"}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {studio.title}
                  </h3>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div>
                      <span className="text-xs text-zinc-500">Hourly Rate</span>
                      <p className="text-base font-bold text-white">
                        ${studio.hourlyRate} <span className="text-xs font-normal text-zinc-400">/hr</span>
                      </p>
                    </div>

                          <Link
                            href={`/studios/${studio._id}`}
                            className={buttonVariants({
                              className:
                                "rounded-xl bg-white/[0.08] text-xs font-semibold text-white hover:bg-amber-400 hover:text-zinc-950",
                            })}
                          >
                            View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}