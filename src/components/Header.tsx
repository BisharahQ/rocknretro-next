'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MobileMenu from './MobileMenu';
import CartSidebar from './CartSidebar';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, isOpen, setIsOpen } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className={`fixed top-0 z-50 w-full border-b px-6 lg:px-20 transition-all duration-500 ${
        scrolled
          ? 'bg-background-dark/90 backdrop-blur-xl border-primary/10 py-3'
          : 'bg-transparent border-transparent py-4'
      }`}>
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <Link className="flex items-center gap-3 group" href="/">
              <Image
                src="/images/profile_hd.jpg"
                alt="Rock N Retro"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-primary/30 group-hover:border-primary transition-colors object-cover"
              />
              <div>
                <span className="text-lg font-bold tracking-tighter uppercase leading-none block">Rock N Retro</span>
                <span className="text-[10px] tracking-[0.3em] text-primary uppercase">Thrift Shop</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <Link className={`text-sm font-medium uppercase tracking-widest transition-colors ${
                isActive('/') ? 'text-primary' : 'text-slate-400 hover:text-primary'
              }`} href="/">Home</Link>
              <Link className={`text-sm font-medium uppercase tracking-widest transition-colors ${
                pathname.startsWith('/shop') ? 'text-primary' : 'text-slate-400 hover:text-primary'
              }`} href="/shop">Shop</Link>
              <Link className="text-sm font-medium uppercase tracking-widest text-slate-400 hover:text-primary transition-colors" href="/#categories">Categories</Link>
              <Link className="text-sm font-medium uppercase tracking-widest text-slate-400 hover:text-primary transition-colors" href="/#story">Our Story</Link>
              <Link className="text-sm font-medium uppercase tracking-widest text-slate-400 hover:text-primary transition-colors" href="/#contact">Contact</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="hidden sm:flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/10 hover:border-primary/30 transition-colors">
              <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="text-sm text-slate-500">Search archive...</span>
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative p-2 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="lg:hidden p-2 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
