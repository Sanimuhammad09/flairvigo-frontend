import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  BarChart2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Box,
  Warehouse,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const sidebarGroups = [
  {
    title: 'Overview',
    links: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
      { name: 'Reports', path: '/admin/reports', icon: FileText },
    ]
  },
  {
    title: 'Store Management',
    links: [
      { name: 'Products', path: '/admin/products', icon: Package },
      { name: 'Categories', path: '/admin/categories', icon: Box },
      { name: 'Inventory', path: '/admin/inventory', icon: Warehouse },
    ]
  },
  {
    title: 'Sales & Customers',
    links: [
      { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
      { name: 'Customers', path: '/admin/customers', icon: Users },
      { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    ]
  },
  {
    title: 'System',
    links: [
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ]
  }
];

export function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate({ to: '/auth/login' });
  };

  const getActiveLinkName = () => {
    for (const group of sidebarGroups) {
      const activeLink = group.links.find(l => {
        if (l.exact) return location.pathname === l.path;
        return location.pathname.startsWith(l.path);
      });
      if (activeLink) return activeLink.name;
    }
    return 'Dashboard';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-charcoal text-white w-64 shrink-0 shadow-xl">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="font-heading font-black text-xl tracking-[0.2em] uppercase text-white">
          Flairvigo
        </Link>
        <span className="text-[10px] text-gold font-bold tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded">Admin</span>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        {sidebarGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-500 mb-3 px-2">
              {group.title}
            </h3>
            <div className="flex flex-col gap-1">
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact 
                  ? location.pathname === link.path 
                  : location.pathname.startsWith(link.path);
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/10 text-white font-bold' 
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-neutral-400'} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white border border-neutral-600">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'Admin User'}</p>
            <p className="text-[11px] text-neutral-400 truncate">{user?.email || 'admin@flairvigo.com'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-lg text-sm font-bold text-white bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-charcoal hover:bg-neutral-100 rounded-md transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-charcoal hidden sm:block tracking-tight">
              {getActiveLinkName()}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-500 hover:text-charcoal hover:bg-neutral-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
