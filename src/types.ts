export type Language = 'UZ' | 'RU' | 'EN';

export interface LocalizedText {
  UZ: string;
  RU: string;
  EN: string;
}

export interface TestQuestion {
  id: string;
  question: LocalizedText;
  options: {
    UZ: string[];
    RU: string[];
    EN: string[];
  };
  correctIndex: number;
}

export type PracticalMode = 'code' | 'voice' | 'screenshot';
export type CodeLanguage = 'html' | 'css' | 'bootstrap' | 'javascript' | 'react' | 'python';

export interface CurriculumItem {
  id: string;
  courseId: string;
  moduleId: string;
  order: number;
  type: 'lesson' | 'practical' | 'test';
  title: LocalizedText;
  content: LocalizedText;
  examples?: string[];
  codeExample?: string;
  starterCode?: string;
  codeLanguage?: CodeLanguage;
  practicalMode?: PracticalMode;
  voicePrompt?: LocalizedText;
  expectedTargetPhrase?: string;
  expectedKeywords?: string[];
  testQuestions?: TestQuestion[];
  rewardCoins: number; // 25 for lesson, 30 for test, 70 for practical
  rewardPoints: number; // 25 for lesson, 30 for test, 70 for practical
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  moduleKind: 'module' | 'level' | 'grade';
  items: CurriculumItem[];
}

export interface Course {
  id: string;
  slug: string;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  recommendationBanner?: LocalizedText;
  category: string;
  badgeColor: string;
  iconName: string;
  robotPose: 'welcome' | 'coding' | 'celebrating' | 'thinking';
  modules: CourseModule[];
}

export interface StudentUser {
  id: string;
  username: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  avatarId: string;
  coins: number;
  points: number;
  strike: number;
  lastStrikeDate: string | null; // YYYY-MM-DD
  lastLogin: string | null;
  lastActiveDate: string | null;
  isActive: boolean;
  assignedCourseIds: string[];
  completedItemIds: string[];
  completedLessonsCount: number;
  completedTestsCount: number;
  submittedPracticalsCount: number;
  approvedPracticalsCount: number;
  rejectedPracticalsCount: number;
  coinsEarnedTotal: number;
  coinsSpentTotal: number;
  pointsEarnedTotal: number;
  language: Language;
  createdAt: string;
}

export interface PracticalSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentUsername: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  itemId: string;
  itemTitle: string;
  practicalMode: PracticalMode;
  submittedCode?: string;
  codeOutput?: string;
  screenshotDataUrl?: string;
  voiceTranscript?: string;
  testScore?: number;
  aiStatus?: 'Correct' | 'Incorrect' | 'Needs Retry';
  aiFeedback?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface TransactionRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentUsername: string;
  type: 'coin' | 'point' | 'strike';
  amount: number; // positive or negative
  reason: string;
  actor: string; // 'System' or 'AdminCRM'
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  studentId: string; // or 'ALL'
  title: string;
  message: string;
  type: 'reward' | 'approval' | 'rejection' | 'admin';
  read: boolean;
  createdAt: string;
}

export interface CoinShopProduct {
  id: string;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  priceCoins: number;
  category: 'website' | 'portfolio' | 'bundle' | 'exchange';
  telegramUrl: string;
}

export interface PredefinedAvatar {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
  imageUrl?: string;
}
