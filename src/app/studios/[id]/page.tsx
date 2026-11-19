"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Users,
  ShieldCheck,
  Star,
  Calendar,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { BrandedLoader } from "@/components/shared/loading-state";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudioReview {
  _id?: string;
  reviewerName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  galleryImages?: string[];
  overview?: string;
  amenities?: string[];
  ownerName: string;
  ownerEmail: string;
  rating?: number;
  reviews?: StudioReview[];
}

interface UserBooking {
  _id: string;
  studioId?: string;
  bookingDate: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

function findActiveBooking(bookings: UserBooking[], studioId: string) {
  return (
    bookings.find(
      (booking) =>
        booking.studioId === studioId &&
        (booking.status === "Pending" || booking.status === "Confirmed"),
    ) ?? null
  );
}

export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email;
  const sessionToken = session?.session?.token;

  const [studioResult, setStudioResult] = useState<{
    id: string;
    studio: Studio | null;
  } | null>(null);
  const loading = studioResult?.id !== id;
  const studio = studioResult?.id === id ? studioResult.studio : null;
  const [bookingDate, setBookingDate] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingCheck, setBookingCheck] = useState<{
    email: string;
    booking: UserBooking | null;
  } | null>(null);
  const existingBooking =
    bookingCheck && userEmail && bookingCheck.email === userEmail
      ? bookingCheck.booking
      : null;
  const isCheckingExistingBooking =
    Boolean(userEmail) &&
    !isSessionPending &&
    bookingCheck?.email !== userEmail;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadStudio() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`,
          {
            signal: controller.signal,
          },
        );
        const data = await response.json();

        if (!response.ok || !data) {
          throw new Error(data?.message || "Failed to load studio details.");
        }

        if (active) setStudioResult({ id, studio: data });
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error(error);
          const message =
            error instanceof Error
              ? error.message
              : "Network error while loading studio.";
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

  useEffect(() => {
    if (isSessionPending || !userEmail) return;

    const email = userEmail;
    const controller = new AbortController();
    let active = true;
    const headers = sessionToken
      ? { Authorization: `Bearer ${sessionToken}` }
      : undefined;

    async function loadExistingBooking() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
          {
            signal: controller.signal,
            credentials: "include",
            headers,
          },
        );
        const data = await response.json().catch(() => null);

        if (!response.ok || !Array.isArray(data)) {
          if (active) setBookingCheck({ email, booking: null });
          return;
        }

        const activeBooking = findActiveBooking(data, id);

        if (active) setBookingCheck({ email, booking: activeBooking });
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error("Failed to check existing bookings:", error);
          setBookingCheck({ email, booking: null });
        }
      }
    }

    void loadExistingBooking();
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, isSessionPending, userEmail, sessionToken]);

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

    if (existingBooking) {
      toast.error(
        `You already have a ${existingBooking.status.toLowerCase()} booking for this studio on ${existingBooking.bookingDate}.`,
      );
      setIsBookingOpen(false);
      return;
    }

    if (isCheckingExistingBooking) {
      toast.error(
        "Still checking your existing bookings. Please try again in a moment.",
      );
      return;
    }

    try {
      setIsBookingSubmitting(true);

      try {
        const checkResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
          {
            credentials: "include",
            headers: sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : undefined,
          },
        );
        const checkData = await checkResponse.json().catch(() => null);

        if (checkResponse.ok && Array.isArray(checkData)) {
          const duplicate = findActiveBooking(checkData, id);

          if (duplicate) {
            if (user.email) {
              setBookingCheck({ email: user.email, booking: duplicate });
            }
            toast.error(
              `You already have a ${duplicate.status.toLowerCase()} booking for this studio on ${duplicate.bookingDate}.`,
            );
            setIsBookingOpen(false);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to re-check existing bookings:", error);
      }

      const bookingPayload = { studioId: studio?._id, bookingDate };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : {}),
          },
          credentials: "include",
          body: JSON.stringify(bookingPayload),
        },
      );

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        toast.success("Booking request submitted successfully!");
        setIsBookingOpen(false);
        router.push("/my-bookings");
      } else {
        throw new Error(data?.message || "Failed to submit booking.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  if (loading) {
    return <BrandedLoader message="Loading studio details..." />;
  }

  if (!studio) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] bg-background text-foreground">
        <p className="text-lg font-medium text-muted-foreground">
          Studio not found.
        </p>
        <Link
          href="/studios"
          className={buttonVariants({
            className: "mt-4 bg-amber-400 text-zinc-950 font-semibold",
          })}
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const galleryImages = [
    ...new Set(
      [studio.imageUrl, ...(studio.galleryImages ?? [])].filter(Boolean),
    ),
  ];
  const currentImage =
    galleryImages[activeImageIndex % galleryImages.length] || studio.imageUrl;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/studios"
          className={buttonVariants({
            variant: "ghost",
            className: "mb-6 text-muted-foreground hover:text-foreground",
          })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Studios
        </Link>

        {/* Studio photo gallery */}
        <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-border bg-muted sm:h-[400px]">
          <img
            src={currentImage}
            alt={`${studio.title} studio photo ${activeImageIndex + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0">
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                {studio.category}
              </span>
              <h1 className="mt-3 line-clamp-2 break-words text-2xl font-bold text-white sm:text-4xl">
                {studio.title}
              </h1>
              <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-zinc-300">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                <span className="truncate">{studio.location}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-zinc-950/80 p-4 backdrop-blur-xl">
              <span className="text-xs text-zinc-400">Rate</span>
              <p className="text-2xl font-bold text-amber-400">
                ${studio.hourlyRate}
                <span className="text-xs font-normal text-zinc-400">/hr</span>
              </p>
            </div>
          </div>
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Show previous studio photo"
                onClick={() =>
                  setActiveImageIndex(
                    (index) =>
                      (index - 1 + galleryImages.length) % galleryImages.length,
                  )
                }
                className="absolute left-4 top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-zinc-950/70 text-white backdrop-blur transition hover:bg-zinc-950 sm:grid"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Show next studio photo"
                onClick={() =>
                  setActiveImageIndex(
                    (index) => (index + 1) % galleryImages.length,
                  )
                }
                className="absolute right-4 top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-zinc-950/70 text-white backdrop-blur transition hover:bg-zinc-950 sm:grid"
              >
                <ChevronRight className="size-5" />
              </button>
              <span
                aria-live="polite"
                className="absolute right-5 top-5 z-20 rounded-full border border-white/20 bg-zinc-950/75 px-3 py-1 text-xs font-medium text-white backdrop-blur"
              >
                {(activeImageIndex % galleryImages.length) + 1} /{" "}
                {galleryImages.length}
              </span>
            </>
          )}
        </div>
        {galleryImages.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Show studio photo ${index + 1}`}
                aria-pressed={index === activeImageIndex % galleryImages.length}
                onClick={() => setActiveImageIndex(index)}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition ${
                  index === activeImageIndex % galleryImages.length
                    ? "border-amber-400"
                    : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
              <div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />{" "}
                  Security Deposit
                </span>
                <p className="mt-1 text-base font-bold text-foreground">
                  ${studio.securityDeposit}
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />{" "}
                  Max Capacity
                </span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {studio.maxCapacity} Crew
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />{" "}
                  Rating
                </span>
                <p className="mt-1 text-base font-bold text-foreground">
                  {studio.rating || "New Studio"}
                </p>
              </div>
            </div>

            {/* Overview */}
            {studio.overview && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-foreground">
                  About This Studio
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {studio.overview}
                </p>
              </div>
            )}

            {/* Amenities */}
            {studio.amenities && studio.amenities.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-foreground">
                  Included Amenities & Equipment
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {studio.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span className="min-w-0 break-words">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Info */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Hosted By
              </span>
              <p className="mt-1 text-base font-bold text-foreground">
                {studio.ownerName}
              </p>
              <p className="break-all text-xs text-muted-foreground">
                {studio.ownerEmail}
              </p>
            </div>

            <section
              className="space-y-4"
              aria-labelledby="studio-reviews-heading"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="studio-reviews-heading"
                  className="text-lg font-bold text-foreground"
                >
                  Creator Reviews
                </h2>
                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <Star className="size-4 fill-current" />
                  {typeof studio.rating === "number" && studio.rating > 0
                    ? studio.rating.toFixed(1)
                    : "New"}
                </span>
              </div>
              {studio.reviews?.length ? (
                <div className="space-y-3">
                  {studio.reviews.map((review, index) => (
                    <article
                      key={review._id ?? `${review.reviewerName}-${index}`}
                      className="rounded-2xl border border-border bg-card p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="min-w-0 break-words font-semibold text-foreground">
                          {review.reviewerName || "StudioSpace creator"}
                        </p>
                        <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                          <Star className="size-3.5 fill-current" />
                          {review.rating}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
                  No reviews yet. Book a session and be among the first to share
                  feedback.
                </div>
              )}
            </section>
          </div>

          {/* Booking call to action */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-2xl lg:sticky lg:top-24">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Reserve this space
              </span>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                {studio.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                ${studio.hourlyRate}/hour · Four-hour session estimate
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">Estimated total</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  ${studio.hourlyRate * 4 + studio.securityDeposit}
                </span>
              </div>
              <Button
                type="button"
                disabled={
                  isSessionPending ||
                  isCheckingExistingBooking ||
                  Boolean(existingBooking)
                }
                onClick={() => {
                  if (!user) {
                    toast.error("Please log in to book a studio session.");
                    router.push("/login");
                    return;
                  }
                  if (existingBooking) {
                    toast.error(
                      `You already have a ${existingBooking.status.toLowerCase()} booking for this studio on ${existingBooking.bookingDate}.`,
                    );
                    return;
                  }
                  setIsBookingOpen(true);
                }}
                className="mt-5 h-12 w-full rounded-xl bg-amber-400 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
              >
                {existingBooking ? (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Already Booked
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 size-4" />
                    {isCheckingExistingBooking
                      ? "Checking your bookings..."
                      : "Book Workspace Now"}
                  </>
                )}
              </Button>
              {existingBooking && (
                <p className="mt-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                  You already have a {existingBooking.status.toLowerCase()}{" "}
                  booking for this studio on {existingBooking.bookingDate}.{" "}
                  <Link
                    href="/my-bookings"
                    className="font-semibold underline underline-offset-2"
                  >
                    Manage booking
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] border border-border bg-card p-6 text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Book Workspace Now
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose a date to request a four-hour session at {studio.title}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="bookingDate"
                className="text-xs font-medium text-muted-foreground"
              >
                Booking Date *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="bookingDate"
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  className="h-11 rounded-xl border-border bg-muted/60 pl-10 text-sm text-foreground"
                />
              </div>
            </div>
            <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
              <div className="flex justify-between gap-3 text-muted-foreground">
                <span className="min-w-0">
                  Four hours at ${studio.hourlyRate}/hr
                </span>
                <span className="shrink-0">${studio.hourlyRate * 4}</span>
              </div>
              <div className="flex justify-between gap-3 text-muted-foreground">
                <span className="min-w-0">Refundable security deposit</span>
                <span className="shrink-0">${studio.securityDeposit}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-border pt-3 font-semibold text-foreground">
                <span>Estimated total</span>
                <span className="text-amber-600 dark:text-amber-400">
                  ${studio.hourlyRate * 4 + studio.securityDeposit}
                </span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isBookingSubmitting}
              className="h-12 w-full rounded-xl bg-amber-400 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
            >
              {isBookingSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending booking request...
                </>
              ) : (
                "Confirm Booking Request"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
