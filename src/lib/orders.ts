import { Order } from '@/types';
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

export function getAllOrders(): Order[] {
  return readOrders();
}

export function getOrderById(id: number): Order | undefined {
  return readOrders().find(o => o.id === id);
}

export function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const orders = readOrders();
  const maxId = orders.reduce((max, o) => Math.max(max, o.id), 0);
  const newOrder: Order = {
    ...order,
    id: maxId + 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  writeOrders(orders);
  return newOrder;
}

export function updateOrderStatus(id: number, status: Order['status']): Order | null {
  const orders = readOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  orders[index].status = status;
  writeOrders(orders);
  return orders[index];
}
