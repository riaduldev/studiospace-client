"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Password Validation Criteria
  const passwordChecks = useMemo(() => {
    const pwd = formData.password;
    return {
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasMinLength: pwd.length >= 8,
    };
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formError) setFormError(null);
    if (name === "photoURL") setAvatarError(false);

    if (name === "password") {
      if (passwordError) setPasswordError(null);
    }
  };

  const getPasswordValidationMessage = (): string | null => {
    if (!passwordChecks.hasUppercase) return "Password must include at least one uppercase letter (A-Z).";
    if (!passwordChecks.hasLowercase) return "Password must include at least one lowercase letter (a-z).";
    if (!passwordChecks.hasMinLength) return "Password length must be at least 8 characters.";
    return null;
  };

  // Better Auth Email & Password Registration Handler
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setPasswordError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      const msg = "Please fill in your full name and email address.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    const pwdValidationMsg = getPasswordValidationMessage();
    if (pwdValidationMsg) {
      setPasswordError(pwdValidationMsg);
      toast.error(pwdValidationMsg);
      return;
    }

    try {
      setIsSubmitting(true);

      // Better Auth SignUp API Call
      const { error } = await signUp.email({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name,
        image: formData.photoURL || undefined,
      });

      if (error) {
        throw new Error(error.message || "Registration failed. Email may already exist.");
      }

      toast.success("Account created successfully! Redirecting...");
      router.push("/login"); // Requirement: Navigate to Login page
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Better Auth Google Social Login Handler
  const handleGoogleSignIn = async () => {
    setFormError(null);
    try {
      setIsGoogleLoading(true);
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (error) {
        throw new Error(error.message || "Google authentication failed.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google authentication failed.";
      setFormError(message);
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  const hasValidPhotoPreview = (() => {
    try {
      const url = new URL(formData.photoURL);
      return !avatarError && (url.protocol === "http:" || url.protocol === "https:");
    } catch {
      return false;
    }
  })();

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6">
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-300">
            <Camera className="h-3 w-3" />
            <span>StudioSpace Access</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Create Your Account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Join to book or list your creative studios.</p>
        </div>

        {formError && (
          <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <p className="leading-relaxed">{formError}</p>
          </div>
        )}

        {/* Google Social Login Button */}
        <Button
          type="button"
          variant="outline"
          disabled={isGoogleLoading || isSubmitting}
          onClick={handleGoogleSignIn}
          className="h-11 w-full rounded-xl border-border bg-muted/60 text-sm font-medium text-foreground hover:bg-muted"
        >
          {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-600 dark:text-amber-400" /> : "Continue with Google"}
        </Button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-muted" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">or email</span>
          <div className="h-px flex-1 bg-muted" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="register-name" className="text-xs font-medium text-muted-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="register-name" name="name" type="text" autoComplete="name" required placeholder="Riadul Islam" value={formData.name} onChange={handleChange} className="h-11 rounded-xl bg-muted/60 pl-10 text-sm text-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-email" className="text-xs font-medium text-muted-foreground">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="register-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} className="h-11 rounded-xl bg-muted/60 pl-10 text-sm text-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-photo" className="text-xs font-medium text-muted-foreground">Photo URL</Label>
            <div className="relative flex items-center">
              <ImageIcon className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <Input id="register-photo" name="photoURL" type="url" placeholder="https://example.com/avatar.jpg" value={formData.photoURL} onChange={handleChange} className="h-11 rounded-xl bg-muted/60 pl-10 pr-11 text-sm text-foreground" />
              {hasValidPhotoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.photoURL} alt="Preview" onError={() => setAvatarError(true)} className="absolute right-2.5 h-7 w-7 rounded-full border border-amber-400 object-cover" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-xs font-medium text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required placeholder="Secure password" value={formData.password} onChange={handleChange} className="h-11 rounded-xl bg-muted/60 pl-10 pr-10 text-sm text-foreground" />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && <p className="text-xs text-rose-600 dark:text-rose-400">{passwordError}</p>}
            
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
              <ul className="space-y-1">
                <li className={passwordChecks.hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>✓ At least one uppercase letter (A-Z)</li>
                <li className={passwordChecks.hasLowercase ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>✓ At least one lowercase letter (a-z)</li>
                <li className={passwordChecks.hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>✓ Minimum 8 characters</li>
              </ul>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || isGoogleLoading} className="w-full h-11 rounded-xl bg-amber-400 text-zinc-950 font-semibold hover:bg-amber-300">
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="inline-flex min-h-[44px] items-center text-amber-600 dark:text-amber-400 underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}