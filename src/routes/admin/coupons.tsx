import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export const Route = createFileRoute('/admin/coupons')({
  component: AdminCouponsPage,
});

function AdminCouponsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons');
      return data;
    },
  });

  const coupons = response?.data || [];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Coupons</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage discount codes and promotions</p>
        </div>
        <Button className="flex items-center gap-2 bg-charcoal hover:bg-black text-white font-bold tracking-wide rounded-lg px-5 py-2.5 shadow-sm transition-all">
          <Plus size={18} /> Create Coupon
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Code</th>
                <th className="px-6 py-5 whitespace-nowrap">Type</th>
                <th className="px-6 py-5 whitespace-nowrap">Value</th>
                <th className="px-6 py-5 whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-neutral-500 font-medium">Loading...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-neutral-500 font-medium">No coupons found.</td></tr>
              ) : coupons.map((coupon: any) => (
                <tr key={coupon.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-black tracking-wider text-charcoal">{coupon.code}</td>
                  <td className="px-6 py-4 capitalize font-medium">{coupon.type}</td>
                  <td className="px-6 py-4 font-bold text-charcoal">{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${coupon.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-2 text-neutral-400 hover:text-charcoal hover:bg-neutral-100 rounded-md transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
