'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Inbox, Package, Settings, ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { useAdmin } from './AdminProvider';
import { cx } from './ui';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox, badge: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { email, newEnquiryCount, signOut } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));
  const current = NAV.find((n) => isActive(n.href, n.exact));

  const sidebar = (
    <div className="flex h-full flex-col bg-[#1f1a17] text-stone-300">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#AD8A53] font-editorial text-sm font-semibold text-white">
          K
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Khodal Fashion</p>
          <p className="text-[11px] text-stone-400">Admin panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cx('h-4 w-4', active ? 'text-[#C8A974]' : 'text-stone-400')} />
              <span className="flex-1">{label}</span>
              {badge && newEnquiryCount > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">{newEnquiryCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 text-stone-400" />
          View website
        </a>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4 text-stone-400" />
          Sign out
        </button>
        <p className="truncate px-3 pt-2 text-[11px] text-stone-500" title={email}>
          {email}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-stone-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 shadow-xl">{sidebar}</aside>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute left-[17rem] top-4 rounded-md bg-white/10 p-2 text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-medium text-stone-500">
            Admin <span className="text-stone-300">/</span>{' '}
            <span className="text-stone-900">{current?.label || 'Dashboard'}</span>
          </p>
          <div className="ml-auto flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#AD8A53]/15 text-sm font-semibold uppercase text-[#7a5d30]"
              title={email}
            >
              {email.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
