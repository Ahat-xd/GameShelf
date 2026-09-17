import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  Send, 
  Check, 
  RefreshCw, 
  Share2, 
  Flame, 
  Save, 
  ArrowLeft, 
  Gamepad2, 
  Clock, 
  Quote, 
  CheckCircle2, 
  XCircle,
  Copy,
  Users
} from 'lucide-react';
import { Game, Platform, ReviewCard, ShelfStatus } from '../types';
import { PLATFORM_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface AIReviewGeneratorProps {
  initialGame?: Game;
  onSaveReviewToGame: (gameData: {
    title: string;
    platform: Platform;
    status: ShelfStatus;
    hours: number;
    rating: number;
    thoughts: string;
    review: ReviewCard;
    coverUrl?: string;
  }) => void;
  onPublishToFeed: (postData: {
    gameTitle: string;
    platform: Platform;
    status: ShelfStatus;
    hours: number;
    rating: number;
    userThoughts: string;
    aiReview: ReviewCard;
    gameCover: string;
  }) => void;
  onBackToShelf: () => void;
}

const PRESET_COVERS: Record<string, string> = {
  'default': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  'rpg': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  'souls': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'retro': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  'horror': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
};

export const AIReviewGenerator: React.FC<AIReviewGeneratorProps> = ({
  initialGame,
  onSaveReviewToGame,
  onPublishToFeed,
  onBackToShelf,
}) => {
  const { isDark } = useTheme();
  // Form fields: user inputs title, rating (1-10), short thoughts
  const [title, setTitle] = useState(initialGame?.title || '');
  const [rating, setRating] = useState<number>(initialGame?.rating || 8);
  const [thoughts, setThoughts] = useState(initialGame?.userThoughts || '');
  const [platform, setPlatform] = useState<Platform>(initialGame?.platform || 'PC');
  const [hours, setHours] = useState<number>(initialGame?.hours || 24);
  const [status, setStatus] = useState<ShelfStatus>(initialGame?.status || 'completed');

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReview, setGeneratedReview] = useState<ReviewCard | null>(initialGame?.aiReview || null);
  const [coverUrl, setCoverUrl] = useState<string>(initialGame?.coverUrl || PRESET_COVERS.default);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('Синхронизация с игровой базой...');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsGenerating(true);
    setSavedSuccess(false);
    setPublishedSuccess(false);

    // Dynamic processing steps for gamer atmosphere
    const steps = [
      'Анализируем геймплейные механики...',
      'Калибруем градус душноты и хайпа...',
      'Синтезируем хлёсткий вердикт на геймерском сленге...',
      'Формируем теги и финальную карточку...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStepText(steps[currentStep]);
      }
    }, 450);

    try {
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          rating,
          thoughts,
          platform,
          hours,
          status,
        }),
      });

      const json = await response.json();
      clearInterval(interval);

      if (json.success && json.data) {
        setGeneratedReview(json.data);
      } else {
        // Fallback safety
        setGeneratedReview({
          verdict: 'Крепчайшая база: проект определенно стоит потраченного времени!',
          tags: ['#База', '#Имба', '#Годнота', '#НаВечерок'],
          pros: ['Отличная атмосфера', 'Приятный визуал'],
          cons: ['Местами проседает темп'],
          gamerScore: 'Вайб: 8.5/10 | Уровень духоты: 3/10',
          reviewBody: `Впечатления от прохождения: «${thoughts || 'Без слов, надо щупать самому'}». Игра оставляет плотное приятное послевкусие и определенно займет достойное место в игровом дневнике.`,
        });
      }
    } catch (err) {
      console.error('Failed to generate review:', err);
      clearInterval(interval);
      setGeneratedReview({
        verdict: 'Крепкая имба: залетает на одном дыхании!',
        tags: ['#Имба', '#База', '#Кайф'],
        pros: ['Крутой ганплей и визуал', 'Затягивающий темп'],
        cons: ['Хотелось бы еще больше контента'],
        gamerScore: 'Вайб: 9/10',
        reviewBody: `Игрок резюмирует: «${thoughts || 'Рекомендую к ознакомлению'}». Грамотный баланс механик и чистый дофаминовый кайф.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToShelf = () => {
    if (!generatedReview) return;
    onSaveReviewToGame({
      title,
      platform,
      status,
      hours,
      rating,
      thoughts,
      review: generatedReview,
      coverUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePublish = () => {
    if (!generatedReview) return;
    onPublishToFeed({
      gameTitle: title,
      platform,
      status,
      hours,
      rating,
      userThoughts: thoughts,
      aiReview: generatedReview,
      gameCover: coverUrl,
    });
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 3000);
  };

  const handleCopyCard = () => {
    if (!generatedReview) return;
    const text = `🎮 Обзор на ${title} (${rating}/10) [${platform}]\n\n⚡ Вердикт: ${generatedReview.verdict}\n\n💬 Цитата: "${thoughts}"\n\n🎯 ${generatedReview.gamerScore}\n${generatedReview.tags.join(' ')}\n\nСгенерировано в GameShelf AI Diary`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const platformInfo = PLATFORM_INFO[platform] || PLATFORM_INFO.PC;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToShelf}
          className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на полку</span>
        </button>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isDark 
            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' 
            : 'bg-amber-50 border border-amber-300 text-amber-800'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Сленг Движок v3.8</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 1. Форма быстрых впечатлений */}
        <div className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Шаг 1: Экспресс-ввод</span>
            </div>
            <h2 className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Форма быстрых впечатлений
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Введи только название, свою оценку и пару слов. AI упакует это в дерзкую карточку с геймерским сленгом.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* 1. Title */}
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Название игры <span className="text-rose-500">*</span>
              </label>
              <input
                id="review-input-title"
                type="text"
                required
                placeholder="Например: Elden Ring, Silent Hill 2, Hades II..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* 2. Rating (1-10) with slider & quick feedback */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Твоя оценка (1–10)</span>
                </label>
                <span className={`font-display text-base font-bold px-2 py-0.5 rounded-lg border ${
                  isDark 
                    ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' 
                    : 'text-amber-800 bg-amber-50 border-amber-300'
                }`}>
                  {rating} / 10
                </span>
              </div>
              
              <input
                id="review-input-rating"
                type="range"
                min="1"
                max="10"
                step="1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              
              <div className={`flex justify-between text-[10px] px-0.5 mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>1 (Скам/Дроп)</span>
                <span>5 (Нормис)</span>
                <span>8 (Годнота)</span>
                <span>10 (Имба/Шедевр)</span>
              </div>
            </div>

            {/* 3. Short thoughts */}
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Краткие мысли <span className={`font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>(в свободной форме)</span>
              </label>
              <textarea
                id="review-input-thoughts"
                rows={3}
                placeholder="Например: 'Боссы жесткие, но музыка кайф. Прошел за выходные' или 'Душный гринд во второй половине, чуть не бросил'..."
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Meta details: Platform, Hours, Status */}
            <div className={`grid grid-cols-2 gap-3 pt-2 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Платформа
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-slate-200' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="PC">PC (Steam/Epic)</option>
                  <option value="PlayStation">PlayStation 5</option>
                  <option value="Xbox">Xbox Series</option>
                  <option value="Switch">Nintendo Switch</option>
                </select>
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Сыграно часов
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ч.</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-trigger-ai-generate"
              type="submit"
              disabled={isGenerating || !title.trim()}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                isGenerating || !title.trim()
                  ? isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-indigo-500/25 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>AI генерирует карточку...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Сгенерировать AI-карточку</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* RIGHT COLUMN: 2. AI-Обработка & 3. Интерфейс карточки в самом приложении */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* While generating: AI processing showcase */}
          {isGenerating && (
            <div className={`border rounded-2xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden ${
              isDark ? 'bg-slate-900/90 border-indigo-500/40' : 'bg-white border-indigo-200'
            }`}>
              <div className="absolute inset-0 bg-indigo-500/5 animate-pulse pointer-events-none" />
              
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-amber-500 relative">
                <Sparkles className="w-8 h-8 animate-bounce" />
                <div className="absolute -inset-1 rounded-2xl border border-indigo-400/50 animate-ping opacity-30" />
              </div>

              <div>
                <h3 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AI синтезирует вердикт
                </h3>
                <p className="text-xs font-mono text-indigo-500 mt-1">
                  {generationStepText}
                </p>
              </div>

              <div className={`w-48 mx-auto h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full animate-pulse w-3/4 rounded-full" />
              </div>
            </div>
          )}

          {/* Rendered Review Card */}
          {generatedReview && !isGenerating && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Интерфейс карточки обзора
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCard}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
                  </button>
                </div>
              </div>

              {/* The Actual Gamer Showcase Card */}
              <div 
                id="showcase-gamer-card"
                className={`border-2 rounded-2xl overflow-hidden shadow-2xl relative transition-colors ${
                  isDark 
                    ? 'bg-gradient-to-b from-slate-900 via-[#0d1322] to-slate-950 border-indigo-500/40' 
                    : 'bg-white border-indigo-300 shadow-indigo-100'
                }`}
              >
                {/* Decorative glowing top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Card Header: Cover banner with overlay */}
                <div className="relative h-48 sm:h-56 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={coverUrl}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Top tags on cover */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${platformInfo.badgeBg}`}>
                      {platformInfo.label}
                    </span>

                    <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-amber-500/50 px-3 py-1 rounded-full shadow-lg">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-display font-extrabold text-sm text-amber-300">
                        {rating} / 10
                      </span>
                    </div>
                  </div>

                  {/* Game title & played time */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                        {status === 'completed' ? 'Пройдено' : status === 'playing' ? 'В процессе' : status === 'dropped' ? 'Заброшено' : 'Вишлист'}
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                        {title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-white bg-black/60 px-2.5 py-1 rounded-lg border border-white/20 backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>{hours} ч.</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-5">
                  
                  {/* AI Verdict Banner */}
                  <div className={`p-3.5 rounded-xl border relative ${
                    isDark 
                      ? 'bg-indigo-950/40 border-indigo-500/40' 
                      : 'bg-indigo-50 border-indigo-200'
                  }`}>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI-Вердикт</span>
                    </div>
                    <p className={`font-display text-base sm:text-lg font-bold leading-snug ${isDark ? 'text-indigo-100' : 'text-slate-900'}`}>
                      «{generatedReview.verdict}»
                    </p>
                    <div className={`text-[11px] font-mono mt-2 flex items-center gap-2 ${isDark ? 'text-indigo-300/80' : 'text-indigo-700'}`}>
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{generatedReview.gamerScore}</span>
                    </div>
                  </div>

                  {/* Gamer Slang Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {generatedReview.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                          isDark 
                            ? 'bg-slate-800/90 text-indigo-300 border-indigo-500/20' 
                            : 'bg-slate-100 text-indigo-700 border-slate-200'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* User Quote */}
                  {thoughts && (
                    <div className={`p-3 rounded-xl border flex gap-2.5 ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <Quote className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div className={`text-xs italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className={`not-italic font-semibold text-[11px] block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Слова игрока:
                        </span>
                        «{thoughts}»
                      </div>
                    </div>
                  )}

                  {/* Review text body */}
                  <div className={`text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                    isDark ? 'text-slate-300 border-slate-800/80' : 'text-slate-700 border-slate-200'
                  }`}>
                    {generatedReview.reviewBody}
                  </div>

                  {/* Pros & Cons */}
                  {(generatedReview.pros.length > 0 || generatedReview.cons.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {generatedReview.pros.length > 0 && (
                        <div className={`p-3 rounded-xl border space-y-1 ${
                          isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/80 border-emerald-200'
                        }`}>
                          <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Плюсы (База)</span>
                          </div>
                          <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {generatedReview.pros.map((p, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-500">&bull;</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {generatedReview.cons.length > 0 && (
                        <div className={`p-3 rounded-xl border space-y-1 ${
                          isDark ? 'bg-rose-950/20 border-rose-500/20' : 'bg-rose-50/80 border-rose-200'
                        }`}>
                          <div className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Минусы (Духота)</span>
                          </div>
                          <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {generatedReview.cons.map((c, i) => (
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

                </div>

                {/* Card Actions Footer: Save to Shelf & Post to Friends Feed */}
                <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      id="btn-save-to-shelf"
                      onClick={handleSaveToShelf}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        savedSuccess
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : isDark 
                            ? 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700' 
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-xs'
                      }`}
                    >
                      {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                      <span>{savedSuccess ? 'Сохранено на полку!' : 'Сохранить на полку'}</span>
                    </button>

                    <button
                      id="btn-publish-to-feed"
                      onClick={handlePublish}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        publishedSuccess
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
                      }`}
                    >
                      {publishedSuccess ? <Check className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                      <span>{publishedSuccess ? 'Опубликовано в ленте!' : 'В ленту друзей'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      // re-roll cover
                      const keys = Object.keys(PRESET_COVERS);
                      const next = PRESET_COVERS[keys[Math.floor(Math.random() * keys.length)]];
                      setCoverUrl(next);
                    }}
                    className={`text-[11px] transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Сменить арт обложки
                  </button>
                </div>

              </div>

            </div>
          )}

          {!generatedReview && !isGenerating && (
            <div className={`h-full min-h-[380px] flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl text-center space-y-3 ${
              isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-300 bg-slate-50'
            }`}>
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
                isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
              }`}>
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className={`font-display text-base font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Карточка еще не создана
              </h3>
              <p className={`text-xs max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Заполни форму слева и нажми «Сгенерировать AI-карточку». Нейросеть сгенерирует хлёсткий вердикт на геймерском сленге и стилизует экран.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
