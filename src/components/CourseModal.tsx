import React, { useState } from 'react';
import { Course, Language } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { CheckCircle2, Circle, Award, X } from 'lucide-react';

interface CourseModalProps {
  course: Course;
  t?: Translations;
  lang?: Language;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  onCompleteCourse?: (course: Course) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  t,
  lang = 'ur',
  isEnrolled = false,
  isCompleted = false,
  onClose,
  onEnroll,
  onCompleteCourse,
}) => {
  const [checkedModules, setCheckedModules] = useState<number[]>(() =>
    isCompleted ? course.modules.map((_, i) => i) : []
  );

  const toggleModule = (idx: number) => {
    playSound('click');
    setCheckedModules((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const allModulesChecked =
    course.modules.length > 0 && checkedModules.length === course.modules.length;

  return (
    <div className="fixed inset-0 z-50 bg-[#07091B]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-xl w-full bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] rounded-2xl overflow-hidden shadow-2xl relative my-8 animate-fadeIn">
        <div className="h-[3px] w-full nibras-accent-bar" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl p-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] shrink-0">
                {course.icon}
              </span>
              <div>
                <div className="text-xs font-mono tabular-nums font-bold text-[#0E7490] dark:text-[#22D3EE]">
                  {course.price} · {course.level}
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
                  {course.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer"
              aria-label={t?.close || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.description}
          </p>

          {/* Details strip */}
          <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-center text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                {lang === 'en' ? 'Age Group' : lang === 'ps' ? 'عمر' : 'موزوں عمر'}
              </span>
              <strong className="text-slate-900 dark:text-slate-100 font-bold">{course.age}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                {lang === 'en' ? 'Rating' : lang === 'ps' ? 'درجه' : 'ریٹنگ'}
              </span>
              <strong className="text-[#B45309] dark:text-[#FBBF24] font-bold font-mono tabular-nums">
                ⭐ {course.rating}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                {lang === 'en' ? 'Learners' : lang === 'ps' ? 'زده کوونکي' : 'طالب علم'}
              </span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-bold font-mono tabular-nums">
                {course.students.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Interactive Modules syllabus list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#B45309] dark:text-[#FBBF24] uppercase tracking-wider">
                {lang === 'en' ? 'Course Syllabus & Lesson Checklist' : 'کورس نصاب و اسباق (Syllabus)'}
              </h4>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {checkedModules.length}/{course.modules.length}
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {course.modules.map((m, idx) => {
                const checked = checkedModules.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleModule(idx)}
                    className={`w-full text-start p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                      checked
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-50 dark:bg-[#161B3B] border-slate-200 dark:border-[#232852] hover:border-[#FBBF24]/50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {checked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          {lang === 'en' ? `Lesson ${idx + 1}: ` : `سبق ${idx + 1}: `}
                          {m.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {m.summary}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                      {m.duration}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {!isEnrolled ? (
              <button
                onClick={() => {
                  playSound('success');
                  onEnroll(course);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {lang === 'en'
                  ? 'Enroll & Start Course'
                  : lang === 'ps'
                  ? 'په کورس کې شامل شئ'
                  : 'کورس میں داخلہ لیں اور سبق شروع کریں'}
              </button>
            ) : isCompleted ? (
              <div className="flex-1 py-3 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                <span>{t?.courseCompletedLabel || 'Course Completed ✓'}</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  playSound('success');
                  onCompleteCourse?.(course);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  allModulesChecked
                    ? 'bg-[#047857] dark:bg-[#10B981] text-white dark:text-[#07091B] hover:opacity-90'
                    : 'bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{t?.markCourseCompleteBtn || 'Complete Course & Claim Badge'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] text-slate-700 dark:text-slate-200 font-semibold text-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t?.close || 'بند کریں'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
