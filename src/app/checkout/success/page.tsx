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
          <h1 className="font-heading text-4xl tracking-wider uppercase mb-4">Order Not Found</h1>
          <Link href="/shop" className="text-primary hover:text-primary-dark transition-colors">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 lg:px-20 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-4xl lg:text-5xl tracking-wider uppercase mb-2">Order Confirmed!</h1>
        <p className="text-slate-400 mb-8">Order #{order.id} has been placed successfully.</p>

        {/* Order Summary */}
        <div className="bg-white/5 rounded-lg border border-white/5 p-6 text-left mb-6">
          <h2 className="font-heading text-lg tracking-wider uppercase text-primary mb-4">Order Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Type</span>
              <span className="capitalize">{order.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span>{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone</span>
              <span>{order.customer.phone}</span>
            </div>
            {order.type === 'delivery' && order.customer.city && (
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery to</span>
                <span>{order.customer.city}</span>
              </div>
            )}
            {order.type === 'delivery' && order.customer.address && (
              <div className="flex justify-between">
                <span className="text-slate-500">Address</span>
                <span className="text-right max-w-[200px]">{order.customer.address}</span>
              </div>
            )}
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

          {/* Totals */}
          <div className="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{order.subtotal.toFixed(2)} JOD</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span>{order.tax.toFixed(2)} JOD</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Delivery</span>
              <span>{order.deliveryFee > 0 ? `${order.deliveryFee.toFixed(2)} JOD` : 'Free'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
              <span>Total</span>
              <span className="text-primary">{order.total.toFixed(2)} JOD</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/5 rounded-lg border border-white/5 p-6 text-left text-sm text-slate-400 mb-8">
          {order.type === 'pickup' ? (
            <p>Pick up your order at <span className="text-bone">Muhammad Ali As-Saadi St. 24, Amman</span>. We&apos;ll contact you on <span className="text-bone">{order.customer.phone}</span> when your order is ready.</p>
          ) : (
            <p>We&apos;ll deliver your order to <span className="text-bone">{order.customer.city}</span>. Payment will be collected upon delivery. We&apos;ll contact you on <span className="text-bone">{order.customer.phone}</span> with delivery updates.</p>
          )}
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
