// games/base/22_game_differences.js - Spot Differences Game

export const differencesMethods = {
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

};

