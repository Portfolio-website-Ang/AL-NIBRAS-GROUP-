import React, { useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  TabType,
  AppState,
  ApprovalRequest,
  CertificateData,
  Course,
  ChildActivityLog,
} from './types';
import { TRANSLATIONS } from './translations';
import { MILESTONE_BADGES, getBadgeTitle } from './data/badges';
import { playSound } from './utils/sound';
import { Navbar } from './components/Navbar';
import { ParentDashboardView } from './components/ParentDashboardView';
import { KidDashboardView } from './components/KidDashboardView';
import { TeenDashboardView } from './components/TeenDashboardView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { OkKroView } from './components/OkKroView';
import { ZakatCenterView } from './components/ZakatCenterView';
import { AcademyView } from './components/AcademyView';
import { KidsNoorZoneView } from './components/KidsNoorZoneView';
import { AiTutorView } from './components/AiTutorView';
import { QuizModal } from './components/QuizModal';
import { CertificateModal } from './components/CertificateModal';
import { CourseModal } from './components/CourseModal';
import { AL_NIBRAS_LOGO_SRC } from './components/AlNibrasBrandBanner';
import confetti from 'canvas-confetti';

const INITIAL_STATE: AppState = {
  walletBalance: 485000,
  kidPocketMoney: 3500,
  teenAllowance: 8500,
  kidSpendingLimit: 2000,
  teenSpendingLimit: 5000,
  zakatPaidTotal: 32500,
  noorCoins: 165,
  streakDays: 8,
  userLevel: 'Sprout (کونپل)',
  soundEnabled: true,
  currency: 'PKR',
  streakClaimedToday: false,
  lastClaimDate: '',
  completedQuests: ['hadith'],
  totalStreakRewardsClaimed: 7,
  enrolledCourseIds: [101],
  completedCourseIds: [],
  completedChallenges: [],
  earnedBadges: [
    { badgeId: 'noor_streak_7', unlockedAt: 'Today', earnedBy: 'Ahmed' },
    { badgeId: 'academy_first_enroll', unlockedAt: 'Yesterday', earnedBy: 'Fatima' },
  ],
  approvals: [
    {
      id: 1,
      kid: 'Ahmed',
      amount: 1200,
      type: 'saving',
      title: 'Contribution to Bicycle Goal',
      category: 'saving',
      status: 'pending',
      date: 'Today',
      notes: 'سائیکل کے لیے پاکٹ منی سے حصہ ملایا ہے تاکہ جلد خرید سکوں۔',
    },
    {
      id: 2,
      kid: 'Fatima',
      amount: 2999,
      type: 'course_purchase',
      title: 'Halal Investment Masterclass',
      category: 'course_purchase',
      status: 'pending',
      date: 'Yesterday',
      notes: 'شریعہ اکیڈمی کا سرٹیفکیٹ کورس تاکہ حلال اسٹاکس سمجھ سکوں۔',
    },
    {
      id: 3,
      kid: 'Ahmed',
      amount: 500,
      type: 'purchase',
      title: 'Islamic Story Books Set',
      category: 'purchase',
      status: 'approved',
      date: '3 days ago',
      notes: 'انبیاء کرام کے سچے واقعات کی تصویری کہانیاں۔',
    },
    {
      id: 4,
      kid: 'Fatima',
      amount: 1500,
      type: 'charity',
      title: 'Monthly Orphan Sponsorship',
      category: 'charity',
      status: 'approved',
      date: 'Last week',
      notes: 'الخدمت فاؤنڈیشن کے یتیم بچے کی ماہانہ کتابوں کا خرچ۔',
    },
  ],
  goals: [
    {
      id: 1,
      title: "Ahmed's Bicycle (احمد کی سائیکل)",
      target: 15000,
      current: 8900,
      icon: '🚲',
      category: 'Personal',
      owner: 'Ahmed',
    },
    {
      id: 2,
      title: 'Umrah Fund 2027 (عمرہ مبارک فنڈ)',
      target: 600000,
      current: 260000,
      icon: '🕋',
      category: 'Family',
      owner: 'Family',
    },
    {
      id: 3,
      title: 'Eid Celebration Jar (عید خوشیاں برائے غرباء)',
      target: 40000,
      current: 33000,
      icon: '🌙',
      category: 'Charity',
      owner: 'Fatima',
    },
  ],
  activityLogs: [
    {
      id: 9001,
      child: 'Ahmed',
      role: 'kid',
      type: 'learning',
      title: 'Completed Needs vs Wants Challenge',
      titleUr: 'ضرورت اور خواہش کا چیلنج مکمل کر کے +25 نور کوائنز حاصل کیے',
      titlePs: 'د اړتیا او هیلې لوبه بشپړه کړه (+25 نور کوینونه)',
      detail: 'Noor Zone Challenge',
      coinsDelta: 25,
      timestamp: 'Today, 10:15 AM',
    },
    {
      id: 9002,
      child: 'Fatima',
      role: 'teen',
      type: 'request',
      title: 'Requested Halal Investment Masterclass',
      titleUr: 'حلال سرمایہ کاری کورس کی منظوری (Rs 2,999) کی درخواست بھیجی',
      titlePs: 'د حلالې پانګونې کورس د تائید غوښتنه واستوله',
      detail: 'Ok Kro Queue',
      amountPkr: 2999,
      timestamp: 'Yesterday, 4:40 PM',
    },
    {
      id: 9003,
      child: 'Ahmed',
      role: 'kid',
      type: 'streak',
      title: 'Reached 8-Day Istiqamah Streak',
      titleUr: 'مسلسل 8 دن کا تعلیمی استقامت سلسلہ مکمل کیا',
      titlePs: 'د پرله پسې ۸ ورځو تعلیمي استقامت سلسله بشپړه شوه',
      detail: 'Noor Zone Streak',
      coinsDelta: 45,
      timestamp: 'Yesterday, 9:05 AM',
    },
  ],
  courses: [
    {
      id: 101,
      title: 'My First Money Book (میری پہلی پاکٹ منی)',
      age: '6-12 سال',
      rating: 4.9,
      students: 1240,
      price: 'Free',
      level: 'مبتدی (Beginner)',
      icon: '🌱',
      description:
        'بچوں کے لیے پیسے کی قدر، فضول خرچی سے پرہیز، اور برکت کی دعائیں سیکھنے کا آسان تصویری کورس۔',
      modules: [
        { title: 'پیسہ کہاں سے آتا ہے؟', duration: '10 منٹ', summary: 'محنت اور حلال رزق کا مفہوم' },
        { title: 'ضرورت اور خواہش میں فرق', duration: '12 منٹ', summary: 'کون سی چیز فوراً خریدنی چاہیے' },
        { title: 'صدقہ اور برکت', duration: '15 منٹ', summary: 'اللہ کی راہ میں دینے سے مال بڑھتا ہے' },
      ],
    },
    {
      id: 102,
      title: "Prophet's Business Lessons (سیرتِ طیبہ اور تاجرانہ اخلاقیات)",
      age: '6-12 سال',
      rating: 5.0,
      students: 980,
      price: 'Free',
      level: 'مبتدی (Beginner)',
      icon: '📖',
      description:
        'حضرت محمد ﷺ کی بطورِ امین تاجر حیاتِ مبارکہ سے دیانتداری، وعدے کی پابندی اور برکت کے اسباق۔',
      modules: [
        { title: 'سچے تاجر کا مقام', duration: '14 منٹ', summary: 'انبیاء اور صدیقین کے ساتھ حشر' },
        { title: 'عیب چھپائے بغیر فروخت', duration: '16 منٹ', summary: 'سامان کا عیب گاہک کو بتانا' },
        { title: 'ناپ تول میں کمی کی ممانعت', duration: '15 منٹ', summary: 'قرآن کریم کا حکمِ عدل' },
      ],
    },
    {
      id: 103,
      title: 'Halal Investment Masterclass (حلال سرمایہ کاری و اسٹاکس)',
      age: '18+ سال',
      rating: 4.8,
      students: 3410,
      price: 'Rs 2,999',
      level: 'ماہر (Advanced)',
      icon: '📈',
      description:
        'پاکستان اسٹاک ایکسچینج (PSX) اور عالمی منڈیوں میں AAOIFI اصولوں کے تحت حلال اسکریننگ اور منافع کمانا سیکھیں۔',
      modules: [
        { title: 'حلال اسکریننگ کے 4 فلٹرز', duration: '25 منٹ', summary: 'قرض، آمدن اور اثاثوں کا تناسب' },
        { title: 'تطہیر (Purification) کا حساب', duration: '30 منٹ', summary: 'مشکوک نفع کو الگ کر کے صدقہ کرنا' },
        { title: 'مضاربہ اور مشارکہ پورٹ فولیو', duration: '35 منٹ', summary: 'حقیقی رسک مینجمنٹ' },
      ],
    },
    {
      id: 104,
      title: 'Zakat & Inheritance Law (زکوٰۃ، میراث اور وقف کے مسائل)',
      age: '18+ سال',
      rating: 4.9,
      students: 1820,
      price: 'Rs 1,499',
      level: 'متوسط (Intermediate)',
      icon: '⚖️',
      description:
        'سونے، چاندی، مالِ تجارت، فلیٹس، پراپرٹی اور میراث کی شرعی تقسیم کا مکمل عملی گائیڈ۔',
      modules: [
        { title: 'نصاب اور سال کی شرائط', duration: '20 منٹ', summary: 'چاندی اور سونے کے فرق' },
        { title: 'مستحقینِ زکوٰۃ کی 8 اصناف', duration: '25 منٹ', summary: 'قرآنی مصارفِ زکوٰۃ' },
        { title: 'خاندانی وصیت اور وراثت', duration: '30 منٹ', summary: 'شرعی حصص کا درست تعین' },
      ],
    },
  ],
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang')?.toLowerCase() || window.location.hash.replace('#', '').toLowerCase();
      if (urlLang === 'ps' || urlLang === 'pashto') return 'ps';
      if (urlLang === 'en' || urlLang === 'english') return 'en';
      if (urlLang === 'ar' || urlLang === 'arabic') return 'ar';
      if (urlLang === 'ur' || urlLang === 'urdu') return 'ur';

      const savedLang = localStorage.getItem('alnibras_lang');
      if (savedLang && ['ur', 'en', 'ps', 'ar'].includes(savedLang)) {
        return savedLang as Language;
      }

      const navLang = navigator.language?.toLowerCase() || '';
      if (navLang.startsWith('ps')) return 'ps';
    } catch {}
    return 'ur';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang')?.toLowerCase() || window.location.hash.replace('#', '').toLowerCase();
        if (urlLang === 'ps' || urlLang === 'pashto') setLang('ps');
        else if (urlLang === 'en' || urlLang === 'english') setLang('en');
        else if (urlLang === 'ar' || urlLang === 'arabic') setLang('ar');
        else if (urlLang === 'ur' || urlLang === 'urdu') setLang('ur');
      } catch {}
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [role, setRole] = useState<UserRole>('parent');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [appData, setAppData] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('alnibras_app_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          activityLogs: parsed.activityLogs?.length ? parsed.activityLogs : INITIAL_STATE.activityLogs,
          kidPocketMoney: parsed.kidPocketMoney ?? INITIAL_STATE.kidPocketMoney,
          teenAllowance: parsed.teenAllowance ?? INITIAL_STATE.teenAllowance,
          kidSpendingLimit: parsed.kidSpendingLimit ?? INITIAL_STATE.kidSpendingLimit,
          teenSpendingLimit: parsed.teenSpendingLimit ?? INITIAL_STATE.teenSpendingLimit,
          earnedBadges: parsed.earnedBadges?.length ? parsed.earnedBadges : INITIAL_STATE.earnedBadges,
          completedCourseIds: parsed.completedCourseIds || INITIAL_STATE.completedCourseIds,
          completedChallenges: parsed.completedChallenges || INITIAL_STATE.completedChallenges,
        };
      }
    } catch {}
    return INITIAL_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem('alnibras_app_data', JSON.stringify(appData));
    } catch {}
  }, [appData]);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3600);
  };

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('alnibras_lang', newLang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  useEffect(() => {
    try {
      localStorage.setItem('alnibras_lang', lang);
      const url = new URL(window.location.href);
      if (url.searchParams.get('lang') !== lang) {
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  }, [lang]);

  // Modals
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const isRTL = ['ur', 'ps', 'ar'].includes(lang);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ur;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.className =
        'bg-mesh-dark text-slate-100 min-h-screen selection:bg-[#FBBF24] selection:text-[#07091B] transition-colors duration-300';
    } else {
      root.classList.remove('dark');
      document.body.className =
        'bg-mesh-light text-slate-900 min-h-screen selection:bg-[#FBBF24] selection:text-[#07091B] transition-colors duration-300';
    }
  }, [theme, lang, isRTL]);

  const getFontClass = () => {
    if (lang === 'ur') return 'font-urdu';
    if (lang === 'ps') return 'font-pashto';
    if (lang === 'ar') return 'font-arabic';
    return 'font-sans';
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      setShowAdminPinModal(true);
      return;
    }
    setRole(newRole);
    setActiveTab('home');
  };

  const handleAdminUnlock = () => {
    setIsAdminAuthenticated(true);
    setShowAdminPinModal(false);
    setRole('admin');
    setActiveTab('home');
    notify(lang === 'en' ? 'Admin Guardian unlocked.' : 'ایڈمن گارڈین ڈیش بورڈ انلاک ہو گیا۔', 'success');
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    setRole('parent');
    setActiveTab('home');
    notify(lang === 'en' ? 'Admin session locked.' : 'ایڈمن سیشن لاک کر دیا گیا ہے۔', 'info');
  };

  const handleLogActivity = (entry: Omit<ChildActivityLog, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: ChildActivityLog = {
      ...entry,
      id: Date.now() + Math.floor(Math.random() * 100),
      timestamp: `Today, ${timeStr}`,
    };
    setAppData((prev) => ({
      ...prev,
      activityLogs: [newLog, ...(prev.activityLogs || [])].slice(0, 40),
    }));
  };

  const unlockBadge = (badgeId: string) => {
    const badgeMeta = MILESTONE_BADGES.find((b) => b.id === badgeId);
    if (!badgeMeta) return;
    if ((appData.earnedBadges || []).some((b) => b.badgeId === badgeId)) return;

    const ownerName =
      role === 'teen'
        ? 'Fatima'
        : role === 'kid'
        ? 'Ahmed'
        : role === 'teacher'
        ? 'Ustad Bilal'
        : 'Imran';

    setAppData((prev) => {
      if ((prev.earnedBadges || []).some((b) => b.badgeId === badgeId)) return prev;
      return {
        ...prev,
        noorCoins: prev.noorCoins + badgeMeta.points,
        earnedBadges: [
          {
            badgeId,
            unlockedAt: 'Today',
            earnedBy: ownerName,
          },
          ...(prev.earnedBadges || []),
        ],
      };
    });

    if (role === 'kid' || role === 'teen') {
      handleLogActivity({
        child: role === 'teen' ? 'Fatima' : 'Ahmed',
        role,
        type: 'quest',
        title: `Unlocked Badge: ${badgeMeta.titleEn}`,
        titleUr: `نیا بیج حاصل کیا: ${badgeMeta.titleUr}`,
        titlePs: `نوی نښان ترلاسه شو: ${badgeMeta.titlePs}`,
        detail: badgeMeta.category === 'academy' ? 'Academy Milestone' : 'Noor Zone Milestone',
        coinsDelta: badgeMeta.points,
      });
    }

    playSound('success');
    try {
      confetti({ particleCount: 95, spread: 70, origin: { y: 0.6 } });
    } catch {}

    notify(
      `${t.badgeUnlockedPrefix}: ${badgeMeta.icon} ${getBadgeTitle(badgeMeta, lang)} (+${badgeMeta.points} 🪙)`,
      'success'
    );
  };

  const handleApproval = (id: number, newStatus: 'approved' | 'rejected') => {
    if (role !== 'parent' && role !== 'admin') return;
    playSound('click');
    setAppData((prev) => {
      const targetReq = prev.approvals.find((a) => a.id === id);
      let updatedBalance = prev.walletBalance;

      if (newStatus === 'approved' && targetReq && targetReq.status === 'pending') {
        updatedBalance = Math.max(0, updatedBalance - targetReq.amount);
        playSound('coin');
      }

      const updatedList = prev.approvals.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      );

      return {
        ...prev,
        walletBalance: updatedBalance,
        approvals: updatedList,
      };
    });
  };

  const handleAddRequest = (req: Omit<ApprovalRequest, 'id' | 'status' | 'date'>) => {
    const newId = Date.now();
    const newEntry: ApprovalRequest = {
      ...req,
      id: newId,
      status: 'pending',
      date: 'Today',
    };
    const isFatima = req.kid.toLowerCase().includes('fatima');
    setAppData((prev) => ({
      ...prev,
      approvals: [newEntry, ...prev.approvals],
    }));

    handleLogActivity({
      child: isFatima ? 'Fatima' : 'Ahmed',
      role: isFatima ? 'teen' : 'kid',
      type: 'request',
      title: `Submitted Ok Kro Request: ${req.title}`,
      titleUr: `والدین کو "${req.title}" کی منظوری (Rs ${req.amount.toLocaleString()}) بھیجی`,
      titlePs: `د "${req.title}" د تائید غوښتنه واستوله`,
      detail: 'Ok Kro Queue',
      amountPkr: req.amount,
    });
    notify(
      lang === 'en' ? 'Request sent to parents for Ok Kro approval.' : 'درخواست والدین کو منظوری کے لیے بھیج دی گئی ہے۔',
      'success'
    );
  };

  const handleContributeGoal = (goalId: number, amount: number) => {
    if (appData.walletBalance < amount) {
      notify(
        lang === 'en'
          ? 'Insufficient family balance. Please add funds first.'
          : 'خاندانی اکاؤنٹ میں رقم ناکافی ہے۔ برائے مہربانی پہلے فنڈز شامل کریں۔',
        'error'
      );
      return;
    }
    setAppData((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, current: Math.min(g.target, g.current + amount) } : g
      ),
    }));
    notify(
      lang === 'en' ? `Added Rs ${amount.toLocaleString()} to family goal.` : `ہدف میں Rs ${amount.toLocaleString()} جمع ہو گئے۔`,
      'success'
    );
  };

  const handleKidSaveToGoal = (goalId: number, amount: number) => {
    if (appData.kidPocketMoney < amount) {
      notify(
        lang === 'en' ? 'Pocket money is below Rs 250.' : 'پاکٹ منی میں رقم ناکافی ہے۔',
        'error'
      );
      return;
    }
    setAppData((prev) => ({
      ...prev,
      kidPocketMoney: prev.kidPocketMoney - amount,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, current: Math.min(g.target, g.current + amount) } : g
      ),
    }));
    handleLogActivity({
      child: 'Ahmed',
      role: 'kid',
      type: 'saving',
      title: `Saved Rs ${amount} from Pocket Money`,
      titleUr: `پاکٹ منی سے Rs ${amount} سائیکل کے ہدف میں جمع کیے`,
      titlePs: `له جیبي خرڅ څخه Rs ${amount} سپما کړل`,
      detail: 'Bicycle Goal',
      amountPkr: amount,
    });
    notify(
      lang === 'en' ? `Masha'Allah! Saved Rs ${amount} to your goal.` : `ماشاء اللہ! Rs ${amount} ہدف میں جمع ہو گئے۔`,
      'success'
    );
  };

  const handleTeenSaveToGoal = (goalId: number, amount: number) => {
    if (appData.teenAllowance < amount) {
      notify(
        lang === 'en' ? 'Allowance balance is insufficient.' : 'الاؤنس میں رقم ناکافی ہے۔',
        'error'
      );
      return;
    }
    setAppData((prev) => ({
      ...prev,
      teenAllowance: prev.teenAllowance - amount,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, current: Math.min(g.target, g.current + amount) } : g
      ),
    }));
    handleLogActivity({
      child: 'Fatima',
      role: 'teen',
      type: 'saving',
      title: `Contributed Rs ${amount} to Charity Jar`,
      titleUr: `اپنے الاؤنس سے Rs ${amount} عید صدقہ فنڈ میں جمع کیے`,
      titlePs: `له خپل الاؤنس څخه Rs ${amount} د صدقې فنډ ته ورکړل`,
      detail: 'Eid Charity Jar',
      amountPkr: amount,
    });
    notify(
      lang === 'en' ? `Masha'Allah! Rs ${amount} added to Charity Jar.` : `ماشاء اللہ! Rs ${amount} صدقہ فنڈ میں جمع ہو گئے۔`,
      'success'
    );
  };

  const handleAddFunds = (amount: number) => {
    setAppData((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    notify(
      lang === 'en' ? `Added Rs ${amount.toLocaleString()} to family Mudarabah pool.` : `خاندانی کھاتے میں Rs ${amount.toLocaleString()} شامل ہو گئے۔`,
      'success'
    );
  };

  const handleAddCourse = (newCourse: Omit<Course, 'id' | 'rating' | 'students'>) => {
    const courseEntry: Course = {
      ...newCourse,
      id: Date.now(),
      rating: 5.0,
      students: 1,
    };
    setAppData((prev) => ({
      ...prev,
      courses: [courseEntry, ...prev.courses],
    }));
    notify(
      lang === 'en' ? `Published "${newCourse.title}" to Academy.` : `کورس "${newCourse.title}" اکیڈمی میں شائع ہو گیا۔`,
      'success'
    );
  };

  const handleUpdateLimits = (kidLimit: number, teenLimit: number) => {
    setAppData((prev) => ({
      ...prev,
      kidSpendingLimit: kidLimit,
      teenSpendingLimit: teenLimit,
    }));
  };

  const handleAdjustNoorCoins = (delta: number) => {
    setAppData((prev) => ({
      ...prev,
      noorCoins: Math.max(0, prev.noorCoins + delta),
    }));
    notify(`+${delta} Noor Coins granted.`, 'success');
  };

  const handleQuizPass = (score: number) => {
    setQuizModalOpen(false);

    let recipient = 'عمران قریشی (Imran Qureshi)';
    if (role === 'teen') recipient = 'فاطمہ عمران (Fatima Imran)';
    if (role === 'kid') recipient = 'احمد عمران (Ahmed Imran)';
    if (role === 'teacher') recipient = 'استاد بلال (Ustad Bilal)';

    setCertData({
      recipientName: recipient,
      courseTitle: 'Sharia Certified Islamic Finance Professional (AAOIFI Standard)',
      issueDate: new Date().toLocaleDateString('ur-PK'),
      certCode: `AN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      score,
    });

    if (role === 'kid' || role === 'teen') {
      handleLogActivity({
        child: role === 'teen' ? 'Fatima' : 'Ahmed',
        role,
        type: 'quiz',
        title: `Passed Sharia Certification Exam (${score}%)`,
        titleUr: `شریعہ سرٹیفیکیشن امتحان ${score}% نمبروں سے پاس کیا`,
        titlePs: `د شریعت سند ازموینه یې په ${score}% نمرو وګټله`,
        detail: 'AAOIFI Exam',
      });
    }

    setCertModalOpen(true);
    unlockBadge('academy_sharia_certified');
    playSound('success');
    try {
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    } catch {}
  };

  const handleEnrollCourse = (course: Course) => {
    setSelectedCourse(null);
    playSound('coin');
    const nextEnrolled = Array.from(
      new Set([...(appData.enrolledCourseIds || []), course.id])
    );
    setAppData((prev) => ({
      ...prev,
      enrolledCourseIds: Array.from(new Set([...(prev.enrolledCourseIds || []), course.id])),
    }));
    unlockBadge('academy_first_enroll');
    if (nextEnrolled.length >= 3) {
      unlockBadge('academy_polymath');
    }
    if (role === 'kid' || role === 'teen') {
      handleLogActivity({
        child: role === 'teen' ? 'Fatima' : 'Ahmed',
        role,
        type: 'learning',
        title: `Enrolled in ${course.title}`,
        titleUr: `کورس "${course.title}" میں داخلہ مکمل کیا`,
        titlePs: `په "${course.title}" کورس کې شامل شو`,
        detail: 'Academy',
      });
    }
    notify(
      lang === 'en'
        ? `Alhamdulillah! Enrolled in "${course.title}".`
        : `الحمد للہ! آپ کا کورس "${course.title}" میں داخلہ مکمل ہو چکا ہے۔`,
      'success'
    );
  };

  const handleCompleteCourse = (course: Course) => {
    setSelectedCourse(null);
    setAppData((prev) => ({
      ...prev,
      completedCourseIds: Array.from(new Set([...(prev.completedCourseIds || []), course.id])),
    }));
    if (role === 'kid' || role === 'teen') {
      handleLogActivity({
        child: role === 'teen' ? 'Fatima' : 'Ahmed',
        role,
        type: 'learning',
        title: `Completed Course: ${course.title}`,
        titleUr: `کورس "${course.title}" کے تمام اسباق مکمل کیے`,
        titlePs: `د "${course.title}" کورس ټول درسونه بشپړ کړل`,
        detail: 'Academy',
      });
    }
    unlockBadge('academy_module_finisher');
  };

  const pendingApprovalsCount = appData.approvals.filter((a) => a.status === 'pending').length;

  const renderRoleDashboard = () => {
    switch (role) {
      case 'kid':
        return (
          <KidDashboardView
            t={t}
            lang={lang}
            appData={appData}
            theme={theme}
            onNavigate={(tab) => setActiveTab(tab)}
            onKidSaveToGoal={handleKidSaveToGoal}
            onAddRequest={handleAddRequest}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        );
      case 'teen':
        return (
          <TeenDashboardView
            t={t}
            lang={lang}
            appData={appData}
            theme={theme}
            onNavigate={(tab) => setActiveTab(tab)}
            onTeenSaveToGoal={handleTeenSaveToGoal}
            onOpenQuiz={() => setQuizModalOpen(true)}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        );
      case 'teacher':
        return (
          <TeacherDashboardView
            t={t}
            lang={lang}
            appData={appData}
            onAddCourse={handleAddCourse}
            onSelectCourse={(course) => setSelectedCourse(course)}
            onOpenQuiz={() => setQuizModalOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'admin':
        return isAdminAuthenticated ? (
          <AdminDashboardView
            t={t}
            lang={lang}
            appData={appData}
            onUpdateLimits={handleUpdateLimits}
            onAdjustNoorCoins={handleAdjustNoorCoins}
            onLockAdmin={handleLockAdmin}
            onNotify={notify}
          />
        ) : (
          <ParentDashboardView
            t={t}
            lang={lang}
            appData={appData}
            theme={theme}
            onNavigate={(tab) => setActiveTab(tab)}
            onContributeGoal={handleContributeGoal}
            onAddFunds={handleAddFunds}
            onApproval={handleApproval}
          />
        );
      case 'parent':
      default:
        return (
          <ParentDashboardView
            t={t}
            lang={lang}
            appData={appData}
            theme={theme}
            onNavigate={(tab) => setActiveTab(tab)}
            onContributeGoal={handleContributeGoal}
            onAddFunds={handleAddFunds}
            onApproval={handleApproval}
          />
        );
    }
  };

  // Prevent kids/teens/teachers from accessing Zakat or restricted routes directly
  const isTabAllowed = (tab: TabType) => {
    if (tab === 'zakat') return role === 'parent' || role === 'admin';
    if (tab === 'okKro') return role !== 'teacher';
    return true;
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen flex flex-col ${getFontClass()}`}>
      {/* Header & Role-Scoped Navigation */}
      <Navbar
        t={t}
        lang={lang}
        setLang={handleSetLang}
        theme={theme}
        setTheme={setTheme}
        role={role}
        setRole={handleRoleChange}
        isAdminAuthenticated={isAdminAuthenticated}
        onLockAdmin={handleLockAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingApprovalsCount}
      />

      {/* Non-blocking Toast Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-fadeIn">
          <div
            className={`px-4 py-3 rounded-xl border text-xs font-semibold shadow-lg flex items-center justify-between gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/50 text-rose-200'
                : toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : 'bg-[#10132C] border-[#FBBF24]/50 text-slate-100'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="opacity-70 hover:opacity-100 cursor-pointer"
              aria-label={t.close}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {(activeTab === 'home' || !isTabAllowed(activeTab)) && renderRoleDashboard()}

        {activeTab === 'okKro' && isTabAllowed('okKro') && (
          <OkKroView
            t={t}
            lang={lang}
            role={role}
            appData={appData}
            handleApproval={handleApproval}
            onAddRequest={handleAddRequest}
            onNotify={notify}
            theme={theme}
          />
        )}

        {activeTab === 'zakat' && isTabAllowed('zakat') && (
          <ZakatCenterView
            t={t}
            lang={lang}
            appData={appData}
            setAppData={setAppData}
            theme={theme}
          />
        )}

        {activeTab === 'learn' && (
          <AcademyView
            t={t}
            lang={lang}
            role={role}
            appData={appData}
            theme={theme}
            onOpenQuiz={() => setQuizModalOpen(true)}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        )}

        {activeTab === 'kids' && (
          <KidsNoorZoneView
            t={t}
            lang={lang}
            role={role}
            appData={appData}
            setAppData={setAppData}
            theme={theme}
            onLogActivity={handleLogActivity}
            onNotify={notify}
            onUnlockBadge={unlockBadge}
          />
        )}

        {activeTab === 'aiTutor' && (
          <AiTutorView
            t={t}
            lang={lang}
            theme={theme}
          />
        )}
      </main>

      {/* Admin PIN Gate Modal (PIN: 1234) */}
      {showAdminPinModal && (
        <AdminPasswordModal
          t={t}
          onUnlock={handleAdminUnlock}
          onCancel={() => setShowAdminPinModal(false)}
        />
      )}

      {/* Quiz Modal */}
      {quizModalOpen && (
        <QuizModal
          t={t}
          lang={lang}
          onClose={() => setQuizModalOpen(false)}
          onPass={handleQuizPass}
        />
      )}

      {/* Certificate Modal */}
      {certModalOpen && certData && (
        <CertificateModal
          t={t}
          certData={certData}
          onClose={() => setCertModalOpen(false)}
        />
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          t={t}
          lang={lang}
          isEnrolled={(appData.enrolledCourseIds || []).includes(selectedCourse.id)}
          isCompleted={(appData.completedCourseIds || []).includes(selectedCourse.id)}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnrollCourse}
          onCompleteCourse={handleCompleteCourse}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-[#232852] py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto bg-white dark:bg-[#10132C]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={AL_NIBRAS_LOGO_SRC}
              alt="Al-Nibras Group Emblem"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#FBBF24]/60 bg-[#07091B] shrink-0"
            />
            <span className="font-serif text-[#B45309] dark:text-[#FBBF24] font-bold text-base">
              {t.appName}
            </span>
            <span>— Al-Nibras Group · AlNibras.pk</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-[#0E7490] dark:text-[#22D3EE] font-semibold">
              Innovate · Empower · Execute · Elevate
            </span>
            <span>·</span>
            <span>© 2026 Al-Nibras Group</span>
            <span>·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              AAOIFI & Sharia Certified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
