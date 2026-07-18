import React from 'react';
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, Settings, LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_shop/account/')({
  component: AccountDashboard,
});

function AccountDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    navigate({ to: '/auth/login' });
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-neutral-100">
        <h2 className="text-xl font-bold text-charcoal mb-6">Account Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-500 mb-4">Profile Information</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-neutral-500">Name:</span> <span className="font-medium text-charcoal">{user.firstName} {user.lastName}</span></p>
              <p><span className="text-neutral-500">Email:</span> <span className="font-medium text-charcoal">{user.email}</span></p>
            </div>
            <Button variant="outline" className="mt-6" size="sm">Edit Profile</Button>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-500 mb-4">Default Address</h3>
            <div className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-sm border border-neutral-100">
              <p>You haven't set a default address yet.</p>
            </div>
            <Button variant="outline" className="mt-6" size="sm">Manage Addresses</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-charcoal">
            <Package size={24} />
          </div>
          <h3 className="font-bold text-charcoal mb-2">Recent Orders</h3>
          <p className="text-sm text-neutral-500 mb-6">Track, return, or buy items again.</p>
          <Link to="/account/orders" className="mt-auto">
            <Button variant="secondary" className="w-full">View Orders</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-charcoal">
            <Heart size={24} />
          </div>
          <h3 className="font-bold text-charcoal mb-2">Wishlist</h3>
          <p className="text-sm text-neutral-500 mb-6">View and manage your saved items.</p>
          <Link to="/account/wishlist" className="mt-auto">
            <Button variant="secondary" className="w-full">View Wishlist</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
