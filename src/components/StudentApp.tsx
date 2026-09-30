import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Bell,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Flame,
  Globe,
  Languages,
  Lock,
  LogOut,
  Menu,
  Palette,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  Trophy,
  User,
  X,
  Bot,
} from 'lucide-react';
import {
  CoinShopProduct,
  Course,
  CourseModule,
  CurriculumItem,
  Language,
  NotificationItem,
  PracticalSubmission,
  StudentUser,
} from '../types';
import { PREDEFINED_AVATARS, UI_TEXT } from '../translations';
import { RobotMascot, TexnoQadamLogo } from './BrandVisuals';
import { PracticalWorkspace } from './PracticalWorkspace';

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarId: string;
  points: number;
  coins: number;
  strike: number;
}

type StudentTab = 'home' | 'kurslar' | 'coinshop' | 'profile';

export const StudentApp: React.FC = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem('tq_student_token') || '');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('tq_lang') as Language;
    return saved && ['UZ', 'RU', 'EN'].includes(saved) ? saved : 'UZ';
  });

  // Login State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Student Bootstrap State
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [myRank, setMyRank] = useState<number>(1);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [submissions, setSubmissions] = useState<PracticalSubmission[]>([]);
  const [coinShop, setCoinShop] = useState<CoinShopProduct[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<StudentTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Course / Module / Item Drilldown State
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Test Answers State (for pure test items)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const t = UI_TEXT[language];

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const fetchStudentData = async (authToken: string) => {
    if (!authToken) return;
    setLoadingData(true);
    try {
      const res = await fetch('/api/student/bootstrap', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        localStorage.removeItem('tq_student_token');
        setToken('');
        setStudent(null);
        return;
      }
      const data = await res.json();
      setStudent(data.student);
      setMyRank(data.rank || 1);
      setLeaderboard(data.leaderboard || []);
      setCourses(data.courses || []);
      setNotifications(data.notifications || []);
      setSubmissions(data.submissions || []);
      setCoinShop(data.coinShop || []);
    } catch {
      // ignore network error on boot
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStudentData(token);
    }
  }, [token]);

  const handleChangeLanguage = async (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('tq_lang', lang);
    setLangMenuOpen(false);
    if (token) {
      try {
        await fetch('/api/student/profile/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ language: lang }),
        });
      } catch {
        // ignore
      }
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError('Username yoki parol noto‘g‘ri.');
        return;
      }
      localStorage.setItem('tq_student_token', data.token);
      setToken(data.token);
      setStudent(data.student);
    } catch {
      setLoginError('Username yoki parol noto‘g‘ri.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore
    }
    localStorage.removeItem('tq_student_token');
    setToken('');
    setStudent(null);
    setSelectedCourseId(null);
    setSelectedModuleId(null);
    setSelectedItemId(null);
  };

  const goHome = () => {
    setActiveTab('home');
    setSelectedCourseId(null);
    setSelectedModuleId(null);
    setSelectedItemId(null);
    setMobileMenuOpen(false);
  };

  const getAvatarObj = (avatarId: string) => {
    return PREDEFINED_AVATARS.find((a) => a.id === avatarId) || PREDEFINED_AVATARS[0];
  };

  const renderAvatarBadge = (avatarId: string, sizeClass = 'w-12 h-12 text-xl') => {
    const av = getAvatarObj(avatarId);
    if (av.imageUrl) {
      return (
        <div
          className={`${sizeClass} rounded-full overflow-hidden border-2 border-orange-400 bg-white shrink-0 shadow-xs`}
        >
          <img
            src={av.imageUrl}
            alt={av.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br ${av.bgGradient} text-white flex items-center justify-center font-bold shrink-0 shadow-xs border-2 border-white`}
      >
        <span>{av.emoji}</span>
      </div>
    );
  };

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-white" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-white" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-white" />;
      case 'Languages':
        return <Languages className="w-6 h-6 text-white" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-white" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-white" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-white" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  // Check if an item in a module is unlocked for the student
  const isItemUnlocked = (mod: CourseModule, itemIndex: number): boolean => {
    if (!student) return false;
    if (itemIndex === 0) return true;
    const prevItem = mod.items[itemIndex - 1];
    return student.completedItemIds.includes(prevItem.id);
  };

  const handleOpenCourseFromAnywhere = (course: Course) => {
    if (!student) return;
    if (!student.assignedCourseIds.includes(course.id)) {
      showToast('Ushbu kurs sizga hali biriktirilmagan. Ustoz/Administrator biriktirishi kerak.', 'error');
      return;
    }
    setActiveTab('kurslar');
    setSelectedCourseId(course.id);
    if (course.modules.length === 1) {
      setSelectedModuleId(course.modules[0].id);
    } else {
      setSelectedModuleId(null);
    }
    setSelectedItemId(null);
  };

  const handleSelectCurriculumItem = (mod: CourseModule, item: CurriculumItem, idx: number) => {
    if (!isItemUnlocked(mod, idx)) {
      showToast('Siz hali bu darsga kelmagansiz!', 'error');
      return;
    }
    setSelectedItemId(item.id);
    if (item.type === 'test' && item.testQuestions) {
      setQuizAnswers(item.testQuestions.map(() => -1));
    }
  };

  const handleCompleteLesson = async (course: Course, mod: CourseModule, item: CurriculumItem) => {
    try {
      const res = await fetch('/api/student/complete-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course.id,
          moduleId: mod.id,
          itemId: item.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Siz hali bu darsga kelmagansiz!', 'error');
        return;
      }
      setStudent(data.student);
      if (data.leaderboard) setLeaderboard(data.leaderboard);
      if (data.rewarded) {
        showToast('Dars yakunlandi! +25 Coin va +25 Point qo‘shildi!', 'success');
      } else {
        showToast('Dars allaqachon yakunlangan. Keyingi bosqichga o‘ting!', 'info');
      }
      // Advance to next item automatically if available
      const currentIdx = mod.items.findIndex((i) => i.id === item.id);
      if (currentIdx >= 0 && currentIdx + 1 < mod.items.length) {
        const nextItem = mod.items[currentIdx + 1];
        setSelectedItemId(nextItem.id);
        if (nextItem.type === 'test' && nextItem.testQuestions) {
          setQuizAnswers(nextItem.testQuestions.map(() => -1));
        }
      }
    } catch {
      showToast('Xatolik yuz berdi.', 'error');
    }
  };

  const handleCompleteTest = async (course: Course, mod: CourseModule, item: CurriculumItem) => {
    setSubmittingQuiz(true);
    try {
      const res = await fetch('/api/student/complete-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course.id,
          moduleId: mod.id,
          itemId: item.id,
          answers: quizAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Testdan o‘ta olmadingiz. Qaytadan urinib ko‘ring!', 'error');
        return;
      }
      setStudent(data.student);
      if (data.leaderboard) setLeaderboard(data.leaderboard);
      if (data.rewarded) {
        showToast('Test muvaffaqiyatli yakunlandi! +30 Coin va +30 Point!', 'success');
      } else {
        showToast('Test muvaffaqiyatli topshirildi!', 'success');
      }
      const currentIdx = mod.items.findIndex((i) => i.id === item.id);
      if (currentIdx >= 0 && currentIdx + 1 < mod.items.length) {
        setSelectedItemId(mod.items[currentIdx + 1].id);
      }
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleUpdateAvatar = async (avatarId: string) => {
    try {
      const res = await fetch('/api/student/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarId }),
      });
      const data = await res.json();
      if (res.ok && data.student) {
        setStudent(data.student);
        showToast('Avatar muvaffaqiyatli yangilandi!', 'success');
      }
    } catch {
      showToast('Avatar yangilashda xatolik.', 'error');
    }
  };

  // ==============================================================
  // STUDENT LOGIN SCREEN (IF NOT LOGGED IN)
  // ==============================================================
  if (!token || !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        {/* Top Bar with Brand & Language Switcher */}
        <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <TexnoQadamLogo size="md" showKursBor={true} />
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="hidden sm:inline">{t.navLangLabel}: {language}</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              {(['UZ', 'RU', 'EN'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => handleChangeLanguage(lng)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    language === lng
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lng === 'UZ' && '🇺🇿 UZ'}
                  {lng === 'RU' && '🇷🇺 RU'}
                  {lng === 'EN' && '🇬🇧 EN'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Login Container */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Left Side: Robot Mascot Showcase in Multiple Poses */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 text-white p-8 flex flex-col items-center justify-between text-center">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                  TexnoQadam · Kurs Bor
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Kelajak kasblarini interaktiv o‘rganing!
                </h2>
              </div>

              <div className="my-6">
                <RobotMascot
                  pose="welcome"
                  size="xl"
                  interactivePoseSwitch={true}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Darslarni yakunlang (+25 🪙), testlarni yeching (+30 ⭐) va amaliy vazifalar orqali +70 Coin hamda +70 Point to‘plang!
              </p>
            </div>

            {/* Right Side: Student Login Form */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900">{t.loginTitle}</h1>
                <p className="text-sm text-slate-500 mt-1">{t.loginSubtitle}</p>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.username}
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Masalan: ali_valiyev"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.password}
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {loggingIn ? 'Tekshirilmoqda...' : t.loginBtn}
                </button>
              </form>

              {/* Quick Demo Student Accounts for Instant Testing */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2.5">
                  Tezkor sinab ko‘rish uchun mavjud o‘quvchi hisoblari (1-klikda to‘ldirish):
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { u: 'ali_valiyev', label: 'Ali Valiyev (8 ta kurs)' },
                    { u: 'madina_karimova', label: 'Madina Karimova (#1 Reyting)' },
                    { u: 'jasur_rahimov', label: 'Jasur Rahimov (3 ta kurs)' },
                  ].map((demo) => (
                    <button
                      key={demo.u}
                      type="button"
                      onClick={() => {
                        setUsernameInput(demo.u);
                        setPasswordInput('123456');
                        setLoginError('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {demo.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-3">{t.studentNote}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Computed Student Views
  const assignedCourses = courses.filter((c) => student.assignedCourseIds.includes(c.id));
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null;
  const selectedModule =
    selectedCourse?.modules.find((m) => m.id === selectedModuleId) || null;
  const selectedItem =
    selectedModule?.items.find((i) => i.id === selectedItemId) || null;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Top 3 & #4-#10 Leaderboard slices
  const top1 = leaderboard[0] || null;
  const top2 = leaderboard[1] || null;
  const top3 = leaderboard[2] || null;
  const restLeaderboard = leaderboard.slice(3, 10);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="opacity-80 hover:opacity-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DESKTOP & MOBILE NAVBAR (Strictly no Admin links!) */}
      {/* Desktop: Kurs Bor | Kurslar | CoinShop | Til | Coin | Point | Profil */}
      {/* Mobile: ☰ | Kurs Bor | Til | Coin | Point | Profil */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Left: Hamburger (Mobile) + Kurs Bor Brand */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={goHome}
              className="text-left focus:outline-none cursor-pointer"
            >
              <TexnoQadamLogo size="sm" showKursBor={true} />
            </button>

            {/* Desktop Nav Links: Kurs Bor | Kurslar | CoinShop */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              <button
                type="button"
                onClick={goHome}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'home'
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t.brandName}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('kurslar');
                  setSelectedCourseId(null);
                  setSelectedModuleId(null);
                  setSelectedItemId(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'kurslar'
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t.navCourses}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('coinshop')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'coinshop'
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t.navCoinShop}
              </button>
            </nav>
          </div>

          {/* Right: Til | Coin | Point | Notifications | Profil */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Control: Asosiy til: UZ | Tillar: UZ | RU | EN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span className="hidden xl:inline text-slate-500">{t.navLangLabel}:</span>
                <span>{language}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                  <p className="text-[11px] font-bold text-slate-400 mb-2">
                    {t.navLangLabel}: {language}
                  </p>
                  <div className="flex items-center justify-between gap-1 bg-slate-100 p-1 rounded-xl">
                    {(['UZ', 'RU', 'EN'] as Language[]).map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => handleChangeLanguage(lng)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          language === lng
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        {lng}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coin Balance */}
            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm font-extrabold tabular-nums flex items-center gap-1 whitespace-nowrap">
              <span>🪙</span>
              <span>{student.coins}</span>
            </div>

            {/* Point Balance */}
            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-900 text-xs sm:text-sm font-extrabold tabular-nums flex items-center gap-1 whitespace-nowrap">
              <span>⭐</span>
              <span>{student.points}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (unreadNotifCount > 0) {
                    fetch('/api/student/notifications/read', {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                  }
                }}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                      {t.notifications}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">{t.noNotifications}</p>
                  ) : (
                    notifications.slice(0, 12).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          n.type === 'rejection'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : n.type === 'approval'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <p className="font-bold">{n.title}</p>
                        <p className="whitespace-pre-line text-slate-600">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile Button */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              {renderAvatarBadge(student.avatarId, 'w-7 h-7 text-xs')}
              <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">
                {t.navProfile}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Drawer: Kurs Bor | Kurslar | CoinShop */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 shadow-lg">
            <button
              type="button"
              onClick={goHome}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              {t.brandName}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('kurslar');
                setSelectedCourseId(null);
                setSelectedModuleId(null);
                setSelectedItemId(null);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              {t.navCourses}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('coinshop');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              {t.navCoinShop}
            </button>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* MAIN CONTENT VIEWPORT */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* ============================================================ */}
        {/* TAB 1: HOME PAGE (Greeting + Strike, Carousel, Leaderboard) */}
        {/* ============================================================ */}
        {activeTab === 'home' && (
          <>
            {/* HOME HEADER: Salom, {Ism, Familya}! | 🔥 Strike {N} kun */}
            <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <RobotMascot
                  pose="welcome"
                  size="md"
                  interactivePoseSwitch={true}
                />
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                    TexnoQadam · Kurs Bor
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {t.helloUser}, {student.firstName} {student.lastName}!
                  </h1>
                  <p className="text-sm text-slate-300 max-w-xl">
                    Bugun yangi darsni yakunlab Strike ko‘rsatkichingizni oshiring hamda reytingda yuqori o‘ringa ko‘tariling!
                  </p>
                </div>
              </div>

              {/* Right Strike Box */}
              <div className="bg-white/10 backdrop-blur-md border border-orange-500/40 rounded-2xl px-6 py-4 flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-md">
                  <Flame className="w-7 h-7 text-white fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-300">
                    🔥 {t.strikeLabel}
                  </div>
                  <div className="text-2xl font-extrabold tabular-nums">
                    {student.strike} {t.daysUnit}
                  </div>
                </div>
              </div>
            </section>

            {/* ASOSIY KURSLAR CAROUSEL: (<) [Course] [Course] [Course] (>) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {t.mainCourses}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    TexnoQadam o‘quv dasturidagi 8 ta zamonaviy yo‘nalish
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
                    }
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-orange-400 text-slate-700 shadow-xs cursor-pointer"
                    aria-label="Previous courses"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
                    }
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-orange-400 text-slate-700 shadow-xs cursor-pointer"
                    aria-label="Next courses"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                ref={carouselRef}
                className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory"
              >
                {courses.map((course) => {
                  const isAssigned = student.assignedCourseIds.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleOpenCourseFromAnywhere(course)}
                      className="min-w-[270px] sm:min-w-[300px] max-w-[300px] snap-start bg-white rounded-2xl border border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                    >
                      {/* Course Visual Header [RASM] */}
                      <div
                        className={`${course.badgeColor} p-5 text-white relative overflow-hidden h-36 flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between z-10">
                          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                            {getCourseIcon(course.iconName)}
                          </div>
                          <span className="text-xs font-bold bg-black/25 px-2.5 py-1 rounded-lg">
                            {isAssigned ? 'Ochiq' : 'Admin biriktiradi'}
                          </span>
                        </div>
                        <div className="z-10">
                          <h3 className="text-lg font-extrabold tracking-tight group-hover:translate-x-1 transition-transform">
                            {course.title[language]}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {course.description[language]}
                        </p>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
                          <span>{course.modules.length} bo‘lim</span>
                          <span>Kirish →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* LEADERBOARD SECTION: TOP 3 PODIUM + #4-#10 LIST */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-orange-500" />
                    <span>{t.leaderboardTitle}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {t.leaderboardSubtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <RobotMascot pose="celebrating" size="sm" caption="Top Reyting" />
                  <div className="px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold">
                    Sizning o‘rningiz: <span className="text-base font-extrabold">#{myRank}</span>
                  </div>
                </div>
              </div>

              {/* TOP 3 PODIUM */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-3xl mx-auto pt-4">
                {/* #2 Place */}
                {top2 && (
                  <div className="order-2 md:order-1 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center text-center space-y-2">
                    <span className="text-sm font-extrabold text-slate-500">#2</span>
                    {renderAvatarBadge(top2.avatarId, 'w-16 h-16 text-2xl')}
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {top2.firstName} {top2.lastName}
                    </h4>
                    <div className="text-sm font-extrabold text-sky-700 tabular-nums">
                      ⭐ {top2.points} Point
                    </div>
                  </div>
                )}

                {/* #1 Place (Center Elevated) */}
                {top1 && (
                  <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border-2 border-orange-400 p-6 shadow-md flex flex-col items-center text-center space-y-2.5 md:-translate-y-3">
                    <span className="px-3 py-0.5 rounded-full bg-orange-500 text-white text-xs font-extrabold">
                      👑 #1 Peshqadam
                    </span>
                    {renderAvatarBadge(top1.avatarId, 'w-20 h-20 text-3xl')}
                    <h4 className="font-extrabold text-slate-900 text-lg">
                      {top1.firstName} {top1.lastName}
                    </h4>
                    <div className="text-base font-extrabold text-orange-600 tabular-nums">
                      ⭐ {top1.points} Point
                    </div>
                  </div>
                )}

                {/* #3 Place */}
                {top3 && (
                  <div className="order-3 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center text-center space-y-2">
                    <span className="text-sm font-extrabold text-amber-700">#3</span>
                    {renderAvatarBadge(top3.avatarId, 'w-16 h-16 text-2xl')}
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {top3.firstName} {top3.lastName}
                    </h4>
                    <div className="text-sm font-extrabold text-sky-700 tabular-nums">
                      ⭐ {top3.points} Point
                    </div>
                  </div>
                )}
              </div>

              {/* #4 to #10 Ranking Rows */}
              {restLeaderboard.length > 0 && (
                <div className="divide-y divide-slate-100 border-t border-slate-200 pt-4">
                  {restLeaderboard.map((entry) => (
                    <div
                      key={entry.id}
                      className={`py-3 px-4 rounded-xl flex items-center justify-between ${
                        entry.id === student.id ? 'bg-orange-50/70 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-8 text-sm font-extrabold text-slate-500 tabular-nums">
                          #{entry.rank}
                        </span>
                        {renderAvatarBadge(entry.avatarId, 'w-9 h-9 text-sm')}
                        <span className="text-sm font-bold text-slate-900">
                          {entry.firstName} {entry.lastName}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-sky-700 tabular-nums">
                        ⭐ {entry.points}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 2: KURSLAR PAGE (Shows ONLY Admin-Assigned Courses) */}
        {/* ============================================================ */}
        {activeTab === 'kurslar' && !selectedCourse && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{t.myAssignedCourses}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Administrator tomonidan sizga biriktirilgan faol o‘quv kurslari ({assignedCourses.length} ta)
                </p>
              </div>
              <RobotMascot pose="coding" size="sm" caption="Kurslarim" />
            </div>

            {assignedCourses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-base font-bold text-slate-700">{t.noAssignedCourses}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedCourses.map((course) => {
                  const totalItems = course.modules.reduce((acc, m) => acc + m.items.length, 0);
                  const completedInCourse = course.modules.reduce(
                    (acc, m) =>
                      acc +
                      m.items.filter((it) => student.completedItemIds.includes(it.id)).length,
                    0
                  );
                  const pct =
                    totalItems > 0 ? Math.min(100, Math.round((completedInCourse / totalItems) * 100)) : 0;

                  return (
                    <div
                      key={course.id}
                      onClick={() => handleOpenCourseFromAnywhere(course)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                    >
                      <div className={`${course.badgeColor} p-6 text-white space-y-3`}>
                        <div className="flex items-center justify-between">
                          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                            {getCourseIcon(course.iconName)}
                          </div>
                          <span className="text-xs font-extrabold bg-black/25 px-3 py-1 rounded-lg tabular-nums">
                            {pct}% bajarildi
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold">{course.title[language]}</h3>
                      </div>

                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {course.description[language]}
                        </p>
                        <div className="space-y-2">
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>{course.modules.length} bo‘lim / sinf</span>
                            <span className="text-orange-600">Darslarni boshlash →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ============================================================ */}
        {/* COURSE MODULE / GRADE / LEVEL SELECTION VIEW */}
        {/* ============================================================ */}
        {activeTab === 'kurslar' && selectedCourse && !selectedModule && (
          <section className="space-y-6">
            <button
              type="button"
              onClick={() => setSelectedCourseId(null)}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.backToCourses}</span>
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {selectedCourse.title[language]}
                </h1>
                <p className="text-sm text-slate-600">{selectedCourse.description[language]}</p>
                {selectedCourse.recommendationBanner && (
                  <div className="inline-block mt-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs sm:text-sm font-bold">
                    💡 {selectedCourse.recommendationBanner[language]}
                  </div>
                )}
              </div>
              <RobotMascot pose={selectedCourse.robotPose} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedCourse.modules.map((mod) => {
                const doneCount = mod.items.filter((i) =>
                  student.completedItemIds.includes(i.id)
                ).length;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                      setSelectedItemId(null);
                    }}
                    className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {mod.title[language]}
                      </h3>
                      {mod.subtitle && (
                        <p className="text-xs text-slate-500 mt-1">{mod.subtitle[language]}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-orange-600 pt-2 border-t border-slate-100 tabular-nums">
                      <span>
                        {doneCount} / {mod.items.length} bajarildi
                      </span>
                      <span>Ochish →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* MODULE LESSON SEQUENCE & LESSON / PRACTICAL / TEST VIEW */}
        {/* ============================================================ */}
        {activeTab === 'kurslar' && selectedCourse && selectedModule && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (selectedCourse.modules.length > 1) {
                    setSelectedModuleId(null);
                    setSelectedItemId(null);
                  } else {
                    setSelectedCourseId(null);
                    setSelectedModuleId(null);
                    setSelectedItemId(null);
                  }
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  {selectedCourse.modules.length > 1 ? t.backToModules : t.backToCourses}
                </span>
              </button>

              <div className="text-xs font-bold text-slate-500">
                {selectedCourse.title[language]} · {selectedModule.title[language]}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sidebar: Sequential Lesson Lock List */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 max-h-[680px] overflow-y-auto space-y-2">
                <h3 className="text-sm font-extrabold text-slate-900 px-2 py-1">
                  Darslar ketma-ketligi ({selectedModule.items.length} bosqich)
                </h3>
                {selectedModule.items.map((it, idx) => {
                  const unlocked = isItemUnlocked(selectedModule, idx);
                  const completed = student.completedItemIds.includes(it.id);
                  const isCurrent = selectedItem?.id === it.id;

                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => handleSelectCurriculumItem(selectedModule, it, idx)}
                      className={`w-full text-left px-3.5 py-3 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : completed
                          ? 'bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70'
                          : unlocked
                          ? 'bg-white text-slate-800 border-slate-200 hover:border-orange-400'
                          : 'bg-slate-50 text-slate-400 border-slate-200/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {completed ? (
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? 'text-white' : 'text-emerald-600'
                            }`}
                          />
                        ) : unlocked ? (
                          <PlayCircle
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? 'text-white' : 'text-orange-500'
                            }`}
                          />
                        ) : (
                          <Lock className="w-4 h-4 shrink-0 text-slate-400" />
                        )}
                        <span className="truncate">{it.title[language]}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold shrink-0 tabular-nums ${
                          isCurrent ? 'text-orange-100' : 'text-slate-400'
                        }`}
                      >
                        +{it.rewardCoins}🪙
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Content: Active Lesson / Practical / Test */}
              <div className="lg:col-span-8">
                {!selectedItem ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
                    <RobotMascot pose="thinking" size="md" caption="Darsni tanlang" />
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Chap tomondagi ro‘yxatdan ochiq darsni tanlang
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Darslar ketma-ketlikda ochiladi. Har bir dars uchun +25 Coin, test uchun +30 Coin, amaliy ish uchun +70 Coin beriladi!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const firstUncompletedIdx = selectedModule.items.findIndex(
                          (i) => !student.completedItemIds.includes(i.id)
                        );
                        const targetIdx = firstUncompletedIdx >= 0 ? firstUncompletedIdx : 0;
                        handleSelectCurriculumItem(
                          selectedModule,
                          selectedModule.items[targetIdx],
                          targetIdx
                        );
                      }}
                      className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-sm cursor-pointer"
                    >
                      Joriy darsni boshlash →
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                    {/* Item Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                          {selectedItem.type === 'lesson' && 'Nazariy dars · +25 Coin / +25 Point'}
                          {selectedItem.type === 'test' && 'Sinov testi · +30 Coin / +30 Point'}
                          {selectedItem.type === 'practical' &&
                            'Amaliy topshiriq · +70 Coin / +70 Point'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                          {selectedItem.title[language]}
                        </h2>
                      </div>
                      {student.completedItemIds.includes(selectedItem.id) && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.lessonCompletedBadge}</span>
                        </span>
                      )}
                    </div>

                    {/* Lesson Content Explanation */}
                    <div className="prose max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {selectedItem.content[language]}
                    </div>

                    {/* Code Example if Lesson has one */}
                    {selectedItem.type === 'lesson' && selectedItem.codeExample && (
                      <div className="bg-slate-950 text-amber-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                        <div className="text-[11px] text-slate-400 mb-2 font-sans font-semibold">
                          Kod namunasi ({selectedItem.codeLanguage?.toUpperCase()}):
                        </div>
                        <pre>{selectedItem.codeExample}</pre>
                      </div>
                    )}

                    {/* Complete Lesson Action */}
                    {selectedItem.type === 'lesson' && (
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleCompleteLesson(selectedCourse, selectedModule, selectedItem)
                          }
                          className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold shadow-sm transition-colors cursor-pointer"
                        >
                          {t.completeLessonBtn}
                        </button>
                      </div>
                    )}

                    {/* Pure Test Questions */}
                    {selectedItem.type === 'test' && selectedItem.testQuestions && (
                      <div className="space-y-4 pt-2">
                        {selectedItem.testQuestions.map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                          >
                            <p className="font-bold text-sm text-slate-900">
                              {qIdx + 1}. {q.question[language]}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options[language].map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => {
                                    const next = [...quizAnswers];
                                    next[qIdx] = oIdx;
                                    setQuizAnswers(next);
                                  }}
                                  className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                    quizAnswers[qIdx] === oIdx
                                      ? 'bg-orange-500 text-white border-orange-500'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            handleCompleteTest(selectedCourse, selectedModule, selectedItem)
                          }
                          disabled={submittingQuiz}
                          className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold shadow-sm transition-colors cursor-pointer"
                        >
                          {submittingQuiz
                            ? 'Tekshirilmoqda...'
                            : 'Testni yakunlash (+30 Coin, +30 Point)'}
                        </button>
                      </div>
                    )}

                    {/* Practical Assignment Workspace */}
                    {selectedItem.type === 'practical' && (
                      <PracticalWorkspace
                        key={selectedItem.id}
                        item={selectedItem}
                        courseId={selectedCourse.id}
                        moduleId={selectedModule.id}
                        language={language}
                        token={token}
                        existingSubmission={submissions.find(
                          (s) => s.itemId === selectedItem.id
                        )}
                        isCompleted={student.completedItemIds.includes(selectedItem.id)}
                        onToast={showToast}
                        onSubmitted={(data) => {
                          if (data.student) setStudent(data.student);
                          if (data.leaderboard) setLeaderboard(data.leaderboard);
                          if (data.submission) {
                            setSubmissions((prev) => [data.submission, ...prev]);
                          }
                          fetchStudentData(token);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* TAB 3: COINSHOP (16 Products, Telegram Link, No Auto-Deduct) */}
        {/* ============================================================ */}
        {activeTab === 'coinshop' && (
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-orange-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">
                  TexnoQadam · CoinShop
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold">CoinShop Do‘koni</h1>
                <p className="text-sm text-slate-300 max-w-2xl">{t.coinShopSubtitle}</p>
                <p className="text-xs text-amber-300 font-semibold pt-1">
                  ℹ️ {t.coinShopRuleInfo}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <RobotMascot pose="celebrating" size="sm" caption="CoinShop" />
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3 text-center">
                  <div className="text-xs text-amber-300 font-bold">Mening balansim</div>
                  <div className="text-2xl font-extrabold tabular-nums mt-0.5">
                    🪙 {student.coins}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {coinShop.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-orange-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 tabular-nums">
                        #{prod.order}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-extrabold tabular-nums">
                        🪙 {prod.priceCoins} Coin
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {prod.title[language]}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {prod.description[language]}
                    </p>
                  </div>

                  {/* IMPORTANT RULE: Opens https://t.me/a_ikromboyev without subtracting Coins */}
                  <a
                    href="https://t.me/a_ikromboyev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>{t.executeExchangeBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* TAB 4: STUDENT PROFILE CARD & AVATAR SELECTOR */}
        {/* ============================================================ */}
        {activeTab === 'profile' && (
          <section className="space-y-6">
            {/* Profile Main Card matching required wireframe */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex flex-col items-center text-center space-y-3">
                  {renderAvatarBadge(student.avatarId, 'w-24 h-24 text-4xl')}
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {student.firstName} {student.lastName}
                    </h2>
                    <p className="text-xs font-mono text-slate-500">@{student.username}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">🪙 Coin</span>
                    <span className="text-base font-extrabold text-amber-600 tabular-nums">
                      {student.coins}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">⭐ Point</span>
                    <span className="text-base font-extrabold text-sky-600 tabular-nums">
                      {student.points}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">#o‘rin</span>
                    <span className="text-base font-extrabold text-orange-600 tabular-nums">
                      #{myRank}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">🔥 Strike</span>
                    <span className="text-base font-extrabold text-rose-600 tabular-nums">
                      {student.strike} {t.daysUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Predefined Avatar Selector */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">{t.chooseAvatar}</h3>
                    <p className="text-xs text-slate-500">
                      Tayyor robot pozalari va o‘quvchi avatarlaridan birini tanlang
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.logout}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {PREDEFINED_AVATARS.map((av) => {
                    const active = student.avatarId === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleUpdateAvatar(av.id)}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          active
                            ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/20'
                            : 'border-slate-200 hover:border-orange-300 bg-white'
                        }`}
                      >
                        {renderAvatarBadge(av.id, 'w-12 h-12 text-xl')}
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-full">
                          {av.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Course Progress Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">{t.courseProgress}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assignedCourses.map((course) => {
                  const total = course.modules.reduce((acc, m) => acc + m.items.length, 0);
                  const done = course.modules.reduce(
                    (acc, m) =>
                      acc + m.items.filter((i) => student.completedItemIds.includes(i.id)).length,
                    0
                  );
                  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                        <span>{course.title[language]}</span>
                        <span className="text-orange-600 tabular-nums">
                          {done}/{total} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
