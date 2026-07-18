import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ProductForm } from '@/components/admin/ProductForm';
import { StockEditModal } from '@/components/admin/StockEditModal';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/admin/products')({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<{ id: string; name: string; currentStock: number } | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const response = await api.get('/products?limit=50');
      return response.data.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await api.post('/products', productData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Product created successfully');
      setShowProductForm(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });

  const handleCreateProduct = (productData: any) => {
    createProductMutation.mutate(productData);
  };

  const updateStockMutation = useMutation({
    mutationFn: async ({ variantId, inventory }: { variantId: string; inventory: number }) => {
      const response = await api.patch(`/products/variants/${variantId}`, { inventory });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Stock updated successfully');
      setStockModalOpen(false);
      setSelectedVariant(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    },
  });

  const handleStockUpdate = (variantId: string, data: { inventory: number }) => {
    updateStockMutation.mutate({ variantId, inventory: data.inventory });
  };

  const openStockModal = (product: any, variant: any) => {
    setSelectedVariant({
      id: variant.id,
      name: product.name,
      currentStock: variant.inventory,
    });
    setStockModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-charcoal tracking-tight">Products</h2>
          <p className="text-sm text-neutral-500 mt-1">Manage your product catalog and inventory</p>
        </div>
        <Button className="flex items-center gap-2 font-bold uppercase tracking-wide bg-charcoal hover:bg-black text-white px-6 h-11" onClick={() => setShowProductForm(true)}>
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input className="pl-10 h-11 rounded-lg bg-neutral-50/50 font-medium" placeholder="Search products..." />
          </div>
          <Button variant="outline" className="flex items-center gap-2 sm:w-auto w-full h-11 rounded-lg font-bold">
            <Filter size={18} /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left">
            <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap rounded-tl-lg">Product</th>
                <th className="px-6 py-5 whitespace-nowrap">Status</th>
                <th className="px-6 py-5 whitespace-nowrap">Inventory</th>
                <th className="px-6 py-5 whitespace-nowrap">Price</th>
                <th className="px-6 py-5 text-right whitespace-nowrap rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 font-medium">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-2 border-neutral-200 border-t-charcoal rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : products?.map((product: any) => (
                <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200 shadow-sm">
                        {product.images?.[0] && (
                          <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-charcoal">{product.name}</p>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">{product.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={product.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm text-[10px]' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm text-[10px]'}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-base ${
                        (product.variants?.reduce((sum: number, v: any) => sum + v.inventory, 0) || 0) > 10 
                          ? 'text-charcoal' 
                          : (product.variants?.reduce((sum: number, v: any) => sum + v.inventory, 0) || 0) > 0 
                            ? 'text-amber-600' 
                            : 'text-red-600'
                      }`}>
                        {product.variants?.reduce((sum: number, v: any) => sum + v.inventory, 0) || 0}
                      </span>
                      <span className="text-neutral-500 font-medium">in stock</span>
                      <button 
                        onClick={() => product.variants?.[0] && openStockModal(product, product.variants[0])}
                        className="text-blue-600 hover:text-blue-700 font-bold ml-2 uppercase text-[10px] tracking-wider"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-charcoal text-base">
                    {formatCurrency(product.basePrice)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-neutral-100 flex items-center justify-between text-[13px] text-neutral-500 font-medium">
          <span>Showing {products?.length || 0} products</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="rounded-md font-bold">Previous</Button>
            <Button variant="outline" size="sm" className="rounded-md font-bold">Next</Button>
          </div>
        </div>
      </div>

      {showProductForm && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowProductForm(false)}
          categories={categories || []}
          isLoading={createProductMutation.isPending}
        />
      )}

      {selectedVariant && (
        <StockEditModal
          isOpen={stockModalOpen}
          onClose={() => {
            setStockModalOpen(false);
            setSelectedVariant(null);
          }}
          productName={selectedVariant.name}
          currentStock={selectedVariant.currentStock}
          variantId={selectedVariant.id}
          onUpdate={handleStockUpdate}
          isLoading={updateStockMutation.isPending}
        />
      )}
    </div>
  );
}
