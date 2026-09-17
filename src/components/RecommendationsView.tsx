import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  RefreshCw, 
  Star, 
  Clock, 
  Check, 
  Plus, 
  Flame, 
  ArrowRight, 
  Bookmark, 
  Gamepad2, 
  CheckCircle2 
} from 'lucide-react';
import { Game, RecommendationItem, ShelfStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

interface RecommendationsViewProps {
  games: Game[];
  onAddRecommendedGameToShelf: (rec: RecommendationItem, status: ShelfStatus) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  games,
  onAddRecommendedGameToShelf,
}) => {
  const { isDark } = useTheme();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ games }),
      });
      const data = await response.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAdd = (rec: RecommendationItem, status: ShelfStatus) => {
    onAddRecommendedGameToShelf(rec, status);
    setAddedIds((prev) => ({ ...prev, [rec.id]: true }));
  };

  // High-rated user favorites for taste context
  const topFavorites = games.filter(g => (g.rating || 0) >= 8);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Hero Header */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800' 
          : 'bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white border-indigo-100 shadow-md'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg border ${
                isDark 
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                  : 'bg-indigo-100 text-indigo-600 border-indigo-200'
              }`}>
                <Compass className="w-5 h-5" />
              </span>
              <h1 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Умный AI-подбор игр
              </h1>
            </div>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Нейросеть проанализировала твои {games.length} игр на полке, оценки и вкусовые предпочтения, чтобы выбрать идеальный следующий проект.
            </p>
          </div>

          <button
            id="btn-refresh-recommendations"
            onClick={fetchRecommendations}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isLoading ? 'Анализируем полку...' : 'Обновить подбор'}</span>
          </button>
        </div>

        {/* Taste analysis summary chip */}
        <div className={`mt-5 pt-4 border-t flex flex-wrap items-center gap-3 text-xs ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Базис вкуса:</span>
          {topFavorites.slice(0, 3).map(g => (
            <span key={g.id} className={`px-2.5 py-0.5 rounded-lg border font-medium ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 text-indigo-300' 
                : 'bg-white border-slate-200 text-indigo-700 shadow-xs'
            }`}>
              {g.title} ({g.rating}/10)
            </span>
          ))}
          <span className="text-slate-400 text-[11px]">
            &bull; Исключены заброшенные механики
          </span>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {isLoading ? (
        <div className={`py-20 text-center space-y-4 rounded-3xl border ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h3 className={`font-display text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI подбирает следующий шедевр
            </h3>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Сравниваем твои завершенные тайтлы, время прохождения и оценки с актуальной базой...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.map((rec) => {
            const isAdded = Boolean(addedIds[rec.id]);
            
            return (
              <div
                key={rec.id}
                id={`rec-card-${rec.id}`}
                className={`rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4 group border ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top Bar: Match Score & Category */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${
                      isDark 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {rec.type}
                    </span>

                    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-display font-extrabold text-xs text-emerald-500">
                        {rec.matchScore}% совпадение
                      </span>
                    </div>
                  </div>

                  {/* Title & Genre */}
                  <div>
                    <h3 className={`font-display text-xl font-bold transition-colors ${
                      isDark 
                        ? 'text-white group-hover:text-indigo-300' 
                        : 'text-slate-900 group-hover:text-indigo-600'
                    }`}>
                      {rec.title}
                    </h3>
                    <div className={`flex items-center gap-2 text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>{rec.genre}</span>
                      <span>&bull;</span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{rec.platform}</span>
                    </div>
                  </div>

                  {/* AI Match Reason */}
                  <div className={`p-3.5 rounded-xl space-y-1 border ${
                    isDark 
                      ? 'bg-indigo-950/30 border-indigo-500/20' 
                      : 'bg-indigo-50/70 border-indigo-200'
                  }`}>
                    <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Почему именно это (AI Match):</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {rec.reason}
                    </p>
                  </div>

                  {/* Vibe & Playtime */}
                  <div className={`flex items-center justify-between text-xs p-2.5 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' 
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      <span>На прохождение: <strong className={isDark ? 'text-white' : 'text-slate-900'}>~{rec.hoursToBeat} ч.</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span className="truncate max-w-[150px]" title={rec.vibe}>{rec.vibe}</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions: Add to Wishlist or Playing */}
                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}>
                  {isAdded ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold py-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Добавлено на твою полку!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => handleAdd(rec, 'playing')}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>Начать играть</span>
                      </button>

                      <button
                        onClick={() => handleAdd(rec, 'wishlist')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
                          isDark 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                        <span>В желаемое</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

