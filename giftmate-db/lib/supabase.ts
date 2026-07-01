import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** Shared Supabase client, or null when the catalog should fall back to local data. */
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null;
