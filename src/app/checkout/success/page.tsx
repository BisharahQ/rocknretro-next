'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { setOrder(data); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl tracking-wider uppercase mb-4">Reservation Not Found</h1>
          <Link href="/shop" className="text-primary hover:text-primary-dark transition-colors">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const reservedUntilDate = new Date(order.reservedUntil).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-900/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-4xl lg:text-5xl tracking-wider uppercase mb-2">Reservation Confirmed!</h1>
        <p className="text-slate-400 mb-2">Reservation #{order.id} has been placed successfully.</p>
        <p className="text-amber-500 font-bold text-sm mb-8">
          Reserved until {reservedUntilDate}
        </p>

        {/* Reservation Details */}
        <div className="bg-white/5 rounded-lg border border-white/5 p-6 text-left mb-6">
          <h2 className="font-heading text-lg tracking-wider uppercase text-primary mb-4">Reservation Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span>{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone</span>
              <span>{order.customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className="text-amber-500 font-medium capitalize">{order.status}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-400">{item.name} x{item.quantity}</span>
                <span>{item.price * item.quantity} JOD</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-white/10 mt-4 pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total (Cash at Pickup)</span>
              <span className="text-primary">{order.total.toFixed(2)} JOD</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-amber-500/10 rounded-lg border border-amber-500/20 p-6 text-left text-sm mb-8">
          <h3 className="font-bold text-amber-500 mb-3">What&apos;s Next?</h3>
          <ul className="space-y-2 text-amber-500/80">
            <li className="flex gap-2">
              <span className="text-amber-500">1.</span>
              Visit our shop at <span className="text-amber-500 font-medium">Muhammad Ali As-Saadi St. 24, Amman</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">2.</span>
              Mention your reservation number: <span className="text-amber-500 font-medium">#{order.id}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">3.</span>
              Pay <span className="text-amber-500 font-medium">{order.total.toFixed(2)} JOD</span> in cash
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500">4.</span>
              Pick up before <span className="text-amber-500 font-medium">{reservedUntilDate}</span>
            </li>
          </ul>
          <p className="text-xs text-amber-500/60 mt-3">
            Hours: Sat–Thu: 11AM–9PM · We&apos;ll contact you on {order.customer.phone} if needed.
          </p>
        </div>

        <Link href="/shop" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
