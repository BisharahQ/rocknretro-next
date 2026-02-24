'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Order } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  reserved: 'bg-amber-900/30 text-amber-400',
  picked_up: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
  expired: 'bg-slate-700/30 text-slate-400',
};

const STATUS_LABELS: Record<string, string> = {
  reserved: 'Reserved',
  picked_up: 'Picked Up',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [extendDays, setExtendDays] = useState(1);

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

  const extendReservation = async (orderId: number, days: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Extend from current reservedUntil date (or now if already expired)
    const baseDate = new Date(order.reservedUntil) > new Date()
      ? new Date(order.reservedUntil)
      : new Date();
    baseDate.setDate(baseDate.getDate() + days);

    const updates: Record<string, string> = {
      reservedUntil: baseDate.toISOString(),
    };
    // If expired, re-activate as reserved
    if (order.status === 'expired') {
      updates.status = 'reserved';
    }

    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    loadOrders();
    setSelectedOrder(prev => prev?.id === orderId
      ? { ...prev, reservedUntil: baseDate.toISOString(), status: (updates.status || prev.status) as Order['status'] }
      : prev
    );
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const isOverdue = (order: Order) => {
    return order.status === 'reserved' && new Date(order.reservedUntil) < new Date();
  };

  const formatReservedUntil = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wider uppercase mb-8">Reservations</h1>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'reserved', 'picked_up', 'cancelled', 'expired'].map(s => (
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
          <p className="text-slate-500">No reservations yet</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Reserved Until</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(order => (
                  <tr key={order.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isOverdue(order) ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{order.items.length}</td>
                    <td className="px-4 py-3 text-primary font-medium">{order.total.toFixed(2)} JOD</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs ${
                      order.status === 'expired' || isOverdue(order) ? 'text-red-400' :
                      order.status === 'reserved' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {formatReservedUntil(order.reservedUntil)}
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

      <p className="text-xs text-slate-600 mt-4">{sorted.length} reservation{sorted.length !== 1 ? 's' : ''}</p>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-surface border-l border-white/10 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-heading text-2xl tracking-wider uppercase">Reservation #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[selectedOrder.status]}`}>
                  {STATUS_LABELS[selectedOrder.status]}
                </span>
                <span className={`text-sm ${
                  new Date(selectedOrder.reservedUntil) < new Date() && selectedOrder.status === 'reserved'
                    ? 'text-red-400' : 'text-slate-400'
                }`}>
                  Until {formatReservedUntil(selectedOrder.reservedUntil)}
                </span>
              </div>

              {/* Action Buttons */}
              {(selectedOrder.status === 'reserved' || selectedOrder.status === 'expired') && (
                <div className="space-y-3">
                  {selectedOrder.status === 'reserved' && (
                    <button
                      onClick={() => updateStatus(selectedOrder.id, 'picked_up')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Mark as Picked Up
                    </button>
                  )}

                  {/* Extend Reservation */}
                  <div className="flex gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3].map(d => (
                        <button
                          key={d}
                          onClick={() => extendReservation(selectedOrder.id, d)}
                          className="flex-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          +{d}d
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={extendDays}
                        onChange={e => setExtendDays(Number(e.target.value))}
                        className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-bone text-center outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => extendReservation(selectedOrder.id, extendDays)}
                        className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Extend
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'cancelled')}
                    className="w-full bg-red-900/20 hover:bg-red-900/30 text-red-400 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}

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

              {/* Total */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{selectedOrder.total.toFixed(2)} JOD</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Cash at pickup</p>
              </div>

              {/* Date */}
              <p className="text-xs text-slate-600 text-center">
                Reserved {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
