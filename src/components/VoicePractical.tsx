import React, { useState, useRef } from 'react';
import { Mic, Square, Sparkles, CheckCircle2, AlertTriangle, Volume2 } from 'lucide-react';
import { CurriculumItem, Language } from '../types';
import { UI_TEXT } from '../translations';

interface VoicePracticalProps {
  language: Language;
  item: CurriculumItem;
  studentToken: string;
  isCompleted: boolean;
  onSuccessUnlock: () => Promise<void>;
}

export const VoicePractical: React.FC<VoicePracticalProps> = ({
  language,
  item,
  studentToken,
  isCompleted,
  onSuccessUnlock,
}) => {
  const t = UI_TEXT[language];
  const questions = item.testQuestions || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/webm');
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    status: 'Correct' | 'Incorrect' | 'Needs Retry';
    message: string;
    feedback?: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const startVoiceRecording = async () => {
    setAiResult(null);
    audioChunksRef.current = [];

    // Try Web Speech API for live transcript alongside MediaRecorder audio capture
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.lang =
          item.courseId === 'english'
            ? 'en-US'
            : item.courseId === 'rus-tili'
            ? 'ru-RU'
            : 'uz-UZ';
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript + ' ';
          }
          setSpokenTranscript(text.trim());
        };
        rec.start();
        recognitionRef.current = rec;
      } catch {
        // Ignore if SpeechRecognition not supported
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      setAudioMimeType(mimeType);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultStr = reader.result as string;
          if (resultStr && resultStr.includes(',')) {
            setAudioBase64(resultStr.split(',')[1]);
          }
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((tr) => tr.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      // If iframe environment has no physical mic attached, still allow recording state
      setIsRecording(true);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleEvaluateWithAI = async () => {
    // Verify all test questions are answered
    if (questions.length > 0 && Object.keys(selectedAnswers).length < questions.length) {
      setAiResult({
        status: 'Needs Retry',
        message: 'Avval barcha test savollariga javob belgilang!',
      });
      return;
    }

    setIsEvaluating(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/evaluate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          courseId: item.courseId,
          moduleId: item.moduleId,
          itemId: item.id,
          selectedAnswers,
          audioBase64,
          audioMimeType,
          spokenTranscript,
        }),
      });
      const data = await res.json();
      setAiResult({
        status: data.status || 'Incorrect',
        message: data.message || 'Javob noto‘g‘ri. Qaytadan urinib ko‘ring.',
        feedback: data.feedback,
      });

      if (data.status === 'Correct') {
        await onSuccessUnlock();
      }
    } catch {
      setAiResult({
        status: 'Needs Retry',
        message: 'Server bilan bog‘lanishda xatolik. Qaytadan urinib ko‘ring.',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Test Section */}
      {questions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              1-qism: {t.testSection}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Barcha savollarga to‘g‘ri javob belgilang
            </p>
          </div>

          <div className="space-y-5">
            {questions.map((q, qIdx) => {
              const opts = q.options[language] || q.options.UZ;
              return (
                <div key={q.id} className="space-y-2.5">
                  <p className="text-sm font-semibold text-slate-800">
                    {qIdx + 1}. {q.question[language] || q.question.UZ}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {opts.map((optText, oIdx) => {
                      const isSel = selectedAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                          }
                          className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                            isSel
                              ? 'border-[#FF6B00] bg-orange-50/80 text-slate-900 ring-2 ring-orange-500/20'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <span className="font-bold mr-2 text-orange-600">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {optText}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Voice Recording & AI Checking Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#FF6B00]" />
              <span>2-qism: {t.voiceSection} (AI Tekshiruv)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mikrofonni bosib talab qilingan jumlani aniq o‘qing
            </p>
          </div>
          <span className="text-xs font-mono text-orange-600 font-semibold">
            +70 Coin · +70 Point
          </span>
        </div>

        {/* Target Phrase Callout */}
        <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200">
          <div className="text-xs font-semibold text-orange-700 mb-1">
            {item.voicePrompt?.[language] || item.voicePrompt?.UZ || 'Mikrofonga ayting:'}
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            “{item.expectedTargetPhrase}”
          </div>
        </div>

        {/* Voice Recorder Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={startVoiceRecording}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Mic className="w-4 h-4 text-orange-400" />
              <span>{t.startRecording}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopVoiceRecording}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold animate-pulse transition-colors whitespace-nowrap"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Ovoz yozilmoqda... (To‘xtatish)</span>
            </button>
          )}

          <div className="flex-1">
            <input
              type="text"
              value={spokenTranscript}
              onChange={(e) => setSpokenTranscript(e.target.value)}
              placeholder={`Yoki mikrofonda aytgan jumlangizni tasdiqlang: "${item.expectedTargetPhrase}"`}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF6B00]"
            />
          </div>

          <button
            type="button"
            onClick={handleEvaluateWithAI}
            disabled={isEvaluating}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold transition-colors whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEvaluating ? t.aiChecking : 'AI orqali tekshirish'}</span>
          </button>
        </div>

        {/* Structured AI Result Display */}
        {aiResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              aiResult.status === 'Correct'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {aiResult.status === 'Correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-sm">
              <div className="font-bold flex items-center gap-2">
                <span>AI Natija: [{aiResult.status}]</span>
              </div>
              <p className="font-semibold whitespace-pre-line">{aiResult.message}</p>
              {aiResult.feedback && (
                <p className="text-xs opacity-85 mt-1">{aiResult.feedback}</p>
              )}
            </div>
          </div>
        )}

        {isCompleted && !aiResult && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Amaliy muvaffaqiyatli bajarildi. Keyingi dars ochildi.</span>
          </div>
        )}
      </div>
    </div>
  );
};
