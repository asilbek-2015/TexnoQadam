import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { generateAllCourses } from './src/curriculumGenerator.ts';
import { INITIAL_COINSHOP_PRODUCTS } from './src/translations.ts';
import {
  CoinShopProduct,
  Course,
  CurriculumItem,
  NotificationItem,
  PracticalSubmission,
  StudentUser,
  TransactionRecord,
} from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PASSWORD_SALT = 'texnoqadam_kurs_bor_secure_salt_2026';

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, PASSWORD_SALT, 1000, 64, 'sha512').toString('hex');
}

interface AdminRecord {
  id: string;
  username: string;
  passwordHash: string;
}

interface SessionToken {
  token: string;
  userId: string;
  role: 'student' | 'admin';
  createdAt: string;
}

interface DatabaseSchema {
  admins: AdminRecord[];
  students: StudentUser[];
  customItems: CurriculumItem[];
  submissions: PracticalSubmission[];
  transactions: TransactionRecord[];
  notifications: NotificationItem[];
  coinShop: CoinShopProduct[];
  sessions: SessionToken[];
}

const BASE_COURSES: Course[] = generateAllCourses();

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function createInitialDb(): DatabaseSchema {
  const today = getTodayDateString();
  const nowIso = new Date().toISOString();

  const initialStudents: StudentUser[] = [
    {
      id: 'stu-1',
      username: 'ali_valiyev',
      passwordHash: hashPassword('123456'),
      firstName: 'Ali',
      lastName: 'Valiyev',
      avatarId: 'robot-coding',
      coins: 1250,
      points: 3500,
      strike: 7,
      lastStrikeDate: today,
      lastLogin: nowIso,
      lastActiveDate: today,
      isActive: true,
      assignedCourseIds: [
        'web-dasturlash',
        'english',
        'matematika',
        'rus-tili',
        'ona-tili',
        'grafik-dizayn',
        'telegram-bot',
        'suniy-intellekt',
      ],
      completedItemIds: ['web-html-item-1', 'web-html-item-2'],
      completedLessonsCount: 18,
      completedTestsCount: 5,
      submittedPracticalsCount: 4,
      approvedPracticalsCount: 4,
      rejectedPracticalsCount: 0,
      coinsEarnedTotal: 1250,
      coinsSpentTotal: 0,
      pointsEarnedTotal: 3500,
      language: 'UZ',
      createdAt: nowIso,
    },
    {
      id: 'stu-2',
      username: 'madina_karimova',
      passwordHash: hashPassword('123456'),
      firstName: 'Madina',
      lastName: 'Karimova',
      avatarId: 'robot-celebrating',
      coins: 1420,
      points: 3890,
      strike: 12,
      lastStrikeDate: today,
      lastLogin: nowIso,
      lastActiveDate: today,
      isActive: true,
      assignedCourseIds: ['web-dasturlash', 'english', 'grafik-dizayn', 'suniy-intellekt'],
      completedItemIds: ['web-html-item-1', 'web-html-item-2', 'web-html-item-3'],
      completedLessonsCount: 22,
      completedTestsCount: 6,
      submittedPracticalsCount: 5,
      approvedPracticalsCount: 5,
      rejectedPracticalsCount: 0,
      coinsEarnedTotal: 1420,
      coinsSpentTotal: 0,
      pointsEarnedTotal: 3890,
      language: 'UZ',
      createdAt: nowIso,
    },
    {
      id: 'stu-3',
      username: 'jasur_rahimov',
      passwordHash: hashPassword('123456'),
      firstName: 'Jasur',
      lastName: 'Rahimov',
      avatarId: 'robot-welcome',
      coins: 980,
      points: 3120,
      strike: 5,
      lastStrikeDate: today,
      lastLogin: nowIso,
      lastActiveDate: today,
      isActive: true,
      assignedCourseIds: ['web-dasturlash', 'telegram-bot', 'matematika'],
      completedItemIds: ['web-html-item-1'],
      completedLessonsCount: 14,
      completedTestsCount: 4,
      submittedPracticalsCount: 3,
      approvedPracticalsCount: 3,
      rejectedPracticalsCount: 0,
      coinsEarnedTotal: 980,
      coinsSpentTotal: 0,
      pointsEarnedTotal: 3120,
      language: 'UZ',
      createdAt: nowIso,
    },
    {
      id: 'stu-4',
      username: 'nilufar_usmonova',
      passwordHash: hashPassword('123456'),
      firstName: 'Nilufar',
      lastName: 'Usmonova',
      avatarId: 'avatar-coder-girl',
      coins: 840,
      points: 2740,
      strike: 4,
      lastStrikeDate: today,
      lastLogin: nowIso,
      lastActiveDate: today,
      isActive: true,
      assignedCourseIds: ['english', 'rus-tili', 'ona-tili'],
      completedItemIds: [],
      completedLessonsCount: 11,
      completedTestsCount: 3,
      submittedPracticalsCount: 2,
      approvedPracticalsCount: 2,
      rejectedPracticalsCount: 0,
      coinsEarnedTotal: 840,
      coinsSpentTotal: 0,
      pointsEarnedTotal: 2740,
      language: 'UZ',
      createdAt: nowIso,
    },
    {
      id: 'stu-5',
      username: 'sardor_aliyev',
      passwordHash: hashPassword('123456'),
      firstName: 'Sardor',
      lastName: 'Aliyev',
      avatarId: 'avatar-astronaut',
      coins: 690,
      points: 2150,
      strike: 3,
      lastStrikeDate: today,
      lastLogin: nowIso,
      lastActiveDate: today,
      isActive: true,
      assignedCourseIds: ['web-dasturlash', 'suniy-intellekt'],
      completedItemIds: [],
      completedLessonsCount: 9,
      completedTestsCount: 2,
      submittedPracticalsCount: 2,
      approvedPracticalsCount: 2,
      rejectedPracticalsCount: 0,
      coinsEarnedTotal: 690,
      coinsSpentTotal: 0,
      pointsEarnedTotal: 2150,
      language: 'UZ',
      createdAt: nowIso,
    },
    {
      id: 'stu-6',
      username: 'dildora_ochilova',
      passwordHash: hashPassword('123456'),
      firstName: 'Dildora',
      lastName: 'Ochilova',
      avatarId: 'robot-thinking',
      coins: 520,
      points: 1680,
      strike: 2,
      lastStrikeDate: today,
      lastLogin: nowIso,
      lastActiveDate: today,
      isActive: true,
      assignedCourseIds: ['grafik-dizayn', 'english'],
      completedItemIds: [],
      completedLessonsCount: 7,
      completedTestsCount: 2,
      submittedPracticalsCount: 1,
      approvedPracticalsCount: 1,
      rejectedPracticalsCount: 0,
      coinsEarnedTotal: 520,
      coinsSpentTotal: 0,
      pointsEarnedTotal: 1680,
      language: 'UZ',
      createdAt: nowIso,
    },
  ];

  const initialTransactions: TransactionRecord[] = [
    {
      id: 'tx-1',
      studentId: 'stu-1',
      studentName: 'Ali Valiyev',
      studentUsername: 'ali_valiyev',
      type: 'coin',
      amount: 500,
      reason: 'A’lo darajadagi faollik va amaliy ishlar uchun',
      actor: 'AdminCRM',
      createdAt: nowIso,
    },
    {
      id: 'tx-2',
      studentId: 'stu-1',
      studentName: 'Ali Valiyev',
      studentUsername: 'ali_valiyev',
      type: 'point',
      amount: 500,
      reason: 'Haftalik peshqadamlik bonusi',
      actor: 'AdminCRM',
      createdAt: nowIso,
    },
    {
      id: 'tx-3',
      studentId: 'stu-2',
      studentName: 'Madina Karimova',
      studentUsername: 'madina_karimova',
      type: 'coin',
      amount: 300,
      reason: 'Web-Dasturlash loyihasi uchun mukofot',
      actor: 'AdminCRM',
      createdAt: nowIso,
    },
  ];

  const initialNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      studentId: 'stu-1',
      title: 'TexnoQadam — Kurs Bor platformasiga xush kelibsiz!',
      message: 'Darslarni ketma-ketlikda bajaring va har bir dars uchun +25 Coin, test uchun +30 Coin, amaliy ish uchun +70 Coin to‘plang!',
      type: 'reward',
      read: false,
      createdAt: nowIso,
    },
  ];

  return {
    admins: [
      {
        id: 'admin-1',
        username: 'AdminCRM',
        passwordHash: hashPassword('Admin11CRM0'),
      },
    ],
    students: initialStudents,
    customItems: [],
    submissions: [],
    transactions: initialTransactions,
    notifications: initialNotifications,
    coinShop: INITIAL_COINSHOP_PRODUCTS,
    sessions: [],
  };
}

function loadDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    // Ensure default admin always exists with required credentials
    const hasDefaultAdmin = parsed.admins?.some((a) => a.username === 'AdminCRM');
    if (!hasDefaultAdmin) {
      parsed.admins = [
        ...(parsed.admins || []),
        {
          id: 'admin-1',
          username: 'AdminCRM',
          passwordHash: hashPassword('Admin11CRM0'),
        },
      ];
    }
    return parsed;
  } catch {
    const initial = createInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

let db: DatabaseSchema = loadDb();

function saveDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

function getMergedCourses(): Course[] {
  const cloned: Course[] = JSON.parse(JSON.stringify(BASE_COURSES));
  for (const customItem of db.customItems) {
    const course = cloned.find((c) => c.id === customItem.courseId);
    if (course) {
      const mod = course.modules.find((m) => m.id === customItem.moduleId) || course.modules[0];
      if (mod) {
        mod.items.push(customItem);
        mod.items.sort((a, b) => a.order - b.order);
      }
    }
  }
  return cloned;
}

function sanitizeStudent(student: StudentUser): Omit<StudentUser, 'passwordHash'> {
  const { passwordHash: _, ...rest } = student;
  return rest;
}

function computeLeaderboard() {
  return [...db.students]
    .filter((s) => s.isActive)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.coins !== a.coins) return b.coins - a.coins;
      return a.firstName.localeCompare(b.firstName);
    })
    .map((s, index) => ({
      rank: index + 1,
      id: s.id,
      username: s.username,
      firstName: s.firstName,
      lastName: s.lastName,
      avatarId: s.avatarId,
      points: s.points,
      coins: s.coins,
      strike: s.strike,
    }));
}

function updateStudentDailyStrike(student: StudentUser) {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  student.lastActiveDate = today;

  if (student.lastStrikeDate === today) {
    // Already incremented today — Strike must only increase once per calendar day
    return;
  }

  if (student.lastStrikeDate === yesterday || student.strike === 0) {
    student.strike += 1;
  } else {
    // Missed a day -> reset to 1 for today's activity
    student.strike = 1;
  }
  student.lastStrikeDate = today;

  db.transactions.unshift({
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    studentUsername: student.username,
    type: 'strike',
    amount: 1,
    reason: `Kunlik dars faolligi (${student.strike} kun Strike)`,
    actor: 'System',
    createdAt: new Date().toISOString(),
  });
}

function findItemAndCheckLock(
  student: StudentUser,
  courseId: string,
  moduleId: string,
  itemId: string
): { item: CurriculumItem | null; locked: boolean } {
  const courses = getMergedCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return { item: null, locked: true };
  const mod = course.modules.find((m) => m.id === moduleId);
  if (!mod) return { item: null, locked: true };

  const idx = mod.items.findIndex((i) => i.id === itemId);
  if (idx === -1) return { item: null, locked: true };

  // First item in a module is always unlocked; subsequent items require previous item in module to be completed
  if (idx > 0) {
    const prevItem = mod.items[idx - 1];
    if (!student.completedItemIds.includes(prevItem.id)) {
      return { item: mod.items[idx], locked: true };
    }
  }
  return { item: mod.items[idx], locked: false };
}

function getAuthSession(req: Request): SessionToken | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return db.sessions.find((s) => s.token === token) || null;
}

function requireStudent(req: Request, res: Response, next: NextFunction) {
  const session = getAuthSession(req);
  if (!session || session.role !== 'student') {
    res.status(401).json({ error: 'Avtorizatsiya talab qilinadi.' });
    return;
  }
  const student = db.students.find((s) => s.id === session.userId);
  if (!student || !student.isActive) {
    res.status(403).json({ error: 'Hisob topilmadi yoki faolsizlantirilgan.' });
    return;
  }
  (req as any).student = student;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getAuthSession(req);
  if (!session || session.role !== 'admin') {
    res.status(401).json({ error: 'Faqat Admin CRM uchun ruxsat berilgan.' });
    return;
  }
  const admin = db.admins.find((a) => a.id === session.userId);
  if (!admin) {
    res.status(403).json({ error: 'Admin topilmadi.' });
    return;
  }
  (req as any).admin = admin;
  next();
}

// Safe educational Python runner for in-browser Python practicals
function executeSafePython(code: string): { output: string; error?: string } {
  const logs: string[] = [];
  const vars: Record<string, any> = {};
  const lines = code.split('\n');

  const evalExpr = (expr: string): any => {
    const trimmed = expr.trim();
    if (!trimmed) return '';
    // f-string support: f"Salom {ism}"
    if ((trimmed.startsWith('f"') && trimmed.endsWith('"')) || (trimmed.startsWith("f'") && trimmed.endsWith("'"))) {
      const inner = trimmed.slice(2, -1);
      return inner.replace(/\{([^}]+)\}/g, (_, k) => {
        const val = evalExpr(k.trim());
        return val !== undefined ? String(val) : '';
      });
    }
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    if (trimmed === 'True') return true;
    if (trimmed === 'False') return false;
    if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
    if (trimmed in vars) return vars[trimmed];

    // Replace known variables in simple arithmetic/string expressions
    let replaced = trimmed;
    for (const [k, v] of Object.entries(vars)) {
      const reg = new RegExp(`\\b${k}\\b`, 'g');
      replaced = replaced.replace(reg, typeof v === 'string' ? JSON.stringify(v) : String(v));
    }
    try {
      // Safe math/string evaluation
      if (/^[0-9+\-*/%().\s"A-Za-z_,'!?:]+$/.test(replaced)) {
        return Function(`"use strict"; return (${replaced});`)();
      }
    } catch {
      // fallback
    }
    return trimmed;
  };

  try {
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      // Handle simple for loop: for i in range(a, b):
      const forMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\(([^)]+)\)\s*:/);
      if (forMatch) {
        const varName = forMatch[1];
        const rangeArgs = forMatch[2].split(',').map((s) => Number(evalExpr(s)));
        const start = rangeArgs.length > 1 ? rangeArgs[0] : 0;
        const end = rangeArgs.length > 1 ? rangeArgs[1] : rangeArgs[0];
        const bodyLines: string[] = [];
        while (i + 1 < lines.length && (lines[i + 1].startsWith('  ') || lines[i + 1].startsWith('\t'))) {
          i++;
          bodyLines.push(lines[i].trim());
        }
        for (let val = start; val < Math.min(end, start + 50); val++) {
          vars[varName] = val;
          for (const bLine of bodyLines) {
            if (bLine.startsWith('print(') && bLine.endsWith(')')) {
              const inner = bLine.slice(6, -1);
              const parts = inner.split(',').map((p) => evalExpr(p));
              logs.push(parts.join(' '));
            }
          }
        }
        continue;
      }

      // Handle print(...)
      if (line.startsWith('print(') && line.endsWith(')')) {
        const inner = line.slice(6, -1);
        const parts: string[] = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';
        for (const ch of inner) {
          if ((ch === '"' || ch === "'") && !inQuotes) {
            inQuotes = true;
            quoteChar = ch;
            current += ch;
          } else if (ch === quoteChar && inQuotes) {
            inQuotes = false;
            current += ch;
          } else if (ch === ',' && !inQuotes) {
            parts.push(current);
            current = '';
          } else {
            current += ch;
          }
        }
        if (current.trim()) parts.push(current);
        logs.push(parts.map((p) => String(evalExpr(p))).join(' '));
        continue;
      }

      // Variable assignment: x = expr
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch && !line.includes('==')) {
        const varName = assignMatch[1];
        const rhs = assignMatch[2];
        vars[varName] = evalExpr(rhs);
      }
    }

    if (logs.length === 0) {
      return {
        output: 'Python kodi muvaffaqiyatli bajarildi. (Natijani ekranga chiqarish uchun print() funksiyasidan foydalaning)',
      };
    }
    return { output: logs.join('\n') };
  } catch (err: any) {
    return { output: '', error: err?.message || 'SyntaxError: Python kodida xatolik mavjud.' };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '12mb' }));

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================

  app.post('/api/auth/student/login', (req: Request, res: Response) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      res.status(400).json({ error: 'Username yoki parol noto‘g‘ri.' });
      return;
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const student = db.students.find((s) => s.username.toLowerCase() === cleanUsername);
    if (!student || !student.isActive || student.passwordHash !== hashPassword(String(password))) {
      res.status(401).json({ error: 'Username yoki parol noto‘g‘ri.' });
      return;
    }

    const nowIso = new Date().toISOString();
    student.lastLogin = nowIso;
    student.lastActiveDate = getTodayDateString();

    const token = crypto.randomBytes(32).toString('hex');
    db.sessions.push({
      token,
      userId: student.id,
      role: 'student',
      createdAt: nowIso,
    });
    saveDb();

    res.json({
      token,
      role: 'student',
      student: sanitizeStudent(student),
    });
  });

  app.post('/api/auth/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      res.status(400).json({ error: 'Username yoki parol noto‘g‘ri.' });
      return;
    }

    const admin = db.admins.find((a) => a.username === String(username).trim());
    if (!admin || admin.passwordHash !== hashPassword(String(password))) {
      res.status(401).json({ error: 'Admin username yoki parol noto‘g‘ri.' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    db.sessions.push({
      token,
      userId: admin.id,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    saveDb();

    res.json({
      token,
      role: 'admin',
      admin: { id: admin.id, username: admin.username },
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const session = getAuthSession(req);
    if (session) {
      db.sessions = db.sessions.filter((s) => s.token !== session.token);
      saveDb();
    }
    res.json({ ok: true });
  });

  // ==========================================
  // STUDENT PLATFORM ROUTES
  // ==========================================

  app.get('/api/student/bootstrap', requireStudent, (req: Request, res: Response) => {
    const student = (req as any).student as StudentUser;
    const leaderboard = computeLeaderboard();
    const myRankEntry = leaderboard.find((e) => e.id === student.id);
    const myNotifications = db.notifications.filter(
      (n) => n.studentId === student.id || n.studentId === 'ALL'
    );
    const mySubmissions = db.submissions.filter((s) => s.studentId === student.id);

    res.json({
      student: sanitizeStudent(student),
      rank: myRankEntry ? myRankEntry.rank : leaderboard.length + 1,
      leaderboard,
      courses: getMergedCourses(),
      notifications: myNotifications,
      submissions: mySubmissions,
      coinShop: db.coinShop,
    });
  });

  app.post('/api/student/profile/update', requireStudent, (req: Request, res: Response) => {
    const student = (req as any).student as StudentUser;
    const { avatarId, language } = req.body || {};

    if (avatarId && typeof avatarId === 'string') {
      student.avatarId = avatarId;
    }
    if (language && ['UZ', 'RU', 'EN'].includes(language)) {
      student.language = language;
    }
    saveDb();
    res.json({ student: sanitizeStudent(student) });
  });

  app.post('/api/student/notifications/read', requireStudent, (req: Request, res: Response) => {
    const student = (req as any).student as StudentUser;
    db.notifications.forEach((n) => {
      if (n.studentId === student.id) {
        n.read = true;
      }
    });
    saveDb();
    res.json({ ok: true });
  });

  // Complete a Lesson (+25 Coin, +25 Point)
  app.post('/api/student/complete-lesson', requireStudent, (req: Request, res: Response) => {
    const student = (req as any).student as StudentUser;
    const { courseId, moduleId, itemId } = req.body || {};

    if (!student.assignedCourseIds.includes(courseId)) {
      res.status(403).json({ error: 'Ushbu kurs sizga biriktirilmagan.' });
      return;
    }

    const { item, locked } = findItemAndCheckLock(student, courseId, moduleId, itemId);
    if (!item) {
      res.status(404).json({ error: 'Dars topilmadi.' });
      return;
    }
    if (locked) {
      res.status(403).json({ error: 'Siz hali bu darsga kelmagansiz!' });
      return;
    }

    let rewarded = false;
    if (!student.completedItemIds.includes(itemId)) {
      student.completedItemIds.push(itemId);
      student.completedLessonsCount += 1;
      student.coins += 25;
      student.points += 25;
      student.coinsEarnedTotal += 25;
      student.pointsEarnedTotal += 25;
      rewarded = true;

      const nowIso = new Date().toISOString();
      db.transactions.unshift(
        {
          id: `tx-c-${Date.now()}`,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentUsername: student.username,
          type: 'coin',
          amount: 25,
          reason: `Dars yakunlandi: ${item.title.UZ}`,
          actor: 'System',
          createdAt: nowIso,
        },
        {
          id: `tx-p-${Date.now() + 1}`,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentUsername: student.username,
          type: 'point',
          amount: 25,
          reason: `Dars yakunlandi: ${item.title.UZ}`,
          actor: 'System',
          createdAt: nowIso,
        }
      );

      updateStudentDailyStrike(student);
      saveDb();
    }

    res.json({
      rewarded,
      coinsAdded: rewarded ? 25 : 0,
      pointsAdded: rewarded ? 25 : 0,
      student: sanitizeStudent(student),
      leaderboard: computeLeaderboard(),
    });
  });

  // Complete a Test (+30 Coin, +30 Point)
  app.post('/api/student/complete-test', requireStudent, (req: Request, res: Response) => {
    const student = (req as any).student as StudentUser;
    const { courseId, moduleId, itemId, answers } = req.body || {};

    if (!student.assignedCourseIds.includes(courseId)) {
      res.status(403).json({ error: 'Ushbu kurs sizga biriktirilmagan.' });
      return;
    }

    const { item, locked } = findItemAndCheckLock(student, courseId, moduleId, itemId);
    if (!item || item.type !== 'test') {
      res.status(404).json({ error: 'Test topilmadi.' });
      return;
    }
    if (locked) {
      res.status(403).json({ error: 'Siz hali bu darsga kelmagansiz!' });
      return;
    }

    const questions = item.testQuestions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (Array.isArray(answers) && Number(answers[idx]) === q.correctIndex) {
        correctCount++;
      }
    });

    const passed = questions.length === 0 || correctCount >= Math.ceil(questions.length * 0.66);
    if (!passed) {
      res.status(400).json({
        passed: false,
        correctCount,
        totalQuestions: questions.length,
        error: `Testdan o‘tish uchun kamida ${Math.ceil(questions.length * 0.66)} ta savolga to‘g‘ri javob bering. Sizning natijangiz: ${correctCount}/${questions.length}`,
      });
      return;
    }

    let rewarded = false;
    if (!student.completedItemIds.includes(itemId)) {
      student.completedItemIds.push(itemId);
      student.completedTestsCount += 1;
      student.coins += 30;
      student.points += 30;
      student.coinsEarnedTotal += 30;
      student.pointsEarnedTotal += 30;
      rewarded = true;

      const nowIso = new Date().toISOString();
      db.transactions.unshift(
        {
          id: `tx-c-${Date.now()}`,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentUsername: student.username,
          type: 'coin',
          amount: 30,
          reason: `Test muvaffaqiyatli topshirildi: ${item.title.UZ}`,
          actor: 'System',
          createdAt: nowIso,
        },
        {
          id: `tx-p-${Date.now() + 1}`,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentUsername: student.username,
          type: 'point',
          amount: 30,
          reason: `Test muvaffaqiyatli topshirildi: ${item.title.UZ}`,
          actor: 'System',
          createdAt: nowIso,
        }
      );

      updateStudentDailyStrike(student);
      saveDb();
    }

    res.json({
      passed: true,
      rewarded,
      correctCount,
      totalQuestions: questions.length,
      coinsAdded: rewarded ? 30 : 0,
      pointsAdded: rewarded ? 30 : 0,
      student: sanitizeStudent(student),
      leaderboard: computeLeaderboard(),
    });
  });

  // Python Safe Code Execution Endpoint
  app.post('/api/code/run-python', requireStudent, (req: Request, res: Response) => {
    const { code } = req.body || {};
    const result = executeSafePython(String(code || ''));
    res.json(result);
  });

  // AI Voice Practical Checking & Practical Submission Endpoint
  app.post('/api/student/submit-practical', requireStudent, async (req: Request, res: Response) => {
    const student = (req as any).student as StudentUser;
    const {
      courseId,
      moduleId,
      itemId,
      submittedCode,
      codeOutput,
      screenshotDataUrl,
      voiceTranscript,
      audioBase64,
      audioMimeType,
      testAnswers,
    } = req.body || {};

    if (!student.assignedCourseIds.includes(courseId)) {
      res.status(403).json({ error: 'Ushbu kurs sizga biriktirilmagan.' });
      return;
    }

    const { item, locked } = findItemAndCheckLock(student, courseId, moduleId, itemId);
    if (!item || item.type !== 'practical') {
      res.status(404).json({ error: 'Amaliy topshiriq topilmadi.' });
      return;
    }
    if (locked) {
      res.status(403).json({ error: 'Siz hali bu darsga kelmagansiz!' });
      return;
    }

    const courses = getMergedCourses();
    const course = courses.find((c) => c.id === courseId)!;
    const mod = course.modules.find((m) => m.id === moduleId)!;

    // 1. VOICE + TEST PRACTICAL (English, Rus tili, Matematika, Ona tili)
    if (item.practicalMode === 'voice') {
      const questions = item.testQuestions || [];
      let correctQuiz = 0;
      questions.forEach((q, idx) => {
        if (Array.isArray(testAnswers) && Number(testAnswers[idx]) === q.correctIndex) {
          correctQuiz++;
        }
      });
      const quizPassed = questions.length === 0 || correctQuiz >= Math.ceil(questions.length * 0.66);

      if (!quizPassed) {
        const failMsg =
          courseId === 'rus-tili'
            ? 'Qaytadan bajaring.'
            : 'Javob noto‘g‘ri. Qaytadan urinib ko‘ring.';
        res.status(400).json({
          aiStatus: 'Incorrect',
          error: `${failMsg} (Test natijasi: ${correctQuiz}/${questions.length})`,
        });
        return;
      }

      // Evaluate voice via Gemini AI on server if audioBase64 or transcript is provided
      let finalTranscript = String(voiceTranscript || '').trim();
      let aiStatus: 'Correct' | 'Incorrect' | 'Needs Retry' = 'Incorrect';
      let aiFeedback = '';

      const targetPhrase = item.expectedTargetPhrase || '';
      const keywords = item.expectedKeywords || [];

      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && (audioBase64 || finalTranscript)) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
          });

          const parts: any[] = [];
          if (audioBase64) {
            parts.push({
              inlineData: {
                mimeType: audioMimeType || 'audio/webm',
                data: audioBase64,
              },
            });
          }
          parts.push({
            text: `You are an educational voice evaluator for the course "${course.title.UZ}".
Target phrase expected from the student: "${targetPhrase}".
Required keywords: ${keywords.join(', ')}.
Student transcribed text (if any): "${finalTranscript}".
Evaluate if the student's spoken audio or transcript reasonably matches the target phrase or answers the lesson prompt. Be encouraging and lenient with minor accent differences.
Return JSON with:
- status: "Correct", "Incorrect", or "Needs Retry"
- transcript: what the student said
- feedback: short feedback in Uzbek.`,
          });

          const aiResp = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING },
                  transcript: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                },
                required: ['status', 'transcript', 'feedback'],
              },
            },
          });

          const parsed = JSON.parse(aiResp.text || '{}');
          if (parsed.transcript) finalTranscript = parsed.transcript;
          aiFeedback = parsed.feedback || '';
          if (parsed.status === 'Correct') {
            aiStatus = 'Correct';
          } else if (parsed.status === 'Needs Retry') {
            aiStatus = 'Needs Retry';
          } else {
            aiStatus = 'Incorrect';
          }
        } catch {
          // Fallback to deterministic keyword evaluation below
        }
      }

      // Deterministic verification if Gemini was not reached or to reinforce check
      if (aiStatus !== 'Correct' && finalTranscript.length >= 4) {
        const lower = finalTranscript.toLowerCase();
        const matchedKeywords = keywords.filter((kw) => lower.includes(kw.toLowerCase()));
        if (matchedKeywords.length >= Math.max(1, Math.floor(keywords.length * 0.5)) || lower.includes(targetPhrase.toLowerCase().slice(0, 10))) {
          aiStatus = 'Correct';
          aiFeedback = 'Talaffuz va javob ma’nosi to‘g‘ri!';
        }
      }

      if (aiStatus !== 'Correct') {
        const rejectText =
          courseId === 'rus-tili'
            ? 'Qaytadan bajaring.'
            : 'Javob noto‘g‘ri. Qaytadan urinib ko‘ring.';
        res.status(400).json({
          aiStatus,
          transcript: finalTranscript,
          feedback: aiFeedback || rejectText,
          error: rejectText,
        });
        return;
      }

      // Voice practical passed! Unlock next lesson and reward +70 Coin, +70 Point
      let rewarded = false;
      if (!student.completedItemIds.includes(itemId)) {
        student.completedItemIds.push(itemId);
        student.submittedPracticalsCount += 1;
        student.approvedPracticalsCount += 1;
        student.coins += 70;
        student.points += 70;
        student.coinsEarnedTotal += 70;
        student.pointsEarnedTotal += 70;
        rewarded = true;

        const nowIso = new Date().toISOString();
        db.transactions.unshift(
          {
            id: `tx-c-${Date.now()}`,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentUsername: student.username,
            type: 'coin',
            amount: 70,
            reason: `AI ovozli amaliyot bajarildi: ${item.title.UZ}`,
            actor: 'System',
            createdAt: nowIso,
          },
          {
            id: `tx-p-${Date.now() + 1}`,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentUsername: student.username,
            type: 'point',
            amount: 70,
            reason: `AI ovozli amaliyot bajarildi: ${item.title.UZ}`,
            actor: 'System',
            createdAt: nowIso,
          }
        );

        updateStudentDailyStrike(student);
      }

      const submissionRecord: PracticalSubmission = {
        id: `sub-${Date.now()}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentUsername: student.username,
        courseId,
        courseTitle: course.title.UZ,
        moduleId,
        moduleTitle: mod.title.UZ,
        itemId,
        itemTitle: item.title.UZ,
        practicalMode: 'voice',
        voiceTranscript: finalTranscript,
        testScore: correctQuiz,
        aiStatus: 'Correct',
        aiFeedback: aiFeedback || 'AI tomonidan tasdiqlandi',
        status: 'Approved',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
      };
      db.submissions.unshift(submissionRecord);
      saveDb();

      const successMessage =
        courseId === 'rus-tili'
          ? 'Keyingi dars ochildi.'
          : 'Amaliy muvaffaqiyatli bajarildi. Keyingi dars ochildi.';

      res.json({
        status: 'Approved',
        aiStatus: 'Correct',
        message: successMessage,
        transcript: finalTranscript,
        feedback: aiFeedback,
        rewarded,
        coinsAdded: rewarded ? 70 : 0,
        pointsAdded: rewarded ? 70 : 0,
        student: sanitizeStudent(student),
        leaderboard: computeLeaderboard(),
      });
      return;
    }

    // 2. SCREENSHOT OR CODE PRACTICAL -> Goes to Admin CRM for approval!
    if (item.practicalMode === 'screenshot' && !screenshotDataUrl) {
      res.status(400).json({ error: 'Vazifani bajaring va natijaning screenshotini yuboring.' });
      return;
    }
    if (item.practicalMode === 'code' && (!submittedCode || String(submittedCode).trim().length < 5)) {
      res.status(400).json({ error: 'Iltimos, avval amaliy kodni yozing va tekshiring.' });
      return;
    }

    student.submittedPracticalsCount += 1;
    student.lastActiveDate = getTodayDateString();

    const newSubmission: PracticalSubmission = {
      id: `sub-${Date.now()}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentUsername: student.username,
      courseId,
      courseTitle: course.title.UZ,
      moduleId,
      moduleTitle: mod.title.UZ,
      itemId,
      itemTitle: item.title.UZ,
      practicalMode: item.practicalMode || 'screenshot',
      submittedCode: submittedCode ? String(submittedCode) : undefined,
      codeOutput: codeOutput ? String(codeOutput) : undefined,
      screenshotDataUrl: screenshotDataUrl ? String(screenshotDataUrl) : undefined,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    db.submissions.unshift(newSubmission);
    saveDb();

    res.json({
      status: 'Pending',
      message: 'Amaliy ishingiz Admin CRM ga yuborildi! Ustoz tasdiqlagach +70 Coin va +70 Point beriladi hamda keyingi dars ochiladi.',
      submission: newSubmission,
      student: sanitizeStudent(student),
    });
  });

  // ==========================================
  // ADMIN CRM ROUTES (/api/admin/*)
  // ==========================================

  app.get('/api/admin/overview', requireAdmin, (_req: Request, res: Response) => {
    res.json({
      students: db.students.map(sanitizeStudent),
      courses: getMergedCourses(),
      submissions: db.submissions,
      transactions: db.transactions,
      notifications: db.notifications,
      coinShop: db.coinShop,
      leaderboard: computeLeaderboard(),
    });
  });

  // Create Student
  app.post('/api/admin/students', requireAdmin, (req: Request, res: Response) => {
    const { username, password, firstName, lastName, avatarId, assignedCourseIds } = req.body || {};
    if (!username || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'Barcha maydonlarni to‘ldiring (Username, Parol, Ism, Familiya).' });
      return;
    }

    const cleanUsername = String(username).trim().toLowerCase();
    if (db.students.some((s) => s.username.toLowerCase() === cleanUsername)) {
      res.status(400).json({ error: 'Ushbu username band. Boshqa username kiriting.' });
      return;
    }

    const nowIso = new Date().toISOString();
    const newStudent: StudentUser = {
      id: `stu-${Date.now()}`,
      username: cleanUsername,
      passwordHash: hashPassword(String(password)),
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      avatarId: avatarId || 'robot-welcome',
      coins: 0,
      points: 0,
      strike: 0,
      lastStrikeDate: null,
      lastLogin: null,
      lastActiveDate: null,
      isActive: true,
      assignedCourseIds: Array.isArray(assignedCourseIds) ? assignedCourseIds : ['web-dasturlash'],
      completedItemIds: [],
      completedLessonsCount: 0,
      completedTestsCount: 0,
      submittedPracticalsCount: 0,
      approvedPracticalsCount: 0,
      rejectedPracticalsCount: 0,
      coinsEarnedTotal: 0,
      coinsSpentTotal: 0,
      pointsEarnedTotal: 0,
      language: 'UZ',
      createdAt: nowIso,
    };

    db.students.push(newStudent);
    saveDb();

    res.json({ student: sanitizeStudent(newStudent) });
  });

  // Update Student (edit profile, enable/disable, reset password, course assignment)
  app.put('/api/admin/students/:id', requireAdmin, (req: Request, res: Response) => {
    const student = db.students.find((s) => s.id === req.params.id);
    if (!student) {
      res.status(404).json({ error: 'O‘quvchi topilmadi.' });
      return;
    }

    const { firstName, lastName, username, password, isActive, assignedCourseIds, avatarId } = req.body || {};
    if (firstName !== undefined) student.firstName = String(firstName).trim();
    if (lastName !== undefined) student.lastName = String(lastName).trim();
    if (username !== undefined) student.username = String(username).trim().toLowerCase();
    if (password && String(password).trim().length > 0) {
      student.passwordHash = hashPassword(String(password).trim());
    }
    if (typeof isActive === 'boolean') student.isActive = isActive;
    if (Array.isArray(assignedCourseIds)) student.assignedCourseIds = assignedCourseIds;
    if (avatarId) student.avatarId = avatarId;

    saveDb();
    res.json({ student: sanitizeStudent(student) });
  });

  // Admin Add / Remove Coins
  app.post('/api/admin/students/:id/coins', requireAdmin, (req: Request, res: Response) => {
    const student = db.students.find((s) => s.id === req.params.id);
    if (!student) {
      res.status(404).json({ error: 'O‘quvchi topilmadi.' });
      return;
    }

    const { amount, reason, action } = req.body || {};
    const numAmount = Math.abs(Number(amount || 0));
    if (!numAmount || numAmount <= 0) {
      res.status(400).json({ error: 'To‘g‘ri Coin miqdorini kiriting.' });
      return;
    }

    const signedDelta = action === 'remove' ? -numAmount : numAmount;
    student.coins = Math.max(0, student.coins + signedDelta);
    if (signedDelta > 0) {
      student.coinsEarnedTotal += numAmount;
    } else {
      student.coinsSpentTotal += numAmount;
    }

    const nowIso = new Date().toISOString();
    const tx: TransactionRecord = {
      id: `tx-c-${Date.now()}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentUsername: student.username,
      type: 'coin',
      amount: signedDelta,
      reason: String(reason || (signedDelta > 0 ? 'Admin reward' : 'Admin CoinShop / adjustment')),
      actor: 'AdminCRM',
      createdAt: nowIso,
    };
    db.transactions.unshift(tx);

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      studentId: student.id,
      title: signedDelta > 0 ? `+${numAmount} Coin qo‘shildi!` : `-${numAmount} Coin ayirildi`,
      message: `Sabab: ${tx.reason} (AdminCRM)`,
      type: 'reward',
      read: false,
      createdAt: nowIso,
    });

    saveDb();
    res.json({ student: sanitizeStudent(student), transaction: tx });
  });

  // Admin Add / Remove Points
  app.post('/api/admin/students/:id/points', requireAdmin, (req: Request, res: Response) => {
    const student = db.students.find((s) => s.id === req.params.id);
    if (!student) {
      res.status(404).json({ error: 'O‘quvchi topilmadi.' });
      return;
    }

    const { amount, reason, action } = req.body || {};
    const numAmount = Math.abs(Number(amount || 0));
    if (!numAmount || numAmount <= 0) {
      res.status(400).json({ error: 'To‘g‘ri Point miqdorini kiriting.' });
      return;
    }

    const signedDelta = action === 'remove' ? -numAmount : numAmount;
    student.points = Math.max(0, student.points + signedDelta);
    if (signedDelta > 0) {
      student.pointsEarnedTotal += numAmount;
    }

    const nowIso = new Date().toISOString();
    const tx: TransactionRecord = {
      id: `tx-p-${Date.now()}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentUsername: student.username,
      type: 'point',
      amount: signedDelta,
      reason: String(reason || (signedDelta > 0 ? 'Admin Point reward' : 'Admin Point adjustment')),
      actor: 'AdminCRM',
      createdAt: nowIso,
    };
    db.transactions.unshift(tx);

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      studentId: student.id,
      title: signedDelta > 0 ? `+${numAmount} Point qo‘shildi!` : `-${numAmount} Point ayirildi`,
      message: `Sabab: ${tx.reason} (AdminCRM)`,
      type: 'reward',
      read: false,
      createdAt: nowIso,
    });

    saveDb();
    res.json({ student: sanitizeStudent(student), transaction: tx, leaderboard: computeLeaderboard() });
  });

  // Admin Strike Management (Set or Reset Strike)
  app.post('/api/admin/students/:id/strike', requireAdmin, (req: Request, res: Response) => {
    const student = db.students.find((s) => s.id === req.params.id);
    if (!student) {
      res.status(404).json({ error: 'O‘quvchi topilmadi.' });
      return;
    }

    const { strike, reason } = req.body || {};
    const newStrike = Math.max(0, Number(strike || 0));
    const delta = newStrike - student.strike;
    student.strike = newStrike;
    student.lastStrikeDate = newStrike > 0 ? getTodayDateString() : null;

    const tx: TransactionRecord = {
      id: `tx-s-${Date.now()}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentUsername: student.username,
      type: 'strike',
      amount: delta,
      reason: String(reason || `Strike yangilandi: ${newStrike} kun`),
      actor: 'AdminCRM',
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);
    saveDb();

    res.json({ student: sanitizeStudent(student), transaction: tx });
  });

  // Admin Practical Submission Review (Approve OR Reject)
  app.post('/api/admin/submissions/:id/review', requireAdmin, (req: Request, res: Response) => {
    const submission = db.submissions.find((s) => s.id === req.params.id);
    if (!submission) {
      res.status(404).json({ error: 'Topshiriq topilmadi.' });
      return;
    }

    const { status, adminReason } = req.body || {};
    if (status !== 'Approved' && status !== 'Rejected') {
      res.status(400).json({ error: 'Noto‘g‘ri status.' });
      return;
    }

    const student = db.students.find((s) => s.id === submission.studentId);
    const nowIso = new Date().toISOString();
    submission.status = status;
    submission.adminReason = adminReason ? String(adminReason) : undefined;
    submission.reviewedAt = nowIso;

    if (student) {
      if (status === 'Approved') {
        student.approvedPracticalsCount += 1;
        // Award +70 Coin and +70 Point only once per itemId
        if (!student.completedItemIds.includes(submission.itemId)) {
          student.completedItemIds.push(submission.itemId);
          student.coins += 70;
          student.points += 70;
          student.coinsEarnedTotal += 70;
          student.pointsEarnedTotal += 70;

          db.transactions.unshift(
            {
              id: `tx-c-${Date.now()}`,
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              studentUsername: student.username,
              type: 'coin',
              amount: 70,
              reason: `Amaliy ish qabul qilindi: ${submission.itemTitle}`,
              actor: 'AdminCRM',
              createdAt: nowIso,
            },
            {
              id: `tx-p-${Date.now() + 1}`,
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              studentUsername: student.username,
              type: 'point',
              amount: 70,
              reason: `Amaliy ish qabul qilindi: ${submission.itemTitle}`,
              actor: 'AdminCRM',
              createdAt: nowIso,
            }
          );

          updateStudentDailyStrike(student);
        }

        // Exact required notification for APPROVE
        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          studentId: student.id,
          title: 'Amaliy ishingiz qabul qilindi!',
          message: `Amaliy ishingiz qabul qilindi!\nKeyingi dars ochildi.\n+70 Coin\n+70 Point`,
          type: 'approval',
          read: false,
          createdAt: nowIso,
        });
      } else {
        // REJECT: Do NOT give Coins, Do NOT give Points, Do NOT unlock next lesson
        student.rejectedPracticalsCount += 1;
        const baseRejectionMsg = 'Darsni qaytadan topshiring. Sizning darsingizda xatoliklar bor edi.';
        const fullMsg = adminReason ? `${baseRejectionMsg} Sabab: ${adminReason}` : baseRejectionMsg;

        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          studentId: student.id,
          title: 'Amaliy ish qaytarildi',
          message: fullMsg,
          type: 'rejection',
          read: false,
          createdAt: nowIso,
        });
      }
    }

    saveDb();
    res.json({
      submission,
      student: student ? sanitizeStudent(student) : null,
      leaderboard: computeLeaderboard(),
    });
  });

  // Admin Create Custom Lesson / Test / Practical
  app.post('/api/admin/curriculum', requireAdmin, (req: Request, res: Response) => {
    const { courseId, moduleId, type, titleUz, contentUz, practicalMode, codeLanguage } = req.body || {};
    if (!courseId || !moduleId || !titleUz) {
      res.status(400).json({ error: 'Kurs, modul va sarlavhani kiriting.' });
      return;
    }

    const courses = getMergedCourses();
    const course = courses.find((c) => c.id === courseId);
    const mod = course?.modules.find((m) => m.id === moduleId);
    const nextOrder = mod ? mod.items.length + 1 : 1;

    const itemType: 'lesson' | 'practical' | 'test' =
      type === 'practical' || type === 'test' ? type : 'lesson';

    const newItem: CurriculumItem = {
      id: `${moduleId}-custom-${Date.now()}`,
      courseId,
      moduleId,
      order: nextOrder,
      type: itemType,
      title: { UZ: titleUz, RU: titleUz, EN: titleUz },
      content: {
        UZ: contentUz || titleUz,
        RU: contentUz || titleUz,
        EN: contentUz || titleUz,
      },
      practicalMode: itemType === 'practical' ? practicalMode || 'screenshot' : undefined,
      codeLanguage: itemType === 'practical' && practicalMode === 'code' ? codeLanguage || 'html' : undefined,
      rewardCoins: itemType === 'lesson' ? 25 : itemType === 'test' ? 30 : 70,
      rewardPoints: itemType === 'lesson' ? 25 : itemType === 'test' ? 30 : 70,
    };

    db.customItems.push(newItem);
    saveDb();
    res.json({ item: newItem, courses: getMergedCourses() });
  });

  // Admin Send Notification
  app.post('/api/admin/notifications', requireAdmin, (req: Request, res: Response) => {
    const { studentId, title, message } = req.body || {};
    if (!title || !message) {
      res.status(400).json({ error: 'Sarlavha va xabar matnini kiriting.' });
      return;
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      studentId: studentId || 'ALL',
      title: String(title),
      message: String(message),
      type: 'admin',
      read: false,
      createdAt: new Date().toISOString(),
    };
    db.notifications.unshift(notif);
    saveDb();
    res.json({ notification: notif });
  });

  // Admin Update CoinShop Product
  app.post('/api/admin/coinshop', requireAdmin, (req: Request, res: Response) => {
    const { titleUz, descriptionUz, priceCoins, category } = req.body || {};
    if (!titleUz || !priceCoins) {
      res.status(400).json({ error: 'Mahsulot nomi va narxini kiriting.' });
      return;
    }

    const newProd: CoinShopProduct = {
      id: `cs-${Date.now()}`,
      order: db.coinShop.length + 1,
      title: { UZ: titleUz, RU: titleUz, EN: titleUz },
      description: {
        UZ: descriptionUz || titleUz,
        RU: descriptionUz || titleUz,
        EN: descriptionUz || titleUz,
      },
      priceCoins: Number(priceCoins),
      category: category || 'website',
      telegramUrl: 'https://t.me/a_ikromboyev',
    };
    db.coinShop.push(newProd);
    saveDb();
    res.json({ coinShop: db.coinShop });
  });

  // ==========================================
  // VITE DEV / STATIC FRONTEND SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TexnoQadam — Kurs Bor Server running on http://localhost:${PORT}`);
  });
}

startServer();
