'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

export default function FeaturedGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
