// Lightweight keep-alive ping for Supabase free-tier project.
// Performs both READ and WRITE (UPSERT) operations on PostgreSQL via PostgREST
// to guarantee active database metrics and prevent inactivity pausing.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

try {
  // 1. READ: Fetch the current keepalive record
  const getRes = await fetch(`${supabaseUrl}/rest/v1/_keepalive?id=eq.heartbeat&select=*`, {
    headers,
  });

  let currentPingCount = 0;
  if (getRes.ok) {
    const records = await getRes.json();
    if (records.length > 0 && typeof records[0].ping_count === 'number') {
      currentPingCount = records[0].ping_count;
    }
  }

  const nextPingCount = currentPingCount + 1;
  const nowIso = new Date().toISOString();

  // 2. WRITE (UPSERT): Update heartbeat timestamp and increment ping_count
  const upsertRes = await fetch(`${supabaseUrl}/rest/v1/_keepalive`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      id: 'heartbeat',
      updated_at: nowIso,
      ping_count: nextPingCount,
    }),
  });

  if (!upsertRes.ok) {
    const text = await upsertRes.text();
    console.error(`❌ Keep-alive UPSERT FAILED (HTTP ${upsertRes.status}):`, text);
    process.exit(1);
  }

  const updatedRecords = await upsertRes.json();

  // 3. READ: Also perform light query on public tables (articles)
  const articlesRes = await fetch(`${supabaseUrl}/rest/v1/articles?select=id&limit=1`, {
    headers,
  });

  console.log(
    `✅ Keep-alive OK — ${nowIso} — ping_count: ${nextPingCount} (heartbeat: ${updatedRecords?.[0]?.updated_at ?? nowIso}, articles status: ${articlesRes.status})`
  );
} catch (err) {
  console.error('❌ Keep-alive ERROR:', err);
  process.exit(1);
}
