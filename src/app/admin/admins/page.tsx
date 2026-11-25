'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Copy, Eye, EyeOff, RefreshCw, ShieldCheck, UserMinus, UserPlus } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Card, CardHeader, Field, LoadingBlock, PageHeader, inputCls, timeAgo } from '@/components/admin/ui';
import type { AdminUser } from '@/app/api/admin/users/route';

/** A readable temporary password, e.g. "Kf-7hq2-m9xd". */
function makeTempPassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const s = Array.from(bytes, (b) => chars[b % chars.length]).join('');
  return `Kf-${s.slice(0, 4)}-${s.slice(4)}`;
}

export default function AdminsPage() {
  const { apiFetch, toast, confirm } = useAdmin();
  const [admins, setAdmins] = useState<AdminUser[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(makeTempPassword);
  const [showPw, setShowPw] = useState(true);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string; existed: boolean } | null>(null);

  const load = useCallback(async () => {
    const res = await apiFetch('/api/admin/users');
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoadError(body.error || `Could not load admins (${res.status}).`);
      setAdmins([]);
      return;
    }
    setLoadError(null);
    setAdmins(body.admins);
  }, [apiFetch]);

  useEffect(() => {
    load();
  }, [load]);

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast('error', 'The temporary password must be at least 8 characters.');
    setSaving(true);
    const res = await apiFetch('/api/admin/users', { method: 'POST', body: JSON.stringify({ email, password }) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return toast('error', body.error || 'Could not add the admin.');
    setCreated({ email: email.trim().toLowerCase(), password, existed: !!body.existed });
    setEmail('');
    setPassword(makeTempPassword());
    toast('success', body.existed ? 'Existing account given admin access.' : 'Admin created.');
    load();
  };

  const removeAdmin = async (a: AdminUser) => {
    const ok = await confirm({
      title: `Remove admin access for ${a.email}?`,
      message: 'They will no longer be able to open the admin panel. Their login is kept, so you can add them back later.',
      confirmLabel: 'Remove access',
      danger: true,
    });
    if (!ok) return;
    const res = await apiFetch('/api/admin/users', { method: 'DELETE', body: JSON.stringify({ userId: a.userId }) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast('error', body.error || 'Could not remove access.');
    toast('success', `${a.email} is no longer an admin.`);
    load();
  };

  const copyDetails = async () => {
    if (!created) return;
    const text = `Khodal Fashion admin\n${window.location.origin}/admin\nEmail: ${created.email}\nTemporary password: ${created.password}\nPlease change it in Settings after signing in.`;
    try {
      await navigator.clipboard.writeText(text);
      toast('success', 'Login details copied.');
    } catch {
      toast('error', 'Could not copy. Select the details and copy them manually.');
    }
  };

  return (
    <>
      <PageHeader title="Admins" description="People who can sign in to this admin panel." />

      <div className="grid max-w-4xl grid-cols-1 gap-6">
        <Card>
          <CardHeader title="Add an admin" description="Creates a login with a temporary password. Share it privately; they can change it in Settings." />
          <form onSubmit={addAdmin} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Email" required>
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputCls}
              />
            </Field>
            <Field label="Temporary password" hint="At least 8 characters. A random one is filled in for you.">
              <div className="flex gap-2">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} font-mono`}
                />
                <Button type="button" variant="ghost" className="px-2" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button type="button" variant="ghost" className="px-2" onClick={() => setPassword(makeTempPassword())} aria-label="New random password">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" disabled={saving || !email}>
                <UserPlus className="h-4 w-4" /> {saving ? 'Adding…' : 'Add admin'}
              </Button>
            </div>
          </form>

          {created && (
            <div className="mx-5 mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
              {created.existed ? (
                <p className="text-emerald-900">
                  <strong>{created.email}</strong> already had a login, so it was given admin access. They sign in with their
                  existing password (the temporary one was not applied).
                </p>
              ) : (
                <>
                  <p className="font-medium text-emerald-900">Admin created. Send these details privately:</p>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs text-emerald-900">
                    <dt className="text-emerald-700">Email</dt>
                    <dd>{created.email}</dd>
                    <dt className="text-emerald-700">Password</dt>
                    <dd>{created.password}</dd>
                  </dl>
                  <p className="mt-2 text-xs text-emerald-800">This password is shown only once. Ask them to change it in Settings after signing in.</p>
                  <Button type="button" className="mt-3" onClick={copyDetails}>
                    <Copy className="h-4 w-4" /> Copy login details
                  </Button>
                </>
              )}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Current admins" description={admins ? `${admins.length} admin${admins.length === 1 ? '' : 's'}` : undefined} />
          {admins === null ? (
            <LoadingBlock />
          ) : loadError ? (
            <p className="p-5 text-sm text-red-700">{loadError}</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {admins.map((a) => (
                <li key={a.userId} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4EFE6] text-sm font-semibold uppercase text-[#7a5d30]">
                    {a.email.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {a.email}
                      {a.isYou && <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-xs font-normal text-stone-600">You</span>}
                    </p>
                    <p className="text-xs text-stone-500">
                      Admin since {new Date(a.createdAt).toLocaleDateString()} ·{' '}
                      {a.lastSignInAt ? `last signed in ${timeAgo(a.lastSignInAt)}` : 'has not signed in yet'}
                    </p>
                  </div>
                  {a.isYou ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-600" aria-label="Your account" />
                  ) : (
                    <Button type="button" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => removeAdmin(a)}>
                      <UserMinus className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
