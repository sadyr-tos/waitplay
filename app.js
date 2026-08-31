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

  // ==========================================
  // --- REAL-TIME LIVE MULTIPLAYER CORRIDOR ---
  // ==========================================
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

  // ========================================================
  // --- BULLETPROOF REAL-TIME MULTIPLAYER CORRIDOR ENGINE ---
  // ========================================================
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

    // Fast heartbeat presence every 1.5 seconds
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

        // If both in queue for the same game, update queue UI and auto-pair!
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

      // Check if room is currently busy with an active match
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

      // Register self in local queue
      this.queuePlayers = this.queuePlayers || {};
      this.queuePlayers[this.myPlayerId] = {
        ...this.myPlayerProfile,
        id: this.myPlayerId,
        gameId: gameId,
        joinTime: this.myQueueJoinTime
      };

      this.updateLiveQueueUI();
      this.broadcastNetworkPresence();

      // Send queue join message
      this.sendNetworkMessage({
        type: 'queue_join',
        gameId: gameId,
        profile: this.myPlayerProfile
      });

      // 15-Second Matchmaking Window (Guaranteed Timer)
      clearInterval(this.state.lobbyCountdown);
      this.state.lobbyTimerVal = 15;

      this.state.lobbyCountdown = setInterval(() => {
        this.state.lobbyTimerVal--;
        const timerEl = document.getElementById('lobby-countdown-timer');
        if (timerEl) timerEl.innerText = `${this.state.lobbyTimerVal} сек`;

        // Check pairing on every tick
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

  initTTFTournament(isNextRound = false) {
    if (!this.myPlayerProfile) {
      const names = ["Панда", "Волк", "Лиса", "Лев", "Тигр", "Медведь", "Коала", "Зайка"];
      const avatars = ["🐼", "🐺", "🦊", "🦁", "🐯", "🐻", "🐨", "🐰"];
      const rIdx = Math.floor(Math.random() * names.length);
      this.myPlayerId = this.myPlayerId || ('p_' + Math.random().toString(36).substring(2, 9));
      this.myPlayerProfile = { id: this.myPlayerId, name: names[rIdx], avatar: avatars[rIdx] };
    }

    let currentRound = (this.state.tttTournament && this.state.tttTournament.round) ? (this.state.tttTournament.round + 1) : 1;
    if (!isNextRound) currentRound = 1;

    let scoreX = (this.state.tttTournament && this.state.tttTournament.scoreX) || 0;
    let scoreO = (this.state.tttTournament && this.state.tttTournament.scoreO) || 0;
    let drawsCount = (this.state.tttTournament && this.state.tttTournament.drawsCount) || 0;
    if (!isNextRound) { scoreX = 0; scoreO = 0; drawsCount = 0; }

    // Check if another player is already waiting in this room
    const otherPlayers = Object.values(this.livePlayers || {}).filter(p => p.id !== this.myPlayerId && (p.gameId === 4 || !p.gameId));

    if (otherPlayers.length > 0) {
      // We are Guest (O) pairing with the existing Host (X)
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

      // Notify Host that we joined and paired
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
      // We are Host (X) waiting for Player 2
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

    // As Host, pair with incoming Guest
    const guest = data.profile || { name: 'Игрок 2', avatar: '🐺', id: data.senderId };
    t.oppName = `${guest.avatar} ${guest.name}`;
    t.status = 'playing';

    // Broadcast confirmation to Guest
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
      // I am Host (X)
      t.isHost = true;
      t.mySymbol = 'X';
      t.oppSymbol = 'O';
      t.myName = `${data.hostProfile.avatar} ${data.hostProfile.name}`;
      t.oppName = `${data.guestProfile.avatar} ${data.guestProfile.name}`;
      t.status = 'playing';
      t.currentTurn = 'X';
    } else if (this.myPlayerId === data.guestId) {
      // I am Guest (O)
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
      turnIndicator = `<span style="color:var(--gold); font-weight:800; font-size:13px; animation:pulse 1.5s infinite;">⏳ Ожидание второго живого игрока...</span>`;
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
      if (typeLabel) typeLabel.innerText = "КРЕСТИКИ-НОЛИКИ ❌⭕";
      const qIdx = document.getElementById('visitor-game-q-index');
      if (qIdx) qIdx.innerText = "Живой матч 1 на 1";
      this.renderTTFBoard(optionsBox, textLabel);
      return;
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
        
        const gamesSelect = document.getElementById('settings-limit-games');
        if (gamesSelect && this.state.limitGames !== undefined) {
          gamesSelect.value = String(this.state.limitGames);
        }

        const hoursSelect = document.getElementById('settings-limit-hours');
        if (hoursSelect && this.state.limitHours !== undefined) {
          hoursSelect.value = String(this.state.limitHours);
        }

        const maxPlayersSelect = document.getElementById('settings-max-players');
        if (maxPlayersSelect && this.state.maxVenuePlayers !== undefined) {
          maxPlayersSelect.value = String(this.state.maxVenuePlayers);
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
      const botMode = this.state.botMode || 'enabled';
      const botDiff = this.state.botDifficulty || 'medium';
      const maxVenue = this.state.maxVenuePlayers !== undefined ? this.state.maxVenuePlayers : 15;
      const guestUrl = baseUrl + "?role=guest&loc=" + branchId + "&botMode=" + botMode + "&botDiff=" + botDiff + "&max=" + maxVenue;

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
      const botMode = this.state.botMode || 'enabled';
      const botDiff = this.state.botDifficulty || 'medium';
      const maxVenue = this.state.maxVenuePlayers !== undefined ? this.state.maxVenuePlayers : 15;
      const guestUrl = baseUrl + "?role=guest&loc=" + branchId + "&botMode=" + botMode + "&botDiff=" + botDiff + "&max=" + maxVenue;

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

        <button class="btn btn-secondary" style="width: 100%; padding: 10px; font-size: 11px; font-weight: 700; margin-bottom: 8px;" onclick="app.adminDownloadPrintPDF()">📥 Печать наклейки QR (PDF)</button>

        <button class="btn btn-secondary" style="width: 100%; padding: 12px; font-size: 12px; font-weight: 700;" onclick="document.getElementById('share-qr-modal').style.display='none'; document.getElementById('share-qr-modal').classList.remove('active');">Закрыть окно ✖</button>
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
