'use client';

import { useState, useEffect } from 'react';
import { ShopSettings } from '@/types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  };

  if (!settings) {
    return <div className="animate-pulse text-slate-500">Loading...</div>;
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none';

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl tracking-wider uppercase">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Saved!
            </>
          ) : saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Reservation Policy */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <h2 className="font-heading text-xl tracking-wider uppercase mb-4 text-primary">Reservation Policy</h2>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Reservation Duration (Days)</label>
            <input
              type="number"
              value={settings.reservationDays}
              onChange={e => setSettings({
                ...settings,
                reservationDays: Math.max(1, Number(e.target.value)),
              })}
              min="1"
              max="30"
              step="1"
              className={inputClass}
            />
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Items will be reserved for {settings.reservationDays} day{settings.reservationDays !== 1 ? 's' : ''}.
            Expired reservations are automatically flagged and items become available again.
          </p>
        </div>
      </div>
    </div>
  );
}
