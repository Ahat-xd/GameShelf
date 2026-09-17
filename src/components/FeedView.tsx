import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Star, 
  Send, 
  Flame, 
  Sparkles, 
  Clock, 
  Quote, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Filter
} from 'lucide-react';
import { FriendPost, ReactionType, UserProfile } from '../types';
import { PLATFORM_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface FeedViewProps {
  posts: FriendPost[];
  currentUser: UserProfile;
  onToggleReaction: (postId: string, reaction: ReactionType) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenCreateReview: () => void;
}


const REACTION_CONFIG: Record<ReactionType, { label: string; icon: string; bgActive: string; textActive: string; borderActive: string }> = {
  gg: {
    label: 'GG',
    icon: '🏆',
    bgActive: 'bg-amber-500/20',
    textActive: 'text-amber-300',
    borderActive: 'border-amber-500/50'
  },
  clutch: {
    label: 'Clutch',
    icon: '🔥',
    bgActive: 'bg-orange-500/20',
    textActive: 'text-orange-300',
    borderActive: 'border-orange-500/50'
  },
  cry: {
    label: 'Cry',
    icon: '😭',
    bgActive: 'bg-sky-500/20',
    textActive: 'text-sky-300',
    borderActive: 'border-sky-500/50'
  },
  drop: {
    label: 'Drop',
    icon: '💀',
    bgActive: 'bg-rose-500/20',
    textActive: 'text-rose-300',
    borderActive: 'border-rose-500/50'
  },
};

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  onToggleReaction,
  onAddComment,
  onOpenCreateReview,
}) => {
  const { isDark } = useTheme();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [feedFilter, setFeedFilter] = useState<'all' | 'friends' | 'my'>('all');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-1': true,
  });

  const handleCommentSubmit = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const filteredPosts = posts.filter((p) => {
    if (feedFilter === 'my') {
      return p.authorName === currentUser.name;
    }
    if (feedFilter === 'friends') {
      return p.authorName !== currentUser.name;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Feed Top Header */}
      <div className={`rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800/80' 
          : 'bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white border-indigo-100 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg border ${
              isDark 
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                : 'bg-indigo-100 text-indigo-600 border-indigo-200'
            }`}>
              <Users className="w-5 h-5" />
            </span>
            <h1 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Социальная лента друзей
            </h1>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Свежие вердикты, пройденные игры и стикеры-реакции от твоих подписок.
          </p>
        </div>

        <button
          onClick={onOpenCreateReview}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Поделиться карточкой</span>
        </button>
      </div>

      {/* Feed Filter Tabs */}
      <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <button
          onClick={() => setFeedFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            feedFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : isDark
                ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Все обзоры ({posts.length})
        </button>

        <button
          onClick={() => setFeedFilter('friends')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            feedFilter === 'friends'
              ? 'bg-indigo-600 text-white'
              : isDark
                ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Только друзья
        </button>

        <button
          onClick={() => setFeedFilter('my')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            feedFilter === 'my'
              ? 'bg-indigo-600 text-white'
              : isDark
                ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Мои карточки
        </button>
      </div>

      {/* Stream of Posts */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className={`text-center py-16 px-4 border border-dashed rounded-2xl ${
            isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-300 bg-slate-50'
          }`}>
            <Users className="w-10 h-10 mx-auto text-slate-400 mb-3 opacity-60" />
            <h3 className={`font-display text-base font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              В этой вкладке пока пусто
            </h3>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Опубликуй свою первую карточку обзора или переключись на общий поток друзей.
            </p>
            <button
              onClick={onOpenCreateReview}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all"
            >
              Сгенерировать AI-обзор
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const platformInfo = PLATFORM_INFO[post.platform] || PLATFORM_INFO.PC;
            const isCommentsOpen = Boolean(expandedComments[post.id]);

            return (
              <article
                key={post.id}
                id={`feed-post-${post.id}`}
                className={`rounded-2xl overflow-hidden shadow-xl transition-all border ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Author Bar */}
                <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
                  isDark ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {post.authorName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {post.authorTag}
                        </span>
                      </div>
                      <div className={`text-[11px] flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{post.createdAt}</span>
                        <span>&bull;</span>
                        <span className="text-indigo-500 font-medium">
                          {post.status === 'completed' ? 'прошел игру' : post.status === 'dropped' ? 'забросил' : 'проходит сейчас'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${platformInfo.badgeBg}`}>
                    {platformInfo.label}
                  </span>
                </div>

                {/* Post Main Card Presentation */}
                <div className="p-4 sm:p-6 space-y-4">
                  
                  {/* Game Info Bar */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-950/70 border-slate-800' 
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={post.gameCover}
                        alt={post.gameTitle}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <h3 className={`font-display text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {post.gameTitle}
                        </h3>
                        <div className={`flex items-center gap-3 text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-sky-500" />
                            {post.hours} ч.
                          </span>
                          <span>&bull;</span>
                          <span>
                            Статус: <strong className={isDark ? 'text-indigo-300' : 'text-indigo-600'}>
                              {post.status === 'completed' ? 'Пройдено' : post.status === 'dropped' ? 'Drop' : 'В процессе'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-display font-extrabold text-sm text-amber-500">
                        {post.rating} / 10
                      </span>
                    </div>
                  </div>

                  {/* AI Verdict Box with gamer slang */}
                  <div className={`p-4 rounded-xl border relative ${
                    isDark 
                      ? 'bg-indigo-950/30 border-indigo-500/30' 
                      : 'bg-indigo-50/70 border-indigo-200'
                  }`}>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI-Вердикт обзора</span>
                    </div>
                    <p className={`font-display text-base font-bold leading-snug ${
                      isDark ? 'text-indigo-100' : 'text-indigo-950'
                    }`}>
                      «{post.aiReview.verdict}»
                    </p>
                    <div className={`text-[11px] font-mono mt-2 flex items-center gap-2 ${
                      isDark ? 'text-indigo-300/80' : 'text-indigo-700'
                    }`}>
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{post.aiReview.gamerScore}</span>
                    </div>
                  </div>

                  {/* User Quote */}
                  {post.userThoughts && (
                    <div className={`p-3 rounded-xl border flex gap-2.5 ${
                      isDark 
                        ? 'bg-slate-950/40 border-slate-800/80' 
                        : 'bg-slate-50 border-slate-100'
                    }`}>
                      <Quote className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className={`text-xs sm:text-sm italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        «{post.userThoughts}»
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.aiReview.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                          isDark 
                            ? 'bg-slate-800/80 text-indigo-300 border-indigo-500/20' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Review Text Body */}
                  <p className={`text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                    isDark 
                      ? 'text-slate-300 border-slate-800/80' 
                      : 'text-slate-700 border-slate-100'
                  }`}>
                    {post.aiReview.reviewBody}
                  </p>

                </div>

                {/* 4 Gamer Reactions Bar: GG, Clutch, Cry, Drop */}
                <div className={`px-4 sm:px-6 py-3 border-t flex flex-wrap items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  
                  <div className="flex items-center gap-2">
                    {(['gg', 'clutch', 'cry', 'drop'] as const).map((rKey) => {
                      const cfg = REACTION_CONFIG[rKey];
                      const isReacted = post.userReactions[rKey];
                      const count = post.reactions[rKey];

                      return (
                        <button
                          key={rKey}
                          id={`react-${rKey}-${post.id}`}
                          onClick={() => onToggleReaction(post.id, rKey)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all active:scale-95 select-none ${
                            isReacted
                              ? `${cfg.bgActive} ${cfg.textActive} ${cfg.borderActive} shadow-sm shadow-indigo-900/30 scale-105`
                              : isDark
                                ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 shadow-xs'
                          }`}
                        >
                          <span className="text-sm leading-none">{cfg.icon}</span>
                          <span>{cfg.label}</span>
                          <span className="text-[11px] opacity-80">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Toggle comments count button */}
                  <button
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments.length} комментариев</span>
                  </button>

                </div>

                {/* Comments Section */}
                {isCommentsOpen && (
                  <div className={`p-4 sm:p-6 border-t space-y-4 ${
                    isDark ? 'bg-slate-950/95 border-slate-800/80' : 'bg-slate-50/70 border-slate-100'
                  }`}>
                    
                    {/* Comments List */}
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-400 flex-shrink-0 mt-0.5"
                          />
                          <div className={`flex-1 p-2.5 rounded-xl border ${
                            isDark 
                              ? 'bg-slate-900/80 border-slate-800/80' 
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                {comment.author}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {comment.createdAt}
                              </span>
                            </div>
                            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* New comment input */}
                    <div className={`flex items-center gap-2 pt-2 border-t ${
                      isDark ? 'border-slate-800/60' : 'border-slate-200'
                    }`}>
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500 flex-shrink-0"
                      />
                      <input
                        type="text"
                        placeholder="Оставить комментарий в треде..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                        className={`flex-1 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 border ${
                          isDark 
                            ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        disabled={!(commentInputs[post.id] || '').trim()}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                )}

              </article>
            );
          })
        )}
      </div>

    </div>
  );
};
