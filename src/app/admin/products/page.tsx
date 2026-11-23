'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, ButtonLink, Card, EmptyState, LoadingBlock, PageHeader, Switch, inputCls, timeAgo, cx } from '@/components/admin/ui';
import { CATEGORY_LABELS, FabricRow } from '@/lib/fabrics';
import { FABRIC_IMAGES_BUCKET } from '@/lib/supabase/client';
import { storagePathFromUrl } from '@/lib/admin-images';

export default function ProductsPage() {
  const { supabase, toast, confirm } = useAdmin();
  const [rows, setRows] = useState<FabricRow[] | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('fabrics')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false });
    if (error) return toast('error', `Could not load products: ${error.message}`);
    setRows(data as FabricRow[]);
  }, [supabase, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (visibility === 'published' && !r.is_published) return false;
      if (visibility === 'hidden' && r.is_published) return false;
      return !q || [r.code, r.name, r.base_fabric, r.color].some((v) => v?.toLowerCase().includes(q));
    });
  }, [rows, search, category, visibility]);

  const patch = async (row: FabricRow, change: Partial<FabricRow>, msg: string) => {
    setBusyId(row.id);
    setRows((prev) => prev?.map((r) => (r.id === row.id ? { ...r, ...change } : r)) || null);
    const { error } = await supabase.from('fabrics').update(change).eq('id', row.id);
    setBusyId(null);
    if (error) {
      toast('error', `Could not update ${row.code}: ${error.message}`);
      return load();
    }
    toast('success', msg);
  };

  const remove = async (row: FabricRow) => {
    const ok = await confirm({
      title: `Delete ${row.code}?`,
      message: `“${row.name}” and its uploaded photos will be permanently deleted. To hide it temporarily, switch off “Visible” instead.`,
      confirmLabel: 'Delete product',
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from('fabrics').delete().eq('id', row.id);
    if (error) return toast('error', `Could not delete: ${error.message}`);
    const paths = (row.images?.length ? row.images : [row.main_image]).map(storagePathFromUrl).filter((p): p is string => !!p);
    if (paths.length) await supabase.storage.from(FABRIC_IMAGES_BUCKET).remove(paths);
    setRows((prev) => prev?.filter((r) => r.id !== row.id) || null);
    toast('success', `${row.code} deleted.`);
  };

  if (!rows) return <LoadingBlock label="Loading products…" />;

  return (
    <>
      <PageHeader
        title="Products"
        description={`${rows.length} fabrics • ${rows.filter((r) => r.is_published).length} visible on the website`}
        actions={
          <ButtonLink href="/admin/products/new" variant="primary">
            <Plus className="h-4 w-4" /> Add product
          </ButtonLink>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-stone-200 p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="search"
              placeholder="Search by code, name, fabric or colour…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cx(inputCls, 'pl-9')}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={cx(inputCls, 'md:w-56')} aria-label="Category">
            <option value="all">All categories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className={cx(inputCls, 'md:w-40')} aria-label="Visibility">
            <option value="all">All</option>
            <option value="published">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title={rows.length ? 'No products match your filters' : 'No products yet'}
            description={rows.length ? 'Try a different search or filter.' : 'Add your first fabric to start building the catalogue.'}
            action={
              !rows.length && (
                <ButtonLink href="/admin/products/new" variant="primary">
                  <Plus className="h-4 w-4" /> Add product
                </ButtonLink>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs font-medium uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">MOQ</th>
                  <th className="px-4 py-3 text-center">Ready stock</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-center">Visible</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((r) => (
                  <tr key={r.id} className={cx('hover:bg-stone-50', !r.is_published && 'bg-stone-50/60')}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${r.id}`} className="flex items-center gap-3">
                        {r.main_image ? (
                          <img src={r.main_image} alt="" className="h-12 w-12 shrink-0 rounded-md border border-stone-200 object-cover" />
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-md bg-stone-100" />
                        )}
                        <div className="min-w-0">
                          <p className={cx('truncate font-medium hover:underline', r.is_published ? 'text-stone-900' : 'text-stone-500')}>
                            {r.name}
                          </p>
                          <p className="font-mono text-xs text-stone-500">
                            {r.code}
                            {!r.is_published && <span className="ml-2 font-sans text-amber-700">Hidden</span>}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{CATEGORY_LABELS[r.category]}</td>
                    <td className="px-4 py-3 text-stone-600">{r.moq}</td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        label={`Ready stock: ${r.code}`}
                        checked={r.ready_stock}
                        disabled={busyId === r.id}
                        onChange={(v) => patch(r, { ready_stock: v }, `${r.code}: ${v ? 'ready stock' : 'made to order'}.`)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        label={`Featured: ${r.code}`}
                        checked={r.featured}
                        disabled={busyId === r.id}
                        onChange={(v) => patch(r, { featured: v }, `${r.code} ${v ? 'featured on home page' : 'removed from home page'}.`)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        label={`Visible: ${r.code}`}
                        checked={r.is_published}
                        disabled={busyId === r.id}
                        onChange={(v) => patch(r, { is_published: v }, `${r.code} is now ${v ? 'visible' : 'hidden'} on the website.`)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-stone-500">{r.updated_at ? timeAgo(r.updated_at) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`/collections/${r.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                          title="View on website"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Link
                          href={`/admin/products/${r.id}`}
                          className="rounded-md p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Button variant="ghost" className="px-2 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => remove(r)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
