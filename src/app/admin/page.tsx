'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);

  const total = products.length;
  const available = products.filter(p => !p.sold).length;
  const sold = products.filter(p => p.sold).length;
  const totalValue = products.filter(p => !p.sold).reduce((sum, p) => sum + p.price, 0);

  const catCounts = products.reduce((acc, p) => {
    acc[p.cat] = (acc[p.cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wider uppercase mb-8">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Products</p>
          <p className="font-heading text-3xl text-bone">{total}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Available</p>
          <p className="font-heading text-3xl text-green-500">{available}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sold</p>
          <p className="font-heading text-3xl text-primary">{sold}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Inventory Value</p>
          <p className="font-heading text-3xl text-gold-accent">{totalValue} JOD</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/5">
        <h2 className="font-heading text-xl tracking-wider uppercase mb-4">By Category</h2>
        <div className="space-y-3">
          {Object.entries(catCounts).map(([cat, count]) => {
            const label = cat === 'hoodies' ? 'Hoodies' : cat === 'tees' ? 'Tees & Sweats' : cat === 'boots' ? 'Dr. Martens' : 'Jackets';
            const pct = Math.round((count / total) * 100);
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-bone">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
