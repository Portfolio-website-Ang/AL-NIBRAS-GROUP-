export type Language = 'ur' | 'en' | 'ps' | 'ar';

export type UserRole = 'parent' | 'kid' | 'teen' | 'teacher' | 'admin';

export type TabType = 'home' | 'okKro' | 'zakat' | 'learn' | 'kids' | 'aiTutor';

export interface ApprovalRequest {
  id: number;
  kid: string;
  amount: number;
  type: 'saving' | 'course_purchase' | 'purchase' | 'charity' | 'gadget';
  title: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  notes?: string;
}

export interface FamilyGoal {
  id: number;
  title: string;
  target: number;
  current: number;
  icon: string;
  category: string;
  owner?: 'Ahmed' | 'Fatima' | 'Family';
}

export interface CourseModule {
  title: string;
  duration: string;
  summary: string;
}

export interface Course {
  id: number;
  title: string;
  age: string;
  rating: number;
  students: number;
  price: string;
  level: string;
  icon: string;
  description: string;
  modules: CourseModule[];
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  coins: number;
  completed: boolean;
  icon: string;
}

export interface ChildActivityLog {
  id: number;
  child: 'Ahmed' | 'Fatima';
  role: 'kid' | 'teen';
  type: 'learning' | 'streak' | 'quest' | 'request' | 'saving' | 'quiz';
  title: string;
  titleUr: string;
  titlePs: string;
  detail: string;
  coinsDelta?: number;
  amountPkr?: number;
  timestamp: string;
}

export type BadgeCategory = 'academy' | 'noor_zone';

export interface MilestoneBadge {
  id: string;
  category: BadgeCategory;
  icon: string;
  accent: 'gold' | 'emerald';
  points: number;
  titleEn: string;
  titleUr: string;
  titlePs: string;
  titleAr: string;
  descEn: string;
  descUr: string;
  descPs: string;
  descAr: string;
  criteriaEn: string;
  criteriaUr: string;
  criteriaPs: string;
  criteriaAr: string;
}

export interface EarnedBadgeRecord {
  badgeId: string;
  unlockedAt: string;
  earnedBy?: string;
}

export interface AppState {
  walletBalance: number;
  kidPocketMoney: number;
  teenAllowance: number;
  kidSpendingLimit: number;
  teenSpendingLimit: number;
  zakatPaidTotal: number;
  noorCoins: number;
  streakDays: number;
  userLevel: string;
  soundEnabled: boolean;
  currency: string;
  approvals: ApprovalRequest[];
  goals: FamilyGoal[];
  courses: Course[];
  activityLogs: ChildActivityLog[];
  enrolledCourseIds?: number[];
  completedCourseIds?: number[];
  completedChallenges?: string[];
  earnedBadges: EarnedBadgeRecord[];
  streakClaimedToday?: boolean;
  lastClaimDate?: string;
  completedQuests?: string[];
  totalStreakRewardsClaimed?: number;
}

export interface CertificateData {
  recipientName: string;
  courseTitle: string;
  issueDate: string;
  certCode: string;
  score: number;
}
