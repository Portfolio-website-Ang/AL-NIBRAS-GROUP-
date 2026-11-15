import React, { useState } from 'react';
import { AppState, Language } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { ShieldAlert, Lock, Download, Sliders, CheckCircle2, Coins } from 'lucide-react';

interface AdminDashboardViewProps {
  t: Translations;
  lang: Language;
  appData: AppState;
  onUpdateLimits: (kidLimit: number, teenLimit: number) => void;
  onAdjustNoorCoins: (delta: number) => void;
  onLockAdmin: () => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  t,
  lang,
  appData,
  onUpdateLimits,
  onAdjustNoorCoins,
  onLockAdmin,
  onNotify,
}) => {
  const [kidLimit, setKidLimit] = useState(appData.kidSpendingLimit);
  const [teenLimit, setTeenLimit] = useState(appData.teenSpendingLimit);
  const [searchQuery, setSearchQuery] = useState('');
  const [ngoStatus, setNgoStatus] = useState<Record<string, boolean>>({
    alkhidmat: true,
    edhi: true,
    shaukat: true,
    indus: true,
  });

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success');
    onUpdateLimits(Math.max(100, kidLimit), Math.max(500, teenLimit));
    onNotify(
      lang === 'en'
        ? 'Family seat spending limits updated successfully.'
        : 'خاندانی نشستوں کی اخراجاتی حد اپ ڈیٹ کر دی گئی ہے۔',
      'success'
    );
  };

  const handleExportAudit = () => {
    playSound('coin');
    const report = {
      exportedAt: new Date().toISOString(),
      walletBalancePkr: appData.walletBalance,
      zakatDisbursedPkr: appData.zakatPaidTotal,
      kidSpendingLimit: appData.kidSpendingLimit,
      teenSpendingLimit: appData.teenSpendingLimit,
      approvalsCount: appData.approvals.length,
      ngoCompliance: ngoStatus,
      activityLogs: appData.activityLogs,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alnibras-sharia-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(
      lang === 'en' ? 'Sharia Audit Report exported (JSON).' : 'شریعہ آڈٹ رپورٹ ڈاؤن لوڈ ہو گئی۔',
      'success'
    );
  };

  const filteredLogs = (appData.activityLogs || []).filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.child.toLowerCase().includes(q) ||
      log.title.toLowerCase().includes(q) ||
      log.titleUr.toLowerCase().includes(q) ||
      log.detail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Admin Guardian Header */}
      <section className="rounded-2xl overflow-hidden bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852]">
        <div className="h-[3px] w-full nibras-accent-bar" />
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{t.roleAdmin} · PIN Verified · Al-Nibras Group</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
              {t.adminConsoleTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.adminConsoleSub}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={handleExportAudit}
              className="px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportAuditBtn}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                onLockAdmin();
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{t.lockAdminBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Platform KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl p-5 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.walletBalance}
          </span>
          <div className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            Rs {appData.walletBalance.toLocaleString()}
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.navZakat} Disbursed
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            Rs {appData.zakatPaidTotal.toLocaleString()}
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.navOkKro}
          </span>
          <div className="text-2xl font-serif font-bold text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
            {appData.approvals.filter((a) => a.status === 'pending').length} / {appData.approvals.length}
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.noorCoins} Pool
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {appData.noorCoins} 🪙
            </span>
            <button
              onClick={() => {
                playSound('coin');
                onAdjustNoorCoins(25);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#0E7490]/15 dark:bg-[#22D3EE]/15 text-[#0E7490] dark:text-[#22D3EE] text-xs font-bold hover:opacity-80 cursor-pointer flex items-center gap-1"
            >
              <Coins className="w-3 h-3" />
              <span>+25</span>
            </button>
          </div>
        </div>
      </section>

      {/* Governance Controls: Spending Limits & Sharia NGO Audit */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Seat Spending Limits */}
        <form
          onSubmit={handleSaveLimits}
          className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-5"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#B45309] dark:text-[#FBBF24]" />
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
              {t.spendingLimitsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                {t.roleKid} (PKR)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={kidLimit}
                onChange={(e) => setKidLimit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-sm outline-none focus:border-[#FBBF24]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                {t.roleTeen} (PKR)
              </label>
              <input
                type="number"
                min="500"
                step="100"
                value={teenLimit}
                onChange={(e) => setTeenLimit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-sm outline-none focus:border-[#FBBF24]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs transition-opacity cursor-pointer"
          >
            {lang === 'en' ? 'Save Spending Controls' : 'اخراجاتی حدود محفوظ کریں'}
          </button>
        </form>

        {/* Sharia NGO Compliance Audit */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.ngoComplianceTitle}</span>
          </h3>

          <div className="divide-y divide-slate-200 dark:divide-[#232852]">
            {[
              { id: 'alkhidmat', name: 'Alkhidmat Foundation Pakistan' },
              { id: 'edhi', name: 'Edhi Foundation' },
              { id: 'shaukat', name: 'Shaukat Khanum Memorial Hospital' },
              { id: 'indus', name: 'Indus Hospital & Health Network' },
            ].map((ngo) => (
              <div key={ngo.id} className="py-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {ngo.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setNgoStatus((prev) => ({ ...prev, [ngo.id]: !prev[ngo.id] }));
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    ngoStatus[ngo.id]
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-[#161B3B] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {ngoStatus[ngo.id] ? t.verifiedCharityBadge : 'Paused'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Governance & Child Activity Ledger */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.globalLedgerTitle}
          </h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search activity logs...' : 'لاگز تلاش کریں...'}
            className="sm:w-64 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-[#FBBF24]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#232852] text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 text-start font-semibold">Seat</th>
                <th className="py-2.5 px-3 text-start font-semibold">Event</th>
                <th className="py-2.5 px-3 text-start font-semibold">Detail</th>
                <th className="py-2.5 px-3 text-start font-semibold">Impact</th>
                <th className="py-2.5 px-3 text-start font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#232852]">
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    {log.child}
                  </td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                    {lang === 'en' ? log.title : lang === 'ps' ? log.titlePs : log.titleUr}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{log.detail}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-[#B45309] dark:text-[#FBBF24] font-semibold">
                    {log.coinsDelta ? `+${log.coinsDelta} 🪙` : log.amountPkr ? `Rs ${log.amountPkr}` : '—'}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
