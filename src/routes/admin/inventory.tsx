import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Search, AlertTriangle, ArrowUpDown, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/admin/inventory')({
  component: AdminInventoryPage,
});

function AdminInventoryPage() {
  const [search, setSearch] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-products-inventory'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });

  const products = response?.data || [];

  // Flatten all variants with product info
  const inventory = products.flatMap((product: any) =>
    (product.variants || []).map((variant: any) => ({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: variant.id,
      sku: variant.sku || `${product.slug}-${variant.color}-${variant.size}`.toUpperCase(),
      color: variant.color,
      size: variant.size,
      stock: variant.inventory ?? 0,
      image: product.images?.[0]?.url,
    }))
  );

  const filteredInventory = inventory.filter((item: any) =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.color.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = inventory.filter((i: any) => i.stock > 0 && i.stock <= 5).length;
  const outOfStockCount = inventory.filter((i: any) => i.stock === 0).length;
  const totalUnits = inventory.reduce((sum: number, i: any) => sum + i.stock, 0);

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">Out of Stock</Badge>;
    if (stock <= 5) return <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 border-amber-200 uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">Low Stock</Badge>;
    return <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">In Stock</Badge>;
  };

  if (isLoading) {
    return <div className="p-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Inventory</h1>
          <p className="text-sm text-neutral-500 mt-1">Track stock levels across all product variants</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
              <Package size={24} />
            </div>
            <span className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider">Total Units</span>
          </div>
          <p className="text-4xl font-black text-charcoal tracking-tight">{totalUnits.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
              <AlertTriangle size={24} />
            </div>
            <span className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider">Low Stock</span>
          </div>
          <p className="text-4xl font-black text-amber-600 tracking-tight">{lowStockCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-600">
              <AlertTriangle size={24} />
            </div>
            <span className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider">Out of Stock</span>
          </div>
          <p className="text-4xl font-black text-red-600 tracking-tight">{outOfStockCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <Input 
            placeholder="Search by product, SKU, or color..." 
            className="pl-10 h-11 bg-white border-neutral-200 rounded-lg shadow-sm font-medium" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Product</th>
                <th className="px-6 py-5 whitespace-nowrap">SKU</th>
                <th className="px-6 py-5 whitespace-nowrap">Color</th>
                <th className="px-6 py-5 whitespace-nowrap">Size</th>
                <th className="px-6 py-5 whitespace-nowrap">
                  <button className="flex items-center gap-1 hover:text-charcoal transition-colors font-bold uppercase">
                    Stock <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 font-medium">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item: any) => (
                  <tr key={item.variantId} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover bg-neutral-100" />
                        )}
                        <span className="font-bold text-charcoal">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500 font-medium">{item.sku}</td>
                    <td className="px-6 py-4 capitalize font-medium">{item.color}</td>
                    <td className="px-6 py-4 font-black">{item.size}</td>
                    <td className="px-6 py-4 font-black text-charcoal text-base">{item.stock}</td>
                    <td className="px-6 py-4">{getStockBadge(item.stock)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
