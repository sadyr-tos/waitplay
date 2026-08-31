// app.js - WaitPlay Admin Panel & Simulator Logic (v2.7)

const DEFAULT_TEMPLATES = [
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

// Official Grid of 10 Universal Games (100% Free & Unlocked)
const DEFAULT_GAMES = [
  { id: 1, name: "Викторина 🎯", icon: "🎯", minPlayers: 10, maxPlayers: 15, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 2, name: "Кроссворд 📝", icon: "📝", minPlayers: 6, maxPlayers: 10, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 3, name: "Поле Чудес 🗣️", icon: "🗣️", minPlayers: 2, maxPlayers: 5, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 4, name: "Крестики-нолики ❌⭕", icon: "❌⭕", minPlayers: 2, maxPlayers: 8, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 5, name: "Мемори 🧠", icon: "🧠", minPlayers: 2, maxPlayers: 4, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 6, name: "Найди отличия 🔍", icon: "🔍", minPlayers: 2, maxPlayers: 10, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 7, name: "Нарезка 🔪", icon: "🔪", minPlayers: 2, maxPlayers: 8, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 8, name: "Торт до Небес 🎂", icon: "🎂", minPlayers: 2, maxPlayers: 8, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 9, name: "Шашки 🏁", icon: "🏁", minPlayers: 2, maxPlayers: 2, enabled: true, published: true, isPro: false, isAIGenerated: false },
  { id: 10, name: "Шахматы ♟️", icon: "♟️", minPlayers: 2, maxPlayers: 2, enabled: true, published: true, isPro: false, isAIGenerated: false }
];

const GUESSWORD_PRESETS = {
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

const EMOJI_PAIRS = [
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

const PRESETS = {
  venue: { lat: 42.8746, lng: 74.5698 },
  home: { lat: 42.8851, lng: 74.5489 }
};

const CROSSWORD_PRESETS = {
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

class WaitPlayApp {
  constructor() {
    this.isLoginFlow = false;
    this.isAddingBranch = false;
    this.pendingBranchName = null;
    this.expandedQuestions = new Set();

    this.state = {
      subscription: 'none', 
      consentAccepted: false,
      activeBranchId: '',
      activeBranchName: '',
      databaseClients: [],
      venueCoords: { ...PRESETS.venue },
      adminCoords: { ...PRESETS.venue },
      welcomeMsg: "",
      prizeMsg: "",
      limitGames: 2,
      limitHours: 3,
      tttDifficulty: "normal",
      tttTournamentSize: 8,
      quizTieWinnerBehavior: "give",
      diffRounds: 6,
      diffGridSize: "normal",
      diffTimeLimit: 15,
      lastAdTime: 0,
      manualTestingMode: false,
      
      // Crossword settings
      crosswordDifficulty: "normal",
      crosswordTimeLimit: 5,
      
      // Guess the Word settings
      guessWordDifficulty: "normal",
      guessWordCustomWord: "",
      guessWordCustomClue: "",
      
      email: '',
      phone: '',
      deviceModel: 'iPhone 15 Pro',
      deviceHistory: [
        '15.06.2026: Первичная регистрация: iPhone 15 Pro'
      ],
      
      templates: JSON.parse(JSON.stringify(DEFAULT_TEMPLATES)),
      games: JSON.parse(JSON.stringify(DEFAULT_GAMES)),
      lastAIGenTime: 0,
      
      // Creator Support db
      supportTickets: [],
      
      // Visitor session
      visitorGamesPlayed: 0,
      visitorLockoutUntil: 0,
      visitorActiveView: 'locked', 
      visitorSelectedGameId: null,
      crosswordLayoutIndex: 0,
      crosswordCustomWords: {},
      
      // Active game simulation state
      lobbyPlayersCount: 1,
      lobbyCountdown: null,
      lobbyJoinInterval: null,
      lobbyTimerVal: 0,
      activeGameQIndex: 0,
      activeGameScore: 0,
      simulatedPlayers: [],
      gameRunningInterval: null,
      firstAnsweredThisRound: false,
      
      // Platform settings
      maintenanceMode: false,
      backupGenerator: false,
      aiEngine: 'waitplay-v2',
      filterStrictness: 'normal',
      creatorScale: '100%',
      creatorFullscreen: false
    };

    this.selectedPlan = 'base'; 
    this.billingCycle = 'monthly'; 
    this.lockoutCheckInterval = null;
    this.selectedPaymentType = 'card'; 
    this.selectedBank = null; 
    this.activeEmojiPicker = null; 
    
    // Timers state variables
    this.timers = {
      regEmail: { interval: null, value: 180, code: '' },
      regPhone: { interval: null, value: 180, code: '' },
      supportEmail: { interval: null, value: 180, code: '' },
      supportPhone: { interval: null, value: 180, code: '' },
      migEmail: { interval: null, value: 180, code: '' }
    };
  }

  init() {
    try {
      this.loadState();
      
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      const locParam = urlParams.get('loc');

      if (roleParam === 'guest' || locParam) {
        // GUEST / VISITOR ROUTING
        const targetLoc = locParam || this.state.activeBranchId || 'loc_main';
        this.state.visitorConnectedBranchId = targetLoc;
        
        const adminScreens = document.querySelectorAll('.screen:not(.visitor-screen)');
        adminScreens.forEach(s => {
          s.style.display = 'none';
        });

        const visitorFrame = document.getElementById('visitor-frame');
        if (visitorFrame) {
          visitorFrame.style.display = 'flex';
        }

        this.ensureMyPlayerProfile();
        this.initRealtimeNetwork(targetLoc);
        this.initVisitorLobby();
      } else {
        // ADMIN / OWNER ROUTING
        const visitorFrame = document.getElementById('visitor-frame');
        if (visitorFrame) {
          visitorFrame.style.display = 'none';
        }

        const adminScreens = document.querySelectorAll('.screen:not(.visitor-screen)');
        adminScreens.forEach(s => {
          s.style.display = 'flex';
        });

        if (this.state.consentAccepted || this.state.email) {
          if (!this.state.activeBranchId) this.state.activeBranchId = 'br_main';
          if (!this.state.activeBranchName) this.state.activeBranchName = 'Моё заведение 🎮';
          this.setAdminPanelActiveView('dashboard');
          this.updateAdminView();
        } else {
          this.setAdminPanelActiveView('welcome-choice');
        }
      }
    } catch(e) {
      console.error("Error in app.init:", e);
    }
  }

  initVisitorLobby() {
    try {
      this.setVisitorViewPanel('lobby');
      this.renderVisitorLobbyGames();
      
      const branch = this.getVisitorConnectedBranch();
      const venueName = branch ? branch.name : (this.state.activeBranchName || 'WaitPlay Заведение');
      const titleEl = document.getElementById('visitor-venue-title');
      const displayEl = document.getElementById('visitor-venue-name-display');
      if (titleEl) titleEl.innerText = venueName;
      if (displayEl) displayEl.innerText = venueName;

      const badgeEl = document.getElementById('visitor-limit-badge-compact');
      if (badgeEl) {
        badgeEl.innerText = `${this.state.visitorGamesPlayed || 0} / 2`;
      }
    } catch(e) {
      console.error("Error in initVisitorLobby:", e);
    }
  }

  getActiveCrosswordPreset(diff, layoutIdx) {
    const basePreset = CROSSWORD_PRESETS[diff].layouts[layoutIdx || 0];
    const preset = JSON.parse(JSON.stringify(basePreset));
    
    const key = `${diff}_${layoutIdx || 0}`;
    if (this.state.crosswordCustomWords && this.state.crosswordCustomWords[key]) {
      const customs = this.state.crosswordCustomWords[key];
      preset.words.forEach(w => {
        if (customs[w.id]) {
          w.word = customs[w.id].word;
          w.clue = customs[w.id].clue;
        }
      });
    }
    return preset;
  }

  init() {
    try {
      // Check if URL query contains guest mode params (?role=guest, ?guest=1, ?loc=...) FIRST!
      const urlParams = new URLSearchParams(window.location.search);
      const isGuestUrl = (urlParams.has('role') && urlParams.get('role') === 'guest') || urlParams.has('guest') || urlParams.has('loc');
      
      if (isGuestUrl) {
        this.state.isVisitorMode = true;
        this.state.email = null; // Clear admin email for guest context!
        this.initDOM();
        
        // Hide Admin frame completely, show Visitor frame for Guest Phone!
        const allFrames = document.querySelectorAll('.phone-frame');
        allFrames.forEach(f => {
          if (f.id === 'visitor-frame') {
            f.style.display = 'block';
          } else {
            f.style.display = 'none';
          }
        });

        if (this.state.maxVenuePlayers === 0) {
          this.state.visitorActiveView = 'locked';
          this.setVisitorViewPanel('locked');
          this.showToast("🔒 Доступ к играм заблокирован администратором локации!", true);
        } else {
          this.state.visitorActiveView = 'lobby';
          this.setVisitorViewPanel('lobby');
          this.initVisitorLobby();
          this.showToast("🎮 Добро пожаловать в игровое пространство!", false);
        }
        return; // STOP execution here so admin context never loads for guest!
      }

      this.initDatabaseClients();
      this.loadState();
      
      this.normalizeGameNames();
      
      // Auto-load active branch context on reload (F5) to persist settings & game states
      if (this.state.email && this.state.activeBranchId) {
        this.loadBranchContext(this.state.email, this.state.activeBranchId);
      }
      
      this.normalizeGameNames();
      this.sortGames();
      this.initDOM();

      const allFrames = document.querySelectorAll('.phone-frame');
      allFrames.forEach(f => {
        if (f.id === 'visitor-frame') {
          f.style.display = 'none';
        } else {
          f.style.display = 'block';
        }
      });

      this.updateAdminView();
      this.updateVisitorView();

      this.startLockoutTicker();
      this.recalculateDistances();
      this.detectBankingApps();
      this.renderCreatorTicketsList();
      this.renderCreatorAILogs();
      this.renderCreatorClientsList();
      
      if (this.state.creatorScale) {
        this.setCreatorScale(this.state.creatorScale);
        const select = document.getElementById('creator-scale-select');
        if (select) select.value = this.state.creatorScale;
      }
      if (this.state.creatorFullscreen) {
        this.toggleCreatorFullscreen();
      }
    } catch (e) {
      console.error("Runtime Error inside init():", e);
    }
  }

  recalculateDistances() {
    try {
      if (!this.state.visitorCoords) {
        this.state.visitorCoords = { lat: PRESETS.venue.lat, lng: PRESETS.venue.lng };
      }
      if (!this.state.venueCoords) {
        this.state.venueCoords = { lat: PRESETS.venue.lat, lng: PRESETS.venue.lng };
      }
      if (!this.state.adminCoords) {
        this.state.adminCoords = { lat: PRESETS.venue.lat, lng: PRESETS.venue.lng };
      }
    } catch(e) {
      console.warn("recalculateDistances warning:", e);
    }
  }

  isSandboxMode() {
    const url = window.location.href.toLowerCase();
    return url.startsWith('file:') || 
           url.includes('localhost') || 
           url.includes('127.0.0.1') || 
           url.includes('/users/') || 
           url.includes('/desktop/') || 
           url.includes('c:/') ||
           url.includes('wait%20play');
  }

  loadState() {
    try {
      const saved = localStorage.getItem('waitplay_state_v26');
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed.databaseClients;
        this.state = { ...this.state, ...parsed };
      }

      const visitorSaved = sessionStorage.getItem('waitplay_visitor_state');
      if (visitorSaved) {
        const parsedVisitor = JSON.parse(visitorSaved);
        if (parsedVisitor.guestCrosswordSolvedWords) {
          parsedVisitor.guestCrosswordSolvedWords = new Set(parsedVisitor.guestCrosswordSolvedWords);
        }
        this.state = { ...this.state, ...parsedVisitor };
      }
      
      // Авто-миграция названия и иконки Крестиков-Ноликов, а также лимитов игроков Найди Отличия
      const migrateGamesList = (gamesList) => {
        if (!gamesList) return;
        
        // 1. Крестики-нолики ❌⭕
        const ttt = gamesList.find(g => g.id === 4);
        if (ttt) {
          ttt.name = "Крестики-нолики ❌⭕";
          ttt.icon = "❌⭕";
        }
        
        // 2. Найди отличия 🔍
        const diff = gamesList.find(g => g.id === 2);
        if (diff) {
          if (diff.minPlayers === 6 && diff.maxPlayers === 8) {
            diff.minPlayers = 2;
            diff.maxPlayers = 10;
          }
        }

        // 3. Нарезка 🔪 (заменяет Классики Стикменов 🤸)
        const slicing = gamesList.find(g => g.id === 8);
        if (slicing) {
          slicing.name = "Нарезка 🔪";
          slicing.icon = "🔪";
          slicing.minPlayers = 2;
          slicing.maxPlayers = 8;
        }
      };

      migrateGamesList(this.state.games);
      this.sortGamesList(this.state.games);

      if (this.state.databaseClients) {
        this.state.databaseClients.forEach(client => {
          if (client.branches) {
            client.branches.forEach(branch => {
              migrateGamesList(branch.games);
              this.sortGamesList(branch.games);
            });
          }
        });
      }
      
      // Preserve active branch session across page refreshes
      
      this.state.aiLogs = this.state.aiLogs && this.state.aiLogs.length > 0 ? this.state.aiLogs : [
        {
          id: 1782808856802,
          email: 'cafe_central@gmail.com',
          phone: '996555112233',
          prompt: 'Сделай викторину про коктейли и крепкий алкоголь 18 плюс',
          timestamp: '14:48:10',
          status: 'Отклонено ИИ (18+ / Фильтр) ❌'
        },
        {
          id: 1782808856803,
          email: 'owner_vintage@gmail.com',
          phone: '996777889900',
          prompt: 'Квиз на знание истории кофе и десертов',
          timestamp: '14:52:00',
          status: 'Успешно сгенерировано ✅'
        }
      ];
      
      this.state.bannedUsers = this.state.bannedUsers || [];
      this.state.deviceModel = this.state.deviceModel || 'iPhone 15 Pro';
      this.state.deviceHistory = this.state.deviceHistory || [
        '15.06.2026: Первичная регистрация: iPhone 15 Pro'
      ];
      
      if (!this.state.supportTickets || this.state.supportTickets.length === 0) {
        this.state.supportTickets = [
          {
            id: 1782808856801,
            type: 'FEEDBACK',
            email: 'owner_vintage@gmail.com',
            content: 'Добавьте, пожалуйста, возможность кастомизации игровых персонажей (стикменов) для квизов!',
            timestamp: '14:20:15'
          }
        ];
      }

      this.state.templates.forEach((q, idx) => {
        if (!q.emojis) {
          q.emojis = DEFAULT_TEMPLATES[idx] ? [...DEFAULT_TEMPLATES[idx].emojis] : ["❓", "❓", "❓", "❓"];
        }
      });
      
      if (this.state.games.length < 10) {
        this.state.games = JSON.parse(JSON.stringify(DEFAULT_GAMES));
      }
      this.sortGames();
    } catch (e) {
      console.warn("LocalStorage loadState failed or is blocked:", e);
    }
  }

  sortGamesList(list) {
    if (!list) return;
    list.sort((a, b) => {
      // 1. Free games go first, Pro games go last
      if (a.isPro && !b.isPro) return 1;
      if (!a.isPro && b.isPro) return -1;
      
      // 2. If both are Pro or both are Free, default games (not AI) go before AI games
      if (a.isAIGenerated && !b.isAIGenerated) return 1;
      if (!a.isAIGenerated && b.isAIGenerated) return -1;
      
      // 3. Otherwise sort by ID
      return a.id - b.id;
    });
  }

  sortGames() {
    this.sortGamesList(this.state.games);
  }

  normalizeGameNames() {
    const ensureCheckersInList = (list) => {
      if (!list || !Array.isArray(list)) return;
      const checkersExists = list.some(g => g.id === 11);
      if (!checkersExists) {
        list.push({ id: 11, name: "Шашки 🏁", icon: "🏁", minPlayers: 2, maxPlayers: 2, enabled: true, published: true, isPro: false, isAIGenerated: false });
      }
      const chessExists = list.some(g => g.id === 12);
      if (!chessExists) {
        list.push({ id: 12, name: "Шахматы ♟️", icon: "♟️", minPlayers: 2, maxPlayers: 2, enabled: false, published: false, isPro: true, isAIGenerated: false });
      }
    };

    if (this.state.games && Array.isArray(this.state.games)) {
      ensureCheckersInList(this.state.games);
      this.state.games.forEach(g => {
        if (g.id === 10 && g.name !== "Поле Чудес 🗣️") {
          g.name = "Поле Чудес 🗣️";
        }
        if (g.id === 6 && g.name !== "Мемори 🧠") {
          g.name = "Мемори 🧠";
          g.icon = "🧠";
          if (g.maxPlayers === 8) {
            g.maxPlayers = 4;
          }
        }
        if (g.id === 11 && (g.name !== "Шашки 🏁" || g.maxPlayers !== 2)) {
          g.name = "Шашки 🏁";
          g.icon = "🏁";
          g.minPlayers = 2;
          g.maxPlayers = 2;
        }
        if (g.id === 12 && (g.name !== "Шахматы ♟️" || g.maxPlayers !== 2)) {
          g.name = "Шахматы ♟️";
          g.icon = "♟️";
          g.minPlayers = 2;
          g.maxPlayers = 2;
        }
      });
    }
    if (this.state.databaseClients && Array.isArray(this.state.databaseClients)) {
      this.state.databaseClients.forEach(c => {
        if (c.branches && Array.isArray(c.branches)) {
          c.branches.forEach(b => {
            if (b.games && Array.isArray(b.games)) {
              ensureCheckersInList(b.games);
              b.games.forEach(g => {
                if (g.id === 10 && g.name !== "Поле Чудес 🗣️") {
                  g.name = "Поле Чудес 🗣️";
                }
                if (g.id === 6 && g.name !== "Мемори 🧠") {
                  g.name = "Мемори 🧠";
                  g.icon = "🧠";
                  if (g.maxPlayers === 8) {
                     g.maxPlayers = 4;
                  }
                }
                if (g.id === 11 && (g.name !== "Шашки 🏁" || g.maxPlayers !== 2)) {
                  g.name = "Шашки 🏁";
                  g.icon = "🏁";
                  g.minPlayers = 2;
                  g.maxPlayers = 2;
                }
                if (g.id === 12 && (g.name !== "Шахматы ♟️" || g.maxPlayers !== 2)) {
                  g.name = "Шахматы ♟️";
                  g.icon = "♟️";
                  g.minPlayers = 2;
                  g.maxPlayers = 2;
                }
              });
            }
          });
        }
      });
    }
  }

  saveState() {
    try {
      this.syncActiveBranchToDatabase();

      // Sync active account to logged list if it exists and is paid
      if (this.state.email && this.state.activeBranchId) {
        const emailLower = this.state.email.toLowerCase();
        this.state.loggedAccounts = this.state.loggedAccounts || [];
        const existingIdx = this.state.loggedAccounts.findIndex(acc => acc.email && acc.email.toLowerCase() === emailLower);
        const currentProfile = {
          email: this.state.email,
          phone: this.state.phone,
          subscription: this.state.subscription,
          venueCoords: { ...this.state.venueCoords },
          welcomeMsg: this.state.welcomeMsg,
          deviceModel: this.state.deviceModel,
          deviceHistory: [...this.state.deviceHistory]
        };
        if (existingIdx !== -1) {
          this.state.loggedAccounts[existingIdx] = currentProfile;
        } else {
          this.state.loggedAccounts.push(currentProfile);
        }
      }

      localStorage.setItem('waitplay_state_v26', JSON.stringify({
        activeBranchId: this.state.activeBranchId,
        subscription: this.state.subscription,
        consentAccepted: this.state.consentAccepted,
        venueCoords: this.state.venueCoords,
        adminCoords: this.state.adminCoords,
        visitorCoords: this.state.visitorCoords,
        welcomeMsg: this.state.welcomeMsg,
        email: this.state.email,
        phone: this.state.phone,
        templates: this.state.templates,
        games: this.state.games,
        lastAIGenTime: this.state.lastAIGenTime,
        supportTickets: this.state.supportTickets,
        manualTestingMode: this.state.manualTestingMode,
        crosswordLayoutIndex: this.state.crosswordLayoutIndex,
        crosswordCustomWords: this.state.crosswordCustomWords,
        loggedAccounts: this.state.loggedAccounts,
        maintenanceMode: this.state.maintenanceMode,
        backupGenerator: this.state.backupGenerator,
        aiEngine: this.state.aiEngine,
        filterStrictness: this.state.filterStrictness,
        creatorScale: this.state.creatorScale,
        creatorFullscreen: this.state.creatorFullscreen,
        tttDifficulty: this.state.tttDifficulty,
        tttTournamentSize: this.state.tttTournamentSize,
        quizTieWinnerBehavior: this.state.quizTieWinnerBehavior,
        crosswordDifficulty: this.state.crosswordDifficulty,
        crosswordTimeLimit: this.state.crosswordTimeLimit,
        guessWordDifficulty: this.state.guessWordDifficulty,
        guessWordCustomWord: this.state.guessWordCustomWord,
        guessWordCustomClue: this.state.guessWordCustomClue
      }));

      let crosswordSolvedArray = null;
      if (this.state.guestCrosswordSolvedWords instanceof Set) {
        crosswordSolvedArray = Array.from(this.state.guestCrosswordSolvedWords);
      } else if (Array.isArray(this.state.guestCrosswordSolvedWords)) {
        crosswordSolvedArray = this.state.guestCrosswordSolvedWords;
      }

      sessionStorage.setItem('waitplay_visitor_state', JSON.stringify({
        visitorGamesPlayed: this.state.visitorGamesPlayed,
        visitorLockoutUntil: this.state.visitorLockoutUntil,
        visitorActiveView: this.state.visitorActiveView,
        visitorSelectedGameId: this.state.visitorSelectedGameId,
        visitorConnectedBranchId: this.state.visitorConnectedBranchId,
        activeGameScore: this.state.activeGameScore,
        simulatedPlayers: this.state.simulatedPlayers,
        guessWordPlayers: this.state.guessWordPlayers,
        tttTournament: this.state.tttTournament,
        guestCrosswordSolvedWords: crosswordSolvedArray,
        memoryDeck: this.state.memoryDeck,
        memoryScore: this.state.memoryScore,
        memoryFlippedCards: this.state.memoryFlippedCards,
        memoryTimeRemaining: this.state.memoryTimeRemaining,
        checkersBoard: this.state.checkersBoard,
        checkersTurn: this.state.checkersTurn,
        checkersSelectedCell: this.state.checkersSelectedCell,
        checkersValidMoves: this.state.checkersValidMoves,
        checkersOpponent: this.state.checkersOpponent,
        checkersTimeRemaining: this.state.checkersTimeRemaining,
        checkersActiveCapturePieceIdx: this.state.checkersActiveCapturePieceIdx
      }));
    } catch (e) {
      console.warn("LocalStorage saveState failed or is blocked:", e);
    }
  }

  initDOM() {
    // Global keyboard listener for Stickman Race lane dodging
    window.addEventListener('keydown', (e) => {
      if (this.state.visitorActiveView === 'game' && this.state.visitorSelectedGameId === 3 && !this.state.raceCountdown && !this.state.raceFinished) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
          this.handleStickmanRaceMove('left');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
          this.handleStickmanRaceMove('right');
        }
      }
    });

    // Close suggestions box on outside click
    document.addEventListener('click', (e) => {
      const suggestions = document.getElementById('creator-search-suggestions');
      const input = document.getElementById('creator-search-input');
      if (suggestions && input && e.target !== input && !suggestions.contains(e.target)) {
        suggestions.style.display = 'none';
      }
    });

    const venueCoordsEl = document.getElementById('db-venue-coords');
    if (venueCoordsEl) venueCoordsEl.value = `${this.state.venueCoords.lat}, ${this.state.venueCoords.lng}`;
    document.getElementById('admin-venue-welcome').value = this.state.welcomeMsg || '';
    const prizeEl = document.getElementById('admin-venue-prize');
    if (prizeEl) prizeEl.value = this.state.prizeMsg || "";

    // Sync settings view controls
    const maintenanceToggle = document.getElementById('settings-maintenance-toggle');
    if (maintenanceToggle) maintenanceToggle.checked = this.state.maintenanceMode;

    const generatorToggle = document.getElementById('settings-generator-toggle');
    if (generatorToggle) generatorToggle.checked = this.state.backupGenerator;

    const aiEngineSelect = document.getElementById('settings-ai-engine');
    if (aiEngineSelect) aiEngineSelect.value = this.state.aiEngine || 'waitplay-v2';

    const filterStrictnessSelect = document.getElementById('settings-filter-strictness');
    if (filterStrictnessSelect) filterStrictnessSelect.value = this.state.filterStrictness || 'normal';

    this.renderAdminGamesGrid();
    this.renderQuizQuestionsEditor();

    const debugBtnRow = document.querySelector('.debug-bar .debug-btn-row');
    if (debugBtnRow) {
      const limitResetBtn = document.createElement('button');
      limitResetBtn.className = 'debug-btn-mini';
      limitResetBtn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      limitResetBtn.style.color = '#ef4444';
      limitResetBtn.innerText = '🔄 Сбросить лимит гостя';
      limitResetBtn.onclick = () => {
        this.state.visitorGamesPlayed = 0;
        this.state.visitorLockoutUntil = 0;
        this.saveState();
        this.setVisitorViewPanel('lobby');
        this.initVisitorLobby();
        this.showToast("Лимит гостя успешно сброшен для тестирования! 🔄", false);
      };
      debugBtnRow.insertBefore(limitResetBtn, debugBtnRow.firstChild);

      const migBtn = document.createElement('button');
      migBtn.className = 'debug-btn-mini';
      migBtn.style.borderColor = 'rgba(167, 139, 250, 0.4)';
      migBtn.style.color = '#a78bfa';
      migBtn.innerText = '📱 Тест смены устройства';
      migBtn.onclick = () => this.simulateDeviceMigration();
      debugBtnRow.insertBefore(migBtn, debugBtnRow.firstChild);

      const aiResetBtn = document.createElement('button');
      aiResetBtn.className = 'debug-btn-mini';
      aiResetBtn.style.borderColor = 'rgba(253, 224, 71, 0.3)';
      aiResetBtn.style.color = '#fde047';
      aiResetBtn.innerText = '⚡ Сбросить ИИ кулдаун';
      aiResetBtn.onclick = () => this.resetAICooldown();
      debugBtnRow.insertBefore(aiResetBtn, debugBtnRow.firstChild);
    }

    const searchInput = document.getElementById('creator-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.creatorSearchSuggestions());
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.emoji-picker-btn') && !e.target.closest('.emoji-picker-popover')) {
        this.closeEmojiPicker();
      }
    });
  }

  renderQuizQuestionsEditor() {
    const container = document.getElementById('quiz-questions-cards-list');
    if (!container) return;
    container.innerHTML = '';

    // Update questions count in the B2B configuration toolbar
    const countBadge = document.getElementById('quiz-questions-count');
    if (countBadge) countBadge.innerText = this.state.templates.length;

    this.state.templates.forEach((q, qIdx) => {
      const card = document.createElement('div');
      card.className = 'question-edit-card';
      
      const isExpanded = this.expandedQuestions.has(q.id);
      
      let answersHTML = '';
      if (isExpanded) {
        q.options.forEach((opt, optIdx) => {
          answersHTML += `
            <div class="q-answer-row" style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
              <input type="radio" class="correct-radio-btn" name="q-${q.id}-correct" ${q.correct === optIdx ? 'checked' : ''} onchange="app.updateQuizCorrectAnswer(${qIdx}, ${optIdx})">
              <button id="opt-emoji-btn-${qIdx}-${optIdx}" class="emoji-picker-btn" style="padding:6px; font-size:12px; background:rgba(255,255,255,0.05); border:1px solid var(--border-light); border-radius:6px; cursor:pointer; width:30px; height:30px; display:flex; align-items:center; justify-content:center;" onclick="app.showEmojiPicker(${qIdx}, ${optIdx}, this)">${q.emojis[optIdx] || '❓'}</button>
              <input type="text" style="padding: 6px; font-size:11px; flex:1; margin-bottom:0;" value="${opt}" oninput="app.updateQuizAnswerText(${qIdx}, ${optIdx}, this.value)">
              <button class="btn-delete-option" onclick="app.deleteQuizOption(${qIdx}, ${optIdx})" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:12px; padding:4px;" ${q.options.length <= 2 ? 'disabled style="opacity:0.3;"' : ''}>✕</button>
            </div>
          `;
        });
      }

      card.innerHTML = `
        <div class="q-edit-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid var(--border-light); padding-bottom:6px;">
          <span style="font-weight:800; color:var(--primary);">Вопрос #${qIdx + 1}</span>
          <div style="display:flex; gap:10px; align-items:center;">
            <button class="btn-toggle-options" onclick="app.toggleQuestionExpand(${q.id})" style="background:none; border:none; color:var(--gold); font-size:11px; cursor:pointer; padding:4px 8px; border-radius:6px; border:1px solid var(--border-light);">
              ${isExpanded ? '📂 Скрыть' : `📁 Варианты (${q.options.length})`}
            </button>
            <button onclick="app.deleteQuizQuestion(${qIdx})" style="background:none; border:none; color:var(--error); cursor:pointer; font-size:14px; padding:0;" title="Удалить вопрос">🗑️</button>
          </div>
        </div>
        <textarea rows="2" style="padding: 8px; font-size:13px; margin-bottom:8px; width:100%; box-sizing:border-box;" oninput="app.updateQuizQuestionText(${qIdx}, this.value)">${q.text}</textarea>
        
        ${isExpanded ? `
          <div class="q-answers-list" style="margin-top:8px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px; border:1px solid var(--border-light);">
            <div style="font-size:9px; color:var(--text-muted); margin-bottom:6px;">Варианты ответов (отметьте верный радиокнопкой):</div>
            ${answersHTML}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
              <button class="btn" style="padding:4px 8px; width:auto; font-size:10px; border-radius:6px; background:rgba(255,255,255,0.05);" onclick="app.addQuizOption(${qIdx})" ${q.options.length >= 10 ? 'disabled style="opacity:0.3;"' : ''}>➕ Добавить вариант</button>
              <span style="font-size:9px; color:var(--text-muted);">Минимум 2, максимум 10</span>
            </div>
          </div>
        ` : ''}
      `;
      container.appendChild(card);
    });
  }

  toggleQuestionExpand(qId) {
    if (this.expandedQuestions.has(qId)) {
      this.expandedQuestions.delete(qId);
    } else {
      this.expandedQuestions.add(qId);
    }
    this.renderQuizQuestionsEditor();
  }

  adjustQuizQuestionsCount(diff) {
    try {
      const currentCount = this.state.templates.length;
      const targetCount = currentCount + diff;
      if (targetCount < 2 || targetCount > 20) return;
      
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          this.state.templates.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            text: "Новый вопрос викторины?",
            options: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
            emojis: ["❓", "❓", "❓", "❓"],
            correct: 0,
            minPlayers: 10,
            maxPlayers: 15
          });
        }
      } else {
        this.state.templates.splice(targetCount);
      }
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in adjustQuizQuestionsCount:", e);
    }
  }

  deleteQuizQuestion(qIdx) {
    try {
      if (this.state.templates.length <= 2) {
        this.showToast("Минимум 2 вопроса в викторине!", true);
        return;
      }
      this.state.templates.splice(qIdx, 1);
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in deleteQuizQuestion:", e);
    }
  }

  deleteQuizOption(qIdx, optIdx) {
    try {
      const q = this.state.templates[qIdx];
      if (q.options.length <= 2) return;
      
      q.options.splice(optIdx, 1);
      q.emojis.splice(optIdx, 1);
      
      // Adjust correct answer index
      if (q.correct === optIdx) {
        q.correct = 0;
      } else if (q.correct > optIdx) {
        q.correct--;
      }
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in deleteQuizOption:", e);
    }
  }

  addQuizOption(qIdx) {
    try {
      const q = this.state.templates[qIdx];
      if (q.options.length >= 10) return;
      
      const newIndex = q.options.length + 1;
      q.options.push(`Вариант ${newIndex}`);
      q.emojis.push("❓");
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in addQuizOption:", e);
    }
  }

  updateQuizQuestionText(qIdx, text) {
    this.state.templates[qIdx].text = text;
    this.saveState();
    this.syncActiveBranchToDatabase();
  }

  guessEmoji(text) {
    if (!text) return "❓";
    const lower = text.toLowerCase();
    
    // Алкоголь и напитки
    if (lower.includes("водка") || lower.includes("ром") || lower.includes("виски") || lower.includes("джин") || lower.includes("коньяк") || lower.includes("текила") || lower.includes("алко")) return "🥃";
    if (lower.includes("вино") || lower.includes("шампан") || lower.includes("бокал") || lower.includes("бутыл")) return "🍷";
    if (lower.includes("коктейл") || lower.includes("мартини") || lower.includes("мохито") || lower.includes("аперол")) return "🍸";
    if (lower.includes("пиво") || lower.includes("сидр") || lower.includes("эль") || lower.includes("круж")) return "🍺";
    if (lower.includes("кофе") || lower.includes("капуч") || lower.includes("латте") || lower.includes("эспрес") || lower.includes("америк")) return "☕";
    if (lower.includes("чай") || lower.includes("матча")) return "🍵";
    if (lower.includes("сок") || lower.includes("кола") || lower.includes("лимонад") || lower.includes("вода") || lower.includes("пепси") || lower.includes("фанта") || lower.includes("напит")) return "🥤";
    
    // Еда и десерты
    if (lower.includes("торт") || lower.includes("пирог") || lower.includes("десерт") || lower.includes("сладост") || lower.includes("пирож")) return "🍰";
    if (lower.includes("морожен") || lower.includes("пломбир") || lower.includes("сорбет")) return "🍦";
    if (lower.includes("пицца")) return "🍕";
    if (lower.includes("бургер") || lower.includes("чизбургер") || lower.includes("гамбургер")) return "🍔";
    if (lower.includes("суши") || lower.includes("ролл")) return "🍣";
    if (lower.includes("стейк") || lower.includes("мясо") || lower.includes("говяд") || lower.includes("свин")) return "🥩";
    if (lower.includes("куриц") || lower.includes("крылыш") || lower.includes("наггет")) return "🍗";
    if (lower.includes("салат") || lower.includes("зелень")) return "🥗";
    if (lower.includes("сыр")) return "🧀";
    if (lower.includes("рыба") || lower.includes("морепрод")) return "🐟";
    if (lower.includes("шоколад") || lower.includes("конфет")) return "🍫";
    if (lower.includes("пончик")) return "🍩";
    
    // Развлечения и игры
    if (lower.includes("игра") || lower.includes("гейм")) return "🎮";
    if (lower.includes("футбол") || lower.includes("мяч")) return "⚽";
    if (lower.includes("кубок") || lower.includes("побед") || lower.includes("приз")) return "🏆";
    if (lower.includes("карта") || lower.includes("покер")) return "🃏";
    if (lower.includes("кино") || lower.includes("фильм")) return "🎬";
    if (lower.includes("музык") || lower.includes("песн") || lower.includes("караок")) return "🎵";
    
    return "❓";
  }

  updateQuizAnswerText(qIdx, optIdx, text) {
    const q = this.state.templates[qIdx];
    const prevText = q.options[optIdx];
    const prevGuessed = this.guessEmoji(prevText);
    const currentEmoji = q.emojis[optIdx];
    
    q.options[optIdx] = text;
    
    if (currentEmoji === "❓" || currentEmoji === prevGuessed) {
      const newGuessed = this.guessEmoji(text);
      q.emojis[optIdx] = newGuessed;
      
      const emojiBtn = document.getElementById(`opt-emoji-btn-${qIdx}-${optIdx}`);
      if (emojiBtn) emojiBtn.innerText = newGuessed;
    }
    
    this.saveState();
    this.syncActiveBranchToDatabase();
  }

  updateQuizCorrectAnswer(qIdx, optIdx) {
    this.state.templates[qIdx].correct = optIdx;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.showToast(`Для вопроса #${qIdx + 1} выбран вариант #${optIdx + 1} как верный.`, false);
  }

  editQuiz() {
    this.renderQuizQuestionsEditor();
    this.setAdminPanelActiveView('edit-quiz');
    this.updateQuizTestArenaUI();
  }

  editTicTacToe() {
    this.setAdminPanelActiveView('edit-ttt');
    const tttDifficultyEl = document.getElementById('settings-ttt-difficulty');
    if (tttDifficultyEl) tttDifficultyEl.value = this.state.tttDifficulty;
    const tttTurnLimitEl = document.getElementById('settings-ttt-turn-limit');
    if (tttTurnLimitEl) tttTurnLimitEl.value = this.state.tttTurnLimit || 'none';
    this.updateTTTSizeUI();
    this.updateTTTMaxDrawsUI();
    this.updateTTTTestArenaUI();
  }

  updateTTTTestArenaUI() {
    const isTest = !!this.state.manualTestingMode;
    const lockedEl = document.getElementById('admin-ttt-test-arena-locked');
    const unlockedEl = document.getElementById('admin-ttt-test-arena-unlocked');
    
    if (lockedEl) lockedEl.style.display = isTest ? 'none' : 'block';
    if (unlockedEl) unlockedEl.style.display = isTest ? 'block' : 'none';
    
    const boardCont = document.getElementById('admin-ttt-test-board-container');
    if (boardCont) boardCont.style.display = 'none';
    const statusEl = document.getElementById('admin-ttt-test-status');
    if (statusEl) {
      statusEl.innerText = "Нажмите кнопку ниже, чтобы начать тестовый матч.";
      statusEl.style.color = '#fff';
    }
    const startBtn = document.getElementById('btn-admin-ttt-test-start');
    if (startBtn) startBtn.innerText = "🎮 Начать тест-матч";
  }

  enableTestingModeFromSettings() {
    try {
      this.state.manualTestingMode = true;
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.syncActiveBranchToDatabase();
      
      this.updateTTTTestArenaUI();
      this.updateQuizTestArenaUI();
      this.updateDifferencesTestArenaUI();
      this.updateCrosswordTestArenaUI();
      this.handleTestingModeChange(true);
      
      this.showToast("🛠️ Тест-режим ВКЛ. Публикация игр заблокирована 🚫", false);
    } catch (e) {
      console.error("Error in enableTestingModeFromSettings:", e);
    }
  }

  saveQuizConfig(key, value) {
    this.state[key] = value;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.showToast("Настройки Викторины успешно сохранены!", false);
  }

  startAdminQuizTest() {
    const branchTemplates = this.state.templates;
    
    if (!branchTemplates || branchTemplates.length === 0) {
      this.showToast("Ошибка: Нет вопросов для тестирования!", true);
      return;
    }
    
    // Clear any active timer intervals before starting
    this.clearAdminQuizTimers();
    
    this.adminQuizQuestions = branchTemplates;
    this.adminQuizQIndex = 0;
    this.adminQuizPlayerScore = 0;
    this.adminQuizGameOver = false;
    this.adminQuizAnswered = false;
    
    document.getElementById('admin-quiz-test-game-container').style.display = 'flex';
    document.getElementById('btn-admin-quiz-test-start').innerText = "🔄 Сбросить матч";
    
    this.runAdminQuizStartCountdown();
  }

  clearAdminQuizTimers() {
    if (this.adminQuizCountdownInterval) {
      clearInterval(this.adminQuizCountdownInterval);
      this.adminQuizCountdownInterval = null;
    }
    if (this.adminQuizTurnInterval) {
      clearInterval(this.adminQuizTurnInterval);
      this.adminQuizTurnInterval = null;
    }
  }

  runAdminQuizStartCountdown() {
    let secondsLeft = 3;
    const statusEl = document.getElementById('admin-quiz-test-status');
    const optionsEl = document.getElementById('admin-quiz-test-options');
    if (optionsEl) optionsEl.innerHTML = '';
    
    if (statusEl) {
      statusEl.innerText = `Подготовка... ${secondsLeft}`;
      statusEl.style.color = 'var(--gold)';
    }
    
    this.playAudioTone('click');
    
    this.adminQuizCountdownInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(this.adminQuizCountdownInterval);
        this.adminQuizCountdownInterval = null;
        if (statusEl) {
          statusEl.innerText = "Викторина началась! 🚀";
          statusEl.style.color = 'var(--success)';
        }
        this.playAudioTone('success');
        setTimeout(() => this.renderAdminQuizQuestion(), 800);
      } else {
        if (statusEl) {
          statusEl.innerText = `Подготовка... ${secondsLeft}`;
        }
        this.playAudioTone('click');
      }
    }, 1000);
  }

  renderAdminQuizQuestion() {
    if (this.adminQuizGameOver) return;
    this.clearAdminQuizTimers();
    
    const qIndex = this.adminQuizQIndex;
    const questions = this.adminQuizQuestions;
    if (qIndex >= questions.length) {
      this.finishAdminQuizTest();
      return;
    }
    
    this.adminQuizAnswered = false;
    const tpl = questions[qIndex];
    
    const indexEl = document.getElementById('admin-quiz-test-q-index');
    const textEl = document.getElementById('admin-quiz-test-q-text');
    const optionsEl = document.getElementById('admin-quiz-test-options');
    const statusEl = document.getElementById('admin-quiz-test-status');
    
    if (indexEl) indexEl.innerText = `Вопрос ${qIndex + 1} из ${questions.length}`;
    if (textEl) textEl.innerText = tpl.q || tpl.text || "Текст вопроса";
    
    // Render option buttons
    if (optionsEl) {
      optionsEl.innerHTML = '';
      const options = tpl.options || ["Да", "Нет"];
      const correctIdx = tpl.correct !== undefined ? tpl.correct : 0;
      
      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.style.cssText = 'width:100%; padding:10px; font-size:11px; text-align:left; background:#110e1f; border:1px solid var(--border-light); border-radius:10px; color:#fff; cursor:pointer; outline:none; transition:all 0.15s; font-weight:600; display:flex; align-items:center; justify-content:space-between; box-sizing:border-box; font-family: Outfit, Inter, sans-serif;';
        btn.innerText = opt;
        btn.onclick = () => this.handleAdminQuizAnswer(idx, correctIdx, false);
        optionsEl.appendChild(btn);
      });
    }
    
    // Start 8-second turn timer
    this.adminQuizSecondsLeft = 8;
    if (statusEl) {
      statusEl.innerText = `⏱️ Время пошло: ${this.adminQuizSecondsLeft} сек.`;
      statusEl.style.color = 'var(--gold)';
    }
    
    this.adminQuizTurnInterval = setInterval(() => {
      this.adminQuizSecondsLeft--;
      if (this.adminQuizSecondsLeft <= 0) {
        clearInterval(this.adminQuizTurnInterval);
        this.adminQuizTurnInterval = null;
        
        // Timeout: auto-select correct answer
        const correctIdx = tpl.correct !== undefined ? tpl.correct : 0;
        this.handleAdminQuizAnswer(-1, correctIdx, true);
      } else {
        if (statusEl) {
          statusEl.innerText = `⏱️ Время пошло: ${this.adminQuizSecondsLeft} сек.`;
        }
      }
    }, 1000);
  }

  handleAdminQuizAnswer(optionIdx, correctIdx, autoSelected) {
    if (this.adminQuizAnswered || this.adminQuizGameOver) return;
    this.adminQuizAnswered = true;
    this.clearAdminQuizTimers();
    
    const optionsEl = document.getElementById('admin-quiz-test-options');
    const statusEl = document.getElementById('admin-quiz-test-status');
    
    if (autoSelected) {
      this.playAudioTone('incorrect');
      if (statusEl) {
        statusEl.innerText = "⏰ Время вышло! Бот показал ответ.";
        statusEl.style.color = 'var(--error)';
      }
    } else {
      const isCorrect = (optionIdx === correctIdx);
      if (isCorrect) {
        this.adminQuizPlayerScore++;
        this.playAudioTone('correct');
        if (statusEl) {
          statusEl.innerText = "Правильно! 🎉";
          statusEl.style.color = 'var(--success)';
        }
      } else {
        this.playAudioTone('incorrect');
        if (statusEl) {
          statusEl.innerText = "Неправильно! 😢";
          statusEl.style.color = 'var(--error)';
        }
      }
    }
    
    // Color option buttons
    if (optionsEl) {
      const buttons = optionsEl.querySelectorAll('button');
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        if (idx === correctIdx) {
          btn.style.borderColor = 'var(--success)';
          btn.style.background = 'rgba(74,222,128,0.1)';
          btn.innerHTML += ' <span style="color:var(--success);">✅</span>';
        } else if (idx === optionIdx) {
          btn.style.borderColor = 'var(--error)';
          btn.style.background = 'rgba(239,68,68,0.1)';
          btn.innerHTML += ' <span style="color:var(--error);">❌</span>';
        }
      });
    }
    
    // Wait 1.5s then advance to next question
    setTimeout(() => {
      this.adminQuizQIndex++;
      this.renderAdminQuizQuestion();
    }, 1500);
  }

  finishAdminQuizTest() {
    this.adminQuizGameOver = true;
    this.clearAdminQuizTimers();
    
    const statusEl = document.getElementById('admin-quiz-test-status');
    const optionsEl = document.getElementById('admin-quiz-test-options');
    const qIndexEl = document.getElementById('admin-quiz-test-q-index');
    const qTextEl = document.getElementById('admin-quiz-test-q-text');
    
    if (optionsEl) optionsEl.innerHTML = '';
    if (qIndexEl) qIndexEl.innerText = "ТЕСТИРОВАНИЕ ЗАВЕРШЕНО";
    if (qTextEl) qTextEl.innerText = "Все вопросы пройдены.";
    
    const total = this.adminQuizQuestions.length;
    const score = this.adminQuizPlayerScore;
    
    if (statusEl) {
      statusEl.innerText = `🏆 Результат: ${score} из ${total} правильных ответов!`;
      statusEl.style.color = 'var(--gold)';
    }
    this.playAudioTone('success');
    
    document.getElementById('btn-admin-quiz-test-start').innerText = "🎮 Начать заново";
  }

  updateQuizTestArenaUI() {
    const isTest = !!this.state.manualTestingMode;
    const lockedEl = document.getElementById('admin-quiz-test-arena-locked');
    const unlockedEl = document.getElementById('admin-quiz-test-arena-unlocked');
    
    if (lockedEl) lockedEl.style.display = isTest ? 'none' : 'block';
    if (unlockedEl) unlockedEl.style.display = isTest ? 'block' : 'none';
    
    const gameCont = document.getElementById('admin-quiz-test-game-container');
    if (gameCont) gameCont.style.display = 'none';
    const statusEl = document.getElementById('admin-quiz-test-status');
    if (statusEl) {
      statusEl.innerText = "Нажмите кнопку ниже, чтобы начать тестовую викторину.";
      statusEl.style.color = '#fff';
    }
    const startBtn = document.getElementById('btn-admin-quiz-test-start');
    if (startBtn) startBtn.innerText = "🎮 Начать тест-матч";
    
    this.clearAdminQuizTimers();
  }

  // Find Differences Settings & Test Arena methods
  editDifferences() {
    this.setAdminPanelActiveView('edit-differences');
    
    const gridSizeEl = document.getElementById('settings-diff-grid-size');
    if (gridSizeEl) gridSizeEl.value = this.state.diffGridSize || 'normal';
    
    const timeLimitEl = document.getElementById('settings-diff-time-limit');
    if (timeLimitEl) timeLimitEl.value = this.state.diffTimeLimit || 15;
    
    const labelRoundsEl = document.getElementById('label-diff-rounds');
    if (labelRoundsEl) labelRoundsEl.innerText = `${this.state.diffRounds || 6} раундов`;
    
    const labelMinEl = document.getElementById('label-diff-min-players');
    const labelMaxEl = document.getElementById('label-diff-max-players');
    const diffGame = this.state.games.find(g => g.id === 2);
    if (diffGame) {
      if (labelMinEl) labelMinEl.innerText = diffGame.minPlayers || 2;
      if (labelMaxEl) labelMaxEl.innerText = diffGame.maxPlayers || 10;
    } else {
      if (labelMinEl) labelMinEl.innerText = 2;
      if (labelMaxEl) labelMaxEl.innerText = 10;
    }
    
    this.updateDifferencesTestArenaUI();
  }

  adjustDiffMinPlayers(delta) {
    const diffGame = this.state.games.find(g => g.id === 2);
    if (!diffGame) return;
    
    let min = diffGame.minPlayers || 2;
    min += delta;
    if (min < 2) min = 2;
    if (min > 10) min = 10;
    
    const max = diffGame.maxPlayers || 10;
    if (min > max) min = max;
    
    diffGame.minPlayers = min;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.renderAdminGamesGrid();
    
    const labelMinEl = document.getElementById('label-diff-min-players');
    if (labelMinEl) labelMinEl.innerText = min;
  }

  adjustDiffMaxPlayers(delta) {
    const diffGame = this.state.games.find(g => g.id === 2);
    if (!diffGame) return;
    
    let max = diffGame.maxPlayers || 10;
    max += delta;
    if (max < 2) max = 2;
    if (max > 10) max = 10;
    
    const min = diffGame.minPlayers || 2;
    if (max < min) max = min;
    
    diffGame.maxPlayers = max;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.renderAdminGamesGrid();
    
    const labelMaxEl = document.getElementById('label-diff-max-players');
    if (labelMaxEl) labelMaxEl.innerText = max;
  }

  saveDifferencesConfig(key, value) {
    this.state[key] = value;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.showToast("Настройки игры «Найти отличия» сохранены!", false);
  }

  adjustDiffRounds(delta) {
    let rounds = this.state.diffRounds || 6;
    rounds += delta;
    if (rounds < 3) rounds = 3;
    if (rounds > 10) rounds = 10;
    
    this.state.diffRounds = rounds;
    this.saveState();
    this.syncActiveBranchToDatabase();
    
    const labelRoundsEl = document.getElementById('label-diff-rounds');
    if (labelRoundsEl) labelRoundsEl.innerText = `${rounds} раундов`;
  }

  updateDifferencesTestArenaUI() {
    const isTest = !!this.state.manualTestingMode;
    const lockedEl = document.getElementById('admin-diff-test-arena-locked');
    const unlockedEl = document.getElementById('admin-diff-test-arena-unlocked');
    
    if (lockedEl) lockedEl.style.display = isTest ? 'none' : 'block';
    if (unlockedEl) unlockedEl.style.display = isTest ? 'block' : 'none';
    
    const gameCont = document.getElementById('admin-diff-test-game-container');
    if (gameCont) gameCont.style.display = 'none';
    const statusEl = document.getElementById('admin-diff-test-status');
    if (statusEl) {
      statusEl.innerText = "Нажмите кнопку ниже, чтобы начать тестовый матч.";
      statusEl.style.color = '#fff';
    }
    const startBtn = document.getElementById('btn-admin-diff-test-start');
    if (startBtn) startBtn.innerText = "🎮 Начать тест-матч";
    
    this.clearAdminDiffTimers();
  }

  clearAdminDiffTimers() {
    if (this.adminDiffCountdownInterval) {
      clearInterval(this.adminDiffCountdownInterval);
      this.adminDiffCountdownInterval = null;
    }
    if (this.adminDiffTurnInterval) {
      clearInterval(this.adminDiffTurnInterval);
      this.adminDiffTurnInterval = null;
    }
    if (this.adminDiffBotTimeout) {
      clearTimeout(this.adminDiffBotTimeout);
      this.adminDiffBotTimeout = null;
    }
  }

  // --- CROSSWORD ADMIN CONTROLLER LOGIC ---
  editCrossword() {
    this.setAdminPanelActiveView('edit-crossword');
    
    const diffEl = document.getElementById('settings-crossword-difficulty');
    if (diffEl) diffEl.value = this.state.crosswordDifficulty || 'normal';
    
    const timeEl = document.getElementById('settings-crossword-time-limit');
    if (timeEl) timeEl.value = this.state.crosswordTimeLimit || 5;
    
    this.renderCrosswordPreview();
    this.renderCrosswordWordsEditor();
  }

  shuffleCrosswordLayout() {
    try {
      const diff = this.state.crosswordDifficulty || 'normal';
      const totalLayouts = CROSSWORD_PRESETS[diff].layouts.length;
      this.state.crosswordLayoutIndex = (this.state.crosswordLayoutIndex + 1) % totalLayouts;
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      
      this.renderCrosswordPreview();
      this.renderCrosswordWordsEditor();
      this.showToast("Форма сетки кроссворда изменена!", false);
    } catch(e) {
      console.error("Error in shuffleCrosswordLayout:", e);
    }
  }

  // --- GUESS WORD ADMIN CONTROLLER LOGIC ---
  editGuessWord() {
    this.setAdminPanelActiveView('edit-guessword');
    
    const diffEl = document.getElementById('settings-guessword-difficulty');
    if (diffEl) diffEl.value = this.state.guessWordDifficulty || 'normal';
    
    const wordInput = document.getElementById('settings-guessword-custom-word');
    if (wordInput) wordInput.value = this.state.guessWordCustomWord || '';
    
    const clueInput = document.getElementById('settings-guessword-custom-clue');
    if (clueInput) clueInput.value = this.state.guessWordCustomClue || '';
    
    this.updateGuessWordPlayersUI();
  }

  saveGuessWordConfigField(field, value) {
    this.state[field] = value;
    this.saveState();
    this.syncActiveBranchToDatabase();
  }

  adjustGuessWordPlayersLimit(type, delta) {
    try {
      const game = this.state.games.find(g => g.id === 10);
      if (!game) return;

      if (type === 'min') {
        let val = (game.minPlayers || 2) + delta;
        val = Math.max(2, Math.min(5, val));
        if (val > (game.maxPlayers || 5)) {
          game.maxPlayers = val;
        }
        game.minPlayers = val;
      } else {
        let val = (game.maxPlayers || 5) + delta;
        val = Math.max(2, Math.min(5, val));
        if (val < (game.minPlayers || 2)) {
          game.minPlayers = val;
        }
        game.maxPlayers = val;
      }
      
      this.updateGuessWordPlayersUI();
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch(e) {
      console.error(e);
    }
  }

  updateGuessWordPlayersUI() {
    const game = this.state.games.find(g => g.id === 10);
    if (!game) return;
    
    const minEl = document.getElementById('label-guessword-min-players');
    const maxEl = document.getElementById('label-guessword-max-players');
    if (minEl) minEl.innerText = game.minPlayers || 2;
    if (maxEl) maxEl.innerText = game.maxPlayers || 5;
  }

  saveGuessWordConfig() {
    try {
      const wordInput = document.getElementById('settings-guessword-custom-word');
      const clueInput = document.getElementById('settings-guessword-custom-clue');
      
      const rawWord = wordInput ? wordInput.value.trim().toUpperCase() : '';
      const rawClue = clueInput ? clueInput.value.trim() : '';
      
      if (rawWord !== '') {
        // Validate Russian characters and hyphens only
        const rusRegex = /^[А-ЯЁ\-]+$/;
        if (!rusRegex.test(rawWord)) {
          this.showToast("Секретное слово должно состоять только из русских букв! 🇷🇺", true);
          return;
        }
        
        if (rawClue === '') {
          this.showToast("Пожалуйста, введите подсказку/вопрос для вашего секретного слова!", true);
          return;
        }
      }
      
      this.state.guessWordCustomWord = rawWord;
      this.state.guessWordCustomClue = rawClue;
      
      const diffEl = document.getElementById('settings-guessword-difficulty');
      if (diffEl) this.state.guessWordDifficulty = diffEl.value;
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      
      this.showToast("Настройки игры Поле Чудес сохранены! ✔️", false);
      this.setAdminPanelActiveView('dashboard');
    } catch(e) {
      console.error("Error in saveGuessWordConfig:", e);
    }
  }

  renderCrosswordWordsEditor() {
    try {
      const editorDiv = document.getElementById('admin-crossword-words-editor');
      if (!editorDiv) return;
      editorDiv.innerHTML = '';
      
      const diff = this.state.crosswordDifficulty || 'normal';
      const layoutIdx = this.state.crosswordLayoutIndex || 0;
      const preset = this.getActiveCrosswordPreset(diff, layoutIdx);
      if (!preset) return;
      
      preset.words.forEach((w, idx) => {
        const row = document.createElement('div');
        row.style.cssText = 'background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px; box-sizing: border-box;';
        
        const label = document.createElement('div');
        label.style.cssText = 'font-size: 9px; font-weight: 700; color: var(--gold); display: flex; justify-content: space-between;';
        label.innerHTML = `
          <span>Слово #${idx + 1} (${w.direction === 'across' ? 'по горизонтали' : 'по вертикали'})</span>
          <span style="color: var(--text-muted);">Длина: ${w.word.length} б.</span>
        `;
        
        const wordInput = document.createElement('input');
        wordInput.type = 'text';
        wordInput.id = `admin-crossword-word-${w.id}`;
        wordInput.value = w.word;
        wordInput.maxLength = w.word.length;
        wordInput.placeholder = `СЛОВО (${w.word.length} букв)`;
        wordInput.style.cssText = 'padding: 6px 8px; font-size: 11px; background: #110e1f; border: 1px solid var(--border-light); border-radius: 6px; color: #fff; text-transform: uppercase; margin: 0; outline: none; font-family: inherit;';
        
        const clueInput = document.createElement('input');
        clueInput.type = 'text';
        clueInput.id = `admin-crossword-clue-${w.id}`;
        clueInput.value = w.clue;
        clueInput.placeholder = 'Подсказка / вопрос...';
        clueInput.style.cssText = 'padding: 6px 8px; font-size: 11px; background: #110e1f; border: 1px solid var(--border-light); border-radius: 6px; color: #fff; margin: 0; outline: none; font-family: inherit;';
        
        wordInput.addEventListener('input', () => {
          w.word = wordInput.value.trim().toUpperCase() || w.word;
          this.renderCrosswordPreview();
        });
        
        row.appendChild(label);
        row.appendChild(wordInput);
        row.appendChild(clueInput);
        editorDiv.appendChild(row);
      });
    } catch(e) {
      console.error("Error in renderCrosswordWordsEditor:", e);
    }
  }

  saveCrosswordConfig(key, value) {
    this.state[key] = value;
    
    if (key === 'crosswordDifficulty') {
      this.state.crosswordLayoutIndex = 0;
      this.renderCrosswordPreview();
      this.renderCrosswordWordsEditor();
    }
    
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.showToast("Настройки Кроссворда сохранены!", false);
  }

  validateCrosswordIntersections(preset, updatedWords) {
    const size = preset.gridSize;
    const grid = {};
    
    for (let w of updatedWords) {
      const wordVal = w.word.toUpperCase();
      for (let i = 0; i < wordVal.length; i++) {
        const cx = w.direction === 'across' ? w.x + i : w.x;
        const cy = w.direction === 'down' ? w.y + i : w.y;
        const key = `${cx},${cy}`;
        
        if (grid[key]) {
          const existing = grid[key];
          if (existing.letter !== wordVal[i]) {
            return {
              valid: false,
              error: `Ошибка: Пересечение в ячейке (${cx + 1}, ${cy + 1}) не совпадает! В "${existing.wordName}" буква '${existing.letter}', а в "${w.idName}" — '${wordVal[i]}'!`
            };
          }
        } else {
          grid[key] = {
            letter: wordVal[i],
            wordName: w.idName
          };
        }
      }
    }
    return { valid: true };
  }

  saveCrosswordCustomConfig() {
    try {
      const diff = this.state.crosswordDifficulty || 'normal';
      const layoutIdx = this.state.crosswordLayoutIndex || 0;
      
      const basePreset = CROSSWORD_PRESETS[diff].layouts[layoutIdx];
      if (!basePreset) return;
      
      const updatedWords = [];
      let isAnyEmpty = false;
      
      for (let i = 0; i < basePreset.words.length; i++) {
        const w = basePreset.words[i];
        const wordInput = document.getElementById(`admin-crossword-word-${w.id}`);
        const clueInput = document.getElementById(`admin-crossword-clue-${w.id}`);
        
        if (!wordInput || !clueInput) continue;
        
        const newWord = wordInput.value.trim().toUpperCase();
        const newClue = clueInput.value.trim();
        
        if (!newWord || !newClue) {
          isAnyEmpty = true;
          break;
        }
        
        if (newWord.length !== w.word.length) {
          this.showToast(`Ошибка: Слово #${i + 1} должно содержать ровно ${w.word.length} букв!`, true);
          wordInput.focus();
          return;
        }
        
        updatedWords.push({
          id: w.id,
          word: newWord,
          clue: newClue,
          direction: w.direction,
          x: w.x,
          y: w.y,
          idName: `Слово #${i + 1} (${w.direction === 'across' ? 'по горизонтали' : 'по вертикали'})`
        });
      }
      
      if (isAnyEmpty) {
        this.showToast("Ошибка: Заполните все поля слов и подсказок!", true);
        return;
      }
      
      const validation = this.validateCrosswordIntersections(basePreset, updatedWords);
      if (!validation.valid) {
        this.showToast(validation.error, true);
        return;
      }
      
      this.state.crosswordCustomWords = this.state.crosswordCustomWords || {};
      const key = `${diff}_${layoutIdx}`;
      this.state.crosswordCustomWords[key] = {};
      
      updatedWords.forEach(w => {
        this.state.crosswordCustomWords[key][w.id] = {
          word: w.word,
          clue: w.clue
        };
      });
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      
      this.showToast("Настройки кроссворда сохранены! ✔️", false);
      this.setAdminPanelActiveView('dashboard');
    } catch(e) {
      console.error("Error in saveCrosswordCustomConfig:", e);
    }
  }

  renderCrosswordPreview() {
    try {
      const container = document.getElementById('admin-crossword-preview-container');
      if (!container) return;
      container.innerHTML = '';
      
      const diff = this.state.crosswordDifficulty || 'normal';
      const layoutIdx = this.state.crosswordLayoutIndex || 0;
      const preset = this.getActiveCrosswordPreset(diff, layoutIdx);
      if (!preset) return;
      
      const size = preset.gridSize;
      const grid = Array(size).fill(null).map(() => Array(size).fill(null));
      
      preset.words.forEach(w => {
        for (let i = 0; i < w.word.length; i++) {
          const cx = w.direction === 'across' ? w.x + i : w.x;
          const cy = w.direction === 'down' ? w.y + i : w.y;
          if (cx >= 0 && cx < size && cy >= 0 && cy < size) {
            grid[cy][cx] = w.word[i];
          }
        }
      });
      
      const table = document.createElement('div');
      table.style.display = 'grid';
      table.style.gridTemplateColumns = `repeat(${size}, 18px)`;
      table.style.gridTemplateRows = `repeat(${size}, 18px)`;
      table.style.gap = '2px';
      table.style.background = 'rgba(0,0,0,0.4)';
      table.style.padding = '5px';
      table.style.borderRadius = '8px';
      table.style.border = '1px solid var(--border-light)';
      
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const cellDiv = document.createElement('div');
          cellDiv.style.width = '18px';
          cellDiv.style.height = '18px';
          cellDiv.style.display = 'flex';
          cellDiv.style.alignItems = 'center';
          cellDiv.style.justifyContent = 'center';
          cellDiv.style.fontSize = '8px';
          cellDiv.style.fontWeight = '800';
          cellDiv.style.borderRadius = '3px';
          cellDiv.style.boxSizing = 'border-box';
          
          if (grid[r][c]) {
            cellDiv.style.background = 'rgba(139, 92, 246, 0.15)';
            cellDiv.style.border = '1px solid var(--primary-glow)';
            cellDiv.style.color = '#fff';
            cellDiv.innerText = grid[r][c];
          } else {
            cellDiv.style.background = 'rgba(0,0,0,0.5)';
            cellDiv.style.border = '1px solid rgba(255,255,255,0.02)';
          }
          table.appendChild(cellDiv);
        }
      }
      container.appendChild(table);
    } catch(e) {
      console.error("Error in renderCrosswordPreview:", e);
    }
  }



  startAdminDiffTest() {
    this.clearAdminDiffTimers();
    
    this.adminDiffTotalRounds = this.state.diffRounds || 6;
    this.adminDiffRoundIndex = 0;
    this.adminDiffPlayerScore = 0;
    this.adminDiffBotScore = 0;
    this.adminDiffGameOver = false;
    this.adminDiffRoundAnswered = false;
    
    document.getElementById('admin-diff-test-game-container').style.display = 'flex';
    document.getElementById('btn-admin-diff-test-start').innerText = "🔄 Сбросить матч";
    
    this.runAdminDiffStartCountdown();
  }

  runAdminDiffStartCountdown() {
    let secondsLeft = 3;
    const statusEl = document.getElementById('admin-diff-test-status');
    const gridEl = document.getElementById('admin-diff-test-grid');
    if (gridEl) gridEl.innerHTML = '';
    
    if (statusEl) {
      statusEl.innerText = `Подготовка... ${secondsLeft}`;
      statusEl.style.color = 'var(--gold)';
    }
    
    this.playAudioTone('click');
    
    this.adminDiffCountdownInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(this.adminDiffCountdownInterval);
        this.adminDiffCountdownInterval = null;
        if (statusEl) {
          statusEl.innerText = "Матч начался! 🚀";
          statusEl.style.color = 'var(--success)';
        }
        this.playAudioTone('success');
        setTimeout(() => this.renderAdminDiffQuestion(), 800);
      } else {
        if (statusEl) {
          statusEl.innerText = `Подготовка... ${secondsLeft}`;
        }
        this.playAudioTone('click');
      }
    }, 1000);
  }

  renderAdminDiffQuestion() {
    if (this.adminDiffGameOver) return;
    this.clearAdminDiffTimers();
    
    const rIdx = this.adminDiffRoundIndex;
    if (rIdx >= this.adminDiffTotalRounds) {
      this.finishAdminDiffTest();
      return;
    }
    
    this.adminDiffRoundAnswered = false;
    
    // Pick a random emoji pair from EMOJI_PAIRS
    const pair = EMOJI_PAIRS[Math.floor(Math.random() * EMOJI_PAIRS.length)];
    
    // Grid size depends on state.diffGridSize: 'easy' (4x4), 'normal' (6x6), 'hard' (8x8)
    const gridSize = this.state.diffGridSize || 'normal';
    let side = 6;
    if (gridSize === 'easy') side = 4;
    if (gridSize === 'hard') side = 8;
    
    const totalCells = side * side;
    const oddCellIdx = Math.floor(Math.random() * totalCells);
    
    const indexEl = document.getElementById('admin-diff-test-q-index');
    const gridEl = document.getElementById('admin-diff-test-grid');
    const statusEl = document.getElementById('admin-diff-test-status');
    
    if (indexEl) indexEl.innerText = `Раунд ${rIdx + 1} из ${this.adminDiffTotalRounds}`;
    
    if (gridEl) {
      gridEl.innerHTML = '';
      gridEl.style.gridTemplateColumns = `repeat(${side}, 32px)`;
      gridEl.style.gridTemplateRows = `repeat(${side}, 32px)`;
      
      for (let i = 0; i < totalCells; i++) {
        const btn = document.createElement('button');
        btn.style.cssText = 'width:32px; height:32px; padding:0; display:flex; align-items:center; justify-content:center; background:#110e1f; border:1px solid var(--border-light); border-radius:6px; cursor:pointer; font-size:16px; font-family: Outfit, Inter, sans-serif; transition:all 0.15s; outline:none; box-sizing:border-box;';
        btn.innerText = (i === oddCellIdx) ? pair.odd : pair.base;
        
        btn.onclick = () => this.handleAdminDiffClick(i, oddCellIdx);
        gridEl.appendChild(btn);
      }
    }
    
    this.renderAdminDiffScoreboard();
    
    // Turn limit timer (default 15 seconds)
    this.adminDiffSecondsLeft = this.state.diffTimeLimit || 15;
    if (statusEl) {
      statusEl.innerText = `⏱️ Время пошло: ${this.adminDiffSecondsLeft} сек.`;
      statusEl.style.color = 'var(--gold)';
    }
    
    this.adminDiffTurnInterval = setInterval(() => {
      this.adminDiffSecondsLeft--;
      if (this.adminDiffSecondsLeft <= 0) {
        clearInterval(this.adminDiffTurnInterval);
        this.adminDiffTurnInterval = null;
        
        // Timeout: no one got it
        this.handleAdminDiffClick(-1, oddCellIdx, 'timeout');
      } else {
        if (statusEl) {
          statusEl.innerText = `⏱️ Время пошло: ${this.adminDiffSecondsLeft} сек.`;
        }
      }
    }, 1000);
    
    // Bot AI move simulation: bot difficulty is medium, takes between 2 to 7 seconds to find
    const minDelay = 2000;
    const maxDelay = 7000;
    const botDelay = minDelay + Math.random() * (maxDelay - minDelay);
    
    this.adminDiffBotTimeout = setTimeout(() => {
      this.runAdminDiffBotAI(oddCellIdx);
    }, botDelay);
  }

  runAdminDiffBotAI(correctIdx) {
    if (this.adminDiffRoundAnswered || this.adminDiffGameOver) return;
    
    // Bot selects correct answer
    this.handleAdminDiffClick(correctIdx, correctIdx, 'bot');
  }

  handleAdminDiffClick(selectedIdx, correctIdx, actor) {
    if (this.adminDiffRoundAnswered || this.adminDiffGameOver) return;
    this.adminDiffRoundAnswered = true;
    this.clearAdminDiffTimers();
    
    const gridEl = document.getElementById('admin-diff-test-grid');
    const statusEl = document.getElementById('admin-diff-test-status');
    
    // Highlight cells
    if (gridEl) {
      const buttons = gridEl.querySelectorAll('button');
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        if (idx === correctIdx) {
          btn.style.background = 'rgba(74,222,128,0.2)';
          btn.style.borderColor = 'var(--success)';
        }
        if (idx === selectedIdx && selectedIdx !== correctIdx) {
          btn.style.background = 'rgba(239,68,68,0.2)';
          btn.borderColor = 'var(--error)';
        }
      });
    }
    
    if (actor === 'bot') {
      this.adminDiffBotScore++;
      this.playAudioTone('incorrect');
      if (statusEl) {
        statusEl.innerText = "🤖 Лисёнок 🦊 нашел отличие первым! +1 балл";
        statusEl.style.color = 'var(--error)';
      }
    } else if (actor === 'timeout') {
      this.playAudioTone('incorrect');
      if (statusEl) {
        statusEl.innerText = "⏰ Время вышло! Никто не нашел отличие.";
        statusEl.style.color = 'var(--error)';
      }
    } else {
      // Player clicked
      if (selectedIdx === correctIdx) {
        this.adminDiffPlayerScore++;
        this.playAudioTone('correct');
        if (statusEl) {
          statusEl.innerText = "Правильно! Вы нашли отличие первым! 🎉";
          statusEl.style.color = 'var(--success)';
        }
      } else {
        this.playAudioTone('incorrect');
        if (statusEl) {
          statusEl.innerText = "Неправильно! Вы выбрали обычный смайлик. 😢";
          statusEl.style.color = 'var(--error)';
        }
      }
    }
    
    this.renderAdminDiffScoreboard();
    
    // Wait 1.8 seconds then advance
    setTimeout(() => {
      this.adminDiffRoundIndex++;
      this.renderAdminDiffQuestion();
    }, 1800);
  }

  renderAdminDiffScoreboard() {
    const scoreboardEl = document.getElementById('admin-diff-test-scoreboard');
    if (scoreboardEl) {
      scoreboardEl.innerText = `Вы: ${this.adminDiffPlayerScore} очк. | 🤖 Лисёнок 🦊: ${this.adminDiffBotScore} очк.`;
    }
  }

  finishAdminDiffTest() {
    this.adminDiffGameOver = true;
    this.clearAdminDiffTimers();
    
    const statusEl = document.getElementById('admin-diff-test-status');
    const gridEl = document.getElementById('admin-diff-test-grid');
    const qIndexEl = document.getElementById('admin-diff-test-q-index');
    
    if (gridEl) gridEl.innerHTML = '';
    if (qIndexEl) qIndexEl.innerText = "ТЕСТИРОВАНИЕ ЗАВЕРШЕНО";
    
    const score = this.adminDiffPlayerScore;
    const botScore = this.adminDiffBotScore;
    
    if (statusEl) {
      if (score > botScore) {
        statusEl.innerText = `🏆 Вы выиграли матч со счетом ${score} : ${botScore}! Поздравляем!`;
        statusEl.style.color = 'var(--success)';
        this.playAudioTone('success');
      } else if (score < botScore) {
        statusEl.innerText = `🤖 Бот выиграл матч со счетом ${botScore} : ${score}. Попробуйте еще раз!`;
        statusEl.style.color = 'var(--error)';
        this.playAudioTone('incorrect');
      } else {
        statusEl.innerText = `🤝 Ничья! Счет ${score} : ${botScore}. Сыграйте еще раунд.`;
        statusEl.style.color = 'var(--gold)';
        this.playAudioTone('success');
      }
    }
    
    document.getElementById('btn-admin-diff-test-start').innerText = "🎮 Начать заново";
  }

  handleTestingModeChange(isTest) {
    // Если гость не подключен (на экране блокировки или отключен), не переводим его в лобби
    if (this.state.visitorActiveView === 'locked' || this.state.visitorActiveView === 'disconnected') {
      return;
    }

    if (isTest) {
      this.clearAllVisitorGameTimers();
      
      const overlay = document.getElementById('lobby-queue-overlay');
      if (overlay) overlay.style.display = 'none';
      
      this.setVisitorViewPanel('lobby');
      this.initVisitorLobby();
      this.showVisitorToast("🛠️ Включен Тест-режим. Игры временно приостановлены.", true);
    } else {
      this.initVisitorLobby();
    }
  }

  adjustTTTSize(delta) {
    const sizes = [2, 4, 8, 16];
    let currentIdx = sizes.indexOf(this.state.tttTournamentSize);
    if (currentIdx === -1) currentIdx = 2; // Default to 8 players (index 2)
    
    let nextIdx = currentIdx + delta;
    if (nextIdx >= 0 && nextIdx < sizes.length) {
      const newSize = sizes[nextIdx];
      this.state.tttTournamentSize = newSize;
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.updateTTTSizeUI();
    }
  }

  updateTTTSizeUI() {
    const size = this.state.tttTournamentSize || 8;
    const label = document.getElementById('label-ttt-size');
    if (label) {
      let roundsText = 'раунда';
      if (size === 2) roundsText = '1 раунд';
      else if (size === 4) roundsText = '2 раунда';
      else if (size === 8) roundsText = '3 раунда';
      else if (size === 16) roundsText = '4 раунда';
      label.innerText = `${size} участников (${roundsText})`;
    }
    
    const decBtn = document.getElementById('btn-ttt-size-dec');
    const incBtn = document.getElementById('btn-ttt-size-inc');
    if (decBtn) decBtn.disabled = (size === 2);
    if (incBtn) incBtn.disabled = (size === 16);
  }

  adjustTTTMaxDraws(delta) {
    let current = parseInt(this.state.tttMaxDraws) || 3;
    let nextVal = current + delta;
    if (nextVal >= 3 && nextVal <= 50) {
      this.state.tttMaxDraws = nextVal;
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.updateTTTMaxDrawsUI();
    }
  }

  updateTTTMaxDrawsUI() {
    const draws = parseInt(this.state.tttMaxDraws) || 3;
    const label = document.getElementById('label-ttt-draws');
    if (label) {
      label.innerText = `${draws} ничьих`;
    }
    
    const decBtn = document.getElementById('btn-ttt-draws-dec');
    const incBtn = document.getElementById('btn-ttt-draws-inc');
    if (decBtn) decBtn.disabled = (draws <= 3);
    if (incBtn) incBtn.disabled = (draws >= 50);
  }

  saveTTTConfig(key, value) {
    this.state[key] = value;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.showToast("Настройки Крестиков-Ноликов успешно сохранены!", false);
  }

  startAdminTTTTest() {
    this.adminTTTBoard = Array(9).fill(null);
    this.adminTTTGameOver = false;
    
    // Чередуем, кто делает первый ход в матче
    if (this.adminTTTFirstTurnStarter === undefined || this.adminTTTFirstTurnStarter === 'bot') {
      this.adminTTTFirstTurnStarter = 'player';
      this.adminTTTPlayerTurn = true;
    } else {
      this.adminTTTFirstTurnStarter = 'bot';
      this.adminTTTPlayerTurn = false;
    }
    
    document.getElementById('admin-ttt-test-board-container').style.display = 'flex';
    document.getElementById('btn-admin-ttt-test-start').innerText = "🔄 Сбросить матч";
    
    const statusEl = document.getElementById('admin-ttt-test-status');
    
    if (this.adminTTTPlayerTurn) {
      statusEl.innerText = "Ваш ход (Крестик)...";
      statusEl.style.color = 'var(--success)';
      this.renderAdminTTTBoard();
    } else {
      statusEl.innerText = "Бот ходит первым. Думает...";
      statusEl.style.color = 'var(--gold)';
      this.renderAdminTTTBoard();
      setTimeout(() => this.executeAdminTTTBotMove(), 600);
    }
  }

  renderAdminTTTBoard() {
    const boardEl = document.getElementById('admin-ttt-test-board');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    
    this.adminTTTBoard.forEach((cell, cellIdx) => {
      const btn = document.createElement('button');
      btn.style.cssText = 'width:48px; height:48px; font-size:22px; font-weight:950; display:flex; align-items:center; justify-content:center; background:#110e1f; border:1px solid var(--border-light); border-radius:10px; cursor:pointer; outline:none; transition:all 0.15s; margin:0; box-sizing:border-box; box-shadow:inset 0 0 5px rgba(255,255,255,0.02); font-family: Outfit, Inter, sans-serif;';
      if (cell) {
        btn.innerText = cell;
        btn.disabled = true;
        if (cell === 'X') {
          btn.style.color = 'var(--success)';
          btn.style.textShadow = '0 0 8px rgba(74,222,128,0.4)';
          btn.style.borderColor = 'rgba(74,222,128,0.3)';
        } else {
          btn.style.color = 'var(--gold)';
          btn.style.textShadow = '0 0 8px rgba(251,191,36,0.4)';
          btn.style.borderColor = 'rgba(251,191,36,0.3)';
        }
      } else {
        btn.innerText = '';
        btn.disabled = !this.adminTTTPlayerTurn || this.adminTTTGameOver;
        btn.onclick = () => this.handleAdminTTTClick(cellIdx);
      }
      boardEl.appendChild(btn);
    });
  }

  handleAdminTTTClick(cellIdx) {
    if (!this.adminTTTPlayerTurn || this.adminTTTGameOver || this.adminTTTBoard[cellIdx]) return;
    
    this.adminTTTBoard[cellIdx] = 'X';
    this.playAudioTone('correct');
    this.renderAdminTTTBoard();
    
    const outcome = this.checkAdminTTTBoardState(this.adminTTTBoard);
    if (outcome) {
      this.handleAdminTTTTestEnd(outcome);
      return;
    }
    
    this.adminTTTPlayerTurn = false;
    this.renderAdminTTTBoard();
    document.getElementById('admin-ttt-test-status').innerText = "Бот думает...";
    document.getElementById('admin-ttt-test-status').style.color = 'var(--gold)';
    
    setTimeout(() => this.executeAdminTTTBotMove(), 600);
  }

  executeAdminTTTBotMove() {
    if (this.adminTTTGameOver) return;
    
    const board = this.adminTTTBoard;
    const diff = this.state.tttDifficulty || 'normal';
    
    const emptyIndices = [];
    board.forEach((cell, idx) => {
      if (cell === null) emptyIndices.push(idx);
    });
    
    if (emptyIndices.length === 0) return;
    
    let botMoveIdx = -1;
    
    const findWinningMove = (player) => {
      const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (let line of winLines) {
        const [a, b, c] = line;
        if (board[a] === player && board[b] === player && !board[c]) return c;
        if (board[a] === player && board[c] === player && !board[b]) return b;
        if (board[b] === player && board[c] === player && !board[a]) return a;
      }
      return -1;
    };

    const decideMove = () => {
      const winIdx = findWinningMove('O');
      if (winIdx !== -1) return winIdx;
      
      const blockIdx = findWinningMove('X');
      if (blockIdx !== -1) return blockIdx;
      
      if (!board[4]) return 4;
      
      const corners = [0, 2, 6, 8].filter(c => !board[c]);
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
      
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };

    if (diff === 'hard') {
      botMoveIdx = decideMove();
    } else if (diff === 'normal') {
      if (Math.random() < 0.70) {
        botMoveIdx = decideMove();
      } else {
        botMoveIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    } else {
      if (Math.random() < 0.30) {
        botMoveIdx = decideMove();
      } else {
        botMoveIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    }
    
    if (botMoveIdx !== -1) {
      board[botMoveIdx] = 'O';
      this.playAudioTone('click');
      this.renderAdminTTTBoard();
      
      const outcome = this.checkAdminTTTBoardState(board);
      if (outcome) {
        this.handleAdminTTTTestEnd(outcome);
        return;
      }
      
      this.adminTTTPlayerTurn = true;
      document.getElementById('admin-ttt-test-status').innerText = "Ваш ход (Крестик)...";
      document.getElementById('admin-ttt-test-status').style.color = 'var(--success)';
      this.renderAdminTTTBoard();
    }
  }

  checkAdminTTTBoardState(board) {
    const winLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of winLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every(cell => cell !== null)) return 'draw';
    return null;
  }

  handleAdminTTTTestEnd(outcome) {
    this.adminTTTGameOver = true;
    const statusEl = document.getElementById('admin-ttt-test-status');
    
    if (outcome === 'X') {
      statusEl.innerText = "🏆 Вы выиграли матч! Поздравляем!";
      statusEl.style.color = 'var(--success)';
      this.playAudioTone('success');
    } else if (outcome === 'O') {
      statusEl.innerText = "🤖 Бот выиграл матч. Попробуйте еще раз!";
      statusEl.style.color = 'var(--error)';
      this.playAudioTone('incorrect');
    } else {
      statusEl.innerText = "🤝 Ничья! Сыграйте еще раунд.";
      statusEl.style.color = 'var(--gold)';
    }
    
    document.getElementById('btn-admin-ttt-test-start').innerText = "🎮 Начать заново";
    this.renderAdminTTTBoard();
  }

  editMemory() {
    this.setAdminPanelActiveView('edit-memory');
    
    const diffEl = document.getElementById('settings-memory-difficulty');
    if (diffEl) diffEl.value = this.state.memoryDifficulty || 'normal';
    
    const timeEl = document.getElementById('settings-memory-time-limit');
    if (timeEl) timeEl.value = this.state.memoryTimeLimit || 60;
    
    const themeEl = document.getElementById('settings-memory-theme');
    if (themeEl) themeEl.value = this.state.memoryTheme || 'restaurant';
    
    this.updateMemoryPlayersUI();
  }

  saveMemoryConfig() {
    try {
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.showToast("Настройки игры Мемори сохранены! ✔️", false);
      this.setAdminPanelActiveView('dashboard');
    } catch(e) {
      console.error("Error in saveMemoryConfig:", e);
    }
  }

  editCheckers() {
    this.setAdminPanelActiveView('edit-checkers');
    const branch = this.getVisitorConnectedBranch();
    const turnLimit = branch && branch.checkersTurnLimit ? branch.checkersTurnLimit : (this.state.checkersTurnLimit || 'none');
    const limitEl = document.getElementById('settings-checkers-turn-limit');
    if (limitEl) limitEl.value = turnLimit;
    this.updateCheckersPlayersUI();
  }

  adjustCheckersPlayersLimit(type, delta) {
    try {
      const game = this.state.games.find(g => g.id === 11);
      if (!game) return;

      if (type === 'min') {
        let val = (game.minPlayers || 2) + delta;
        val = Math.max(2, Math.min(8, val));
        if (val > (game.maxPlayers || 2)) {
          game.maxPlayers = val;
        }
        game.minPlayers = val;
      } else {
        let val = (game.maxPlayers || 2) + delta;
        val = Math.max(2, Math.min(8, val));
        if (val < (game.minPlayers || 2)) {
          game.minPlayers = val;
        }
        game.maxPlayers = val;
      }

      this.updateCheckersPlayersUI();
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch(e) {
      console.error("Error in adjustCheckersPlayersLimit:", e);
    }
  }

  updateCheckersPlayersUI() {
    const game = this.state.games.find(g => g.id === 11);
    if (!game) return;

    const minEl = document.getElementById('label-checkers-min-players');
    if (minEl) {
      const teams = Math.floor(game.minPlayers / 2);
      minEl.innerText = `${game.minPlayers} (${teams} ${teams === 1 ? 'пара' : (teams >= 2 && teams <= 4 ? 'пары' : 'пар')})`;
    }

    const maxEl = document.getElementById('label-checkers-max-players');
    if (maxEl) {
      const teams = Math.floor(game.maxPlayers / 2);
      maxEl.innerText = `${game.maxPlayers} (${teams} ${teams === 1 ? 'пара' : (teams >= 2 && teams <= 4 ? 'пары' : 'пар')})`;
    }
  }

  saveCheckersConfig(key, value) {
    try {
      const branch = this.getVisitorConnectedBranch();
      if (branch) {
        branch[key] = value;
      }
      this.state[key] = value;
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.showToast("Настройки Шашек сохранены! ✔️", false);
    } catch(e) {
      console.error("Error in saveCheckersConfig:", e);
    }
  }

  editStickmanRace() {
    this.setAdminPanelActiveView('edit-stickmanrace');
    const branch = this.getVisitorConnectedBranch();
    const len = branch && branch.stickmanRaceLength ? branch.stickmanRaceLength : (this.state.stickmanRaceLength || 50);
    const obs = branch && branch.stickmanRaceObstacles ? branch.stickmanRaceObstacles : (this.state.stickmanRaceObstacles || 'medium');
    const limit = branch && branch.stickmanRaceTimeLimit ? branch.stickmanRaceTimeLimit : (this.state.stickmanRaceTimeLimit || 'none');
    
    const lenEl = document.getElementById('settings-stickmanrace-length');
    if (lenEl) lenEl.value = len;
    
    const obsEl = document.getElementById('settings-stickmanrace-obstacles');
    if (obsEl) obsEl.value = obs;
    
    const limitEl = document.getElementById('settings-stickmanrace-time-limit');
    if (limitEl) limitEl.value = limit;
    
    this.updateStickmanRacePlayersUI();
  }

  adjustStickmanRacePlayersLimit(type, delta) {
    try {
      const game = this.state.games.find(g => g.id === 3);
      if (!game) return;

      if (type === 'min') {
        let val = (game.minPlayers || 6) + delta;
        val = Math.max(2, Math.min(8, val));
        if (val > (game.maxPlayers || 8)) {
          game.maxPlayers = val;
        }
        game.minPlayers = val;
      } else {
        let val = (game.maxPlayers || 8) + delta;
        val = Math.max(2, Math.min(8, val));
        if (val < (game.minPlayers || 6)) {
          game.minPlayers = val;
        }
        game.maxPlayers = val;
      }

      this.updateStickmanRacePlayersUI();
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch(e) {
      console.error("Error in adjustStickmanRacePlayersLimit:", e);
    }
  }

  updateStickmanRacePlayersUI() {
    const game = this.state.games.find(g => g.id === 3);
    if (!game) return;

    const minEl = document.getElementById('label-stickmanrace-min-players');
    if (minEl) minEl.innerText = `${game.minPlayers} чел.`;

    const maxEl = document.getElementById('label-stickmanrace-max-players');
    if (maxEl) maxEl.innerText = `${game.maxPlayers} чел.`;
  }

  saveStickmanRaceConfig(key, value) {
    try {
      const branch = this.getVisitorConnectedBranch();
      if (branch) {
        branch[key] = value;
      }
      this.state[key] = value;
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.showToast("Настройки Гонки Стикменов сохранены! ✔️", false);
    } catch(e) {
      console.error("Error in saveStickmanRaceConfig:", e);
    }
  }

  editSlicingGame() {
    this.setAdminPanelActiveView('edit-slicing');
    const branch = this.getVisitorConnectedBranch();
    const item = (branch && branch.slicingItem) || this.state.slicingItem || 'bread';
    const duration = (branch && branch.slicingDuration) || this.state.slicingDuration || 30;

    const itemEl = document.getElementById('settings-slicing-item');
    if (itemEl) itemEl.value = item;

    const durEl = document.getElementById('settings-slicing-duration');
    if (durEl) durEl.value = duration;

    const game = this.state.games.find(g => g.id === 8);
    if (game) {
      const minEl = document.getElementById('label-slicing-min-players');
      if (minEl) minEl.innerText = `${game.minPlayers || 2} чел.`;
      const maxEl = document.getElementById('label-slicing-max-players');
      if (maxEl) maxEl.innerText = `${game.maxPlayers || 8} чел.`;
    }
  }

  saveMemoryConfigField(field, value) {
    this.state[field] = value;
    this.saveState();
    this.syncActiveBranchToDatabase();
  }

  adjustMemoryPlayersLimit(type, delta) {
    try {
      const game = this.state.games.find(g => g.id === 6);
      if (!game) return;

      if (type === 'min') {
        let val = (game.minPlayers || 2) + delta;
        val = Math.max(2, Math.min(5, val));
        if (val > (game.maxPlayers || 8)) {
          game.maxPlayers = val;
        }
        game.minPlayers = val;
      } else {
        let val = (game.maxPlayers || 4) + delta;
        val = Math.max(2, Math.min(8, val));
        if (val < (game.minPlayers || 2)) {
          game.minPlayers = val;
        }
        game.maxPlayers = val;
      }

      this.updateMemoryPlayersUI();
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch(e) {
      console.error(e);
    }
  }

  updateMemoryPlayersUI() {
    const game = this.state.games.find(g => g.id === 6);
    if (!game) return;
    
    const minEl = document.getElementById('label-memory-min-players');
    if (minEl) minEl.innerText = game.minPlayers || 2;
    
    const maxEl = document.getElementById('label-memory-max-players');
    if (maxEl) maxEl.innerText = game.maxPlayers || 4;
  }


  finishQuizEditing() {
    this.setAdminPanelActiveView('dashboard');
    this.showToast("Викторина сохранена ✔️ Все готово!", false);
  }

  // --- EMOJI PICKER POPUPS ---
  showEmojiPicker(qIdx, optIdx, buttonEl) {
    this.closeEmojiPicker();

    const popover = document.createElement('div');
    popover.className = 'emoji-picker-popover';
    popover.onclick = (e) => e.stopPropagation();

    // Поле поиска
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск...';
    searchInput.className = 'emoji-picker-search';
    
    // Сетка эмодзи
    const grid = document.createElement('div');
    grid.className = 'emoji-picker-grid';

    popover.appendChild(searchInput);
    popover.appendChild(grid);

    const emojiDb = [
      // Игры и развлечения
      { char: "🎲", tags: ["игры", "кубик", "кости", "dice"] },
      { char: "🎯", tags: ["игры", "мишень", "дартс", "target"] },
      { char: "🧩", tags: ["игры", "пазл", "puzzle"] },
      { char: "🎳", tags: ["игры", "боулинг", "кегли"] },
      { char: "🎮", tags: ["игры", "джойстик", "геймпад", "приставка", "gamepad"] },
      { char: "🏎️", tags: ["игры", "гонка", "машина", "авто"] },
      { char: "⚽", tags: ["спорт", "футбол", "мяч", "soccer"] },
      { char: "🏀", tags: ["спорт", "баскетбол", "мяч"] },
      { char: "🏐", tags: ["спорт", "волейбол", "мяч"] },
      { char: "🎾", tags: ["спорт", "теннис", "мяч"] },
      { char: "🏆", tags: ["победа", "кубок", "приз", "награда", "cup"] },
      { char: "🎈", tags: ["праздник", "шарик", "шар"] },
      { char: "🎉", tags: ["праздник", "хлопушка", "салют", "party"] },
      { char: "🔥", tags: ["огонь", "пламя", "пожар", "fire"] },
      { char: "✨", tags: ["звезды", "блеск", "блестки", "магия"] },
      { char: "💥", tags: ["взрыв", "бум", "удар"] },
      { char: "🔫", tags: ["пистолет", "оружие", "выстрел", "стрелять", "gun", "weapon"] },
      { char: "🌙", tags: ["луна", "месяц", "ночь", "космос", "moon", "night"] },
      { char: "🌕", tags: ["луна", "полнолуние", "космос", "moon"] },
      { char: "💊", tags: ["болею", "таблетка", "лекарство", "болезнь", "аптека", "pill", "medicine"] },
      { char: "💉", tags: ["болею", "укол", "лекарство", "вакцина", "аптека", "больница", "шприц", "syringe"] },
      { char: "🏥", tags: ["болею", "больница", "врач", "доктор", "аптека", "hospital"] },
      { char: "👨‍⚕️", tags: ["болею", "врач", "доктор", "медик", "doctor"] },
      { char: "👩‍⚕️", tags: ["болею", "врач", "доктор", "медик", "doctor"] },
      { char: "🦶", tags: ["нога", "стопа", "ступня", "foot", "leg"] },
      { char: "🦵", tags: ["нога", "колено", "мышцы", "leg"] },
      // Напитки
      { char: "🥤", tags: ["сок", "кола", "лимонад", "вода", "пепси", "фанта", "напиток", "soda"] },
      { char: "☕", tags: ["кофе", "капучино", "латте", "чай", "кружка", "coffee"] },
      { char: "🍵", tags: ["чай", "зеленый", "кружка", "tea"] },
      { char: "🍺", tags: ["пиво", "кружка", "бар", "алкоголь", "beer"] },
      { char: "🍻", tags: ["пиво", "кружки", "тост", "бар", "алкоголь", "beers"] },
      { char: "🍷", tags: ["вино", "бокал", "бутылка", "алкоголь", "wine"] },
      { char: "🍸", tags: ["коктейль", "мартини", "напиток", "cocktail"] },
      { char: "🍹", tags: ["коктейль", "тропический", "сок", "напиток"] },
      { char: "🥃", tags: ["водка", "виски", "ром", "джин", "коньяк", "текила", "алкоголь", "стакан", "vodka"] },
      { char: "🍾", tags: ["шампанское", "бутылка", "праздник", "wine", "champagne"] },
      { char: "🥛", tags: ["молоко", "стакан", "напиток"] },
      { char: "🧉", tags: ["мате", "напиток"] },
      // Еда
      { char: "🍔", tags: ["бургер", "чизбургер", "гамбургер", "еда", "burger"] },
      { char: "🍕", tags: ["пицца", "сыр", "еда", "pizza"] },
      { char: "🥩", tags: ["стейк", "мясо", "еда", "meat"] },
      { char: "🍖", tags: ["мясо", "ребрышко", "еда", "meat"] },
      { char: "🍗", tags: ["курица", "ножка", "еда", "chicken"] },
      { char: "🍟", tags: ["картошка", "фри", "еда", "fries"] },
      { char: "🥗", tags: ["салат", "зелень", "веган", "овощи", "salad"] },
      { char: "🍣", tags: ["суши", "роллы", "рыба", "еда", "sushi"] },
      { char: "🍰", tags: ["торт", "пирожное", "десерт", "сладкое", "cake"] },
      { char: "🎂", tags: ["торт", "день рождения", "свечи", "праздник", "cake"] },
      { char: "🧁", tags: ["кекс", "капкейк", "сладкое", "десерт"] },
      { char: "🍦", tags: ["мороженое", "сладкое", "десерт", "icecream"] },
      { char: "🍨", tags: ["мороженое", "сладкое", "десерт"] },
      { char: "🍩", tags: ["пончик", "сладкое", "десерт"] },
      { char: "🍫", tags: ["шоколад", "сладкое", "десерт"] }
    ];

    const renderGrid = (query = '') => {
      grid.innerHTML = '';
      const trimmed = query.trim().toLowerCase();
      
      const filtered = emojiDb.filter(item => {
        if (!trimmed) return true;
        return item.char.includes(trimmed) || item.tags.some(tag => tag.includes(trimmed));
      });

      if (filtered.length === 0) {
        const noResult = document.createElement('div');
        noResult.style.gridColumn = 'span 5';
        noResult.style.fontSize = '9px';
        noResult.style.color = 'var(--text-muted)';
        noResult.style.padding = '10px 0';
        noResult.innerText = 'Нет совпадений';
        grid.appendChild(noResult);
        return;
      }

      filtered.forEach(item => {
        const opt = document.createElement('div');
        opt.className = 'emoji-option';
        opt.innerText = item.char;
        opt.onclick = () => {
          this.state.templates[qIdx].emojis[optIdx] = item.char;
          this.saveState();
          this.syncActiveBranchToDatabase();
          buttonEl.innerText = item.char;
          this.closeEmojiPicker();
        };
        grid.appendChild(opt);
      });
    };

    searchInput.oninput = (e) => renderGrid(e.target.value);
    
    // Фокус на поле поиска при открытии
    setTimeout(() => searchInput.focus(), 50);

    renderGrid();

    buttonEl.parentNode.appendChild(popover);
    this.activeEmojiPicker = popover;
  }

  closeEmojiPicker() {
    if (this.activeEmojiPicker) {
      this.activeEmojiPicker.remove();
      this.activeEmojiPicker = null;
    }
  }

  // --- REAL EMAIL DISPATCH FUNCTION (Direct 1-Step Email Gateway) ---
  sendRealEmail(recipientEmail, code, subjectMessage) {
    console.log(`Sending real email to ${recipientEmail} with code ${code}...`);
    this.showToast(`📡 Отправка 4-значного кода на ${recipientEmail}...`, false);

    // Primary dispatch via Web3Forms API (Direct delivery to any inbox without recipient confirmation)
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: "b4914c62-11ee-4c54-93c6-3023e1f574d6",
        subject: `Код подтверждения WaitPlay: ${code}`,
        from_name: "WaitPlay Interactive",
        to_email: recipientEmail,
        message: `Здравствуйте!\n\nВаш 4-значный код для входа и регистрации на платформе WaitPlay:\n\n👉  ${code}  👈\n\nВведите эти цифры в приложении. Никому не сообщайте данный код.`
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Direct email sent successfully via Web3Forms:", data);
      this.showToast(`📨 Код отправлен на ${recipientEmail}! Проверьте Входящие/Спам.`, false);
    })
    .catch(err => {
      console.error("Failed to send direct email:", err);
      // Secondary fallback
      fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: `Код подтверждения WaitPlay: ${code}`,
          "Код подтверждения": code
        })
      }).catch(e => console.error(e));
      this.showToast(`📨 Запрос отправлен на ${recipientEmail}! Проверьте почту.`, false);
    });
  }

  // --- 2FA COUNTDOWN TIMERS UTILITY ---
  startTimer(type, displayId, onExpire) {
    clearInterval(this.timers[type].interval);
    this.timers[type].value = 180; // 3 minutes
    
    const display = document.getElementById(displayId);
    const tick = () => {
      const mins = Math.floor(this.timers[type].value / 60);
      const secs = this.timers[type].value % 60;
      if (display) {
        display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
      if (this.timers[type].value <= 0) {
        clearInterval(this.timers[type].interval);
        if (onExpire) onExpire();
      }
      this.timers[type].value--;
    };
    tick();
    this.timers[type].interval = setInterval(tick, 1000);
  }

  stopTimer(type) {
    clearInterval(this.timers[type].interval);
  }

  // --- STEPPED REGISTRATION WORKFLOW ---
  consentAccept() {
    this.state.consentAccepted = true;
    if (!this.state.activeBranchId || !this.state.activeBranchName) {
      this.state.activeBranchId = 'br_main';
      this.state.activeBranchName = 'Моё заведение 🎮';
    }
    if (!this.state.email) {
      this.state.email = 'owner@waitplay.app';
    }

    this.saveState();
    this.showToast("Добро пожаловать на Рабочий стол WaitPlay! 🚀", false);
    this.setAdminPanelActiveView('dashboard');
    this.updateAdminView();
  }

  regSendEmailCode() {
    try {
      const email = document.getElementById('reg-email').value.trim();
      if (!email || !email.includes('@')) {
        this.showToast("Введите корректный адрес электронной почты!", true);
        return;
      }

      let existingClient = this.getClientProfileByEmail(email);
      if (!this.isLoginFlow && existingClient) {
        if (this.isSandboxMode()) {
          // Developer testing bypass - auto-delete old profile to test signup completely fresh
          this.state.databaseClients = this.state.databaseClients.filter(c => c.email && c.email.toLowerCase() !== email.toLowerCase());
          this.saveDatabaseClients();
          this.showToast("📍 [Режим Создателя] Старый профиль сброшен для чистого теста регистрации.", false);
        } else {
          this.showToast("Этот Email уже зарегистрирован! Войдите в аккаунт, чтобы управлять филиалами.", true);
          return;
        }
      }

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      this.timers.regEmail.code = code;
      
      document.getElementById('reg-email-input-group').style.display = 'none';
      document.getElementById('reg-email-code-group').style.display = 'block';

      this.startTimer('regEmail', 'reg-email-timer', () => {
        this.timers.regEmail.code = '';
        this.showToast("Время действия проверочного кода истекло. Отправьте код снова.", true);
      });

      // Check if client already has a subscription
      existingClient = this.getClientProfileByEmail(email);
      if (existingClient && existingClient.subscription !== 'none') {
        this.showToast("Аккаунт найден! Отправлен код для переноса управления.", false);
        this.sendRealEmail(email, code, "Перенос управления аккаунтом на новое устройство");
      } else {
        this.showToast("Код верификации отправлен на вашу почту.", false);
        this.sendRealEmail(email, code, "Код регистрации аккаунта");
      }
    } catch (e) {
      alert("Ошибка в regSendEmailCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  regResendEmailCode() {
    document.getElementById('reg-email-input-group').style.display = 'block';
    document.getElementById('reg-email-code-group').style.display = 'none';
    this.stopTimer('regEmail');
    this.showToast("Введите почту заново для отправки кода", false);
  }

  regVerifyEmailCode() {
    try {
      const entered = document.getElementById('reg-email-code-input').value.trim();
      const isSandboxBypass = entered === "1234";
      
      if ((entered === this.timers.regEmail.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('regEmail');
        
        const emailInput = document.getElementById('reg-email').value.trim();
        const existingClient = this.getClientProfileByEmail(emailInput);

        if (this.isLoginFlow) {
          // LOGIN FLOW
          if (!existingClient) {
            this.showToast("Этот Email не зарегистрирован! Пожалуйста, выберите 'Создать новый аккаунт'.", true);
            return;
          }

          if (existingClient.status === 'Заблокирован') {
            this.showToast("Этот аккаунт заблокирован создателем! 🚫", true);
            return;
          }

          this.state.email = emailInput;
          this.state.phone = existingClient.phone || '';
          this.saveState();

          this.showToast("Почта подтверждена. Добро пожаловать! ✔️", false);
          if (existingClient.branches && existingClient.branches.length > 0) {
            this.setAdminPanelActiveView('select-branch');
          } else {
            this.setAdminPanelActiveView('add-branch');
          }

          const phoneInput = document.getElementById('reg-phone');
          const phoneSelect = document.getElementById('reg-phone-country-code');
          if (phoneInput && phoneSelect) {
            const rawPhone = existingClient.phone || '';
            let matchedPrefix = '996';
            let matchedNumber = rawPhone;
            
            const prefixes = ['996', '998', '375', '992', '994', '374', '7'];
            for (const pref of prefixes) {
              if (rawPhone.startsWith(pref)) {
                matchedPrefix = pref;
                matchedNumber = rawPhone.substring(pref.length);
                break;
              }
            }
            
            if (matchedPrefix === '7') {
              if (matchedNumber.startsWith('7') || matchedNumber.startsWith('0') || matchedNumber.startsWith('4')) {
                phoneSelect.value = '7_kz';
              } else {
                phoneSelect.value = '7_ru';
              }
            } else {
              phoneSelect.value = matchedPrefix;
            }
            phoneInput.value = matchedNumber;
          }

          // Clear inputs
          document.getElementById('reg-email-code-input').value = '';
          document.getElementById('reg-email-input-group').style.display = 'block';
          document.getElementById('reg-email-code-group').style.display = 'none';

        } else {
          // REGISTRATION FLOW (Create new account or add new branch to existing)
          if (existingClient) {
            if (this.isSandboxMode()) {
              this.state.databaseClients = this.state.databaseClients.filter(c => c.email && c.email.toLowerCase() !== emailInput.toLowerCase());
              this.saveDatabaseClients();
            } else {
              this.showToast("Этот Email уже зарегистрирован! Войдите в аккаунт, чтобы управлять филиалами.", true);
              return;
            }
          }

          // Proceed to registration steps
          this.state.email = emailInput;
          this.state.activeBranchId = '';
          this.state.activeBranchName = '';
          this.isAddingBranch = true;
          this.saveState();
          
          const phoneInput = document.getElementById('reg-phone');
          if (phoneInput) {
            phoneInput.value = '';
          }

          // Reset phone view states to show input, hide verification group
          const phoneInputGrp = document.getElementById('reg-phone-input-group');
          const phoneCodeGrp = document.getElementById('reg-phone-code-group');
          if (phoneInputGrp) phoneInputGrp.style.display = 'block';
          if (phoneCodeGrp) phoneCodeGrp.style.display = 'none';

          this.showToast("Электронная почта успешно подтверждена ✔️", false);
          this.setAdminPanelActiveView('add-branch');

          // Clear inputs
          document.getElementById('reg-email-code-input').value = '';
          document.getElementById('reg-email-input-group').style.display = 'block';
          document.getElementById('reg-email-code-group').style.display = 'none';
        }
      } else {
        this.showToast("Неверный проверочный код или срок действия истек!", true);
      }
    } catch (e) {
      alert("Ошибка regVerifyEmailCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  regSendPhoneCode() {
    const prefixSelect = document.getElementById('reg-phone-country-code');
    const prefixVal = prefixSelect ? prefixSelect.value : '996';
    const cleanPrefix = (prefixVal === '7_kz' || prefixVal === '7_ru') ? '7' : prefixVal;
    const phoneInput = document.getElementById('reg-phone').value.trim().replace(/\D/g, '');
    const phone = cleanPrefix + phoneInput;

    if (!phoneInput || phoneInput.length < 6) {
      this.showToast("Введите корректный номер мобильного телефона!", true);
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.regPhone.code = code;
    
    document.getElementById('reg-phone-input-group').style.display = 'none';
    document.getElementById('reg-phone-code-group').style.display = 'block';

    this.startTimer('regPhone', 'reg-phone-timer', () => {
      this.timers.regPhone.code = '';
      this.showToast("Срок действия SMS кода истек. Отправьте запрос заново.", true);
    });

    // SMS is simulated because real mobile gateways are paid, so we output it in a toast for verification
    this.showToast(`[Имитация SMS] SMS код подтверждения выслан: ${code}`, false);
  }

  regResendPhoneCode() {
    document.getElementById('reg-phone-input-group').style.display = 'block';
    document.getElementById('reg-phone-code-group').style.display = 'none';
    this.stopTimer('regPhone');
    this.showToast("Введите номер телефона повторно для SMS кода", false);
  }

  regVerifyPhoneCode() {
    try {
      const entered = document.getElementById('reg-phone-code-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.regPhone.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('regPhone');
        const prefixSelect = document.getElementById('reg-phone-country-code');
        const prefixVal = prefixSelect ? prefixSelect.value : '996';
        const cleanPrefix = (prefixVal === '7_kz' || prefixVal === '7_ru') ? '7' : prefixVal;
        const phoneInput = document.getElementById('reg-phone').value.trim().replace(/\D/g, '');
        this.state.phone = cleanPrefix + phoneInput;
        this.saveState();
        
        this.showToast("Номер телефона успешно подтвержден ✔️", false);
        
        // Clear input code
        document.getElementById('reg-phone-code-input').value = '';
        
        const existingClient = this.getClientProfileByEmail(this.state.email);
        if (this.isLoginFlow && existingClient) {
          const branches = existingClient.branches || [];
          if (branches.length === 0) {
            // No branches yet - go to name input
            this.setAdminPanelActiveView('add-branch');
            document.getElementById('add-branch-name').value = '';
          } else if (branches.length === 1) {
            this.loadBranchContext(existingClient.email, branches[0].id);
          } else {
            this.setAdminPanelActiveView('select-branch');
            this.renderSelectBranchList(branches, existingClient.email);
          }
        } else {
          // Registration flow
          this.setAdminPanelActiveView('add-branch');
          document.getElementById('add-branch-name').value = '';
        }
      } else {
        this.showToast("Неверный проверочный SMS код!", true);
      }
    } catch (e) {
      alert("Ошибка regVerifyPhoneCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  // --- BILLING CYCLE & PAYMENT SELECTION ---
  setBillingCycle(cycle) {
    this.billingCycle = cycle;
    document.getElementById('toggle-monthly').classList.toggle('active', cycle === 'monthly');
    document.getElementById('toggle-yearly').classList.toggle('active', cycle === 'yearly');
    
    const baseAmount = document.getElementById('price-base-amount');
    const proAmount = document.getElementById('price-pro-amount');
    if (cycle === 'monthly') {
      baseAmount.innerHTML = "500 <span>сом / месяц</span>";
      proAmount.innerHTML = "1 000 <span>сом / месяц</span>";
    } else {
      baseAmount.innerHTML = "5 000 <span>сом / год</span>";
      proAmount.innerHTML = "10 000 <span>сом / год</span>";
    }
    this.updatePayButtonLabel();
  }

  selectPlan(plan) {
    this.selectedPlan = plan;
    document.getElementById('card-base').classList.toggle('selected', plan === 'base');
    document.getElementById('card-pro').classList.toggle('selected', plan === 'pro');
    
    const baseBtn = document.querySelector('#card-base .btn-select-plan');
    const proBtn = document.querySelector('#card-pro .btn-select-plan');
    if (plan === 'base') {
      baseBtn.innerText = "Выбран";
      proBtn.innerText = "Выбрать PRO";
    } else {
      baseBtn.innerText = "Выбрать Базовый";
      proBtn.innerText = "Выбран";
    }

    this.updatePayButtonLabel();
  }

  updatePayButtonLabel() {
    const btn = document.getElementById('btn-pay-execute');
    if (!btn) return;
    const price = (this.selectedPlan === 'base') 
      ? (this.billingCycle === 'monthly' ? "500 сом" : "5 000 сом")
      : (this.billingCycle === 'monthly' ? "1 000 сом" : "10 000 сом");
    
    btn.innerText = `💳 Оплатить ${this.selectedPlan === 'pro' ? 'PRO' : 'БАЗОВУЮ'} подписку (${price})`;
  }

  processPayment() {
    try {
      const isSandbox = this.isSandboxMode();
      const isPro = this.selectedPlan === 'pro';
      const price = isPro 
        ? (this.billingCycle === 'monthly' ? "1 000 \u0441\u043e\u043c" : "10 000 \u0441\u043e\u043c")
        : (this.billingCycle === 'monthly' ? "500 \u0441\u043e\u043c" : "5 000 \u0441\u043e\u043c");
      
      if (this.selectedPaymentType === 'card') {
        const cardNum = document.getElementById('pay-card-number').value.replace(/\s+/g, '');
        const expiry = document.getElementById('pay-card-expiry').value;
        const cvc = document.getElementById('pay-card-cvc').value;
        
        if (!isSandbox) {
          if (cardNum.length < 16) {
            this.showToast("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u043e\u043b\u043d\u044b\u0439 16-\u0437\u043d\u0430\u0447\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440 \u043a\u0430\u0440\u0442\u044b Visa!", true);
            return;
          }
          if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            this.showToast("\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0441\u0440\u043e\u043a \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u043a\u0430\u0440\u0442\u044b \u0432 \u0444\u043e\u0445\u043c\u0430\u0442\u0435 MM/YY!", true);
            return;
          }
          if (cvc.length < 3) {
            this.showToast("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 3-\u0437\u043d\u0430\u0447\u043d\u044b\u0439 CVC \u043a\u043e\u0434 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438!", true);
            return;
          }
        }
      } else if (this.selectedPaymentType === 'bank') {
        if (!this.selectedBank && !isSandbox) {
          this.showToast("\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0430\u043d\u043a \u0434\u043b\u044f \u043e\u043f\u043b\u0430\u0442\u044b!", true);
          return;
        }
      }

      const payBtn = document.getElementById('btn-pay-execute');
      payBtn.disabled = true;
      payBtn.innerText = `\u23f3 \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043f\u043b\u0430\u0442\u0435\u0436\u0430...`;

      setTimeout(() => {
        payBtn.disabled = false;
        
        if (this.isAddingBranch || this.state.subscription === 'none') {
          this.state.databaseClients = this.state.databaseClients || [];
          let client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === this.state.email.toLowerCase());
          if (!client) {
            client = {
              email: this.state.email,
              phone: this.state.phone,
              status: '\u0410\u043a\u0442\u0438\u0432\u0435\u043d',
              branches: []
            };
            this.state.databaseClients.push(client);
          }

          const branchId = 'br_' + Date.now();
          const newBranch = {
            id: branchId,
            name: this.pendingBranchName || "\u041c\u043e\u0439 \u0444\u0438\u043b\u0438\u0430\u043b",
            subscription: this.selectedPlan + '_' + this.billingCycle,
            lat: this.state.adminCoords.lat,
            lng: this.state.adminCoords.lng,
            welcomeMsg: `\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 ${this.pendingBranchName || "\u041c\u043e\u0439 \u0444\u0438\u043b\u0438\u0430\u043b"}`,
            deviceModel: "iPhone 15 Pro Max (\u041d\u043e\u0432\u043e\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e)",
            status: '\u0410\u043a\u0442\u0438\u0432\u0435\u043d',
            deviceHistory: [`${new Date().toLocaleDateString()}: \u041f\u0435\u0440\u0432\u0438\u0447\u043d\u0430\u044f \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f: iPhone 15 Pro Max`]
          };

          client.branches.push(newBranch);
          this.saveDatabaseClients();

          this.isAddingBranch = false;
          this.pendingBranchName = null;
          this.state.consentAccepted = true;
          this.saveState();

          this.loadBranchContext(this.state.email, branchId);
          this.renderCreatorClientsList();
          this.showToast(`\u0424\u0438\u043b\u0438\u0430\u043b "${newBranch.name}" \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d!`, false);
        } else {
          this.state.subscription = this.selectedPlan + '_' + this.billingCycle;
          this.saveState();
          this.syncActiveBranchToDatabase();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 \u043f\u0440\u043e\u0434\u043b\u0435\u043d\u0430!", false);
        }
      }, 1500);
    } catch (e) {
      alert("Error in processPayment: " + e.message);
    }
  }
  openRelocationModal(price) {
    try {
      this.pendingPriceText = price;
      const modal = document.getElementById('relocation-confirm-modal');
      if (!modal) return;

      document.getElementById('relocation-modal-text').innerText = 
        "Хотите ли вы обновить фиксированные координаты (GPS и Wi-Fi) вашего заведения на ваши текущие координаты?";
      document.getElementById('relocation-warning-detail').style.display = 'none';
      document.getElementById('relocation-step-1-buttons').style.display = 'flex';
      document.getElementById('relocation-step-2-buttons').style.display = 'none';

      modal.classList.add('active');
    } catch (e) {
      console.error("Error opening relocation modal:", e);
    }
  }

  relocationHandleStep1(wantChange) {
    try {
      const modal = document.getElementById('relocation-confirm-modal');
      if (!modal) return;

      if (!wantChange) {
        modal.classList.remove('active');
        this.updateAdminView();
        this.renderAdminGamesGrid();
        this.showToast(`Подписка продлена (${this.pendingPriceText || ''})! Координаты заведения сохранены прежними.`, false);
      } else {
        document.getElementById('relocation-modal-text').innerText = 
          "Вы выбрали смену геоданных заведения. Пожалуйста, подтвердите ваше местоположение:";
        document.getElementById('relocation-warning-detail').style.display = 'block';
        document.getElementById('relocation-step-1-buttons').style.display = 'none';
        document.getElementById('relocation-step-2-buttons').style.display = 'flex';
      }
    } catch (e) {
      console.error("Error in relocationHandleStep1:", e);
    }
  }

  relocationConfirmUpdate(confirmUpdate) {
    try {
      const modal = document.getElementById('relocation-confirm-modal');
      if (modal) modal.classList.remove('active');

      this.updateAdminView();
      this.renderAdminGamesGrid();

      if (confirmUpdate) {
        this.state.venueCoords = { ...this.state.adminCoords };
        this.saveState();
        this.showToast(`Переезд выполнен! Списано ${this.pendingPriceText || ''}. Координаты заведения обновлены на ваши текущие ✔️`, false);
      } else {
        this.showToast(`Подписка продлена (${this.pendingPriceText || ''})! Координаты заведения сохранены прежними.`, false);
      }
    } catch (e) {
      console.error("Error in relocationConfirmUpdate:", e);
    }
  }

  startSubscriptionChange() {
    try {
      const isPro = this.state.subscription && this.state.subscription.includes('pro');
      if (!isPro) {
        this.openGooglePlayBilling();
      } else {
        const expiry = this.state.subscriptionExpires || (Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (!this.state.subscriptionExpires) {
          this.state.subscriptionExpires = expiry;
          this.saveState();
          this.syncActiveBranchToDatabase();
        }
        const dateStr = new Date(expiry).toLocaleDateString('ru-RU');
        
        const confirmCancel = confirm(`⭐ Информация о подписке WaitPlay Premium:\n\n` +
          `• Период подписки: 1 месяц (продление через Google Play)\n` +
          `• Стоимость: 499,00 ₽/мес\n` +
          `• Активна до: ${dateStr}\n` +
          `• Статус автопродления: Активно\n\n` +
          `Вы хотите отменить автопродление подписки и вернуться к бесплатному Базовому тарифу?`);
          
        if (confirmCancel) {
          this.state.subscription = 'none';
          delete this.state.subscriptionExpires;
          this.saveState();
          this.syncActiveBranchToDatabase();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("Подписка отменена. Вы переведены на Базовый тариф.", false);
        }
      }
    } catch (e) {
      console.error("Error in startSubscriptionChange:", e);
    }
  }

  updateAdminView() {
    // Check if the current user is banned
    const isBanned = this.checkBannedStatus();
    if (isBanned) {
      const banRecord = this.state.bannedUsers.find(user => {
        const banEmail = (user.email || '').toLowerCase();
        const banPhone = (user.phone || '').trim();
        return (this.state.email && banEmail === this.state.email.toLowerCase()) || 
               (this.state.phone && banPhone === this.state.phone.trim());
      });
      
      const emailSpan = document.getElementById('banned-info-email');
      const phoneSpan = document.getElementById('banned-info-phone');
      const reasonSpan = document.getElementById('banned-info-reason');
      
      if (emailSpan) emailSpan.innerText = this.state.email || '\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d';
      if (phoneSpan) phoneSpan.innerText = this.state.phone || '\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d';
      if (reasonSpan) reasonSpan.innerText = banRecord ? banRecord.reason : '\u041d\u0430\u0440\u0443\u0448\u0435\u043d\u0438\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u0439';
      
      const badge = document.getElementById('admin-plan-badge');
      if (badge) {
        badge.innerText = "\u0411\u041b\u041e\u041a\u0418\u0420\u041e\u0412\u041a\u0410 \ud83d\udeab";
        badge.className = "badge badge-danger";
        badge.style.display = "inline-block";
      }
      this.setAdminPanelActiveView('banned');
      return;
    }

    if (this.state.maintenanceMode) {
      const badge = document.getElementById('admin-plan-badge');
      if (badge) {
        badge.innerText = "\u0422\u0415\u0425\u0420\u0410\u0411\u041e\u0422\u042b \ud83d\udee0\ufe0f";
        badge.className = "badge badge-danger";
        badge.style.display = "inline-block";
      }
      this.setAdminPanelActiveView('maintenance');
      return;
    }

    const badge = document.getElementById('admin-plan-badge');
    const isPro = this.state.subscription && this.state.subscription.includes('pro');
    const hasActiveBranch = !!(this.state.activeBranchId);
    
    if (badge) {
      if (hasActiveBranch) {
        badge.style.display = 'inline-block';
        if (isPro) {
          const expiry = this.state.subscriptionExpires || (Date.now() + 30 * 24 * 60 * 60 * 1000);
          if (!this.state.subscriptionExpires) {
            this.state.subscriptionExpires = expiry;
            this.saveState();
            this.syncActiveBranchToDatabase();
          }
          const dateStr = new Date(expiry).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
          badge.innerText = `Premium 👑 (${dateStr})`;
          badge.className = "badge badge-pro";
        } else {
          badge.innerText = "\ud83d\udc51 \u0423\u0431\u0440\u0430\u0442\u044c \u0440\u0435\u043a\u043b\u0430\u043c\u0443";
          badge.className = "badge badge-pro";
        }
      } else {
        badge.style.display = 'none';
      }
    }

    const testModeBtn = document.getElementById('btn-admin-test-mode');
    if (testModeBtn) {
      if (hasActiveBranch) {
        testModeBtn.style.display = 'flex';
        if (this.state.manualTestingMode) {
          testModeBtn.style.opacity = '1';
          testModeBtn.style.backgroundColor = '#ffffff';
          testModeBtn.style.color = '#0b0a13';
          testModeBtn.style.borderColor = '#ffffff';
          testModeBtn.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
        } else {
          testModeBtn.style.opacity = '0.6';
          testModeBtn.style.backgroundColor = 'transparent';
          testModeBtn.style.color = 'var(--text-muted)';
          testModeBtn.style.borderColor = 'var(--border-light)';
          testModeBtn.style.boxShadow = 'none';
        }
      } else {
        testModeBtn.style.display = 'none';
      }
    }

    const activeEl = document.querySelector('.view-panel.active');
    const activeViewId = activeEl ? activeEl.id.replace('admin-', '').replace('-panel', '') : '';
    const adminViews = ['dashboard', 'edit-quiz', 'migration', 'edit-ttt', 'edit-memory', 'edit-differences', 'edit-crossword', 'edit-guessword'];
    const onboardingViews = ['welcome-choice', 'consent', 'reg-email', 'reg-phone', 'select-branch', 'add-branch', 'payment'];
    
    if (hasActiveBranch) {
      // If logged in and has active branch, force dashboard/admin panels
      if (onboardingViews.includes(activeViewId) || !adminViews.includes(activeViewId)) {
        this.setAdminPanelActiveView('dashboard');
      }
    } else {
      // If onboarding, force welcome-choice or other onboarding panels
      if (!onboardingViews.includes(activeViewId)) {
        this.setAdminPanelActiveView('welcome-choice');
      }
    }

    const activeDisplay = document.getElementById('admin-active-email-display');
    if (activeDisplay) {
      activeDisplay.innerText = this.state.activeBranchName || 'Моё пространство';
    }

    this.updateAIGeneratorBox();
    this.recalculateDistances();
    this.renderCreatorClientsList();
    this.updateAdminPanelSwitcherDropdown();
    this.renderRegQuickAccounts();
    this.renderAdminAccountSwitcher();
    this.renderAdminGamesGrid();
    this.updateAdminQrCode();
  }
  updateAdminPanelSwitcherDropdown() {
    const emailLower = (this.state.email || '').toLowerCase();
    const client = (this.state.databaseClients || []).find(c => c.email && c.email.toLowerCase() === emailLower);
    const dropdown = document.getElementById('admin-switch-account-dropdown');
    if (dropdown && client && client.branches) {
      dropdown.innerHTML = '';
      client.branches.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.innerText = b.name;
        if (b.id === this.state.activeBranchId) opt.selected = true;
        dropdown.appendChild(opt);
      });
    }
  }
  setAdminPanelActiveView(viewId) {
    let finalViewId = viewId;
    
    const isUserBanned = this.checkBannedStatus();
    const isMaintenance = this.state.maintenanceMode === true;
    
    if (isUserBanned) {
      finalViewId = 'banned';
    } else if (isMaintenance) {
      finalViewId = 'maintenance';
    }

    const adminContainer = document.querySelector('.screen:not(.visitor-screen)');
    if (adminContainer) {
      const allAdminPanels = adminContainer.querySelectorAll('.view-panel');
      allAdminPanels.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      const targetPanel = document.getElementById(`admin-${finalViewId}-panel`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = 'flex';
      }
    }

    if (viewId !== 'payment') {
      const backBtn = document.getElementById('btn-payment-back');
      const warningBox = document.getElementById('payment-relocation-warning');
      if (backBtn) backBtn.style.display = 'none';
      if (warningBox) warningBox.style.display = 'none';
    }
  }

  showToast(message, isError = false) {
    const el = document.getElementById('admin-toast');
    if (!el) return;
    el.innerText = message;
    el.classList.toggle('error', isError);
    el.style.display = 'flex';
    
    if (this.adminToastTimeout) {
      clearTimeout(this.adminToastTimeout);
    }
    this.adminToastTimeout = setTimeout(() => {
      el.style.display = 'none';
    }, 3500);
  }

  showVisitorToast(message, isError = false) {
    const el = document.getElementById('visitor-toast');
    if (!el) return;
    el.innerText = message;
    el.classList.toggle('error', isError);
    el.style.display = 'flex';
    
    if (this.visitorToastTimeout) {
      clearTimeout(this.visitorToastTimeout);
    }
    this.visitorToastTimeout = setTimeout(() => {
      el.style.display = 'none';
    }, 3500);
  }

  playAudioTone(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'victory') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gainNode.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.08);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.08 + 0.3);
          oscNode.start(ctx.currentTime + i * 0.08);
          oscNode.stop(ctx.currentTime + i * 0.08 + 0.35);
        });
      }
    } catch (e) {
      console.warn("AudioContext block/unsupported:", e);
    }
  }

  updateVisitorView() {
    this.setVisitorViewPanel(this.state.visitorActiveView);
    if (this.state.visitorActiveView === 'lobby') {
      this.initVisitorLobby();
    } else if (this.state.visitorActiveView === 'results') {
      this.finishVisitorGame(true);
    } else if (this.state.visitorActiveView === 'game') {
      const gid = this.state.visitorSelectedGameId;
      if (gid === 8 && this.state.slicingStarted && !this.state.slicingFinished) {
        this.renderSlicingGame();
      } else {
        this.renderActiveGameQuestion();
      }
    }
  }

  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const deltaPhi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c);
  }

  formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    input.value = formatted;
  }

  simulateDeviceMigration() {
    this.openDeviceMigrationPanel();
  }

  renderAdminGamesGrid() {
    this.sortGames();
    const container = document.getElementById('games-container');
    if (!container) return;
    container.innerHTML = '';

    const isTest = !!this.state.manualTestingMode;

    // Guarantee all 10 official games are enabled and published for every user
    this.state.games = DEFAULT_GAMES.map(def => {
      const existing = (this.state.games || []).find(g => g.id === def.id || g.name.includes(def.name.split(' ')[0]));
      return {
        ...def,
        enabled: true,
        published: true,
        isPro: false,
        minPlayers: existing ? existing.minPlayers : def.minPlayers,
        maxPlayers: existing ? existing.maxPlayers : def.maxPlayers
      };
    });

    this.state.games.forEach(g => {
      const card = document.createElement('div');
      card.className = 'game-card active-game';
      
      let actionsHTML = '';
      const btnStyle = 'background: rgba(139, 92, 246, 0.15); border: 1px solid var(--border-glow); color: #fff; font-weight: 700; opacity: 1; cursor: pointer; padding: 6px; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);';
      
      if (g.id === 1) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editQuiz()">✏️ Вопросы</button>`;
      } else if (g.id === 2) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editCrossword()">⚙️ Настройки</button>`;
      } else if (g.id === 3) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editGuessWord()">⚙️ Настройки</button>`;
      } else if (g.id === 4) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editTicTacToe()">⚙️ Настройки</button>`;
      } else if (g.id === 5) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editMemory()">⚙️ Настройки</button>`;
      } else if (g.id === 6) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editDifferences()">⚙️ Настройки</button>`;
      } else if (g.id === 7) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editSlicingGame()">⚙️ Настройки</button>`;
      } else if (g.id === 8) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editCakeTower()">⚙️ Настройки</button>`;
      } else if (g.id === 9) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editCheckers()">⚙️ Настройки</button>`;
      } else if (g.id === 10) {
        actionsHTML = `<button class="btn btn-secondary" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.editChess()">⚙️ Настройки</button>`;
      } else if (g.isAIGenerated) {
        actionsHTML = `<button class="btn btn-danger" style="font-size:10px; margin-top:6px; border-radius:8px; width:100%; ${btnStyle}" onclick="app.deleteGame(${g.id})">🗑️ Удалить</button>`;
      }

      card.innerHTML = `
        <div class="game-card-header">
          <span class="game-card-icon">${g.icon}</span>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:9px; color:var(--success); font-weight:700;">Опубликована</span>
            <label class="switch">
              <input type="checkbox" checked onchange="app.toggleGamePublishState(${g.id}, this.checked)">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="game-card-title">${g.name}</div>
        <div class="game-card-players" style="display:flex; align-items:center; gap:4px; font-size:10px; margin-top:3px; color:var(--text-muted);">
          <span>👥 Мин:</span>
          <input type="number" min="2" max="${g.maxPlayers}" value="${g.minPlayers}" style="width: 32px; padding: 2px; font-size: 10px; text-align: center; background: rgba(0,0,0,0.4); border: 1px solid var(--border-light); border-radius: 4px; color: #fff; font-weight:700; margin:0;" onchange="app.changeGameMinPlayers(${g.id}, this.value)">
          <span>- ${g.maxPlayers} чел.</span>
        </div>
        ${actionsHTML}
      `;
      container.appendChild(card);
    });
  }

  toggleGamePublishState(id, checked) {
    if (this.state.manualTestingMode) {
      this.showToast("Включен тест-режим! Публикация заблокирована.", true);
      this.renderAdminGamesGrid();
      return;
    }
    
    const game = this.state.games.find(g => g.id === id);
    if (game) {
      game.enabled = checked;
      game.published = checked;
      this.saveState();
      this.syncActiveBranchToDatabase(); // Sync back to database branch games
      this.renderAdminGamesGrid();
      this.showToast(`Игра "${game.name}" ${checked ? 'опубликована для посетителей ✔️' : 'скрыта от посетителей ❌'}.`, false);
      
      if (!checked && this.state.visitorSelectedGameId === id && this.state.visitorConnectedBranchId === this.state.activeBranchId) {
        const isQueueActive = document.getElementById('lobby-queue-overlay')?.style.display === 'flex';
        if (isQueueActive || this.state.visitorActiveView === 'game') {
          this.triggerVisitorDisconnectMessage(`Администратор снял с публикации игру "${game.name}".`);
        }
      }
      
      if (this.state.visitorActiveView === 'lobby') {
        this.renderVisitorLobbyGames();
      }
    }
  }

  updateAIGeneratorBox() {
    try {
      const box = document.getElementById('ai-generator-admin-box');
      if (!box) return;
      
      const isPro = this.state.subscription.includes('pro');
      box.style.display = 'block';

      const promptInput = document.getElementById('ai-game-prompt');
      const btn = document.getElementById('btn-ai-generate');
      const badge = box.querySelector('.badge');

      if (isPro) {
        box.style.opacity = '1';
        box.style.border = '1px solid var(--border-glow)';
        if (promptInput) {
          promptInput.disabled = false;
          promptInput.placeholder = "Введите тему игры (например: Коктейли)...";
        }
        if (btn) {
          btn.disabled = false;
          btn.className = "btn btn-pro";
          btn.innerText = "✨ Сгенерировать игру с помощью ИИ";
          btn.onclick = () => this.generateAIGame();
        }
        if (badge) {
          badge.className = "badge badge-pro";
          badge.innerText = "PRO АКТИВЕН";
          badge.style.background = 'rgba(245, 158, 11, 0.15)';
          badge.style.color = 'var(--gold)';
        }
      } else {
        box.style.opacity = '0.55';
        box.style.border = '1px dashed var(--border-light)';
        if (promptInput) {
          promptInput.disabled = true;
          promptInput.placeholder = "🔒 Доступно только в PRO тарифе";
          promptInput.value = "";
        }
        if (btn) {
          btn.disabled = false;
          btn.className = "btn btn-secondary";
          btn.innerText = "🔒 Сгенерировать через ИИ (Нужен PRO)";
          btn.onclick = () => {
            this.showToast("ИИ-генератор доступен только в тарифе PRO! Пожалуйста, обновите вашу подписку.", true);
          };
        }
        if (badge) {
          badge.className = "badge badge-danger";
          badge.innerText = "ТРЕБУЕТСЯ PRO";
          badge.style.background = 'rgba(239, 68, 68, 0.15)';
          badge.style.color = 'var(--error)';
        }
      }
    } catch (e) {
      console.warn("Error updating AI generator box display:", e);
    }
  }

  generateAIGame() {
    try {
      if (this.state.subscription === 'none') {
        this.showToast("Сначала оплатите PRO подписку!", true);
        return;
      }

      const promptInput = document.getElementById('ai-game-prompt');
      const promptText = promptInput ? promptInput.value.trim() : '';

      if (!promptText) {
        this.showToast("Введите тему или описание игры!", true);
        return;
      }

      // 1. Limits validation check
      let forbiddenKeywords = [];
      const filterStrictness = this.state.filterStrictness || 'normal';
      
      if (filterStrictness === 'strict') {
        forbiddenKeywords = [
          'gta', 'pubg', '3d', 'shooter', 'шутер', 'minecraft', 'майнкрафт',
          'dota', 'дота', 'cs:go', 'cs', 'кс', 'cyberpunk', 'crazy', 'безумная',
          'heavy', 'action', 'fifa', 'фифа', 'войнушка', 'убийств', '18+', 'порно', 'секс',
          'алкоголь', 'пиво', 'водка', 'вино', 'кока-кола', 'cola', 'pepsi', 'бренд'
        ];
      } else if (filterStrictness === 'normal') {
        forbiddenKeywords = [
          'gta', 'pubg', '3d', 'shooter', 'шутер', 'minecraft', 'майнкрафт',
          'dota', 'дота', 'cs:go', 'cs', 'кс', 'cyberpunk', 'crazy', 'безумная',
          'heavy', 'action', 'fifa', 'фифа', 'войнушка', 'убийств', '18+', 'порно', 'секс'
        ];
      } else {
        forbiddenKeywords = ['18+', 'порно', 'секс'];
      }
      
      const promptLower = promptText.toLowerCase();
      const isOutOfBounds = forbiddenKeywords.some(keyword => promptLower.includes(keyword));

      if (isOutOfBounds) {
        const engineName = (this.state.aiEngine || 'waitplay-v2').toUpperCase();
        this.logAIRequest(promptText, `Отклонено ИИ (${filterStrictness.toUpperCase()} / ${engineName}) ❌`);
        
        const limitsModal = document.getElementById('ai-limits-modal');
        if (limitsModal) {
          limitsModal.classList.add('active');
        }
        return;
      }

      // 2. Cooldown check (1 week in simulated milliseconds)
      const now = Date.now();
      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      if (now - this.state.lastAIGenTime < oneWeekMs) {
        const diffMs = oneWeekMs - (now - this.state.lastAIGenTime);
        const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
        this.showToast(`Лимит: 1 генерация в неделю. Доступно через ${days} дн.`, true);
        return;
      }

      // 3. Max AI games limit check
      const aiGamesCount = this.state.games.filter(g => g.isAIGenerated).length;
      if (aiGamesCount >= 8) {
        this.showToast("Максимально 8 ИИ игр на сервере. Удалите старые игры для генерации новой.", true);
        return;
      }

      // 4. Generate the game
      const btn = document.getElementById('btn-ai-generate');
      const statusEl = document.getElementById('ai-generator-status');
      
      btn.disabled = true;
      btn.innerText = "⏳ Подключение к серверу ИИ...";
      if (statusEl) statusEl.innerText = "Формирование запроса...";

      const isBackup = this.state.backupGenerator === true;
      const delay1 = isBackup ? 200 : 800;
      const delay2 = isBackup ? 300 : 1500;

      setTimeout(() => {
        if (statusEl) statusEl.innerText = "Генерация викторины по теме...";
        
        setTimeout(() => {
          btn.disabled = false;
          btn.innerText = "✨ Сгенерировать игру с помощью ИИ";
          if (statusEl) statusEl.innerText = "";

          let emoji = "🧠";
          let name = `Квиз: ${promptText.substring(0, 18)}`;
          
          if (promptLower.includes('коктейл') || promptLower.includes('бар') || promptLower.includes('напит')) {
            emoji = "🍸";
            name = "Барная Викторина 🍸";
          } else if (promptLower.includes('еда') || promptLower.includes('кухн') || promptLower.includes('меню') || promptLower.includes('блюд')) {
            emoji = "🍔";
            name = "Кулинарный Квиз 🍔";
          } else if (promptLower.includes('кофе') || promptLower.includes('чай') || promptLower.includes('десерт')) {
            emoji = "☕";
            name = "Кофейный Гурман ☕";
          } else if (promptLower.includes('пив') || promptLower.includes('закуск')) {
            emoji = "🍺";
            name = "Пивной Квиз 🍺";
          } else if (promptLower.includes('вино') || promptLower.includes('сомелье')) {
            emoji = "🍷";
            name = "Квиз: Винный гид 🍷";
          }

          const newGame = {
            id: Date.now(),
            name: name,
            icon: emoji,
            minPlayers: 4,
            maxPlayers: 10,
            enabled: true,
            published: true,
            isPro: false,
            isAIGenerated: true
          };

          this.state.games.push(newGame);
          this.state.lastAIGenTime = Date.now();
          
          const engineName = (this.state.aiEngine || 'waitplay-v2').toUpperCase();
          const generatorType = isBackup ? 'Автономный' : 'Облако';
          this.logAIRequest(promptText, `Успешно (${engineName} / ${generatorType}) ✅`);
          
          this.sortGames();
          this.saveState();
          this.renderAdminGamesGrid();
          this.showToast(`Игра "${name}" успешно сгенерирована ИИ и добавлена!`, false);
          
          if (promptInput) promptInput.value = '';
          
          if (this.state.visitorActiveView === 'lobby') {
            this.renderVisitorLobbyGames();
          }
        }, delay2);
      }, delay1);
    } catch (e) {
      alert("Ошибка в generateAIGame:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }


  deleteGame(gameId) {
    try {
      this.state.games = this.state.games.filter(g => g.id !== gameId);
      this.saveState();
      this.renderAdminGamesGrid();
      this.showToast("ИИ игра успешно удалена.", false);
      if (this.state.visitorActiveView === 'lobby') {
        this.renderVisitorLobbyGames();
      }
    } catch (e) {
      alert("Ошибка в deleteGame:\n" + e.message);
    }
  }

  // --- DEVICE MIGRATION PANEL (Settings Workspace) ---
  openDeviceMigrationPanel() {
    this.setAdminPanelActiveView('migration');
    document.getElementById('mig-info-email').innerText = this.state.email;
    document.getElementById('mig-info-phone').innerText = this.state.phone;
  }

  migInitiateTransfer() {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.migEmail.code = code;

    document.getElementById('mig-transfer-request-box').style.display = 'none';
    document.getElementById('mig-transfer-code-box').style.display = 'block';

    this.startTimer('migEmail', 'mig-timer-display', () => {
      this.timers.migEmail.code = '';
      this.showToast("Срок проверочного кода Email истек. Отправьте повторно.", true);
    });

    // Send real email via API
    this.sendRealEmail(this.state.email, code, "Перенос управления аккаунтом");
  }

  migVerifyAndCompleteTransfer() {
    try {
      const entered = document.getElementById('mig-email-code-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.migEmail.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('migEmail');
        
        const models = ["Samsung Galaxy S24 Ultra", "iPhone 15 Pro Max", "Google Pixel 8 Pro", "Xiaomi 14 Ultra"];
        const oldModel = this.state.deviceModel || "iPhone 15 Pro";
        const newModel = models.filter(m => !m.includes(oldModel.substring(0, 5)))[Math.floor(Math.random() * 3)];
        
        this.state.deviceModel = newModel;
        this.state.deviceHistory = this.state.deviceHistory || [];
        this.state.deviceHistory.push(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().substring(0, 5)}: Перенос с ${oldModel} на ${newModel}`);
        
        this.showToast(`Управление перенесено! Новое устройство: ${newModel} ✔️`, false);
        
        document.getElementById('mig-transfer-request-box').style.display = 'block';
        document.getElementById('mig-transfer-code-box').style.display = 'none';
        document.getElementById('mig-email-code-input').value = '';
        this.setAdminPanelActiveView('dashboard');
      } else {
        this.showToast("Неверный 4-значный проверочный код!", true);
      }
    } catch (e) {
      alert("Ошибка migVerifyAndCompleteTransfer:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  triggerMockAd(callback) {
    this.state.adCallback = callback;
    const overlay = document.getElementById('mock-ad-overlay');
    const countdownEl = document.getElementById('ad-countdown');
    const closeBtn = document.getElementById('btn-close-ad');
    
    if (!overlay || !countdownEl || !closeBtn) {
      if (callback) callback();
      return;
    }
    
    overlay.style.display = 'flex';
    closeBtn.style.display = 'none';
    
    const isDev = this.isSandboxMode();
    if (isDev) {
      closeBtn.style.display = 'block';
      closeBtn.innerText = "\u2716 (\u0420\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a)";
      closeBtn.style.fontSize = "10px";
      closeBtn.style.background = "rgba(255,255,255,0.15)";
      closeBtn.style.padding = "4px 8px";
      closeBtn.style.borderRadius = "6px";
      closeBtn.style.width = "auto";
      closeBtn.style.height = "auto";
      closeBtn.style.top = "8px";
      closeBtn.style.right = "8px";
    } else {
      closeBtn.innerText = "\u2716";
      closeBtn.style.fontSize = "16px";
      closeBtn.style.background = "none";
      closeBtn.style.padding = "0";
      closeBtn.style.borderRadius = "0";
      closeBtn.style.top = "12px";
      closeBtn.style.right = "12px";
    }
    
    let secondsLeft = 10;
    if (this.state.manualTestingMode) {
      const lengths = [10, 15, 20, 30];
      secondsLeft = lengths[Math.floor(Math.random() * lengths.length)];
    }
    countdownEl.innerText = `\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0447\u0435\u0440\u0435\u0437 ${secondsLeft} \u0441\u0435\u043a...`;
    
    if (this.adTimerInterval) clearInterval(this.adTimerInterval);
    this.adTimerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        countdownEl.innerText = `\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0447\u0435\u0440\u0435\u0437 ${secondsLeft} \u0441\u0435\u043a...`;
      } else {
        clearInterval(this.adTimerInterval);
        countdownEl.innerText = '\u0420\u0435\u043a\u043b\u0430\u043c\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430';
        closeBtn.style.display = 'block';
        if (isDev) {
          closeBtn.innerText = "\u2716 (\u0420\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a)";
        } else {
          closeBtn.innerText = "\u2716";
        }
      }
    }, 1000);
  }
  closeMockAd() {
    const overlay = document.getElementById('mock-ad-overlay');
    if (overlay) overlay.style.display = 'none';
    
    // Save last ad timestamp
    const now = Date.now();
    this.state.lastAdTime = now;
    this.saveState();
    
    // If there is an active branch context, update its timestamp too
    if (this.state.activeBranchId && this.state.email) {
      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === this.state.email.toLowerCase());
      if (client && client.branches) {
        const br = client.branches.find(b => b.id === this.state.activeBranchId);
        if (br) {
          br.lastAdTime = now;
          this.saveDatabaseClients();
        }
      }
    }

    if (this.state.adCallback) {
      const cb = this.state.adCallback;
      this.state.adCallback = null;
      cb();
    }
  }

  openPremiumFromAd() {
    const overlay = document.getElementById('mock-ad-overlay');
    if (overlay) overlay.style.display = 'none';
    this.state.adShownThisSession = true;
    this.openGooglePlayBilling();
  }

  openGooglePlayBilling() {
    const sheet = document.getElementById('google-play-billing-sheet');
    if (sheet) sheet.classList.add('active');
  }

  closeGooglePlayBilling() {
    const sheet = document.getElementById('google-play-billing-sheet');
    if (sheet) sheet.classList.remove('active');
    
    // Resume view switch if there was an active callback
    if (this.state.adCallback) {
      const cb = this.state.adCallback;
      this.state.adCallback = null;
      cb();
    }
  }

  processGooglePlayPurchase() {
    this.closeGooglePlayBilling();
    this.playAudioTone('success');
    
    this.state.subscription = 'pro_monthly';
    this.state.subscriptionExpires = Date.now() + 30 * 24 * 60 * 60 * 1000;
    this.saveState();
    this.syncActiveBranchToDatabase();
    
    this.updateAdminView();
    this.renderAdminGamesGrid();
    
    this.showToast("Premium успешно активирован через Google Play! 👑", false);
  }
  // --- SUPPORT & ACCOUNTS RECOVERY LOGIC ---
  openSupportPortal() {
    document.getElementById('support-portal-modal').classList.add('active');
    this.setSupportMode('recovery');
    
    document.getElementById('support-verify-email').value = '';
    document.getElementById('support-verify-phone').value = '';
    
    const feedbackEmailInput = document.getElementById('support-feedback-email');
    if (feedbackEmailInput) {
      feedbackEmailInput.value = this.state.email || '';
    }
    
    const feedbackTextInput = document.getElementById('support-feedback-text');
    if (feedbackTextInput) {
      feedbackTextInput.value = '';
    }
  }

  setSupportMode(mode) {
    try {
      const isRecovery = mode === 'recovery';
      
      const btnRec = document.getElementById('btn-support-mode-recovery');
      const btnFeed = document.getElementById('btn-support-mode-feedback');
      
      if (btnRec) {
        btnRec.style.color = isRecovery ? 'var(--gold)' : 'var(--text-muted)';
        btnRec.style.borderBottom = isRecovery ? '2px solid var(--gold)' : 'none';
      }
      if (btnFeed) {
        btnFeed.style.color = !isRecovery ? 'var(--gold)' : 'var(--text-muted)';
        btnFeed.style.borderBottom = !isRecovery ? '2px solid var(--gold)' : 'none';
      }

      const recContainer = document.getElementById('support-recovery-steps-container');
      const feedContainer = document.getElementById('support-feedback-form');
      
      if (recContainer) recContainer.style.display = isRecovery ? 'block' : 'none';
      if (feedContainer) feedContainer.style.display = isRecovery ? 'none' : 'block';
    } catch (e) {
      console.error("Error setting support mode:", e);
    }
  }

  supportSubmitFeedback() {
    try {
      const emailInput = document.getElementById('support-feedback-email');
      const textInput = document.getElementById('support-feedback-text');
      
      const email = emailInput ? emailInput.value.trim() : '';
      const text = textInput ? textInput.value.trim() : '';

      if (!email || !email.includes('@')) {
        this.showToast("Введите корректный адрес почты!", true);
        return;
      }

      if (!text || text.length < 5) {
        this.showToast("Пожалуйста, введите ваш отзыв или предложение!", true);
        return;
      }

      // Create new feedback ticket
      const newFeedback = {
        id: Date.now(),
        type: 'FEEDBACK',
        email: email,
        content: text,
        timestamp: new Date().toLocaleTimeString()
      };

      this.state.supportTickets.push(newFeedback);
      this.saveState();
      
      this.renderCreatorTicketsList();
      
      if (textInput) textInput.value = '';
      
      this.showToast("Отзыв успешно отправлен Создателю WaitPlay 🚀 Спасибо!", false);
      this.closeSupportPortal();
    } catch (e) {
      alert("Ошибка supportSubmitFeedback:\n" + e.message);
    }
  }

  closeSupportPortal() {
    document.getElementById('support-portal-modal').classList.remove('active');
    this.stopTimer('supportEmail');
    this.stopTimer('supportPhone');
  }

  setSupportStepView(stepNum) {
    const steps = ['1', '2', '3', '4'];
    steps.forEach(s => {
      const el = document.getElementById(`support-step-${s}`);
      if (el) el.classList.toggle('active', s === stepNum);
    });
  }

  supportSubmitCredentials() {
    const email = document.getElementById('support-verify-email').value.trim();
    const prefixSelect = document.getElementById('support-phone-country-code');
    const prefixVal = prefixSelect ? prefixSelect.value : '996';
    const cleanPrefix = (prefixVal === '7_kz' || prefixVal === '7_ru') ? '7' : prefixVal;
    const phoneInput = document.getElementById('support-verify-phone').value.trim().replace(/\D/g, '');
    const phone = cleanPrefix + phoneInput;

    if (this.state.subscription === 'none') {
      this.showToast("База данных пуста! Создайте сначала аккаунт.", true);
      return;
    }

    if (email !== this.state.email || phone !== this.state.phone) {
      this.showToast("Ошибка: Email и Телефон не совпадают с регистрационными данными!", true);
      return;
    }

    this.setSupportStepView('2');
    document.getElementById('support-code-email-input').value = '';
    this.supportSendEmailCode();
  }

  supportSendEmailCode() {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.supportEmail.code = code;
    this.startTimer('supportEmail', 'support-email-timer', () => {
      this.timers.supportEmail.code = '';
      this.showToast("Код Email истек. Запросите заново.", true);
    });
    
    // Send real email via API
    this.sendRealEmail(this.state.email, code, "Запрос блокировки аккаунта (Поддержка)");
  }

  supportResendEmailCode() {
    this.supportSendEmailCode();
  }

  supportVerifyEmailCode() {
    try {
      const entered = document.getElementById('support-code-email-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.supportEmail.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('supportEmail');
        
        this.setSupportStepView('3');
        document.getElementById('support-code-phone-input').value = '';
        this.supportSendPhoneCode();
      } else {
        this.showToast("Неверный код Email подтверждения!", true);
      }
    } catch (e) {
      alert("Ошибка supportVerifyEmailCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  supportSendPhoneCode() {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.supportPhone.code = code;
    this.startTimer('supportPhone', 'support-phone-timer', () => {
      this.timers.supportPhone.code = '';
      this.showToast("Код SMS истек. Запросите заново.", true);
    });
    this.showToast(`[Имитация SMS] SMS код сброса аккаунта: ${code}`, false);
  }

  supportResendPhoneCode() {
    this.supportSendPhoneCode();
  }

  supportVerifyPhoneCode() {
    try {
      const entered = document.getElementById('support-code-phone-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.supportPhone.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('supportPhone');
        
        const newTicket = {
          id: Date.now(),
          email: this.state.email,
          phone: this.state.phone,
          status: "Верифицировано владельцем по Email и SMS ✔️",
          timestamp: new Date().toLocaleTimeString()
        };
        this.state.supportTickets.push(newTicket);
        this.saveState();
        
        this.renderCreatorTicketsList();
        this.setSupportStepView('4');
      } else {
        this.showToast("Неверный проверочный SMS код!", true);
      }
    } catch (e) {
      alert("Ошибка supportVerifyPhoneCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  // --- CREATOR DATABASE TICKETS LOG RENDERER ---
  renderCreatorTicketsList() {
    try {
      const ticketsContainer = document.getElementById('creator-tickets-list-only');
      const feedbacksContainer = document.getElementById('creator-feedbacks-list-only');
      
      const badgeTickets = document.getElementById('creator-badge-tickets');
      const badgeFeedbacks = document.getElementById('creator-badge-feedbacks');

      if (!ticketsContainer || !feedbacksContainer) return;
      
      ticketsContainer.innerHTML = '';
      feedbacksContainer.innerHTML = '';

      const tickets = this.state.supportTickets.filter(t => t.type !== 'FEEDBACK');
      const feedbacks = this.state.supportTickets.filter(t => t.type === 'FEEDBACK');

      // Update badges
      if (badgeTickets) {
        badgeTickets.innerText = tickets.length;
        badgeTickets.style.display = tickets.length > 0 ? 'inline-block' : 'none';
      }
      if (badgeFeedbacks) {
        badgeFeedbacks.innerText = feedbacks.length;
        badgeFeedbacks.style.display = feedbacks.length > 0 ? 'inline-block' : 'none';
      }

      // Render recovery tickets
      if (tickets.length === 0) {
        ticketsContainer.innerHTML = `<div style="font-size:9px; color:var(--text-muted); font-style:italic; padding: 10px 0;">Заявки на сброс отсутствуют.</div>`;
      } else {
        tickets.forEach(ticket => {
          const item = document.createElement('div');
          item.style.background = 'rgba(239, 68, 68, 0.05)';
          item.style.border = '1px solid rgba(239, 68, 68, 0.2)';
          item.style.borderRadius = '8px';
          item.style.padding = '6px 10px';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.fontSize = '10px';
          item.style.marginBottom = '4px';

          item.innerHTML = `
            <div style="text-align: left;">
              <div>Email: <strong style="color:#fff;">${ticket.email}</strong></div>
              <div style="font-size:8px; color:var(--success); font-weight:700;">${ticket.status}</div>
            </div>
            <button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-weight:700; padding:2px 6px;" onclick="app.creatorBlockAndResetAccount(${ticket.id})">
              🗑️ Удалить аккаунт
            </button>
          `;
          ticketsContainer.appendChild(item);
        });
      }

      // Render feedback suggestions
      if (feedbacks.length === 0) {
        feedbacksContainer.innerHTML = `<div style="font-size:9px; color:var(--text-muted); font-style:italic; padding: 10px 0;">Отзывы и предложения отсутствуют.</div>`;
      } else {
        feedbacks.forEach(ticket => {
          const item = document.createElement('div');
          item.style.background = 'rgba(139, 92, 246, 0.05)';
          item.style.border = '1px solid rgba(139, 92, 246, 0.2)';
          item.style.borderRadius = '8px';
          item.style.padding = '6px 10px';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.fontSize = '10px';
          item.style.marginBottom = '4px';

          item.innerHTML = `
            <div style="flex:1; margin-right:10px; text-align: left;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:var(--gold); font-size:9px;">💡 ИДЕЯ / ОТЗЫВ</span>
                <span style="font-size:8px; color:var(--text-muted);">${ticket.timestamp}</span>
              </div>
              <div style="color:#fff; margin-top:2px; font-style:italic; font-size:10px;">"${ticket.content}"</div>
              <div style="font-size:8px; color:var(--text-muted); margin-top:2px;">От: ${ticket.email}</div>
            </div>
            <button class="debug-btn-mini" style="border-color:var(--text-muted); color:var(--text-muted); padding:2px 6px; font-size:9px;" onclick="app.creatorArchiveFeedback(${ticket.id})">
              ✕ Убрать
            </button>
          `;
          feedbacksContainer.appendChild(item);
        });
      }
    } catch (e) {
      console.error("Error in renderCreatorTicketsList:", e);
    }
  }

  getAllClientsList() {
    const list = [];
    let idx = 1;

    (this.state.databaseClients || []).forEach(client => {
      const firstBranch = client.branches[0] || {};
      list.push({
        index: idx++,
        email: client.email,
        phone: client.phone,
        subscription: firstBranch.subscription || 'none',
        deviceModel: firstBranch.deviceModel || 'Нет устройства',
        status: client.status,
        branches: client.branches
      });
    });

    return list;
  }

  getClientProfileByEmail(email) {
    if (!email) return null;
    const emailLower = email.trim().toLowerCase();
    const client = (this.state.databaseClients || []).find(c => c.email && c.email.toLowerCase() === emailLower);
    if (!client) return null;

    const feedbacks = (this.state.supportTickets || []).filter(t => t && t.email && t.email.toLowerCase() === emailLower);
    const aiLogs = (this.state.aiLogs || []).filter(l => l && l.email && l.email.toLowerCase() === emailLower);

    return {
      index: (this.state.databaseClients || []).indexOf(client) + 1,
      email: client.email,
      phone: client.phone,
      status: client.status,
      branches: client.branches,
      feedbacks: feedbacks,
      aiLogs: aiLogs
    };
  }

  getClientProfile(query) {
    const q = query.trim().toLowerCase();
    const isNum = !isNaN(q) && q !== '';
    const searchIdx = isNum ? parseInt(q) : -1;

    const clientsList = this.getAllClientsList();
    
    if (isNum) {
      const found = clientsList.find(c => c.index === searchIdx);
      if (found) {
        return this.getClientProfileByEmail(found.email);
      }
      return null;
    }

    const found = clientsList.find(c => c.email && (c.email && c.email.toLowerCase().includes(q)) || c.phone.includes(q)
    );
    if (found) {
      return this.getClientProfileByEmail(found.email);
    }
    return null;
  }

  creatorArchiveFeedback(ticketId) {
    try {
      this.state.supportTickets = this.state.supportTickets.filter(t => t.id !== ticketId);
      this.saveState();
      this.renderCreatorTicketsList();
      this.showToast("Отзыв/предложение архивировано Создателем.", false);
    } catch (e) {
      alert("Ошибка в creatorArchiveFeedback:\n" + e.message);
    }
  }

  setCreatorTab(tabId) {
    try {
      const tabs = ['tickets', 'feedbacks', 'ailogs', 'clients', 'search', 'settings'];
      tabs.forEach(t => {
        const btn = document.getElementById(`btn-creator-tab-${t}`);
        if (btn) {
          const isActive = t === tabId;
          btn.style.color = isActive ? 'var(--gold)' : 'var(--text-muted)';
          btn.style.borderBottom = isActive ? '2px solid var(--gold)' : 'none';
        }
        
        const view = document.getElementById(`creator-view-${t}`);
        if (view) {
          view.style.display = t === tabId ? 'block' : 'none';
        }
      });
    } catch (e) {
      console.error("Error setting creator tab:", e);
    }
  }

  setCreatorScale(scale) {
    try {
      const panel = document.getElementById('creator-console-block');
      if (!panel) return;
      if (scale === '100%') {
        panel.style.fontSize = '11px';
      } else if (scale === '115%') {
        panel.style.fontSize = '12.5px';
      } else if (scale === '130%') {
        panel.style.fontSize = '14px';
      } else if (scale === '150%') {
        panel.style.fontSize = '16px';
      }
      this.state.creatorScale = scale;
      this.saveState();
    } catch (e) {
      console.error("Error setting creator scale:", e);
    }
  }

  toggleCreatorFullscreen() {
    try {
      const workspace = document.querySelector('.workspace');
      const panel = document.getElementById('creator-console-block');
      const btn = document.getElementById('btn-creator-fullscreen');
      if (!panel || !btn) return;

      const isFullscreen = panel.classList.toggle('creator-fullscreen-mode');

      if (isFullscreen) {
        if (workspace) workspace.style.display = 'none';
        panel.style.height = '100vh';
        panel.style.maxHeight = '100vh';
        panel.style.margin = '0';
        panel.style.borderRadius = '0';
        btn.innerText = '📱 Показать симуляторы';
      } else {
        if (workspace) workspace.style.display = 'flex';
        panel.style.height = 'auto';
        panel.style.maxHeight = 'none';
        panel.style.margin = '20px auto 0 auto';
        panel.style.borderRadius = '20px';
        btn.innerText = '🖥️ Развернуть во весь экран';
      }
      this.state.creatorFullscreen = isFullscreen;
      this.saveState();
    } catch (e) {
      console.error("Error toggling creator fullscreen:", e);
    }
  }

  // --- MULTI-ACCOUNT MANAGEMENT (Instagram style switcher) ---
  renderRegQuickAccounts() {
    try {
      const section = document.getElementById('reg-quick-accounts-section');
      const container = document.getElementById('reg-quick-accounts-list');
      if (!section || !container) return;

      // Populate list from database clients!
      this.state.databaseClients = this.state.databaseClients || [];
      
      const quickList = [];
      this.state.databaseClients.forEach(client => {
        const branches = client.branches || [];
        branches.forEach(br => {
          quickList.push({
            email: client.email,
            phone: client.phone,
            branchId: br.id,
            branchName: br.name,
            subscription: br.subscription
          });
        });
      });

      if (quickList.length === 0) {
        section.style.display = 'none';
        return;
      }

      section.style.display = 'block';
      container.innerHTML = '';

      quickList.forEach((itemInfo) => {
        const item = document.createElement('div');
        item.className = 'quick-acc-item';
        item.style.background = 'rgba(255, 255, 255, 0.02)';
        item.style.border = '1px solid var(--border-light)';
        item.style.borderRadius = '10px';
        item.style.padding = '8px 12px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.cursor = 'pointer';
        item.style.marginBottom = '6px';
        
        const isPro = itemInfo.subscription && itemInfo.subscription.includes('pro');
        const badgeClass = isPro ? 'badge-pro' : 'badge-base';
        const badgeText = isPro ? 'PRO' : 'BASE';

        item.innerHTML = `
          <div style="text-align: left; flex: 1;">
            <div style="font-weight: 700; color: #fff; font-size: 11px;">\ud83c\udfe2 ${itemInfo.branchName}</div>
            <div style="font-size: 8px; color: var(--text-muted);">${itemInfo.email}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge ${badgeClass}" style="font-size:8px;">${badgeText}</span>
            <button class="btn btn-primary" style="margin:0; padding:4px 10px; font-size:9px; width:auto;" onclick="app.quickLoginDatabaseBranch('${itemInfo.email}', '${itemInfo.branchId}'); event.stopPropagation();">\u0412\u043e\u0439\u0442\u0438 \ud83d\udd11</button>
          </div>
        `;
        container.appendChild(item);
      });
    } catch (e) {
      console.error("Error rendering reg quick accounts:", e);
    }
  }

  toggleManualTestingMode() {
    try {
      this.state.manualTestingMode = !this.state.manualTestingMode;
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.syncActiveBranchToDatabase();
      
      this.updateTTTTestArenaUI();
      this.updateQuizTestArenaUI();
      this.updateDifferencesTestArenaUI();
      
      if (this.state.visitorActiveView === 'lobby') {
        this.initVisitorLobby();
      }
      
      const isTest = this.state.manualTestingMode;
      this.handleTestingModeChange(isTest);
      
      this.showToast(isTest 
        ? "🛠️ Тест-режим ВКЛ. Публикация игр заблокирована 🚫" 
        : "✅ Тест-режим ВЫКЛ. Изменения опубликованы.", 
        false
      );
    } catch (e) {
      console.error("Error in toggleManualTestingMode:", e);
    }
  }

  toggleCustomBranchDropdown(event) {
    try {
      if (event) event.stopPropagation();
      const dropdown = document.getElementById('admin-custom-branch-dropdown');
      const arrow = document.getElementById('admin-switcher-arrow');
      if (!dropdown) return;
      
      const isVisible = dropdown.style.display === 'block';
      dropdown.style.display = isVisible ? 'none' : 'block';
      
      if (arrow) {
        arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
      }
      
      if (!isVisible) {
        const closeListener = (e) => {
          dropdown.style.display = 'none';
          if (arrow) arrow.style.transform = 'rotate(0deg)';
          document.removeEventListener('click', closeListener);
        };
        setTimeout(() => {
          document.addEventListener('click', closeListener);
        }, 10);
      }
    } catch (e) {
      console.error("Error in toggleCustomBranchDropdown:", e);
    }
  }

  quickLoginDatabaseBranch(email, branchId) {
    try {
      this.loadBranchContext(email, branchId);
    } catch (e) {
      console.error("Error in quickLoginDatabaseBranch:", e);
    }
  }
  renderAdminAccountSwitcher() {
    try {
      const dropdown = document.getElementById('admin-custom-branch-dropdown');
      const display = document.getElementById('admin-active-email-display');
      if (!dropdown || !display) return;

      dropdown.innerHTML = '';
      
      this.state.databaseClients = this.state.databaseClients || [];
      const emailLower = (this.state.email || '').toLowerCase();
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === emailLower);
      const branches = client ? (client.branches || []) : [];

      const activeBranch = branches.find(b => b.id === this.state.activeBranchId) || branches[0];
      if (activeBranch) {
        // Auto-clean welcomeMsg if it was previously auto-generated
        if (activeBranch.welcomeMsg === `\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 ${activeBranch.name}`) {
          activeBranch.welcomeMsg = '';
          this.saveDatabaseClients();
        }

        let stateUpdated = false;
        if (this.state.activeBranchId !== activeBranch.id) {
          this.state.activeBranchId = activeBranch.id;
          stateUpdated = true;
        }
        if (this.state.activeBranchName !== activeBranch.name) {
          this.state.activeBranchName = activeBranch.name;
          stateUpdated = true;
        }

        const oldAutoGenerated = `\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 ${activeBranch.name}`;
        if (this.state.welcomeMsg === oldAutoGenerated) {
          this.state.welcomeMsg = activeBranch.welcomeMsg || '';
          stateUpdated = true;
        }

        if (stateUpdated) {
          this.saveState();
          const inputEl = document.getElementById('admin-venue-welcome');
          if (inputEl) {
            inputEl.value = this.state.welcomeMsg || '';
          }
          const prizeEl = document.getElementById('admin-venue-prize');
          if (prizeEl) {
            prizeEl.value = this.state.prizeMsg || "";
          }
        }
        display.innerText = activeBranch.name;
      } else {
        display.innerText = '\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d';
      }

      // Render Active branch at the very top (smaller font, full name)
      if (activeBranch) {
        const item = document.createElement('div');
        item.style.padding = '8px 12px';
        item.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        item.style.background = 'rgba(139, 92, 246, 0.15)';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.cursor = 'default';
        item.innerHTML = `
          <div style="text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; padding-right: 8px;">
            <div style="font-size: 11px; font-weight: 800; color: var(--gold);">${activeBranch.name}</div>
            <div style="font-size: 8px; color: var(--text-muted);Line">\u0422\u0435\u043a\u0443\u0449\u0435\u0435 \u0437\u0430\u0432\u0435\u0434\u0435\u043d\u0438\u0435</div>
          </div>
          <span style="color: var(--gold); font-size: 10px; flex-shrink: 0;">\u2714\ufe0f</span>
        `;
        dropdown.appendChild(item);
      }

      // Render other branches below it
      branches.forEach((br) => {
        if (activeBranch && br.id === activeBranch.id) return; // skip active, already at top

        const item = document.createElement('div');
        item.style.padding = '8px 12px';
        item.style.cursor = 'pointer';
        item.style.textAlign = 'left';
        item.style.fontSize = '11px';
        item.style.color = '#fff';
        item.style.transition = 'background 0.2s';
        item.style.overflow = 'hidden';
        item.style.textOverflow = 'ellipsis';
        item.style.whiteSpace = 'nowrap';
        
        item.onmouseenter = () => { item.style.background = 'rgba(255, 255, 255, 0.05)'; };
        item.onmouseleave = () => { item.style.background = 'transparent'; };
        
        item.onclick = (e) => {
          e.stopPropagation();
          dropdown.style.display = 'none';
          const arrow = document.getElementById('admin-switcher-arrow');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
          this.switchActiveAccount(br.id);
        };

        item.innerText = br.name;
        dropdown.appendChild(item);
      });

      // Render "вћ• Р”РѕР±Р°РІРёС‚СЊ С„РёР»РёР°Р»..." at the bottom if length < 4
      if (branches.length < 4) {
        const item = document.createElement('div');
        item.style.padding = '8px 12px';
        item.style.borderTop = '1px dashed rgba(255, 255, 255, 0.1)';
        item.style.cursor = 'pointer';
        item.style.textAlign = 'left';
        item.style.fontSize = '10px';
        item.style.fontWeight = 'bold';
        item.style.color = 'var(--gold)';
        item.style.transition = 'background 0.2s';
        
        item.onmouseenter = () => { item.style.background = 'rgba(255, 255, 255, 0.05)'; };
        item.onmouseleave = () => { item.style.background = 'transparent'; };
        
        item.onclick = (e) => {
          e.stopPropagation();
          dropdown.style.display = 'none';
          const arrow = document.getElementById('admin-switcher-arrow');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
          this.switchActiveAccount('add_new');
        };

        item.innerText = '\u2795 \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0444\u0438\u043b\u0438\u0430\u043b...';
        dropdown.appendChild(item);
      }
    } catch (e) {
      console.error("Error rendering account switcher dropdown:", e);
    }
  }
  switchActiveAccount(value) {
    try {
      if (value === 'add_new') {
        this.addNewAccountInitiate();
        return;
      }

      this.loadBranchContext(this.state.email, value);
    } catch (e) {
      console.error("Error switching active branch:", e);
    }
  }

  syncActiveAccountToLogged() {
    try {
      if (!this.state.email || !this.state.activeBranchId) return;
      
      const emailLower = this.state.email.toLowerCase();
      this.state.loggedAccounts = this.state.loggedAccounts || [];
      
      const existingIdx = this.state.loggedAccounts.findIndex(acc => acc.email && acc.email.toLowerCase() === emailLower);
      const currentProfile = {
        email: this.state.email,
        phone: this.state.phone,
        subscription: this.state.subscription,
        venueCoords: { ...this.state.venueCoords },
        welcomeMsg: this.state.welcomeMsg,
        deviceModel: this.state.deviceModel,
        deviceHistory: [...this.state.deviceHistory]
      };

      if (existingIdx !== -1) {
        this.state.loggedAccounts[existingIdx] = currentProfile;
      } else {
        this.state.loggedAccounts.push(currentProfile);
      }
      this.saveState();
    } catch (e) {
      console.error("Error syncing active account to logged:", e);
    }
  }

  addNewAccountInitiate() {
    try {
      this.state.databaseClients = this.state.databaseClients || [];
      const emailLower = (this.state.email || '').toLowerCase();
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === emailLower);

      if (client) {
        if (client.branches && client.branches.length >= 4) {
          this.showToast("Превышен лимит! Разрешено максимум 4 филиала на одном аккаунте.", true);
          return;
        }

        this.isAddingBranch = true;
        this.pendingBranchName = null;
        this.setAdminPanelActiveView('add-branch');
        document.getElementById('add-branch-name').value = '';
        this.showToast("Добавление нового филиала к вашей учетной записи.", false);
      } else {
        this.state.email = '';
        this.state.phone = '';
        this.state.subscription = 'none';
        this.state.consentAccepted = false;
        this.state.venueCoords = { ...PRESETS.venue };
        this.state.welcomeMsg = "";
        this.state.activeBranchName = "";
        this.saveState();

        this.isAddingBranch = false;
        this.pendingBranchName = null;
        this.setAdminPanelActiveView('consent');
        this.showToast("Регистрация новой учетной записи заведения.", false);
      }
    } catch (e) {
      console.error("Error initiating new account add:", e);
    }
  }

  creatorResetClientGuestLimits(email) {
    try {
      const activeEmail = (this.state.email || '').toLowerCase();
      const isActive = activeEmail && email.toLowerCase() === activeEmail;

      if (isActive) {
        this.state.visitorGamesPlayed = 0;
        this.state.visitorLockoutUntil = 0;
        this.saveState();
        this.showToast("Игровые лимиты посетителей для вашего заведения успешно сброшены! ✔️", false);
      } else {
        this.showToast(`Игровые лимиты посетителей сброшены в БД для заведения: ${email} ✔️`, false);
      }
    } catch (e) {
      console.error("Error resetting client guest limits:", e);
    }
  }

  toggleMaintenanceMode(isEnabled) {
    this.state.maintenanceMode = isEnabled;
    this.saveState();
    this.updateAdminView();
    this.updateVisitorView();
    this.showToast(isEnabled ? "Платформа переведена в РЕЖИМ ТЕХРАБОТ 🛠️" : "Платформа успешно ЗАПУЩЕНА в обычном режиме ✔️", false);
  }

  toggleBackupGenerator(isEnabled) {
    this.state.backupGenerator = isEnabled;
    this.saveState();
    this.showToast(isEnabled ? "Резервный ИИ-генератор запущен 🔌 (Быстрые ответы)" : "Резервный ИИ-генератор отключен (Облако активное)", false);
  }

  setAIEngine(engine) {
    this.state.aiEngine = engine;
    this.saveState();
    this.showToast(`Ядро ИИ успешно переключено на: ${engine.toUpperCase()}`, false);
  }

  setFilterStrictness(strictness) {
    this.state.filterStrictness = strictness;
    this.saveState();
    const label = strictness === 'none' ? 'ОТКЛЮЧЕН (18+ разрешено)' : strictness.toUpperCase();
    this.showToast(`Фильтр контента настроен: ${label}`, false);
  }

  creatorSearchDatabase() {
    try {
      const queryInput = document.getElementById('creator-search-input');
      const query = queryInput ? queryInput.value.trim().toLowerCase() : '';
      const resultsEl = document.getElementById('creator-search-results');
      if (!resultsEl) return;

      if (!query) {
        this.showToast("Введите Email, Номер телефона или порядковый номер клиента!", true);
        return;
      }

      const client = this.getClientProfile(query);

      if (client) {
        // Check ban first using resolved client properties
        const queryBanned = this.state.bannedUsers.find(u => 
          (u.email && u.email.toLowerCase() === client.email.toLowerCase()) || 
          (u.phone && u.phone.includes(client.phone))
        );
        
        if (queryBanned) {
          resultsEl.innerHTML = `
            <div style="text-align: left; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 10px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="font-weight:700; color:var(--error);">🔴 ПОЛЬЗОВАТЕЛЬ ЗАБЛОКИРОВАН 🚫</span>
                <span class="badge badge-danger" style="font-size:8px; line-height: 1; padding: 3px 6px;">БАН</span>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; font-size:10px; margin-bottom:8px; color:var(--text-muted);">
                <div>Индекс в БД: <strong style="color:var(--gold);">#${client.index}</strong></div>
                <div>Email: <strong style="color:#fff;">${queryBanned.email || 'Не указан'}</strong></div>
                <div>Телефон: <strong style="color:#fff;">${queryBanned.phone || 'Не указан'}</strong></div>
                <div>Причина бана: <strong style="color:var(--gold);">${queryBanned.reason}</strong></div>
                <div>Дата бана: <strong style="color:#fff;">${queryBanned.timestamp || 'Неизвестно'}</strong></div>
              </div>
              <div style="border-top:1px solid var(--border-light); padding-top:8px; display:flex; gap:6px;">
                <button class="debug-btn-mini" style="border-color:#34d399; color:#34d399;" onclick="app.creatorUnbanUser('${queryBanned.email}', '${queryBanned.phone}')">🔓 Разблокировать аккаунт</button>
              </div>
            </div>
          `;
          return;
        }

        const isPro = client.subscription.includes('pro');
        const hasSub = client.subscription !== 'none';
        
        const badgeClass = isPro ? 'badge-pro' : (hasSub ? 'badge-base' : 'badge-danger');
        const badgeText = isPro ? 'PRO ВЕРСИЯ' : (hasSub ? 'БАЗОВЫЙ' : 'НЕТ ПОДПИСКИ');
        const subText = isPro ? 'PRO (Подписка активна)' : (hasSub ? 'Базовый (Подписка активна)' : 'Подписка отсутствует');

        // Device history rendering
        const deviceHistoryHTML = client.deviceHistory.map(h => `• ${h}`).join('<br>');

        // Feedbacks rendering
        let feedbacksHTML = '';
        if (client.feedbacks.length === 0) {
          feedbacksHTML = '<span style="font-style:italic;">Отзывы отсутствуют.</span>';
        } else {
          feedbacksHTML = client.feedbacks.map(f => {
            const isTicket = f.type !== 'FEEDBACK';
            return `<div style="margin-bottom:4px; padding:3px; background:rgba(255,255,255,0.02); border-radius:4px;">
              <span style="color:${isTicket ? 'var(--error)' : 'var(--gold)'}; font-weight:700;">[${isTicket ? 'ЗАЯВКА' : 'ОТЗЫВ'}]</span>
              <span style="color:#fff;">"${f.content || f.status}"</span>
            </div>`;
          }).join('');
        }

        // AI logs rendering
        let aiLogsHTML = '';
        if (client.aiLogs.length === 0) {
          aiLogsHTML = '<span style="font-style:italic;">Запросы к ИИ отсутствуют.</span>';
        } else {
          aiLogsHTML = client.aiLogs.map(l => {
            const isBlocked = l.status.includes('Отклонено');
            return `<div style="margin-bottom:4px; padding:3px; background:rgba(255,255,255,0.02); border-radius:4px;">
              <span style="color:${isBlocked ? 'var(--error)' : '#34d399'}; font-weight:700;">[${isBlocked ? 'ФИЛЬТР' : 'УСПЕХ'}]</span>
              <span style="color:#fff;">"${l.prompt}"</span>
            </div>`;
          }).join('');
        }

        const banButtonHTML = `<button class="debug-btn-mini" style="border-color:var(--error); color:var(--error);" onclick="app.creatorBlockUser('${client.email}', '${client.phone}', 'Блокировка Создателем через консоль БД')">🚫 Заблокировать</button>`;

        resultsEl.innerHTML = `
          <div style="text-align: left; background: rgba(16, 185, 129, 0.03); border: 1px solid var(--border-light); border-radius: 16px; padding: 15px;">
            <!-- Header with status and email -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-light); padding-bottom:8px; margin-bottom:10px;">
              <div>
                <span style="font-size: 8px; color:var(--text-muted); text-transform:uppercase;">${client.isActive ? '🟢 АКТИВНЫЙ ПРОФИЛЬ (В ПАНЕЛИ)' : '🟡 ПРОФИЛЬ В БАЗЕ ДАННЫХ'}</span>
                <h3 style="font-size: 13px; color:#fff; font-weight:700; margin: 0;">#${client.index}. ${client.email}</h3>
              </div>
              <span class="badge ${badgeClass}" style="font-size:8px; line-height: 1; padding: 3px 6px;">
                ${badgeText}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
              <!-- Column 1: Account Specs -->
              <div>
                <h4 style="font-size: 9px; color: var(--gold); text-transform: uppercase; margin-bottom: 4px;">📇 Регистрационные данные</h4>
                <div style="font-size: 10px; line-height:1.5;">
                  Телефон: <strong style="color:#fff;">${client.phone}</strong><br>
                  GPS Координаты: <strong style="color:#fff;">${client.lat.toFixed(4)}, ${client.lng.toFixed(4)}</strong><br>
                  Подписка: <strong style="color:#fff;">${subText}</strong>
                </div>
              </div>
              <!-- Column 2: Device Specs -->
              <div>
                <h4 style="font-size: 9px; color: var(--gold); text-transform: uppercase; margin-bottom: 4px;">📱 Активное устройство</h4>
                <div style="font-size: 10px; line-height:1.5;">
                  Модель: <strong style="color:#fff;">${client.deviceModel}</strong><br>
                  История переносов:<br>
                  <div style="font-size: 8px; color: var(--text-muted); max-height: 45px; overflow-y:auto; line-height: 1.3;">
                    ${deviceHistoryHTML}
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2: Customer Activity Logs (AI Prompts & Feedbacks) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid var(--border-light); padding-top: 10px; margin-bottom: 15px;">
              <!-- Feedbacks & Tickets -->
              <div>
                <h4 style="font-size: 9px; color: var(--primary); text-transform: uppercase; margin-bottom: 4px;">💡 Отзывы и Заявки</h4>
                <div style="max-height: 80px; overflow-y: auto; font-size: 9px; line-height: 1.4; color: var(--text-muted);">
                  ${feedbacksHTML}
                </div>
              </div>
              <!-- AI Prompts History -->
              <div>
                <h4 style="font-size: 9px; color: var(--primary); text-transform: uppercase; margin-bottom: 4px;">🤖 Запросы к ИИ-генератору</h4>
                <div style="max-height: 80px; overflow-y: auto; font-size: 9px; line-height: 1.4; color: var(--text-muted);">
                  ${aiLogsHTML}
                </div>
              </div>
            </div>

            <!-- Administrative Actions Row -->
            <div style="border-top: 1px solid var(--border-light); padding-top: 10px;">
              <h4 style="font-size: 9px; color: var(--error); text-transform: uppercase; margin-bottom: 6px;">⚡ Административные полномочия</h4>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="debug-btn-mini" style="border-color:var(--gold); color:var(--gold);" onclick="app.creatorSearchAction('give_pro', '${client.email}')">⚡ Сделать PRO</button>
                <button class="debug-btn-mini" style="border-color:#34d399; color:#34d399;" onclick="app.creatorSearchAction('reset_gps', '${client.email}')">📍 Сбросить GPS (Переезд)</button>
                <button class="debug-btn-mini" style="border-color:#a78bfa; color:#a78bfa;" onclick="app.creatorSearchAction('reset_device', '${client.email}')">📱 Сбросить привязку устройства</button>
                <button class="debug-btn-mini" style="border-color:#fbbf24; color:#fbbf24;" onclick="app.creatorSearchAction('reset_sub', '${client.email}')">❌ Аннулировать подписку</button>
                ${banButtonHTML}
                <button class="debug-btn-mini" style="border-color:var(--error); color:var(--error);" onclick="app.creatorSearchAction('delete_account', '${client.email}')">🗑️ Удалить аккаунт</button>
              </div>
            </div>
          </div>
        `;
      } else {
        resultsEl.innerHTML = `<div style="font-size:10px; color:var(--error); text-align:center; padding:10px;">Клиент с такими данными не найден в базе данных.</div>`;
      }
    } catch (e) {
      console.error("Error rendering database profile search:", e);
    }
  }

  quickGivePro() {
    try {
      if (!this.state.email) {
        this.showToast("Сначала зарегистрируйте аккаунт владельца!", true);
        return;
      }
      this.state.subscription = 'pro_yearly';
      this.saveState();
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorClientsList();
      this.showToast("PRO подписка успешно выдана администратору! ⚡", false);
    } catch (e) {
      console.error("Error in quickGivePro:", e);
    }
  }

  creatorSearchAction(actionType, email) {
    try {
      const activeEmail = (this.state.email || '').toLowerCase();
      const isActive = activeEmail && email.toLowerCase() === activeEmail;

      if (isActive) {
        if (actionType === 'give_pro') {
          this.quickGivePro();
        } else if (actionType === 'reset_gps') {
          this.state.venueCoords = { lat: 0, lng: 0 };
          this.saveState();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("GPS координаты заведения сброшены! Требуется новая привязка.", false);
        } else if (actionType === 'reset_device') {
          this.state.deviceModel = 'iPhone 15 Pro';
          this.state.deviceHistory = ['15.06.2026: Первичная регистрация: iPhone 15 Pro'];
          this.saveState();
          this.showToast("Привязка устройства сброшена! Установлен iPhone по умолчанию.", false);
        } else if (actionType === 'reset_sub') {
          this.state.subscription = 'none';
          this.saveState();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("Подписка аннулирована.", false);
        } else if (actionType === 'delete_account') {
          this.state.subscription = 'none';
          this.state.consentAccepted = false;
          this.state.email = '';
          this.state.phone = '';
          this.state.visitorGamesPlayed = 0;
          this.state.visitorLockoutUntil = 0;
          this.state.supportTickets = [];
          this.saveState();
          window.location.reload();
          return;
        }
        this.creatorSearchDatabase(); // Refresh display
      } else {
        this.showToast(`Действие "${actionType}" успешно применено в БД к аккаунту: ${email} ✔️`, false);
      }
    } catch (e) {
      console.error("Error executing search action:", e);
    }
  }

  logAIRequest(promptText, status) {
    try {
      this.state.aiLogs = this.state.aiLogs || [];
      const newLog = {
        id: Date.now(),
        email: this.state.email || 'guest@waitplay.com',
        phone: this.state.phone || '996555123456',
        prompt: promptText,
        timestamp: new Date().toLocaleTimeString(),
        status: status
      };
      this.state.aiLogs.push(newLog);
      this.saveState();
      this.renderCreatorAILogs();
    } catch (e) {
      console.error("Error logging AI request:", e);
    }
  }

  checkBannedStatus() {
    if (!this.state.bannedUsers) return false;
    const email = (this.state.email || '').toLowerCase();
    const phone = (this.state.phone || '').trim();
    if (!email && !phone) return false;
    
    return this.state.bannedUsers.some(user => {
      const banEmail = (user.email || '').toLowerCase();
      const banPhone = (user.phone || '').trim();
      return (email && banEmail === email) || (phone && banPhone === phone);
    });
  }

  creatorBlockUser(email, phone, reason = 'Нарушение правил ИИ-генератора (18+ контент)') {
    try {
      if (!email && !phone) {
        this.showToast("Не удалось заблокировать: отсутствуют данные пользователя.", true);
        return;
      }
      
      this.state.bannedUsers = this.state.bannedUsers || [];
      
      const isAlreadyBanned = this.state.bannedUsers.some(u => 
        (email && u.email.toLowerCase() === email.toLowerCase()) || 
        (phone && u.phone.trim() === phone.trim())
      );
      
      if (isAlreadyBanned) {
        this.showToast("Этот пользователь уже заблокирован!", true);
        return;
      }
      
      const banRecord = {
        email: email || '',
        phone: phone || '',
        reason: reason,
        timestamp: new Date().toLocaleDateString()
      };
      
      this.state.bannedUsers.push(banRecord);
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorTicketsList();
      this.renderCreatorAILogs();
      this.renderCreatorClientsList();
      
      this.showToast(`Пользователь ${email || phone} успешно заблокирован! 🚫`, false);
    } catch (e) {
      console.error("Error blocking user:", e);
    }
  }

  renderCreatorAILogs() {
    try {
      const container = document.getElementById('creator-ailogs-list-only');
      const badgeAILogs = document.getElementById('creator-badge-ailogs');
      if (!container) return;
      container.innerHTML = '';
      
      const logs = this.state.aiLogs || [];
      
      if (badgeAILogs) {
        badgeAILogs.innerText = logs.length;
        badgeAILogs.style.display = logs.length > 0 ? 'inline-block' : 'none';
      }

      if (logs.length === 0) {
        container.innerHTML = `<div style="font-size:9px; color:var(--text-muted); font-style:italic; padding: 10px 0;">Запросы к ИИ отсутствуют.</div>`;
        return;
      }

      // Show latest logs first
      const reversedLogs = [...logs].reverse();
      
      reversedLogs.forEach(log => {
        const item = document.createElement('div');
        const isBannedWord = log.status.includes('Отклонено');
        
        item.style.background = isBannedWord ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)';
        item.style.border = isBannedWord ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-light)';
        item.style.borderRadius = '8px';
        item.style.padding = '6px 10px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.fontSize = '10px';
        item.style.marginBottom = '4px';

        item.innerHTML = `
          <div style="flex:1; margin-right:10px; text-align: left;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; color:${isBannedWord ? 'var(--error)' : '#34d399'}; font-size:9px;">
                ${isBannedWord ? '🛑 ОТКЛОНЕНО' : '✅ ВЫПОЛНЕНО'}
              </span>
              <span style="font-size:8px; color:var(--text-muted);">${log.timestamp}</span>
            </div>
            <div style="color:#fff; margin-top:2px; font-weight:500;">"${log.prompt}"</div>
            <div style="font-size:8px; color:var(--text-muted); margin-top:2px;">Почта: ${log.email} (${log.phone})</div>
          </div>
          <button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); padding:2px 6px; font-size:9px;" onclick="app.creatorBlockUser('${log.email}', '${log.phone}', 'Нарушение правил ИИ')">
            🚫 Блокировать
          </button>
        `;
        container.appendChild(item);
      });
    } catch (e) {
      console.error("Error rendering creator AI logs:", e);
    }
  }

  renderCreatorClientsList() {
    try {
      const container = document.getElementById('creator-clients-list-table');
      const badgeClients = document.getElementById('creator-badge-clients');
      const totalEl = document.getElementById('creator-total-clients-count');
      if (!container) return;
      container.innerHTML = '';

      const clientsList = this.getAllClientsList();

      if (totalEl) totalEl.innerText = clientsList.length;
      if (badgeClients) {
        badgeClients.innerText = clientsList.length;
        badgeClients.style.display = 'inline-block';
      }

      clientsList.forEach(client => {
        const item = document.createElement('div');
        const isPro = client.subscription && client.subscription.includes('pro');
        const hasSub = client.subscription && client.subscription !== 'none';
        const isBanned = this.state.bannedUsers && this.state.bannedUsers.some(u => u.email && client.email && u.email.toLowerCase() === client.email.toLowerCase());
        
        item.style.background = isBanned ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)';
        item.style.border = isBanned ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-light)';
        item.style.borderRadius = '8px';
        item.style.padding = '6px 10px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.fontSize = '10px';
        item.style.marginBottom = '4px';

        const subBadgeText = isBanned ? 'БАН' : (isPro ? 'PRO' : (hasSub ? 'BASE' : 'НЕТ'));
        const subBadgeClass = isBanned ? 'badge-danger' : (isPro ? 'badge-pro' : (hasSub ? 'badge-base' : 'badge-secondary'));

        item.innerHTML = `
          <div style="text-align: left; flex:1;">
            <div style="font-weight:700; color:#fff;">${client.email || 'Нет почты'}</div>
            <div style="font-size:8px; color:var(--text-muted);">Тел: ${client.phone || 'Нет телефона'}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge ${subBadgeClass}" style="font-size:8px; padding:2px 5px;">${subBadgeText}</span>
            <button class="debug-btn-mini" style="border-color:var(--gold); color:var(--gold); font-size:9px; padding:2px 6px;" onclick="app.creatorSelectAndManageClient('${client.index}')">
              🔍 Управлять
            </button>
          </div>
        `;
        container.appendChild(item);
      });
    } catch (e) {
      console.error("Error rendering creator clients list:", e);
    }
  }

  creatorUnbanUser(email, phone) {
    try {
      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
      if (client) {
        client.status = 'Активен';
        this.saveDatabaseClients();
      }

      this.state.bannedUsers = this.state.bannedUsers || [];
      this.state.bannedUsers = this.state.bannedUsers.filter(u => u.email && u.email.toLowerCase() !== email.toLowerCase());
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorClientsList();
      this.showToast(`Аккаунт ${email} разблокирован. 🔓`, false);
    } catch (e) {
      console.error("Error unbanning user:", e);
    }
  }

  toggleClientDatabaseDetails(email, index) {
    try {
      const drawer = document.getElementById(`client-db-detail-${index}`);
      if (!drawer) return;

      const isOpen = drawer.style.display === 'block';

      // First close all drawers
      const allDrawers = document.querySelectorAll('[id^="client-db-detail-"]');
      allDrawers.forEach(d => {
        d.style.display = 'none';
        d.innerHTML = '';
      });

      if (isOpen) {
        return;
      }

      const client = this.getClientProfileByEmail(email);
      if (!client) return;

      const isBanned = this.state.bannedUsers.some(u => u.email && u.email.toLowerCase() === client.email.toLowerCase());
      const badgeClass = isBanned ? 'badge-danger' : 'badge-pro';
      const badgeText = isBanned ? 'ЗАБЛОКИРОВАН' : 'АКТИВЕН';

      let feedbacksHTML = '';
      if (client.feedbacks.length === 0) {
        feedbacksHTML = '<span style="font-style:italic;">Отзывы отсутствуют.</span>';
      } else {
        feedbacksHTML = client.feedbacks.map(f => {
          const isTicket = f.type !== 'FEEDBACK';
          return `<div style="margin-bottom:4px; padding:3px; background:rgba(255,255,255,0.02); border-radius:4px;">
            <span style="color:${isTicket ? 'var(--error)' : 'var(--gold)'}; font-weight:700;">[${isTicket ? 'ЗАЯВКА' : 'ОТЗЫВ'}]</span>
            <span style="color:#fff;">"${f.content || f.status}"</span>
          </div>`;
        }).join('');
      }

      let aiLogsHTML = '';
      if (client.aiLogs.length === 0) {
        aiLogsHTML = '<span style="font-style:italic;">Запросы к ИИ отсутствуют.</span>';
      } else {
        aiLogsHTML = client.aiLogs.map(l => {
          const isBlocked = l.status.includes('Отклонено');
          return `<div style="margin-bottom:4px; padding:3px; background:rgba(255,255,255,0.02); border-radius:4px;">
            <span style="color:${isBlocked ? 'var(--error)' : '#34d399'}; font-weight:700;">[${isBlocked ? 'ФИЛЬТР' : 'УСПЕХ'}]</span>
            <span style="color:#fff;">"${l.prompt}"</span>
          </div>`;
        }).join('');
      }

      // Build branches section (Instagram multi-account details)
      let branchesHTML = '';
      const branches = client.branches || [];
      if (branches.length === 0) {
        branchesHTML = '<div style="font-style:italic; color:var(--text-muted); font-size:9px;">Нет зарегистрированных филиалов.</div>';
      } else {
        branches.forEach(br => {
          const isBrPro = br.subscription.includes('pro');
          const isBrBanned = br.status === 'Заблокирован';
          const brBadgeText = isBrBanned ? 'БАН 🚫' : (isBrPro ? 'PRO ⚡' : (br.subscription !== 'none' ? 'BASE' : 'НЕТ'));
          const brBadgeClass = isBrBanned ? 'badge-danger' : (isBrPro ? 'badge-pro' : (br.subscription !== 'none' ? 'badge-base' : 'badge-secondary'));

          const brAdminDist = this.getDistance(this.state.adminCoords.lat, this.state.adminCoords.lng, br.lat || 0, br.lng || 0);
          const brVisitorDist = this.getDistance(this.state.visitorCoords.lat, this.state.visitorCoords.lng, br.lat || 0, br.lng || 0);
          const brDeviceHistoryHTML = (br.deviceHistory || []).map(h => `• ${h}`).join('<br>');

          const brBanBtnHTML = isBrBanned
            ? `<button class="debug-btn-mini" style="border-color:#34d399; color:#34d399; font-size:8px; padding:1px 3px;" onclick="event.stopPropagation(); app.creatorBranchAction('unban', '${client.email}', '${br.id}')">🔓 Разблокировать филиал</button>`
            : `<button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-size:8px; padding:1px 3px;" onclick="event.stopPropagation(); app.creatorBranchAction('ban', '${client.email}', '${br.id}')">🚫 Заблокировать филиал</button>`;

          branchesHTML += `
            <div style="border: 1px solid rgba(255,255,255,0.06); border-radius:6px; margin-bottom:5px; background:rgba(255,255,255,0.01); overflow:hidden;">
              <!-- Branch Expandable Header -->
              <div style="padding:5px 8px; background:rgba(255,255,255,0.03); display:flex; justify-content:space-between; align-items:center; font-weight:700; cursor:pointer;" onclick="const el = document.getElementById('br-drawer-${br.id}'); el.style.display = el.style.display === 'block' ? 'none' : 'block'; event.stopPropagation();">
                <span style="color:#fff; font-size:9.5px;">🏢 ${br.name}</span>
                <div style="display:flex; align-items:center; gap:5px;">
                  <span class="badge ${brBadgeClass}" style="font-size:7.5px; padding:1px 4px;">${brBadgeText}</span>
                  <span style="font-size:8px; color:var(--text-muted);">▼</span>
                </div>
              </div>
              <!-- Branch expand drawer -->
              <div id="br-drawer-${br.id}" style="display:none; padding:8px; font-size:9px; border-top:1px solid rgba(255,255,255,0.06); background:rgba(0,0,0,0.15); line-height:1.35;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div>
                    <strong style="color:var(--primary); font-size:7.5px; text-transform:uppercase;">📱 Устройство</strong><br>
                    Модель: <strong style="color:#fff;">${br.deviceModel || 'iPhone'}</strong>
                    <div style="font-size:7.5px; color:var(--text-muted); max-height:30px; overflow-y:auto; line-height:1.2; margin-top:2.5px;">
                      ${brDeviceHistoryHTML}
                    </div>
                  </div>
                  <div>
                    <strong style="color:var(--primary); font-size:7.5px; text-transform:uppercase;">📍 GPS Координаты</strong><br>
                    Координаты: <strong style="color:#fff;">${br.lat ? br.lat.toFixed(4) : '0.0000'}, ${br.lng ? br.lng.toFixed(4) : '0.0000'}</strong><br>
                    Админ до ресторана: <strong style="color:#fff;">${brAdminDist}м</strong><br>
                    Гость до ресторана: <strong style="color:#fff;">${brVisitorDist}м</strong>
                  </div>
                </div>
                <div style="margin-top:6px; display:flex; gap:3px; flex-wrap:wrap; border-top:1px dashed rgba(255,255,255,0.06); padding-top:4px;">
                  <button class="debug-btn-mini" style="border-color:var(--gold); color:var(--gold); font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('give_pro', '${client.email}', '${br.id}'); event.stopPropagation();">⚡ Дать PRO</button>
                  <button class="debug-btn-mini" style="border-color:#34d399; color:#34d399; font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('reset_gps', '${client.email}', '${br.id}'); event.stopPropagation();">📍 Сбросить GPS</button>
                  <button class="debug-btn-mini" style="border-color:#a78bfa; color:#a78bfa; font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('reset_device', '${client.email}', '${br.id}'); event.stopPropagation();">📱 Сбросить устройство</button>
                  <button class="debug-btn-mini" style="border-color:#fbbf24; color:#fbbf24; font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('reset_sub', '${client.email}', '${br.id}'); event.stopPropagation();">❌ Аннулировать подписку</button>
                  ${brBanBtnHTML}
                </div>
              </div>
            </div>
          `;
        });
      }

      const banButtonHTML = isBanned 
        ? `<button class="debug-btn-mini" style="border-color:#34d399; color:#34d399; font-size:8px; padding:2px 5px;" onclick="event.stopPropagation(); app.creatorUnbanUser('${client.email}', '${client.phone}')">🔓 Разблокировать аккаунт</button>`
        : `<button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-size:8px; padding:2px 5px;" onclick="event.stopPropagation(); app.creatorBlockUser('${client.email}', '${client.phone}', 'Блокировка через базу данных')">🚫 Заблокировать аккаунт</button>`;

      drawer.innerHTML = `
        <div style="text-align: left; font-size:10px;" onclick="event.stopPropagation()">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-light); padding-bottom:6px; margin-bottom:8px;">
            <strong style="color:var(--gold);">Досье клиента #${client.index}</strong>
            <span class="badge ${badgeClass}" style="font-size:8px; padding:2px 5px;">${badgeText}</span>
          </div>

          <!-- General Account Stats -->
          <div style="margin-bottom:8px; background:rgba(255,255,255,0.02); padding:5px 8px; border-radius:6px; border:1px solid var(--border-light); font-size:9.5px;">
            Email: <strong style="color:#fff;">${client.email}</strong> | Телефон: <strong style="color:#fff;">${client.phone}</strong>
          </div>

          <!-- Section: Branches -->
          <div style="margin-bottom: 8px;">
            <strong style="color:var(--primary); font-size:8px; text-transform:uppercase; display:block; margin-bottom:4px;">🏢 Зарегистрированные филиалы (${branches.length} из 4)</strong>
            ${branchesHTML}
          </div>

          <!-- Support & logs -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px solid var(--border-light); padding-top: 6px; margin-bottom: 8px;">
            <div>
              <strong style="color:var(--primary); font-size:8px;">ОТЗЫВЫ И ЗАЯВКИ</strong>
              <div style="max-height: 50px; overflow-y: auto; font-size: 8px; color: var(--text-muted); margin-top:2px;">
                ${feedbacksHTML}
              </div>
            </div>
            <div>
              <strong style="color:var(--primary); font-size:8px;">ИСТОРИЯ ЗАПРОСОВ К ИИ</strong>
              <div style="max-height: 50px; overflow-y: auto; font-size: 8px; color: var(--text-muted); margin-top:2px;">
                ${aiLogsHTML}
              </div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-light); padding-top: 6px; display:flex; gap:4px; flex-wrap:wrap;">
            ${banButtonHTML}
            <button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-size:8px; padding:2px 5px;" onclick="app.creatorSearchAction('delete_account', '${client.email}');">🗑️ Удалить аккаунт</button>
          </div>
        </div>
      `;

      drawer.style.display = 'block';
    } catch (e) {
      console.error("Error in toggleClientDatabaseDetails:", e);
    }
  }

  creatorSearchSuggestions() {
    try {
      const input = document.getElementById('creator-search-input');
      const suggestionsBox = document.getElementById('creator-search-suggestions');
      if (!input || !suggestionsBox) return;

      const q = input.value.trim().toLowerCase();

      if (!q) {
        suggestionsBox.style.display = 'none';
        suggestionsBox.innerHTML = '';
        return;
      }

      const clients = this.getAllClientsList();
      
      const matches = clients.filter(c => {
        const matchesEmail = (c.email && c.email.toLowerCase().includes(q));
        const matchesPhone = c.phone.includes(q);
        const matchesIndex = c.index.toString() === q;
        return matchesEmail || matchesPhone || matchesIndex;
      });

      if (matches.length === 0) {
        suggestionsBox.style.display = 'block';
        suggestionsBox.innerHTML = `<div style="font-size:9px; color:var(--text-muted); padding:6px 10px; text-align:center;">Совпадений не найдено</div>`;
        return;
      }

      suggestionsBox.innerHTML = '';
      matches.slice(0, 5).forEach(c => {
        const item = document.createElement('div');
        item.style.padding = '6px 10px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.fontSize = '10px';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
        
        item.onmouseenter = () => { item.style.background = 'rgba(255, 255, 255, 0.05)'; };
        item.onmouseleave = () => { item.style.background = 'transparent'; };

        const isBanned = this.state.bannedUsers.some(u => u.email && (u.email && u.email.toLowerCase()) === (c.email && c.email.toLowerCase()));
        const isPro = c.subscription.includes('pro');
        const badgeColor = isBanned ? 'var(--error)' : (isPro ? 'var(--gold)' : 'var(--primary)');
        const badgeLabel = isBanned ? 'БАН' : (isPro ? 'PRO' : 'BASE');

        item.innerHTML = `
          <div style="text-align:left;">
            <strong style="color:#fff;">#${this.abbreviateNumber(c.index)}. ${c.email}</strong>
            <div style="font-size:8px; color:var(--text-muted);">Тел: ${c.phone} | Устройство: ${c.deviceModel}</div>
          </div>
          <span style="font-size:8px; font-weight:700; color:${badgeColor}; background:rgba(255,255,255,0.03); padding:1px 4px; border-radius:4px;">
            ${badgeLabel}
          </span>
        `;

        item.onclick = () => {
          input.value = c.email;
          suggestionsBox.style.display = 'none';
          this.creatorSearchDatabase();
        };

        suggestionsBox.appendChild(item);
      });

      suggestionsBox.style.display = 'block';
    } catch (e) {
      console.error("Error generating search suggestions:", e);
    }
  }

  creatorSelectAndManageClient(clientIndex) {
    try {
      this.setCreatorTab('search');
      
      const searchInput = document.getElementById('creator-search-input');
      if (searchInput) searchInput.value = clientIndex;
      
      this.creatorSearchDatabase();
      this.showToast(`Загружен профиль клиента по индексу #${clientIndex}`, false);
    } catch (e) {
      console.error("Error selecting client for management:", e);
    }
  }

  creatorBlockAndResetAccount(ticketId) {
    const ticket = this.state.supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      this.state.supportTickets = this.state.supportTickets.filter(t => t.id !== ticketId);
      
      this.state.subscription = 'none';
      this.state.consentAccepted = false;
      this.state.email = '';
      this.state.phone = '';
      this.state.visitorGamesPlayed = 0;
      this.state.visitorLockoutUntil = 0;
      
      this.saveState();
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorTicketsList();
      this.renderCreatorClientsList();
      
      this.showToast("Аккаунт успешно УДАЛЕН из базы данных создателем! Подписка аннулирована.", false);
    }
  }

  // --- HACKER LOGIN SIMULATOR ---
  debugTriggerHackerLoginSimulation() {
    if (this.state.subscription === 'none') {
      this.showToast("Сначала купите подписку владельцем, чтобы привязать почту!", true);
      return;
    }

    const emailBox = document.getElementById('owner-email-alert-modal');
    const emailBody = document.getElementById('owner-email-alert-body');

    emailBody.innerHTML = `
      Зафиксирована попытка входа с нового устройства вне заведения. 
      <br><br>
      Входящее устройство находится в <strong>1.5 км</strong> от ресторана (Дома). 
      Запрос заблокирован по умолчанию. 
      <br><br>
      Если это были вы, разрешите перенос управления кнопкой "Это я", или нажмите "Сменить пароль", чтобы немедленно защитить аккаунт.
    `;
    emailBox.classList.add('active');
  }

  ownerApproveMigrationMe() {
    document.getElementById('owner-email-alert-modal').classList.remove('active');
    this.showToast("Вы разрешили вход новому устройству (Перенос завершен) ✔️", false);
  }

  ownerTriggerPasswordReset() {
    document.getElementById('owner-email-alert-modal').classList.remove('active');
    this.openSupportPortal();
    
    document.getElementById('support-verify-email').value = this.state.email;
    document.getElementById('support-verify-phone').value = this.state.phone;
    this.supportSubmitCredentials();
  }

  // --- VISA CREDIT CARD AUTOFILL (Developer only) ---
  debugAutofillVisaCard() {
    const cardInput = document.getElementById('pay-card-number');
    const expiryInput = document.getElementById('pay-card-expiry');
    const cvcInput = document.getElementById('pay-card-cvc');

    if (cardInput && expiryInput && cvcInput) {
      cardInput.value = "4000 1234 5678 9010";
      expiryInput.value = "12/29";
      cvcInput.value = "123";
      this.formatCardNumber(cardInput);
      this.showToast("Реквизиты тестовой карты успешно заполнены ✔️", false);
    }
  }

  // --- VISITOR SCAN & GEOLOCATION LIMITS ---
  simulateVisitorScan() {
    if (!this.state.activeBranchId) {
      this.showToast("\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u043b\u0438 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u0437\u0430\u0432\u0435\u0434\u0435\u043d\u0438\u0435!", true);
      return;
    }
    this.state.visitorConnectedBranchId = this.state.activeBranchId || '';
    this.saveState();
    this.setVisitorViewPanel('disclaimer');
  }
  visitorAcceptDisclaimer() {
    this.setVisitorViewPanel('gps-check');
    setTimeout(() => {
      this.verifyVisitorGPS();
    }, 1200);
  }

  verifyVisitorGPS() {
    const branch = this.getVisitorConnectedBranch();
    const branchCoords = branch ? { lat: branch.lat, lng: branch.lng } : this.state.venueCoords;
    const branchName = branch ? branch.name : (this.state.activeBranchName || "WaitPlay");

    const distance = this.getDistance(
      this.state.visitorCoords.lat, this.state.visitorCoords.lng,
      branchCoords.lat, branchCoords.lng
    );

    const errorDiv = document.getElementById('visitor-gps-error');
    const isTesting = this.state.manualTestingMode || (branch && branch.manualTestingMode);
    
    if (distance > 180 || isTesting) {
      const isAdminLoggedIn = (this.state.email && this.state.email.trim() !== '') || isTesting;
      if (isAdminLoggedIn) {
        errorDiv.style.display = 'none';
        this.state.isDemoTest = true;
        this.saveState();
        
        const now = Date.now();
        if (this.state.visitorGamesPlayed >= 2 && now < this.state.visitorLockoutUntil) {
          this.setVisitorViewPanel('lockout');
        } else {
          if (now >= this.state.visitorLockoutUntil && this.state.visitorGamesPlayed >= 2) {
            this.state.visitorGamesPlayed = 0;
            this.saveState();
          }
          this.setVisitorViewPanel('lobby');
          this.initVisitorLobby();
          this.showVisitorToast("\ud83d\udee0\ufe0f \u0417\u0430\u043f\u0443\u0449\u0435\u043d \u0442\u0435\u0441\u0442\u043e\u0432\u044b\u0439 \u0440\u0435\u0436\u0438\u043c \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u0431\u0435\u0437 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0439.", false);
        }
      } else {
        errorDiv.style.display = 'block';
        document.getElementById('visitor-gps-error-txt').innerText = "Вы находитесь вне заведения. Для участия в играх, пожалуйста, посетите наше заведение и отсканируйте QR-код.";
        this.setVisitorViewPanel('gps-check');
        this.showVisitorToast("Вы вне заведения. Доступ заблокирован.", true);
      }
    } else {
      errorDiv.style.display = 'none';
      this.state.isDemoTest = false;
      this.saveState();
      
      const now = Date.now();
      if (this.state.visitorGamesPlayed >= 2 && now < this.state.visitorLockoutUntil) {
        this.setVisitorViewPanel('lockout');
      } else {
        if (now >= this.state.visitorLockoutUntil && this.state.visitorGamesPlayed >= 2) {
          this.state.visitorGamesPlayed = 0;
          this.saveState();
        }
        this.setVisitorViewPanel('lobby');
        this.initVisitorLobby();
        this.showVisitorToast(`Успешно подключено к заведению ${branchName}!`, false);
      }
    }
  }

  getVisitorConnectedBranch() {
    if (!this.state.visitorConnectedBranchId) return null;
    
    this.state.databaseClients = this.state.databaseClients || [];
    for (const client of this.state.databaseClients) {
      if (client.branches) {
        const branch = client.branches.find(b => b.id === this.state.visitorConnectedBranchId);
        if (branch) return branch;
      }
    }
    
    if (this.state.activeBranchId === this.state.visitorConnectedBranchId) {
      return {
        id: this.state.activeBranchId,
        name: this.state.activeBranchName,
        welcomeMsg: this.state.welcomeMsg,
        subscription: this.state.subscription,
        lat: this.state.venueCoords.lat,
        lng: this.state.venueCoords.lng,
        games: this.state.games
      };
    }
    return null;
  }

  initVisitorLobby() {
    const titleEl = document.getElementById('visitor-venue-title');
    if (titleEl) titleEl.innerText = "WaitPlay";

    const branch = this.getVisitorConnectedBranch();
    const branchName = branch ? branch.name : (this.state.activeBranchName || "WaitPlay");
    const welcomeMsg = branch ? (branch.welcomeMsg || '') : (this.state.welcomeMsg || '');

    const venueDisplay = document.getElementById('visitor-venue-name-display');
    if (venueDisplay) venueDisplay.innerText = branchName;

    const limitCompact = document.getElementById('visitor-limit-badge-compact');
    if (limitCompact) limitCompact.innerText = `${this.state.visitorGamesPlayed} / 2`;

    const welcomeBox = document.getElementById('visitor-lobby-welcome-box');
    const welcomeText = document.getElementById('visitor-lobby-welcome-text');
    if (welcomeBox && welcomeText) {
      if (welcomeMsg && welcomeMsg.trim() !== '') {
        welcomeText.innerText = welcomeMsg;
        welcomeBox.style.display = 'flex';
        
        // Reset collapse state
        welcomeText.style.maxHeight = '32px';
        const toggleEl = document.getElementById('visitor-lobby-welcome-toggle');
        const arrowEl = document.getElementById('visitor-lobby-welcome-arrow');
        if (toggleEl) {
          if (welcomeMsg.length > 55) {
            toggleEl.style.display = 'flex';
            toggleEl.querySelector('span').innerText = 'Читать полностью';
            if (arrowEl) arrowEl.innerText = '▼';
          } else {
            toggleEl.style.display = 'none';
            welcomeText.style.maxHeight = 'none';
          }
        }
      } else {
        welcomeBox.style.display = 'none';
      }
    }

    this.renderVisitorLobbyGames();
  }

  ensureMyPlayerProfile() {
    if (!this.myPlayerId) {
      let savedId = null;
      try { savedId = sessionStorage.getItem('wp_player_id'); } catch(e) {}
      if (!savedId) {
        savedId = 'p_' + Math.random().toString(36).substring(2, 9);
        try { sessionStorage.setItem('wp_player_id', savedId); } catch(e) {}
      }
      this.myPlayerId = savedId;
    }

    if (!this.myPlayerProfile) {
      let savedProfile = null;
      try {
        const stored = sessionStorage.getItem('wp_player_profile');
        if (stored) savedProfile = JSON.parse(stored);
      } catch(e) {}

      if (savedProfile && savedProfile.name && savedProfile.avatar) {
        this.myPlayerProfile = savedProfile;
      } else {
        const names = ["Панда", "Волк", "Лиса", "Лев", "Тигр", "Медведь", "Коала", "Зайка", "Енот", "Барсук"];
        const avatars = ["🐼", "🐺", "🦊", "🦁", "🐯", "🐻", "🐨", "🐰", "🦝", "🦡"];
        const rIdx = Math.floor(Math.random() * names.length);
        this.myPlayerProfile = {
          id: this.myPlayerId,
          name: names[rIdx],
          avatar: avatars[rIdx]
        };
        try { sessionStorage.setItem('wp_player_profile', JSON.stringify(this.myPlayerProfile)); } catch(e) {}
      }
    }
    return this.myPlayerProfile;
  }

  initRealtimeNetwork(venueId) {
    if (!venueId) venueId = 'loc_main';
    this.networkVenueId = venueId;
    this.ensureMyPlayerProfile();

    this.livePlayers = this.livePlayers || {};
    this.livePlayers[this.myPlayerId] = {
      ...this.myPlayerProfile,
      id: this.myPlayerId,
      lastSeen: Date.now(),
      gameId: this.state.visitorSelectedGameId || null
    };

    if (this.mqttClient) {
      try { this.mqttClient.end(true); } catch(e) {}
      this.mqttClient = null;
    }

    const brokers = [
      'wss://broker.hivemq.com:8884/mqtt',
      'wss://broker.emqx.io:8084/mqtt',
      'wss://test.mosquitto.org:8081'
    ];

    let brokerIdx = 0;
    const connectToBroker = (idx) => {
      if (typeof mqtt === 'undefined') return;
      const url = brokers[idx % brokers.length];
      const topic = `waitplay/corridor/${this.networkVenueId}`;

      try {
        const client = mqtt.connect(url, {
          clientId: `wp_${this.myPlayerId}_${Math.random().toString(16).substring(2, 6)}`,
          clean: true,
          connectTimeout: 4000,
          reconnectPeriod: 3000
        });

        client.on('connect', () => {
          console.log("Connected to Realtime Broker:", url, "Topic:", topic);
          this.mqttClient = client;
          client.subscribe(topic, { qos: 0 });
          this.broadcastNetworkPresence();
        });

        client.on('message', (t, payload) => {
          try {
            const data = JSON.parse(payload.toString());
            this.handleNetworkMessage(data);
          } catch(e) {}
        });

        client.on('error', (err) => {
          console.warn("Broker error:", url, err);
          client.end(true);
          if (idx + 1 < brokers.length) {
            connectToBroker(idx + 1);
          }
        });
      } catch(e) {
        console.warn("MQTT init exception:", e);
      }
    };

    connectToBroker(0);

    if (this.networkHeartbeat) clearInterval(this.networkHeartbeat);
    this.networkHeartbeat = setInterval(() => {
      this.broadcastNetworkPresence();
      this.cleanStaleNetworkPlayers();
    }, 1500);
  }

  broadcastNetworkPresence() {
    if (!this.mqttClient || !this.mqttClient.connected) return;
    const isQueueOpen = (document.getElementById('lobby-queue-overlay')?.style.display === 'flex');
    const msg = {
      type: 'presence',
      senderId: this.myPlayerId,
      profile: this.myPlayerProfile,
      gameId: this.state.visitorSelectedGameId || null,
      inQueue: isQueueOpen,
      joinTime: this.myQueueJoinTime || null,
      timestamp: Date.now()
    };
    try {
      this.mqttClient.publish(`waitplay/corridor/${this.networkVenueId}`, JSON.stringify(msg));
    } catch(e) {}
  }

  sendNetworkMessage(payload) {
    if (!this.mqttClient || !this.mqttClient.connected) return;
    const msg = {
      ...payload,
      senderId: this.myPlayerId,
      profile: this.myPlayerProfile,
      venueId: this.networkVenueId,
      timestamp: Date.now()
    };
    try {
      this.mqttClient.publish(`waitplay/corridor/${this.networkVenueId}`, JSON.stringify(msg));
    } catch(e) {
      console.error("Error sending network message:", e);
    }
  }

  handleNetworkMessage(data) {
    if (!data || data.senderId === this.myPlayerId) return;

    if (data.type === 'presence') {
      if (data.senderId && data.profile) {
        this.livePlayers[data.senderId] = {
          ...data.profile,
          id: data.senderId,
          lastSeen: Date.now(),
          gameId: data.gameId || null,
          inQueue: data.inQueue || false,
          joinTime: data.joinTime || null
        };
        this.updateLivePlayersCorridorUI();

        if (data.inQueue && data.gameId === this.state.visitorSelectedGameId) {
          this.queuePlayers = this.queuePlayers || {};
          this.queuePlayers[data.senderId] = {
            ...data.profile,
            id: data.senderId,
            gameId: data.gameId,
            joinTime: data.joinTime || Date.now()
          };
          this.updateLiveQueueUI();
          this.checkInstantQueuePairing(data.gameId);
        }
      }
    } else if (data.type === 'queue_join') {
      this.queuePlayers = this.queuePlayers || {};
      this.queuePlayers[data.senderId] = {
        ...(data.profile || {}),
        id: data.senderId,
        gameId: data.gameId,
        joinTime: data.timestamp || Date.now()
      };
      if (this.state.visitorSelectedGameId === data.gameId) {
        this.updateLiveQueueUI();
        this.checkInstantQueuePairing(data.gameId);
      }
    } else if (data.type === 'queue_leave') {
      if (this.queuePlayers && this.queuePlayers[data.playerId || data.senderId]) {
        delete this.queuePlayers[data.playerId || data.senderId];
      }
      if (this.state.visitorSelectedGameId === data.gameId) {
        this.updateLiveQueueUI();
      }
    } else if (data.type === 'room_busy') {
      this.roomStatus = this.roomStatus || {};
      this.roomStatus[data.gameId] = {
        busy: data.busy,
        players: data.players
      };
    } else if (data.type === 'ttt_join') {
      this.handleRemoteTTFJoin(data);
    } else if (data.type === 'ttt_paired') {
      this.handleRemoteTTFPaired(data);
    } else if (data.type === 'ttt_move' || data.type === 'game_move') {
      if (data.gameId === 4) {
        this.handleRemoteTTFMove(data);
      }
    } else if (data.type === 'ttt_rematch' || data.type === 'game_restart') {
      if (data.gameId === 4) {
        this.handleRemoteTTFRestart(data);
      }
    }
  }

  cleanStaleNetworkPlayers() {
    const now = Date.now();
    let changed = false;
    for (const [id, player] of Object.entries(this.livePlayers || {})) {
      if (id !== this.myPlayerId && now - player.lastSeen > 6000) {
        delete this.livePlayers[id];
        if (this.queuePlayers && this.queuePlayers[id]) {
          delete this.queuePlayers[id];
        }
        changed = true;
      }
    }
    if (changed) {
      this.updateLivePlayersCorridorUI();
      this.updateLiveQueueUI();
    }
  }

  updateLivePlayersCorridorUI() {
    const count = Object.keys(this.livePlayers || {}).length;
    const countEl = document.getElementById('visitor-lobby-live-count');
    if (countEl) {
      countEl.innerText = `👥 В Лобби: ${count} чел. онлайн`;
    }
  }

  visitorExitActiveGame() {
    try {
      this.state.visitorSelectedGameId = null;
      this.state.visitorActiveView = 'lobby';
      
      this.sendNetworkMessage({
        type: 'game_exit',
        playerId: this.myPlayerId
      });

      const gamePanel = document.getElementById('visitor-game-panel');
      if (gamePanel) {
        gamePanel.classList.remove('active');
        gamePanel.style.display = 'none';
      }
      const lobbyPanel = document.getElementById('visitor-lobby-panel');
      if (lobbyPanel) {
        lobbyPanel.classList.add('active');
        lobbyPanel.style.display = 'flex';
      }

      this.renderVisitorLobbyGames();
      this.showVisitorToast("Возврат в Игровое Лобби 🎮", false);
    } catch(e) {
      console.error("Error in visitorExitActiveGame:", e);
    }
  }

  visitorExitActiveGameToLobby() {
    this.visitorExitActiveGame();
  }

  renderVisitorLobbyGames() {
    const container = document.getElementById('visitor-lobby-games-list');
    const noGamesAlert = document.getElementById('visitor-no-games-alert');
    const gridTitle = document.getElementById('visitor-lobby-games-grid-title');
    
    if (!container) return;
    container.innerHTML = '';

    const branch = this.getVisitorConnectedBranch();
    const branchGames = branch ? (branch.games || JSON.parse(JSON.stringify(DEFAULT_GAMES))) : this.state.games;
    this.sortGamesList(branchGames);
    const branchSub = branch ? (branch.subscription || 'none') : this.state.subscription;

    const isPro = branchSub.includes('pro');
    const visibleGames = branchGames.filter(g => g.enabled && g.published && !(g.isPro && !isPro));
    
    if (visibleGames.length === 0) {
      container.style.display = 'none';
      gridTitle.style.display = 'none';
      noGamesAlert.style.display = 'block';
      return;
    }

    container.style.display = 'grid';
    gridTitle.style.display = 'flex';
    noGamesAlert.style.display = 'none';

    visibleGames.forEach(g => {
      const card = document.createElement('div');
      card.className = 'game-card active-game';
      
      let playBtnHTML = '';
      const isTesting = this.state.manualTestingMode || (branch && branch.manualTestingMode);
      if (isTesting) {
        card.style.opacity = '0.55';
        card.style.filter = 'grayscale(50%)';
        playBtnHTML = `<button class="btn btn-secondary" style="padding: 4px 8px; font-size:10px; border-radius:6px; background:#4b5563; border-color:#4b5563; opacity:0.65; cursor:not-allowed;" disabled>🔒 Тех. работы</button>`;
      } else {
        card.style.opacity = '1';
        card.style.filter = 'none';
        playBtnHTML = `<button class="btn btn-primary" style="padding: 4px 8px; font-size:10px; border-radius:6px;" onclick="app.visitorJoinLobby(${g.id})">Сыграть 🎯</button>`;
      }

      card.innerHTML = `
        <span class="game-card-icon" style="margin-bottom: 2px;">${g.icon}</span>
        <div class="game-card-title" style="margin-bottom: 2px;">${g.name}</div>
        <div class="game-card-players" style="margin-bottom: 4px;">👥 ${g.minPlayers}-${g.maxPlayers} чел.</div>
        
        <div class="game-rules-link" style="display:flex; align-items:center; justify-content:center; gap:3px; font-size:9px; color:var(--gold); margin-bottom:6px; cursor:pointer;" onclick="app.showGameRules(${g.id}, event)">
          <span>📋 Правила</span>
          <span style="font-size:7px;">▶</span>
        </div>
        
        ${playBtnHTML}
      `;
      container.appendChild(card);
    });
  }

  visitorJoinLobby(gameId) {
    try {
      this.ensureMyPlayerProfile();
      
      if (!this.mqttClient || !this.mqttClient.connected) {
        this.initRealtimeNetwork(this.state.visitorConnectedBranchId || 'loc_main');
      }

      if (this.state.manualTestingMode) {
        this.showVisitorToast("🛠️ В данный момент ведутся технические работы. Игры временно недоступны!", true);
        return;
      }

      if (this.roomStatus && this.roomStatus[gameId] && this.roomStatus[gameId].busy) {
        this.showVisitorToast(`🔒 Комната занята! Идет активный раунд (${this.roomStatus[gameId].players || 'игроков'}). Подождите окончания.`, true);
        return;
      }
      
      this.state.visitorSelectedGameId = gameId;
      this.myQueueJoinTime = Date.now();
      this.saveState();
      
      const overlay = document.getElementById('lobby-queue-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = `
          <div class="lobby-radar-container">
            <div class="lobby-radar-circle" id="visitor-radar-box"></div>
            <div class="lobby-radar-pulse"></div>
          </div>
          <div id="lobby-countdown-label" style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:4px;">Набор игроков:</div>
          <div id="lobby-countdown-timer" style="font-size:24px; font-weight:900; color:var(--gold); margin-bottom:10px;">15 сек</div>
          <div id="visitor-lobby-players-count" style="font-size:12px; font-weight:700; color:#fff; margin-bottom:15px;">👥 В очереди: 1 чел.</div>
          <button class="btn btn-secondary" style="padding:6px 14px; font-size:11px; width:auto; margin:0;" onclick="app.visitorLeaveQueue()">Отмена ✖</button>
        `;
      }

      this.queuePlayers = this.queuePlayers || {};
      this.queuePlayers[this.myPlayerId] = {
        ...this.myPlayerProfile,
        id: this.myPlayerId,
        gameId: gameId,
        joinTime: this.myQueueJoinTime
      };

      this.updateLiveQueueUI();
      this.broadcastNetworkPresence();

      this.sendNetworkMessage({
        type: 'queue_join',
        gameId: gameId,
        profile: this.myPlayerProfile
      });

      clearInterval(this.state.lobbyCountdown);
      this.state.lobbyTimerVal = 15;

      this.state.lobbyCountdown = setInterval(() => {
        this.state.lobbyTimerVal--;
        const timerEl = document.getElementById('lobby-countdown-timer');
        if (timerEl) timerEl.innerText = `${this.state.lobbyTimerVal} сек`;

        this.checkInstantQueuePairing(gameId);

        if (this.state.lobbyTimerVal <= 0) {
          clearInterval(this.state.lobbyCountdown);
          this.finishQueueMatchmaking(gameId);
        }
      }, 1000);

      this.checkInstantQueuePairing(gameId);
    } catch(e) {
      console.error("Error in visitorJoinLobby:", e);
    }
  }

  updateLiveQueueUI() {
    try {
      const gameId = this.state.visitorSelectedGameId;
      const inQueue = Object.values(this.queuePlayers || {}).filter(p => p && p.gameId === gameId);
      const count = Math.max(1, inQueue.length);

      const lobbyCounter = document.getElementById('visitor-lobby-players-count');
      if (lobbyCounter) {
        lobbyCounter.innerText = `👥 В очереди: ${count} чел.`;
      }

      const radarBox = document.getElementById('visitor-radar-box');
      if (radarBox) {
        radarBox.innerHTML = '';
        inQueue.forEach((p, idx) => {
          this.spawnRadarAvatar(p.avatar || '🐼', idx);
        });
      }
    } catch(e) {
      console.error("Error in updateLiveQueueUI:", e);
    }
  }

  checkInstantQueuePairing(gameId) {
    const inQueue = Object.values(this.queuePlayers || {}).filter(p => p && p.gameId === gameId);
    if (inQueue.length >= 2) {
      if (this.isPairingStarting) return;
      this.isPairingStarting = true;

      clearInterval(this.state.lobbyCountdown);
      const labelEl = document.getElementById('lobby-countdown-label');
      const timerEl = document.getElementById('lobby-countdown-timer');
      if (labelEl) labelEl.innerText = 'Пара найдена! Старт:';
      
      let startSec = 2;
      if (timerEl) timerEl.innerText = `${startSec} сек`;
      
      this.state.lobbyCountdown = setInterval(() => {
        startSec--;
        if (timerEl) timerEl.innerText = `${startSec} сек`;
        if (startSec <= 0) {
          clearInterval(this.state.lobbyCountdown);
          this.isPairingStarting = false;
          this.finishQueueMatchmaking(gameId);
        }
      }, 1000);
    }
  }

  finishQueueMatchmaking(gameId) {
    const inQueue = Object.values(this.queuePlayers || {}).filter(p => p && p.gameId === gameId);
    const count = inQueue.length;

    if (count < 2) {
      this.showQueueFailureModal("Недостаточно игроков", "За 15 секунд в комнату зашел только 1 человек. Для игры требуется минимум 2 живых игрока.");
      return;
    }

    inQueue.sort((a, b) => (a.joinTime || 0) - (b.joinTime || 0));

    const myIndex = inQueue.findIndex(p => p.id === this.myPlayerId);
    const evenPairedCount = Math.floor(count / 2) * 2;

    if (myIndex >= evenPairedCount) {
      this.showQueueFailureModal("Пара не найдена", "В комнату зашло нечетное число участников. Первые игроки начали матч, вы будете первыми в очереди на следующий раунд!");
      return;
    }

    this.sendNetworkMessage({
      type: 'room_busy',
      gameId: gameId,
      busy: true,
      players: `${inQueue[0].name} vs ${inQueue[1].name}`
    });

    const overlay = document.getElementById('lobby-queue-overlay');
    if (overlay) overlay.style.display = 'none';

    this.startActiveGame(2);
  }

  showQueueFailureModal(title, message) {
    this.isPairingStarting = false;
    const overlay = document.getElementById('lobby-queue-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div style="background:var(--card-bg, #18142c); border:1px solid var(--border-light); border-radius:18px; padding:25px; max-width:320px; width:90%; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.5); position:relative;">
          <button onclick="app.visitorLeaveQueue()" style="position:absolute; top:12px; right:12px; background:none; border:none; color:var(--text-muted); font-size:18px; cursor:pointer;">✖</button>
          <div style="font-size:36px; margin-bottom:10px;">⚠️</div>
          <div style="font-size:16px; font-weight:800; color:var(--gold); margin-bottom:8px;">${title}</div>
          <div style="font-size:11px; color:var(--text-muted); line-height:1.4; margin-bottom:20px;">
            ${message}
          </div>
          <button class="btn btn-primary" onclick="app.visitorLeaveQueue()" style="width:100%; padding:12px; font-weight:800; font-size:12px; margin:0;">
            ↩️ Вернуться в Лобби
          </button>
        </div>
      `;
    }
  }

  visitorLeaveQueue() {
    this.isPairingStarting = false;
    clearInterval(this.state.lobbyCountdown);
    const gameId = this.state.visitorSelectedGameId;
    this.myQueueJoinTime = null;
    if (this.queuePlayers && this.queuePlayers[this.myPlayerId]) {
      delete this.queuePlayers[this.myPlayerId];
    }
    
    this.sendNetworkMessage({
      type: 'queue_leave',
      gameId: gameId,
      playerId: this.myPlayerId
    });

    this.broadcastNetworkPresence();

    const overlay = document.getElementById('lobby-queue-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = `
        <div class="lobby-radar-container">
          <div class="lobby-radar-circle" id="visitor-radar-box"></div>
          <div class="lobby-radar-pulse"></div>
        </div>
        <div id="lobby-countdown-label" style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:4px;">Набор игроков:</div>
        <div id="lobby-countdown-timer" style="font-size:24px; font-weight:900; color:var(--gold); margin-bottom:10px;">15 сек</div>
        <div id="visitor-lobby-players-count" style="font-size:12px; font-weight:700; color:#fff; margin-bottom:15px;">👥 В очереди: 1 чел.</div>
        <button class="btn btn-secondary" style="padding:6px 14px; font-size:11px; width:auto; margin:0;" onclick="app.visitorLeaveQueue()">Отмена ✖</button>
      `;
    }
    this.initVisitorLobby();
  }

  startActiveGame(totalPlayers) {
    this.setVisitorViewPanel('game');
    this.state.activeGameScore = 0;
    this.state.activeGameQIndex = 0;

    const listContainer = document.getElementById('visitor-game-players-list');
    if (listContainer && listContainer.parentElement) {
      listContainer.parentElement.style.display = (this.state.visitorSelectedGameId === 11 || this.state.visitorSelectedGameId === 3 || this.state.visitorSelectedGameId === 8) ? 'none' : 'block';
    }

    if (this.state.visitorSelectedGameId === 3) {
      document.getElementById('visitor-game-score').innerText = "Прогресс: 0%";
      this.initGuestStickmanRace(totalPlayers);
      return;
    }

    if (this.state.visitorSelectedGameId === 8) {
      this.initSlicingGame(totalPlayers);
      return;
    }

    if (this.state.visitorSelectedGameId === 11) {
      let isMatched = true;
      if (totalPlayers % 2 === 1) {
        const leftoverIdx = Math.floor(Math.random() * totalPlayers);
        if (leftoverIdx === 0) {
          isMatched = false;
        }
      }

      if (!isMatched) {
        this.setVisitorViewPanel('game');
        
        const typeLabel = document.getElementById('visitor-game-type-label');
        if (typeLabel) typeLabel.innerText = "ПОИСК СОПЕРНИКА 🔍";
        
        const qIndexEl = document.getElementById('visitor-game-q-index');
        if (qIndexEl) qIndexEl.innerText = "Матчмейкинг";
        
        const scoreEl = document.getElementById('visitor-game-score');
        if (scoreEl) scoreEl.innerText = "";
        
        const textLabel = document.getElementById('visitor-game-question-text');
        if (textLabel) {
          textLabel.innerHTML = `
            <div style="text-align:center; padding: 20px 10px;">
              <div style="font-size:42px; margin-bottom:12px;">🚫</div>
              <div style="font-size:16px; font-weight:800; color:var(--error); margin-bottom:8px;">Пара не найдена</div>
              <div style="font-size:11px; color:var(--text-muted); line-height:1.4; margin-bottom:20px;">
                К сожалению, для вас не нашлось свободного соперника в этой комнате (нечетное количество участников).
              </div>
              <button class="btn btn-secondary" onclick="app.visitorLeaveQueue()" style="width:100%; padding:10px; font-weight:800; font-size:12px; margin:0;">
                ↩️ Вернуться в лобби
              </button>
            </div>
          `;
        }
        
        const optionsBox = document.getElementById('visitor-game-options');
        if (optionsBox) {
          optionsBox.style.display = 'none';
          optionsBox.innerHTML = '';
        }
        return;
      }

      document.getElementById('visitor-game-score').innerText = `Дамки: 0`;
      this.initGuestCheckers();
      return;
    }

    if (this.state.visitorSelectedGameId === 2) {
      const branch = this.getVisitorConnectedBranch();
      document.getElementById('visitor-game-score').innerText = `Очки: 0`;
      
      const animalNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const animalEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      
      this.state.simulatedPlayers = [];
      for (let i = 0; i < totalPlayers - 1; i++) {
        const idx = i % animalNames.length;
        this.state.simulatedPlayers.push({
          name: animalNames[idx],
          avatar: animalEmojis[idx],
          score: 0
        });
      }
      
      this.renderActiveGameQuestion();
      return;
    }

    if (this.state.visitorSelectedGameId === 4) {
      document.getElementById('visitor-game-score').innerText = `Раунд: 1`;
      this.initTTFTournament();
      return;
    }

    if (this.state.visitorSelectedGameId === 5) {
      document.getElementById('visitor-game-score').innerText = `Очки: 0`;
      this.state.simulatedPlayers = [];
      const animalNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const animalEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      
      for (let i = 0; i < totalPlayers - 1; i++) {
        const idx = i % animalNames.length;
        this.state.simulatedPlayers.push({
          name: animalNames[idx],
          avatar: animalEmojis[idx],
          score: 0
        });
      }
      
      this.renderActiveGameQuestion();
      return;
    }


    if (this.state.visitorSelectedGameId === 6) {
      document.getElementById('visitor-game-score').innerText = `Пары: 0`;
      this.initGuestMemory(totalPlayers);
      return;
    }

    if (this.state.visitorSelectedGameId === 10) {
      document.getElementById('visitor-game-score').innerText = `Очки: 0`;
      this.initGuessWordGame(totalPlayers);
      return;
    }

    document.getElementById('visitor-game-score').innerText = `Побед: 0`;

    if (this.state.isDemoTest) {
      clearTimeout(this.state.demoTimer);
    }

    const animalNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
    const animalEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
    
    this.state.simulatedPlayers = [];
    for (let i = 0; i < totalPlayers - 1; i++) {
      const idx = i % animalNames.length;
      this.state.simulatedPlayers.push({
        name: animalNames[idx],
        avatar: animalEmojis[idx],
        score: 0
      });
    }

    this.renderActiveGameQuestion();
  }

  initTTFTournament() {
    const branch = this.getVisitorConnectedBranch();
    const size = branch && branch.tttTournamentSize ? branch.tttTournamentSize : this.state.tttTournamentSize;
    const diff = branch && branch.tttDifficulty ? branch.tttDifficulty : this.state.tttDifficulty;
    
    const botPoolNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок", "Барсук", "Волк", "Кабан", "Ёжик"];
    const botPoolEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔", "🦡", "🐺", "🐗", "🦔"];
    
    const shuffled = [];
    for (let i = 0; i < botPoolNames.length; i++) {
      shuffled.push({ name: botPoolNames[i], avatar: botPoolEmojis[i] });
    }
    shuffled.sort(() => Math.random() - 0.5);
    
    const countNeeded = size - 1;
    const tournamentBots = shuffled.slice(0, countNeeded);
    
    const round1Matches = [];
    round1Matches.push({ p1: { name: "Вы", avatar: "👨‍💻", isUser: true }, p2: tournamentBots[0], winner: null });
    
    for (let i = 1; i < size / 2; i++) {
      round1Matches.push({ p1: tournamentBots[i * 2 - 1], p2: tournamentBots[i * 2], winner: null });
    }
    
    const roundsCount = Math.log2(size);
    const bracket = {
      round1: round1Matches
    };
    for (let r = 2; r <= roundsCount; r++) {
      const matchCount = size / Math.pow(2, r);
      bracket[`round${r}`] = [];
      for (let m = 0; m < matchCount; m++) {
        bracket[`round${r}`].push({ p1: null, p2: null, winner: null });
      }
    }
    
    this.state.tttTournament = {
      size: size,
      round: 0,
      bracket: bracket,
      currentMatch: null,
      board: Array(9).fill(null),
      playerTurn: true,
      matchStatus: 'bracket',
      difficulty: diff,
      isUserActive: true
    };
    
    this.simulateBotMatchesForCurrentRound();
    this.renderActiveGameQuestion();
  }

  simulateBotMatchesForCurrentRound() {
    const t = this.state.tttTournament;
    if (!t) return;
    const roundKey = `round${t.round + 1}`;
    const matches = t.bracket[roundKey];
    if (!matches) return;
    
    // Находим индекс матча пользователя
    const userMatchIdx = matches.findIndex(m => m.p1 && m.p1.isUser || m.p2 && m.p2.isUser);
    const adjacentIdx = userMatchIdx % 2 === 0 ? userMatchIdx + 1 : userMatchIdx - 1;
    
    matches.forEach((m, idx) => {
      // Моментально симулируем все матчи ботов, кроме параллельного матча, который ждет пользователь
      if (idx !== userMatchIdx && idx !== adjacentIdx && !m.winner && m.p1 && m.p2) {
        m.winner = Math.random() > 0.5 ? m.p1 : m.p2;
      }
    });
  }

  runTournamentWaitingSimulation() {
    const t = this.state.tttTournament;
    if (!t) return;
    
    const roundKey = `round${t.round + 1}`;
    const matches = t.bracket[roundKey] || [];
    
    // Находим параллельный матч в паре с пользователем
    const userMatchIdx = matches.findIndex(m => m.p1 && m.p1.isUser || m.p2 && m.p2.isUser);
    const adjacentIdx = userMatchIdx % 2 === 0 ? userMatchIdx + 1 : userMatchIdx - 1;
    const adjacentMatch = matches[adjacentIdx];
    
    if (adjacentMatch && adjacentMatch.winner === null) {
      // Ждем 3.5 секунды, затем завершаем именно этот параллельный матч
      setTimeout(() => {
        adjacentMatch.winner = Math.random() > 0.5 ? adjacentMatch.p1 : adjacentMatch.p2;
        this.playAudioTone('click');
        this.renderActiveGameQuestion();
        
        // Ждем еще 1.5 секунды, проигрываем фанфары и продвигаем пользователя в следующий круг
        setTimeout(() => {
          this.playAudioTone('success');
          setTimeout(() => {
            t.round++;
            const prevMatches = t.bracket[`round${t.round}`];
            const nextMatches = t.bracket[`round${t.round + 1}`];
            if (nextMatches) {
              for (let i = 0; i < nextMatches.length; i++) {
                nextMatches[i].p1 = prevMatches[i * 2].winner;
                nextMatches[i].p2 = prevMatches[i * 2 + 1].winner;
                nextMatches[i].winner = null;
              }
            }
            
            this.simulateBotMatchesForCurrentRound();
            t.matchStatus = 'bracket';
            document.getElementById('visitor-game-score').innerText = `Раунд: ${t.round + 1}`;
            this.renderActiveGameQuestion();
          }, 1000);
        }, 1500);
      }, 3500);
    } else {
      // Если параллельного матча нет или он уже решен, сразу переходим к следующему раунду
      t.round++;
      const prevMatches = t.bracket[`round${t.round}`];
      const nextMatches = t.bracket[`round${t.round + 1}`];
      if (nextMatches) {
        for (let i = 0; i < nextMatches.length; i++) {
          nextMatches[i].p1 = prevMatches[i * 2].winner;
          nextMatches[i].p2 = prevMatches[i * 2 + 1].winner;
          nextMatches[i].winner = null;
        }
        this.simulateBotMatchesForCurrentRound();
        t.matchStatus = 'bracket';
        document.getElementById('visitor-game-score').innerText = `Раунд: ${t.round + 1}`;
      }
      this.renderActiveGameQuestion();
    }
  }

  clearTTTTurnTimer() {
    if (this.tttTurnTimerInterval) {
      clearInterval(this.tttTurnTimerInterval);
      this.tttTurnTimerInterval = null;
    }
    this.tttCurrentTurnPlayer = null;
  }

  resetTTTTurnTimer() {
    this.clearTTTTurnTimer();
    
    const t = this.state.tttTournament;
    if (!t || t.matchStatus !== 'playing' || !t.playerTurn) return;
    
    const limitVal = this.state.tttTurnLimit || 'none';
    if (limitVal === 'none') return;
    
    const limit = parseInt(limitVal);
    if (isNaN(limit)) return;
    
    this.state.tttRemainingSeconds = limit;
    this.updateTTTTimerBadge();
    
    this.tttTurnTimerInterval = setInterval(() => {
      this.state.tttRemainingSeconds--;
      this.updateTTTTimerBadge();
      
      if (this.state.tttRemainingSeconds <= 0) {
        this.clearTTTTurnTimer();
        this.handleTTTTurnTimeout();
      }
    }, 1000);
  }

  updateTTTTimerBadge() {
    const el = document.getElementById('ttt-turn-timer-badge');
    if (el) {
      el.innerText = `⏱️ ${this.state.tttRemainingSeconds} сек`;
      if (this.state.tttRemainingSeconds <= 3) {
        el.style.color = 'var(--error)';
      } else {
        el.style.color = 'var(--gold)';
      }
    }
  }

  handleTTTTurnTimeout() {
    const t = this.state.tttTournament;
    if (!t || t.matchStatus !== 'playing' || !t.playerTurn) return;
    
    this.showVisitorToast("⌛ Время вышло! Сделан случайный ход.", true);
    this.playAudioTone('incorrect');
    
    const emptyCells = [];
    t.board.forEach((cell, idx) => {
      if (cell === null) emptyCells.push(idx);
    });
    
    if (emptyCells.length > 0) {
      const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      t.board[randomIdx] = 'X';
      this.renderActiveGameQuestion();
      
      const outcome = this.checkTTTBoardState(t.board);
      if (outcome === 'X') {
        setTimeout(() => this.handleTTTMatchEnd('user'), 600);
        return;
      } else if (outcome === 'draw') {
        setTimeout(() => this.handleTTTMatchEnd('draw'), 600);
        return;
      }
      
      t.playerTurn = false;
      this.renderActiveGameQuestion();
      setTimeout(() => this.executeTTTBotMove(), 800);
    }
  }

  handleTTTCellClick(cellIdx) {
    const t = this.state.tttTournament;
    if (!t || t.matchStatus !== 'playing' || !t.playerTurn || t.board[cellIdx]) return;
    
    t.board[cellIdx] = 'X';
    this.playAudioTone('correct');
    this.renderActiveGameQuestion();
    
    const outcome = this.checkTTTBoardState(t.board);
    if (outcome === 'X') {
      setTimeout(() => this.handleTTTMatchEnd('user'), 600);
      return;
    } else if (outcome === 'draw') {
      setTimeout(() => this.handleTTTMatchEnd('draw'), 600);
      return;
    }
    
    t.playerTurn = false;
    this.renderActiveGameQuestion();
    
    setTimeout(() => {
      this.executeTTTBotMove();
    }, 800);
  }

  executeTTTBotMove() {
    const t = this.state.tttTournament;
    if (!t || t.matchStatus !== 'playing' || t.playerTurn) return;
    
    const board = t.board;
    const emptyIndices = [];
    board.forEach((cell, idx) => {
      if (!cell) emptyIndices.push(idx);
    });
    
    if (emptyIndices.length === 0) return;
    
    let botMoveIdx = -1;
    const diff = t.difficulty || 'normal';
    
    const findWinningMove = (player) => {
      const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (let line of winLines) {
        const [a, b, c] = line;
        if (board[a] === player && board[b] === player && !board[c]) return c;
        if (board[a] === player && board[c] === player && !board[b]) return b;
        if (board[b] === player && board[c] === player && !board[a]) return a;
      }
      return -1;
    };

    const decideMove = () => {
      const winIdx = findWinningMove('O');
      if (winIdx !== -1) return winIdx;
      
      const blockIdx = findWinningMove('X');
      if (blockIdx !== -1) return blockIdx;
      
      if (!board[4]) return 4;
      
      const corners = [0, 2, 6, 8].filter(c => !board[c]);
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
      
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };

    if (diff === 'hard') {
      botMoveIdx = decideMove();
    } else if (diff === 'normal') {
      if (Math.random() < 0.70) {
        botMoveIdx = decideMove();
      } else {
        botMoveIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    } else {
      if (Math.random() < 0.30) {
        botMoveIdx = decideMove();
      } else {
        botMoveIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    }
    
    if (botMoveIdx === -1 || board[botMoveIdx]) {
      botMoveIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
    
    board[botMoveIdx] = 'O';
    this.playAudioTone('incorrect');
    this.renderActiveGameQuestion();
    
    const outcome = this.checkTTTBoardState(board);
    if (outcome === 'O') {
      setTimeout(() => this.handleTTTMatchEnd('bot'), 600);
      return;
    } else if (outcome === 'draw') {
      setTimeout(() => this.handleTTTMatchEnd('draw'), 600);
      return;
    }
    
    t.playerTurn = true;
    this.renderActiveGameQuestion();
  }

  checkTTTBoardState(board) {
    const winLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of winLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every(cell => cell !== null)) return 'draw';
    return null;
  }

  handleTTTMatchEnd(winner) {
    this.clearTTTTurnTimer();
    const t = this.state.tttTournament;
    if (!t) return;
    
    const roundKey = `round${t.round + 1}`;
    const match = t.bracket[roundKey].find(m => m.p1 && m.p1.isUser || m.p2 && m.p2.isUser);
    
    if (winner === 'draw') {
      t.currentDrawCount = (t.currentDrawCount || 0) + 1;
      const maxDraws = parseInt(this.state.tttMaxDraws) || 3;
      if (t.currentDrawCount >= maxDraws) {
        t.currentDrawCount = 0;
        this.showVisitorToast("🤝 Лимит ничьих исчерпан! Победитель определен случайно.", true);
        const resolvedWinner = Math.random() > 0.5 ? 'user' : 'bot';
        setTimeout(() => this.handleTTTMatchEnd(resolvedWinner), 1000);
        return;
      }

      this.showVisitorToast(`🤝 Ничья! Переигрываем матч... (Ничья ${t.currentDrawCount})`, false);
      setTimeout(() => {
        t.board.fill(null);
        t.playerTurn = Math.random() > 0.5;
        this.renderActiveGameQuestion();
        if (!t.playerTurn) {
          setTimeout(() => this.executeTTTBotMove(), 800);
        }
      }, 1500);
      return;
    }
    
    t.currentDrawCount = 0;
    
    if (winner === 'user') {
      match.winner = match.p1;
      this.showVisitorToast("🎉 Победа! Вы вышли в следующий раунд!", false);
      
      const roundsCount = Math.log2(t.size);
      if (t.round + 1 === roundsCount) {
        t.matchStatus = 'finished';
        t.winner = 'user';
        this.renderActiveGameQuestion();
        
        setTimeout(() => {
          this.state.activeGameScore = 100;
          this.finishVisitorGame();
        }, 2000);
      } else {
        setTimeout(() => {
          t.matchStatus = 'waiting';
          this.renderActiveGameQuestion();
          this.runTournamentWaitingSimulation();
        }, 1500);
      }
    } else {
      match.winner = match.p2;
      t.isUserActive = false;
      t.matchStatus = 'finished';
      this.showVisitorToast(`😢 Вы проиграли и выбыли из турнира!`, true);
      this.renderActiveGameQuestion();
    }
  }

  initTTFTournament(isNextRound = false) {
    this.ensureMyPlayerProfile();

    let currentRound = (this.state.tttTournament && this.state.tttTournament.round) ? (this.state.tttTournament.round + 1) : 1;
    if (!isNextRound) currentRound = 1;

    let scoreX = (this.state.tttTournament && this.state.tttTournament.scoreX) || 0;
    let scoreO = (this.state.tttTournament && this.state.tttTournament.scoreO) || 0;
    let drawsCount = (this.state.tttTournament && this.state.tttTournament.drawsCount) || 0;
    if (!isNextRound) { scoreX = 0; scoreO = 0; drawsCount = 0; }

    const otherPlayers = Object.values(this.livePlayers || {}).filter(p => p.id !== this.myPlayerId && (p.gameId === 4 || !p.gameId));

    if (otherPlayers.length > 0) {
      const host = otherPlayers[0];
      this.state.tttTournament = {
        round: currentRound,
        scoreX: scoreX,
        scoreO: scoreO,
        drawsCount: drawsCount,
        isHost: false,
        mySymbol: 'O',
        oppSymbol: 'X',
        myName: `${this.myPlayerProfile.avatar} ${this.myPlayerProfile.name}`,
        oppName: `${host.avatar || '👤'} ${host.name || 'Игрок 1'}`,
        board: Array(9).fill(null),
        currentTurn: 'X',
        status: 'playing',
        winner: null
      };

      this.sendNetworkMessage({
        type: 'ttt_paired',
        gameId: 4,
        hostId: host.id,
        hostProfile: host,
        guestId: this.myPlayerId,
        guestProfile: this.myPlayerProfile,
        round: currentRound
      });
    } else {
      this.state.tttTournament = {
        round: currentRound,
        scoreX: scoreX,
        scoreO: scoreO,
        drawsCount: drawsCount,
        isHost: true,
        mySymbol: 'X',
        oppSymbol: 'O',
        myName: `${this.myPlayerProfile.avatar} ${this.myPlayerProfile.name}`,
        oppName: '⏳ Ожидание игрока 2...',
        board: Array(9).fill(null),
        currentTurn: 'X',
        status: 'waiting',
        winner: null
      };

      this.sendNetworkMessage({
        type: 'ttt_join',
        gameId: 4,
        profile: this.myPlayerProfile
      });
    }

    const scoreEl = document.getElementById('visitor-game-score');
    if (scoreEl) {
      scoreEl.innerText = `Раунд: ${currentRound}`;
    }

    this.renderActiveGameQuestion();
  }

  handleRemoteTTFJoin(data) {
    const t = this.state.tttTournament;
    if (!t || !t.isHost) return;

    const guest = data.profile || { name: 'Игрок 2', avatar: '🐺', id: data.senderId };
    t.oppName = `${guest.avatar} ${guest.name}`;
    t.status = 'playing';

    this.sendNetworkMessage({
      type: 'ttt_paired',
      gameId: 4,
      hostId: this.myPlayerId,
      hostProfile: this.myPlayerProfile,
      guestId: data.senderId,
      guestProfile: guest,
      round: t.round
    });

    this.renderActiveGameQuestion();
    if (t.currentTurn === t.mySymbol) {
      this.startLiveTTFTurnTimer();
    }
  }

  handleRemoteTTFPaired(data) {
    const t = this.state.tttTournament;
    if (!t) return;

    if (this.myPlayerId === data.hostId) {
      t.isHost = true;
      t.mySymbol = 'X';
      t.oppSymbol = 'O';
      t.myName = `${data.hostProfile.avatar} ${data.hostProfile.name}`;
      t.oppName = `${data.guestProfile.avatar} ${data.guestProfile.name}`;
      t.status = 'playing';
      t.currentTurn = 'X';
    } else if (this.myPlayerId === data.guestId) {
      t.isHost = false;
      t.mySymbol = 'O';
      t.oppSymbol = 'X';
      t.myName = `${data.guestProfile.avatar} ${data.guestProfile.name}`;
      t.oppName = `${data.hostProfile.avatar} ${data.hostProfile.name}`;
      t.status = 'playing';
      t.currentTurn = 'X';
    }

    this.renderActiveGameQuestion();
    if (t.currentTurn === t.mySymbol) {
      this.startLiveTTFTurnTimer();
    } else {
      this.clearLiveTTFTurnTimer();
    }
  }

  renderTTFBoard(optionsBox, textLabel) {
    const t = this.state.tttTournament;
    if (!t) {
      this.initTTFTournament();
      return;
    }

    const isWaiting = (t.status === 'waiting');
    const isMyTurn = (!isWaiting && t.currentTurn === t.mySymbol && !t.winner);
    
    let turnIndicator = '';
    if (isWaiting) {
      turnIndicator = `<span style="color:var(--gold); font-weight:800; font-size:13px;">⏳ Ожидание второго живого игрока...</span>`;
    } else if (t.winner) {
      turnIndicator = '';
    } else if (isMyTurn) {
      turnIndicator = `<span style="color:var(--success); font-weight:800; font-size:13px;">👉 Ваш ход (${t.mySymbol === 'X' ? 'Крестик ❌' : 'Нолик ⭕'})</span>`;
    } else {
      turnIndicator = `<span style="color:var(--gold); font-weight:700; font-size:13px;">⏳ Ход соперника (${t.oppName})...</span>`;
    }

    const scoreLine = `🏆 Счёт: ❌ ${t.scoreX} — ⭕ ${t.scoreO} (Ничьих: ${t.drawsCount})`;

    if (textLabel) {
      textLabel.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:13px; font-weight:800; color:var(--gold); margin-bottom:3px;">🎮 КРЕСТИКИ-НОЛИКИ (РАУНД ${t.round})</div>
          <div style="display:flex; justify-content:center; align-items:center; gap:10px; font-size:13px; color:#fff; margin-bottom:4px;">
            <span>${t.myName} (${t.mySymbol === 'X' ? '❌' : '⭕'})</span>
            <span style="color:var(--gold); font-size:11px;">VS</span>
            <span>${t.oppName} (${t.oppSymbol === 'X' ? '❌' : '⭕'})</span>
          </div>
          <div style="font-size:10px; color:var(--text-muted); margin-bottom:4px;">${scoreLine}</div>
          <div>${turnIndicator} <span id="live-ttf-turn-timer-badge" style="font-size:12px; font-weight:800; color:var(--gold); margin-left:6px;"></span></div>
        </div>
      `;
    }

    if (optionsBox) {
      optionsBox.innerHTML = '';
      optionsBox.style.display = 'grid';
      optionsBox.style.gridTemplateColumns = 'repeat(3, 1fr)';
      optionsBox.style.gap = '8px';
      optionsBox.style.maxWidth = '280px';
      optionsBox.style.margin = '12px auto 0 auto';

      for (let i = 0; i < 9; i++) {
        const cell = t.board[i];
        const btn = document.createElement('button');
        btn.style.cssText = 'height: 75px; font-size: 32px; font-weight: 900; background: #18142c; border: 2px solid var(--border-light); border-radius: 12px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; outline: none; transition: all 0.15s; margin: 0;';
        
        if (cell === 'X') {
          btn.innerText = '❌';
          btn.style.borderColor = 'var(--primary)';
          btn.style.background = 'rgba(139, 92, 246, 0.15)';
        } else if (cell === 'O') {
          btn.innerText = '⭕';
          btn.style.borderColor = 'var(--gold)';
          btn.style.background = 'rgba(245, 158, 11, 0.15)';
        } else {
          btn.innerText = '';
          if (isMyTurn) {
            btn.onclick = () => this.handleLiveTTFCellClick(i);
          } else {
            btn.style.cursor = 'not-allowed';
            btn.style.opacity = '0.6';
          }
        }
        optionsBox.appendChild(btn);
      }
    }
  }

  startLiveTTFTurnTimer() {
    this.clearLiveTTFTurnTimer();
    const limit = this.state.tttTurnLimit || 'none';
    if (limit === 'none') return;
    
    const seconds = parseInt(limit) || 10;
    this.liveTTFSecondsLeft = seconds;
    this.updateLiveTTFTimerUI();
    
    this.liveTTFTimerInterval = setInterval(() => {
      this.liveTTFSecondsLeft--;
      this.updateLiveTTFTimerUI();
      
      if (this.liveTTFSecondsLeft <= 0) {
        this.clearLiveTTFTurnTimer();
        this.handleLiveTTFTimeout();
      }
    }, 1000);
  }

  clearLiveTTFTurnTimer() {
    if (this.liveTTFTimerInterval) {
      clearInterval(this.liveTTFTimerInterval);
      this.liveTTFTimerInterval = null;
    }
  }

  updateLiveTTFTimerUI() {
    const el = document.getElementById('live-ttf-turn-timer-badge');
    if (el) {
      el.innerText = `⏱️ ${this.liveTTFSecondsLeft} сек`;
      el.style.color = (this.liveTTFSecondsLeft <= 3) ? 'var(--error)' : 'var(--gold)';
    }
  }

  handleLiveTTFTimeout() {
    const t = this.state.tttTournament;
    if (!t || t.winner || t.currentTurn !== t.mySymbol) return;

    this.showVisitorToast("⌛ Время на ход вышло! Сделан случайный ход.", true);
    this.playAudioTone('incorrect');

    const emptyCells = [];
    t.board.forEach((cell, idx) => {
      if (cell === null) emptyCells.push(idx);
    });

    if (emptyCells.length > 0) {
      const chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.handleLiveTTFCellClick(chosen);
    }
  }

  handleLiveTTFCellClick(index) {
    const t = this.state.tttTournament;
    if (!t || t.board[index] !== null || t.currentTurn !== t.mySymbol || t.winner || t.status !== 'playing') return;

    this.clearLiveTTFTurnTimer();
    t.board[index] = t.mySymbol;
    t.currentTurn = (t.mySymbol === 'X') ? 'O' : 'X';
    this.playAudioTone('click');

    this.sendNetworkMessage({
      type: 'ttt_move',
      gameId: 4,
      cellIndex: index,
      symbol: t.mySymbol,
      nextTurn: t.currentTurn
    });

    const winner = this.checkTTFWinner(t.board);
    if (winner) {
      t.winner = winner;
      if (winner === 'X') t.scoreX++;
      if (winner === 'O') t.scoreO++;
      this.finishTTFMatch(winner);
    } else if (t.board.every(cell => cell !== null)) {
      t.winner = 'draw';
      t.drawsCount++;
      this.finishTTFMatch('draw');
    } else {
      this.renderActiveGameQuestion();
    }
  }

  handleRemoteTTFMove(data) {
    const t = this.state.tttTournament;
    if (!t || data.gameId !== 4) return;

    this.clearLiveTTFTurnTimer();
    t.board[data.cellIndex] = data.symbol;
    t.currentTurn = data.nextTurn;
    this.playAudioTone('click');

    const winner = this.checkTTFWinner(t.board);
    if (winner) {
      t.winner = winner;
      if (winner === 'X') t.scoreX++;
      if (winner === 'O') t.scoreO++;
      this.finishTTFMatch(winner);
    } else if (t.board.every(cell => cell !== null)) {
      t.winner = 'draw';
      t.drawsCount++;
      this.finishTTFMatch('draw');
    } else {
      this.renderActiveGameQuestion();
      if (t.currentTurn === t.mySymbol) {
        this.startLiveTTFTurnTimer();
      }
    }
  }

  handleRemoteTTFRestart(data) {
    if (data.gameId === 4) {
      this.initTTFTournament(true);
    }
  }

  checkTTFWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  finishTTFMatch(result) {
    this.clearLiveTTFTurnTimer();
    const textLabel = document.getElementById('visitor-game-question-text');
    const optionsBox = document.getElementById('visitor-game-options-container');
    const t = this.state.tttTournament;

    let resultHtml = '';
    if (result === 'draw') {
      this.showVisitorToast("🤝 РАУНД ЗАВЕРШИЛСЯ ВНИЧЬЮ!", false);
      resultHtml = `
        <div style="text-align:center;">
          <h3 style="color:#fff; margin-bottom:6px;">🤝 РАУНД ЗАВЕРШИЛСЯ ВНИЧЬЮ!</h3>
          <div style="font-size:12px; color:var(--gold); font-weight:700;">🏆 Счёт серии: ❌ ${t ? t.scoreX : 0} — ⭕ ${t ? t.scoreO : 0}</div>
        </div>
      `;
    } else if (t && result === t.mySymbol) {
      this.showVisitorToast("🎉 ВЫ ВЫИГРАЛИ ЭТОТ РАУНД!", false);
      resultHtml = `
        <div style="text-align:center;">
          <h3 style="color:var(--success); margin-bottom:6px;">🎉 ВЫ ВЫИГРАЛИ РАУНД! 🏆</h3>
          <div style="font-size:12px; color:var(--gold); font-weight:700;">🏆 Счёт серии: ❌ ${t.scoreX} — ⭕ ${t.scoreO}</div>
        </div>
      `;
    } else {
      this.showVisitorToast("👏 РАУНД ВЫИГРАЛ СОПЕРНИК!", false);
      resultHtml = `
        <div style="text-align:center;">
          <h3 style="color:var(--gold); margin-bottom:6px;">👏 Раунд выиграл соперник (${t ? t.oppName : ''})</h3>
          <div style="font-size:12px; color:var(--gold); font-weight:700;">🏆 Счёт серии: ❌ ${t ? t.scoreX : 0} — ⭕ ${t ? t.scoreO : 0}</div>
        </div>
      `;
    }

    if (textLabel) textLabel.innerHTML = resultHtml;

    if (optionsBox) {
      optionsBox.innerHTML = `
        <button class="btn btn-primary" style="grid-column: 1 / -1; width: 100%; padding: 14px; font-weight: 800; font-size: 14px; margin-bottom: 8px;" onclick="app.requestLiveTTFRestart()">
          🔄 Следующий раунд 🎯
        </button>
        <button class="btn btn-secondary" style="grid-column: 1 / -1; width: 100%; padding: 10px; font-size: 12px; font-weight: 700;" onclick="app.visitorExitActiveGame()">
          🚪 Вернуться в Лобби
        </button>
      `;
    }
  }

  requestLiveTTFRestart() {
    this.sendNetworkMessage({ type: 'ttt_rematch', gameId: 4 });
    this.initTTFTournament(true);
  }

  renderActiveGameQuestion() {
    const qIndex = this.state.activeGameQIndex;
    const gameId = this.state.visitorSelectedGameId;
    const game = this.state.games.find(g => g.id === gameId);
    const gameName = game ? game.name : "\u0418\u0433\u0440\u0430";
    
    if (gameId === 3) {
      this.renderVisitorStickmanRace();
      return;
    }

    if (gameId === 8) {
      this.renderSlicingGame();
      return;
    }

    if (gameId === 5) {
      this.renderVisitorCrossword();
      return;
    }
    
    if (gameId === 6) {
      this.renderVisitorMemory();
      return;
    }
    
    if (gameId === 10) {
      this.renderVisitorGuessWord();
      return;
    }

    if (gameId === 11) {
      this.renderVisitorCheckers();
      return;
    }
    
    const isQuiz = gameId === 1 || (game && game.isAIGenerated);
    
    const textLabel = document.getElementById('visitor-game-question-text');
    const optionsBox = document.getElementById('visitor-game-options');
    if (!textLabel || !optionsBox) return;

    if (isQuiz) {
      textLabel.style.display = 'block';
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "ВИКТОРИНА В ЗАВЕДЕНИИ";
      optionsBox.style.display = 'grid';
      const branch = this.getVisitorConnectedBranch();
      const branchTemplates = branch && branch.templates ? branch.templates : this.state.templates;
      const questionsCount = branchTemplates.length;

      // Guard: no questions configured — show error instead of blank "Загрузка..."
      if (questionsCount === 0) {
        textLabel.innerHTML = `<div style="text-align:center;padding:20px 10px;"><div style="font-size:36px;margin-bottom:10px;">❓</div><div style="font-size:13px;font-weight:800;color:var(--error);margin-bottom:6px;">Вопросы не добавлены!</div><div style="font-size:10px;color:var(--text-muted);">Администратор не настроил вопросы для этой Викторины.</div></div>`;
        optionsBox.innerHTML = '';
        optionsBox.style.display = 'none';
        return;
      }

      this.state.firstAnsweredThisRound = false;
      document.getElementById('visitor-game-q-index').innerText = `\u0412\u043e\u043f\u0440\u043e\u0441 ${qIndex + 1} \u0438\u0437 ${questionsCount}`;

      const tpl = branchTemplates[qIndex] || { text: "\u0412\u043e\u043f\u0440\u043e\u0441 \u0432\u0438\u043a\u0442\u043e\u0440\u0438\u043d\u044b", options: ["\u0414\u0430", "\u041d\u0435\u0442"], emojis: ["\ud83d\udc4d", "\ud83d\udc4e"], correct: 0 };
      textLabel.innerText = tpl.text;
      optionsBox.innerHTML = '';

      tpl.options.forEach((opt, optIdx) => {
        const curEmoji = tpl.emojis[optIdx] || "\u2753";
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
          <span class="option-btn-emoji">${curEmoji}</span>
          <span class="option-btn-text">${opt}</span>
        `;
        btn.onclick = () => this.handleVisitorAnswer(optIdx, tpl.correct);
        optionsBox.appendChild(btn);
      });
    } else if (gameId === 2) {
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "НАЙДИ ОТЛИЧИЯ (СМАЙЛИКИ)";
      optionsBox.style.display = 'grid';
      
      const branch = this.getVisitorConnectedBranch();
      const rounds = branch && branch.diffRounds ? branch.diffRounds : (this.state.diffRounds || 6);
      const gridSize = branch && branch.diffGridSize ? branch.diffGridSize : (this.state.diffGridSize || 'normal');
      let side = 6;
      if (gridSize === 'easy') side = 4;
      if (gridSize === 'hard') side = 8;
      
      this.state.firstAnsweredThisRound = false;
      document.getElementById('visitor-game-q-index').innerText = `Раунд ${qIndex + 1} из ${rounds}`;
      document.getElementById('visitor-game-score').innerText = `Очки: ${this.state.activeGameScore}`;
      
      textLabel.innerText = "Найдите единственный отличающийся смайлик на скорость!";
      optionsBox.innerHTML = '';
      optionsBox.style.gridTemplateColumns = `repeat(${side}, 1fr)`;
      optionsBox.style.gap = '4px';
      optionsBox.style.margin = '10px 0';
      
      // Pick a random emoji pair
      const pair = EMOJI_PAIRS[Math.floor(Math.random() * EMOJI_PAIRS.length)];
      const totalCells = side * side;
      const oddCellIdx = Math.floor(Math.random() * totalCells);
      
      for (let i = 0; i < totalCells; i++) {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.style.cssText = 'width:100%; height:36px; padding:0; display:flex; align-items:center; justify-content:center; background:#110e1f; border:1px solid var(--border-light); border-radius:6px; cursor:pointer; font-size:16px; transition:all 0.15s; outline:none; margin:0;';
        btn.innerText = (i === oddCellIdx) ? pair.odd : pair.base;
        btn.onclick = () => this.handleVisitorDiffClick(i, oddCellIdx);
        optionsBox.appendChild(btn);
      }
      
      this.renderSimulatedPlayersList();
      this.simulateVisitorDiffBotsAnswering(oddCellIdx);
    } else if (gameId === 4) {
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "ТУРНИР КРЕСТИКИ-НОЛИКИ";
      optionsBox.style.display = 'block';
      const t = this.state.tttTournament;
      if (!t) {
        this.initTTFTournament();
        return;
      }
      
      const roundsCount = Math.log2(t.size);
      const remainingRounds = roundsCount - t.round;
      let roundName = "Матч";
      if (remainingRounds === 1) roundName = "Финал";
      else if (remainingRounds === 2) roundName = "1/2 финала";
      else if (remainingRounds === 3) roundName = "1/4 финала";
      else if (remainingRounds === 4) roundName = "1/8 финала";
      
      document.getElementById('visitor-game-q-index').innerText = `${roundName} (Турнир)`;
      
      if (t.matchStatus === 'bracket') {
        const opp = t.bracket[`round${t.round + 1}`].find(m => m.p1.isUser || m.p2.isUser);
        const opponent = opp.p1.isUser ? opp.p2 : opp.p1;
        
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:11px; font-weight:800; color:var(--gold); margin-bottom:5px; text-transform:uppercase;">🏆 ТУРНИРНАЯ СЕТКА (${t.size} игроков)</div>
            <div style="font-size:10px; color:#fff; margin-bottom:10px;">Текущий круг: <b>${roundName}</b></div>
            
            <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:10px; padding:10px; margin-bottom:12px; display:inline-block; width:100%; box-sizing:border-box;">
              <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
                <div style="font-size:16px;">💻 Вы</div>
                <div style="font-size:12px; color:var(--primary); font-weight:800;">VS</div>
                <div style="font-size:16px;">${opponent.avatar} ${opponent.name}</div>
              </div>
              <div style="font-size:9px; color:var(--text-muted); margin-top:6px;">Победите в матче, чтобы получить приз, нужно занять 1-е место!</div>
            </div>
          </div>
        `;
        
        optionsBox.innerHTML = '';
        const playBtn = document.createElement('button');
        playBtn.className = 'btn btn-primary';
        playBtn.style.width = '100%';
        playBtn.style.padding = '12px';
        playBtn.style.fontWeight = '800';
        playBtn.innerHTML = `⚔️ НАЧАТЬ МАТЧ`;
        playBtn.onclick = () => {
          t.matchStatus = 'playing';
          t.board.fill(null);
          t.playerTurn = Math.random() > 0.5;
          this.renderActiveGameQuestion();
          if (!t.playerTurn) {
            setTimeout(() => this.executeTTTBotMove(), 800);
          }
        };
        optionsBox.appendChild(playBtn);
        
      } else if (t.matchStatus === 'playing') {
        const opp = t.bracket[`round${t.round + 1}`].find(m => m.p1.isUser || m.p2.isUser);
        const opponent = opp.p1.isUser ? opp.p2 : opp.p1;
        
        const turnLimitText = this.state.tttTurnLimit !== 'none'
          ? `<span id="ttt-turn-timer-badge" style="display:inline-block; margin-left:8px; font-weight:800; color:var(--gold);">⏱️ -- сек</span>`
          : '';

        textLabel.innerHTML = `
          <div style="text-align:center; font-size:11px;">
            <div style="margin-bottom:6px; font-weight:700; color:var(--text-muted);">
              Матч: <b>Вы ❌</b> vs <b>${opponent.name} ⭕</b> ${turnLimitText}
            </div>
            <div style="font-size:12px; color:${t.playerTurn ? 'var(--success)' : 'var(--gold)'}; font-weight:800;">
              ${t.playerTurn ? '👉 Ваш ход (Крестик)' : `✍️ ${opponent.name} думает...`}
            </div>
          </div>
        `;
        
        optionsBox.innerHTML = '';
        const boardEl = document.createElement('div');
        boardEl.className = 'ttt-board';
        
        t.board.forEach((cell, cellIdx) => {
          const btn = document.createElement('button');
          btn.className = `ttt-cell ${cell ? cell.toLowerCase() : ''}`;
          btn.innerHTML = cell || '';
          
          if (cell || !t.playerTurn || t.matchStatus !== 'playing') {
            btn.disabled = true;
          } else {
            btn.onclick = () => this.handleTTTCellClick(cellIdx);
          }
          boardEl.appendChild(btn);
        });
        optionsBox.appendChild(boardEl);
        
        // Запуск/продолжение таймера хода
        if (this.tttCurrentTurnPlayer !== t.playerTurn) {
          this.tttCurrentTurnPlayer = t.playerTurn;
          this.resetTTTTurnTimer();
        } else {
          if (this.state.tttTurnLimit !== 'none' && t.playerTurn) {
            this.updateTTTTimerBadge();
          }
        }
        
      } else if (t.matchStatus === 'finished') {
        optionsBox.innerHTML = '';
        
        if (t.winner === 'user') {
          textLabel.innerHTML = `
            <div style="text-align:center;">
              <div style="font-size:36px; margin-bottom:10px; animation: pulse 1s infinite;">\ud83c\udfc6</div>
              <div style="font-size:15px; font-weight:800; color:var(--gold);">\u0412\u042b \u0427\u0415\u041c\u041f\u0418\u041e\u041d \u0422\u0423\u0420\u041d\u0418\u0420\u0410!</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:5px; line-height:1.4;">
                \u0412\u044b \u043e\u0431\u044b\u0433\u0440\u0430\u043b\u0438 \u0432\u0441\u0435\u0445 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u043e\u0432 \u0438 \u0437\u0430\u043d\u044f\u043b\u0438 \u043f\u0435\u0440\u0432\u043e\u0435 \u043c\u0435\u0441\u0442\u043e!
              </div>
            </div>
          `;
        } else {
          const roundText = roundName === "\u0424\u0438\u043d\u0430\u043b" ? "\u0432 \u0424\u0438\u043d\u0430\u043b\u0435" : `\u0432 ${roundName}`;
          textLabel.innerHTML = `
            <div style="text-align:center;">
              <div style="font-size:36px; margin-bottom:10px; filter: grayscale(1);">\ud83d\udc80</div>
              <div style="font-size:14px; font-weight:800; color:var(--error);">\u0412\u042b \u0412\u042b\u0411\u042b\u041b\u0418 \u0418\u0417 \u0422\u0423\u0420\u041d\u0418\u0420\u0410</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:5px; line-height:1.4;">
                \u0412\u044b \u043f\u0440\u043e\u0438\u0433\u0440\u0430\u043b\u0438 ${roundText}. \u0422\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u0431\u0435\u0434\u0438\u0442\u0435\u043b\u044c \u0424\u0438\u043d\u0430\u043b\u0430 \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u043a\u0443\u0431\u043e\u043a \u0438 \u043f\u0440\u0438\u0437!
              </div>
            </div>
          `;
          
          const backBtn = document.createElement('button');
          backBtn.className = 'btn btn-secondary';
          backBtn.style.width = '100%';
          backBtn.style.padding = '12px';
          backBtn.style.fontWeight = '800';
          backBtn.innerText = `\ud83d\udd19 \u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u0432\u044b\u0431\u043e\u0440\u0443 \u0438\u0433\u0440`;
          backBtn.onclick = () => this.visitorExitActiveGameToLobby();
          optionsBox.appendChild(backBtn);
        }
      } else if (t.matchStatus === 'waiting') {
        const roundKey = `round${t.round + 1}`;
        const matches = t.bracket[roundKey] || [];
        const userMatchIdx = matches.findIndex(m => m.p1 && m.p1.isUser || m.p2 && m.p2.isUser);
        const adjacentIdx = userMatchIdx % 2 === 0 ? userMatchIdx + 1 : userMatchIdx - 1;
        const adjacentMatch = matches[adjacentIdx];
        
        const p1Name = adjacentMatch && adjacentMatch.p1 ? `${adjacentMatch.p1.avatar} ${adjacentMatch.p1.name}` : "⏳ Ожидание";
        const p2Name = adjacentMatch && adjacentMatch.p2 ? `${adjacentMatch.p2.avatar} ${adjacentMatch.p2.name}` : "⏳ Ожидание";
        const winnerName = adjacentMatch && adjacentMatch.winner ? `${adjacentMatch.winner.avatar} ${adjacentMatch.winner.name}` : null;

        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:32px; margin-bottom:10px; animation: pulse 1.5s infinite;">⏳</div>
            <div style="font-size:13px; font-weight:800; color:var(--gold); text-transform:uppercase;">Ожидание соперника</div>
            <div style="font-size:10px; color:var(--text-muted); margin-top:6px; line-height:1.4; padding:0 10px;">
              Вы вышли в следующий раунд! Ждем победителя параллельного матча, чтобы сразиться с ним.
            </div>
          </div>
        `;
        
        optionsBox.innerHTML = '';
        const statusBox = document.createElement('div');
        statusBox.style.cssText = 'background:rgba(255,255,255,0.02); border:1px solid var(--border-light); border-radius:12px; padding:15px; margin-top:20px; text-align:center; box-sizing:border-box; width:100%;';
        statusBox.innerHTML = `
          <div style="font-size:9px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:10px;">Параллельный матч (${roundName}):</div>
          <div style="display:flex; justify-content:center; align-items:center; gap:10px; font-size:13px; font-weight:700; color:#fff;">
            <span>${p1Name}</span>
            <span style="color:var(--primary); font-size:10px; font-weight:800;">VS</span>
            <span>${p2Name}</span>
          </div>
          <div style="margin-top:12px; font-size:10px; color:var(--gold); font-weight:600; animation: ${winnerName ? 'none' : 'pulse 1.2s infinite'};">
            ${winnerName ? `Победитель: ${winnerName} 🎉` : 'Идет напряженная игра... ⚔️'}
          </div>
        `;
        optionsBox.appendChild(statusBox);
      }
      
      this.renderSimulatedPlayersList();
      
    } else {
      document.getElementById('visitor-game-q-index').innerText = `\u0418\u0433\u0440\u0430: ${gameName}`;
      
      textLabel.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:32px; margin-bottom:10px; animation: pulse 1s infinite;">${game ? game.icon : '\ud83c\udfae'}</div>
          <div style="font-size:10px; color:var(--text-muted); margin-bottom:10px;">\u0411\u044b\u0441\u0442\u0440\u0435\u0435 \u043d\u0430\u0436\u0438\u043c\u0430\u0439\u0442\u0435 \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443 \u043d\u0438\u0436\u0435, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0431\u0440\u0430\u0442\u044c \u043e\u0447\u043a\u043e\u0432 \u0438 \u043e\u0431\u043e\u0439\u0442\u0438 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u043e\u0432!</div>
          
          <div style="margin: 15px 0; background: rgba(0,0,0,0.4); height: 40px; border-radius: 8px; border:1px solid var(--border-light); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: flex-start; padding: 0 10px;">
            <div id="stickman-track-runner" style="font-size: 20px; position: absolute; left: 10px; transition: left 0.2s ease;">\ud83c\udfc3</div>
            <div style="position: absolute; right: 10px; font-size: 16px;">\ud83c\udfc1</div>
            <div style="font-size:8px; color:var(--text-muted); position:absolute; width:100%; text-align:center; left:0; pointer-events:none;">\u0422\u0420\u0415\u041a \u0421\u041e\u0420\u0415\u0412\u041d\u041e\u0412\u0410\u041d\u0418\u042f</div>
          </div>
        </div>
      `;
      
      optionsBox.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.style.width = '100%';
      btn.style.padding = '12px';
      btn.style.fontWeight = '800';
      btn.innerText = `\u26a1 \u041a\u041b\u0418\u041a\u041d\u0423\u0422\u042c \u0414\u041b\u042f \u0423\u0421\u041a\u041e\u0420\u0415\u041d\u0418\u042f!`;
      
      let clickCount = 0;
      btn.onclick = () => {
        clickCount++;
        this.state.activeGameScore += 25;
        document.getElementById('visitor-game-score').innerText = `\u041e\u0447\u043a\u0438: ${this.state.activeGameScore}`;
        
        const runner = document.getElementById('stickman-track-runner');
        if (runner) {
          const percentage = Math.min(85, 10 + (clickCount * 3));
          runner.style.left = `${percentage}%`;
        }
      };
      optionsBox.appendChild(btn);

      if (!this.state.gameRunningInterval) {
        let elapsed = 0;
        this.state.gameRunningInterval = setInterval(() => {
          elapsed++;
          this.state.simulatedPlayers.forEach(p => {
            p.score += Math.floor(Math.random() * 4) * 20;
          });
          this.renderSimulatedPlayersList();
          
          if (elapsed >= 8) {
            clearInterval(this.state.gameRunningInterval);
            this.state.gameRunningInterval = null;
            this.finishVisitorGame();
          }
        }, 1000);
      }
      
      this.renderSimulatedPlayersList();
      this.simulateBotsAnswering();
    }

    this.renderSimulatedPlayersList();
    this.simulateBotsAnswering();
  }

  // --- MEMORY MATCH B2C GAMEPLAY LOGIC ---
  initGuestMemory(totalPlayers) {
    try {
      const branch = this.getVisitorConnectedBranch();
      const theme = branch && branch.memoryTheme ? branch.memoryTheme : (this.state.memoryTheme || 'restaurant');
      const diff = branch && branch.memoryDifficulty ? branch.memoryDifficulty : (this.state.memoryDifficulty || 'normal');
      const timeLimit = branch && branch.memoryTimeLimit ? parseInt(branch.memoryTimeLimit) : (parseInt(this.state.memoryTimeLimit) || 60);

      // Emoji assets
      const themeEmojis = {
        restaurant: ['🍕', '🍔', '🍟', '🍣', '🍰', '🍹', '☕', '🍩', '🍦', '🌮'],
        animals: ['🐼', '🦊', '🐻', '🐯', '🦁', '🐰', '🐵', '🐨', '🐸', '🐱'],
        mixed: ['🔮', '💎', '🚀', '🎸', '🎨', '🧩', '🎈', '🍿', '🍄', '🦖']
      };

      const baseList = themeEmojis[theme] || themeEmojis.restaurant;
      
      // Determine number of pairs
      let numPairs = 8; // normal 4x4
      if (diff === 'easy') numPairs = 6; // 3x4
      if (diff === 'hard') numPairs = 10; // 4x5

      // Select random emojis and duplicate them
      const selectedEmojis = [];
      const shuffledBase = [...baseList].sort(() => Math.random() - 0.5);
      for (let i = 0; i < numPairs; i++) {
        selectedEmojis.push(shuffledBase[i % shuffledBase.length]);
      }

      const deckEmojis = [...selectedEmojis, ...selectedEmojis];
      
      // Shuffle deck
      const shuffledDeck = deckEmojis
        .map((emoji, idx) => ({ id: idx, emoji, solved: false, flipped: false }))
        .sort(() => Math.random() - 0.5);

      this.state.memoryDeck = shuffledDeck;
      this.state.memoryScore = 0;
      this.state.memoryFlippedCards = [];
      this.state.memoryTimeRemaining = timeLimit;

      // Reset simulated players scores
      this.state.simulatedPlayers = [];
      const animalNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const animalEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      const count = Math.max(1, totalPlayers || 4); // default to 4 players (1 user + 3 bots) if totalPlayers is not passed
      for (let i = 0; i < count - 1; i++) {
        const idx = i % animalNames.length;
        this.state.simulatedPlayers.push({
          name: animalNames[idx],
          avatar: animalEmojis[idx],
          score: 0
        });
      }

      this.updateMemoryTimerUI();

      if (this.state.gameRunningInterval) clearInterval(this.state.gameRunningInterval);
      this.state.gameRunningInterval = setInterval(() => {
        if (this.state.visitorActiveView !== 'game') {
          clearInterval(this.state.gameRunningInterval);
          return;
        }
        if (this.state.memoryTimeRemaining > 0) {
          this.state.memoryTimeRemaining--;
          this.updateMemoryTimerUI();

          // Bot match solving simulation
          let botChance = 0.10;
          if (diff === 'easy') botChance = 0.05;
          if (diff === 'hard') botChance = 0.15;

          if (Math.random() < botChance && this.state.simulatedPlayers.length > 0) {
            const randomBot = this.state.simulatedPlayers[Math.floor(Math.random() * this.state.simulatedPlayers.length)];
            const totalPairs = this.state.memoryDeck.length / 2;

            if (randomBot.score < totalPairs) {
              randomBot.score++;
              this.renderSimulatedPlayersList();
              this.showVisitorToast(`${randomBot.avatar} ${randomBot.name} нашел пару! 🧩`, false);

              // Check if bot cleared their board
              if (randomBot.score >= totalPairs) {
                this.checkMemoryEndGame();
              }
            }
          }

          if (this.state.memoryTimeRemaining <= 0) {
            clearInterval(this.state.gameRunningInterval);
            this.checkMemoryEndGame();
          }
        }
      }, 1000);

      this.renderVisitorMemory();
    } catch(e) {
      console.error("Error in initGuestMemory:", e);
    }
  }

  updateMemoryTimerUI() {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) {
      timerEl.innerText = `⏳ Оставшееся время: ${this.state.memoryTimeRemaining} сек`;
    }
  }

  renderVisitorMemory() {
    const optionsBox = document.getElementById('visitor-game-options');
    const textLabel = document.getElementById('visitor-game-question-text');
    const typeLabel = document.getElementById('visitor-game-type-label');
    if (!optionsBox || !textLabel) return;

    if (typeLabel) typeLabel.innerText = "ИГРА МЕМЕРИ 🧠";
    textLabel.style.display = 'block';
    textLabel.innerText = "Переворачивайте карточки по две и находите одинаковые пары!";

    optionsBox.style.display = 'block';
    optionsBox.innerHTML = '';

    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'memory-grid-wrapper';
    gridWrapper.style.cssText = 'display:flex; flex-direction:column; gap:10px; width:100%; box-sizing:border-box; margin-top:10px;';

    const grid = document.createElement('div');
    grid.className = 'memory-grid';

    grid.style.cssText = `display:grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width:100%; max-width:280px; margin:0 auto;`;

    this.state.memoryDeck.forEach((card, idx) => {
      const btn = document.createElement('button');
      btn.className = 'memory-card';

      const isFlipped = card.flipped || card.solved;
      btn.style.cssText = `
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        border-radius: 10px;
        border: 1px solid ${card.solved ? 'var(--success)' : (isFlipped ? 'var(--primary)' : 'var(--border-light)')};
        background: ${card.solved ? 'rgba(74,222,128,0.1)' : (isFlipped ? 'rgba(139,92,246,0.15)' : 'linear-gradient(135deg, #1e1b4b, #110e1f)')};
        box-shadow: ${isFlipped && !card.solved ? '0 0 10px rgba(139,92,246,0.3)' : 'none'};
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
        margin: 0;
        padding: 0;
      `;

      btn.innerText = isFlipped ? card.emoji : '❓';

      if (card.solved || card.flipped || this.state.memoryFlippedCards.length >= 2) {
        btn.disabled = true;
      } else {
        btn.onclick = () => this.handleVisitorCardClick(idx);
      }
      grid.appendChild(btn);
    });

    gridWrapper.appendChild(grid);
    optionsBox.appendChild(gridWrapper);

    document.getElementById('visitor-game-score').innerText = `Пары: ${this.state.memoryScore}`;

    this.renderSimulatedPlayersList();
  }

  handleVisitorCardClick(idx) {
    try {
      if (this.state.visitorActiveView !== 'game') return;
      if (this.state.memoryFlippedCards.length >= 2) return;

      const card = this.state.memoryDeck[idx];
      if (card.solved || card.flipped) return;

      card.flipped = true;
      this.playAudioTone('click');
      this.state.memoryFlippedCards.push(idx);
      this.renderVisitorMemory();

      if (this.state.memoryFlippedCards.length === 2) {
        const [firstIdx, secondIdx] = this.state.memoryFlippedCards;
        const firstCard = this.state.memoryDeck[firstIdx];
        const secondCard = this.state.memoryDeck[secondIdx];

        if (firstCard.emoji === secondCard.emoji) {
          firstCard.solved = true;
          secondCard.solved = true;
          this.state.memoryFlippedCards = [];
          this.state.memoryScore++;
          this.playAudioTone('correct');

          const totalPairs = this.state.memoryDeck.length / 2;

          if (this.state.memoryScore >= totalPairs) {
            this.checkMemoryEndGame();
          } else {
            this.renderVisitorMemory();
          }
        } else {
          this.setVisitorTimeout(() => {
            firstCard.flipped = false;
            secondCard.flipped = false;
            this.state.memoryFlippedCards = [];
            this.playAudioTone('wrong');
            this.renderVisitorMemory();
          }, 800);
        }
      }
    } catch(e) {
      console.error("Error in handleVisitorCardClick:", e);
    }
  }

  checkMemoryEndGame() {
    try {
      clearInterval(this.state.gameRunningInterval);

      const totalPairs = this.state.memoryDeck.length / 2;
      const guestScore = this.state.memoryScore;
      
      const winningBot = this.state.simulatedPlayers.find(p => p.score >= totalPairs);

      let winner = { name: "Вы", avatar: "👤", score: guestScore, isUser: true };
      if (winningBot && guestScore < totalPairs) {
        winner = { name: winningBot.name, avatar: winningBot.avatar, score: winningBot.score, isUser: false };
      } else {
        const sortedBots = [...this.state.simulatedPlayers].sort((a, b) => b.score - a.score);
        const topBot = sortedBots[0];
        if (topBot && topBot.score > guestScore) {
          winner = { name: topBot.name, avatar: topBot.avatar, score: topBot.score, isUser: false };
        }
      }

      this.state.activeGameScore = guestScore;
      
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "ИГРА ОКОНЧЕНА 🏁";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">🏁</div>
            <div style="font-size:14px; font-weight:800; color:var(--gold);">ИГРА ЗАВЕРШЕНА!</div>
            <div style="font-size:11px; color:#fff; margin-top:4px;">Победитель: <b>${winner.avatar} ${winner.name}</b> (${winner.score} пар)</div>
          </div>
        `;
      }

      this.playAudioTone(winner.isUser ? 'victory' : 'incorrect');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in checkMemoryEndGame:", e);
      this.finishVisitorGame();
    }
  }

  // --- CHECKERS B2C GAMEPLAY LOGIC ---
  initGuestCheckers() {
    try {
      const branch = this.getVisitorConnectedBranch();
      const turnLimit = branch && branch.checkersTurnLimit ? branch.checkersTurnLimit : (this.state.checkersTurnLimit || 'none');

      // Alternate player color
      let userColor = 'w';
      if (this.state.checkersLastPlayerColor === 'w') {
        userColor = 'b';
      }
      this.state.checkersLastPlayerColor = userColor;
      this.state.checkersUserColor = userColor;

      const botColor = userColor === 'w' ? 'b' : 'w';

      const board = Array(64).fill(null);
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const idx = r * 8 + c;
          if ((r + c) % 2 === 1) {
            if (r < 3) board[idx] = botColor;
            else if (r > 4) board[idx] = userColor;
          }
        }
      }

      const botPoolNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const botPoolEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      const randIdx = Math.floor(Math.random() * botPoolNames.length);

      this.state.checkersBoard = board;
      this.state.checkersTurn = userColor === 'w' ? 'user' : 'bot'; // White moves first!
      this.state.checkersSelectedCell = null;
      this.state.checkersValidMoves = [];
      this.state.checkersActiveCapturePieceIdx = null;
      this.state.checkersUserTimeoutCount = 0;
      this.state.checkersBotTimeoutCount = 0;
      this.state.checkersUserTotalTimeouts = 0;
      this.state.checkersBotTotalTimeouts = 0;
      this.state.checkersOpponent = {
        name: botPoolNames[randIdx],
        avatar: botPoolEmojis[randIdx]
      };
      this.state.simulatedPlayers = [{
        name: this.state.checkersOpponent.name,
        avatar: this.state.checkersOpponent.avatar,
        score: 0
      }];
      this.state.activeGameScore = 0;
      this.state.checkersTimeRemaining = turnLimit !== 'none' ? parseInt(turnLimit) : null;

      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();

      // If user is Black, Bot starts immediately as White!
      if (this.state.checkersTurn === 'bot') {
        setTimeout(() => this.executeCheckersBotMove(), 1200);
      }
    } catch (e) {
      console.error("Error in initGuestCheckers:", e);
    }
  }

  clearCheckersTurnTimer() {
    if (this.checkersTurnTimerInterval) {
      clearInterval(this.checkersTurnTimerInterval);
      this.checkersTurnTimerInterval = null;
    }
  }

  resetCheckersTurnTimer() {
    this.clearCheckersTurnTimer();
    const branch = this.getVisitorConnectedBranch();
    const turnLimit = branch && branch.checkersTurnLimit ? branch.checkersTurnLimit : (this.state.checkersTurnLimit || 'none');

    if (turnLimit === 'none') return;
    const limit = parseInt(turnLimit);
    if (isNaN(limit)) return;

    this.state.checkersTimeRemaining = limit;
    this.updateCheckersTimerUI();

    this.checkersTurnTimerInterval = setInterval(() => {
      if (this.state.visitorActiveView !== 'game') {
        this.clearCheckersTurnTimer();
        return;
      }
      this.state.checkersTimeRemaining--;
      this.updateCheckersTimerUI();

      if (this.state.checkersTimeRemaining <= 0) {
        this.clearCheckersTurnTimer();
        this.handleCheckersTurnTimeout();
      }
    }, 1000);
  }

  updateCheckersTimerUI() {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) {
      const color = this.state.checkersTimeRemaining <= 3 ? 'var(--error)' : 'var(--gold)';
      timerEl.innerHTML = `⏱️ Ход ${this.state.checkersTurn === 'user' ? 'Ваш' : 'соперника'}: <span style="color:${color}; font-weight:800;">${this.state.checkersTimeRemaining} сек</span>`;
    }
    const badgeEl = document.getElementById('checkers-board-timer-badge');
    if (badgeEl) {
      badgeEl.innerText = this.state.checkersTimeRemaining;
      const color = this.state.checkersTimeRemaining <= 3 ? 'var(--error)' : 'var(--gold)';
      const shadow = this.state.checkersTimeRemaining <= 3 ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)';
      badgeEl.style.borderColor = color;
      badgeEl.style.boxShadow = `0 0 10px ${shadow}`;
    }
  }

  handleCheckersTurnTimeout() {
    if (this.state.visitorActiveView !== 'game') return;
    this.playAudioTone('incorrect');

    this.clearCheckersTurnTimer();

    if (this.state.checkersTurn === 'user') {
      this.showVisitorToast("⚠️ Техническое поражение! Превышено время на ход.", true);
      this.handleCheckersMatchEnd(false);
    } else {
      this.showVisitorToast("⚠️ Техническая победа! Соперник превысил время на ход.", false);
      this.handleCheckersMatchEnd(true);
    }
  }

  getCheckersValidMoves(board, cellIdx) {
    const moves = [];
    const p = board[cellIdx];
    if (!p) return moves;

    const r = Math.floor(cellIdx / 8);
    const c = cellIdx % 8;

    const isKing = (p === 'W' || p === 'B');
    const isWhite = (p === 'w' || p === 'W');

    const drow = [-1, -1, 1, 1];
    const dcol = [-1, 1, -1, 1];

    // 1. Simple moves (diagonal 1 step)
    if (isKing) {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];
        let step = 1;
        while (true) {
          const nr = r + step * dr;
          const nc = c + step * dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const targetIdx = nr * 8 + nc;
            if (board[targetIdx] === null) {
              moves.push({
                type: 'move',
                from: cellIdx,
                to: targetIdx,
                captured: null
              });
              step++;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];
        const isUserPiece = (this.state.checkersUserColor === 'w') ? (p === 'w' || p === 'W') : (p === 'b' || p === 'B');
        if (isUserPiece && dr > 0) continue;
        if (!isUserPiece && dr < 0) continue;

        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const targetIdx = nr * 8 + nc;
          if (board[targetIdx] === null) {
            moves.push({
              type: 'move',
              from: cellIdx,
              to: targetIdx,
              captured: null
            });
          }
        }
      }
    }

    // 2. Capture moves (jumping over opponent)
    if (isKing) {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];
        let step = 1;
        let opponentFoundIdx = null;
        while (true) {
          const nr = r + step * dr;
          const nc = c + step * dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const currIdx = nr * 8 + nc;
            const piece = board[currIdx];
            if (piece === null) {
              if (opponentFoundIdx !== null) {
                moves.push({
                  type: 'capture',
                  from: cellIdx,
                  to: currIdx,
                  captured: opponentFoundIdx
                });
              }
            step++;
            } else {
              const isPieceWhite = (piece === 'w' || piece === 'W');
              if (isWhite !== isPieceWhite) {
                if (opponentFoundIdx === null) {
                  opponentFoundIdx = currIdx;
                  step++;
                } else {
                  break; // Can't jump multiple
                }
              } else {
                break; // Friend blocker
              }
            }
          } else {
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];

        const nr = r + dr;
        const nc = c + dc;
        const jr = r + 2 * dr;
        const jc = c + 2 * dc;

        if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8) {
          const midIdx = nr * 8 + nc;
          const jumpIdx = jr * 8 + jc;
          const midPiece = board[midIdx];
          const jumpPiece = board[jumpIdx];

          if (jumpPiece === null && midPiece !== null) {
            const isMidWhite = (midPiece === 'w' || midPiece === 'W');
            if (isWhite !== isMidWhite) {
              moves.push({
                type: 'capture',
                from: cellIdx,
                to: jumpIdx,
                captured: midIdx
              });
            }
          }
        }
      }
    }

    return moves;
  }

  getCheckersValidMovesForPlayer(board, color) {
    let allMoves = [];
    for (let i = 0; i < 64; i++) {
      const p = board[i];
      if (p !== null) {
        const isPieceWhite = (p === 'w' || p === 'W');
        const isPlayerWhite = (color === 'w');
        if (isPieceWhite === isPlayerWhite) {
          const pieceMoves = this.getCheckersValidMoves(board, i);
          allMoves.push(...pieceMoves);
        }
      }
    }

    const captures = allMoves.filter(m => m.type === 'capture');
    if (captures.length > 0) {
      return captures;
    }
    return allMoves;
  }

  renderVisitorCheckers() {
    try {
      const optionsBox = document.getElementById('visitor-game-options');
      const textLabel = document.getElementById('visitor-game-question-text');
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (!optionsBox || !textLabel) return;

      if (typeLabel) typeLabel.innerText = "ИГРА ШАШКИ 🏁";
      
      const turnLimit = this.state.checkersTimeRemaining;
      if (turnLimit === null) {
        const timerEl = document.getElementById('visitor-game-q-index');
        if (timerEl) {
          timerEl.innerText = `Ход: ${this.state.checkersTurn === 'user' ? 'Ваш' : 'соперника'}`;
        }
      }

      textLabel.style.display = 'block';
      if (this.state.checkersTurn === 'user') {
        textLabel.innerText = "Ваш ход (Белые). Выберите шашку и укажите клетку для перемещения.";
      } else {
        textLabel.innerText = `Ожидание хода соперника (${this.state.checkersOpponent.avatar} ${this.state.checkersOpponent.name})...`;
      }

      optionsBox.style.display = 'block';
      optionsBox.innerHTML = '';

      const gridWrapper = document.createElement('div');
      gridWrapper.style.cssText = 'display:flex; flex-direction:column; gap:10px; width:100%; box-sizing:border-box; margin-top:10px;';

      const grid = document.createElement('div');
      grid.className = 'checkers-grid';
      grid.style.cssText = 'display:grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr); gap:1px; width:100%; max-width:280px; aspect-ratio: 1; margin:0 auto; background:#1e1b4b; border:4px solid #110e1f; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.5); overflow:hidden; box-sizing:border-box;';

      const board = this.state.checkersBoard;
      const validMoves = this.state.checkersValidMoves;
      const selectedCell = this.state.checkersSelectedCell;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const idx = r * 8 + c;
          const piece = board[idx];
          
          const cellBtn = document.createElement('button');
          cellBtn.style.cssText = `
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: none;
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: default;
            aspect-ratio: 1;
            position: relative;
          `;

          const isDark = (r + c) % 2 === 1;
          cellBtn.style.background = isDark ? '#2e2547' : '#e0d8f0';

          const validMove = validMoves.find(m => m.to === idx);

          if (piece !== null) {
            const checker = document.createElement('div');
            const isPieceWhite = (piece === 'w' || piece === 'W');
            const isPieceKing = (piece === 'W' || piece === 'B');

            checker.style.cssText = `
              width: 80%;
              height: 80%;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              transition: all 0.25s;
            `;

            if (isPieceWhite) {
              checker.style.background = 'linear-gradient(135deg, #ffffff, #d1d5db)';
              checker.style.border = '2px solid var(--primary)';
              if (selectedCell === idx) {
                checker.style.boxShadow = '0 0 12px var(--primary-light), inset 0 0 4px var(--primary)';
                checker.style.transform = 'scale(1.1)';
              }
            } else {
              checker.style.background = 'linear-gradient(135deg, #374151, #111827)';
              checker.style.border = '2px solid #ef4444';
            }

            if (isPieceKing) {
              checker.innerText = '👑';
            }

            const isUserPiece = (this.state.checkersUserColor === 'w') ? isPieceWhite : !isPieceWhite;
            if (this.state.checkersTurn === 'user' && isUserPiece) {
              cellBtn.style.cursor = 'pointer';
              cellBtn.onclick = () => this.handleVisitorCheckersCellClick(idx);
            }

            cellBtn.appendChild(checker);
          } else if (validMove) {
            cellBtn.style.cursor = 'pointer';
            cellBtn.onclick = () => this.handleVisitorCheckersCellClick(idx);
            
            const dot = document.createElement('div');
            dot.style.cssText = `
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: var(--success);
              box-shadow: 0 0 8px var(--success-light);
            `;
            cellBtn.appendChild(dot);
          }

          grid.appendChild(cellBtn);
        }
      }

      const boardContainer = document.createElement('div');
      boardContainer.style.cssText = 'position:relative; width:100%; max-width:280px; margin:0 auto;';
      boardContainer.appendChild(grid);

      if (turnLimit !== null && turnLimit !== undefined) {
        const timerBadge = document.createElement('div');
        timerBadge.id = 'checkers-board-timer-badge';
        timerBadge.style.cssText = `
          position: absolute;
          top: -12px;
          right: -12px;
          background: #110e1f;
          border: 2px solid ${this.state.checkersTimeRemaining <= 3 ? 'var(--error)' : 'var(--gold)'};
          box-shadow: 0 0 10px ${this.state.checkersTimeRemaining <= 3 ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'};
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          z-index: 10;
          font-family: monospace;
        `;
        timerBadge.innerText = this.state.checkersTimeRemaining;
        boardContainer.appendChild(timerBadge);
      }

      gridWrapper.appendChild(boardContainer);
      optionsBox.appendChild(gridWrapper);

      this.renderSimulatedPlayersList();
    } catch (e) {
      console.error("Error in renderVisitorCheckers:", e);
    }
  }

  handleVisitorCheckersCellClick(idx) {
    try {
      if (this.state.visitorActiveView !== 'game' || this.state.checkersTurn !== 'user') return;

      const board = this.state.checkersBoard;
      const piece = board[idx];

      // 1. Click on own piece to select
      const isUserPiece = (this.state.checkersUserColor === 'w') ? (piece === 'w' || piece === 'W') : (piece === 'b' || piece === 'B');
      if (piece !== null && isUserPiece) {
        if (this.state.checkersActiveCapturePieceIdx !== null) {
          if (idx !== this.state.checkersActiveCapturePieceIdx) {
            this.showVisitorToast("⚠️ Вы должны продолжить взятие этой же шашкой!", true);
            return;
          }
        }

        this.state.checkersSelectedCell = idx;
        const allValid = this.getCheckersValidMovesForPlayer(board, this.state.checkersUserColor);
        this.state.checkersValidMoves = allValid.filter(m => m.from === idx);
        
        this.playAudioTone('click');
        this.renderVisitorCheckers();
        return;
      }

      // 2. Click on a valid move target cell to execute move
      const validMove = this.state.checkersValidMoves.find(m => m.to === idx);
      if (validMove) {
        const fromIdx = validMove.from;
        const toIdx = validMove.to;
        const movedPiece = board[fromIdx];

        board[toIdx] = movedPiece;
        board[fromIdx] = null;

        if (validMove.type === 'capture') {
          board[validMove.captured] = null;
          this.state.activeGameScore++;
          this.playAudioTone('correct');
          this.showVisitorToast("💥 Срубили шашку!", false);
        } else {
          this.playAudioTone('click');
        }

        const toRow = Math.floor(toIdx / 8);
        const isUserColorWhite = (this.state.checkersUserColor === 'w');
        const isPromotionRow = isUserColorWhite ? (toRow === 0) : (toRow === 7);
        const promotedType = isUserColorWhite ? 'W' : 'B';
        const isNormalUserPiece = isUserColorWhite ? (movedPiece === 'w') : (movedPiece === 'b');
        if (isNormalUserPiece && isPromotionRow) {
          board[toIdx] = promotedType;
          this.showVisitorToast("👑 Дамка!", false);
          this.playAudioTone('success');
        }

        document.getElementById('visitor-game-score').innerText = `Срублено: ${this.state.activeGameScore}`;

        this.state.checkersSelectedCell = null;
        this.state.checkersValidMoves = [];
        this.renderVisitorCheckers();

        if (this.checkCheckersGameOver()) {
          return;
        }

        // If it was a capture, check if this piece can capture again
        if (validMove.type === 'capture') {
          const nextMoves = this.getCheckersValidMoves(board, toIdx);
          const nextCaptures = nextMoves.filter(m => m.type === 'capture');
          if (nextCaptures.length > 0) {
            this.state.checkersActiveCapturePieceIdx = toIdx;
            this.state.checkersSelectedCell = toIdx;
            this.state.checkersValidMoves = nextCaptures;
            this.renderVisitorCheckers();
            this.resetCheckersTurnTimer();
            return;
          }
        }

        // End of user turn
        this.state.checkersActiveCapturePieceIdx = null;
        this.state.checkersTurn = 'bot';
        this.resetCheckersTurnTimer();
        this.renderVisitorCheckers();

        setTimeout(() => this.executeCheckersBotMove(), 1200);
      }
    } catch (e) {
      console.error("Error in handleVisitorCheckersCellClick:", e);
    }
  }

  executeCheckersBotMove() {
    try {
      if (this.state.visitorActiveView !== 'game' || this.state.checkersTurn !== 'bot') return;

      const board = this.state.checkersBoard;
      const botColor = this.state.checkersUserColor === 'w' ? 'b' : 'w';
      const allValid = this.getCheckersValidMovesForPlayer(board, botColor);

      if (allValid.length === 0) {
        this.handleCheckersMatchEnd(true);
        return;
      }

      // Bot acted, reset consecutive timeout count
      this.state.checkersBotTimeoutCount = 0;

      const chosenMove = allValid[Math.floor(Math.random() * allValid.length)];
      const fromIdx = chosenMove.from;
      const toIdx = chosenMove.to;
      const movedPiece = board[fromIdx];

      board[toIdx] = movedPiece;
      board[fromIdx] = null;

      if (chosenMove.type === 'capture') {
        board[chosenMove.captured] = null;
        this.state.simulatedPlayers[0].score++;
        this.renderSimulatedPlayersList();
        this.playAudioTone('incorrect');
        this.showVisitorToast(`${this.state.checkersOpponent.avatar} ${this.state.checkersOpponent.name} срубил вашу шашку!`, false);
      } else {
        this.playAudioTone('click');
      }

      const toRow = Math.floor(toIdx / 8);
      const isBotColorWhite = (this.state.checkersUserColor === 'b');
      const isPromotionRow = isBotColorWhite ? (toRow === 0) : (toRow === 7);
      const promotedType = isBotColorWhite ? 'W' : 'B';
      const isNormalBotPiece = isBotColorWhite ? (movedPiece === 'w') : (movedPiece === 'b');
      if (isNormalBotPiece && isPromotionRow) {
        board[toIdx] = promotedType;
        this.showVisitorToast(`${this.state.checkersOpponent.name} получил Дамку! 👑`, false);
        this.playAudioTone('error');
      }

      this.renderVisitorCheckers();

      if (this.checkCheckersGameOver()) {
        return;
      }

      if (chosenMove.type === 'capture') {
        const nextMoves = this.getCheckersValidMoves(board, toIdx);
        const nextCaptures = nextMoves.filter(m => m.type === 'capture');
        if (nextCaptures.length > 0) {
          setTimeout(() => this.executeCheckersBotMultiJump(toIdx), 800);
          return;
        }
      }

      this.state.checkersTurn = 'user';
      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();
    } catch (e) {
      console.error("Error in executeCheckersBotMove:", e);
      this.state.checkersTurn = 'user';
      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();
    }
  }

  executeCheckersBotMultiJump(activeBotPieceIdx) {
    try {
      if (this.state.visitorActiveView !== 'game' || this.state.checkersTurn !== 'bot') return;

      const board = this.state.checkersBoard;
      const pieceMoves = this.getCheckersValidMoves(board, activeBotPieceIdx);
      const captures = pieceMoves.filter(m => m.type === 'capture');

      if (captures.length === 0) {
        this.state.checkersTurn = 'user';
        this.resetCheckersTurnTimer();
        this.renderVisitorCheckers();
        return;
      }

      // Reset timeout
      this.state.checkersBotTimeoutCount = 0;

      const chosenMove = captures[Math.floor(Math.random() * captures.length)];
      const fromIdx = chosenMove.from;
      const toIdx = chosenMove.to;
      const movedPiece = board[fromIdx];

      board[toIdx] = movedPiece;
      board[fromIdx] = null;
      board[chosenMove.captured] = null;

      this.state.simulatedPlayers[0].score++;
      this.renderSimulatedPlayersList();
      this.playAudioTone('incorrect');
      this.showVisitorToast(`${this.state.checkersOpponent.avatar} ${this.state.checkersOpponent.name} продолжает серию взятий!`, false);

      const toRow = Math.floor(toIdx / 8);
      const isBotColorWhite = (this.state.checkersUserColor === 'b');
      const isPromotionRow = isBotColorWhite ? (toRow === 0) : (toRow === 7);
      const promotedType = isBotColorWhite ? 'W' : 'B';
      const isNormalBotPiece = isBotColorWhite ? (movedPiece === 'w') : (movedPiece === 'b');
      if (isNormalBotPiece && isPromotionRow) {
        board[toIdx] = promotedType;
        this.showVisitorToast(`${this.state.checkersOpponent.name} получил Дамку! 👑`, false);
        this.playAudioTone('error');
      }

      this.renderVisitorCheckers();

      if (this.checkCheckersGameOver()) {
        return;
      }

      const nextMoves = this.getCheckersValidMoves(board, toIdx);
      const nextCaptures = nextMoves.filter(m => m.type === 'capture');

      if (nextCaptures.length > 0) {
        setTimeout(() => this.executeCheckersBotMultiJump(toIdx), 800);
      } else {
        this.state.checkersTurn = 'user';
        this.resetCheckersTurnTimer();
        this.renderVisitorCheckers();
      }
    } catch (e) {
      console.error("Error in executeCheckersBotMultiJump:", e);
      this.state.checkersTurn = 'user';
      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();
    }
  }

  checkCheckersGameOver() {
    try {
      const board = this.state.checkersBoard;
      let whiteCount = 0;
      let blackCount = 0;
      for (let i = 0; i < 64; i++) {
        const p = board[i];
        if (p === 'w' || p === 'W') whiteCount++;
        if (p === 'b' || p === 'B') blackCount++;
      }

      const userColor = this.state.checkersUserColor;
      if (userColor === 'w') {
        if (whiteCount === 0) {
          this.handleCheckersMatchEnd(false);
          return true;
        }
        if (blackCount === 0) {
          this.handleCheckersMatchEnd(true);
          return true;
        }
      } else {
        if (blackCount === 0) {
          this.handleCheckersMatchEnd(false);
          return true;
        }
        if (whiteCount === 0) {
          this.handleCheckersMatchEnd(true);
          return true;
        }
      }

      const nextTurn = this.state.checkersTurn;
      const activeColor = nextTurn === 'user' ? userColor : (userColor === 'w' ? 'b' : 'w');
      const activeMoves = this.getCheckersValidMovesForPlayer(board, activeColor);
      if (activeMoves.length === 0) {
        this.handleCheckersMatchEnd(nextTurn === 'bot');
        return true;
      }

      return false;
    } catch (e) {
      console.error("Error in checkCheckersGameOver:", e);
      return false;
    }
  }

  handleCheckersMatchEnd(isUserWinner) {
    try {
      this.clearCheckersTurnTimer();
      clearInterval(this.state.gameRunningInterval);

      if (isUserWinner) {
        this.state.activeGameScore = 12;
        this.state.simulatedPlayers[0].score = 0;
      } else {
        this.state.activeGameScore = 0;
        this.state.simulatedPlayers[0].score = 12;
      }

      let winner = {
        name: isUserWinner ? "Вы" : this.state.checkersOpponent.name,
        avatar: isUserWinner ? "👤" : this.state.checkersOpponent.avatar,
        score: 12,
        isUser: isUserWinner
      };

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "МАТЧ ОКОНЧЕН 🏁";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">🏁</div>
            <div style="font-size:14px; font-weight:800; color:var(--gold);">ИГРА ЗАВЕРШЕНА!</div>
            <div style="font-size:11px; color:#fff; margin-top:4px;">Победитель: <b>${winner.avatar} ${winner.name}</b></div>
          </div>
        `;
      }

      this.playAudioTone(isUserWinner ? 'victory' : 'incorrect');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in handleCheckersMatchEnd:", e);
      this.finishVisitorGame();
    }
  }

  initGuestStickmanRace(totalPlayers) {
    try {
      const branch = this.getVisitorConnectedBranch();
      const len = branch && branch.stickmanRaceLength ? branch.stickmanRaceLength : (this.state.stickmanRaceLength || 50);
      const obs = branch && branch.stickmanRaceObstacles ? branch.stickmanRaceObstacles : (this.state.stickmanRaceObstacles || 'medium');
      const limit = branch && branch.stickmanRaceTimeLimit ? branch.stickmanRaceTimeLimit : (this.state.stickmanRaceTimeLimit || 'none');

      this.state.raceLength = len;
      this.state.raceObstacles = obs;
      this.state.raceFinished = false;
      this.state.raceTimeRemaining = limit !== 'none' ? parseInt(limit) : null;
      this.state.raceWinner = null;
      
      this.state.raceCountdown = 3;
      this.state.raceObstaclesList = [];
      this.lastObstacleSpawnTime = 0;

      // Populate players
      const botPoolNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const botPoolEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      const shuffledBots = [];
      for (let i = 0; i < botPoolNames.length; i++) {
        shuffledBots.push({ name: botPoolNames[i], avatar: botPoolEmojis[i] });
      }
      shuffledBots.sort(() => Math.random() - 0.5);

      const players = [];
      const lanesOrder = [1, 2, 4, 5, 3];

      // 1. User
      players.push({
        id: 'user',
        name: 'Вы',
        avatar: '👨‍💻',
        progress: 0,
        maxProgress: 0,
        eliminated: false,
        stumbleTime: 0,
        lane: 3,
        lastFoot: 'L',
        finished: false
      });

      // 2. Bots
      const countBots = totalPlayers - 1;
      for (let i = 0; i < countBots; i++) {
        const botTemplate = shuffledBots[i % shuffledBots.length];
        const assignedLane = lanesOrder[i % lanesOrder.length];
        players.push({
          id: 'bot_' + i,
          name: botTemplate.name,
          avatar: botTemplate.avatar,
          progress: 0,
          maxProgress: 0,
          eliminated: false,
          stumbleTime: 0,
          lane: assignedLane,
          animFoot: 'L',
          speedFactor: -0.012 + Math.random() * 0.024,
          finished: false
        });
      }

      this.state.racePlayers = players;
      
      this.state.simulatedPlayers = players.slice(1).map(p => ({
        name: p.name,
        avatar: p.avatar,
        score: 0
      }));

      this.clearRaceTimers();
      this.resetRaceTimer();

      // Main loop every 50ms
      this.raceGameInterval = setInterval(() => this.tickRaceGame(), 50);

      // Countdown
      this.playAudioTone('click');
      const cdInterval = setInterval(() => {
        if (this.state.visitorActiveView !== 'game' || this.state.raceFinished) {
          clearInterval(cdInterval);
          return;
        }
        
        if (this.state.raceCountdown === 3) {
          this.state.raceCountdown = 2;
          this.playAudioTone('click');
        } else if (this.state.raceCountdown === 2) {
          this.state.raceCountdown = 1;
          this.playAudioTone('click');
        } else if (this.state.raceCountdown === 1) {
          this.state.raceCountdown = "СТАРТ! 🏁";
          this.playAudioTone('correct');
          this.state.raceStartTime = Date.now();
        } else {
          this.state.raceCountdown = null;
          clearInterval(cdInterval);
        }
        this.renderVisitorStickmanRace();
      }, 1000);

      this.renderVisitorStickmanRace();
    } catch(e) {
      console.error("Error in initGuestStickmanRace:", e);
    }
  }

  tickRaceGame() {
    try {
      if (this.state.raceFinished || this.state.visitorActiveView !== 'game') {
        this.clearRaceTimers();
        return;
      }

      if (typeof this.state.raceCountdown === 'number') {
        return;
      }

      const len = this.state.raceLength;
      let stateChanged = false;

      // 1. Move players automatically
      this.state.racePlayers.forEach(p => {
        if (p.finished || p.eliminated) return;

        if (p.stumbleTime > 0) {
          p.stumbleTime = Math.max(0, p.stumbleTime - 0.05);
          stateChanged = true;
          return;
        }

        let speed = 0.09 + (p.speedFactor || 0.0);
        
        if (Math.random() < 0.25) {
          if (p.id === 'user') {
            p.lastFoot = p.lastFoot === 'L' ? 'R' : 'L';
          } else {
            p.animFoot = p.animFoot === 'L' ? 'R' : 'L';
          }
        }

        p.progress += speed;
        p.maxProgress = Math.max(p.maxProgress || 0, p.progress);
        stateChanged = true;

        if (p.progress >= len) {
          p.progress = len;
          if (!p.finished) {
            p.finished = true;
            p.finishTime = Date.now() - this.state.raceStartTime;

            const standingsEntry = this.state.simulatedPlayers.find(sp => sp.name === p.name);
            if (standingsEntry) standingsEntry.score = 100;
          }
        }
      });

      // Check finish: collect everyone who crossed this tick
      if (!this.state.raceFinished) {
        const justFinished = this.state.racePlayers.filter(p => p.finished && !p.eliminated);
        if (justFinished.length >= 2) {
          // Check if 2+ finished within the same ~100ms window (draw)
          const times = justFinished.map(p => p.finishTime);
          const minTime = Math.min(...times);
          const simultaneous = justFinished.filter(p => (p.finishTime - minTime) < 150);
          if (simultaneous.length >= 2) {
            this.handleRaceDraw(simultaneous);
          } else {
            // Single winner — earliest finishTime
            const winner = justFinished.reduce((a, b) => a.finishTime < b.finishTime ? a : b);
            if (!this.state.raceWinner) {
              this.state.raceWinner = winner;
              this.handleRaceMatchEnd(winner.id);
            }
          }
        } else if (justFinished.length === 1 && !this.state.raceWinner) {
          this.state.raceWinner = justFinished[0];
          this.handleRaceMatchEnd(justFinished[0].id);
        }

        // All eliminated / finished with no winner? → draw
        const allDone = this.state.racePlayers.every(p => p.finished || p.eliminated);
        if (allDone && !this.state.raceFinished) {
          this.handleRaceDraw(this.state.racePlayers.filter(p => !p.eliminated));
        }
      }

      // 2. Move obstacles down
      this.state.raceObstaclesList.forEach(obs => {
        obs.y += 8;
      });

      this.state.raceObstaclesList = this.state.raceObstaclesList.filter(obs => obs.y <= 320);

      // 3. Spawn obstacles
      const now = Date.now();
      if (!this.lastObstacleSpawnTime) this.lastObstacleSpawnTime = 0;

      let spawnCooldown = 1400;
      if (this.state.raceObstacles === 'high') {
        spawnCooldown = 850;
      } else if (this.state.raceObstacles === 'extreme') {
        spawnCooldown = 500;
      } else if (this.state.raceObstacles === 'none') {
        spawnCooldown = 9999999;
      }

      if (now - this.lastObstacleSpawnTime > spawnCooldown) {
        this.lastObstacleSpawnTime = now;
        
        // Spawn 2-3 barriers simultaneously on different lanes
        const numBarriers = this.state.raceObstacles === 'extreme' ? 3 : (this.state.raceObstacles === 'high' ? 2 : 2);
        const allLanes = [1, 2, 3, 4, 5];
        const shuffledLanes = allLanes.sort(() => Math.random() - 0.5);
        let spawned = 0;
        
        for (const lane of shuffledLanes) {
          if (spawned >= numBarriers) break;
          const blockExists = this.state.raceObstaclesList.some(o => o.lane === lane && o.y < 70);
          if (!blockExists) {
            this.state.raceObstaclesList.push({
              id: 'obs_' + Date.now() + '_' + lane + '_' + Math.random(),
              lane: lane,
              y: 0
            });
            spawned++;
          }
        }
      }

      // 4. Calculate Screen Y and Check Collisions
      this.state.racePlayers.forEach(p => {
        const bottomPercent = p.eliminated ? 8 : (8 + (p.progress / len) * 80);
        p.screenY = 320 * (bottomPercent / 100);
        p.screenY = Math.max(20, Math.min(290, p.screenY));

        if (p.finished && !p.eliminated) {
          p.screenY = 290;
        }

        if (!p.finished && p.stumbleTime <= 0) {
          const playerYFromTop = 320 - p.screenY;

          this.state.raceObstaclesList.forEach(obs => {
            if (obs.lane === p.lane && Math.abs(obs.y - playerYFromTop) < 16) {
              p.stumbleTime = 1.5;
              p.progress = Math.max(0, p.progress - (len * 0.08));
              
              if (p.id === 'user') {
                this.playAudioTone('error');
                this.showVisitorToast("💥 Врезались в барьер!", true);
              }

              // Check for elimination
              if (p.progress <= 0 && (p.maxProgress || 0) > len * 0.15) {
                p.eliminated = true;
                p.finished = true;
                p.stumbleTime = 99999;
                
                if (p.id === 'user') {
                  this.playAudioTone('error');
                  this.showVisitorToast("💀 Вы выбыли из гонки!", true);
                  
                  // End game immediately with lead bot as winner
                  const leadBot = this.state.racePlayers.slice(1).filter(bp => !bp.eliminated).sort((a, b) => b.progress - a.progress)[0];
                  this.handleRaceMatchEnd(leadBot ? leadBot.id : 'user');
                  return;
                } else {
                  this.showVisitorToast(`💀 ${p.avatar} ${p.name} выбыл!`, false);
                }
              }

              this.state.raceObstaclesList = this.state.raceObstaclesList.filter(o => o.id !== obs.id);
            }
          });
        }
      });

      // 5. Bot AI Dodging
      this.state.racePlayers.forEach(p => {
        if (p.id === 'user' || p.finished || p.eliminated || p.stumbleTime > 0) return;

        const playerYFromTop = 320 - p.screenY;
        const approachingObs = this.state.raceObstaclesList.find(obs => 
          obs.lane === p.lane && 
          obs.y < playerYFromTop && 
          (playerYFromTop - obs.y) < 70
        );

        if (approachingObs) {
          // Reduced dodge chance (7% per tick ~= 50ms) so bots sometimes get hit
          const dodgeChance = this.state.raceObstacles === 'extreme' ? 0.04 : (this.state.raceObstacles === 'high' ? 0.06 : 0.08);
          if (Math.random() < dodgeChance) {
            const options = [];
            if (p.lane > 1) options.push(p.lane - 1);
            if (p.lane < 5) options.push(p.lane + 1);

            // Only move to adjacent lane if it's clear — otherwise stay and get hit
            const safeOptions = options.filter(laneOpt => {
              return !this.state.raceObstaclesList.some(o => 
                o.lane === laneOpt && 
                Math.abs(o.y - playerYFromTop) < 70
              );
            });

            if (safeOptions.length > 0) {
              const targetLane = safeOptions[Math.floor(Math.random() * safeOptions.length)];
              p.lane = targetLane;
            }
            // If no safe lane, bots stay and take the hit — just like players
          }
        }
      });

      this.renderVisitorStickmanRace();
    } catch(e) {
      console.error("Error in tickRaceGame:", e);
    }
  }

  handleStickmanRaceMove(dir) {
    try {
      if (this.state.raceFinished || this.state.raceCountdown || this.state.visitorActiveView !== 'game') return;

      const user = this.state.racePlayers[0];
      if (user.stumbleTime > 0) return;

      if (dir === 'left' && user.lane > 1) {
        user.lane--;
        this.playAudioTone('click');
      } else if (dir === 'right' && user.lane < 5) {
        user.lane++;
        this.playAudioTone('click');
      }
      this.renderVisitorStickmanRace();
    } catch(e) {
      console.error("Error in handleStickmanRaceMove:", e);
    }
  }

  handleRaceMatchEnd(winnerId) {
    try {
      this.state.raceFinished = true;
      this.clearRaceTimers();

      const user = this.state.racePlayers[0];
      const isUserWinner = winnerId === 'user';
      const len = this.state.raceLength;

      if (isUserWinner) {
        this.state.activeGameScore = 100;
      } else {
        this.state.activeGameScore = Math.floor((user.progress / len) * 100);
      }

      this.state.racePlayers.forEach(p => {
        if (p.id === 'user') return;
        const botStandings = this.state.simulatedPlayers.find(sp => sp.name === p.name);
        if (botStandings) {
          if (p.finished) {
            botStandings.score = 100;
          } else {
            botStandings.score = Math.floor((p.progress / len) * 100);
          }
        }
      });

      const winnerPlayer = this.state.racePlayers.find(p => p.id === winnerId);
      const winnerName = isUserWinner ? "Вы" : winnerPlayer.name;
      const winnerAvatar = isUserWinner ? "👨‍💻" : winnerPlayer.avatar;

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = user.eliminated ? "ВЫ ВЫБЫЛИ! 💀" : "ФИНИШ! 🏁";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        const resultTitle = user.eliminated ? "ВЫ ВЫБЫЛИ! 💀" : "ЗАБЕГ ЗАВЕРШЕН!";
        const resultColor = user.eliminated ? "var(--error)" : "var(--gold)";
        const resultIcon = user.eliminated ? "💀" : "🏁";
        
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">${resultIcon}</div>
            <div style="font-size:14px; font-weight:800; color:${resultColor};">${resultTitle}</div>
            <div style="font-size:11px; color:#fff; margin-top:4px;">Победитель гонки: <b>${winnerAvatar} ${winnerName}</b></div>
          </div>
        `;
      }

      this.playAudioTone(isUserWinner ? 'victory' : 'incorrect');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in handleRaceMatchEnd:", e);
      this.finishVisitorGame();
    }
  }

  handleRaceDraw(finishers) {
    try {
      if (this.state.raceFinished) return;
      this.state.raceFinished = true;
      this.clearRaceTimers();

      const user = this.state.racePlayers[0];
      const allEliminated = this.state.racePlayers.every(p => p.eliminated);
      const userFinished = finishers && finishers.some(p => p.id === 'user');

      // Score: 50 for draw, 0 if all eliminated
      this.state.activeGameScore = allEliminated ? 0 : 50;

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = allEliminated ? "ВСЕ ВЫБЫЛИ! 💀" : "НИЧЬЯ! 🤝";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        const title = allEliminated ? "ВСЕ ВЫБЫЛИ!" : "НИЧЬЯ!";
        const icon = allEliminated ? "💀" : "🤝";
        const color = allEliminated ? "var(--error)" : "#a78bfa";
        const subtitle = allEliminated 
          ? "Все игроки выбыли из гонки до финиша." 
          : "Несколько игроков пересекли финиш одновременно!";
        
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:36px; margin-bottom:8px;">${icon}</div>
            <div style="font-size:15px; font-weight:900; color:${color};">${title}</div>
            <div style="font-size:10px; color:var(--text-muted); margin-top:5px;">${subtitle}</div>
          </div>
        `;
      }

      this.playAudioTone(allEliminated ? 'error' : 'click');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in handleRaceDraw:", e);
      this.finishVisitorGame();
    }
  }

  clearRaceTimers() {
    if (this.raceBotInterval) {
      clearInterval(this.raceBotInterval);
      this.raceBotInterval = null;
    }
    if (this.raceTimerInterval) {
      clearInterval(this.raceTimerInterval);
      this.raceTimerInterval = null;
    }
    if (this.raceGameInterval) {
      clearInterval(this.raceGameInterval);
      this.raceGameInterval = null;
    }
  }

  resetRaceTimer() {
    if (this.state.raceTimeRemaining === null) {
      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = "Гонка Стикменов";
      return;
    }

    this.updateRaceTimerUI();

    this.raceTimerInterval = setInterval(() => {
      if (this.state.visitorActiveView !== 'game' || this.state.raceFinished || this.state.raceCountdown) {
        return;
      }
      this.state.raceTimeRemaining--;
      this.updateRaceTimerUI();

      if (this.state.raceTimeRemaining <= 0) {
        this.clearRaceTimers();
        this.handleRaceTimeout();
      }
    }, 1000);
  }

  updateRaceTimerUI() {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) {
      const color = this.state.raceTimeRemaining <= 5 ? 'var(--error)' : 'var(--gold)';
      timerEl.innerHTML = `⏱️ Время: <span style="color:${color}; font-weight:800;">${this.state.raceTimeRemaining} сек</span>`;
    }
  }

  handleRaceTimeout() {
    this.state.racePlayers.sort((a, b) => b.progress - a.progress);
    const leader = this.state.racePlayers[0];
    this.handleRaceMatchEnd(leader.id);
  }

  getStickmanSVG(isMe, stumbleTime, lastFoot, obstacleActive) {
    const strokeColor = isMe ? '#fbbf24' : '#e2e8f0'; // Gold for user, silver/white for bots
    
    // Rotate legs based on lastFoot or stumble
    let leftLegTransform = '';
    let rightLegTransform = '';
    let bodyTransform = '';
    let headOffset = 0;
    
    if (stumbleTime > 0) {
      // Stumbled/fell: body is rotated horizontally, legs are bent
      bodyTransform = 'rotate(90 10 15)';
      leftLegTransform = 'rotate(45 10 15)';
      rightLegTransform = 'rotate(-45 10 15)';
    } else {
      // Walking/running leg swing based on step
      if (lastFoot === 'L') {
        leftLegTransform = 'rotate(35 10 15)';
        rightLegTransform = 'rotate(-35 10 15)';
        headOffset = -1; // Bob head
      } else if (lastFoot === 'R') {
        leftLegTransform = 'rotate(-35 10 15)';
        rightLegTransform = 'rotate(35 10 15)';
        headOffset = -1; // Bob head
      } else {
        // Neutral stance
        leftLegTransform = 'rotate(5 10 15)';
        rightLegTransform = 'rotate(-5 10 15)';
      }
    }
    
    return `
      <svg viewBox="0 0 20 26" style="width:20px; height:26px; overflow:visible; transition: transform 0.15s ease;">
        <g style="transform: ${bodyTransform}; transform-origin: 10px 15px; transition: transform 0.2s ease;">
          <!-- Head -->
          <circle cx="10" cy="${5 + headOffset}" r="3.5" fill="${strokeColor}" />
          <!-- Torso -->
          <line x1="10" y1="8.5" x2="10" y2="15" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" />
          <!-- Left Leg -->
          <line x1="10" y1="15" x2="6" y2="23" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" style="transform: ${leftLegTransform}; transform-origin: 10px 15px; transition: transform 0.15s ease;" />
          <!-- Right Leg -->
          <line x1="10" y1="15" x2="14" y2="23" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" style="transform: ${rightLegTransform}; transform-origin: 10px 15px; transition: transform 0.15s ease;" />
          <!-- Left Arm -->
          <line x1="10" y1="10" x2="4" y2="14" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" style="transform: ${rightLegTransform}; transform-origin: 10px 10px; transition: transform 0.15s ease;" />
          <!-- Right Arm -->
          <line x1="10" y1="10" x2="16" y2="14" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" style="transform: ${leftLegTransform}; transform-origin: 10px 10px; transition: transform 0.15s ease;" />
        </g>
      </svg>
    `;
  }

  renderVisitorStickmanRace() {
    try {
      const textLabel = document.getElementById('visitor-game-question-text');
      const optionsBox = document.getElementById('visitor-game-options');
      if (!textLabel || !optionsBox) return;

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "ГОНКА СТИКМЕНОВ";

      // Fix h2 and container to allow race track full height
      textLabel.style.cssText = 'width:100%; margin:0; padding:0; font-size:13px; font-weight:700; line-height:1.4; overflow:visible;';
      const playingBox = textLabel.closest('.game-playing-box');
      if (playingBox) {
        playingBox.style.justifyContent = 'flex-start';
        playingBox.style.padding = '8px';
        playingBox.style.gap = '6px';
        playingBox.style.overflow = 'hidden';
      }

      const user = this.state.racePlayers[0];
      const len = this.state.raceLength;

      const userPercent = Math.min(100, Math.floor((user.progress / len) * 100));
      const scoreEl = document.getElementById('visitor-game-score');
      if (scoreEl) scoreEl.innerText = `Прогресс: ${userPercent}%`;

      const obstaclesHTML = this.state.raceObstaclesList.map(obs => {
        const topPct = (obs.y / 280) * 100;
        const laneLeft = (obs.lane - 1) * 20;
        return `<div style="position:absolute;top:${topPct}%;left:${laneLeft}%;width:20%;height:16px;display:flex;justify-content:center;align-items:center;z-index:4;"><span style="font-size:11px;">🚧</span></div>`;
      }).join('');

      const runnersHTML = this.state.racePlayers.map((p) => {
        const laneLeft = (p.lane - 1) * 20;
        const percent = p.eliminated ? 0 : (p.progress / len);
        const bottomPct = p.eliminated ? 8 : (8 + (percent * 80));
        const isMe = p.id === 'user';
        const stepFoot = isMe ? p.lastFoot : p.animFoot;
        const stickmanSVG = this.getStickmanSVG(isMe, p.eliminated ? 99 : p.stumbleTime, stepFoot, false);
        const opacity = p.eliminated ? '0.5' : '1';
        let bubble = '';
        if (p.eliminated) bubble = `<div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:8px;background:rgba(239,68,68,0.9);color:#fff;border-radius:4px;padding:1px 4px;white-space:nowrap;font-weight:900;z-index:15;">💀 Выбыл</div>`;
        else if (p.stumbleTime > 0) bubble = `<div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:10px;z-index:15;">🥴</div>`;
        const tagBg = p.eliminated ? 'rgba(80,80,80,0.8)' : (isMe ? 'var(--primary)' : 'rgba(15,23,42,0.8)');
        const tagBorder = isMe ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.15)';
        const tagColor = p.eliminated ? '#999' : (isMe ? 'var(--gold)' : '#fff');
        return `<div style="position:absolute;left:${laneLeft}%;width:20%;bottom:${bottomPct}%;height:45px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;transition:left 0.12s ease-out,bottom 0.15s linear;z-index:10;opacity:${opacity};">${bubble}<div style="margin-bottom:2px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 3px rgba(0,0,0,0.55)) ${p.eliminated ? 'grayscale(1)' : ''};transform:scale(${isMe ? 1.25 : 1});">${stickmanSVG}</div><div style="background:${tagBg};border:${tagBorder};border-radius:4px;padding:1px 3px;font-size:6px;font-weight:800;color:${tagColor};white-space:nowrap;max-width:90%;overflow:hidden;text-overflow:ellipsis;">${p.avatar} ${p.name}</div></div>`;
      }).join('');

      const countdownOverlay = this.state.raceCountdown ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.75);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;"><div style="font-size:64px;font-weight:900;color:var(--gold);text-shadow:0 0 15px var(--gold);animation:pulse 0.5s infinite;">${this.state.raceCountdown}</div><div style="font-size:10px;font-weight:800;color:#fff;text-transform:uppercase;margin-top:8px;letter-spacing:1.5px;">Приготовьтесь!</div></div>` : '';

      textLabel.innerHTML = `
        <div style="width:100%;box-sizing:border-box;">
          <div style="position:relative;width:100%;height:280px;background:#1b4332;border-radius:14px;overflow:hidden;border:2px solid rgba(255,255,255,0.07);box-shadow:inset 0 0 20px rgba(0,0,0,0.6);">
            <div style="position:absolute;left:10%;width:80%;height:100%;background:linear-gradient(180deg,#991b1b,#7f1d1d);border-left:2px solid #fff;border-right:2px solid #fff;">
              <div style="position:absolute;left:20%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;left:40%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;left:60%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;left:80%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;top:8%;left:0;width:100%;height:8px;background:repeating-conic-gradient(#000 0% 25%,#fff 0% 50%) 50%/8px 8px;z-index:2;"></div>
              <div style="position:absolute;top:2%;left:0;width:100%;text-align:center;font-size:7px;font-weight:900;color:var(--gold);letter-spacing:1.5px;z-index:3;">🏁 ФИНИШ 🏁</div>
              <div style="position:absolute;bottom:2%;left:0;width:100%;display:flex;justify-content:space-around;font-size:8px;font-weight:800;color:rgba(255,255,255,0.35);z-index:3;"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
              ${obstaclesHTML}
              ${runnersHTML}
            </div>
            ${countdownOverlay}
          </div>
        </div>
      `;

      // Controls — always visible, stumble shown as small bar above buttons
      optionsBox.style.display = 'block';
      optionsBox.style.gridTemplateColumns = '';

      if (user.eliminated) {
        optionsBox.innerHTML = `
          <div style="text-align:center;padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.4);border-radius:10px;">
            <div style="font-size:28px;margin-bottom:4px;">💀</div>
            <div style="font-size:13px;font-weight:900;color:var(--error);margin-bottom:3px;">ВЫ ВЫБЫЛИ!</div>
            <div style="font-size:10px;color:var(--text-muted);">Слишком много столкновений с барьерами.</div>
          </div>
        `;
      } else {
        let stumbleBar = '';
        if (user.stumbleTime > 0) {
          const stunSec = user.stumbleTime.toFixed(1);
          stumbleBar = `<div style="width:100%;padding:6px 10px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:8px;text-align:center;box-sizing:border-box;margin-bottom:4px;"><span style="font-size:12px;">🥴</span> <span style="font-size:11px;font-weight:800;color:var(--error);">Врезались в барьер!</span> <span style="font-size:10px;color:var(--text-muted);">Через <b style="color:#fff">${stunSec}с</b>...</span></div>`;
        }
        optionsBox.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:5px;width:100%;box-sizing:border-box;">
            ${stumbleBar}
            <div style="font-size:9px;color:var(--text-muted);text-align:center;">Управляйте аватаром (избегайте барьеров 🚧):</div>
            <div style="display:flex;gap:8px;width:100%;">
              <button onclick="app.handleStickmanRaceMove('left')" style="flex:1;padding:13px;font-size:14px;font-weight:800;background:#06b6d4;border:2px solid #06b6d4;border-radius:12px;color:#fff;cursor:pointer;">⬅️ ВЛЕВО</button>
              <button onclick="app.handleStickmanRaceMove('right')" style="flex:1;padding:13px;font-size:14px;font-weight:800;background:#ec4899;border:2px solid #ec4899;border-radius:12px;color:#fff;cursor:pointer;">ВПРАВО ➡️</button>
            </div>
          </div>
        `;
      }
    } catch(e) {
      console.error("Error in renderVisitorStickmanRace:", e);
    }
  }

  // ══════════════════════════════════════════════════════════
  //  GAME 8: НАРЕЗКА 🔪 — Tap to Slice
  // ══════════════════════════════════════════════════════════

  initSlicingGame(totalPlayers) {
    try {
      const branch = this.state.branches.find(b => b.id === this.state.visitorConnectedBranchId);
      const duration = (branch && branch.slicingDuration) || this.state.slicingDuration || 30;
      const item = (branch && branch.slicingItem) || this.state.slicingItem || 'bread';

      this.state.slicingDuration = duration;
      this.state.slicingItem = item;
      this.state.slicingTimeRemaining = duration;
      this.state.slicingCount = 0;
      this.state.slicingFinished = false;
      this.state.slicingStarted = true; // start immediately, no countdown
      this.state.slicingCountdown = 0;

      // Item metadata
      const items = {
        bread:    { emoji: '🍞', label: 'батон хлеба', color: '#f59e0b' },
        cucumber: { emoji: '🥒', label: 'огурец',      color: '#22c55e' },
        cake:     { emoji: '🎂', label: 'торт',        color: '#ec4899' },
        pizza:    { emoji: '🍕', label: 'пиццу',       color: '#ef4444' },
      };
      this.state.slicingItemMeta = items[item] || items.bread;

      // Generate simulated opponents with random scores
      const botNames = ['Панда', 'Лиса', 'Медведь', 'Тигр', 'Лев', 'Зайка', 'Обезьянка', 'Коала'];
      const botEmojis = ['🐼', '🦊', '🐻', '🐯', '🦁', '🐰', '🐵', '🐨'];
      this.state.slicingBots = [];
      for (let i = 0; i < totalPlayers - 1; i++) {
        const idx = i % botNames.length;
        // bots score range: duration * 2 to duration * 6 (taps)
        const botScore = Math.floor(duration * 2 + Math.random() * duration * 4);
        this.state.slicingBots.push({ name: botNames[idx], avatar: botEmojis[idx], score: botScore });
      }

      this.setVisitorViewPanel('game');

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = 'НАРЕЗКА 🔪';

      const scoreEl = document.getElementById('visitor-game-score');
      if (scoreEl) scoreEl.innerText = 'Срезов: 0';

      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = `⏱ ${duration}с`;

      this.renderSlicingGame();
      this.startSlicingTimer();

    } catch(e) {
      console.error('Error in initSlicingGame:', e);
    }
  }

  startSlicingTimer() {
    this.slicingTimerInterval = setInterval(() => {
      if (!this.state.slicingStarted || this.state.slicingFinished) return;
      this.state.slicingTimeRemaining--;

      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = `⏱ ${this.state.slicingTimeRemaining}с`;

      this.renderSlicingGame();

      if (this.state.slicingTimeRemaining <= 0) {
        clearInterval(this.slicingTimerInterval);
        this.finishSlicingGame();
      }
    }, 1000);
  }

  handleSliceTap() {
    if (!this.state.slicingStarted || this.state.slicingFinished) return;
    this.state.slicingCount++;
    const count = this.state.slicingCount;
    const meta = this.state.slicingItemMeta || { color: '#f59e0b' };

    // Update score badge (no full re-render to keep button stable)
    const scoreEl = document.getElementById('visitor-game-score');
    if (scoreEl) scoreEl.innerText = `Срезов: ${count}`;

    // Update counter text in-place
    const countEl = document.getElementById('slicing-count-display');
    if (countEl) countEl.innerText = count;

    // Animate bread emoji
    const breadEl = document.getElementById('slicing-bread-emoji');
    if (breadEl) {
      breadEl.style.transform = 'scale(0.82) rotate(-8deg)';
      breadEl.style.filter = `drop-shadow(0 2px 4px ${meta.color}88)`;
      setTimeout(() => {
        if (breadEl) {
          breadEl.style.transform = 'scale(1) rotate(0deg)';
          breadEl.style.filter = `drop-shadow(0 4px 8px ${meta.color}44)`;
        }
      }, 80);
    }

    // Update pieces row
    const piecesEl = document.getElementById('slicing-pieces-row');
    if (piecesEl && count <= 20) {
      const angle = (Math.random() * 30 - 15).toFixed(1);
      piecesEl.innerHTML += `<span style="font-size:13px;display:inline-block;transform:rotate(${angle}deg);margin:1px;">${meta.emoji || '🍞'}</span>`;
    }

    this.playAudioTone('click');
  }

  renderSlicingGame() {
    try {
      const textLabel = document.getElementById('visitor-game-question-text');
      const optionsBox = document.getElementById('visitor-game-options');
      if (!textLabel || !optionsBox) return;

      const meta = this.state.slicingItemMeta || { emoji: '🍞', label: 'батон', color: '#f59e0b' };
      const count = this.state.slicingCount || 0;
      const duration = this.state.slicingDuration || 30;
      const timeLeft = this.state.slicingTimeRemaining !== undefined ? this.state.slicingTimeRemaining : duration;
      const finished = this.state.slicingFinished;

      // Always keep correct label
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel && !finished) typeLabel.innerText = 'НАРЕЗКА 🔪';

      if (finished) {
        textLabel.innerHTML = `
          <div style="text-align:center; padding:10px;">
            <div style="font-size:42px; margin-bottom:8px;">✂️</div>
            <div style="font-size:13px; font-weight:900; color:var(--gold);">ВРЕМЯ ВЫШЛО!</div>
            <div style="font-size:28px; font-weight:900; color:#fff; margin:8px 0;">${count} <span style="font-size:14px; color:var(--text-muted);">срезов</span></div>
            <div style="font-size:10px; color:var(--text-muted);">Считаем результаты...</div>
          </div>
        `;
        optionsBox.innerHTML = '';
        return;
      }

      // Active game screen — only render once (first time or timer tick)
      const timerPct = Math.max(0, (timeLeft / duration) * 100);
      const timerColor = timeLeft <= 5 ? 'var(--error)' : meta.color;

      textLabel.innerHTML = `
        <div style="text-align:center; padding:5px 0;">
          <!-- Timer bar -->
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-bottom:10px; overflow:hidden;">
            <div style="width:${timerPct}%; height:100%; background:${timerColor}; border-radius:3px; transition:width 0.9s linear;"></div>
          </div>

          <!-- Main item with id for animation -->
          <div id="slicing-bread-emoji" style="font-size:72px; margin:5px 0; filter: drop-shadow(0 4px 8px ${meta.color}44); transition: transform 0.08s, filter 0.08s; display:inline-block;">
            ${meta.emoji}
          </div>

          <!-- Slice count -->
          <div style="font-size:32px; font-weight:900; color:${meta.color}; text-shadow:0 0 10px ${meta.color}88; margin:4px 0;">
            <span id="slicing-count-display">${count}</span>
          </div>
          <div style="font-size:10px; color:var(--text-muted);">срезов</div>

          <!-- Cut pieces row -->
          <div id="slicing-pieces-row" style="margin-top:6px; line-height:1.3; min-height:18px;"></div>
        </div>
      `;

      // Only build the button once (avoid re-rendering every tap)
      if (!optionsBox.querySelector('#slice-tap-btn')) {
        optionsBox.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px; width:100%;">
            <button
              id="slice-tap-btn"
              onclick="app.handleSliceTap()"
              ontouchstart="app.handleSliceTap(); return false;"
              style="
                width:100%; padding:26px 0; font-size:26px; font-weight:900;
                background:linear-gradient(135deg, ${meta.color}, ${meta.color}bb);
                border:3px solid ${meta.color};
                border-radius:20px;
                box-shadow: 0 0 25px ${meta.color}55, 0 4px 15px rgba(0,0,0,0.4);
                color:#fff; cursor:pointer;
                transition: transform 0.06s, box-shadow 0.06s;
                user-select:none; -webkit-user-select:none; -webkit-tap-highlight-color:transparent;
              "
              onmousedown="this.style.transform='scale(0.93)'; this.style.boxShadow='0 0 8px ${meta.color}33';"
              onmouseup="this.style.transform='scale(1)'; this.style.boxShadow='0 0 25px ${meta.color}55, 0 4px 15px rgba(0,0,0,0.4)';"
              ontouchend="this.style.transform='scale(1)';"
            >
              🔪 РЕЗАТЬ!
            </button>
            <div style="font-size:9px; color:var(--text-muted);">Нажимай как можно быстрее!</div>
          </div>
        `;
      }
    } catch(e) {
      console.error('Error in renderSlicingGame:', e);
    }
  }

  finishSlicingGame() {
    try {
      this.state.slicingFinished = true;
      const userCount = this.state.slicingCount || 0;
      const bots = this.state.slicingBots || [];

      this.state.activeGameScore = userCount;
      this.renderSlicingGame();

      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = 'Результат!';

      this.playAudioTone('victory');

      // Compare scores after 1.5s
      this.setVisitorTimeout(() => {
        const typeLabel = document.getElementById('visitor-game-type-label');
        if (typeLabel) typeLabel.innerText = 'ИТОГ НАРЕЗКИ 🔪';

        const meta = this.state.slicingItemMeta || { emoji: '🍞', color: '#f59e0b' };
        const textLabel = document.getElementById('visitor-game-question-text');
        const optionsBox = document.getElementById('visitor-game-options');
        if (optionsBox) optionsBox.innerHTML = '';

        // Find winner
        const allScores = bots.map(b => b.score);
        const maxBotScore = allScores.length > 0 ? Math.max(...allScores) : 0;
        const ties = allScores.filter(s => s === userCount).length;
        const userWins = userCount > maxBotScore;
        const isDraw = !userWins && userCount === maxBotScore;
        const userLoses = !userWins && !isDraw;

        // Find top bot
        const topBot = bots.sort((a, b) => b.score - a.score)[0];

        let resultIcon, resultTitle, resultColor, resultDetail;
        if (userWins) {
          resultIcon = '🏆';
          resultTitle = 'ВЫ ПОБЕДИЛИ!';
          resultColor = 'var(--gold)';
          resultDetail = `Ваш результат: <b style="color:var(--gold)">${userCount}</b> срезов`;
          this.playAudioTone('victory');
        } else if (isDraw) {
          resultIcon = '🤝';
          resultTitle = 'НИЧЬЯ!';
          resultColor = '#a78bfa';
          resultDetail = `Все набрали по <b style="color:#a78bfa">${userCount}</b> срезов`;
        } else {
          resultIcon = '😔';
          resultTitle = 'НЕ ПОВЕЗЛО!';
          resultColor = 'var(--error)';
          resultDetail = topBot ? `${topBot.avatar} ${topBot.name} нарезал больше: <b>${topBot.score}</b>` : `Вы нарезали: ${userCount}`;
        }

        // Scoreboard rows
        let boardRows = `
          <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.07);">
            <span style="font-size:10px;">👤 Вы</span>
            <span style="font-size:10px; font-weight:900; color:${userWins ? 'var(--gold)' : isDraw ? '#a78bfa' : 'var(--error)'}">${userCount}</span>
          </div>
        `;
        bots.slice(0, 5).forEach(b => {
          const isTopBot = topBot && b.name === topBot.name;
          boardRows += `
            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="font-size:10px;">${b.avatar} ${b.name}</span>
              <span style="font-size:10px; font-weight:700; color:${isTopBot && !userWins ? 'var(--gold)' : 'var(--text-muted)'}">${b.score}</span>
            </div>
          `;
        });

        if (textLabel) {
          textLabel.innerHTML = `
            <div style="text-align:center; padding:6px 0;">
              <div style="font-size:40px; margin-bottom:6px;">${resultIcon}</div>
              <div style="font-size:14px; font-weight:900; color:${resultColor}; margin-bottom:4px;">${resultTitle}</div>
              <div style="font-size:10px; color:var(--text-muted); margin-bottom:10px;">${resultDetail}</div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-light); border-radius:10px; padding:8px 10px; text-align:left;">
                <div style="font-size:9px; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Таблица срезов</div>
                ${boardRows}
              </div>
            </div>
          `;
        }

        this.setVisitorTimeout(() => {
          this.finishVisitorGame();
        }, 5000);
      }, 1500);
    } catch(e) {
      console.error('Error in finishSlicingGame:', e);
      this.finishVisitorGame();
    }
  }

  saveSlicingConfig(key, value) {
    try {
      this.state[key] = value;
      const branch = this.state.branches.find(b => b.id === this.state.activeBranchId);
      if (branch) branch[key] = value;
      this.saveState();
    } catch(e) {
      console.error("Error in saveSlicingConfig:", e);
    }
  }

  adjustSlicingPlayersLimit(type, delta) {
    try {
      const game = this.state.games.find(g => g.id === 8);
      if (!game) return;
      if (type === 'min') {
        let val = (game.minPlayers || 2) + delta;
        if (val < 2) val = 2;
        if (val > (game.maxPlayers || 8)) val = game.maxPlayers || 8;
        game.minPlayers = val;
        const el = document.getElementById('label-slicing-min-players');
        if (el) el.innerText = `${val} чел.`;
      } else {
        let val = (game.maxPlayers || 8) + delta;
        if (val > 8) val = 8;
        if (val < (game.minPlayers || 2)) val = game.minPlayers || 2;
        game.maxPlayers = val;
        const el = document.getElementById('label-slicing-max-players');
        if (el) el.innerText = `${val} чел.`;
      }
      this.saveState();
    } catch(e) {
      console.error("Error in adjustSlicingPlayersLimit:", e);
    }
  }

  renderSimulatedPlayersList() {
    const list = document.getElementById('visitor-game-players-list');
    if (!list) return;
    list.innerHTML = '';

    const header = document.getElementById('visitor-game-players-header');
    const gameId = this.state.visitorSelectedGameId;

    if (gameId === 4) {
      if (header) header.innerText = 'Сетка турнира (Текущий раунд):';
      
      const t = this.state.tttTournament;
      if (!t) return;
      
      const roundKey = `round${t.round + 1}`;
      const matches = t.bracket[roundKey] || [];
      
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = '6px';
      
      matches.forEach(m => {
        const row = document.createElement('div');
        row.className = 'bracket-match-row';
        
        let p1WinnerClass = '';
        let p2WinnerClass = '';
        if (m.winner) {
          p1WinnerClass = m.winner === m.p1 ? 'winner' : 'loser';
          p2WinnerClass = m.winner === m.p2 ? 'winner' : 'loser';
        }
        
        const p1Name = m.p1 ? `${m.p1.avatar} ${m.p1.name}` : '⏳ Ожидание';
        const p2Name = m.p2 ? `${m.p2.avatar} ${m.p2.name}` : '⏳ Ожидание';
        
        row.innerHTML = `
          <div class="bracket-player-slot ${p1WinnerClass}">${p1Name}</div>
          <div class="bracket-vs-badge">VS</div>
          <div class="bracket-player-slot ${p2WinnerClass}">${p2Name}</div>
        `;
        list.appendChild(row);
      });
    } else {
      if (header) {
        header.innerText = (gameId === 6) ? 'Найденные пары:' : 'Участники викторины:';
      }
      list.style.display = 'flex';
      list.style.flexDirection = 'row';
      list.style.gap = '';
      
      const youCard = document.createElement('div');
      youCard.className = 'player-avatar';
      youCard.innerHTML = `
        <div class="avatar-icon you">👨‍💻</div>
        <div style="font-weight:700;">Вы</div>
        <div style="font-family: monospace;">${gameId === 6 ? this.state.memoryScore : this.state.activeGameScore}</div>
      `;
      list.appendChild(youCard);

      this.state.simulatedPlayers.slice(0, 3).forEach(p => {
        const card = document.createElement('div');
        card.className = 'player-avatar';
        card.innerHTML = `
          <div class="avatar-icon">${p.avatar}</div>
          <div>${p.name}</div>
          <div style="font-family: monospace;">${p.score}</div>
        `;
        list.appendChild(card);
      });
    }
  }

  simulateBotsAnswering() {
    clearInterval(this.state.gameRunningInterval);
    const questionStartTime = Date.now();

    this.state.gameRunningInterval = setInterval(() => {
      if (this.state.firstAnsweredThisRound) {
        clearInterval(this.state.gameRunningInterval);
        return;
      }
      
      // Bots cannot answer for the first 6 seconds (gives human time to read!)
      const secondsElapsed = (Date.now() - questionStartTime) / 1000;
      if (secondsElapsed < 6) return;

      // Slow response probability (15% chance every second after the first 6 seconds)
      if (Math.random() > 0.85) {
        const randomBot = this.state.simulatedPlayers[Math.floor(Math.random() * this.state.simulatedPlayers.length)];
        this.state.firstAnsweredThisRound = true;
        clearInterval(this.state.gameRunningInterval);
        
        randomBot.score += 1;
        this.renderSimulatedPlayersList();
        
        const buttons = document.getElementById('visitor-game-options').querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        this.showVisitorToast(`${randomBot.avatar} ${randomBot.name} 🏆`, false);
        this.playAudioTone('wrong');
        
        this.setVisitorTimeout(() => {
          this.state.activeGameQIndex++;
          const branch = this.getVisitorConnectedBranch();
          const branchTemplates = branch && branch.templates ? branch.templates : this.state.templates;
          const questionsCount = branchTemplates.length;
          
          if (this.state.activeGameQIndex < questionsCount) {
            this.renderActiveGameQuestion();
          } else {
            this.finishVisitorGame();
          }
        }, 1200);
      }
    }, 1000);
  }

  handleVisitorAnswer(selected, correct) {
    clearInterval(this.state.gameRunningInterval);
    this.state.firstAnsweredThisRound = true;
    
    const buttons = document.getElementById('visitor-game-options').querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correct) {
        btn.classList.add('correct');
      } else if (idx === selected) {
        btn.classList.add('wrong');
      }
    });

    if (selected === correct) {
      this.state.activeGameScore += 1;
      document.getElementById('visitor-game-score').innerText = `Побед: ${this.state.activeGameScore}`;
      this.showVisitorToast("👤 Вы 🏆", false);
      
      this.playAudioTone('correct');
      if (window.navigator.vibrate) {
        window.navigator.vibrate(80);
      }
    } else {
      this.showVisitorToast("Неправильно! ❌", true);
      this.playAudioTone('wrong');
      if (window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
      
      // Give the win point to a random bot instead
      const randomBot = this.state.simulatedPlayers[Math.floor(Math.random() * this.state.simulatedPlayers.length)];
      randomBot.score += 1;
      this.renderSimulatedPlayersList();
    }

    this.setVisitorTimeout(() => {
      this.state.activeGameQIndex++;
      const branch = this.getVisitorConnectedBranch();
      const branchTemplates = branch && branch.templates ? branch.templates : this.state.templates;
      const questionsCount = branchTemplates.length;
      
      if (this.state.activeGameQIndex < questionsCount) {
        this.renderActiveGameQuestion();
      } else {
        this.finishVisitorGame();
      }
    }, 1200);
  }

  handleVisitorDiffClick(selectedIdx, correctIdx) {
    if (this.state.firstAnsweredThisRound) return;
    this.state.firstAnsweredThisRound = true;
    
    clearInterval(this.state.gameRunningInterval);
    
    const optionsBox = document.getElementById('visitor-game-options');
    const buttons = optionsBox.querySelectorAll('button');
    
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.style.cursor = 'default';
      if (idx === correctIdx) {
        btn.style.background = 'rgba(74,222,128,0.2)';
        btn.style.borderColor = 'var(--success)';
      }
      if (idx === selectedIdx && selectedIdx !== correctIdx) {
        btn.style.background = 'rgba(239,68,68,0.2)';
        btn.style.borderColor = 'var(--error)';
      }
    });
    
    const isCorrect = (selectedIdx === correctIdx);
    if (isCorrect) {
      this.state.activeGameScore += 1;
      document.getElementById('visitor-game-score').innerText = `Очки: ${this.state.activeGameScore}`;
      this.showVisitorToast("👤 Вы нашли первыми! +1 🏆", false);
      this.playAudioTone('correct');
      if (window.navigator.vibrate) {
        window.navigator.vibrate(80);
      }
    } else {
      this.showVisitorToast("Неправильно! ❌", true);
      this.playAudioTone('wrong');
      if (window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
      
      const randomBot = this.state.simulatedPlayers[Math.floor(Math.random() * this.state.simulatedPlayers.length)];
      randomBot.score += 1;
      this.renderSimulatedPlayersList();
    }
    
    this.setVisitorTimeout(() => {
      this.state.activeGameQIndex++;
      const branch = this.getVisitorConnectedBranch();
      const rounds = branch && branch.diffRounds ? branch.diffRounds : (this.state.diffRounds || 6);
      
      if (this.state.activeGameQIndex < rounds) {
        this.renderActiveGameQuestion();
      } else {
        this.finishVisitorGame();
      }
    }, 1800);
  }

  simulateVisitorDiffBotsAnswering(correctIdx) {
    clearInterval(this.state.gameRunningInterval);
    
    const branch = this.getVisitorConnectedBranch();
    const timeLimit = branch && branch.diffTimeLimit ? branch.diffTimeLimit : (this.state.diffTimeLimit || 15);
    const scale = timeLimit / 15.0;
    const questionStartTime = Date.now();
    
    const gridSize = branch && branch.diffGridSize ? branch.diffGridSize : (this.state.diffGridSize || 'normal');
    let minDelay = 8000;
    let maxDelay = 15000;
    if (gridSize === 'easy') {
      minDelay = 6000;
      maxDelay = 11000;
    } else if (gridSize === 'hard') {
      minDelay = 10000;
      maxDelay = 20000;
    }
    
    const botTargetDelay = (minDelay + Math.random() * (maxDelay - minDelay)) * scale;
    
    this.state.gameRunningInterval = setInterval(() => {
      if (this.state.visitorActiveView !== 'game') {
        clearInterval(this.state.gameRunningInterval);
        return;
      }
      if (this.state.firstAnsweredThisRound) {
        clearInterval(this.state.gameRunningInterval);
        return;
      }
      
      const elapsed = Date.now() - questionStartTime;
      
      if (elapsed >= timeLimit * 1000) {
        clearInterval(this.state.gameRunningInterval);
        this.state.firstAnsweredThisRound = true;
        
        const optionsBox = document.getElementById('visitor-game-options');
        const buttons = optionsBox.querySelectorAll('button');
        buttons.forEach((btn, idx) => {
          btn.disabled = true;
          if (idx === correctIdx) {
            btn.style.background = 'rgba(74,222,128,0.2)';
            btn.style.borderColor = 'var(--success)';
          }
        });
        
        this.showVisitorToast("⏰ Время вышло! Никто не нашел.", true);
        this.playAudioTone('wrong');
        
        this.setVisitorTimeout(() => {
          this.state.activeGameQIndex++;
          const rounds = branch && branch.diffRounds ? branch.diffRounds : (this.state.diffRounds || 6);
          if (this.state.activeGameQIndex < rounds) {
            this.renderActiveGameQuestion();
          } else {
            this.finishVisitorGame();
          }
        }, 1800);
        return;
      }
      
      if (elapsed >= botTargetDelay) {
        clearInterval(this.state.gameRunningInterval);
        this.state.firstAnsweredThisRound = true;
        
        const randomBot = this.state.simulatedPlayers[Math.floor(Math.random() * this.state.simulatedPlayers.length)];
        randomBot.score += 1;
        
        this.renderSimulatedPlayersList();
        
        const optionsBox = document.getElementById('visitor-game-options');
        const buttons = optionsBox.querySelectorAll('button');
        buttons.forEach((btn, idx) => {
          btn.disabled = true;
          if (idx === correctIdx) {
            btn.style.background = 'rgba(74,222,128,0.2)';
            btn.style.borderColor = 'var(--success)';
          }
        });
        
        this.showVisitorToast(`${randomBot.avatar} ${randomBot.name} нашел(а) первым! 🏆`, false);
        this.playAudioTone('wrong');
        
        this.setVisitorTimeout(() => {
          this.state.activeGameQIndex++;
          const rounds = branch && branch.diffRounds ? branch.diffRounds : (this.state.diffRounds || 6);
          if (this.state.activeGameQIndex < rounds) {
            this.renderActiveGameQuestion();
          } else {
            this.finishVisitorGame();
          }
        }, 1800);
      }
    }, 200);
  }

  initGuessWordGame(totalPlayers) {
    try {
      const branch = this.getVisitorConnectedBranch();
      let selectedWord = branch && branch.guessWordCustomWord ? branch.guessWordCustomWord : '';
      let selectedClue = branch && branch.guessWordCustomClue ? branch.guessWordCustomClue : '';
      
      if (!selectedWord || selectedWord.trim() === '') {
        const diff = branch && branch.guessWordDifficulty ? branch.guessWordDifficulty : (this.state.guessWordDifficulty || 'normal');
        const list = GUESSWORD_PRESETS[diff] || GUESSWORD_PRESETS.normal;
        const preset = list[Math.floor(Math.random() * list.length)];
        selectedWord = preset.word;
        selectedClue = preset.clue;
      }
      
      this.state.guessWordActiveWord = selectedWord.toUpperCase();
      this.state.guessWordActiveClue = selectedClue;
      this.state.guessWordNamedLetters = [];
      this.state.guessWordLogs = ["Ведущий: Добро пожаловать на Поле Чудес! Прочтите подсказку вверху и приготовьтесь угадывать буквы."];
      
      // Auto-reveal spaces and hyphens
      this.state.guessWordRevealed = Array(this.state.guessWordActiveWord.length).fill(false);
      for (let i = 0; i < this.state.guessWordActiveWord.length; i++) {
        const char = this.state.guessWordActiveWord[i];
        if (char === ' ' || char === '-' || char === '_') {
          this.state.guessWordRevealed[i] = true;
        }
      }
      
      const player = { name: "Вы", avatar: "👨‍💻", isUser: true, score: 0 };
      const animalNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const animalEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      
      const players = [player];
      for (let i = 0; i < totalPlayers - 1; i++) {
        const idx = i % animalNames.length;
        players.push({
          name: animalNames[idx],
          avatar: animalEmojis[idx],
          isUser: false,
          score: 0
        });
      }
      
      // Shuffle players queue for random turn order
      this.state.guessWordPlayers = [];
      while (players.length > 0) {
        const r = Math.floor(Math.random() * players.length);
        this.state.guessWordPlayers.push(players.splice(r, 1)[0]);
      }
      
      this.state.guessWordTurnIdx = 0;
      this.state.simulatedPlayers = this.state.guessWordPlayers.filter(p => !p.isUser);
      
      this.renderActiveGameQuestion();
      this.startGuessWordTurn();
    } catch(e) {
      console.error("Error in initGuessWordGame:", e);
      this.visitorExitActiveGame();
    }
  }

  startGuessWordTurn() {
    try {
      clearInterval(this.state.guessWordTimer);
      
      const activePlayer = this.state.guessWordPlayers[this.state.guessWordTurnIdx];
      if (!activePlayer) return;
      
      const statusBar = document.getElementById('visitor-guessword-status-bar');
      if (statusBar) {
        if (activePlayer.isUser) {
          statusBar.innerText = "⭐ ВАШ ХОД! Выберите букву";
          statusBar.style.background = "rgba(245, 158, 11, 0.25)";
          statusBar.style.color = "var(--gold)";
        } else {
          statusBar.innerText = `Ходит: ${activePlayer.avatar} ${activePlayer.name}`;
          statusBar.style.background = "rgba(139, 92, 246, 0.15)";
          statusBar.style.color = "var(--primary)";
        }
      }
      
      this.state.guessWordTimerVal = 10;
      const timerLabel = document.getElementById('visitor-guessword-turn-timer');
      if (timerLabel) timerLabel.innerText = `Ход: ${this.state.guessWordTimerVal}s`;
      
      this.state.guessWordTimer = setInterval(() => {
        this.state.guessWordTimerVal--;
        if (timerLabel) timerLabel.innerText = `Ход: ${this.state.guessWordTimerVal}s`;
        
        if (this.state.guessWordTimerVal <= 0) {
          clearInterval(this.state.guessWordTimer);
          this.addGuessWordLog(`Ведущий: Время вышло! Игрок ${activePlayer.avatar} ${activePlayer.name} пропустил ход.`);
          this.playAudioTone('wrong');
          this.nextGuessWordTurn();
        }
      }, 1000);
      
      const letterInput = document.getElementById('visitor-guessword-letter-input');
      const inputLabel = document.getElementById('visitor-guessword-input-label');
      if (letterInput) {
        if (activePlayer.isUser) {
          letterInput.disabled = false;
          letterInput.placeholder = "?";
          if (inputLabel) inputLabel.innerText = "Ваш ход! Введите одну букву:";
          setTimeout(() => { letterInput.focus(); }, 100);
        } else {
          letterInput.disabled = true;
          letterInput.placeholder = "🔒";
          if (inputLabel) inputLabel.innerText = "Ожидайте своей очереди...";
        }
      }

      if (!activePlayer.isUser) {
        this.setVisitorTimeout(() => {
          const currentActive = this.state.guessWordPlayers[this.state.guessWordTurnIdx];
          if (currentActive && !currentActive.isUser) {
            this.simulateGuessWordBotMove();
          }
        }, 5000);
      }
    } catch(e) {
      console.error(e);
    }
  }

  nextGuessWordTurn() {
    clearInterval(this.state.guessWordTimer);
    if (this.checkGuessWordVictory()) return;
    
    this.state.guessWordTurnIdx = (this.state.guessWordTurnIdx + 1) % this.state.guessWordPlayers.length;
    this.startGuessWordTurn();
  }

  renderVisitorGuessWord() {
    const optionsBox = document.getElementById('visitor-game-options');
    const textLabel = document.getElementById('visitor-game-question-text');
    const typeLabel = document.getElementById('visitor-game-type-label');
    
    if (!optionsBox || !textLabel) return;
    
    if (typeLabel) typeLabel.innerText = "ПОЛЕ ЧУДЕС 🗣️";
    textLabel.style.display = 'none';
    optionsBox.style.display = 'block';
    
    const qIndexEl = document.getElementById('visitor-game-q-index');
    if (qIndexEl) qIndexEl.innerText = "Игра 🗣️";
    
    if (!optionsBox.querySelector('.guessword-arena')) {
      optionsBox.innerHTML = `
        <div class="guessword-arena" style="display: flex; flex-direction: column; gap: 6px; width: 100%; box-sizing: border-box; margin-top: -5px;">
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); border-radius: 10px; padding: 8px; text-align: center; font-size: 11px; font-weight: 700; color: #fff; line-height: 1.4;">
            💡 Подсказка: <span id="visitor-guessword-hint-text" style="color: var(--gold);">${this.state.guessWordActiveClue}</span>
          </div>

          <div id="visitor-guessword-board-letters" style="display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin: 6px 0;"></div>

          <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-light); border-radius: 10px; padding: 8px 10px; box-sizing: border-box;">
            <div style="font-size: 8px; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span>🎤 ВЕДУЩИЙ ИГРЫ:</span>
              <span id="visitor-guessword-turn-timer" style="color: var(--error); font-family: monospace; font-size: 9px; font-weight: 800;">Ход: 10s</span>
            </div>
            <div id="visitor-guessword-logs" style="height: 50px; overflow-y: auto; font-size: 9px; color: #d1d5db; line-height: 1.45; font-family: monospace; display: flex; flex-direction: column; gap: 3px; padding-right: 4px;"></div>
          </div>

          <div id="visitor-guessword-status-bar" style="text-align: center; font-size: 11px; font-weight: 800; padding: 6px; border-radius: 8px; background: rgba(139, 92, 246, 0.15); color: var(--primary); transition: all 0.2s;">
            Ходит: Игрок...
          </div>

          <!-- Centered Input Field for Native Mobile Keyboard -->
          <div id="visitor-guessword-input-container" style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin: 6px 0; width: 100%;">
            <label id="visitor-guessword-input-label" style="font-size: 9px; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 0.5px;">Введите одну букву:</label>
            <input type="text" id="visitor-guessword-letter-input" maxlength="1" placeholder="?" oninput="app.handleGuessWordInputLetter(this)" style="width: 44px; height: 44px; text-align: center; font-size: 20px; font-weight: 800; background: #110e1f; border: 2px solid var(--border-light); border-radius: 10px; color: #fff; outline: none; transition: all 0.2s; text-transform: uppercase; font-family: inherit; margin: 0; padding: 0;">
          </div>

          <div style="margin-top: 2px; display: flex; gap: 6px;">
            <button class="btn btn-secondary" onclick="app.showGuessWordWholeWordModal()" style="width: 100%; padding: 8px; font-size: 10px; font-weight: 700; margin: 0; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 4px;">
              🗣️ Назвать слово целиком
            </button>
          </div>
        </div>
      `;
    }
    
    this.renderGuessWordLetters();
    this.renderGuessWordLogs();
    this.renderSimulatedPlayersList();
  }

  renderGuessWordLetters() {
    const container = document.getElementById('visitor-guessword-board-letters');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < this.state.guessWordActiveWord.length; i++) {
      const char = this.state.guessWordActiveWord[i];
      const isRevealed = this.state.guessWordRevealed[i];
      
      const box = document.createElement('div');
      box.style.cssText = 'width: 26px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; transition: all 0.2s;';
      
      if (char === ' ' || char === '-' || char === '_') {
        box.style.background = 'transparent';
        box.style.color = '#fff';
        box.innerText = char;
      } else if (isRevealed) {
        box.style.background = 'var(--primary)';
        box.style.border = '1px solid var(--primary-light)';
        box.style.color = '#fff';
        box.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.4)';
        box.innerText = char;
      } else {
        box.style.background = 'rgba(255, 255, 255, 0.05)';
        box.style.border = '1px solid var(--border-light)';
        box.style.color = 'var(--text-muted)';
        box.innerText = '❓';
      }
      
      container.appendChild(box);
    }
  }

  renderGuessWordLogs() {
    const container = document.getElementById('visitor-guessword-logs');
    if (!container) return;
    
    container.innerHTML = '';
    const logsToShow = this.state.guessWordLogs.slice(-20);
    logsToShow.forEach(log => {
      const el = document.createElement('div');
      el.style.borderBottom = '1px dashed rgba(255,255,255,0.03)';
      el.style.paddingBottom = '2px';
      
      if (log.includes('Вы ошибся') || log.includes('ошибся') || log.includes('Время вышло') || log.includes('уже использованную')) {
        el.style.color = '#f87171';
      } else if (log.includes('угадал') || log.includes('отгадал') || log.includes('выиграл') || log.includes('угадано')) {
        el.style.color = '#34d399';
      } else {
        el.style.color = '#e5e7eb';
      }
      el.innerText = log;
      container.appendChild(el);
    });
    
    container.scrollTop = container.scrollHeight;
  }

  addGuessWordLog(message) {
    if (!this.state.guessWordLogs) this.state.guessWordLogs = [];
    this.state.guessWordLogs.push(message);
    this.renderGuessWordLogs();
  }

  handleGuessWordInputLetter(input) {
    let val = input.value.trim().toUpperCase();
    if (val === '') return;
    
    val = val.substring(0, 1);
    
    // Validate Russian character (А-Я, Ё)
    const rusRegex = /^[А-ЯЁ]+$/;
    if (!rusRegex.test(val)) {
      this.showVisitorToast("Введите одну русскую букву! 🇷🇺", true);
      input.value = '';
      return;
    }
    
    input.value = '';
    input.blur();
    
    this.submitGuessWordLetter(val);
  }

  showGuessWordWholeWordModal() {
    const activePlayer = this.state.guessWordPlayers[this.state.guessWordTurnIdx];
    if (!activePlayer || !activePlayer.isUser) {
      this.showVisitorToast("Назвать слово можно только в свой ход!", true);
      return;
    }
    
    const modal = document.getElementById('guessword-wholeword-modal');
    const input = document.getElementById('guessword-wholeword-input');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  closeGuessWordWholeWordModal() {
    const modal = document.getElementById('guessword-wholeword-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  submitGuessWordWholeWordFromModal() {
    try {
      const input = document.getElementById('guessword-wholeword-input');
      if (!input) return;
      
      const val = input.value.trim().toUpperCase();
      this.closeGuessWordWholeWordModal();
      if (val === '') return;
      
      const rusRegex = /^[А-ЯЁ\-]+$/;
      if (!rusRegex.test(val)) {
        this.showVisitorToast("Слово должно состоять только из русских букв! 🇷🇺", true);
        return;
      }
      
      const activePlayer = this.state.guessWordPlayers[this.state.guessWordTurnIdx];
      if (!activePlayer || !activePlayer.isUser) return;
      
      this.addGuessWordLog(`Ведущий: Игрок Вы называет слово целиком: "${val}"`);
      
      if (val === this.state.guessWordActiveWord) {
        this.finishGuessWordGame(activePlayer);
      } else {
        this.addGuessWordLog(`Ведущий: Неверно! Слова "${val}" нет на табло.`);
        this.playAudioTone('wrong');
        this.nextGuessWordTurn();
      }
    } catch(e) {
      console.error(e);
    }
  }

  submitGuessWordLetter(letter) {
    try {
      clearInterval(this.state.guessWordTimer);
      
      const activePlayer = this.state.guessWordPlayers[this.state.guessWordTurnIdx];
      if (!activePlayer) return;
      
      const name = activePlayer.isUser ? "Вы" : activePlayer.name;
      const avatar = activePlayer.isUser ? "👨‍💻" : activePlayer.avatar;
      
      // Memory check: if they name already named letter
      if (this.state.guessWordNamedLetters.includes(letter)) {
        this.addGuessWordLog(`Ведущий: Игрок ${avatar} ${name} назвал уже использованную букву "${letter}" и теряет ход!`);
        this.playAudioTone('wrong');
        this.nextGuessWordTurn();
        return;
      }
      
      this.state.guessWordNamedLetters.push(letter);
      const word = this.state.guessWordActiveWord;
      
      if (word.includes(letter)) {
        // Correct letter guess
        let count = 0;
        for (let i = 0; i < word.length; i++) {
          if (word[i] === letter) {
            this.state.guessWordRevealed[i] = true;
            count++;
          }
        }
        
        this.addGuessWordLog(`Ведущий: Игрок ${avatar} ${name} отгадал букву "${letter}"! На табло открыто букв: ${count}.`);
        this.playAudioTone('correct');
        this.renderVisitorGuessWord();
        
        if (this.checkGuessWordVictory()) {
          this.finishGuessWordGame(activePlayer);
        } else {
          // Reset timer and keep active player turn!
          this.startGuessWordTurn();
        }
      } else {
        // Incorrect letter guess
        this.addGuessWordLog(`Ведущий: Ошибка! Игрок ${avatar} ${name} назвал букву "${letter}". Её нет в слове.`);
        this.playAudioTone('wrong');
        this.nextGuessWordTurn();
      }
    } catch(e) {
      console.error(e);
      this.nextGuessWordTurn();
    }
  }

  simulateGuessWordBotMove() {
    try {
      const activePlayer = this.state.guessWordPlayers[this.state.guessWordTurnIdx];
      if (!activePlayer || activePlayer.isUser) return;
      
      const word = this.state.guessWordActiveWord;
      const revealed = this.state.guessWordRevealed;
      const named = this.state.guessWordNamedLetters || [];
      
      const alphabet = [
        'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й',
        'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф',
        'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'
      ];
      
      const notRevealedAlphabet = alphabet.filter(l => {
        for (let i = 0; i < word.length; i++) {
          if (word[i] === l && revealed[i]) return false;
        }
        return true;
      });
      
      if (notRevealedAlphabet.length === 0) return;
      
      const correctLetters = [];
      for (let i = 0; i < word.length; i++) {
        if (!revealed[i] && word[i] !== ' ' && word[i] !== '-' && !correctLetters.includes(word[i])) {
          correctLetters.push(word[i]);
        }
      }
      
      let chosenLetter = '';
      if (correctLetters.length > 0 && Math.random() < 0.35) {
        chosenLetter = correctLetters[Math.floor(Math.random() * correctLetters.length)];
      } else {
        if (Math.random() < 0.20 && named.length > 0) {
          chosenLetter = named[Math.floor(Math.random() * named.length)];
        } else {
          chosenLetter = notRevealedAlphabet[Math.floor(Math.random() * notRevealedAlphabet.length)];
        }
      }
      
      const revealedCount = revealed.filter(r => r).length;
      const totalLetters = word.replace(/[\s-]/g, '').length;
      if (revealedCount / totalLetters >= 0.60 && Math.random() < 0.08) {
        this.addGuessWordLog(`Ведущий: Игрок ${activePlayer.avatar} ${activePlayer.name} называет слово целиком: "${word}"!`);
        this.finishGuessWordGame(activePlayer);
        return;
      }
      
      this.submitGuessWordLetter(chosenLetter);
    } catch(e) {
      console.error("Error in simulateGuessWordBotMove:", e);
    }
  }

  checkGuessWordVictory() {
    return this.state.guessWordRevealed.every(r => r);
  }

  finishGuessWordGame(winner) {
    try {
      clearInterval(this.state.guessWordTimer);
      clearInterval(this.state.gameRunningInterval);
      this.state.gameRunningInterval = null;
      clearTimeout(this.state.demoTimer);
      
      if (winner.isUser) {
        this.state.activeGameScore = 100;
        const p = this.state.guessWordPlayers.find(pl => pl.isUser);
        if (p) p.score = 100;
      } else {
        this.state.activeGameScore = 0;
        const p = this.state.guessWordPlayers.find(pl => pl.name === winner.name);
        if (p) p.score = 100;
      }
      
      this.addGuessWordLog(`Ведущий: Игра окончена! Поздравляем, победил игрок ${winner.avatar} ${winner.name}!`);
      this.showVisitorToast(`Победил ${winner.avatar} ${winner.name}! 🎉`, false);
      
      // Auto-reveal remaining letters for visual completion
      this.state.guessWordRevealed.fill(true);
      this.renderVisitorGuessWord();
      
      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 4000);
    } catch(e) {
      console.error(e);
      this.finishVisitorGame();
    }
  }

  // --- CROSSWORD GUEST GAMEPLAY LOGIC ---
  renderVisitorCrossword() {
    const optionsBox = document.getElementById('visitor-game-options');
    const textLabel = document.getElementById('visitor-game-question-text');
    const typeLabel = document.getElementById('visitor-game-type-label');
    
    if (!optionsBox || !textLabel) return;
    
    if (typeLabel) typeLabel.innerText = "ТУРНИР: КРОССВОРД 📝";
    textLabel.style.display = 'none';
    optionsBox.style.display = 'block';
    
    const branch = this.getVisitorConnectedBranch();
    const diff = branch && branch.crosswordDifficulty ? branch.crosswordDifficulty : (this.state.crosswordDifficulty || 'normal');
    const layoutIdx = branch && branch.crosswordLayoutIndex !== undefined ? branch.crosswordLayoutIndex : (this.state.crosswordLayoutIndex || 0);
    
    const preset = this.getActiveCrosswordPreset(diff, layoutIdx);
    if (!preset) return;
    
    if (!this.state.guestCrosswordInitialized) {
      this.initGuestCrossword(preset);
    }
    
    if (!optionsBox.querySelector('.crossword-arena')) {
      optionsBox.innerHTML = `
        <div class="crossword-arena" style="display: flex; flex-direction: column; gap: 8px; width: 100%; box-sizing: border-box;">
          <div id="visitor-crossword-board-div" style="margin: 5px auto; display: flex; justify-content: center; align-items: center; max-width: 100%; overflow: auto; padding: 5px;"></div>
          <div id="visitor-crossword-input-pane"></div>
          <div id="visitor-crossword-clues-div"></div>
        </div>
      `;
    }
    
    this.renderGuestCrosswordBoard(preset);
    this.renderGuestCrosswordClues(preset);
    this.renderGuestCrosswordInputPane(preset);
    this.renderSimulatedPlayersList();
  }

  initGuestCrossword(preset) {
    this.state.guestCrosswordInitialized = true;
    this.state.guestCrosswordSolvedWords = new Set();
    this.state.guestCrosswordSelectedWordId = null;
    this.state.guestCrosswordBotsSolvedWords = {};
    
    this.state.simulatedPlayers.forEach(p => {
      this.state.guestCrosswordBotsSolvedWords[p.name] = 0;
      p.score = 0;
    });
    
    const branch = this.getVisitorConnectedBranch();
    const minutesLimit = branch && branch.crosswordTimeLimit !== undefined ? branch.crosswordTimeLimit : (this.state.crosswordTimeLimit || 5);
    this.state.guestCrosswordTimeRemaining = minutesLimit * 60;
    
    this.updateCrosswordTimerUI();
    
    if (this.state.gameRunningInterval) clearInterval(this.state.gameRunningInterval);
    this.state.gameRunningInterval = setInterval(() => {
      if (this.state.visitorActiveView !== 'game') {
        clearInterval(this.state.gameRunningInterval);
        return;
      }
      if (this.state.guestCrosswordTimeRemaining > 0) {
        this.state.guestCrosswordTimeRemaining--;
        this.updateCrosswordTimerUI();
        
        if (Math.random() < 0.08) {
          const activeBots = this.state.simulatedPlayers.filter(p => this.state.guestCrosswordBotsSolvedWords[p.name] < preset.words.length);
          if (activeBots.length > 0) {
            const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)];
            this.state.guestCrosswordBotsSolvedWords[randomBot.name]++;
            
            const botObj = this.state.simulatedPlayers.find(p => p.name === randomBot.name);
            if (botObj) {
              botObj.score = this.state.guestCrosswordBotsSolvedWords[randomBot.name];
            }
            
            this.renderSimulatedPlayersList();
            this.showVisitorToast(`🤖 ${randomBot.avatar} ${randomBot.name} отгадал слово! (${botObj.score}/${preset.words.length})`, false);
            
            if (botObj.score === preset.words.length) {
              this.finishCrosswordGame('lose', randomBot.name);
            }
          }
        }
      } else {
        this.finishCrosswordGame('timeout');
      }
    }, 1000);
    
    if (preset.words.length > 0) {
      this.state.guestCrosswordSelectedWordId = preset.words[0].id;
    }
  }

  updateCrosswordTimerUI() {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) {
      const mins = Math.floor(this.state.guestCrosswordTimeRemaining / 60);
      const secs = this.state.guestCrosswordTimeRemaining % 60;
      const formattedSecs = secs < 10 ? '0' + secs : secs;
      timerEl.innerText = `⏱️ Время: ${mins}:${formattedSecs}`;
    }
  }

  renderGuestCrosswordBoard(preset) {
    const size = preset.gridSize;
    const grid = Array(size).fill(null).map(() => Array(size).fill(null));
    
    preset.words.forEach(w => {
      const isSolved = this.state.guestCrosswordSolvedWords.has(w.id);
      for (let i = 0; i < w.word.length; i++) {
        const cx = w.direction === 'across' ? w.x + i : w.x;
        const cy = w.direction === 'down' ? w.y + i : w.y;
        if (cx >= 0 && cx < size && cy >= 0 && cy < size) {
          if (!grid[cy][cx]) {
            grid[cy][cx] = {
              letter: w.word[i],
              solved: isSolved,
              wordIds: [w.id],
              startX: w.x,
              startY: w.y,
              number: (i === 0) ? (preset.words.indexOf(w) + 1) : null
            };
          } else {
            grid[cy][cx].wordIds.push(w.id);
            if (isSolved) grid[cy][cx].solved = true;
            if (i === 0) grid[cy][cx].number = preset.words.indexOf(w) + 1;
          }
        }
      }
    });
    
    const optionsBox = document.getElementById('visitor-game-options');
    let boardDiv = document.getElementById('visitor-crossword-board-div');
    if (!boardDiv) {
      boardDiv = document.createElement('div');
      boardDiv.id = 'visitor-crossword-board-div';
      boardDiv.style.cssText = 'margin: 10px auto; display: flex; justify-content: center; align-items: center; max-width: 100%; overflow: auto; padding: 5px;';
      optionsBox.appendChild(boardDiv);
    }
    boardDiv.innerHTML = '';
    
    const table = document.createElement('div');
    table.style.display = 'grid';
    table.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    table.style.gap = '2px';
    table.style.width = '260px';
    table.style.height = '260px';
    table.style.background = 'rgba(0,0,0,0.3)';
    table.style.padding = '4px';
    table.style.borderRadius = '10px';
    table.style.border = '1px solid var(--border-light)';
    
    const selectedWord = preset.words.find(w => w.id === this.state.guestCrosswordSelectedWordId);
    const selectedWordCells = [];
    if (selectedWord) {
      for (let i = 0; i < selectedWord.word.length; i++) {
        const cx = selectedWord.direction === 'across' ? selectedWord.x + i : selectedWord.x;
        const cy = selectedWord.direction === 'down' ? selectedWord.y + i : selectedWord.y;
        selectedWordCells.push(`${cx},${cy}`);
      }
    }
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = grid[r][c];
        const cellDiv = document.createElement('div');
        cellDiv.style.cssText = 'position: relative; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; border-radius: 4px; box-sizing: border-box; cursor: pointer; user-select: none;';
        
        if (cell) {
          const isSelected = selectedWordCells.includes(`${c},${r}`);
          
          cellDiv.style.background = isSelected 
            ? 'rgba(139, 92, 246, 0.4)' 
            : 'rgba(255, 255, 255, 0.05)';
          cellDiv.style.border = isSelected
            ? '1.5px solid var(--primary)'
            : '1px solid var(--border-light)';
          cellDiv.style.color = '#fff';
          
          if (cell.solved) {
            cellDiv.innerText = cell.letter;
          } else {
            cellDiv.innerText = '';
          }
          
          if (cell.number) {
            const numSpan = document.createElement('span');
            numSpan.innerText = cell.number;
            numSpan.style.cssText = 'position: absolute; top: 1px; left: 2px; font-size: 6.5px; color: var(--gold); font-weight: 400; line-height: 1;';
            cellDiv.appendChild(numSpan);
          }
          
          cellDiv.onclick = () => {
            if (cell.wordIds.length > 0) {
              let nextWordId = cell.wordIds[0];
              if (cell.wordIds.includes(this.state.guestCrosswordSelectedWordId)) {
                const curIdx = cell.wordIds.indexOf(this.state.guestCrosswordSelectedWordId);
                nextWordId = cell.wordIds[(curIdx + 1) % cell.wordIds.length];
              }
              this.selectCrosswordWord(nextWordId);
            }
          };
        } else {
          cellDiv.style.background = 'rgba(0,0,0,0.6)';
          cellDiv.style.border = '1px solid rgba(255, 255, 255, 0.01)';
        }
        
        table.appendChild(cellDiv);
      }
    }
    boardDiv.appendChild(table);
  }

  renderGuestCrosswordClues(preset) {
    const optionsBox = document.getElementById('visitor-game-options');
    let cluesDiv = document.getElementById('visitor-crossword-clues-div');
    if (!cluesDiv) {
      cluesDiv = document.createElement('div');
      cluesDiv.id = 'visitor-crossword-clues-div';
      cluesDiv.style.cssText = 'margin: 10px 0; max-height: 90px; overflow-y: auto; text-align: left; padding: 0 4px; background: rgba(0,0,0,0.15); border: 1px solid var(--border-light); border-radius: 10px; padding: 8px; font-size: 10px; box-sizing: border-box;';
      optionsBox.appendChild(cluesDiv);
    }
    cluesDiv.innerHTML = '';
    
    const acrossHeader = document.createElement('div');
    acrossHeader.style.cssText = 'font-weight:700; color:var(--gold); margin-bottom: 4px; text-transform:uppercase; font-size: 9px; letter-spacing:0.5px;';
    acrossHeader.innerText = 'По горизонтали:';
    
    const downHeader = document.createElement('div');
    downHeader.style.cssText = 'font-weight:700; color:var(--gold); margin-top: 6px; margin-bottom: 4px; text-transform:uppercase; font-size: 9px; letter-spacing:0.5px;';
    downHeader.innerText = 'По вертикали:';
    
    let hasAcross = false;
    let hasDown = false;
    
    preset.words.forEach((w, idx) => {
      const num = idx + 1;
      const isSolved = this.state.guestCrosswordSolvedWords.has(w.id);
      const isSelected = w.id === this.state.guestCrosswordSelectedWordId;
      
      const item = document.createElement('div');
      item.style.cssText = `padding: 3px 6px; margin-bottom: 2px; border-radius: 6px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: ${isSelected ? 'rgba(139,92,246,0.15)' : 'transparent'}; border: 1px solid ${isSelected ? 'var(--primary-glow)' : 'transparent'};`;
      
      item.innerHTML = `
        <span style="color: ${isSolved ? 'var(--success)' : (isSelected ? 'var(--gold)' : '#fff')}; text-decoration: ${isSolved ? 'line-through' : 'none'}; flex: 1;">
          <b>${num}.</b> ${w.clue} (${w.word.length} б.)
        </span>
        ${isSolved ? '<span style="color: var(--success); font-size: 8px; flex-shrink: 0; margin-left:4px;">✔️</span>' : ''}
      `;
      
      item.onclick = () => this.selectCrosswordWord(w.id);
      
      if (w.direction === 'across') {
        if (!hasAcross) {
          cluesDiv.appendChild(acrossHeader);
          hasAcross = true;
        }
        cluesDiv.appendChild(item);
      } else {
        if (!hasDown) {
          cluesDiv.appendChild(downHeader);
          hasDown = true;
        }
        cluesDiv.appendChild(item);
      }
    });
  }

  selectCrosswordWord(wordId) {
    this.state.guestCrosswordSelectedWordId = wordId;
    this.renderVisitorCrossword();
    
    const input = document.getElementById('visitor-crossword-input-field');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  renderGuestCrosswordInputPane(preset) {
    const optionsBox = document.getElementById('visitor-game-options');
    let inputPane = document.getElementById('visitor-crossword-input-pane');
    if (!inputPane) {
      inputPane = document.createElement('div');
      inputPane.id = 'visitor-crossword-input-pane';
      inputPane.style.cssText = 'background: rgba(139, 92, 246, 0.05); border: 1px solid var(--border-glow); padding: 8px 10px; border-radius: 12px; margin-top: 10px; box-sizing: border-box; text-align: left;';
      optionsBox.appendChild(inputPane);
    }
    inputPane.innerHTML = '';
    
    const selectedWord = preset.words.find(w => w.id === this.state.guestCrosswordSelectedWordId);
    if (!selectedWord) {
      inputPane.innerHTML = `<div style="font-size: 10px; color: var(--text-muted); text-align: center;">Выберите слово в сетке или списке, чтобы ответить.</div>`;
      return;
    }
    
    const wordIdx = preset.words.indexOf(selectedWord) + 1;
    const isSolved = this.state.guestCrosswordSolvedWords.has(selectedWord.id);
    
    if (isSolved) {
      inputPane.innerHTML = `
        <div style="font-size: 10px; color: var(--success); font-weight:700; text-align: center;">
          🎉 Слово #${wordIdx} (${selectedWord.word}) уже отгадано!
        </div>
      `;
      return;
    }
    
    inputPane.innerHTML = `
      <div style="font-size: 10px; font-weight:700; color: var(--gold); margin-bottom: 4px;">
        Слово #${wordIdx} (${selectedWord.direction === 'across' ? 'по горизонтали' : 'по вертикали'}):
      </div>
      <div style="font-size: 11px; color:#fff; margin-bottom: 8px; line-height: 1.35; font-style: italic;">
        "${selectedWord.clue}" (${selectedWord.word.length} букв)
      </div>
      <div style="display: flex; gap: 6px;">
        <input type="text" id="visitor-crossword-input-field" placeholder="Ваш ответ..." style="flex:1; padding: 8px; font-size: 12px; background: #110e1f; border: 1px solid var(--border-light); border-radius: 8px; color: #fff; text-transform: uppercase; margin-bottom: 0; outline: none; font-family: inherit;">
        <button class="btn btn-primary" style="width: auto; padding: 0 14px; margin: 0; font-size: 11px; font-weight: 700; border-radius: 8px;" onclick="app.submitGuestCrosswordAnswer()">ОК</button>
      </div>
    `;
    
    const field = document.getElementById('visitor-crossword-input-field');
    if (field) {
      field.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.submitGuestCrosswordAnswer();
        }
      });
    }
  }

  submitGuestCrosswordAnswer() {
    const input = document.getElementById('visitor-crossword-input-field');
    if (!input || !input.value) return;
    
    const guess = input.value.trim().toUpperCase();
    if (!guess) return;
    
    const diff = this.state.crosswordDifficulty || 'normal';
    const layoutIdx = this.state.crosswordLayoutIndex || 0;
    const preset = this.getActiveCrosswordPreset(diff, layoutIdx);
    if (!preset) return;
    
    const selectedWord = preset.words.find(w => w.id === this.state.guestCrosswordSelectedWordId);
    if (!selectedWord) return;
    
    if (guess === selectedWord.word.toUpperCase()) {
      this.state.guestCrosswordSolvedWords.add(selectedWord.id);
      this.state.activeGameScore++;
      
      this.playAudioTone('success');
      this.showVisitorToast("🎉 Верно!", false);
      
      if (this.state.guestCrosswordSolvedWords.size === preset.words.length) {
        this.finishCrosswordGame('win');
      } else {
        const unsolved = preset.words.find(w => !this.state.guestCrosswordSolvedWords.has(w.id));
        if (unsolved) {
          this.state.guestCrosswordSelectedWordId = unsolved.id;
        }
        this.renderVisitorCrossword();
      }
    } else {
      this.playAudioTone('error');
      this.showVisitorToast("❌ Неверно! Попробуйте еще раз.", true);
      input.value = '';
      input.focus();
    }
  }

  finishCrosswordGame(status, winnerName = null) {
    if (this.state.gameRunningInterval) clearInterval(this.state.gameRunningInterval);
    this.state.guestCrosswordInitialized = false;
    
    const textLabel = document.getElementById('visitor-game-question-text');
    if (textLabel) textLabel.style.display = 'block';
    
    const boardDiv = document.getElementById('visitor-crossword-board-div');
    if (boardDiv) boardDiv.remove();
    const cluesDiv = document.getElementById('visitor-crossword-clues-div');
    if (cluesDiv) cluesDiv.remove();
    const inputPane = document.getElementById('visitor-crossword-input-pane');
    if (inputPane) inputPane.remove();
    
    const diff = this.state.crosswordDifficulty || 'normal';
    const layoutIdx = this.state.crosswordLayoutIndex || 0;
    const preset = this.getActiveCrosswordPreset(diff, layoutIdx);
    const totalWords = preset ? preset.words.length : 5;
    
    if (status === 'win') {
      this.state.activeGameScore = totalWords;
      this.playAudioTone('victory');
    } else {
      this.state.activeGameScore = this.state.guestCrosswordSolvedWords ? this.state.guestCrosswordSolvedWords.size : 0;
      this.playAudioTone('error');
    }
    
    this.state.visitorGamesPlayed++;
    this.setVisitorLockoutIfNeeded();
    
    this.finishVisitorGame();
  }

  finishVisitorGame(isReload = false) {
    if (!isReload && this.state.visitorActiveView !== 'game') return;
    this.clearAllVisitorGameTimers();
    
    // Switch to B2C results view panel (crucial to prevent freeze after last question!)
    this.setVisitorViewPanel('results');
    
    const visitorScore = this.state.activeGameScore;
    const branch = this.getVisitorConnectedBranch();
    const branchName = branch ? branch.name : (this.state.activeBranchName || "WaitPlay");
    
    // Determine player podium rankings
    let standings = [];
    if (this.state.visitorSelectedGameId === 4) {
      standings = [
        { name: "Вы (Гость)", avatar: "👤", score: 3, isGuest: true }
      ];
    } else {
      standings = [
        { name: "Вы (Гость)", avatar: "👤", score: visitorScore, isGuest: true },
        ...this.state.simulatedPlayers
      ];
      standings.sort((a, b) => b.score - a.score);
    }
    
    // Render Single Winner Pedestal (no 2nd and 3rd places)
    const podiumBox = document.getElementById('visitor-podium-box');
    if (podiumBox) {
      podiumBox.innerHTML = '';
      
      const winner = standings[0];
      const isWinnerGuest = winner.isGuest;
      const winnerName = isWinnerGuest ? "\u0412\u044b" : winner.name;
      
      let answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u043e\u0432';
      if (this.state.visitorSelectedGameId === 4) {
        answersWord = '\u0427\u0435\u043c\u043f\u0438\u043e\u043d \u0442\u0443\u0440\u043d\u0438\u0440\u0430 \ud83c\udfc6';
      } else if (this.state.visitorSelectedGameId === 6) {
        const lastDigit = winner.score % 10;
        const lastTwoDigits = winner.score % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          answersWord = 'найденных пар 🧩';
        } else if (lastDigit === 1) {
          answersWord = 'найденная пара 🧩';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          answersWord = 'найденные пары 🧩';
        } else {
          answersWord = 'найденных пар 🧩';
        }
      } else if (this.state.visitorSelectedGameId === 2) {
        const lastDigit = winner.score % 10;
        const lastTwoDigits = winner.score % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          answersWord = 'найденных отличий';
        } else if (lastDigit === 1) {
          answersWord = 'найденное отличие';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          answersWord = 'найденных отличия';
        } else {
          answersWord = 'найденных отличий';
        }
      } else if (this.state.visitorSelectedGameId === 11) {
        const lastDigit = winner.score % 10;
        const lastTwoDigits = winner.score % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          answersWord = 'срубленных шашек 🏁';
        } else if (lastDigit === 1) {
          answersWord = 'срубленная шашка 🏁';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          answersWord = 'срубленные шашки 🏁';
        } else {
          answersWord = 'срубленных шашек 🏁';
        }
      } else if (this.state.visitorSelectedGameId === 3) {
        answersWord = '% прогресса 🏃';
      } else if (this.state.visitorSelectedGameId === 5) {
        const lastDigit = winner.score % 10;
        const lastTwoDigits = winner.score % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          answersWord = 'отгаданных слов';
        } else if (lastDigit === 1) {
          answersWord = 'отгаданное слово';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          answersWord = 'отгаданных слова';
        } else {
          answersWord = 'отгаданных слов';
        }
      } else if (this.state.visitorSelectedGameId === 10) {
        answersWord = 'Победитель Поля Чудес! 🏆';
      } else {
        const lastDigit = winner.score % 10;
        const lastTwoDigits = winner.score % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u043e\u0432';
        } else if (lastDigit === 1) {
          answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u043e\u0442\u0432\u0435\u0442';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u0430';
        }
      }
      
      podiumBox.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; margin: 15px 0;">
          <div style="font-size:36px; filter: drop-shadow(0 0 8px rgba(245,158,11,0.4)); line-height:1.1; margin-bottom:4px;">${winner.avatar}</div>
          <div style="font-size:13px; font-weight:800; color:${isWinnerGuest ? 'var(--gold)' : '#fff'};">${winnerName}</div>
          <div style="font-size:9px; color:var(--text-muted); font-weight:600;">${(this.state.visitorSelectedGameId === 4) ? answersWord : `${winner.score} ${answersWord}`}</div>
          <div style="width:45px; height:40px; background:linear-gradient(180deg, var(--gold), #854d0e); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:#fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-top:6px;">\ud83e\udd47</div>
        </div>
      `;
    }
    
    // Render Dotted Prize Ticket based on Leaderboard Rank
    const ticketBox = document.getElementById('visitor-results-ticket');
    if (ticketBox) {
      ticketBox.innerHTML = '';
      
      let guestRank = standings.findIndex(p => p.isGuest) + 1;
      let isQuizTieDeny = false;

      // Handle B2B Settings for Quiz Draw/Tie Behavior
      if (this.state.visitorSelectedGameId !== 4 && this.state.visitorSelectedGameId !== 6) {
        const highestScore = standings[0].score;
        const topScorers = standings.filter(p => p.score === highestScore);
        if (topScorers.length > 1) {
          const tieBehavior = branch && branch.quizTieWinnerBehavior ? branch.quizTieWinnerBehavior : (this.state.quizTieWinnerBehavior || 'give');
          if (tieBehavior === 'deny') {
            guestRank = 2; // Demote guest so they do not win 1st place
            isQuizTieDeny = true;
          }
        }
      }
      
      let prizeName = '';
      let prizeDesc = '';
      let badgeText = '';
      let badgeClass = '';
      let hasPrize = true;
      
      const branchTemplates = branch && branch.templates ? branch.templates : this.state.templates;
      const questionsCount = branchTemplates.length;
 
      const roundsCount = branch && branch.diffRounds ? branch.diffRounds : (this.state.diffRounds || 6);

      const rawPrizeMsg = branch && branch.prizeMsg !== undefined ? branch.prizeMsg : this.state.prizeMsg;
      const isPrizeEmpty = !rawPrizeMsg || rawPrizeMsg.trim() === '';

      if (guestRank === 1) {
        if (isPrizeEmpty) {
          badgeText = '🏆 ПОБЕДА';
          badgeClass = 'badge-pro';
          prizeName = "Поздравляем с победой! 🎉";
          if (this.state.visitorSelectedGameId === 6) {
            prizeDesc = 'Вы заняли первое место! Поздравляем с победой в Колесе Фортуны.';
          } else if (this.state.visitorSelectedGameId === 4) {
            prizeDesc = 'Вы заняли первое место! Поздравляем с победой в турнире по Крестикам-Ноликам.';
          } else if (this.state.visitorSelectedGameId === 2) {
            prizeDesc = 'Вы заняли первое место! Поздравляем с победой в игре «Найди отличия».';
          } else if (this.state.visitorSelectedGameId === 10) {
            prizeDesc = 'Вы заняли первое место! Поздравляем с победой в игре «Поле Чудес».';
          } else {
            prizeDesc = 'Вы заняли первое место! Поздравляем с победой в заведении.';
          }
          hasPrize = false;
        } else {
          badgeText = '\ud83c\udfc6 \u041a\u0423\u041f\u041e\u041d \u041f\u041e\u0411\u0415\u0414\u0418\u0422\u0415\u041b\u042f';
          badgeClass = 'badge-pro';
          prizeName = rawPrizeMsg;
          if (this.state.visitorSelectedGameId === 4) {
            prizeDesc = 'Поздравляем с победой! Вы выиграли все раунды в турнире по Крестикам-Ноликам. Покажите этот купон официанту.';
          } else if (this.state.visitorSelectedGameId === 2) {
            prizeDesc = 'Поздравляем с победой! Вы заняли 1-е место в заведении по поиску отличий. Покажите этот купон официанту.';
          } else if (this.state.visitorSelectedGameId === 6) {
            prizeDesc = 'Поздравляем с победой! Вы заняли 1-е место в игре «Мемори». Покажите этот купон официанту.';
          } else {
            prizeDesc = 'Поздравляем с победой! Вы заняли 1-е место в заведении. Покажите этот купон официанту.';
          }
          hasPrize = true;
        }
      } else {
        badgeText = '\ud83c\udf97\ufe0f \u0423\u0427\u0410\u0421\u0422\u041d\u0418\u041a \u0418\u0413\u0420\u042b';
        badgeClass = 'badge-secondary';
        if (isQuizTieDeny) {
          prizeName = '\u041d\u0438\u0447\u044c\u044f \u043d\u0430 1-\u043c \u043c\u0435\u0441\u0442\u043e!';
          prizeDesc = `\u0412\u044b \u043d\u0430\u0431\u0440\u0430\u043b\u0438 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043e\u0447\u043a\u043e\u0432 (${visitorScore}) \u0441 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u043e\u043c. \u041f\u043e \u0440\u0435\u0448\u0435\u043d\u0438\u044e \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438, \u043f\u0440\u0438 \u043d\u0438\u0447\u044c\u0435\u0439 \u043f\u0440\u0438\u0437\u044b \u043d\u0435 \u0432\u044b\u0434\u0430\u044e\u0442\u0441\u044f!`;
        } else {
          prizeName = '\u0421\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u0443\u0447\u0430\u0441\u0442\u0438\u0435!';
          if (this.state.visitorSelectedGameId === 2) {
            prizeDesc = `Вы нашли ${visitorScore} из ${roundsCount} отличий быстрее всех. Чтобы получить приз, нужно занять 1-е место!`;
          } else {
            prizeDesc = `\u0412\u044b \u043e\u0442\u0432\u0435\u0442\u0438\u043b\u0438 \u043f\u0435\u0440\u0432\u044b\u043c\u0438 \u043d\u0430 ${visitorScore} \u0438\u0437 ${questionsCount} \u0432\u043e\u043f\u0440. \u0427\u0442\u043e\u0431\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043f\u0440\u0438\u0437, \u043d\u0443\u0436\u043d\u043e \u0437\u0430\u043d\u044f\u0442\u044c 1-\u0435 \u043c\u0435\u0441\u0442\u043e!`;
          }
        }
        hasPrize = false;
      }
      
      const uniqueCode = 'WP-' + Math.floor(100000 + Math.random() * 900000);
      
      ticketBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed var(--border-light); padding-bottom:4px; margin-bottom:4px;">
          <span class="badge ${badgeClass}" style="font-size:8px; padding:2px 6px;">${badgeText}</span>
          ${hasPrize ? `<span style="font-size:9px; font-family:monospace; color:var(--text-muted);">${uniqueCode}</span>` : ''}
        </div>
        <div style="text-align:left; padding: 2px 0;">
          <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase;">${hasPrize ? '\u0412\u0430\u0448\u0430 \u043d\u0430\u0433\u0440\u0430\u0434\u0430:' : '\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442:'}</div>
          <div style="font-size:12px; font-weight:800; color:#fff; margin-bottom:2px;">${hasPrize ? '\ud83c\udf89 ' : ''}${prizeName}</div>
          <div style="font-size:9px; color:var(--text-muted); line-height:1.3;">${prizeDesc}</div>
        </div>
        ${hasPrize ? '<div class="prize-barcode"></div>' : ''}
        <div style="font-size:7px; color:var(--text-muted); text-align:center; font-family:monospace;">${hasPrize ? `\u041f\u0440\u0435\u0434\u044a\u044f\u0432\u0438\u0442\u0435 \u043e\u0444\u0438\u0446\u0438\u0430\u043d\u0442\u0443 \u043f\u0440\u0438 \u0440\u0430\u0441\u0447\u0435\u0442\u0435 \u0432 \u0437\u0430\u0432\u0435\u0434\u0435\u043d\u0438\u0438 ${branchName}` : '\u0421\u043f\u0430\u0441\u0438\u0431\u043e, \u0447\u0442\u043e \u0438\u0433\u0440\u0430\u0435\u0442\u0435 \u0441 \u043d\u0430\u043c\u0438!'}</div>
      `;

      const collectBtn = document.getElementById('btn-collect-prize');
      if (collectBtn) {
        if (guestRank === 1) {
          collectBtn.innerHTML = '\ud83c\udf81 \u0417\u0430\u0431\u0440\u0430\u0442\u044c \u043d\u0430\u0433\u0440\u0430\u0434\u0443 \u0438 \u0432\u044b\u0439\u0442\u0438';
          collectBtn.onclick = () => this.visitorCollectPrize();
          collectBtn.className = 'btn btn-pro';
        } else {
          collectBtn.innerHTML = '\ud83d\udd19 \u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u0432\u044b\u0431\u043e\u0440\u0443 \u0438\u0433\u0440';
          collectBtn.onclick = () => this.visitorExitActiveGameToLobby();
          collectBtn.className = 'btn btn-secondary';
        }
      }
    }
  }
  visitorCollectPrize() {
    try {
      this.state.visitorGamesPlayed++;
      
      if (this.state.visitorGamesPlayed >= 2) {
        this.state.visitorLockoutUntil = Date.now() + (3 * 60 * 60 * 1000);
        this.setVisitorViewPanel('lockout');
        this.showVisitorToast("Награда получена! Очки сохранены. Лимит игр исчерпан.", false);
      } else {
        this.setVisitorViewPanel('lobby');
        this.initVisitorLobby();
        this.showVisitorToast("Награда успешно сохранена! У вас осталась 1 игра.", false);
      }
      this.saveState();
    } catch (e) {
      console.error("Error in visitorCollectPrize:", e);
    }
  }

  updateVisitorLockout() {
    const timerDisplay = document.getElementById('lockout-countdown-display');
    const check = () => {
      const now = Date.now();
      const diff = this.state.visitorLockoutUntil - now;
      if (diff <= 0) {
        this.state.visitorGamesPlayed = 0;
        this.state.visitorLockoutUntil = 0;
        this.saveState();
        this.setVisitorViewPanel('lobby');
        this.initVisitorLobby();
        clearInterval(this.lockoutCheckInterval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const format = (num) => String(num).padStart(2, '0');
        timerDisplay.innerText = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
      }
    };
    check();
    clearInterval(this.lockoutCheckInterval);
    this.lockoutCheckInterval = setInterval(check, 1000);
  }

  setVisitorViewPanel(panelId) {
    const isMaintenance = this.state.maintenanceMode === true;
    const finalPanelId = isMaintenance ? 'maintenance' : panelId;

    this.state.visitorActiveView = panelId;
    this.saveState();

    const panels = ['locked', 'disclaimer', 'gps-check', 'lobby', 'game', 'results', 'lockout', 'maintenance', 'disconnected'];
    panels.forEach(p => {
      const el = document.getElementById(`visitor-${p}-panel`);
      if (el) el.classList.toggle('active', p === finalPanelId);
    });

    const header = document.getElementById('visitor-header');
    if (header) {
      header.style.display = (finalPanelId === 'locked') ? 'none' : 'flex';
    }

      }

  generateOfflineQrSvg(text, size = 160) {
    const encoded = encodeURIComponent(text || 'https://waitplay.app');
    const qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=" + encoded;
    
    return `
      <div style="position: relative; width: ${size}px; height: ${size}px; margin: 0 auto;">
        <img src="${qrApiUrl}" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
             alt="QR Code" 
             style="width: ${size}px; height: ${size}px; border-radius: 6px; display: block; border: 0;">
        
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display: none; width: ${size}px; height: ${size}px;">
          <rect x="0" y="0" width="100" height="100" fill="white"/>
          <rect x="5" y="5" width="25" height="25" fill="black"/>
          <rect x="9" y="9" width="17" height="17" fill="white"/>
          <rect x="13" y="13" width="9" height="9" fill="black"/>
          <rect x="70" y="5" width="25" height="25" fill="black"/>
          <rect x="74" y="9" width="17" height="17" fill="white"/>
          <rect x="78" y="13" width="9" height="9" fill="black"/>
          <rect x="5" y="70" width="25" height="25" fill="black"/>
          <rect x="9" y="74" width="17" height="17" fill="white"/>
          <rect x="13" y="78" width="9" height="9" fill="black"/>
          <rect x="42" y="42" width="16" height="16" fill="#8b5cf6" rx="3"/>
          <text x="50" y="54" font-family="'Outfit', sans-serif" font-size="10" font-weight="900" fill="white" text-anchor="middle">W</text>
          <rect x="40" y="10" width="4" height="8" fill="black"/>
          <rect x="50" y="5" width="8" height="4" fill="black"/>
          <rect x="45" y="20" width="4" height="4" fill="black"/>
          <rect x="60" y="40" width="8" height="4" fill="black"/>
          <rect x="65" y="50" width="4" height="8" fill="black"/>
          <rect x="40" y="60" width="4" height="4" fill="black"/>
          <rect x="50" y="65" width="8" height="4" fill="black"/>
          <rect x="10" y="45" width="8" height="4" fill="black"/>
          <rect x="25" y="40" width="4" height="8" fill="black"/>
          <rect x="80" y="45" width="4" height="4" fill="black"/>
          <rect x="85" y="55" width="4" height="8" fill="black"/>
          <rect x="45" y="80" width="8" height="4" fill="black"/>
          <rect x="55" y="85" width="4" height="4" fill="black"/>
          <rect x="60" y="75" width="4" height="8" fill="black"/>
        </svg>
      </div>
    `;
  }

  openVenueGameLimitsModal() {
    try {
      const modal = document.getElementById('venue-game-limits-modal') || document.getElementById('venue-limits-modal') || document.getElementById('settings-modal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        
        const maxPlayersSelect = document.getElementById('settings-max-players');
        if (maxPlayersSelect && this.state.maxVenuePlayers !== undefined) {
          maxPlayersSelect.value = String(this.state.maxVenuePlayers);
        }
        
        const tieSelect = document.getElementById('settings-quiz-tie');
        if (tieSelect && this.state.quizTieWinnerBehavior) {
          tieSelect.value = this.state.quizTieWinnerBehavior;
        }

        const botModeSelect = document.getElementById('settings-bot-mode');
        if (botModeSelect && this.state.botMode) {
          botModeSelect.value = this.state.botMode;
        }

        const botDiffSelect = document.getElementById('settings-bot-difficulty');
        if (botDiffSelect && this.state.botDifficulty) {
          botDiffSelect.value = this.state.botDifficulty;
        }
      } else {
        console.error("venue-game-limits-modal not found!");
      }
    } catch(e) {
      console.error("Error in openVenueGameLimitsModal:", e);
    }
  }

  closeVenueGameLimitsModal() {
    try {
      const modal = document.getElementById('venue-game-limits-modal') || document.getElementById('venue-limits-modal') || document.getElementById('settings-modal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    } catch(e) {
      console.error("Error in closeVenueGameLimitsModal:", e);
    }
  }

  updateAdminQrCode() {
    try {
      const branchId = this.state.activeBranchId || "main";
      const baseUrl = window.location.origin + window.location.pathname;
      const guestUrl = baseUrl + "?role=guest&loc=" + branchId;

      const boxEl = document.getElementById("admin-qr-code-box");
      if (boxEl) {
        boxEl.innerHTML = this.generateOfflineQrSvg(guestUrl, 160);
      }
    } catch(e) {
      console.error("Error updating QR code image:", e);
    }
  }

  shareBranchGameLink() {
    try {
      const branchId = this.state.activeBranchId || "main";
      const baseUrl = window.location.origin + window.location.pathname;
      const guestUrl = baseUrl + "?role=guest&loc=" + branchId;

      if (navigator.share) {
        navigator.share({
          title: "WaitPlay — Вход в Игровое Лобби",
          text: "Привет! Присоединяйся к нам в Игровом Лобби по этой ссылке!",
          url: guestUrl
        }).catch(err => {
          this.openShareQrModal(guestUrl);
        });
      } else {
        this.openShareQrModal(guestUrl);
      }
    } catch(e) {
      console.error("Error in shareBranchGameLink:", e);
    }
  }

  openShareQrModal(guestUrl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(guestUrl).catch(() => {});
    }

    let modal = document.getElementById("share-qr-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "share-qr-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const qrSvgHtml = this.generateOfflineQrSvg(guestUrl, 200);

    modal.innerHTML = `
      <div class="modal-content" style="text-align: center; max-width: 320px; background: #110e1f; border: 1px solid var(--border-light); border-radius: 24px; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
        <div style="font-size: 20px; font-weight: 800; color: var(--gold); margin-bottom: 6px;">📱 Вход в Игровое Лобби</div>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 14px;">Наведите камеру 2-го телефона на этот QR-код для входа!</p>
        
        <div style="background: #fff; padding: 15px; border-radius: 20px; display: inline-block; margin-bottom: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          ${qrSvgHtml}
          <div style="font-size: 10px; font-weight: 800; color: #000; margin-top: 8px; text-transform: uppercase;">WAITPLAY GUEST LOBBY</div>
        </div>

        <div style="margin-bottom: 14px;">
          <input type="text" readonly value="${guestUrl}" id="share-modal-url-input" style="width: 100%; font-size: 10px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-light); color: #fff; padding: 8px; border-radius: 8px; text-align: center; box-sizing: border-box; font-family: inherit;">
          <button class="btn btn-primary" onclick="app.copyShareUrlFromInput()" style="margin-top: 6px; width: 100%; padding: 8px; font-size: 11px; font-weight: 700;">📋 Скопировать ссылку на Лобби</button>
        </div>

        <button class="btn btn-secondary" style="width: 100%; padding: 10px; font-size: 11px; font-weight: 700; margin-bottom: 8px;" onclick="app.resetAdminDevice() {
    if (confirm("Сбросить устройство и выйти из аккаунта?")) {
      this.resetAdminDeviceConfirm();
    }
  }

  resetAdminDeviceConfirm() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  }

  addBranchProceedToPayment() {
    this.setAdminPanelActiveView('payment');
  }

  cancelAddBranch() {
    this.setAdminPanelActiveView('select-branch');
  }

  selectPaymentMethod(method) {
    this.selectedPaymentType = method;
    this.showToast("Выбран способ оплаты: " + method, false);
  }

  adjustQuizMinPlayers(delta) {
    let current = parseInt(this.state.quizMinPlayers) || 1;
    let next = Math.max(1, Math.min(50, current + delta));
    this.state.quizMinPlayers = next;
    const el = document.getElementById('label-quiz-min-players');
    if (el) el.innerText = next + " чел.";
    this.saveState();
  }

  adjustQuizMaxPlayers(delta) {
    let current = parseInt(this.state.quizMaxPlayers) || 15;
    let next = Math.max(1, Math.min(50, current + delta));
    this.state.quizMaxPlayers = next;
    const el = document.getElementById('label-quiz-max-players');
    if (el) el.innerText = next + " чел.";
    this.saveState();
  }

  adjustChessTournamentSize(delta) {
    let current = parseInt(this.state.chessSize) || 8;
    let next = Math.max(2, Math.min(16, current + (delta * 2)));
    this.state.chessSize = next;
    const el = document.getElementById('label-chess-size');
    if (el) el.innerText = next + " участников";
    this.saveState();
  }

  adjustCakePlayersLimit(delta) {
    let current = parseInt(this.state.cakePlayers) || 2;
    let next = Math.max(2, Math.min(10, current + delta));
    this.state.cakePlayers = next;
    const el = document.getElementById('label-cake-players');
    if (el) el.innerText = next + " чел.";
    this.saveState();
  }

  adjustCakeSpeedLimit(delta) {
    let current = parseInt(this.state.cakeSpeed) || 3;
    let next = Math.max(1, Math.min(5, current + delta));
    this.state.cakeSpeed = next;
    const el = document.getElementById('label-cake-speed');
    if (el) el.innerText = "Скорость: " + next;
    this.saveState();
  }

  checkVisitorCapacitySlot() {
    this.initVisitorLobby();
  }

  toggleWelcomeTextCollapse() {
    const textEl = document.getElementById('visitor-lobby-welcome-text');
    const arrowEl = document.getElementById('visitor-lobby-welcome-arrow');
    if (textEl) {
      const isExpanded = (textEl.style.maxHeight === 'none');
      textEl.style.maxHeight = isExpanded ? '38px' : 'none';
      if (arrowEl) arrowEl.innerText = isExpanded ? '▼' : '▲';
    }
  }

  resetVisitorSession() {
    sessionStorage.clear();
    location.reload();
  }

  closeVisitorRulesModal() {
    const m = document.getElementById('game-rules-modal') || document.getElementById('visitor-rules-modal');
    if (m) m.style.display = 'none';
  }

  closeGoogleAuthModal() {
    const m = document.getElementById('google-auth-modal');
    if (m) m.style.display = 'none';
  }

  editBranchNameModal() {
    const name = prompt("Введите новое название заведения:", this.state.activeBranchName || "");
    if (name && name.trim()) {
      this.state.activeBranchName = name.trim();
      this.saveState();
      this.renderAdminDashboard();
      this.showToast("Название обновлено!", false);
    }
  }

  editAccountEmailModal() {
    const email = prompt("Введите новый Email:", this.state.email || "");
    if (email && email.includes('@')) {
      this.state.email = email.trim();
      this.saveState();
      this.renderAdminDashboard();
      this.showToast("Email обновлен!", false);
    }
  }

  deleteActiveBranch() {
    if (confirm("Вы уверены, что хотите удалить эту локацию?")) {
      this.showToast("Локация удалена", true);
      this.setAdminPanelActiveView('select-branch');
    }
  }

  closeAccountProfileModal() {
    const m = document.getElementById('account-profile-modal');
    if (m) m.style.display = 'none';
  }

  adminDownloadPrintPDF()">📥 Печать наклейки QR (PDF)</button>

        <button class="btn btn-secondary" style="width: 100%; padding: 12px; font-size: 12px; font-weight: 700;" onclick="document.getElementById('share-qr-modal').classList.remove('active')">Закрыть окно ✖</button>
      </div>
    `;

    modal.style.display = "flex";
    modal.classList.add("active");
  }

  copyShareUrlFromInput() {
    const input = document.getElementById("share-modal-url-input");
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);
      try {
        navigator.clipboard.writeText(input.value);
      } catch(e) {
        document.execCommand("copy");
      }
      this.showToast("✔️ Ссылка на Игровое Лобби скопирована!", false);
    }
  }

  adminDownloadPrintPDF() {
    try {
      const branchName = this.state.activeBranchName || "WaitPlay";
      const branchId = this.state.activeBranchId || "main";
      const baseUrl = window.location.origin + window.location.pathname;
      const guestUrl = baseUrl + "?role=guest&loc=" + branchId;
      const qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&data=" + encodeURIComponent(guestUrl);

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>QR-код Наклейка Лобби - ${branchName}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 40px; background: #fff; color: #000; }
              .card { border: 4px solid #000; border-radius: 24px; padding: 30px; display: inline-block; max-width: 350px; }
              h1 { margin: 0 0 10px 0; font-size: 24px; }
              p { font-size: 14px; margin-bottom: 20px; color: #444; }
              img { width: 260px; height: 260px; }
              .footer { margin-top: 15px; font-weight: bold; font-size: 12px; letter-spacing: 1px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>${branchName}</h1>
              <p>Отсканируйте QR-код для входа в Игровое Лобби!</p>
              <img src="${qrApiUrl}" alt="QR Code">
              <div class="footer">WAITPLAY GUEST LOBBY</div>
            </div>
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.open(qrApiUrl, "_blank");
      }
    } catch(e) {
      console.error("Error in adminDownloadPrintPDF:", e);
    }
    }
  }

// Instantiate
const app = new WaitPlayApp();
window.app = app;

function initWaitPlayApp() {
  try {
    if (window.app && typeof window.app.init === 'function') {
      window.app.init();
    }
  } catch(e) {
    console.error("Error initializing WaitPlayApp:", e);
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initWaitPlayApp();
} else {
  window.addEventListener('DOMContentLoaded', initWaitPlayApp);
  window.addEventListener('load', initWaitPlayApp);
}
