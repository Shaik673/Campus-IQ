import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import Link from "next/link";
import { Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Support guest experience without blocking access
  const isGuest = !session?.user;
  const currentUser = session?.user ?? {
    id: "guest",
    name: "Guest Explorer",
    email: "guest@campusiq.edu",
    role: "GUEST",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar user={currentUser} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border shrink-0 bg-sidebar">
          <MobileNav user={currentUser} />
          {isGuest && (
            <Link href="/login">
              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Guest Notification Banner */}
        {isGuest && (
          <div className="hidden md:flex items-center justify-between px-6 py-2 bg-gradient-to-r from-blue-900/30 via-navy-900/40 to-indigo-900/30 border-b border-blue-500/20 text-xs text-blue-200 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>
                <strong>Guest Mode:</strong> You are browsing public FAQs and testing the AI assistant. Sign in for persistent multi-device history and admin controls.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost" className="h-6 text-xs text-cyan-300 hover:text-white hover:bg-cyan-500/20 px-2.5">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
