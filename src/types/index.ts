export interface Product {
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
  description?: string;
  featured?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Section {
  id: string;
  type: 'hero' | 'marquee' | 'story' | 'contact' | 'categories';
  title?: string;
  subtitle?: string;
  content?: string;
  data?: Record<string, unknown>;
}

export interface SiteConfig {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    cta: string;
  };
  marquee: {
    bands: string[];
  };
  story: {
    title: string;
    content: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    instagram: string;
    hours: string;
  };
  categories: {
    name: string;
    slug: string;
    image: string;
    count?: number;
  }[];
}
