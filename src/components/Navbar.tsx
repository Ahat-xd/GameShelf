import React, { useState, useRef, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Users, 
  Compass, 
  User, 
  Plus, 
  Sun, 
  Moon,
  Palette,
  Check,
  Dices,
  X
} from 'lucide-react';
import { UserProfile, Theme } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: 'shelf' | 'review-gen' | 'feed' | 'recommendations' | 'profile';
  onSelectTab: (tab: 'shelf' | 'review-gen' | 'feed' | 'recommendations' | 'profile') => void;
  user: UserProfile;
  onOpenAddGame: () => void;
  totalGamesCount: number;
  theme?: Theme;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAddGame,
  totalGamesCount,
}) => {
  const { 
    theme, 
    isDark, 
    toggleTheme, 
    setTheme, 
    accentColor, 
    setAccentColor, 
    paletteColors, 
    randomizePalette 
  } = useTheme();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Close palette on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        setIsPaletteOpen(false);
      }
    };
    if (isPaletteOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPaletteOpen]);

  return (
    <header 
      id="app-header" 
      className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
        isDark 
          ? 'border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md' 
          : 'border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand */}
        <div 
          id="logo-button"
          onClick={() => onSelectTab('shelf')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
              isDark ? 'bg-[#0d121f]' : 'bg-white'
            }`}>
              <Gamepad2 className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className={`font-display font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Game<span className="text-indigo-500">Shelf</span>
              </span>
              <span className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${
                isDark 
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                AI Diary
              </span>
            </div>
            <p className={`text-[11px] leading-none mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Полка &bull; Дневник &bull; Лента
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav 
          id="main-nav" 
          className={`flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl border transition-colors ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            id="nav-tab-shelf"
            onClick={() => onSelectTab('shelf')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'shelf'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden md:inline">Полка игр</span>
            <span className={`hidden md:inline text-[11px] px-1.5 py-0.2 rounded-full ${
              isDark ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-200 text-slate-700'
            }`}>
              {totalGamesCount}
            </span>
          </button>

          <button
            id="nav-tab-review"
            onClick={() => onSelectTab('review-gen')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
              currentTab === 'review-gen'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="hidden md:inline">AI-Обзор</span>
            <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-1.5 py-0.2 rounded uppercase tracking-wider hidden lg:inline">
              Сленг
            </span>
          </button>

          <button
            id="nav-tab-feed"
            onClick={() => onSelectTab('feed')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'feed'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Лента друзей</span>
          </button>

          <button
            id="nav-tab-recs"
            onClick={() => onSelectTab('recommendations')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'recommendations'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden md:inline">AI-Подбор</span>
          </button>

          <button
            id="nav-tab-profile"
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Профиль</span>
          </button>
        </nav>

        {/* Right CTA, Theme Switcher & User badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          
          {/* THEME & COLOR PALETTE BUTTON WITH POPOVER */}
          <div className="relative" ref={paletteRef}>
            <button
              id="btn-toggle-palette"
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              aria-label="Палитра цветов сайта"
              className={`flex items-center gap-2 p-2 rounded-xl border transition-all active:scale-95 ${
                isPaletteOpen
                  ? 'ring-2 ring-indigo-500/50 border-indigo-500'
                  : isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
              title="Настроить палитру цветов и тему сайта"
            >
              {/* Active Color Preview Indicator */}
              <div 
                className="w-4 h-4 rounded-full border border-white/40 shadow-xs flex-shrink-0 transition-transform group-hover:scale-110" 
                style={{ backgroundColor: accentColor }} 
              />
              <Palette className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] font-semibold hidden xl:inline">Палитра</span>
            </button>

            {/* Dropdown Popover */}
            {isPaletteOpen && (
              <div
                id="theme-palette-popover"
                className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border p-4 shadow-2xl z-50 transition-all ${
                  isDark 
                    ? 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-black/70' 
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/80'
                }`}
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 mb-3.5">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">Палитра сайта</h4>
                      <p className="text-[10px] text-slate-400">Цвет акцентов и тема</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPaletteOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 1. Five Random Colors Swatches */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      5 цветов на выбор:
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {accentColor}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {paletteColors.map((color, index) => {
                      const isActive = accentColor.toLowerCase() === color.toLowerCase();
                      return (
                        <button
                          key={index}
                          id={`palette-color-${index}`}
                          onClick={() => setAccentColor(color)}
                          style={{ backgroundColor: color }}
                          className={`h-11 rounded-xl flex items-center justify-center transition-all relative group hover:scale-105 active:scale-95 shadow-md ${
                            isActive
                              ? 'ring-2 ring-offset-2 ring-white scale-105 shadow-lg'
                              : 'hover:opacity-90'
                          }`}
                          title={`Выбрать цвет ${color}`}
                        >
                          {isActive && (
                            <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Randomize 5 colors button */}
                  <button
                    id="btn-randomize-palette"
                    onClick={randomizePalette}
                    className={`w-full mt-2 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all active:scale-98 ${
                      isDark
                        ? 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Dices className="w-3.5 h-3.5 text-amber-400" />
                    <span>🎲 5 новых рандомных цветов</span>
                  </button>
                </div>

                {/* 2. Custom Color Picker */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed mb-4 bg-slate-500/5">
                  <label htmlFor="custom-color-picker" className="text-[11px] font-semibold cursor-pointer">
                    Свой оттенок:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="custom-color-picker"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {accentColor}
                    </span>
                  </div>
                </div>

                {/* 3. Theme Toggle (Black / White) */}
                <div className="pt-3 border-t border-slate-700/50">
                  <div className="text-[11px] font-semibold mb-2 text-slate-400">
                    Режим темы:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="btn-theme-dark"
                      onClick={() => setTheme('dark')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                        isDark
                          ? 'bg-slate-800 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Тёмная</span>
                      {isDark && <Check className="w-3 h-3 text-indigo-400 ml-auto" />}
                    </button>

                    <button
                      id="btn-theme-light"
                      onClick={() => setTheme('light')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                        !isDark
                          ? 'bg-white border-indigo-500 text-slate-900 shadow-md ring-1 ring-indigo-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Светлая</span>
                      {!isDark && <Check className="w-3 h-3 text-indigo-500 ml-auto" />}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Add game CTA */}
          <button
            id="btn-quick-add-game"
            onClick={onOpenAddGame}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Добавить</span>
          </button>

          {/* User mini status */}
          <div 
            id="btn-user-avatar-pill"
            onClick={() => onSelectTab('profile')} 
            className={`flex items-center gap-2 p-1 pl-1.5 sm:pr-3 rounded-full border cursor-pointer transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 hover:border-slate-300'
            }`}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500" 
            />
            <div className="hidden lg:block text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {user.name}
                </span>
                <span className="text-[10px] text-amber-500 font-bold">lvl.{user.level}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

