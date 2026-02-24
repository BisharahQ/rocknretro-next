import { prisma } from './db';
import { Order } from '@/types';
import { updateProduct } from './products';

/** Check for expired reservations and auto-flag them */
export async function processExpiredOrders(): Promise<void> {
  const now = new Date();

  const expired = await prisma.order.findMany({
    where: { status: 'reserved', reservedUntil: { lt: now } },
    include: { items: true },
  });

  if (expired.length === 0) return;

  await prisma.order.updateMany({
    where: { id: { in: expired.map(o => o.id) } },
    data: { status: 'expired' },
  });

  for (const order of expired) {
    for (const item of order.items) {
      await updateProduct(item.productId, { reserved: false });
    }
  }
}

export async function getAllOrders(): Promise<Order[]> {
  await processExpiredOrders();
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toOrder);
}

export async function getOrderById(id: number): Promise<Order | null> {
  await processExpiredOrders();
  const row = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return row ? toOrder(row) : null;
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const row = await prisma.order.create({
    data: {
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      customerNotes: order.customer.notes ?? null,
      subtotal: order.subtotal,
      total: order.total,
      status: 'reserved',
      reservedUntil: new Date(order.reservedUntil),
      items: {
        create: order.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      },
    },
    include: { items: true },
  });
  return toOrder(row);
}

export async function updateOrder(id: number, updates: Record<string, unknown>): Promise<Order | null> {
  try {
    const data: Record<string, unknown> = {};
    if (updates.status !== undefined) data.status = updates.status;
    if (updates.reservedUntil !== undefined) data.reservedUntil = new Date(updates.reservedUntil as string);

    const row = await prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });
    return toOrder(row);
  } catch {
    return null;
  }
}

type OrderRow = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerNotes: string | null;
  subtotal: number;
  total: number;
  status: string;
  reservedUntil: Date;
  createdAt: Date;
  items: {
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
};

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    items: row.items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    customer: {
      name: row.customerName,
      phone: row.customerPhone,
      notes: row.customerNotes ?? undefined,
    },
    subtotal: row.subtotal,
    total: row.total,
    status: row.status as Order['status'],
    reservedUntil: row.reservedUntil.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}
