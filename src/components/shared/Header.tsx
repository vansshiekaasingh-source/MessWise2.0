import React from 'react';

interface HeaderProps {
  currentUser: any;
  onSwitchUser: (id: string) => void;
  personas: any[];
  currentTime: Date;
  currentDay: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  activePortal: string;
  onSelectPortal: (portal: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  personas,
  currentTime,
  currentDay,
  theme,
  onToggleTheme,
  onLogout,
  activePortal,
  onSelectPortal
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

        {/* Direct Portal Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1.5 ml-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onSelectPortal('STUDENT')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              activePortal === 'STUDENT'
                ? 'bg-deepMaroon text-white shadow-sm'
                : 'text-mutedStone hover:text-charcoal dark:hover:text-textPrimary bg-warmIvory dark:bg-surfaceElevated'
            }`}
          >
            Student Portal
          </button>

          <button
            type="button"
            onClick={() => onSelectPortal('MESS_STAFF')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              activePortal === 'MESS_STAFF'
                ? 'bg-deepMaroon text-white shadow-sm'
                : 'text-mutedStone hover:text-charcoal dark:hover:text-textPrimary bg-warmIvory dark:bg-surfaceElevated'
            }`}
          >
            📷 Staff Scanner & Kitchen
          </button>

          <button
            type="button"
            onClick={() => onSelectPortal('HOSTEL_WARDEN')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              activePortal === 'HOSTEL_WARDEN'
                ? 'bg-deepMaroon text-white shadow-sm'
                : 'text-mutedStone hover:text-charcoal dark:hover:text-textPrimary bg-warmIvory dark:bg-surfaceElevated'
            }`}
          >
            Warden Approvals
          </button>

          <button
            type="button"
            onClick={() => onSelectPortal('ADMIN')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              activePortal === 'ADMIN'
                ? 'bg-deepMaroon text-white shadow-sm'
                : 'text-mutedStone hover:text-charcoal dark:hover:text-textPrimary bg-warmIvory dark:bg-surfaceElevated'
            }`}
          >
            Admin Telemetry
          </button>
        </div>
      </div>

      {/* Right Actions: Clock, Role Switcher, Theme, Logout */}
      <div className="flex items-center gap-2">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 bg-warmIvory dark:bg-surfaceElevated rounded-xl border border-softBorder dark:border-borderDark text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-leafGreen animate-ping"></span>
          <span className="font-bold text-deepMaroon dark:text-gold">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
          </span>
        </div>

        {/* Persona Select */}
        <select
          value={currentUser.id}
          onChange={(e) => onSwitchUser(e.target.value)}
          className="text-xs p-1.5 rounded-xl border border-softBorder dark:border-borderDark bg-warmIvory dark:bg-surfaceElevated font-semibold text-deepMaroon dark:text-primaryAccent"
          title="Sandbox Persona Switcher"
        >
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.role.replace('_', ' ')}: {p.name}
            </option>
          ))}
        </select>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 text-xs rounded-xl bg-warmIvory dark:bg-surfaceElevated border border-softBorder dark:border-borderDark cursor-pointer hover:border-turmericGold"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1.5 bg-red-100 dark:bg-red-950/40 hover:bg-errorRed text-errorRed hover:text-white border border-red-200 dark:border-red-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
