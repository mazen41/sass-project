'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  apiGetAdminInvoices, apiMarkInvoicePaid, apiMarkInvoiceRefunded, 
  apiResendInvoiceEmail, apiGetInvoiceStats, InvoiceRecord 
} from '@/lib/api';
import { useLang } from '@/context/LangContext';
import { 
  FileText, Search, RefreshCw, Mail, CheckCircle2, AlertTriangle, 
  ChevronLeft, ChevronRight, X, Loader2, DollarSign, Calendar
} from 'lucide-react';

export default function AdminInvoicesPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const t = {
    title: isRTL ? 'إدارة الفواتير' : 'Invoices Management',
    statsTotal: isRTL ? 'إجمالي الفواتير' : 'Total Invoices',
    statsRevenue: isRTL ? 'إجمالي الإيرادات' : 'Total Revenue',
    statsPaid: isRTL ? 'الفواتير المدفوعة' : 'Paid Invoices',
    statsPending: isRTL ? 'الفواتير المعلقة' : 'Pending Invoices',
    invoiceNumber: isRTL ? 'رقم الفاتورة' : 'Invoice No.',
    customer: isRTL ? 'العميل' : 'Customer',
    amount: isRTL ? 'القيمة' : 'Amount',
    status: isRTL ? 'الحالة' : 'Status',
    issuedAt: isRTL ? 'تاريخ الإصدار' : 'Issued Date',
    actions: isRTL ? 'الإجراءات' : 'Actions',
    searchPlaceholder: isRTL ? 'البحث برقم الفاتورة، اسم العميل أو بريده...' : 'Search by invoice no, customer name or email...',
    filterStatus: isRTL ? 'تصفية حسب الحالة' : 'Filter by status',
    all: isRTL ? 'الكل' : 'All',
    paid: isRTL ? 'مدفوعة' : 'Paid',
    pending: isRTL ? 'معلقة' : 'Pending',
    refunded: isRTL ? 'مسترجعة' : 'Refunded',
    failed: isRTL ? 'فاشلة' : 'Failed',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'View Details',
    resendEmail: isRTL ? 'إعادة إرسال البريد' : 'Resend Email',
    markPaid: isRTL ? 'تحديد كمدفوعة' : 'Mark as Paid',
    markRefunded: isRTL ? 'تحديد كمسترجعة' : 'Mark as Refunded',
    resendSuccess: isRTL ? 'تم إعادة إرسال الفاتورة بنجاح.' : 'Invoice email resent successfully.',
    statusUpdated: isRTL ? 'تم تحديث حالة الفاتورة بنجاح.' : 'Invoice status updated successfully.',
    close: isRTL ? 'إغلاق' : 'Close',
    detailsTitle: isRTL ? 'تفاصيل الفاتورة' : 'Invoice Details',
    paymentMethod: isRTL ? 'طريقة الدفع' : 'Payment Method',
    transactionId: isRTL ? 'معرف المعاملة' : 'Transaction ID',
    items: isRTL ? 'العناصر' : 'Items',
    itemName: isRTL ? 'اسم العنصر' : 'Item Name',
    itemPrice: isRTL ? 'السعر' : 'Price',
    itemType: isRTL ? 'النوع' : 'Type',
    billingAddress: isRTL ? 'عنوان الفوترة' : 'Billing Address',
    noInvoices: isRTL ? 'لا توجد فواتير مطابقة' : 'No matching invoices found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
  };

  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    refunded: 0,
    total_revenue: '0.00'
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAdminInvoices({
        page: currentPage.toString(),
        search,
        status: statusFilter,
      });
      setInvoices(res.data);
      setTotalPages(res.last_page);
      
      const statsRes = await apiGetInvoiceStats();
      setStats(statsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleMarkPaid = async (id: number) => {
    setActionLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await apiMarkInvoicePaid(id);
      setMsg({ type: 'success', text: t.statusUpdated });
      loadInvoices();
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice(prev => prev ? { ...prev, status: 'paid', paid_at: new Date().toISOString() } : null);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkRefunded = async (id: number) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من تحديد هذه الفاتورة كمسترجعة؟' : 'Are you sure you want to mark this invoice as refunded?')) return;
    setActionLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await apiMarkInvoiceRefunded(id);
      setMsg({ type: 'success', text: t.statusUpdated });
      loadInvoices();
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice(prev => prev ? { ...prev, status: 'refunded' } : null);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendEmail = async (id: number) => {
    setActionLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await apiResendInvoiceEmail(id);
      setMsg({ type: 'success', text: t.resendSuccess });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      case 'refunded':
        return 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
      default:
        return 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30';
    }
  };

  return (
    <div className="flex flex-col gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="text-indigo-600 dark:text-indigo-400" />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isRTL 
            ? 'مراقبة وإدارة جميع المعاملات والفواتير للعملاء.' 
            : 'Monitor and manage all customer billing transactions and invoices.'}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t.statsTotal}</p>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.total}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t.statsRevenue}</p>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">${stats.total_revenue}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t.statsPaid}</p>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.paid}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t.statsPending}</p>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.pending}</h4>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder={t.searchPlaceholder}
            className={`w-full py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all
              ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-3 self-stretch md:self-auto justify-end">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer text-gray-700 dark:text-gray-200"
          >
            <option value="">{t.filterStatus}: {t.all}</option>
            <option value="paid">{t.paid}</option>
            <option value="pending">{t.pending}</option>
            <option value="refunded">{t.refunded}</option>
            <option value="failed">{t.failed}</option>
          </select>

          <button
            onClick={loadInvoices}
            className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl transition-colors text-gray-500 dark:text-gray-300"
            title={isRTL ? 'تحديث البيانات' : 'Refresh data'}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl border ${
          msg.type === 'success' 
            ? 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400' 
            : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Datatable */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
            <p className="text-sm text-gray-500">{t.loading}</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400">{t.noInvoices}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4">{t.invoiceNumber}</th>
                  <th scope="col" className="px-6 py-4">{t.customer}</th>
                  <th scope="col" className="px-6 py-4">{t.amount}</th>
                  <th scope="col" className="px-6 py-4">{t.status}</th>
                  <th scope="col" className="px-6 py-4">{t.issuedAt}</th>
                  <th scope="col" className="px-6 py-4 text-right rtl:text-left">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/55 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">{inv.invoice_number}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{inv.user?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{inv.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-950 dark:text-white">${inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(inv.status)}`}>
                        {t[inv.status] || inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right rtl:text-left flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        {t.viewDetails}
                      </button>
                      <button
                        onClick={() => handleResendEmail(inv.id)}
                        className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"
                        title={t.resendEmail}
                        disabled={actionLoading}
                      >
                        <Mail size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={14} />
              {isRTL ? 'التالي' : 'Previous'}
            </button>

            <span className="text-xs text-gray-500">
              {isRTL ? 'صفحة' : 'Page'} {currentPage} {isRTL ? 'من' : 'of'} {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              {isRTL ? 'السابق' : 'Next'}
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6" onClick={() => setSelectedInvoice(null)}>
          <div 
            className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-700" 
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t.detailsTitle}: <span className="font-mono">{selectedInvoice.invoice_number}</span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-gray-700 dark:text-gray-300">
              {/* Customer info & Invoice status */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase mb-1">{t.customer}</h4>
                  <div className="font-bold text-gray-900 dark:text-white">{selectedInvoice.user?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedInvoice.user?.email}</div>
                </div>

                <div className="text-right rtl:text-left">
                  <h4 className="text-xs text-gray-400 font-bold uppercase mb-1">{t.status}</h4>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block mt-0.5 ${getStatusBadgeClass(selectedInvoice.status)}`}>
                    {t[selectedInvoice.status] || selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Transaction details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 font-semibold block mb-1">{t.paymentMethod}</span>
                  <span className="font-medium text-gray-800 dark:text-white capitalize">{selectedInvoice.gateway || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold block mb-1">{t.transactionId}</span>
                  <span className="font-mono text-xs text-gray-800 dark:text-gray-200 truncate block">{selectedInvoice.gateway_transaction_id || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold block mb-1 flex items-center gap-1"><Calendar size={12} /> {t.issuedAt}</span>
                  <span className="text-sm font-medium">
                    {selectedInvoice.issued_at ? new Date(selectedInvoice.issued_at).toLocaleString(locale) : 'N/A'}
                  </span>
                </div>
                {selectedInvoice.status === 'paid' && (
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block mb-1 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> {isRTL ? 'تاريخ الدفع' : 'Paid Date'}</span>
                    <span className="text-sm font-medium">
                      {selectedInvoice.paid_at ? new Date(selectedInvoice.paid_at).toLocaleString(locale) : 'N/A'}
                    </span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{t.items}</h4>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left rtl:text-right">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-4 py-2">{t.itemName}</th>
                        <th className="px-4 py-2">{t.itemType}</th>
                        <th className="px-4 py-2 text-right rtl:text-left">{t.itemPrice}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-600 dark:text-gray-400">
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">{item.name}</td>
                          <td className="px-4 py-2.5 capitalize">{item.type}</td>
                          <td className="px-4 py-2.5 text-right rtl:text-left font-bold text-gray-900 dark:text-white">${item.price}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50/50 dark:bg-gray-700/10 font-bold border-t border-gray-200 dark:border-gray-700">
                        <td colSpan={2} className="px-4 py-3 text-gray-900 dark:text-white text-sm">{isRTL ? 'الإجمالي' : 'Total'}</td>
                        <td className="px-4 py-3 text-right rtl:text-left text-sm text-indigo-600 dark:text-indigo-400 font-extrabold text-base">${selectedInvoice.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Billing Address if any */}
              {selectedInvoice.billing_address && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{t.billingAddress}</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/50 p-3 rounded-xl text-xs space-y-1">
                    {Object.entries(selectedInvoice.billing_address).map(([key, val]) => (
                      <div key={key}>
                        <span className="font-semibold capitalize text-gray-400">{key.replace('_', ' ')}:</span> {val}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 justify-between items-center bg-gray-50 dark:bg-gray-800/50 shrink-0">
              <div className="flex gap-2">
                {selectedInvoice.status !== 'paid' && (
                  <button
                    onClick={() => handleMarkPaid(selectedInvoice.id)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    {t.markPaid}
                  </button>
                )}
                {selectedInvoice.status === 'paid' && (
                  <button
                    onClick={() => handleMarkRefunded(selectedInvoice.id)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    {t.markRefunded}
                  </button>
                )}
                <button
                  onClick={() => handleResendEmail(selectedInvoice.id)}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  <Mail size={14} />
                  {t.resendEmail}
                </button>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
