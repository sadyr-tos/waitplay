// 37_store_presets.js - Presets & Templates

// app.js - WaitPlay Admin Panel & Simulator Logic (v2.7)

export const DEFAULT_TEMPLATES = [
  { 
    id: 1, 
    text: "Какой из этих напитков самый древний?", 
    options: ["Чай", "Кофе", "Пиво", "Лимонад"], 
    emojis: ["🍵", "☕", "🍺", "🥤"],
    correct: 2, 
    minPlayers: 10, 
    maxPlayers: 15 
  },
  { 
    id: 2, 
    text: "Какое тесто чаще всего используют для тандырной самсы?", 
    options: ["Дрожжевое", "Слоеное", "Песочное", "Пресное"], 
    emojis: ["🍞", "🥐", "🥖", "🥞"],
    correct: 1, 
    minPlayers: 10, 
    maxPlayers: 15 
  },
  { 
    id: 3, 
    text: "Что традиционно является основным ингредиентом бешбармака?", 
    options: ["Рыба", "Курица", "Мясо (конина)", "Овощи"], 
    emojis: ["🐟", "🐔", "🥩", "🥕"],
    correct: 2, 
    minPlayers: 10, 
    maxPlayers: 15 
  },
  { 
    id: 4, 
    text: "Какое кыргызское блюдо готовят из мяса в казане?", 
    options: ["Лагман", "Плов", "Манты", "Куурдак"], 
    emojis: ["🍜", "🍛", "🥟", "🍲"],
    correct: 3, 
    minPlayers: 10, 
    maxPlayers: 15 
  },
  { 
    id: 5, 
    text: "Из чего делают курут?", 
    options: ["Сыр", "Сузьма", "Масло", "Рис"], 
    emojis: ["🧀", "🥛", "🧈", "🍚"],
    correct: 1, 
    minPlayers: 10, 
    maxPlayers: 15 
  },
  { 
    id: 6, 
    text: "Какой напиток готовят из кобыльего молока?", 
    options: ["Бозо", "Максым", "Кымыз", "Кола"], 
    emojis: ["🍶", "🍵", "🥛", "🥤"],
    correct: 2, 
    minPlayers: 10, 
    maxPlayers: 15 
  },
  { 
    id: 7, 
    text: "Какое блюдо из риса популярно на праздниках?", 
    options: ["Рис", "Суши", "Каша", "Плов"], 
    emojis: ["🍚", "🍣", "🥣", "🍛"],
    correct: 3, 
    minPlayers: 10, 
    maxPlayers: 15 
  },
  { 
    id: 8, 
    text: "Что такое боорсоки?", 
    options: ["Лепешки", "Пончики", "Пирожные", "Пельмени"], 
    emojis: ["🍞", "🍩", "🍰", "🥟"],
    correct: 1, 
    minPlayers: 10, 
    maxPlayers: 15 
  }
];

// Expanded Grid of 10 Games (6 Base, 4 PRO)
export const DEFAULT_GAMES = [
  { id: 1, name: "Викторина 🎯", icon: "🎯", minPlayers: 10, maxPlayers: 15, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 2, name: "Найди отличия 🔍", icon: "🔍", minPlayers: 2, maxPlayers: 10, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 3, name: "Гонка Стикменов 🏃", icon: "🏃", minPlayers: 6, maxPlayers: 8, enabled: false, published: false, isPro: true, isAIGenerated: false },
  { id: 4, name: "Крестики-нолики ❌⭕", icon: "❌⭕", minPlayers: 2, maxPlayers: 2, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 5, name: "Кроссворд 📝", icon: "📝", minPlayers: 6, maxPlayers: 10, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 6, name: "Мемори 🧠", icon: "🧠", minPlayers: 2, maxPlayers: 4, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 7, name: "Сабвей Ран 🚇", icon: "🚇", minPlayers: 6, maxPlayers: 8, enabled: false, published: false, isPro: true, isAIGenerated: false },
  { id: 8, name: "Нарезка 🔪", icon: "🔪", minPlayers: 2, maxPlayers: 8, enabled: false, published: false, isPro: true, isAIGenerated: false },
  { id: 9, name: "Морской Бой 🚢", icon: "🚢", minPlayers: 2, maxPlayers: 2, enabled: false, published: false, isPro: true, isAIGenerated: false },
  { id: 10, name: "Поле Чудес 🗣️", icon: "🗣️", minPlayers: 2, maxPlayers: 5, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 11, name: "Шашки 🏁", icon: "🏁", minPlayers: 2, maxPlayers: 2, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 12, name: "Шахматы ♟️", icon: "♟️", minPlayers: 2, maxPlayers: 2, enabled: false, published: false, isPro: true, isAIGenerated: false }
];

export const GUESSWORD_PRESETS = {
  easy: [
    { word: "КОФЕ", clue: "Популярный бодрящий напиток из обжаренных зерен" },
    { word: "МЕНЮ", clue: "Перечень блюд и напитков с ценами в ресторане" },
    { word: "ЧАЙ", clue: "Традиционный горячий напиток из чайных листьев" },
    { word: "ХЛЕБ", clue: "Основной продукт выпечки из муки" },
    { word: "СОЛЬ", clue: "Белая кристаллическая приправа к пище" }
  ],
  normal: [
    { word: "ОФИЦИАНТ", clue: "Сотрудник ресторана, принимающий заказы и обслуживающий гостей" },
    { word: "ЛИМОНАД", clue: "Прохладительный напиток на основе лимонного сока и воды" },
    { word: "САЛФЕТКА", clue: "Бумажный или тканевый квадрат для вытирания рук и губ" },
    { word: "ТАРЕЛКА", clue: "Круглая посуда для подачи вторых блюд" },
    { word: "ДЕСЕРТ", clue: "Сладкое блюдо, подаваемое в конце трапезы" },
    { word: "СЧЕТ", clue: "Бумага с итоговой суммой для оплаты заказа" }
  ],
  hard: [
    { word: "ШЕФ-ПОВАР", clue: "Главный человек на кухне, управляющий приготовлением всех блюд" },
    { word: "ГАСТРОНОМИЯ", clue: "Наука о связи между культурой и пищей, искусство тонкого вкуса" },
    { word: "СОМЕЛЬЕ", clue: "Работник ресторана, ответственный за выбор, хранение и подачу вин" },
    { word: "РЕЦЕПТУРА", clue: "Точное описание процесса и соотношения ингредиентов блюда" },
    { word: "ДЕГУСТАЦИЯ", clue: "Оценка вкусовых качеств напитков или блюд специалистами" }
  ]
};

export const EMOJI_PAIRS = [
  { base: "🍎", odd: "🍏" },
  { base: "🐻", odd: "🐼" },
  { base: "😀", odd: "😃" },
  { base: "🍩", odd: "🍪" },
  { base: "⚽", odd: "⚾" },
  { base: "🐱", odd: "🐯" },
  { base: "🍊", odd: "🍋" },
  { base: "🚗", odd: "🚕" },
  { base: "🍦", odd: "🍧" },
  { base: "🍔", odd: "🥪" },
  { base: "🦉", odd: "🦅" },
  { base: "🐙", odd: "🦑" },
  { base: "🍅", odd: "🍒" },
  { base: "🍈", odd: "🍉" },
  { base: "🥛", odd: "🥤" }
];

export const PRESETS = {
  venue: { lat: 42.8746, lng: 74.5698 },
  home: { lat: 42.8851, lng: 74.5489 }
};

export const CROSSWORD_PRESETS = {
  easy: {
    layouts: [
      {
        gridSize: 8,
        words: [
          { id: "e1", word: "ПЛОВ", direction: "down", x: 3, y: 1, clue: "Традиционное восточное блюдо из риса и мяса в казане" },
          { id: "e2", word: "СУП", direction: "across", x: 1, y: 1, clue: "Жидкое горячее блюдо, первое на бульоне" },
          { id: "e3", word: "ХЛЕБ", direction: "across", x: 2, y: 2, clue: "Печеное мучное изделие, всему голова" },
          { id: "e4", word: "СОК", direction: "across", x: 2, y: 3, clue: "Прохладительный напиток из спелых фруктов или ягод" },
          { id: "e5", word: "ВОДА", direction: "across", x: 3, y: 4, clue: "Самый простой и важный освежающий напиток" }
        ]
      },
      {
        gridSize: 8,
        words: [
          { id: "e1", word: "МУКА", direction: "across", x: 2, y: 2, clue: "Перемолотое зерно для выпечки теста" },
          { id: "e2", word: "АЙС", direction: "down", x: 5, y: 2, clue: "Лед по-английски, популярная добавка к напиткам" },
          { id: "e3", word: "КЕКС", direction: "down", x: 4, y: 2, clue: "Сладкое выпечное кондитерское изделие с изюмом" },
          { id: "e4", word: "МЯСО", direction: "down", x: 2, y: 2, clue: "Продукт животного происхождения для стейка или шашлыка" },
          { id: "e5", word: "СОК", direction: "across", x: 2, y: 4, clue: "Напиток из выжатых свежих фруктов" }
        ]
      }
    ]
  },
  normal: {
    layouts: [
      {
        gridSize: 10,
        words: [
          { id: "n1", word: "ВИЛКА", direction: "down", x: 3, y: 1, clue: "Столовый прибор с острыми зубцами" },
          { id: "n2", word: "ПИЦЦА", direction: "across", x: 2, y: 2, clue: "Итальянское круглое тесто с сыром, колбасой и томатами" },
          { id: "n3", word: "АНАНАС", direction: "across", x: 3, y: 5, clue: "Крупный тропический плод с колючей кожурой и хохолком" },
          { id: "n4", word: "ЦУКАТ", direction: "down", x: 5, y: 2, clue: "Засахаренный кусочек какого-либо фрукта" },
          { id: "n5", word: "КОЛА", direction: "across", x: 1, y: 3, clue: "Популярный газированный напиток темного цвета" },
          { id: "n6", word: "БАНАНЫ", direction: "down", x: 6, y: 1, clue: "Желтые изогнутые тропические фрукты" },
          { id: "n7", word: "ТЫКВА", direction: "across", x: 5, y: 6, clue: "Большой круглый оранжевый овощ, символ Хэллоуина" }
        ]
      },
      {
        gridSize: 10,
        words: [
          { id: "n1", word: "МОЛОКО", direction: "down", x: 2, y: 1, clue: "Белый питательный напиток от коровы" },
          { id: "n2", word: "МАСЛО", direction: "across", x: 2, y: 1, clue: "Жировой молочный продукт для бутербродов" },
          { id: "n3", word: "СИТО", direction: "down", x: 4, y: 1, clue: "Кухонная утварь для просеивания муки" },
          { id: "n4", word: "САЛАТ", direction: "across", x: 0, y: 3, clue: "Свежее овощное блюдо, заправленное маслом" },
          { id: "n5", word: "ЛИМОН", direction: "down", x: 5, y: 1, clue: "Кислый цитрусовый плод желтого цвета" },
          { id: "n6", word: "ТОМАТ", direction: "across", x: 4, y: 3, clue: "Красный сочный овощ для салата или кетчупа" },
          { id: "n7", word: "ОТМЕНА", direction: "down", x: 6, y: 1, clue: "Аннулирование действия или заказа в ресторане" }
        ]
      }
    ]
  },
  hard: {
    layouts: [
      {
        gridSize: 12,
        words: [
          { id: "h1", word: "ОФИЦИАНТ", direction: "down", x: 4, y: 1, clue: "Сотрудник ресторана, принимающий заказы и обслуживающий столики" },
          { id: "h2", word: "МАСЛО", direction: "across", x: 0, y: 1, clue: "Жировой продукт, получаемый из сливок или семян растений" },
          { id: "h3", word: "ВАФЛИ", direction: "across", x: 2, y: 2, clue: "Хрустящее печенье с рельефным узором в клетку" },
          { id: "h4", word: "ГРИБ", direction: "across", x: 2, y: 3, clue: "Шампиньон или лисичка, популярный ингредиент жульена" },
          { id: "h5", word: "СЛИВА", direction: "across", x: 2, y: 5, clue: "Фиолетовый косточковый плод круглой или овальной формы" },
          { id: "h6", word: "НОЖ", direction: "across", x: 4, y: 7, clue: "Острый инструмент для нарезки стейка" },
          { id: "h7", word: "САЛАТ", direction: "across", x: 0, y: 8, clue: "Блюдо из смеси порезанных свежих овощей" },
          { id: "h8", word: "СЫР", direction: "down", x: 0, y: 8, clue: "Твердый молочный продукт, обязательный для пиццы" },
          { id: "h9", word: "МЕД", direction: "down", x: 0, y: 1, clue: "Сладкое густое вещество, вырабатываемое пчелами" }
        ]
      },
      {
        gridSize: 12,
        words: [
          { id: "h1", word: "ПЕЛЬМЕНИ", direction: "down", x: 3, y: 1, clue: "Традиционное русское вареное тесто с мясным фаршем" },
          { id: "h2", word: "ПЕРЕЦ", direction: "across", x: 3, y: 1, clue: "Острая приправа или сладкий болгарский овощ" },
          { id: "h3", word: "ГОРЧИЦА", direction: "down", x: 7, y: 1, clue: "Жгучая желтая приправа к холодцу или сосискам" },
          { id: "h4", word: "СМЕТАНА", direction: "across", x: 2, y: 5, clue: "Кисломолочный продукт, идеальный для блинов и борща" },
          { id: "h5", word: "ЕДА", direction: "down", x: 4, y: 5, clue: "Пища, продукты питания, то что мы едим" },
          { id: "h6", word: "АЗИАТ", direction: "across", x: 4, y: 7, clue: "Житель крупнейшей части света" },
          { id: "h7", word: "МАЛИНА", direction: "across", x: 1, y: 3, clue: "Сладкая садовая красная ягода с колючками" },
          { id: "h8", word: "АЙСБЕРГ", direction: "down", x: 2, y: 3, clue: "Популярный сорт листового салата или ледяная гора" },
          { id: "h9", word: "МЕД", direction: "down", x: 1, y: 3, clue: "Сладкий пчелиный продукт" }
        ]
      }
    ]
  }
};


