import { Game, FriendPost, AchievementBadge, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'LootGoblin',
  tag: '@lootgoblin_99',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=256&q=80',
  level: 14,
  xp: 4250,
  nextLevelXp: 5000,
  title: 'Платиновый охотник бэклога',
  bio: 'Закрываю долги с 2018 года. Люблю соулслайки, иммерсив-симы и пиксельные рогалики без лишней духоты.',
  monthlyStats: {
    monthName: 'Сентябрь 2026',
    completedGames: 4,
    hoursPlayed: 68,
    topGenre: 'Action / RPG',
    averageRating: 8.8,
    achievementsUnlocked: 47,
  },
};

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Elden Ring: Shadow of the Erdtree',
    status: 'playing',
    platform: 'PC',
    hours: 58,
    achievementsUnlocked: 34,
    achievementsTotal: 42,
    rating: 10,
    userThoughts: 'Каждый угол карты — шедевр левелдизайна. Мессмер вытряс из меня всю душу, но победа того стоила.',
    genre: 'Action RPG / Souls',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-08-15',
    isFavorite: true,
    aiReview: {
      verdict: 'Абсолютная база и ультимативный скиллчек: Миядзаки снова переизобрел шедевр.',
      tags: ['#База', '#Имба', '#Соулслайк', '#СкиллЧек', '#GOTY'],
      pros: ['Неземной визуал и атмосфера', 'Боссфайты на кончиках пальцев', 'Исследование мира без маркеров'],
      cons: ['Сложность некоторых боссов граничит с тильтом'],
      gamerScore: 'Вайб: 10/10 | Уровень тильта: 9/10 (Но оно того стоит)',
      reviewBody: 'Игра, ради которой берут отпуск. Пейсинг плотнейший: только выдохнул после жесткого данжа — и тебя снова встречает эпический босс под хоровой саундтрек. Каждая победа дарит чистый дофаминовый взрыв.'
    }
  },
  {
    id: 'game-2',
    title: 'Cyberpunk 2077: Phantom Liberty',
    status: 'completed',
    platform: 'PlayStation',
    hours: 84,
    achievementsUnlocked: 50,
    achievementsTotal: 50,
    rating: 9,
    userThoughts: 'Догтаун великолепен. Сюжетка Сойки и Рида держит в напряжении до самого финала. Выбил платину!',
    genre: 'RPG / Cyberpunk',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    completedAt: '2026-09-02',
    addedAt: '2026-07-10',
    isFavorite: true,
    aiReview: {
      verdict: 'Идеальный шпионский триллер в неоновом аду: CDPR закрыли гештальт с триумфом.',
      tags: ['#Имба', '#Платина', '#Киберпанк', '#Кино', '#СаундрекОгонь'],
      pros: ['Кинематографичность каждого диалога', 'Идрис Эльба в роли Рида тащит', 'Стрельба и импланты ощущаются сочно'],
      cons: ['В финале моральный выбор оставляет пустоту в душе'],
      gamerScore: 'Вайб: 9.8/10 | Уровень драмы: 10/10',
      reviewBody: 'Редчайший случай, когда дополнение ощущается мощнее многих полноценных релизов. Графика на PS5 в режиме производительности стабильна, а финал врезается в память на месяцы.'
    }
  },
  {
    id: 'game-3',
    title: 'Starfield',
    status: 'dropped',
    platform: 'Xbox',
    hours: 14,
    achievementsUnlocked: 8,
    achievementsTotal: 50,
    rating: 4,
    userThoughts: 'Устал от экранов загрузки и пустых планет. Геймплей застрял в 2011 году, дропнул на середине.',
    genre: 'Sci-Fi RPG',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-08-01',
    aiReview: {
      verdict: 'Душнейший симулятор загрузок и фаст-тревела: бэклог не резиновый, дропаем!',
      tags: ['#Дроп', '#Душнота', '#Скип', '#СкамНаВремя', '#Bethesda2011'],
      pros: ['Симпатичный конструктор кораблей'],
      cons: ['Экраны загрузки каждые две минуты', 'Бездушные процедурные планеты', 'Унылый ганплей'],
      gamerScore: 'Вайб: 3.5/10 | Уровень духоты: 9/10',
      reviewBody: 'Игра, которая не уважает время игрока. Вместо романтики исследования космоса мы получили клики по меню и пробежки по пустым копипастным аванпостам. Лучше перепройти Mass Effect.'
    }
  },
  {
    id: 'game-4',
    title: 'Hades II',
    status: 'playing',
    platform: 'PC',
    hours: 26,
    achievementsUnlocked: 21,
    achievementsTotal: 38,
    rating: 9,
    userThoughts: 'Мелиноя двигается еще грациознее Загрея. Магия, ведьмовские котлы и саундтрек Косибы — чистое золото.',
    genre: 'Roguelike / Action',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-09-08',
    aiReview: {
      verdict: 'Крепчайшая имба и новый эталон жанра: Supergiant Games снова выдали базу.',
      tags: ['#Имба', '#Рогалик', '#OSTПушка', '#MustPlay', '#Реиграбельность'],
      pros: ['Фантастический визуал и анимации', 'Вариативность билдов', 'Шикарная озвучка богов'],
      cons: ['Пока еще дорабатывается баланс раннего доступа'],
      gamerScore: 'Вайб: 10/10 | Залипание: 100/10',
      reviewBody: 'Идеальная игра для сессий "еще один забег и точно спать" (а потом за окном рассвет). Геймлуп выверен до миллисекунды, а новые механики заклинаний освежают привычную формулу.'
    }
  },
  {
    id: 'game-5',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    status: 'wishlist',
    platform: 'Switch',
    hours: 0,
    achievementsUnlocked: 0,
    achievementsTotal: 0,
    genre: 'Adventure / Sandbox',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-09-10',
    userThoughts: 'Давно в вишлисте, жду отпуска чтобы полностью погрузиться в крафт летающих повозок и пещеры Хайрула.'
  },
  {
    id: 'game-6',
    title: 'Balatro',
    status: 'completed',
    platform: 'Switch',
    hours: 42,
    achievementsUnlocked: 29,
    achievementsTotal: 32,
    rating: 9,
    userThoughts: 'Самый опасный пожиратель времени в истории портативок. Зашел сыграть один блайнд — очнулся через 4 часа.',
    genre: 'Deckbuilder Roguelike',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    completedAt: '2026-08-28',
    addedAt: '2026-08-10',
    aiReview: {
      verdict: 'Дофаминовая ловушка века: математический гипноз в карманном формате!',
      tags: ['#Имба', '#Таймкиллер', '#Покер', '#ИндиШедевр', '#База'],
      pros: ['Гениальная простота и глубина', 'Синтез аудио и фидбека фишек', 'Идеально для Switch в кровати'],
      cons: ['Сильнейшая зависимость, невозможно оторваться'],
      gamerScore: 'Вайб: 9.5/10 | Опасность для сна: 10/10',
      reviewBody: 'Локанеру удалось сделать рогалик, который цепляет почище казино. Ощущение, когда джокеры разгоняют мультипликатор до триллионов очков, не сравнимо ни с чем.'
    }
  }
];

export const INITIAL_FRIEND_POSTS: FriendPost[] = [
  {
    id: 'post-1',
    authorName: 'KateValkyrie',
    authorTag: '@valkyrie_play',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    gameTitle: 'Silent Hill 2 Remake',
    gameCover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    platform: 'PlayStation',
    status: 'completed',
    hours: 19,
    rating: 9,
    userThoughts: 'Bloober Team выдали базу! Густейший туман, жуткий звук радио и невероятная проработка Джеймса.',
    createdAt: '2 часа назад',
    aiReview: {
      verdict: 'Шедевральный трибьют классике: страшно, больно, атмосферно до мурашек.',
      tags: ['#База', '#Хоррор', '#GOTY', '#СайлентХилл', '#Атмосфера'],
      pros: ['Звук через 3D-наушники ломает психику', 'Боевая система стала тяжелой и тактильной', 'Уважение к канону'],
      cons: ['Больница Брукхейвен заставит поседеть'],
      gamerScore: 'Вайб: 9.5/10 | Уровень хоррора: 10/10 (Играть только ночью)',
      reviewBody: 'Один из лучших психологических хорроров поколения. Игра не пугает дешёвыми скримерами — она медленно погружает в тягучую меланхолию и личный кошмар Джеймса Сандерленда.'
    },
    reactions: { gg: 24, clutch: 8, cry: 15, drop: 1 },
    userReactions: { gg: true, clutch: false, cry: false, drop: false },
    comments: [
      {
        id: 'c-1',
        author: 'Alex_Cyber',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        text: 'Звук в наушниках реально пушка, в аптеке чуть геймпад не выронил!',
        createdAt: '1 час назад'
      },
      {
        id: 'c-2',
        author: 'LootGoblin',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=256&q=80',
        text: 'Красота, заношу в вишлист на Хэллоуин 🎃',
        createdAt: '40 минут назад'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Alex_Cyber',
    authorTag: '@alex_retro',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    gameTitle: 'Black Myth: Wukong',
    gameCover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    platform: 'PC',
    status: 'completed',
    hours: 46,
    rating: 8,
    userThoughts: 'Графон в UE5 запредельный. Боссы сочные, хотя невидимые стены в локациях немного раздражают.',
    createdAt: 'Вчера, в 21:15',
    aiReview: {
      verdict: 'Яростный экшен с божественным арт-дирекшеном: Обезьяна показала класс!',
      tags: ['#Имба', '#Боссфайт', '#ГрафонUE5', '#Укун', '#Драйв'],
      pros: ['Анимации ударов посохом — чистое кино', 'Десятки уникальных боссов', 'Китайская мифология оживает'],
      cons: ['Локации могли быть с более открытым левел-дизайном'],
      gamerScore: 'Вайб: 8.8/10 | Плотность эпика: 9/10',
      reviewBody: 'Китайский геймдев ворвался в высшую лигу с двух ног. Боевка быстрая, трансформации дают простор для тактики, а каждый ролик перед новой главой хочется пересматривать отдельно.'
    },
    reactions: { gg: 42, clutch: 19, cry: 3, drop: 0 },
    userReactions: { gg: false, clutch: true, cry: false, drop: false },
    comments: [
      {
        id: 'c-3',
        author: 'KateValkyrie',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        text: 'Тигр-авангард в храме крови — вот где был настоящий пот 🔥',
        createdAt: 'Вчера, в 22:04'
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Doka2Pro',
    authorTag: '@doka_master',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
    gameTitle: 'Suicide Squad: Kill the Justice League',
    gameCover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    platform: 'PC',
    status: 'dropped',
    hours: 6,
    rating: 3,
    userThoughts: 'Rocksteady, что вы наделали... Однотипный лайвсервис шутер с фиолетовыми шарами на крышах. Дропнул.',
    createdAt: '3 дня назад',
    aiReview: {
      verdict: 'Катастрофический скам на наследии Arkham: закрыть и забыть.',
      tags: ['#Дроп', '#Скам', '#Кринж', '#Тильт', '#RIPTalent'],
      pros: ['Неплохие лицевые анимации в катсценах'],
      cons: ['Скучнейший дженерик лутер-шутер', 'Уничтожение культовых героев DC'],
      gamerScore: 'Вайб: 2/10 | Уровень боли фаната: 100/10',
      reviewBody: 'Трагический пример того, как корпоративная жажда сервисных игр губит выдающуюся студию. Дроп после 6 часов унылого отстрела светящихся пузырей.'
    },
    reactions: { gg: 5, clutch: 2, cry: 31, drop: 54 },
    userReactions: { gg: false, clutch: false, cry: false, drop: true },
    comments: [
      {
        id: 'c-4',
        author: 'LootGoblin',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=256&q=80',
        text: 'Правильный выбор, брат, спасай бэклог от такого 💀',
        createdAt: '3 дня назад'
      }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    title: 'Первая платина',
    description: 'Выбей 100% ачивок в любой игре из бэклога',
    iconName: 'Trophy',
    unlocked: true,
    unlockedAt: '02.09.2026',
    currentProgress: 1,
    maxProgress: 1,
    rewardExp: 500
  },
  {
    id: 'ach-2',
    title: 'Бэклог-киллер',
    description: 'Пройди и переведи в статус «Пройдено» 5 игр',
    iconName: 'Swords',
    unlocked: false,
    currentProgress: 3,
    maxProgress: 5,
    rewardExp: 750
  },
  {
    id: 'ach-3',
    title: 'Имба-критик',
    description: 'Сгенерируй 3 AI-карточки обзора на геймерском сленге',
    iconName: 'Sparkles',
    unlocked: true,
    unlockedAt: '12.09.2026',
    currentProgress: 3,
    maxProgress: 3,
    rewardExp: 400
  },
  {
    id: 'ach-4',
    title: 'GG-Машина',
    description: 'Поставь 15 геймерских реакций («GG», «Clutch», «Cry», «Drop») в ленте друзей',
    iconName: 'Zap',
    unlocked: false,
    currentProgress: 9,
    maxProgress: 15,
    rewardExp: 350
  },
  {
    id: 'ach-5',
    title: 'Мультиплатформенщик',
    description: 'Зафиксируй игры на 3+ разных платформах (PC, PS, Xbox, Switch)',
    iconName: 'Gamepad2',
    unlocked: true,
    unlockedAt: '10.09.2026',
    currentProgress: 4,
    maxProgress: 3,
    rewardExp: 600
  },
  {
    id: 'ach-6',
    title: 'Марафонец Найт-Сити',
    description: 'Наиграй суммарно более 150 часов в RPG и экшены',
    iconName: 'Flame',
    unlocked: false,
    currentProgress: 124,
    maxProgress: 150,
    rewardExp: 1000
  }
];

export const GENRE_PRESETS = [
  'Action RPG / Souls',
  'RPG / Open World',
  'Roguelike / Action',
  'Deckbuilder Roguelike',
  'Survival Horror',
  'Shooter / FPS',
  'Adventure / Metroidvania',
  'Platformer / Indie',
  'Strategy / Tactics',
  'Racing / Sim'
];

export const PLATFORM_INFO: Record<string, { label: string; color: string; badgeBg: string }> = {
  PC: {
    label: 'PC (Steam)',
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    badgeBg: 'from-sky-500/20 to-blue-600/20 text-sky-300 border-sky-500/40'
  },
  PlayStation: {
    label: 'PlayStation 5',
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    badgeBg: 'from-blue-600/20 to-indigo-600/20 text-blue-300 border-blue-500/40'
  },
  Xbox: {
    label: 'Xbox Series X',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    badgeBg: 'from-emerald-500/20 to-green-600/20 text-emerald-300 border-emerald-500/40'
  },
  Switch: {
    label: 'Nintendo Switch',
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    badgeBg: 'from-rose-500/20 to-red-600/20 text-rose-300 border-rose-500/40'
  }
};
