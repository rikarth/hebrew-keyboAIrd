import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Info, 
  Keyboard, 
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle2,
  Edit3,
  Sliders
} from 'lucide-react';
import { 
  DEFAULT_ISRAELI_KEY_MAP, 
  PHONETIC_KEY_MAP, 
  HEBREW_LETTERS, 
  HEBREW_NIQQUD, 
  HEBREW_PUNCTUATION 
} from '../keyboardMapping';

interface MappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyMap: Record<string, string>;
  onUpdateKeyMap: (newMap: Record<string, string>) => void;
  onResetKeyMap: () => void;
}

export const MappingModal: React.FC<MappingModalProps> = ({ 
  isOpen, 
  onClose,
  keyMap,
  onUpdateKeyMap,
  onResetKeyMap,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Estat per a afegir o editar una tecla
  const [selectedPhysicalKey, setSelectedPhysicalKey] = useState('');
  const [selectedChar, setSelectedChar] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  // Provador interactiu
  const [testKey, setTestKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Pestanya de caràcters ràpids per al selector
  const [charPickerTab, setCharPickerTab] = useState<'letters' | 'niqqud' | 'punctuation'>('letters');

  // Mapeig ordenat per tecla física (agrupant minúscules i majúscules correlatives, ex: m i M)
  const sortedMappings = useMemo(() => {
    return Object.entries(keyMap).sort(([a], [b]) => {
      const cmp = a.toLowerCase().localeCompare(b.toLowerCase());
      if (cmp !== 0) return cmp;
      return a.localeCompare(b);
    });
  }, [keyMap]);

  // Codi font TypeScript generat dinàmicament en temps real amb tots els canvis
  const mappingCodeSnippet = useMemo(() => {
    // Generar objecte ordenat amb majúscules i minúscules correlatives
    const sortedKeys = Object.keys(keyMap).sort((a, b) => {
      const cmp = a.toLowerCase().localeCompare(b.toLowerCase());
      if (cmp !== 0) return cmp;
      return a.localeCompare(b);
    });
    const sortedObj: Record<string, string> = {};
    sortedKeys.forEach((k) => {
      sortedObj[k] = keyMap[k];
    });

    return `/**
 * ARCHIU DE MAPEIG DEL TECLAT HEBREU PERSONALITZAT
 * ================================================
 * Generat automàticament des de la configuració interactiva del Teclat Hebreu.
 * Suporta distinció entre majúscules i minúscules (ex: 'm' vs 'M').
 * Pots desar aquest fitxer a: /src/keyboardMapping.ts
 *
 * Total de tecles configurades: ${Object.keys(sortedObj).length}
 * Data de generació: ${new Date().toLocaleString()}
 */

export const PHYSICAL_KEY_MAP: Record<string, string> = ${JSON.stringify(sortedObj, null, 2)};
`;
  }, [keyMap]);

  if (!isOpen) return null;

  // Maneig de còpia del codi
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(mappingCodeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback per a entorns restringits
      const textarea = document.createElement('textarea');
      textarea.value = mappingCodeSnippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Descarregar fitxer .ts
  const handleDownloadFile = () => {
    const blob = new Blob([mappingCodeSnippet], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyboardMapping.ts';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  // Desa o actualitza una tecla al mapa (preservant majúscules i minúscules)
  const handleSaveKeyMapping = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = selectedPhysicalKey.trim();
    const cleanChar = selectedChar.trim();

    if (!cleanKey) {
      setEditSuccessMsg('Indica quina tecla física vols assignar.');
      return;
    }
    if (!cleanChar) {
      setEditSuccessMsg('Selecciona o escriu el caràcter hebreu a assignar.');
      return;
    }

    const updated = { ...keyMap, [cleanKey]: cleanChar };
    onUpdateKeyMap(updated);

    const isUpper = cleanKey >= 'A' && cleanKey <= 'Z';
    setEditSuccessMsg(`Assignat [${cleanKey}] ${isUpper ? '(Majúscula / Shift)' : '(Minúscula)'} → ${cleanChar}`);
    setTimeout(() => setEditSuccessMsg(null), 3000);

    // Netejar camps
    setSelectedPhysicalKey('');
    setSelectedChar('');
  };

  // Eliminar un mapeig
  const handleDeleteKey = (keyToDelete: string) => {
    const updated = { ...keyMap };
    delete updated[keyToDelete];
    onUpdateKeyMap(updated);
  };

  // Carregar preset
  const handleApplyPreset = (preset: 'israeli' | 'phonetic') => {
    if (preset === 'israeli') {
      onUpdateKeyMap({ ...DEFAULT_ISRAELI_KEY_MAP });
      setEditSuccessMsg('S\'ha aplicat la disposició israeliana estàndard (amb suport de majúscules per a formes finals)');
    } else {
      onUpdateKeyMap({ ...PHONETIC_KEY_MAP });
      setEditSuccessMsg('S\'ha aplicat la disposició fonètica (ex: m → מ, M → ם)');
    }
    setTimeout(() => setEditSuccessMsg(null), 3000);
  };

  // Maneig de teclat físic a la prova amb distinció majúscules/minúscules
  const handleTestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Tab', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    if (e.key === 'Shift') return;
    e.preventDefault();

    const key = e.key;
    setTestKey(key);

    const mapped = keyMap[key] ?? (e.shiftKey ? undefined : keyMap[key.toLowerCase()]);
    if (mapped) {
      setTestResult(mapped);
    } else {
      setTestResult('Sense mapeig assignat (escriu la tecla directa)');
    }
  };

  // Capturar tecla física en el formulari d'assignació (exactament com es prem)
  const handleCapturePhysicalKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Tab', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    if (e.key === 'Shift') return;
    e.preventDefault();

    // Guardar exactament la tecla premuda (ex: 'm' o 'M')
    setSelectedPhysicalKey(e.key);
  };

  // Filtrar la llista
  const filteredMappings = sortedMappings.filter(([k, c]) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return k.toLowerCase().includes(q) || c.includes(searchFilter) || k.includes(searchFilter);
  });

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white">Configuració Interactiva del Mapeig</h2>
                <span className="text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Desat automàticament
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalitza les tecles en temps real: es desen al teu navegador i pots copiar el codi actualitzat.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Tancar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6 text-xs text-slate-300">
          
          {/* Quick presets and action bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold text-xs">Plantilles ràpides:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('israeli')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-medium text-xs transition"
              >
                Israelià QWERTY (Estàndard)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('phonetic')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-medium text-xs transition"
              >
                Fonètic (Llatí → Hebreu)
              </button>
            </div>

            <button
              type="button"
              onClick={onResetKeyMap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 font-medium text-xs transition ml-auto"
              title="Restablir la configuració inicial"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablir per defecte</span>
            </button>
          </div>

          {/* Feedback message */}
          {editSuccessMsg && (
            <div className="bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{editSuccessMsg}</span>
            </div>
          )}

          {/* Interactive Key Binder & Editor Card */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800/90 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Assignar o Modificar una Tecla
              </h3>
              <span className="text-[11px] text-slate-400">
                Prem qualsevol tecla física i tria el caràcter hebreu
              </span>
            </div>

            <form onSubmit={handleSaveKeyMapping} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              {/* Physical Key Input */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-medium text-xs">
                    Tecla Física (QWERTY / Teclat)
                  </label>
                  {selectedPhysicalKey && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      selectedPhysicalKey >= 'A' && selectedPhysicalKey <= 'Z' 
                        ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50' 
                        : 'text-slate-400'
                    }`}>
                      {selectedPhysicalKey >= 'A' && selectedPhysicalKey <= 'Z' ? 'Majúscula (Shift)' : 'Minúscula'}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Prem una tecla (ex: m per a מ o M per a ם)"
                  value={selectedPhysicalKey}
                  onKeyDown={handleCapturePhysicalKey}
                  onChange={(e) => setSelectedPhysicalKey(e.target.value.slice(-1))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 font-mono text-center font-bold text-base focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="hidden sm:flex items-center justify-center text-slate-600 pb-2 text-lg">
                →
              </div>

              {/* Hebrew Target Char Input */}
              <div className="flex-1 space-y-1.5">
                <label className="block text-slate-300 font-medium text-xs">
                  Caràcter o Signe Hebreu
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Caràcter (ex: א, ש, ַ)"
                    value={selectedChar}
                    onChange={(e) => setSelectedChar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-amber-300 font-serif text-center font-bold text-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Assignar Tecla</span>
              </button>
            </form>

            {/* Quick Palette for selecting Hebrew Characters */}
            <div className="border-t border-slate-800/80 pt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Selector ràpid de caràcters per assignar:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCharPickerTab('letters')}
                    className={`px-2 py-0.5 rounded transition ${
                      charPickerTab === 'letters' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:text-slate-200'
                    }`}
                  >
                    Lletres
                  </button>
                  <button
                    type="button"
                    onClick={() => setCharPickerTab('niqqud')}
                    className={`px-2 py-0.5 rounded transition ${
                      charPickerTab === 'niqqud' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:text-slate-200'
                    }`}
                  >
                    Niqudot
                  </button>
                  <button
                    type="button"
                    onClick={() => setCharPickerTab('punctuation')}
                    className={`px-2 py-0.5 rounded transition ${
                      charPickerTab === 'punctuation' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'hover:text-slate-200'
                    }`}
                  >
                    Puntuació
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto p-1.5 bg-slate-900/60 rounded-xl border border-slate-800/60 no-scrollbar">
                {charPickerTab === 'letters' &&
                  HEBREW_LETTERS.map((item) => (
                    <button
                      key={item.char}
                      type="button"
                      onClick={() => setSelectedChar(item.char)}
                      className={`w-7 h-7 rounded-lg text-sm font-serif font-bold transition flex items-center justify-center ${
                        selectedChar === item.char
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                      title={`${item.name} (${item.char})`}
                    >
                      {item.char}
                    </button>
                  ))}

                {charPickerTab === 'niqqud' &&
                  HEBREW_NIQQUD.map((item) => (
                    <button
                      key={item.codePoint || item.char}
                      type="button"
                      onClick={() => setSelectedChar(item.char)}
                      className={`px-2 h-7 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center ${
                        selectedChar === item.char
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
                      }`}
                      title={item.name}
                    >
                      {item.label}
                    </button>
                  ))}

                {charPickerTab === 'punctuation' &&
                  HEBREW_PUNCTUATION.slice(0, 20).map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedChar(item.char)}
                      className={`w-7 h-7 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center ${
                        selectedChar === item.char
                          ? 'bg-indigo-500 text-white shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                      }`}
                      title={item.name}
                    >
                      {item.char}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Interactive Live Tester */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              Provar el Mapeig en Directe
            </h3>
            <p className="text-slate-400 text-xs">
              Fes clic a la casella i prem qualsevol tecla física per comprovar com es tradueix amb el teu mapeig actual:
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Fes clic i prem qualsevol tecla aquí..."
                onKeyDown={handleTestKeyDown}
                className="w-full sm:w-auto flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-center focus:border-emerald-500 focus:outline-none"
              />
              {testKey && (
                <div className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Tecla:</span>
                  <span className="font-mono text-amber-400 font-bold">[{testKey}]</span>
                  {testKey >= 'A' && testKey <= 'Z' && (
                    <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/50">
                      Majúscula / Shift
                    </span>
                  )}
                  {testKey >= 'a' && testKey <= 'z' && (
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      Minúscula
                    </span>
                  )}
                  <span className="text-slate-500">→</span>
                  <span className="text-xl font-bold text-emerald-400 font-serif">{testResult}</span>
                </div>
              )}
            </div>
          </div>

          {/* Active Mappings Grid Overview */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Tecles Mapejades Actuals ({filteredMappings.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Distingeix majúscules i minúscules (ex: <code className="text-amber-300 font-mono">[m]</code> vs <code className="text-amber-300 font-mono">[M]</code>)
                </p>
              </div>

              {/* Search filter for mapped keys */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cerca tecla o lletra..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[220px] overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800 font-mono">
              {filteredMappings.map(([key, char]) => (
                <div
                  key={key}
                  className="group flex items-center justify-between bg-slate-900/90 hover:bg-slate-850 px-2.5 py-1.5 rounded-lg border border-slate-800/80 transition"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-amber-300 font-mono font-bold text-xs shrink-0">[{key}]</span>
                    {key >= 'A' && key <= 'Z' && (
                      <span className="text-[9px] bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 px-1 py-0.2 rounded font-sans font-semibold shrink-0">
                        Shift
                      </span>
                    )}
                    {key >= 'a' && key <= 'z' && (
                      <span className="text-[9px] text-slate-500 font-sans shrink-0">
                        min
                      </span>
                    )}
                    <span className="text-slate-600 shrink-0">→</span>
                    <span className="text-amber-400 font-bold text-base font-serif truncate">{char}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhysicalKey(key);
                        setSelectedChar(char);
                      }}
                      className="p-1 hover:text-amber-300 text-slate-500 transition"
                      title={`Editar [${key}]`}
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteKey(key)}
                      className="p-1 hover:text-rose-400 text-slate-500 transition"
                      title={`Eliminar mapeig de [${key}]`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredMappings.length === 0 && (
                <div className="col-span-full py-6 text-center text-slate-500 text-xs">
                  No s'ha trobat cap tecla amb aquest filtre.
                </div>
              )}
            </div>
          </div>

          {/* Code Export Box: dynamically kept in sync with changes */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200">Codi Font Actualitzat (TypeScript):</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Aquest codi s'actualitza automàticament amb els teus canvis. Pots copiar-lo o descarregar-lo per substituir <code className="text-amber-400 font-mono">src/keyboardMapping.ts</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs transition border border-slate-700"
                  title="Descarregar fitxer keyboardMapping.ts"
                >
                  {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{downloaded ? 'Descarregat!' : 'Descarregar .ts'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-semibold text-xs transition border border-amber-500/30"
                  title="Copiar codi font al porta-retalls"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiat!' : 'Copiar Codi'}</span>
                </button>
              </div>
            </div>

            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px] overflow-x-auto max-h-[160px] no-scrollbar">
              {mappingCodeSnippet}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Els canvis tenen efecte immediat tant al teclat físic com a la llibreta de notes.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition ml-auto"
          >
            Fet i Tancar
          </button>
        </div>
      </div>
    </div>
  );
};
