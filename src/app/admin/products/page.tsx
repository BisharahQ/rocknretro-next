'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const loadProducts = () => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
  });

  const toggleSold = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sold: !product.sold }),
    });
    loadProducts();
  };

  const toggleFeatured = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !product.featured }),
    });
    loadProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    loadProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl tracking-wider uppercase">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* Product table */}
      <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Featured</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                        <Image src={product.img} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 capitalize">{product.cat}</td>
                  <td className="px-4 py-3 text-slate-400">{product.size}</td>
                  <td className="px-4 py-3 text-primary font-medium">{product.price} JOD</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSold(product)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        product.sold
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                          : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                      }`}
                    >
                      {product.sold ? 'Sold' : 'Available'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`w-8 h-5 rounded-full transition-colors relative ${
                        product.featured ? 'bg-primary' : 'bg-white/10'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        product.featured ? 'left-3.5' : 'left-0.5'
                      }`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-slate-400 hover:text-primary transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-4">{filtered.length} products</p>
    </div>
  );
}
