import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Send, Terminal, Eye, CheckCircle2, Code2 } from 'lucide-react';
import { CodeLanguage, Language } from '../types';
import { UI_TEXT } from '../translations';

interface CodeCompilerProps {
  language: Language;
  codeLanguage: CodeLanguage;
  initialCode: string;
  onSubmitCode: (code: string, output: string) => Promise<void>;
  isSubmitting: boolean;
  existingStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export const CodeCompiler: React.FC<CodeCompilerProps> = ({
  language,
  codeLanguage,
  initialCode,
  onSubmitCode,
  isSubmitting,
  existingStatus,
}) => {
  const t = UI_TEXT[language];
  const [code, setCode] = useState(initialCode);
  const [previewSrcDoc, setPreviewSrcDoc] = useState(initialCode);
  const [pythonOutput, setPythonOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setPreviewSrcDoc(initialCode);
    setPythonOutput('');
    setHasRun(false);
  }, [initialCode]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setHasRun(true);
    if (codeLanguage === 'python') {
      try {
        const res = await fetch('/api/compiler/python', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        setPythonOutput(data.output || 'Dastur muvaffaqiyatli yakunlandi (bo‘sh natija).');
      } catch (err) {
        setPythonOutput('Xatolik yuz berdi: Server bilan aloqa uzildi.');
      } finally {
        setIsRunning(false);
      }
    } else {
      setPreviewSrcDoc(code);
      setTimeout(() => setIsRunning(false), 180);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setPreviewSrcDoc(initialCode);
    setPythonOutput('');
  };

  const handleSubmit = async () => {
    const out = codeLanguage === 'python' ? pythonOutput || 'Python code submitted' : 'HTML/CSS/JS Live Preview';
    await onSubmitCode(code, out);
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
      {/* Compiler Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-bold tracking-tight">
            TexnoQadam IDE — {codeLanguage.toUpperCase()} Kompilyatori
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tiklash</span>
          </button>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Ishlamoqda...' : t.runCodeBtn}</span>
          </button>
        </div>
      </div>

      {/* Two-Zone Split Layout: Editor on Left, Live Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left: Code Editor */}
        <div className="flex flex-col bg-slate-950">
          <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
            <span>main.{codeLanguage === 'python' ? 'py' : codeLanguage === 'javascript' ? 'js.html' : codeLanguage === 'react' ? 'jsx.html' : 'html'}</span>
            <span>UTF-8 · {code.split('\n').length} qator</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-80 p-4 bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y"
            placeholder="Kodingizni shu yerga yozing..."
          />
        </div>

        {/* Right: Output / Live Preview */}
        <div className="flex flex-col bg-slate-50">
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2">
            {codeLanguage === 'python' ? (
              <>
                <Terminal className="w-4 h-4 text-orange-600" />
                <span>Python Terminal Natijasi (Console Output)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-orange-600" />
                <span>Jonli Brauzer Natijasi (Live Preview)</span>
              </>
            )}
          </div>

          {codeLanguage === 'python' ? (
            <div className="h-80 p-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-auto whitespace-pre-wrap">
              {pythonOutput ? (
                <div>
                  <div className="text-emerald-400 mb-2">$ python3 main.py</div>
                  <div className="text-white">{pythonOutput}</div>
                </div>
              ) : (
                <div className="text-slate-400">
                  Python kodini tekshirish uchun yuqoridagi «{t.runCodeBtn}» tugmasini bosing...
                </div>
              )}
            </div>
          ) : (
            <div className="h-80 bg-white relative">
              <iframe
                title="TexnoQadam Live Preview"
                srcDoc={previewSrcDoc}
                sandbox="allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Submit Bar */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-600">
          {existingStatus === 'Approved' ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {t.approvedStatus}
            </span>
          ) : existingStatus === 'Pending' ? (
            <span className="text-amber-700 font-semibold">{t.pendingAdminReview}</span>
          ) : (
            <span>Kodni yozib bo‘lgach, Admin CRM tekshiruvi uchun yuboring (+70 Coin, +70 Point).</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !code.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Yuborilmoqda...' : t.submitPracticalBtn}</span>
        </button>
      </div>
    </div>
  );
};
