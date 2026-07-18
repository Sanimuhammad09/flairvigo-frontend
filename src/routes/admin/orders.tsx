import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Eye, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  // Mock data for orders
  const orders = [
    { id: 'ORD-1001', customer: 'Jane Doe', date: '2026-07-14', total: 125.00, status: 'PAID' },
    { id: 'ORD-1002', customer: 'John Smith', date: '2026-07-13', total: 89.95, status: 'PENDING' },
    { id: 'ORD-1003', customer: 'Sarah Connor', date: '2026-07-12', total: 210.50, status: 'SHIPPED' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">View and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Order ID</th>
                <th className="px-6 py-5 whitespace-nowrap">Customer</th>
                <th className="px-6 py-5 whitespace-nowrap">Date</th>
                <th className="px-6 py-5 whitespace-nowrap">Total</th>
                <th className="px-6 py-5 whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-charcoal">{order.id}</td>
                  <td className="px-6 py-4 font-bold">{order.customer}</td>
                  <td className="px-6 py-4 text-neutral-500 font-medium">{order.date}</td>
                  <td className="px-6 py-4 font-black text-charcoal">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={order.status === 'PAID' ? 'default' : 'secondary'} className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}`}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="h-8 font-bold border-neutral-200 hover:bg-neutral-50 hover:text-charcoal transition-colors">
                      <Eye size={14} className="mr-2" /> View
                    </Button>
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
