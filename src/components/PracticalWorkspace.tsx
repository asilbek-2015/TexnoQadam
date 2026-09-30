import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Code2,
  Image as ImageIcon,
  Mic,
  MicOff,
  Play,
  Send,
  Sparkles,
  Upload,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { CurriculumItem, Language, PracticalSubmission } from '../types';
import { UI_TEXT } from '../translations';
import { RobotMascot } from './BrandVisuals';

interface PracticalWorkspaceProps {
  item: CurriculumItem;
  courseId: string;
  moduleId: string;
  language: Language;
  token: string;
  existingSubmission?: PracticalSubmission;
  isCompleted: boolean;
  onSubmitted: (data: any) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PracticalWorkspace: React.FC<PracticalWorkspaceProps> = ({
  item,
  courseId,
  moduleId,
  language,
  token,
  existingSubmission,
  isCompleted,
  onSubmitted,
  onToast,
}) => {
  const t = UI_TEXT[language];

  // 1. CODE COMPILER STATE
  const [code, setCode] = useState<string>(
    existingSubmission?.submittedCode || item.starterCode || item.codeExample || ''
  );
  const [codeOutput, setCodeOutput] = useState<string>(existingSubmission?.codeOutput || '');
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string>('');
  const [runningCode, setRunningCode] = useState(false);

  // 2. VOICE + TEST STATE
  const [testAnswers, setTestAnswers] = useState<number[]>(
    (item.testQuestions || []).map(() => -1)
  );
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(
    existingSubmission?.voiceTranscript || ''
  );
  const [audioBase64, setAudioBase64] = useState<string>('');
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/webm');
  const [aiResult, setAiResult] = useState<{
    status: 'Correct' | 'Incorrect' | 'Needs Retry' | null;
    message: string;
  }>({ status: null, message: '' });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 3. SCREENSHOT STATE
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>(
    existingSubmission?.screenshotDataUrl || ''
  );
  const [submitting, setSubmitting] = useState(false);

  // Run Code Handler (HTML, CSS, Bootstrap, JS, React, Python)
  const handleRunCode = async () => {
    setRunningCode(true);
    const lang = item.codeLanguage || 'html';

    try {
      if (lang === 'html' || lang === 'css' || lang === 'bootstrap') {
        setIframeSrcDoc(code);
        setCodeOutput('Brauzer oynasida muvaffaqiyatli render qilindi.');
      } else if (lang === 'javascript' || lang === 'react') {
        const logs: string[] = [];
        let returnedHtml = '';
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map((a) => String(a)).join(' ')),
          error: (...args: any[]) => logs.push('Xato: ' + args.map((a) => String(a)).join(' ')),
          warn: (...args: any[]) => logs.push('Ogohlantirish: ' + args.map((a) => String(a)).join(' ')),
        };
        try {
          const fn = new Function('console', code + '\n; if (typeof renderComponent === "function") return renderComponent();');
          const res = fn(customConsole);
          if (typeof res === 'string' && res.includes('<')) {
            returnedHtml = res;
          }
        } catch (err: any) {
          logs.push('RuntimeError: ' + (err?.message || String(err)));
        }
        setCodeOutput(logs.join('\n') || 'Kod xatosiz bajarildi.');
        if (returnedHtml) {
          setIframeSrcDoc(returnedHtml);
        } else {
          setIframeSrcDoc(
            `<html><body style="font-family:monospace;padding:16px;background:#0f172a;color:#38bdf8;"><pre>${logs.join(
              '\n'
            )}</pre></body></html>`
          );
        }
      } else if (lang === 'python') {
        const res = await fetch('/api/code/run-python', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (data.error) {
          setCodeOutput(data.error);
        } else {
          setCodeOutput(data.output || 'Bajarildi.');
        }
      }
    } finally {
      setRunningCode(false);
    }
  };

  // Start / Stop Voice Recording
  const handleStartRecording = async () => {
    setAiResult({ status: null, message: '' });
    setVoiceTranscript('');
    setAudioBase64('');
    chunksRef.current = [];

    // Start Web Speech API live transcription if supported in browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang =
          courseId === 'english' ? 'en-US' : courseId === 'rus-tili' ? 'ru-RU' : 'uz-UZ';
        recognition.onresult = (event: any) => {
          let txt = '';
          for (let i = 0; i < event.results.length; i++) {
            txt += event.results[i][0].transcript + ' ';
          }
          setVoiceTranscript(txt.trim());
        };
        recognition.start();
        speechRecRef.current = recognition;
      } catch {
        // Ignore if SpeechRecognition fails to start
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioMimeType(recorder.mimeType || 'audio/webm');
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64str = String(reader.result || '').split(',')[1] || '';
          setAudioBase64(base64str);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      // If microphone permission is blocked in iframe, allow speech transcript input so user is never stuck
      setIsRecording(true);
      onToast(
        'Mikrofon ulandi. Gapiring yoki ovoz matnini tasdiqlang.',
        'info'
      );
    }
  };

  const handleStopRecording = () => {
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Screenshot Upload Handler (compresses image onto canvas so it stores cleanly)
  const handleScreenshotFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 900;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setScreenshotDataUrl(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.src = String(ev.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  // Submit Practical Work
  const handleSubmitPractical = async () => {
    setSubmitting(true);
    setAiResult({ status: null, message: '' });

    try {
      const res = await fetch('/api/student/submit-practical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          moduleId,
          itemId: item.id,
          submittedCode: code,
          codeOutput,
          screenshotDataUrl,
          voiceTranscript,
          audioBase64,
          audioMimeType,
          testAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (item.practicalMode === 'voice') {
          setAiResult({
            status: data.aiStatus || 'Incorrect',
            message: data.error || 'Javob noto‘g‘ri. Qaytadan urinib ko‘ring.',
          });
        }
        onToast(data.error || 'Xatolik yuz berdi', 'error');
        return;
      }

      if (item.practicalMode === 'voice') {
        setAiResult({
          status: 'Correct',
          message: data.message || 'Amaliy muvaffaqiyatli bajarildi. Keyingi dars ochildi.',
        });
        onToast(`${data.message} (+70 Coin, +70 Point)`, 'success');
      } else {
        onToast(data.message || t.pendingAdminReview, 'success');
      }
      onSubmitted(data);
    } catch {
      onToast('Server bilan bog‘lanishda xatolik.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Submission Status Banner if already submitted */}
      {existingSubmission && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            existingSubmission.status === 'Approved'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : existingSubmission.status === 'Rejected'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {existingSubmission.status === 'Approved' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          {existingSubmission.status === 'Rejected' && (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          {existingSubmission.status === 'Pending' && (
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-sm">
            <p className="font-bold">
              Holat: {existingSubmission.status}{' '}
              {existingSubmission.status === 'Approved' && '(+70 Coin, +70 Point berildi)'}
            </p>
            <p className="mt-1">
              {existingSubmission.status === 'Approved' && t.approvedStatus}
              {existingSubmission.status === 'Rejected' &&
                `${t.rejectedStatus} ${
                  existingSubmission.adminReason ? `Sabab: ${existingSubmission.adminReason}` : ''
                }`}
              {existingSubmission.status === 'Pending' && t.pendingAdminReview}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 1: INTEGRATED CODE COMPILER (HTML/CSS/BS/JS/React/Python) */}
      {/* ======================================================== */}
      {item.practicalMode === 'code' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <Code2 className="w-4 h-4 text-orange-400" />
              <span>
                TexnoQadam Code Compiler ({(item.codeLanguage || 'html').toUpperCase()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunCode}
                disabled={runningCode}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{t.runCodeBtn}</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitPractical}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Yuborilmoqda...' : t.submitPracticalBtn}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Code Editor Area */}
            <div className="p-4">
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Kod muharriri (Kodni shu yerda yozing va tahrirlang):
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full bg-slate-950 text-amber-100 font-mono text-xs leading-relaxed p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 resize-y"
              />
            </div>

            {/* Live Output / Browser Preview Area */}
            <div className="p-4 flex flex-col">
              <span className="block text-xs font-medium text-slate-400 mb-2">
                Natija oynasi (Output / Preview):
              </span>
              {item.codeLanguage === 'python' ? (
                <div className="flex-1 min-h-[260px] bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">
                  {codeOutput || 'Python natijasini ko‘rish uchun "Kodni ishga tushirish" tugmasini bosing...'}
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-3">
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-700 h-56">
                    {iframeSrcDoc ? (
                      <iframe
                        title="Code Preview"
                        srcDoc={iframeSrcDoc}
                        sandbox="allow-scripts"
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs p-4 text-center">
                        Natijani ko‘rish uchun &ldquo;{t.runCodeBtn}&rdquo; tugmasini bosing
                      </div>
                    )}
                  </div>
                  {codeOutput && (
                    <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-xl border border-slate-800">
                      {codeOutput}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: VOICE + TEST PRACTICAL (English, Rus, Math, Ona tili) */}
      {/* ======================================================== */}
      {item.practicalMode === 'voice' && (
        <div className="space-y-6">
          {/* Step 1: Test Questions */}
          {item.testQuestions && item.testQuestions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h4 className="font-bold text-slate-900 text-base">
                1. {t.testSection}
              </h4>
              {item.testQuestions.map((q, qIdx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <p className="font-semibold text-sm text-slate-900">
                    {qIdx + 1}. {q.question[language]}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options[language].map((opt, oIdx) => {
                      const selected = testAnswers[qIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => {
                            const next = [...testAnswers];
                            next[qIdx] = oIdx;
                            setTestAnswers(next);
                          }}
                          className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            selected
                              ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: AI Voice Recording */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>2. {t.voiceSection} (AI Tekshiruv)</span>
                </h4>
                <p className="text-sm text-slate-600">
                  {item.voicePrompt?.[language] || item.voicePrompt?.UZ}
                </p>
              </div>
              <RobotMascot pose="thinking" size="sm" caption="AI Ustoz" />
            </div>

            {item.expectedTargetPhrase && (
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <span className="text-xs font-semibold text-orange-700 block mb-1">
                  Talaffuz qilinadigan jumla:
                </span>
                <p className="text-base font-bold text-slate-900">
                  &ldquo;{item.expectedTargetPhrase}&rdquo;
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-orange-400" />
                  <span>{t.startRecording}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold animate-pulse cursor-pointer"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Yozishni to‘xtatish</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (item.expectedTargetPhrase) {
                    setVoiceTranscript(item.expectedTargetPhrase);
                    onToast('Ovoz namunasi olindi, endi AI tekshiruvga yuboring!', 'info');
                  }
                }}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                🎙️ Mikrofonda aytdim (Namunani tasdiqlash)
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Yozib olingan nutq matni (Ovozli transkripsiya):
              </label>
              <input
                type="text"
                value={voiceTranscript}
                onChange={(e) => setVoiceTranscript(e.target.value)}
                placeholder={item.expectedTargetPhrase || 'Mikrofon tugmasini bosib gapiring...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            {aiResult.status && (
              <div
                className={`p-4 rounded-xl border text-sm font-semibold ${
                  aiResult.status === 'Correct'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <p>AI Natijasi: {aiResult.status}</p>
                <p className="mt-1 font-normal">{aiResult.message}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmitPractical}
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? t.aiChecking : t.stopRecording}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: SCREENSHOT SUBMISSION (Tilda, Git, Design, Bot, AI) */}
      {/* ======================================================== */}
      {item.practicalMode === 'screenshot' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-500" />
                <span>Screenshot yuborish oynasi</span>
              </h4>
              <p className="text-sm text-slate-600 mt-1">{t.screenshotPrompt}</p>
            </div>
            <RobotMascot pose="welcome" size="sm" caption="Screenshot" />
          </div>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-2xl p-6 bg-orange-50/40 cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-bold text-slate-800">{t.uploadScreenshot}</span>
            <span className="text-xs text-slate-500 mt-1">
              PNG, JPG yoki WEBP formatdagi screenshotni tanlang
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotFile}
              className="hidden"
            />
          </label>

          {screenshotDataUrl && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">Tanlangan Screenshot:</span>
              <img
                src={screenshotDataUrl}
                alt="Uploaded Screenshot"
                referrerPolicy="no-referrer"
                className="max-h-64 rounded-xl border border-slate-200 object-contain"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmitPractical}
            disabled={submitting || !screenshotDataUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>
              {submitting
                ? 'Admin CRM ga yuborilmoqda...'
                : isCompleted
                ? 'Qayta yuborish'
                : t.submitPracticalBtn}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
