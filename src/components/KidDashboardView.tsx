import React, { useState } from 'react';
import { AppState, Language, TabType, Course, ApprovalRequest } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { BadgeShowcase } from './BadgeShowcase';
import { AlNibrasBrandBanner } from './AlNibrasBrandBanner';
import { Sparkles, Flame, Coins, Target, Send, BookOpen, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface KidDashboardViewProps {
  t: Translations;
  lang: Language;
  appData: AppState;
  theme: 'dark' | 'light';
  onNavigate: (tab: TabType) => void;
  onKidSaveToGoal: (goalId: number, amount: number) => void;
  onAddRequest: (req: Omit<ApprovalRequest, 'id' | 'status' | 'date'>) => void;
  onSelectCourse: (course: Course) => void;
}

export const KidDashboardView: React.FC<KidDashboardViewProps> = ({
  t,
  lang,
  appData,
  onNavigate,
  onKidSaveToGoal,
  onAddRequest,
  onSelectCourse,
}) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqAmount, setReqAmount] = useState('450');

  // Strictly filtered to Ahmed's own goals, requests, and kid-safe courses (NO parent net assets or Zakat!)
  const ahmedGoal = appData.goals.find((g) => g.owner === 'Ahmed' || g.id === 1) || appData.goals[0];
  const ahmedRequests = appData.approvals.filter((a) => a.kid.toLowerCase().includes('ahmed'));
  const kidsCourses = appData.courses.filter((c) => c.age.includes('6-12') || c.price === 'Free');

  const handleQuickRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqAmount) return;
    onAddRequest({
      kid: 'Ahmed',
      amount: Math.abs(Number(reqAmount)),
      type: 'purchase',
      title: reqTitle.trim(),
      category: 'purchase',
      notes: lang === 'ps' ? 'د احمد لخوا غوښتنه' : 'احمد کی جانب سے والدین کو درخواست',
    });
    playSound('success');
    setReqTitle('');
    setReqAmount('450');
    setShowRequestForm(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Kid Welcome Header (Strict Zero Parent Data) */}
      <section className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#0E7490] dark:text-[#22D3EE]">
            {t.roleKid} · {appData.userLevel}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.welcomeSalam}، {lang === 'en' ? 'Ahmed' : 'احمد'}!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.kidHeroSub}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onNavigate('kids');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.navKids}</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowRequestForm((prev) => !prev);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.requestFromParentsBtn}</span>
          </button>
        </div>
      </section>

      {/* Compact Al-Nibras Group Student Empowerment Showcase */}
      <AlNibrasBrandBanner t={t} lang={lang} onNavigate={onNavigate} compact />

      {/* Kid-Specific KPI Strip (3 cards, zero parent financials) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Ahmed's Pocket Money */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.kidPocketMoney}</span>
            <span className="text-[#0E7490] dark:text-[#22D3EE] font-semibold">{t.pkr}</span>
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            Rs {appData.kidPocketMoney.toLocaleString()}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{lang === 'ps' ? 'د لګښت حد' : lang === 'en' ? 'Request Limit' : 'حدِ درخواست'}:</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              Rs {appData.kidSpendingLimit.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2. Noor Coins */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.noorCoins}</span>
            <Coins className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
            {appData.noorCoins}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">{appData.userLevel}</span>
            <button
              onClick={() => onNavigate('kids')}
              className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {t.playChallenge} →
            </button>
          </div>
        </div>

        {/* 3. Daily Streak */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.currentStreak}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {appData.streakDays} {t.dayLabel}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] flex items-center justify-between text-xs">
            <span className={appData.streakClaimedToday ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-[#B45309] dark:text-[#FBBF24] font-semibold'}>
              {appData.streakClaimedToday ? t.rewardClaimedToday : t.claimDailyReward}
            </span>
            <button
              onClick={() => onNavigate('kids')}
              className="font-semibold text-[#0E7490] dark:text-[#22D3EE] hover:underline cursor-pointer"
            >
              {t.viewAll} →
            </button>
          </div>
        </div>
      </section>

      {/* Inline Quick Ok Kro Request Form */}
      {showRequestForm && (
        <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-[#FBBF24]/50 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t.newRequest} ({t.roleKid})
            </h3>
            <button
              onClick={() => setShowRequestForm(false)}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              {t.close}
            </button>
          </div>
          <form onSubmit={handleQuickRequest} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={reqTitle}
              onChange={(e) => setReqTitle(e.target.value)}
              placeholder={lang === 'en' ? 'Item name (e.g. Science Book)' : 'چیز کا نام (مثلاً کہانی کی کتاب)'}
              className="sm:col-span-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-[#FBBF24]"
              required
            />
            <input
              type="number"
              value={reqAmount}
              onChange={(e) => setReqAmount(e.target.value)}
              min="50"
              max={appData.kidSpendingLimit}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 outline-none focus:border-[#FBBF24]"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
            >
              {t.submitRequest}
            </button>
          </form>
        </section>
      )}

      {/* Main Kid 2-Column Split: Ahmed's Goal & Ahmed's Ok Kro Requests */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Ahmed's Personal Goal */}
        {ahmedGoal && (
          <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#B45309] dark:text-[#FBBF24]" />
                  <span>{t.myGoals}</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {ahmedGoal.category}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="text-xl">{ahmedGoal.icon}</span>
                    <span>{ahmedGoal.title}</span>
                  </span>
                  <span className="text-xs font-mono tabular-nums font-bold text-[#B45309] dark:text-[#FBBF24]">
                    Rs {ahmedGoal.current.toLocaleString()} / {ahmedGoal.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#07091B] overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((ahmedGoal.current / ahmedGoal.target) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono tabular-nums">
                    {Math.min(100, Math.round((ahmedGoal.current / ahmedGoal.target) * 100))}% {t.completed}
                  </span>
                  <span>
                    {lang === 'en' ? 'Remaining' : 'باقی'}: Rs {Math.max(0, ahmedGoal.target - ahmedGoal.current).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('coin');
                onKidSaveToGoal(ahmedGoal.id, 250);
              }}
              className="w-full py-3 rounded-xl bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs transition-opacity cursor-pointer"
            >
              {t.saveFromPocketBtn}
            </button>
          </div>
        )}

        {/* Ahmed's Ok Kro Requests */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
              {t.myRequests}
            </h3>
            <button
              onClick={() => onNavigate('okKro')}
              className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] hover:underline cursor-pointer"
            >
              {t.viewAll} →
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-[#232852]">
            {ahmedRequests.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                {t.noPendingText}
              </p>
            ) : (
              ahmedRequests.map((req) => (
                <div key={req.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {req.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      Rs {req.amount.toLocaleString()} · {req.date}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      req.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {req.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                    {req.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                    <span>
                      {req.status === 'approved' ? t.approved : req.status === 'rejected' ? t.rejected : t.pending}
                    </span>
                  </span>
                </div>
              ))
            )}
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

      {/* Kid-Safe Free Academy Lessons */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0E7490] dark:text-[#22D3EE]" />
            <span>{t.navLearn} (6-12)</span>
          </h3>
          <button
            onClick={() => onNavigate('learn')}
            className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] hover:underline cursor-pointer"
          >
            {t.viewAll} →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kidsCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {course.age} · {course.price}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {course.icon} {course.title}
                </div>
              </div>
              <button
                onClick={() => onSelectCourse(course)}
                className="px-3.5 py-2 rounded-lg bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs shrink-0 cursor-pointer"
              >
                {t.viewAll}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
