"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  DollarSign,
  Plus,
  ArrowUpRight,
  Clock,
  MapPin,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
}

interface Booking {
  _id: string;
  studioTitle: string;
  studioLocation: string;
  bookingDate: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

type DashboardData = {
  email: string;
  studios: Studio[];
  bookings: Booking[];
};

export default function DashboardPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email;
  const sessionToken = session?.session?.token;

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const studios =
    dashboardData && dashboardData.email === userEmail ? dashboardData.studios : [];
  const bookings =
    dashboardData && dashboardData.email === userEmail ? dashboardData.bookings : [];
  const dataLoaded = Boolean(userEmail) && dashboardData?.email === userEmail;

  useEffect(() => {
    if (isSessionPending || !userEmail) return;

    const email = userEmail;
    const controller = new AbortController();
    let active = true;
    const headers = sessionToken
      ? { Authorization: `Bearer ${sessionToken}` }
      : undefined;

    async function loadDashboard() {
      try {
        const [studiosRes, bookingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-studios`, {
            signal: controller.signal,
            credentials: "include",
            headers,
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
            signal: controller.signal,
            credentials: "include",
            headers,
          }),
        ]);

        const [studiosData, bookingsData] = await Promise.all([
          studiosRes.json().catch(() => null),
          bookingsRes.json().catch(() => null),
        ]);

        if (!studiosRes.ok || !Array.isArray(studiosData)) {
          throw new Error(
            studiosData?.message || "Failed to load your studio listings."
          );
        }
        if (!bookingsRes.ok || !Array.isArray(bookingsData)) {
          throw new Error(bookingsData?.message || "Failed to load your bookings.");
        }

        if (active) {
          setDashboardData({
            email,
            studios: studiosData,
            bookings: bookingsData,
          });
        }
      } catch (error) {
        if (active && !controller.signal.aborted) {
          const message =
            error instanceof Error ? error.message : "Failed to load dashboard data.";
          toast.error(message);
          setDashboardData({ email, studios: [], bookings: [] });
        }
      }
    }

    void loadDashboard();
    return () => {
      active = false;
      controller.abort();
    };
  }, [isSessionPending, userEmail, sessionToken]);

  // ডায়নামিক ক্যালকুলেশন
  const totalSpentOrEarned = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const pendingBookingsCount = bookings.filter((b) => b.status === "Pending").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-500/10 text-muted-foreground border-zinc-500/20";
    }
  };

  if (isSessionPending || (userEmail && !dataLoaded)) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600 dark:text-amber-400" />
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
        <LayoutDashboard className="h-10 w-10 text-amber-600 dark:text-amber-400" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Log in to view your dashboard.
        </p>
        <Link
          href="/login"
          className={buttonVariants({
            className:
              "mt-4 rounded-xl bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300",
          })}
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      {/* Ambient Studio Spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        
        {/* 1. WELCOME HEADER & QUICK ACTIONS */}
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <LayoutDashboard className="h-3 w-3" />
              <span>Production Command Center</span>
            </div>
            <h1 className="mt-3 break-words text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, <span className="text-amber-600 dark:text-amber-400">{user?.name || "Creator"}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your active soundstages, track session reservations, and manage your studio portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/my-listings"
              className={buttonVariants({
                variant: "outline",
                className:
                  "h-11 w-full justify-center rounded-xl border-border bg-muted/60 text-xs font-semibold text-foreground hover:bg-muted sm:w-auto",
              })}
            >
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" /> Manage Listings
            </Link>
            <Link
              href="/add-studio"
              className={buttonVariants({
                className:
                  "h-11 w-full justify-center rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 px-5 text-xs font-semibold text-zinc-950 shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:brightness-105 sm:w-auto",
              })}
            >
              <Plus className="mr-1.5 h-4 w-4 stroke-[2.5]" /> List New Studio
            </Link>
          </div>
        </div>

        {/* 2. KPI STATS GRID (4 CARDS) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Booking Value */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur-xl transition-all hover:border-amber-400/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Booking Volume</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-600 dark:text-amber-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">${totalSpentOrEarned.toLocaleString()}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3 w-3" /> Active session value
            </p>
          </div>

          {/* Card 2: Active Studios */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur-xl transition-all hover:border-amber-400/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Listed Studios</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-600 dark:text-amber-400">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">{studios.length}</p>
            <Link href="/my-listings" className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-700 dark:hover:text-amber-300">
              View all stages <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 3: Total Reservations */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur-xl transition-all hover:border-amber-400/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Bookings</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-600 dark:text-amber-400">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">{bookings.length}</p>
            <Link href="/my-bookings" className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-700 dark:hover:text-amber-300">
              Booking history <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Card 4: Pending Requests */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur-xl transition-all hover:border-amber-400/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Sessions</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">{pendingBookingsCount}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-3 w-3" /> Awaiting confirmation
            </p>
          </div>
        </div>

        {/* 3. MAIN CONTENT SPLIT (RECENT BOOKINGS & MY STUDIOS) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column (7 cols): Recent Bookings */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Recent Reservations</h2>
              <Link href="/my-bookings" className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
              {bookings.length === 0 ? (
                <div className="py-12 text-center">
                  <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">No bookings yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Explore soundstages and book your first production.</p>
                  <Link
                    href="/studios"
                    className={buttonVariants({
                      className:
                        "mt-4 h-9 rounded-xl bg-muted text-xs text-foreground hover:bg-amber-400 hover:text-zinc-950",
                    })}
                  >
                    Browse Studios
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:items-center">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="max-w-full truncate text-sm font-semibold text-foreground">{booking.studioTitle}</h3>
                          <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${getStatusBadge(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex min-w-0 items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                            <span className="truncate">{booking.bookingDate}</span>
                          </span>
                          <span className="hidden min-w-0 items-center gap-1 sm:flex">
                            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                            <span className="max-w-[180px] truncate">{booking.studioLocation}</span>
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-foreground">${booking.totalPrice}</p>
                        <span className="text-[10px] text-muted-foreground">#{booking._id.slice(-5)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): My Active Studios */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Your Active Stages</h2>
              <Link href="/my-listings" className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline">
                Manage All
              </Link>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 backdrop-blur-xl">
              {studios.length === 0 ? (
                <div className="py-12 text-center">
                  <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">No studios listed</p>
                  <p className="mt-1 text-xs text-muted-foreground">Monetize your creative space by hosting on StudioSpace.</p>
                  <Link
                    href="/add-studio"
                    className={buttonVariants({
                      className:
                        "mt-4 h-9 rounded-xl bg-amber-400 text-xs font-semibold text-zinc-950",
                    })}
                  >
                    Host Your Space
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {studios.slice(0, 4).map((studio) => (
                    <div
                      key={studio._id}
                      className="flex items-center gap-3.5 rounded-2xl border border-border bg-muted/40 p-3 transition-colors hover:border-border"
                    >
                      <img
                        src={studio.imageUrl}
                        alt={studio.title}
                        className="h-14 w-16 rounded-xl object-cover bg-muted shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {studio.category}
                        </span>
                        <h4 className="truncate text-sm font-bold text-foreground">{studio.title}</h4>
                        <p className="text-xs text-muted-foreground">${studio.hourlyRate}/hr</p>
                      </div>
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground hover:border-amber-400/50 hover:text-amber-700 dark:hover:text-amber-300"
                        title="Edit Studio"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 4. ACCOUNT VERIFICATION BANNER */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-amber-400/20 bg-gradient-to-r from-amber-500/[0.08] via-card to-card p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Verified StudioSpace Member</h3>
              <p className="break-all text-xs text-muted-foreground">
                Your account ({userEmail}) is covered under our $1M Production Liability Guarantee.
              </p>
            </div>
          </div>
          <Link
            href="/studios"
            className={buttonVariants({
              variant: "outline",
              className:
                "rounded-xl border-amber-400/30 bg-amber-400/10 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-400 hover:text-zinc-950",
            })}
          >
            Explore More Stages
          </Link>
        </div>

      </div>
    </div>
  );
}