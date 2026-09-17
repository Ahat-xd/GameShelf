import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  Clock, 
  Quote, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Copy, 
  Check, 
  Share2,
  Users
} from 'lucide-react';
import { Game } from '../types';
import { PLATFORM_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface ReviewCardModalProps {
  game: Game;
  onClose: () => void;
  onPublishToFeed?: (game: Game) => void;
}

export const ReviewCardModal: React.FC<ReviewCardModalProps> = ({
  game,
  onClose,
  onPublishToFeed,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);

  const review = game.aiReview;
  const platformInfo = PLATFORM_INFO[game.platform] || PLATFORM_INFO.PC;

  const handleCopy = () => {
    if (!review) return;
    const text = `🎮 Обзор: ${game.title} [${game.rating}/10]\n\n⚡ ${review.verdict}\n\n💬 "${game.userThoughts || ''}"\n\n🎯 ${review.gamerScore}\n${review.tags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    if (onPublishToFeed) {
      onPublishToFeed(game);
      setPublished(true);
      setTimeout(() => setPublished(false), 2500);
    }
  };

  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden my-8 transition-colors ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-[#0d1322] to-slate-950 border-indigo-500/40' 
          : 'bg-white border-slate-200'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top neon strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Game Cover Header */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950 overflow-hidden">
          <img
            src={game.coverUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Badges on cover */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${platformInfo.badgeBg}`}>
              {platformInfo.label}
            </span>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-slate-200 border border-slate-700 backdrop-blur-md">
              {game.genre}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                Карточка обзора
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                {game.title}
              </h2>
            </div>

            {game.rating && (
              <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-amber-500/50 px-3.5 py-1.5 rounded-full shadow-lg">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-display font-extrabold text-base text-amber-300">
                  {game.rating}/10
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          
          {/* AI Verdict */}
          <div className={`p-4 rounded-xl border relative ${
            isDark 
              ? 'bg-indigo-950/40 border-indigo-500/40' 
              : 'bg-indigo-50/70 border-indigo-200'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>AI-Вердикт</span>
            </div>
            <p className={`font-display text-lg sm:text-xl font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
              «{review.verdict}»
            </p>
            <div className={`text-xs font-mono mt-2.5 flex items-center gap-2 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{review.gamerScore}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {review.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  isDark 
                    ? 'bg-slate-800 text-indigo-300 border-indigo-500/20' 
                    : 'bg-slate-100 text-indigo-700 border-slate-200'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* User Quote */}
          {game.userThoughts && (
            <div className={`p-3.5 rounded-xl border flex gap-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Quote className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className={`text-xs sm:text-sm italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className={`not-italic font-semibold text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Цитата пользователя:
                </span>
                «{game.userThoughts}»
              </div>
            </div>
          )}

          {/* Review text */}
          <p className={`text-xs sm:text-sm leading-relaxed pt-2 border-t ${
            isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-200'
          }`}>
            {review.reviewBody}
          </p>

          {/* Pros / Cons */}
          {(review.pros.length > 0 || review.cons.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {review.pros.length > 0 && (
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/80 border-emerald-200'
                }`}>
                  <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>База (Плюсы)</span>
                  </div>
                  <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {review.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500">&bull;</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.cons.length > 0 && (
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isDark ? 'bg-rose-950/20 border-rose-500/20' : 'bg-rose-50/80 border-rose-200'
                }`}>
                  <div className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Духота (Минусы)</span>
                  </div>
                  <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {review.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500">&bull;</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tracking Stats in Modal */}
          <div className={`flex items-center justify-between text-xs p-3 rounded-xl border ${
            isDark ? 'text-slate-400 bg-slate-950/60 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>Сыграно: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{game.hours} ч.</strong></span>
            </div>
            {game.achievementsTotal > 0 && (
              <div>
                Трофеи: <strong className="text-amber-500">{game.achievementsUnlocked}/{game.achievementsTotal}</strong>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Скопировано!' : 'Скопировать текст'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onPublishToFeed && (
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                {published ? <Check className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                <span>{published ? 'Опубликовано!' : 'В ленту друзей'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Закрыть
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
