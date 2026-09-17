import React, { useState } from 'react';
import { 
  Trophy, 
  Gamepad2, 
  Clock, 
  Star, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Swords, 
  Zap, 
  Share2, 
  Award,
  BarChart2,
  Pencil,
  Camera
} from 'lucide-react';
import { AchievementBadge, Game, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { EditProfileModal } from './EditProfileModal';

interface ProfileViewProps {
  user: UserProfile;
  achievements: AchievementBadge[];
  games: Game[];
  onOpenCreateReview: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Trophy,
  Swords,
  Sparkles,
  Zap,
  Gamepad2,
  Flame,
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  achievements,
  games,
  onOpenCreateReview,
  onUpdateUser,
}) => {
  const { isDark } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const completedGames = games.filter(g => g.status === 'completed');
  const playingGames = games.filter(g => g.status === 'playing');
  const droppedGames = games.filter(g => g.status === 'dropped');

  const totalHours = games.reduce((acc, g) => acc + (g.hours || 0), 0);
  const totalAchievementsUnlocked = games.reduce((acc, g) => acc + (g.achievementsUnlocked || 0), 0);
  
  const ratedGames = games.filter(g => g.rating && g.rating > 0);
  const avgRating = ratedGames.length > 0 
    ? (ratedGames.reduce((acc, g) => acc + (g.rating || 0), 0) / ratedGames.length).toFixed(1)
    : '8.8';

  const xpPercentage = Math.round((user.xp / user.nextLevelXp) * 100);

  // Platform breakdown
  const platformsCount = games.reduce((acc, g) => {
    acc[g.platform] = (acc[g.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Profile Header Hero */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border transition-all ${
        user.bannerGradient
          ? `bg-gradient-to-r ${user.bannerGradient} border-slate-700/50 text-white`
          : isDark 
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800' 
            : 'bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white border-indigo-100 shadow-md'
      }`}>
        <div className="absolute right-0 top-0 w-96 h-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        {user.bannerGradient && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] pointer-events-none" />
        )}
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div 
              className="relative group cursor-pointer flex-shrink-0"
              onClick={() => setIsEditModalOpen(true)}
              title="Кликните, чтобы сменить аватарку или отредактировать профиль"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/50 shadow-xl group-hover:brightness-90 transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=256&q=80';
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold gap-0.5">
                <Camera className="w-5 h-5 drop-shadow" />
                <span>Изменить</span>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-[11px] rounded-lg shadow-md border border-amber-300">
                LVL {user.level}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={`font-display text-2xl sm:text-3xl font-extrabold ${user.bannerGradient ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'}`}>
                  {user.name}
                </h1>
                <span className="text-xs text-slate-400 font-mono">
                  {user.tag}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  user.bannerGradient
                    ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm'
                    : isDark 
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                      : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}>
                  {user.title}
                </span>
              </div>

              <p className={`text-xs sm:text-sm max-w-xl ${user.bannerGradient ? 'text-slate-200' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {user.bio}
              </p>

              {/* Extra Badges: Platform, Genre, Socials */}
              {(user.favoritePlatform || user.favoriteGenre || user.discordTag || user.telegramTag) && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  {user.favoritePlatform && (
                    <span className={`px-2.5 py-0.5 rounded-lg font-medium border flex items-center gap-1.5 ${
                      user.bannerGradient
                        ? 'bg-white/10 border-white/20 text-white'
                        : isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{user.favoritePlatform}</span>
                    </span>
                  )}
                  {user.favoriteGenre && (
                    <span className={`px-2.5 py-0.5 rounded-lg font-medium border flex items-center gap-1.5 ${
                      user.bannerGradient
                        ? 'bg-white/10 border-white/20 text-white'
                        : isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{user.favoriteGenre}</span>
                    </span>
                  )}
                  {user.discordTag && (
                    <span className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] border ${
                      user.bannerGradient
                        ? 'bg-white/10 border-white/20 text-white'
                        : isDark ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}>
                      Discord: {user.discordTag}
                    </span>
                  )}
                  {user.telegramTag && (
                    <span className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] border ${
                      user.bannerGradient
                        ? 'bg-white/10 border-white/20 text-white'
                        : isDark ? 'bg-sky-950/40 border-sky-500/30 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-700'
                    }`}>
                      TG: {user.telegramTag}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              id="btn-open-edit-profile"
              onClick={() => setIsEditModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
                user.bannerGradient
                  ? 'bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm'
                  : isDark
                    ? 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-slate-200'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <Pencil className="w-3.5 h-3.5 text-indigo-400" />
              <span>Редактировать профиль</span>
            </button>

            <button
              onClick={onOpenCreateReview}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Написать AI-обзор</span>
            </button>
          </div>

        </div>

        {/* Level XP Progress */}
        <div className={`mt-6 pt-5 border-t ${
          user.bannerGradient ? 'border-white/20' : isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`font-semibold flex items-center gap-1.5 ${
              user.bannerGradient ? 'text-white' : isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Flame className="w-4 h-4 text-orange-500" />
              Прогресс геймерского ранга: <strong className={user.bannerGradient ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'}>Уровень {user.level}</strong>
            </span>
            <span className={`font-mono font-semibold ${
              user.bannerGradient ? 'text-white' : isDark ? 'text-indigo-300' : 'text-indigo-600'
            }`}>
              {user.xp} / {user.nextLevelXp} XP ({xpPercentage}%)
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* Monthly Stats Section */}
      <div className={`rounded-2xl p-6 shadow-xl space-y-4 border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h2 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Статистика за месяц ({user.monthlyStats.monthName})
            </h2>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
            isDark 
              ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
              : 'text-indigo-700 bg-indigo-50 border-indigo-200'
          }`}>
            Активный сезон
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className={`p-4 rounded-xl border space-y-1 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className={`text-[11px] uppercase font-semibold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Пройдено игр</span>
            </div>
            <div className={`font-display text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {completedGames.length}
            </div>
            <div className="text-[11px] text-emerald-500">
              +2 за последнюю неделю
            </div>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className={`text-[11px] uppercase font-semibold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Сыграно времени</span>
            </div>
            <div className={`font-display text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalHours} ч.
            </div>
            <div className="text-[11px] text-sky-500">
              ~2.3 ч. в день
            </div>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className={`text-[11px] uppercase font-semibold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Средняя оценка</span>
            </div>
            <div className={`font-display text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {avgRating} <span className="text-xs text-slate-400">/ 10</span>
            </div>
            <div className="text-[11px] text-amber-500">
              Строгий критик
            </div>
          </div>

          <div className={`p-4 rounded-xl border space-y-1 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className={`text-[11px] uppercase font-semibold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Любимый жанр</span>
            </div>
            <div className={`font-display text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`} title={user.monthlyStats.topGenre}>
              {user.monthlyStats.topGenre}
            </div>
            <div className="text-[11px] text-purple-500">
              65% всего бэклога
            </div>
          </div>

        </div>

        {/* Platform breakdown bar */}
        <div className={`pt-3 border-t ${isDark ? 'border-slate-800/70' : 'border-slate-100'}`}>
          <div className={`text-xs font-semibold mb-2 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Распределение по платформам:</span>
            <span className="text-slate-400">Всего тайтлов: {games.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(platformsCount).map(([plat, count]) => (
              <span
                key={plat}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-200' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>{plat}:</span>
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>{count} игр</strong>
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Gamified Achievements System */}
      <div className={`rounded-2xl p-6 shadow-xl space-y-5 border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Система ачивок трекинга
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Награды за закрытие игр, написание обзоров и активность в социальной ленте.
            </p>
          </div>

          <div className="text-xs font-mono text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
            {achievements.filter(a => a.unlocked).length} / {achievements.length} ОТКРЫТО
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const IconComponent = ICON_MAP[ach.iconName] || Trophy;
            const progressPercent = Math.min(100, Math.round((ach.currentProgress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                id={`badge-${ach.id}`}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex gap-4 ${
                  ach.unlocked
                    ? isDark
                      ? 'bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-950/20'
                      : 'bg-gradient-to-br from-amber-50/60 via-white to-white border-amber-300 shadow-sm'
                    : isDark
                      ? 'bg-slate-950/50 border-slate-800 opacity-75'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                {/* Icon box */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative ${
                  ach.unlocked
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20'
                    : isDark 
                      ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                      : 'bg-slate-200 text-slate-400 border border-slate-300'
                }`}>
                  <IconComponent className="w-7 h-7" />
                  {!ach.unlocked && (
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-300 text-slate-500'
                    }`}>
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display font-bold text-sm ${
                      ach.unlocked 
                        ? (isDark ? 'text-white' : 'text-slate-900') 
                        : (isDark ? 'text-slate-300' : 'text-slate-700')
                    }`}>
                      {ach.title}
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-amber-500">
                      +{ach.rewardExp} XP
                    </span>
                  </div>

                  <p className={`text-xs leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className={`flex items-center justify-between text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>
                        {ach.unlocked ? 'Получено: ' + (ach.unlockedAt || 'Недавно') : 'Прогресс'}
                      </span>
                      <span>
                        {ach.currentProgress} / {ach.maxProgress}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ach.unlocked
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdateUser}
        user={user}
      />

    </div>
  );
};

