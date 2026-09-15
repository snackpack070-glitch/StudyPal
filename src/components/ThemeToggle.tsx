import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'pill' | 'button' | 'sidebar';
  className?: string;
  showLabels?: boolean;
}

export default function ThemeToggle({
  variant = 'pill',
  className = '',
  showLabels = false
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`relative p-2 rounded-xl border transition-all duration-300 cursor-pointer group flex items-center justify-center ${
          isDark
            ? 'bg-slate-900/80 border-slate-700/70 text-yellow-300 hover:bg-slate-800 hover:border-yellow-400/40 shadow-xs'
            : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-900 shadow-xs'
        } ${className}`}
      >
        <div className="relative w-4 h-4">
          <Sun
            className={`w-4 h-4 transition-all duration-300 absolute inset-0 text-amber-500 ${
              isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <Moon
            className={`w-4 h-4 transition-all duration-300 absolute inset-0 text-indigo-300 ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
            }`}
          />
        </div>
      </button>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center justify-between p-2 rounded-xl bg-blue-900/40 dark:bg-slate-900/60 border border-blue-800/60 dark:border-slate-800/80 transition-all ${className}`}>
        <div className="flex items-center space-x-2 text-xs font-medium text-blue-200 dark:text-slate-300 pl-1">
          {isDark ? (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Theme</span>
            </>
          )}
        </div>

        {/* Sleek switch */}
        <button
          onClick={toggleTheme}
          type="button"
          role="switch"
          aria-checked={isDark}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-hidden bg-slate-800 dark:bg-indigo-950 border-blue-700/50 dark:border-indigo-500/40"
        >
          <span className="sr-only">Toggle theme</span>
          <span
            className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out flex items-center justify-center ${
              isDark ? 'translate-x-5 bg-indigo-100 text-indigo-900' : 'translate-x-0 bg-amber-50 text-amber-600'
            }`}
          >
            {isDark ? (
              <Moon className="w-3 h-3 text-indigo-600" />
            ) : (
              <Sun className="w-3 h-3 text-amber-500" />
            )}
          </span>
        </button>
      </div>
    );
  }

  // Default 'pill' variant: A luxury, sleek dual-state toggle capsule
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        title={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'}. Click to switch to ${isDark ? 'Light' : 'Dark'} Mode.`}
        className={`relative inline-flex items-center h-8 sm:h-9 px-1 rounded-full cursor-pointer transition-all duration-300 select-none group border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_12px_rgba(99,102,241,0.15)] hover:border-indigo-500/40'
            : 'bg-slate-100/90 border-slate-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] hover:border-amber-400/50'
        }`}
      >
        {/* Sliding Indicator Pill */}
        <span
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 cubic-bezier(0.4,0,0.2,1) shadow-md flex items-center justify-center ${
            isDark
              ? 'left-[calc(50%+2px)] bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-indigo-900/50'
              : 'left-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-amber-500/30'
          }`}
        />

        {/* Light Option Side */}
        <span
          className={`relative z-10 flex items-center justify-center space-x-1 px-2.5 py-1 text-xs font-bold transition-colors duration-200 ${
            !isDark ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-300'
          }`}
        >
          <Sun className={`w-3.5 h-3.5 transition-transform duration-300 ${!isDark ? 'rotate-0 scale-105 text-slate-950' : '-rotate-45 scale-90'}`} />
          {showLabels && <span className="hidden sm:inline">Light</span>}
        </span>

        {/* Dark Option Side */}
        <span
          className={`relative z-10 flex items-center justify-center space-x-1 px-2.5 py-1 text-xs font-bold transition-colors duration-200 ${
            isDark ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
          }`}
        >
          <Moon className={`w-3.5 h-3.5 transition-transform duration-300 ${isDark ? 'rotate-0 scale-105 text-white' : 'rotate-45 scale-90'}`} />
          {showLabels && <span className="hidden sm:inline">Dark</span>}
        </span>
      </button>
    </div>
  );
}
