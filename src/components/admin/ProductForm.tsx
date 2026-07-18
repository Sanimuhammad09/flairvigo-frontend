import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

const variantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  color: z.string().min(1, 'Color is required'),
  size: z.string().min(1, 'Size is required'),
  inventory: z.number().min(0, 'Inventory must be positive'),
  priceOffset: z.number().default(0),
});

const imageSchema = z.object({
  url: z.string().url('Invalid URL'),
  alt: z.string().optional(),
  isMain: z.boolean().default(false),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  basePrice: z.number().min(0, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  fabricDetails: z.string().optional(),
  careInstructions: z.string().optional(),
  isFeatured: z.boolean().default(false),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
  images: z.array(imageSchema).min(1, 'At least one image is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  categories: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

export function ProductForm({ onSubmit, onCancel, categories, isLoading }: ProductFormProps) {
  const [variants, setVariants] = useState([{ sku: '', color: '', size: '', inventory: 0, priceOffset: 0 }]);
  const [images, setImages] = useState([{ url: '', alt: '', isMain: true }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      variants,
      images,
    },
  });

  const addVariant = () => {
    setVariants([...variants, { sku: '', color: '', size: '', inventory: 0, priceOffset: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addImage = () => {
    setImages([...images, { url: '', alt: '', isMain: false }]);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some(img => img.isMain)) {
      updated[0].isMain = true;
    }
    setImages(updated);
  };

  const updateImage = (index: number, field: string, value: any) => {
    const updated = [...images];
    if (field === 'isMain') {
      updated.forEach((img, i) => img.isMain = i === index);
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setImages(updated);
  };

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit({ ...data, variants, images });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-charcoal">Add New Product</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-charcoal">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Product Name</label>
                <Input {...register('name')} placeholder="Enter product name" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                <Input {...register('slug')} placeholder="product-slug" />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Base Price ($)</label>
                <Input type="number" step="0.01" {...register('basePrice', { valueAsNumber: true })} />
                {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                <select {...register('categoryId')} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Fabric Details (Optional)</label>
                <Input {...register('fabricDetails')} placeholder="e.g., 100% Cotton" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Care Instructions (Optional)</label>
                <Input {...register('careInstructions')} placeholder="e.g., Machine wash cold" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4" />
              <label className="text-sm font-medium text-neutral-700">Featured Product</label>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">Variants (Stock)</h3>
              <Button type="button" onClick={addVariant} size="sm" variant="outline">
                <Plus size={16} className="mr-2" /> Add Variant
              </Button>
            </div>
            {variants.map((variant, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">Variant {index + 1}</span>
                  {variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">SKU</label>
                    <Input value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="SKU" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Color</label>
                    <Input value={variant.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} placeholder=" Navy" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Size</label>
                    <Input value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} placeholder="S" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Inventory</label>
                    <Input type="number" value={variant.inventory} onChange={(e) => updateVariant(index, 'inventory', parseInt(e.target.value) || 0)} placeholder="0" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal">Images</h3>
              <Button type="button" onClick={addImage} size="sm" variant="outline">
                <Plus size={16} className="mr-2" /> Add Image
              </Button>
            </div>
            {images.map((image, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">Image {index + 1}</span>
                  {images.length > 1 && (
                    <button type="button" onClick={() => removeImage(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Image URL</label>
                    <Input value={image.url} onChange={(e) => updateImage(index, 'url', e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Alt Text (Optional)</label>
                    <Input value={image.alt} onChange={(e) => updateImage(index, 'alt', e.target.value)} placeholder="Alt text" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={image.isMain}
                    onChange={(e) => updateImage(index, 'isMain', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium text-neutral-700">Main Image</label>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
