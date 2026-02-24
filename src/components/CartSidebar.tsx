'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-surface border-l border-white/10 flex flex-col cart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-heading text-2xl tracking-wider uppercase">Your Bag</h2>
          <button onClick={onClose} className="p-1 hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="text-slate-500 text-sm">Your bag is empty</p>
              <p className="text-slate-600 text-xs mt-1">Add some items to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-4 bg-white/5 rounded-lg p-3">
                <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.img}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                  <p className="text-xs text-slate-500">{item.product.type} &middot; {item.product.size}</p>
                  <p className="text-primary font-bold text-sm mt-1">{item.product.price} JOD</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-xs"
                    >-</button>
                    <span className="text-xs w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.product.stock ?? 1)}
                      className={`w-6 h-6 rounded flex items-center justify-center transition-colors text-xs ${
                        item.quantity >= (item.product.stock ?? 1)
                          ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                          : 'bg-white/10 hover:bg-primary/20'
                      }`}
                    >+</button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-slate-500 hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-primary">{totalPrice} JOD</span>
            </div>
            <button
              onClick={() => { onClose(); router.push('/checkout'); }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg uppercase tracking-wider text-sm transition-colors"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-slate-500 hover:text-primary transition-colors py-1"
            >
              Clear Bag
            </button>
          </div>
        )}
      </div>
    </>
  );
}
