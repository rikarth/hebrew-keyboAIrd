import { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Notebook } from './components/Notebook';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { MappingModal } from './components/MappingModal';
import { HelpModal } from './components/HelpModal';
import { NotebookFont, NotebookTheme, KeyClickPayload } from './types';
import { PHYSICAL_KEY_MAP, DEFAULT_ISRAELI_KEY_MAP } from './keyboardMapping';
import { insertTextAtCursor, backspaceAtCursor, deleteAtCursor } from './utils/text';
import { playKeyClickSound } from './utils/audio';

// Utilitats d'emmagatzematge segur (per a file:// i navegadors locals)
const STORAGE_KEYS = {
  TEXT: 'hebrew_keyboard_text',
  THEME: 'hebrew_keyboard_theme',
  FONT: 'hebrew_keyboard_font',
  FONT_SIZE: 'hebrew_keyboard_font_size',
  SOUND: 'hebrew_keyboard_sound',
  PHYSICAL_KB: 'hebrew_keyboard_physical_enabled',
  KEY_MAPPING: 'hebrew_keyboard_custom_mapping',
};

function getSavedItem<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return JSON.parse(val) as T;
  } catch {
    // En cas de restriccions de seguretat en sandbox file://
  }
  return fallback;
}

function setSavedItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignorar errors de quota o accés
  }
}

export default function App() {
  const initialText = getSavedItem<string>(STORAGE_KEYS.TEXT, 'שָׁלוֹם עֲלֵיכֶם');

  // Historial i estat del text
  const [text, setTextState] = useState<string>(initialText);
  const [history, setHistory] = useState<string[]>([initialText]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Referència a la casella de text
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Configuració global persistida
  const [physicalKeyboardEnabled, setPhysicalKeyboardEnabled] = useState<boolean>(() =>
    getSavedItem<boolean>(STORAGE_KEYS.PHYSICAL_KB, true)
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    getSavedItem<boolean>(STORAGE_KEYS.SOUND, true)
  );
  const [theme, setTheme] = useState<NotebookTheme>(() =>
    getSavedItem<NotebookTheme>(STORAGE_KEYS.THEME, 'classic')
  );
  const [font, setFont] = useState<NotebookFont>(() =>
    getSavedItem<NotebookFont>(STORAGE_KEYS.FONT, 'serif')
  );
  const [fontSize, setFontSize] = useState<number>(() =>
    getSavedItem<number>(STORAGE_KEYS.FONT_SIZE, 22)
  );

  // Mapeig interactiu de tecles físiques a hebreu (desat al navegador)
  const [keyMap, setKeyMap] = useState<Record<string, string>>(() =>
    getSavedItem<Record<string, string>>(STORAGE_KEYS.KEY_MAPPING, PHYSICAL_KEY_MAP)
  );

  // Modals
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Caràcter prems al teclat físic per a l'efecte visual en el teclat virtual
  const [activePhysicalChar, setActivePhysicalChar] = useState<string | null>(null);

  // Restablir mapeig de tecles
  const handleResetKeyMap = useCallback(() => {
    const defaultMap = { ...DEFAULT_ISRAELI_KEY_MAP };
    setKeyMap(defaultMap);
    setSavedItem(STORAGE_KEYS.KEY_MAPPING, defaultMap);
  }, []);

  // Persistència automàtica d'estats per a sessions locals
  useEffect(() => {
    setSavedItem(STORAGE_KEYS.TEXT, text);
  }, [text]);

  useEffect(() => {
    setSavedItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    setSavedItem(STORAGE_KEYS.FONT, font);
  }, [font]);

  useEffect(() => {
    setSavedItem(STORAGE_KEYS.FONT_SIZE, fontSize);
  }, [fontSize]);

  useEffect(() => {
    setSavedItem(STORAGE_KEYS.SOUND, soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    setSavedItem(STORAGE_KEYS.PHYSICAL_KB, physicalKeyboardEnabled);
  }, [physicalKeyboardEnabled]);

  useEffect(() => {
    setSavedItem(STORAGE_KEYS.KEY_MAPPING, keyMap);
  }, [keyMap]);

  // Actualització de text amb registre d'historial (Undo / Redo)
  const updateTextAndHistory = useCallback((newText: string) => {
    setTextState(newText);
    setHistory((prev) => {
      const newHist = prev.slice(0, historyIndex + 1);
      newHist.push(newText);
      if (newHist.length > 50) newHist.shift(); // màxim 50 estats
      return newHist;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Accions Desfer / Refer
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setTextState(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setTextState(history[nextIndex]);
    }
  };

  // Inserció d'un caràcter o signe en la llibreta
  const handleKeyClick = useCallback(({ char, type }: KeyClickPayload) => {
    playKeyClickSound(soundEnabled, type);

    const targetEl = textareaRef.current;
    const { newText, newCursorPos } = insertTextAtCursor(targetEl, text, char);

    updateTextAndHistory(newText);

    // Mantenir el focus i la posició del cursor a la llibreta
    setTimeout(() => {
      if (targetEl) {
        targetEl.focus();
        targetEl.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [text, soundEnabled, updateTextAndHistory]);

  // Accions ràpides (Espai, Enter, Backspace, Delete)
  const handleQuickAction = useCallback((action: 'space' | 'enter' | 'backspace' | 'delete') => {
    playKeyClickSound(soundEnabled, 'special');
    const targetEl = textareaRef.current;

    if (action === 'space') {
      handleKeyClick({ char: ' ', type: 'special' });
    } else if (action === 'enter') {
      handleKeyClick({ char: '\n', type: 'special' });
    } else if (action === 'backspace') {
      const { newText, newCursorPos } = backspaceAtCursor(targetEl, text);
      updateTextAndHistory(newText);
      setTimeout(() => {
        if (targetEl) {
          targetEl.focus();
          targetEl.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    } else if (action === 'delete') {
      const { newText, newCursorPos } = deleteAtCursor(targetEl, text);
      updateTextAndHistory(newText);
      setTimeout(() => {
        if (targetEl) {
          targetEl.focus();
          targetEl.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  }, [text, soundEnabled, handleKeyClick, updateTextAndHistory]);

  // Intercepció de les tecles del teclat físic si està habilitat
  useEffect(() => {
    if (!physicalKeyboardEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si l'usuari està escrivint en un altre input (ex: la barra de cerca o un modal)
      const activeEl = document.activeElement;
      if (
        activeEl &&
        activeEl.tagName === 'INPUT' &&
        activeEl !== textareaRef.current
      ) {
        return;
      }

      // No interceptar tecles amb Ctrl/Alt/Meta
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key.toLowerCase();

      // Comprovar si la tecla té un mapeig hebreu assignat en la configuració activa
      if (keyMap[key]) {
        e.preventDefault();
        const mappedChar = keyMap[key];

        setActivePhysicalChar(mappedChar);
        setTimeout(() => setActivePhysicalChar(null), 200);

        handleKeyClick({ char: mappedChar, type: 'letter' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [physicalKeyboardEnabled, keyMap, handleKeyClick]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Header Bar */}
      <Header
        physicalKeyboardEnabled={physicalKeyboardEnabled}
        onTogglePhysicalKeyboard={() => setPhysicalKeyboardEnabled((prev) => !prev)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        theme={theme}
        onChangeTheme={setTheme}
        font={font}
        onChangeFont={setFont}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        onOpenMappingModal={() => setIsMappingModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-6">
        {/* Notebook Display Area */}
        <section className="flex-1 min-h-[240px]">
          <Notebook
            text={text}
            setText={(val) => updateTextAndHistory(val)}
            onTextareaRef={(ref) => {
              textareaRef.current = ref;
            }}
            font={font}
            theme={theme}
            fontSize={fontSize}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onQuickAction={handleQuickAction}
          />
        </section>

        {/* Virtual Keyboard Section */}
        <section>
          <VirtualKeyboard
            onKeyClick={handleKeyClick}
            activePhysicalChar={activePhysicalChar}
            keyMap={keyMap}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 text-slate-500 text-[11px] py-3 text-center">
        Teclat Virtual Hebreu i Llibreta BIDI • Preparat per a funcionament offline i protocol <code className="text-amber-400 font-mono">file://</code>
      </footer>

      {/* Modals */}
      <MappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        keyMap={keyMap}
        onUpdateKeyMap={setKeyMap}
        onResetKeyMap={handleResetKeyMap}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
