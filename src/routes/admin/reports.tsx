import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Download, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export const Route = createFileRoute('/admin/reports')({
  component: AdminReportsPage,
});

const reportTypes = [
  {
    id: 'sales',
    title: 'Sales Report',
    description: 'Revenue, orders, and average order value breakdown.',
    icon: FileText,
  },
  {
    id: 'products',
    title: 'Product Performance',
    description: 'Top sellers, low performers, and inventory turn rate.',
    icon: FileText,
  },
  {
    id: 'customers',
    title: 'Customer Report',
    description: 'New vs returning customers, lifetime value, and retention.',
    icon: FileText,
  },
  {
    id: 'inventory',
    title: 'Inventory Report',
    description: 'Stock levels, reorder alerts, and dead stock identification.',
    icon: FileText,
  },
];

function AdminReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId);
    setTimeout(() => {
      setGenerating(null);
      // In production, this would trigger an API call to generate a CSV/PDF
      alert(`${reportId} report generated! In production this would download a file.`);
    }, 2000);
  };

  // Mock recent reports
  const recentReports = [
    { name: 'sales-report-jul-2026.csv', date: '2026-07-14', size: '45 KB' },
    { name: 'product-performance-jun-2026.csv', date: '2026-06-30', size: '38 KB' },
    { name: 'inventory-report-jun-2026.csv', date: '2026-06-28', size: '22 KB' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Reports</h1>
          <p className="text-sm text-neutral-500 mt-1">Generate and download store reports</p>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-charcoal shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-lg tracking-tight">{report.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1 font-medium">{report.description}</p>
                </div>
              </div>
              <div className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-11 font-bold border-neutral-200 hover:bg-neutral-50 hover:text-charcoal transition-colors"
                  onClick={() => handleGenerate(report.id)}
                  disabled={generating === report.id}
                >
                  {generating === report.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-300 border-t-charcoal rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={18} /> Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-charcoal mb-4 tracking-tight">Recent Reports</h2>
        <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-5 whitespace-nowrap">File Name</th>
                  <th className="px-6 py-5 whitespace-nowrap">Date</th>
                  <th className="px-6 py-5 whitespace-nowrap">Size</th>
                  <th className="px-6 py-5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentReports.map((report) => (
                  <tr key={report.name} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <FileText size={16} className="text-neutral-400" />
                      <span className="font-bold text-charcoal">{report.name}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-neutral-400" /> {report.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-medium">{report.size}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" className="h-8 gap-2 font-bold border-neutral-200 hover:bg-neutral-50 hover:text-charcoal transition-colors">
                        <Download size={14} /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
