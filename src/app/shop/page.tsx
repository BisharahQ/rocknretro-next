'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function ShopPageWrapper() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-surface-light rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}><div className="aspect-[3/4] bg-surface-light rounded-lg" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ShopPage />
    </Suspense>
  );
}

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'tees', label: 'Tees & Sweats' },
  { slug: 'boots', label: 'Dr. Martens' },
  { slug: 'jackets', label: 'Jackets' },
];

const SIZES = ['All Sizes', 'M', 'L', 'XL', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const PAGE_SIZE = 12;

function ShopPage() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCat);
  const [size, setSize] = useState('All Sizes');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [showCount, setShowCount] = useState(PAGE_SIZE);
  const [hideSold, setHideSold] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // Reset show count on filter change
  useEffect(() => {
    setShowCount(PAGE_SIZE);
  }, [category, size, sort, search, hideSold]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== 'all') {
      result = result.filter(p => p.cat === category);
    }

    if (size !== 'All Sizes') {
      result = result.filter(p => p.size === size);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q)
      );
    }

    if (hideSold) {
      result = result.filter(p => !p.sold && !p.reserved);
    }

    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest = default order (reverse id)
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, category, size, sort, search, hideSold]);

  const visible = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  return (
    <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs tracking-[0.3em] text-primary uppercase">Full Collection</span>
          </div>
          <h1 className="font-heading text-5xl lg:text-6xl tracking-wider uppercase">Shop</h1>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 pb-8 border-b border-white/5">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* Size filter */}
          <select
            value={size}
            onChange={e => setSize(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
          >
            {SIZES.map(s => (
              <option key={s} value={s} className="bg-surface text-bone">{s}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-surface text-bone">{opt.label}</option>
            ))}
          </select>

          {/* Hide sold toggle */}
          <button
            onClick={() => setHideSold(!hideSold)}
            className={`px-4 py-2.5 rounded-lg text-sm border transition-colors ${
              hideSold
                ? 'bg-primary/20 border-primary/50 text-primary'
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            Hide Unavailable
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-all ${
                category === cat.slug
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-bone'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          {category !== 'all' && ` in ${CATEGORIES.find(c => c.slug === category)?.label}`}
        </p>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-surface-light rounded-lg" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-surface-light rounded w-3/4" />
                  <div className="h-3 bg-surface-light rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-slate-500 text-lg">No products found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
            <button onClick={() => { setCategory('all'); setSize('All Sizes'); setSearch(''); setHideSold(false); }} className="mt-4 text-primary hover:text-primary-dark transition-colors text-sm">
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {visible.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowCount(prev => prev + PAGE_SIZE)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-bone px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all"
                >
                  Load More ({filtered.length - showCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
