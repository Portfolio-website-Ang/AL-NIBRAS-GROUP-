import React, { useState } from 'react';
import { AppState, Language, Course, TabType } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { BadgeShowcase } from './BadgeShowcase';
import { AlNibrasBrandBanner } from './AlNibrasBrandBanner';
import { GraduationCap, Users, BookOpen, PlusCircle, Award } from 'lucide-react';

interface TeacherDashboardViewProps {
  t: Translations;
  lang: Language;
  appData: AppState;
  onAddCourse: (course: Omit<Course, 'id' | 'rating' | 'students'>) => void;
  onSelectCourse: (course: Course) => void;
  onOpenQuiz: () => void;
  onNavigate: (tab: TabType) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  t,
  lang,
  appData,
  onAddCourse,
  onSelectCourse,
  onOpenQuiz,
  onNavigate,
}) => {
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [title, setTitle] = useState('');
  const [ageGroup, setAgeGroup] = useState('12-18 سال');
  const [level, setLevel] = useState('مبتدی (Beginner)');
  const [price, setPrice] = useState('Free');
  const [description, setDescription] = useState('');

  const ahmedActivities = (appData.activityLogs || []).filter((l) => l.child === 'Ahmed').length;
  const fatimaActivities = (appData.activityLogs || []).filter((l) => l.child === 'Fatima').length;
  const totalStudents = appData.courses.reduce((sum, c) => sum + c.students, 0);

  const studentRoster = [
    {
      name: lang === 'en' ? 'Ahmed Imran (9yr)' : 'احمد عمران (9 سال)',
      track: lang === 'en' ? 'Kids Noor Zone (6-12)' : 'نور زون بنیادی کورسز',
      streak: appData.streakDays,
      coins: appData.noorCoins,
      activities: ahmedActivities,
      level: appData.userLevel,
    },
    {
      name: lang === 'en' ? 'Fatima Imran (13yr)' : 'فاطمہ عمران (13 سال)',
      track: lang === 'en' ? 'Youth AAOIFI Track' : 'نوجوان شریعہ فنانس ٹریک',
      streak: Math.max(4, appData.streakDays - 2),
      coins: appData.noorCoins + 45,
      activities: fatimaActivities,
      level: 'Sapling (پودا)',
    },
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    playSound('success');
    onAddCourse({
      title: title.trim(),
      age: ageGroup,
      price,
      level,
      icon: '📘',
      description: description.trim(),
      modules: [
        {
          title: lang === 'en' ? 'Foundations & Sharia Principles' : 'بنیادی شرعی اصول',
          duration: '15 min',
          summary: description.trim(),
        },
      ],
    });
    setTitle('');
    setDescription('');
    setShowPublishForm(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Al-Nibras Group Academic Banner */}
      <AlNibrasBrandBanner t={t} lang={lang} onNavigate={onNavigate} />

      {/* Instructor Header (Zero Family Wallet / Zero Personal Zakat Data) */}
      <section className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#0E7490] dark:text-[#22D3EE]">
            {t.roleTeacher} · {t.halalCertified}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.teacherConsoleTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.teacherConsoleSub}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => {
              playSound('click');
              setShowPublishForm((prev) => !prev);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.publishCourseBtn}</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onOpenQuiz();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{t.startQuiz}</span>
          </button>
        </div>
      </section>

      {/* Instructor KPI Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{t.courseCatalogTitle}</span>
            <BookOpen className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />
          </div>
          <div className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {appData.courses.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'Active Sharia modules' : 'شریعہ اکیڈمی کے شائع شدہ کورسز'}
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{lang === 'en' ? 'Enrolled Cohort Learners' : 'اکیڈمی کے کل طلباء'}</span>
            <Users className="w-4 h-4 text-[#0E7490] dark:text-[#22D3EE]" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            {totalStudents.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'Across 4+ certification tracks' : 'مختلف تعلیمی درجات میں مصروف'}
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{lang === 'en' ? 'Daily Streak Health' : 'طلباء کا تعلیمی تسلسل'}</span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
            {appData.streakDays} {t.dayLabel}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {(appData.activityLogs || []).length} {lang === 'en' ? 'logged learning events' : 'ریکارڈ شدہ تعلیمی سرگرمیاں'}
          </p>
        </div>
      </section>

      {/* Publish New Micro-Course Form */}
      {showPublishForm && (
        <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-[#FBBF24]/50 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t.publishCourseBtn}
            </h3>
            <button
              onClick={() => setShowPublishForm(false)}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              {t.close}
            </button>
          </div>
          <form onSubmit={handlePublish} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'en' ? 'Course title (e.g. Sukuk & Halal Bonds)' : 'کورس کا عنوان (مثلاً صکوک اور حلال بانڈز)'}
              className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-[#FBBF24]"
              required
            />
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="6-12 سال">6-12 سال (Kids)</option>
              <option value="12-18 سال">12-18 سال (Youth)</option>
              <option value="18+ سال">18+ سال (Adults)</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="مبتدی (Beginner)">Beginner</option>
                <option value="متوسط (Intermediate)">Intermediate</option>
                <option value="ماہر (Advanced)">Advanced</option>
              </select>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="Free">Free</option>
                <option value="Rs 1,499">Rs 1,499</option>
                <option value="Rs 2,999">Rs 2,999</option>
              </select>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder={lang === 'en' ? 'Short Sharia learning objectives...' : 'کورس کے مختصر تعلیمی مقاصد...'}
              className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-[#FBBF24]"
              required
            />
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs cursor-pointer"
              >
                {t.publishCourseBtn}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Student Roster Table */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.studentRosterTitle}
          </h3>
          <button
            onClick={() => onNavigate('kids')}
            className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] hover:underline cursor-pointer"
          >
            {t.navKids} →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#232852] text-slate-500 dark:text-slate-400">
                <th className="py-3 px-3 text-start font-semibold">{lang === 'en' ? 'Student' : 'طالب علم'}</th>
                <th className="py-3 px-3 text-start font-semibold">{lang === 'en' ? 'Curriculum Track' : 'تعلیمی ٹریک'}</th>
                <th className="py-3 px-3 text-start font-semibold">{t.streak}</th>
                <th className="py-3 px-3 text-start font-semibold">{t.noorCoins}</th>
                <th className="py-3 px-3 text-start font-semibold">{lang === 'en' ? 'Events' : 'سرگرمیاں'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#232852]">
              {studentRoster.map((student) => (
                <tr key={student.name}>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {student.name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                    {student.track}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                    {student.streak} {t.dayLabel}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums font-semibold text-[#B45309] dark:text-[#FBBF24]">
                    {student.coins} 🪙
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                    {student.activities}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Earned Student & Academy Milestone Badges */}
      <BadgeShowcase
        t={t}
        lang={lang}
        earnedBadges={appData.earnedBadges || []}
        variant="dashboard"
        onNavigate={onNavigate}
      />

      {/* Academy Course Management Grid */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.courseCatalogTitle}
          </h3>
          <button
            onClick={() => onNavigate('learn')}
            className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24] hover:underline cursor-pointer"
          >
            {t.navLearn} →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appData.courses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  {course.age} · {course.students.toLocaleString()} students · {course.price}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {course.icon} {course.title}
                </div>
              </div>
              <button
                onClick={() => onSelectCourse(course)}
                className="px-3.5 py-2 rounded-lg bg-slate-200 dark:bg-[#07091B] hover:bg-[#FBBF24] hover:text-[#07091B] text-slate-800 dark:text-slate-200 font-semibold text-xs shrink-0 transition-colors cursor-pointer"
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
