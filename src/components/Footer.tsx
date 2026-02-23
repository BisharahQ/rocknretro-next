'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 pt-16 pb-8 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <Image src="/images/profile_hd.jpg" alt="Rock N Retro" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover" />
            <div>
              <span className="text-lg font-bold tracking-tighter uppercase leading-none block">Rock N Retro</span>
              <span className="text-[10px] tracking-[0.3em] text-primary uppercase">Thrift Shop</span>
            </div>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed">Authentic rock & metal merchandise, hand-picked in Amman, Jordan.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading text-lg tracking-wider uppercase mb-4 text-gold-accent">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <Link href="/shop" className="text-sm text-slate-500 hover:text-primary transition-colors">Shop All</Link>
            <Link href="/shop?cat=hoodies" className="text-sm text-slate-500 hover:text-primary transition-colors">Hoodies</Link>
            <Link href="/shop?cat=tees" className="text-sm text-slate-500 hover:text-primary transition-colors">Tees & Sweats</Link>
            <Link href="/shop?cat=boots" className="text-sm text-slate-500 hover:text-primary transition-colors">Dr. Martens</Link>
            <Link href="/shop?cat=jackets" className="text-sm text-slate-500 hover:text-primary transition-colors">Jackets</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading text-lg tracking-wider uppercase mb-4 text-gold-accent">Contact</h3>
          <div className="flex flex-col gap-2 text-sm text-slate-500">
            <a href="https://www.google.com/maps/search/Mecca+Street+Behind+Auto+Mall+Amman+Jordan" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Mecca St, Behind Auto Mall, Amman</a>
            <p>Sat&ndash;Thu: 11AM&ndash;9PM</p>
            <a href="https://instagram.com/rocknretroo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@rocknretroo</a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-heading text-lg tracking-wider uppercase mb-4 text-gold-accent">Newsletter</h3>
          <p className="text-sm text-slate-500 mb-4">Join the underground for early access to drops.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="bg-white/5 border border-white/10 rounded-lg focus:ring-primary focus:border-primary text-sm flex-1 px-4 py-2 text-bone placeholder:text-slate-600" placeholder="Email" type="email" />
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-600 uppercase tracking-widest">&copy; 2026 Rock N Retro Amman. Built for the loud.</p>
        <div className="flex gap-6">
          <Link className="text-[10px] uppercase tracking-widest text-slate-600 hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <Link className="text-[10px] uppercase tracking-widest text-slate-600 hover:text-primary transition-colors" href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
