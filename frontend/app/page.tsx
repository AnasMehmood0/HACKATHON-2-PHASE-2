import { redirect } from "next/navigation";

/**
 * Root page - redirects to dashboard
 * TODO: After Phase 3 (authentication), redirect to login if not authenticated
 */
export default function Home() {
  // For now, redirect to dashboard
  // TODO: Add auth check in Phase 3 (T030) to redirect to /login if not authenticated
  redirect("/dashboard");
}
