// store/36_store_core.js - State Store & Persistence

export const storeCoreMethods = {
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
      
      // Сброс активной сессии для принудительного старта с первого экрана при перезагрузке (F5)
      this.state.email = '';
      this.state.phone = '';
      this.state.subscription = 'none';
      this.state.consentAccepted = false;
      this.state.activeBranchId = '';
      this.state.activeBranchName = '';
      
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

};

