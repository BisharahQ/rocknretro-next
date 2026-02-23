'use client';

import { useState, useEffect } from 'react';
import { SiteConfig } from '@/types';

export default function AdminSections() {
  const [sections, setSections] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/sections').then(r => r.json()).then(setSections);
  }, []);

  const handleSave = async () => {
    if (!sections) return;
    setSaving(true);
    setSaved(false);

    try {
      await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  };

  if (!sections) {
    return <div className="animate-pulse text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl tracking-wider uppercase">Edit Sections</h1>
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
        {/* Hero Section */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <h2 className="font-heading text-xl tracking-wider uppercase mb-4 text-primary">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Badge Text</label>
              <input
                type="text"
                value={sections.hero.badge}
                onChange={e => setSections({ ...sections, hero: { ...sections.hero, badge: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Subtitle</label>
              <textarea
                value={sections.hero.subtitle}
                onChange={e => setSections({ ...sections, hero: { ...sections.hero, subtitle: e.target.value } })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">CTA Button Text</label>
              <input
                type="text"
                value={sections.hero.cta}
                onChange={e => setSections({ ...sections, hero: { ...sections.hero, cta: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Marquee Section */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <h2 className="font-heading text-xl tracking-wider uppercase mb-4 text-primary">Marquee Bands</h2>
          <p className="text-xs text-slate-500 mb-3">Comma-separated list of band names for the scrolling ticker</p>
          <textarea
            value={sections.marquee.bands.join(', ')}
            onChange={e => setSections({
              ...sections,
              marquee: { ...sections.marquee, bands: e.target.value.split(',').map(b => b.trim()).filter(Boolean) }
            })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
          />
        </div>

        {/* Story Section */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <h2 className="font-heading text-xl tracking-wider uppercase mb-4 text-primary">Our Story</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                value={sections.story.title}
                onChange={e => setSections({ ...sections, story: { ...sections.story, title: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Content</label>
              <textarea
                value={sections.story.content}
                onChange={e => setSections({ ...sections, story: { ...sections.story, content: e.target.value } })}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/5">
          <h2 className="font-heading text-xl tracking-wider uppercase mb-4 text-primary">Contact Info</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  value={sections.contact.phone}
                  onChange={e => setSections({ ...sections, contact: { ...sections.contact, phone: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="text"
                  value={sections.contact.email}
                  onChange={e => setSections({ ...sections, contact: { ...sections.contact, email: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Address</label>
                <input
                  type="text"
                  value={sections.contact.address}
                  onChange={e => setSections({ ...sections, contact: { ...sections.contact, address: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Hours</label>
                <input
                  type="text"
                  value={sections.contact.hours}
                  onChange={e => setSections({ ...sections, contact: { ...sections.contact, hours: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Map URL</label>
              <input
                type="text"
                value={sections.contact.mapUrl}
                onChange={e => setSections({ ...sections, contact: { ...sections.contact, mapUrl: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Instagram Handle</label>
              <input
                type="text"
                value={sections.contact.instagram}
                onChange={e => setSections({ ...sections, contact: { ...sections.contact, instagram: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-bone focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
