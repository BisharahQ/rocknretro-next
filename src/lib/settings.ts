import { ShopSettings } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'settings.json');

export function getSettings(): ShopSettings {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function updateSettings(updates: Partial<ShopSettings>): ShopSettings {
  const current = getSettings();
  const updated = { ...current, ...updates };
  fs.writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
