'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check auth status by trying to access a protected endpoint
    const checkAuth = () => {
      const isAuth = document.cookie.includes('rnr_admin');
      setAuthenticated(isAuth);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Connection error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl tracking-wider uppercase mb-2">Admin Panel</h1>
            <p className="text-sm text-slate-500">Enter the admin password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              autoFocus
            />
            {error && <p className="text-primary text-sm">{error}</p>}
            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { href: '/admin/sections', label: 'Sections', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8">
        {/* Admin header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-bone'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.label}
              </Link>
            ))}
          </div>
          <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-primary transition-colors">
            Logout
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
