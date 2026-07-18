import React, { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, CheckCircle2, Tag, X } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/_shop/checkout/')({
  component: CheckoutPage,
});

const shippingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address1: z.string().min(5, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});

type ShippingInput = z.infer<typeof shippingSchema>;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [step, setStep] = useState<1 | 2>(1); // 1: Shipping, 2: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      country: 'US',
    }
  });

  // Calculate totals
  const subtotal = totalPrice();
  const discount = appliedCoupon?.discountAmount || 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingCost = discountedSubtotal > 50 ? 0 : 8.95;
  const tax = discountedSubtotal * 0.08; // Mock 8% tax
  const total = discountedSubtotal + shippingCost + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        orderValue: subtotal,
      });
      applyCoupon(response.data.data.coupon.code, response.data.data.discountAmount);
      setCouponCode('');
      toast.success('Coupon applied!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-ivory">
        <h2 className="text-2xl font-bold text-charcoal mb-4">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8">You need items in your cart to checkout.</p>
        <Link to="/">
          <Button size="lg">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleContinueToPayment = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const shippingData = getValues();
      
      // Real app: This would call Stripe or backend to process payment
      // Here we mock the order creation
      const response = await api.post('/orders', {
        items: items.map(i => ({
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.price
        })),
        shippingAddress: shippingData,
        subtotal,
        tax,
        shippingCost,
        discountAmount: discount,
        couponCode: appliedCoupon?.code,
        total,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate({ 
        to: '/checkout/success',
        search: { orderId: response.data.data.id }
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-8 pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="font-heading font-black text-2xl tracking-[0.2em] uppercase text-charcoal">
            Flairvigo
          </Link>
          <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
            <span className={step === 1 ? 'text-charcoal font-bold' : ''}>Shipping</span>
            <ChevronRight size={16} />
            <span className={step === 2 ? 'text-charcoal font-bold' : ''}>Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content Area (Left) */}
          <div className="w-full lg:w-3/5 space-y-8">
            
            {/* Step 1: Shipping Address */}
            <div className={`bg-white p-6 sm:p-8 rounded-sm shadow-sm border ${step === 1 ? 'border-charcoal/20' : 'border-transparent'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-charcoal flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center text-sm">1</span>
                  Shipping Information
                </h2>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-sm font-semibold text-charcoal hover:underline">
                    Edit
                  </button>
                )}
              </div>

              <AnimatePresence>
                {step === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {!isAuthenticated && (
                      <div className="pb-4 mb-4 border-b border-neutral-100 flex items-center justify-between">
                        <p className="text-sm text-neutral-600">Already have an account?</p>
                        <Link to="/auth/login" className="text-sm font-semibold text-charcoal hover:underline">Log in</Link>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input placeholder="First Name" {...register('firstName')} className={errors.firstName ? 'border-red-500' : ''} />
                        {errors.firstName && <span className="text-xs text-red-500 mt-1">{errors.firstName.message}</span>}
                      </div>
                      <div>
                        <Input placeholder="Last Name" {...register('lastName')} className={errors.lastName ? 'border-red-500' : ''} />
                        {errors.lastName && <span className="text-xs text-red-500 mt-1">{errors.lastName.message}</span>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input placeholder="Email Address" type="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                        {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
                      </div>
                      <div>
                        <Input placeholder="Phone Number" type="tel" {...register('phone')} className={errors.phone ? 'border-red-500' : ''} />
                        {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone.message}</span>}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Input placeholder="Address Line 1" {...register('address1')} className={errors.address1 ? 'border-red-500' : ''} />
                      {errors.address1 && <span className="text-xs text-red-500 mt-1">{errors.address1.message}</span>}
                    </div>

                    <div>
                      <Input placeholder="Address Line 2 (Optional)" {...register('address2')} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <Input placeholder="City" {...register('city')} className={errors.city ? 'border-red-500' : ''} />
                        {errors.city && <span className="text-xs text-red-500 mt-1">{errors.city.message}</span>}
                      </div>
                      <div className="col-span-1">
                        <Input placeholder="State / Province" {...register('state')} className={errors.state ? 'border-red-500' : ''} />
                        {errors.state && <span className="text-xs text-red-500 mt-1">{errors.state.message}</span>}
                      </div>
                      <div className="col-span-1">
                        <Input placeholder="ZIP / Postal" {...register('zipCode')} className={errors.zipCode ? 'border-red-500' : ''} />
                        {errors.zipCode && <span className="text-xs text-red-500 mt-1">{errors.zipCode.message}</span>}
                      </div>
                    </div>

                    <Button className="w-full mt-6" size="lg" onClick={handleContinueToPayment}>
                      Continue to Payment
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-sm border border-neutral-100"
                  >
                    <p className="font-medium text-charcoal">{getValues().firstName} {getValues().lastName}</p>
                    <p>{getValues().address1} {getValues().address2}</p>
                    <p>{getValues().city}, {getValues().state} {getValues().zipCode}</p>
                    <p>{getValues().email} • {getValues().phone}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-white p-6 sm:p-8 rounded-sm shadow-sm border ${step === 2 ? 'border-charcoal/20' : 'border-transparent opacity-60 pointer-events-none'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-charcoal flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-charcoal text-white' : 'bg-neutral-200 text-neutral-500'}`}>2</span>
                  Payment
                </h2>
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Lock size={12} /> Secure encrypted
                </div>
              </div>

              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-4 border-2 border-charcoal rounded-sm bg-neutral-50 relative">
                    <div className="absolute top-4 right-4 flex gap-1">
                      {/* Mock CC icons */}
                      <div className="w-8 h-5 bg-blue-600 rounded-[2px]" />
                      <div className="w-8 h-5 bg-orange-500 rounded-[2px]" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-4 h-4 rounded-full border-[5px] border-charcoal bg-white" />
                      <span className="font-semibold text-charcoal">Credit Card</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">Card Number</label>
                        <Input placeholder="0000 0000 0000 0000" className="bg-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">Expiration</label>
                          <Input placeholder="MM / YY" className="bg-white" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">CVC</label>
                          <Input placeholder="123" className="bg-white" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1 block">Name on Card</label>
                        <Input placeholder={getValues().firstName + ' ' + getValues().lastName} className="bg-white" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing Securely...' : `Pay ${formatCurrency(total)}`}
                  </Button>
                  
                  <p className="text-xs text-center text-neutral-500 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> Your payment information is encrypted and secure.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Order Summary Sidebar (Right) */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
              <h3 className="font-bold text-lg text-charcoal mb-4">Order Summary</h3>
              
              <div className="max-h-80 overflow-y-auto mb-6 pr-2 space-y-4">
                {items.map(item => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-16 h-20 bg-neutral-100 shrink-0 border border-neutral-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-charcoal line-clamp-2">{item.name}</p>
                      <p className="text-neutral-500 mt-1">{item.color} / {item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-neutral-500">Qty: {item.quantity}</span>
                        <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                      
                      {item.hasEmbroidery && (
                        <div className="mt-2 text-xs bg-white p-2 rounded-sm border border-neutral-100">
                          <span className="font-semibold text-charcoal">Embroidery:</span> "{item.embroideryText}" ({item.embroideryFont}, {item.embroideryColor})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 py-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-neutral-50 px-3 py-2 border border-neutral-100 rounded-sm">
                    <div className="flex items-center gap-2 text-sm text-charcoal font-medium">
                      <Tag size={14} className="text-neutral-500" />
                      {appliedCoupon.code}
                    </div>
                    <button onClick={removeCoupon} className="text-neutral-400 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Discount code" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)} 
                    />
                    <Button 
                      variant="secondary" 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal ({totalItems()} items)</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-semibold">{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Tax</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="border-t border-charcoal mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-lg text-charcoal">Total</span>
                <span className="font-bold text-2xl text-charcoal">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
