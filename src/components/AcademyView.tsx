import React from 'react';
import { AppState, Course, Language, UserRole } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { BadgeShowcase } from './BadgeShowcase';
import { AlNibrasBrandBanner } from './AlNibrasBrandBanner';
import { Award, BookOpen, CheckCircle2, Star } from 'lucide-react';

interface AcademyViewProps {
  t: Translations;
  lang: Language;
  role?: UserRole;
  appData: AppState;
  theme: 'dark' | 'light';
  onOpenQuiz: () => void;
  onSelectCourse: (course: Course) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  t,
  lang,
  role = 'parent',
  appData,
  onOpenQuiz,
  onSelectCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    role === 'kid' ? 'kids' : 'all'
  );

  React.useEffect(() => {
    if (role === 'kid') {
      setSelectedCategory('kids');
    } else if (selectedCategory === 'kids' && role !== 'teen') {
      setSelectedCategory('all');
    }
  }, [role]);

  const filteredCourses = appData.courses.filter((c) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'kids') return c.age.includes('6-12') || c.price === 'Free';
    if (selectedCategory === 'adults') return c.age.includes('18+');
    if (selectedCategory === 'free') return c.price === 'Free';
    return true;
  });

  const enrolledIds = appData.enrolledCourseIds || [];
  const completedIds = appData.completedCourseIds || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Al-Nibras Group Academic Banner */}
      <AlNibrasBrandBanner t={t} lang={lang} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.navLearn}
          </h2>
          <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300">
            معروف علمائے کرام اور AAOIFI معیارات کے مطابق حلال سرمایہ کاری، مضاربہ، صکوک اور زکوٰۃ کے مصدقہ کورسز سیکھیں اور سرکاری سند حاصل کریں۔
          </p>
        </div>

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
      </div>

      {/* Academy Milestone Badges Showcase */}
      <BadgeShowcase
        t={t}
        lang={lang}
        earnedBadges={appData.earnedBadges || []}
        categoryFilter="academy"
        variant="catalog"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'تمام کورسز (All)' },
          { id: 'kids', label: 'بچوں کیلئے (6-12)' },
          { id: 'adults', label: 'بڑوں و تاجروں کیلئے (18+)' },
          { id: 'free', label: 'مفت کورسز (Free)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playSound('click');
              setSelectedCategory(cat.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                : 'bg-white dark:bg-[#10132C] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#232852] hover:bg-slate-100 dark:hover:bg-[#161B3B]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id);
          const isCompleted = completedIds.includes(course.id);

          return (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col justify-between space-y-4 transition-colors hover:border-[#FBBF24]/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-3xl p-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852]">
                  {course.icon}
                </div>
                <div className="text-end space-y-0.5">
                  <div
                    className={`text-xs font-bold font-mono tabular-nums ${
                      course.price === 'Free'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-[#B45309] dark:text-[#FBBF24]'
                    }`}
                  >
                    {course.price}
                  </div>
                  {(isCompleted || isEnrolled) && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isCompleted
                          ? t.completed
                          : lang === 'en'
                          ? 'Enrolled'
                          : lang === 'ps'
                          ? 'شامل شوی'
                          : 'داخلہ شدہ'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  <span>{course.age}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{course.rating} ({course.students.toLocaleString()})</span>
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-[#232852] flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200">{course.level}</strong>
                </span>
                <button
                  onClick={() => {
                    playSound('click');
                    onSelectCourse(course);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-[#FBBF24] text-slate-800 dark:text-slate-200 hover:text-[#07091B] border border-slate-200 dark:border-[#232852] font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEnrolled && !isCompleted ? t.markCourseCompleteBtn : t.viewAll}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certification Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-start">
          <div className="text-xs font-semibold text-[#0E7490] dark:text-[#22D3EE]">
            {t.verifiedStamp}
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.examIntro}
          </h3>
          <p className="text-xs max-w-xl leading-relaxed text-slate-600 dark:text-slate-300">
            کوئز میں تمام سوالات کے درست جوابات دے کر فوری طور پر اپنا ڈیجیٹل سرٹیفکیٹ حاصل کریں۔
          </p>
        </div>

        <button
          onClick={() => {
            playSound('click');
            onOpenQuiz();
          }}
          className="px-6 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>{t.examBtn}</span>
        </button>
      </div>
    </div>
  );
};
