"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface FavoriteButtonProps {
  studioId: string;
  initialFavorited?: boolean;
  onChange?: (studioId: string, favorited: boolean) => void;
}

export function FavoriteButton({
  studioId,
  initialFavorited = false,
  onChange,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const token = session?.session?.token;

  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFavorited(initialFavorited), 0);
    return () => clearTimeout(timer);
  }, [initialFavorited]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast.error("Please log in to save studios.");
      router.push("/login");
      return;
    }

    if (pending) return;

    const next = !favorited;
    setPending(true);
    setFavorited(next);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${studioId}`,
        {
          method: next ? "POST" : "DELETE",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setFavorited(!next);
        throw new Error(data?.message || "Failed to update wishlist.");
      }

      toast.success(next ? "Saved to wishlist." : "Removed from wishlist.");
      onChange?.(studioId, next);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update wishlist.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={favorited ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={favorited}
      onClick={handleClick}
      disabled={pending}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur-md transition hover:border-amber-400/60 hover:text-amber-500 disabled:opacity-60"
    >
      <Heart
        className={`h-4 w-4 ${favorited ? "fill-amber-500 text-amber-500" : ""}`}
      />
    </button>
  );
}
