import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Trophy, 
  Sparkles, 
  Search, 
  Filter, 
  MoreVertical, 
  Star, 
  CheckCircle2, 
  Play, 
  XCircle, 
  Bookmark, 
  Share2, 
  Trash2, 
  Edit3,
  Flame,
  Gamepad
} from 'lucide-react';
import { Game, ShelfStatus, Platform } from '../types';
import { PLATFORM_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface ShelfViewProps {
  games: Game[];
  onOpenAddGame: () => void;
  onOpenAIReviewForm: (game?: Game) => void;
  onViewReviewCard: (game: Game) => void;
  onUpdateGameStatus: (gameId: string, status: ShelfStatus) => void;
  onUpdateGameHours: (gameId: string, hours: number) => void;
  onDeleteGame: (gameId: string) => void;
}


const SHELF_SECTIONS: { id: ShelfStatus; label: string; icon: React.FC<{ className?: string }>; color: string; desc: string }[] = [
  { 
    id: 'playing', 
    label: 'Прохожу сейчас', 
    icon: Play, 
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    desc: 'Активные игровые тайтлы в ротации'
  },
  { 
    id: 'completed', 
    label: 'Пройдено', 
    icon: CheckCircle2, 
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    desc: 'Закрытые шедевры, титры и выбитые платины'
  },
  { 
    id: 'dropped', 
    label: 'Заброшено (Drop)', 
    icon: XCircle, 
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    desc: 'Душный гринд или проекты не выдержавшие темп'
  },
  { 
    id: 'wishlist', 
    label: 'Желаемое', 
    icon: Bookmark, 
    color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
    desc: 'Бэклог на будущее и ожидаемые релизы'
  },
];

export const ShelfView: React.FC<ShelfViewProps> = ({
  games,
  onOpenAddGame,
  onOpenAIReviewForm,
  onViewReviewCard,
  onUpdateGameStatus,
  onUpdateGameHours,
  onDeleteGame,
}) => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<ShelfStatus>('playing');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingHoursGameId, setEditingHoursGameId] = useState<string | null>(null);
  const [tempHours, setTempHours] = useState<number>(0);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSection = game.status === activeSection;
      const matchesPlatform = platformFilter === 'all' || game.platform === platformFilter;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.genre && game.genre.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSection && matchesPlatform && matchesSearch;
    });
  }, [games, activeSection, platformFilter, searchQuery]);

  // Section counters
  const sectionCounts = useMemo(() => {
    const counts: Record<ShelfStatus, number> = {
      playing: 0,
      completed: 0,
      dropped: 0,
      wishlist: 0,
    };
    games.forEach((g) => {
      if (counts[g.status] !== undefined) {
        counts[g.status]++;
      }
    });
    return counts;
  }, [games]);

  const handleSaveHours = (gameId: string) => {
    onUpdateGameHours(gameId, Math.max(0, tempHours));
    setEditingHoursGameId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Shelf Status Header */}
      <div className={`rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-colors duration-200 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800/80' 
          : 'bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white border-indigo-100 shadow-sm'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg border ${
                isDark 
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                  : 'bg-indigo-100 text-indigo-600 border-indigo-200'
              }`}>
                <Gamepad className="w-5 h-5" />
              </span>
              <h1 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Виртуальная полка игр
              </h1>
            </div>
            <p className={`text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Твой игровой дневник: фиксация времени, трофеев, платформ и персональных вердиктов.
            </p>
          </div>

          <button
            id="shelf-add-game-btn"
            onClick={onOpenAddGame}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Добавить игру на полку</span>
          </button>
        </div>

        {/* 4 Shelf Shelves Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-6">
          {SHELF_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                id={`shelf-tab-${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                className={`flex flex-col text-left p-3.5 sm:p-4 rounded-xl border transition-all relative overflow-hidden ${
                  isActive
                    ? `${sec.color} shadow-md scale-[1.01]`
                    : isDark
                      ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className={`font-semibold text-xs sm:text-sm ${
                      isActive ? (isDark ? 'text-white' : 'text-indigo-900') : (isDark ? 'text-white' : 'text-slate-800')
                    }`}>
                      {sec.label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? (isDark ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white') 
                      : (isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700')
                  }`}>
                    {sectionCounts[sec.id]}
                  </span>
                </div>
                <p className={`text-[11px] mt-1 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {sec.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Bar: Search + Platform selector */}
      <div className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
        isDark 
          ? 'bg-slate-900/70 border-slate-800/80' 
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            id="shelf-search-input"
            type="text"
            placeholder="Поиск по названию или жанру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors border ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 text-slate-200 placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:underline ${
                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Сброс
            </button>
          )}
        </div>

        {/* Platform filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className={`text-xs mr-1 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Платформа:</span>
          </span>
          {(['all', 'PC', 'PlayStation', 'Xbox', 'Switch'] as const).map((p) => {
            const isSelected = platformFilter === p;
            return (
              <button
                key={p}
                id={`filter-platform-${p}`}
                onClick={() => setPlatformFilter(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                      ? 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {p === 'all' ? 'Все' : p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Games */}
      {filteredGames.length === 0 ? (
        <div className={`text-center py-16 px-4 border border-dashed rounded-2xl ${
          isDark 
            ? 'border-slate-800 bg-slate-900/30' 
            : 'border-slate-300 bg-slate-50/50'
        }`}>
          <div className={`w-16 h-16 mx-auto rounded-2xl border flex items-center justify-center mb-4 ${
            isDark 
              ? 'bg-slate-800/60 border-slate-700/50 text-slate-400' 
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            <Gamepad className="w-8 h-8 opacity-60" />
          </div>
          <h3 className={`font-display text-lg font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            В этом разделе пока нет игр
          </h3>
          <p className={`text-sm mt-1 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {searchQuery
              ? `По запросу «${searchQuery}» ничего не найдено.`
              : `Добавь свой первый тайтл в «${SHELF_SECTIONS.find(s => s.id === activeSection)?.label}» или используй AI-генератор обзоров.`}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenAddGame}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all"
            >
              + Добавить игру
            </button>
            <button
              onClick={() => onOpenAIReviewForm()}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' 
                  : 'bg-white hover:bg-slate-100 text-amber-600 border-slate-300 shadow-xs'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Сгенерировать AI-обзор
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredGames.map((game) => {
            const platformConfig = PLATFORM_INFO[game.platform] || PLATFORM_INFO.PC;
            const achievementPercent = game.achievementsTotal > 0
              ? Math.round((game.achievementsUnlocked / game.achievementsTotal) * 100)
              : 0;
            const hasReview = Boolean(game.aiReview);

            return (
              <div
                key={game.id}
                id={`game-card-${game.id}`}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 border flex flex-col ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-950/20'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg shadow-xs'
                }`}
              >
                {/* Card Top: Cover + Badges */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

                  {/* Top Bar on Image: Platform & Rating */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${platformConfig.badgeBg}`}>
                      {platformConfig.label}
                    </span>

                    {game.rating !== undefined && game.rating > 0 && (
                      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md border border-amber-500/40 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-amber-300">
                          {game.rating}/10
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Genre in Cover Bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-300">
                      {game.genre}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-200 transition-colors">
                      {game.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body: Tracking parameters (Hours + Achievements) */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Stats Row */}
                  <div className={`grid grid-cols-2 gap-2 p-2.5 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-950/60 border-slate-800/80' 
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    
                    {/* Time tracking */}
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-100 text-sky-600'}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Время
                        </div>
                        {editingHoursGameId === game.id ? (
                          <div className="flex items-center gap-1 mt-0.5">
                            <input
                              type="number"
                              min="0"
                              value={tempHours}
                              onChange={(e) => setTempHours(Number(e.target.value))}
                              className={`w-14 px-1 py-0.5 text-xs rounded border ${
                                isDark 
                                  ? 'bg-slate-900 border-indigo-500 text-white' 
                                  : 'bg-white border-indigo-500 text-slate-900'
                              }`}
                            />
                            <button
                              onClick={() => handleSaveHours(game.id)}
                              className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-semibold"
                            >
                              ОК
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              setEditingHoursGameId(game.id);
                              setTempHours(game.hours);
                            }}
                            className={`text-xs font-bold cursor-pointer hover:text-indigo-500 flex items-center gap-1 group/h ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            <span>{game.hours} ч.</span>
                            <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover/h:opacity-100 transition-opacity text-slate-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Achievements tracking */}
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="text-left w-full">
                        <div className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Трофеи
                        </div>
                        <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {game.achievementsTotal > 0
                            ? `${game.achievementsUnlocked}/${game.achievementsTotal} (${achievementPercent}%)`
                            : '—'}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Achievement progress bar if available */}
                  {game.achievementsTotal > 0 && (
                    <div className="space-y-1">
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${achievementPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick Thoughts or AI Verdict summary snippet */}
                  {game.aiReview ? (
                    <div 
                      onClick={() => onViewReviewCard(game)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors group/verdict border ${
                        isDark 
                          ? 'bg-indigo-950/30 border-indigo-500/30 hover:border-indigo-500/60' 
                          : 'bg-indigo-50/70 border-indigo-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className={`flex items-center justify-between text-[11px] font-semibold mb-1 ${
                        isDark ? 'text-indigo-300' : 'text-indigo-700'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          AI-Вердикт
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-400 group-hover/verdict:text-indigo-200' : 'text-slate-500 group-hover/verdict:text-indigo-800'}`}>
                          Открыть карточку &rarr;
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-2 italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        «{game.aiReview.verdict}»
                      </p>
                    </div>
                  ) : game.userThoughts ? (
                    <div className={`p-2.5 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-950/40 border-slate-800/60' 
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`text-[10px] uppercase font-semibold mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Впечатления игрока
                      </div>
                      <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {game.userThoughts}
                      </p>
                    </div>
                  ) : null}

                  {/* Bottom Actions: Switch shelf status & AI Review trigger */}
                  <div className={`pt-2 border-t flex items-center justify-between gap-2 ${
                    isDark ? 'border-slate-800/80' : 'border-slate-100'
                  }`}>
                    
                    {/* Move shelf status select */}
                    <div className="flex items-center gap-1">
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Статус:</span>
                      <select
                        value={game.status}
                        onChange={(e) => onUpdateGameStatus(game.id, e.target.value as ShelfStatus)}
                        className={`text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 border ${
                          isDark 
                            ? 'bg-slate-950 border-slate-800 text-slate-200' 
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <option value="playing">Прохожу</option>
                        <option value="completed">Пройдено</option>
                        <option value="dropped">Заброшено</option>
                        <option value="wishlist">Желаемое</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {hasReview ? (
                        <button
                          id={`btn-view-review-${game.id}`}
                          onClick={() => onViewReviewCard(game)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                            isDark 
                              ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40' 
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          }`}
                          title="Открыть AI-карточку"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Карточка</span>
                        </button>
                      ) : (
                        <button
                          id={`btn-create-review-${game.id}`}
                          onClick={() => onOpenAIReviewForm(game)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                            isDark 
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40' 
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                          }`}
                          title="Сгенерировать AI-обзор"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI-Обзор</span>
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteGame(game.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Удалить с полки"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

