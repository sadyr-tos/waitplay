// games/base/25_game_memory.js - Memory Match Game

export const memoryMethods = {
  // --- MEMORY MATCH B2C GAMEPLAY LOGIC ---
  initGuestMemory(totalPlayers) {
    try {
      const branch = this.getVisitorConnectedBranch();
      const theme = branch && branch.memoryTheme ? branch.memoryTheme : (this.state.memoryTheme || 'restaurant');
      const diff = branch && branch.memoryDifficulty ? branch.memoryDifficulty : (this.state.memoryDifficulty || 'normal');
      const timeLimit = branch && branch.memoryTimeLimit ? parseInt(branch.memoryTimeLimit) : (parseInt(this.state.memoryTimeLimit) || 60);

      // Emoji assets
      const themeEmojis = {
        restaurant: ['🍕', '🍔', '🍟', '🍣', '🍰', '🍹', '☕', '🍩', '🍦', '🌮'],
        animals: ['🐼', '🦊', '🐻', '🐯', '🦁', '🐰', '🐵', '🐨', '🐸', '🐱'],
        mixed: ['🔮', '💎', '🚀', '🎸', '🎨', '🧩', '🎈', '🍿', '🍄', '🦖']
      };

      const baseList = themeEmojis[theme] || themeEmojis.restaurant;
      
      // Determine number of pairs
      let numPairs = 8; // normal 4x4
      if (diff === 'easy') numPairs = 6; // 3x4
      if (diff === 'hard') numPairs = 10; // 4x5

      // Select random emojis and duplicate them
      const selectedEmojis = [];
      const shuffledBase = [...baseList].sort(() => Math.random() - 0.5);
      for (let i = 0; i < numPairs; i++) {
        selectedEmojis.push(shuffledBase[i % shuffledBase.length]);
      }

      const deckEmojis = [...selectedEmojis, ...selectedEmojis];
      
      // Shuffle deck
      const shuffledDeck = deckEmojis
        .map((emoji, idx) => ({ id: idx, emoji, solved: false, flipped: false }))
        .sort(() => Math.random() - 0.5);

      this.state.memoryDeck = shuffledDeck;
      this.state.memoryScore = 0;
      this.state.memoryFlippedCards = [];
      this.state.memoryTimeRemaining = timeLimit;

      // Reset simulated players scores
      this.state.simulatedPlayers = [];
      const animalNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const animalEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      const count = Math.max(1, totalPlayers || 4); // default to 4 players (1 user + 3 bots) if totalPlayers is not passed
      for (let i = 0; i < count - 1; i++) {
        const idx = i % animalNames.length;
        this.state.simulatedPlayers.push({
          name: animalNames[idx],
          avatar: animalEmojis[idx],
          score: 0
        });
      }

      this.updateMemoryTimerUI();

      if (this.state.gameRunningInterval) clearInterval(this.state.gameRunningInterval);
      this.state.gameRunningInterval = setInterval(() => {
        if (this.state.visitorActiveView !== 'game') {
          clearInterval(this.state.gameRunningInterval);
          return;
        }
        if (this.state.memoryTimeRemaining > 0) {
          this.state.memoryTimeRemaining--;
          this.updateMemoryTimerUI();

          // Bot match solving simulation
          let botChance = 0.10;
          if (diff === 'easy') botChance = 0.05;
          if (diff === 'hard') botChance = 0.15;

          if (Math.random() < botChance && this.state.simulatedPlayers.length > 0) {
            const randomBot = this.state.simulatedPlayers[Math.floor(Math.random() * this.state.simulatedPlayers.length)];
            const totalPairs = this.state.memoryDeck.length / 2;

            if (randomBot.score < totalPairs) {
              randomBot.score++;
              this.renderSimulatedPlayersList();
              this.showVisitorToast(`${randomBot.avatar} ${randomBot.name} нашел пару! 🧩`, false);

              // Check if bot cleared their board
              if (randomBot.score >= totalPairs) {
                this.checkMemoryEndGame();
              }
            }
          }

          if (this.state.memoryTimeRemaining <= 0) {
            clearInterval(this.state.gameRunningInterval);
            this.checkMemoryEndGame();
          }
        }
      }, 1000);

      this.renderVisitorMemory();
    } catch(e) {
      console.error("Error in initGuestMemory:", e);
    }
  }

  updateMemoryTimerUI() {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) {
      timerEl.innerText = `⏳ Оставшееся время: ${this.state.memoryTimeRemaining} сек`;
    }
  }

  renderVisitorMemory() {
    const optionsBox = document.getElementById('visitor-game-options');
    const textLabel = document.getElementById('visitor-game-question-text');
    const typeLabel = document.getElementById('visitor-game-type-label');
    if (!optionsBox || !textLabel) return;

    if (typeLabel) typeLabel.innerText = "ИГРА МЕМЕРИ 🧠";
    textLabel.style.display = 'block';
    textLabel.innerText = "Переворачивайте карточки по две и находите одинаковые пары!";

    optionsBox.style.display = 'block';
    optionsBox.innerHTML = '';

    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'memory-grid-wrapper';
    gridWrapper.style.cssText = 'display:flex; flex-direction:column; gap:10px; width:100%; box-sizing:border-box; margin-top:10px;';

    const grid = document.createElement('div');
    grid.className = 'memory-grid';

    grid.style.cssText = `display:grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width:100%; max-width:280px; margin:0 auto;`;

    this.state.memoryDeck.forEach((card, idx) => {
      const btn = document.createElement('button');
      btn.className = 'memory-card';

      const isFlipped = card.flipped || card.solved;
      btn.style.cssText = `
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        border-radius: 10px;
        border: 1px solid ${card.solved ? 'var(--success)' : (isFlipped ? 'var(--primary)' : 'var(--border-light)')};
        background: ${card.solved ? 'rgba(74,222,128,0.1)' : (isFlipped ? 'rgba(139,92,246,0.15)' : 'linear-gradient(135deg, #1e1b4b, #110e1f)')};
        box-shadow: ${isFlipped && !card.solved ? '0 0 10px rgba(139,92,246,0.3)' : 'none'};
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
        margin: 0;
        padding: 0;
      `;

      btn.innerText = isFlipped ? card.emoji : '❓';

      if (card.solved || card.flipped || this.state.memoryFlippedCards.length >= 2) {
        btn.disabled = true;
      } else {
        btn.onclick = () => this.handleVisitorCardClick(idx);
      }
      grid.appendChild(btn);
    });

    gridWrapper.appendChild(grid);
    optionsBox.appendChild(gridWrapper);

    document.getElementById('visitor-game-score').innerText = `Пары: ${this.state.memoryScore}`;

    this.renderSimulatedPlayersList();
  }

  handleVisitorCardClick(idx) {
    try {
      if (this.state.visitorActiveView !== 'game') return;
      if (this.state.memoryFlippedCards.length >= 2) return;

      const card = this.state.memoryDeck[idx];
      if (card.solved || card.flipped) return;

      card.flipped = true;
      this.playAudioTone('click');
      this.state.memoryFlippedCards.push(idx);
      this.renderVisitorMemory();

      if (this.state.memoryFlippedCards.length === 2) {
        const [firstIdx, secondIdx] = this.state.memoryFlippedCards;
        const firstCard = this.state.memoryDeck[firstIdx];
        const secondCard = this.state.memoryDeck[secondIdx];

        if (firstCard.emoji === secondCard.emoji) {
          firstCard.solved = true;
          secondCard.solved = true;
          this.state.memoryFlippedCards = [];
          this.state.memoryScore++;
          this.playAudioTone('correct');

          const totalPairs = this.state.memoryDeck.length / 2;

          if (this.state.memoryScore >= totalPairs) {
            this.checkMemoryEndGame();
          } else {
            this.renderVisitorMemory();
          }
        } else {
          this.setVisitorTimeout(() => {
            firstCard.flipped = false;
            secondCard.flipped = false;
            this.state.memoryFlippedCards = [];
            this.playAudioTone('wrong');
            this.renderVisitorMemory();
          }, 800);
        }
      }
    } catch(e) {
      console.error("Error in handleVisitorCardClick:", e);
    }
  }

  checkMemoryEndGame() {
    try {
      clearInterval(this.state.gameRunningInterval);

      const totalPairs = this.state.memoryDeck.length / 2;
      const guestScore = this.state.memoryScore;
      
      const winningBot = this.state.simulatedPlayers.find(p => p.score >= totalPairs);

      let winner = { name: "Вы", avatar: "👤", score: guestScore, isUser: true };
      if (winningBot && guestScore < totalPairs) {
        winner = { name: winningBot.name, avatar: winningBot.avatar, score: winningBot.score, isUser: false };
      } else {
        const sortedBots = [...this.state.simulatedPlayers].sort((a, b) => b.score - a.score);
        const topBot = sortedBots[0];
        if (topBot && topBot.score > guestScore) {
          winner = { name: topBot.name, avatar: topBot.avatar, score: topBot.score, isUser: false };
        }
      }

      this.state.activeGameScore = guestScore;
      
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "ИГРА ОКОНЧЕНА 🏁";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">🏁</div>
            <div style="font-size:14px; font-weight:800; color:var(--gold);">ИГРА ЗАВЕРШЕНА!</div>
            <div style="font-size:11px; color:#fff; margin-top:4px;">Победитель: <b>${winner.avatar} ${winner.name}</b> (${winner.score} пар)</div>
          </div>
        `;
      }

      this.playAudioTone(winner.isUser ? 'victory' : 'incorrect');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in checkMemoryEndGame:", e);
      this.finishVisitorGame();
    }
  }

};

