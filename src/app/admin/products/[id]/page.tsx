'use client';

import React, { useEffect, useState } from 'react';
import { PackageX } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import FabricForm from '@/components/admin/FabricForm';
import { ButtonLink, Card, EmptyState, LoadingBlock } from '@/components/admin/ui';
import { AdminFabric, FabricRow, rowToFabric } from '@/lib/fabrics';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { supabase, toast } = useAdmin();
  const [fabric, setFabric] = useState<AdminFabric | null | undefined>(undefined);

  useEffect(() => {
    supabase
      .from('fabrics')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast('error', `Could not load product: ${error.message}`);
        setFabric(data ? rowToFabric(data as FabricRow) : null);
      });
  }, [supabase, toast, params.id]);

  if (fabric === undefined) return <LoadingBlock label="Loading product…" />;

  if (fabric === null) {
    return (
      <Card>
        <EmptyState
          icon={<PackageX className="h-5 w-5" />}
          title="Product not found"
          description="It may have been deleted."
          action={<ButtonLink href="/admin/products">Back to products</ButtonLink>}
        />
      </Card>
    );
  }

  return <FabricForm initial={fabric} />;
}
