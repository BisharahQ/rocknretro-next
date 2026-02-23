import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/orders';
import { getProductById, updateProduct } from '@/lib/products';

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

    if (body.type === 'delivery' && (!body.customer.city || !body.customer.address)) {
      return NextResponse.json({ error: 'City and address required for delivery' }, { status: 400 });
    }

    // Check all items are still available
    for (const item of body.items) {
      const product = getProductById(item.productId);
      if (!product || product.sold) {
        return NextResponse.json(
          { error: `"${item.name}" is no longer available` },
          { status: 409 }
        );
      }
    }

    const order = createOrder({
      items: body.items,
      customer: body.customer,
      type: body.type,
      subtotal: body.subtotal,
      deliveryFee: body.deliveryFee,
      tax: body.tax,
      total: body.total,
    });

    // Mark items as sold
    for (const item of order.items) {
      updateProduct(item.productId, { sold: true });
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
