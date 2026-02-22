'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from './Toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { show } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.sold) return;
    addItem(product);
    show(`${product.name} added to bag!`);
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-light">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badge */}
        {product.badge && !product.sold && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
            product.badge === 'Hot' ? 'bg-primary text-white' :
            product.badge === 'Rare' ? 'bg-gold-accent text-black' :
            'bg-white/90 text-black'
          }`}>
            {product.badge}
          </span>
        )}

        {/* Sold badge */}
        {product.sold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-black px-4 py-2 rounded font-heading text-xl tracking-wider uppercase -rotate-12">
              Sold
            </span>
          </div>
        )}

        {/* Quick add */}
        {!product.sold && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 left-3 right-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            Add to Bag
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-xs text-slate-500">{product.type} &middot; {product.size}</p>
        <p className={`font-bold text-sm ${product.sold ? 'text-slate-500 line-through' : 'text-primary'}`}>
          {product.price} JOD
        </p>
      </div>
    </Link>
  );
}
