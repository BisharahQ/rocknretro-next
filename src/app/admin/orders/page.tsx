'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Order } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  confirmed: 'bg-blue-900/30 text-blue-400',
  shipped: 'bg-purple-900/30 text-purple-400',
  ready: 'bg-purple-900/30 text-purple-400',
  delivered: 'bg-green-900/30 text-green-400',
  picked_up: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  picked_up: 'Picked Up',
  cancelled: 'Cancelled',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = () => {
    fetch('/api/orders').then(r => r.json()).then(setOrders);
  };

  useEffect(() => { loadOrders(); }, []);

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const updateStatus = async (orderId: number, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wider uppercase mb-8">Orders</h1>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'shipped', 'ready', 'delivered', 'picked_up', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              filterStatus === s
                ? 'bg-primary text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]}
            {s !== 'all' && (
              <span className="ml-1.5 opacity-60">
                ({orders.filter(o => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {sorted.length === 0 ? (
        <div className="bg-white/5 rounded-lg border border-white/5 p-12 text-center">
          <p className="text-slate-500">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-400">{order.type}</td>
                    <td className="px-4 py-3 text-slate-400">{order.items.length}</td>
                    <td className="px-4 py-3 text-primary font-medium">{order.total.toFixed(2)} JOD</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-slate-400 hover:text-primary transition-colors text-xs underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600 mt-4">{sorted.length} order{sorted.length !== 1 ? 's' : ''}</p>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-surface border-l border-white/10 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-heading text-2xl tracking-wider uppercase">Order #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer"
                >
                  {(selectedOrder.type === 'delivery'
                    ? ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
                    : ['pending', 'confirmed', 'ready', 'picked_up', 'cancelled']
                  ).map(s => (
                    <option key={s} value={s} className="bg-surface text-bone">{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Customer */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-2 text-sm">
                <h3 className="font-heading text-lg tracking-wider uppercase text-primary mb-2">Customer</h3>
                <div className="flex justify-between">
                  <span className="text-slate-500">Name</span>
                  <span>{selectedOrder.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span>{selectedOrder.customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Type</span>
                  <span className="capitalize">{selectedOrder.type}</span>
                </div>
                {selectedOrder.customer.city && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">City</span>
                    <span>{selectedOrder.customer.city}</span>
                  </div>
                )}
                {selectedOrder.customer.address && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address</span>
                    <span className="text-right max-w-[200px]">{selectedOrder.customer.address}</span>
                  </div>
                )}
                {selectedOrder.customer.notes && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notes</span>
                    <span className="text-right max-w-[200px] text-gold-accent">{selectedOrder.customer.notes}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                <h3 className="font-heading text-lg tracking-wider uppercase text-primary mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{item.price * item.quantity} JOD</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{selectedOrder.subtotal.toFixed(2)} JOD</span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Tax</span>
                    <span>{selectedOrder.tax.toFixed(2)} JOD</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Delivery</span>
                  <span>{selectedOrder.deliveryFee > 0 ? `${selectedOrder.deliveryFee.toFixed(2)} JOD` : 'Free'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-primary">{selectedOrder.total.toFixed(2)} JOD</span>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-slate-600 text-center">
                Placed {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
