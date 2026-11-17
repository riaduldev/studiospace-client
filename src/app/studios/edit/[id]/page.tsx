"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  DollarSign,
  ShieldCheck,
  Users,
  MapPin,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  Sparkles,
  FileText,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiUrl } from "@/lib/api-url";
import { uploadImageToServer } from "@/lib/uploadHelper";
import { BrandedLoader } from "@/components/shared/loading-state";
import { authClient } from "@/lib/auth-client";

const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Cyclorama Loft",
  "Acoustic Soundstage",
];

const AVAILABLE_AMENITIES = [
  "High-Speed Wi-Fi",
  "Godox Studio Lighting",
  "RGB Ambient Tubes",
  "Makeup & Dressing Room",
  "Acoustic Treatment",
  "Green Screen (Cyclorama)",
  "Chroma Key Backdrop",
  "Wireless Lavalier Mics",
  "4K Cinema Cameras",
  "Lounge & Coffee Bar",
  "Secure Parking",
  "Freight Elevator",
];

export default function EditStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [loadedStudioId, setLoadedStudioId] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [hostInfo, setHostInfo] = useState({ name: "", email: "" });
  const loading = loadedStudioId !== id;

  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0],
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    overview: "",
    imageUrl: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    if (isSessionPending || !userEmail) return;
    const controller = new AbortController();
    let active = true;

    async function loadStudioData() {
      try {
        const response = await fetch(getApiUrl(`/api/my-studios/${id}`), {
          signal: controller.signal,
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data) {
          throw new Error(data?.message || "Failed to load studio details.");
        }

        if (!active || controller.signal.aborted) return;

        setFormData({
          title: data.title || "",
          category: data.category || CATEGORIES[0],
          hourlyRate: data.hourlyRate?.toString() || "",
          securityDeposit: data.securityDeposit?.toString() || "",
          maxCapacity: data.maxCapacity?.toString() || "",
          location: data.location || "",
          overview: data.overview || "",
          imageUrl: data.imageUrl || "",
        });
        setHostInfo({
          name: data.ownerName || "",
          email: data.ownerEmail || "",
        });
        setGalleryImages(
          Array.isArray(data.galleryImages)
            ? data.galleryImages.filter((imageUrl: string) => imageUrl !== data.imageUrl)
            : []
        );
        setSelectedAmenities(data.amenities || []);
        setLoadFailed(false);
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error(error);
          const message =
            error instanceof Error ? error.message : "Error fetching studio data.";
          toast.error(message);
          setLoadFailed(true);
        }
      } finally {
        if (active) setLoadedStudioId(id);
      }
    }

    void loadStudioData();
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, isSessionPending, userEmail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024
    );
    if (invalidFile) {
      toast.error("Choose image files that are 10 MB or smaller.");
      input.value = "";
      return;
    }

    try {
      setIsUploadingImage(true);
      toast.info(`Uploading ${files.length} studio image${files.length > 1 ? "s" : ""}...`);

      const results = await Promise.allSettled(files.map(uploadImageToServer));
      const uploadedUrls = results.flatMap((result) =>
        result.status === "fulfilled" ? [result.value] : []
      );
      const failedCount = results.length - uploadedUrls.length;

      if (uploadedUrls.length > 0) {
        if (formData.imageUrl) {
          setGalleryImages((current) => [...current, ...uploadedUrls]);
        } else {
          setFormData((current) => ({ ...current, imageUrl: uploadedUrls[0] }));
          setGalleryImages((current) => [...current, ...uploadedUrls.slice(1)]);
        }
        toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded.`);
      }
      if (failedCount > 0) {
        toast.error(`${failedCount} image${failedCount > 1 ? "s" : ""} could not be uploaded.`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
      input.value = "";
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.hourlyRate || !formData.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const updatePayload = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        securityDeposit: Number(formData.securityDeposit || 0),
        maxCapacity: Number(formData.maxCapacity || 1),
        amenities: selectedAmenities,
        galleryImages: [formData.imageUrl, ...galleryImages],
      };

      const res = await fetch(getApiUrl(`/api/studios/${id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Studio updated successfully!");
        router.push("/my-listings");
      } else {
        throw new Error(data.message || "Failed to update studio.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSessionPending) {
    return <BrandedLoader message="Checking your account..." />;
  }

  if (!userEmail) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-[#09090B] text-center text-white">
        <p className="text-lg font-medium text-zinc-300">
          Log in to manage your studio listings.
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
    );
  }

  if (loading) {
    return <BrandedLoader message="Loading your studio listing..." />;
  }

  if (loadFailed) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-[#09090B] text-white">
        <p className="text-lg font-medium text-zinc-400">Unable to load this studio listing.</p>
        <Link
          href="/my-listings"
          className={buttonVariants({
            className: "mt-4 bg-amber-400 font-semibold text-zinc-950",
          })}
        >
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient Spotlight Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-amber-500/[0.08] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-4xl rounded-3xl border border-white/[0.1] bg-zinc-950/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-10">
        
        {/* Back Button & Header */}
        <div className="mb-8 border-b border-white/[0.08] pb-6">
          <Link
            href="/my-listings"
            className={buttonVariants({
              variant: "ghost",
              className: "mb-4 h-8 px-2 text-zinc-400 hover:text-white",
            })}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to My Listings
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-amber-300">
            <Sparkles className="h-3 w-3" />
            <span>Host Management</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Edit Studio Listing
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Update your soundstage specifications, pricing, or cover image.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold text-zinc-200">Host Information</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Host identity is read-only and cannot be changed from the listing form.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="hostName" className="text-xs font-medium text-zinc-300">
                Host Name
              </Label>
              <Input
                id="hostName"
                value={hostInfo.name}
                readOnly
                className="h-10 border-white/10 bg-white/[0.03] text-sm text-zinc-400"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hostEmail" className="text-xs font-medium text-zinc-300">
                Host Email
              </Label>
              <Input
                id="hostEmail"
                value={hostInfo.email}
                readOnly
                className="h-10 border-white/10 bg-white/[0.03] text-sm text-zinc-400"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Section 1: General Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              1. General Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="title" className="text-xs font-medium text-zinc-300">
                  Studio Title *
                </Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-sm text-white focus-visible:border-amber-400/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-medium text-zinc-300">
                  Category *
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-950 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-medium text-zinc-300">
                  Location / Address *
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-sm text-white focus-visible:border-amber-400/60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Rates & Capacity */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              2. Rates &amp; Capacity
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="hourlyRate" className="text-xs font-medium text-zinc-300">
                  Hourly Rate ($) *
                </Label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    required
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-sm text-white focus-visible:border-amber-400/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="securityDeposit" className="text-xs font-medium text-zinc-300">
                  Security Deposit ($)
                </Label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-sm text-white focus-visible:border-amber-400/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maxCapacity" className="text-xs font-medium text-zinc-300">
                  Max Crew Capacity
                </Label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="maxCapacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-white/10 bg-white/[0.03] pl-10 text-sm text-white focus-visible:border-amber-400/60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Studio Image */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              3. Studio Image
            </h2>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-zinc-300">
                Update Cover Photo or Add Gallery Photos
              </Label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileChange}
                    disabled={isUploadingImage}
                    className="h-11 cursor-pointer rounded-xl border-white/10 bg-white/[0.03] pl-10 pt-2 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-400 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-zinc-950 hover:file:bg-amber-300"
                  />
                </div>
                {isUploadingImage && (
                  <span className="flex items-center gap-2 text-xs text-amber-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </span>
                )}
              </div>

              <div className="space-y-1 pt-1">
                <Label htmlFor="imageUrl" className="text-[11px] text-zinc-400">
                  Cover image URL:
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-white"
                />
              </div>

              {formData.imageUrl && (
                <div className="relative mt-2 h-48 w-full overflow-hidden rounded-2xl border border-white/15 bg-zinc-900">
                  <img src={formData.imageUrl} alt="Studio cover preview" className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-emerald-500/95 px-3 py-1 text-xs font-semibold text-zinc-950 shadow-lg">
                    Cover image active
                  </span>
                </div>
              )}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {galleryImages.map((galleryImage, index) => (
                    <div
                      key={`${galleryImage}-${index}`}
                      className="group relative h-28 overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
                    >
                      <img src={galleryImage} alt={`Studio gallery image ${index + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label={`Remove gallery image ${index + 1}`}
                        onClick={() =>
                          setGalleryImages((current) =>
                            current.filter((_, imageIndex) => imageIndex !== index)
                          )
                        }
                        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-zinc-950/85 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              4. Amenities &amp; Equipment
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const selected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                      selected
                        ? "border-amber-400/60 bg-amber-400/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                        : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                    }`}
                  >
                    <span>{amenity}</span>
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        selected ? "border-amber-400 bg-amber-400 text-zinc-950" : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Overview */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              5. Detailed Overview
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="overview" className="text-xs font-medium text-zinc-300">
                Description &amp; Specifications
              </Label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                <textarea
                  id="overview"
                  name="overview"
                  rows={4}
                  value={formData.overview}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 pl-10 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting || isUploadingImage}
            className="group h-12 w-full rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-sm font-semibold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_22px_rgba(245,158,11,0.32)] transition-all hover:brightness-105 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Save Studio Changes</span>
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}