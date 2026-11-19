"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, MapPin, Star, Building2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { StudioCardSkeletonGrid } from "@/components/shared/loading-state";
import { authClient } from "@/lib/auth-client";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

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
        <div className="min-h-[calc(100vh-5rem)] bg-background px-4 py-12 sm:px-6 lg:px-8">
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
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const sessionToken = session?.session?.token;
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
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
    if (!user?.email) {
      const timer = setTimeout(() => setFavoriteIds(new Set()), 0);
      return () => clearTimeout(timer);
    }
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/ids`, {
      credentials: "include",
      headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : undefined,
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((ids) => {
        if (Array.isArray(ids)) setFavoriteIds(new Set(ids));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [user?.email, sessionToken]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadStudios() {
      try {
        const query = queryString ? `?${queryString}` : "";
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios${query}`, {
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
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient Spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[min(700px,90vw)] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header & Search */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Explore Creative Studios</h1>
            <p className="mt-1 text-sm text-muted-foreground">Book professional soundstages, cyclorama lofts, and recording spaces.</p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-xl border-border bg-muted/60 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
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
                  : "border border-border bg-muted/60 text-muted-foreground hover:text-foreground"
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
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {queryString ? "No studios match your search" : "No studios listed yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
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
                className="mt-5 rounded-xl border-border bg-muted/60 text-foreground hover:bg-muted"
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
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-amber-400/40 hover:shadow-xl"
              >
                <div className="relative h-52 w-full overflow-hidden bg-muted">
                  <img
                    src={studio.imageUrl}
                    alt={studio.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-zinc-950/70 px-3 py-1 text-[11px] font-medium text-amber-300 backdrop-blur-md">
                    {studio.category}
                  </span>
                  <div className="absolute right-3 top-3">
                    <FavoriteButton
                      studioId={studio._id}
                      initialFavorited={favoriteIds.has(studio._id)}
                      onChange={(id, next) => {
                        setFavoriteIds((prev) => {
                          const updated = new Set(prev);
                          if (next) updated.add(id);
                          else updated.delete(id);
                          return updated;
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{studio.location}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-600 dark:text-amber-400" />
                      {studio.rating || "New"}
                    </span>
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    {studio.title}
                  </h3>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Hourly Rate</span>
                      <p className="text-base font-bold text-foreground">
                        ${studio.hourlyRate} <span className="text-xs font-normal text-muted-foreground">/hr</span>
                      </p>
                    </div>

                          <Link
                            href={`/studios/${studio._id}`}
                            className={buttonVariants({
                              className:
                                "rounded-xl bg-muted text-xs font-semibold text-foreground hover:bg-amber-400 hover:text-zinc-950",
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