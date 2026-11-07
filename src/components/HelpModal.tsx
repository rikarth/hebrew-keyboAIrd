import React from 'react';
import { X, HelpCircle, Keyboard, Sparkles, Languages, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Guia d'Ús i Instruccions</h2>
              <p className="text-xs text-slate-400">Teclat Virtual Hebreu amb Niqudot i Llibreta de Notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Section 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-400 flex items-center gap-2 text-sm">
              <Keyboard className="w-4 h-4" />
              1. Com utilitzar el Teclat Virtual i Físic
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong>Teclat Virtual:</strong> Fes clic a qualsevol lletra, signe o niqudot del teclat virtual per afegir-lo exactament a la posició del cursor de la llibreta.
              </li>
              <li>
                <strong>Teclat Físic:</strong> Si actives l'opció "Teclat Físic: Actiu", en prémer les tecles del teu teclat QWERTY s'escriuran directament les lletres hebrees equivalents. El mapeig distingeix entre majúscules i minúscules (ex: <code className="text-amber-400 font-mono">m</code> escriu <span className="font-serif font-bold text-amber-300">מ</span> i <code className="text-amber-400 font-mono">M</code> o Shift+m pot escriure la forma final <span className="font-serif font-bold text-amber-300">ם</span>).
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" />
              2. Com afegir Niqudot (Signes de vocalització)
            </h3>
            <p className="text-slate-300">
              Els niqudot (Sheva, Qamats, Pattah, Hiriq, Segol, Dagesh, etc.) són signes diacrítics que es combinen amb la lletra hebrea anterior.
            </p>
            <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40 text-emerald-200">
              <strong>Exemple:</strong> Escriu primer la lletra <span className="font-serif text-lg font-bold">ש</span> i immediatament fes clic al niqudot <span className="font-serif text-lg font-bold">◌ָ</span> (Qamats) per obtenir <span className="font-serif text-lg font-bold text-amber-300">שָ</span>.
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-indigo-400 flex items-center gap-2 text-sm">
              <Languages className="w-4 h-4" />
              3. Combinar Hebreu amb Anglès i Números (BIDI)
            </h3>
            <p className="text-slate-300">
              El camp de la llibreta té suport per a text bidireccional (BIDI). Pots barrejar paraules en anglès, nombres i símbols en el mateix paràgraf sense que s'alteri l'ordre lògic.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              4. Funcionalitat Offline i protocol file://
            </h3>
            <p className="text-slate-300">
              Aquesta aplicació està preparat en fer la build per funcionar localment directament obrint el fitxer <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono">index.html</code> amb el protocol <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono">file://</code> sense necessitar un servidor web.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
          >
            Entesos!
          </button>
        </div>
      </div>
    </div>
  );
};
