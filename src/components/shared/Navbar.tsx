"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Aperture,
  CalendarCheck,
  Heart,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  PlusCircle,
  Store,
  SunMoon,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";


const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Store },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/wishlist", label: "My Wishlist", icon: Heart },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function initials(name?: string | null) {
  if (!name) return "SS";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/* ---------- Theme toggle (Challenge 3) ---------- */
 
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-muted text-muted-foreground transition hover:border-amber-400/60 hover:bg-accent hover:text-accent-foreground"
    >
      <SunMoon size={18} />
    </button>
  );
}


/* ---------- Avatar ---------- */
function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-amber-400 bg-amber-400/10 text-xs font-bold text-amber-500">
      {image && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name ?? "Profile photo"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return <NavbarContent key={pathname} pathname={pathname} />;
}

function NavbarContent({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false); // user dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // hamburger panel
  const menuRef = useRef<HTMLDivElement>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
        setConfirmLogout(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You've been logged out.");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("Couldn't log out. Please try again.");
        },
      },
    });
    setConfirmLogout(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="StudioSpace home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-500">
              <Aperture size={22} />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-foreground">
                Studio<span className="text-amber-400">Space</span>
              </span>
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:block">
                Production Network
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav
            aria-label="Main"
            className="hidden items-center gap-1 rounded-full border border-border bg-muted p-1 lg:flex"
          >
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-card text-card-foreground shadow-sm ring-1 ring-amber-400/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <div
                ref={menuRef}
                className="relative hidden lg:block"
              >
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/5 py-1 pl-1 pr-3 transition hover:border-amber-400"
                >
                  <Avatar name={user.name} image={user.image} />
                  <span className="max-w-[120px] truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full w-72 pt-2">
                    <div
                      role="menu"
                      className="overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl"
                    >
                      <div className="px-3 py-3">
                        <p className="truncate text-sm font-bold text-foreground">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="my-1 h-px bg-border" />
                      {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
                        const active = isActive(pathname, href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                              active
                                ? "bg-amber-400/15 text-amber-600 dark:text-amber-400"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon size={18} />
                            {label}
                          </Link>
                        );
                      })}
                      <div className="my-1 h-px bg-border" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirmLogout(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-amber-300"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border bg-background px-4 pb-5 pt-3 lg:hidden">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      active
                        ? "bg-amber-400/15 text-amber-600 dark:text-amber-400"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="my-3 h-px bg-border" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-2 pb-2">
                  <Avatar name={user.name} image={user.image} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setConfirmLogout(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="rounded-full border border-border py-2.5 text-center text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-amber-400 py-2.5 text-center text-sm font-bold text-black"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Logout confirmation modal (custom modal, no alert()) */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
          >
            <h2 id="logout-title" className="text-lg font-bold text-foreground">
              Log out of StudioSpace?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;ll need to log in again to manage your listings and bookings.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Stay logged in
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-rose-600 px-5 py-2 text-sm font-bold text-white hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}