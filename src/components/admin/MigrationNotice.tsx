import React from 'react';
import { Database } from 'lucide-react';

/** Shown when a feature's database table has not been created yet. */
export default function MigrationNotice({
  file,
  until = 'Until then the website keeps showing its default images.',
}: {
  file: string;
  /** What happens until the migration is run. */
  until?: string;
}) {
  return (
    <div className="mb-6 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <Database className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">One-time database setup needed</p>
        <p className="mt-1">
          Open Supabase → <strong>SQL Editor</strong>, paste the contents of{' '}
          <code className="rounded bg-amber-100 px-1">{file}</code> from the project, and click <strong>Run</strong>. Then
          reload this page. {until}
        </p>
      </div>
    </div>
  );
}
