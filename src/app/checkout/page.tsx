'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShopSettings } from '@/types';

const JORDANIAN_CITIES = [
  'Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Salt', 'Mafraq',
  'Jerash', 'Madaba', 'Karak', 'Tafilah', "Ma'an", 'Ajloun',
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, setIsOpen } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+962');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
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

  const deliveryFee = orderType === 'delivery'
    ? (city === 'Amman' ? settings.deliveryFees.amman : city ? settings.deliveryFees.outside : 0)
    : 0;
  const taxAmount = settings.tax.enabled
    ? Math.round(totalPrice * settings.tax.rate) / 100
    : 0;
  const orderTotal = totalPrice + deliveryFee + taxAmount;

  const validatePhone = (p: string) => /^\+962\d{8,9}$/.test(p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid Jordanian phone number (e.g. +962791234567)');
      return;
    }
    if (orderType === 'delivery' && !city) {
      setError('Please select a city');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setError('Please enter your delivery address');
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
        ...(orderType === 'delivery' ? { city, address: address.trim(), notes: notes.trim() || undefined } : {}),
      },
      type: orderType,
      subtotal: totalPrice,
      deliveryFee,
      tax: taxAmount,
      total: orderTotal,
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
          <h1 className="font-heading text-3xl lg:text-4xl tracking-wider uppercase">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form - Left */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {/* Order Type */}
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Order Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-lg border text-sm font-bold uppercase tracking-wider transition-colors ${
                    orderType === 'delivery'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Delivery
                  <span className="block text-[10px] font-normal mt-0.5 opacity-60">
                    {settings.deliveryFees.amman}–{settings.deliveryFees.outside} JOD
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-lg border text-sm font-bold uppercase tracking-wider transition-colors ${
                    orderType === 'pickup'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Pickup
                  <span className="block text-[10px] font-normal mt-0.5 opacity-60">Free</span>
                </button>
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

            {/* Delivery Fields */}
            {orderType === 'delivery' && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/5 space-y-4">
                <h2 className="font-heading text-xl tracking-wider uppercase text-primary">Delivery Address</h2>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">City *</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-surface text-slate-500">Select city...</option>
                    {JORDANIAN_CITIES.map(c => (
                      <option key={c} value={c} className="bg-surface text-bone">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Address Details *</label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, building, floor, apartment..."
                    required
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder='e.g. "Ring twice", "Near X landmark"'
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Pickup Info */}
            {orderType === 'pickup' && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/5">
                <h2 className="font-heading text-xl tracking-wider uppercase text-primary mb-3">Pickup Info</h2>
                <p className="text-sm text-slate-400">
                  Pick up at our shop: <span className="text-bone">Muhammad Ali As-Saadi St. 24, Amman</span>
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Hours: <span className="text-bone">Sat–Thu: 11AM–9PM</span>
                </p>
                <p className="text-xs text-slate-500 mt-3">We&apos;ll contact you when your order is ready.</p>
              </div>
            )}

            {/* Payment Note */}
            <div className="bg-gold-accent/10 rounded-lg p-4 border border-gold-accent/20">
              <p className="text-sm text-gold-accent">
                <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                Payment will be collected upon {orderType === 'delivery' ? 'delivery' : 'pickup'}. Online payment coming soon.
              </p>
            </div>

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
              {loading ? 'Placing Order...' : `Place Order · ${orderTotal.toFixed(2)} JOD`}
            </button>
          </form>

          {/* Summary - Right */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <div className="bg-white/5 rounded-lg border border-white/5 p-6 lg:sticky lg:top-24">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Order Summary</h2>

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

              {/* Totals */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{totalPrice.toFixed(2)} JOD</span>
                </div>
                {settings.tax.enabled && (
                  <div className="flex justify-between text-slate-400">
                    <span>{settings.tax.label} ({settings.tax.rate}%)</span>
                    <span>{taxAmount.toFixed(2)} JOD</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Delivery</span>
                  <span>
                    {orderType === 'pickup'
                      ? 'Free'
                      : city
                        ? `${deliveryFee.toFixed(2)} JOD`
                        : 'Select city'
                    }
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-primary">{orderTotal.toFixed(2)} JOD</span>
                </div>
              </div>

              {/* Submit - Desktop */}
              <button
                type="submit"
                form=""
                disabled={loading}
                onClick={handleSubmit}
                className="hidden lg:block w-full mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
