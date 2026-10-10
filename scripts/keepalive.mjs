import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

try {
  const { data, error } = await supabase.from('articles').select('id').limit(1);

  if (error) {
    console.error('❌ Keep-alive FAILED:', error.message);
    process.exit(1);
  }

  console.log(`✅ Keep-alive OK — ${new Date().toISOString()} — rows returned: ${data?.length ?? 0}`);
} catch (err) {
  console.error('❌ Keep-alive ERROR:', err);
  process.exit(1);
}
