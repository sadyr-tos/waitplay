// games/pro/30_game_slicing.js - Slicing Game (PRO)

export const slicingMethods = {
  editSlicingGame() {
    try {
      this.setAdminPanelActiveView('edit-slicing');
    } catch(e) {
      console.error("Error in editSlicingGame:", e);
    }
  },

  saveSlicingConfig(key, value) {
    try {
      this.state[key] = value;
      if (this.state.email && this.state.activeBranchId) {
        this.state.databaseClients = this.state.databaseClients || [];
        const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === this.state.email.toLowerCase());
        if (client && client.branches) {
          const branch = client.branches.find(b => b.id === this.state.activeBranchId);
          if (branch) branch[key] = value;
        }
      }
      this.saveState();
    } catch(e) {
      console.error("Error in saveSlicingConfig:", e);
    }
  },

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
        if (val < (game.minPlayers || 2)) val = game.minPlayers || 2;
        if (val > 15) val = 15;
        game.maxPlayers = val;
        const el = document.getElementById('label-slicing-max-players');
        if (el) el.innerText = `${val} чел.`;
      }
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch(e) {
      console.error("Error in adjustSlicingPlayersLimit:", e);
    }
  },

  initSlicingGame(totalPlayers) {
    try {
      const branch = this.getVisitorConnectedBranch();
      const duration = (branch && branch.slicingDuration) || this.state.slicingDuration || 30;
      const item = (branch && branch.slicingItem) || this.state.slicingItem || 'bread';

      this.state.slicingDuration = duration;
      this.state.slicingItem = item;
      this.state.slicingTimeRemaining = duration;
      this.state.slicingCount = 0;
      this.state.slicingFinished = false;
      this.state.slicingStarted = true;
      this.state.slicingCountdown = 0;

      const items = {
        bread:    { emoji: '🍞', label: 'батон хлеба', color: '#f59e0b' },
        cucumber: { emoji: '🥒', label: 'огурец',      color: '#22c55e' },
        cake:     { emoji: '🎂', label: 'торт',        color: '#ec4899' },
        pizza:    { emoji: '🍕', label: 'пиццу',       color: '#ef4444' },
      };
      this.state.slicingItemMeta = items[item] || items.bread;

      const botNames = ['Панда', 'Лиса', 'Медведь', 'Тигр', 'Лев', 'Зайка', 'Обезьянка', 'Коала'];
      const botEmojis = ['🐼', '🦊', '🐻', '🐯', '🦁', '🐰', '🐵', '🐨'];
      this.state.slicingBots = [];
      for (let i = 0; i < totalPlayers - 1; i++) {
        const idx = i % botNames.length;
        const botScore = Math.floor(duration * 2 + Math.random() * duration * 4);
        this.state.slicingBots.push({ name: botNames[idx], avatar: botEmojis[idx], score: botScore });
      }

      this.setVisitorViewPanel('game');

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = 'НАРЕЗКА 🔪';

      const scoreEl = document.getElementById('visitor-game-score');
      if (scoreEl) scoreEl.innerText = 'Срезов: 0';

      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = `⏱ ${duration}с`;

      this.renderSlicingGame();
      this.startSlicingTimer();

    } catch(e) {
      console.error('Error in initSlicingGame:', e);
    }
  },

  startSlicingTimer() {
    if (this.slicingTimerInterval) clearInterval(this.slicingTimerInterval);
    this.slicingTimerInterval = setInterval(() => {
      if (!this.state.slicingStarted || this.state.slicingFinished) return;
      this.state.slicingTimeRemaining--;

      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = `⏱ ${this.state.slicingTimeRemaining}с`;

      this.renderSlicingGame();

      if (this.state.slicingTimeRemaining <= 0) {
        clearInterval(this.slicingTimerInterval);
        this.finishSlicingGame();
      }
    }, 1000);
  },

  handleSliceTap() {
    if (!this.state.slicingStarted || this.state.slicingFinished) return;
    this.state.slicingCount++;
    const count = this.state.slicingCount;
    const meta = this.state.slicingItemMeta || { color: '#22c55e' };

    // Update score badge
    const scoreEl = document.getElementById('visitor-game-score');
    if (scoreEl) scoreEl.innerText = `Срезов: ${count}`;

    // Update counter text in-place
    const countEl = document.getElementById('slicing-count-display');
    if (countEl) countEl.innerText = count;

    // Animate knife chopping down
    const knifeEl = document.getElementById('slicing-knife-emoji');
    const itemEl = document.getElementById('slicing-bread-emoji');

    if (knifeEl) {
      knifeEl.style.transform = 'translate(-20px, 32px) rotate(-10deg) scale(1.18)';
      setTimeout(() => {
        if (knifeEl) knifeEl.style.transform = 'rotate(-45deg) translate(0, 0) scale(1)';
      }, 75);
    }

    // Animate product squish
    if (itemEl) {
      itemEl.style.transform = 'scale(0.85, 0.72) rotate(-4deg)';
      itemEl.style.filter = `drop-shadow(0 2px 4px ${meta.color}88)`;
      setTimeout(() => {
        if (itemEl) {
          itemEl.style.transform = 'scale(1) rotate(0deg)';
          itemEl.style.filter = `drop-shadow(0 4px 8px ${meta.color}44)`;
        }
      }, 75);
    }

    // Update pieces row
    const piecesEl = document.getElementById('slicing-pieces-row');
    if (piecesEl && count <= 24) {
      const angle = (Math.random() * 30 - 15).toFixed(1);
      piecesEl.innerHTML += `<span style="font-size:14px;display:inline-block;transform:rotate(${angle}deg);margin:1px;">${meta.emoji || '🥒'}</span>`;
    }

    this.playAudioTone('click');
  },

  renderSlicingGame() {
    try {
      const textLabel = document.getElementById('visitor-game-question-text');
      const optionsBox = document.getElementById('visitor-game-options');
      if (!textLabel || !optionsBox) return;

      const meta = this.state.slicingItemMeta || { emoji: '🥒', label: 'огурец', color: '#22c55e' };
      const count = this.state.slicingCount || 0;
      const duration = this.state.slicingDuration || 30;
      const timeLeft = this.state.slicingTimeRemaining !== undefined ? this.state.slicingTimeRemaining : duration;
      const finished = this.state.slicingFinished;

      // Always keep correct label
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel && !finished) typeLabel.innerText = 'НАРЕЗКА 🔪';

      if (finished) {
        textLabel.innerHTML = `
          <div style="text-align:center; padding:10px;">
            <div style="font-size:42px; margin-bottom:8px;">✂️</div>
            <div style="font-size:13px; font-weight:900; color:var(--gold);">ВРЕМЯ ВЫШЛО!</div>
            <div style="font-size:28px; font-weight:900; color:#fff; margin:8px 0;">${count} <span style="font-size:14px; color:var(--text-muted);">срезов</span></div>
            <div style="font-size:10px; color:var(--text-muted);">Считаем результаты...</div>
          </div>
        `;
        optionsBox.innerHTML = '';
        return;
      }

      const timerPct = Math.max(0, (timeLeft / duration) * 100);
      const timerColor = timeLeft <= 5 ? 'var(--error)' : meta.color;

      textLabel.innerHTML = `
        <div style="text-align:center; padding:5px 0; display:flex; flex-direction:column; align-items:center;">
          <!-- Timer bar -->
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-bottom:12px; overflow:hidden;">
            <div style="width:${timerPct}%; height:100%; background:${timerColor}; border-radius:3px; transition:width 0.9s linear;"></div>
          </div>

          <!-- Cutting stage: Knife + Product -->
          <div style="position:relative; width:120px; height:100px; display:flex; justify-content:center; align-items:center; margin:10px auto;">
            <!-- Knife -->
            <div id="slicing-knife-emoji" style="font-size:44px; position:absolute; top:-25px; right:15px; transform:rotate(-45deg); transition:transform 0.06s ease-out; z-index:10; pointer-events:none;">
              🔪
            </div>
            <!-- Product -->
            <div id="slicing-bread-emoji" style="font-size:76px; filter: drop-shadow(0 4px 8px ${meta.color}44); transition: transform 0.06s ease-out, filter 0.06s; display:inline-block;">
              ${meta.emoji}
            </div>
          </div>

          <!-- Slice count -->
          <div style="font-size:36px; font-weight:900; color:${meta.color}; text-shadow:0 0 12px ${meta.color}88; margin:2px 0;">
            <span id="slicing-count-display">${count}</span>
          </div>
          <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">срезов</div>

          <!-- Cut pieces row -->
          <div id="slicing-pieces-row" style="margin-top:8px; line-height:1.3; min-height:22px; width:100%; text-align:center;"></div>
        </div>
      `;

      // Build centered ergonomic button
      if (!optionsBox.querySelector('#slice-tap-btn')) {
        optionsBox.style.display = 'flex';
        optionsBox.style.flexDirection = 'column';
        optionsBox.style.alignItems = 'center';
        optionsBox.style.justifyContent = 'center';
        optionsBox.style.width = '100%';
        optionsBox.style.marginTop = '15px';

        optionsBox.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; box-sizing:border-box;">
            <button
              id="slice-tap-btn"
              onclick="app.handleSliceTap()"
              ontouchstart="app.handleSliceTap(); return false;"
              style="
                width:92%; max-width:320px; margin:0 auto; padding:22px 0; font-size:26px; font-weight:900;
                background:linear-gradient(135deg, ${meta.color}, ${meta.color}bb);
                border:3px solid ${meta.color};
                border-radius:24px;
                box-shadow: 0 0 25px ${meta.color}66, 0 8px 20px rgba(0,0,0,0.4);
                color:#fff; cursor:pointer; text-align:center;
                transition: transform 0.06s, box-shadow 0.06s;
                user-select:none; -webkit-user-select:none; -webkit-tap-highlight-color:transparent;
              "
              onmousedown="this.style.transform='scale(0.93)'; this.style.boxShadow='0 0 8px ${meta.color}33';"
              onmouseup="this.style.transform='scale(1)'; this.style.boxShadow='0 0 25px ${meta.color}66, 0 8px 20px rgba(0,0,0,0.4)';"
              ontouchend="this.style.transform='scale(1)';"
            >
              🔪 РЕЗАТЬ!
            </button>
            <div style="font-size:9px; color:var(--text-muted); margin-top:8px; text-align:center;">Нажимай как можно быстрее любой рукой!</div>
          </div>
        `;
      }
    } catch(e) {
      console.error('Error in renderSlicingGame:', e);
    }
  },

  finishSlicingGame() {
    try {
      this.state.slicingFinished = true;
      const userCount = this.state.slicingCount || 0;
      const bots = this.state.slicingBots || [];

      this.state.activeGameScore = userCount;
      this.renderSlicingGame();

      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = 'Результат!';

      this.playAudioTone('victory');

      this.setVisitorTimeout(() => {
        const typeLabel = document.getElementById('visitor-game-type-label');
        if (typeLabel) typeLabel.innerText = 'ИТОГ НАРЕЗКИ 🔪';

        const meta = this.state.slicingItemMeta || { emoji: '🍞', color: '#f59e0b' };
        const textLabel = document.getElementById('visitor-game-question-text');
        const optionsBox = document.getElementById('visitor-game-options');
        if (optionsBox) optionsBox.innerHTML = '';

        const allScores = bots.map(b => b.score);
        const maxBotScore = allScores.length > 0 ? Math.max(...allScores) : 0;
        const userWins = userCount > maxBotScore;
        const isDraw = !userWins && userCount === maxBotScore;

        const topBot = bots.sort((a, b) => b.score - a.score)[0];

        let resultIcon, resultTitle, resultColor, resultDetail;
        if (userWins) {
          resultIcon = '🏆';
          resultTitle = 'ВЫ ПОБЕДИЛИ!';
          resultColor = 'var(--gold)';
          resultDetail = `Ваш результат: <b style="color:var(--gold)">${userCount}</b> срезов`;
          this.playAudioTone('victory');
        } else if (isDraw) {
          resultIcon = '🤝';
          resultTitle = 'НИЧЬЯ!';
          resultColor = '#a78bfa';
          resultDetail = `Все набрали по <b style="color:#a78bfa">${userCount}</b> срезов`;
        } else {
          resultIcon = '😔';
          resultTitle = 'НЕ ПОВЕЗЛО!';
          resultColor = 'var(--error)';
          resultDetail = topBot ? `${topBot.avatar} ${topBot.name} нарезал больше: <b>${topBot.score}</b>` : `Вы нарезали: ${userCount}`;
        }

        let boardRows = `
          <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.07);">
            <span style="font-size:10px;">👤 Вы</span>
            <span style="font-size:10px; font-weight:900; color:${userWins ? 'var(--gold)' : isDraw ? '#a78bfa' : 'var(--error)'}">${userCount}</span>
          </div>
        `;
        bots.slice(0, 5).forEach(b => {
          const isTopBot = topBot && b.name === topBot.name;
          boardRows += `
            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="font-size:10px;">${b.avatar} ${b.name}</span>
              <span style="font-size:10px; font-weight:700; color:${isTopBot && !userWins ? 'var(--gold)' : 'var(--text-muted)'}">${b.score}</span>
            </div>
          `;
        });

        if (textLabel) {
          textLabel.innerHTML = `
            <div style="text-align:center; padding:6px 0;">
              <div style="font-size:40px; margin-bottom:6px;">${resultIcon}</div>
              <div style="font-size:14px; font-weight:900; color:${resultColor}; margin-bottom:4px;">${resultTitle}</div>
              <div style="font-size:10px; color:var(--text-muted); margin-bottom:10px;">${resultDetail}</div>
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-light); border-radius:10px; padding:8px 10px; text-align:left;">
                <div style="font-size:9px; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Таблица срезов</div>
                ${boardRows}
              </div>
            </div>
          `;
        }

        this.setVisitorTimeout(() => {
          this.finishVisitorGame();
        }, 5000);
      }, 1500);
    } catch(e) {
      console.error('Error in finishSlicingGame:', e);
      this.finishVisitorGame();
    }
  }
};
