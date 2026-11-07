import React, { useState } from 'react';
import { 
  KeyboardTab, 
  KeyClickPayload 
} from '../types';
import { 
  HEBREW_LETTERS, 
  HEBREW_NIQQUD, 
  HEBREW_PUNCTUATION, 
  NUMBERS_AND_ENGLISH,
  VIRTUAL_KEYBOARD_LAYOUT,
  KeyboardKey
} from '../keyboardMapping';
import { KeyButton } from './KeyButton';
import { 
  Search, 
  Grid, 
  Sparkles, 
  SmilePlus, 
  Binary, 
  CornerDownLeft, 
  Space, 
  Delete,
  Info
} from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyClick: (payload: KeyClickPayload) => void;
  activePhysicalChar?: string | null;
  keyMap?: Record<string, string>;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyClick,
  activePhysicalChar,
  keyMap,
}) => {
  const [activeTab, setActiveTab] = useState<KeyboardTab>('layout');
  const [searchQuery, setSearchQuery] = useState('');

  // Mapa invertit de caràcter hebreu a tecla física assignada
  const charToKey = React.useMemo(() => {
    if (!keyMap) return {};
    const map: Record<string, string> = {};
    for (const [k, c] of Object.entries(keyMap)) {
      const charStr = String(c);
      if (!map[charStr]) {
        map[charStr] = k;
      }
    }
    return map;
  }, [keyMap]);

  // Maneig de clic en tecles
  const handleKeyClick = (char: string, type?: string) => {
    onKeyClick({ char, type: type as KeyboardKey['type'] });
  };

  // Filtrar lletres amb tecla física dinàmica
  const filteredLetters = HEBREW_LETTERS.map((item) => ({
    ...item,
    physicalKey: charToKey[item.char] || item.physicalKey,
  })).filter(
    (item) =>
      item.char.includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.physicalKey && item.physicalKey.toLowerCase() === searchQuery.toLowerCase())
  );

  // Filtrar niqudot
  const filteredNiqqud = HEBREW_NIQQUD.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filtrar puntuació
  const filteredPunctuation = HEBREW_PUNCTUATION.filter(
    (item) =>
      item.char.includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl flex flex-col gap-4">
      {/* Navigation Tabs Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs font-semibold">
          <button
            id="tab-layout-btn"
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === 'layout'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Teclat Completi</span>
          </button>

          <button
            id="tab-letters-btn"
            onClick={() => setActiveTab('letters')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === 'letters'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="font-bold">א</span>
            <span>Lletres ({HEBREW_LETTERS.length})</span>
          </button>

          <button
            id="tab-niqqud-btn"
            onClick={() => setActiveTab('niqqud')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === 'niqqud'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/80 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Niqudot ({HEBREW_NIQQUD.length})</span>
          </button>

          <button
            id="tab-punctuation-btn"
            onClick={() => setActiveTab('punctuation')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === 'punctuation'
                ? 'bg-indigo-500 text-white font-bold shadow-md'
                : 'bg-slate-800/80 text-indigo-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <SmilePlus className="w-3.5 h-3.5" />
            <span>Puntuació</span>
          </button>

          <button
            id="tab-numbers-btn"
            onClick={() => setActiveTab('numbers')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === 'numbers'
                ? 'bg-slate-700 text-white font-bold shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Números / Anglès</span>
          </button>
        </div>

        {/* Search Bar for specific characters/niqqud */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cercar lletra, niqudot (ex: Sheva, Qamats)..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 transition"
          />
        </div>
      </div>

      {/* TAB CONTENT: LAYOUT DE TECLAT VIRTUAL (TECLAT ESTÀNDARD) */}
      {activeTab === 'layout' && (
        <div className="flex flex-col gap-2 select-none">
          {/* Quick Niqqud Strip above standard keyboard */}
          <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800 flex items-center justify-between overflow-x-auto gap-1 no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider px-2 flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3" />
              Niqudot Ràpid:
            </span>
            <div className="flex items-center gap-1">
              {HEBREW_NIQQUD.slice(0, 13).map((item) => (
                <KeyButton
                  key={item.char}
                  item={item}
                  onClick={handleKeyClick}
                  size="sm"
                />
              ))}
            </div>
          </div>

          {/* Row 1: Numbers & Symbols */}
          <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {VIRTUAL_KEYBOARD_LAYOUT.numbersRow.map((key) => (
              <KeyButton
                key={key.char + key.label}
                item={{ char: key.char, label: key.label, sub: key.sub, type: 'number' }}
                onClick={handleKeyClick}
                size="sm"
                active={activePhysicalChar === key.char}
              />
            ))}
            <button
              onClick={() => handleKeyClick('', 'special')}
              className="px-2.5 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 active:bg-amber-500 active:text-slate-950"
            >
              <Delete className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 2: Top QWERTY Row */}
          <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {VIRTUAL_KEYBOARD_LAYOUT.topRow.map((key) => {
              const currentSub = charToKey[key.char] ?? key.sub;
              return (
                <KeyButton
                  key={key.char + key.label}
                  item={{ char: key.char, label: key.char, sub: currentSub, type: 'letter' }}
                  onClick={handleKeyClick}
                  size="md"
                  active={activePhysicalChar === key.char}
                />
              );
            })}
          </div>

          {/* Row 3: Home QWERTY Row */}
          <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {VIRTUAL_KEYBOARD_LAYOUT.homeRow.map((key) => {
              const currentSub = charToKey[key.char] ?? key.sub;
              return (
                <KeyButton
                  key={key.char + key.label}
                  item={{ char: key.char, label: key.char, sub: currentSub, type: 'letter' }}
                  onClick={handleKeyClick}
                  size="md"
                  active={activePhysicalChar === key.char}
                />
              );
            })}
            <button
              onClick={() => handleKeyClick('\n', 'special')}
              className="px-3 h-12 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-1 active:bg-amber-500 active:text-slate-950"
            >
              <CornerDownLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Enter</span>
            </button>
          </div>

          {/* Row 4: Bottom QWERTY Row */}
          <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {VIRTUAL_KEYBOARD_LAYOUT.bottomRow.map((key) => {
              const currentSub = charToKey[key.char] ?? key.sub;
              return (
                <KeyButton
                  key={key.char + key.label}
                  item={{ char: key.char, label: key.char, sub: currentSub, type: 'letter' }}
                  onClick={handleKeyClick}
                  size="md"
                  active={activePhysicalChar === key.char}
                />
              );
            })}
          </div>

          {/* Row 5: Spacebar Row */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <button
              onClick={() => setActiveTab('niqqud')}
              className="px-3 h-12 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Niqudot</span>
            </button>

            {/* Space Bar */}
            <KeyButton
              item={{ char: ' ', label: 'Espai (רווח)', type: 'special' }}
              onClick={handleKeyClick}
              size="space"
              active={activePhysicalChar === ' '}
            />

            <button
              onClick={() => setActiveTab('punctuation')}
              className="px-3 h-12 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 text-xs font-bold flex items-center gap-1.5"
            >
              <SmilePlus className="w-4 h-4 text-indigo-400" />
              <span>Puntuació</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LLETRES HEBREES */}
      {activeTab === 'letters' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Totes les 22 lletres de l'alfabet hebreu (Alef-Bet) i les 5 formes finals (Soffit):</span>
            <span className="font-mono text-amber-400">{filteredLetters.length} resultats</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 gap-2">
            {filteredLetters.map((item) => (
              <KeyButton
                key={item.char + item.name}
                item={item}
                onClick={handleKeyClick}
                size="lg"
                active={activePhysicalChar === item.char}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: NIQQUD (PUNTS DE VOCALITZACIÓ) */}
      {activeTab === 'niqqud' && (
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Com funcionen els Niqudot?</strong> Els niqudot són els punts i signes de vocalització que es combinen amb la lletra anterior. Per afegir un niqudot, escriu primer la lletra hebrea a la llibreta i després fes clic al signe de vocalització desitjat.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredNiqqud.map((item) => (
              <div
                key={item.char + item.name}
                onClick={() => handleKeyClick(item.char, 'niqqud')}
                className="bg-slate-950/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-600/50 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer group transition shadow-sm"
              >
                <div className="w-11 h-11 rounded-lg bg-emerald-900/40 border border-emerald-700/40 text-emerald-200 font-bold text-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                  {item.label}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                  <div className="text-[9px] font-mono text-emerald-500/80 mt-0.5">
                    {item.codePoint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PUNTUACIÓ I SÍMBOLS */}
      {activeTab === 'punctuation' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-400">
            Signes de puntuació tradicionals hebreus (Geresh, Gershayim, Maqaf, Sof Pasuq, Shekel) i puntuació general:
          </div>

          {/* Hebrew Punctuation Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {filteredPunctuation.map((item) => (
              <KeyButton
                key={item.char + item.name}
                item={item}
                onClick={handleKeyClick}
                size="md"
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: NÚMEROS I ANGLÈS */}
      {activeTab === 'numbers' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-400">
            Dígits numèrics i caràcters en anglès per combinar en textos bidireccionals (BIDI):
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {NUMBERS_AND_ENGLISH.map((item) => (
              <KeyButton
                key={item.char}
                item={item}
                onClick={handleKeyClick}
                size="lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
