import React, { useEffect, useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  Coins,
  FileCheck,
  Flame,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  ShoppingBag,
  Trophy,
  Users,
  XCircle,
  Eye,
  Lock,
  Check,
  X,
} from 'lucide-react';
import {
  CoinShopProduct,
  Course,
  NotificationItem,
  PracticalSubmission,
  StudentUser,
  TransactionRecord,
} from '../types';
import { PREDEFINED_AVATARS } from '../translations';
import { RobotMascot, TexnoQadamLogo } from './BrandVisuals';

type AdminSection =
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

export const AdminCrmApp: React.FC = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem('tq_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeSection, setActiveSection] = useState<AdminSection>('Dashboard');
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<PracticalSubmission[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [coinShop, setCoinShop] = useState<CoinShopProduct[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Create / Edit Student Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newAvatarId, setNewAvatarId] = useState('robot-welcome');
  const [newAssignedCourses, setNewAssignedCourses] = useState<string[]>([
    'web-dasturlash',
    'english',
  ]);

  // Selected Student for Course Assignment / Activity Detail Modal
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);
  const [editAssignedCourses, setEditAssignedCourses] = useState<string[]>([]);
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  // Coin / Point / Strike Management Form States
  const [targetStudentId, setTargetStudentId] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('500');
  const [reasonInput, setReasonInput] = useState<string>('Excellent work');
  const [strikeInput, setStrikeInput] = useState<string>('7');

  // Practical Rejection Reason Input
  const [rejectReasonMap, setRejectReasonMap] = useState<Record<string, string>>({});

  // Custom Lesson / Test Creator State
  const [customCourseId, setCustomCourseId] = useState<string>('web-dasturlash');
  const [customModuleId, setCustomModuleId] = useState<string>('web-html');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customContent, setCustomContent] = useState<string>('');

  // Notification Sender State
  const [notifStudentId, setNotifStudentId] = useState<string>('ALL');
  const [notifTitle, setNotifTitle] = useState<string>('');
  const [notifMessage, setNotifMessage] = useState<string>('');

  // CoinShop Product Form
  const [shopTitle, setShopTitle] = useState<string>('');
  const [shopPrice, setShopPrice] = useState<string>('3000');

  const [toast, setToast] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOverview = async (adminToken: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) {
        localStorage.removeItem('tq_admin_token');
        setToken('');
        return;
      }
      const data = await res.json();
      setStudents(data.students || []);
      setCourses(data.courses || []);
      setSubmissions(data.submissions || []);
      setTransactions(data.transactions || []);
      setNotifications(data.notifications || []);
      setCoinShop(data.coinShop || []);
      setLeaderboard(data.leaderboard || []);
      if (!targetStudentId && data.students?.length > 0) {
        setTargetStudentId(data.students[0].id);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (token) {
      fetchOverview(token);
      if (window.location.pathname === '/admin') {
        window.history.replaceState({}, '', '/admin/dashboard');
      }
    }
  }, [token]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login yoki parol noto‘g‘ri.');
        return;
      }
      localStorage.setItem('tq_admin_token', data.token);
      setToken(data.token);
      window.history.pushState({}, '', '/admin/dashboard');
    } catch {
      setLoginError('Server bilan bog‘lanishda xatolik.');
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore
    }
    localStorage.removeItem('tq_admin_token');
    setToken('');
    window.history.pushState({}, '', '/admin');
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        firstName: newFirstName,
        lastName: newLastName,
        avatarId: newAvatarId,
        assignedCourseIds: newAssignedCourses,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showNotice(data.error || 'Xatolik');
      return;
    }
    showNotice(`O‘quvchi ${data.student.firstName} ${data.student.lastName} yaratildi!`);
    setShowCreateModal(false);
    setNewUsername('');
    setNewPassword('');
    setNewFirstName('');
    setNewLastName('');
    fetchOverview(token);
  };

  const handleSaveStudentDetails = async () => {
    if (!selectedStudent) return;
    const res = await fetch(`/api/admin/students/${selectedStudent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        assignedCourseIds: editAssignedCourses,
        password: resetPasswordValue.trim() || undefined,
      }),
    });
    if (res.ok) {
      showNotice('O‘quvchi kurslari va ma’lumotlari saqlandi!');
      setResetPasswordValue('');
      setSelectedStudent(null);
      fetchOverview(token);
    }
  };

  const handleToggleStudentActive = async (stu: StudentUser) => {
    const res = await fetch(`/api/admin/students/${stu.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive: !stu.isActive }),
    });
    if (res.ok) {
      showNotice(
        `${stu.firstName} holati: ${!stu.isActive ? 'Faollashtirildi' : 'Faolsizlantirildi'}`
      );
      fetchOverview(token);
    }
  };

  const handleCoinAdjust = async (action: 'add' | 'remove') => {
    if (!targetStudentId) return;
    const res = await fetch(`/api/admin/students/${targetStudentId}/coins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Number(amountInput),
        reason: reasonInput,
        action,
      }),
    });
    if (res.ok) {
      showNotice(
        `Coin muvaffaqiyatli ${action === 'add' ? 'qo‘shildi (+)' : 'ayirildi (-)'}!`
      );
      fetchOverview(token);
    }
  };

  const handlePointAdjust = async (action: 'add' | 'remove') => {
    if (!targetStudentId) return;
    const res = await fetch(`/api/admin/students/${targetStudentId}/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Number(amountInput),
        reason: reasonInput,
        action,
      }),
    });
    if (res.ok) {
      showNotice(
        `Point muvaffaqiyatli ${action === 'add' ? 'qo‘shildi (+)' : 'ayirildi (-)'}!`
      );
      fetchOverview(token);
    }
  };

  const handleStrikeAdjust = async (newStrikeVal: number) => {
    if (!targetStudentId) return;
    const res = await fetch(`/api/admin/students/${targetStudentId}/strike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        strike: newStrikeVal,
        reason: reasonInput || `Strike yangilandi: ${newStrikeVal} kun`,
      }),
    });
    if (res.ok) {
      showNotice(`Strike ko‘rsatkichi ${newStrikeVal} kunga o‘zgartirildi!`);
      fetchOverview(token);
    }
  };

  const handleReviewSubmission = async (subId: string, status: 'Approved' | 'Rejected') => {
    const res = await fetch(`/api/admin/submissions/${subId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        adminReason: rejectReasonMap[subId] || undefined,
      }),
    });
    if (res.ok) {
      showNotice(
        status === 'Approved'
          ? 'Amaliy ish qabul qilindi (+70 Coin, +70 Point, keyingi dars ochildi)!'
          : 'Amaliy ish rad etildi va o‘quvchiga xabar yuborildi.'
      );
      fetchOverview(token);
    }
  };

  const handleAddCurriculumItem = async (itemType: 'lesson' | 'test' | 'practical') => {
    if (!customTitle.trim()) return;
    const res = await fetch('/api/admin/curriculum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId: customCourseId,
        moduleId: customModuleId,
        type: itemType,
        titleUz: customTitle,
        contentUz: customContent || customTitle,
        practicalMode: 'screenshot',
      }),
    });
    if (res.ok) {
      showNotice('Yangi o‘quv materiali muvaffaqiyatli qo‘shildi!');
      setCustomTitle('');
      setCustomContent('');
      fetchOverview(token);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentId: notifStudentId,
        title: notifTitle,
        message: notifMessage,
      }),
    });
    if (res.ok) {
      showNotice('Bildirishnoma o‘quvchi(lar)ga yuborildi!');
      setNotifTitle('');
      setNotifMessage('');
      fetchOverview(token);
    }
  };

  // ==============================================================
  // ADMIN CRM LOGIN PAGE (/admin)
  // ==============================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <TexnoQadamLogo size="lg" showKursBor={true} darkText={true} />
            <div className="pt-2">
              <span className="px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-extrabold uppercase tracking-wider">
                ADMIN CRM
              </span>
              <h1 className="text-2xl font-extrabold mt-2">Boshqaruv tizimiga kirish</h1>
              <p className="text-xs text-slate-400 mt-1">
                Faqat vakolatli administratorlar uchun maxsus CRM paneli
              </p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="AdminCRM"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs font-bold">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-lg transition-colors cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sidebarItems: Array<{ label: AdminSection; icon: React.ReactNode }> = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Students', icon: <Users className="w-4 h-4" /> },
    { label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Lessons', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Tests', icon: <Award className="w-4 h-4" /> },
    { label: 'Practical Tasks', icon: <Activity className="w-4 h-4" /> },
    { label: 'CoinShop', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Coins', icon: <Coins className="w-4 h-4" /> },
    { label: 'Points', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Strike', icon: <Flame className="w-4 h-4" /> },
    { label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-orange-500 text-sm font-bold">
          {toast}
        </div>
      )}

      {/* ============================================================== */}
      {/* ADMIN CRM SIDEBAR */}
      {/* ============================================================== */}
      <aside className="w-full lg:w-64 bg-slate-950 text-white shrink-0 flex flex-col justify-between p-4 border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="space-y-6">
          <div className="px-2 py-1 flex items-center justify-between">
            <TexnoQadamLogo size="sm" showKursBor={true} darkText={true} />
            <span className="text-[10px] font-extrabold bg-orange-500 text-white px-2 py-0.5 rounded-md">
              CRM
            </span>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveSection(item.label)}
                className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeSection === item.label
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.label === 'Practical Tasks' && pendingSubmissionsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                    {pendingSubmissionsCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleAdminLogout}
          className="mt-4 w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* ============================================================== */}
      {/* ADMIN CRM MAIN WORKSPACE */}
      {/* ============================================================== */}
      <main className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6">
        {/* Top Context Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              TexnoQadam — Kurs Bor Admin CRM
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">{activeSection}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi O‘quvchi Yaratish</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. DASHBOARD OVERVIEW */}
        {/* ============================================================ */}
        {activeSection === 'Dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400">Jami O‘quvchilar</span>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {students.length}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400">Jami Kurslar</span>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {courses.length}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400">
                  Kutilayotgan Amaliy Ishlar
                </span>
                <div className="text-2xl font-extrabold text-orange-600 tabular-nums">
                  {pendingSubmissionsCount}
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-400">Tranzaksiyalar soni</span>
                <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">
                  {transactions.length}
                </div>
              </div>
            </div>

            {/* Recent Transactions Log */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                So‘nggi Coin / Point / Strike Tranzaksiyalari
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase">
                      <th className="py-2.5 px-3">O‘quvchi</th>
                      <th className="py-2.5 px-3">Turi</th>
                      <th className="py-2.5 px-3">Miqdor</th>
                      <th className="py-2.5 px-3">Sabab</th>
                      <th className="py-2.5 px-3">Mas’ul</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.slice(0, 12).map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {tx.studentName} (@{tx.studentUsername})
                        </td>
                        <td className="py-2.5 px-3 uppercase font-bold text-slate-600">
                          {tx.type}
                        </td>
                        <td
                          className={`py-2.5 px-3 font-extrabold tabular-nums ${
                            tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{tx.reason}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{tx.actor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. STUDENTS MANAGEMENT TABLE */}
        {/* Username | Name | Courses | Coins | Points | Strike | Activity | Actions */}
        {/* ============================================================ */}
        {activeSection === 'Students' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                O‘quvchilar ro‘yxati va boshqaruvi
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase">
                    <th className="py-3 px-3">Username</th>
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Courses</th>
                    <th className="py-3 px-3">Coins</th>
                    <th className="py-3 px-3">Points</th>
                    <th className="py-3 px-3">Strike</th>
                    <th className="py-3 px-3">Activity</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        @{stu.username}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {stu.firstName} {stu.lastName}
                        {!stu.isActive && (
                          <span className="ml-2 text-[10px] text-rose-600 font-extrabold">
                            (Disabled)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-600">
                        {stu.assignedCourseIds.length} ta kurs
                      </td>
                      <td className="py-3 px-3 font-extrabold text-amber-600 tabular-nums">
                        🪙 {stu.coins}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-sky-600 tabular-nums">
                        ⭐ {stu.points}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-orange-600 tabular-nums">
                        🔥 {stu.strike} kun
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        Dars: {stu.completedLessonsCount} · Test: {stu.completedTestsCount} ·
                        Amaliy: {stu.approvedPracticalsCount}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudent(stu);
                              setEditAssignedCourses(stu.assignedCourseIds);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
                          >
                            Kurslar / Profil
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStudentActive(stu)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                              stu.isActive
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {stu.isActive ? 'Disable' : 'Enable'}
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

        {/* ============================================================ */}
        {/* 3. PRACTICAL TASKS REVIEW (APPROVE OR REJECT) */}
        {/* ============================================================ */}
        {activeSection === 'Practical Tasks' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-extrabold text-slate-900">
                Amaliy topshiriqlar tekshiruvi (Screenshot, Kod va Ovozli)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tasdiqlangan (Approve) amaliy ish uchun o‘quvchiga avtomatik +70 Coin va +70 Point beriladi hamda keyingi dars ochiladi.
              </p>
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                Hozircha yuborilgan amaliy ishlar yo‘q.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-orange-600">
                          {sub.courseTitle} · {sub.moduleTitle}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {sub.itemTitle}
                        </h3>
                        <p className="text-xs text-slate-500">
                          O‘quvchi: <b>{sub.studentName}</b> (@{sub.studentUsername}) · Vaqt:{' '}
                          {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
                          sub.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sub.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    {sub.screenshotDataUrl && (
                      <div>
                        <span className="text-xs font-bold text-slate-500 block mb-1.5">
                          Yuborilgan Screenshot:
                        </span>
                        <img
                          src={sub.screenshotDataUrl}
                          alt="Submission Screenshot"
                          referrerPolicy="no-referrer"
                          className="max-h-72 rounded-xl border border-slate-200 object-contain"
                        />
                      </div>
                    )}

                    {sub.submittedCode && (
                      <div className="bg-slate-950 text-amber-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                        <pre>{sub.submittedCode}</pre>
                      </div>
                    )}

                    {sub.voiceTranscript && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <b>Ovozli javob matni:</b> &ldquo;{sub.voiceTranscript}&rdquo;
                      </div>
                    )}

                    {sub.status === 'Pending' && (
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <input
                          type="text"
                          placeholder="Rad etish sababi (ixtiyoriy)..."
                          value={rejectReasonMap[sub.id] || ''}
                          onChange={(e) =>
                            setRejectReasonMap((prev) => ({
                              ...prev,
                              [sub.id]: e.target.value,
                            }))
                          }
                          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-64"
                        />
                        <button
                          type="button"
                          onClick={() => handleReviewSubmission(sub.id, 'Approved')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve (+70 Coin, +70 Point)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewSubmission(sub.id, 'Rejected')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject (Qayta topshirish)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. COINS, POINTS & STRIKE MANAGEMENT */}
        {/* ============================================================ */}
        {(activeSection === 'Coins' ||
          activeSection === 'Points' ||
          activeSection === 'Strike') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                {activeSection === 'Coins' && 'Admin Coin Management (Add / Remove Coins)'}
                {activeSection === 'Points' && 'Admin Point Management (Add / Remove Points)'}
                {activeSection === 'Strike' && 'Admin Strike Management'}
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student:</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (@{s.username}) — 🪙{s.coins} | ⭐{s.points} | 🔥
                      {s.strike}
                    </option>
                  ))}
                </select>
              </div>

              {activeSection !== 'Strike' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Amount:</label>
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Reason:</label>
                    <input
                      type="text"
                      value={reasonInput}
                      onChange={(e) => setReasonInput(e.target.value)}
                      placeholder="Excellent work"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        activeSection === 'Coins'
                          ? handleCoinAdjust('add')
                          : handlePointAdjust('add')
                      }
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
                    >
                      + Add {activeSection}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        activeSection === 'Coins'
                          ? handleCoinAdjust('remove')
                          : handlePointAdjust('remove')
                      }
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold cursor-pointer"
                    >
                      - Remove {activeSection}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Yangi Strike kunlari soni:
                    </label>
                    <input
                      type="number"
                      value={strikeInput}
                      onChange={(e) => setStrikeInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleStrikeAdjust(Number(strikeInput))}
                      className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold cursor-pointer"
                    >
                      Strike o‘rnatish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStrikeAdjust(0)}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold cursor-pointer"
                    >
                      Reset Strike (0 kun)
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Amallar tarixi (Loglar)</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {tx.studentName} — {tx.reason}
                      </p>
                      <p className="text-slate-400">
                        {tx.actor} · {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`font-extrabold tabular-nums text-sm ${
                        tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} {tx.type.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. COURSES, LESSONS & TESTS MANAGEMENT */}
        {/* ============================================================ */}
        {(activeSection === 'Courses' ||
          activeSection === 'Lessons' ||
          activeSection === 'Tests') && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                Yangi Dars / Test / Amaliy topshiriq qo‘shish
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kurs:</label>
                  <select
                    value={customCourseId}
                    onChange={(e) => {
                      setCustomCourseId(e.target.value);
                      const c = courses.find((cr) => cr.id === e.target.value);
                      if (c && c.modules[0]) setCustomModuleId(c.modules[0].id);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title.UZ}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bo‘lim / Sinf / Daraja:
                  </label>
                  <select
                    value={customModuleId}
                    onChange={(e) => setCustomModuleId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    {(courses.find((c) => c.id === customCourseId)?.modules || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title.UZ} ({m.items.length} ta dars)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Yangi dars yoki test sarlavhasi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <textarea
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={3}
                placeholder="Dars matni yoki topshiriq mazmuni..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAddCurriculumItem('lesson')}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold cursor-pointer"
                >
                  + Dars qo‘shish (+25 🪙)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCurriculumItem('test')}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold cursor-pointer"
                >
                  + Test qo‘shish (+30 ⭐)
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCurriculumItem('practical')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
                >
                  + Amaliy ish qo‘shish (+70 🪙)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => {
                const totalItems = c.modules.reduce((acc, m) => acc + m.items.length, 0);
                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900">{c.title.UZ}</h3>
                      <span className="text-xs font-bold text-orange-600">
                        {c.modules.length} bo‘lim · {totalItems} bosqich
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{c.description.UZ}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. COINSHOP ADMIN VIEW */}
        {/* ============================================================ */}
        {activeSection === 'CoinShop' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                CoinShop Mahsulotlari va O‘quvchi Coin Balanslari
              </h2>
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  value={shopTitle}
                  onChange={(e) => setShopTitle(e.target.value)}
                  placeholder="Yangi mahsulot nomi..."
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-64"
                />
                <input
                  type="number"
                  value={shopPrice}
                  onChange={(e) => setShopPrice(e.target.value)}
                  placeholder="Coin narxi"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-36"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!shopTitle.trim()) return;
                    const res = await fetch('/api/admin/coinshop', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        titleUz: shopTitle,
                        priceCoins: Number(shopPrice),
                      }),
                    });
                    if (res.ok) {
                      setShopTitle('');
                      showNotice('CoinShop mahsuloti qo‘shildi!');
                      fetchOverview(token);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-extrabold cursor-pointer"
                >
                  + Qo‘shish
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coinShop.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">#{p.order}</span>
                    <span className="text-xs font-extrabold text-amber-600">
                      🪙 {p.priceCoins} Coin
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{p.title.UZ}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. LEADERBOARD ADMIN VIEW */}
        {/* ============================================================ */}
        {activeSection === 'Leaderboard' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              Peshqadamlar jadvali (Points DESC)
            </h2>
            <div className="divide-y divide-slate-100">
              {leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  className="py-3 px-4 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 font-extrabold text-slate-500">#{entry.rank}</span>
                    <span className="font-bold text-slate-900">
                      {entry.firstName} {entry.lastName} (@{entry.username})
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-extrabold tabular-nums">
                    <span className="text-amber-600">🪙 {entry.coins}</span>
                    <span className="text-sky-600">⭐ {entry.points}</span>
                    <span className="text-orange-600">🔥 {entry.strike} kun</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 8. NOTIFICATIONS & SETTINGS */}
        {/* ============================================================ */}
        {(activeSection === 'Notifications' || activeSection === 'Settings') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              O‘quvchilarga bildirishnoma yuborish
            </h2>
            <form onSubmit={handleSendNotification} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qabul qiluvchi:</label>
                <select
                  value={notifStudentId}
                  onChange={(e) => setNotifStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="ALL">Barcha o‘quvchilarga</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (@{s.username})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="Sarlavha..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                rows={3}
                placeholder="Xabar matni..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold cursor-pointer"
              >
                Xabarni yuborish
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL 1: CREATE NEW STUDENT */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Yangi O‘quvchi Yaratish</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ism</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Familiya</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parol</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Biriktiriladigan kurslar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {courses.map((c) => {
                    const checked = newAssignedCourses.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setNewAssignedCourses((prev) =>
                              checked ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                            );
                          }}
                        />
                        <span>{c.title.UZ}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold cursor-pointer"
              >
                O‘quvchini saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: STUDENT COURSE ASSIGNMENT & DETAILED ACTIVITY */}
      {/* ============================================================== */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Student: {selectedStudent.firstName} {selectedStudent.lastName} (@
                  {selectedStudent.username})
                </h3>
                <p className="text-xs text-slate-500">
                  Oxirgi kirish:{' '}
                  {selectedStudent.lastLogin
                    ? new Date(selectedStudent.lastLogin).toLocaleString()
                    : 'Hali kirmagan'}{' '}
                  · Oxirgi faollik: {selectedStudent.lastActiveDate || '-'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detailed Activity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Yakunlangan darslar</span>
                <b className="text-base">{selectedStudent.completedLessonsCount}</b>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Yakunlangan testlar</span>
                <b className="text-base">{selectedStudent.completedTestsCount}</b>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Amaliy (Tasdiqlangan/Rad)</span>
                <b className="text-base">
                  {selectedStudent.approvedPracticalsCount} /{' '}
                  {selectedStudent.rejectedPracticalsCount}
                </b>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Jami yig‘ilgan Coin</span>
                <b className="text-base text-amber-600">
                  🪙 {selectedStudent.coinsEarnedTotal}
                </b>
              </div>
            </div>

            {/* Course Assignment Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-900 uppercase">
                Available Courses (Kurslarni biriktirish):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {courses.map((course) => {
                  const isChecked = editAssignedCourses.includes(course.id);
                  return (
                    <label
                      key={course.id}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer ${
                        isChecked
                          ? 'bg-orange-50 border-orange-400 text-orange-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setEditAssignedCourses((prev) =>
                            isChecked
                              ? prev.filter((id) => id !== course.id)
                              : [...prev, course.id]
                          );
                        }}
                      />
                      <span>{course.title.UZ}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Password Reset Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parolni yangilash (ixtiyoriy):
              </label>
              <input
                type="text"
                value={resetPasswordValue}
                onChange={(e) => setResetPasswordValue(e.target.value)}
                placeholder="Yangi parol kiriting..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveStudentDetails}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
