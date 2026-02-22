'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import ProductForm from '@/components/ProductForm';

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(setProduct);
  }, [params.id]);

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/admin/products');
      }
    } catch {
      alert('Failed to update product');
    }
    setSaving(false);
  };

  if (!product) {
    return <div className="animate-pulse text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wider uppercase mb-8">Edit: {product.name}</h1>
      <ProductForm product={product} onSave={handleSave} saving={saving} />
    </div>
  );
}
