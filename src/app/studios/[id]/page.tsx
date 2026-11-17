"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, ShieldCheck, Star, Calendar, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiUrl } from "@/lib/api-url";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  overview?: string;
  amenities?: string[];
  ownerName: string;
  ownerEmail: string;
  rating?: number;
}

export default function StudioDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [studioResult, setStudioResult] = useState<{
    id: string;
    studio: Studio | null;
  } | null>(null);
  const loading = studioResult?.id !== id;
  const studio = studioResult?.id === id ? studioResult.studio : null;
  const [bookingDate, setBookingDate] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadStudio() {
      try {
        const response = await fetch(getApiUrl(`/api/studios/${id}`), {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok || !data) {
          throw new Error(data?.message || "Failed to load studio details.");
        }

        if (active) setStudioResult({ id, studio: data });
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error(error);
          const message =
            error instanceof Error ? error.message : "Network error while loading studio.";
          toast.error(message);
          setStudioResult({ id, studio: null });
        }
      }
    }

    void loadStudio();
    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to book a studio session.");
      router.push("/login");
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }

    try {
      setIsBookingSubmitting(true);

      const bookingPayload = {
        studioId: studio?._id,
        studioTitle: studio?.title,
        studioLocation: studio?.location,
        studioImage: studio?.imageUrl,
        userEmail: user.email,
        userName: user.name || user.email,
        bookingDate,
        totalPrice: (studio?.hourlyRate || 0) * 4 + (studio?.securityDeposit || 0), // ধরে নিচ্ছি ডিফল্ট ৪ ঘণ্টার সেশন
      };

      const res = await fetch(getApiUrl("/api/bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Booking request submitted successfully!");
        router.push("/my-bookings");
      } else {
        throw new Error(data.message || "Failed to submit booking.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center bg-[#09090B]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] bg-[#09090B] text-white">
        <p className="text-lg font-medium text-zinc-400">Studio not found.</p>
        <Button render={<Link href="/studios" />} className="mt-4 bg-amber-400 text-zinc-950 font-semibold">
          Back to Explore
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#09090B] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Button render={<Link href="/studios" />} variant="ghost" className="mb-6 text-zinc-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Studios
        </Button>

        {/* Studio Hero Banner */}
        <div className="relative h-72 sm:h-[400px] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
          <img src={studio.imageUrl} alt={studio.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                {studio.category}
              </span>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-4xl">{studio.title}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-300">
                <MapPin className="h-4 w-4 text-amber-400" /> {studio.location}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-zinc-950/80 p-4 backdrop-blur-xl">
              <span className="text-xs text-zinc-400">Rate</span>
              <p className="text-2xl font-bold text-amber-400">${studio.hourlyRate}<span className="text-xs font-normal text-zinc-400">/hr</span></p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5">
              <div>
                <span className="flex items-center gap-1 text-xs text-zinc-500"><ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Security Deposit</span>
                <p className="mt-1 text-base font-bold text-white">${studio.securityDeposit}</p>
              </div>
              <div>
                <span className="flex items-center gap-1 text-xs text-zinc-500"><Users className="h-3.5 w-3.5 text-amber-400" /> Max Capacity</span>
                <p className="mt-1 text-base font-bold text-white">{studio.maxCapacity} Crew</p>
              </div>
              <div>
                <span className="flex items-center gap-1 text-xs text-zinc-500"><Star className="h-3.5 w-3.5 text-amber-400" /> Rating</span>
                <p className="mt-1 text-base font-bold text-white">{studio.rating || "New Studio"}</p>
              </div>
            </div>

            {/* Overview */}
            {studio.overview && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">About This Studio</h2>
                <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">{studio.overview}</p>
              </div>
            )}

            {/* Amenities */}
            {studio.amenities && studio.amenities.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">Included Amenities & Equipment</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {studio.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-zinc-300">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Info */}
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5">
              <span className="text-xs uppercase tracking-wider text-zinc-500">Hosted By</span>
              <p className="mt-1 text-base font-bold text-white">{studio.ownerName}</p>
              <p className="text-xs text-zinc-400">{studio.ownerEmail}</p>
            </div>
          </div>

          {/* Right Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-2xl">
              <h3 className="text-lg font-bold text-white">Book This Space</h3>
              <p className="mt-1 text-xs text-zinc-400">Secure your session with instant confirmation.</p>

              <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bookingDate" className="text-xs font-medium text-zinc-300">Select Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="bookingDate"
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span>Hourly Rate ({studio.hourlyRate}$ × 4 hrs):</span>
                    <span>${studio.hourlyRate * 4}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit (Refundable):</span>
                    <span>${studio.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                    <span>Total Estimated:</span>
                    <span className="text-amber-400">${(studio.hourlyRate * 4) + studio.securityDeposit}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="h-12 w-full rounded-xl bg-amber-400 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
                >
                  {isBookingSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Studio Reservation"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}