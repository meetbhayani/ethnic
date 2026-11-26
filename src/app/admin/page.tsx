'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Inbox, Package, PackageCheck, TrendingUp, Plus, ArrowRight, ExternalLink, Sparkles, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import {
  ButtonLink,
  Card,
  CardHeader,
  EmptyState,
  ENQUIRY_STATUSES,
  ENQUIRY_TYPE_LABELS,
  LoadingBlock,
  PageHeader,
  STATUS_META,
  StatusBadge,
  timeAgo,
  cx,
} from '@/components/admin/ui';
import { CustomerEnquiry } from '@/types';

interface EnquiryLite {
  id: string;
  created_at: string;
  status: CustomerEnquiry['status'];
  enquiry_type: CustomerEnquiry['enquiryType'];
  business_name: string;
  contact_person: string;
  product_code: string | null;
}

interface FabricLite {
  id: string;
  is_published: boolean;
  ready_stock: boolean;
  featured: boolean;
}

interface TryonDay {
  day: string;
  previews: number;
  failures: number;
  warned_at: string | null;
  limit_hit_at: string | null;
}

const DAY = 24 * 60 * 60 * 1000;
// Keep in sync with ESTIMATED_DAILY_PREVIEWS in src/lib/tryon-usage.ts
const TRYON_DAILY_ESTIMATE = 60;

export default function DashboardPage() {
  const { supabase, toast } = useAdmin();
  const [enquiries, setEnquiries] = useState<EnquiryLite[] | null>(null);
  const [fabrics, setFabrics] = useState<FabricLite[]>([]);
  const [tryon, setTryon] = useState<TryonDay[] | null>(null);

  const load = useCallback(async () => {
    // Try-on usage is optional (table comes from migrations/20261129_tryon_usage.sql).
    supabase
      .from('tryon_usage')
      .select('day, previews, failures, warned_at, limit_hit_at')
      .order('day', { ascending: false })
      .limit(7)
      .then(({ data, error }) => setTryon(error ? null : ((data as TryonDay[]) || [])));

    const [e, f] = await Promise.all([
      supabase
        .from('enquiries')
        .select('id, created_at, status, enquiry_type, business_name, contact_person, product_code')
        .order('created_at', { ascending: false })
        .limit(1000),
      supabase.from('fabrics').select('id, is_published, ready_stock, featured'),
    ]);
    if (e.error || f.error) toast('error', `Could not load dashboard: ${(e.error || f.error)?.message}`);
    setEnquiries((e.data as EnquiryLite[]) || []);
    setFabrics((f.data as FabricLite[]) || []);
  }, [supabase, toast]);

  useEffect(() => {
    load();
  }, [load]);

  if (!enquiries) return <LoadingBlock label="Loading dashboard…" />;

  const now = Date.now();
  const last30 = enquiries.filter((e) => now - new Date(e.created_at).getTime() < 30 * DAY).length;
  const prev30 = enquiries.filter((e) => {
    const age = now - new Date(e.created_at).getTime();
    return age >= 30 * DAY && age < 60 * DAY;
  }).length;
  const trend = prev30 === 0 ? null : Math.round(((last30 - prev30) / prev30) * 100);
  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const published = fabrics.filter((f) => f.is_published).length;
  const ready = fabrics.filter((f) => f.ready_stock && f.is_published).length;

  const byType = Object.entries(ENQUIRY_TYPE_LABELS).map(([type, label]) => ({
    label,
    count: enquiries.filter((e) => e.enquiry_type === type).length,
  }));
  const maxType = Math.max(1, ...byType.map((t) => t.count));

  const todayUtc = new Date().toISOString().slice(0, 10);
  const tryonToday = tryon?.find((d) => d.day === todayUtc) || null;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of enquiries and catalogue."
        actions={
          <>
            <ButtonLink href="/" target="_blank" variant="secondary">
              <ExternalLink className="h-4 w-4" /> View website
            </ButtonLink>
            <ButtonLink href="/admin/products/new" variant="primary">
              <Plus className="h-4 w-4" /> Add product
            </ButtonLink>
          </>
        }
      />

      {/* AI Try-On allowance alert */}
      {tryonToday?.limit_hit_at ? (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">AI Try-On is paused for today — the free Cloudflare allowance is used up.</p>
            <p className="mt-0.5">
              {tryonToday.previews} previews were made today. Visitors are asked to contact you on WhatsApp instead.
              Previews restart automatically at 5:30 AM IST. Nothing is charged.
            </p>
          </div>
        </div>
      ) : tryonToday?.warned_at ? (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">AI Try-On is running low today.</p>
            <p className="mt-0.5">
              {tryonToday.previews} of about {TRYON_DAILY_ESTIMATE} free previews used. If the allowance runs out, previews pause until 5:30 AM IST.
            </p>
          </div>
        </div>
      ) : null}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          href="/admin/enquiries?status=new"
          icon={<Inbox className="h-5 w-5" />}
          label="New enquiries"
          value={newCount}
          sub={newCount ? 'Awaiting first response' : 'All caught up'}
          tone={newCount ? 'alert' : 'default'}
        />
        <StatCard
          href="/admin/enquiries"
          icon={<TrendingUp className="h-5 w-5" />}
          label="Enquiries (last 30 days)"
          value={last30}
          sub={trend === null ? `${prev30} in the 30 days before` : `${trend >= 0 ? '+' : ''}${trend}% vs previous 30 days`}
        />
        <StatCard
          href="/admin/products"
          icon={<Package className="h-5 w-5" />}
          label="Published products"
          value={published}
          sub={`${fabrics.length - published} hidden • ${fabrics.length} total`}
        />
        <StatCard
          href="/admin/products"
          icon={<PackageCheck className="h-5 w-5" />}
          label="Ready stock"
          value={ready}
          sub={`${published - ready} made to order`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent enquiries */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Recent enquiries"
            description="Latest submissions from the website forms."
            action={
              <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-medium text-[#7a5d30] hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {enquiries.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-5 w-5" />}
              title="No enquiries yet"
              description="When buyers submit a form on the website, it will show up here."
            />
          ) : (
            <ul className="divide-y divide-stone-100">
              {enquiries.slice(0, 8).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries?id=${e.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-stone-50">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-900">{e.business_name}</p>
                      <p className="truncate text-xs text-stone-500">
                        {e.contact_person} • {ENQUIRY_TYPE_LABELS[e.enquiry_type]}
                        {e.product_code ? ` • ${e.product_code}` : ''}
                      </p>
                    </div>
                    <StatusBadge status={e.status} />
                    <span className="hidden w-24 text-right text-xs text-stone-500 sm:block">{timeAgo(e.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          {/* AI Try-On usage */}
          {tryon && (
            <Card>
              <CardHeader
                title="AI Try-On usage"
                description={`Free Cloudflare allowance ≈ ${TRYON_DAILY_ESTIMATE} previews/day, resets 5:30 AM IST.`}
              />
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span
                    className={cx(
                      'rounded-md p-2',
                      tryonToday?.limit_hit_at ? 'bg-rose-50 text-rose-600' : tryonToday?.warned_at ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-600'
                    )}
                  >
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold tabular-nums">
                      {tryonToday?.previews ?? 0}
                      <span className="text-base font-normal text-stone-500"> / ~{TRYON_DAILY_ESTIMATE} today</span>
                    </p>
                    <p className="text-xs text-stone-500">
                      {tryonToday?.limit_hit_at ? 'Allowance used up — paused until tomorrow' : 'Previews available'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-stone-100">
                  <div
                    className={cx('h-2 rounded-full', tryonToday?.limit_hit_at ? 'bg-rose-500' : tryonToday?.warned_at ? 'bg-amber-500' : 'bg-[#AD8A53]')}
                    style={{ width: `${tryonToday?.limit_hit_at ? 100 : Math.min(100, ((tryonToday?.previews ?? 0) / TRYON_DAILY_ESTIMATE) * 100)}%` }}
                  />
                </div>
                {tryon.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm">
                    {tryon.map((d) => (
                      <li key={d.day} className="flex justify-between text-stone-600">
                        <span>{new Date(`${d.day}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })}</span>
                        <span className="tabular-nums">
                          {d.previews} previews{d.limit_hit_at ? ' • limit reached' : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          )}

          {/* Pipeline */}
          <Card>
            <CardHeader title="Enquiry pipeline" description="All enquiries by status." />
            <ul className="space-y-2 p-5">
              {ENQUIRY_STATUSES.map((s) => {
                const count = enquiries.filter((e) => e.status === s).length;
                return (
                  <li key={s}>
                    <Link href={`/admin/enquiries?status=${s}`} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-stone-50">
                      <span className="flex items-center gap-2">
                        <span className={cx('h-2 w-2 rounded-full ring-2 ring-inset', STATUS_META[s].cls)} />
                        {STATUS_META[s].label}
                      </span>
                      <span className="font-semibold tabular-nums">{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* By type */}
          <Card>
            <CardHeader title="Enquiry types" />
            <ul className="space-y-3 p-5">
              {byType.map((t) => (
                <li key={t.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-stone-700">{t.label}</span>
                    <span className="font-semibold tabular-nums">{t.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100">
                    <div className="h-2 rounded-full bg-[#AD8A53]" style={{ width: `${(t.count / maxType) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function StatCard({
  href,
  icon,
  label,
  value,
  sub,
  tone = 'default',
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  tone?: 'default' | 'alert';
}) {
  return (
    <Link href={href} className="group">
      <Card className={cx('p-5 transition-shadow group-hover:shadow-md', tone === 'alert' && 'border-rose-200')}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <span className={cx('rounded-md p-2', tone === 'alert' ? 'bg-rose-50 text-rose-600' : 'bg-stone-100 text-stone-600')}>
            {icon}
          </span>
        </div>
        <p className={cx('mt-3 text-3xl font-semibold tabular-nums', tone === 'alert' ? 'text-rose-600' : 'text-stone-900')}>
          {value}
        </p>
        <p className="mt-1 text-xs text-stone-500">{sub}</p>
      </Card>
    </Link>
  );
}
