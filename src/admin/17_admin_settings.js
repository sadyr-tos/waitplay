// admin/17_admin_settings.js - Admin Settings View

export const adminSettingsMethods = {
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

    const discBtn = document.getElementById('btn-visitor-disconnect');
    if (discBtn) {
      discBtn.style.display = (finalPanelId === 'locked' || finalPanelId === 'maintenance' || finalPanelId === 'disconnected' || finalPanelId === 'gps-check' || finalPanelId === 'disclaimer') ? 'none' : 'block';
    }

    if (finalPanelId === 'lockout') {
      this.updateVisitorLockout();
    }
  }

  showGameRules(gameId, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    let icon = "📋";
    let title = "Правила игры";
    let content = "Описание правил игры...";
    
    const branch = this.getVisitorConnectedBranch();
    const diff = branch && branch.tttDifficulty ? branch.tttDifficulty : this.state.tttDifficulty;
    const size = branch && branch.tttTournamentSize ? branch.tttTournamentSize : this.state.tttTournamentSize;
    
    if (gameId === 1) {
      icon = "🎯";
      title = "Викторина (Квиз)";
      
      const branchTemplates = branch && branch.templates ? branch.templates : this.state.templates;
      const questionsCount = branchTemplates.length;
      
      content = `⚡ <b>Правило:</b> кто первый нажимает правильный ответ — тому и балл!<br><br>• Всего вопросов: <b>${questionsCount}</b><br>• Вы играете против других посетителей заведения.<br>• Игра проходит быстро: после ответа раунд моментально завершается.<br>• Главный приз получает только победитель, занявший 1-е место!`;
    } else if (gameId === 2) {
      icon = "🔍";
      title = "Найди отличия (Смайлики)";
      
      const rounds = branch && branch.diffRounds ? branch.diffRounds : (this.state.diffRounds || 6);
      const gridSize = branch && branch.diffGridSize ? branch.diffGridSize : (this.state.diffGridSize || 'normal');
      const gridText = gridSize === 'easy' ? '4x4' : (gridSize === 'hard' ? '8x8' : '6x6');
      
      content = `🔍 <b>Найди лишнее:</b> соревнование на внимательность и реакцию!<br><br>• В каждом раунде на экране появляется сетка смайликов размера <b>${gridText}</b>.<br>• Среди них есть ровно <b>один отличающийся</b>.<br>• Кто первый найдет и нажмет на него — получает 1 балл.<br>• Раунд завершается сразу после верного нажатия кем-либо.<br>• Всего игра длится <b>${rounds} раундов</b>.<br>• Тот, кто наберет больше всего баллов по итогам раундов, выигрывает приз!`;
    } else if (gameId === 3) {
      icon = "🏃";
      title = "Гонка Стикменов";
      const distText = branch && branch.stickmanRaceLength ? branch.stickmanRaceLength : (this.state.stickmanRaceLength || 50);
      const obsText = branch && branch.stickmanRaceObstacles ? branch.stickmanRaceObstacles : (this.state.stickmanRaceObstacles || 'medium');
      const obsLabel = obsText === 'none' ? 'Без препятствий' : (obsText === 'extreme' ? 'Ураган препятствий 🌪️🚧' : (obsText === 'high' ? 'Много препятствий 🚧' : 'Средняя частота 🚧'));

      content = `🏃 <b>Гонка Стикменов:</b> динамический забег на скорость и уклонение!<br><br>• Дистанция гонки: <b>${distText} метров</b>.<br>• Препятствия: <b>${obsLabel}</b>.<br>• Вы соревнуетесь с другими гостями в реальном времени.<br>• ⚡ <b>Автоматический бег:</b> ваш стикмен постоянно бежит вперед (вверх) сам по себе!<br>• ⬅️➡️ <b>Управление:</b> нажимайте кнопки <b>«ВЛЕВО»</b> и <b>«ВПРАВО»</b> на экране (или стрелочки на клавиатуре / клавиши A и D), чтобы менять дорожки.<br>• 🚧 <b>Препятствия:</b> оббегайте барьеры, перестраиваясь на свободные дорожки. Если врежетесь в барьер, то упадете на 1.5 сек и отстанете от соперников!`;
    } else if (gameId === 4) {
      icon = "❌⭕";
      title = "Крестики-Нолики (Турнир)";
      
      const diffText = diff === 'easy' ? 'Легко' : (diff === 'hard' ? 'Гроссмейстер' : 'Средне');
      const sizePlayers = size || 8;
      const winsNeeded = sizePlayers === 8 ? 3 : 4;
      
      content = `🏆 <b>Сетка Плей-Офф:</b> кубковый турнир на выбывание!<br><br>• Уровень сложности: <b>${diffText}</b>.<br>• Всего участников: <b>${sizePlayers}</b>.<br>• Вы играете против других гостей заведения.<br>• Чтобы забрать главный приз, нужно выиграть <b>${winsNeeded} матчей подряд</b> (пройти все круги до финала).<br>• При ничьей раунд переигрывается.<br>• Одно поражение — и вы выбываете!`;
    } else if (gameId === 5) {
      icon = "📝";
      title = "Кроссворд (Турнир)";
      
      const difficultyText = diff === 'easy' ? 'Легко' : (diff === 'hard' ? 'Сложно' : 'Средне');
      const timeLimitText = branch && branch.crosswordTimeLimit !== undefined ? branch.crosswordTimeLimit : (this.state.crosswordTimeLimit || 5);
      
      content = `📝 <b>Кроссворд:</b> интеллектуальный турнир на скорость разгадывания слов!<br><br>• Уровень сложности: <b>${difficultyText}</b>.<br>• Лимит времени: <b>${timeLimitText} минут</b>.<br>• Вы играете против других гостей заведения в реальном времени.<br>• Кликайте по ячейкам сетки или списку вопросов и вводите ответы.<br>• ⚠️ Буквы вписываются в сетку только при вводе <b>абсолютно правильного</b> ответа.<br>• Победителем признается тот, кто первым отгадает все слова кроссворда!<br>• Если никто не успеет отгадать все слова за отведенное время, победит участник с наибольшим количеством отгаданных слов.`;
    } else if (gameId === 6) {
      icon = "🧠";
      title = "Мемори";
      
      const theme = branch && branch.memoryTheme ? branch.memoryTheme : (this.state.memoryTheme || 'restaurant');
      const diff = branch && branch.memoryDifficulty ? branch.memoryDifficulty : (this.state.memoryDifficulty || 'normal');
      const themeText = theme === 'restaurant' ? 'Ресторан 🍕' : (theme === 'animals' ? 'Животные 🐼' : 'Смешанная 🔮');
      const diffText = diff === 'easy' ? 'Легко (сетка 3x4, 12 карт)' : (diff === 'hard' ? 'Сложно (сетка 4x5, 20 карт)' : 'Средне (сетка 4x4, 16 карт)');
      const timeLimitText = branch && branch.memoryTimeLimit ? branch.memoryTimeLimit : (this.state.memoryTimeLimit || 60);

      content = `🧠 <b>Мемори:</b> увлекательная битва ума на тренировку памяти!<br><br>• Уровень сложности: <b>${diffText}</b>.<br>• Тематика: <b>${themeText}</b>.<br>• Лимит времени: <b>${timeLimitText} секунд</b>.<br>• Переворачивайте карточки по две штуки и находите одинаковые пары.<br>• Если карточки совпали — они остаются открытыми, и вы получаете 1 пару в свой актив.<br>• Вы соревнуетесь с другими гостями в реальном времени.<br>• Победителем признается тот, кто найдет больше всего пар!`;
    } else if (gameId === 10) {
      icon = "🗣️";
      title = "Поле Чудес";
      content = `🗣️ <b>Поле Чудес:</b> классическая игра-угадайка слов по буквам против ботов-посетителей!<br><br>• Вы и соперники ходите по очереди.<br>• В свой ход вы должны ввести одну букву. На это дается ровно <b>10 секунд</b>.<br>• При правильном ответе вы ходите снова, а таймер сбрасывается.<br>• При промахе или тайм-ауте ход переходит следующему.<br>• ⚠️ Клавиши названных букв <b>не блокируются</b>. Будьте внимательны и не повторяйте названные буквы, иначе ход сгорит!<br>• Вы можете назвать слово целиком в свой ход, нажав соответствующую кнопку. Но будьте аккуратны — при ошибке ход сгорит.`;
    } else if (gameId === 11) {
      icon = "🏁";
      title = "Шашки";
      const turnLimitText = branch && branch.checkersTurnLimit !== undefined ? branch.checkersTurnLimit : (this.state.checkersTurnLimit || 'none');
      const limitDesc = turnLimitText === 'none' ? 'Без лимита' : `${turnLimitText} секунд`;

      content = `🏁 <b>Русские Шашки:</b> классическая настольная битва умов 1 на 1!<br><br>• Вы играете белыми фигурами и ходите первыми.<br>• Лимит времени на ход: <b>${limitDesc}</b>.<br>• Обычные шашки ходят по диагонали вперед, а бьют <b>вперед и назад</b>, перепрыгивая через шашку соперника.<br>• ⚠️ <b>Взятие обязательно!</b> Если вы можете срубить шашку противника, обычные ходы блокируются.<br>• При достижении края доски шашка превращается в Дамку.<br>• 👑 <b>Летающая дамка</b> ходит и бьет на любое расстояние по свободным диагоналям.<br>• Игра заканчивается, когда у одного из игроков закончатся шашки или ходы.`;
    } else if (gameId === 12) {
      icon = "♟️";
      title = "Шахматы";
      content = `♟️ <b>Шахматы:</b> классическая дуэль королей 1 на 1!<br><br>• Уровень сложности: <b>PRO</b>.<br>• Игра временно находится в режиме разработки.<br>• Совсем скоро здесь появится полноценная шахматная партия с умным ботом и PvP!`;
    } else {
      icon = "🎮";
      title = "Игровой шаблон";
      content = `🔧 <b>Скоро открытие:</b> эта игра временно находится в режиме разработки.<br><br>• Совсем скоро здесь появится новое увлекательное соревнование для гостей заведения!`;
    }
    
    // Add technical works banner if testing mode is active
    const isTesting = this.state.manualTestingMode || (branch && branch.manualTestingMode);
    if (isTesting) {
      content = `<div style="background:rgba(239, 68, 68, 0.15); border:1.5px solid #ef4444; border-radius:10px; padding:10px; margin-bottom:12px; font-size:10px; color:#f87171; font-weight:700; text-align:center; display:flex; align-items:center; justify-content:center; gap:6px;">
        🛠️ Идут технические работы. Игра временно недоступна!
      </div>` + content;
    }
    
    const modal = document.getElementById('visitor-rules-modal');
    const iconEl = document.getElementById('visitor-rules-icon');
    const titleEl = document.getElementById('visitor-rules-title');
    const contentEl = document.getElementById('visitor-rules-content');
    
    if (modal && iconEl && titleEl && contentEl) {
      iconEl.innerText = icon;
      titleEl.innerText = title;
      contentEl.innerHTML = content;
      modal.classList.add('active');
    }
  }

  closeVisitorRulesModal() {
    const modal = document.getElementById('visitor-rules-modal');
    if (modal) modal.classList.remove('active');
  }

  resetVisitorSession() {
    this.state.visitorGamesPlayed = 0;
    this.state.visitorLockoutUntil = 0;
    this.saveState();
    this.setVisitorViewPanel('lobby');
    this.initVisitorLobby();
    this.showVisitorToast("Сессия гостя сброшена.", false);
  }

  registerVisitorTimeout(tId) {
    if (!tId) return;
    this.state.visitorTimeouts = this.state.visitorTimeouts || [];
    this.state.visitorTimeouts.push(tId);
  }

  setVisitorTimeout(callback, delay) {
    const t = setTimeout(() => {
      if (this.state.visitorActiveView !== 'game') return;
      callback();
    }, delay);
    this.registerVisitorTimeout(t);
    return t;
  }

  clearAllVisitorGameTimers() {
    try {
      if (this.state.visitorTimeouts && Array.isArray(this.state.visitorTimeouts)) {
        this.state.visitorTimeouts.forEach(tId => clearTimeout(tId));
        this.state.visitorTimeouts = [];
      }
      clearInterval(this.state.guessWordTimer);
      clearInterval(this.state.gameRunningInterval);
      clearTimeout(this.state.demoTimer);
      clearInterval(this.state.lobbyCountdown);
      clearInterval(this.state.lobbyJoinInterval);
      if (typeof this.clearTTTTurnTimer === 'function') {
        this.clearTTTTurnTimer();
      }
      if (typeof this.clearRaceTimers === 'function') {
        this.clearRaceTimers();
      }
      this.state.guessWordPlayers = [];
      this.state.tttTournament = null;
    } catch(e) {
      console.error("Error in clearAllVisitorGameTimers:", e);
    }
  }

  visitorDisconnect() {
    this.clearAllVisitorGameTimers();
    const titleEl = document.getElementById('visitor-venue-title');
    if (titleEl) titleEl.innerText = "WaitPlay";
    this.setVisitorViewPanel('locked');
    this.showVisitorToast("Сессия отключена. Отсканируйте QR-код заново.", false);
  }

  visitorExitActiveGame() {
    try {
      this.clearAllVisitorGameTimers();
      this.setVisitorViewPanel('lobby');
      this.initVisitorLobby();
      this.showVisitorToast("Вы вышли из игры.", false);
    } catch(e) {
      console.error("Error in visitorExitActiveGame:", e);
    }
  }

  visitorExitActiveGameToLobby() {
    try {
      this.clearAllVisitorGameTimers();
      
      const branch = this.getVisitorConnectedBranch();
      const maxGames = branch && branch.limitGames !== undefined ? branch.limitGames : 2;
      const lockoutHours = branch && branch.limitHours !== undefined ? branch.limitHours : 3;

      this.state.visitorGamesPlayed++;
      
      if (maxGames !== 999 && this.state.visitorGamesPlayed >= maxGames) {
        if (lockoutHours > 0) {
          this.state.visitorLockoutUntil = Date.now() + (lockoutHours * 60 * 60 * 1000);
          this.setVisitorViewPanel('lockout');
          this.showVisitorToast("Игра завершена. Лимит игр исчерпан.", false);
        } else {
          this.state.visitorGamesPlayed = 0;
          this.state.visitorLockoutUntil = 0;
          this.setVisitorViewPanel('lobby');
          this.initVisitorLobby();
        }
      } else {
        this.setVisitorViewPanel('lobby');
        this.initVisitorLobby();
};

