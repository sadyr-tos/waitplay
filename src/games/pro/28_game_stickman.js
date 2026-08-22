// games/pro/28_game_stickman.js - Stickman Race Game (PRO)

export const stickmanMethods = {
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

};

