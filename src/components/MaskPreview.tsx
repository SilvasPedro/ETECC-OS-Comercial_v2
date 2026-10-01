import React, { useState } from 'react';
import { Copy, Check, Share2, Download, RotateCcw, FileText } from 'lucide-react';

interface MaskPreviewProps {
  title: string;
  maskText: string;
  onReset: () => void;
  clientPhone?: string;
}

export const MaskPreview: React.FC<MaskPreviewProps> = ({
  title,
  maskText,
  onReset,
  clientPhone
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(maskText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = maskText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = (clientPhone || '').replace(/\D/g, '');
    const phoneParam = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
    const url = phoneParam 
      ? `https://wa.me/${phoneParam}?text=${encodeURIComponent(maskText)}`
      : `https://wa.me/?text=${encodeURIComponent(maskText)}`;
    window.open(url, '_blank');
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([maskText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MASCARA_OS_${title.toUpperCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full sticky top-20 transition-colors duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#e4022c]" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Máscara Gerada em Tempo Real</h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 font-medium transition"
          title="Limpar formulário"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpar</span>
        </button>
      </div>

      {/* Main Text Block */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="relative flex-1 bg-slate-950 dark:bg-black/80 rounded-xl p-4 overflow-hidden border border-slate-800">
          <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap break-all overflow-y-auto max-h-[620px] select-all leading-relaxed">
            {maskText}
          </pre>
        </div>

        {/* Primary Action Button */}
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#e4022c] hover:bg-[#c30225] text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                MÁSCARA COPIADA COM SUCESSO!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                COPIAR MÁSCARA DE O.S.
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Baixar .TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
