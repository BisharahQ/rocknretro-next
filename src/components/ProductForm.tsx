'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductFormProps {
  product?: Product;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
}

const CATEGORIES = ['hoodies', 'tees', 'boots', 'jackets'];
const BADGES = ['', 'Hot', 'Rare', 'Just In', 'New'];

export default function ProductForm({ product, onSave, saving }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [type, setType] = useState(product?.type || '');
  const [size, setSize] = useState(product?.size || '');
  const [cat, setCat] = useState(product?.cat || 'hoodies');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [badge, setBadge] = useState(product?.badge || '');
  const [stock, setStock] = useState(product?.stock?.toString() || '1');
  const [sold, setSold] = useState(product?.sold || false);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.path) {
          setImages(prev => [...prev, data.path]);
        }
      } catch {
        alert('Upload failed');
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      size,
      cat,
      price: Number(price),
      stock: Math.max(1, Number(stock) || 1),
      badge: badge || null,
      sold,
      featured,
      description,
      img: images[0] || '/images/post_1_1.jpg',
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Name */}
      <div>
        <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Product Name *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          placeholder="e.g. Metallica Kill 'Em All"
        />
      </div>

      {/* Type & Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Type *</label>
          <input
            type="text"
            value={type}
            onChange={e => setType(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            placeholder="e.g. Hoodie"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Size *</label>
          <input
            type="text"
            value={size}
            onChange={e => setSize(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            placeholder="e.g. XL or EU 43"
          />
        </div>
      </div>

      {/* Category, Price & Stock */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Category</label>
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} className="bg-surface text-bone">{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Price (JOD) *</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            min="0"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            placeholder="25"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Stock *</label>
          <input
            type="number"
            value={stock}
            onChange={e => setStock(e.target.value)}
            required
            min="1"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            placeholder="1"
          />
        </div>
      </div>

      {/* Badge & Toggles */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Badge</label>
          <select
            value={badge}
            onChange={e => setBadge(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
          >
            {BADGES.map(b => (
              <option key={b} value={b} className="bg-surface text-bone">{b || 'None'}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={sold} onChange={e => setSold(e.target.checked)} className="accent-primary" />
            <span className="text-sm text-slate-400">Sold</span>
          </label>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-primary" />
            <span className="text-sm text-slate-400">Featured</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
          placeholder="Product description..."
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 rounded overflow-hidden group">
              <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1 rounded">Main</span>
              )}
            </div>
          ))}
          <label className="w-24 h-24 rounded border-2 border-dashed border-white/10 hover:border-primary/30 flex flex-col items-center justify-center cursor-pointer transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="text-[10px] text-slate-500 mt-1">{uploading ? 'Uploading...' : 'Add'}</span>
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => history.back()}
          className="bg-white/5 hover:bg-white/10 text-slate-400 px-8 py-3 rounded-lg text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
