import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
  || "https://jdzeypwvcggtruprcqrc.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_O8KTeZaPWPkTRDe5-YlAVA_ulm-fUZW";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  church: string;
  city: string;
  dietary: string;
  transport: boolean;
  attended: boolean;
  timestamp: string;
}
