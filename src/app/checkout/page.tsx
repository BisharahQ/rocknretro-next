'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShopSettings } from '@/types';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, setIsOpen } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+962');
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);

  // Close cart sidebar when arriving at checkout
  useEffect(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-20 h-20 text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <h1 className="font-heading text-4xl tracking-wider uppercase mb-4">Your Bag is Empty</h1>
          <p className="text-slate-400 mb-6">Add some items before checking out.</p>
          <Link href="/shop" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors inline-block">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  const validatePhone = (p: string) => /^\+962\d{8,9}$/.test(p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid Jordanian phone number (e.g. +962791234567)');
      return;
    }
    if (!acknowledged) {
      setError('Please acknowledge the reservation terms');
      return;
    }

    setLoading(true);

    const orderData = {
      items: items.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.img,
      })),
      customer: {
        name: name.trim(),
        phone,
      },
      subtotal: totalPrice,
      total: totalPrice,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      const order = await res.json();
      clearCart();
      router.push(`/checkout/success?id=${order.id}`);
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none';

  return (
    <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/shop" className="text-slate-500 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="font-heading text-3xl lg:text-4xl tracking-wider uppercase">Reserve Items</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form - Left */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {/* Reservation Info Banner */}
            <div className="bg-amber-500/10 rounded-lg p-5 border border-amber-500/20">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                <div>
                  <p className="text-sm text-amber-500 font-bold mb-1">Cash Only — Pickup Reservation</p>
                  <p className="text-sm text-amber-500/80">
                    Items will be reserved for <span className="font-bold text-amber-500">{settings.reservationDays} day{settings.reservationDays !== 1 ? 's' : ''}</span>.
                    Payment is cash only, collected when you pick up at our shop.
                    Unclaimed reservations will expire automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/5 space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase text-primary">Your Details</h2>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+962791234567"
                  required
                  className={inputClass}
                />
                <p className="text-[10px] text-slate-600 mt-1">Jordanian number starting with +962</p>
              </div>
            </div>

            {/* Pickup Info */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/5">
              <h2 className="font-heading text-xl tracking-wider uppercase text-primary mb-3">Pickup Location</h2>
              <p className="text-sm text-slate-400">
                <span className="text-bone">Muhammad Ali As-Saadi St. 24, Amman</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Hours: <span className="text-bone">Sat–Thu: 11AM–9PM</span>
              </p>
            </div>

            {/* Acknowledgment Checkbox */}
            <label className="flex gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={e => setAcknowledged(e.target.checked)}
                className="accent-primary w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                I understand that my items will be reserved for <span className="text-bone font-medium">{settings.reservationDays} day{settings.reservationDays !== 1 ? 's' : ''}</span> and
                payment is <span className="text-bone font-medium">cash only</span> at pickup. If I don&apos;t pick up within this period, the reservation will expire and items will become available again.
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-primary">{error}</p>
              </div>
            )}

            {/* Submit - Mobile */}
            <button
              type="submit"
              disabled={loading}
              className="w-full lg:hidden bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Reserving...' : `Reserve Items · ${totalPrice.toFixed(2)} JOD`}
            </button>
          </form>

          {/* Summary - Right */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <div className="bg-white/5 rounded-lg border border-white/5 p-6 lg:sticky lg:top-24">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Reservation Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0">
                      <Image src={item.product.img} alt={item.product.name} fill className="object-cover" sizes="56px" />
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-500">{item.product.size}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-300">{item.product.price * item.quantity} JOD</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{totalPrice.toFixed(2)} JOD</span>
                </div>
                <p className="text-[10px] text-slate-600">Cash payment at pickup</p>
              </div>

              {/* Submit - Desktop */}
              <button
                type="submit"
                form=""
                disabled={loading}
                onClick={handleSubmit}
                className="hidden lg:block w-full mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Reserving...' : 'Reserve Items'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
