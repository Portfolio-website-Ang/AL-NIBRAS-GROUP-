import React, { useState } from 'react';
import { Language, TabType } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const AL_NIBRAS_LOGO_SRC =
  '/assets/aistudio/file_000000003140821193a2ccee10d72c40_ded3faef.png';
export const AL_NIBRAS_BANNER_SRC =
  '/assets/aistudio/InShot_20260730_171355011_1a5be21c.jpg';

interface AlNibrasBrandBannerProps {
  t: Translations;
  lang: Language;
  onNavigate?: (tab: TabType) => void;
  compact?: boolean;
}

export const AlNibrasBrandBanner: React.FC<AlNibrasBrandBannerProps> = ({
  t,
  lang,
  onNavigate,
  compact = false,
}) => {
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const pillars =
    lang === 'ur'
      ? ['طلباء کی بااختیاری', 'اسٹارٹ اپ انکیوبیشن', 'بزنس ڈیولپمنٹ', 'مینٹرشپ و تربیت', 'پائیدار ترقی']
      : lang === 'ps'
      ? ['د زده کوونکو پیاوړتیا', 'سټارټ اپ روزنه', 'سوداګریزه وده', 'لارښوونه او روزنه', 'دوامداره پرمختګ']
      : lang === 'ar'
      ? ['تمكين الطلاب', 'احتضان المشاريع', 'تطوير الأعمال', 'الإرشاد والتدريب', 'النمو المستدام']
      : [
          'Student Empowerment',
          'Startup Incubation',
          'Business Development',
          'Mentorship & Training',
          'Sustainable Growth',
        ];

  return (
    <section className="rounded-2xl overflow-hidden bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] shadow-lg">
      {/* 2px Brand Spectrum Top Hairline */}
      <div className="h-[3px] w-full nibras-accent-bar" />

      {/* Panoramic Al-Nibras Group Artwork (Unclipped & High-Resolution) */}
      <div className="bg-[#07091B] relative">
        {!bannerError ? (
          <img
            src={AL_NIBRAS_BANNER_SRC}
            alt="Al-Nibras Group — Empowering Students Across Pakistan: Innovate, Empower, Execute, Elevate"
            referrerPolicy="no-referrer"
            onError={() => setBannerError(true)}
            className={`w-full block mx-auto object-contain ${
              compact ? 'max-h-[210px] sm:max-h-[240px]' : 'max-h-[340px]'
            }`}
          />
        ) : (
          <div className="py-10 px-6 bg-[#07091B] text-center space-y-3">
            {!logoError && (
              <img
                src={AL_NIBRAS_LOGO_SRC}
                alt="Al-Nibras Group Emblem"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-[#FBBF24]/60"
              />
            )}
            <h3 className="text-2xl font-serif font-bold gold-gradient-text">
              AL-NIBRAS GROUP
            </h3>
            <p className="text-xs text-slate-300">
              From Idea to Execution — We Build Tomorrow&apos;s Entrepreneurs Today
            </p>
          </div>
        )}
      </div>

      {/* Structured Brand Action Bar & Mission Pillars */}
      <div className="px-5 py-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-slate-200 dark:border-[#232852]">
        <div className="flex items-center gap-3.5 min-w-0">
          {!logoError ? (
            <img
              src={AL_NIBRAS_LOGO_SRC}
              alt="Al-Nibras Group"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="w-11 h-11 rounded-full object-cover ring-1 ring-[#FBBF24]/60 bg-[#07091B] shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#07091B] border border-[#FBBF24]/50 flex items-center justify-center text-[#FBBF24] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          )}

          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-slate-900 dark:text-slate-100 font-serif">
                Al-Nibras Group
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-[#0E7490] dark:text-[#22D3EE] font-mono">
                AlNibras.pk
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span className="text-[#B45309] dark:text-[#FBBF24] hidden sm:inline">
                Innovate · Empower · Execute · Elevate
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {pillars.map((pillar, idx) => (
                <React.Fragment key={pillar}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span>{pillar}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {onNavigate && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onNavigate('learn');
              }}
              className="px-4 py-2 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.navLearn}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onNavigate('aiTutor');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#2C3366] text-slate-800 dark:text-cyan-300 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.navAiTutor}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
