import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The creative space you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-[#09090B] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.07] blur-[140px]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-3 top-6 z-10 rounded-xl border border-amber-400/30 bg-zinc-950/90 px-4 py-2 shadow-xl shadow-black/30 sm:-left-5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              StudioSpace
            </span>
            <span className="mt-0.5 block text-lg font-bold tracking-widest text-amber-300">
              404
            </span>
          </div>

          <svg
            viewBox="0 0 560 380"
            role="img"
            aria-labelledby="studio-art-title"
            className="h-auto w-full drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title id="studio-art-title">A creative studio set with a camera and lights</title>
            <defs>
              <linearGradient id="studio-room" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#18181b" />
                <stop offset="1" stopColor="#09090b" />
              </linearGradient>
              <linearGradient id="studio-backdrop" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#3f3520" />
                <stop offset="0.55" stopColor="#211d17" />
                <stop offset="1" stopColor="#141416" />
              </linearGradient>
              <radialGradient id="studio-glow">
                <stop stopColor="#fbbf24" stopOpacity=".24" />
                <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect x="18" y="18" width="524" height="344" rx="28" fill="url(#studio-room)" stroke="#ffffff" strokeOpacity=".1" />
            <ellipse cx="288" cy="188" rx="186" ry="144" fill="url(#studio-glow)" />
            <path d="M44 282 280 224l236 58v48H44z" fill="#111114" stroke="#ffffff" strokeOpacity=".08" />
            <path d="M280 224v106M44 282l236 48 236-48" fill="none" stroke="#ffffff" strokeOpacity=".08" />

            <rect x="166" y="66" width="228" height="186" rx="12" fill="url(#studio-backdrop)" stroke="#fbbf24" strokeOpacity=".22" />
            <path d="M190 220c26-42 52-55 90-52 45 4 57 34 88 52v20H190z" fill="#f5c56a" fillOpacity=".12" />
            <ellipse cx="280" cy="252" rx="116" ry="17" fill="#fbbf24" fillOpacity=".08" />

            <g stroke="#c4b8a0" strokeLinecap="round" strokeLinejoin="round">
              <path d="m109 310 30-102 31 102m-31-102v-36m-16 138h32" fill="none" strokeWidth="4" />
              <path d="m117 172 9-27h27l9 27-9 7h-27z" fill="#fbbf24" fillOpacity=".2" stroke="#fbbf24" strokeWidth="3" />
              <path d="m122 179-4 18m35-18 4 18" fill="none" stroke="#fbbf24" strokeWidth="3" />
            </g>

            <g stroke="#c4b8a0" strokeLinecap="round" strokeLinejoin="round">
              <path d="m413 315 28-85 29 85m-29-85v-25m-15 110h30" fill="none" strokeWidth="4" />
              <rect x="410" y="170" width="62" height="38" rx="8" fill="#29292e" stroke="#d4d4d8" strokeWidth="3" />
              <path d="M421 170v-8h20l8 8" fill="#29292e" stroke="#d4d4d8" strokeWidth="3" />
              <circle cx="441" cy="189" r="11" fill="#111114" stroke="#fbbf24" strokeWidth="3" />
              <circle cx="441" cy="189" r="4" fill="#fbbf24" />
            </g>

            <path d="M65 76h42m-21-21v42M465 91h28m-14-14v28" stroke="#fbbf24" strokeOpacity=".55" strokeLinecap="round" strokeWidth="3" />
            <circle cx="456" cy="126" r="3" fill="#fbbf24" />
            <circle cx="115" cy="110" r="2" fill="#fbbf24" />
          </svg>
        </div>

        <div className="mx-auto max-w-lg text-center lg:mx-0 lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
            Out of frame
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            This page missed its cue.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-zinc-400 lg:mx-0 sm:text-base">
            We couldn&apos;t find the creative space you were looking for. It may
            have moved, or the link may be out of date.
          </p>
          <Button
            render={<Link href="/" />}
            className="mt-8 h-12 rounded-xl bg-amber-400 px-6 font-semibold text-zinc-950 shadow-lg shadow-amber-950/20 hover:bg-amber-300"
          >
            <Home aria-hidden="true" className="mr-2 size-4" />
            Return to Home
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
