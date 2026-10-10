"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";

/**
 * Guards the dashboard. Every admin page requires an authenticated
 * administrative account.
 *
 * The session is restored from the HttpOnly refresh cookie on first load, so
 * children stay unmounted until that has settled — rendering them earlier
 * would bounce a signed-in admin to the login screen on every refresh.
 *
 * This is a usability guard, not the security boundary: the API enforces the
 * role on every admin endpoint.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Preserve where the admin was headed so login can return them to it.
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream">
        <Loader2
          size={30}
          className="animate-spin text-olive"
          aria-label="Loading the dashboard"
        />
      </div>
    );
  }

  return <>{children}</>;
}
