// games/pro/31_game_battleship.js - Battleship Game (PRO)

export const battleshipMethods = {
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
};

