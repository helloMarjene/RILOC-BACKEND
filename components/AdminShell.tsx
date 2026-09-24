'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';
import Icon from './Icon';

const links = [
  { href: '/dashboard', label: 'Overview', icon: 'dashboard' as const },
  { href: '/dashboard/pages', label: 'Website pages', icon: 'pages' as const },
  { href: '/dashboard/media', label: 'Media library', icon: 'media' as const },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' as const },
];

export default function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const signOut = async () => { await createClient().auth.signOut(); router.replace('/login'); router.refresh(); };
  const pageName = pathname === '/dashboard' ? 'Overview' : pathname.startsWith('/dashboard/pages/') ? 'Edit page' : links.find(link => pathname.startsWith(link.href) && link.href !== '/dashboard')?.label || 'Dashboard';

  return <div className="admin-app">
    <aside className={`admin-sidebar${menuOpen ? ' open' : ''}`}>
      <Link className="admin-brand" href="/dashboard" onClick={() => setMenuOpen(false)}>
        <Image src="/riloc-logo.png" alt="RILOC" width={42} height={42} priority />
        <span><b>RILOC</b><small>Content studio</small></span>
      </Link>
      <div className="nav-caption">Workspace</div>
      <nav className="side-nav" aria-label="Admin navigation">
        {links.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`side-link${pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)) ? ' active' : ''}`}>
          <Icon name={link.icon} />{link.label}
        </Link>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="connection-pill"><span className="connection-dot" />Protected dashboard</div>
        <div className="account-row"><div className="avatar">{email.charAt(0).toUpperCase()}</div><div><strong>{email}</strong><small>Administrator</small></div><button className="logout-button" onClick={signOut} aria-label="Sign out" title="Sign out"><Icon name="logout" width={17} height={17} /></button></div>
      </div>
    </aside>
    <main className="admin-main">
      <header className="topbar">
        <div className="topbar-left"><button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'menu'} width={20} height={20} /></button><div className="breadcrumbs">RILOC <span> / </span><strong>{pageName}</strong></div></div>
        <div className="top-actions"><a href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} target="_blank" rel="noreferrer" className="button"><Icon name="globe" width={16} height={16} /> View website</a></div>
      </header>
      <div className="content-wrap">{children}</div>
    </main>
    {menuOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
  </div>;
}
