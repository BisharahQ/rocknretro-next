'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

export default function NewProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/admin/products');
      }
    } catch {
      alert('Failed to create product');
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wider uppercase mb-8">Add New Product</h1>
      <ProductForm onSave={handleSave} saving={saving} />
    </div>
  );
}
