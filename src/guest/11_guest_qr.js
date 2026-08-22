// guest/11_guest_qr.js - Guest QR & Geo Limits

export const guestQRMethods = {
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
    if (this.state.manualTestingMode) {
      this.showVisitorToast("🛠️ В данный момент ведутся технические работы. Игры временно недоступны!", true);
      return;
    }
    
    this.state.visitorSelectedGameId = gameId;
    this.saveState();
    
    document.getElementById('lobby-queue-overlay').style.display = 'flex';
    
    // Clean old radar avatars
    const radarBox = document.getElementById('visitor-radar-box');
    if (radarBox) {
      const avatars = radarBox.querySelectorAll('.radar-avatar');
      avatars.forEach(av => av.remove());
    }
    
    const branch = this.getVisitorConnectedBranch();
    const branchGames = branch ? (branch.games || JSON.parse(JSON.stringify(DEFAULT_GAMES))) : this.state.games;
    const game = branchGames.find(g => g.id === gameId);

    let currentPlayers = 1;
    const targetMin = game ? game.minPlayers : 10;
    const targetMax = game ? game.maxPlayers : 15;
    const lobbyCounter = document.getElementById('visitor-lobby-players-count');
    const countdownTimer = document.getElementById('lobby-countdown-timer');

    clearInterval(this.state.lobbyCountdown);
    clearInterval(this.state.lobbyJoinInterval);
    lobbyCounter.innerText = `👥 ${currentPlayers} / ${targetMax}`;
    countdownTimer.innerText = '--';

    const avatarsList = ["🦊", "🐼", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔", "🐷"];

    this.state.lobbyJoinInterval = setInterval(() => {
      if (currentPlayers < targetMin) {
        const added = Math.floor(Math.random() * 2) + 1;
        for (let a = 0; a < added; a++) {
          if (currentPlayers < targetMin) {
            this.spawnRadarAvatar(avatarsList[currentPlayers % avatarsList.length], currentPlayers);
            currentPlayers++;
          }
        }
        
        lobbyCounter.innerText = `👥 ${currentPlayers} / ${targetMax}`;
        
        if (currentPlayers >= targetMin) {
          this.state.lobbyTimerVal = 7;
          countdownTimer.innerText = `${this.state.lobbyTimerVal} сек`;
          const labelEl = document.getElementById('lobby-countdown-label');
          if (labelEl) labelEl.innerText = 'Приготовиться к старту!';
          
          this.state.lobbyCountdown = setInterval(() => {
            this.state.lobbyTimerVal--;
            countdownTimer.innerText = `${this.state.lobbyTimerVal} сек`;

            if (currentPlayers < targetMax && Math.random() > 0.6) {
              this.spawnRadarAvatar(avatarsList[currentPlayers % avatarsList.length], currentPlayers);
              currentPlayers++;
              lobbyCounter.innerText = `👥 ${currentPlayers} / ${targetMax}`;
            }

            if (this.state.lobbyTimerVal <= 0) {
              clearInterval(this.state.lobbyCountdown);
              clearInterval(this.state.lobbyJoinInterval);
              document.getElementById('lobby-queue-overlay').style.display = 'none';
              this.startActiveGame(currentPlayers);
            }
          }, 1000);
        }
      }
    }, 1000);
  }

  spawnRadarAvatar(avatar, index) {
    const radarBox = document.getElementById('visitor-radar-box');
    if (!radarBox) return;
    
    const el = document.createElement('div');
    el.className = 'radar-avatar';
    el.innerText = avatar;
    
    // Position randomly on perimeter of radar circle
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 8; // px radius
    const x = Math.cos(angle) * radius + 35; // centered in 90px container
    const y = Math.sin(angle) * radius + 35;
    
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    // Small random translation offset for animation dx/dy float
    const dx = (Math.random() - 0.5) * 8;
    const dy = (Math.random() - 0.5) * 8;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    
    radarBox.appendChild(el);
  }

  visitorLeaveQueue() {
    clearInterval(this.state.lobbyCountdown);
    clearInterval(this.state.lobbyJoinInterval);
    document.getElementById('lobby-queue-overlay').style.display = 'none';
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
      const playingBox = textLabel.closest('.game-playing-box');
      if (playingBox) {
        playingBox.style.justifyContent = 'center';
        playingBox.style.alignItems = 'center';
        playingBox.style.padding = '22px 15px';
        playingBox.style.gap = '16px';
        playingBox.style.overflow = 'visible';
      }

      textLabel.style.display = 'block';
      textLabel.style.cssText = 'font-size:16px; font-weight:800; line-height:1.4; color:#fff; text-align:center; margin:10px 0 15px 0; width:100%;';

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "ВИКТОРИНА В ЗАВЕДЕНИИ";

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
      document.getElementById('visitor-game-q-index').innerText = `Вопрос ${qIndex + 1} из ${questionsCount}`;

      const tpl = branchTemplates[qIndex] || { text: "Вопрос викторины", options: ["Да", "Нет"], emojis: ["👍", "👎"], correct: 0 };
      textLabel.innerText = tpl.text;
      optionsBox.innerHTML = '';
      
      optionsBox.style.display = 'grid';
      optionsBox.style.gridTemplateColumns = tpl.options.length <= 2 ? '1fr' : 'repeat(2, 1fr)';
      optionsBox.style.gap = '12px';
      optionsBox.style.width = '100%';
      optionsBox.style.maxWidth = '340px';
      optionsBox.style.margin = '0 auto';

      tpl.options.forEach((opt, optIdx) => {
        const curEmoji = tpl.emojis[optIdx] || "❓";
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.style.cssText = 'padding: 16px 10px; font-size: 13px; font-weight: 700; border-radius: 14px; background: rgba(255, 255, 255, 0.06); border: 1.5px solid var(--border-light); color: #fff; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; transition: transform 0.1s, background 0.1s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
        btn.innerHTML = `
          <span class="option-btn-emoji" style="font-size:26px;">${curEmoji}</span>
          <span class="option-btn-text" style="font-size:12px; font-weight:700; text-align:center;">${opt}</span>
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

};

