import React from 'react';

interface HeaderProps {
  currentUser: any;
  onSwitchUser: (id: string) => void;
  personas: any[];
  currentTime: Date;
  currentDay: string;
  theme: string;
  onToggleTheme: () => void;
  onLogout: () => void; // <-- This line was missing
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  personas,
  currentTime,
  currentDay,
  theme,
  onToggleTheme,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-riceWhite/95 dark:bg-surface/95 backdrop-blur border-b border-softBorder dark:border-borderDark px-4 sm:px-6 py-3 flex justify-between items-center shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-deepMaroon flex items-center justify-center text-turmericGold font-serif font-black text-xl shadow-sm">
          M
        </div>
        <div>
          <span className="font-serif font-bold text-base text-deepMaroon dark:text-primaryAccent block leading-none">
            MessWise • MNNIT Allahabad
          </span>
          <span className="text-[10px] text-mutedStone tracking-tight block mt-0.5">
            Webster 2026 • Team Terror Code 404 (ID: 254)
          </span>
        </div>
      </div>

      {/* Real-time Clock */}
      <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-warmIvory dark:bg-surfaceElevated rounded-xl border border-softBorder text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-leafGreen animate-ping"></span>
        <span className="font-bold text-deepMaroon dark:text-gold">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
        </span>
        <span className="text-mutedStone text-[11px]">({currentDay})</span>
      </div>

      {/* User Actions & Logout */}
      <div className="flex items-center gap-2">
        <select
          value={currentUser.id}
          onChange={(e) => onSwitchUser(e.target.value)}
          className="text-xs p-1.5 rounded-xl border border-softBorder bg-warmIvory dark:bg-surfaceElevated font-semibold text-deepMaroon"
          title="Demo Role Switcher"
        >
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.role.replace('_', ' ')}: {p.name}
            </option>
          ))}
        </select>

        <button
          onClick={onToggleTheme}
          className="p-2 text-xs rounded-xl bg-warmIvory border border-softBorder"
          title="Toggle Theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="px-3 py-1.5 bg-red-100 hover:bg-errorRed text-errorRed hover:text-white border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer ml-1"
          title="Logout from Firebase"
        >
          Logout
        </button>
      </div>
    </header>
  );
};