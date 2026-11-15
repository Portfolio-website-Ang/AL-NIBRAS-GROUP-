import React from 'react';
import { AppState, Language, TabType, Course } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { BadgeShowcase } from './BadgeShowcase';
import { AlNibrasBrandBanner } from './AlNibrasBrandBanner';
import { GraduationCap, Award, Wallet, Flame, Target, ArrowUpRight } from 'lucide-react';

interface TeenDashboardViewProps {
  t: Translations;
  lang: Language;
  appData: AppState;
  theme: 'dark' | 'light';
  onNavigate: (tab: TabType) => void;
  onTeenSaveToGoal: (goalId: number, amount: number) => void;
  onOpenQuiz: () => void;
  onSelectCourse: (course: Course) => void;
}

export const TeenDashboardView: React.FC<TeenDashboardViewProps> = ({
  t,
  lang,
  appData,
  onNavigate,
  onTeenSaveToGoal,
  onOpenQuiz,
  onSelectCourse,
}) => {
  // Strictly isolated from parent's net worth or parent's personal Zakat liabilities
  const fatimaRequests = appData.approvals.filter((a) => a.kid.toLowerCase().includes('fatima'));
  const charityGoal = appData.goals.find((g) => g.category === 'Charity' || g.id === 3) || appData.goals[0];
  const youthCourses = appData.courses.filter((c) => c.age.includes('18+') || c.id === 103 || c.id === 104);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Al-Nibras Group Entrepreneurship & Student Empowerment Banner */}
      <AlNibrasBrandBanner t={t} lang={lang} onNavigate={onNavigate} />

      {/* Teen Header */}
      <section className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#0E7490] dark:text-[#22D3EE]">
            {t.roleTeen} · {t.halalCertified}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.welcomeSalam}، {lang === 'en' ? 'Fatima' : 'فاطمہ'}!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.teenHeroSub}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onOpenQuiz();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{t.startQuiz}</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onNavigate('okKro');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.myRequests}
          </button>
        </div>
      </section>

      {/* Teen KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.teenAllowance}</span>
            <Wallet className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            Rs {appData.teenAllowance.toLocaleString()}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{lang === 'en' ? 'Approval Limit' : 'منظوری کی حد'}:</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              Rs {appData.teenSpendingLimit.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.noorCoins} · {t.streak}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
            {appData.noorCoins} 🪙
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] text-xs flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {appData.streakDays} {t.dayLabel}
            </span>
            <button
              onClick={() => onNavigate('kids')}
              className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {t.navKids} →
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.teenLearningProgress}</span>
            <GraduationCap className="w-4 h-4 text-[#0E7490] dark:text-[#22D3EE]" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            {(appData.enrolledCourseIds?.length || 1)} / {appData.courses.length}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-[#232852] text-xs flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">AAOIFI Youth Track</span>
            <button
              onClick={() => onNavigate('learn')}
              className="font-semibold text-[#0E7490] dark:text-[#22D3EE] hover:underline cursor-pointer"
            >
              {t.navLearn} →
            </button>
          </div>
        </div>
      </section>

      {/* 2-Col: Fatima's Requests & Charity Savings Jar */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
              {t.myRequests}
            </h3>
            <button
              onClick={() => onNavigate('okKro')}
              className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] hover:underline cursor-pointer"
            >
              {t.newRequest} →
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-[#232852]">
            {fatimaRequests.map((req) => (
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
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    req.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : req.status === 'rejected'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {req.status === 'approved' ? t.approved : req.status === 'rejected' ? t.rejected : t.pending}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Charity & Sadaqah Jar */}
        {charityGoal && (
          <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{charityGoal.title}</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{charityGoal.category}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] space-y-2.5">
                <div className="flex justify-between text-xs font-mono tabular-nums">
                  <span className="text-slate-600 dark:text-slate-300">{t.completed}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    Rs {charityGoal.current.toLocaleString()} / {charityGoal.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#07091B] overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((charityGoal.current / charityGoal.target) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('coin');
                onTeenSaveToGoal(charityGoal.id, 500);
              }}
              className="w-full py-3 rounded-xl bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs transition-opacity cursor-pointer"
            >
              {lang === 'en' ? 'Contribute Rs 500 from Allowance' : 'اپنے الاؤنس سے Rs 500 صدقہ جمع کریں'}
            </button>
          </div>
        )}
      </section>

      {/* Earned Milestone Badges Showcase */}
      <BadgeShowcase
        t={t}
        lang={lang}
        earnedBadges={appData.earnedBadges || []}
        variant="dashboard"
        onNavigate={onNavigate}
      />

      {/* Recommended Youth Courses */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
          {t.navLearn}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {youthCourses.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {c.level} · {c.price}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {c.icon} {c.title}
                </div>
              </div>
              <button
                onClick={() => onSelectCourse(c)}
                className="p-2 rounded-lg bg-[#FBBF24] text-[#07091B] hover:bg-[#FCD34D] cursor-pointer"
                aria-label={c.title}
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
