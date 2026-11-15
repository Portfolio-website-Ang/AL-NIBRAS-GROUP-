import React, { useState } from 'react';
import { BadgeCategory, EarnedBadgeRecord, Language, TabType } from '../types';
import { Translations } from '../translations';
import {
  MILESTONE_BADGES,
  getBadgeCriteria,
  getBadgeDesc,
  getBadgeTitle,
} from '../data/badges';
import { playSound } from '../utils/sound';
import { Award, CheckCircle2, Lock } from 'lucide-react';

interface BadgeShowcaseProps {
  t: Translations;
  lang: Language;
  earnedBadges: EarnedBadgeRecord[];
  categoryFilter?: 'all' | BadgeCategory;
  variant?: 'dashboard' | 'catalog';
  title?: string;
  subtitle?: string;
  onNavigate?: (tab: TabType) => void;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  t,
  lang,
  earnedBadges,
  categoryFilter = 'all',
  variant = 'dashboard',
  title,
  subtitle,
  onNavigate,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'locked'>(
    variant === 'dashboard' ? 'earned' : 'all'
  );

  const scopedBadges = MILESTONE_BADGES.filter((b) =>
    categoryFilter === 'all' ? true : b.category === categoryFilter
  );

  const earnedMap = new Map<string, EarnedBadgeRecord>();
  for (const rec of earnedBadges) {
    earnedMap.set(rec.badgeId, rec);
  }

  const earnedCount = scopedBadges.filter((b) => earnedMap.has(b.id)).length;
  const totalCount = scopedBadges.length;
  const progressPct = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  const visibleBadges = scopedBadges.filter((b) => {
    const isEarned = earnedMap.has(b.id);
    if (statusFilter === 'earned') return isEarned;
    if (statusFilter === 'locked') return !isEarned;
    return true;
  });

  const headingTitle =
    title ||
    (categoryFilter === 'academy'
      ? t.academyBadgesTitle
      : categoryFilter === 'noor_zone'
      ? t.noorBadgesTitle
      : t.earnedBadgesTitle);

  const headingSubtitle = subtitle || t.earnedBadgesSub;

  const gridColsClass =
    categoryFilter === 'academy'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-5">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#B45309] dark:text-[#FBBF24] shrink-0" />
            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
              {headingTitle}
            </h3>
            <span className="text-xs font-mono tabular-nums font-bold text-[#0E7490] dark:text-[#22D3EE]">
              {earnedCount} / {totalCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {headingSubtitle}
          </p>
        </div>

        {/* Filter Segmented Control + Progress */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852]">
            {(
              [
                { id: 'earned', label: `${t.filterEarnedBadges} (${earnedCount})` },
                { id: 'all', label: `${t.filterAllBadges} (${totalCount})` },
                { id: 'locked', label: `${t.filterLockedBadges} (${totalCount - earnedCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setStatusFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono tabular-nums ${
                  statusFilter === tab.id
                    ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Linear Milestone Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#07091B] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FBBF24] to-[#22D3EE] transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Empty State */}
      {visibleBadges.length === 0 ? (
        <div className="py-8 px-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] text-center space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {statusFilter === 'earned'
              ? t.noBadgesEarnedYet
              : lang === 'en'
              ? 'Masha’Allah! Every milestone badge in this track is unlocked.'
              : 'ماشاء اللہ! اس سیکشن کے تمام مائل اسٹون بیجز انلاک ہو چکے ہیں۔'}
          </p>
          {onNavigate && (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onNavigate('learn');
                }}
                className="px-4 py-2 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.navLearn}
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onNavigate('kids');
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#07091B] hover:bg-slate-300 dark:hover:bg-[#1E254D] text-slate-800 dark:text-slate-100 font-semibold text-xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.navKids}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={`grid ${gridColsClass} gap-4`}>
          {visibleBadges.map((badge) => {
            const record = earnedMap.get(badge.id);
            const isEarned = Boolean(record);
            const categoryLabel =
              badge.category === 'academy' ? t.navLearn : t.navKids;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                  isEarned
                    ? badge.accent === 'gold'
                      ? 'bg-amber-50/70 dark:bg-[#161B3B] border-[#FBBF24]/50'
                      : 'bg-cyan-50/60 dark:bg-[#161B3B] border-[#22D3EE]/40'
                    : 'bg-slate-50/70 dark:bg-[#07091B]/70 border-slate-200 dark:border-[#232852] opacity-80'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl border shrink-0 ${
                        isEarned
                          ? 'bg-white dark:bg-[#07091B] border-[#FBBF24]/40'
                          : 'bg-slate-200/70 dark:bg-[#10132C] border-slate-300 dark:border-[#232852] grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold">
                      {isEarned ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.badgeEarnedLabel}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Lock className="w-3 h-3" />
                          <span>{t.badgeLockedLabel}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {getBadgeTitle(badge, lang)}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {isEarned ? getBadgeDesc(badge, lang) : getBadgeCriteria(badge, lang)}
                    </p>
                  </div>
                </div>

                {/* Clean unboxed metadata footer */}
                <div className="pt-2.5 border-t border-slate-200/80 dark:border-[#232852] flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="truncate">{categoryLabel}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#B45309] dark:text-[#FBBF24] shrink-0">
                    {isEarned && record ? `${record.unlockedAt} · +${badge.points}` : `+${badge.points} 🪙`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
