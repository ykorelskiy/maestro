// Lightweight keep-alive ping for Supabase free-tier project.
// Uses raw fetch to the PostgREST endpoint — no npm dependencies needed.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

try {
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=id&limit=1`, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Keep-alive FAILED (HTTP ${res.status}):`, text);
    process.exit(1);
  }

  const data = await res.json();
  console.log(`✅ Keep-alive OK — ${new Date().toISOString()} — rows returned: ${data?.length ?? 0}`);
} catch (err) {
  console.error('❌ Keep-alive ERROR:', err);
  process.exit(1);
}
