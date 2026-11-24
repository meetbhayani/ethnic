import SiteLayout from './(site)/layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <SiteLayout>
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F3]">
      <p className="text-xs uppercase tracking-widest text-[#91703E] font-semibold mb-2">404</p>
      <h1 className="font-editorial text-3xl text-[#30241F] mb-4">Page not found</h1>
      <p className="text-sm text-[#30241F]/80 mb-6 max-w-md">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="flex gap-3">
        <Link href="/" className="px-6 py-2.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold">
          Home
        </Link>
        <Link href="/collections" className="px-6 py-2.5 border border-[#30241F] text-[#30241F] text-xs uppercase tracking-widest font-semibold">
          Catalogue
        </Link>
      </div>
    </div>
    </SiteLayout>
  );
}
