import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let products = await getAllProducts();

  const cat = searchParams.get('cat');
  if (cat && cat !== 'all') {
    products = products.filter(p => p.cat === cat);
  }

  const search = searchParams.get('search');
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    );
  }

  const size = searchParams.get('size');
  if (size) {
    products = products.filter(p => p.size === size);
  }

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));

  const sold = searchParams.get('sold');
  if (sold === 'false') products = products.filter(p => !p.sold);
  if (sold === 'true') products = products.filter(p => p.sold);

  const featured = searchParams.get('featured');
  if (featured === 'true') products = products.filter(p => p.featured);

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
