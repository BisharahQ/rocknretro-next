import { prisma } from './db';
import { ShopSettings } from '@/types';

export async function getSettings(): Promise<ShopSettings> {
  const row = await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, reservationDays: 2 },
  });
  return { reservationDays: row.reservationDays };
}

export async function updateSettings(updates: Partial<ShopSettings>): Promise<ShopSettings> {
  const row = await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: { ...(updates.reservationDays !== undefined && { reservationDays: updates.reservationDays }) },
    create: { id: 1, reservationDays: updates.reservationDays ?? 2 },
  });
  return { reservationDays: row.reservationDays };
}
