/* ZERO OS configuration.
   Leave both values empty to run fully offline (data stays on this device).
   To turn on cloud sync, paste your Supabase project URL and the "anon" (public) key.
   NEVER paste the service_role key here — it must stay secret. The anon key is safe in the browser
   because Row Level Security (supabase/schema.sql) stops anyone reading data that isn't theirs. */
window.ZERO_CONFIG = {
  SUPABASE_URL: 'https://hsftapbfywrqtbzefleu.supabase.co',        // e.g. 'https://abcdxyz.supabase.co'
  SUPABASE_ANON_KEY: 'sb_publishable_-GPLS-r9GmXHdz4qnLJ8ng_AnC9bttV',   // e.g. 'eyJhbGciOi...'  (Project Settings → API → anon public)
  VAPID_PUBLIC_KEY: 'BJnLDaI4pAPAwwd7sxikSQgFRiXeGz2LZWBCxm_6dFRN855IN0UHhu4zX0oyM1mC7i1hnbJx9hfd6Xx8VSxEIqw'     // optional: for push alerts when the app is closed (make it with tools/generate-vapid-keys.html)
};
