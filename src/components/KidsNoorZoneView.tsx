import React, { useState, useEffect } from 'react';
import { AppState, ChildActivityLog, Language, UserRole } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { BadgeShowcase } from './BadgeShowcase';
import { AL_NIBRAS_LOGO_SRC } from './AlNibrasBrandBanner';
import confetti from 'canvas-confetti';

interface KidsNoorZoneViewProps {
  t: Translations;
  lang: Language;
  role?: UserRole;
  appData: AppState;
  setAppData: React.Dispatch<React.SetStateAction<AppState>>;
  theme: 'dark' | 'light';
  onLogActivity?: (entry: Omit<ChildActivityLog, 'id' | 'timestamp'>) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onUnlockBadge?: (badgeId: string) => void;
}

interface StreakRewardDay {
  day: number;
  coins: number;
  titleUr: string;
  titlePs: string;
  titleEn: string;
  titleAr: string;
  icon: string;
  perkUr: string;
  perkPs: string;
  perkEn: string;
  perkAr: string;
}

const STREAK_DAYS_CONFIG: StreakRewardDay[] = [
  {
    day: 1,
    coins: 15,
    titleUr: 'بسم اللہ کا آغاز',
    titlePs: 'د بسم الله پیل',
    titleEn: 'Bismillah Step',
    titleAr: 'خطوة البداية',
    icon: '🌱',
    perkUr: 'پہلا قدم مبارک',
    perkPs: 'لومړی ګام مبارک',
    perkEn: 'First Step Blessing',
    perkAr: 'بركة الخطوة الأولى',
  },
  {
    day: 2,
    coins: 20,
    titleUr: 'نور کی چمک',
    titlePs: 'د نور ځلا',
    titleEn: 'Noor Sparkle',
    titleAr: 'إشراقة نور',
    icon: '✨',
    perkUr: 'مسلسل سیکھنے کا آغاز',
    perkPs: 'دوامداره زده کړه',
    perkEn: 'Consistent Learner',
    perkAr: 'مثابرة التعلم',
  },
  {
    day: 3,
    coins: 25,
    titleUr: 'طالبِ علم',
    titlePs: 'د علم لټونکی',
    titleEn: 'Knowledge Seeker',
    titleAr: 'طالب العلم',
    icon: '📚',
    perkUr: '10٪ اسٹریک بونس فعال',
    perkPs: '۱۰٪ اسټریک بونس فعال',
    perkEn: '+10% Challenge Bonus',
    perkAr: 'مضاعف +10%',
  },
  {
    day: 4,
    coins: 35,
    titleUr: 'برکت کا کھلنا',
    titlePs: 'د برکت غوړېدل',
    titleEn: 'Barakah Bloom',
    titleAr: 'نماء البركة',
    icon: '🌟',
    perkUr: 'حلال فہم میں اضافہ',
    perkPs: 'حلاله پوهه',
    perkEn: 'Wisdom Unlocked',
    perkAr: 'نماء الحكمة',
  },
  {
    day: 5,
    coins: 45,
    titleUr: 'حلال شیلڈ',
    titlePs: 'د حلال ډال',
    titleEn: 'Halal Shield',
    titleAr: 'درع الحلال',
    icon: '🛡️',
    perkUr: 'استقامت کا تحفظ',
    perkPs: 'د استقامت ساتنه',
    perkEn: 'Istiqamah Shield',
    perkAr: 'حماية الاستقامة',
  },
  {
    day: 6,
    coins: 60,
    titleUr: 'ہلالِ برکت',
    titlePs: 'د برکت میاشت',
    titleEn: 'Crescent Power',
    titleAr: 'قوة الهلال',
    icon: '🌙',
    perkUr: '25٪ اسٹریک بونس',
    perkPs: '۲۵٪ اسټریک بونس',
    perkEn: '+25% Challenge Bonus',
    perkAr: 'مضاعف +25%',
  },
  {
    day: 7,
    coins: 100,
    titleUr: 'استقامت کا تاج',
    titlePs: 'د استقامت تاج',
    titleEn: 'Istiqamah Crown',
    titleAr: 'تاج الاستقامة',
    icon: '👑',
    perkUr: 'عظیم گرینڈ باکس + تاج',
    perkPs: 'لویه خزانه او تاج',
    perkEn: 'Grand Treasure + Crown',
    perkAr: 'صندوق البركة والتاج',
  },
];

export const KidsNoorZoneView: React.FC<KidsNoorZoneViewProps> = ({
  t,
  lang,
  role = 'kid',
  appData,
  setAppData,
  theme,
  onLogActivity,
  onNotify,
  onUnlockBadge,
}) => {
  const activeChild: 'Ahmed' | 'Fatima' = role === 'teen' ? 'Fatima' : 'Ahmed';
  const activeChildRole: 'kid' | 'teen' = role === 'teen' ? 'teen' : 'kid';
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);

  // Streak Modals & Feedback
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimedRewardAmount, setClaimedRewardAmount] = useState(0);
  const [showHadithModal, setShowHadithModal] = useState(false);
  const [showDeedModal, setShowDeedModal] = useState(false);
  const [selectedDeed, setSelectedDeed] = useState('Helped parents at home');
  const [showRedeemSuccess, setShowRedeemSuccess] = useState<string | null>(null);
  const [plantedTrees, setPlantedTrees] = useState(2);
  const [showGuardianBadgeModal, setShowGuardianBadgeModal] = useState(false);

  // Countdown timer for next simulated dawn/reset
  const [countdown, setCountdown] = useState({ hours: 7, minutes: 24, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const streakDays = appData.streakDays || 1;
  const isClaimedToday = Boolean(appData.streakClaimedToday);

  // Determine current day position in 7-day cyclical trail (1..7)
  const cycleDay = isClaimedToday
    ? ((streakDays - 1) % 7) + 1
    : (streakDays % 7 === 0 ? 7 : (streakDays % 7));

  // Multiplier calculation
  const getMultiplier = (streak: number) => {
    if (streak >= 30) return 1.5;
    if (streak >= 14) return 1.35;
    if (streak >= 7) return 1.25;
    if (streak >= 3) return 1.1;
    return 1.0;
  };

  const currentMultiplier = getMultiplier(streakDays);

  const getMultiplierBadge = (streak: number) => {
    if (lang === 'ps') {
      if (streak >= 30) return { label: '۱.۵x د استقامت سالار', icon: '👑' };
      if (streak >= 14) return { label: '۱.۳۵x د نور څلی', icon: '🏮' };
      if (streak >= 7) return { label: '۱.۲۵x د برکت پلټونکی', icon: '⭐' };
      if (streak >= 3) return { label: '۱.۱x د بسم الله پیل', icon: '✨' };
      return { label: '۱.۰x نوی پیلوونکی', icon: '🌱' };
    }
    if (lang === 'ur') {
      if (streak >= 30) return { label: '1.5x استقامت کا شہسوار', icon: '👑' };
      if (streak >= 14) return { label: '1.35x نور مینار', icon: '🏮' };
      if (streak >= 7) return { label: '1.25x طلبِ برکت', icon: '⭐' };
      if (streak >= 3) return { label: '1.1x بسم اللہ چنگاری', icon: '✨' };
      return { label: '1.0x نئی کونپل', icon: '🌱' };
    }
    if (lang === 'ar') {
      if (streak >= 30) return { label: '1.5x فارس الاستقامة', icon: '👑' };
      if (streak >= 14) return { label: '1.35x منار النور', icon: '🏮' };
      if (streak >= 7) return { label: '1.25x رائد البركة', icon: '⭐' };
      if (streak >= 3) return { label: '1.1x قبس البداية', icon: '✨' };
      return { label: '1.0x برعم العلم', icon: '🌱' };
    }
    if (streak >= 30) return { label: '1.5x Istiqamah Master', icon: '👑' };
    if (streak >= 14) return { label: '1.35x Noor Beacon', icon: '🏮' };
    if (streak >= 7) return { label: '1.25x Barakah Seeker', icon: '⭐' };
    if (streak >= 3) return { label: '1.1x Bismillah Spark', icon: '✨' };
    return { label: '1.0x Novice Sprout', icon: '🌱' };
  };

  const multiplierInfo = getMultiplierBadge(streakDays);

  const getStreakDayTitle = (dayItem: StreakRewardDay) => {
    if (lang === 'ps') return dayItem.titlePs;
    if (lang === 'ar') return dayItem.titleAr;
    if (lang === 'en') return dayItem.titleEn;
    return dayItem.titleUr;
  };

  const getStreakDayPerk = (dayItem: StreakRewardDay) => {
    if (lang === 'ps') return dayItem.perkPs;
    if (lang === 'ar') return dayItem.perkAr;
    if (lang === 'en') return dayItem.perkEn;
    return dayItem.perkUr;
  };

  // Today's reward config
  const todayConfig = STREAK_DAYS_CONFIG.find((d) => d.day === cycleDay) || STREAK_DAYS_CONFIG[0];
  const todayRewardCoins = Math.round(todayConfig.coins * (streakDays >= 7 ? 1.2 : 1.0));

  // Quests
  const completedQuests = appData.completedQuests || ['hadith'];
  const allQuestsDone = ['hadith', 'challenge', 'deed', 'goal'].every((q) => completedQuests.includes(q));

  // Claim Daily Streak Action
  const handleClaimDailyStreak = () => {
    if (isClaimedToday) return;

    playSound('success');
    playSound('coin');
    try {
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#22c97a', '#0ABFAD', '#fbe285', '#ffffff'],
      });
    } catch (e) {}

    const bonusToAdd = todayRewardCoins;
    setClaimedRewardAmount(bonusToAdd);

    setAppData((prev) => {
      const newCoins = prev.noorCoins + bonusToAdd;
      const newStreak = prev.streakDays + 1;
      let newLevel = prev.userLevel;
      if (newCoins > 350) {
        newLevel = lang === 'ps' ? 'Tree (لویه ونه - عالم)' : lang === 'ar' ? 'Tree (شجرة طيبة - عالم)' : 'Tree (تناور درخت - عالم)';
      } else if (newCoins > 220) {
        newLevel = lang === 'ps' ? 'Sapling (بُوټی - تکړه)' : lang === 'ar' ? 'Sapling (شتلة - ماهر)' : 'Sapling (پودا - ماہر)';
      } else {
        newLevel = lang === 'ps' ? 'Sprout (شینکی - زده کوونکی)' : lang === 'ar' ? 'Sprout (برعم - طالب)' : 'Sprout (کونپل - طالب علم)';
      }

      return {
        ...prev,
        noorCoins: newCoins,
        streakDays: newStreak,
        streakClaimedToday: true,
        lastClaimDate: new Date().toISOString(),
        totalStreakRewardsClaimed: (prev.totalStreakRewardsClaimed || 0) + 1,
        userLevel: newLevel,
      };
    });

    onLogActivity?.({
      child: activeChild,
      role: activeChildRole,
      type: 'streak',
      title: `Claimed Day ${streakDays + 1} Istiqamah Streak`,
      titleUr: `یومیہ استقامت انعام (+${bonusToAdd} نور کوائنز) وصول کیا`,
      titlePs: `د ورځني استقامت انعام (+${bonusToAdd} نور کوینونه) واخیست`,
      detail: `Noor Zone Streak`,
      coinsDelta: bonusToAdd,
    });

    if (streakDays + 1 >= 7) {
      onUnlockBadge?.('noor_streak_7');
    }

    setShowClaimModal(true);
  };

  // Simulate Next Day for Demo / Testing
  const handleSimulateNextDay = () => {
    playSound('chime');
    setAppData((prev) => ({
      ...prev,
      streakClaimedToday: false,
      completedQuests: ['hadith'],
    }));
  };

  // Reset Streak for Demo / Testing
  const handleResetStreak = () => {
    playSound('alert');
    setAppData((prev) => ({
      ...prev,
      streakDays: 1,
      streakClaimedToday: false,
      completedQuests: [],
    }));
  };

  // Complete a Daily Quest
  const markQuestCompleted = (questId: string, coinsAwarded: number) => {
    if (completedQuests.includes(questId)) return;
    playSound('coin');
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setAppData((prev) => {
      const currentList = prev.completedQuests || [];
      const updatedList = [...currentList, questId];
      const newCoins = prev.noorCoins + coinsAwarded;
      let newLevel = prev.userLevel;
      if (newCoins > 350) newLevel = 'Tree (تناور درخت - عالم)';
      else if (newCoins > 220) newLevel = 'Sapling (پودا - ماہر)';

      return {
        ...prev,
        noorCoins: newCoins,
        completedQuests: updatedList,
        userLevel: newLevel,
      };
    });

    if (coinsAwarded > 0) {
      onLogActivity?.({
        child: activeChild,
        role: activeChildRole,
        type: 'quest',
        title: `Completed Daily Quest: ${questId}`,
        titleUr: `روزانہ تعلیمی ہدف (${questId}) مکمل کیا`,
        titlePs: `ورځنی تعلیمي هدف (${questId}) بشپړ کړ`,
        detail: 'Noor Zone Daily Quest',
        coinsDelta: coinsAwarded,
      });
    }
  };

  // Claim All Quests Super Bonus
  const handleClaimAllQuestsBonus = () => {
    if (!allQuestsDone || completedQuests.includes('super_bonus')) return;
    playSound('success');
    playSound('coin');
    try {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    } catch (e) {}

    setAppData((prev) => ({
      ...prev,
      noorCoins: prev.noorCoins + 50,
      completedQuests: [...(prev.completedQuests || []), 'super_bonus'],
    }));

    onLogActivity?.({
      child: activeChild,
      role: activeChildRole,
      type: 'quest',
      title: 'Claimed All-Quests Super Bonus',
      titleUr: 'چاروں روزانہ اہداف مکمل کر کے سپر بونس حاصل کیا',
      titlePs: 'ټول ورځني اهداف بشپړ او سوپر بونس یې واخیست',
      detail: '4/4 Daily Quests',
      coinsDelta: 50,
    });

    onUnlockBadge?.('noor_super_quester');
  };

  // Complete Challenge with Multiplier
  const completeChallenge = (baseCoins: number, msg: string) => {
    playSound('coin');
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    const gameId = selectedGame || 'needsWants';
    const nextChallenges = Array.from(
      new Set([...(appData.completedChallenges || []), gameId])
    );

    const totalCoinsEarned = Math.round(baseCoins * currentMultiplier);
    setFeedback({ text: `${msg} (+${totalCoinsEarned} 🪙)`, correct: true });

    // Mark quest completed
    markQuestCompleted('challenge', 0);

    if (gameId === 'needsWants' || gameId === 'halalTrader') {
      onUnlockBadge?.('noor_needs_master');
    }
    if (gameId === 'ribaDetector' || gameId === 'zakatMath') {
      onUnlockBadge?.('noor_riba_detector');
    }
    if (
      ['needsWants', 'ribaDetector', 'zakatMath', 'halalTrader'].every((g) =>
        nextChallenges.includes(g)
      )
    ) {
      onUnlockBadge?.('noor_all_challenges');
    }

    onLogActivity?.({
      child: activeChild,
      role: activeChildRole,
      type: 'learning',
      title: `Won Halal Finance Challenge (${gameId})`,
      titleUr: `حلال فنانس چیلنج جیت کر +${totalCoinsEarned} کوائنز کمائے`,
      titlePs: `د حلال مالي لوبې چیلنج وګاټه (+${totalCoinsEarned} کوینونه)`,
      detail: `${currentMultiplier}x Multiplier`,
      coinsDelta: totalCoinsEarned,
    });

    setTimeout(() => {
      setAppData((prev) => {
        const newCoins = prev.noorCoins + totalCoinsEarned;
        let newLevel = prev.userLevel;
        if (newCoins > 350) newLevel = 'Tree (تناور درخت - عالم)';
        else if (newCoins > 220) newLevel = 'Sapling (پودا - ماہر)';
        else newLevel = 'Sprout (کونپل - طالب علم)';

        return {
          ...prev,
          noorCoins: newCoins,
          userLevel: newLevel,
          completedChallenges: Array.from(
            new Set([...(prev.completedChallenges || []), gameId])
          ),
        };
      });
      setSelectedGame(null);
      setFeedback(null);
    }, 1800);
  };

  const failChallenge = (hint: string) => {
    playSound('alert');
    setFeedback({ text: hint, correct: false });
  };

  // Noor Coins Vault Redemptions
  const handleRedeemGoalContribution = (costCoins: number, cashReward: number) => {
    if (appData.noorCoins < costCoins) {
      playSound('alert');
      onNotify?.(
        lang === 'ps'
          ? 'تاسو کافي نور کوینونه نه لرئ!'
          : lang === 'ur'
          ? 'آپ کے پاس مطلوبہ نور کوائنز ناکافی ہیں!'
          : 'Not enough Noor Coins!',
        'error'
      );
      return;
    }

    playSound('success');
    playSound('coin');
    try {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    setAppData((prev) => ({
      ...prev,
      noorCoins: prev.noorCoins - costCoins,
      goals: prev.goals.map((g, idx) => {
        if (idx === 0) {
          return { ...g, current: Math.min(g.target, g.current + cashReward) };
        }
        return g;
      }),
    }));

    onLogActivity?.({
      child: activeChild,
      role: activeChildRole,
      type: 'saving',
      title: `Converted ${costCoins} Noor Coins into Rs ${cashReward} Savings`,
      titleUr: `${costCoins} نور کوائنز سے بچت کے ہدف میں Rs ${cashReward} شامل کیے`,
      titlePs: `${costCoins} نور کوینونه یې په Rs ${cashReward} سپما بدل کړل`,
      detail: 'Barakah Vault',
      amountPkr: cashReward,
    });

    onUnlockBadge?.('noor_sadaqah_planter');

    setShowRedeemSuccess(
      lang === 'ps'
        ? `ماشاء الله! د ${costCoins} کوینونو په بدل کې ${cashReward} روپۍ ستاسو مالي هدف ته اضافه شوې!`
        : lang === 'ur'
        ? `ماشاء اللہ! ${costCoins} کوائنز کے بدلے ${cashReward} روپے آپ کے بچت کے ہدف میں جمع کر دیے گئے ہیں!`
        : `Masha'Allah! Rs ${cashReward} successfully boosted into your savings goal!`
    );

    setTimeout(() => setShowRedeemSuccess(null), 4000);
  };

  const handlePlantTree = () => {
    if (appData.noorCoins < 120) {
      playSound('alert');
      onNotify?.(
        lang === 'ps' ? '120 نور کوینونه پکار دي!' : lang === 'ur' ? '120 نور کوائنز درکار ہیں!' : '120 Noor Coins required!',
        'error'
      );
      return;
    }
    playSound('chime');
    setPlantedTrees((prev) => prev + 1);
    setAppData((prev) => ({ ...prev, noorCoins: prev.noorCoins - 120 }));
    onUnlockBadge?.('noor_sadaqah_planter');
    onLogActivity?.({
      child: activeChild,
      role: activeChildRole,
      type: 'quest',
      title: 'Planted Sadaqah Jariyah Olive Tree',
      titleUr: 'صدقہ جاریہ زیتون کا پودا لگایا (120 کوائنز)',
      titlePs: 'د صدقه جاریه د زیتون ونه یې کښېنوله',
      detail: 'Barakah Vault',
    });
    setShowRedeemSuccess(
      lang === 'ps'
        ? 'ماشاء الله! ستاسو د زیتون مجازی صدقه جاریه ونه په بریالیتوب سره کښېنول شوه!'
        : lang === 'ur'
        ? 'ماشاء اللہ! آپ کا ورچوئل زیتون کا صدقہ جاریہ پودا کامیابی سے لگ گیا ہے!'
        : "Masha'Allah! Your virtual Sadaqah Jariyah olive tree has been planted!"
    );
    setTimeout(() => setShowRedeemSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* =========================================================================
          1. Hero Kids Hub Banner with Real-time Streak & Status
          ========================================================================= */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] shadow-lg">
        <div className="h-[3px] w-full nibras-accent-bar" />
        <div className="p-6 sm:p-9 text-center space-y-5 relative">
          <div className="flex justify-center">
            <img
              src={AL_NIBRAS_LOGO_SRC}
              alt="Al-Nibras Group Noor Zone Emblem"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#FBBF24]/70 bg-[#07091B]"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold gold-gradient-text tracking-tight">
            {t.kidsHeroTitle}
          </h2>

          <p className="text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed text-slate-600 dark:text-slate-300">
            {t.kidsHeroSub}
          </p>

          {/* Level & Streak Stats Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-5 px-6 py-3.5 rounded-2xl border bg-slate-50 dark:bg-[#07091B] border-slate-200 dark:border-[#232852] text-xs sm:text-sm font-bold">
            <span className="text-[#B45309] dark:text-[#FBBF24] flex items-center gap-1.5 font-mono tabular-nums">
              <span className="text-lg">🪙</span>
              <span>
                {t.noorCoins}: <strong className="text-base">{appData.noorCoins}</strong>
              </span>
            </span>

            <span className="text-slate-400">·</span>

            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono tabular-nums">
              <span className="text-lg">🔥</span>
              <span>
                {t.streak}: <strong className="text-base">{streakDays} {t.streakDayBadge}</strong>
              </span>
            </span>

            <span className="text-slate-400">·</span>

            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="text-lg">🌱</span>
              <span>
                {t.level}: <strong>{appData.userLevel}</strong>
              </span>
            </span>

            <span className="text-slate-400">·</span>

            <span className="text-[#0E7490] dark:text-[#22D3EE] flex items-center gap-1 font-bold">
              <span>{multiplierInfo.icon}</span>
              <span>{multiplierInfo.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. Daily Login Streak Counter & 7-Day Rewards Path
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl border bg-white dark:bg-[#10132C] border-slate-200 dark:border-[#232852] shadow-lg space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24] flex items-center gap-1.5">
              <span>🔥</span>
              <span>{t.dailyStreakTitle}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold gold-gradient-text font-mono tabular-nums">
              {streakDays} {t.streakDayBadge} {t.currentStreak}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {t.dailyStreakSubtitle}
            </p>
          </div>

          {/* Quick Demo Controls & Live Countdown */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl border text-[11px] font-mono tabular-nums font-bold flex items-center gap-1.5 bg-slate-100 dark:bg-[#07091B] border-slate-200 dark:border-[#232852] text-slate-700 dark:text-slate-300">
              <span className="text-[#B45309] dark:text-[#FBBF24]">⏳</span>
              <span>{t.nextRewardIn}:</span>
              <span className="text-[#0E7490] dark:text-[#22D3EE] font-extrabold">
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={handleSimulateNextDay}
              title="Test progression to the next day"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>⏩</span>
              <span>{t.simulateNextDay}</span>
            </button>

            <button
              onClick={handleResetStreak}
              title="Reset streak to Day 1"
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>↺</span>
              <span>{t.resetStreak}</span>
            </button>
          </div>
        </div>

        {/* 7-Day Cycle Cards Trail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 pt-2">
          {STREAK_DAYS_CONFIG.map((dayItem) => {
            const isCompleted = isClaimedToday ? dayItem.day <= cycleDay : dayItem.day < cycleDay;
            const isCurrentReady = !isClaimedToday && dayItem.day === cycleDay;
            const isFuture = dayItem.day > cycleDay;

            return (
              <div
                key={dayItem.day}
                className={`p-4 rounded-xl border text-center transition-colors relative flex flex-col justify-between items-center ${
                  isCurrentReady
                    ? 'border-[#FBBF24] bg-amber-50 dark:bg-[#161B3B] shadow-md'
                    : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#07091B]/70 text-slate-500 dark:text-slate-400 opacity-85'
                }`}
              >
                {/* Top Status Row */}
                <div className="flex items-center justify-between w-full text-[10px] font-bold mb-1">
                  <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {t.dayLabel} {dayItem.day}
                  </span>
                  {isCompleted && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-black">✓</span>
                  )}
                  {isCurrentReady && (
                    <span className="text-[#B45309] dark:text-[#FBBF24] font-black">🎁</span>
                  )}
                  {isFuture && (
                    <span className="text-[10px] text-slate-400">🔒</span>
                  )}
                </div>

                {/* Day Icon */}
                <div className="text-3xl my-2">{dayItem.icon}</div>

                {/* Day Title */}
                <div className="font-bold text-xs truncate max-w-full text-slate-900 dark:text-slate-100">
                  {getStreakDayTitle(dayItem)}
                </div>

                {/* Reward Value */}
                <div
                  className={`mt-2 py-1 px-2.5 rounded-lg text-xs font-bold font-mono tabular-nums w-full ${
                    isCurrentReady
                      ? 'bg-[#FBBF24] text-[#07091B]'
                      : isCompleted
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-200/70 dark:bg-[#161B3B] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  +{dayItem.coins} 🪙
                </div>

                {/* Perk footnote */}
                <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {getStreakDayPerk(dayItem)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Claim Reward Call to Action Bar */}
        <div className="p-5 rounded-xl border bg-slate-50 dark:bg-[#07091B] border-[#FBBF24]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-start">
            <div className="text-3xl sm:text-4xl">
              {isClaimedToday ? '✅' : '🎁'}
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {isClaimedToday ? t.rewardClaimedToday : t.claimDailyReward}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {isClaimedToday
                  ? lang === 'ps'
                    ? 'ماشاء الله! تاسو د نن ورځې انعام واخیست. بل تحفه سبا سهار چمتو کیږي.'
                    : lang === 'ur'
                    ? 'ماشاء اللہ! آپ نے آج کا استقامت انعام وصول کر لیا ہے۔ اگلا تحفہ کل صبح دستیاب ہوگا۔'
                    : 'Masha’Allah! You claimed your daily reward today. Next gift unlocks tomorrow!'
                  : lang === 'ps'
                  ? `نن داخلېدو سره ستاسو لپاره +${todayRewardCoins} نور کوینونه چمتو دي!`
                  : lang === 'ur'
                  ? `آج لاگ ان کرنے پر آپ کے لیے +${todayRewardCoins} نور کوائنز تیار ہیں!`
                  : `+${todayRewardCoins} Noor Coins are ready for today's educational consistency!`}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            {isClaimedToday ? (
              <div className="px-6 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 whitespace-nowrap">
                <span>✓ {t.rewardClaimedToday}</span>
              </div>
            ) : (
              <button
                onClick={handleClaimDailyStreak}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span className="text-lg">✨</span>
                <span>{t.claimDailyReward} (+{todayRewardCoins} 🪙)</span>
              </button>
            )}
          </div>
        </div>

        {/* Consistency Hadith Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
          <span className="text-xl">📖</span>
          <div className="flex-1">
            <span className="font-semibold">{t.hadithConsistency}</span>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">({t.hadithConsistencyRef})</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. Daily Educational Engagement Quests
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl border bg-white dark:bg-[#10132C] border-slate-200 dark:border-[#232852] shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0E7490] dark:text-[#22D3EE] flex items-center gap-1.5">
              <span>🎯</span>
              <span>{t.dailyQuestsTitle}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-extrabold gold-gradient-text">
              {t.dailyQuestsSubtitle}
            </h3>
          </div>

          {/* Quests completion progress bar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-xs font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300">
              {completedQuests.filter((q) => ['hadith', 'challenge', 'deed', 'goal'].includes(q)).length}/4 Done
            </div>
            <div className="w-32 bg-slate-200 dark:bg-[#07091B] rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-[#232852]">
              <div
                className="bg-gradient-to-r from-[#FBBF24] to-[#22D3EE] h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${(completedQuests.filter((q) => ['hadith', 'challenge', 'deed', 'goal'].includes(q)).length / 4) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 4 Daily Quests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quest 1: Daily Hadith */}
          <div
            className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
              completedQuests.includes('hadith')
                ? 'border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#161B3B] hover:border-[#FBBF24]/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">📜</span>
                <span className="text-xs font-mono tabular-nums font-bold text-[#B45309] dark:text-[#FBBF24]">
                  +15 🪙
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.questReadHadith}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.questReadHadithDesc}
              </p>
            </div>

            <button
              onClick={() => setShowHadithModal(true)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                completedQuests.includes('hadith')
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B]'
              }`}
            >
              <span>{completedQuests.includes('hadith') ? '✓ ' + t.questCompleted : '📖 ' + t.completeQuest}</span>
            </button>
          </div>

          {/* Quest 2: Play Halal Challenge */}
          <div
            className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
              completedQuests.includes('challenge')
                ? 'border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#161B3B] hover:border-[#FBBF24]/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🎮</span>
                <span className="text-xs font-mono tabular-nums font-bold text-[#B45309] dark:text-[#FBBF24]">
                  +25 🪙
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.questPlayChallenge}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.questPlayChallengeDesc}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedGame('needsWants');
                setFeedback(null);
              }}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                completedQuests.includes('challenge')
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B]'
              }`}
            >
              <span>{completedQuests.includes('challenge') ? '✓ ' + t.questCompleted : '🕹️ ' + t.completeQuest}</span>
            </button>
          </div>

          {/* Quest 3: Log Daily Sadaqah or Kindness */}
          <div
            className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
              completedQuests.includes('deed')
                ? 'border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#161B3B] hover:border-[#FBBF24]/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🤲</span>
                <span className="text-xs font-mono tabular-nums font-bold text-[#B45309] dark:text-[#FBBF24]">
                  +20 🪙
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.questGoodDeed}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.questGoodDeedDesc}
              </p>
            </div>

            <button
              onClick={() => setShowDeedModal(true)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                completedQuests.includes('deed')
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B]'
              }`}
            >
              <span>{completedQuests.includes('deed') ? '✓ ' + t.questCompleted : '🤍 ' + t.completeQuest}</span>
            </button>
          </div>

          {/* Quest 4: Review Goals & Save */}
          <div
            className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
              completedQuests.includes('goal')
                ? 'border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#161B3B] hover:border-[#FBBF24]/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🚲</span>
                <span className="text-xs font-mono tabular-nums font-bold text-[#B45309] dark:text-[#FBBF24]">
                  +15 🪙
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.questGoalSave}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.questGoalSaveDesc}
              </p>
            </div>

            <button
              onClick={() => markQuestCompleted('goal', 15)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                completedQuests.includes('goal')
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B]'
              }`}
            >
              <span>{completedQuests.includes('goal') ? '✓ ' + t.questCompleted : '🎯 ' + t.completeQuest}</span>
            </button>
          </div>
        </div>

        {/* Super Bonus Bar if all 4 are done */}
        {allQuestsDone && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-[#161B3B] border border-[#FBBF24]/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="font-extrabold text-sm text-[#B45309] dark:text-[#FBBF24]">
                  {t.allQuestsBonus}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {lang === 'ps'
                    ? 'تاسو د نن ورځې ټول ۴ تعلیمي او اخلاقي اهداف بشپړ کړل.'
                    : lang === 'ur'
                    ? 'آپ نے آج کے تمام 4 تعلیمی و اخلاقي اہداف کامیابی سے مکمل کر لیے ہیں۔'
                    : 'You finished all 4 consistency learning habits today!'}
                </div>
              </div>
            </div>

            {completedQuests.includes('super_bonus') ? (
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                ✓ Super Bonus Claimed (+50 🪙)
              </div>
            ) : (
              <button
                onClick={handleClaimAllQuestsBonus}
                className="px-6 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
              >
                {t.claimAllQuestsBonus}
              </button>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          4. 4 Interactive Gamified Challenges Grid
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-serif font-extrabold gold-gradient-text">
            {lang === 'ps'
              ? 'د حلال مالي لوبو چیلنجونه (کوینونه وګټئ)'
              : lang === 'ur'
              ? 'حلال فنانس چیلنجز (کوائنز کمائیں)'
              : 'Halal Finance Challenges'}
          </h3>
          <span className="text-xs font-mono tabular-nums text-[#0E7490] dark:text-[#22D3EE] font-bold">
            🔥 {currentMultiplier}x {t.multiplierActive}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Game 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] text-center space-y-4 flex flex-col justify-between hover:border-[#FBBF24]/60 transition-colors">
            <div className="space-y-2">
              <div className="text-5xl">🦁</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.game1Title}{' '}
                {(appData.completedChallenges || []).includes('needsWants') && (
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.game1Desc}
              </p>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSelectedGame('needsWants');
                setFeedback(null);
              }}
              className="w-full py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
            >
              {t.playChallenge} (+{Math.round(20 * currentMultiplier)} 🪙)
            </button>
          </div>

          {/* Game 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] text-center space-y-4 flex flex-col justify-between hover:border-[#22D3EE]/60 transition-colors">
            <div className="space-y-2">
              <div className="text-5xl">🔍</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.game2Title}{' '}
                {(appData.completedChallenges || []).includes('ribaDetector') && (
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.game2Desc}
              </p>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSelectedGame('ribaDetector');
                setFeedback(null);
              }}
              className="w-full py-3 rounded-xl bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs transition-opacity cursor-pointer"
            >
              {t.playChallenge} (+{Math.round(25 * currentMultiplier)} 🪙)
            </button>
          </div>

          {/* Game 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] text-center space-y-4 flex flex-col justify-between hover:border-[#FBBF24]/60 transition-colors">
            <div className="space-y-2">
              <div className="text-5xl">🧮</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.game3Title}{' '}
                {(appData.completedChallenges || []).includes('zakatMath') && (
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.game3Desc}
              </p>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSelectedGame('zakatMath');
                setFeedback(null);
              }}
              className="w-full py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
            >
              {t.playChallenge} (+{Math.round(15 * currentMultiplier)} 🪙)
            </button>
          </div>

          {/* Game 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] text-center space-y-4 flex flex-col justify-between hover:border-[#22D3EE]/60 transition-colors">
            <div className="space-y-2">
              <div className="text-5xl">⚖️</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.game4Title}{' '}
                {(appData.completedChallenges || []).includes('halalTrader') && (
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.game4Desc}
              </p>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setSelectedGame('halalTrader');
                setFeedback(null);
              }}
              className="w-full py-3 rounded-xl bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs transition-opacity cursor-pointer"
            >
              {t.playChallenge} (+{Math.round(30 * currentMultiplier)} 🪙)
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. Noor Coins Rewards & Barakah Vault
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl border bg-white dark:bg-[#10132C] border-slate-200 dark:border-[#232852] shadow-lg space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24] flex items-center gap-1.5">
            <span>💎</span>
            <span>{t.rewardVaultTitle}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-extrabold gold-gradient-text">
            {t.rewardVaultSubtitle}
          </h3>
        </div>

        {showRedeemSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs animate-fadeIn flex items-center gap-2">
            <span>🎉</span>
            <span>{showRedeemSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Item 1: Boost Bicycle Goal */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#161B3B] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-3xl">🚲</div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.redeemGoalContrib}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {lang === 'ps'
                  ? 'د احمد نوي بایسکل فنډ ته 500 روپۍ ور اضافه کړئ.'
                  : lang === 'ur'
                  ? 'احمد کی نئی سائیکل کے ہدف میں 500 روپے کا اضافہ کریں۔'
                  : 'Add Rs 500 into Ahmed’s Bicycle savings goal!'}
              </p>
            </div>
            <button
              onClick={() => handleRedeemGoalContribution(100, 500)}
              className="w-full py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
            >
              {t.redeemBtn} (100 🪙)
            </button>
          </div>

          {/* Item 2: Junior Sharia Guardian Badge */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#161B3B] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-3xl">🏅</div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.redeemBadge}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {lang === 'ps'
                  ? 'د حلال او حرامو د پېژندنې ځانګړی ډیجیټل طلایي نښان.'
                  : lang === 'ur'
                  ? 'حلال و حرام میں تمیز کرنے کا باضابطہ ڈیجیٹل گولڈ سرٹیفکیٹ بیج۔'
                  : 'Digital golden badge of Sharia financial consistency.'}
              </p>
            </div>
            <button
              onClick={() => {
                if (appData.noorCoins < 200) {
                  playSound('alert');
                  onNotify?.(
                    lang === 'ps' ? '200 نور کوینونه پکار دي!' : lang === 'ur' ? '200 نور کوائنز درکار ہیں!' : '200 Noor Coins required!',
                    'error'
                  );
                  return;
                }
                playSound('success');
                setAppData((prev) => ({ ...prev, noorCoins: prev.noorCoins - 200 }));
                onLogActivity?.({
                  child: activeChild,
                  role: activeChildRole,
                  type: 'quest',
                  title: 'Unlocked Junior Sharia Guardian Badge',
                  titleUr: 'جونیئر شریعہ گارڈین گولڈ بیج حاصل کیا (200 کوائنز)',
                  titlePs: 'د وړوکي شرعي ساتونکي طلایي نښان واخیست',
                  detail: 'Barakah Vault',
                });
                onUnlockBadge?.('noor_super_quester');
                setShowGuardianBadgeModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-[#047857] dark:bg-[#10B981] hover:opacity-90 text-white dark:text-[#07091B] font-bold text-xs transition-opacity cursor-pointer"
            >
              {t.redeemBtn} (200 🪙)
            </button>
          </div>

          {/* Item 3: Virtual Sadaqah Jariyah Olive Tree */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#161B3B] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🌳</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono tabular-nums font-bold">
                  {plantedTrees} {lang === 'ps' ? 'ونې کښېنول شوې' : 'Trees Planted'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.redeemTree}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {lang === 'ps'
                  ? 'د نېکۍ په باغچه کې د زیتون تلپاتې ثواب لرونکې ونه کښېنوئ.'
                  : lang === 'ur'
                  ? 'ورچوئل نیکی کے باغیچے میں ہمیشہ رہنے والا ثواب کا پودا لگائیں۔'
                  : 'Plant a virtual olive tree in your family garden of barakah.'}
              </p>
            </div>
            <button
              onClick={handlePlantTree}
              className="w-full py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
            >
              {t.redeemBtn} (120 🪙)
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5b. Noor Zone Milestone Badges Showcase
          ========================================================================= */}
      <BadgeShowcase
        t={t}
        lang={lang}
        earnedBadges={appData.earnedBadges || []}
        categoryFilter="noor_zone"
        variant="catalog"
      />

      {/* =========================================================================
          6. Interactive Game Challenge Modals
          ========================================================================= */}
      {selectedGame === 'needsWants' && (
        <div className="p-7 rounded-2xl bg-white dark:bg-[#10132C] border-2 border-[#FBBF24] space-y-4 max-w-xl mx-auto text-center shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-serif font-extrabold gold-gradient-text">
              {t.game1Title}
            </h4>
            <button
              onClick={() => setSelectedGame(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
            {lang === 'ps'
              ? 'احمد سره خپل جیبي خرڅ دی؛ هغه د ښوونځي لازمي کتاب (800 روپۍ) او د لوبو نوی کنسول (45,000 روپۍ) اخیستل غواړي. د ویډیو ګیم کنسول څه شی بلل کیږي؟'
              : lang === 'ur'
              ? 'احمد کے پاس پاکٹ منی ہے؛ وہ اسکول کی لازمی کتاب (Rs 800) اور نیا ویڈیو گیم کنسول (Rs 45,000) خریدنا چاہتا ہے۔ ویڈیو گیم کنسول کیا ہے؟'
              : 'Ahmed has pocket money; he wants to buy a required school book (Rs 800) and a gaming console (Rs 45,000). What is the gaming console?'}
          </p>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                feedback.correct
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() =>
                completeChallenge(
                  20,
                  lang === 'ps'
                    ? '🎉 ډېر ښه ځواب! د ویډیو ګیم کنسول یوه هیله ده چې جلا سپما غواړي، اساسي اړتیا نه ده.'
                    : '🎉 شاندار جواب! ویڈیو گیم کنسول ایک خواہش ہے، جس کے لیے الگ بچت کرنی چاہیے، بنیادی ضرورت نہیں۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-[#047857] dark:bg-[#10B981] text-white dark:text-[#07091B] font-bold text-xs transition-opacity hover:opacity-90 cursor-pointer"
            >
              {lang === 'ps' ? 'دا یوه لنډمهاله هیله (WANT) ده ✓' : 'یہ ایک وقتی خواہش (WANT) ہے ✓'}
            </button>
            <button
              onClick={() =>
                failChallenge(
                  lang === 'ps'
                    ? 'غلط ځواب! ویډیو ګیم یوه تفریحي هیله ده، اساسي اړتیا نه ده. بیا فکر وکړئ.'
                    : 'غلط جواب! ویڈیو گیم ایک تفریحی خواہش ہے، لازمی ضرورت نہیں۔ دوبارہ غور فرمائیں۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-500/30 cursor-pointer"
            >
              {lang === 'ps' ? 'دا یوه اساسي اړتیا (NEED) ده ✕' : 'یہ ایک بنیادی ضرورت (NEED) ہے ✕'}
            </button>
          </div>
        </div>
      )}

      {selectedGame === 'ribaDetector' && (
        <div className="p-7 rounded-2xl bg-white dark:bg-[#10132C] border-2 border-emerald-500 space-y-4 max-w-xl mx-auto text-center shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-serif font-extrabold text-emerald-700 dark:text-emerald-400">
              {t.game2Title}
            </h4>
            <button
              onClick={() => setSelectedGame(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
            {lang === 'ps'
              ? 'معامله: "ما ته 10,000 روپۍ پور راکړه، زه به تا ته بې له کوم زیان او تاوانه، هره میاشت فکسډ 15٪ ګټه درکوم."'
              : 'معاہدہ: "مجھے 10,000 روپے ادھار دیں، میں آپ کو بغیر کسی رسک یا نقصان کی شراکت کے، ہر ماہ گارنٹی شدہ فکسڈ 15٪ نفع دوں گا۔"'}
          </p>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                feedback.correct
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() =>
                completeChallenge(
                  25,
                  lang === 'ps'
                    ? '🎉 ماشاء الله! بالکل سم. بې له رسک او شراکت څخه فکسډ ګټه اخیستل سود دی.'
                    : '🎉 ماشاء اللہ! بالکل درست۔ بغیر رسک اور نقصان کی شراکت کے طے شدہ فکسڈ نفع سود (ربوا) کہلاتا ہے۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {lang === 'ps' ? 'په دې کې سود (ربوا) ده (حرامه) ✓' : 'اس میں سود (ربوا) ہے (حرام) ✓'}
            </button>
            <button
              onClick={() =>
                failChallenge(
                  lang === 'ps'
                    ? 'غلط! د تاوان له منلو پرته فکسډ ګټه اخیستل سود دی. په اسلام کې د ګټې او تاوان شراکت لازم دی.'
                    : 'غلط! نقصان کا رسک لیے بغیر فکسڈ منافع لینا خالص سود ہے۔ اسلامی تجارت میں نفع و نقصان کی شراکت لازم ہے۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30 cursor-pointer"
            >
              {lang === 'ps' ? 'دا جایزه او حلاله سوداګري ده ✕' : 'یہ جائز اور حلال تجارت ہے ✕'}
            </button>
          </div>
        </div>
      )}

      {selectedGame === 'zakatMath' && (
        <div className="p-7 rounded-2xl bg-white dark:bg-[#10132C] border-2 border-[#FBBF24] space-y-4 max-w-xl mx-auto text-center shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-serif font-extrabold gold-gradient-text">
              {t.game3Title}
            </h4>
            <button
              onClick={() => setSelectedGame(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
            {lang === 'ps'
              ? 'که د کال په اوږدو کې 100,000 روپۍ حلاله سپما موجوده وي او نصاب پوره وي، د 2.5٪ له مخې څومره زکات کیږي؟'
              : 'اگر سال بھر 100,000 روپے کی حلال بچت جمع رہی ہو اور نصاب پورا ہو، تو واجب الادا زکوٰۃ (2.5٪) کتنی ہوگی؟'}
          </p>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                feedback.correct
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() =>
                completeChallenge(
                  15,
                  lang === 'ps'
                    ? '🎉 ډېر ښه حساب! د 100,000 روپیو 2.5% کټ مټ 2,500 روپۍ کیږي.'
                    : '🎉 زبردست حساب! 100,000 کا 2.5% ٹھیک 2,500 روپے بنتا ہے (100,000 ÷ 40 = 2,500)۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
            >
              {lang === 'ps' ? '2,500 روپۍ (سم ځواب) ✓' : 'Rs 2,500 (درست جواب) ✓'}
            </button>
            <button
              onClick={() =>
                failChallenge(
                  lang === 'ps'
                    ? 'غلط! د 100,000 روپیو 2.5% را ایستلو لپاره هغه په 40 وویشئ، ځواب 2,500 روپۍ دی.'
                    : 'غلط! 100,000 کا 2.5% نکالنے کے لیے اسے 40 پر تقسیم کریں، جواب 2,500 روپے ہے۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-[#232852] cursor-pointer"
            >
              Rs 5,000 ✕
            </button>
          </div>
        </div>
      )}

      {selectedGame === 'halalTrader' && (
        <div className="p-7 rounded-2xl bg-white dark:bg-[#10132C] border-2 border-[#22D3EE] space-y-4 max-w-xl mx-auto text-center shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-serif font-extrabold gold-gradient-text">
              {t.game4Title}
            </h4>
            <button
              onClick={() => setSelectedGame(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
            {lang === 'ps'
              ? 'تاسو خپل بایسکل پلورئ چې بریک یې لږ عیب لري. یو پېرودونکی راغلی، د حدیث شریف له مخې به څه کوئ؟'
              : 'آپ اپنی سائیکل بیچ رہے ہیں جس کی بریک میں معمولی نقص ہے۔ ایک خریدار مناسب قیمت دینے آیا ہے۔ حدیث شریف کے مطابق آپ کیا کریں گے؟'}
          </p>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                feedback.correct
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() =>
                completeChallenge(
                  30,
                  lang === 'ps'
                    ? '🎉 الله اکبر! رسول الله ﷺ فرمايلي څوک چې عیب ښکاره کوي د هغوی په معامله کې برکت اچول کیږي.'
                    : '🎉 اللہ اکبر! رسول اللہ ﷺ نے فرمایا کہ عیب ظاہر کر کے بیچنے والے کے سودے میں برکت ڈال دی جاتی ہے۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-[#047857] dark:bg-[#10B981] text-white dark:text-[#07091B] font-bold text-xs transition-opacity hover:opacity-90 cursor-pointer"
            >
              {lang === 'ps' ? 'پېرودونکي ته به رښتیا ووایم چې بریک جوړول غواړي ✓' : 'خریدار کو سچ سچ بتاؤں گا کہ بریک ٹھیک کروانی ہوگی ✓'}
            </button>
            <button
              onClick={() =>
                failChallenge(
                  lang === 'ps'
                    ? 'نه! عیب پټول دوکه بازي ده او په هغې سره د مال برکت ختمیږي.'
                    : 'نہیں! عیب چھپا کر مال بیچنا اسلام میں دھوکہ دہی ہے اور اس میں برکت مٹ جاتی ہے۔'
                )
              }
              className="px-6 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-500/30 cursor-pointer"
            >
              {lang === 'ps' ? 'عیب به پټ کړم چې ډېرې پیسې واخلم ✕' : 'عیب چھپا لوں گا تاکہ زیادہ پیسے ملیں ✕'}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. Daily Streak Reward Claim Celebration Modal
          ========================================================================= */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07091B]/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-[#10132C] border-2 border-[#FBBF24] rounded-2xl overflow-hidden text-center shadow-2xl">
            <div className="h-[3px] w-full nibras-accent-bar" />
            <div className="p-7 space-y-5">
              <div className="text-5xl">🎁</div>

              <h3 className="text-2xl font-serif font-extrabold gold-gradient-text">
                {t.claimSuccessTitle}
              </h3>

              <div className="my-2 py-3 px-6 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-[#FBBF24]/40">
                <div className="text-3xl font-extrabold text-[#B45309] dark:text-[#FBBF24] font-mono tabular-nums">
                  +{claimedRewardAmount} Noor Coins 🪙
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                  🔥 {streakDays} {t.streakDayBadge} {t.currentStreak}!
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-arabic">
                «أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ»
                <br />
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {lang === 'ps'
                    ? 'الله ته تر ټولو غوره عمل هغه دی چې تلپاتې وي که څه هم لږ وي.'
                    : lang === 'ur'
                    ? 'اللہ تعالیٰ کے ہاں سب سے محبوب عمل وہ ہے جو مستقل اور پابندی سے کیا جائے، اگرچہ تھوڑا ہی ہو۔'
                    : 'The deeds most beloved to Allah are those that are consistent, even if small.'}
                </span>
              </p>

              <button
                onClick={() => setShowClaimModal(false)}
                className="w-full py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
              >
                {lang === 'ps' ? 'الحمد لله! دوام ورکړئ' : lang === 'ur' ? 'الحمد للہ! جاری رکھیں' : 'Alhamdulillah! Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. Quest 1: Hadith Wisdom Reading Modal
          ========================================================================= */}
      {showHadithModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07091B]/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-lg w-full bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] rounded-2xl overflow-hidden text-center shadow-2xl">
            <div className="h-[3px] w-full nibras-accent-bar" />
            <div className="p-6 space-y-4">
              <div className="text-5xl">📖</div>
              <h3 className="text-xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
                {t.questReadHadith}
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-start space-y-2">
                <div className="text-sm font-arabic text-[#B45309] dark:text-[#FBBF24] text-center leading-loose">
                  «رَحِمَ اللَّهُ رَجُلاً سَمْحًا إِذَا بَاعَ، وَإِذَا اشْتَرَى، وَإِذَا اقْتَضَى»
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-center">
                  {lang === 'ps'
                    ? 'الله تعالی دې په هغه بنده رحم وکړي چې په پلورلو، اخیستلو او د خپل حق په غوښتلو کې اسانتیا او نرمي کوي. (صحیح بخاري: 2076)'
                    : lang === 'ur'
                    ? 'اللہ تعالیٰ اس شخص پر رحم فرمائے جو بیچتے وقت، خریدتے وقت، اور اپنا حق تقاضا کرتے وقت نرمی اور آسانی کا رویہ اختیار کرے۔ (صحیح بخاری: 2076)'
                    : 'May Allah show mercy to a man who is easygoing when he sells, when he buys, and when he demands his rights. (Sahih al-Bukhari: 2076)'}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-[#232852] text-[11px] text-slate-500 dark:text-slate-400">
                  💡 {lang === 'ps' ? 'سبق: په معاملو کې نرمي او رښتینولي الهي برکت رابولي.' : lang === 'ur' ? 'سبق: اسلامی معیشت میں دیانتداری اور نرمی سے کمائی میں اللہ کی برکت شامل ہوتی ہے۔' : 'Lesson: Fair, honest and kind transactions bring divine barakah.'}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowHadithModal(false);
                  markQuestCompleted('hadith', 15);
                }}
                className="w-full py-3 rounded-xl bg-[#047857] dark:bg-[#10B981] text-white dark:text-[#07091B] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                {lang === 'ps' ? 'ما ولوست (+15 کوینونه ترلاسه کړئ)' : lang === 'ur' ? 'میں نے پڑھ لیا (+15 کوائنز حاصل کریں)' : 'I Read & Reflected (+15 Coins)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. Quest 3: Log Daily Good Deed Modal
          ========================================================================= */}
      {showDeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07091B]/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] rounded-2xl overflow-hidden text-center shadow-2xl">
            <div className="h-[3px] w-full nibras-accent-bar" />
            <div className="p-6 space-y-4">
              <div className="text-5xl">🤲</div>
              <h3 className="text-xl font-serif font-bold gold-gradient-text">
                {t.questGoodDeed}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {lang === 'ps'
                  ? 'نن مو د الله تعالی د رضا لپاره کوم نېک عمل یا صدقه وکړه؟'
                  : lang === 'ur'
                  ? 'آج آپ نے اللہ کی رضا کے لیے کون سا نیک عمل یا صدقہ کیا؟'
                  : 'Which good deed or Sadaqah did you perform today for Allah’s sake?'}
              </p>

              <div className="space-y-2 text-start">
                {[
                  {
                    ps: 'د مور او پلار په کارونو کې په خوښۍ مرسته وکړه',
                    ur: 'والدین کے کاموں میں خوشی سے مدد کی',
                    en: 'Helped parents happily at home',
                  },
                  {
                    ps: 'له جیبي خرڅ څخه ۵۰ روپۍ د خیرات په بکس کې واچولې',
                    ur: 'پاکٹ منی سے 50 روپے صدقہ کے خانے میں ڈالے',
                    en: 'Put Rs 50 into the Sadaqah jar',
                  },
                  {
                    ps: 'له ورور یا خور سره خپل غوره شی شریک کړ',
                    ur: 'بہن / بھائی کے ساتھ اپنی پسندیدہ چیز شیئر کی',
                    en: 'Shared my favorite item with a sibling',
                  },
                  {
                    ps: 'له خلکو سره په خندا او مسکا خبرې وکړې (صدقه)',
                    ur: 'کسی مسلمان سے مسکرا کر خندہ پیشانی سے بات کی',
                    en: 'Smiled kindly at someone as Sadaqah',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDeed(lang === 'ps' ? item.ps : item.ur)}
                    className={`w-full p-3 rounded-xl border text-xs text-start transition-colors cursor-pointer ${
                      selectedDeed === (lang === 'ps' ? item.ps : item.ur)
                        ? 'border-[#FBBF24] bg-amber-50 dark:bg-[#FBBF24]/15 text-[#B45309] dark:text-[#FBBF24] font-bold'
                        : 'border-slate-200 dark:border-[#232852] bg-slate-50 dark:bg-[#07091B] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B3B]'
                    }`}
                  >
                    {lang === 'ps' ? item.ps : lang === 'ur' ? item.ur : item.en}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowDeedModal(false);
                  markQuestCompleted('deed', 20);
                }}
                className="w-full py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
              >
                {lang === 'ps' ? 'نېک عمل ثبت کړئ (+20 کوینونه)' : lang === 'ur' ? 'نیکی کا اندراج کریں (+20 کوائنز)' : 'Log Good Deed (+20 Coins)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. Junior Sharia Guardian Certificate Badge Modal
          ========================================================================= */}
      {showGuardianBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07091B]/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-[#10132C] border-2 border-[#FBBF24] rounded-2xl overflow-hidden text-center shadow-2xl">
            <div className="h-[3px] w-full nibras-accent-bar" />
            <div className="p-7 space-y-4">
              <img
                src={AL_NIBRAS_LOGO_SRC}
                alt="Al-Nibras Group Emblem"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
                className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-[#FBBF24]/70 bg-[#07091B]"
              />
              <h3 className="text-2xl font-serif font-extrabold gold-gradient-text">
                {lang === 'ps' ? 'د وړوکي شرعي ساتونکي نښان' : 'Junior Sharia Guardian'}
              </h3>
              <div className="text-xs text-[#0E7490] dark:text-[#22D3EE] font-bold uppercase tracking-wider">
                {t.verifiedCharityBadge} · Al-Nibras Group
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-[#FBBF24]/40 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
                {lang === 'ps'
                  ? '"دا سند تصدیقوي چې احمد عمران په دوامداره توګه اسلامي مالي احکام او د حلال رزق اصول زده کړي دي."'
                  : '"This certifies that Ahmed Imran has demonstrated consistent Islamic financial knowledge, daily Istiqamah streak dedication, and commitment to Halal earnings."'}
              </div>
              <button
                onClick={() => setShowGuardianBadgeModal(false)}
                className="w-full py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors cursor-pointer"
              >
                {lang === 'ps' ? 'ماشاء الله! بند کړئ' : lang === 'ur' ? 'ماشاء اللہ! بند کریں' : 'Close Badge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
