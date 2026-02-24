import { prisma } from './db';
import { Product } from '@/types';

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  return rows.map(toProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true, sold: false },
    orderBy: { id: 'asc' },
  });
  return rows.map(toProduct);
}

export async function getProductsByCategory(cat: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { cat },
    orderBy: { id: 'asc' },
  });
  return rows.map(toProduct);
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const row = await prisma.product.create({
    data: {
      name: product.name,
      type: product.type,
      size: product.size,
      cat: product.cat,
      price: product.price,
      img: product.img,
      images: product.images,
      badge: product.badge,
      sold: product.sold ?? false,
      reserved: product.reserved ?? false,
      description: product.description ?? null,
      featured: product.featured ?? false,
    },
  });
  return toProduct(row);
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  try {
    const row = await prisma.product.update({
      where: { id },
      data: sanitizeUpdates(updates),
    });
    return toProduct(row);
  } catch {
    return null;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

function toProduct(row: {
  id: number;
  name: string;
  type: string;
  size: string;
  cat: string;
  price: number;
  img: string;
  images: string[];
  badge: string | null;
  sold: boolean;
  reserved: boolean;
  description: string | null;
  featured: boolean;
  createdAt: Date;
}): Product {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    size: row.size,
    cat: row.cat,
    price: row.price,
    img: row.img,
    images: row.images,
    badge: row.badge,
    sold: row.sold,
    reserved: row.reserved,
    description: row.description ?? undefined,
    featured: row.featured,
    createdAt: row.createdAt.toISOString(),
  };
}

function sanitizeUpdates(updates: Partial<Product>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (updates.name !== undefined) data.name = updates.name;
  if (updates.type !== undefined) data.type = updates.type;
  if (updates.size !== undefined) data.size = updates.size;
  if (updates.cat !== undefined) data.cat = updates.cat;
  if (updates.price !== undefined) data.price = updates.price;
  if (updates.img !== undefined) data.img = updates.img;
  if (updates.images !== undefined) data.images = updates.images;
  if (updates.badge !== undefined) data.badge = updates.badge;
  if (updates.sold !== undefined) data.sold = updates.sold;
  if (updates.reserved !== undefined) data.reserved = updates.reserved;
  if (updates.description !== undefined) data.description = updates.description;
  if (updates.featured !== undefined) data.featured = updates.featured;
  return data;
}
