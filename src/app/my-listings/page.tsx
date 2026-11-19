"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Trash2, Edit, Plus, MapPin, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { BrandedLoader } from "@/components/shared/loading-state";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
}

export default function MyListingsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userEmail = session?.user?.email;
  const sessionToken = session?.session?.token;

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
  const [deletingStudioId, setDeletingStudioId] = useState<string | null>(null);

  useEffect(() => {
    if (isSessionPending || !userEmail) return;
    const email = userEmail;

    const controller = new AbortController();
    let active = true;
    const headers = sessionToken
      ? { Authorization: `Bearer ${sessionToken}` }
      : undefined;

    async function loadListings() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/my-studios`,
          { signal: controller.signal, credentials: "include", headers }
        );
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
          throw new Error(data?.message || "Failed to fetch your listings.");
        }

        if (active) setStudios(data);
      } catch (error) {
        if (active && !controller.signal.aborted) {
          const message =
            error instanceof Error ? error.message : "Failed to fetch your listings.";
          toast.error(message);
        }
      } finally {
        if (active) setLoadedEmail(email);
      }
    }

    void loadListings();
    return () => {
      active = false;
      controller.abort();
    };
  }, [isSessionPending, userEmail, sessionToken]);

  const handleDelete = async (id: string) => {
    if (deletingStudioId) return;

    try {
      setDeletingStudioId(id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: sessionToken
          ? { Authorization: `Bearer ${sessionToken}` }
          : undefined,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete studio.");
      }

      toast.success("Studio listing deleted successfully!");
      setStudios((prev) => prev.filter((studio) => studio._id !== id));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Server error during deletion.";
      toast.error(message);
    } finally {
      setDeletingStudioId(null);
      setStudioToDelete(null);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Studio Listings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage, update, or remove your published creative spaces.</p>
          </div>
          <Link
            href="/add-studio"
            className={buttonVariants({
              className:
                "w-full justify-center rounded-xl bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300 sm:w-auto",
            })}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Studio
          </Link>
        </div>

        {isSessionPending || (userEmail && loadedEmail !== userEmail) ? (
          <BrandedLoader
            message="Loading your studio listings..."
            className="min-h-64 bg-transparent"
          />
        ) : !userEmail ? (
          <div className="mt-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">Log in to manage your studio listings.</p>
            <Link
              href="/login"
              className={buttonVariants({
                className: "mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950",
              })}
            >
              Log in
            </Link>
          </div>
        ) : studios.length === 0 ? (
          <div className="mt-20 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">You haven&apos;t listed any studios yet.</p>
            <Link
              href="/add-studio"
              className={buttonVariants({
                className: "mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950",
              })}
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div key={studio._id} className="overflow-hidden rounded-2xl border border-border bg-card p-4">
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted">
                  <img src={studio.imageUrl} alt={studio.title} className="h-full w-full object-cover" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">{studio.category}</span>
                  <h3 className="mt-1 text-base font-bold text-foreground truncate">{studio.title}</h3>
                  <p className="mt-1 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{studio.location}</span>
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">${studio.hourlyRate}/hr</p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "flex-1 rounded-xl border-border bg-muted/60 text-xs text-foreground hover:bg-muted",
                    })}
                  >
                    <Edit className="mr-1.5 h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Update
                  </Link>
                  <Button
                    onClick={() => setStudioToDelete(studio)}
                    disabled={deletingStudioId !== null}
                    className="flex-1 rounded-xl bg-rose-500/10 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AlertDialog
        open={studioToDelete !== null}
        onOpenChange={(open) => {
          if (!open && deletingStudioId === null) setStudioToDelete(null);
        }}
      >
        <AlertDialogContent className="border-border bg-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <TriangleAlert aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-foreground">Delete studio listing?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {studioToDelete
                ? `“${studioToDelete.title}” will be permanently removed. This action cannot be undone.`
                : "This listing will be permanently removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-border bg-muted/40">
            <AlertDialogCancel disabled={deletingStudioId !== null}>
              Keep listing
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={() => {
                if (studioToDelete) void handleDelete(studioToDelete._id);
              }}
              disabled={deletingStudioId !== null}
              className="bg-rose-500 font-semibold text-white hover:bg-rose-400"
            >
              {deletingStudioId === studioToDelete?._id ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Delete listing
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}