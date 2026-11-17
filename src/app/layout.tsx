import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/shared/Footer";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});


export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Find Your Perfect Creative Studio",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book premium photography, podcast, video production, and creative studios with StudioSpace. Find the perfect space to bring your ideas to life.",
  keywords: [
    "StudioSpace",
    "Studio Rental",
    "Photography Studio",
    "Podcast Studio",
    "Video Production Studio",
    "Creative Space Booking",
    "Studio Booking",
  ],
  authors: [{ name: "StudioSpace" }],
  creator: "StudioSpace",
  applicationName: "StudioSpace",
  openGraph: {
    title: "StudioSpace | Find Your Perfect Creative Studio",
    description:
      "Discover, explore, and book creative studios for your next project.",
    siteName: "StudioSpace",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
