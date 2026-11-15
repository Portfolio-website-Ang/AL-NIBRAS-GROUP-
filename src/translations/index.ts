import { Language } from '../types';

export interface Translations {
  appName: string;
  subTitle: string;
  tagline: string;
  announcement: string;
  navHome: string;
  navOkKro: string;
  navZakat: string;
  navLearn: string;
  navKids: string;
  navAiTutor: string;
  roleParent: string;
  roleKid: string;
  roleTeen: string;
  roleTeacher: string;
  roleAdmin: string;
  activeSeat: string;
  welcomeSalam: string;
  heroSubtext: string;
  walletBalance: string;
  pkr: string;
  approved: string;
  pending: string;
  rejected: string;
  approveBtn: string;
  rejectBtn: string;
  noorCoins: string;
  streak: string;
  level: string;
  calculateZakat: string;
  zakatPayNow: string;
  nisabStatus: string;
  silverNisab: string;
  goldNisab: string;
  quizTitle: string;
  startQuiz: string;
  certificateTitle: string;
  verifiedStamp: string;
  askAiPlaceholder: string;
  askAiBtn: string;
  themeToggle: string;
  langName: string;
  mudarabahReturns: string;
  halalCertified: string;
  familyGoals: string;
  recentApprovals: string;
  viewAll: string;
  newRequest: string;
  submitRequest: string;
  cashLabel: string;
  goldLabel: string;
  silverLabel: string;
  businessGoodsLabel: string;
  debtsLabel: string;
  totalZakatable: string;
  payableZakat: string;
  selectCharity: string;
  verifiedCharityBadge: string;
  printCertificate: string;
  close: string;
  soundToggle: string;
  hadithTitle: string;
  hadithText: string;
  hadithRef: string;
  assetAllocation: string;
  allocationCash: string;
  allocationMudarabah: string;
  allocationGold: string;
  allocationZakat: string;
  addFundsTitle: string;
  addFundsBtn: string;
  contributeGoalBtn: string;
  completed: string;
  noPendingText: string;
  allDoneText: string;
  examIntro: string;
  examBtn: string;
  listeningMufti: string;
  speakBtn: string;
  copyBtn: string;
  muftiGreeting: string;
  kidsHeroTitle: string;
  kidsHeroSub: string;
  game1Title: string;
  game1Desc: string;
  game2Title: string;
  game2Desc: string;
  game3Title: string;
  game3Desc: string;
  game4Title: string;
  game4Desc: string;
  playChallenge: string;
  receiptTitle: string;
  receiptSub: string;
  receiptNum: string;
  receiptCharity: string;
  receiptDate: string;
  receiptAmount: string;
  officialSealed: string;
  prayerTimesTitle: string;
  prayerTimesSubtitle: string;
  nextPrayerLabel: string;
  inCountdown: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  locateMe: string;
  selectCity: string;
  schoolHanafi: string;
  schoolShafii: string;
  qiblaBearing: string;
  playAdhanTone: string;
  activeNow: string;
  dailyStreakTitle: string;
  dailyStreakSubtitle: string;
  currentStreak: string;
  streakDayBadge: string;
  claimDailyReward: string;
  rewardClaimedToday: string;
  nextRewardIn: string;
  simulateNextDay: string;
  resetStreak: string;
  dayLabel: string;
  streakBonusTitle: string;
  streakBonusSubtitle: string;
  dailyQuestsTitle: string;
  dailyQuestsSubtitle: string;
  questReadHadith: string;
  questReadHadithDesc: string;
  questPlayChallenge: string;
  questPlayChallengeDesc: string;
  questGoodDeed: string;
  questGoodDeedDesc: string;
  questGoalSave: string;
  questGoalSaveDesc: string;
  completeQuest: string;
  questCompleted: string;
  allQuestsBonus: string;
  claimAllQuestsBonus: string;
  rewardVaultTitle: string;
  rewardVaultSubtitle: string;
  redeemGoalContrib: string;
  redeemGoalSuccess: string;
  redeemBadge: string;
  redeemTree: string;
  redeemBtn: string;
  hadithConsistency: string;
  hadithConsistencyRef: string;
  multiplierActive: string;
  streakMilestone: string;
  streakShield: string;
  claimSuccessTitle: string;
  adminLockTitle: string;
  adminLockDesc: string;
  enterPinLabel: string;
  unlockAdminBtn: string;
  invalidPinError: string;
  lockAdminBtn: string;
  cancelBtn: string;
  childrenActivityTitle: string;
  childrenActivityDesc: string;
  allChildren: string;
  noActivityYet: string;
  kidPocketMoney: string;
  kidHeroSub: string;
  saveFromPocketBtn: string;
  requestFromParentsBtn: string;
  myGoals: string;
  myRequests: string;
  teenAllowance: string;
  teenHeroSub: string;
  teenLearningProgress: string;
  teacherConsoleTitle: string;
  teacherConsoleSub: string;
  publishCourseBtn: string;
  studentRosterTitle: string;
  courseCatalogTitle: string;
  adminConsoleTitle: string;
  adminConsoleSub: string;
  spendingLimitsTitle: string;
  exportAuditBtn: string;
  ngoComplianceTitle: string;
  globalLedgerTitle: string;
  earnedBadgesTitle: string;
  earnedBadgesSub: string;
  academyBadgesTitle: string;
  noorBadgesTitle: string;
  badgeUnlockedPrefix: string;
  badgeEarnedLabel: string;
  badgeLockedLabel: string;
  filterAllBadges: string;
  filterEarnedBadges: string;
  filterLockedBadges: string;
  noBadgesEarnedYet: string;
  markCourseCompleteBtn: string;
  courseCompletedLabel: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: "Al Nibras",
    subTitle: "ISLAMIC FINTECH & ACADEMY",
    tagline: "Wealth that obeys your Deen. Knowledge that lights it.",
    announcement: "✨ Al Nibras Ecosystem: Sharia-Compliant Islamic Fintech & Edtech Platform",
    navHome: "Dashboard",
    navOkKro: "Ok Kro Approvals",
    navZakat: "Zakat Hub",
    navLearn: "Academy",
    navKids: "Kids Noor Zone",
    navAiTutor: "Ask Mufti AI",
    roleParent: "Parent (Imran Qureshi)",
    roleKid: "Kid (Ahmed - 9yr)",
    roleTeen: "Teen (Fatima - 13yr)",
    roleTeacher: "Instructor (Ustad Bilal)",
    roleAdmin: "Platform Guardian",
    activeSeat: "Active Family Seat",
    welcomeSalam: "As-salamu Alaykum",
    heroSubtext: "Manage family wealth in obedience to Allah, grant instant parental permissions, and earn certified Islamic financial knowledge.",
    walletBalance: "Total Family Net Assets",
    pkr: "PKR",
    approved: "Approved",
    pending: "Pending Approval",
    rejected: "Declined",
    approveBtn: "Approve (Ok Kro)",
    rejectBtn: "Decline",
    noorCoins: "Noor Coins",
    streak: "Day Streak",
    level: "Level",
    calculateZakat: "Calculate Zakat (2.5%)",
    zakatPayNow: "Disburse Zakat Now",
    nisabStatus: "Nisab Threshold Audit",
    silverNisab: "Silver Nisab (595g): Rs 184,450",
    goldNisab: "Gold Nisab (87.48g): Rs 2,140,000",
    quizTitle: "Sharia Finance Challenge",
    startQuiz: "Take Certification Quiz",
    certificateTitle: "Sharia Finance Certificate",
    verifiedStamp: "OFFICIAL SHARIA VERIFIED SEAL",
    askAiPlaceholder: "Ask anything about Halal savings, Zakat, Riba, or Mudarabah...",
    askAiBtn: "Consult Mufti AI",
    themeToggle: "Toggle Light/Dark Theme",
    langName: "English",
    mudarabahReturns: "Mudarabah Returns +14.2% p.a.",
    halalCertified: "100% Sharia Certified",
    familyGoals: "Family Savings & Milestones",
    recentApprovals: "Ok Kro Parental Approvals",
    viewAll: "View All",
    newRequest: "New Request",
    submitRequest: "Submit Request to Parents",
    cashLabel: "Cash in Hand & Bank Accounts (PKR)",
    goldLabel: "Gold (Grams)",
    silverLabel: "Silver (Grams)",
    businessGoodsLabel: "Tradable Merchandise & Inventory",
    debtsLabel: "Immediate Debts & Liabilities to Deduct",
    totalZakatable: "Total Zakatable Net Wealth",
    payableZakat: "Payable Zakat Due (2.5%)",
    selectCharity: "Select Verified Beneficiary Charity",
    verifiedCharityBadge: "100% Sharia Audited NGO",
    printCertificate: "Print / Save PDF",
    close: "Close",
    soundToggle: "Mute/Unmute Audio FX",
    hadithTitle: "Principle of Honest Trade",
    hadithText: "The truthful, trustworthy merchant is with the Prophets, the righteous, and the martyrs.",
    hadithRef: "Jami` at-Tirmidhi: 1209",
    assetAllocation: "Sharia Asset Distribution",
    allocationCash: "Islamic Savings & Cash (45%)",
    allocationMudarabah: "Halal Equities & Funds (35%)",
    allocationGold: "Gold & Precious Metals (15%)",
    allocationZakat: "Charity & Waqf Pool (5%)",
    addFundsTitle: "Add Capital to Mudarabah Pool",
    addFundsBtn: "Deposit Funds",
    contributeGoalBtn: "Add Rs 1,000",
    completed: "Completed",
    noPendingText: "All caught up! No pending requests.",
    allDoneText: "All children requests have been reviewed.",
    examIntro: "Al Nibras Sharia Professional Certification",
    examBtn: "Start Certification Exam",
    listeningMufti: "Mufti AI is consulting Islamic jurisprudence...",
    speakBtn: "Listen",
    copyBtn: "Copy",
    muftiGreeting: "As-salamu alaykum! I am Mufti AI, your Sharia-compliant fintech & jurisprudence advisor. Ask any question regarding Halal savings, Zakat, Riba, or Mudarabah.",
    kidsHeroTitle: "Ahmed & Fatima's Noor Zone",
    kidsHeroSub: "Play interactive challenges, discover Halal wealth habits, earn Noor Coins, and reach your dream goals!",
    game1Title: "Needs vs. Wants",
    game1Desc: "Distinguish essential life needs from temporary desires and earn +20 coins!",
    game2Title: "Riba (Interest) Detector",
    game2Desc: "Audit contracts to spot fixed guaranteed usury versus halal risk-sharing partnerships.",
    game3Title: "Zakat Quick Math",
    game3Desc: "Calculate the exact 2.5% Sharia obligation in seconds and master mental math!",
    game4Title: "Halal Merchant Trader",
    game4Desc: "Practice honest pricing, defect disclosure, and customer satisfaction for Barakah.",
    playChallenge: "Play Challenge",
    receiptTitle: "Official Sharia Zakat Receipt",
    receiptSub: "Digitally Audited & Disbursed",
    receiptNum: "Receipt Number",
    receiptCharity: "Beneficiary NGO",
    receiptDate: "Payment Date",
    receiptAmount: "Disbursed Amount",
    officialSealed: "100% Sharia Verified Disbursal",
    prayerTimesTitle: "Daily Prayer Times (اوقات الصلاۃ)",
    prayerTimesSubtitle: "Live Sharia prayer timetable & Islamic lifestyle schedule",
    nextPrayerLabel: "Next Prayer",
    inCountdown: "in",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    locateMe: "Locate Me (GPS)",
    selectCity: "Select City",
    schoolHanafi: "Hanafi (حنیفی)",
    schoolShafii: "Standard / Shafi'i (شافعی)",
    qiblaBearing: "Qibla Direction",
    playAdhanTone: "Adhan Chime",
    activeNow: "Active",
    dailyStreakTitle: "Daily Istiqamah Streak & Noor Rewards",
    dailyStreakSubtitle: "Log in every day, build consistent Islamic habits, and earn increasing bonus Noor Coins!",
    currentStreak: "Daily Learning Streak",
    streakDayBadge: "Days in a row",
    claimDailyReward: "Claim Today's Noor Blessing",
    rewardClaimedToday: "Today's Reward Claimed ✓",
    nextRewardIn: "Next Reward Available In",
    simulateNextDay: "Simulate Next Day (Demo)",
    resetStreak: "Reset Streak",
    dayLabel: "Day",
    streakBonusTitle: "Istiqamah Consistency Multiplier",
    streakBonusSubtitle: "Consistent daily engagement boosts challenge coins by up to +50%!",
    dailyQuestsTitle: "Daily Educational Engagement Quests",
    dailyQuestsSubtitle: "Complete daily learning habits to unlock extra Noor Coins and Barakah badges",
    questReadHadith: "Daily Financial Wisdom",
    questReadHadithDesc: "Read today's Prophet's guideline on honesty, simplicity, and spending with moderation.",
    questPlayChallenge: "Complete a Halal Challenge",
    questPlayChallengeDesc: "Test your skills in Needs vs Wants, Riba Detector, or Halal Merchant.",
    questGoodDeed: "Log a Daily Act of Sadaqah",
    questGoodDeedDesc: "Share a kind word, help around the house, or make a sincere du'a.",
    questGoalSave: "Review Savings Goal Progress",
    questGoalSaveDesc: "Check milestones for Ahmed's Bicycle, Umrah Fund, or Eid Charity Jar.",
    completeQuest: "Complete Quest",
    questCompleted: "Done ✓",
    allQuestsBonus: "All Daily Quests Completed! Super Bonus:",
    claimAllQuestsBonus: "Claim Consistency Super Bonus (+50 🪙)",
    rewardVaultTitle: "Noor Rewards & Barakah Vault",
    rewardVaultSubtitle: "Redeem hard-earned Noor Coins for real savings boosts, virtual badges, and family milestones!",
    redeemGoalContrib: "Convert 100 Coins → Rs 500 Bicycle Goal Boost",
    redeemGoalSuccess: "Masha'Allah! Rs 500 contributed to your savings goal!",
    redeemBadge: "Junior Sharia Guardian Certificate Badge",
    redeemTree: "Plant a Virtual Sadaqah Jariyah Olive Tree",
    redeemBtn: "Redeem",
    hadithConsistency: "«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» 'The deeds most beloved to Allah are those done consistently, even if they are small.'",
    hadithConsistencyRef: "Sahih al-Bukhari: 6464",
    multiplierActive: "Active Multiplier",
    streakMilestone: "Next Milestone",
    streakShield: "Istiqamah Shield: Streak Protected",
    claimSuccessTitle: "Alhamdulillah! Daily Reward Claimed!",
    adminLockTitle: "Admin Guardian Authentication",
    adminLockDesc: "Enter the 4-digit Platform Guardian PIN to access system governance, user limits, and compliance ledgers.",
    enterPinLabel: "Security PIN",
    unlockAdminBtn: "Unlock Admin Console",
    invalidPinError: "Incorrect PIN. Please verify and try again.",
    lockAdminBtn: "Lock Admin",
    cancelBtn: "Cancel",
    childrenActivityTitle: "Children Activity Monitor",
    childrenActivityDesc: "Live feed of Ahmed and Fatima's Noor Zone learning, streaks, quests, and spending requests.",
    allChildren: "All Children",
    noActivityYet: "No recorded activity matches this filter.",
    kidPocketMoney: "My Pocket Money Wallet",
    kidHeroSub: "Earn Noor Coins through Halal games, keep your daily learning streak alive, and save for your goals.",
    saveFromPocketBtn: "Save Rs 250 from Pocket Money",
    requestFromParentsBtn: "Ask Parents (Ok Kro)",
    myGoals: "My Savings Goal",
    myRequests: "My Ok Kro Requests",
    teenAllowance: "Youth Halal Allowance",
    teenHeroSub: "Build independent Sharia financial skills, manage your allowance, and earn your AAOIFI Youth Certificate.",
    teenLearningProgress: "Sharia Academy & Certification",
    teacherConsoleTitle: "Instructor & Curriculum Console",
    teacherConsoleSub: "Monitor student streaks, oversee Sharia Finance Academy cohorts, and publish new modules.",
    publishCourseBtn: "Publish New Course",
    studentRosterTitle: "Student Engagement & Progress",
    courseCatalogTitle: "Published Sharia Curriculum",
    adminConsoleTitle: "Platform Guardian & Compliance Console",
    adminConsoleSub: "System-wide governance, family seat spending limits, Zakat NGO audits, and activity ledger.",
    spendingLimitsTitle: "Family Seat Spending Limits",
    exportAuditBtn: "Export Audit Report",
    ngoComplianceTitle: "Sharia NGO Compliance Audit",
    globalLedgerTitle: "Platform Activity & Governance Ledger",
    earnedBadgesTitle: "Earned Milestone Badges",
    earnedBadgesSub: "Unlocked achievements from Al Nibras Academy and Kids Noor Zone challenges.",
    academyBadgesTitle: "Academy Milestone Badges",
    noorBadgesTitle: "Noor Zone Milestone Badges",
    badgeUnlockedPrefix: "Badge Unlocked",
    badgeEarnedLabel: "Unlocked",
    badgeLockedLabel: "Locked",
    filterAllBadges: "All",
    filterEarnedBadges: "Earned",
    filterLockedBadges: "Locked",
    noBadgesEarnedYet: "No milestone badges unlocked yet. Start a course or Noor Zone challenge!",
    markCourseCompleteBtn: "Complete Course & Claim Badge",
    courseCompletedLabel: "Course Completed ✓",
  },
  ur: {
    appName: "النبراس",
    subTitle: "اسلامک فن ٹیک اور اکیڈمی",
    tagline: "وہ مال جو آپ کے دین کا تابع ہو۔ وہ علم جو آپ کی راہ روشن کرے۔",
    announcement: "✨ النبراس ایکو سسٹم: شریعت کے مطابق خاندانی مالیات اور تعلیمی انقلاب",
    navHome: "ڈیش بورڈ",
    navOkKro: "اوکے کرو (منظوری)",
    navZakat: "زکوٰۃ ہب",
    navLearn: "النبراس اکیڈمی",
    navKids: "نور زون (بچے)",
    navAiTutor: "مفتی اے آئی سے پوچھیں",
    roleParent: "والد (عمران قریشی)",
    roleKid: "بچہ (احمد - 9 سال)",
    roleTeen: "بیٹی (فاطمہ - 13 سال)",
    roleTeacher: "استاد (استاد بلال)",
    roleAdmin: "ایڈمن گارڈین",
    activeSeat: "فعال خاندانی نشست",
    welcomeSalam: "السلام علیکم",
    heroSubtext: "خاندانی اثاثہ جات کا انتظام کریں، بچوں کے اخراجات کی شرعی منظوری (اوکے کرو) دیں، اور اسلامی سرمایہ کاری کی مہارتیں حاصل کریں۔",
    walletBalance: "کل خاندانی اثاثے",
    pkr: "روپے",
    approved: "منظور شدہ",
    pending: "منظوری کا منتظر",
    rejected: "مسترد شدہ",
    approveBtn: "اوکے کرو (منظور)",
    rejectBtn: "رد کریں",
    noorCoins: "نور کوائنز",
    streak: "سلسلہ کے دن",
    level: "سطح",
    calculateZakat: "زکوٰۃ کا حساب لگائیں (2.5%)",
    zakatPayNow: "زکوٰۃ ادا کریں",
    nisabStatus: "نصاب کی جانچ",
    silverNisab: "چاندی کا نصاب (595 گرام): 184,450 روپے",
    goldNisab: "سونے کا نصاب (87.48 گرام): 2,140,000 روپے",
    quizTitle: "اسلامی فنانس کوئز",
    startQuiz: "سرٹیفکیٹ کوئز شروع کریں",
    certificateTitle: "شرعی فنانس سند",
    verifiedStamp: "شرعی تصدیق شدہ مہر",
    askAiPlaceholder: "حلال بچت، زکوٰۃ، سود، مضاربہ یا اسٹاکس کے متعلق سوال پوچھیں...",
    askAiBtn: "مفتی اے آئی سے مشورہ لیں",
    themeToggle: "تھیم موڈ تبدیل کریں",
    langName: "اردو (نستعلیق)",
    mudarabahReturns: "مضاربہ منافع +14.2% سالانہ",
    halalCertified: "100% شرعی تصدیق شدہ",
    familyGoals: "خاندانی بچت کے اہداف",
    recentApprovals: "اوکے کرو (والدین کی منظوری کی درخواستیں)",
    viewAll: "سب دیکھیں",
    newRequest: "نئی درخواست شامل کریں",
    submitRequest: "والدین کو درخواست بھیجیں",
    cashLabel: "نقد رقم اور بینک اکاؤنٹس (PKR)",
    goldLabel: "سونا (گرام)",
    silverLabel: "چاندی (گرام)",
    businessGoodsLabel: "مالِ تجارت اور قابل فروخت انوینٹری",
    debtsLabel: "فوری واجب الادا قرضے (منفی کریں)",
    totalZakatable: "کل قابلِ زکوٰۃ خالص اثاثے",
    payableZakat: "واجب الادا زکوٰۃ (2.5%)",
    selectCharity: "مصدقہ خیراتی ادارہ منتخب کریں",
    verifiedCharityBadge: "100% شرعی آڈٹ شدہ ادارہ",
    printCertificate: "پرنٹ / پی ڈی ایف محفوظ کریں",
    close: "بند کریں",
    soundToggle: "آواز آن/آف کریں",
    hadithTitle: "حلال معیشت کا سنہری اصول",
    hadithText: "«التَّاجِرُ الصَّدُوقُ الأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ» سچا اور امانت دار تاجر (قیامت کے دن) انبیاء، صدیقین اور شہداء کے ساتھ ہوگا۔",
    hadithRef: "جامع ترمذی: 1209",
    assetAllocation: "خاندانی اثاثوں کی شرعی تقسیم",
    allocationCash: "اسلامی بچت و نقد (45%)",
    allocationMudarabah: "حلال اسٹاکس و مضاربہ (35%)",
    allocationGold: "سونا و قیمتی دھاتیں (15%)",
    allocationZakat: "خیرات و زکوٰۃ فنڈ (5%)",
    addFundsTitle: "خاندانی اکاؤنٹ میں رقم جمع کریں",
    addFundsBtn: "رقم شامل کریں",
    contributeGoalBtn: "Rs 1,000 جمع کریں",
    completed: "مکمل",
    noPendingText: "ماشاء اللہ! کوئی زیرِ التواء درخواست نہیں ہے۔",
    allDoneText: "تمام بچوں کے مطالبات پر کارروائی ہو چکی ہے۔",
    examIntro: "النبراس شریعہ فنانس پروفیشنل سرٹیفکیٹ",
    examBtn: "امتحان شروع کریں",
    listeningMufti: "مفتی اے آئی شرعی مراجع کا جائزہ لے رہا ہے...",
    speakBtn: "سنیں",
    copyBtn: "کاپی",
    muftiGreeting: "السلام علیکم ورحمۃ اللہ وبرکاتہ! میں النبراس کا مفتی اے آئی ہوں۔ حلال بچت، مضاربہ، زکوٰۃ، سود کی ممانعت، یا اسلامی بینکنگ کے متعلق کسی بھی شرعی معاملے پر سوال فرمائیں۔",
    kidsHeroTitle: "احمد اور فاطمہ کا نور کوائنز زون",
    kidsHeroSub: "دلچسپ چیلنجز کھیلیں، شرعی مالیات کی سمجھ بوجھ حاصل کریں، اور نور کوائنز کما کر اپنے خوابوں کے اہداف مکمل کریں!",
    game1Title: "ضروریات بمقابلہ خواہشات",
    game1Desc: "بنیادی انسانی ضرورت اور وقتی خواہش کا فرق پہچانیں اور +20 نور کوائنز جیتیں!",
    game2Title: "سود (ربوا) ڈیٹیکٹر",
    game2Desc: "کاروباری معاہدوں کو چیک کریں اور معلوم کریں کہ اس میں سود کی آمیزش ہے یا یہ حلال شراکت ہے۔",
    game3Title: "زکوٰۃ کوئیک میتھ",
    game3Desc: "تیزی سے 2.5٪ کا شرعی حساب لگائیں اور غریبوں کے حق کی فوری پیمائش کریں!",
    game4Title: "حلال تاجر سمیلیٹر",
    game4Desc: "دیانتداری سے خرید و فروخت کریں، برکت کمائیں اور عیب چھپائے بغیر تجارت کریں۔",
    playChallenge: "چیلنج کھیلیں",
    receiptTitle: "زکوٰۃ کی باضابطہ شرعی رسید",
    receiptSub: "100% شرعی آڈٹ شدہ ادائیگی",
    receiptNum: "رسید نمبر",
    receiptCharity: "خیراتی ادارہ",
    receiptDate: "تاریخِ ادائیگی",
    receiptAmount: "ادا شدہ رقم",
    officialSealed: "تصدیق شدہ و منتقلہ",
    prayerTimesTitle: "اوقات الصلاۃ (نماز کے اوقات)",
    prayerTimesSubtitle: "لائیو شرعی شیڈول اور روزانہ اسلامی طرزِ زندگی",
    nextPrayerLabel: "اگلی نماز",
    inCountdown: "بعد از",
    fajr: "فجر",
    sunrise: "طلوعِ آفتاب",
    dhuhr: "ظہر",
    asr: "عصر",
    maghrib: "مغرب",
    isha: "عشاء",
    locateMe: "موجودہ مقام (GPS)",
    selectCity: "شہر منتخب کریں",
    schoolHanafi: "حنفی طریقہ",
    schoolShafii: "شافعی / جمہور",
    qiblaBearing: "سمتِ قبلہ",
    playAdhanTone: "آذان کی دھن",
    activeNow: "جاری ہے",
    dailyStreakTitle: "روزانہ استقامت اسٹریک اور نور انعامات",
    dailyStreakSubtitle: "روزانہ لاگ ان کریں، مستقل مزاجی سے اسلامی معاشی عادات اپنائیں، اور روز بروز زیادہ نور کوائنز پائیں!",
    currentStreak: "روزانہ تعلیمی سلسلہ (اسٹریک)",
    streakDayBadge: "مسلسل دن",
    claimDailyReward: "آج کا نور انعام وصول کریں",
    rewardClaimedToday: "آج کا انعام وصول ہو چکا ہے ✓",
    nextRewardIn: "اگلا انعام انلاک ہونے میں باقی",
    simulateNextDay: "اگلا دن ٹیسٹ کریں (ڈیمو)",
    resetStreak: "اسٹریک ری سیٹ کریں",
    dayLabel: "دن",
    streakBonusTitle: "استقامت و تسلسل ملٹی پلائر",
    streakBonusSubtitle: "مسلسل روزانہ تعلیمی سرگرمی سے ہر چیلنج میں 50٪ تک اضافی نور کوائنز حاصل ہوں گے!",
    dailyQuestsTitle: "روزانہ کے تعلیمی و تربیتی اہداف (کویسٹس)",
    dailyQuestsSubtitle: "روزانہ کی چھوٹی چھوٹی اسلامی عادات مکمل کریں اور اضافی نور کوائنز کمائیں",
    questReadHadith: "آج کی نبوی مالی نصیحت",
    questReadHadithDesc: "دیانتداری، فضول خرچی سے بچاؤ اور حلال روزی کے متعلق آج کی حدیث مبارکہ پڑھیں۔",
    questPlayChallenge: "کوئی ایک حلال چیلنج کھیلیں",
    questPlayChallengeDesc: "ضروریات بمقابلہ خواہشات، سود ڈیٹیکٹر، یا حلال تاجر سمیلیٹر مکمل کریں۔",
    questGoodDeed: "روزانہ صدقہ و نیکی کا اندراج",
    questGoodDeedDesc: "مسکراہٹ، گھر میں والدین کی مدد، یا صدقہ کے خانے میں نیکی کا حصہ ڈالیں۔",
    questGoalSave: "بچت کے ہدف کا جائزہ لیں",
    questGoalSaveDesc: "احمد کی سائیکل، عمرہ فنڈ، یا عید فنڈ کے لیے اپنی پیش رفت دیکھیں۔",
    completeQuest: "ہدف مکمل کریں",
    questCompleted: "مکمل شدہ ✓",
    allQuestsBonus: "ماشاء اللہ! تمام اہداف مکمل! خصوصی استقامت بونس:",
    claimAllQuestsBonus: "خصوصی استقامت بونس وصول کریں (+50 🪙)",
    rewardVaultTitle: "نور ریوارڈز اور برکت والٹ",
    rewardVaultSubtitle: "اپنے کمائے ہوئے نور کوائنز کو اصل بچت کے ہدف میں رقم، سرٹیفکیٹ بیجز اور ورچوئل صدقات میں تبدیل کریں!",
    redeemGoalContrib: "100 کوائنز تبدیل کریں → Rs 500 سائیکل فنڈ میں جمع",
    redeemGoalSuccess: "ماشاء اللہ! 500 روپے آپ کے بچت کے ہدف میں کامیابی سے شامل ہو گئے!",
    redeemBadge: "جونیئر شریعہ گارڈین سند اور بیج",
    redeemTree: "ورچوئل صدقہ جاریہ (زیتون کا پودا لگائیں)",
    redeemBtn: "حاصل کریں",
    hadithConsistency: "«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» 'اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو پابندی اور تسلسل کے ساتھ کیا جائے، اگرچہ تھوڑا ہی ہو۔'",
    hadithConsistencyRef: "صحیح بخاری: 6464",
    multiplierActive: "فعال ملٹی پلائر",
    streakMilestone: "اگلا ہدف و درجہ",
    streakShield: "استقامت شیلڈ: آپ کی اسٹریک محفوظ ہے",
    claimSuccessTitle: "الحمد للہ! آج کا استقامت انعام مل گیا!",
    adminLockTitle: "ایڈمن گارڈین سیکیورٹی لاک",
    adminLockDesc: "سسٹم گورننس، صارفین کی حدود اور شریعہ آڈٹ لیجر تک رسائی کے لیے 4 ہندسوں کا ایڈمن پاسورڈ درج کریں۔",
    enterPinLabel: "سیکیورٹی پن کوڈ",
    unlockAdminBtn: "ایڈمن ڈیش بورڈ کھولیں",
    invalidPinError: "غلط پاسورڈ! برائے مہربانی درست پن کوڈ درج کریں۔",
    lockAdminBtn: "ایڈمن لاک کریں",
    cancelBtn: "منسوخ کریں",
    childrenActivityTitle: "بچوں کی سرگرمیوں کی لائیو نگرانی",
    childrenActivityDesc: "احمد اور فاطمہ کی نور زون گیمز، اسٹریک، تعلیمی کویسٹس اور اخراجات کی درخواستوں کا مکمل ریکارڈ۔",
    allChildren: "تمام بچے",
    noActivityYet: "اس فلٹر کے تحت کوئی سرگرمی موجود نہیں ہے۔",
    kidPocketMoney: "میرا ذاتی پاکٹ منی والٹ",
    kidHeroSub: "حلال گیمز کھیل کر نور کوائنز کماؤ، روزانہ اسٹریک برقرار رکھو، اور اپنے ہدف کے لیے بچت کرو۔",
    saveFromPocketBtn: "پاکٹ منی سے Rs 250 بچائیں",
    requestFromParentsBtn: "والدین سے اجازت لیں (اوکے کرو)",
    myGoals: "میرا بچت کا ہدف",
    myRequests: "میری اوکے کرو درخواستیں",
    teenAllowance: "نوجوان حلال الاؤنس والٹ",
    teenHeroSub: "آزادانہ شرعی مالی مہارتیں سیکھیں، اپنا الاؤنس سنبھالیں، اور شریعہ فنانس سرٹیفکیٹ حاصل کریں۔",
    teenLearningProgress: "شریعہ اکیڈمی اور سرٹیفکیٹ",
    teacherConsoleTitle: "استاد اور نصاب مینجمنٹ کنسول",
    teacherConsoleSub: "طلباء کی روزانہ حاضری و اسٹریک دیکھیں، اکیڈمی کے کورسز کی نگرانی کریں اور نئے اسباق شائع کریں۔",
    publishCourseBtn: "نیا کورس شائع کریں",
    studentRosterTitle: "طلباء کی تعلیمی کارکردگی",
    courseCatalogTitle: "شائع شدہ شرعی نصاب",
    adminConsoleTitle: "پلیٹ فارم گارڈین اور شریعہ آڈٹ کنسول",
    adminConsoleSub: "سسٹم بھر کی نگرانی، بچوں کے اخراجات کی حدود، زکوٰۃ اداروں کا آڈٹ اور مکمل سرگرمی لیجر۔",
    spendingLimitsTitle: "بچوں کے اخراجات کی ماہانہ حد",
    exportAuditBtn: "آڈٹ رپورٹ ڈاؤن لوڈ کریں",
    ngoComplianceTitle: "زکوٰۃ اداروں کا شرعی آڈٹ",
    globalLedgerTitle: "پلیٹ فارم سرگرمی اور گورننس لیجر",
    earnedBadgesTitle: "حاصل کردہ مائل اسٹون بیجز",
    earnedBadgesSub: "النبراس اکیڈمی اور بچوں کے نور زون چیلنجز مکمل کرنے پر ملنے والے اعزازات۔",
    academyBadgesTitle: "اکیڈمی مائل اسٹون بیجز",
    noorBadgesTitle: "نور زون مائل اسٹون بیجز",
    badgeUnlockedPrefix: "نیا بیج انلاک ہو گیا",
    badgeEarnedLabel: "حاصل شدہ",
    badgeLockedLabel: "انلاک باقی",
    filterAllBadges: "سب",
    filterEarnedBadges: "حاصل شدہ",
    filterLockedBadges: "باقی",
    noBadgesEarnedYet: "ابھی کوئی بیج حاصل نہیں ہوا۔ اکیڈمی یا نور زون چیلنج مکمل کریں!",
    markCourseCompleteBtn: "کورس مکمل کریں اور بیج حاصل کریں",
    courseCompletedLabel: "کورس مکمل ہو گیا ✓",
  },
  ps: {
    appName: "النبراس",
    subTitle: "اسلامي فن ټیک او اکاډمي",
    tagline: "هغه شتمني چې ستاسو د دین پابنده وي. هغه علم چې لاره روښانه کوي.",
    announcement: "✨ النبراس پلیټفارم: د شرعي اصولو سره سم کورنی مالي او تعلیمي سیسټم",
    navHome: "ډیش بورډ",
    navOkKro: "اوکې کړه (تائید)",
    navZakat: "د زکات مرکز",
    navLearn: "النبراس اکاډمي",
    navKids: "د ماشومانو نور زون",
    navAiTutor: "له مفتي AI تپوس وکړئ",
    roleParent: "پلار (عمران قریشي)",
    roleKid: "ماشوم (احمد - 9 کلن)",
    roleTeen: "پېغله (فاطمه - 13 کلنه)",
    roleTeacher: "استاد (استاد بلال)",
    roleAdmin: "ایډمن ګارډین",
    activeSeat: "د کورنۍ برخه",
    welcomeSalam: "سلامونه او نېکې هیلې",
    heroSubtext: "خپله کورنۍ شتمني د اسلامي شریعت مطابق وساتئ، د ماشومانو د لګښتونو څارنه وکړئ او حلال تجارت زده کړئ.",
    walletBalance: "ټوله کورنۍ شتمني",
    pkr: "روپۍ",
    approved: "تائید شوی",
    pending: "د تائید په تمه",
    rejected: "رد شوی",
    approveBtn: "اوکې کړه (تائید)",
    rejectBtn: "رد کړه",
    noorCoins: "نور کوینونه",
    streak: "د بریا لړۍ",
    level: "کچه",
    calculateZakat: "د زکات حساب (2.5%)",
    zakatPayNow: "زکات ورکړئ",
    nisabStatus: "د نصاب کچه",
    silverNisab: "د سپینو زرو نصاب: 184,450 روپۍ",
    goldNisab: "د سرو زرو نصاب: 2,140,000 روپۍ",
    quizTitle: "د اسلامي مالي ازموینه",
    startQuiz: "ازموینه پیل کړئ",
    certificateTitle: "شرعي مالي سند",
    verifiedStamp: "شرعي تصدیق شوې ټاپه",
    askAiPlaceholder: "د حلالې سپما، زکات، سود يا مضاربت په اړه پوښتنه وکړئ...",
    askAiBtn: "له مفتي AI مشوره واخلئ",
    themeToggle: "بڼه بدله کړئ",
    langName: "پښتو",
    mudarabahReturns: "د مضاربت ګټه +14.2% کلنۍ",
    halalCertified: "100% شرعي تائید شوی",
    familyGoals: "د کورنۍ مالي موخې",
    recentApprovals: "اوکې کړه (د والدینو د تائید غوښتنې)",
    viewAll: "ټول وګورئ",
    newRequest: "نوې غوښتنه",
    submitRequest: "والدینو ته غوښتنه ولېږئ",
    cashLabel: "نغدې پیسې او بانکي حسابونه (روپۍ)",
    goldLabel: "سره زر (ګرام)",
    silverLabel: "سپین زر (ګرام)",
    businessGoodsLabel: "د تجارت توکي او مال",
    debtsLabel: "واجب الادا پورونه",
    totalZakatable: "ټوله د زکات وړ شتمني",
    payableZakat: "د ورکړې وړ زکات (2.5%)",
    selectCharity: "خیریه اداره وټاکئ",
    verifiedCharityBadge: "100% شرعي تصدیق شوې",
    printCertificate: "چاپ / PDF خوندي کړئ",
    close: "بندول",
    soundToggle: "غږ فعال / غیرفعال",
    hadithTitle: "د حلال تجارت لارښوونه",
    hadithText: "رښتینی او امین تاجر به د قیامت په ورځ له پیغمبرانو، صدیقینو او شهيدانو سره وي.",
    hadithRef: "ترمذي: 1209",
    assetAllocation: "د کورنیو شتمنیو شرعي وېش",
    allocationCash: "اسلامي سپما او نغدې (45%)",
    allocationMudarabah: "حلال اسهام او مضاربت (35%)",
    allocationGold: "سره زر او فلزات (15%)",
    allocationZakat: "خیرات او د زکات حصه (5%)",
    addFundsTitle: "په حساب کې پیسې جمع کړئ",
    addFundsBtn: "پیسې ورزیاتې کړئ",
    contributeGoalBtn: "1,000 روپۍ جمع کړئ",
    completed: "بشپړ شوی",
    noPendingText: "الحمد لله! هیڅ پاتې غوښتنه نشته.",
    allDoneText: "ټولې مالي غوښتنې وکتل شوې.",
    examIntro: "د النبراس شرعي مالي مسلکي سند",
    examBtn: "امتحان پیل کړئ",
    listeningMufti: "مفتي AI د شرعي مراجعو ارزونه کوي...",
    speakBtn: "واورئ",
    copyBtn: "کاپي",
    muftiGreeting: "سلامونه او نېکې هیلې! زه د النبراس مفتي AI یم. د حلالې سپما، زکات، سود یا اسلامي بانکوالۍ په اړه پوښتنه کولی شئ.",
    kidsHeroTitle: "د احمد او فاطمې نور زون",
    kidsHeroSub: "لوبې وکړئ، د حلال تجارت اصول زده کړئ، او د خپلو موخو لپاره نور کوینونه وګټئ!",
    game1Title: "اړتیاوې او هیلې",
    game1Desc: "د اصلي اړتیا او اضافي هیلې توپیر وپېژنئ او +20 کوینونه وګټئ!",
    game2Title: "د سود (ربوا) معلومول",
    game2Desc: "معاملات وڅارئ او د سود او حلال مضاربت فرق وپېژنئ.",
    game3Title: "د زکات چټک حساب",
    game3Desc: "په څو ثانیو کې د ۲.۵ سلنې زکات دقیق حساب وباسئ!",
    game4Title: "حلال سوداګر",
    game4Desc: "په امانتدارۍ سودا وکړئ او د برکت اصول عملي کړئ.",
    playChallenge: "لوبه پیل کړئ",
    receiptTitle: "د زکات رسمي شرعي رسید",
    receiptSub: "100% شرعي تائید شوې تادیه",
    receiptNum: "د رسید شمېره",
    receiptCharity: "خیریه بنسټ",
    receiptDate: "د تادیې نېټه",
    receiptAmount: "ورکړل شوی زکات",
    officialSealed: "تائید شوی او انتقال شوی",
    prayerTimesTitle: "د لمانځه وختونه (اوقات الصلاۃ)",
    prayerTimesSubtitle: "د شرعي مهالوېش سره سم د لمانځه ژوندي وختونه",
    nextPrayerLabel: "راتلونکی لمونځ",
    inCountdown: "پاتې وخت",
    fajr: "فجر (سهر)",
    sunrise: "لمر خاته",
    dhuhr: "ماسپښین",
    asr: "مازدیګر",
    maghrib: "ماښام",
    isha: "ماسخوتن",
    locateMe: "اوسنی ځای (GPS)",
    selectCity: "ښار وټاکئ",
    schoolHanafi: "حنفي مذهب",
    schoolShafii: "شافعي مذهب",
    qiblaBearing: "د قبلې لوری",
    playAdhanTone: "د اذان غږ",
    activeNow: "اوسنی وخت",
    dailyStreakTitle: "د استقامت ورځنۍ لړۍ او نور انعامونه",
    dailyStreakSubtitle: "هره ورځ داخل شئ، اسلامي مالي عادتونه زده کړئ، او ډېر نور کوینونه ترلاسه کړئ!",
    currentStreak: "ورځنۍ تعلیمي لړۍ (اسټریک)",
    streakDayBadge: "پرله پسې ورځې",
    claimDailyReward: "د نن ورځې نور انعام ترلاسه کړئ",
    rewardClaimedToday: "د نن انعام ترلاسه شو ✓",
    nextRewardIn: "بل انعام ته پاتې وخت",
    simulateNextDay: "بله ورځ ازمویل (ډیمو)",
    resetStreak: "لړۍ له سره پیل کړئ",
    dayLabel: "ورځ",
    streakBonusTitle: "د استقامت اضافي بونس",
    streakBonusSubtitle: "په دوامداره توګه د زده کړې له امله تر ۵۰٪ پورې ډېر کوینونه ترلاسه کړئ!",
    dailyQuestsTitle: "ورځني تعلیمي او روزنیز اهداف",
    dailyQuestsSubtitle: "ورځني نېک عادتونه عملي کړئ او اضافي نور کوینونه وګټئ",
    questReadHadith: "د نن ورځې نبوي لارښوونه",
    questReadHadithDesc: "د رښتینولۍ او حلال رزق په اړه د رسول الله ﷺ لارښوونه ولولئ.",
    questPlayChallenge: "یوه حلاله لوبه بشپړه کړئ",
    questPlayChallengeDesc: "د اړتیاوو او هيلو، یا د سود معلومولو چیلنج سرته ورسوئ.",
    questGoodDeed: "د صدقې او ښېګڼې نیت ثبت کړئ",
    questGoodDeedDesc: "د کورنۍ مرسته وکړئ یا د خیرات په بکس کې برخه واخلئ.",
    questGoalSave: "د سپما هدف وڅارئ",
    questGoalSaveDesc: "د احمد د بایسکل یا عمرې فنډ پرمختګ وګورئ.",
    completeQuest: "هدف پوره کړئ",
    questCompleted: "بشپړ شو ✓",
    allQuestsBonus: "ماشاء الله ټول اهداف بشپړ شول! ځانګړی بونس:",
    claimAllQuestsBonus: "ځانګړی استقامت بونس واخلئ (+50 🪙)",
    rewardVaultTitle: "د نور کوینونو د انعامونو خزانه",
    rewardVaultSubtitle: "خپل کوینونه په ریښتینې سپما، ویاړونو او صدقه جاریه بدل کړئ!",
    redeemGoalContrib: "100 کوینونه بدل کړئ → 500 روپۍ د بایسکل فنډ ته",
    redeemGoalSuccess: "ماشاء الله! 500 روپۍ ستاسو مالي موخې ته اضافه شوې!",
    redeemBadge: "د کوچني شرعي ساتونکي نښان",
    redeemTree: "د زیتون مجازی ونې کښېنول (صدقه جاریه)",
    redeemBtn: "تبدیل کړئ",
    hadithConsistency: "«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» 'الله ته تر ټولو غوره عمل هغه دی چې تلپاتې وي که څه هم لږ وي.'",
    hadithConsistencyRef: "صحیح بخاري: 6464",
    multiplierActive: "فعال بونس",
    streakMilestone: "راتلونکی پړاو",
    streakShield: "د استقامت ډال: ستاسو لړۍ خوندي ده",
    claimSuccessTitle: "الحمد لله! د نن ورځې انعام ترلاسه شو!",
    adminLockTitle: "د ایډمن ګارډین امنیتي قلف",
    adminLockDesc: "د سیسټم مدیریت، د لګښت حدودو او شرعي راپورونو لیدلو لپاره ۴ عددي پټ کوډ دننه کړئ.",
    enterPinLabel: "امنیتي کوډ",
    unlockAdminBtn: "ایډمن ډیش بورډ خلاص کړئ",
    invalidPinError: "غلط کوډ! مهرباني وکړئ سم پټ کوډ ولیکئ.",
    lockAdminBtn: "ایډمن قلف کړئ",
    cancelBtn: "لغوه کول",
    childrenActivityTitle: "د ماشومانو د فعالیتونو ژوندی ریکارډ",
    childrenActivityDesc: "د احمد او فاطمې د نور زون لوبې، اسټریک، ورځني اهداف او د لګښت غوښتنې دلته وڅارئ.",
    allChildren: "ټول ماشومان",
    noActivityYet: "تر اوسه هیڅ فعالیت نشته.",
    kidPocketMoney: "زما خپل جېب خرڅ",
    kidHeroSub: "حلالې لوبې وکړئ، نور کوینونه وګټئ، خپل ورځنی اسټریک وساتئ او د بایسکل لپاره سپما وکړئ.",
    saveFromPocketBtn: "له جېب خرڅ څخه ۲۵۰ روپۍ وسپموئ",
    requestFromParentsBtn: "له والدینو اجازه وغواړئ",
    myGoals: "زما د سپما موخه",
    myRequests: "زما د اوکې کړه غوښتنې",
    teenAllowance: "د ځوانانو حلال الاؤنس",
    teenHeroSub: "خپلواکه شرعي مالي پوهه زده کړئ، الاؤنس اداره کړئ او شرعي مالي سند ترلاسه کړئ.",
    teenLearningProgress: "شریعت اکاډمي او تصدیق پاڼه",
    teacherConsoleTitle: "د استاد او نصاب مدیریت کنسول",
    teacherConsoleSub: "د زده کوونکو ورځنی اسټریک وګورئ، کورسونه وڅارئ او نوي درسونه خپاره کړئ.",
    publishCourseBtn: "نوی کورس خپور کړئ",
    studentRosterTitle: "د زده کوونکو تعلیمي پرمختګ",
    courseCatalogTitle: "خپور شوی شرعي نصاب",
    adminConsoleTitle: "د پلیټفارم ګارډین او شرعي تفتیش کنسول",
    adminConsoleSub: "د ټول سیسټم څارنه، د لګښت حدود، د خیریه ادارو تفتیش او د فعالیتونو راپور.",
    spendingLimitsTitle: "د ماشومانو د لګښت حدود",
    exportAuditBtn: "راپور ډاونلوډ کړئ",
    ngoComplianceTitle: "د خیریه ادارو شرعي تفتیش",
    globalLedgerTitle: "د پلیټفارم عمومي فعالیت ریکارډ",
    earnedBadgesTitle: "ترلاسه شوي مایل سټون نښانونه (بیجونه)",
    earnedBadgesSub: "د النبراس اکاډمۍ او ماشومانو نور زون چیلنجونو بشپړولو ویاړونه.",
    academyBadgesTitle: "د اکاډمۍ مایل سټون بیجونه",
    noorBadgesTitle: "د نور زون مایل سټون بیجونه",
    badgeUnlockedPrefix: "نوی بیج خلاص شو",
    badgeEarnedLabel: "ترلاسه شوی",
    badgeLockedLabel: "بند دی",
    filterAllBadges: "ټول",
    filterEarnedBadges: "ترلاسه شوي",
    filterLockedBadges: "پاتې",
    noBadgesEarnedYet: "تر اوسه کوم بیج نه دی ترلاسه شوی. کورس یا نور زون لوبه بشپړه کړئ!",
    markCourseCompleteBtn: "کورس بشپړ کړئ او بیج واخلئ",
    courseCompletedLabel: "کورس بشپړ شو ✓",
  },
  ar: {
    appName: "النبراس",
    subTitle: "الفينتك والأكاديمية الإسلامية",
    tagline: "مالٌ يُطيعُ دِينَك.. وعِلمٌ يُنيرُ دَربَك.",
    announcement: "✨ منصة النبراس: النظام البيئي المتكامل للتمويل الإسلامي والتعليم الرقمي",
    navHome: "لوحة التحكم",
    navOkKro: "موافقات (أوكي كرو)",
    navZakat: "مركز الزكاة",
    navLearn: "أكاديمية النبراس",
    navKids: "منطقة نور للأطفال",
    navAiTutor: "استشر المفتي الذكي",
    roleParent: "الأب (عمران قريشي)",
    roleKid: "الطفل (أحمد - 9 سنوات)",
    roleTeen: "الفتاة (فاطمة - 13 سنة)",
    roleTeacher: "المعلم (أستاذ بلال)",
    roleAdmin: "مدير المنصة",
    activeSeat: "الحساب العائلي النشط",
    welcomeSalam: "السلام عليكم ورحمة الله",
    heroSubtext: "أدر ثروة العائلة وفق الضوابط الشرعية، وامنح موافقات الإنفاق للأبناء، وتعلّم أصول الاستثمار الحلال.",
    walletBalance: "إجمالي أصول العائلة",
    pkr: "روبية",
    approved: "تمت الموافقة",
    pending: "قيد الانتظار",
    rejected: "مرفوض",
    approveBtn: "موافقة (أوكي كرو)",
    rejectBtn: "رفض",
    noorCoins: "عملات نور",
    streak: "أيام التتابع",
    level: "المستوى",
    calculateZakat: "حساب الزكاة (2.5%)",
    zakatPayNow: "إخراج الزكاة الآن",
    nisabStatus: "مراجعة حد النصاب",
    silverNisab: "نصاب الفضة (595غ): 184,450 روبية",
    goldNisab: "نصاب الذهب (87.48غ): 2,140,000 روبية",
    quizTitle: "تحدي المالية الإسلامية",
    startQuiz: "ابدأ اختبار الشهادة",
    certificateTitle: "شهادة المالية الإسلامية",
    verifiedStamp: "خاتم الاعتماد الشرعي",
    askAiPlaceholder: "اسأل عن الادخار الحلال، الزكاة، الربا، أو المضاربة...",
    askAiBtn: "استشر المفتي الذكي",
    themeToggle: "تبديل المظهر",
    langName: "العربية",
    mudarabahReturns: "عوائد المضاربة +14.2% سنوياً",
    halalCertified: "100% معتمد شرعياً",
    familyGoals: "أهداف الادخار العائلي",
    recentApprovals: "موافقات أولياء الأمور (أوكي كرو)",
    viewAll: "عرض الكل",
    newRequest: "طلب جديد",
    submitRequest: "إرسال الطلب للوالدين",
    cashLabel: "السيولة النقدية والحسابات البنكية (روبية)",
    goldLabel: "الذهب (جرام)",
    silverLabel: "الفضة (جرام)",
    businessGoodsLabel: "عروض التجارة والبضائع",
    debtsLabel: "الديون والالتزامات العاجلة (للخصم)",
    totalZakatable: "إجمالي الأموال الخاضعة للزكاة",
    payableZakat: "الزكاة الواجبة (2.5%)",
    selectCharity: "اختر الجمعية الخيرية المعتمدة",
    verifiedCharityBadge: "جهة خيرية مدققة شرعياً 100%",
    printCertificate: "طباعة / حفظ PDF",
    close: "إغلاق",
    soundToggle: "تشغيل / كتم الصوت",
    hadithTitle: "من هدي النبوة في التجارة",
    hadithText: "«التَّاجِرُ الصَّدُوقُ الأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ»",
    hadithRef: "جامع الترمذي: 1209",
    assetAllocation: "التوزيع الشرعي للأصول",
    allocationCash: "المدخرات النقدية الإسلامية (45%)",
    allocationMudarabah: "الأسهم وصناديق المضاربة الحلال (35%)",
    allocationGold: "الذهب والمعادن الثمينة (15%)",
    allocationZakat: "مخصصات الصدقات والوقف (5%)",
    addFundsTitle: "إيداع أموال في محفظة المضاربة",
    addFundsBtn: "إيداع الأموال",
    contributeGoalBtn: "إضافة 1,000 روبية",
    completed: "مكتمل",
    noPendingText: "ما شاء الله! لا توجد طلبات معلقة.",
    allDoneText: "تمت مراجعة جميع طلبات الأبناء.",
    examIntro: "شهادة النبراس المهنية للمالية الإسلامية",
    examBtn: "بدء اختبار الاعتماد",
    listeningMufti: "المفتي الذكي يراجع المصادر الفقهية المعتمدة...",
    speakBtn: "استمع",
    copyBtn: "نسخ",
    muftiGreeting: "السلام عليكم ورحمة الله وبركاته! أنا المفتي الذكي لمنصة النبراس. تفضل بطرح أي سؤال يتعلق بالفقه المالي، الزكاة، المرابحة أو الاستثمار الحلال.",
    kidsHeroTitle: "منطقة نور لأحمد وفاطمة",
    kidsHeroSub: "العب التحديات التفاعلية، وتعرّف على أصول الكسب الحلال، واجمع عملات نور لتحقيق أهدافك!",
    game1Title: "الحاجات مقابل الرغبات",
    game1Desc: "ميز بين الضروريات الحياتية والرغبات المؤقتة واكسب +20 عملة نور!",
    game2Title: "كاشف الربا والشبهات",
    game2Desc: "افحص العقود لتمييز الفائدة الثابتة المحرمة عن الشراكة الحلال القائمة على اقتسام الربح والخسارة.",
    game3Title: "حساب الزكاة السريع",
    game3Desc: "احسب نسبة الـ 2.5% الشرعية بدقة وسرعة فائقة!",
    game4Title: "التاجر الأمين",
    game4Desc: "مارس البيع والشراء بصدق وأمانة وبيان العيوب لنيل البركة.",
    playChallenge: "العب التحدي",
    receiptTitle: "سند استلام الزكاة الشرعي",
    receiptSub: "دفع معتمد ومدقق شرعياً",
    receiptNum: "رقم السند",
    receiptCharity: "الجهة المستفيدة",
    receiptDate: "تاريخ الدفع",
    receiptAmount: "المبلغ المدفوع",
    officialSealed: "معتمد ومنقول للمستحقين",
    prayerTimesTitle: "مواقيت الصلاة والأذكار",
    prayerTimesSubtitle: "جدول الصلاة الشرعي المباشر وفق الموقع الجغرافي",
    nextPrayerLabel: "الصلاة القادمة",
    inCountdown: "متبقي",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    locateMe: "موقعي الحالي (GPS)",
    selectCity: "تحديد المدينة",
    schoolHanafi: "المذهب الحنفي",
    schoolShafii: "الجمهور / الشافعي",
    qiblaBearing: "اتجاه القبلة",
    playAdhanTone: "نغمة الأذان",
    activeNow: "الحالية",
    dailyStreakTitle: "سلسلة الاستقامة اليومية ومكافآت نور",
    dailyStreakSubtitle: "سجّل دخولك يومياً، واكتسب العادات المالية الإسلامية المباركة، واجمع المزيد من عملات نور!",
    currentStreak: "سلسلة التعلّم اليومي (الاستقامة)",
    streakDayBadge: "أيام متتالية",
    claimDailyReward: "استلم بركة نور اليومية",
    rewardClaimedToday: "تم استلام مكافأة اليوم ✓",
    nextRewardIn: "المكافأة القادمة متاحة بعد",
    simulateNextDay: "محاكاة اليوم التالي (تجربة)",
    resetStreak: "إعادة ضبط السلسلة",
    dayLabel: "اليوم",
    streakBonusTitle: "مضاعف الاستقامة والمثابرة",
    streakBonusSubtitle: "المواظبة اليومية على التعلم تمنحك زيادة تصل إلى +50% على مكافآت التحديات!",
    dailyQuestsTitle: "مهام التعلم والتربية اليومية",
    dailyQuestsSubtitle: "أنجز العادات والمهام اليومية البسيطة لكسب المزيد من عملات نور والبركة",
    questReadHadith: "الحكمة المالية النبوية لليوم",
    questReadHadithDesc: "اقرأ هدي النبي ﷺ في الصدق، وحفظ النعمة، والاعتدال في الإنفاق.",
    questPlayChallenge: "أنجز أحد التحديات الحلال",
    questPlayChallengeDesc: "جرّب تحدي الحاجات والرغبات، أو كاشف الربا، أو التاجر الأمين.",
    questGoodDeed: "سجّل عملاً صالحاً أو صدقة",
    questGoodDeedDesc: "ابتسامة، أو مساعدة الوالدين، أو المساهمة في حصالة الصدقات.",
    questGoalSave: "تابع هدف الادخار العائلي",
    questGoalSaveDesc: "راجع مسار ادخار دراجة أحمد أو صندوق العمرة المباركة.",
    completeQuest: "إنجاز المهمة",
    questCompleted: "مكتملة ✓",
    allQuestsBonus: "ما شاء الله! اكتملت جميع المهام! المكافأة الكبرى:",
    claimAllQuestsBonus: "استلم مكافأة الاستقامة الكبرى (+50 🪙)",
    rewardVaultTitle: "خزينة مكافآت نور والبركة",
    rewardVaultSubtitle: "استبدل عملات نور المكتسبة بمساهمات حقيقية في أهدافك العائلية وشهادات وأوقاف!",
    redeemGoalContrib: "استبدال 100 عملة ← 500 روبية لدراجة أحمد",
    redeemGoalSuccess: "ما شاء الله! تمت إضافة 500 روبية لهدف الادخار بنجاح!",
    redeemBadge: "شارة الحارس الشرعي الصغير",
    redeemTree: "غرس شجرة زيتون صدقة جارية افتراضية",
    redeemBtn: "استبدال",
    hadithConsistency: "«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» 'أحب الأعمال إلى الله أدومها وإن قل.'",
    hadithConsistencyRef: "صحيح البخاري: 6464",
    multiplierActive: "المضاعف النشط",
    streakMilestone: "المرحلة القادمة",
    streakShield: "درع الاستقامة: السلسلة محمية",
    claimSuccessTitle: "الحمد لله! تم استلام مكافأة الاستقامة اليومية!",
    adminLockTitle: "قفل أمان مدير المنصة",
    adminLockDesc: "أدخل رمز المرور المكون من 4 أرقام للوصول إلى لوحة إدارة المنصة والرقابة الشرعية.",
    enterPinLabel: "الرمز السري",
    unlockAdminBtn: "فتح لوحة المدير",
    invalidPinError: "رمز غير صحيح. يرجى المحاولة مرة أخرى.",
    lockAdminBtn: "قفل الإدارة",
    cancelBtn: "إلغاء",
    childrenActivityTitle: "متابعة نشاط الأبناء المباشر",
    childrenActivityDesc: "سجل مباشر لتحديات منطقة نور، وسلسلة الاستقامة، والمهام اليومية، وطلبات الإنفاق لأحمد وفاطمة.",
    allChildren: "جميع الأبناء",
    noActivityYet: "لا توجد أنشطة مسجلة لهذا الفلتر.",
    kidPocketMoney: "محفظة مصروفي الشخصي",
    kidHeroSub: "العب التحديات الحلال، واجمع عملات نور، وحافظ على سلسلة التعلّم اليومي لتحقيق أهدافك.",
    saveFromPocketBtn: "ادخر 250 روبية من مصروفي",
    requestFromParentsBtn: "اطلب موافقة الوالدين",
    myGoals: "هدف الادخار الخاص بي",
    myRequests: "طلبات الموافقة الخاصة بي",
    teenAllowance: "مخصص الشباب الحلال",
    teenHeroSub: "طوّر مهاراتك في المالية الإسلامية وأدر مخصصك الشخصي واحصل على الشهادة المعتمدة.",
    teenLearningProgress: "أكاديمية الشريعة والشهادة",
    teacherConsoleTitle: "لوحة تحكم المعلم والمناهج",
    teacherConsoleSub: "تابع تقدم الطلاب، وأشرف على مسارات الأكاديمية، وانشر دورات جديدة.",
    publishCourseBtn: "نشر دورة جديدة",
    studentRosterTitle: "تقدم الطلاب والتزامهم",
    courseCatalogTitle: "المناهج الشرعية المنشورة",
    adminConsoleTitle: "لوحة مدير المنصة والرقابة الشرعية",
    adminConsoleSub: "حوكمة المنصة الشاملة، وحدود إنفاق الأبناء، وتدقيق الجمعيات الخيرية، وسجل الأنشطة.",
    spendingLimitsTitle: "حدود إنفاق حسابات الأبناء",
    exportAuditBtn: "تصدير تقرير التدقيق",
    ngoComplianceTitle: "التدقيق الشرعي للجمعيات الخيرية",
    globalLedgerTitle: "سجل الأنشطة والحوكمة العام",
    earnedBadgesTitle: "شارات الإنجاز المكتسبة",
    earnedBadgesSub: "الأوسمة المحققة من تحديات منطقة نور ودورات أكاديمية النبراس.",
    academyBadgesTitle: "شارات إنجاز الأكاديمية",
    noorBadgesTitle: "شارات إنجاز منطقة نور",
    badgeUnlockedPrefix: "تم فتح شارة جديدة",
    badgeEarnedLabel: "مفتوحة",
    badgeLockedLabel: "مقفلة",
    filterAllBadges: "الكل",
    filterEarnedBadges: "المكتسبة",
    filterLockedBadges: "المقفلة",
    noBadgesEarnedYet: "لم تُفتح أي شارات بعد. أتمّ دورة أو تحدياً في منطقة نور!",
    markCourseCompleteBtn: "إتمام الدورة واستلام الشارة",
    courseCompletedLabel: "الدورة مكتملة ✓",
  }
};
