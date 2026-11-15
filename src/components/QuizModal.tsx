import React from 'react';
import { Translations } from '../translations';
import { Language } from '../types';
import { playSound } from '../utils/sound';
import { Award, X } from 'lucide-react';

interface QuizModalProps {
  t: Translations;
  lang?: Language;
  onClose: () => void;
  onPass: (score: number) => void;
}

interface QuestionItem {
  qUr: string;
  qPs: string;
  qEn: string;
  optionsUr: string[];
  optionsPs: string[];
  optionsEn: string[];
  answer: number;
  hintUr: string;
  hintPs: string;
  hintEn: string;
}

const QUIZ_QUESTIONS: QuestionItem[] = [
  {
    qUr: 'سال بھر نصاب پر برقرار رہنے والے قابلِ زکوٰۃ اثاثوں پر شریعت میں زکوٰۃ کی شرح کیا مقرر ہے؟',
    qPs: 'د کال په اوږدو کې د نصاب وړ شتمنیو باندې په اسلامي شریعت کې د زکات کچه څومره ده؟',
    qEn: 'What is the Sharia prescribed rate of Zakat on net zakatable assets held for one full lunar year?',
    optionsUr: ['1.0%', '2.5%', '5.0%', '10.0%'],
    optionsPs: ['1.0%', '2.5%', '5.0%', '10.0%'],
    optionsEn: ['1.0%', '2.5%', '5.0%', '10.0%'],
    answer: 1,
    hintUr: 'شریعت میں مال کے ہر چالیسویں حصے یعنی 2.5٪ پر زکوٰۃ فرض ہے۔',
    hintPs: 'په شریعت کې د مال په هره څلوېښتمه برخه (۲.۵٪) زکات فرض دی.',
    hintEn: 'In Sharia, Zakat is obligatory at one fortieth (2.5%) of net wealth.',
  },
  {
    qUr: 'مضاربہ کے شرعی معاہدے میں "رب المال" کا بنیادی کردار کیا ہوتا ہے؟',
    qPs: 'په مضاربت کې د "رب المال" (پانګوال) اصلي دنده څه ده؟',
    qEn: 'In a Mudarabah contract, what is the primary role of "Rabb-ul-Mal"?',
    optionsUr: [
      'تمام مالیاتی سرمایہ فراہم کرنا اور انتظامی محنت نہ کرنا',
      'صرف جسمانی محنت اور انتظام سنبھالنا',
      'بینک کا سیکیورٹی گارڈ بننا',
      'قانونی عدالت میں ضمانت دینا',
    ],
    optionsPs: [
      'ټوله مالي پانګه برابرول او عملي کار نه کول',
      'یوازې جسماني کار او مدیریت کول',
      'د بانک امنیتي ساتندوی جوړېدل',
      'په محکمې کې ضامني ورکول',
    ],
    optionsEn: [
      'Providing financial capital without managerial labor',
      'Only providing physical labor and day-to-day management',
      'Acting as a collateral security guarantor',
      'Managing external audit legalities',
    ],
    answer: 0,
    hintUr: 'رب المال یعنی سرمایہ دار کا کام حلال سرمایہ فراہم کرنا ہوتا ہے، جبکہ مضارب کا کام محنت و مہارت ہے۔',
    hintPs: 'رب المال پانګه برابروي او مضارب خپل مهارت او هڅه لګوي.',
    hintEn: 'Rabb-ul-Mal provides the financial capital, while the Mudarib contributes labor & expertise.',
  },
  {
    qUr: 'اسلامی مالیات میں کون سا عنصر قطعی طور پر ممنوع (حرام) قرار دیا گیا ہے؟',
    qPs: 'په اسلامي مالي نظام کې کوم شی قطعي حرام او منع دی؟',
    qEn: 'Which element is strictly prohibited (Haram) in Islamic finance?',
    optionsUr: [
      'حقیقی نفع و نقصان میں شراکت',
      'ربوا (سود یا فکسڈ انٹرسٹ)',
      'مرابحہ کے تحت لاگت بتا کر تجارت',
      'صکوک (اسلامی بانڈز) میں سرمایہ کاری',
    ],
    optionsPs: [
      'د نفع او تاوان رښتینې شراکت',
      'سود (ربوا یا فکسډ ګټه)',
      'د مرابحې له مخې د بیې په ښودلو تجارت',
      'په صکوک (اسلامي اسنادو) کې پانګونه',
    ],
    optionsEn: [
      'Real profit-and-loss risk sharing',
      'Riba (usury / guaranteed interest)',
      'Murabaha cost-plus financing',
      'Investing in asset-backed Sukuk',
    ],
    answer: 1,
    hintUr: 'قرآن کریم نے واضح فرمایا: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا" (اللہ نے بیع حلال اور سود حرام کیا ہے)۔',
    hintPs: 'قرآن کریم فرمایي: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا" (الله تجارت حلال او سود حرام کړی دی).',
    hintEn: 'The Quran commands: "Allah has permitted trade and forbidden usury (Riba)".',
  },
  {
    qUr: 'چاندی پر زکوٰۃ کے وجوب کا شرعی نصاب کتنا ہے؟',
    qPs: 'د سپینو زرو د زکات شرعي نصاب څومره دی؟',
    qEn: 'What is the Sharia Nisab threshold for silver Zakat?',
    optionsUr: ['52.5 تولہ یعنی 595 گرام', '10 تولہ یعنی 116 گرام', '100 تولہ', 'صرف 10 گرام'],
    optionsPs: ['52.5 تولې یعنې 595 ګرامه', '10 تولې یعنې 116 ګرامه', '100 تولې', 'یوازې 10 ګرامه'],
    optionsEn: ['52.5 Tolas (~595 grams)', '10 Tolas (~116 grams)', '100 Tolas', '10 grams'],
    answer: 0,
    hintUr: 'چاندی کا نصاب 200 درہم یعنی 52.5 تولہ (595 گرام) ہے۔',
    hintPs: 'د سپینو زرو نصاب ۲۰۰ درهمه (۵۲.۵ تولې یا ۵۹۵ ګرامه) دی.',
    hintEn: 'The Nisab of silver is 200 dirhams (52.5 tolas / ~595 grams).',
  },
];

export const QuizModal: React.FC<QuizModalProps> = ({ t, lang = 'ur', onClose, onPass }) => {
  const [currentQ, setCurrentQ] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const qItem = QUIZ_QUESTIONS[currentQ];
  const questionText = lang === 'ps' ? qItem.qPs : lang === 'en' ? qItem.qEn : qItem.qUr;
  const options = lang === 'ps' ? qItem.optionsPs : lang === 'en' ? qItem.optionsEn : qItem.optionsUr;
  const hintText = lang === 'ps' ? qItem.hintPs : lang === 'en' ? qItem.hintEn : qItem.hintUr;

  const handleAnswer = (selectedIdx: number) => {
    if (selectedIdx === qItem.answer) {
      playSound('coin');
      setErrorMsg(null);
      if (currentQ + 1 < QUIZ_QUESTIONS.length) {
        setCurrentQ((prev) => prev + 1);
      } else {
        onPass(100);
      }
    } else {
      playSound('alert');
      setErrorMsg(hintText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07091B]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
        <div className="h-[3px] w-full nibras-accent-bar" />

        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#232852] pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#B45309] dark:text-[#FBBF24]" />
              <span className="text-xs font-bold text-[#B45309] dark:text-[#FBBF24] uppercase tracking-wider font-mono tabular-nums">
                {t.quizTitle} · {lang === 'ps' ? `پوښتنه ${currentQ + 1}/${QUIZ_QUESTIONS.length}` : lang === 'en' ? `Question ${currentQ + 1}/${QUIZ_QUESTIONS.length}` : `سوال ${currentQ + 1} از ${QUIZ_QUESTIONS.length}`}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#161B3B] cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-[#07091B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FBBF24] to-[#22D3EE] rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
            {questionText}
          </h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/35 text-xs font-semibold leading-relaxed">
              ⚠️ {lang === 'ps' ? 'غلط ځواب! لارښوونه: ' : lang === 'en' ? 'Incorrect! Hint: ' : 'غلط جواب! رہنمائی: '} {errorMsg}
            </div>
          )}

          <div className="space-y-2.5">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-start p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] hover:bg-amber-50 dark:hover:bg-[#FBBF24]/15 border border-slate-200 dark:border-[#232852] hover:border-[#FBBF24] text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>{opt}</span>
                <span className="text-slate-400 group-hover:text-[#B45309] dark:group-hover:text-[#FBBF24] font-bold">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
