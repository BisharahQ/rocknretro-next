import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/orders';
import { getProductById, updateProduct } from '@/lib/products';
import { getSettings } from '@/lib/settings';

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customer?.name || !body.customer?.phone || !body.items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const phoneRegex = /^\+962\d{8,9}$/;
    if (!phoneRegex.test(body.customer.phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // Check all items are still available (not sold or reserved)
    for (const item of body.items) {
      const product = getProductById(item.productId);
      if (!product || product.sold || product.reserved) {
        return NextResponse.json(
          { error: `"${item.name}" is no longer available` },
          { status: 409 }
        );
      }
    }

    // Calculate reservation expiry
    const settings = getSettings();
    const reservedUntil = new Date();
    reservedUntil.setDate(reservedUntil.getDate() + settings.reservationDays);

    const order = createOrder({
      items: body.items,
      customer: {
        name: body.customer.name,
        phone: body.customer.phone,
        notes: body.customer.notes || undefined,
      },
      subtotal: body.subtotal,
      total: body.total,
      reservedUntil: reservedUntil.toISOString(),
    });

    // Mark items as reserved
    for (const item of order.items) {
      updateProduct(item.productId, { reserved: true });
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to place reservation' }, { status: 400 });
  }
}
