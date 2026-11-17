"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, XCircle, ArrowRight, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api-url";
import { authClient } from "@/lib/auth-client";
import { BrandedLoader } from "@/components/shared/loading-state";

interface Booking {
  _id: string;
  studioTitle: string;
  studioLocation: string;
  bookingDate: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

export default function MyBookingsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadedEmail, setLoadedEmail] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (isSessionPending || !userEmail) return;
    const email = userEmail;

    const controller = new AbortController();
    let active = true;

    async function loadBookings() {
      try {
        const response = await fetch(getApiUrl("/api/bookings"), {
          signal: controller.signal,
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
          throw new Error(data?.message || "Failed to fetch bookings.");
        }

        if (active) setBookings(data);
      } catch (error) {
        if (active && !controller.signal.aborted) {
          const message =
            error instanceof Error ? error.message : "Failed to fetch bookings.";
          toast.error(message);
        }
      } finally {
        if (active) setLoadedEmail(email);
      }
    }

    void loadBookings();
    return () => {
      active = false;
      controller.abort();
    };
  }, [isSessionPending, userEmail]);

  const handleCancelBooking = async (id: string) => {
    if (cancellingBookingId) return;
    try {
      setCancellingBookingId(id);
      const response = await fetch(getApiUrl(`/api/bookings/${id}/cancel`), {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to cancel booking.");
      }

      toast.success("Booking cancelled successfully.");
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: "Cancelled" } : booking
        )
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Server error during cancellation.";
      toast.error(message);
    } finally {
      setCancellingBookingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-white/[0.08] pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Bookings</h1>
          <p className="mt-1 text-sm text-zinc-400">Track your upcoming studio sessions and reservation statuses.</p>
        </div>

        {isSessionPending || (userEmail && loadedEmail !== userEmail) ? (
          <BrandedLoader
            message="Loading your bookings..."
            className="min-h-64 bg-transparent"
          />
        ) : !userEmail ? (
          <div className="mt-20 text-center">
            <p className="text-lg font-medium text-zinc-300">Log in to view your bookings.</p>
            <Link
              href="/login"
              className={buttonVariants({
                className: "mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950",
              })}
            >
              Log in
            </Link>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-20 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.06]">
              <Calendar aria-hidden="true" className="size-7 text-amber-400" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-zinc-200">No bookings yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Find a creative space for your next project and your reservations will show up here.
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
          <div className="mt-8 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs text-zinc-500">ID: {booking._id.slice(-6)}</span>
                  </div>

                  <h3 className="break-words text-lg font-bold text-white">{booking.studioTitle}</h3>

                  <p className="flex min-w-0 items-center gap-1.5 break-words text-xs text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" /> {booking.studioLocation}
                  </p>
                  <p className="flex min-w-0 items-center gap-1.5 break-words text-xs text-zinc-400">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500" /> Date: {booking.bookingDate}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-zinc-500">Total Paid</span>
                    <p className="text-lg font-bold text-white">${booking.totalPrice}</p>
                  </div>

                  {booking.status === "Pending" && (
                    <Button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingBookingId !== null}
                      className="mt-2 rounded-xl bg-rose-500/10 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                    >
                      {cancellingBookingId === booking._id ? (
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      ) : (
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}