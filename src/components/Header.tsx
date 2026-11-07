import React from 'react';
import { 
  Keyboard, 
  Volume2, 
  VolumeX, 
  FileCode2, 
  Type, 
  Palette,
  ZoomIn,
  ZoomOut,
  HelpCircle
} from 'lucide-react';
import { NotebookFont, NotebookTheme } from '../types';

interface HeaderProps {
  physicalKeyboardEnabled: boolean;
  onTogglePhysicalKeyboard: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: NotebookTheme;
  onChangeTheme: (theme: NotebookTheme) => void;
  font: NotebookFont;
  onChangeFont: (font: NotebookFont) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  onOpenMappingModal: () => void;
  onOpenHelpModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  physicalKeyboardEnabled,
  onTogglePhysicalKeyboard,
  soundEnabled,
  onToggleSound,
  theme,
  onChangeTheme,
  font,
  onChangeFont,
  fontSize,
  onChangeFontSize,
  onOpenMappingModal,
  onOpenHelpModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Logos & Titles */}
        <div className="flex items-center space-x-3 space-x-reverse rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-inner border border-amber-400/30">
            א
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Teclat Hebreu Virtual</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Llibreta amb niqudot, puntuació hebrea, suport bidi i mode file://
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Physical Keyboard Intercept Toggle */}
          <button
            id="toggle-physical-keyboard-btn"
            onClick={onTogglePhysicalKeyboard}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 border ${
              physicalKeyboardEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
            title={
              physicalKeyboardEnabled
                ? 'El teclat físic està escrivint en hebreu directament'
                : 'Fes clic per utilitzar el teu teclat físic per escriure en hebreu'
            }
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden md:inline">Teclat físic:</span>
            <span className="font-semibold">
              {physicalKeyboardEnabled ? 'Actiu' : 'Inactiu'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
            title={soundEnabled ? 'Sons de tecla activats' : 'Sons de tecla silenciat'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <div className="relative group">
            <button
              id="theme-select-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700"
              title="Canviar estil de llibreta"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span className="capitalize hidden lg:inline">{theme.replace('-', ' ')}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1.5 z-50 min-w-[140px]">
              <button
                onClick={() => onChangeTheme('classic')}
                className={`text-left px-2.5 py-1.5 rounded-lg text-xs ${
                  theme === 'classic' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                📜 Clàssica Lined
              </button>
              <button
                onClick={() => onChangeTheme('warm-cream')}
                className={`text-left px-2.5 py-1.5 rounded-lg text-xs ${
                  theme === 'warm-cream' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                🌾 Paper Crema
              </button>
              <button
                onClick={() => onChangeTheme('dark-slate')}
                className={`text-left px-2.5 py-1.5 rounded-lg text-xs ${
                  theme === 'dark-slate' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                🌙 Mode Fosc
              </button>
              <button
                onClick={() => onChangeTheme('minimal-white')}
                className={`text-left px-2.5 py-1.5 rounded-lg text-xs ${
                  theme === 'minimal-white' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                ⬜ Blanc Minimalista
              </button>
            </div>
          </div>

          {/* Font Selector */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => onChangeFont('sans')}
              className={`px-2 py-1 rounded text-xs font-hebrew-sans transition ${
                font === 'sans' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tipografia Sans-Serif (Assistant)"
            >
              Sans
            </button>
            <button
              onClick={() => onChangeFont('serif')}
              className={`px-2 py-1 rounded text-xs font-hebrew-serif transition ${
                font === 'serif' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tipografia Serif Clàssica (Frank Ruhl Libre)"
            >
              Serif
            </button>
            <button
              onClick={() => onChangeFont('handwriting')}
              className={`px-2 py-1 rounded text-xs font-hebrew-handwriting transition ${
                font === 'handwriting' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Ktav Yad 'Ivri - Manuscrit en Hebreu (Gveret Levin)"
            >
              Manuscrit
            </button>
          </div>

          {/* Font Size Adjust */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-slate-300">
            <button
              onClick={() => onChangeFontSize(Math.max(14, fontSize - 2))}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
              title="Reduir mida de lletra"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] min-w-[24px] text-center font-medium">
              {fontSize}
            </span>
            <button
              onClick={() => onChangeFontSize(Math.min(42, fontSize + 2))}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
              title="Augmentar mida de lletra"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key Mappings File Inspector Modal Trigger */}
          <button
            id="open-mappings-btn"
            onClick={onOpenMappingModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold rounded-lg shadow-sm transition-all"
            title="Veure i gestionar el fitxer de mapeigs del teclat (keyboardMapping.ts)"
          >
            <FileCode2 className="w-4 h-4" />
            <span>Mapeig de Tecles</span>
          </button>

          {/* Help Modal Trigger */}
          <button
            id="open-help-btn"
            onClick={onOpenHelpModal}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="Ajuda i instruccions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
