import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ShelfView } from './components/ShelfView';
import { AIReviewGenerator } from './components/AIReviewGenerator';
import { ReviewCardModal } from './components/ReviewCardModal';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { RecommendationsView } from './components/RecommendationsView';
import { AddGameModal } from './components/AddGameModal';
import { useTheme } from './context/ThemeContext';

import { 
  Game, 
  FriendPost, 
  AchievementBadge, 
  UserProfile, 
  ShelfStatus, 
  Platform, 
  ReviewCard, 
  ReactionType, 
  RecommendationItem 
} from './types';

import { 
  INITIAL_GAMES, 
  INITIAL_FRIEND_POSTS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_USER_PROFILE 
} from './data/mockData';

export default function App() {
  const { isDark } = useTheme();
  // 1. Core State with Local Storage persistence
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem('gameshelf_games');
      return saved ? JSON.parse(saved) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  const [posts, setPosts] = useState<FriendPost[]>(() => {
    try {
      const saved = localStorage.getItem('gameshelf_posts');
      return saved ? JSON.parse(saved) : INITIAL_FRIEND_POSTS;
    } catch {
      return INITIAL_FRIEND_POSTS;
    }
  });

  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    try {
      const saved = localStorage.getItem('gameshelf_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('gameshelf_user');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // Navigation and Modals State
  const [currentTab, setCurrentTab] = useState<'shelf' | 'review-gen' | 'feed' | 'recommendations' | 'profile'>('shelf');
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [selectedGameForCard, setSelectedGameForCard] = useState<Game | null>(null);
  const [selectedGameForReview, setSelectedGameForReview] = useState<Game | undefined>(undefined);

  // Sync with Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('gameshelf_games', JSON.stringify(games));
    } catch (e) {
      console.error(e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem('gameshelf_posts', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('gameshelf_achievements', JSON.stringify(achievements));
    } catch (e) {
      console.error(e);
    }
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem('gameshelf_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Award XP helper
  const awardXp = (amount: number) => {
    setUser((prev) => {
      let newXp = prev.xp + amount;
      let newLvl = prev.level;
      let nextThreshold = prev.nextLevelXp;

      while (newXp >= nextThreshold) {
        newXp -= nextThreshold;
        newLvl += 1;
        nextThreshold = Math.round(nextThreshold * 1.25);
      }

      return {
        ...prev,
        level: newLvl,
        xp: newXp,
        nextLevelXp: nextThreshold,
      };
    });
  };

  // Check and update achievements
  const checkAchievements = (newGames: Game[], newPosts: FriendPost[]) => {
    setAchievements((prev) => {
      return prev.map((ach) => {
        let current = ach.currentProgress;
        let unlocked = ach.unlocked;

        if (ach.id === 'ach-2') {
          // Бэклог-киллер (5+ completed)
          current = newGames.filter((g) => g.status === 'completed').length;
        } else if (ach.id === 'ach-3') {
          // Имба-критик (3+ reviews)
          current = newGames.filter((g) => Boolean(g.aiReview)).length;
        } else if (ach.id === 'ach-5') {
          // Мультиплатформенщик (unique platforms)
          const plats = new Set(newGames.map((g) => g.platform));
          current = plats.size;
        } else if (ach.id === 'ach-6') {
          // 150 hours
          current = newGames.reduce((acc, g) => acc + (g.hours || 0), 0);
        }

        if (current >= ach.maxProgress && !unlocked) {
          unlocked = true;
          awardXp(ach.rewardExp);
        }

        return {
          ...ach,
          currentProgress: current,
          unlocked,
          unlockedAt: unlocked && !ach.unlockedAt ? new Date().toLocaleDateString('ru-RU') : ach.unlockedAt,
        };
      });
    });
  };

  // 1. Add Game to Shelf
  const handleAddGame = (gameData: Omit<Game, 'id' | 'addedAt'>) => {
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newGame, ...games];
    setGames(updated);
    awardXp(150);
    checkAchievements(updated, posts);
  };

  // 2. Update Status
  const handleUpdateGameStatus = (gameId: string, status: ShelfStatus) => {
    const updated = games.map((g) => {
      if (g.id === gameId) {
        return {
          ...g,
          status,
          completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : g.completedAt,
        };
      }
      return g;
    });
    setGames(updated);
    if (status === 'completed') {
      awardXp(250);
    }
    checkAchievements(updated, posts);
  };

  // 3. Update Hours
  const handleUpdateGameHours = (gameId: string, hours: number) => {
    const updated = games.map((g) => (g.id === gameId ? { ...g, hours } : g));
    setGames(updated);
    checkAchievements(updated, posts);
  };

  // 4. Delete Game
  const handleDeleteGame = (gameId: string) => {
    const updated = games.filter((g) => g.id !== gameId);
    setGames(updated);
    checkAchievements(updated, posts);
  };

  // 5. Save AI Review to Game
  const handleSaveReviewToGame = (data: {
    title: string;
    platform: Platform;
    status: ShelfStatus;
    hours: number;
    rating: number;
    thoughts: string;
    review: ReviewCard;
    coverUrl?: string;
  }) => {
    const existingIndex = games.findIndex((g) => g.title.toLowerCase() === data.title.toLowerCase());
    let updated: Game[];

    if (existingIndex >= 0) {
      updated = [...games];
      updated[existingIndex] = {
        ...updated[existingIndex],
        platform: data.platform,
        status: data.status,
        hours: data.hours,
        rating: data.rating,
        userThoughts: data.thoughts,
        aiReview: data.review,
        coverUrl: data.coverUrl || updated[existingIndex].coverUrl,
      };
    } else {
      const newGame: Game = {
        id: `game-${Date.now()}`,
        title: data.title,
        platform: data.platform,
        status: data.status,
        hours: data.hours,
        achievementsUnlocked: 0,
        achievementsTotal: 0,
        rating: data.rating,
        userThoughts: data.thoughts,
        aiReview: data.review,
        coverUrl: data.coverUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        genre: 'Action / Adventure',
        addedAt: new Date().toISOString().split('T')[0],
      };
      updated = [newGame, ...games];
    }

    setGames(updated);
    awardXp(300);
    checkAchievements(updated, posts);
  };

  // 6. Publish to Friends Feed
  const handlePublishToFeed = (data: {
    gameTitle: string;
    platform: Platform;
    status: ShelfStatus;
    hours: number;
    rating: number;
    userThoughts: string;
    aiReview: ReviewCard;
    gameCover: string;
  }) => {
    const newPost: FriendPost = {
      id: `post-${Date.now()}`,
      authorName: user.name,
      authorTag: user.tag,
      authorAvatar: user.avatar,
      gameTitle: data.gameTitle,
      gameCover: data.gameCover,
      platform: data.platform,
      status: data.status,
      hours: data.hours,
      rating: data.rating,
      userThoughts: data.userThoughts,
      aiReview: data.aiReview,
      reactions: { gg: 1, clutch: 0, cry: 0, drop: 0 },
      userReactions: { gg: true, clutch: false, cry: false, drop: false },
      comments: [],
      createdAt: 'Только что',
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    awardXp(200);

    // Also check if game is on shelf, if not add it
    const existing = games.find((g) => g.title.toLowerCase() === data.gameTitle.toLowerCase());
    if (!existing) {
      handleSaveReviewToGame({
        title: data.gameTitle,
        platform: data.platform,
        status: data.status,
        hours: data.hours,
        rating: data.rating,
        thoughts: data.userThoughts,
        review: data.aiReview,
        coverUrl: data.gameCover,
      });
    }
  };

  // 7. Toggle Reaction on Feed Post
  const handleToggleReaction = (postId: string, reactionKey: ReactionType) => {
    setPosts((prev) => {
      return prev.map((post) => {
        if (post.id !== postId) return post;
        const currentActive = post.userReactions[reactionKey];
        const newReactions = { ...post.reactions };
        const newUserReactions = { ...post.userReactions };

        if (currentActive) {
          newReactions[reactionKey] = Math.max(0, newReactions[reactionKey] - 1);
          newUserReactions[reactionKey] = false;
        } else {
          newReactions[reactionKey] = (newReactions[reactionKey] || 0) + 1;
          newUserReactions[reactionKey] = true;
          awardXp(15);
        }

        return {
          ...post,
          reactions: newReactions,
          userReactions: newUserReactions,
        };
      });
    });

    // Update GG-Machine progress
    setAchievements((prev) => {
      return prev.map((a) => {
        if (a.id === 'ach-4') {
          const nextVal = a.currentProgress + 1;
          const unlocked = nextVal >= a.maxProgress;
          return {
            ...a,
            currentProgress: nextVal,
            unlocked: unlocked || a.unlocked,
            unlockedAt: unlocked && !a.unlockedAt ? new Date().toLocaleDateString('ru-RU') : a.unlockedAt,
          };
        }
        return a;
      });
    });
  };

  // 8. Add Comment to Post
  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) => {
      return prev.map((post) => {
        if (post.id !== postId) return post;
        const newComment = {
          id: `comment-${Date.now()}`,
          author: user.name,
          avatar: user.avatar,
          text,
          createdAt: 'Только что',
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      });
    });
    awardXp(25);
  };

  // 9. Add Recommended Game to Shelf
  const handleAddRecommendedGameToShelf = (rec: RecommendationItem, status: ShelfStatus) => {
    const newGame: Game = {
      id: `game-rec-${Date.now()}`,
      title: rec.title,
      platform: (rec.platform.split(',')[0].trim() as Platform) || 'PC',
      status,
      hours: 0,
      achievementsUnlocked: 0,
      achievementsTotal: 0,
      genre: rec.genre,
      coverUrl: rec.coverUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      addedAt: new Date().toISOString().split('T')[0],
      userThoughts: `Добавлено из AI-подбора: ${rec.reason}`,
    };
    const updated = [newGame, ...games];
    setGames(updated);
    awardXp(100);
    checkAchievements(updated, posts);
  };

  // Open generator for specific game
  const handleOpenGeneratorForGame = (game?: Game) => {
    setSelectedGameForReview(game);
    setCurrentTab('review-gen');
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
      isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onOpenAddGame={() => setIsAddGameOpen(true)}
        totalGamesCount={games.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: Shelf (Backlog & Diary) */}
        {currentTab === 'shelf' && (
          <ShelfView
            games={games}
            onOpenAddGame={() => setIsAddGameOpen(true)}
            onOpenAIReviewForm={handleOpenGeneratorForGame}
            onViewReviewCard={(game) => setSelectedGameForCard(game)}
            onUpdateGameStatus={handleUpdateGameStatus}
            onUpdateGameHours={handleUpdateGameHours}
            onDeleteGame={handleDeleteGame}
          />
        )}

        {/* TAB 2: AI Review Generator (Screen 2: Форма быстрых впечатлений, AI-Обработка, Карточка) */}
        {currentTab === 'review-gen' && (
          <AIReviewGenerator
            initialGame={selectedGameForReview}
            onSaveReviewToGame={handleSaveReviewToGame}
            onPublishToFeed={handlePublishToFeed}
            onBackToShelf={() => {
              setSelectedGameForReview(undefined);
              setCurrentTab('shelf');
            }}
          />
        )}

        {/* TAB 3: Friends Feed (Screen 3: Социальная лента, GG/Clutch/Cry/Drop реакции, комменты) */}
        {currentTab === 'feed' && (
          <FeedView
            posts={posts}
            currentUser={user}
            onToggleReaction={handleToggleReaction}
            onAddComment={handleAddComment}
            onOpenCreateReview={() => setCurrentTab('review-gen')}
          />
        )}

        {/* TAB 4: Smart AI Recommendations (Screen 4: Умный подбор из бэклога и новинок) */}
        {currentTab === 'recommendations' && (
          <RecommendationsView
            games={games}
            onAddRecommendedGameToShelf={handleAddRecommendedGameToShelf}
          />
        )}

        {/* TAB 5: Profile & Gamification (Screen 3b: Месячная статистика и система ачивок) */}
        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            achievements={achievements}
            games={games}
            onOpenCreateReview={() => setCurrentTab('review-gen')}
          />
        )}

      </main>

      {/* MODAL: Full Review Card View */}
      {selectedGameForCard && (
        <ReviewCardModal
          game={selectedGameForCard}
          onClose={() => setSelectedGameForCard(null)}
          onPublishToFeed={(game) => {
            if (game.aiReview) {
              handlePublishToFeed({
                gameTitle: game.title,
                platform: game.platform,
                status: game.status,
                hours: game.hours,
                rating: game.rating || 8,
                userThoughts: game.userThoughts || '',
                aiReview: game.aiReview,
                gameCover: game.coverUrl,
              });
            }
          }}
        />
      )}

      {/* MODAL: Add Game to Shelf */}
      {isAddGameOpen && (
        <AddGameModal
          onClose={() => setIsAddGameOpen(false)}
          onSave={handleAddGame}
          onOpenAIGeneratorForTitle={(title, rating, thoughts, platform, hours) => {
            setSelectedGameForReview({
              id: 'temp',
              title,
              rating,
              userThoughts: thoughts,
              platform,
              hours,
              status: 'completed',
              achievementsUnlocked: 0,
              achievementsTotal: 0,
              genre: 'RPG / Action',
              coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
              addedAt: new Date().toISOString().split('T')[0],
            });
            setCurrentTab('review-gen');
          }}
        />
      )}

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs transition-colors duration-200 ${
        isDark 
          ? 'border-slate-850 bg-slate-950/60 text-slate-500' 
          : 'border-slate-200 bg-white/80 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GameShelf &bull; Виртуальная полка и AI-дневник геймера</span>
          <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>
            Поддерживает PC &bull; PlayStation &bull; Xbox &bull; Switch &bull; AI Gemini
          </span>
        </div>
      </footer>

    </div>
  );
}
