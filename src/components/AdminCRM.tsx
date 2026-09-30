import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  HelpCircle,
  ClipboardCheck,
  ShoppingBag,
  Coins,
  Star,
  Flame,
  Trophy,
  Bell,
  Settings,
  LogOut,
  Plus,
  Check,
  X,
  Eye,
  KeyRound,
  Ban,
  CheckCircle,
  RotateCcw,
  Send,
  Search,
} from 'lucide-react';
import {
  Course,
  StudentUser,
  PracticalSubmission,
  TransactionRecord,
  NotificationItem,
  CoinShopProduct,
} from '../types';
import { TexnoQadamLogo, TexnoQadamRobot, AvatarBadge } from './Branding';
import { PREDEFINED_AVATARS } from '../translations';

type AdminTab =
  | 'Dashboard'
  | 'Students'
  | 'Courses'
  | 'Lessons'
  | 'Tests'
  | 'Practical Tasks'
  | 'CoinShop'
  | 'Coins'
  | 'Points'
  | 'Strike'
  | 'Leaderboard'
  | 'Notifications'
  | 'Settings';

export const AdminCRM: React.FC = () => {
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem('tq_admin_token')
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');

  // CRM Data States
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<PracticalSubmission[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [coinShop, setCoinShop] = useState<CoinShopProduct[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Student Modal / Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAvatarId, setNewAvatarId] = useState('robot-welcome');
  const [newAssignedCourses, setNewAssignedCourses] = useState<string[]>([
    'web-dasturlash',
    'english',
  ]);

  // Selected Student for Course Assignment / Activity / Reset Password Modal
  const [courseAssignStudent, setCourseAssignStudent] = useState<StudentUser | null>(null);
  const [tempAssignedIds, setTempAssignedIds] = useState<string[]>([]);
  const [activityStudent, setActivityStudent] = useState<StudentUser | null>(null);
  const [passwordResetStudent, setPasswordResetStudent] = useState<StudentUser | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  // Coin & Point Adjustment Form
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [adjustReason, setAdjustReason] = useState<string>('A’lo darajadagi faollik uchun');

  // Practical Rejection Reason
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  // Custom Lesson Creator
  const [lessonCourseId, setLessonCourseId] = useState('web-dasturlash');
  const [lessonModuleId, setLessonModuleId] = useState('web-html');
  const [lessonTitleUz, setLessonTitleUz] = useState('');
  const [lessonContentUz, setLessonContentUz] = useState('');
  const [lessonType, setLessonType] = useState<'lesson' | 'practical' | 'test'>('lesson');

  // Custom Notification Sender
  const [notifTargetId, setNotifTargetId] = useState('ALL');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdminData = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('tq_admin_token');
        setAdminToken(null);
        return;
      }
      const data = await res.json();
      setStudents(data.students || []);
      setCourses(data.courses || []);
      setSubmissions(data.submissions || []);
      setTransactions(data.transactions || []);
      setNotifications(data.notifications || []);
      setCoinShop(data.coinShop || []);
      if (!selectedStudentId && data.students?.length > 0) {
        setSelectedStudentId(data.students[0].id);
      }
    } catch {
      // ignore transient error
    }
  }, [adminToken, selectedStudentId]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Username yoki parol noto‘g‘ri.');
        return;
      }
      localStorage.setItem('tq_admin_token', data.token);
      setAdminToken(data.token);
      window.history.replaceState({}, '', '/admin/dashboard');
    } catch {
      setLoginError('Server bilan aloqa xatoligi.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('tq_admin_token');
    setAdminToken(null);
    window.history.replaceState({}, '', '/admin');
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newUsername || !newPassword) return;
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        firstName: newFirstName,
        lastName: newLastName,
        username: newUsername,
        password: newPassword,
        avatarId: newAvatarId,
        assignedCourseIds: newAssignedCourses,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`O‘quvchi ${newFirstName} ${newLastName} muvaffaqiyatli yaratildi!`);
      setShowCreateModal(false);
      setNewFirstName('');
      setNewLastName('');
      setNewUsername('');
      setNewPassword('');
      fetchAdminData();
    } else {
      showToast(data.error || 'Xatolik yuz berdi');
    }
  };

  const handleToggleStudentStatus = async (student: StudentUser) => {
    await fetch(`/api/admin/students/${student.id}/toggle-active`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    showToast(
      `${student.firstName} ${student.lastName} holati o‘zgartirildi!`
    );
    fetchAdminData();
  };

  const handleSaveCourseAssignment = async () => {
    if (!courseAssignStudent) return;
    await fetch(`/api/admin/students/${courseAssignStudent.id}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ assignedCourseIds: tempAssignedIds }),
    });
    showToast(`${courseAssignStudent.firstName} uchun kurslar saqlandi!`);
    setCourseAssignStudent(null);
    fetchAdminData();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetStudent || !resetPasswordValue) return;
    await fetch(`/api/admin/students/${passwordResetStudent.id}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ newPassword: resetPasswordValue }),
    });
    showToast(`${passwordResetStudent.username} paroli yangilandi!`);
    setPasswordResetStudent(null);
    setResetPasswordValue('');
  };

  const handleAdjustCoinsOrPoints = async (
    kind: 'coin' | 'point',
    direction: 'add' | 'remove',
    targetStudentId?: string,
    customAmount?: number,
    customReason?: string
  ) => {
    const sid = targetStudentId || selectedStudentId;
    const amt = customAmount ?? adjustAmount;
    const rsn = customReason ?? adjustReason;
    if (!sid || !amt || amt <= 0) return;

    const delta = direction === 'add' ? Math.abs(amt) : -Math.abs(amt);
    const res = await fetch(`/api/admin/students/${sid}/adjust-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        type: kind,
        delta,
        reason: rsn || 'AdminCRM adjustment',
      }),
    });
    if (res.ok) {
      showToast(
        `${delta > 0 ? '+' : ''}${delta} ${kind === 'coin' ? 'Coin' : 'Point'} muvaffaqiyatli bajarildi!`
      );
      fetchAdminData();
    }
  };

  const handleResetStrike = async (studentId: string, newStrike = 0) => {
    await fetch(`/api/admin/students/${studentId}/strike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ strike: newStrike }),
    });
    showToast(`Strike yangilandi: ${newStrike} kun`);
    fetchAdminData();
  };

  const handleReviewSubmission = async (
    submissionId: string,
    decision: 'Approved' | 'Rejected'
  ) => {
    const reason = rejectReasons[submissionId] || '';
    const res = await fetch(`/api/admin/submissions/${submissionId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: decision, adminReason: reason }),
    });
    if (res.ok) {
      showToast(
        decision === 'Approved'
          ? 'Amaliy ish qabul qilindi (+70 Coin, +70 Point)!'
          : 'Amaliy ish rad etildi va o‘quvchiga xabar yuborildi.'
      );
      fetchAdminData();
    }
  };

  const handleAddCurriculumItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitleUz || !lessonContentUz) return;
    const res = await fetch('/api/admin/curriculum/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        courseId: lessonCourseId,
        moduleId: lessonModuleId,
        type: lessonType,
        titleUz: lessonTitleUz,
        contentUz: lessonContentUz,
      }),
    });
    if (res.ok) {
      showToast('Yangi o‘quv bosqichi qo‘shildi!');
      setLessonTitleUz('');
      setLessonContentUz('');
      fetchAdminData();
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        studentId: notifTargetId,
        title: notifTitle,
        message: notifMessage,
      }),
    });
    showToast('Bildirishnoma yuborildi!');
    setNotifTitle('');
    setNotifMessage('');
    fetchAdminData();
  };

  // IF NOT LOGGED IN AS ADMIN -> SHOW SEPARATE ADMIN CRM LOGIN PAGE
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <TexnoQadamLogo size="lg" darkText={false} />
            <div className="pt-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                ADMIN CRM
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                TexnoQadam — Kurs Bor Boshqaruv Tizimi
              </p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username kiriting"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-sm transition-colors shadow-lg shadow-orange-600/20"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sidebarItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'Students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'Courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Lessons', label: 'Lessons', icon: <FileText className="w-4 h-4" /> },
    { id: 'Tests', label: 'Tests', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'Practical Tasks', label: 'Practical Tasks', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'CoinShop', label: 'CoinShop', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'Coins', label: 'Coins', icon: <Coins className="w-4 h-4" /> },
    { id: 'Points', label: 'Points', icon: <Star className="w-4 h-4" /> },
    { id: 'Strike', label: 'Strike', icon: <Flame className="w-4 h-4" /> },
    { id: 'Leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'Notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'Settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const sortedLeaderboard = [...students].sort((a, b) =>
    b.points !== a.points ? b.points - a.points : a.username.localeCompare(b.username)
  );

  const pendingSubmissions = submissions.filter((s) => s.status === 'Pending');
  const filteredStudents = students.filter(
    (st) =>
      st.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${st.firstName} ${st.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-orange-500/40 text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-orange-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin CRM Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-950 text-slate-200 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <TexnoQadamLogo size="sm" darkText={false} />
          <span className="text-xs font-mono text-orange-400 font-bold">CRM</span>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible flex-1">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.id === 'Practical Tasks' && pendingSubmissions.length > 0 && (
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-white text-orange-600">
                    {pendingSubmissions.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main CRM Viewport */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Admin CRM · {activeTab}
            </h1>
            <p className="text-xs text-slate-500">
              TexnoQadam (Kurs Bor) o‘quv jarayonini markazlashgan boshqarish paneli
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi O‘quvchi Yaratish</span>
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-slate-500">Jami O‘quvchilar</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {students.length}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    Faol: {students.filter((s) => s.isActive).length} ta
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-slate-500">Asosiy Kurslar</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {courses.length}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Barcha modullar va sinflar faol
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-slate-500">
                    Kutilayotgan Amaliy Ishlar
                  </div>
                  <div className="text-3xl font-extrabold text-orange-600 mt-1 tabular-nums">
                    {pendingSubmissions.length}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Jami yuborilgan: {submissions.length} ta
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-semibold text-slate-500">
                    Tranzaksiyalar Tarixi
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {transactions.length}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Coin, Point va Strike yozuvlari
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    TexnoQadam Admin CRM Nazorat Markazi
                  </h2>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    Bu yerdan o‘quvchi hisoblarini yaratish, ularga kurslarni biriktirish,
                    yuborilgan kod va screenshot amaliy ishlarini tasdiqlash yoki rad etish,
                    shuningdek Coin, Point va Strike ko‘rsatkichlarini boshqarishingiz mumkin.
                  </p>
                </div>
                <TexnoQadamRobot pose="welcome" size="md" caption="Admin CRM Faol" />
              </div>
            </div>
          )}

          {/* 2. STUDENTS MANAGEMENT TABLE */}
          {activeTab === 'Students' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="O‘quvchi qidirish (ism yoki username)..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Ko‘rsatilmoqda: {filteredStudents.length} ta o‘quvchi
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Courses</th>
                      <th className="py-3 px-4 text-right">Coins</th>
                      <th className="py-3 px-4 text-right">Points</th>
                      <th className="py-3 px-4 text-right">Strike</th>
                      <th className="py-3 px-4">Activity</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {st.username}
                          {!st.isActive && (
                            <span className="ml-2 text-rose-600 font-sans text-xs">
                              (Bloklangan)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <AvatarBadge avatarId={st.avatarId} size="sm" />
                            <span className="font-semibold text-slate-900">
                              {st.firstName} {st.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              setCourseAssignStudent(st);
                              setTempAssignedIds(st.assignedCourseIds);
                            }}
                            className="text-xs font-semibold text-[#FF6B00] hover:underline whitespace-nowrap"
                          >
                            {st.assignedCourseIds.length} ta kurs (Biriktirish)
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-600 tabular-nums">
                          🪙 {st.coins}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 tabular-nums">
                          ⭐ {st.points}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-orange-600 tabular-nums">
                          🔥 {st.strike} kun
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          <div>Darslar: {st.completedLessonsCount}</div>
                          <div>Amaliy: {st.approvedPracticalsCount}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActivityStudent(st)}
                              title="Profil va Faollik"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPasswordResetStudent(st);
                                setResetPasswordValue('');
                              }}
                              title="Parolni yangilash"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStudentStatus(st)}
                              title={st.isActive ? 'O‘chirish (Disable)' : 'Yoqish (Enable)'}
                              className={`p-1.5 rounded-lg ${
                                st.isActive
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            >
                              {st.isActive ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. COURSES & COURSE ASSIGNMENT */}
          {activeTab === 'Courses' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  O‘quvchiga Kurs Biriktirish (Course Assignment)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Student tanlang:
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName} (@{s.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const st = students.find((s) => s.id === selectedStudentId);
                    if (!st) return null;
                    return (
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-slate-600">
                          Available Courses ({st.firstName} {st.lastName}):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {courses.map((c) => {
                            const checked = st.assignedCourseIds.includes(c.id);
                            return (
                              <label
                                key={c.id}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs sm:text-sm font-medium"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={async (e) => {
                                    const next = e.target.checked
                                      ? [...st.assignedCourseIds, c.id]
                                      : st.assignedCourseIds.filter((id) => id !== c.id);
                                    await fetch(`/api/admin/students/${st.id}/courses`, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${adminToken}`,
                                      },
                                      body: JSON.stringify({ assignedCourseIds: next }),
                                    });
                                    showToast(`${c.title.UZ} yangilandi!`);
                                    fetchAdminData();
                                  }}
                                  className="w-4 h-4 accent-[#FF6B00]"
                                />
                                <span>{c.title.UZ}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {courses.map((c) => {
                  const totalItems = c.modules.reduce((acc, m) => acc + m.items.length, 0);
                  return (
                    <div
                      key={c.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2"
                    >
                      <div className="text-xs font-mono text-orange-600 font-semibold">
                        #{c.order} · {c.modules.length} bo‘lim · {totalItems} bosqich
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{c.title.UZ}</h3>
                      <p className="text-xs text-slate-500">{c.description.UZ}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4 & 5. LESSONS & TESTS MANAGEMENT */}
          {(activeTab === 'Lessons' || activeTab === 'Tests') && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddCurriculumItem}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
              >
                <h2 className="text-base font-bold text-slate-900">
                  Yangi Dars / Test / Amaliy Ish Qo‘shish
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Kurs
                    </label>
                    <select
                      value={lessonCourseId}
                      onChange={(e) => {
                        const cid = e.target.value;
                        setLessonCourseId(cid);
                        const foundCourse = courses.find((c) => c.id === cid);
                        if (foundCourse && foundCourse.modules[0]) {
                          setLessonModuleId(foundCourse.modules[0].id);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title.UZ}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Bo‘lim / Sinf / Daraja
                    </label>
                    <select
                      value={lessonModuleId}
                      onChange={(e) => setLessonModuleId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      {courses
                        .find((c) => c.id === lessonCourseId)
                        ?.modules.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title.UZ}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Turi
                    </label>
                    <select
                      value={lessonType}
                      onChange={(e) =>
                        setLessonType(e.target.value as 'lesson' | 'practical' | 'test')
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      <option value="lesson">Dars (+25 Coin / +25 Point)</option>
                      <option value="test">Test (+30 Coin / +30 Point)</option>
                      <option value="practical">Amaliy ish (+70 Coin / +70 Point)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Sarlavha (UZ)
                  </label>
                  <input
                    type="text"
                    value={lessonTitleUz}
                    onChange={(e) => setLessonTitleUz(e.target.value)}
                    placeholder="Masalan: Dars 75 — HTML Web Components"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Dars matni yoki topshiriq mazmuni
                  </label>
                  <textarea
                    value={lessonContentUz}
                    onChange={(e) => setLessonContentUz(e.target.value)}
                    rows={3}
                    placeholder="Dars mazmuni va misollar..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-sm font-bold"
                >
                  Qo‘shish va Saqlash
                </button>
              </form>

              {/* Current Module Lessons Preview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Tanlangan bo‘limdagi mavjud darslar va testlar ro‘yxati
                </h3>
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                  {courses
                    .find((c) => c.id === lessonCourseId)
                    ?.modules.find((m) => m.id === lessonModuleId)
                    ?.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm"
                      >
                        <div>
                          <span className="font-mono text-slate-400 mr-2">#{item.order}</span>
                          <span className="font-semibold text-slate-800">{item.title.UZ}</span>
                        </div>
                        <span className="text-xs font-mono text-orange-600 shrink-0">
                          +{item.rewardCoins} Coin / +{item.rewardPoints} Point
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. PRACTICAL TASKS REVIEW */}
          {activeTab === 'Practical Tasks' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Amaliy Topshiriqlar Tekshiruvi (Screenshot va Kod)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tasdiqlanganda o‘quvchiga avtomatik +70 Coin, +70 Point beriladi va keyingi dars ochiladi.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-orange-600">
                  Jami: {submissions.length} ta
                </span>
              </div>

              {submissions.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 text-sm">
                  Hozircha yuborilgan amaliy ishlar yo‘q.
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">
                            {sub.studentName} (@{sub.studentUsername})
                          </span>
                          <span className="mx-2 text-slate-300">·</span>
                          <span className="text-xs font-semibold text-orange-600">
                            {sub.courseTitle} / {sub.moduleTitle}
                          </span>
                          <div className="text-xs text-slate-600 font-medium mt-0.5">
                            Topshiriq: {sub.itemTitle}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-400 font-mono">
                            {new Date(sub.submittedAt).toLocaleString()}
                          </span>
                          <span
                            className={`font-bold ${
                              sub.status === 'Approved'
                                ? 'text-emerald-600'
                                : sub.status === 'Rejected'
                                ? 'text-rose-600'
                                : 'text-amber-600'
                            }`}
                          >
                            Holat: {sub.status}
                          </span>
                        </div>
                      </div>

                      {/* Submitted Screenshot or Code */}
                      {sub.screenshotDataUrl && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-semibold text-slate-500">
                            Yuklangan Screenshot:
                          </div>
                          <img
                            src={sub.screenshotDataUrl}
                            alt="Student Screenshot Submission"
                            referrerPolicy="no-referrer"
                            className="max-h-72 rounded-xl border border-slate-200 object-contain bg-slate-50"
                          />
                        </div>
                      )}

                      {sub.submittedCode && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-semibold text-slate-500">
                            Yuborilgan Kod:
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto max-h-56">
                            {sub.submittedCode}
                          </pre>
                        </div>
                      )}

                      {sub.voiceTranscript && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-semibold">Ovozli javob matni: </span>
                          <span>“{sub.voiceTranscript}”</span>
                        </div>
                      )}

                      {/* Approve / Reject Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <input
                          type="text"
                          value={rejectReasons[sub.id] || ''}
                          onChange={(e) =>
                            setRejectReasons((prev) => ({
                              ...prev,
                              [sub.id]: e.target.value,
                            }))
                          }
                          placeholder="Rad etish sababi (ixtiyoriy)..."
                          className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReviewSubmission(sub.id, 'Approved')}
                            disabled={sub.status === 'Approved'}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span>Qabul qilish (+70 Coin / +70 Point)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReviewSubmission(sub.id, 'Rejected')}
                            disabled={sub.status === 'Rejected'}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Rad etish</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7, 8, 9. COINSHOP, COINS, POINTS MANAGEMENT */}
          {(activeTab === 'Coins' || activeTab === 'Points' || activeTab === 'CoinShop') && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  {activeTab === 'Points'
                    ? 'Admin Point Boshqaruvi (Add / Remove Points)'
                    : 'Admin Coin & CoinShop Boshqaruvi (Add / Remove Coins)'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Student
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName} — 🪙 {s.coins} | ⭐ {s.points}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Amount (Miqdor)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Reason (Sabab)
                    </label>
                    <input
                      type="text"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      placeholder="Excellent work / CoinShop exchange"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {activeTab !== 'Points' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAdjustCoinsOrPoints('coin', 'add')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold"
                      >
                        + Add Coins
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustCoinsOrPoints('coin', 'remove')}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold"
                      >
                        - Remove Coins
                      </button>
                    </>
                  )}

                  {activeTab === 'Points' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAdjustCoinsOrPoints('point', 'add')}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold"
                      >
                        + Add Points
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustCoinsOrPoints('point', 'remove')}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold"
                      >
                        - Remove Points
                      </button>
                    </>
                  )}
                </div>
              </div>

              {activeTab === 'CoinShop' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    CoinShop Mahsulotlari (16 ta rasmiy paket)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {coinShop.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-2 bg-slate-50/50"
                      >
                        <div>
                          <div className="text-xs font-mono text-orange-600 font-bold">
                            #{item.order} · 🪙 {item.priceCoins} Coin
                          </div>
                          <div className="text-sm font-bold text-slate-900 mt-1">
                            {item.title.UZ}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAdjustAmount(item.priceCoins);
                            setAdjustReason(`CoinShop: ${item.title.UZ}`);
                            showToast(
                              `Miqdor tanlandi: ${item.priceCoins} Coin (${item.title.UZ})`
                            );
                          }}
                          className="text-xs font-semibold text-[#FF6B00] hover:underline text-left"
                        >
                          Qiymatni formaga ko‘chirish →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions History Log */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Tranzaksiyalar Tarixi (Transaction Logs)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2.5 px-3">Vaqt</th>
                        <th className="py-2.5 px-3">O‘quvchi</th>
                        <th className="py-2.5 px-3">Tur</th>
                        <th className="py-2.5 px-3">Miqdor</th>
                        <th className="py-2.5 px-3">Sabab</th>
                        <th className="py-2.5 px-3">Bajardi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.slice(0, 40).map((tr) => (
                        <tr key={tr.id}>
                          <td className="py-2.5 px-3 font-mono text-xs text-slate-400">
                            {new Date(tr.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {tr.studentName} (@{tr.studentUsername})
                          </td>
                          <td className="py-2.5 px-3 uppercase font-mono text-xs">
                            {tr.type}
                          </td>
                          <td
                            className={`py-2.5 px-3 font-mono font-bold tabular-nums ${
                              tr.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {tr.amount >= 0 ? `+${tr.amount}` : tr.amount}{' '}
                            {tr.type === 'coin' ? 'Coin' : tr.type === 'point' ? 'Point' : 'Kun'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{tr.reason}</td>
                          <td className="py-2.5 px-3 font-mono text-xs text-slate-500">
                            {tr.actor}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 10. STRIKE MANAGEMENT */}
          {activeTab === 'Strike' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                O‘quvchilar Strike Ko‘rsatkichlarini Boshqarish
              </h2>
              <div className="divide-y divide-slate-200">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="py-3.5 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <AvatarBadge avatarId={st.avatarId} size="sm" />
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {st.firstName} {st.lastName} (@{st.username})
                        </div>
                        <div className="text-xs text-slate-500">
                          Oxirgi faol sana: {st.lastStrikeDate || 'Hali boshlanmagan'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-orange-600 text-sm">
                        🔥 {st.strike} kun
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResetStrike(st.id, st.strike + 1)}
                        className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-semibold"
                      >
                        +1 kun
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetStrike(st.id, 0)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset (0)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. LEADERBOARD */}
          {activeTab === 'Leaderboard' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Jonli Peshqadamlar Reytingi (Points DESC)
              </h2>
              <div className="divide-y divide-slate-200">
                {sortedLeaderboard.map((st, idx) => (
                  <div
                    key={st.id}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 font-mono font-extrabold text-orange-600">
                        #{idx + 1}
                      </span>
                      <AvatarBadge avatarId={st.avatarId} size="sm" />
                      <span className="font-bold text-slate-900">
                        {st.firstName} {st.lastName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">@{st.username}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-xs sm:text-sm">
                      <span className="text-amber-600 font-bold">🪙 {st.coins}</span>
                      <span className="text-indigo-600 font-extrabold">⭐ {st.points} Point</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSendNotification}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
              >
                <h2 className="text-base font-bold text-slate-900">
                  O‘quvchilarga Bildirishnoma Yuborish
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Qabul qiluvchi
                    </label>
                    <select
                      value={notifTargetId}
                      onChange={(e) => setNotifTargetId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    >
                      <option value="ALL">Barcha o‘quvchilarga (ALL)</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName} (@{s.username})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Sarlavha
                    </label>
                    <input
                      type="text"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      placeholder="Yangi musobaqa yoki e’lon"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Xabar matni
                  </label>
                  <textarea
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    rows={3}
                    placeholder="Xabar matnini yozing..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-sm font-bold"
                >
                  <Send className="w-4 h-4" />
                  <span>Xabarni Yuborish</span>
                </button>
              </form>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">So‘nggi bildirishnomalar</h3>
                <div className="divide-y divide-slate-100">
                  {notifications.slice(0, 25).map((n) => (
                    <div key={n.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Target: {n.studentId}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{n.title}</div>
                      <div className="text-xs text-slate-600 whitespace-pre-line">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13. SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Tizim Qoidalari va Sozlamalar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">Har bir yakunlangan Dars</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">
                    +25 Coin · +25 Point
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">Har bir muvaffaqiyatli Test</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">
                    +30 Coin · +30 Point
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">Har bir tasdiqlangan Amaliy ish</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">
                    +70 Coin · +70 Point
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: CREATE STUDENT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Yangi O‘quvchi Hisobini Yaratish
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Ism (First name)
                  </label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    required
                    placeholder="Ali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Familiya (Last name)
                  </label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    required
                    placeholder="Valiyev"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Username (Login)
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    placeholder="ali_valiyev"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Parol
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Kamida 4 ta belgi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Biriktiriladigan Kurslar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {courses.map((c) => {
                    const checked = newAssignedCourses.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs font-medium cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAssignedCourses((prev) => [...prev, c.id]);
                            } else {
                              setNewAssignedCourses((prev) =>
                                prev.filter((id) => id !== c.id)
                              );
                            }
                          }}
                          className="accent-[#FF6B00]"
                        />
                        <span>{c.title.UZ}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Boshlang‘ich Avatar:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_AVATARS.slice(0, 6).map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setNewAvatarId(av.id)}
                      className={`p-1 rounded-full border-2 ${
                        newAvatarId === av.id ? 'border-[#FF6B00]' : 'border-transparent'
                      }`}
                    >
                      <AvatarBadge avatarId={av.id} size="sm" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold"
                >
                  O‘quvchini Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COURSE ASSIGNMENT FOR A STUDENT */}
      {courseAssignStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">
              Student: {courseAssignStudent.firstName} {courseAssignStudent.lastName}
            </h3>
            <p className="text-xs text-slate-500">Available Courses:</p>
            <div className="space-y-2">
              {courses.map((c) => {
                const isChecked = tempAssignedIds.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 text-sm font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTempAssignedIds((prev) => [...prev, c.id]);
                        } else {
                          setTempAssignedIds((prev) => prev.filter((id) => id !== c.id));
                        }
                      }}
                      className="w-4 h-4 accent-[#FF6B00]"
                    />
                    <span>{c.title.UZ}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setCourseAssignStudent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCourseAssignment}
                className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT ACTIVITY & PROFILE DETAILS */}
      {activityStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <AvatarBadge avatarId={activityStudent.avatarId} size="md" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {activityStudent.firstName} {activityStudent.lastName}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    @{activityStudent.username}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivityStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Oxirgi kirish (Last login)</div>
                <div className="font-semibold mt-0.5">
                  {activityStudent.lastLogin
                    ? new Date(activityStudent.lastLogin).toLocaleString()
                    : 'Hali kirmagan'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Oxirgi faol sana</div>
                <div className="font-semibold mt-0.5">
                  {activityStudent.lastActiveDate || '—'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Yakunlangan darslar</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums">
                  {activityStudent.completedLessonsCount} ta
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Yakunlangan testlar</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums">
                  {activityStudent.completedTestsCount} ta
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Amaliy ishlar (Yuborilgan / Tasdiqlangan / Rad)</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums">
                  {activityStudent.submittedPracticalsCount} / {activityStudent.approvedPracticalsCount} / {activityStudent.rejectedPracticalsCount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Joriy Strike</div>
                <div className="font-bold text-orange-600 mt-0.5 tabular-nums">
                  🔥 {activityStudent.strike} kun
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Jami ishlab topilgan / Sarflangan Coin</div>
                <div className="font-bold text-amber-600 mt-0.5 tabular-nums">
                  +{activityStudent.coinsEarnedTotal} / -{activityStudent.coinsSpentTotal}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-xs">Jami yig‘ilgan Point</div>
                <div className="font-bold text-indigo-600 mt-0.5 tabular-nums">
                  ⭐ {activityStudent.pointsEarnedTotal}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PASSWORD RESET */}
      {passwordResetStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleResetPassword}
            className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-extrabold text-slate-900">
              Parolni yangilash: @{passwordResetStudent.username}
            </h3>
            <input
              type="password"
              value={resetPasswordValue}
              onChange={(e) => setResetPasswordValue(e.target.value)}
              placeholder="Yangi parol kiriting..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPasswordResetStudent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF6B00] text-white text-xs font-bold"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
