import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const stockUpdateSchema = z.object({
  inventory: z.number().min(0, 'Inventory must be positive'),
});

type StockUpdateData = z.infer<typeof stockUpdateSchema>;

interface StockEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentStock: number;
  variantId: string;
  onUpdate: (variantId: string, data: StockUpdateData) => void;
  isLoading?: boolean;
}

export function StockEditModal({ 
  isOpen, 
  onClose, 
  productName, 
  currentStock, 
  variantId,
  onUpdate,
  isLoading 
}: StockEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StockUpdateData>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: { inventory: currentStock },
  });

  const onSubmit = (data: StockUpdateData) => {
    onUpdate(variantId, data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-charcoal">Update Stock</h2>
            <p className="text-sm text-neutral-500 mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Current Stock: <span className="font-semibold">{currentStock}</span>
            </label>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              New Stock Level
            </label>
            <Input
              type="number"
              min="0"
              {...register('inventory', { valueAsNumber: true })}
              className="text-lg"
              placeholder="Enter new stock quantity"
            />
            {errors.inventory && (
              <p className="text-red-500 text-sm mt-1">{errors.inventory.message}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Quick Actions:</strong>
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => reset({ inventory: currentStock + 10 })}
                className="text-xs"
              >
                +10
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => reset({ inventory: currentStock + 50 })}
                className="text-xs"
              >
                +50
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => reset({ inventory: currentStock + 100 })}
                className="text-xs"
              >
                +100
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              <Save size={16} />
              {isLoading ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
