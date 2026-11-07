import React, { useRef, useEffect, useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Undo2, 
  Redo2, 
  CornerDownLeft, 
  Space, 
  Delete, 
  Trash,
  AlignRight,
  AlignLeft
} from 'lucide-react';
import { NotebookFont, NotebookTheme, TextStats } from '../types';
import { calculateTextStats } from '../utils/text';

interface NotebookProps {
  text: string;
  setText: (text: string) => void;
  onTextareaRef: (ref: HTMLTextAreaElement | null) => void;
  font: NotebookFont;
  theme: NotebookTheme;
  fontSize: number;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onQuickAction: (action: 'space' | 'enter' | 'backspace' | 'delete') => void;
}

export const Notebook: React.FC<NotebookProps> = ({
  text,
  setText,
  onTextareaRef,
  font,
  theme,
  fontSize,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onQuickAction,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [textDir, setTextDir] = useState<'rtl' | 'ltr' | 'auto'>('rtl');

  const stats: TextStats = calculateTextStats(text);

  useEffect(() => {
    onTextareaRef(textareaRef.current);
  }, [onTextareaRef]);

  // Maneig de còpia al porta-retalls
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Descarrega el fitxer de text .txt
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hebrew_text_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Neteja del text amb confirmació
  const handleClear = () => {
    setText('');
    setShowClearConfirm(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Classes de font amb suport per a caràcters manuscrits en hebreu
  const getFontFamilyClass = () => {
    switch (font) {
      case 'serif':
        return 'font-hebrew-serif';
      case 'handwriting':
        return 'font-hebrew-handwriting';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-hebrew-sans';
    }
  };

  // Classes de tema de la llibreta
  const getThemeClasses = () => {
    switch (theme) {
      case 'warm-cream':
        return {
          container: 'bg-[#fcf8ed] text-amber-950 border-amber-900/20 shadow-md',
          lines: 'bg-[linear-gradient(transparent_27px,#e5d9c5_28px)]',
          margin: 'border-r-2 border-red-300/60',
          toolbar: 'bg-[#f4ebd9] border-amber-900/15 text-amber-900',
        };
      case 'dark-slate':
        return {
          container: 'bg-slate-900 text-slate-100 border-slate-700/60 shadow-lg',
          lines: 'bg-[linear-gradient(transparent_27px,#334155_28px)]',
          margin: 'border-r-2 border-rose-500/40',
          toolbar: 'bg-slate-800 border-slate-700 text-slate-300',
        };
      case 'minimal-white':
        return {
          container: 'bg-white text-gray-900 border-gray-300 shadow-sm',
          lines: 'bg-[linear-gradient(transparent_27px,#e5e7eb_28px)]',
          margin: 'border-r-2 border-red-400/50',
          toolbar: 'bg-gray-100 border-gray-200 text-gray-700',
        };
      case 'classic':
      default:
        return {
          container: 'bg-[#fbfbfe] text-slate-900 border-slate-300 shadow-md',
          lines: 'bg-[linear-gradient(transparent_27px,#e0e7ff_28px)]',
          margin: 'border-r-2 border-rose-400/60',
          toolbar: 'bg-slate-100 border-slate-200 text-slate-800',
        };
    }
  };

  const themeStyle = getThemeClasses();

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border shadow-lg transition-colors duration-300 bg-slate-950">
      {/* Upper Control Bar */}
      <div className={`px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b text-xs ${themeStyle.toolbar}`}>
        {/* Actions Left */}
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            id="undo-btn"
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Desfer (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            id="redo-btn"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Refer (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-current opacity-20 mx-1" />

          {/* Quick Keys (Space, Enter, Backspace, Delete) */}
          <button
            onClick={() => onQuickAction('space')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-medium"
            title="Inserir espai"
          >
            <Space className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Espai</span>
          </button>
          <button
            onClick={() => onQuickAction('enter')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-medium"
            title="Nova línia"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retorn</span>
          </button>
          <button
            onClick={() => onQuickAction('backspace')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-medium text-rose-600 dark:text-rose-400"
            title="Esborrar cap a l'esquerra"
          >
            <Delete className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retrocés</span>
          </button>
          <button
            onClick={() => onQuickAction('delete')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-medium text-rose-600 dark:text-rose-400"
            title="Esborrar caràcter següent"
          >
            <Trash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Suprimir</span>
          </button>
        </div>

        {/* Direction & Main Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* BIDI Direction Toggle */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-md p-0.5 mr-1">
            <button
              onClick={() => setTextDir('rtl')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                textDir === 'rtl' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
              title="Direcció de text d'esquerra a dreta (RTL per a hebreu)"
            >
              <AlignRight className="w-3 h-3" />
              <span>RTL</span>
            </button>
            <button
              onClick={() => setTextDir('auto')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                textDir === 'auto' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
              title="Direcció automàtica (Bidi per combinar anglès/números)"
            >
              Auto
            </button>
            <button
              onClick={() => setTextDir('ltr')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                textDir === 'ltr' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
              title="Direcció de dreta a esquerra (LTR per a anglès)"
            >
              <AlignLeft className="w-3 h-3" />
              <span>LTR</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            id="copy-text-btn"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiat!' : 'Copiar'}</span>
          </button>

          {/* Download Button */}
          <button
            id="download-text-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 font-medium transition"
            title="Descarregar fitxer de text .txt"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Descarregar</span>
          </button>

          {/* Clear Button */}
          <button
            id="clear-text-btn"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium transition"
            title="Netejar tot el text de la llibreta"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Netejar</span>
          </button>
        </div>
      </div>

      {/* Main Lined Paper Canvas Area */}
      <div className={`relative flex-1 p-4 sm:p-6 overflow-hidden min-h-[220px] max-h-[380px] sm:max-h-[420px] ${themeStyle.container}`}>
        {/* Notebook Red Margin Line */}
        <div className={`absolute top-0 bottom-0 right-10 w-0.5 ${themeStyle.margin} pointer-events-none z-10`} />

        {/* Textarea with Lined Background */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          dir={textDir}
          placeholder="Escriu aquí o utilitza el teclat virtual per afegir lletres hebrees, niqudot i signes..."
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '28px',
            backgroundSize: '100% 28px',
          }}
          className={`w-full h-full resize-none border-none outline-none bg-transparent ${getFontFamilyClass()} ${themeStyle.lines} tracking-wide z-0 selection:bg-amber-500/30 font-medium leading-[28px]`}
          spellCheck={false}
          autoFocus
        />
      </div>

      {/* Stats Footer Bar */}
      <div className={`px-4 py-2 text-[11px] font-mono flex flex-wrap items-center justify-between gap-3 border-t ${themeStyle.toolbar}`}>
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
          <span>
            <strong className="text-amber-600 dark:text-amber-400">{stats.characters}</strong> caràcters
          </span>
          <span>
            <strong className="text-amber-600 dark:text-amber-400">{stats.words}</strong> paraules
          </span>
          <span>
            <strong className="text-amber-600 dark:text-amber-400">{stats.hebrewLetters}</strong> lletres hebrees
          </span>
          <span>
            <strong className="text-amber-600 dark:text-amber-400">{stats.niqqudCount}</strong> niqudot
          </span>
          <span>
            <strong className="text-amber-600 dark:text-amber-400">{stats.lines}</strong> línies
          </span>
        </div>

        <div className="text-slate-400 text-[10px] hidden sm:block">
          * Pots escriure en hebreu, anglès i números combinats
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" />
              Netejar la llibreta?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Aquesta acció esborrarà tot el contingut escrit fins ara. Estàs segur?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition"
              >
                Sí, netejar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
