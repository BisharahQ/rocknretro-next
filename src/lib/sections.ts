import { Prisma } from '@prisma/client';
import { prisma } from './db';
import { SiteConfig } from '@/types';

function toJsonValue(obj: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(obj));
}

const DEFAULT_CONFIG: SiteConfig = {
  hero: {
    title: 'Not Your Average Thrift Shop',
    subtitle: 'Curated rock & metal merchandise from the underground. Authentic vintage finds, hand-picked in Amman, Jordan.',
    badge: 'EST. AMMAN, JORDAN',
    cta: 'Browse Collection',
  },
  marquee: {
    bands: ['NIRVANA', 'METALLICA', 'SLIPKNOT', 'KORN', 'RADIOHEAD', 'AC/DC', "GUNS N' ROSES", 'OPETH', 'BLINK-182', 'LINKIN PARK', 'MCR', 'HIM', 'DR. MARTENS', 'PARKWAY DRIVE', 'MARILYN MANSON'],
  },
  story: {
    title: 'Our Story',
    content: "Born from a love of heavy riffs and worn-in leather, Rock N Retro is Amman's home for authentic rock and metal merchandise. Every piece in our collection is hand-picked — from rare vintage tour tees to classic Dr. Martens boots. We believe great style should tell a story, and every item here has one. Whether you're hunting for a Metallica hoodie that's been through a hundred shows or a pair of Docs with real character, you'll find it here.",
  },
  contact: {
    phone: '+962 7 9709 4003',
    email: 'rocknretro@email.com',
    address: 'Muhammad Ali As-Saadi St. 24, Amman, Jordan',
    mapUrl: 'https://www.google.com/maps/search/Muhammad+Ali+As-Saadi+St+24+Amman+Jordan',
    instagram: 'rocknretroo',
    hours: 'Sat\u2013Thu: 11AM\u20139PM',
  },
  categories: [
    { name: 'Hoodies & Sweats', slug: 'hoodies', image: '/images/post_2_1.jpg' },
    { name: 'Tees & Shirts', slug: 'tees', image: '/images/post_1_1.jpg' },
    { name: 'Dr. Martens', slug: 'boots', image: '/images/post_19_1.jpg' },
    { name: 'Jackets', slug: 'jackets', image: '/images/post_3_1.jpg' },
  ],
};

export async function getSections(): Promise<SiteConfig> {
  const row = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!row) {
    const created = await prisma.siteConfig.create({
      data: { id: 1, data: toJsonValue(DEFAULT_CONFIG) },
    });
    return created.data as unknown as SiteConfig;
  }
  return row.data as unknown as SiteConfig;
}

export async function updateSections(updates: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getSections();
  const merged = { ...current, ...updates };
  const row = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { data: toJsonValue(merged) },
    create: { id: 1, data: toJsonValue(merged) },
  });
  return row.data as unknown as SiteConfig;
}
