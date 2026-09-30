import { Course, CourseModule, CurriculumItem, TestQuestion } from './types';

function makeTestQuestions(topicUz: string, topicRu: string, topicEn: string, idx: number): TestQuestion[] {
  return [
    {
      id: `q-${idx}-1`,
      question: {
        UZ: `"${topicUz}" mavzusining asosiy vazifasi va qoidasi nimadan iborat?`,
        RU: `В чем заключается основная задача и правило темы «${topicRu}»?`,
        EN: `What is the primary purpose and rule of "${topicEn}"?`,
      },
      options: {
        UZ: [
          `${topicUz} yordamida tizimli, to'g'ri va samarali natija hosil qilish`,
          `Faqatgina matnlarni o'chirish uchun ishlatish`,
          `Dastur kodini butunlay to'xtatib qo'yish`,
          `Hech qanday amaliy ahamiyatga ega emas`,
        ],
        RU: [
          `Создание системного, правильного и эффективного результата с помощью «${topicRu}»`,
          `Использование только для удаления текста`,
          `Полная остановка работы программы`,
          `Не имеет никакого практического значения`,
        ],
        EN: [
          `To build structured, accurate, and effective output using ${topicEn}`,
          `Only used for deleting random text`,
          `To completely halt system execution`,
          `It has no practical relevance`,
        ],
      },
      correctIndex: 0,
    },
    {
      id: `q-${idx}-2`,
      question: {
        UZ: `${topicUz} bilan ishlashda qaysi yondashuv eng to‘g‘ri hisoblanadi?`,
        RU: `Какой подход считается наиболее правильным при работе с темой «${topicRu}»?`,
        EN: `Which approach is considered best practice when working with "${topicEn}"?`,
      },
      options: {
        UZ: [
          `Xatoliklarni e'tiborsiz qoldirish`,
          `Qoidalarga va sintaksis ketma-ketligiga qat'iy amal qilish`,
          `Barcha elementlarni tasodifiy joylashtirish`,
          `Faqat bitta buyruq bilan cheklanish`,
        ],
        RU: [
          `Игнорировать все ошибки`,
          `Строго соблюдать правила и последовательность синтаксиса`,
          `Размещать все элементы случайным образом`,
          `Ограничиваться только одной командой`,
        ],
        EN: [
          `Ignoring all syntax errors`,
          `Strictly following rules and sequential structure`,
          `Placing all elements randomly`,
          `Using only a single command everywhere`,
        ],
      },
      correctIndex: 1,
    },
    {
      id: `q-${idx}-3`,
      question: {
        UZ: `Amaliyotda "${topicUz}" bilimlarini mustahkamlash uchun nima qilish kerak?`,
        RU: `Что необходимо делать для закрепления знаний по теме «${topicRu}» на практике?`,
        EN: `What should you do to reinforce your knowledge of "${topicEn}" in practice?`,
      },
      options: {
        UZ: [
          `Nazariyani o'qib, amaliy mashqlarni o'tkazib yuborish`,
          `Misol va topshiriqlarni mustaqil bajarib, natijani tekshirish`,
          `Faqat tayyor javoblarni ko'chirib olish`,
          `Mavzuni yakunlamasdan keyingi bo'limga o'tish`,
        ],
        RU: [
          `Прочитать теорию и пропустить практические задания`,
          `Самостоятельно выполнить примеры и задачи, проверив результат`,
          `Только скопировать готовые ответы`,
          `Перейти к следующему разделу, не завершив тему`,
        ],
        EN: [
          `Read theory only and skip practical exercises`,
          `Independently complete examples and tasks and verify the output`,
          `Only copy ready-made answers`,
          `Skip to the next module without finishing`,
        ],
      },
      correctIndex: 1,
    },
  ];
}

const HTML_TOPICS: string[] = [
  'HTML ga kirish',
  'HTML asoslari',
  'HTML elementlari',
  'HTML atributlari',
  'HTML sarlavhalar (h1-h6)',
  'HTML paragraflar (<p>)',
  'HTML uslublar (style atributi)',
  'HTML matnni formatlash (b, strong, i, em)',
  'HTML iqtibos va izohlar',
  'HTML ranglar (HEX, RGB, HSL)',
  'HTML va CSS integratsiyasi',
  'HTML havolalar (<a> tegi)',
  'HTML rasmlar (<img> va alt)',
  'HTML Favicon qo‘shish',
  'HTML sahifa sarlavhasi (<title>)',
  'HTML jadvallar asoslari (<table>)',
  'HTML jadval chegaralari va o‘lchamlari',
  'HTML jadval sarlavhalari (<th>, <thead>)',
  'HTML Colspan va Rowspan',
  'HTML ro‘yxatlar: Tartibsiz (<ul>)',
  'HTML ro‘yxatlar: Tartibli (<ol>)',
  'HTML tavsif ro‘yxatlari (<dl>)',
  'HTML Block va Inline elementlar',
  'HTML <div> konteyneri bilan ishlash',
  'HTML <span> elementi',
  'HTML class atributi',
  'HTML id atributi',
  'HTML Iframes (ichki oynalar)',
  'HTML va JavaScript (<script>)',
  'HTML fayl yo‘llari (File Paths)',
  'HTML <head> bo‘limi va meta ma’lumotlar',
  'HTML semantik maketlash asoslari',
  'HTML <header> va <nav> teglari',
  'HTML <main>, <section> va <article>',
  'HTML <aside> va <footer> teglari',
  'HTML moslashuvchan dizayn (Responsive Meta)',
  'HTML kompyuter kodi (<code>, <pre>)',
  'HTML maxsus belgilar (Entities)',
  'HTML ramzlar va Emojilar (UTF-8)',
  'HTML URL kodlash qoidalari',
  'HTML va XHTML farqlari',
  'HTML formalar asoslari (<form>)',
  'HTML forma atributlari (action, method)',
  'HTML forma elementlari (<label>, <select>)',
  'HTML <textarea> va <button> elementlari',
  'HTML Input turlari: text, password, email',
  'HTML Input turlari: radio va checkbox',
  'HTML Input turlari: date, time, number',
  'HTML Input turlari: file, color, range',
  'HTML Input atributlari: required, readonly, disabled',
  'HTML Input atributlari: placeholder, pattern, min/max',
  'HTML5 Canvas grafikasi asoslari',
  'HTML5 SVG vektor grafikasi',
  'HTML5 Multimedia asoslari',
  'HTML5 <video> tegi va boshqaruv',
  'HTML5 <audio> tegi bilan ishlash',
  'HTML5 YouTube videolarni joylash',
  'HTML5 Geolocation API tushunchasi',
  'HTML5 Drag and Drop imkoniyati',
  'HTML5 Web Storage (localStorage tushunchasi)',
  'HTML Accessibility (ARIA atributlari)',
  'HTML SEO uchun muhim meta teglar',
  'HTML Open Graph (ijtimoiy tarmoq kartalari)',
  'HTML <details> va <summary> interaktiv teglar',
  'HTML <dialog> modal oynasi',
  'HTML <figure> va <figcaption> teglari',
  'HTML <time>, <mark> va <progress> teglari',
  'HTML <datalist> va avto-to‘ldirish',
  'HTML <fieldset> va <legend> guruhlash',
  'HTML Jadval va Forma kombinatsiyasi',
  'HTML Landing Page strukturasi loyihasi',
  'HTML Portfolio sahifasi karkasini qurish',
  'HTML kodni validatsiya qilish va tozalash',
  'HTML yakuniy imtihon va loyiha',
];

function buildHtmlModule(courseId: string): CourseModule {
  const items: CurriculumItem[] = [];
  const moduleId = 'web-html';

  HTML_TOPICS.forEach((topic, idx) => {
    const order = idx + 1;
    // Every 6th item after lesson 3 is a Practical, every 11th is a Test, ensuring Lesson 1, 2, 3 are exact lessons!
    let itemType: 'lesson' | 'practical' | 'test' = 'lesson';
    if (order > 3 && order % 9 === 0) {
      itemType = 'test';
    } else if (order > 3 && order % 5 === 0) {
      itemType = 'practical';
    }

    const prefixUz =
      itemType === 'practical'
        ? `Amaliy ish (${order}-bosqich) — ${topic}`
        : itemType === 'test'
        ? `Test (${order}-bosqich) — ${topic}`
        : `Dars ${order} — ${topic}`;

    const prefixRu =
      itemType === 'practical'
        ? `Практическая работа (${order}) — ${topic}`
        : itemType === 'test'
        ? `Тест (${order}) — ${topic}`
        : `Урок ${order} — ${topic}`;

    const prefixEn =
      itemType === 'practical'
        ? `Practical Task (${order}) — ${topic}`
        : itemType === 'test'
        ? `Quiz (${order}) — ${topic}`
        : `Lesson ${order} — ${topic}`;

    const sampleHtml = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>TexnoQadam - ${topic}</title>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #fff7ed; color: #1e293b; }
    .card { background: white; border: 2px solid #f97316; border-radius: 12px; padding: 16px; }
    h1 { color: #ea580c; margin-top: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Dars ${order}: ${topic}</h1>
    <p>TexnoQadam (Kurs Bor) platformasida amaliy mashg'ulot!</p>
  </div>
</body>
</html>`;

    items.push({
      id: `${moduleId}-item-${order}`,
      courseId,
      moduleId,
      order,
      type: itemType,
      title: {
        UZ: prefixUz,
        RU: prefixRu,
        EN: prefixEn,
      },
      content: {
        UZ:
          itemType === 'practical'
            ? `Ushbu amaliy topshiriqda "${topic}" mavzusi bo‘yicha HTML kod yozing, "Kodni ishga tushirish" tugmasi orqali natijani tekshiring va Admin CRM ga yuboring.`
            : itemType === 'test'
            ? `"${topic}" va oldingi darslar bo‘yicha olgan bilimlaringizni test orqali sinab ko‘ring.`
            : `Ushbu darsda biz veb-dasturlashning muhim qismi bo‘lgan "${topic}" mavzusini batafsil o‘rganamiz. Teglarning ochilishi, yopilishi, atributlari va zamonaviy HTML5 standartlarida qo‘llanilishiga e’tibor bering.`,
        RU:
          itemType === 'practical'
            ? `В этом практическом задании напишите HTML-код по теме «${topic}», запустите предпросмотр и отправьте работу на проверку в Admin CRM.`
            : itemType === 'test'
            ? `Проверьте свои знания по теме «${topic}», ответив на тестовые вопросы.`
            : `В этом уроке мы подробно изучим тему «${topic}». Обратите внимание на структуру тегов, атрибуты и современные стандарты HTML5.`,
        EN:
          itemType === 'practical'
            ? `In this practical assignment, write HTML code for "${topic}", run the live preview, and submit your solution to Admin CRM.`
            : itemType === 'test'
            ? `Test your understanding of "${topic}" by completing the quiz questions.`
            : `In this lesson we explore "${topic}" in detail, covering clean HTML5 semantics, attributes, and real-world structure.`,
      },
      examples: [
        `<section class="texnoqadam-box"><h2>${topic}</h2></section>`,
        `<!-- Dars ${order}: ${topic} namunasi -->`,
      ],
      codeExample: sampleHtml,
      starterCode: sampleHtml,
      codeLanguage: 'html',
      practicalMode: itemType === 'practical' ? 'code' : undefined,
      testQuestions: itemType === 'test' ? makeTestQuestions(topic, topic, topic, order) : undefined,
      rewardCoins: itemType === 'lesson' ? 25 : itemType === 'test' ? 30 : 70,
      rewardPoints: itemType === 'lesson' ? 25 : itemType === 'test' ? 30 : 70,
    });
  });

  return {
    id: moduleId,
    courseId,
    title: { UZ: '1. HTML (74 dars)', RU: '1. HTML (74 урока)', EN: '1. HTML (74 lessons)' },
    subtitle: {
      UZ: 'Veb-sahifalar karkasi va HTML5 standartlari',
      RU: 'Каркас веб-страниц и стандарты HTML5',
      EN: 'Web page structure & HTML5 standards',
    },
    moduleKind: 'module',
    items,
  };
}

function buildWebSubModule(
  courseId: string,
  moduleId: string,
  moduleTitleUz: string,
  moduleTitleRu: string,
  moduleTitleEn: string,
  topics: string[],
  practicalMode: 'code' | 'screenshot',
  codeLang?: 'html' | 'css' | 'bootstrap' | 'javascript' | 'react' | 'python'
): CourseModule {
  const items: CurriculumItem[] = topics.map((topic, idx) => {
    const order = idx + 1;
    let itemType: 'lesson' | 'practical' | 'test' = 'lesson';
    if (order > 2 && order % 8 === 0) {
      itemType = 'test';
    } else if (order > 2 && order % 4 === 0) {
      itemType = 'practical';
    }

    const titleUz =
      itemType === 'practical'
        ? `Amaliy ish — ${topic}`
        : itemType === 'test'
        ? `Test — ${topic}`
        : `Dars ${order} — ${topic}`;

    let starter = '';
    if (codeLang === 'python') {
      starter = `# TexnoQadam Python Kompilyatori\n# Mavzu: ${topic}\n\ndef texno_qadam():\n    ism = "O'quvchi"\n    ball = 100\n    print(f"Salom, {ism}! Mavzu: ${topic}")\n    print(f"Natija: {ball} ball")\n\ntexno_qadam()`;
    } else if (codeLang === 'javascript' || codeLang === 'react') {
      starter = `<!DOCTYPE html>\n<html>\n<head>\n  <style>body { font-family: sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; } button { background: #f97316; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; }</style>\n</head>\n<body>\n  <h2>${topic}</h2>\n  <p id="natija">Tugmani bosing...</p>\n  <button onclick="ishgaTushir()">Hisoblash</button>\n  <script>\n    function ishgaTushir() {\n      document.getElementById('natija').innerText = "TexnoQadam: ${topic} muvaffaqiyatli ishladi!";\n    }\n  </script>\n</body>\n</html>`;
    } else {
      starter = `<!DOCTYPE html>\n<html>\n<head>\n  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n  <style>\n    body { padding: 24px; background: #f8fafc; }\n    .demo-box { border-left: 5px solid #f97316; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }\n  </style>\n</head>\n<body>\n  <div class="demo-box">\n    <h3 class="text-warning fw-bold">${topic}</h3>\n    <p class="mb-0">TexnoQadam amaliy muhiti</p>\n  </div>\n</body>\n</html>`;
    }

    return {
      id: `${moduleId}-item-${order}`,
      courseId,
      moduleId,
      order,
      type: itemType,
      title: {
        UZ: titleUz,
        RU: itemType === 'practical' ? `Практика — ${topic}` : itemType === 'test' ? `Тест — ${topic}` : `Урок ${order} — ${topic}`,
        EN: itemType === 'practical' ? `Practical — ${topic}` : itemType === 'test' ? `Quiz — ${topic}` : `Lesson ${order} — ${topic}`,
      },
      content: {
        UZ:
          itemType === 'practical'
            ? practicalMode === 'screenshot'
              ? `Vazifani bajaring va natijaning screenshotini yuboring. Mavzu: "${topic}".`
              : `"${topic}" mavzusi bo‘yicha kod yozing, natijani kompilyatorda tekshiring va Admin CRM ga yuboring.`
            : `"${topic}" mavzusi bo‘yicha nazariy tushunchalar, amaliy kod namunalari va muhim qoidalar.`,
        RU:
          itemType === 'practical'
            ? practicalMode === 'screenshot'
              ? `Vazifani bajaring va natijaning screenshotini yuboring. (${topic})`
              : `Напишите и запустите код по теме «${topic}», затем отправьте на проверку.`
            : `Теоретический материал и практические примеры по теме «${topic}».`,
        EN:
          itemType === 'practical'
            ? practicalMode === 'screenshot'
              ? `Vazifani bajaring va natijaning screenshotini yuboring. (${topic})`
              : `Write and run your code for "${topic}", then submit for Admin CRM review.`
            : `Comprehensive lesson and examples covering "${topic}".`,
      },
      codeExample: practicalMode === 'code' ? starter : undefined,
      starterCode: practicalMode === 'code' ? starter : undefined,
      codeLanguage: codeLang,
      practicalMode: itemType === 'practical' ? practicalMode : undefined,
      testQuestions: itemType === 'test' ? makeTestQuestions(topic, topic, topic, order) : undefined,
      rewardCoins: itemType === 'lesson' ? 25 : itemType === 'test' ? 30 : 70,
      rewardPoints: itemType === 'lesson' ? 25 : itemType === 'test' ? 30 : 70,
    };
  });

  return {
    id: moduleId,
    courseId,
    title: { UZ: moduleTitleUz, RU: moduleTitleRu, EN: moduleTitleEn },
    moduleKind: 'module',
    items,
  };
}

function generateNumberedTopics(prefix: string, baseTopics: string[], targetCount: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < targetCount; i++) {
    const base = baseTopics[i % baseTopics.length];
    const cycle = Math.floor(i / baseTopics.length) + 1;
    result.push(cycle === 1 ? base : `${base} (${cycle}-qism)`);
  }
  return result;
}

function buildEnglishCourse(): Course {
  const courseId = 'english';
  const levels: { id: string; level: string; descUz: string; phrases: { topic: string; phrase: string; keywords: string[] }[] }[] = [
    {
      id: 'eng-a1',
      level: 'A1 — Beginner (18 dars)',
      descUz: 'Ingliz tilini 0 dan boshlovchilar uchun',
      phrases: [
        { topic: 'Alphabet & Greetings', phrase: 'Hello my name is Ali and nice to meet you', keywords: ['hello', 'name', 'nice', 'meet'] },
        { topic: 'Verb To Be (am, is, are)', phrase: 'I am a student at TexnoQadam platform', keywords: ['student', 'am', 'platform'] },
        { topic: 'Numbers & Colors', phrase: 'There are seven orange books on the table', keywords: ['seven', 'orange', 'books', 'table'] },
        { topic: 'Family & Friends', phrase: 'My family is very friendly and happy', keywords: ['family', 'friendly', 'happy'] },
        { topic: 'Daily Routine (Present Simple)', phrase: 'I wake up early and learn English every day', keywords: ['wake', 'learn', 'english', 'every', 'day'] },
        { topic: 'Food & Drinks', phrase: 'I would like a cup of hot tea please', keywords: ['would', 'like', 'tea', 'please'] },
      ],
    },
    {
      id: 'eng-a2',
      level: 'A2 — Elementary (18 dars)',
      descUz: 'Kundalik muloqot va zamonlar asoslari',
      phrases: [
        { topic: 'Past Simple & Memories', phrase: 'Yesterday I completed my coding lesson successfully', keywords: ['yesterday', 'completed', 'lesson'] },
        { topic: 'Future Plans (going to / will)', phrase: 'I am going to build a modern website tomorrow', keywords: ['going', 'build', 'website', 'tomorrow'] },
        { topic: 'Comparatives & Superlatives', phrase: 'Practice is the best way to improve skills', keywords: ['practice', 'best', 'improve', 'skills'] },
        { topic: 'Shopping & Directions', phrase: 'Excuse me how can I get to the central library', keywords: ['excuse', 'how', 'can', 'library'] },
        { topic: 'Health & Sports', phrase: 'Regular exercise keeps our mind and body strong', keywords: ['exercise', 'mind', 'body', 'strong'] },
        { topic: 'Travel & Holidays', phrase: 'We traveled by train and saw beautiful mountains', keywords: ['traveled', 'train', 'beautiful', 'mountains'] },
      ],
    },
    {
      id: 'eng-b1',
      level: 'B1 — Intermediate (18 dars)',
      descUz: 'Erkin suhbat va murakkab grammatika',
      phrases: [
        { topic: 'Present Perfect Experience', phrase: 'I have studied programming for six months', keywords: ['have', 'studied', 'programming', 'months'] },
        { topic: 'Conditionals (First & Second)', phrase: 'If I work hard every day I will achieve my goals', keywords: ['work', 'hard', 'achieve', 'goals'] },
        { topic: 'Passive Voice in Technology', phrase: 'Modern applications are developed by creative engineers', keywords: ['modern', 'applications', 'developed', 'engineers'] },
        { topic: 'Modal Verbs of Deduction', phrase: 'Technology plays an essential role in modern education', keywords: ['technology', 'essential', 'role', 'education'] },
        { topic: 'Reported Speech', phrase: 'My teacher said that consistency brings success', keywords: ['teacher', 'said', 'consistency', 'success'] },
        { topic: 'Job Interviews & Career', phrase: 'I am passionate about problem solving and teamwork', keywords: ['passionate', 'problem', 'solving', 'teamwork'] },
      ],
    },
    {
      id: 'eng-b2',
      level: 'B2 — Upper-Intermediate (18 dars)',
      descUz: 'Akademik va professional ingliz tili',
      phrases: [
        { topic: 'Artificial Intelligence & Future', phrase: 'Artificial intelligence transforms how people learn and work', keywords: ['artificial', 'intelligence', 'transforms', 'learn'] },
        { topic: 'Academic Essays & Arguments', phrase: 'Critical thinking enables students to analyze complex problems', keywords: ['critical', 'thinking', 'analyze', 'problems'] },
        { topic: 'Business Negotiations', phrase: 'We propose an innovative solution for sustainable growth', keywords: ['propose', 'innovative', 'solution', 'growth'] },
        { topic: 'Advanced Idioms & Phrasal Verbs', phrase: 'Continuous learning helps professionals stay ahead of the curve', keywords: ['continuous', 'learning', 'professionals', 'ahead'] },
        { topic: 'Global Environment & Science', phrase: 'Renewable energy sources reduce carbon emissions globally', keywords: ['renewable', 'energy', 'reduce', 'emissions'] },
        { topic: 'Public Speaking & Presentations', phrase: 'Thank you for your attention and I welcome your questions', keywords: ['thank', 'attention', 'welcome', 'questions'] },
      ],
    },
  ];

  const modules: CourseModule[] = levels.map((lvl) => {
    const items: CurriculumItem[] = [];
    for (let i = 1; i <= 18; i++) {
      const phraseObj = lvl.phrases[(i - 1) % lvl.phrases.length];
      // After every 4 lessons -> Amaliy (Test + Voice Recording)
      const isPractical = i % 5 === 0;
      const titleUz = isPractical
        ? `Amaliy (${i}-bosqich) — ${phraseObj.topic} (Test + Ovozli tekshiruv)`
        : `Dars ${i} — ${phraseObj.topic}`;

      items.push({
        id: `${lvl.id}-item-${i}`,
        courseId,
        moduleId: lvl.id,
        order: i,
        type: isPractical ? 'practical' : 'lesson',
        title: {
          UZ: titleUz,
          RU: isPractical ? `Практика (${i}) — ${phraseObj.topic}` : `Урок ${i} — ${phraseObj.topic}`,
          EN: isPractical ? `Practical (${i}) — ${phraseObj.topic}` : `Lesson ${i} — ${phraseObj.topic}`,
        },
        content: {
          UZ: isPractical
            ? `Ushbu amaliy topshiriqda avval test savollarini yeching, so‘ng mikrofonga quyidagi jumlani ingliz tilida aniq talaffuz qilib o‘qing. Sun’iy intellekt (AI) javobingizni tekshiradi!`
            : `Ingliz tilining "${phraseObj.topic}" mavzusi. Asosiy so‘z boyligi, grammatik qoliplar va talaffuz mashqlari. Namuna jumla: "${phraseObj.phrase}".`,
          RU: isPractical
            ? `Выполните тест и произнесите фразу на английском языке в микрофон для проверки через ИИ.`
            : `Изучение темы «${phraseObj.topic}». Ключевая фраза урока: "${phraseObj.phrase}".`,
          EN: isPractical
            ? `Complete the test and record the required sentence using your microphone for AI evaluation.`
            : `Study "${phraseObj.topic}". Key practice sentence: "${phraseObj.phrase}".`,
        },
        practicalMode: isPractical ? 'voice' : undefined,
        voicePrompt: isPractical
          ? {
              UZ: `Mikrofonni yoqing va ingliz tilida ayting: "${phraseObj.phrase}"`,
              RU: `Включите микрофон и произнесите по-английски: "${phraseObj.phrase}"`,
              EN: `Turn on the microphone and say clearly: "${phraseObj.phrase}"`,
            }
          : undefined,
        expectedTargetPhrase: phraseObj.phrase,
        expectedKeywords: phraseObj.keywords,
        testQuestions: isPractical ? makeTestQuestions(phraseObj.topic, phraseObj.topic, phraseObj.topic, i) : undefined,
        rewardCoins: isPractical ? 70 : 25,
        rewardPoints: isPractical ? 70 : 25,
      });
    }

    return {
      id: lvl.id,
      courseId,
      title: { UZ: lvl.level, RU: lvl.level, EN: lvl.level },
      subtitle: { UZ: lvl.descUz, RU: lvl.descUz, EN: lvl.descUz },
      moduleKind: 'level',
      items,
    };
  });

  return {
    id: courseId,
    slug: 'english',
    order: 2,
    title: { UZ: 'English', RU: 'Английский язык (English)', EN: 'English Language' },
    description: {
      UZ: 'A1 dan B2 darajagacha ingliz tili kurslari va AI ovozli talaffuz tekshiruvi.',
      RU: 'Курсы английского языка от A1 до B2 с проверкой произношения через ИИ.',
      EN: 'Complete A1 to B2 English courses with AI-powered voice pronunciation checking.',
    },
    category: 'Languages',
    badgeColor: 'from-blue-600 to-indigo-600',
    iconName: 'Globe',
    robotPose: 'thinking',
    modules,
  };
}

function buildGradeBasedCourse(
  courseId: string,
  orderNum: number,
  titleUz: string,
  titleRu: string,
  titleEn: string,
  descUz: string,
  badgeColor: string,
  iconName: string,
  robotPose: 'welcome' | 'coding' | 'celebrating' | 'thinking',
  gradeSamples: { topic: string; voicePhrase: string; keywords: string[] }[]
): Course {
  const modules: CourseModule[] = [];
  for (let grade = 1; grade <= 11; grade++) {
    const modId = `${courseId}-sinf-${grade}`;
    const items: CurriculumItem[] = [];
    // Each class: 45 lessons (with Amaliy after every 3 lessons)
    for (let i = 1; i <= 45; i++) {
      const sample = gradeSamples[(grade + i) % gradeSamples.length];
      const isPractical = i % 4 === 0;
      const itemTitleUz = isPractical
        ? `Amaliy (${i}-bosqich) — ${grade}-sinf: ${sample.topic}`
        : `Dars ${i} — ${grade}-sinf: ${sample.topic}`;

      items.push({
        id: `${modId}-item-${i}`,
        courseId,
        moduleId: modId,
        order: i,
        type: isPractical ? 'practical' : 'lesson',
        title: {
          UZ: itemTitleUz,
          RU: isPractical ? `Практика (${i}) — ${grade} класс: ${sample.topic}` : `Урок ${i} — ${grade} класс: ${sample.topic}`,
          EN: isPractical ? `Practical (${i}) — Grade ${grade}: ${sample.topic}` : `Lesson ${i} — Grade ${grade}: ${sample.topic}`,
        },
        content: {
          UZ: isPractical
            ? `${grade}-sinf "${sample.topic}" mavzusi bo‘yicha test savollariga javob bering va ovozli topshiriqni bajaring. AI javobingizni tekshiradi.`
            : `${grade}-sinf o‘quv dasturi asosida "${sample.topic}" mavzusining to‘liq tushuntirishi, qoidalar va misollar. Asosiy qoida: "${sample.voicePhrase}".`,
          RU: isPractical
            ? `Выполните тест и голосовое задание по теме «${sample.topic}» (${grade} класс).`
            : `Подробный урок для ${grade} класса по теме «${sample.topic}». Пример: "${sample.voicePhrase}".`,
          EN: isPractical
            ? `Complete the quiz and voice recording task for Grade ${grade} "${sample.topic}".`
            : `Detailed Grade ${grade} lesson on "${sample.topic}". Key rule: "${sample.voicePhrase}".`,
        },
        practicalMode: isPractical ? 'voice' : undefined,
        voicePrompt: isPractical
          ? {
              UZ: `Mikrofonga aniq o‘qib bering yoki javobni ayting: "${sample.voicePhrase}"`,
              RU: `Произнесите в микрофон ответ: "${sample.voicePhrase}"`,
              EN: `Speak into the microphone: "${sample.voicePhrase}"`,
            }
          : undefined,
        expectedTargetPhrase: sample.voicePhrase,
        expectedKeywords: sample.keywords,
        testQuestions: isPractical ? makeTestQuestions(sample.topic, sample.topic, sample.topic, i) : undefined,
        rewardCoins: isPractical ? 70 : 25,
        rewardPoints: isPractical ? 70 : 25,
      });
    }

    modules.push({
      id: modId,
      courseId,
      title: {
        UZ: `${grade}-sinf`,
        RU: `${grade}-sinf (${grade} класс)`,
        EN: `${grade}-sinf (Grade ${grade})`,
      },
      subtitle: {
        UZ: `45 ta ketma-ket dars va AI amaliy mashg‘ulotlar`,
        RU: `45 последовательных уроков и ИИ-практика`,
        EN: `45 sequential lessons & AI practical checks`,
      },
      moduleKind: 'grade',
      items,
    });
  }

  return {
    id: courseId,
    slug: courseId,
    order: orderNum,
    title: { UZ: titleUz, RU: titleRu, EN: titleEn },
    description: { UZ: descUz, RU: descUz, EN: descUz },
    recommendationBanner: {
      UZ: '0 dan o‘rganish uchun 1-sinfni tavsiya qilamiz.',
      RU: '0 dan o‘rganish uchun 1-sinfni tavsiya qilamiz.',
      EN: '0 dan o‘rganish uchun 1-sinfni tavsiya qilamiz.',
    },
    category: 'School & Core',
    badgeColor,
    iconName,
    robotPose,
    modules,
  };
}

export function generateAllCourses(): Course[] {
  // 1. Web-Dasturlash
  const webCourseId = 'web-dasturlash';
  const htmlModule = buildHtmlModule(webCourseId);

  const cssTopics = generateNumberedTopics(
    'CSS',
    [
      'CSS ga kirish va sintaksis',
      'CSS Selektorlar (class, id, element)',
      'Ranglar, Orqa fon (background) xossalari',
      'Box Model: Margin, Border, Padding',
      'Matn va Shriftlar (Google Fonts)',
      'Flexbox maketlash tizimi',
      'CSS Grid zamonaviy tizimi',
      'Position: relative, absolute, fixed, sticky',
      'Transition va Transform animatsiyalar',
      'Keyframes va murakkab animatsiyalar',
      'Media Queries va Responsive dizayn',
    ],
    32
  );

  const bootstrapTopics = generateNumberedTopics(
    'Bootstrap',
    [
      'Bootstrap 5 ga kirish va CDN ulash',
      'Container va 12 ustunli Grid tizimi',
      'Bootstrap Typography va Ranglar',
      'Buttons, Badges va Alerts komponentlari',
      'Bootstrap Navbar va Offcanvas menyu',
      'Cards va Modal oynalar',
      'Forms, Floating Labels va Validatsiya',
      'Carousel va Accordion komponentlari',
      'Utility klasslar (Spacing, Flex, Shadow)',
      'Bootstrap yordamida to‘liq Landing Page',
    ],
    30
  );

  const tildaTopics = generateNumberedTopics(
    'Tilda',
    [
      'Tilda Publishing platformasiga kirish',
      'Standart bloklar kutubxonasi bilan ishlash',
      'Zero Block — professional erkin dizayn',
      'Tipografika va maxsus shriftlar yuklash',
      'Moslashuvchan (Mobile/Tablet) Zero Block',
      'Step-by-step animatsiyalar yaratish',
      'Formalar va Telegram/CRM integratsiyasi',
      'Tilda E-commerce: Internet do‘kon katalogi',
      'Domen ulash, HTTPS va SEO sozlamalari',
      'Ko‘p sahifali sayt nashr qilish (Publish)',
    ],
    30
  );

  const gitTopics = generateNumberedTopics(
    'Git',
    [
      'Versiyalarni boshqarish va Git o‘rnatish',
      'git init, git status va git add buyruqlari',
      'git commit va o‘zgarishlar tarixi (git log)',
      '.gitignore fayli bilan ishlash',
      'Shoxobchalar: git branch va git checkout',
      'git merge va konfliktlarni bartaraf etish',
      'GitHub hisobi va uzoq repozitoriy (remote)',
      'git push, git pull va git clone',
      'Pull Request va jamoaviy Code Review',
      'GitHub Pages orqali saytni joylashtirish',
    ],
    30
  );

  const jsTopics = generateNumberedTopics(
    'JavaScript',
    [
      'JavaScript ga kirish: let, const va ma’lumot turlari',
      'Arifmetik va mantiqiy operatorlar',
      'Shart operatorlari: if, else, switch',
      'Sikllar: for, while, for...of',
      'Funksiyalar, Arrow Functions va Scope',
      'Massivlar (Arrays) va map, filter, reduce',
      'Obyektlar (Objects) va Destructuring',
      'DOM daraxti: querySelector va elementlarni o‘zgartirish',
      'Hodisalar (Events) va addEventListener',
      'Fetch API, Promises va Async/Await',
      'Interaktiv Web ilova yaratish',
    ],
    32
  );

  const reactTopics = generateNumberedTopics(
    'React',
    [
      'React.js ga kirish va JSX sintaksisi',
      'Komponentlar va Props uzatish',
      'useState Hook va interaktiv holat',
      'Ro‘yxatlar (Lists) va Keys qoidasi',
      'Formalar va Controlled Components',
      'useEffect Hook va hayot sikli',
      'Custom Hooks yaratish',
      'Context API bilan global holatni boshqarish',
      'React Router va ko‘p sahifali SPA',
      'To‘liq React Dashboard loyihasi',
    ],
    32
  );

  const pythonTopics = generateNumberedTopics(
    'Python',
    [
      'Python dasturlash tiliga kirish va print()',
      'O‘zgaruvchilar va ma’lumot turlari (int, str, float)',
      'Shart operatorlari: if, elif, else',
      'Sikllar: for va while',
      'Ro‘yxatlar (Lists), Tuple va Set',
      'Lug‘atlar (Dictionaries) bilan ishlash',
      'Funksiyalar (def, return, *args)',
      'Fayllar va Xatoliklarni ushlash (try/except)',
      'OOP asoslari: Class va Object',
      'Python algoritmik masalalar yechimi',
    ],
    32
  );

  const webCourse: Course = {
    id: webCourseId,
    slug: 'web-dasturlash',
    order: 1,
    title: {
      UZ: 'Web-Dasturlash',
      RU: 'Веб-разработка (Web-Dasturlash)',
      EN: 'Web Development',
    },
    description: {
      UZ: 'HTML (74 dars), CSS, Bootstrap, Tilda, Git, JavaScript, React va Python — ichki kod kompilyatori bilan to‘liq kurs.',
      RU: 'HTML, CSS, Bootstrap, Tilda, Git, JavaScript, React и Python со встроенным компилятором кода.',
      EN: 'Full-stack curriculum covering HTML (74 lessons), CSS, Bootstrap, Tilda, Git, JS, React & Python with live compiler.',
    },
    category: 'Programming',
    badgeColor: 'from-orange-500 to-amber-500',
    iconName: 'Code2',
    robotPose: 'coding',
    modules: [
      htmlModule,
      buildWebSubModule(webCourseId, 'web-css', '2. CSS (32 dars)', '2. CSS (32 урока)', '2. CSS (32 lessons)', cssTopics, 'code', 'css'),
      buildWebSubModule(webCourseId, 'web-bootstrap', '3. Bootstrap (30 dars)', '3. Bootstrap (30 уроков)', '3. Bootstrap (30 lessons)', bootstrapTopics, 'code', 'bootstrap'),
      buildWebSubModule(webCourseId, 'web-tilda', '4. Tilda (30 dars)', '4. Tilda (30 уроков)', '4. Tilda (30 lessons)', tildaTopics, 'screenshot'),
      buildWebSubModule(webCourseId, 'web-git', '5. Git (30 dars)', '5. Git (30 уроков)', '5. Git (30 lessons)', gitTopics, 'screenshot'),
      buildWebSubModule(webCourseId, 'web-js', '6. JavaScript (32 dars)', '6. JavaScript (32 урока)', '6. JavaScript (32 lessons)', jsTopics, 'code', 'javascript'),
      buildWebSubModule(webCourseId, 'web-react', '7. React (32 dars)', '7. React (32 урока)', '7. React (32 lessons)', reactTopics, 'code', 'react'),
      buildWebSubModule(webCourseId, 'web-python', '8. Python (32 dars)', '8. Python (32 урока)', '8. Python (32 lessons)', pythonTopics, 'code', 'python'),
    ],
  };

  // 2. English
  const englishCourse = buildEnglishCourse();

  // 3. Matematika (1-sinf to 11-sinf, 45 lessons each)
  const mathCourse = buildGradeBasedCourse(
    'matematika',
    3,
    'Matematika',
    'Математика (Matematika)',
    'Mathematics',
    '1-sinfdan 11-sinfgacha mantiqiy va algebraik matematika kurslari (har bir sinfda 45 dars).',
    'from-emerald-500 to-teal-600',
    'Calculator',
    'thinking',
    [
      { topic: 'Natural sonlar va arifmetik amallar', voicePhrase: 'Ikki karra ikki to‘rt ga teng', keywords: ['ikki', 'to‘rt', 'teng', '4'] },
      { topic: 'Kasrlar va o‘nli kasrlar ustida amallar', voicePhrase: 'Kasrning surati va maxraji bo‘ladi', keywords: ['kasr', 'surat', 'maxraj'] },
      { topic: 'Tenglamalar va tengsizliklar tizimi', voicePhrase: 'Chiziqli tenglama bitta ildizga ega', keywords: ['tenglama', 'ildiz', 'chiziqli'] },
      { topic: 'Geometrik shakllar yuzi va perimetri', voicePhrase: 'To‘rtburchakning perimetri tomonlar yig‘indisiga teng', keywords: ['perimetr', 'tomon', 'yig‘indi'] },
      { topic: 'Foizlar, proporsiya va matnli masalalar', voicePhrase: 'Yuz foiz butun miqdorni bildiradi', keywords: ['yuz', 'foiz', 'butun'] },
    ]
  );

  // 4. Rus tili (1-sinf to 11-sinf, 45 lessons each)
  const russianCourse = buildGradeBasedCourse(
    'rus-tili',
    4,
    'Rus tili',
    'Русский язык (Rus tili)',
    'Russian Language',
    '1-sinfdan 11-sinfgacha rus tili grammatikasi va AI ovozli suhbat amaliyoti (har bir sinfda 45 dars).',
    'from-sky-500 to-blue-600',
    'Languages',
    'welcome',
    [
      { topic: 'Алфавит и приветствие (Alifbo va salomlashuv)', voicePhrase: 'Здравствуйте меня зовут ученик ТехноКадам', keywords: ['здравствуйте', 'меня', 'зовут', 'ученик'] },
      { topic: 'Имя существительное и род (Ot so‘z turkumi)', voicePhrase: 'Книга лежит на письменном столе', keywords: ['книга', 'лежит', 'столе'] },
      { topic: 'Глаголы настоящего и прошедшего времени', voicePhrase: 'Я каждый день изучаю русский язык', keywords: ['каждый', 'день', 'изучаю', 'русский'] },
      { topic: 'Падежи русского языка (Kelishiklar)', voicePhrase: 'Мы гордимся нашими новыми знаниями', keywords: ['гордимся', 'знаниями', 'новыми'] },
      { topic: 'Разговорная речь и диалоги', voicePhrase: 'Спасибо большое за интересный урок', keywords: ['спасибо', 'интересный', 'урок'] },
    ]
  );

  // 5. Ona tili (1-sinf to 11-sinf, 45 lessons each)
  const nativeLangCourse = buildGradeBasedCourse(
    'ona-tili',
    5,
    'Ona tili',
    'Родной язык (Ona tili)',
    'Uzbek Native Language',
    '1-sinfdan 11-sinfgacha o‘zbek tili imlosi, fonetika, morfologiya va sintaksis (har bir sinfda 45 dars).',
    'from-violet-500 to-purple-600',
    'BookOpen',
    'celebrating',
    [
      { topic: 'Fonetika: Unli va undosh tovushlar', voicePhrase: 'O‘zbek tilida oltita unli tovush bor', keywords: ['o‘zbek', 'oltita', 'unli', 'tovush'] },
      { topic: 'Imlo qoidalari va bo‘g‘in ko‘chirish', voicePhrase: 'So‘zlar bo‘g‘inlab to‘g‘ri yoziladi', keywords: ['so‘z', 'bo‘g‘in', 'to‘g‘ri'] },
      { topic: 'So‘z turkumlari: Ot, Sifat, Son, Fe’l', voicePhrase: 'Ot shaxs va narsa buyum nomini bildiradi', keywords: ['ot', 'shaxs', 'narsa', 'bildiradi'] },
      { topic: 'Gap bo‘laklari: Ega va kesim', voicePhrase: 'Ega va kesim gapning bosh bo‘laklaridir', keywords: ['ega', 'kesim', 'bosh', 'bo‘lak'] },
      { topic: 'Nutq uslublari va adabiy til me’yorlari', voicePhrase: 'Ona tilimiz milliy ma’naviyatimiz ko‘zgusidir', keywords: ['ona', 'tili', 'milliy', 'ko‘zgu'] },
    ]
  );

  // 6. Grafik dizayn (32 lessons, screenshot practicals after every 1-2 lessons)
  const designTopics = [
    'Grafik dizayn asoslari va yo‘nalishlari',
    'Dizayn tamoyillari: Balans, Kontrast va Ierarxiya',
    'Kompozitsiya va Oltin kesim qoidasi',
    'Ranglar nazariyasi (Color Theory) va psixologiyasi',
    'Tipografika va shriftlar uyg‘unligi',
    'Foydalanuvchi interfeysi (UI) dizayni asoslari',
    'Figma muhitida Auto-Layout va Komponentlar',
    'Logotip va Brendbuk (Brand Identity) yaratish',
    'Ijtimoiy tarmoqlar uchun SMD banner dizayni',
    'O‘yin aktivlari (Game Assets) va Pixel Art yaratish',
    'MagicaVoxel dasturiga kirish va Voxel Art',
    'MagicaVoxel da 3D o‘yin qahramonini modellashtirish',
    'MagicaVoxel da yorug‘lik (Render) va materiallar',
    '3D dizayn tushunchalari va izometrik illyustratsiya',
    'Mockup tayyorlash va mijozga taqdimot qilish',
    'Dizayner portfolioni Behance va Dribbble ga joylash',
  ];
  const designItems: CurriculumItem[] = [];
  let designOrder = 1;
  designTopics.forEach((topic) => {
    // Lesson
    designItems.push({
      id: `grafik-item-${designOrder}`,
      courseId: 'grafik-dizayn',
      moduleId: 'grafik-main',
      order: designOrder,
      type: 'lesson',
      title: {
        UZ: `Dars ${designOrder} — ${topic}`,
        RU: `Урок ${designOrder} — ${topic}`,
        EN: `Lesson ${designOrder} — ${topic}`,
      },
      content: {
        UZ: `"${topic}" mavzusida professional dizayn qoidalari, kompozitsiya yechimlari, MagicaVoxel hamda zamonaviy grafik vositalarda ishlash usullarini o‘rganamiz.`,
        RU: `Изучение темы «${topic}»: принципы композиции, цвета, типографики и 3D/Voxel графики.`,
        EN: `Master "${topic}" covering visual hierarchy, composition, color systems, and 3D MagicaVoxel workflows.`,
      },
      rewardCoins: 25,
      rewardPoints: 25,
    });
    designOrder++;

    // Screenshot Practical right after every lesson (1-2 lessons cadence, total 32 items)
    designItems.push({
      id: `grafik-item-${designOrder}`,
      courseId: 'grafik-dizayn',
      moduleId: 'grafik-main',
      order: designOrder,
      type: 'practical',
      title: {
        UZ: `Amaliy (${designOrder}-bosqich) — ${topic}`,
        RU: `Практика (${designOrder}) — ${topic}`,
        EN: `Practical (${designOrder}) — ${topic}`,
      },
      content: {
        UZ: `Vazifani bajaring va natijaning screenshotini yuboring. ("${topic}" bo‘yicha tayyorlagan dizayn ishingizni yuklang).`,
        RU: `Vazifani bajaring va natijaning screenshotini yuboring. (${topic})`,
        EN: `Vazifani bajaring va natijaning screenshotini yuboring. (${topic})`,
      },
      practicalMode: 'screenshot',
      rewardCoins: 70,
      rewardPoints: 70,
    });
    designOrder++;
  });

  const designCourse: Course = {
    id: 'grafik-dizayn',
    slug: 'grafik-dizayn',
    order: 6,
    title: { UZ: 'Grafik dizayn', RU: 'Графический дизайн', EN: 'Graphic Design' },
    description: {
      UZ: 'Kompozitsiya, ranglar, tipografika, UI dizayn, Game Assets, MagicaVoxel va 3D dizayn (32 dars).',
      RU: 'Композиция, цвет, типографика, UI-дизайн, игровые ассеты, MagicaVoxel и 3D (32 урока).',
      EN: 'Design principles, composition, color, typography, UI, game assets, MagicaVoxel & 3D concepts (32 lessons).',
    },
    category: 'Design',
    badgeColor: 'from-pink-500 to-rose-600',
    iconName: 'Palette',
    robotPose: 'welcome',
    modules: [
      {
        id: 'grafik-main',
        courseId: 'grafik-dizayn',
        title: { UZ: 'Grafik va 3D Dizayn (32 bosqich)', RU: 'Графический и 3D Дизайн', EN: 'Graphic & 3D Design' },
        moduleKind: 'module',
        items: designItems,
      },
    ],
  };

  // 7. Telegram bot (28 lessons, screenshot practicals after every 1-2 lessons)
  const tgTopics = [
    'Telegram bot asoslari va ishlash arxitekturasi',
    'BotFather orqali yangi Telegram bot yaratish va Token olish',
    'Telegram orqali to‘g‘ridan-to‘g‘ri konstruktor bot yaratish',
    'Python va aiogram / pyTelegramBotAPI kutubxonasini o‘rnatish',
    'Buyruqlar (Commands): /start va /help handlerlari',
    'Matnli, rasm va media xabarlarni (Messages) qayta ishlash',
    'Reply Keyboard tugmalarini (Buttons) yaratish',
    'Inline Keyboard va CallbackQuery bilan ishlash',
    'Foydalanuvchi ma’lumotlarini yig‘ish (FSM States)',
    'Telegram botni ma’lumotlar bazasiga (SQLite/JSON) ulash',
    'Admin panel va foydalanuvchilarga ommaviy xabar yuborish',
    'Telegram WebApp va to‘lov tizimlari tushunchasi',
    'Telegram kanal va guruhlarni boshqaruvchi moderator bot',
    'Telegram botni serverga (Hosting/Cloud) 24/7 rejimda joylash',
  ];
  const tgItems: CurriculumItem[] = [];
  let tgOrder = 1;
  tgTopics.forEach((topic) => {
    tgItems.push({
      id: `tg-item-${tgOrder}`,
      courseId: 'telegram-bot',
      moduleId: 'tg-main',
      order: tgOrder,
      type: 'lesson',
      title: {
        UZ: `Dars ${tgOrder} — ${topic}`,
        RU: `Урок ${tgOrder} — ${topic}`,
        EN: `Lesson ${tgOrder} — ${topic}`,
      },
      content: {
        UZ: `"${topic}" mavzusida BotFather, Python Bot API, buyruqlar va tugmalar bilan ishlashni qadam-baqadam o‘rganamiz.`,
        RU: `Изучение темы «${topic}»: создание Telegram-ботов через BotFather и Python API.`,
        EN: `Step-by-step guide to "${topic}" using BotFather and Python Telegram Bot API.`,
      },
      rewardCoins: 25,
      rewardPoints: 25,
    });
    tgOrder++;

    tgItems.push({
      id: `tg-item-${tgOrder}`,
      courseId: 'telegram-bot',
      moduleId: 'tg-main',
      order: tgOrder,
      type: 'practical',
      title: {
        UZ: `Amaliy (${tgOrder}-bosqich) — ${topic}`,
        RU: `Практика (${tgOrder}) — ${topic}`,
        EN: `Practical (${tgOrder}) — ${topic}`,
      },
      content: {
        UZ: `Vazifani bajaring va natijaning screenshotini yuboring. (Telegram botingiz ishlagan holatini screenshot qilib yuboring).`,
        RU: `Vazifani bajaring va natijaning screenshotini yuboring. (${topic})`,
        EN: `Vazifani bajaring va natijaning screenshotini yuboring. (${topic})`,
      },
      practicalMode: 'screenshot',
      rewardCoins: 70,
      rewardPoints: 70,
    });
    tgOrder++;
  });

  const tgCourse: Course = {
    id: 'telegram-bot',
    slug: 'telegram-bot',
    order: 7,
    title: { UZ: 'Telegram bot', RU: 'Telegram-боты', EN: 'Telegram Bot Development' },
    description: {
      UZ: 'BotFather, Python Telegram Bot API, buyruqlar, tugmalar va real botlar yaratish amaliyoti (28 dars).',
      RU: 'BotFather, Python Telegram Bot API, команды, кнопки и практика создания ботов (28 уроков).',
      EN: 'BotFather, Python Telegram Bot API, commands, buttons & practical bot engineering (28 lessons).',
    },
    category: 'Programming',
    badgeColor: 'from-cyan-500 to-blue-600',
    iconName: 'Bot',
    robotPose: 'coding',
    modules: [
      {
        id: 'tg-main',
        courseId: 'telegram-bot',
        title: { UZ: 'Telegram Bot Dasturlash (28 bosqich)', RU: 'Разработка Telegram-ботов', EN: 'Telegram Bot Mastery' },
        moduleKind: 'module',
        items: tgItems,
      },
    ],
  };

  // 8. Sun’iy intellekt (24 lessons, exact naming pattern: AI da "Sun’iy intellekt nomi")
  const aiTools = [
    'ChatGPT',
    'Google Gemini',
    'Claude AI',
    'Midjourney',
    'DALL-E 3',
    'Runway Gen-3',
    'ElevenLabs',
    'Suno AI',
    'Cursor AI',
    'Perplexity AI',
    'GitHub Copilot',
    'Canva Magic Studio',
  ];
  const aiItems: CurriculumItem[] = [];
  let aiOrder = 1;
  aiTools.forEach((toolName) => {
    const exactTitle = `AI da "${toolName}"`;
    aiItems.push({
      id: `ai-item-${aiOrder}`,
      courseId: 'suniy-intellekt',
      moduleId: 'ai-main',
      order: aiOrder,
      type: 'lesson',
      title: {
        UZ: `Dars ${aiOrder} — ${exactTitle}`,
        RU: `Урок ${aiOrder} — ${exactTitle}`,
        EN: `Lesson ${aiOrder} — ${exactTitle}`,
      },
      content: {
        UZ: `${exactTitle} texnologiyasining imkoniyatlari, to‘g‘ri prompt yozish (Prompt Engineering) sirlari va amaliy loyihalarda samarali foydalanish bo‘yicha mukammal dars.`,
        RU: `Полное руководство по использованию ${exactTitle}: промпт-инжиниринг и реальные сценарии применения.`,
        EN: `Comprehensive guide to ${exactTitle}: prompt engineering techniques and real-world workflows.`,
      },
      rewardCoins: 25,
      rewardPoints: 25,
    });
    aiOrder++;

    aiItems.push({
      id: `ai-item-${aiOrder}`,
      courseId: 'suniy-intellekt',
      moduleId: 'ai-main',
      order: aiOrder,
      type: 'practical',
      title: {
        UZ: `Amaliy (${aiOrder}-bosqich) — ${exactTitle}`,
        RU: `Практика (${aiOrder}) — ${exactTitle}`,
        EN: `Practical (${aiOrder}) — ${exactTitle}`,
      },
      content: {
        UZ: `Vazifani bajaring va natijaning screenshotini yuboring. (${exactTitle} dasturida prompt yozib olgan natijangiz screenshotini yuklang).`,
        RU: `Vazifani bajaring va natijaning screenshotini yuboring. (${exactTitle})`,
        EN: `Vazifani bajaring va natijaning screenshotini yuboring. (${exactTitle})`,
      },
      practicalMode: 'screenshot',
      rewardCoins: 70,
      rewardPoints: 70,
    });
    aiOrder++;
  });

  const aiCourse: Course = {
    id: 'suniy-intellekt',
    slug: 'suniy-intellekt',
    order: 8,
    title: { UZ: 'Sun’iy intellekt', RU: 'Искусственный интеллект', EN: 'Artificial Intelligence' },
    description: {
      UZ: 'Zamonaviy AI texnologiyalari: AI da "ChatGPT", AI da "Google Gemini", AI da "Midjourney" va boshqalar (24 dars).',
      RU: 'Современные ИИ-инструменты: AI da "ChatGPT", AI da "Google Gemini", AI da "Midjourney" и другие (24 урока).',
      EN: 'Modern AI tools & prompt engineering: AI da "ChatGPT", AI da "Google Gemini", AI da "Midjourney" and more (24 lessons).',
    },
    category: 'AI & Future',
    badgeColor: 'from-amber-500 to-orange-600',
    iconName: 'Sparkles',
    robotPose: 'celebrating',
    modules: [
      {
        id: 'ai-main',
        courseId: 'suniy-intellekt',
        title: { UZ: 'Sun’iy Intellekt Texnologiyalari (24 bosqich)', RU: 'Технологии ИИ', EN: 'AI Technologies' },
        moduleKind: 'module',
        items: aiItems,
      },
    ],
  };

  return [
    webCourse,
    englishCourse,
    mathCourse,
    russianCourse,
    nativeLangCourse,
    designCourse,
    tgCourse,
    aiCourse,
  ];
}
