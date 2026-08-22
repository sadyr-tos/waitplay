// ES Module for Game #13: Башня Заведения 🏢 (Tower Stacker)

export function initTowerGame(totalPlayers = 4) {
  try {
    const branch = this.getVisitorConnectedBranch();
    const duration = (branch && branch.towerDuration) || this.state.towerDuration || 40;

    this.state.towerDuration = duration;
    this.state.towerTimeRemaining = duration;
    this.state.towerScore = 0; // count of stacked floors
    this.state.towerFinished = false;
    this.state.towerStarted = true;
    this.state.towerCombo = 0;
    this.state.towerSway = 0; // sway angle/offset

    // Block floor types (restaurant themed building blocks)
    this.state.towerBlockCatalog = [
      { icon: '🍔', label: 'Бургерная', bg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { icon: '🍕', label: 'Пиццерия', bg: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
      { icon: '☕', label: 'Кофейня', bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
      { icon: '🍹', label: 'Бар', bg: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { icon: '🍰', label: 'Кондитерская', bg: 'linear-gradient(135deg, #ec4899, #be185d)' },
      { icon: '🍣', label: 'Суши-бар', bg: 'linear-gradient(135deg, #10b981, #047857)' }
    ];

    // Initial base block
    this.state.towerFloors = [
      { x: 50, width: 70, icon: '🏛️', label: 'Основание', bg: 'linear-gradient(135deg, #374151, #1f2937)' }
    ];

    // Swinging hook state (percentage 10% to 90%)
    this.state.towerSwingPos = 50;
    this.state.towerSwingDir = 1;
    this.state.towerSwingSpeed = 1.8;

    // Generate bots with scores proportional to duration
    const botNames = ['Панда', 'Лиса', 'Медведь', 'Тигр', 'Лев', 'Зайка'];
    const botEmojis = ['🐼', '🦊', '🐻', '🐯', '🦁', '🐰'];
    this.state.towerBots = [];
    for (let i = 0; i < totalPlayers - 1; i++) {
      const idx = i % botNames.length;
      const botScore = Math.max(3, Math.floor(duration * 0.3 + Math.random() * duration * 0.4));
      this.state.towerBots.push({ name: botNames[idx], avatar: botEmojis[idx], score: botScore });
    }

    this.setVisitorViewPanel('game');

    const typeLabel = document.getElementById('visitor-game-type-label');
    if (typeLabel) typeLabel.innerText = 'БАШНЯ ЗАВЕДЕНИЯ 🏢';

    const scoreEl = document.getElementById('visitor-game-score');
    if (scoreEl) scoreEl.innerText = 'Этажей: 0';

    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) timerEl.innerText = `⏱ ${duration}с`;

    this.renderTowerGame();
    this.startTowerTimer();
    this.startTowerSwingLoop();

  } catch(e) {
    console.error('Error in initTowerGame:', e);
  }
}

export function startTowerTimer() {
  if (this.towerTimerInterval) clearInterval(this.towerTimerInterval);
  this.towerTimerInterval = setInterval(() => {
    if (!this.state.towerStarted || this.state.towerFinished) return;
    this.state.towerTimeRemaining--;

    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) timerEl.innerText = `⏱ ${this.state.towerTimeRemaining}с`;

    if (this.state.towerTimeRemaining <= 0) {
      clearInterval(this.towerTimerInterval);
      if (this.towerSwingInterval) clearInterval(this.towerSwingInterval);
      this.finishTowerGame();
    }
  }, 1000);
}

export function startTowerSwingLoop() {
  if (this.towerSwingInterval) clearInterval(this.towerSwingInterval);
  this.towerSwingInterval = setInterval(() => {
    if (!this.state.towerStarted || this.state.towerFinished) return;

    this.state.towerSwingPos += this.state.towerSwingDir * this.state.towerSwingSpeed;
    if (this.state.towerSwingPos >= 85) {
      this.state.towerSwingPos = 85;
      this.state.towerSwingDir = -1;
    } else if (this.state.towerSwingPos <= 15) {
      this.state.towerSwingPos = 15;
      this.state.towerSwingDir = 1;
    }

    // Update swinging block element on screen
    const hookEl = document.getElementById('tower-swing-block');
    if (hookEl) {
      hookEl.style.left = `${this.state.towerSwingPos}%`;
    }
  }, 20);
}

export function handleTowerDrop() {
  if (!this.state.towerStarted || this.state.towerFinished) return;

  const currentPos = this.state.towerSwingPos;
  const floors = this.state.towerFloors;
  const topFloor = floors[floors.length - 1];

  const diff = Math.abs(currentPos - topFloor.x);
  const catalog = this.state.towerBlockCatalog;
  const catalogItem = catalog[floors.length % catalog.length];

  let statusMsg = '';
  let statusColor = '#fff';

  if (diff <= 6) {
    // Perfect drop!
    this.state.towerCombo++;
    this.state.towerScore++;
    this.playAudioTone('victory');
    statusMsg = `🎯 PERFECT! x${this.state.towerCombo}`;
    statusColor = 'var(--gold)';
    
    // Add block with exact alignment
    floors.push({
      x: topFloor.x,
      width: Math.max(30, topFloor.width),
      icon: catalogItem.icon,
      label: catalogItem.label,
      bg: catalogItem.bg
    });
  } else if (diff <= 22) {
    // Good placement, slight offset & sway
    this.state.towerCombo = 0;
    this.state.towerScore++;
    this.playAudioTone('click');
    statusMsg = `👍 УСТОЯЛ!`;
    statusColor = '#60a5fa';

    // Calculate new reduced width and shifted center
    const newWidth = Math.max(25, topFloor.width - Math.floor(diff * 0.6));
    const newX = (currentPos + topFloor.x) / 2;

    floors.push({
      x: newX,
      width: newWidth,
      icon: catalogItem.icon,
      label: catalogItem.label,
      bg: catalogItem.bg
    });

    this.state.towerSway = (currentPos > topFloor.x ? 1 : -1) * (diff * 0.4);
  } else {
    // Missed/Crumble! Top floor crumbles off
    this.state.towerCombo = 0;
    this.playAudioTone('error');
    statusMsg = `💥 МИМО! Блок упал!`;
    statusColor = 'var(--error)';

    if (floors.length > 1) {
      floors.pop(); // Lose top floor
      if (this.state.towerScore > 0) this.state.towerScore--;
    }
  }

  // Update Score UI
  const scoreEl = document.getElementById('visitor-game-score');
  if (scoreEl) scoreEl.innerText = `Этажей: ${this.state.towerScore}`;

  // Show status popup
  this.showTowerStatusToast(statusMsg, statusColor);
  this.renderTowerGame();
}

export function showTowerStatusToast(msg, color) {
  const toast = document.getElementById('tower-status-toast');
  if (toast) {
    toast.innerText = msg;
    toast.style.color = color;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, -10px) scale(1.1)';
    clearTimeout(this.towerToastTimeout);
    this.towerToastTimeout = setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 0) scale(1)';
      }
    }, 800);
  }
}

export function renderTowerGame() {
  const optionsBox = document.getElementById('visitor-game-options');
  const textLabel = document.getElementById('visitor-game-question-text');
  if (!optionsBox || !textLabel) return;

  const playingBox = textLabel.closest('.game-playing-box');
  if (playingBox) {
    playingBox.style.justifyContent = 'flex-end';
    playingBox.style.alignItems = 'center';
    playingBox.style.padding = '10px 10px 20px 10px';
    playingBox.style.overflow = 'hidden';
  }

  textLabel.style.display = 'none';

  const floors = this.state.towerFloors || [];
  const nextCatalog = this.state.towerBlockCatalog;
  const nextItem = nextCatalog[floors.length % nextCatalog.length];

  // Render Stack Container with Swinging Crane
  let floorsHTML = '';
  // Show last 7 floors to prevent overflow
  const visibleFloors = floors.slice(Math.max(0, floors.length - 7));

  visibleFloors.forEach((f, idx) => {
    floorsHTML += `
      <div style="position:relative; left:${f.x}%; transform:translateX(-50%); width:${f.width}%; height:32px; background:${f.bg}; border:1.5px solid rgba(255,255,255,0.3); border-radius:8px; display:flex; align-items:center; justify-content:center; gap:6px; color:#fff; font-size:11px; font-weight:800; box-shadow:0 4px 10px rgba(0,0,0,0.3); margin-top:2px;">
        <span>${f.icon}</span>
        <span style="font-size:10px;">${f.label}</span>
      </div>
    `;
  });

  const swayAngle = (this.state.towerSway || 0);

  optionsBox.style.display = 'block';
  optionsBox.style.width = '100%';
  optionsBox.innerHTML = `
    <div style="position:relative; width:100%; height:260px; display:flex; flex-direction:column; justify-content:space-between; overflow:hidden; border-radius:14px; background:radial-gradient(circle, rgba(30,27,75,0.8), rgba(15,23,42,0.95)); border:1px solid var(--border-light); padding:10px 8px;">
      
      <!-- Toast feedback -->
      <div id="tower-status-toast" style="position:absolute; top:45px; left:50%; transform:translateX(-50%); font-size:13px; font-weight:900; opacity:0; transition:all 0.2s ease; z-index:10; pointer-events:none; text-shadow:0 2px 8px rgba(0,0,0,0.8);"></div>

      <!-- Crane & Swinging Block Header -->
      <div style="position:relative; width:100%; height:50px; border-bottom:1px dashed rgba(255,255,255,0.15);">
        <div style="position:absolute; top:0; left:50%; transform:translateX(-50%); width:2px; height:12px; background:var(--gold);"></div>
        
        <!-- Swinging Crane Block -->
        <div id="tower-swing-block" style="position:absolute; top:12px; left:${this.state.towerSwingPos}%; transform:translateX(-50%); width:60px; height:30px; background:${nextItem.bg}; border:1.5px solid rgba(255,255,255,0.4); border-radius:8px; display:flex; align-items:center; justify-content:center; gap:4px; color:#fff; font-size:10px; font-weight:800; box-shadow:0 0 12px ${nextItem.bg}; transition:left 0.02s linear;">
          <span>${nextItem.icon}</span>
        </div>
      </div>

      <!-- Tower Stack Area with Swaying Animation -->
      <div style="flex:1; display:flex; flex-direction:column-reverse; justify-content:flex-start; transform:rotate(${swayAngle}deg); transform-origin:bottom center; transition:transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); padding-bottom:6px;">
        ${floorsHTML}
      </div>

      <!-- Ergonomic Thumb Tap Drop Button -->
      <div style="width:100%; padding-top:6px;">
        <button class="btn btn-primary" onclick="app.handleTowerDrop()" style="width:92%; max-width:320px; margin:0 auto; display:flex; align-items:center; justify-content:center; gap:8px; padding:12px; font-size:14px; font-weight:900; background:linear-gradient(135deg, var(--gold), #d97706); box-shadow:0 6px 18px rgba(245,158,11,0.4); border-radius:14px; border:none; cursor:pointer;">
          🎯 СБРОСИТЬ ЭТАЖ
        </button>
      </div>

    </div>
  `;
}

export function finishTowerGame() {
  try {
    this.state.towerFinished = true;
    const userScore = this.state.towerScore || 0;
    const bots = this.state.towerBots || [];

    this.state.activeGameScore = userScore;

    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) timerEl.innerText = 'Результат!';

    this.playAudioTone('victory');

    // Find winner
    const allScores = bots.map(b => b.score);
    const maxBotScore = allScores.length > 0 ? Math.max(...allScores) : 0;
    const userWins = userScore > maxBotScore;
    const isDraw = !userWins && userScore === maxBotScore;

    const topBot = bots.sort((a, b) => b.score - a.score)[0];

    let resultIcon, resultTitle, resultColor, resultDetail;
    if (userWins) {
      resultIcon = '🏆';
      resultTitle = 'ВЫ ПОБЕДИЛИ!';
      resultColor = 'var(--gold)';
      resultDetail = `Ваш результат: <b style="color:var(--gold)">${userScore}</b> этажей 🏢`;
      this.playAudioTone('victory');
    } else if (isDraw) {
      resultIcon = '🤝';
      resultTitle = 'НИЧЬЯ!';
      resultColor = '#a78bfa';
      resultDetail = `Все построили по <b style="color:#a78bfa">${userScore}</b> этажей 🏢`;
    } else {
      resultIcon = '😔';
      resultTitle = 'НЕ ПОВЕЗЛО!';
      resultColor = 'var(--error)';
      resultDetail = topBot ? `${topBot.avatar} ${topBot.name} построил больше: <b>${topBot.score} этажей</b>` : `Вы построили: ${userScore} этажей`;
    }

    let boardRows = `
      <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.07);">
        <span style="font-size:10px;">👤 Вы</span>
        <span style="font-size:10px; font-weight:900; color:${userWins ? 'var(--gold)' : isDraw ? '#a78bfa' : 'var(--error)'}">${userScore}</span>
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

    const textLabel = document.getElementById('visitor-game-question-text');
    if (textLabel) {
      textLabel.style.display = 'block';
      textLabel.innerHTML = `
        <div style="text-align:center; padding:6px 0;">
          <div style="font-size:40px; margin-bottom:6px;">${resultIcon}</div>
          <div style="font-size:14px; font-weight:900; color:${resultColor}; margin-bottom:4px;">${resultTitle}</div>
          <div style="font-size:10px; color:var(--text-muted); margin-bottom:10px;">${resultDetail}</div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-light); border-radius:10px; padding:8px 10px; text-align:left;">
            <div style="font-size:9px; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Таблица Башни 🏢</div>
            ${boardRows}
          </div>
        </div>
      `;
    }

    this.setVisitorTimeout(() => {
      this.finishVisitorGame();
    }, 4500);
  } catch(e) {
    console.error('Error in finishTowerGame:', e);
    this.finishVisitorGame();
  }
}
