"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api-url";
import { authClient } from "@/lib/auth-client";

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

  useEffect(() => {
    if (isSessionPending || !userEmail) return;
    const email = userEmail;

    const controller = new AbortController();
    let active = true;

    async function loadBookings() {
      try {
        const response = await fetch(
          getApiUrl(`/api/bookings/${encodeURIComponent(email)}`),
          { signal: controller.signal }
        );
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
    try {
      const response = await fetch(getApiUrl(`/api/bookings/${id}/cancel`), {
        method: "PATCH",
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
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-white/[0.08] pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Bookings</h1>
          <p className="mt-1 text-sm text-zinc-400">Track your upcoming studio sessions and reservation statuses.</p>
        </div>

        {isSessionPending || (userEmail && loadedEmail !== userEmail) ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          </div>
        ) : !userEmail ? (
          <div className="mt-20 text-center">
            <p className="text-lg font-medium text-zinc-300">Log in to view your bookings.</p>
            <Button
              render={<Link href="/login" />}
              className="mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950"
            >
              Log in
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-20 text-center">
            <Calendar className="mx-auto h-12 w-12 text-zinc-600" />
            <p className="mt-4 text-lg font-medium text-zinc-300">No bookings found.</p>
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

                  <h3 className="text-lg font-bold text-white">{booking.studioTitle}</h3>

                  <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" /> {booking.studioLocation}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-zinc-400">
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
                      className="mt-2 rounded-xl bg-rose-500/10 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel Booking
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