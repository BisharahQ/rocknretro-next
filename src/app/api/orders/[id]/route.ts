import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/orders';
import { updateProduct } from '@/lib/products';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await getOrderById(Number(params.id));
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const order = await getOrderById(Number(params.id));

    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Handle status change
    if (body.status) {
      const validStatuses = ['reserved', 'picked_up', 'cancelled', 'expired'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      // Handle product state changes based on status transition
      if (body.status === 'picked_up' && order.status === 'reserved') {
        for (const item of order.items) {
          await updateProduct(item.productId, { sold: true, reserved: false });
        }
      } else if (
        (body.status === 'cancelled' || body.status === 'expired') &&
        order.status === 'reserved'
      ) {
        for (const item of order.items) {
          await updateProduct(item.productId, { reserved: false });
        }
      } else if (body.status === 'reserved' && order.status === 'expired') {
        for (const item of order.items) {
          await updateProduct(item.productId, { reserved: true });
        }
      }
    }

    // Build update object
    const updates: Record<string, unknown> = {};
    if (body.status) updates.status = body.status;
    if (body.reservedUntil) updates.reservedUntil = body.reservedUntil;

    const updated = await updateOrder(Number(params.id), updates);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
