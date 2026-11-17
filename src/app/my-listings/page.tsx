"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Trash2, Edit, Plus, MapPin, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { getApiUrl } from "@/lib/api-url";
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

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
  const [deletingStudioId, setDeletingStudioId] = useState<string | null>(null);

  useEffect(() => {
    if (isSessionPending || !userEmail) return;
    const email = userEmail;

    const controller = new AbortController();
    let active = true;

    async function loadListings() {
      try {
        const response = await fetch(
          getApiUrl("/api/my-studios"),
          { signal: controller.signal, credentials: "include" }
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
  }, [isSessionPending, userEmail]);

  const handleDelete = async (id: string) => {
    if (deletingStudioId) return;

    try {
      setDeletingStudioId(id);
      const response = await fetch(getApiUrl(`/api/studios/${id}`), {
        method: "DELETE",
        credentials: "include",
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
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">My Studio Listings</h1>
            <p className="mt-1 text-sm text-zinc-400">Manage, update, or remove your published creative spaces.</p>
          </div>
          <Button
            render={<Link href="/add-studio" />}
            className="rounded-xl bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Studio
          </Button>
        </div>

        {isSessionPending || (userEmail && loadedEmail !== userEmail) ? (
          <BrandedLoader
            message="Loading your studio listings..."
            className="min-h-64 bg-transparent"
          />
        ) : !userEmail ? (
          <div className="mt-20 text-center">
            <p className="text-lg font-medium text-zinc-300">Log in to manage your studio listings.</p>
            <Button
              render={<Link href="/login" />}
              className="mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950"
            >
              Log in
            </Button>
          </div>
        ) : studios.length === 0 ? (
          <div className="mt-20 text-center">
            <Building2 className="mx-auto h-12 w-12 text-zinc-600" />
            <p className="mt-4 text-lg font-medium text-zinc-300">You haven&apos;t listed any studios yet.</p>
            <Button
              render={<Link href="/add-studio" />}
              className="mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950"
            >
              Create Your First Listing
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div key={studio._id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-4">
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-zinc-900">
                  <img src={studio.imageUrl} alt={studio.title} className="h-full w-full object-cover" />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-amber-400">{studio.category}</span>
                  <h3 className="mt-1 text-base font-bold text-white truncate">{studio.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                    <MapPin className="h-3 w-3" /> {studio.location}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">${studio.hourlyRate}/hr</p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                  <Button
                    render={<Link href={`/studios/edit/${studio._id}`} />}
                    variant="outline"
                    className="flex-1 rounded-xl border-white/15 bg-white/[0.03] text-xs text-zinc-200 hover:bg-white/[0.08]"
                  >
                    <Edit className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> Update
                  </Button>
                  <Button
                    onClick={() => setStudioToDelete(studio)}
                    disabled={deletingStudioId !== null}
                    className="flex-1 rounded-xl bg-rose-500/10 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
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
        <AlertDialogContent className="border-white/10 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-500/10 text-rose-400">
              <TriangleAlert aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-white">Delete studio listing?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {studioToDelete
                ? `“${studioToDelete.title}” will be permanently removed. This action cannot be undone.`
                : "This listing will be permanently removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-white/10 bg-white/[0.02]">
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