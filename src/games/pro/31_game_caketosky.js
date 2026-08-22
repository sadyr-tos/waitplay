// ES Module for Game #7: Торт до небес 🎂 (Cake to Sky PRO Game)

export function initCakeToSkyGame(totalPlayers = 4) {
  try {
    const branch = this.getVisitorConnectedBranch();
    const duration = (branch && branch.cakeDuration !== undefined) ? branch.cakeDuration : (this.state.cakeDuration !== undefined ? this.state.cakeDuration : 40);
    const speedLevel = (branch && branch.cakeSpeed) || this.state.cakeSpeed || 5;

    this.state.cakeDuration = duration;
    this.state.cakeSpeed = speedLevel;
    this.state.cakeTimeRemaining = duration;
    this.state.cakeScore = 0;
    this.state.cakeFinished = false;
    this.state.cakeStarted = true;
    this.state.cakeCombo = 0;
    this.state.cakeFallingMiss = null;
    if (this.cakeFallingMissTimeout) clearTimeout(this.cakeFallingMissTimeout);

    // Compact 3D Round Cake Tiers Catalog with CONSTANT width (26%)
    this.state.cakeTierCatalog = [
      { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #451a03 23%, #78350f 100%)', border: '#b45309', topping: '🍒' },
      { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #be123c 23%, #fb7185 100%)', border: '#f43f5e', topping: '🍓' },
      { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #d97706 23%, #fde047 100%)', border: '#eab308', topping: '🍋' },
      { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #4c1d95 23%, #a855f7 100%)', border: '#8b5cf6', topping: '🫐' },
      { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #f59e0b 23%, #fef08a 100%)', border: '#f59e0b', topping: '🕯️' }
    ];

    // Compact 3D silver cake platter base centered at 50% X with constant 32% width (~90px, NO text!)
    this.state.cakeFloors = [
      { x: 50, width: 32, bg: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, #475569 100%)', topping: '', isBase: true }
    ];

    this.state.cakeSwingPos = 50;
    this.state.cakeSwingDir = 1;

    const targetBotBase = duration > 0 ? duration : 40;
    const botNames = ['Панда', 'Лиса', 'Медведь', 'Тигр', 'Лев', 'Зайка'];
    const botEmojis = ['🐼', '🦊', '🐻', '🐯', '🦁', '🐰'];
    this.state.cakeBots = [];
    for (let i = 0; i < totalPlayers - 1; i++) {
      const idx = i % botNames.length;
      const botScore = Math.max(3, Math.floor(targetBotBase * 0.35 + Math.random() * targetBotBase * 0.45));
      this.state.cakeBots.push({ name: botNames[idx], avatar: botEmojis[idx], score: botScore });
    }

    this.setVisitorViewPanel('game');

    const typeLabel = document.getElementById('visitor-game-type-label');
    if (typeLabel) typeLabel.innerText = 'ТОРТ ДО НЕБЕС 🎂';

    const scoreEl = document.getElementById('visitor-game-score');
    if (scoreEl) scoreEl.innerText = 'Ярусов: 0';

    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) timerEl.innerText = duration === 0 ? '⏱ ♾️' : `⏱ ${duration}с`;

    // Completely hide bottom players container during gameplay
    const playersBox = document.getElementById('visitor-game-players-box');
    if (playersBox) playersBox.style.display = 'none';

    this.renderCakeToSkyGame();
    this.startCakeTimer();
    this.startCakeSwingLoop();

  } catch(e) {
    console.error('Error in initCakeToSkyGame:', e);
  }
}

export function startCakeTimer() {
  if (this.cakeTimerInterval) clearInterval(this.cakeTimerInterval);
  if (!this.state.cakeDuration || this.state.cakeDuration === 0) {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) timerEl.innerText = '⏱ ♾️';
    return;
  }

  this.cakeTimerInterval = setInterval(() => {
    if (!this.state.cakeStarted || this.state.cakeFinished) return;
    this.state.cakeTimeRemaining--;

    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) timerEl.innerText = `⏱ ${this.state.cakeTimeRemaining}с`;

    if (this.state.cakeTimeRemaining <= 0) {
      clearInterval(this.cakeTimerInterval);
      if (this.cakeSwingInterval) clearInterval(this.cakeSwingInterval);
      this.finishCakeToSkyGame();
    }
  }, 1000);
}

export function startCakeSwingLoop() {
  if (this.cakeSwingInterval) clearInterval(this.cakeSwingInterval);
  this.cakeSwingInterval = setInterval(() => {
    if (!this.state.cakeStarted || this.state.cakeFinished) return;

    // Dynamically calculate speed level on each frame
    const branch = this.getVisitorConnectedBranch();
    const speedLevel = (branch && branch.cakeSpeed) || this.state.cakeSpeed || 5;
    const currentSpeed = 0.3 + (speedLevel - 1) * 0.45; // Level 1: 0.3 (snail pace!), Level 5: 2.1 (normal), Level 10: 4.35 (fast)

    // Swing tongs across full width (5% to 95%)
    this.state.cakeSwingPos += this.state.cakeSwingDir * currentSpeed;
    if (this.state.cakeSwingPos >= 95) {
      this.state.cakeSwingPos = 95;
      this.state.cakeSwingDir = -1;
    } else if (this.state.cakeSwingPos <= 5) {
      this.state.cakeSwingPos = 5;
      this.state.cakeSwingDir = 1;
    }

    const hookEl = document.getElementById('cake-swing-tongs');
    if (hookEl) {
      hookEl.style.left = `${this.state.cakeSwingPos}%`;
    }
  }, 20);
}

export function handleCakeDrop() {
  if (!this.state.cakeStarted || this.state.cakeFinished) return;

  // Instantly clear any previously active falling miss or collapse animation when player drops a new tier!
  if (this.cakeFallingMissTimeout) {
    clearTimeout(this.cakeFallingMissTimeout);
    this.cakeFallingMissTimeout = null;
  }
  if (this.state.cakeFallingMiss) {
    this.state.cakeFallingMiss = null;
  }

  const currentPos = this.state.cakeSwingPos; // exact X coordinate of tongs at tap
  const floors = this.state.cakeFloors;
  const topFloor = floors[floors.length - 1];

  // REAL-TIME VISUAL X & Y POSITION OF TOP TIER USING getBoundingClientRect()!
  let realTopX = topFloor.x;
  let topTierY_px = 250;
  const stackContainer = document.getElementById('cake-tower-stack-container');
  if (stackContainer) {
    const arena = stackContainer.parentElement;
    const topTierDiv = stackContainer.lastElementChild;
    if (arena && topTierDiv) {
      const arenaRect = arena.getBoundingClientRect();
      const topTierRect = topTierDiv.getBoundingClientRect();
      if (arenaRect.width > 0) {
        const topTierCenterX = topTierRect.left + topTierRect.width / 2.0;
        const arenaLeft = arenaRect.left;
        realTopX = ((topTierCenterX - arenaLeft) / arenaRect.width) * 100;
        topTierY_px = topTierRect.top - arenaRect.top;
      }
    }
  }

  const diff = Math.abs(currentPos - realTopX);
  const CONSTANT_TIER_WIDTH = 26;
  const HALF_TIER_WIDTH = CONSTANT_TIER_WIDTH / 2.0; // 13%
  const maxAllowedDiff = HALF_TIER_WIDTH + 4; // 17% tolerance limit for edge touch

  const overlapWidth = Math.max(0, CONSTANT_TIER_WIDTH - diff);
  const isOverhangTopple = overlapWidth < HALF_TIER_WIDTH;

  const catalog = this.state.cakeTierCatalog;
  const catalogItem = catalog[floors.length % catalog.length];

  let statusMsg = '';
  let statusColor = '#fff';

  if (diff <= 3.5) {
    // PERFECT CENTERED DROP ON VISUAL TOWER TOP!
    this.state.cakeCombo++;
    this.state.cakeScore++;
    this.playAudioTone('victory');
    statusMsg = `🎯 PERFECT! x${this.state.cakeCombo}`;
    statusColor = 'var(--gold)';
    
    floors.push({
      x: topFloor.x + (currentPos - realTopX),
      width: CONSTANT_TIER_WIDTH,
      bg: catalogItem.bg,
      topping: catalogItem.topping,
      isNew: true
    });

    const scoreEl = document.getElementById('visitor-game-score');
    if (scoreEl) scoreEl.innerText = `Ярусов: ${this.state.cakeScore}`;
    this.showCakeStatusToast(statusMsg, statusColor);
    this.renderCakeToSkyGame();

  } else if (diff <= maxAllowedDiff) {
    // CAKE LANDED ON TOWER TOP (EDGE TOUCH OR SUPPORTED OVERLAP)!
    const offset = (currentPos - realTopX);
    const newX = topFloor.x + offset;

    const newTier = {
      x: newX,
      width: CONSTANT_TIER_WIDTH,
      bg: catalogItem.bg,
      topping: catalogItem.topping,
      isNew: true
    };
    floors.push(newTier);

    // 1. CHECK FOR 4-TIER STAIRCASE OVERHANG COLLAPSE FIRST (BEFORE SINGLE OVERHANG CHECK!)
    const totalTiers = floors.length - 1; // dropped cake tiers
    if (totalTiers >= 4) {
      const f0 = floors[totalTiers - 3];
      const f1 = floors[totalTiers - 2];
      const f2 = floors[totalTiers - 1];
      const f3 = floors[totalTiers];

      const d1 = f1.x - f0.x;
      const d2 = f2.x - f1.x;
      const d3 = f3.x - f2.x;

      const sameRight = d1 > 1.0 && d2 > 1.0 && d3 > 1.0;
      const sameLeft = d1 < -1.0 && d2 < -1.0 && d3 < -1.0;

      if (sameRight || sameLeft) {
        // 4-TIER STAIRCASE COLLAPSE TRIGGERED!
        this.state.cakeCombo = 0;
        this.renderCakeToSkyGame(); // render 4th cake landing on top for 280ms impact

        setTimeout(() => {
          if (this.state.cakeFinished) return;

          this.playAudioTone('error');
          this.showCakeStatusToast(`💥 ОБВАЛ ЛЕСЕНКИ! 4 яруса рухнули!`, 'var(--error)');

          // Remove top 4 overhanging tiers from tower
          const c4 = floors.pop();
          const c3 = floors.pop();
          const c2 = floors.pop();
          const c1 = floors.pop();

          this.state.cakeScore = Math.max(0, floors.length - 1);

          this.state.cakeFallingMiss = {
            x: c1 ? c1.x : currentPos,
            topPx: topTierY_px,
            dir: d3 > 0 ? 1 : -1,
            isStaircaseCollapse: true,
            tiers: [
              { x: c1.x, bg: c1.bg, topping: c1.topping },
              { x: c2.x, bg: c2.bg, topping: c2.topping },
              { x: c3.x, bg: c3.bg, topping: c3.topping },
              { x: c4.x, bg: c4.bg, topping: c4.topping }
            ]
          };

          const scoreEl2 = document.getElementById('visitor-game-score');
          if (scoreEl2) scoreEl2.innerText = `Ярусов: ${this.state.cakeScore}`;

          this.renderCakeToSkyGame();

          this.cakeFallingMissTimeout = setTimeout(() => {
            this.state.cakeFallingMiss = null;
            this.renderCakeToSkyGame();
          }, 1300);
        }, 280); // 280ms impact delay
        return;
      }
    }

    // 2. IF NOT A STAIRCASE COLLAPSE, CHECK IF THIS SINGLE TIER IS UNSTABLE (< 50% OVERLAP):
    if (isOverhangTopple) {
      // CASE B: INSTANT CONTINUOUS FLUID OVERHANG FLIP TOPPLE (< 50% OVERLAP)
      // Cake drops from tongs, hits edge at topTierY_px (tilts 25°), and tumbles down smoothly in ONE FLUID ANIMATION! No 280ms freeze on tower!
      this.state.cakeCombo = 0;
      this.playAudioTone('error');
      this.showCakeStatusToast(`💥 ПЕРЕВЕС (< 50%)! Корж перевернулся!`, 'var(--error)');

      // POP UNSTABLE OVERHANGING TIER OFF TOWER SO IT DOES NOT DUPLICATE ON THE TOWER!
      const poppedTier = floors.pop();

      const landingX = topFloor.x + (currentPos - realTopX);

      this.state.cakeFallingMiss = {
        x: landingX,
        topPx: 50, // Starts at tongs height for smooth continuous drop!
        impactY: topTierY_px, // Exact Y of top tier for impact tilt!
        bg: catalogItem.bg,
        border: catalogItem.border,
        topping: catalogItem.topping,
        dir: currentPos > realTopX ? 1 : -1,
        isFlipTopple: true
      };

      this.renderCakeToSkyGame();

      this.cakeFallingMissTimeout = setTimeout(() => {
        this.state.cakeFallingMiss = null;
        this.renderCakeToSkyGame();
      }, 1000);
    } else {
      // CASE C: SUPPORTED LANDING (>= 50% OVERLAP)!
      this.state.cakeCombo = 0;
      this.state.cakeScore++;
      this.playAudioTone('click');
      statusMsg = `👍 УСТОЯЛ!`;
      statusColor = '#60a5fa';

      const scoreEl = document.getElementById('visitor-game-score');
      if (scoreEl) scoreEl.innerText = `Ярусов: ${this.state.cakeScore}`;
      this.showCakeStatusToast(statusMsg, statusColor);
      this.renderCakeToSkyGame();
    }
  } else {
    // CASE A: COMPLETE MISS INTO EMPTY AIR (diff > maxAllowedDiff)!
    // No touch with tower at all! Falls ONCE smoothly from tongs (top: 50px) all the way to the ground!
    this.state.cakeCombo = 0;
    this.playAudioTone('error');
    this.showCakeStatusToast(`💥 МИМО! Упал на землю!`, 'var(--error)');

    this.state.cakeFallingMiss = {
      x: currentPos,
      topPx: 50, // Starts at tongs position for full sky drop
      bg: catalogItem.bg,
      border: catalogItem.border,
      topping: catalogItem.topping,
      dir: currentPos > realTopX ? 1 : -1
    };

    this.renderCakeToSkyGame();

    this.cakeFallingMissTimeout = setTimeout(() => {
      this.state.cakeFallingMiss = null;
      this.renderCakeToSkyGame();
    }, 1000);
  }
}

export function showCakeStatusToast(msg, color) {
  const toast = document.getElementById('cake-status-toast');
  if (toast) {
    toast.innerText = msg;
    toast.style.color = color;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, -10px) scale(1.1)';
    clearTimeout(this.cakeToastTimeout);
    this.cakeToastTimeout = setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 0) scale(1)';
      }
    }, 900);
  }
}

export function renderCakeToSkyGame() {
  const optionsBox = document.getElementById('visitor-game-options');
  const textLabel = document.getElementById('visitor-game-question-text');
  if (!optionsBox || !textLabel) return;

  const playingBox = textLabel.closest('.game-playing-box');
  if (playingBox) {
    playingBox.style.justifyContent = 'space-between';
    playingBox.style.alignItems = 'stretch';
    playingBox.style.padding = '0';
    playingBox.style.height = '100%';
    playingBox.style.flex = '1';
  }

  textLabel.style.display = 'none';

  const defaultCatalog = [
    { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #451a03 23%, #78350f 100%)', border: '#b45309', topping: '🍒' },
    { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #be123c 23%, #fb7185 100%)', border: '#f43f5e', topping: '🍓' },
    { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #d97706 23%, #fde047 100%)', border: '#eab308', topping: '🍋' },
    { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #4c1d95 23%, #a855f7 100%)', border: '#8b5cf6', topping: '🫐' },
    { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 22%, #f59e0b 23%, #fef08a 100%)', border: '#f59e0b', topping: '🕯️' }
  ];

  const floors = (this.state && this.state.cakeFloors) || [
    { x: 50, width: 32, bg: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, #475569 100%)', topping: '', isBase: true }
  ];
  const nextCatalog = (this.state && this.state.cakeTierCatalog) || defaultCatalog;
  const nextItem = nextCatalog[floors.length % nextCatalog.length] || defaultCatalog[0];

  const totalFloors = floors.length; // 1 platter + N tiers
  const tierCount = totalFloors - 1; // actual dropped cake tiers

  const swayAngleMax = Math.min(8.5, 1.5 + (tierCount * 0.28));
  const stackBottomOffset = tierCount <= 7 ? 20 : 20 - (tierCount - 7) * 35;
  const bgParallaxShift = tierCount <= 7 ? 0 : (tierCount - 7) * 15; // Smooth 3D background scroll offset down!

  let floorsHTML = '';

  floors.forEach((f, idx) => {
    const isPlatter = f.isBase || idx === 0;
    const isTopNew = idx === totalFloors - 1 && f.isNew;
    const animStyle = isTopNew ? 'animation: cakeFallDrop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;' : '';

    if (isPlatter) {
      floorsHTML += `
        <div style="position:absolute; bottom:0px; left:${f.x}%; transform:translateX(-50%); width:${f.width}%; height:18px; background:${f.bg}; border:2px solid #cbd5e1; border-radius:50% / 9px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 18px rgba(0,0,0,0.6); z-index:12;"></div>
      `;
    } else {
      const bottomOffset = 16 + (idx - 1) * 35;
      floorsHTML += `
        <div style="position:absolute; bottom:${bottomOffset}px; left:${f.x}%; transform:translateX(-50%); width:${f.width}%; height:36px; background:${f.bg}; border:1.5px solid rgba(255,255,255,0.7); border-radius:12px 12px 16px 16px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 16px rgba(0,0,0,0.5), inset 0 -5px 0 rgba(0,0,0,0.3); z-index:${13 + idx}; ${animStyle}">
          <span style="font-size:15px; transform:translateY(-9px); filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));">${f.topping}</span>
        </div>
      `;
    }
  });

  floors.forEach(f => f.isNew = false);

  // Render missed/collapsing cake tumbling animation starting EXACTLY at topPx (the top tier height)!
  let fallingMissHTML = '';
  if (this.state && this.state.cakeFallingMiss) {
    const fm = this.state.cakeFallingMiss;
    const rotDir = fm.dir || 1;
    const startTopPx = fm.topPx !== undefined ? fm.topPx : 50;

    if (fm.isStaircaseCollapse && fm.tiers && fm.tiers.length >= 4) {
      // REALISTIC UNIFIED 4-TIER STAIRCASE COLLAPSE PRESERVING EXACT STAIR SHAPE & PLUNGING PAST BOTTOM OF SCREEN!
      const t = fm.tiers;
      fallingMissHTML = `
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; animation: staircaseGroupCollapseFall 1.3s cubic-bezier(0.5, 0.05, 0.7, 0.5) forwards; --rot-dir: ${rotDir}; --pivot-x: ${t[0].x}%; --pivot-y: ${startTopPx}px; z-index:28; pointer-events:none; opacity:1;">
          <div style="position:absolute; top:${startTopPx}px; left:${t[0].x}%; transform:translateX(-50%); width:26%; max-width:90px; height:36px; background:${t[0].bg}; border:1.5px solid rgba(255,255,255,0.7); border-radius:12px 12px 16px 16px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 14px rgba(0,0,0,0.5);"><span style="font-size:15px; transform:translateY(-9px);">${t[0].topping}</span></div>
          <div style="position:absolute; top:${startTopPx - 35}px; left:${t[1].x}%; transform:translateX(-50%); width:26%; max-width:90px; height:36px; background:${t[1].bg}; border:1.5px solid rgba(255,255,255,0.7); border-radius:12px 12px 16px 16px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 14px rgba(0,0,0,0.5);"><span style="font-size:15px; transform:translateY(-9px);">${t[1].topping}</span></div>
          <div style="position:absolute; top:${startTopPx - 70}px; left:${t[2].x}%; transform:translateX(-50%); width:26%; max-width:90px; height:36px; background:${t[2].bg}; border:1.5px solid rgba(255,255,255,0.7); border-radius:12px 12px 16px 16px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 14px rgba(0,0,0,0.5);"><span style="font-size:15px; transform:translateY(-9px);">${t[2].topping}</span></div>
          <div style="position:absolute; top:${startTopPx - 105}px; left:${t[3].x}%; transform:translateX(-50%); width:26%; max-width:90px; height:36px; background:${t[3].bg}; border:1.5px solid rgba(255,255,255,0.7); border-radius:12px 12px 16px 16px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 14px rgba(0,0,0,0.5);"><span style="font-size:15px; transform:translateY(-9px);">${t[3].topping}</span></div>
        </div>
      `;
    } else {
      const animName = fm.isFlipTopple ? 'cakeFlipToppleFall' : 'cakeTumbleSolidFullFall';
      const impactYCss = fm.impactY !== undefined ? `${fm.impactY}px` : '220px';
      fallingMissHTML = `
        <div style="position:absolute; top:${startTopPx}px; left:${fm.x}%; width:26%; max-width:90px; height:36px; background:${fm.bg}; border:1.5px solid rgba(255,255,255,0.7); border-radius:12px 12px 16px 16px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px ${fm.border}; animation: ${animName} 1.1s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; --rot-dir: ${rotDir}; --impact-y: ${impactYCss}; z-index:25; pointer-events:none; opacity:1;">
          <span style="font-size:15px; transform:translateY(-9px);">${fm.topping}</span>
        </div>
      `;
    }
  }

  // SMART DOM PRESERVATION: Do NOT re-create outer DOM structure on tap if it already exists!
  const existingStackContainer = document.getElementById('cake-tower-stack-container');
  if (existingStackContainer) {
    existingStackContainer.style.bottom = `${stackBottomOffset}px`;
    existingStackContainer.style.setProperty('--sway-max', `${swayAngleMax}deg`);
    existingStackContainer.innerHTML = floorsHTML;

    const bgTile = document.getElementById('cake-bg-parallax-tile');
    if (bgTile) {
      bgTile.style.transform = `translateY(${bgParallaxShift}px)`;
    }

    const tongsEl = document.getElementById('cake-swing-tongs');
    if (tongsEl) {
      tongsEl.style.background = nextItem.bg;
      tongsEl.style.boxShadow = `0 0 18px ${nextItem.border}, inset 0 -5px 0 rgba(0,0,0,0.3)`;
      const toppingSpan = tongsEl.querySelector('span:nth-child(2)');
      if (toppingSpan) toppingSpan.innerText = nextItem.topping;
    }

    const missBox = document.getElementById('cake-miss-animation-box');
    if (missBox) missBox.innerHTML = fallingMissHTML;
    return;
  }

  optionsBox.style.display = 'flex';
  optionsBox.style.flexDirection = 'column';
  optionsBox.style.width = '100%';
  optionsBox.style.height = '100%';
  optionsBox.style.flex = '1';

  optionsBox.innerHTML = `
    <style>
      @keyframes cakeFallDrop {
        0% { transform: translateX(-50%) translateY(-220px) scale(1.08); opacity: 0.8; }
        75% { transform: translateX(-50%) translateY(4px) scale(0.97); }
        100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
      }
      /* 100% SOLID OPAQUE TUMBLE FALL ANIMATIONS */
      @keyframes cakeTumbleSolidFullFall {
        0% { transform: translateX(-50%) translateY(0) rotate(0deg); opacity: 1; }
        30% { transform: translateX(-50%) translateY(180px) rotate(calc(var(--rot-dir, 1) * 100deg)); opacity: 1; }
        65% { transform: translateX(-50%) translateY(420px) rotate(calc(var(--rot-dir, 1) * 220deg)); opacity: 1; }
        100% { transform: translateX(-50%) translateY(780px) rotate(calc(var(--rot-dir, 1) * 360deg)); opacity: 1; }
      }
      /* SINGLE TIER OVERHANG FLIP TOPPLE ON THE SPOT AT TOP TIER HEIGHT (< 50% OVERLAP) */
      @keyframes cakeFlipToppleFall {
        0% { transform: translateX(-50%) translateY(0) rotate(0deg); opacity: 1; }
        30% { transform: translateX(-50%) translateY(calc(var(--impact-y, 220px) - 50px)) rotate(calc(var(--rot-dir, 1) * 25deg)); opacity: 1; }
        60% { transform: translateX(calc(-50% + var(--rot-dir, 1) * 75px)) translateY(calc(var(--impact-y, 220px) + 240px)) rotate(calc(var(--rot-dir, 1) * 200deg)); opacity: 1; }
        100% { transform: translateX(calc(-50% + var(--rot-dir, 1) * 160px)) translateY(900px) rotate(calc(var(--rot-dir, 1) * 450deg)); opacity: 1; }
      }
      /* UNIFIED 4-TIER STAIRCASE OVERHANG COLLAPSE PRESERVING EXACT STAIR SHAPE & PLUNGING PAST BOTTOM OF SCREEN! */
      @keyframes staircaseGroupCollapseFall {
        0% { transform: translateY(0) rotate(0deg); transform-origin: var(--pivot-x, 50%) var(--pivot-y, 250px); opacity: 1; }
        25% { transform: translateX(calc(var(--rot-dir, 1) * 35px)) translateY(50px) rotate(calc(var(--rot-dir, 1) * 40deg)); transform-origin: var(--pivot-x, 50%) var(--pivot-y, 250px); opacity: 1; }
        60% { transform: translateX(calc(var(--rot-dir, 1) * 110px)) translateY(380px) rotate(calc(var(--rot-dir, 1) * 160deg)); transform-origin: var(--pivot-x, 50%) var(--pivot-y, 250px); opacity: 1; }
        100% { transform: translateX(calc(-50% + var(--rot-dir, 1) * 220px)) translateY(850px) rotate(calc(var(--rot-dir, 1) * 360deg)); transform-origin: var(--pivot-x, 50%) var(--pivot-y, 250px); opacity: 1; }
      }
      /* TREE-LIKE SWAY ANIMATION WITH DYNAMIC AMPLITUDE SCALING WITH HEIGHT */
      @keyframes towerFluidSway {
        0% { transform: rotate(calc(-1 * var(--sway-max, 3.5deg))); }
        50% { transform: rotate(var(--sway-max, 3.5deg)); }
        100% { transform: rotate(calc(-1 * var(--sway-max, 3.5deg))); }
      }
      /* SOFT AMBIENT FESTIVE BACKGROUND ANIMATIONS */
      @keyframes bgSparkleFloat {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.75; }
        50% { transform: translateY(-14px) rotate(15deg); opacity: 1; }
        100% { transform: translateY(0) rotate(0deg); opacity: 0.75; }
      }
      @keyframes bgRibbonSway {
        0% { transform: rotate(-8deg) scale(1); }
        50% { transform: rotate(8deg) scale(1.08); }
        100% { transform: rotate(-8deg) scale(1); }
      }
    </style>

    <!-- Entire Screen Clickable Game Arena (Absolute Positioning Container) -->
    <div onclick="app.handleCakeDrop()" style="position:relative; width:100%; height:100%; min-height:440px; flex:1; overflow:hidden; border-radius:16px; background:radial-gradient(circle at 50% 30%, #581c87 0%, #3b0764 50%, #1e1b4b 100%); border:1.5px solid var(--border-glow); padding:0; box-shadow:0 10px 30px rgba(0,0,0,0.5); cursor:pointer; user-select:none; touch-action:manipulation;">
      
      <!-- 100% INFINITE UNIFIED PARALLAX FESTIVE BACKGROUND (SINGLE SYNCHRONIZED LAYER) -->
      <div id="cake-bg-parallax-wrapper" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2; overflow:hidden;">
        
        <!-- Single Overtall 10000px Unified Background Layer (Patterns + Emojis in 100% Perfect Sync!) -->
        <div id="cake-bg-parallax-tile" style="position:absolute; top:-8000px; left:0; width:100%; height:10000px; background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='25' cy='30' r='3'/%3E%3Cpath d='M100 15 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 z' fill='%23fde047' fill-opacity='0.6'/%3E%3Ccircle cx='175' cy='45' r='2.5'/%3E%3Ccircle cx='50' cy='110' r='3.5' fill='%23fb7185' fill-opacity='0.5'/%3E%3Cpath d='M150 130 l4 7 l7 4 l-7 4 l-4 7 l-4 -7 l-7 -4 l7 -4 z' fill='%2338bdf8' fill-opacity='0.6'/%3E%3Ccircle cx='30' cy='170' r='3' fill='%23fb7185' fill-opacity='0.5'/%3E%3Ccircle cx='160' cy='180' r='2.5' fill='%23fde047' fill-opacity='0.6'/%3E%3C/g%3E%3C/svg%3E&quot;); background-repeat: repeat; transform: translateY(${bgParallaxShift}px); transition: transform 0.4s ease-out;">
          
          <div style="position:absolute; top:200px; left:10%; font-size:26px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.2s ease-in-out infinite;">🎆</div>
          <div style="position:absolute; top:400px; right:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4s ease-in-out infinite;">🎊</div>
          <div style="position:absolute; top:600px; left:78%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 2.8s ease-in-out infinite 0.5s;">✨</div>
          <div style="position:absolute; top:800px; left:15%; font-size:28px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgRibbonSway 4.8s ease-in-out infinite 1s;">🎈</div>

          <div style="position:absolute; top:1000px; right:10%; font-size:28px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.6s ease-in-out infinite 0.8s;">🎆</div>
          <div style="position:absolute; top:1200px; left:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(56,189,248,0.8)); animation: bgRibbonSway 4.2s ease-in-out infinite 0.4s;">🎊</div>
          <div style="position:absolute; top:1400px; right:18%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 3.1s ease-in-out infinite 1.2s;">✨</div>
          <div style="position:absolute; top:1600px; left:75%; font-size:26px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4.5s ease-in-out infinite 1.5s;">🎈</div>

          <div style="position:absolute; top:1800px; left:10%; font-size:30px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgSparkleFloat 3.4s ease-in-out infinite 0.3s;">🎆</div>
          <div style="position:absolute; top:2000px; right:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgRibbonSway 3.9s ease-in-out infinite 0.9s;">🎊</div>
          <div style="position:absolute; top:2200px; left:78%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 2.9s ease-in-out infinite 1.6s;">✨</div>
          <div style="position:absolute; top:2400px; left:14%; font-size:28px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(56,189,248,0.8)); animation: bgRibbonSway 4.3s ease-in-out infinite 0.7s;">🎈</div>

          <div style="position:absolute; top:2600px; right:10%; font-size:26px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.5s ease-in-out infinite 1.1s;">🎆</div>
          <div style="position:absolute; top:2800px; left:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4.1s ease-in-out infinite 0.2s;">🎊</div>
          <div style="position:absolute; top:3000px; right:16%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 3.0s ease-in-out infinite 1.4s;">✨</div>
          <div style="position:absolute; top:3200px; left:18%; font-size:26px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgRibbonSway 4.6s ease-in-out infinite 0.6s;">🎈</div>

          <div style="position:absolute; top:3400px; left:10%; font-size:26px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.2s ease-in-out infinite;">🎆</div>
          <div style="position:absolute; top:3600px; right:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4s ease-in-out infinite;">🎊</div>
          <div style="position:absolute; top:3800px; left:80%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 2.8s ease-in-out infinite 0.5s;">✨</div>
          <div style="position:absolute; top:4000px; left:15%; font-size:28px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgRibbonSway 4.8s ease-in-out infinite 1s;">🎈</div>

          <div style="position:absolute; top:4200px; right:10%; font-size:28px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.6s ease-in-out infinite 0.8s;">🎆</div>
          <div style="position:absolute; top:4400px; left:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(56,189,248,0.8)); animation: bgRibbonSway 4.2s ease-in-out infinite 0.4s;">🎊</div>
          <div style="position:absolute; top:4600px; right:18%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 3.1s ease-in-out infinite 1.2s;">✨</div>
          <div style="position:absolute; top:4800px; left:75%; font-size:26px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4.5s ease-in-out infinite 1.5s;">🎈</div>

          <div style="position:absolute; top:5000px; left:10%; font-size:30px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgSparkleFloat 3.4s ease-in-out infinite 0.3s;">🎆</div>
          <div style="position:absolute; top:5200px; right:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgRibbonSway 3.9s ease-in-out infinite 0.9s;">🎊</div>
          <div style="position:absolute; top:5400px; left:78%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 2.9s ease-in-out infinite 1.6s;">✨</div>
          <div style="position:absolute; top:5600px; left:14%; font-size:28px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(56,189,248,0.8)); animation: bgRibbonSway 4.3s ease-in-out infinite 0.7s;">🎈</div>

          <div style="position:absolute; top:5800px; right:10%; font-size:26px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.5s ease-in-out infinite 1.1s;">🎆</div>
          <div style="position:absolute; top:6000px; left:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4.1s ease-in-out infinite 0.2s;">🎊</div>
          <div style="position:absolute; top:6200px; right:16%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 3.0s ease-in-out infinite 1.4s;">✨</div>
          <div style="position:absolute; top:6400px; left:18%; font-size:26px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgRibbonSway 4.6s ease-in-out infinite 0.6s;">🎈</div>

          <div style="position:absolute; top:6600px; left:10%; font-size:26px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.2s ease-in-out infinite;">🎆</div>
          <div style="position:absolute; top:6800px; right:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4s ease-in-out infinite;">🎊</div>
          <div style="position:absolute; top:7000px; left:80%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 2.8s ease-in-out infinite 0.5s;">✨</div>
          <div style="position:absolute; top:7200px; left:15%; font-size:28px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgRibbonSway 4.8s ease-in-out infinite 1s;">🎈</div>

          <div style="position:absolute; top:7400px; right:10%; font-size:28px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.6s ease-in-out infinite 0.8s;">🎆</div>
          <div style="position:absolute; top:7600px; left:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(56,189,248,0.8)); animation: bgRibbonSway 4.2s ease-in-out infinite 0.4s;">🎊</div>
          <div style="position:absolute; top:7800px; right:18%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 3.1s ease-in-out infinite 1.2s;">✨</div>
          <div style="position:absolute; top:8000px; left:75%; font-size:26px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4.5s ease-in-out infinite 1.5s;">🎈</div>

          <div style="position:absolute; top:8200px; left:10%; font-size:30px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgSparkleFloat 3.4s ease-in-out infinite 0.3s;">🎆</div>
          <div style="position:absolute; top:8400px; right:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgRibbonSway 3.9s ease-in-out infinite 0.9s;">🎊</div>
          <div style="position:absolute; top:8600px; left:78%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 2.9s ease-in-out infinite 1.6s;">✨</div>
          <div style="position:absolute; top:8800px; left:14%; font-size:28px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(56,189,248,0.8)); animation: bgRibbonSway 4.3s ease-in-out infinite 0.7s;">🎈</div>

          <div style="position:absolute; top:9000px; right:10%; font-size:26px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(244,114,182,0.8)); animation: bgSparkleFloat 3.5s ease-in-out infinite 1.1s;">🎆</div>
          <div style="position:absolute; top:9200px; left:12%; font-size:24px; opacity:0.85; filter:drop-shadow(0 0 10px rgba(251,191,36,0.8)); animation: bgRibbonSway 4.1s ease-in-out infinite 0.2s;">🎊</div>
          <div style="position:absolute; top:9400px; right:16%; font-size:22px; opacity:0.9; filter:drop-shadow(0 0 8px rgba(255,255,255,0.9)); animation: bgSparkleFloat 3.0s ease-in-out infinite 1.4s;">✨</div>
          <div style="position:absolute; top:9600px; left:18%; font-size:26px; opacity:0.8; filter:drop-shadow(0 0 10px rgba(168,85,247,0.8)); animation: bgRibbonSway 4.6s ease-in-out infinite 0.6s;">🎈</div>

        </div>

      </div>

      <!-- Toast feedback -->
      <div id="cake-status-toast" style="position:absolute; top:45px; left:50%; transform:translateX(-50%); font-size:14px; font-weight:900; opacity:0; transition:all 0.2s ease; z-index:30; pointer-events:none; text-shadow:0 2px 8px rgba(0,0,0,0.9);"></div>

      <!-- Missed falling cake animation layer -->
      <div id="cake-miss-animation-box" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:25;">${fallingMissHTML}</div>

      <!-- Top Swinging Confectioner Clamps Assembly (PINNED AT THE TOP AT top: 0px!) -->
      <div style="position:absolute; top:0; left:0; width:100%; height:55px; pointer-events:none; z-index:20;">
        <div id="cake-swing-tongs" style="position:absolute; top:10px; left:${(this.state && this.state.cakeSwingPos) || 50}%; transform:translateX(-50%); width:26%; max-width:90px; height:36px; background:${nextItem.bg}; border:1.5px solid rgba(255,255,255,0.7); border-radius:12px 12px 16px 16px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px ${nextItem.border}, inset 0 -5px 0 rgba(0,0,0,0.3); transition:left 0.02s linear;">
          <span style="position:absolute; left:-14px; font-size:14px;">🦀</span>
          <span style="font-size:15px; transform:translateY(-9px);">${nextItem.topping}</span>
          <span style="position:absolute; right:-14px; font-size:14px; transform:scaleX(-1);">🦀</span>
        </div>
      </div>

      <!-- UNIFIED STACK CONTAINER SLIDING DOWN SMOOTHLY AS TOWER GROWS (Pinned at bottom, sway origin bottom center) -->
      <div id="cake-tower-stack-container" style="position:absolute; bottom:${stackBottomOffset}px; left:0; width:100%; height:100%; animation: towerFluidSway 3.6s ease-in-out infinite; --sway-max: ${swayAngleMax}deg; transform-origin: bottom center; transition: bottom 0.4s ease-out; pointer-events:none; z-index:10;">
        ${floorsHTML}
      </div>

    </div>
  `;
}

export function finishCakeToSkyGame() {
  try {
    this.state.cakeFinished = true;
    const userScore = this.state.cakeScore || 0;
    const bots = this.state.cakeBots || [];

    this.state.activeGameScore = userScore;

    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) timerEl.innerText = 'Результат!';

    // Restore bottom players box on results screen
    const playersBox = document.getElementById('visitor-game-players-box');
    if (playersBox) playersBox.style.display = 'block';

    this.playAudioTone('victory');

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
      resultDetail = `Ваш результат: <b style="color:var(--gold)">${userScore}</b> ярусов 🎂`;
      this.playAudioTone('victory');
    } else if (isDraw) {
      resultIcon = '🤝';
      resultTitle = 'НИЧЬЯ!';
      resultColor = '#a78bfa';
      resultDetail = `Все построили по <b style="color:#a78bfa">${userScore}</b> ярусов 🎂`;
    } else {
      resultIcon = '😔';
      resultTitle = 'НЕ ПОВЕЗЛО!';
      resultColor = 'var(--error)';
      resultDetail = topBot ? `${topBot.avatar} ${topBot.name} построил больше: <b>${topBot.score} ярусов</b>` : `Вы построили: ${userScore} ярусов`;
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
            <div style="font-size:9px; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Таблица Торта 🎂</div>
            ${boardRows}
          </div>
        </div>
      `;
    }

    this.setVisitorTimeout(() => {
      this.finishVisitorGame();
    }, 4500);
  } catch(e) {
    console.error('Error in finishCakeToSkyGame:', e);
    this.finishVisitorGame();
  }
}

export function saveCakeConfig(key, value) {
  try {
    this.state[key] = value;
    const branch = this.getVisitorConnectedBranch();
    if (branch) branch[key] = value;
    this.syncActiveBranchToDatabase();
    this.saveState();
    this.showToast("Настройки Торта до небес сохранены ✔️", false);
  } catch(e) {
    console.error('Error saving cake config:', e);
  }
}
