export type ShelfStatus = 'playing' | 'completed' | 'dropped' | 'wishlist';

export type Platform = 'PC' | 'PlayStation' | 'Xbox' | 'Switch';

export type ReactionType = 'gg' | 'clutch' | 'cry' | 'drop';

export type Theme = 'dark' | 'light';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface ReviewCard {
  verdict: string;
  tags: string[];
  pros: string[];
  cons: string[];
  gamerScore: string;
  reviewBody: string;
}

export interface Game {
  id: string;
  title: string;
  status: ShelfStatus;
  platform: Platform;
  hours: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  rating?: number; // 1-10
  userThoughts?: string;
  aiReview?: ReviewCard;
  coverUrl: string;
  genre: string;
  completedAt?: string;
  addedAt: string;
  isFavorite?: boolean;
}

export interface FriendPost {
  id: string;
  authorName: string;
  authorTag: string;
  authorAvatar: string;
  gameTitle: string;
  gameCover: string;
  platform: Platform;
  status: ShelfStatus;
  hours: number;
  rating: number;
  userThoughts: string;
  aiReview: ReviewCard;
  reactions: Record<ReactionType, number>;
  userReactions: Record<ReactionType, boolean>;
  comments: Comment[];
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  maxProgress: number;
  rewardExp: number;
}

export interface UserProfile {
  name: string;
  tag: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  title: string;
  bio: string;
  monthlyStats: {
    monthName: string;
    completedGames: number;
    hoursPlayed: number;
    topGenre: string;
    averageRating: number;
    achievementsUnlocked: number;
  };
}

export interface RecommendationItem {
  id: string;
  title: string;
  genre: string;
  platform: string;
  matchScore: number;
  type: 'из бэклога' | 'новинка' | 'скрытый шедевр' | 'таймкиллер' | 'скиллчек';
  reason: string;
  hoursToBeat: number;
  vibe: string;
  coverUrl?: string;
}
