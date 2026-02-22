import { Product } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');

function readProducts(): Product[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeProducts(products: Product[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

export function getAllProducts(): Product[] {
  return readProducts();
}

export function getProductById(id: number): Product | undefined {
  return readProducts().find(p => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return readProducts().filter(p => p.featured && !p.sold);
}

export function getProductsByCategory(cat: string): Product[] {
  return readProducts().filter(p => p.cat === cat);
}

export function createProduct(product: Omit<Product, 'id'>): Product {
  const products = readProducts();
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  const newProduct = { ...product, id: maxId + 1 } as Product;
  products.push(newProduct);
  writeProducts(products);
  return newProduct;
}

export function updateProduct(id: number, updates: Partial<Product>): Product | null {
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates, id };
  writeProducts(products);
  return products[index];
}

export function deleteProduct(id: number): boolean {
  const products = readProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  writeProducts(filtered);
  return true;
}
