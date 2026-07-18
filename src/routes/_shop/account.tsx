import React from 'react';
import { createFileRoute, Outlet, Link, useLocation } from '@tanstack/react-router';
import { User, Package, MapPin, Heart, Settings, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/_shop/account')({
  component: AccountLayout,
});

function AccountLayout() {
  const { logout } = useAuthStore();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/account', icon: User, exact: true },
    { name: 'Orders', path: '/account/orders', icon: Package },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Notifications', path: '/account/notifications', icon: Bell },
    { name: 'Settings', path: '/account/settings', icon: Settings },
  ];

  return (
    <div className="min-h-[80vh] bg-neutral-50 pt-8 pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="heading-display text-3xl sm:text-4xl text-charcoal">
            My Account
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-sm shadow-sm border border-neutral-100 overflow-hidden">
              <nav className="flex flex-col">
                {links.map(link => {
                  const Icon = link.icon;
                  const isActive = link.exact 
                    ? location.pathname === link.path 
                    : location.pathname.startsWith(link.path);
                    
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-2 ${
                        isActive 
                          ? 'border-charcoal bg-neutral-50 text-charcoal' 
                          : 'border-transparent text-neutral-500 hover:bg-neutral-50 hover:text-charcoal'
                      }`}
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  );
                })}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-l-2 border-transparent text-left w-full"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}
