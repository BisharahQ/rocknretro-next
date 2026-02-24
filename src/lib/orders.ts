import { Order } from '@/types';
import { updateProduct } from './products';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'orders.json');

function readOrders(): Order[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeOrders(orders: Order[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(orders, null, 2), 'utf-8');
}

/** Check for expired reservations and auto-flag them */
export function processExpiredOrders(): void {
  const orders = readOrders();
  const now = new Date();
  let changed = false;

  for (const order of orders) {
    if (order.status === 'reserved' && new Date(order.reservedUntil) < now) {
      order.status = 'expired';
      changed = true;
      // Release reserved products
      for (const item of order.items) {
        updateProduct(item.productId, { reserved: false });
      }
    }
  }

  if (changed) {
    writeOrders(orders);
  }
}

export function getAllOrders(): Order[] {
  processExpiredOrders();
  return readOrders();
}

export function getOrderById(id: number): Order | undefined {
  processExpiredOrders();
  return readOrders().find(o => o.id === id);
}

export function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const orders = readOrders();
  const maxId = orders.reduce((max, o) => Math.max(max, o.id), 0);
  const newOrder: Order = {
    ...order,
    id: maxId + 1,
    status: 'reserved',
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  writeOrders(orders);
  return newOrder;
}

export function updateOrder(id: number, updates: Partial<Order>): Order | null {
  const orders = readOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates };
  writeOrders(orders);
  return orders[index];
}
