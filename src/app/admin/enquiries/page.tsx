'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Inbox, Search, Download, X, Phone, Mail, MessageCircle, Trash2, RefreshCw } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import {
  Button,
  Card,
  EmptyState,
  ENQUIRY_STATUSES,
  ENQUIRY_TYPE_LABELS,
  LoadingBlock,
  PageHeader,
  STATUS_META,
  StatusBadge,
  formatDateTime,
  inputCls,
  timeAgo,
  waNumber,
  cx,
} from '@/components/admin/ui';
import { CustomerEnquiry } from '@/types';

interface Enquiry {
  id: string;
  created_at: string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string | null;
  product_code: string | null;
  product_name: string | null;
  quantity: string | null;
  enquiry_type: CustomerEnquiry['enquiryType'];
  notes: string | null;
  source_page: string | null;
  status: CustomerEnquiry['status'];
  admin_notes: string | null;
}

const PAGE_SIZE = 20;

export default function EnquiriesPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <EnquiriesContent />
    </Suspense>
  );
}

function EnquiriesContent() {
  const { supabase, toast, confirm, refreshCounts } = useAdmin();
  const router = useRouter();
  const params = useSearchParams();
  const statusFilter = params.get('status') || 'all';
  const openId = params.get('id');

  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setRefreshing(true);
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(2000);
    setRefreshing(false);
    if (error) return toast('error', `Could not load enquiries: ${error.message}`);
    setRows(data as Enquiry[]);
  }, [supabase, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === 'all') next.delete(key);
    else next.set(key, value);
    router.replace(`/admin/enquiries${next.toString() ? `?${next}` : ''}`, { scroll: false });
  };

  useEffect(() => setPage(1), [statusFilter, typeFilter, search]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (typeFilter !== 'all' && r.enquiry_type !== typeFilter) return false;
      if (!q) return true;
      return [r.business_name, r.contact_person, r.phone, r.email, r.product_code, r.product_name, r.notes]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, statusFilter, typeFilter, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = rows?.find((r) => r.id === openId) || null;

  const updateRow = async (id: string, patch: Partial<Enquiry>, successMsg: string) => {
    const before = rows;
    setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, ...patch } : r)) || null); // optimistic
    const { error } = await supabase.from('enquiries').update(patch).eq('id', id);
    if (error) {
      setRows(before);
      return toast('error', `Could not save: ${error.message}`);
    }
    toast('success', successMsg);
    if ('status' in patch) refreshCounts();
  };

  const deleteRow = async (row: Enquiry) => {
    const ok = await confirm({
      title: 'Delete this enquiry?',
      message: `${row.business_name} (${row.contact_person}) will be permanently removed. This cannot be undone.`,
      confirmLabel: 'Delete enquiry',
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from('enquiries').delete().eq('id', row.id);
    if (error) return toast('error', `Could not delete: ${error.message}`);
    setRows((prev) => prev?.filter((r) => r.id !== row.id) || null);
    setParam('id', null);
    refreshCounts();
    toast('success', 'Enquiry deleted.');
  };

  const exportCsv = () => {
    const cols: (keyof Enquiry)[] = [
      'created_at', 'status', 'enquiry_type', 'business_name', 'contact_person', 'phone', 'email',
      'product_code', 'product_name', 'quantity', 'notes', 'admin_notes', 'source_page',
    ];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...filtered.map((r) => cols.map((c) => esc(c === 'created_at' ? formatDateTime(r.created_at) : r[c])).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!rows) return <LoadingBlock label="Loading enquiries…" />;

  const countFor = (s: string) => (s === 'all' ? rows.length : rows.filter((r) => r.status === s).length);

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Every form submission from the website. Click a row to see details."
        actions={
          <>
            <Button variant="secondary" onClick={load} disabled={refreshing}>
              <RefreshCw className={cx('h-4 w-4', refreshing && 'animate-spin')} /> Refresh
            </Button>
            <Button variant="secondary" onClick={exportCsv} disabled={!filtered.length}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </>
        }
      />

      <Card>
        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-stone-200 px-3">
          {['all', ...ENQUIRY_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setParam('status', s)}
              className={cx(
                '-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium',
                statusFilter === s ? 'border-[#30241F] text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'
              )}
            >
              {s === 'all' ? 'All' : STATUS_META[s as CustomerEnquiry['status']].label}
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">{countFor(s)}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-stone-200 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="search"
              placeholder="Search business, person, phone, email, design code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cx(inputCls, 'pl-9')}
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={cx(inputCls, 'sm:w-52')} aria-label="Enquiry type">
            <option value="all">All types</option>
            {Object.entries(ENQUIRY_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-5 w-5" />}
            title={rows.length ? 'No enquiries match your filters' : 'No enquiries yet'}
            description={rows.length ? 'Try a different status, type or search term.' : 'Submissions from the website forms will appear here.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs font-medium uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pageRows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setParam('id', r.id)}
                    className={cx('cursor-pointer hover:bg-stone-50', r.status === 'new' && 'bg-rose-50/40', openId === r.id && 'bg-amber-50')}
                  >
                    <td className="px-4 py-3">
                      <p className={cx('text-stone-900', r.status === 'new' ? 'font-semibold' : 'font-medium')}>{r.business_name}</p>
                      <p className="text-xs text-stone-500">{r.contact_person}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      <p className="font-mono text-xs">{r.phone}</p>
                      {r.email && <p className="text-xs text-stone-500">{r.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-stone-700">{ENQUIRY_TYPE_LABELS[r.enquiry_type]}</p>
                      <p className="max-w-[16rem] truncate text-xs text-stone-500">
                        {[r.product_code, r.quantity].filter(Boolean).join(' • ') || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-stone-500" title={formatDateTime(r.created_at)}>
                      {timeAgo(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 text-sm text-stone-600">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="secondary" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selected && (
        <EnquiryDrawer
          key={selected.id}
          enquiry={selected}
          onClose={() => setParam('id', null)}
          onStatus={(status) => updateRow(selected.id, { status }, `Marked as ${STATUS_META[status].label.toLowerCase()}.`)}
          onSaveNotes={(admin_notes) => updateRow(selected.id, { admin_notes }, 'Internal notes saved.')}
          onDelete={() => deleteRow(selected)}
        />
      )}
    </>
  );
}

function EnquiryDrawer({
  enquiry: e,
  onClose,
  onStatus,
  onSaveNotes,
  onDelete,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onStatus: (s: CustomerEnquiry['status']) => void;
  onSaveNotes: (notes: string) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(e.admin_notes || '');
  const notesDirty = notes !== (e.admin_notes || '');

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const waText = encodeURIComponent(
    `Hello ${e.contact_person}, this is Khodal Fashion, Surat, regarding your enquiry${e.product_code ? ` for ${e.product_code}` : ''}.`
  );

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Enquiry details">
      <div className="absolute inset-0 bg-stone-900/40" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-stone-900">{e.business_name}</p>
            <p className="text-sm text-stone-500">
              {ENQUIRY_TYPE_LABELS[e.enquiry_type]} • {formatDateTime(e.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`https://wa.me/${waNumber(e.phone)}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-md bg-[#25D366] px-3 py-2.5 text-xs font-medium text-white hover:bg-[#1fb955]"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={`tel:${e.phone.replace(/[^0-9+]/g, '')}`}
              className="flex flex-col items-center gap-1 rounded-md border border-stone-300 px-3 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={e.email ? `mailto:${e.email}?subject=${encodeURIComponent('Your enquiry with Khodal Fashion')}` : undefined}
              aria-disabled={!e.email}
              className={cx(
                'flex flex-col items-center gap-1 rounded-md border border-stone-300 px-3 py-2.5 text-xs font-medium',
                e.email ? 'text-stone-700 hover:bg-stone-50' : 'pointer-events-none text-stone-300'
              )}
            >
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>

          {/* Status */}
          <div>
            <p className="mb-2 text-sm font-medium text-stone-700">Status</p>
            <div className="flex flex-wrap gap-2">
              {ENQUIRY_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => s !== e.status && onStatus(s)}
                  className={cx(
                    'rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition',
                    s === e.status ? STATUS_META[s].cls + ' ring-2' : 'bg-white text-stone-600 ring-stone-300 hover:bg-stone-50'
                  )}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
            <Detail label="Contact person" value={e.contact_person} />
            <Detail label="Phone" value={e.phone} mono />
            <Detail label="Email" value={e.email} />
            <Detail label="Design code" value={e.product_code} mono />
            <Detail label="Product" value={e.product_name} />
            <Detail label="Quantity" value={e.quantity} />
            <Detail label="Submitted from" value={e.source_page} />
          </dl>

          <div>
            <p className="mb-1.5 text-sm font-medium text-stone-700">Buyer&apos;s message</p>
            <p className="whitespace-pre-line rounded-md bg-stone-50 p-3 text-sm text-stone-800">{e.notes || 'No message.'}</p>
          </div>

          {/* Internal notes */}
          <div>
            <label htmlFor="admin-notes" className="mb-1.5 block text-sm font-medium text-stone-700">
              Internal notes <span className="font-normal text-stone-400">(only visible to admins)</span>
            </label>
            <textarea
              id="admin-notes"
              rows={4}
              value={notes}
              onChange={(ev) => setNotes(ev.target.value)}
              placeholder="e.g. Quoted ₹1,250/m on 24 Nov, swatch sent via DTDC…"
              className={inputCls}
            />
            <div className="mt-2 flex justify-end">
              <Button variant="primary" disabled={!notesDirty} onClick={() => onSaveNotes(notes)}>
                Save notes
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-stone-200 px-6 py-3">
          <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={onDelete}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <>
      <dt className="col-span-1 text-stone-500">{label}</dt>
      <dd className={cx('col-span-2 break-words text-stone-900', mono && 'font-mono text-xs leading-5')}>{value || '—'}</dd>
    </>
  );
}
