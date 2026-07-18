import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const categories = response?.data || [];

  if (isLoading) {
    return <div className="p-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage product categories and collections</p>
        </div>
        <Button className="flex items-center gap-2 bg-charcoal hover:bg-black text-white font-bold tracking-wide rounded-lg px-5 py-2.5 shadow-sm transition-all">
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Name</th>
                <th className="px-6 py-5 whitespace-nowrap">Slug</th>
                <th className="px-6 py-5">Description</th>
                <th className="px-6 py-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((category: any) => (
                <tr key={category.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-charcoal">{category.name}</td>
                  <td className="px-6 py-4 text-neutral-500">{category.slug}</td>
                  <td className="px-6 py-4 text-neutral-500 truncate max-w-[250px]">{category.description || '-'}</td>
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
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500 font-medium">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
