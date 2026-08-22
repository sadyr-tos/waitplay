// core/app_class.js - WaitPlayApp Core Class Skeleton

export class WaitPlayApp {
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

  init() {
    try {
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
      this.updateAdminView();
      this.renderRegQuickAccounts();
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
      var errDiv = document.getElementById('debug-global-error-banner');
      if (!errDiv) {
        errDiv = document.createElement('div');
        errDiv.id = 'debug-global-error-banner';
        errDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: rgba(220, 38, 38, 0.95); color: white; padding: 15px; font-family: monospace; font-size: 12px; z-index: 100000; border-bottom: 3px solid black; max-height: 50vh; overflow-y: auto; text-align: left;';
        document.body.insertBefore(errDiv, document.body.firstChild);
      }
      errDiv.innerHTML += '<div style="margin-bottom:10px;">❌ <strong>Runtime Error inside init():</strong> ' + e.message + '<br><em>Stack:</em> ' + e.stack + '</div>';
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

}

