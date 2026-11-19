"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Search, MapPin, Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { BrandedLoader } from "@/components/shared/loading-state";
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

export default function WishlistPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email;
  const sessionToken = session?.session?.token;

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSessionPending || !userEmail) return;
    const email = userEmail;

    const controller = new AbortController();
    let active = true;

    async function loadWishlist() {
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`,
          {
            signal: controller.signal,
            credentials: "include",
            headers: sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : undefined,
          }
        );
        const data = await response.json().catch(() => null);

        if (!response.ok || !Array.isArray(data)) {
          throw new Error(data?.message || "Failed to fetch saved studios.");
        }

        if (active) {
          setStudios(data);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch saved studios.";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (active) setLoadedEmail(email);
      }
    }

    void loadWishlist();
    return () => {
      active = false;
      controller.abort();
    };
  }, [isSessionPending, userEmail, sessionToken]);

  const handleRemove = (studioId: string) => {
    setStudios((prev) => prev.filter((s) => s._id !== studioId));
  };

  const loading = isSessionPending || (userEmail && loadedEmail !== userEmail);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Studios you have saved for later.
          </p>
        </div>

        {loading ? (
          <BrandedLoader
            message="Loading your saved studios..."
            className="min-h-64 bg-transparent"
          />
        ) : !userEmail ? (
          <div className="mt-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Log in to view your saved studios.
            </p>
            <Link
              href="/login"
              className={buttonVariants({
                className: "mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950",
              })}
            >
              Log in
            </Link>
          </div>
        ) : error ? (
          <div className="mt-20 text-center">
            <p className="text-lg font-medium text-rose-600 dark:text-rose-400">{error}</p>
            <Button
              onClick={() => setLoadedEmail(null)}
              className="mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950"
            >
              Try again
            </Button>
          </div>
        ) : studios.length === 0 ? (
          <div className="mt-20 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.06]">
              <Heart aria-hidden="true" className="size-7 text-amber-600 dark:text-amber-400" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">No saved studios yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Tap the heart on any studio card to save it here for later.
            </p>
            <Link
              href="/studios"
              className={buttonVariants({
                className:
                  "mt-5 rounded-xl bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300",
              })}
            >
              <Search aria-hidden="true" className="mr-2 size-4" />
              Explore studios
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
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
                      initialFavorited={true}
                      onChange={(id, next) => {
                        if (!next) handleRemove(id);
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
