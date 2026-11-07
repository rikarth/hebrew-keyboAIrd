import React, { useState } from 'react';
import { 
  X, 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Info, 
  Keyboard, 
  Sparkles 
} from 'lucide-react';
import { PHYSICAL_KEY_MAP, HEBREW_LETTERS, HEBREW_NIQQUD, HEBREW_PUNCTUATION } from '../keyboardMapping';

interface MappingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MappingModal: React.FC<MappingModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [testKey, setTestKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  // Codi font simplificat del fitxer per mostrar o copiar
  const mappingCodeSnippet = `// Fitxer de mapeig: /src/keyboardMapping.ts
export const PHYSICAL_KEY_MAP: Record<string, string> = ${JSON.stringify(PHYSICAL_KEY_MAP, null, 2)};`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(mappingCodeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignorar errors
    }
  };

  const handleTestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const key = e.key.toLowerCase();
    setTestKey(key);
    if (PHYSICAL_KEY_MAP[key]) {
      setTestResult(PHYSICAL_KEY_MAP[key]);
    } else {
      setTestResult('Sense mapeig assignat (escriu la tecla directament)');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Fitxer de Mapeig del Teclat</span>
                <span className="text-xs font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                  /src/keyboardMapping.ts
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pots editar directament aquest fitxer al codi font per personalitzar la disposició de les tecles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6 text-xs text-slate-300">
          {/* Instructions box */}
          <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4 flex items-start gap-3 text-amber-200">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="text-amber-300 block text-sm font-semibold">Com editar el mapeig de tecles?</strong>
              <p>
                1. Obre el fitxer <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-mono">/src/keyboardMapping.ts</code> a l'editor de codi.
              </p>
              <p>
                2. Troba l'objecte <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-mono">PHYSICAL_KEY_MAP</code> o les llistes <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-mono">HEBREW_LETTERS</code>.
              </p>
              <p>
                3. Canvia qualsevol tecla física (ex: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-mono">'t': 'א'</code>) pel caràcter hebreu o niqudot que prefereixis.
              </p>
            </div>
          </div>

          {/* Interactive Keyboard Mapping Tester */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
              <Keyboard className="w-4 h-4 text-amber-400" />
              Provar el Mapeig del Teclat Físic
            </h3>
            <p className="text-slate-400">
              Fes clic a la casella següent i premeu qualsevol tecla del teu teclat per veure com es tradueix a hebreu:
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Prem qualsevol tecla aquí..."
                onKeyDown={handleTestKeyDown}
                className="w-full sm:w-auto flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-center focus:border-amber-500 focus:outline-none"
              />
              {testKey && (
                <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Tecla premsa:</span>
                  <span className="font-mono text-amber-400 font-bold uppercase">{testKey}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-xl font-bold text-amber-300 font-serif">{testResult}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mappings Table Overview */}
          <div>
            <h3 className="font-bold text-slate-200 mb-3 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Taula de Mapeig Actual (Standard Israeli QWERTY Layout)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800 font-mono">
              {Object.entries(PHYSICAL_KEY_MAP).map(([key, char]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800/80"
                >
                  <span className="text-slate-400 uppercase">[{key}]</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-amber-400 font-bold text-base font-serif">{char}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Export Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Codi Font del Mapeig:</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiat!' : 'Copiar Codi'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px] overflow-x-auto">
              {mappingCodeSnippet}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition"
          >
            Tancar
          </button>
        </div>
      </div>
    </div>
  );
};
