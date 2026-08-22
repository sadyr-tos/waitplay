// games/base/23_game_tictactoe.js - Tic-Tac-Toe Game

export const tictactoeMethods = {
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
};

