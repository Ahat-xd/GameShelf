import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

// Fallback generator for gamer slang reviews when API key is missing or on error
function generateFallbackReview(title: string, rating: number, thoughts: string, platform?: string) {
  const isHigh = rating >= 8;
  const isMid = rating >= 5 && rating < 8;
  
  let verdict = '';
  let tags: string[] = [];
  let pros: string[] = [];
  let cons: string[] = [];
  let gamerScore = '';
  let reviewBody = '';

  if (isHigh) {
    verdict = rating === 10 
      ? `Абсолютная база и шедевр 10/10 — чистый концентрированный кайф!`
      : `Крепчайшая имба! Затягивает так, что забываешь про сон и дейлики.`;
    tags = ['#Имба', '#База', '#MustPlay', '#Годнота', '#Шедевр'];
    pros = ['Пушечный геймплей и визуал', 'Музыка пробирает до мурашек', 'Погружение на все 100%'];
    cons = ['Слишком быстро пролетело время', 'После такого тяжело играть во что-то другое'];
    gamerScore = `Вайб: 10/10 | Уровень духоты: 1/10 (Свежак)`;
    reviewBody = thoughts.trim()
      ? `«${thoughts.trim()}» — и это чистая правда! Игра держит темп с первых минут. Никакого унылого гринда, только плотный драйв, идеальный саунд-дизайн и ощущение настоящего игрового трипа.`
      : `Редкий проект, где каждая игровая механика работает как часы. Графика радует глаз, управление отзывчивое, а боссы заставляют собраться, не превращаясь в душный скиллчек. Брать не думая!`;
  } else if (isMid) {
    verdict = `Крепкий середняк на вечерок: есть крутые фишки, но есть и духота.`;
    tags = ['#НаВечерок', '#Нормис', '#ПоСкидке', '#Спорно', '#Гринд'];
    pros = ['Симпатичный арт и визуал', 'Пара запоминающихся моментов и боссов'];
    cons = ['Местами душит бектрекинг', 'Сюжет к середине сдает обороты'];
    gamerScore = `Вайб: 6.5/10 | Уровень духоты: 5/10 (Терпимо)`;
    reviewBody = thoughts.trim()
      ? `Игрок отметил: «${thoughts.trim()}». В точку — здесь есть отличные механики, но разработчики явно переборщили с филлерами. Играется приятно, но до GOTY не дотягивает.`
      : `Проект с потенциалом, которому не хватило полировки. Геймплейный цикл приятный, но однообразные квесты и небольшая просадка темпа портят общее впечатление. Брать строго по скидке!`;
  } else {
    verdict = `Душный скип и скам на тайминг: лучше перепройти классику.`;
    tags = ['#Скип', '#Душнота', '#Дроп', '#НеОправдало', '#Кринж'];
    pros = ['Красивый трейлер (на этом всё)'];
    cons = ['Кривой баланс и поломанные тайминги', 'Душный гринд ради гринда', 'Оптимизация передает привет'];
    gamerScore = `Вайб: 3/10 | Уровень духоты: 9.5/10 (Окно открой)`;
    reviewBody = thoughts.trim()
      ? `Вердикт по заметке «${thoughts.trim()}»: разработчики забыли завезти удовольствие. Сплошной тильт, невнятный пейсинг и ощущение впустую потраченного времени.`
      : `Полное разочарование. С первых часов проект душит медлительностью, кривым балансом и странными геймдизайнерскими решениями. Дроп без сожалений!`;
  }

  return {
    verdict,
    tags,
    pros,
    cons,
    gamerScore,
    reviewBody,
  };
}

// 1. API: AI Generate Review Card
app.post('/api/generate-review', async (req, res) => {
  const { title, rating, thoughts, platform, hours, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const numRating = Number(rating) || 7;
  const userThoughts = String(thoughts || '');
  const userPlatform = String(platform || 'PC');
  const userHours = Number(hours) || 0;
  const userStatus = String(status || 'Completed');

  const ai = getGenAI();

  if (!ai) {
    // Graceful fallback when no key is set yet
    const fallback = generateFallbackReview(title, numRating, userThoughts, userPlatform);
    return res.json({
      success: true,
      data: fallback,
      mode: 'template',
    });
  }

  try {
    const prompt = `
Ты — культовый и харизматичный игровой критик и завсегдатай геймерских сообществ (StopGame, DTF, Reddit). 
Твоя задача — взять короткие мысли игрока об игре и сгенерировать яркую, стильную карточку обзора с использованием живого современного русскоязычного геймерского сленга (слова вроде: «база», «имба», «вайб», «душнота», «скип», «платина», «скилл чек», «тильт», «катка», «графон», «пейсинг», «саунд», «GOTY»).

Входные данные пользователя:
- Название игры: "${title}"
- Оценка игрока: ${numRating}/10
- Платформа: ${userPlatform}
- Сыграно часов: ${userHours} ч.
- Статус: ${userStatus}
- Личные мысли игрока: "${userThoughts || 'без подробностей'}"

Сформируй ответ СТРОГО в виде валидного JSON без markdown-блоков (или с \`\`\`json ... \`\`\`):
{
  "verdict": "Краткий хлёсткий слоган-вердикт на 1 предложение в геймерском стиле",
  "tags": ["#Имба", "#База", "#Соулслайк", "#GOTY", ... 3-5 тегов],
  "pros": ["2-3 ярких плюса в геймерском стиле"],
  "cons": ["1-2 минуса или повода для духоты"],
  "gamerScore": "Креативная суб-оценка (например: 'Вайб: 10/10 | Градус духоты: 2/10' или 'Уровень тильта: 8/10')",
  "reviewBody": "Развернутый, атмосферный и увлекательный текст обзора на 2 абзаца, обыгрывающий мысли пользователя и передающий реальные ощущения от прохождения"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    let parsedData;
    try {
      const cleaned = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch {
      parsedData = generateFallbackReview(title, numRating, userThoughts, userPlatform);
    }

    return res.json({
      success: true,
      data: parsedData,
      mode: 'ai',
    });
  } catch (error) {
    console.error('Error generating AI review:', error);
    const fallback = generateFallbackReview(title, numRating, userThoughts, userPlatform);
    return res.json({
      success: true,
      data: fallback,
      mode: 'fallback_error',
    });
  }
});

// 2. API: Smart Game Recommendations
app.post('/api/recommendations', async (req, res) => {
  const { games } = req.body;
  const gameList = Array.isArray(games) ? games : [];

  const ai = getGenAI();

  if (!ai || gameList.length === 0) {
    // Intelligent curated fallback suggestions
    return res.json({
      success: true,
      recommendations: [
        {
          id: 'rec-1',
          title: 'Hades II',
          genre: 'Action / Roguelike',
          platform: 'PC, Switch',
          matchScore: 97,
          type: 'новинка',
          coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
          reason: 'Идеальный баланс динамичного экшена, сочного нарратива и бесконечной реиграбельности без капли духоты.',
          hoursToBeat: 45,
          vibe: 'Чистый экстаз и музыка Darren Korb'
        },
        {
          id: 'rec-2',
          title: 'Cyberpunk 2077: Phantom Liberty',
          genre: 'RPG / Open World',
          platform: 'PC, PS5, Xbox Series',
          matchScore: 94,
          type: 'из бэклога',
          coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
          reason: 'Если в твоем списке есть RPG с глубоким лором, шпионский триллер в Найт-Сити закроет потребность в кинематографичном экспириенсе.',
          hoursToBeat: 35,
          vibe: 'Неоновый нуар и плотный сюжет'
        },
        {
          id: 'rec-3',
          title: 'Balatro',
          genre: 'Roguelike Deckbuilder',
          platform: 'PC, Switch, Mobile',
          matchScore: 91,
          type: 'таймкиллер',
          coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          reason: 'Когда нет сил на 80-часовые опенворлды: гипнотический покерный рогалик с идеальным дофаминовым циклом.',
          hoursToBeat: 20,
          vibe: 'Опасный пожиратель времени'
        },
        {
          id: 'rec-4',
          title: 'Elden Ring: Shadow of the Erdtree',
          genre: 'Action RPG / Souls',
          platform: 'PC, PS5, Xbox Series',
          matchScore: 89,
          type: 'скиллчек',
          coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
          reason: 'Для любителей преодоления и красивейших мрачных миров от Миядзаки с запредельным исследованием.',
          hoursToBeat: 50,
          vibe: 'Пот, слёзы и эйфория победы'
        }
      ],
      mode: 'curated'
    });
  }

  try {
    const summary = gameList.map((g: any) => 
      `- ${g.title} (${g.platform || 'Любая'}): оценка ${g.rating || '—'}/10, статус: ${g.status}, сыграно: ${g.hours || 0}ч. Отзыв: ${g.reviewBody || g.thoughts || 'нет'}`
    ).join('\n');

    const prompt = `
Ты — персональный гейминг-консьерж с глубоким знанием видеоигр и геймерского сленга.
Проанализируй игровую полку и историю игрока:
${summary}

Предложи 4 конкретные рекомендации, во что сыграть следующим:
- Рекомендуй 1-2 игры, если в бэклоге/желаемом игрока есть подходящие кандидаты, или актуальные новинки и проверенные шедевры.
- Для каждой игры укажи точный "AI Match Reason" (почему именно она подходит игроку на основе его оценок и сыгранных часов).
- Добавь геймерский сленг и харизму.

Верни СТРОГО JSON-массив без markdown-обертки:
[
  {
    "id": "rec-1",
    "title": "Название игры",
    "genre": "Жанр",
    "platform": "PC / PS5 / Xbox / Switch",
    "matchScore": 95,
    "type": "из бэклога" или "новинка" или "скрытый шедевр",
    "reason": "Персональное обоснование с отсылкой к предпочтениям игрока",
    "hoursToBeat": 25,
    "vibe": "Короткий стильный маркер вайба"
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    const cleaned = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.json({
      success: true,
      recommendations: parsed,
      mode: 'ai'
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.json({
      success: true,
      recommendations: [
        {
          id: 'rec-fallback-1',
          title: 'Hades II',
          genre: 'Action / Roguelike',
          platform: 'PC, Switch',
          matchScore: 96,
          type: 'новинка',
          reason: 'Великолепный темп и визуал для переключения после тяжелых прохождений.',
          hoursToBeat: 40,
          vibe: '100% адреналин'
        },
        {
          id: 'rec-fallback-2',
          title: 'Alan Wake 2',
          genre: 'Survival Horror / Mystery',
          platform: 'PC, PS5, Xbox Series',
          matchScore: 92,
          type: 'шедевр',
          reason: 'Если хочется густой кинематографичной атмосферы и запутанного сюжета Сэма Лейка.',
          hoursToBeat: 22,
          vibe: 'Мрачный артхаус'
        }
      ],
      mode: 'fallback'
    });
  }
});

// Vite middleware or Static serving
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GameShelf server running at http://0.0.0.0:${PORT}`);
  });
}

setupApp();
