import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Eye } from 'lucide-react';

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalyticsPage,
});

const revenueData = [
  { month: 'Jan', revenue: 4200, orders: 32 },
  { month: 'Feb', revenue: 5100, orders: 41 },
  { month: 'Mar', revenue: 6800, orders: 55 },
  { month: 'Apr', revenue: 5900, orders: 48 },
  { month: 'May', revenue: 7200, orders: 62 },
  { month: 'Jun', revenue: 8100, orders: 71 },
  { month: 'Jul', revenue: 9400, orders: 83 },
];

const categoryData = [
  { name: 'Scrub Tops', value: 35 },
  { name: 'Scrub Bottoms', value: 28 },
  { name: 'Lab Coats', value: 18 },
  { name: 'Accessories', value: 12 },
  { name: 'Footwear', value: 7 },
];

const trafficData = [
  { day: 'Mon', visitors: 1200, pageViews: 3400 },
  { day: 'Tue', visitors: 1400, pageViews: 3900 },
  { day: 'Wed', visitors: 1100, pageViews: 3200 },
  { day: 'Thu', visitors: 1600, pageViews: 4100 },
  { day: 'Fri', visitors: 1800, pageViews: 4800 },
  { day: 'Sat', visitors: 2100, pageViews: 5600 },
  { day: 'Sun', visitors: 1900, pageViews: 5200 },
];

const COLORS = ['#111111', '#333333', '#666666', '#999999', '#cccccc'];

function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const stats = [
    { label: 'Total Revenue', value: '$46,700', change: '+12.5%', positive: true, icon: DollarSign, color: 'emerald' },
    { label: 'Total Orders', value: '392', change: '+8.2%', positive: true, icon: ShoppingBag, color: 'blue' },
    { label: 'Unique Visitors', value: '11,200', change: '+15.3%', positive: true, icon: Eye, color: 'indigo' },
    { label: 'Conversion Rate', value: '3.5%', change: '-0.4%', positive: false, icon: TrendingUp, color: 'orange' },
  ];

  const getColorClasses = (color: string, isUp: boolean) => {
    switch (color) {
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', trendBg: isUp ? 'text-emerald-600' : 'text-red-500' };
      case 'blue': return { bg: 'bg-blue-500/10', text: 'text-blue-600', trendBg: isUp ? 'text-emerald-600' : 'text-red-500' };
      case 'indigo': return { bg: 'bg-indigo-500/10', text: 'text-indigo-600', trendBg: isUp ? 'text-emerald-600' : 'text-red-500' };
      case 'orange': return { bg: 'bg-orange-500/10', text: 'text-orange-600', trendBg: isUp ? 'text-emerald-600' : 'text-red-500' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-600', trendBg: 'text-gray-500' };
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Analytics</h1>
          <p className="text-sm text-neutral-500 mt-1">Store performance and insights</p>
        </div>
        <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                period === p ? 'bg-charcoal text-white' : 'text-neutral-500 hover:text-charcoal hover:bg-neutral-50'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color, stat.positive);
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg} ${colors.text}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-charcoal tracking-tight mb-2">{stat.value}</p>
              <div className="flex items-center gap-1">
                {stat.positive ? (
                  <TrendingUp size={16} className={colors.trendBg} />
                ) : (
                  <TrendingDown size={16} className={colors.trendBg} />
                )}
                <span className={`text-[13px] font-semibold ${colors.trendBg}`}>
                  {stat.change}
                </span>
                <span className="text-[13px] text-neutral-400 font-normal ml-1">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
          <h3 className="text-lg font-bold text-charcoal mb-6">Revenue & Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ color: '#111', fontWeight: 'bold' }}
                labelStyle={{ color: '#666', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#111111" fill="url(#colorRevenue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
          <h3 className="text-lg font-bold text-charcoal mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-neutral-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-charcoal">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal mb-6">Website Traffic (This Week)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
              itemStyle={{ color: '#111', fontWeight: 'bold' }}
              labelStyle={{ color: '#666', marginBottom: '4px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="visitors" name="Unique Visitors" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="pageViews" name="Page Views" fill="#d4d4d4" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
