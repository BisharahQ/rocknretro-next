import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/products';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await getProductById(Number(params.id));
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const product = await updateProduct(Number(params.id), body);
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = await deleteProduct(Number(params.id));
  if (!success) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
