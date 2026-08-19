import React from 'react';
import { Link } from 'react-router-dom';
import { personas } from '../../data/personasData';

/**
 * PersonaBadgeSwitcher
 * Props:
 *   activePersonaId {string}  — currently active persona id
 *   light           {boolean} — use light-background-compatible styling
 */
const PersonaBadgeSwitcher = ({ activePersonaId, light = false }) => {
  const isFriend = activePersonaId === 'friend';

  const wrapperBase = isFriend
    ? 'bg-white border-2 border-black text-black shadow-[3px_3px_0px_#000000]'
    : light
      ? 'bg-white/80 border-stone-200 text-stone-500'
      : 'bg-slate-900/50 border-slate-800 text-slate-400';

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[11px] font-sans ${wrapperBase}`}
    >
      <span
        className={`font-semibold select-none uppercase tracking-wider text-[9px] mr-1 ${
          isFriend ? 'text-black font-mono font-black' : light ? 'text-stone-400' : 'text-slate-500'
        }`}
      >
        Viewing:
      </span>

      <div className="flex items-center space-x-1.5 flex-wrap">
        {personas.map((p) => {
          const isActive = p.id === activePersonaId;

          let activeStyles = '';
          if (isActive) {
            if (p.id === 'developer') {
              activeStyles =
                'bg-cyan-950/80 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-mono';
            } else if (p.id === 'writer') {
              activeStyles = light
                ? 'bg-amber-50 text-amber-700 border-amber-300 font-serif'
                : 'bg-amber-950/80 text-amber-500 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-serif';
            } else if (p.id === 'friend') {
              activeStyles =
                'bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-mono font-black';
            } else {
              // philosopher
              activeStyles =
                'bg-purple-950/80 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)] font-serif';
            }
          } else {
            activeStyles = isFriend
              ? 'text-neutral-700 hover:text-black border-transparent hover:bg-[#FFE600]/40 font-mono'
              : light
                ? 'text-stone-400 hover:text-stone-700 border-transparent hover:bg-stone-100'
                : 'text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-800/40';
          }

          const displayName =
            p.id === 'friend' ? 'Human' : p.title.split(' ')[0];

          return (
            <Link
              key={p.id}
              to={p.route}
              className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all duration-300 ${activeStyles}`}
            >
              {displayName}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaBadgeSwitcher;
