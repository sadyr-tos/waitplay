// games/pro/29_game_subway.js - Subway Run Game (PRO)

export const subwayMethods = {
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
};

