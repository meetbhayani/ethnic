import Link from 'next/link';

export default function FabricNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F3]">
      <h1 className="font-editorial text-3xl text-[#30241F] mb-4">Fabric design not found</h1>
      <p className="text-sm text-[#30241F]/80 mb-6 max-w-md">
        This design may have been archived or the link is incorrect. Browse the current catalogue or ask us on WhatsApp with the
        design code.
      </p>
      <Link href="/collections" className="px-6 py-2.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold">
        Browse catalogue
      </Link>
    </div>
  );
}
