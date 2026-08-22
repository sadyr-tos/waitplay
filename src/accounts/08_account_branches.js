// accounts/08_account_branches.js - Branch & DB Actions

export const branchMethods = {
  // --- DATABASE & BRANCH ACTIONS ---
  initDatabaseClients() {
    try {
      const saved = localStorage.getItem('waitplay_db_clients_v26');
      if (saved) {
        this.state.databaseClients = JSON.parse(saved);
      } else {
        this.state.databaseClients = [];
      }

      // Ensure user test accounts exist: Великая Гора (PRO) и Курса в Токмок (BASE)
      let mountainClient = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === 'great_mountain@waitplay.com');
      if (!mountainClient) {
        mountainClient = {
          email: 'great_mountain@waitplay.com',
          phone: '996770112233',
          status: 'Активен',
          branches: [
            {
              id: 'br_mountain_pro',
              name: 'Великая Гора (PRO)',
              subscription: 'pro_yearly',
              lat: 42.8746,
              lng: 74.5698,
              deviceModel: 'iPhone 15 Pro',
              status: 'Активен',
              deviceHistory: ['15.06.2026: Регистрация филиала Великая Гора (PRO)']
            }
          ]
        };
        this.state.databaseClients.unshift(mountainClient);
      }

      let tokmokClient = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === 'tokmok_base@waitplay.com');
      if (!tokmokClient) {
        tokmokClient = {
          email: 'tokmok_base@waitplay.com',
          phone: '996770445566',
          status: 'Активен',
          branches: [
            {
              id: 'br_tokmok_base',
              name: 'Курса в Токмок (BASE)',
              subscription: 'base_monthly',
              lat: 42.8312,
              lng: 75.3012,
              deviceModel: 'Xiaomi 13',
              status: 'Активен',
              deviceHistory: ['20.06.2026: Регистрация филиала Курса в Токмок (BASE)']
            }
          ]
        };
        this.state.databaseClients.unshift(tokmokClient);
      }

      // Automatic cleanup of developer test/funny branches
      const deleteKeywords = ['бок', 'терек', 'мокочо', 'mokocho', 'predshestvie', 'какашка'];
      this.state.databaseClients.forEach(c => {
        if (c.branches) {
          c.branches = c.branches.filter(br => {
            const nameLower = (br.name || '').toLowerCase();
            return !deleteKeywords.some(kw => nameLower.includes(kw));
          });
        }
      });

      // Remove temporary test clients that have no remaining branches
      const systemMockEmails = ['owner_vintage@gmail.com', 'cafe_central@gmail.com', 'great_mountain@waitplay.com', 'tokmok_base@waitplay.com'];
      this.state.databaseClients = this.state.databaseClients.filter(c => {
        if (c.email && systemMockEmails.includes(c.email.toLowerCase())) return true;
        return c.branches && c.branches.length > 0;
      });

      localStorage.setItem('waitplay_db_clients_v26', JSON.stringify(this.state.databaseClients));
    } catch (e) {
      console.error("Error in initDatabaseClients:", e);
    }
  },
        {
          email: 'owner_vintage@gmail.com',
          phone: '996777889900',
          status: 'Активен',
          branches: [
            {
              id: 'br_v1',
              name: 'Vintage Cafe (Бишкек)',
              subscription: 'pro_yearly',
              lat: 42.8746,
              lng: 74.5698,
              deviceModel: 'Samsung Galaxy S24',
              status: 'Активен',
              deviceHistory: [
                '15.06.2026: Первичная регистрация: iPhone 15 Pro',
                '01.07.2026: Перенос аккаунта на Samsung Galaxy S24'
              ]
            },
            {
              id: 'br_v2',
              name: 'Vintage Bar (Ош)',
              subscription: 'base_monthly',
              lat: 40.5140,
              lng: 72.8160,
              deviceModel: 'Xiaomi 14 Ultra',
              status: 'Активен',
              deviceHistory: [
                '20.06.2026: Первичная регистрация: Xiaomi 14 Ultra'
              ]
            },
            {
              id: 'br_v3',
              name: 'Vintage Lounge (Каракол)',
              subscription: 'none',
              lat: 42.4900,
              lng: 78.3900,
              deviceModel: 'iPhone 15 Pro',
              status: 'Активен',
              deviceHistory: [
                '25.06.2026: Первичная регистрация: iPhone 15 Pro'
              ]
            }
          ]
        },
        {
          email: 'cafe_central@gmail.com',
          phone: '996555112233',
          status: 'Активен',
          branches: [
            {
              id: 'br_c1',
              name: 'Cafe Central (Чуй)',
              subscription: 'base_monthly',
              lat: 42.8123,
              lng: 74.6123,
              deviceModel: 'Xiaomi 13 Pro',
              status: 'Активен',
              deviceHistory: [
                '10.06.2026: Первичная регистрация: Xiaomi 13 Pro'
              ]
            }
          ]
        }
      ];
      this.saveDatabaseClients();
    } catch (e) {
      console.error("Error in initDatabaseClients:", e);
    }
  }

  saveDatabaseClients() {
    try {
      localStorage.setItem('waitplay_db_clients_v26', JSON.stringify(this.state.databaseClients));
    } catch (e) {
      console.error("Error saving database clients:", e);
    }
  }

  syncActiveBranchToDatabase() {
    try {
      if (!this.state.email || !this.state.activeBranchId) return;
      
      this.state.databaseClients = this.state.databaseClients || [];
      const emailLower = this.state.email.toLowerCase();
      let client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === emailLower);
      
      if (!client) {
        client = {
          email: this.state.email,
          phone: this.state.phone,
          status: 'Активен',
          branches: []
        };
        this.state.databaseClients.push(client);
      }

      const branchId = this.state.activeBranchId || 'br_' + Date.now();
      this.state.activeBranchId = branchId;

      let branch = client.branches.find(b => b.id === branchId);
      if (!branch) {
        branch = {
          id: branchId,
          name: this.state.activeBranchName || "Мой филиал",
          status: 'Активен'
        };
        client.branches.push(branch);
      }

      if (this.state.activeBranchName) {
        branch.name = this.state.activeBranchName;
      }
      branch.welcomeMsg = this.state.welcomeMsg;
      branch.prizeMsg = this.state.prizeMsg || "";
      branch.manualTestingMode = this.state.manualTestingMode !== undefined ? this.state.manualTestingMode : false;
      branch.limitGames = this.state.limitGames !== undefined ? this.state.limitGames : 2;
      branch.limitHours = this.state.limitHours !== undefined ? this.state.limitHours : 3;
      branch.tttDifficulty = this.state.tttDifficulty !== undefined ? this.state.tttDifficulty : 'normal';
      branch.tttTournamentSize = this.state.tttTournamentSize !== undefined ? this.state.tttTournamentSize : 8;
      branch.tttTurnLimit = this.state.tttTurnLimit !== undefined ? this.state.tttTurnLimit : 'none';
      branch.tttMaxDraws = this.state.tttMaxDraws !== undefined ? this.state.tttMaxDraws : 'none';
      branch.quizTieWinnerBehavior = this.state.quizTieWinnerBehavior !== undefined ? this.state.quizTieWinnerBehavior : 'give';
      branch.crosswordDifficulty = this.state.crosswordDifficulty !== undefined ? this.state.crosswordDifficulty : 'normal';
      branch.crosswordTimeLimit = this.state.crosswordTimeLimit !== undefined ? this.state.crosswordTimeLimit : 5;
      branch.guessWordDifficulty = this.state.guessWordDifficulty !== undefined ? this.state.guessWordDifficulty : 'normal';
      branch.guessWordCustomWord = this.state.guessWordCustomWord || '';
      branch.guessWordCustomClue = this.state.guessWordCustomClue || '';
      branch.subscription = this.state.subscription;
      branch.subscriptionExpires = this.state.subscriptionExpires || null;
      branch.lat = this.state.venueCoords.lat;
      branch.lng = this.state.venueCoords.lng;
      branch.deviceModel = this.state.deviceModel;
      branch.deviceHistory = [...this.state.deviceHistory];
      branch.games = this.state.games ? JSON.parse(JSON.stringify(this.state.games)) : JSON.parse(JSON.stringify(DEFAULT_GAMES));
      branch.templates = this.state.templates ? JSON.parse(JSON.stringify(this.state.templates)) : JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
      branch.memoryDifficulty = this.state.memoryDifficulty !== undefined ? this.state.memoryDifficulty : 'normal';
      branch.memoryTimeLimit = this.state.memoryTimeLimit !== undefined ? this.state.memoryTimeLimit : 60;
      branch.memoryTheme = this.state.memoryTheme !== undefined ? this.state.memoryTheme : 'restaurant';

      this.saveDatabaseClients();
    } catch (e) {
      console.error("Error syncing active branch to db:", e);
    }
  }

  creatorBranchAction(action, email, branchId) {
    try {
      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
      if (!client) return;

      const branch = client.branches.find(b => b.id === branchId);
      if (!branch) return;

      if (action === 'give_pro') {
        branch.subscription = 'pro_yearly';
        this.showToast(`Для филиала "${branch.name}" выдана PRO подписка.`, false);
      } else if (action === 'reset_gps') {
        branch.lat = 0;
        branch.lng = 0;
        this.showToast(`Для филиала "${branch.name}" сброшены координаты.`, false);
      } else if (action === 'reset_device') {
        branch.deviceModel = 'iPhone 15 Pro';
        branch.deviceHistory = ['01.07.2026: Сброс привязки через Creator Console'];
        this.showToast(`Для филиала "${branch.name}" сброшена привязка к устройству.`, false);
      } else if (action === 'reset_sub') {
        branch.subscription = 'none';
        this.showToast(`Для филиала "${branch.name}" аннулирована подписка.`, false);
      } else if (action === 'ban') {
        branch.status = 'Заблокирован';
        this.showToast(`Филиал "${branch.name}" успешно заблокирован! 🚫`, true);
      } else if (action === 'unban') {
        branch.status = 'Активен';
        this.showToast(`Филиал "${branch.name}" успешно разблокирован. 🔓`, false);
      }

      this.saveDatabaseClients();

      // If active branch of currently logged in admin, update active context immediately
      if (this.state.email && this.state.email.toLowerCase() === email.toLowerCase() && this.state.activeBranchId === branchId) {
        this.state.subscription = branch.subscription;
        this.state.venueCoords = { lat: branch.lat, lng: branch.lng };
        this.state.deviceModel = branch.deviceModel;
        this.state.deviceHistory = [...branch.deviceHistory];
        this.saveState();
        this.updateAdminView();
        this.renderAdminGamesGrid();
      }

      this.renderCreatorClientsList();
    } catch (e) {
      console.error("Error in creatorBranchAction:", e);
    }
  }

  selectWelcomeFlow(flow) {
    try {
      // Clear previous active session states for the onboarding funnel
      this.state.email = '';
      this.state.phone = '';
      this.state.subscription = 'none';
      this.state.consentAccepted = false;
      this.state.activeBranchId = '';
      this.saveState();

      // Clear DOM inputs
      const emailEl = document.getElementById('reg-email');
      const phoneEl = document.getElementById('reg-phone');
      if (emailEl) emailEl.value = '';
      if (phoneEl) phoneEl.value = '';

      // Reset DOM display groups to initial state (show input group, hide verification code group)
      const emailInputGrp = document.getElementById('reg-email-input-group');
      const emailCodeGrp = document.getElementById('reg-email-code-group');
      if (emailInputGrp) emailInputGrp.style.display = 'block';
      if (emailCodeGrp) emailCodeGrp.style.display = 'none';

      const phoneInputGrp = document.getElementById('reg-phone-input-group');
      const phoneCodeGrp = document.getElementById('reg-phone-code-group');
      if (phoneInputGrp) phoneInputGrp.style.display = 'block';
      if (phoneCodeGrp) phoneCodeGrp.style.display = 'none';

      if (flow === 'register') {
        this.isLoginFlow = false;
        this.setAdminPanelActiveView('consent');
      } else {
        this.isLoginFlow = true;
        this.setAdminPanelActiveView('reg-email');
      }
    } catch (e) {
      console.error("Error selecting welcome flow:", e);
    }
  }

  renderSelectBranchList(branches, email) {
    try {
      const container = document.getElementById('select-branch-list');
      if (!container) return;

      container.innerHTML = '';
      branches.forEach(br => {
        const div = document.createElement('div');
        div.style.background = 'rgba(255, 255, 255, 0.03)';
        div.style.border = '1px solid var(--border-light)';
        div.style.borderRadius = '10px';
        div.style.padding = '8px 12px';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.cursor = 'pointer';
        div.style.marginBottom = '6px';

        const isPro = br.subscription.includes('pro');
        const isBanned = br.status === 'Заблокирован';
        const badgeClass = isBanned ? 'badge-danger' : (isPro ? 'badge-pro' : (br.subscription !== 'none' ? 'badge-base' : 'badge-secondary'));
        const badgeText = isBanned ? 'БАН 🚫' : (isPro ? 'PRO' : (br.subscription !== 'none' ? 'BASE' : 'НЕТ'));

        div.innerHTML = `
          <div style="text-align:left;">
            <div style="font-weight:700; color:#fff; font-size:11px;">🏢 ${br.name}</div>
            <div style="font-size:8px; color:var(--text-muted);">Координаты: ${br.lat ? br.lat.toFixed(4) : '0.0000'}, ${br.lng ? br.lng.toFixed(4) : '0.0000'}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge ${badgeClass}" style="font-size:8px;">${badgeText}</span>
            <button class="btn btn-primary" style="margin:0; padding:4px 10px; font-size:9px; width:auto;" onclick="app.loadBranchContext('${email}', '${br.id}')">Войти 🔑</button>
          </div>
        `;
        container.appendChild(div);
      });
    } catch (e) {
      console.error("Error rendering select branch list:", e);
    }
  }

  loadBranchContext(email, branchId) {
    try {
      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
      if (!client) return;

      const br = client.branches.find(b => b.id === branchId);
      if (!br) return;

      if (br.status === 'Заблокирован') {
        this.showToast(`Этот филиал заблокирован создателем! 🚫`, true);
        return;
      }

      this.state.email = client.email;
      this.state.phone = client.phone;
      this.state.activeBranchId = branchId;
      
      // Only set visitorConnectedBranchId on initial setup if guest has never connected to a branch yet,
      // but do NOT force-switch the guest when admin switches accounts.
      if (!this.state.visitorConnectedBranchId) {
        this.state.visitorConnectedBranchId = branchId;
      }
      
      this.state.subscription = br.subscription;
      this.state.subscriptionExpires = br.subscriptionExpires || null;
      this.state.venueCoords = { lat: br.lat, lng: br.lng };
      this.state.activeBranchName = br.name;
      this.state.welcomeMsg = br.welcomeMsg || `Добро пожаловать в ${br.name}`;
      this.state.prizeMsg = br.prizeMsg || "";
      this.state.limitGames = br.limitGames !== undefined ? br.limitGames : 2;
      this.state.limitHours = br.limitHours !== undefined ? br.limitHours : 3;
      this.state.deviceModel = br.deviceModel || 'iPhone 15 Pro';
      this.state.deviceHistory = br.deviceHistory || [];
      this.state.games = br.games ? JSON.parse(JSON.stringify(br.games)) : JSON.parse(JSON.stringify(DEFAULT_GAMES));
      this.normalizeGameNames();
      this.state.templates = br.templates ? JSON.parse(JSON.stringify(br.templates)) : JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
      this.state.tttDifficulty = br.tttDifficulty !== undefined ? br.tttDifficulty : 'normal';
      this.state.tttTournamentSize = br.tttTournamentSize !== undefined ? br.tttTournamentSize : 8;
      this.state.tttTurnLimit = br.tttTurnLimit !== undefined ? br.tttTurnLimit : 'none';
      let maxDraws = br.tttMaxDraws !== undefined ? br.tttMaxDraws : 3;
      if (maxDraws === 'none') maxDraws = 3;
      this.state.tttMaxDraws = parseInt(maxDraws) || 3;
      this.state.quizTieWinnerBehavior = br.quizTieWinnerBehavior !== undefined ? br.quizTieWinnerBehavior : 'give';
      this.state.crosswordDifficulty = br.crosswordDifficulty !== undefined ? br.crosswordDifficulty : 'normal';
      this.state.crosswordTimeLimit = br.crosswordTimeLimit !== undefined ? br.crosswordTimeLimit : 5;
      this.state.guessWordDifficulty = br.guessWordDifficulty !== undefined ? br.guessWordDifficulty : 'normal';
      this.state.guessWordCustomWord = br.guessWordCustomWord || '';
      this.state.guessWordCustomClue = br.guessWordCustomClue || '';
      this.state.manualTestingMode = br.manualTestingMode !== undefined ? br.manualTestingMode : false;
      this.state.memoryDifficulty = br.memoryDifficulty !== undefined ? br.memoryDifficulty : 'normal';
      this.state.memoryTimeLimit = br.memoryTimeLimit !== undefined ? br.memoryTimeLimit : 60;
      this.state.memoryTheme = br.memoryTheme !== undefined ? br.memoryTheme : 'restaurant';

      // Update DOM values
      const welcomeInput = document.getElementById('admin-venue-welcome');
      if (welcomeInput) welcomeInput.value = this.state.welcomeMsg;
      const prizeInput = document.getElementById('admin-venue-prize');
      if (prizeInput) prizeInput.value = this.state.prizeMsg;

      const limitGamesEl = document.getElementById('settings-limit-games');
      if (limitGamesEl) limitGamesEl.value = this.state.limitGames;
      const limitHoursEl = document.getElementById('settings-limit-hours');
      if (limitHoursEl) limitHoursEl.value = this.state.limitHours;

      const tttDifficultyEl = document.getElementById('settings-ttt-difficulty');
      if (tttDifficultyEl) tttDifficultyEl.value = this.state.tttDifficulty;
      const tttTurnLimitEl = document.getElementById('settings-ttt-turn-limit');
      if (tttTurnLimitEl) tttTurnLimitEl.value = this.state.tttTurnLimit;
      this.updateTTTSizeUI();
      this.updateTTTMaxDrawsUI();

      const quizTieEl = document.getElementById('settings-quiz-tie');
      if (quizTieEl) quizTieEl.value = this.state.quizTieWinnerBehavior;

      const crosswordDiffEl = document.getElementById('settings-crossword-difficulty');
      if (crosswordDiffEl) crosswordDiffEl.value = this.state.crosswordDifficulty;
      const crosswordTimeEl = document.getElementById('settings-crossword-time-limit');
      if (crosswordTimeEl) crosswordTimeEl.value = this.state.crosswordTimeLimit;

      const guessWordDiffEl = document.getElementById('settings-guessword-difficulty');
      if (guessWordDiffEl) guessWordDiffEl.value = this.state.guessWordDifficulty;
      const guessWordWordEl = document.getElementById('settings-guessword-custom-word');
      if (guessWordWordEl) guessWordWordEl.value = this.state.guessWordCustomWord;
      const guessWordClueEl = document.getElementById('settings-guessword-custom-clue');
      if (guessWordClueEl) guessWordClueEl.value = this.state.guessWordCustomClue;

      this.updateGuessWordPlayersUI();

      // Add/sync to logged accounts list
      this.syncActiveAccountToLogged();
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorClientsList();
      this.renderQuizQuestionsEditor();
      
      // Sync testing mode constraints immediately upon login
      this.handleTestingModeChange(this.state.manualTestingMode);
      // Only refresh visitor lobby if visitor is connected to THIS exact branch
      if (this.state.visitorActiveView === 'lobby' && this.state.visitorConnectedBranchId === branchId) {
        this.initVisitorLobby();
      }
      
      this.showToast(`Успешный вход в филиал "${br.name}" ✔️`, false);
    } catch (e) {
      console.error("Error in loadBranchContext:", e);
    }
  }

  addBranchProceedToPayment() {
    try {
      const name = document.getElementById('add-branch-name').value.trim();
      if (!name) {
        this.showToast("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0444\u0438\u043b\u0438\u0430\u043b\u0430!", true);
        return;
      }

      // Check max 4 branches and name uniqueness
      this.state.databaseClients = this.state.databaseClients || [];
      const emailInput = (this.state.email || '').trim();
      
      if (emailInput) {
        const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === emailInput.toLowerCase());
        if (client) {
          if (client.branches && client.branches.length >= 4) {
            this.showToast("\u041f\u0440\u0435\u0432\u044b\u0448\u0435\u043d \u043b\u0438\u043c\u0438\u0442! \u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u043e \u043c\u0430\u043a\u0441\u0438\u043c\u0443\u043c 4 \u0444\u0438\u043b\u0438\u0430\u043b\u0430 \u043d\u0430 \u043e\u0434\u043d\u0443 \u0443\u0447\u0435\u0442\u043d\u0443\u044e \u0437\u0430\u043f\u0438\u0441\u044c.", true);
            return;
          }
          const nameExists = (client.branches || []).some(b => b.name.toLowerCase() === name.toLowerCase());
          if (nameExists) {
            this.showToast("\u0424\u0438\u043b\u0438\u0430\u043b \u0441 \u0442\u0430\u043a\u0438\u043c \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435\u043c \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d! \u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0443\u043a\u0430\u0436\u0438\u0442\u0435 \u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435.", true);
            return;
          }
        }
      }

      if (this.isSandboxMode()) {
        this.state.adminCoords.lat = PRESETS.venue.lat;
        this.state.adminCoords.lng = PRESETS.venue.lng;
        this.saveState();
        
        this.createFreeBranch(name);
        return;
      }

      // Request Geolocation Access with fallback
      this.showToast("\u23f3 \u0417\u0430\u043f\u0440\u043e\u0441 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u0438\u044f \u043d\u0430 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u0433\u0435\u043e\u0434\u0430\u043d\u043d\u044b\u043c...", false);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.state.adminCoords.lat = position.coords.latitude;
            this.state.adminCoords.lng = position.coords.longitude;
            this.saveState();
            this.createFreeBranch(name);
          },
          (error) => {
            console.warn("Geolocation failed/denied, falling back:", error);
            this.showToast("\u26a0\ufe0f \u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0433\u0435\u043e\u0434\u0430\u043d\u043d\u044b\u0435. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u043a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442\u044b \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e.", false);
            this.state.adminCoords.lat = PRESETS.venue.lat;
            this.state.adminCoords.lng = PRESETS.venue.lng;
            this.saveState();
            this.createFreeBranch(name);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        this.showToast("\u26a0\ufe0f \u0413\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044f \u043d\u0435 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044f. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u043a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442\u044b \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e.", false);
        this.state.adminCoords.lat = PRESETS.venue.lat;
        this.state.adminCoords.lng = PRESETS.venue.lng;
        this.saveState();
        this.createFreeBranch(name);
      }
    } catch (e) {
      console.error("Error in addBranchProceedToPayment:", e);
    }
  }

  createFreeBranch(name) {
    try {
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
        name: name,
        subscription: 'none',
        lat: this.state.adminCoords.lat,
        lng: this.state.adminCoords.lng,
        welcomeMsg: `\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 ${name}`,
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
    } catch (e) {
      console.error("Error in createFreeBranch:", e);
    }
  }
  saveWelcomeMsg(val) {
    try {
      const words = val.trim().split(/\s+/).filter(w => w.length > 0);
      if (words.length > 50) {
        this.showToast("Превышен лимит! Приветствие должно содержать не более 50 слов.", true);
        const truncated = words.slice(0, 50).join(" ");
        document.getElementById('admin-venue-welcome').value = truncated;
        this.state.welcomeMsg = truncated;
      } else {
        this.state.welcomeMsg = val;
      }
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch (e) {
      console.error("Error in saveWelcomeMsg:", e);
    }
  }

  savePrizeMsg(val) {
    try {
      const words = val.trim().split(/\s+/).filter(w => w.length > 0);
      if (words.length > 15) {
        this.showToast("Превышен лимит! Название приза должно содержать не более 15 слов.", true);
        const truncated = words.slice(0, 15).join(" ");
        document.getElementById('admin-venue-prize').value = truncated;
        this.state.prizeMsg = truncated;
      } else {
        this.state.prizeMsg = val;
      }
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch (e) {
      console.error("Error in savePrizeMsg:", e);
    }
  }

  cancelAddBranch() {
    try {
      this.isAddingBranch = false;
      this.pendingBranchName = null;
      if (this.state.activeBranchId) {
        this.setAdminPanelActiveView('dashboard');
      } else {
        this.setAdminPanelActiveView('welcome-choice');
      }
    } catch (e) {
      console.error("Error in cancelAddBranch:", e);
    }
  }
}

// Instantiate
const app = new WaitPlayApp();
};

