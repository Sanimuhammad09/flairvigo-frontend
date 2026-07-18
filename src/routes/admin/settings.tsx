import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Store Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure global store preferences</p>
        </div>
        <Button className="flex items-center gap-2 font-bold uppercase tracking-wide bg-charcoal hover:bg-black text-white px-6 h-11">
          <Save size={18} /> Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm">
          <h2 className="text-xl font-bold text-charcoal mb-6 tracking-tight">General</h2>
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-2">Store Name</label>
              <Input defaultValue="Flairvigo" className="h-11 bg-neutral-50/50 border-neutral-200 rounded-lg font-medium" />
            </div>
            <div>
              <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-2">Contact Email</label>
              <Input defaultValue="support@flairvigo.com" className="h-11 bg-neutral-50/50 border-neutral-200 rounded-lg font-medium" />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm">
          <h2 className="text-xl font-bold text-charcoal mb-6 tracking-tight">Shipping & Taxes</h2>
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-2">Flat Rate Shipping Cost ($)</label>
              <Input type="number" defaultValue="8.95" className="h-11 bg-neutral-50/50 border-neutral-200 rounded-lg font-medium" />
            </div>
            <div>
              <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-2">Free Shipping Threshold ($)</label>
              <Input type="number" defaultValue="50.00" className="h-11 bg-neutral-50/50 border-neutral-200 rounded-lg font-medium" />
            </div>
            <div>
              <label className="text-sm font-bold text-charcoal uppercase tracking-wider block mb-2">Base Tax Rate (%)</label>
              <Input type="number" defaultValue="8" className="h-11 bg-neutral-50/50 border-neutral-200 rounded-lg font-medium" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
