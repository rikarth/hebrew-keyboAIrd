import React from 'react';
import { motion } from 'motion/react';
import { KeyboardKey } from '../keyboardMapping';

interface KeyButtonProps {
  item: KeyboardKey | { char: string; label: string; sub?: string; type?: string };
  onClick: (char: string, type?: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'wide' | 'space';
  active?: boolean;
}

export const KeyButton: React.FC<KeyButtonProps> = ({
  item,
  onClick,
  size = 'md',
  active = false,
}) => {
  const type = 'type' in item ? item.type : 'letter';
  const name = 'name' in item ? item.name : item.label;
  const description = 'description' in item ? item.description : undefined;
  const sub = 'physicalKey' in item ? item.physicalKey : ('sub' in item ? item.sub : undefined);

  // Determinar estils de color segons el tipus de tecla
  const getTypeStyle = () => {
    switch (type) {
      case 'niqqud':
        return 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-700/50 text-emerald-200 active:bg-emerald-600 active:text-white shadow-emerald-950/40';
      case 'punctuation':
        return 'bg-indigo-950/60 hover:bg-indigo-900 border-indigo-700/50 text-indigo-200 active:bg-indigo-600 active:text-white shadow-indigo-950/40';
      case 'final_letter':
        return 'bg-amber-950/80 hover:bg-amber-900 border-amber-600/60 text-amber-200 active:bg-amber-500 active:text-slate-950 font-bold shadow-amber-950/40';
      case 'number':
        return 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 active:bg-slate-700 shadow-slate-950/40';
      case 'special':
        return 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100 font-semibold active:bg-amber-500 active:text-slate-950 shadow-slate-950/40';
      case 'letter':
      default:
        return 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-amber-100 hover:text-amber-300 active:bg-amber-500 active:text-slate-950 shadow-slate-950/40';
    }
  };

  // Mida del botó
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return 'min-w-[36px] h-10 text-base p-1';
      case 'lg':
        return 'min-w-[56px] h-14 text-2xl p-2';
      case 'wide':
        return 'min-w-[72px] sm:min-w-[90px] h-12 text-sm p-2 font-bold';
      case 'space':
        return 'flex-1 min-w-[160px] h-12 text-sm p-2 font-bold';
      case 'md':
      default:
        return 'min-w-[42px] sm:min-w-[48px] h-12 text-xl p-1.5';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      onClick={() => onClick(item.char, type)}
      className={`group relative flex flex-col items-center justify-between rounded-xl border shadow-md transition-all duration-150 cursor-pointer select-none ${getTypeStyle()} ${getSizeStyle()} ${
        active ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/30' : ''
      }`}
      title={name ? `${name}${description ? ` — ${description}` : ''}` : item.label}
    >
      {/* Sub-etiqueta (tecla QWERTY o nom curt) */}
      {sub && (
        <span className="text-[10px] uppercase font-mono tracking-tighter opacity-50 group-hover:opacity-90 transition leading-none self-end pr-1 pt-0.5">
          {sub}
        </span>
      )}

      {/* Caràcter Principal */}
      <span className="font-bold my-auto leading-none tracking-normal drop-shadow-xs">
        {item.label}
      </span>

      {/* Indicador de tipus en mini barra inferior si és niqudot o puntuació */}
      {type === 'niqqud' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-0.5" />
      )}
      {type === 'punctuation' && (
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mb-0.5" />
      )}

      {/* Tooltip flotant descriptiu */}
      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none min-w-[110px]">
        <div className="bg-slate-900 border border-slate-700 text-slate-100 text-[11px] rounded-lg py-1.5 px-2.5 shadow-xl text-center leading-tight whitespace-nowrap">
          <div className="font-bold text-amber-400">{name}</div>
          {description && <div className="text-[10px] text-slate-400 mt-0.5">{description}</div>}
          {sub && <div className="text-[9px] font-mono text-slate-500 mt-0.5">Tecla: [{sub}]</div>}
        </div>
        <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
      </div>
    </motion.button>
  );
};
