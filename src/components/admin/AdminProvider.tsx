'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { CheckCircle2, AlertCircle, X, Lock, Mail } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { Button, Spinner, inputCls } from './ui';

type ToastType = 'success' | 'error';
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface AdminContextValue {
  supabase: SupabaseClient;
  email: string;
  newEnquiryCount: number;
  refreshCounts: () => Promise<void>;
  toast: (type: ToastType, message: string) => void;
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  signOut: () => Promise<void>;
  /** Purge the website's cached product pages after a catalogue change. */
  revalidateSite: () => Promise<void>;
  /** fetch() to this site's /api routes with the admin's login token attached. */
  apiFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}

type AuthState = 'loading' | 'signed-out' | 'not-admin' | 'admin' | 'recovery';

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const toastId = useRef(0);
  const recovering = useRef(false);

  // ---- auth -------------------------------------------------------------
  const checkAdmin = useCallback(
    async (s: Session | null) => {
      setSession(s);
      if (!s) return setAuthState('signed-out');
      const { data, error } = await supabase.rpc('is_admin');
      setAuthState(!error && data === true ? 'admin' : 'not-admin');
    },
    [supabase]
  );

  useEffect(() => {
    // A reset-password email link lands here with "type=recovery" in the address.
    if (/type=recovery/.test(window.location.hash)) recovering.current = true;
    supabase.auth.getSession().then(({ data }) => {
      if (recovering.current && data.session) {
        setSession(data.session);
        setAuthState('recovery');
        return;
      }
      recovering.current = false;
      checkAdmin(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'TOKEN_REFRESHED') return;
      // Opened from a "reset password" email: ask for a new password before anything else.
      if (event === 'PASSWORD_RECOVERY') {
        recovering.current = true;
        setSession(s);
        setAuthState('recovery');
        return;
      }
      if (recovering.current) return;
      setTimeout(() => checkAdmin(s), 0); // don't call Supabase inside the auth callback
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase, checkAdmin]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthState('signed-out');
  }, [supabase]);

  // ---- new-enquiry badge (polls every 60s and when the tab regains focus) --
  const refreshCounts = useCallback(async () => {
    const { count } = await supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new');
    setNewEnquiryCount(count || 0);
  }, [supabase]);

  useEffect(() => {
    if (authState !== 'admin') return;
    refreshCounts();
    const t = setInterval(refreshCounts, 60_000);
    window.addEventListener('focus', refreshCounts);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', refreshCounts);
    };
  }, [authState, refreshCounts]);

  // ---- toasts & confirm -------------------------------------------------
  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), type === 'error' ? 7000 : 3500);
  }, []);

  const confirm = useCallback(
    (opts: ConfirmOptions) => new Promise<boolean>((resolve) => setConfirmState({ ...opts, resolve })),
    []
  );

  const revalidateSite = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) console.warn('Site revalidation failed:', res.status);
    } catch (err) {
      console.warn('Site revalidation failed:', err); // site still refreshes within 5 minutes
    }
  }, [supabase]);

  const apiFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const { data } = await supabase.auth.getSession();
      const headers = new Headers(init.headers);
      if (data.session?.access_token) headers.set('Authorization', `Bearer ${data.session.access_token}`);
      if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
      return fetch(path, { ...init, headers });
    },
    [supabase]
  );

  const closeConfirm = (value: boolean) => {
    confirmState?.resolve(value);
    setConfirmState(null);
  };

  // ---- render -----------------------------------------------------------
  if (authState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-stone-50 text-sm text-stone-500">
        <Spinner /> Checking your session…
      </div>
    );
  }

  if (authState === 'recovery') {
    return (
      <NewPasswordScreen
        email={session?.user.email || ''}
        onDone={() => {
          recovering.current = false;
          supabase.auth.getSession().then(({ data }) => checkAdmin(data.session));
        }}
      />
    );
  }

  if (authState === 'signed-out') return <LoginScreen />;

  if (authState === 'not-admin') {
    return (
      <AuthFrame>
        <div className="space-y-4 text-center">
          <Lock className="mx-auto h-8 w-8 text-red-600" />
          <h1 className="text-lg font-semibold text-stone-900">No admin access</h1>
          <p className="text-sm text-stone-600">
            <strong>{session?.user.email}</strong> is signed in but is not an admin for this site.
          </p>
          <Button variant="secondary" className="w-full" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AdminContext.Provider
      value={{ supabase, email: session?.user.email || '', newEnquiryCount, refreshCounts, toast, confirm, signOut, revalidateSite, apiFetch }}
    >
      {children}

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-3 text-sm shadow-lg"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            )}
            <p className="flex-1 text-stone-800">{t.message}</p>
            <button
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
              className="text-stone-400 hover:text-stone-700"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmState && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-900/50 p-4"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => e.key === 'Escape' && closeConfirm(false)}
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-stone-900">{confirmState.title}</h2>
            {confirmState.message && <p className="mt-2 text-sm text-stone-600">{confirmState.message}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => closeConfirm(false)} autoFocus>
                Cancel
              </Button>
              <Button variant={confirmState.danger ? 'danger' : 'primary'} onClick={() => closeConfirm(true)}>
                {confirmState.confirmLabel || 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}

// ---------------------------------------------------------------------------

function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 px-4">
      <div className="mb-6 text-center">
        <p className="font-editorial text-xl tracking-[0.08em] text-[#30241F]">KHODAL FASHION</p>
        <p className="text-xs uppercase tracking-widest text-stone-500">Admin</p>
      </div>
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8 shadow-sm">{children}</div>
    </div>
  );
}

function LoginScreen() {
  const supabase = getSupabaseBrowser();
  const [mode, setMode] = useState<'signin' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  // An expired or already-used reset link comes back with an error in the address.
  const [error, setError] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search.slice(1));
    if (!params.get('error_description')) return null;
    window.history.replaceState(null, '', window.location.pathname);
    return 'That reset link has expired or was already used. Click “Forgot password?” to get a new one.';
  });
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    // The email link brings the admin back here; AdminProvider then asks for a new password.
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin`,
    });
    setBusy(false);
    if (error) {
      setError(/rate limit/i.test(error.message) ? 'Too many reset emails were sent. Please wait a while and try again.' : error.message);
      return;
    }
    setSentTo(email.trim());
  };

  if (mode === 'forgot') {
    return (
      <AuthFrame>
        {sentTo ? (
          <div className="space-y-4 text-center">
            <Mail className="mx-auto h-8 w-8 text-[#AD8A53]" />
            <h1 className="text-lg font-semibold text-stone-900">Check your email</h1>
            <p className="text-sm text-stone-600">
              If <strong>{sentTo}</strong> is an admin account, a link to reset the password is on its way. Open it on this
              device and choose a new password.
            </p>
            <p className="text-xs text-stone-500">No email after a few minutes? Check spam, or ask another admin for help.</p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setMode('signin');
                setSentTo(null);
              }}
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={sendReset} className="space-y-4">
            <div>
              <h1 className="text-lg font-semibold text-stone-900">Reset password</h1>
              <p className="text-sm text-stone-500">Enter your admin email and we’ll send you a link to choose a new password.</p>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Email</span>
              <input type="email" required autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </label>
            {error && (
              <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" className="w-full" disabled={busy}>
              {busy ? 'Sending…' : 'Send reset link'}
            </Button>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className="w-full text-center text-sm text-stone-600 hover:text-stone-900"
            >
              Back to sign in
            </button>
          </form>
        )}
      </AuthFrame>
    );
  }

  return (
    <AuthFrame>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">Sign in</h1>
          <p className="text-sm text-stone-500">Use your admin account to continue.</p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-stone-700">Email</span>
          <input type="email" required autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-stone-700">
            Password
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setError(null);
              }}
              className="text-xs font-medium text-[#7a5d30] hover:underline"
            >
              Forgot password?
            </button>
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </label>
        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthFrame>
  );
}

/** Shown after opening a reset-password email link: choose a new password. */
function NewPasswordScreen({ email, onDone }: { email: string; onDone: () => void }) {
  const supabase = getSupabaseBrowser();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pw.length < 8) return setError('Use at least 8 characters.');
    if (pw !== pw2) return setError('Passwords do not match.');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setError(error.message);
    // Drop the reset link from the address bar, then continue into the admin.
    window.history.replaceState(null, '', window.location.pathname);
    onDone();
  };

  return (
    <AuthFrame>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">Choose a new password</h1>
          <p className="text-sm text-stone-500">
            For <strong>{email}</strong>. Use at least 8 characters.
          </p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-stone-700">New password</span>
          <input type="password" required autoFocus autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-stone-700">Confirm new password</span>
          <input type="password" required autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} />
        </label>
        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {busy ? 'Saving…' : 'Save new password'}
        </Button>
      </form>
    </AuthFrame>
  );
}
