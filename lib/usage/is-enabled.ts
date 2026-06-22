import { isClerkConfigured } from "@/lib/clerk/is-configured";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export function isUsageLimitsEnabled(): boolean {
  return isClerkConfigured() && isSupabaseConfigured();
}
