import React, { useState } from 'react';
import {
  Award,
  HelpingHand,
  Smile,
  HeartHandshake,
  Heart,
  Users,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { DEMO_USERS } from '../../utils/constants';

import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProductDetailModal from '../products/ProductDetailModal';

export const Reports = () => {
  const { allProducts, analyticsData } = useProduct();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!allProducts || allProducts.length === 0) return;

    const headers = ['ID', 'Title', 'Category', 'Price', 'Stock', 'Brand', 'Rating'];
    const rows = allProducts.map((p) => [
      p.id,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      p.category,
      p.price,
      p.stock,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      p.rating,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Team_Catalog_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Team catalog report exported to CSV successfully.', 'Report Ready');
  };

  const handlePrint = () => {
    window.print();
  };

  const totalValue = allProducts.reduce(
    (acc, p) => acc + (p.price || 0) * (p.stock || 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Operational & Catalog Reports"
        subtitle="Comprehensive inventory valuation, supply schedule, and downloadable colleague records."
        badge="Reports Workspace"
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Smile}
              onClick={handlePrint}
            >
              Print Schedule
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={HelpingHand}
              onClick={handleExportCSV}
            >
              Export CSV Spreadsheet
            </Button>
          </div>
        }
      />

      {/* Human Valuation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Catalog Valuation
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {formatCurrency(totalValue)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Across {allProducts.length} curated products
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Items in Good Hands
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {formatNumber(analyticsData.active)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Available to deliver</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Items Needing Attention
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {formatNumber(analyticsData.lowStock)}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Restock recommended</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Colleague Access Status
          </span>
          <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-2">
            Authorized
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Granted by Admin Matrix</span>
        </div>
      </div>

      {/* Reports Table Breakdown */}
      <Card
        title="Comprehensive Inventory Valuation Schedule"
        subtitle="Real-time stock value and curator attribution"
        action={
          <Badge variant="primary" size="sm">
            {allProducts.length} Total Curated Records
          </Badge>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Item & Curator</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Quantity on Hand</th>
                <th className="py-3 px-4 text-right">Total Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allProducts.slice(0, 15).map((p, idx) => {
                const extVal = (p.price || 0) * (p.stock || 0);
                const curator = DEMO_USERS[idx % DEMO_USERS.length];

                return (
                  <tr
                    key={p.id}
                    onClick={() => handleOpenDetail(p)}
                    className="hover:bg-slate-100/70 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                    title={`Click to inspect ${p.title} specifications`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={curator.avatar}
                          alt={curator.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">#{p.id} • {curator.name.split(' ')[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary" size="sm">
                        {p.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {p.stock} units
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(extVal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Reports;
