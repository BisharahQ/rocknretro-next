import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/products';
import { getSections } from '@/lib/sections';
import FeaturedGrid from '@/components/FeaturedGrid';

export default function HomePage() {
  const products = getAllProducts();
  const sections = getSections();
  const featured = products.filter(p => p.featured && !p.sold).slice(0, 6);

  const categoryData = sections.categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.cat === cat.slug).length,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-dark to-primary/10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

        <div className="absolute top-1/2 -translate-y-1/2 right-8 hidden xl:block">
          <span className="vertical-text text-xs tracking-[0.5em] opacity-40 font-heading">EST. AMMAN JORDAN</span>
        </div>

        <div className="relative max-w-7xl mx-auto w-full py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] text-primary uppercase font-medium">{sections.hero.badge}</span>
            </div>
            <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl xl:text-9xl tracking-wide uppercase leading-[0.85] mb-6">
              <span className="text-bone">Not Your</span><br />
              <span className="text-primary">Average</span><br />
              <span className="text-gold-accent">Thrift Shop</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed mb-10">
              {sections.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all hover:shadow-lg hover:shadow-red-900/30 flex items-center gap-2">
                {sections.hero.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a href="https://instagram.com/rocknretroo" target="_blank" rel="noopener noreferrer" className="border border-white/20 hover:border-primary/50 text-bone px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                @rocknretroo
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md">
            <div>
              <p className="font-heading text-3xl text-primary">{products.filter(p => !p.sold).length}+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Items</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-gold-accent">4</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Categories</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-bone">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Authentic</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] tracking-[0.3em] text-slate-600 uppercase">Scroll</span>
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-white/5 py-4 overflow-hidden bg-surface">
        <div className="marquee-track">
          {[...sections.marquee.bands, ...sections.marquee.bands].map((band, i) => (
            <span key={i} className="font-heading text-2xl tracking-[0.2em] text-slate-600 mx-8 whitespace-nowrap">
              {band} <span className="text-primary mx-4">&bull;</span>
            </span>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs tracking-[0.3em] text-primary uppercase">Curated Picks</span>
              </div>
              <h2 className="font-heading text-4xl lg:text-5xl tracking-wider uppercase">Featured Drops</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors uppercase tracking-wider">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <FeaturedGrid products={featured} />

          <div className="mt-10 text-center sm:hidden">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors">
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 px-6 lg:px-20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] text-primary uppercase">Browse By</span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl tracking-wider uppercase">Categories</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryData.map(cat => (
              <Link
                key={cat.slug}
                href={`/shop?cat=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-heading text-xl tracking-wider uppercase group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-400">{cat.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] text-primary uppercase">About Us</span>
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl tracking-wider uppercase mb-6">{sections.story.title}</h2>
            <p className="text-slate-400 leading-relaxed text-lg">{sections.story.content}</p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="font-heading text-3xl text-primary">{products.length}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total Pieces</p>
              </div>
              <div>
                <p className="font-heading text-3xl text-gold-accent">20+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Bands</p>
              </div>
              <div>
                <p className="font-heading text-3xl text-bone">1</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Mission</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src="/images/post_2_1.jpg" alt="Merchandise" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image src="/images/post_19_1.jpg" alt="Dr. Martens" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image src="/images/post_3_1.jpg" alt="Collection" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src="/images/post_12_1.jpg" alt="Vintage" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 lg:px-20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] text-primary uppercase">Get in Touch</span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl tracking-wider uppercase">Contact Us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/5 hover:border-primary/20 transition-colors">
              <svg className="w-8 h-8 text-primary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h3 className="font-heading text-lg tracking-wider uppercase mb-1">Location</h3>
              <p className="text-sm text-slate-400">{sections.contact.address}</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/5 hover:border-primary/20 transition-colors">
              <svg className="w-8 h-8 text-primary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="font-heading text-lg tracking-wider uppercase mb-1">Hours</h3>
              <p className="text-sm text-slate-400">{sections.contact.hours}</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/5 hover:border-primary/20 transition-colors">
              <svg className="w-8 h-8 text-primary mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <h3 className="font-heading text-lg tracking-wider uppercase mb-1">Instagram</h3>
              <a href="https://instagram.com/rocknretroo" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-primary transition-colors">@{sections.contact.instagram}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
