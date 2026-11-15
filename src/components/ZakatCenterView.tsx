import React, { useState } from 'react';
import { AppState, Language } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { AL_NIBRAS_LOGO_SRC } from './AlNibrasBrandBanner';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ZakatCenterViewProps {
  t: Translations;
  lang?: Language;
  appData: AppState;
  setAppData: React.Dispatch<React.SetStateAction<AppState>>;
  theme: 'dark' | 'light';
}

interface WelfareCategory {
  id: string;
  nameEn: string;
  nameUr: string;
  namePs: string;
  nameAr: string;
  color: string;
  icon: string;
  quranicRef: string;
  impactFormula: (amount: number) => string;
  description: string;
}

export const ZakatCenterView: React.FC<ZakatCenterViewProps> = ({
  t,
  lang = 'ur',
  appData,
  setAppData,
  theme,
}) => {
  const [cash, setCash] = useState<number>(250000);
  const [goldGrams, setGoldGrams] = useState<number>(15);
  const [silverGrams, setSilverGrams] = useState<number>(100);
  const [businessStock, setBusinessStock] = useState<number>(50000);
  const [sharesInvestments, setSharesInvestments] = useState<number>(20000);
  const [debtsDeduction, setDebtsDeduction] = useState<number>(15000);

  const [selectedCharity, setSelectedCharity] = useState('alkhidmat');
  const [receiptData, setReceiptData] = useState<any>(null);
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [selectedStrategy, setSelectedStrategy] = useState<'balanced' | 'food' | 'orphan' | 'health'>('balanced');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  const goldRatePerGram = 24460;
  const silverRatePerGram = 310;

  const goldValue = Math.max(0, goldGrams) * goldRatePerGram;
  const silverValue = Math.max(0, silverGrams) * silverRatePerGram;
  const grossAssets = Math.max(0, cash) + goldValue + silverValue + Math.max(0, businessStock) + Math.max(0, sharesInvestments);
  const netZakatable = Math.max(0, grossAssets - Math.max(0, debtsDeduction));
  const calculatedZakat = Math.round(netZakatable * 0.025);

  const silverNisabPKR = 595 * silverRatePerGram;
  const goldNisabPKR = Math.round(87.48 * goldRatePerGram);
  const meetsSilverNisab = netZakatable >= silverNisabPKR;
  const nisabProgress = Math.min(100, Math.round((netZakatable / silverNisabPKR) * 100));

  const strategyWeights: Record<'balanced' | 'food' | 'orphan' | 'health', Record<string, number>> = {
    balanced: { food: 35, orphan: 25, health: 20, water: 10, education: 10 },
    food: { food: 50, orphan: 20, health: 15, water: 10, education: 5 },
    orphan: { food: 20, orphan: 45, health: 15, water: 10, education: 10 },
    health: { food: 20, orphan: 15, health: 45, water: 10, education: 10 },
  };

  const welfareCategories: WelfareCategory[] = [
    {
      id: 'food',
      nameEn: 'Food Security & Hunger Relief',
      nameUr: 'راشن و خوراک (فقراء و مساکین)',
      namePs: 'د خوراک او غلو وېش',
      nameAr: 'إطعام الطعام ومكافحة الجوع',
      color: '#10B981',
      icon: '🍲',
      quranicRef: '«إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ»',
      description: 'مستحق اور سفید پوش خاندانوں کو ماہانہ راشن بیگز کی فراہمی',
      impactFormula: (amount) => {
        const families = Math.max(1, Math.round(amount / 4500));
        return `~${families} مستحق خاندانوں کو راشن پیکج`;
      },
    },
    {
      id: 'orphan',
      nameEn: 'Orphan Care & Widows Support',
      nameUr: 'کفالتِ یتامیٰ و بیوگان',
      namePs: 'د یتیمانو او کونډو کفالت',
      nameAr: 'كفالة الأيتام والأرامل',
      color: '#FBBF24',
      icon: '👶',
      quranicRef: '«أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ كَهَاتَيْنِ»',
      description: 'یتیم بچوں کے تعلیمی و معاشی اخراجات اور بیواؤں کی سرپرستی',
      impactFormula: (amount) => {
        const orphans = Math.max(1, Math.round(amount / 6500));
        return `~${orphans} یتیم بچوں کی ماہانہ مکمل کفالت`;
      },
    },
    {
      id: 'health',
      nameEn: 'Healthcare & Cancer Support',
      nameUr: 'طبی علاج و کینسر مریضوں کی امداد',
      namePs: 'روغتیايي درملنه او ناروغان',
      nameAr: 'الرعاية الصحية وعلاج السرطان',
      color: '#22D3EE',
      icon: '🏥',
      quranicRef: '«وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا»',
      description: 'ڈائیلاسز، کینسر کیموتھراپی اور مہنگی جان بچانے والی ادویات',
      impactFormula: (amount) => {
        const patients = Math.max(1, Math.round(amount / 8000));
        return `~${patients} کینسر و ڈائیلاسز مریضوں کا مفت علاج`;
      },
    },
    {
      id: 'water',
      nameEn: 'Clean Water & Filtration',
      nameUr: 'صاف پینے کا پانی (فلٹریشن پلانٹس)',
      namePs: 'د څښاک پاکې اوبه',
      nameAr: 'سقيا الماء وحفر الآبار',
      color: '#3B82F6',
      icon: '💧',
      quranicRef: '«أَفْضَلُ الصَّدَقَةِ سَقْيُ الْمَاءِ»',
      description: 'تھرپارکر، بلوچستان اور پسماندہ علاقوں میں واٹر فلٹریشن یونٹس',
      impactFormula: (amount) => {
        const people = Math.max(10, Math.round((amount / 1000) * 8));
        return `~${people} افراد کو روزانہ صاف پانی`;
      },
    },
    {
      id: 'education',
      nameEn: 'Education & Student Grants',
      nameUr: 'تعلیمی وظائف (فی سبیل اللہ)',
      namePs: 'تعلیمي بورسونه او مرستې',
      nameAr: 'المنح التعليمية وكفالة الطلاب',
      color: '#EC4899',
      icon: '📚',
      quranicRef: '«وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ»',
      description: 'نادار اور لائق طلباء کی اسکول، کالج اور یونیورسٹی فیس کی ادائیگی',
      impactFormula: (amount) => {
        const students = Math.max(1, Math.round(amount / 3500));
        return `~${students} طلباء کے ماہانہ تعلیمی وظائف`;
      },
    },
  ];

  const totalDisbursed = Math.max(10000, appData.zakatPaidTotal);
  const currentWeights = strategyWeights[selectedStrategy];

  const chartData = welfareCategories.map((cat) => {
    const share = currentWeights[cat.id] || 20;
    const allocatedAmount = Math.round((totalDisbursed * share) / 100);

    let localizedName = cat.nameUr;
    if (lang === 'en') localizedName = cat.nameEn;
    else if (lang === 'ps') localizedName = cat.namePs;
    else if (lang === 'ar') localizedName = cat.nameAr;

    return {
      id: cat.id,
      name: localizedName,
      englishName: cat.nameEn,
      share,
      amount: allocatedAmount,
      color: cat.color,
      icon: cat.icon,
      quranicRef: cat.quranicRef,
      description: cat.description,
      impact: cat.impactFormula(allocatedAmount),
    };
  });

  const activeCategory =
    activeCategoryIndex !== null ? chartData[activeCategoryIndex] : chartData[0];

  const charities = [
    {
      id: 'alkhidmat',
      name: 'Alkhidmat Foundation Pakistan',
      urdu: 'الخدمت فاؤنڈیشن پاکستان',
      focus: 'یتامیٰ کفالت، صاف پانی، اور آفت زدگان کی امداد',
      verified: true,
      logo: '🤝',
    },
    {
      id: 'edhi',
      name: 'Edhi Foundation',
      urdu: 'ایدھی فاؤنڈیشن',
      focus: 'ایمبولینس نیٹ ورک اور لاوارث بچوں کی نگہداشت',
      verified: true,
      logo: '🚑',
    },
    {
      id: 'shaukat',
      name: 'Shaukat Khanum Memorial Hospital',
      urdu: 'شوکت خانم میموریل کینسر ہسپتال',
      focus: 'مستحق کینسر مریضوں کا مفت علاج',
      verified: true,
      logo: '🏥',
    },
    {
      id: 'indus',
      name: 'Indus Hospital & Health Network',
      urdu: 'انڈس ہسپتال اینڈ ہیلتھ نیٹ ورک',
      focus: '100% بلا معاوضہ معیاری صحت کی سہولیات',
      verified: true,
      logo: '💉',
    },
  ];

  const handlePayZakat = () => {
    if (calculatedZakat <= 0) return;

    const charityObj = charities.find((c) => c.id === selectedCharity) || charities[0];

    playSound('success');
    try {
      confetti({ particleCount: 150, spread: 85, origin: { y: 0.6 } });
    } catch {}

    setAppData((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - calculatedZakat),
      zakatPaidTotal: prev.zakatPaidTotal + calculatedZakat,
    }));

    setReceiptData({
      charityName: charityObj.name,
      charityUrdu: charityObj.urdu,
      amount: calculatedZakat,
      date: new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' }),
      receiptNo: `ZN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: t.officialSealed,
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-3.5 rounded-xl border text-xs shadow-2xl backdrop-blur-md ${
            theme === 'dark'
              ? 'bg-[#07091B]/95 border-[#FBBF24]/50 text-white'
              : 'bg-white/95 border-[#B45309]/40 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            <span className="text-base">{data.icon}</span>
            <span>{data.name}</span>
          </div>
          <div className="text-sm font-serif font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            Rs {data.amount.toLocaleString()} PKR ({data.share}%)
          </div>
          <div className="text-[11px] text-[#B45309] dark:text-[#FBBF24] mt-1 pt-1 border-t border-slate-200 dark:border-[#232852] font-medium">
            🎯 {data.impact}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-extrabold gold-gradient-text">
          {t.navZakat} — Sharia Calculator &amp; Disbursal Hub
        </h2>
        <p className="text-xs sm:text-sm max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
          قرآن و سنت کے مطابق 2.5٪ کی شرح سے زکوٰۃ کا شفاف حساب، فلاحی مصارف کی تقسیم، اور مصدقہ خیراتی اداروں کو براہ راست منتقلی۔
        </p>
      </div>

      {/* Visual Nisab Gauge Banner */}
      <div
        className={`p-6 rounded-2xl border transition-colors ${
          meetsSilverNisab
            ? 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/35 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200'
        } space-y-4`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meetsSilverNisab ? '⚖️' : 'ℹ️'}</span>
            <div>
              <div className="font-bold text-base">
                {meetsSilverNisab
                  ? 'شرعی نصاب پورا ہے: آپ کے خالص اثاثوں پر 2.5٪ زکوٰۃ فرض ہے۔'
                  : 'اثاثے چاندی کے نصاب سے کم ہیں؛ زکوٰۃ فرض نہیں، مگر نفلی صدقہ مستحب ہے۔'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono tabular-nums">
                چاندی کا نصاب (595 گرام): <strong>Rs {silverNisabPKR.toLocaleString()}</strong> | سونے کا نصاب (87.48 گرام):{' '}
                <strong>Rs {goldNisabPKR.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/85 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-xs font-mono tabular-nums font-bold whitespace-nowrap text-slate-900 dark:text-slate-100">
            خالص اثاثے: Rs {netZakatable.toLocaleString()}
          </div>
        </div>

        {/* Dynamic Nisab Progress Meter */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-bold font-mono tabular-nums">
            <span>نصاب کی سطح: {nisabProgress}%</span>
            <span>حد: Rs {silverNisabPKR.toLocaleString()}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-[#07091B] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                meetsSilverNisab
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : 'bg-[#FBBF24]'
              }`}
              style={{ width: `${nisabProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC RECHARTS ZAKAT WELFARE DISTRIBUTION CHART SECTION */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] shadow-xl">
        <div className="h-[3px] w-full nibras-accent-bar" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#232852] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/15 text-xl border border-emerald-500/30">
                  📊
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-extrabold gold-gradient-text tracking-tight">
                  زکوٰۃ فنڈز کی شرعی تقسیم (Zakat Distribution Chart)
                </h3>
              </div>
              <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                ادا شدہ زکوٰۃ (Rs {totalDisbursed.toLocaleString()} PKR) کے فلاحی شعبوں میں استعمال کا ریئل ٹائم چارٹ
              </p>
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center rounded-xl p-1 border border-slate-200 dark:border-[#232852] bg-slate-100 dark:bg-[#07091B]">
              <button
                onClick={() => {
                  playSound('click');
                  setChartType('donut');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  chartType === 'donut'
                    ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🍩</span>
                <span>Donut Chart</span>
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setChartType('bar');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📊</span>
                <span>Bar Chart</span>
              </button>
            </div>
          </div>

          {/* Allocation Strategy Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                فلاحی مصارف کی ترجیحی حکمت عملی (Distribution Strategy):
              </span>
              <span className="text-[#0E7490] dark:text-[#22D3EE]">100% قرآنی مصارف</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'balanced', label: '⚖️ متوازن شرعی تقسیم (Balanced)' },
                { id: 'food', label: '🍲 راشن و خوراک (Food First)' },
                { id: 'orphan', label: '👶 یتامیٰ و بیوگان (Orphan Focus)' },
                { id: 'health', label: '🏥 طبی علاج و ادویات (Healthcare)' },
              ].map((strat) => (
                <button
                  key={strat.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedStrategy(strat.id as any);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors border text-start cursor-pointer ${
                    selectedStrategy === strat.id
                      ? 'bg-[#FBBF24] text-[#07091B] border-[#FBBF24]'
                      : 'bg-slate-50 dark:bg-[#161B3B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#232852] hover:border-[#FBBF24]/50'
                  }`}
                >
                  {strat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Chart Canvas & Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            {/* Recharts Component */}
            <div className="lg:col-span-7 h-72 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'donut' ? (
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="amount"
                      animationDuration={900}
                      onMouseEnter={(_, index) => setActiveCategoryIndex(index)}
                      onMouseLeave={() => setActiveCategoryIndex(null)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={activeCategoryIndex === index ? '#FFFFFF' : 'transparent'}
                          strokeWidth={activeCategoryIndex === index ? 3 : 1}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="englishName"
                      tick={{ fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
                      tickFormatter={(val) => `Rs ${val / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="amount"
                      radius={[8, 8, 0, 0]}
                      animationDuration={900}
                      onMouseEnter={(_, index) => setActiveCategoryIndex(index)}
                      onMouseLeave={() => setActiveCategoryIndex(null)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`bar-cell-${index}`}
                          fill={entry.color}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>

              {/* Donut Center Display */}
              {chartType === 'donut' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    کل تقسیم شدہ زکوٰۃ
                  </span>
                  <span className="text-xl font-serif font-extrabold gold-gradient-text font-mono tabular-nums">
                    Rs {totalDisbursed.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">100% شرعی مصارف</span>
                </div>
              )}
            </div>

            {/* Interactive Category Breakdown List */}
            <div className="lg:col-span-5 space-y-2.5">
              {chartData.map((cat, idx) => {
                const isHovered = activeCategoryIndex === idx;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      playSound('click');
                      setActiveCategoryIndex(idx);
                    }}
                    onMouseEnter={() => setActiveCategoryIndex(idx)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      isHovered
                        ? 'border-[#FBBF24] bg-amber-50 dark:bg-[#FBBF24]/15'
                        : 'bg-slate-50 dark:bg-[#161B3B] border-slate-200 dark:border-[#232852] hover:border-[#FBBF24]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {cat.impact}
                        </div>
                      </div>
                    </div>

                    <div className="text-end flex-shrink-0 font-mono tabular-nums">
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 block">
                        Rs {cat.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#B45309] dark:text-[#FBBF24] font-bold">
                        {cat.share}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Category Deep Dive Panel */}
          {activeCategory && (
            <div className="p-4 rounded-xl border bg-slate-50 dark:bg-[#07091B] border-slate-200 dark:border-[#232852] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeCategory.icon}</span>
                  <span className="text-xs font-bold text-[#B45309] dark:text-[#FBBF24]">
                    شرعی حوالہ: {activeCategory.quranicRef}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activeCategory.description}</p>
              </div>

              <div className="text-start sm:text-end flex-shrink-0">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">تخمینہ شدہ انسانی اثر:</span>
                <strong className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  {activeCategory.impact}
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calculator Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>🧮</span>
          <span>اثاثہ جات کی تفصیلات درج کریں</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Cash */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
              {t.cashLabel}
            </label>
            <input
              type="number"
              value={cash}
              onChange={(e) => setCash(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-base outline-none focus:border-[#FBBF24]"
            />
          </div>

          {/* Gold */}
          <div>
            <label className="block text-xs font-bold mb-1.5 flex justify-between text-slate-700 dark:text-slate-300">
              <span>{t.goldLabel}</span>
              <span className="text-[10px] text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
                Rs {goldRatePerGram.toLocaleString()}/g
              </span>
            </label>
            <input
              type="number"
              value={goldGrams}
              onChange={(e) => setGoldGrams(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-base outline-none focus:border-[#FBBF24]"
            />
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">مالیت: Rs {goldValue.toLocaleString()}</div>
          </div>

          {/* Silver */}
          <div>
            <label className="block text-xs font-bold mb-1.5 flex justify-between text-slate-700 dark:text-slate-300">
              <span>{t.silverLabel}</span>
              <span className="text-[10px] text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
                Rs {silverRatePerGram}/g
              </span>
            </label>
            <input
              type="number"
              value={silverGrams}
              onChange={(e) => setSilverGrams(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-base outline-none focus:border-[#FBBF24]"
            />
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">مالیت: Rs {silverValue.toLocaleString()}</div>
          </div>

          {/* Business Inventory */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
              {t.businessGoodsLabel}
            </label>
            <input
              type="number"
              value={businessStock}
              onChange={(e) => setBusinessStock(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-base outline-none focus:border-[#FBBF24]"
            />
          </div>

          {/* Shares / Investments */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
              اسٹاکس، میوچل فنڈز اور صکوک (PKR)
            </label>
            <input
              type="number"
              value={sharesInvestments}
              onChange={(e) => setSharesInvestments(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-base outline-none focus:border-[#FBBF24]"
            />
          </div>

          {/* Deductible Debts */}
          <div>
            <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1.5">
              {t.debtsLabel}
            </label>
            <input
              type="number"
              value={debtsDeduction}
              onChange={(e) => setDebtsDeduction(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-slate-100 font-mono tabular-nums text-base outline-none focus:border-rose-500"
            />
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">فوری واجب الادا قرضے</div>
          </div>
        </div>

        {/* Charity Selector */}
        <div className="pt-4 border-t border-slate-200 dark:border-[#232852] space-y-3">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {t.selectCharity}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {charities.map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  playSound('click');
                  setSelectedCharity(ch.id);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  selectedCharity === ch.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-[#161B3B] border-slate-200 dark:border-[#232852] hover:border-[#FBBF24]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ch.logo}</span>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{ch.urdu}</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{ch.focus}</p>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span>✓</span>
                  <span>{t.verifiedCharityBadge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Banner & Payment Trigger */}
        <div className="p-6 sm:p-7 rounded-2xl border bg-slate-50 dark:bg-[#07091B] border-[#FBBF24]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{t.totalZakatable}</span>
            <div className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              Rs {netZakatable.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              شریعت شرح 2.5% نافذ العمل ہے۔
            </p>
          </div>

          <div className="text-start md:text-end space-y-1">
            <span className="text-xs text-[#0E7490] dark:text-[#22D3EE] font-bold">{t.payableZakat}</span>
            <div className="text-3xl sm:text-4xl font-serif font-black gold-gradient-text font-mono tabular-nums">
              Rs {calculatedZakat.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handlePayZakat}
            disabled={calculatedZakat <= 0}
            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
              calculatedZakat > 0
                ? 'bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] cursor-pointer'
                : 'bg-slate-200 dark:bg-[#161B3B] text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>🌙</span>
            <span>{t.zakatPayNow}</span>
          </button>
        </div>
      </div>

      {/* Official Zakat Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 bg-[#07091B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-[#10132C] border-2 border-[#FBBF24] rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="h-[3px] w-full nibras-accent-bar" />
            <div className="p-8 space-y-6">
              <div className="text-center space-y-2 border-b border-slate-200 dark:border-[#232852] pb-4">
                <img
                  src={AL_NIBRAS_LOGO_SRC}
                  alt="Al-Nibras Group Emblem"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-[#FBBF24]/70 bg-[#07091B]"
                />
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                  {t.receiptTitle}
                </h3>
                <p className="text-xs text-[#0E7490] dark:text-[#22D3EE] font-bold">
                  {receiptData.status} · Al-Nibras Group
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#232852]">
                  <span className="text-slate-500 dark:text-slate-400">{t.receiptNum}:</span>
                  <span className="font-mono tabular-nums font-bold text-[#B45309] dark:text-[#FBBF24]">{receiptData.receiptNo}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#232852]">
                  <span className="text-slate-500 dark:text-slate-400">{t.receiptCharity}:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{receiptData.charityUrdu}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#232852]">
                  <span className="text-slate-500 dark:text-slate-400">{t.receiptDate}:</span>
                  <span>{receiptData.date}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#232852]">
                  <span className="text-slate-500 dark:text-slate-400">{t.receiptAmount}:</span>
                  <span className="text-lg font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                    Rs {receiptData.amount.toLocaleString()} PKR
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#07091B] rounded-xl border border-slate-200 dark:border-[#232852] text-[11px] text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                «خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا»
                <br />
                الحمد للہ! زکوٰۃ براہِ راست مستحقین کے کھاتے میں منتقل ہو گئی۔
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs cursor-pointer"
                >
                  🖨️ {t.printCertificate}
                </button>
                <button
                  onClick={() => setReceiptData(null)}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-[#1E254D] cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
