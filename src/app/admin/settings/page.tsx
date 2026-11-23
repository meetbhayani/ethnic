'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Card, CardHeader, Field, PageHeader, inputCls } from '@/components/admin/ui';

export default function SettingsPage() {
  const { supabase, email, toast } = useAdmin();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [saving, setSaving] = useState(false);

  const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  const dashboard = projectRef ? `https://supabase.com/dashboard/project/${projectRef}` : 'https://supabase.com/dashboard';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return toast('error', 'Password must be at least 8 characters.');
    if (pw !== pw2) return toast('error', 'Passwords do not match.');
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    if (error) return toast('error', error.message);
    setPw('');
    setPw2('');
    toast('success', 'Password updated.');
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
          <CardHeader title="Change password" description="Use at least 8 characters." />
          <form onSubmit={changePassword} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Field label="New password">
              <input type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Confirm new password">
              <input type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" disabled={saving || !pw}>
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
          <div className="space-y-3 p-5 text-sm text-stone-700">
            <p>To give someone admin access:</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>In Supabase, go to Authentication → Users → Add user (tick “Auto confirm”).</li>
              <li>Copy their User UID.</li>
              <li>
                In the SQL Editor run: <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">insert into admins (user_id) values (&apos;UID&apos;);</code>
              </li>
            </ol>
            <a href={dashboard} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-[#7a5d30] hover:underline">
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
