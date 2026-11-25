'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Users } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Card, CardHeader, Field, PageHeader, inputCls } from '@/components/admin/ui';

export default function SettingsPage() {
  const { supabase, email, toast } = useAdmin();
  const [current, setCurrent] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [saving, setSaving] = useState(false);

  const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  const dashboard = projectRef ? `https://supabase.com/dashboard/project/${projectRef}` : 'https://supabase.com/dashboard';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return toast('error', 'Enter your current password.');
    if (pw.length < 8) return toast('error', 'New password must be at least 8 characters.');
    if (pw !== pw2) return toast('error', 'New passwords do not match.');
    if (pw === current) return toast('error', 'Choose a password different from your current one.');
    setSaving(true);
    // Confirm the current password first, so an unattended signed-in screen can't be used to change it.
    const { error: checkErr } = await supabase.auth.signInWithPassword({ email, password: current });
    if (checkErr) {
      setSaving(false);
      return toast('error', 'Your current password is incorrect.');
    }
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    if (error) return toast('error', error.message);
    setCurrent('');
    setPw('');
    setPw2('');
    toast('success', 'Password updated. Use the new password next time you sign in.');
  };

  return (
    <>
      <PageHeader title="Settings" description="Your account and site configuration." />

      <div className="grid max-w-4xl grid-cols-1 gap-6">
        <Card>
          <CardHeader title="Your account" />
          <div className="p-5 text-sm">
            <p className="text-stone-500">Signed in as</p>
            <p className="font-medium text-stone-900">{email}</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Change password" description="Use at least 8 characters. Forgot it? Sign out and use “Forgot password?” on the sign-in screen." />
          <form onSubmit={changePassword} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="Current password" className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
              <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} />
            </Field>
            <Field label="New password">
              <input type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Confirm new password">
              <input type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" disabled={saving || !pw || !current}>
                {saving ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader title="Site configuration" description="Set in environment variables (.env.local locally, Vercel → Settings → Environment Variables in production)." />
          <dl className="divide-y divide-stone-100 text-sm">
            <ConfigRow label="WhatsApp number" value={whatsapp || 'Not set — using placeholder number!'} warn={!whatsapp} envName="NEXT_PUBLIC_WHATSAPP_NUMBER" />
            <ConfigRow label="Database" value={projectRef ? `Supabase project ${projectRef}` : 'Not configured'} warn={!projectRef} envName="NEXT_PUBLIC_SUPABASE_URL" />
            <ConfigRow
              label="Enquiry email alerts"
              value="Enabled when RESEND_API_KEY and ENQUIRY_ALERT_EMAIL are set on the server"
              envName="RESEND_API_KEY"
            />
          </dl>
        </Card>

        <Card>
          <CardHeader title="Team access" />
          <div className="flex flex-col gap-3 p-5 text-sm text-stone-700 sm:flex-row sm:items-center sm:justify-between">
            <p>Add or remove the people who can use this admin panel.</p>
            <Link
              href="/admin/admins"
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
            >
              <Users className="h-4 w-4" /> Manage admins
            </Link>
          </div>
          <div className="border-t border-stone-100 px-5 py-3">
            <a href={dashboard} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7a5d30] hover:underline">
              Open Supabase dashboard <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </Card>
      </div>
    </>
  );
}

function ConfigRow({ label, value, envName, warn }: { label: string; value: string; envName: string; warn?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className="sm:col-span-2">
        <p className={warn ? 'font-medium text-amber-700' : 'text-stone-900'}>{value}</p>
        <p className="font-mono text-xs text-stone-400">{envName}</p>
      </dd>
    </div>
  );
}
