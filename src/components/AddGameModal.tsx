import React, { useState } from 'react';
import { 
  X, 
  Gamepad2, 
  Clock, 
  Trophy, 
  Star, 
  Check, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { Game, Platform, ShelfStatus } from '../types';
import { GENRE_PRESETS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface AddGameModalProps {
  onClose: () => void;
  onSave: (game: Omit<Game, 'id' | 'addedAt'>) => void;
  onOpenAIGeneratorForTitle?: (title: string, rating: number, thoughts: string, platform: Platform, hours: number) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  onClose,
  onSave,
  onOpenAIGeneratorForTitle,
}) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('PC');
  const [status, setStatus] = useState<ShelfStatus>('playing');
  const [hours, setHours] = useState<number>(0);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<number>(0);
  const [achievementsTotal, setAchievementsTotal] = useState<number>(0);
  const [rating, setRating] = useState<number>(8);
  const [genre, setGenre] = useState<string>('Action RPG / Souls');
  const [thoughts, setThoughts] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fallbackCover = coverUrl.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';

    onSave({
      title: title.trim(),
      platform,
      status,
      hours: Number(hours) || 0,
      achievementsUnlocked: Number(achievementsUnlocked) || 0,
      achievementsTotal: Number(achievementsTotal) || 0,
      rating: status === 'wishlist' ? undefined : Number(rating) || 8,
      genre,
      userThoughts: thoughts.trim(),
      coverUrl: fallbackCover,
      completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden my-8 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Добавить игру на полку
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Фиксация времени, трофеев и платформы
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Title */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Название игры <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Например: Dark Souls III, Bloodborne..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Platform & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Платформа
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-200' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="PC">PC (Steam / Epic)</option>
                <option value="PlayStation">PlayStation 5</option>
                <option value="Xbox">Xbox Series X|S</option>
                <option value="Switch">Nintendo Switch</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Раздел полки
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShelfStatus)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-200' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="playing">Прохожу сейчас</option>
                <option value="completed">Пройдено</option>
                <option value="dropped">Заброшено (Drop)</option>
                <option value="wishlist">Желаемое</option>
              </select>
            </div>
          </div>

          {/* Time & Achievements */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>Сыграно (ч)</span>
              </label>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Ачивок</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Выбито"
                value={achievementsUnlocked}
                onChange={(e) => setAchievementsUnlocked(Number(e.target.value))}
                className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Всего ачивок
              </label>
              <input
                type="number"
                min="0"
                placeholder="Всего"
                value={achievementsTotal}
                onChange={(e) => setAchievementsTotal(Number(e.target.value))}
                className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Жанр
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {GENRE_PRESETS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Rating (if not wishlist) */}
          {status !== 'wishlist' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`text-xs font-semibold flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Твоя оценка</span>
                </label>
                <span className="text-xs font-bold text-amber-500">{rating}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          )}

          {/* Thoughts */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Краткие мысли / Заметка
            </label>
            <textarea
              rows={2}
              placeholder="Твои впечатления об игре..."
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Footer Actions */}
          <div className={`pt-3 border-t flex items-center justify-between gap-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            {onOpenAIGeneratorForTitle && (
              <button
                type="button"
                onClick={() => {
                  if (title.trim()) {
                    onOpenAIGeneratorForTitle(title, rating, thoughts, platform, hours);
                    onClose();
                  }
                }}
                disabled={!title.trim()}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  isDark 
                    ? 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-40 border border-amber-500/30' 
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 border border-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Создать AI-обзор</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
              >
                Сохранить
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
