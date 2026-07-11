import { createBrowserClient } from "@supabase/ssr";

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a mock client if env vars are not properly configured
  if (!url || !key || !url.startsWith("http")) {
    console.warn("Supabase is not properly configured. Auth features will be disabled.");
    // Create with valid placeholder to prevent crashes
    supabaseInstance = createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder_key"
    );
    return supabaseInstance;
  }

  supabaseInstance = createBrowserClient(url, key);
  return supabaseInstance;
}
