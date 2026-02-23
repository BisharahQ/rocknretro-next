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
        {/* Delivery Fees */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <h2 className="font-heading text-xl tracking-wider uppercase mb-4 text-primary">Delivery Fees</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Amman (JOD)</label>
              <input
                type="number"
                value={settings.deliveryFees.amman}
                onChange={e => setSettings({
                  ...settings,
                  deliveryFees: { ...settings.deliveryFees, amman: Number(e.target.value) }
                })}
                min="0"
                step="0.5"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Outside Amman (JOD)</label>
              <input
                type="number"
                value={settings.deliveryFees.outside}
                onChange={e => setSettings({
                  ...settings,
                  deliveryFees: { ...settings.deliveryFees, outside: Number(e.target.value) }
                })}
                min="0"
                step="0.5"
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">Pickup is always free. These fees apply to delivery orders only.</p>
        </div>

        {/* Tax */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl tracking-wider uppercase text-primary">Tax</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tax.enabled}
                onChange={e => setSettings({
                  ...settings,
                  tax: { ...settings.tax, enabled: e.target.checked }
                })}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-slate-400">{settings.tax.enabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
          <div className={`grid grid-cols-2 gap-4 ${!settings.tax.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Rate (%)</label>
              <input
                type="number"
                value={settings.tax.rate}
                onChange={e => setSettings({
                  ...settings,
                  tax: { ...settings.tax, rate: Number(e.target.value) }
                })}
                min="0"
                max="100"
                step="0.5"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Label</label>
              <input
                type="text"
                value={settings.tax.label}
                onChange={e => setSettings({
                  ...settings,
                  tax: { ...settings.tax, label: e.target.value }
                })}
                placeholder="e.g. GST, VAT, Sales Tax"
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            {settings.tax.enabled
              ? `${settings.tax.label} at ${settings.tax.rate}% will be added to all orders.`
              : 'Tax is currently disabled. No tax will be added to orders.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
