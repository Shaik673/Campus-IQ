"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, Eye, EyeOff, Loader2, GraduationCap, Shield, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleQuickLogin = async (email: string, pass: string, role: string) => {
    setDemoLoading(role);
    setError("");
    setValue("email", email);
    setValue("password", pass);

    const result = await signIn("credentials", {
      email,
      password: pass,
      redirect: false,
    });
    setDemoLoading(null);
    if (result?.error) {
      setError("Demo credentials error. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-cyan-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-bold text-white">CampusIQ</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your intelligent<br />college companion
          </h1>
          <p className="text-blue-200/70 text-lg leading-relaxed">
            Get instant, accurate answers about admissions, courses, fees, scholarships, and everything college through natural conversations.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { label: "Verified Knowledge Entries", value: "100+" },
            { label: "Campus Categories", value: "14" },
            { label: "Avg Response Time", value: "<1.5s" },
            { label: "Retrieval Accuracy", value: "95%+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
              <div className="text-xs text-blue-200/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold text-gradient">CampusIQ</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sign in to CampusIQ</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Access your personalized enquiry dashboard and conversation history.
            </p>
          </div>

          {/* Quick Demo Logins Section */}
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2.5">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              1-Click Instant Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin("demo@campusiq.edu", "demo123", "student")}
                disabled={!!demoLoading}
                className="h-9 text-xs border-blue-500/30 hover:bg-blue-500/10 gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>{demoLoading === "student" ? "Signing In..." : "Demo Student"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin("admin@campusiq.edu", "admin123", "admin")}
                disabled={!!demoLoading}
                className="h-9 text-xs border-violet-500/30 hover:bg-violet-500/10 gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <span>{demoLoading === "admin" ? "Signing In..." : "College Admin"}</span>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@campusiq.edu"
                autoComplete="email"
                {...register("email")}
                className="h-11 text-sm bg-card"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className="h-11 pr-10 text-sm bg-card"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-11 shadow-md shadow-primary/20" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in with Email"
              )}
            </Button>
          </form>

          {/* Continue as Guest Button */}
          <div className="pt-2 border-t border-border/50 text-center space-y-3">
            <Link href="/dashboard" className="w-full block">
              <Button variant="ghost" className="w-full h-10 text-xs text-muted-foreground hover:text-primary gap-1.5">
                <span>Continue as Guest Visitor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create new account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
