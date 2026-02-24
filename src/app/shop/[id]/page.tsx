'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { show } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id;
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.ok ? r.json() : null),
      fetch('/api/products').then(r => r.json()),
    ]).then(([prod, all]) => {
      setProduct(prod);
      if (prod) {
        const rel = all
          .filter((p: Product) => p.cat === prod.cat && p.id !== prod.id && !p.sold && !p.reserved)
          .slice(0, 4);
        setRelated(rel);
      }
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-surface-light rounded-lg animate-pulse" />
          <div className="space-y-4 py-8">
            <div className="h-8 bg-surface-light rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-surface-light rounded w-1/2 animate-pulse" />
            <div className="h-10 bg-surface-light rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl tracking-wider uppercase mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-primary hover:text-primary-dark transition-colors">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.img];

  const unavailable = product.sold || product.reserved;

  const handleAdd = () => {
    if (unavailable) return;
    addItem(product);
    show(`${product.name} added to bag!`);
  };

  return (
    <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-bone">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-light mb-4">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.sold && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-white text-black px-6 py-3 rounded font-heading text-2xl tracking-wider uppercase -rotate-12">
                    Sold
                  </span>
                </div>
              )}
              {product.reserved && !product.sold && (
                <div className="absolute inset-0 bg-amber-950/60 flex items-center justify-center">
                  <span className="bg-amber-500 text-black px-6 py-3 rounded font-heading text-2xl tracking-wider uppercase -rotate-12">
                    Reserved
                  </span>
                </div>
              )}
              {product.badge && !unavailable && (
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
                  product.badge === 'Hot' ? 'bg-primary text-white' :
                  product.badge === 'Rare' ? 'bg-gold-accent text-black' :
                  'bg-white/90 text-black'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="py-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs tracking-[0.3em] text-primary uppercase">{product.cat}</span>
              {product.sold && <span className="text-xs tracking-[0.3em] text-slate-500 uppercase">Sold Out</span>}
              {product.reserved && !product.sold && <span className="text-xs tracking-[0.3em] text-amber-500 uppercase">Reserved</span>}
            </div>

            <h1 className="font-heading text-4xl lg:text-5xl tracking-wider uppercase mb-2">{product.name}</h1>
            <p className="text-slate-400 text-lg mb-6">{product.type}</p>

            <p className={`font-heading text-4xl mb-8 ${product.sold ? 'text-slate-500 line-through' : product.reserved ? 'text-amber-500' : 'text-primary'}`}>
              {product.price} JOD
            </p>

            {/* Details */}
            <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 uppercase tracking-wider">Size</span>
                <span className="text-sm font-medium">{product.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 uppercase tracking-wider">Category</span>
                <span className="text-sm font-medium capitalize">{product.cat === 'tees' ? 'Tees & Sweats' : product.cat === 'boots' ? 'Dr. Martens' : product.cat}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 uppercase tracking-wider">Condition</span>
                <span className="text-sm font-medium">Vintage / Pre-owned</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-slate-400 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={unavailable}
              className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${
                unavailable
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg hover:shadow-red-900/30'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {product.sold ? 'Sold Out' : product.reserved ? 'Reserved' : 'Add to Bag'}
            </button>

            {/* Shipping info */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-4 h-4 text-gold-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                100% Authentic
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-4 h-4 text-gold-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Local Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-primary" />
              <h2 className="font-heading text-2xl tracking-wider uppercase">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
