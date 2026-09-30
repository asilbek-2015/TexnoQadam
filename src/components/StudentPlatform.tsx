import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Flame,
  Bell,
  Upload,
  Sparkles,
  BookOpen,
  Code2,
  Globe,
  Calculator,
  Languages,
  Palette,
  Bot,
  Trophy,
  ExternalLink,
  LogOut,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  Course,
  CourseModule,
  CurriculumItem,
  Language,
  StudentUser,
  PracticalSubmission,
  NotificationItem,
  CoinShopProduct,
} from '../types';
import { UI_TEXT, PREDEFINED_AVATARS } from '../translations';
import { TexnoQadamLogo, TexnoQadamRobot, AvatarBadge } from './Branding';
import { CodeCompiler } from './CodeCompiler';
import { VoicePractical } from './VoicePractical';

type StudentPage = 'home' | 'courses' | 'coinshop' | 'profile';

export const StudentPlatform: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('tq_lang') as Language | null;
    return saved === 'UZ' || saved === 'RU' || saved === 'EN' ? saved : 'UZ';
  });
  const t = UI_TEXT[language];

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('tq_student_token')
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Student Data
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [leaderboard, setLeaderboard] = useState<StudentUser[]>([]);
  const [coinShop, setCoinShop] = useState<CoinShopProduct[]>([]);
  const [submissions, setSubmissions] = useState<PracticalSubmission[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Navigation State
  const [page, setPage] = useState<StudentPage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Interactive States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lockedAlertModal, setLockedAlertModal] = useState<string | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [activeRobotPose, setActiveRobotPose] = useState<
    'welcome' | 'coding' | 'celebrating' | 'thinking'
  >('welcome');

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const changeLanguage = async (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('tq_lang', newLang);
    if (token) {
      try {
        await fetch('/api/student/language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ language: newLang }),
        });
      } catch {
        // ignore
      }
    }
  };

  const fetchStudentDashboard = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/student/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('tq_student_token');
        setToken(null);
        setStudent(null);
        return;
      }
      const data = await res.json();
      setStudent(data.student);
      if (data.student?.language) {
        setLanguage(data.student.language);
        localStorage.setItem('tq_lang', data.student.language);
      }
      setAllCourses(data.courses || []);
      setLeaderboard(data.leaderboard || []);
      setCoinShop(data.coinShop || []);
      setSubmissions(data.submissions || []);
      setNotifications(data.notifications || []);
    } catch {
      // ignore transient error
    }
  }, [token]);

  useEffect(() => {
    fetchStudentDashboard();
  }, [fetchStudentDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError('Username yoki parol noto‘g‘ri.');
        return;
      }
      localStorage.setItem('tq_student_token', data.token);
      setToken(data.token);
      setPage('home');
    } catch {
      setLoginError('Username yoki parol noto‘g‘ri.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tq_student_token');
    setToken(null);
    setStudent(null);
    setSelectedCourseId(null);
    setSelectedModuleId(null);
    setSelectedItemId(null);
  };

  const goHome = () => {
    setPage('home');
    setSelectedCourseId(null);
    setSelectedModuleId(null);
    setSelectedItemId(null);
    setMobileMenuOpen(false);
  };

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const offset = dir === 'left' ? -320 : 320;
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6" />;
      case 'Globe':
        return <Globe className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'Languages':
        return <Languages className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      case 'Bot':
        return <Bot className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  // Sequential Unlock Check inside a Module
  const isItemUnlocked = (module: CourseModule, itemIndex: number): boolean => {
    if (!student) return false;
    if (itemIndex === 0) return true;
    const prevItem = module.items[itemIndex - 1];
    return student.completedItemIds.includes(prevItem.id);
  };

  const handleSelectCurriculumItem = (module: CourseModule, idx: number) => {
    const item = module.items[idx];
    if (!isItemUnlocked(module, idx)) {
      setLockedAlertModal('Siz hali bu darsga kelmagansiz!');
      return;
    }
    setSelectedItemId(item.id);
    setQuizAnswers({});
    setQuizFeedback(null);
    setScreenshotDataUrl('');
  };

  const handleCompleteLesson = async (item: CurriculumItem, module: CourseModule) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/complete-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: item.courseId,
          moduleId: item.moduleId,
          itemId: item.id,
          type: 'lesson',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast(
          data.alreadyCompleted
            ? 'Bu dars allaqachon yakunlangan!'
            : 'Dars yakunlandi! +25 Coin, +25 Point qo‘shildi!'
        );
        await fetchStudentDashboard();
        // Automatically open next item if available
        const currentIndex = module.items.findIndex((i) => i.id === item.id);
        if (currentIndex >= 0 && currentIndex + 1 < module.items.length) {
          setSelectedItemId(module.items[currentIndex + 1].id);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTest = async (item: CurriculumItem, module: CourseModule) => {
    if (!token) return;
    const questions = item.testQuestions || [];
    if (Object.keys(quizAnswers).length < questions.length) {
      setQuizFeedback('Barcha test savollariga javob belgilang!');
      return;
    }
    let correctCount = 0;
    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) correctCount++;
    });

    if (correctCount < questions.length) {
      setQuizFeedback(
        `Javob noto‘g‘ri (${correctCount}/${questions.length}). Qaytadan urinib ko‘ring!`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/complete-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: item.courseId,
          moduleId: item.moduleId,
          itemId: item.id,
          type: 'test',
        }),
      });
      if (res.ok) {
        setQuizFeedback('Test muvaffaqiyatli topshirildi! +30 Coin, +30 Point!');
        triggerToast('Test muvaffaqiyatli yakunlandi! +30 Coin, +30 Point');
        await fetchStudentDashboard();
        const currentIndex = module.items.findIndex((i) => i.id === item.id);
        if (currentIndex >= 0 && currentIndex + 1 < module.items.length) {
          setSelectedItemId(module.items[currentIndex + 1].id);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPracticalToAdmin = async (
    item: CurriculumItem,
    payload: { submittedCode?: string; codeOutput?: string; screenshotDataUrl?: string }
  ) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/submit-practical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: item.courseId,
          moduleId: item.moduleId,
          itemId: item.id,
          practicalMode: item.practicalMode || 'screenshot',
          ...payload,
        }),
      });
      if (res.ok) {
        triggerToast('Amaliy ishingiz Admin CRM ga yuborildi!');
        await fetchStudentDashboard();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      // Compress / resize image on canvas so it stays lightweight
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 800;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setScreenshotDataUrl(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectAvatar = async (avatarId: string) => {
    if (!token) return;
    await fetch('/api/student/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatarId }),
    });
    triggerToast('Avatar muvaffaqiyatli yangilandi!');
    fetchStudentDashboard();
  };

  // IF NOT LOGGED IN -> SHOW STUDENT LOGIN PAGE
  if (!token || !student) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        {/* Top bar with Logo & Language switcher */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <TexnoQadamLogo size="md" />
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="hidden sm:inline">{t.navLangLabel}: {language} |</span>
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg">
              {(['UZ', 'RU', 'EN'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => changeLanguage(lng)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                    language === lng
                      ? 'bg-[#FF6B00] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Student Login Card + TexnoQadam Robot Poses */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-10">
          {/* Left: TexnoQadam Brand & Robot Showcase in 4 Poses */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B00] tracking-wide uppercase">
              <span>TexnoQadam · Kurs Bor</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Zamonaviy kasblar va fanlarni interaktiv o‘rganing!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Darslarni ketma-ket bajaring, sun’iy intellekt va kod kompilyatori orqali
              amaliy mashqlarni topshiring, Coin hamda Point to‘plab peshqadam bo‘ling!
            </p>

            {/* Robot in Different Poses */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500">
                TexnoQadam Roboti turli holatlarda (ustiga bosing):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { pose: 'welcome', label: 'Salomlashuv' },
                    { pose: 'coding', label: 'Dasturlash' },
                    { pose: 'celebrating', label: 'G‘alaba & Coin' },
                    { pose: 'thinking', label: 'AI Ustoz' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.pose}
                    type="button"
                    onClick={() => setActiveRobotPose(item.pose)}
                    className={`p-2 rounded-2xl border transition-all flex flex-col items-center ${
                      activeRobotPose === item.pose
                        ? 'border-[#FF6B00] bg-orange-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <TexnoQadamRobot pose={item.pose} size="sm" caption={item.label} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{t.loginTitle}</h2>
                <p className="text-xs text-slate-500 mt-1">{t.loginSubtitle}</p>
              </div>
              <TexnoQadamRobot pose={activeRobotPose} size="sm" caption="" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.username}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ali_valiyev"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-sm transition-colors shadow-md shadow-orange-500/20"
              >
                {t.loginBtn}
              </button>
            </form>

            {/* Student Demo Quick Login Helper (Strictly Student Accounts Only) */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[11px] text-slate-500">{t.studentNote}</p>
              <div className="text-xs font-semibold text-slate-700">
                Namunaviy o‘quvchi hisoblari (sinab ko‘rish uchun bosing):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { u: 'ali_valiyev', label: 'Ali Valiyev' },
                  { u: 'malika_karimova', label: 'Malika Karimova' },
                  { u: 'jasur_toshmatov', label: 'Jasur Toshmatov' },
                ].map((demo) => (
                  <button
                    key={demo.u}
                    type="button"
                    onClick={() => {
                      setUsername(demo.u);
                      setPassword('123456');
                      setLoginError('');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-[#FF6B00] text-slate-700 text-xs font-medium transition-colors"
                  >
                    {demo.label} ({demo.u})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Computed Student Values
  const studentRank =
    leaderboard.findIndex((u) => u.id === student.id) >= 0
      ? leaderboard.findIndex((u) => u.id === student.id) + 1
      : leaderboard.length + 1;

  const assignedCourses = allCourses.filter((c) =>
    student.assignedCourseIds.includes(c.id)
  );

  const selectedCourse = allCourses.find((c) => c.id === selectedCourseId) || null;
  const selectedModule =
    selectedCourse?.modules.find((m) => m.id === selectedModuleId) || null;
  const selectedItem =
    selectedModule?.items.find((i) => i.id === selectedItemId) || null;

  const top3Students = leaderboard.slice(0, 3);
  const rank4To10Students = leaderboard.slice(3, 10);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-orange-500/40 text-xs sm:text-sm font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Locked Lesson Warning Modal ("Siz hali bu darsga kelmagansiz!") */}
      {lockedAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF6B00] mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {lockedAlertModal}
            </h3>
            <p className="text-xs text-slate-500">
              Keyingi darsni ochish uchun avvalgi dars yoki amaliy topshiriqni to‘liq yakunlang.
            </p>
            <button
              type="button"
              onClick={() => setLockedAlertModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}

      {/* COMPUTER & MOBILE NAVBAR */}
      {/* Desktop structure: Kurs Bor | Kurslar | CoinShop | Til | Coin | Point | Profil */}
      {/* Mobile structure: ☰ Kurs Bor | Til | Coin | Point | Profil */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Left: Mobile Hamburger + Kurs Bor (TexnoQadam) Brand */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={goHome}
              className="text-left focus:outline-none"
              title="Kurs Bor — Bosh sahifaga qaytish"
            >
              <TexnoQadamLogo size="sm" showKursBorSub={true} />
            </button>
          </div>

          {/* Center Desktop Navigation: Kurs Bor | Kurslar | CoinShop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <button
              type="button"
              onClick={goHome}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap ${
                page === 'home'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Kurs Bor
            </button>

            <button
              type="button"
              onClick={() => {
                setPage('courses');
                setSelectedCourseId(null);
                setSelectedModuleId(null);
                setSelectedItemId(null);
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap ${
                page === 'courses'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.navCourses}
            </button>

            <button
              type="button"
              onClick={() => setPage('coinshop')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap ${
                page === 'coinshop'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.navCoinShop}
            </button>
          </nav>

          {/* Right Controls: Til | Coin | Point | Profil */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Til (Language Selector: Asosiy til: UZ | Tillar: UZ | RU | EN) */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-xl">
              <span className="hidden xl:inline text-[11px] font-semibold text-slate-500">
                {t.navLangLabel}: {language} ·
              </span>
              {(['UZ', 'RU', 'EN'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => changeLanguage(lng)}
                  className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-colors ${
                    language === lng
                      ? 'bg-[#FF6B00] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* Coin Balance */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 font-mono text-xs sm:text-sm font-extrabold tabular-nums whitespace-nowrap"
              title="Coin balansi"
            >
              <span>🪙</span>
              <span>{student.coins}</span>
            </div>

            {/* Point Balance */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-800 font-mono text-xs sm:text-sm font-extrabold tabular-nums whitespace-nowrap"
              title="Point balansi"
            >
              <span>⭐</span>
              <span>{student.points}</span>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative"
                title={t.notifications}
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00] absolute top-1.5 right-1.5" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 space-y-3 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {t.notifications}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      {t.noNotifications}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 space-y-2">
                      {notifications.map((n) => (
                        <div key={n.id} className="pt-2 first:pt-0 space-y-1">
                          <div className="text-xs font-bold text-slate-900">{n.title}</div>
                          <div className="text-xs text-slate-600 whitespace-pre-line">
                            {n.message}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profil Button */}
            <button
              type="button"
              onClick={() => setPage('profile')}
              className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-colors ${
                page === 'profile'
                  ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
              }`}
            >
              <AvatarBadge avatarId={student.avatarId} size="sm" />
              <span className="hidden lg:inline text-xs font-bold whitespace-nowrap">
                {t.navProfile}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Drawer: Kurs Bor | Kurslar | CoinShop */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2">
            <button
              type="button"
              onClick={goHome}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 hover:text-[#FF6B00]"
            >
              Kurs Bor (TexnoQadam)
            </button>
            <button
              type="button"
              onClick={() => {
                setPage('courses');
                setSelectedCourseId(null);
                setSelectedModuleId(null);
                setSelectedItemId(null);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 hover:text-[#FF6B00]"
            >
              {t.navCourses}
            </button>
            <button
              type="button"
              onClick={() => {
                setPage('coinshop');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 hover:text-[#FF6B00]"
            >
              {t.navCoinShop}
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ==================== PAGE 1: HOME ==================== */}
        {page === 'home' && (
          <div className="space-y-8">
            {/* HOME HEADER: Salom, {Ism, Familya}! on Left | 🔥 Strike {N} kun on Right */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <TexnoQadamRobot pose={activeRobotPose} size="md" caption="" />
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
                    TexnoQadam · Kurs Bor
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t.helloUser}, {student.firstName} {student.lastName}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Reytingdagi o‘rningiz: <strong className="text-slate-800">#{studentRank}-{t.rankPlace}</strong> · Biriktirilgan kurslar: <strong className="text-slate-800">{assignedCourses.length} ta</strong>
                  </p>
                </div>
              </div>

              {/* Right: 🔥 Strike / N kun */}
              <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end bg-gradient-to-br from-orange-500 to-amber-500 text-white px-6 py-4 rounded-2xl shadow-md shadow-orange-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                    <Flame className="w-6 h-6 fill-current text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-90">
                      🔥 {t.strikeLabel}
                    </div>
                    <div className="text-2xl font-extrabold tabular-nums leading-none mt-0.5">
                      {student.strike} {t.daysUnit}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ROBOT POSES BAR (Interactive TexnoQadam Mascot in Multiple Poses) */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-sm font-extrabold text-slate-900">
                  TexnoQadam Yordamchi Roboti (Har xil pozalarda)
                </h2>
                <p className="text-xs text-slate-500">
                  Kayfiyat va o‘quv rejimiga mos robot pozasini tanlang:
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {(
                  [
                    { pose: 'welcome', title: 'Salomlashuv' },
                    { pose: 'coding', title: 'Kod Yozish' },
                    { pose: 'celebrating', title: 'G‘alaba' },
                    { pose: 'thinking', title: 'O‘rganish' },
                  ] as const
                ).map((rp) => (
                  <button
                    key={rp.pose}
                    type="button"
                    onClick={() => setActiveRobotPose(rp.pose)}
                    className={`p-2 rounded-xl border transition-all ${
                      activeRobotPose === rp.pose
                        ? 'border-[#FF6B00] bg-orange-50/70 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <TexnoQadamRobot pose={rp.pose} size="sm" caption={rp.title} />
                  </button>
                ))}
              </div>
            </section>

            {/* ASOSIY KURSLAR CAROUSEL: (<) [Course] [Course] [Course] (>) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {t.mainCourses}
                  </h2>
                  <p className="text-xs text-slate-500">
                    TexnoQadam platformasidagi 8 ta asosiy yo‘nalish
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-[#FF6B00] text-slate-700 flex items-center justify-center shadow-2xs transition-colors"
                    aria-label="Previous courses"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-[#FF6B00] text-slate-700 flex items-center justify-center shadow-2xs transition-colors"
                    aria-label="Next courses"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                ref={carouselRef}
                className="flex items-stretch gap-4 overflow-x-auto pb-3 scroll-smooth"
              >
                {allCourses.map((course) => {
                  const isAssigned = student.assignedCourseIds.includes(course.id);
                  const totalItems = course.modules.reduce(
                    (acc, m) => acc + m.items.length,
                    0
                  );
                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        if (isAssigned) {
                          setPage('courses');
                          setSelectedCourseId(course.id);
                          setSelectedModuleId(null);
                          setSelectedItemId(null);
                        } else {
                          triggerToast(
                            'Ushbu kurs sizga hali biriktirilmagan. Admin CRM orqali biriktiriladi.'
                          );
                        }
                      }}
                      className="w-72 shrink-0 bg-white border border-slate-200 hover:border-[#FF6B00] rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between shadow-xs"
                    >
                      {/* [RASM] Graphic Header */}
                      <div
                        className={`h-36 bg-gradient-to-br ${course.badgeColor} p-5 text-white flex items-center justify-between relative overflow-hidden`}
                      >
                        <div className="space-y-2 z-10">
                          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                            {getCourseIcon(course.iconName)}
                          </div>
                          <div className="text-xs font-mono opacity-90">
                            {course.modules.length} bo‘lim · {totalItems} dars
                          </div>
                        </div>
                        <TexnoQadamRobot
                          pose={course.robotPose}
                          size="sm"
                          caption=""
                          className="z-10"
                        />
                      </div>

                      {/* Card Title & Footer */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {course.title[language] || course.title.UZ}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {course.description[language] || course.description.UZ}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                          {isAssigned ? (
                            <span className="text-emerald-600">O‘qishga ochiq →</span>
                          ) : (
                            <span className="text-slate-400 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> Biriktirilmagan
                            </span>
                          )}
                          <span className="text-orange-600 font-mono">#0{course.order}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* HOME PROFILE QUICK CARD + LEADERBOARD PODIUM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left 1 Col: Student Profile Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <AvatarBadge avatarId={student.avatarId} size="lg" />
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        @{student.username}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-[#FF6B00] font-mono">
                      #{studentRank}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      {t.rankPlace}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                    <div className="text-xs text-amber-700 font-semibold">🪙 Coin</div>
                    <div className="text-base font-extrabold text-slate-900 font-mono tabular-nums mt-0.5">
                      {student.coins}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/60">
                    <div className="text-xs text-indigo-700 font-semibold">⭐ Point</div>
                    <div className="text-base font-extrabold text-slate-900 font-mono tabular-nums mt-0.5">
                      {student.points}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60">
                    <div className="text-xs text-orange-700 font-semibold">🔥 Strike</div>
                    <div className="text-base font-extrabold text-slate-900 font-mono tabular-nums mt-0.5">
                      {student.strike}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPage('profile')}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-[#FF6B00] text-xs font-bold text-slate-700 hover:text-[#FF6B00] transition-colors"
                >
                  To‘liq profil va avatar tanlash →
                </button>
              </div>

              {/* Right 2 Cols: LEADERBOARD (TOP 3 PODIUM + #4..#10 LIST) */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#FF6B00]" />
                      <span>{t.leaderboardTitle}</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.leaderboardSubtitle} ({leaderboard.length} o‘quvchi)
                    </p>
                  </div>
                </div>

                {/* TOP 3 PODIUM */}
                {top3Students.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2">
                    {/* #2 Place (Left on Desktop) */}
                    {top3Students[1] ? (
                      <div className="order-2 sm:order-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-2">
                        <div className="text-xs font-mono font-extrabold text-slate-500">
                          #2 {t.rankPlace}
                        </div>
                        <AvatarBadge avatarId={top3Students[1].avatarId} size="md" />
                        <div className="font-bold text-sm text-slate-900 truncate max-w-full">
                          {top3Students[1].firstName} {top3Students[1].lastName}
                        </div>
                        <div className="text-xs font-mono font-extrabold text-indigo-600 tabular-nums">
                          ⭐ {top3Students[1].points} Point
                        </div>
                      </div>
                    ) : (
                      <div className="hidden sm:block order-1" />
                    )}

                    {/* #1 Place (Center Elevated Podium) */}
                    {top3Students[0] && (
                      <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-50 to-orange-50/50 border-2 border-[#FF6B00] rounded-2xl p-5 flex flex-col items-center text-center space-y-2 shadow-md">
                        <div className="text-sm font-mono font-extrabold text-[#FF6B00]">
                          👑 #1 {t.rankPlace}
                        </div>
                        <AvatarBadge avatarId={top3Students[0].avatarId} size="lg" />
                        <div className="font-extrabold text-base text-slate-900 truncate max-w-full">
                          {top3Students[0].firstName} {top3Students[0].lastName}
                        </div>
                        <div className="text-sm font-mono font-extrabold text-[#FF6B00] tabular-nums">
                          ⭐ {top3Students[0].points} Point
                        </div>
                      </div>
                    )}

                    {/* #3 Place (Right on Desktop) */}
                    {top3Students[2] ? (
                      <div className="order-3 bg-amber-50/30 border border-amber-200/80 rounded-2xl p-4 flex flex-col items-center text-center space-y-2">
                        <div className="text-xs font-mono font-extrabold text-amber-700">
                          #3 {t.rankPlace}
                        </div>
                        <AvatarBadge avatarId={top3Students[2].avatarId} size="md" />
                        <div className="font-bold text-sm text-slate-900 truncate max-w-full">
                          {top3Students[2].firstName} {top3Students[2].lastName}
                        </div>
                        <div className="text-xs font-mono font-extrabold text-indigo-600 tabular-nums">
                          ⭐ {top3Students[2].points} Point
                        </div>
                      </div>
                    ) : (
                      <div className="hidden sm:block order-3" />
                    )}
                  </div>
                )}

                {/* #4 to #10 Ranking List */}
                {rank4To10Students.length > 0 && (
                  <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                    {rank4To10Students.map((st, idx) => {
                      const rankNum = idx + 4;
                      const isMe = st.id === student.id;
                      return (
                        <div
                          key={st.id}
                          className={`py-3 px-3 rounded-xl flex items-center justify-between gap-4 text-xs sm:text-sm ${
                            isMe ? 'bg-orange-50/80 font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 font-mono font-bold text-slate-500 tabular-nums">
                              #{rankNum}
                            </span>
                            <AvatarBadge avatarId={st.avatarId} size="sm" />
                            <span className="font-semibold text-slate-900">
                              {st.firstName} {st.lastName}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-indigo-600 tabular-nums">
                            ⭐ {st.points}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PAGE 2: KURSLAR (ASSIGNED COURSES & LESSONS) ==================== */}
        {page === 'courses' && (
          <div className="space-y-6">
            {/* LEVEL 1: SHOW ONLY ASSIGNED COURSES */}
            {!selectedCourse && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      {t.myAssignedCourses}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Administrator tomonidan sizga biriktirilgan o‘quv kurslari
                    </p>
                  </div>
                  <TexnoQadamRobot pose="coding" size="sm" caption="O‘qishni boshlang!" />
                </div>

                {assignedCourses.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                    <TexnoQadamRobot pose="thinking" size="md" caption="" />
                    <p className="text-sm font-semibold text-slate-600">
                      {t.noAssignedCourses}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {assignedCourses.map((course) => {
                      const allCourseItemIds = course.modules.flatMap((m) =>
                        m.items.map((i) => i.id)
                      );
                      const completedInCourse = allCourseItemIds.filter((id) =>
                        student.completedItemIds.includes(id)
                      ).length;
                      const pct =
                        allCourseItemIds.length > 0
                          ? Math.round((completedInCourse / allCourseItemIds.length) * 100)
                          : 0;

                      return (
                        <div
                          key={course.id}
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            if (course.modules.length === 1) {
                              setSelectedModuleId(course.modules[0].id);
                            } else {
                              setSelectedModuleId(null);
                            }
                            setSelectedItemId(null);
                          }}
                          className="bg-white border border-slate-200 hover:border-[#FF6B00] rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between shadow-xs"
                        >
                          <div
                            className={`h-32 bg-gradient-to-br ${course.badgeColor} p-5 text-white flex items-center justify-between`}
                          >
                            <div className="space-y-1.5">
                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                {getCourseIcon(course.iconName)}
                              </div>
                              <h2 className="text-lg font-extrabold">
                                {course.title[language] || course.title.UZ}
                              </h2>
                            </div>
                            <TexnoQadamRobot pose={course.robotPose} size="sm" caption="" />
                          </div>

                          <div className="p-5 space-y-4">
                            <p className="text-xs text-slate-600">
                              {course.description[language] || course.description.UZ}
                            </p>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-500">Natija (Progress)</span>
                                <span className="text-[#FF6B00] font-mono tabular-nums">
                                  {completedInCourse}/{allCourseItemIds.length} ({pct}%)
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full bg-[#FF6B00] transition-all duration-300"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* LEVEL 2: MODULE / CLASS / LEVEL SELECTION (e.g. HTML..Python, A1..B2, 1-sinf..11-sinf) */}
            {selectedCourse && !selectedModule && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseId(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF6B00]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t.backToCourses}</span>
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      {selectedCourse.title[language] || selectedCourse.title.UZ}
                    </h1>
                  </div>
                  <TexnoQadamRobot pose={selectedCourse.robotPose} size="sm" caption="" />
                </div>

                {/* Recommendation banner for Rus tili, Matematika, Ona tili */}
                {selectedCourse.recommendationBanner && (
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-sm font-bold flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#FF6B00] shrink-0" />
                    <span>
                      {selectedCourse.recommendationBanner[language] ||
                        selectedCourse.recommendationBanner.UZ}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCourse.modules.map((mod) => {
                    const doneCount = mod.items.filter((i) =>
                      student.completedItemIds.includes(i.id)
                    ).length;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setSelectedItemId(null);
                        }}
                        className="bg-white border border-slate-200 hover:border-[#FF6B00] rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {mod.title[language] || mod.title.UZ}
                          </h3>
                          <span className="text-xs font-mono font-bold text-[#FF6B00]">
                            {doneCount}/{mod.items.length}
                          </span>
                        </div>
                        {mod.subtitle && (
                          <p className="text-xs text-slate-500">
                            {mod.subtitle[language] || mod.subtitle.UZ}
                          </p>
                        )}
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#FF6B00]"
                            style={{
                              width: `${
                                mod.items.length > 0
                                  ? Math.round((doneCount / mod.items.length) * 100)
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LEVEL 3: SEQUENTIAL LESSONS / TESTS / PRACTICALS INSIDE SELECTED MODULE */}
            {selectedCourse && selectedModule && !selectedItem && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCourse.modules.length > 1) {
                          setSelectedModuleId(null);
                        } else {
                          setSelectedCourseId(null);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF6B00]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>
                        {selectedCourse.modules.length > 1
                          ? t.backToModules
                          : t.backToCourses}
                      </span>
                    </button>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {selectedCourse.title[language] || selectedCourse.title.UZ} ·{' '}
                      {selectedModule.title[language] || selectedModule.title.UZ}
                    </h1>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {selectedModule.items.map((item, idx) => {
                    const unlocked = isItemUnlocked(selectedModule, idx);
                    const completed = student.completedItemIds.includes(item.id);
                    const subForThis = submissions.find((s) => s.itemId === item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectCurriculumItem(selectedModule, idx)}
                        className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                          unlocked
                            ? 'cursor-pointer hover:bg-orange-50/40'
                            : 'cursor-not-allowed bg-slate-50/70 opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-extrabold ${
                              completed
                                ? 'bg-emerald-100 text-emerald-700'
                                : unlocked
                                ? 'bg-orange-100 text-[#FF6B00]'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {completed ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : unlocked ? (
                              idx + 1
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">
                              {item.title[language] || item.title.UZ}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>
                                {item.type === 'lesson'
                                  ? 'Dars'
                                  : item.type === 'test'
                                  ? 'Test'
                                  : 'Amaliy ish'}
                              </span>
                              <span>·</span>
                              <span className="font-mono text-orange-600 font-semibold">
                                +{item.rewardCoins} Coin · +{item.rewardPoints} Point
                              </span>
                              {subForThis && (
                                <>
                                  <span>·</span>
                                  <span
                                    className={`font-bold ${
                                      subForThis.status === 'Approved'
                                        ? 'text-emerald-600'
                                        : subForThis.status === 'Rejected'
                                        ? 'text-rose-600'
                                        : 'text-amber-600'
                                    }`}
                                  >
                                    {subForThis.status}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {completed ? (
                            <span className="text-xs font-bold text-emerald-600">
                              {t.lessonCompletedBadge}
                            </span>
                          ) : unlocked ? (
                            <span className="text-xs font-bold text-[#FF6B00]">
                              Ochish →
                            </span>
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LEVEL 4: ACTIVE LESSON / TEST / PRACTICAL PAGE */}
            {selectedCourse && selectedModule && selectedItem && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedItemId(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF6B00]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Ro‘yxatga qaytish ({selectedModule.title.UZ})</span>
                  </button>

                  <div className="text-xs font-mono font-bold text-[#FF6B00]">
                    Mukofot: +{selectedItem.rewardCoins} Coin · +{selectedItem.rewardPoints} Point
                  </div>
                </div>

                {/* Lesson Header & Content Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#FF6B00] uppercase">
                        {selectedCourse.title.UZ} · Bosqich #{selectedItem.order}
                      </div>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                        {selectedItem.title[language] || selectedItem.title.UZ}
                      </h1>
                    </div>
                    <TexnoQadamRobot pose={selectedCourse.robotPose} size="sm" caption="" />
                  </div>

                  <div className="prose max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                    <p>{selectedItem.content[language] || selectedItem.content.UZ}</p>
                  </div>

                  {/* Code Example if Lesson has one */}
                  {selectedItem.type === 'lesson' && selectedItem.codeExample && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-500">
                        Kod namunasi:
                      </div>
                      <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm overflow-x-auto">
                        {selectedItem.codeExample}
                      </pre>
                    </div>
                  )}

                  {/* CASE A: STANDARD LESSON COMPLETION */}
                  {selectedItem.type === 'lesson' && (
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      {student.completedItemIds.includes(selectedItem.id) ? (
                        <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Ushbu dars yakunlangan (+25 Coin, +25 Point olindi)</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Darsni o‘qib bo‘lgach, yakunlash tugmasini bosing:
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCompleteLesson(selectedItem, selectedModule)}
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
                      >
                        {student.completedItemIds.includes(selectedItem.id)
                          ? t.nextLessonBtn
                          : t.completeLessonBtn}
                      </button>
                    </div>
                  )}

                  {/* CASE B: STANDALONE TEST */}
                  {selectedItem.type === 'test' && selectedItem.testQuestions && (
                    <div className="space-y-5 pt-4 border-t border-slate-100">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {t.testSection} (+30 Coin, +30 Point)
                      </h3>

                      <div className="space-y-5">
                        {selectedItem.testQuestions.map((q, qIdx) => {
                          const opts = q.options[language] || q.options.UZ;
                          return (
                            <div key={q.id} className="space-y-2.5">
                              <div className="text-sm font-bold text-slate-800">
                                {qIdx + 1}. {q.question[language] || q.question.UZ}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {opts.map((opt, oIdx) => {
                                  const selected = quizAnswers[q.id] === oIdx;
                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() =>
                                        setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                      }
                                      className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                                        selected
                                          ? 'border-[#FF6B00] bg-orange-50 text-slate-900'
                                          : 'border-slate-200 hover:border-slate-300 bg-white'
                                      }`}
                                    >
                                      <span className="font-bold text-orange-600 mr-2">
                                        {String.fromCharCode(65 + oIdx)}.
                                      </span>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {quizFeedback && (
                        <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs sm:text-sm font-bold">
                          {quizFeedback}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCompleteTest(selectedItem, selectedModule)}
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm"
                      >
                        Testni tekshirish va yakunlash (+30 Coin, +30 Point)
                      </button>
                    </div>
                  )}
                </div>

                {/* CASE C: PRACTICAL ASSIGNMENTS (CODE / VOICE / SCREENSHOT) */}
                {selectedItem.type === 'practical' && (
                  <div className="space-y-6">
                    {/* Submission Status Banner if already submitted */}
                    {(() => {
                      const existingSub = submissions.find(
                        (s) => s.itemId === selectedItem.id
                      );
                      if (!existingSub) return null;
                      return (
                        <div
                          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-start gap-3 ${
                            existingSub.status === 'Approved'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : existingSub.status === 'Rejected'
                              ? 'bg-rose-50 border-rose-200 text-rose-900'
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}
                        >
                          <div className="space-y-1">
                            <div>
                              Holat: [{existingSub.status}] —{' '}
                              {existingSub.status === 'Approved'
                                ? t.approvedStatus
                                : existingSub.status === 'Rejected'
                                ? t.rejectedStatus
                                : t.pendingAdminReview}
                            </div>
                            {existingSub.adminReason && (
                              <div className="text-xs font-normal">
                                Admin izohi: {existingSub.adminReason}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* 1. CODE COMPILER (HTML, CSS, Bootstrap, JS, React, Python) */}
                    {selectedItem.practicalMode === 'code' && (
                      <CodeCompiler
                        language={language}
                        codeLanguage={selectedItem.codeLanguage || 'html'}
                        initialCode={selectedItem.starterCode || ''}
                        isSubmitting={isSubmitting}
                        existingStatus={
                          submissions.find((s) => s.itemId === selectedItem.id)?.status
                        }
                        onSubmitCode={async (code, output) => {
                          await handleSubmitPracticalToAdmin(selectedItem, {
                            submittedCode: code,
                            codeOutput: output,
                          });
                        }}
                      />
                    )}

                    {/* 2. VOICE + AI CHECKING (English, Rus tili, Matematika, Ona tili) */}
                    {selectedItem.practicalMode === 'voice' && (
                      <VoicePractical
                        language={language}
                        item={selectedItem}
                        studentToken={token}
                        isCompleted={student.completedItemIds.includes(selectedItem.id)}
                        onSuccessUnlock={async () => {
                          triggerToast(
                            'Amaliy muvaffaqiyatli bajarildi! +70 Coin, +70 Point!'
                          );
                          await fetchStudentDashboard();
                        }}
                      />
                    )}

                    {/* 3. SCREENSHOT UPLOAD (Tilda, Git, Grafik dizayn, Telegram bot, Sun'iy intellekt) */}
                    {selectedItem.practicalMode === 'screenshot' && (
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {t.screenshotPrompt}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Natija screenshotini tanlang va Admin CRM tekshiruvi uchun yuboring (+70 Coin, +70 Point).
                          </p>
                        </div>

                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-300 hover:border-[#FF6B00] rounded-2xl p-8 cursor-pointer bg-orange-50/30 transition-colors">
                          <Upload className="w-8 h-8 text-[#FF6B00] mb-2" />
                          <span className="text-sm font-bold text-slate-800">
                            {t.uploadScreenshot} (PNG, JPG)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotFileChange}
                            className="hidden"
                          />
                        </label>

                        {screenshotDataUrl && (
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-600">
                              Tanlangan Screenshot:
                            </div>
                            <img
                              src={screenshotDataUrl}
                              alt="Preview"
                              referrerPolicy="no-referrer"
                              className="max-h-64 rounded-xl border border-slate-200 object-contain"
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          disabled={!screenshotDataUrl || isSubmitting}
                          onClick={() =>
                            handleSubmitPracticalToAdmin(selectedItem, {
                              screenshotDataUrl,
                            })
                          }
                          className="px-6 py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-colors"
                        >
                          {isSubmitting ? 'Yuborilmoqda...' : t.submitPracticalBtn}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== PAGE 3: COINSHOP ==================== */}
        {page === 'coinshop' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#FF6B00] uppercase">
                  TexnoQadam · Rasmiy Do‘kon
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  CoinShop — Bilimingizni sovg‘alarga aylantiring!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                  {t.coinShopSubtitle}
                </p>
                <p className="text-xs text-orange-700 font-semibold">
                  {t.coinShopRuleInfo}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <div className="text-xs font-bold text-amber-800">Balansingiz</div>
                  <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums mt-0.5">
                    🪙 {student.coins}
                  </div>
                </div>
                <TexnoQadamRobot pose="celebrating" size="md" caption="" />
              </div>
            </div>

            {/* 16 Official CoinShop Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coinShop.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 hover:border-[#FF6B00] rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5 shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        #{item.order}
                      </span>
                      <span className="text-sm font-mono font-extrabold text-amber-600 tabular-nums">
                        🪙 {item.priceCoins} Coin
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {item.title[language] || item.title.UZ}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description[language] || item.description.UZ}
                    </p>
                  </div>

                  {/* CRITICAL RULE: Opens https://t.me/a_ikromboyev WITHOUT subtracting coins */}
                  <a
                    href="https://t.me/a_ikromboyev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs whitespace-nowrap"
                  >
                    <span>{t.executeExchangeBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PAGE 4: PROFIL ==================== */}
        {page === 'profile' && (
          <div className="space-y-6">
            {/* Profile Main Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <AvatarBadge avatarId={student.avatarId} size="xl" />
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-[#FF6B00]">
                    @{student.username}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {student.firstName} {student.lastName}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Peshqadamlar jadvalida: <strong className="text-slate-900">#{studentRank}-{t.rankPlace}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <div className="text-xs text-amber-800 font-bold">🪙 Coin</div>
                  <div className="text-xl font-extrabold text-amber-600 font-mono tabular-nums">
                    {student.coins}
                  </div>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                  <div className="text-xs text-indigo-800 font-bold">⭐ Point</div>
                  <div className="text-xl font-extrabold text-indigo-600 font-mono tabular-nums">
                    {student.points}
                  </div>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-orange-50 border border-orange-200 text-center">
                  <div className="text-xs text-orange-800 font-bold">🔥 Strike</div>
                  <div className="text-xl font-extrabold text-orange-600 font-mono tabular-nums">
                    {student.strike} {t.daysUnit}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs sm:text-sm font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </div>

            {/* Predefined Avatar Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-900">
                {t.chooseAvatar}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {PREDEFINED_AVATARS.map((av) => {
                  const isCurrent = student.avatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleSelectAvatar(av.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        isCurrent
                          ? 'border-[#FF6B00] bg-orange-50/70 ring-2 ring-orange-500/20'
                          : 'border-slate-200 hover:border-orange-300 bg-white'
                      }`}
                    >
                      <AvatarBadge avatarId={av.id} size="md" />
                      <span className="text-xs font-bold text-slate-700 text-center truncate max-w-full">
                        {av.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Course Progress Overview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-900">
                {t.courseProgress}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedCourses.map((course) => {
                  const allIds = course.modules.flatMap((m) => m.items.map((i) => i.id));
                  const doneCount = allIds.filter((id) =>
                    student.completedItemIds.includes(id)
                  ).length;
                  const pct =
                    allIds.length > 0 ? Math.round((doneCount / allIds.length) * 100) : 0;

                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span>{course.title[language] || course.title.UZ}</span>
                        <span className="font-mono text-[#FF6B00] tabular-nums">
                          {doneCount}/{allIds.length} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B00]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
