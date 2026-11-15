import React, { useState } from 'react';
import { AppState, Language, TabType } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { PrayerTimesWidget } from './PrayerTimesWidget';
import { BadgeShowcase } from './BadgeShowcase';
import { AlNibrasBrandBanner } from './AlNibrasBrandBanner';
import {
  CheckCircle2,
  XCircle,
  Wallet,
  Target,
  Activity,
  Plus,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface ParentDashboardViewProps {
  t: Translations;
  lang: Language;
  appData: AppState;
  theme: 'dark' | 'light';
  onNavigate: (tab: TabType) => void;
  onContributeGoal: (goalId: number, amount: number) => void;
  onAddFunds: (amount: number) => void;
  onApproval: (id: number, status: 'approved' | 'rejected') => void;
}

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({
  t,
  lang,
  appData,
  theme,
  onNavigate,
  onContributeGoal,
  onAddFunds,
  onApproval,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'PKR' | 'USD' | 'SAR' | 'AED'>('PKR');
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('25000');
  const [childFilter, setChildFilter] = useState<'all' | 'Ahmed' | 'Fatima'>('all');

  const pendingApprovals = appData.approvals.filter((a) => a.status === 'pending');

  const exchangeRates: Record<string, number> = {
    PKR: 1,
    USD: 0.0036,
    SAR: 0.0135,
    AED: 0.0132,
  };

  const formatCurrency = (val: number) => {
    const rate = exchangeRates[selectedCurrency] || 1;
    const converted = val * rate;
    if (selectedCurrency === 'PKR') {
      return `Rs ${converted.toLocaleString()}`;
    }
    return `${selectedCurrency} ${converted.toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(fundsAmount);
    if (num > 0) {
      playSound('coin');
      onAddFunds(num);
      setShowAddFundsModal(false);
    }
  };

  const filteredLogs = (appData.activityLogs || []).filter((log) =>
    childFilter === 'all' ? true : log.child === childFilter
  );

  const getActivityTitle = (log: AppState['activityLogs'][number]) => {
    if (lang === 'ps') return log.titlePs || log.title;
    if (lang === 'ur' || lang === 'ar') return log.titleUr || log.title;
    return log.title;
  };

  const getActivityTypeLabel = (type: string) => {
    if (lang === 'en') {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
    if (lang === 'ps') {
      if (type === 'learning') return 'زده کړه';
      if (type === 'streak') return 'استقامت';
      if (type === 'quest') return 'ورځنی هدف';
      if (type === 'request') return 'غوښتنه';
      if (type === 'saving') return 'سپما';
      return 'آزموینه';
    }
    if (type === 'learning') return 'تعلیم';
    if (type === 'streak') return 'اسٹریک';
    if (type === 'quest') return 'روزانہ ہدف';
    if (type === 'request') return 'درخواست';
    if (type === 'saving') return 'بچت';
    return 'کوئز';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Al-Nibras Group Official Showcase Banner */}
      <AlNibrasBrandBanner t={t} lang={lang} onNavigate={onNavigate} />

      {/* Parent Governance Header */}
      <section className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#0E7490] dark:text-[#22D3EE] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.activeSeat}: {t.roleParent}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.welcomeSalam}، {t.roleParent}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.heroSubtext}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onNavigate('okKro');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.navOkKro}</span>
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono tabular-nums">
                {pendingApprovals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              playSound('click');
              onNavigate('zakat');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.zakatPayNow}
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowAddFundsModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addFundsBtn}</span>
          </button>
        </div>
      </section>

      {/* Primary KPI Row: Family Net Assets, Zakat Audit, Pending Ok Kro */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Family Net Assets */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.walletBalance}
            </span>
            <div className="flex items-center gap-1" dir="ltr">
              {(['PKR', 'USD', 'SAR', 'AED'] as const).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setSelectedCurrency(cur)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    selectedCurrency === cur
                      ? 'bg-[#FBBF24] text-[#07091B]'
                      : 'bg-slate-100 dark:bg-[#161B3B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <div className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {formatCurrency(appData.walletBalance)}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {t.mudarabahReturns}
            </span>
            <span className="text-slate-500 dark:text-slate-400">{t.halalCertified}</span>
          </div>
        </div>

        {/* Zakat Paid Summary */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.navZakat} (2026)</span>
            <span className="font-mono tabular-nums font-semibold text-[#0E7490] dark:text-[#22D3EE]">
              2.5%
            </span>
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            {formatCurrency(appData.zakatPaidTotal)}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">{t.nisabStatus}:</span>
            <button
              onClick={() => onNavigate('zakat')}
              className="font-semibold text-[#B45309] dark:text-[#FBBF24] hover:underline cursor-pointer"
            >
              {t.calculateZakat} →
            </button>
          </div>
        </div>

        {/* Children Snapshot */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.navOkKro}</span>
            <Wallet className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
            {pendingApprovals.length} {t.pending}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {t.noorCoins}: {appData.noorCoins} · 🔥 {appData.streakDays}d
            </span>
            <button
              onClick={() => onNavigate('okKro')}
              className="font-semibold text-[#0E7490] dark:text-[#22D3EE] hover:underline cursor-pointer"
            >
              {t.viewAll} →
            </button>
          </div>
        </div>
      </section>

      {/* Children Activity Monitor & Inline Ok Kro Approvals */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Live Children Activity Monitor (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#0E7490] dark:text-[#22D3EE]" />
                <span>{t.childrenActivityTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.childrenActivityDesc}
              </p>
            </div>

            {/* Child Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] self-start">
              {[
                { id: 'all', label: t.allChildren },
                { id: 'Ahmed', label: lang === 'en' ? 'Ahmed' : 'احمد' },
                { id: 'Fatima', label: lang === 'en' ? 'Fatima' : 'فاطمہ' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click');
                    setChildFilter(tab.id as 'all' | 'Ahmed' | 'Fatima');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    childFilter === tab.id
                      ? 'bg-[#FBBF24] text-[#07091B]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity List */}
          <div className="divide-y divide-slate-200 dark:divide-[#232852] max-h-[340px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                {t.noActivityYet}
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {log.child === 'Ahmed'
                          ? lang === 'en' ? 'Ahmed (9yr)' : 'احمد (9 سال)'
                          : lang === 'en' ? 'Fatima (13yr)' : 'فاطمہ (13 سال)'}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[#0E7490] dark:text-[#22D3EE] font-semibold">
                        {getActivityTypeLabel(log.type)}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        {log.timestamp}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {getActivityTitle(log)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {log.detail}
                    </div>
                  </div>

                  <div className="text-end shrink-0 font-mono tabular-nums">
                    {log.coinsDelta !== undefined && log.coinsDelta > 0 && (
                      <div className="text-xs font-bold text-[#B45309] dark:text-[#FBBF24]">
                        +{log.coinsDelta} 🪙
                      </div>
                    )}
                    {log.amountPkr !== undefined && log.amountPkr > 0 && (
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Rs {log.amountPkr.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inline Ok Kro Quick Approval Queue (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                {t.recentApprovals}
              </h3>
              <button
                onClick={() => onNavigate('okKro')}
                className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] hover:underline cursor-pointer"
              >
                {t.viewAll} →
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="py-10 text-center rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] space-y-1.5">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t.noPendingText}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.allDoneText}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24]">
                          {item.kid} · {item.date}
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                          {item.title}
                        </div>
                      </div>
                      <div className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 shrink-0">
                        Rs {item.amount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproval(item.id, 'approved')}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.approveBtn}</span>
                      </button>
                      <button
                        onClick={() => onApproval(item.id, 'rejected')}
                        className="py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t.rejectBtn}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hadith Wisdom Strip */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] space-y-1">
            <div className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.hadithTitle}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {t.hadithText}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.hadithRef}
            </p>
          </div>
        </div>
      </section>

      {/* Family Savings Goals & Asset Allocation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#B45309] dark:text-[#FBBF24]" />
              <span>{t.familyGoals}</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {appData.goals.length} {lang === 'en' ? 'Active' : 'فعال'}
            </span>
          </div>

          <div className="space-y-3">
            {appData.goals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{goal.icon}</span>
                      <span>{goal.title}</span>
                    </span>
                    <span className="text-xs font-mono tabular-nums font-semibold text-[#B45309] dark:text-[#FBBF24]">
                      Rs {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#07091B] overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      {percent}% {t.completed}
                    </span>
                    <button
                      onClick={() => {
                        playSound('coin');
                        onContributeGoal(goal.id, 1000);
                      }}
                      className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      + {t.contributeGoalBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                {t.assetAllocation}
              </h3>
              <span className="text-xs text-[#0E7490] dark:text-[#22D3EE] font-semibold">
                AAOIFI Verified
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-200 dark:bg-[#07091B]">
              <div style={{ width: '45%' }} className="h-full bg-emerald-500" />
              <div style={{ width: '35%' }} className="h-full bg-[#FBBF24]" />
              <div style={{ width: '15%' }} className="h-full bg-cyan-400" />
              <div style={{ width: '5%' }} className="h-full bg-pink-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { label: t.allocationCash, color: 'bg-emerald-500', pct: '45%' },
                { label: t.allocationMudarabah, color: 'bg-[#FBBF24]', pct: '35%' },
                { label: t.allocationGold, color: 'bg-cyan-400', pct: '15%' },
                { label: t.allocationZakat, color: 'bg-pink-500', pct: '5%' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {item.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              {lang === 'en' ? 'Kid & Teen Approval Ceilings' : 'بچوں کے اخراجات کی بالائی حد'}
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
              Ahmed Rs {appData.kidSpendingLimit.toLocaleString()} · Fatima Rs {appData.teenSpendingLimit.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Earned Milestone Badges Showcase */}
      <BadgeShowcase
        t={t}
        lang={lang}
        earnedBadges={appData.earnedBadges || []}
        variant="dashboard"
        onNavigate={onNavigate}
      />

      {/* Prayer Times Widget */}
      <PrayerTimesWidget t={t} lang={lang} theme={theme} />

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 bg-[#07091B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-[3px] w-full nibras-accent-bar" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                  {t.addFundsTitle}
                </h4>
                <button
                  onClick={() => setShowAddFundsModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.mudarabahReturns}</p>
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.cashLabel}
                  </label>
                  <input
                    type="number"
                    value={fundsAmount}
                    onChange={(e) => setFundsAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-base outline-none focus:border-[#FBBF24]"
                    min="500"
                    step="500"
                    required
                  />
                </div>
                <div className="flex gap-2" dir="ltr">
                  {['10000', '25000', '50000', '100000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFundsAmount(amt)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] text-xs font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      +{Number(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs cursor-pointer"
                  >
                    {t.addFundsBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddFundsModal(false)}
                    className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    {t.close}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
