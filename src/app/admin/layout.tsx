import type { Metadata } from 'next';
import AdminProvider from '@/components/admin/AdminProvider';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin | Khodal Fashion',
  robots: { index: false, follow: false },
};

/** Separate admin application: own layout, no public header/footer/WhatsApp widget. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
