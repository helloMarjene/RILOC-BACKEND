import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import pages from '../data/initial-content.json';

loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminUserId = process.env.SUPABASE_ADMIN_USER_ID;
if (!url || !serviceKey || !adminUserId) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, and SUPABASE_ADMIN_USER_ID in .env.local first.');
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const { error: profileError } = await supabase.from('profiles').upsert({ id: adminUserId, role: 'admin' });
if (profileError) throw profileError;
const { error: pagesError } = await supabase.from('page_content').upsert(pages, { onConflict: 'id' });
if (pagesError) throw pagesError;
console.log(`Seeded ${pages.length} pages and granted dashboard access to ${adminUserId}.`);
