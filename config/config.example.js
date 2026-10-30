/* ZERO OS configuration.
   Leave both values empty to run fully offline (data stays on this device).
   To turn on cloud sync, paste your Supabase project URL and the "anon" (public) key.
   NEVER paste the service_role key here — it must stay secret. The anon key is safe in the browser
   because Row Level Security (supabase/schema.sql) stops anyone reading data that isn't theirs. */
window.ZERO_CONFIG = {
  SUPABASE_URL: '',        // e.g. 'https://abcdxyz.supabase.co'
  SUPABASE_ANON_KEY: '',   // e.g. 'eyJhbGciOi...'  (Project Settings → API → anon public)
  VAPID_PUBLIC_KEY: ''     // optional: for push alerts when the app is closed (make it with tools/generate-vapid-keys.html)
};
