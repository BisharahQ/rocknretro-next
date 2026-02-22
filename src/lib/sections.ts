import { SiteConfig } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'sections.json');

export function getSections(): SiteConfig {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function updateSections(updates: Partial<SiteConfig>): SiteConfig {
  const current = getSections();
  const merged = { ...current, ...updates };
  fs.writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}
