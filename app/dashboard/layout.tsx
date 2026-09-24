import { redirect } from 'next/navigation';
import AdminShell from '../../components/AdminShell';
import { createClient } from '../../lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return <main className="setup-card"><span className="eyebrow">Access restricted</span><h1>Administrator access required</h1><p>Your account is signed in but is not listed as a RILOC administrator. Ask the project owner to grant access in Supabase, then sign in again.</p></main>;
  return <AdminShell email={user.email || 'RILOC Admin'}>{children}</AdminShell>;
}
