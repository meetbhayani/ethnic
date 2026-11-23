'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerEnquiry } from '@/types';

// Small, consistent UI kit for the admin app (neutral, data-dense, readable).

export const inputCls =
  'w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#AD8A53]/40 focus:border-[#AD8A53] disabled:bg-stone-100 disabled:text-stone-500';

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-[#30241F] text-white hover:bg-[#1f1714] shadow-sm',
  secondary: 'bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
};
const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ' +
  'disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AD8A53]/50';

export function Button({
  variant = 'secondary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = 'secondary',
  className,
  children,
  ...rest
}: { href: string; variant?: ButtonVariant; className?: string; children: React.ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>) {
  return (
    <Link href={href} className={cx(buttonBase, buttonVariants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cx('rounded-lg border border-stone-200 bg-white shadow-sm', className)}>{children}</div>;
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-stone-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-emerald-600' : 'bg-stone-300'
      )}
    >
      <span
        className={cx(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

export const STATUS_META: Record<CustomerEnquiry['status'], { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
  contacted: { label: 'Contacted', cls: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  quoted: { label: 'Quoted', cls: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  'sample-sent': { label: 'Sample sent', cls: 'bg-violet-50 text-violet-700 ring-violet-600/20' },
  closed: { label: 'Closed', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
};

export const ENQUIRY_STATUSES = Object.keys(STATUS_META) as CustomerEnquiry['status'][];

export const ENQUIRY_TYPE_LABELS: Record<CustomerEnquiry['enquiryType'], string> = {
  'fabric-price': 'Fabric price',
  'custom-jobwork': 'Custom job-work',
  'wholesale-b2b': 'Wholesale',
  'swatch-kit': 'Swatch kit',
};

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: CustomerEnquiry['status'] }) {
  const m = STATUS_META[status];
  return <Badge className={m.cls}>{m.label}</Badge>;
}

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 rounded-full bg-stone-100 p-3 text-stone-500">{icon}</div>
      <p className="text-sm font-medium text-stone-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cx('inline-block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700', className)}
      aria-label="Loading"
    />
  );
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-stone-500">
      <Spinner /> {label}
    </div>
  );
}

/** "2 hours ago" style relative time for tables. */
export function timeAgo(iso: string): string {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
}

/** International WhatsApp number from a stored phone (adds 91 to 10-digit Indian numbers). */
export function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
}
