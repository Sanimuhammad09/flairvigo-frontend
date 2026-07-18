import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Search, Mail, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/admin/customers')({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const customers = [
    { id: '1', name: 'Jane Doe', email: 'jane@example.com', orders: 5, spent: 450.00, joined: '2026-01-15' },
    { id: '2', name: 'John Smith', email: 'john@example.com', orders: 2, spent: 120.00, joined: '2026-03-22' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Customers</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage user accounts and history</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input placeholder="Search customers..." className="pl-10 h-11 bg-white border-neutral-200 rounded-lg shadow-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Name</th>
                <th className="px-6 py-5 whitespace-nowrap">Email</th>
                <th className="px-6 py-5 whitespace-nowrap">Orders</th>
                <th className="px-6 py-5 whitespace-nowrap">Total Spent</th>
                <th className="px-6 py-5 whitespace-nowrap">Joined</th>
                <th className="px-6 py-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-charcoal">{c.name}</td>
                  <td className="px-6 py-4 text-neutral-500 font-medium">{c.email}</td>
                  <td className="px-6 py-4 font-bold">{c.orders}</td>
                  <td className="px-6 py-4 font-black text-charcoal">${c.spent.toFixed(2)}</td>
                  <td className="px-6 py-4 text-neutral-400 font-medium">{c.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Email Customer">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Block User">
                        <UserX size={16} />
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
