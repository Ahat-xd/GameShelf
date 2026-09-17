import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  AtSign, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Dices, 
  Check, 
  Gamepad2, 
  Compass, 
  MessageSquare, 
  Palette,
  Camera,
  Layers,
  Heart
} from 'lucide-react';
import { UserProfile, Platform } from '../types';
import { useTheme } from '../context/ThemeContext';
import { GENRE_PRESETS } from '../data/mockData';

interface EditProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
}

export const AVATAR_PRESETS = [
  {
    name: 'Cyber Samurai',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    tag: 'Cyberpunk'
  },
  {
    name: 'Neon Netrunner',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
    tag: 'Neon'
  },
  {
    name: 'Valkyrie Gamer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tag: 'Pro'
  },
  {
    name: 'Retro Gamer',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    tag: 'Retro'
  },
  {
    name: 'Mech Pilot',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    tag: 'Sci-Fi'
  },
  {
    name: 'Cozy Streamer',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    tag: 'Cozy'
  },
  {
    name: 'Arcade Master',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    tag: 'Arcade'
  },
  {
    name: 'Pixel Mage',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    tag: 'Fantasy'
  },
  {
    name: 'Dark Knight',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tag: 'Souls'
  },
  {
    name: 'Speedrunner',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    tag: 'Fast'
  },
  {
    name: 'Stealth Operative',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    tag: 'Stealth'
  },
  {
    name: 'Esports Captain',
    url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    tag: 'GG'
  }
];

export const TITLE_PRESETS = [
  'Платиновый охотник бэклога',
  'Покоритель соулслайков',
  'Лорд бэклога',
  'Speedrunner 100%',
  'Indie & Roguelike Enjoyer',
  'Скиллчек-машина',
  'Казуальный эстет',
  'Геймер-философ',
  'Хардкорный марафонец',
  'Коллекционер платин',
];

export const BANNER_GRADIENTS = [
  {
    id: 'cyberpunk',
    name: 'Неон Киберпанк',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600'
  },
  {
    id: 'cosmic',
    name: 'Глубокий космос',
    gradient: 'from-slate-900 via-indigo-950 to-slate-900'
  },
  {
    id: 'emerald',
    name: 'Изумрудный матрикс',
    gradient: 'from-emerald-700 via-teal-800 to-slate-900'
  },
  {
    id: 'solar',
    name: 'Солнечная вспышка',
    gradient: 'from-amber-600 via-orange-600 to-rose-700'
  },
  {
    id: 'synthwave',
    name: 'Синтвейв закат',
    gradient: 'from-fuchsia-600 via-pink-600 to-rose-500'
  },
  {
    id: 'ocean',
    name: 'Океаническая бездна',
    gradient: 'from-cyan-700 via-blue-800 to-indigo-950'
  }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const { isDark } = useTheme();

  // Form State
  const [name, setName] = useState(user.name);
  const [tag, setTag] = useState(user.tag);
  const [avatar, setAvatar] = useState(user.avatar);
  const [title, setTitle] = useState(user.title);
  const [bio, setBio] = useState(user.bio);
  const [favoritePlatform, setFavoritePlatform] = useState<Platform | ''>(user.favoritePlatform || 'PC');
  const [favoriteGenre, setFavoriteGenre] = useState<string>(user.favoriteGenre || 'Action RPG / Souls');
  const [discordTag, setDiscordTag] = useState(user.discordTag || '');
  const [telegramTag, setTelegramTag] = useState(user.telegramTag || '');
  const [bannerGradient, setBannerGradient] = useState<string>(user.bannerGradient || 'from-indigo-600 via-purple-600 to-pink-600');
  
  // UI Tabs & Modes
  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'style'>('info');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      alert('Размер файла не должен превышать 6 МБ');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRandomizeAvatar = () => {
    const random = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
    setAvatar(random.url);
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setCustomAvatarUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Ensure tag starts with @
    let formattedTag = tag.trim();
    if (!formattedTag.startsWith('@')) {
      formattedTag = `@${formattedTag}`;
    }

    onSave({
      ...user,
      name: name.trim(),
      tag: formattedTag,
      avatar: avatar.trim() || user.avatar,
      title: title.trim(),
      bio: bio.trim(),
      favoritePlatform: (favoritePlatform as Platform) || undefined,
      favoriteGenre: favoriteGenre || undefined,
      discordTag: discordTag.trim() || undefined,
      telegramTag: telegramTag.trim() || undefined,
      bannerGradient,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-8 ${
          isDark 
            ? 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-black/80' 
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/80'
        }`}
      >
        {/* Dynamic Header with Selected Banner Gradient */}
        <div className={`h-28 sm:h-32 bg-gradient-to-r ${bannerGradient} p-6 relative flex items-end justify-between overflow-hidden transition-all duration-300`}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          
          <div className="relative z-10 flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white drop-shadow-md">
                Редактирование профиля
              </h2>
              <p className="text-xs text-white/90 font-medium">
                Настройте свой геймерский никнейм, аватарку и статус
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="relative z-10 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white/90 hover:text-white transition-colors border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={avatar}
                alt="Предпросмотр"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=256&q=80';
                }}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-[9px] rounded-md shadow-xs border border-amber-300">
                LVL {user.level}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm truncate">
                  {name || 'Ваш никнейм'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {tag.startsWith('@') ? tag : `@${tag}`}
                </span>
              </div>
              <p className="text-xs text-indigo-400 font-medium truncate">
                {title || 'Титул не указан'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomizeAvatar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 flex-shrink-0 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
            title="Выбрать случайный аватар"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Рандом аватар</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className={`flex border-b px-6 ${
          isDark ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-200 bg-white'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'info'
                ? 'border-indigo-500 text-indigo-500'
                : isDark
                  ? 'border-transparent text-slate-400 hover:text-slate-200'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Основное и статус</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'avatar'
                ? 'border-indigo-500 text-indigo-500'
                : isDark
                  ? 'border-transparent text-slate-400 hover:text-slate-200'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Аватарка</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'style'
                ? 'border-indigo-500 text-indigo-500'
                : isDark
                  ? 'border-transparent text-slate-400 hover:text-slate-200'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Баннер и вкусы</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Nickname & Tag Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Никнейм игрока *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: CyberNinja"
                    maxLength={32}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isDark
                        ? 'bg-slate-900 border-slate-750 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Геймерский тег *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="@samurai_play"
                    maxLength={24}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isDark
                        ? 'bg-slate-900 border-slate-750 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Title / Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Геймерский титул / звание</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Отображается в профиле</span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Платиновый охотник бэклога"
                  maxLength={50}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDark
                      ? 'bg-slate-900 border-slate-750 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />

                {/* Quick Title Presets */}
                <div className="pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Быстрый выбор звания:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TITLE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTitle(preset)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          title === preset
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                            : isDark
                              ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio / About */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span>О себе (Bio)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {bio.length} / 250
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={250}
                  placeholder="Расскажите о своих любимых играх, жанрах или платформе..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDark
                      ? 'bg-slate-900 border-slate-750 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

            </div>
          )}

          {/* TAB 2: AVATAR MANAGEMENT */}
          {activeTab === 'avatar' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Drag and Drop Box & Upload */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-500/10 scale-102'
                    : isDark
                      ? 'border-slate-750 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-500 hover:underline">
                      Загрузите файл с устройства
                    </span>
                    <span className="text-xs text-slate-400"> или перетащите картинку сюда</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Поддерживаются PNG, JPG, GIF, WebP (до 6 МБ)
                  </p>
                </div>
              </div>

              {/* Direct URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Или вставьте прямую ссылку на аватарку (URL)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isDark
                        ? 'bg-slate-900 border-slate-750 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    disabled={!customAvatarUrl.trim()}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Применить
                  </button>
                </div>
              </div>

              {/* Preset Avatars Gallery */}
              <div className="space-y-2 pt-2 border-t border-slate-700/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Готовые геймерские аватары ({AVATAR_PRESETS.length}):
                  </label>
                  <span className="text-[10px] text-slate-500">Кликните для выбора</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {AVATAR_PRESETS.map((preset, index) => {
                    const isSelected = avatar === preset.url;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all active:scale-95 ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105 shadow-lg'
                            : isDark
                              ? 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                              : 'border-slate-200 hover:border-slate-300 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white stroke-[3] drop-shadow-md" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 right-1 px-1 py-0.2 bg-black/75 backdrop-blur-xs text-[9px] font-semibold text-white rounded text-center truncate">
                          {preset.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BANNER & GAMER TASTES */}
          {activeTab === 'style' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Banner Gradients */}
              <div className="space-y-2">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Градиент шапки профиля:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BANNER_GRADIENTS.map((b) => {
                    const isSelected = bannerGradient === b.gradient;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBannerGradient(b.gradient)}
                        className={`h-14 rounded-xl bg-gradient-to-r ${b.gradient} p-2 flex flex-col justify-end text-left border-2 transition-all relative group active:scale-98 ${
                          isSelected
                            ? 'border-white ring-2 ring-indigo-500 shadow-lg scale-102'
                            : 'border-transparent opacity-80 hover:opacity-100 hover:scale-101'
                        }`}
                      >
                        <span className="text-[11px] font-bold text-white drop-shadow-md flex items-center justify-between">
                          {b.name}
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Favorite Platform & Favorite Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700/40">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Основная платформа:</span>
                  </label>
                  <select
                    value={favoritePlatform}
                    onChange={(e) => setFavoritePlatform(e.target.value as Platform)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isDark
                        ? 'bg-slate-900 border-slate-750 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="PC">PC (Steam / EGS)</option>
                    <option value="PlayStation">PlayStation 5</option>
                    <option value="Xbox">Xbox Series X|S</option>
                    <option value="Switch">Nintendo Switch</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Любимый жанр:</span>
                  </label>
                  <select
                    value={favoriteGenre}
                    onChange={(e) => setFavoriteGenre(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isDark
                        ? 'bg-slate-900 border-slate-750 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    {GENRE_PRESETS.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Social Contacts */}
              <div className="space-y-2 pt-2 border-t border-slate-700/40">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Контакты для коопа и тиммейтов (необязательно):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    placeholder="Discord (например: samurai#1234)"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isDark
                        ? 'bg-slate-900 border-slate-750 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={telegramTag}
                    onChange={(e) => setTelegramTag(e.target.value)}
                    placeholder="Telegram (например: @samurai_gg)"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      isDark
                        ? 'bg-slate-900 border-slate-750 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className={`pt-4 border-t flex items-center justify-end gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? 'border-slate-750 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Отмена
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Сохранить профиль</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
