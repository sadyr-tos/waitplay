// games/base/27_game_checkers.js - Checkers Game

export const checkersMethods = {
  // --- CHECKERS B2C GAMEPLAY LOGIC ---
  initGuestCheckers() {
    try {
      const branch = this.getVisitorConnectedBranch();
      const turnLimit = branch && branch.checkersTurnLimit ? branch.checkersTurnLimit : (this.state.checkersTurnLimit || 'none');

      // Alternate player color
      let userColor = 'w';
      if (this.state.checkersLastPlayerColor === 'w') {
        userColor = 'b';
      }
      this.state.checkersLastPlayerColor = userColor;
      this.state.checkersUserColor = userColor;

      const botColor = userColor === 'w' ? 'b' : 'w';

      const board = Array(64).fill(null);
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const idx = r * 8 + c;
          if ((r + c) % 2 === 1) {
            if (r < 3) board[idx] = botColor;
            else if (r > 4) board[idx] = userColor;
          }
        }
      }

      const botPoolNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const botPoolEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      const randIdx = Math.floor(Math.random() * botPoolNames.length);

      this.state.checkersBoard = board;
      this.state.checkersTurn = userColor === 'w' ? 'user' : 'bot'; // White moves first!
      this.state.checkersSelectedCell = null;
      this.state.checkersValidMoves = [];
      this.state.checkersActiveCapturePieceIdx = null;
      this.state.checkersUserTimeoutCount = 0;
      this.state.checkersBotTimeoutCount = 0;
      this.state.checkersUserTotalTimeouts = 0;
      this.state.checkersBotTotalTimeouts = 0;
      this.state.checkersOpponent = {
        name: botPoolNames[randIdx],
        avatar: botPoolEmojis[randIdx]
      };
      this.state.simulatedPlayers = [{
        name: this.state.checkersOpponent.name,
        avatar: this.state.checkersOpponent.avatar,
        score: 0
      }];
      this.state.activeGameScore = 0;
      this.state.checkersTimeRemaining = turnLimit !== 'none' ? parseInt(turnLimit) : null;

      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();

      // If user is Black, Bot starts immediately as White!
      if (this.state.checkersTurn === 'bot') {
        setTimeout(() => this.executeCheckersBotMove(), 1200);
      }
    } catch (e) {
      console.error("Error in initGuestCheckers:", e);
    }
  }

  clearCheckersTurnTimer() {
    if (this.checkersTurnTimerInterval) {
      clearInterval(this.checkersTurnTimerInterval);
      this.checkersTurnTimerInterval = null;
    }
  }

  resetCheckersTurnTimer() {
    this.clearCheckersTurnTimer();
    const branch = this.getVisitorConnectedBranch();
    const turnLimit = branch && branch.checkersTurnLimit ? branch.checkersTurnLimit : (this.state.checkersTurnLimit || 'none');

    if (turnLimit === 'none') return;
    const limit = parseInt(turnLimit);
    if (isNaN(limit)) return;

    this.state.checkersTimeRemaining = limit;
    this.updateCheckersTimerUI();

    this.checkersTurnTimerInterval = setInterval(() => {
      if (this.state.visitorActiveView !== 'game') {
        this.clearCheckersTurnTimer();
        return;
      }
      this.state.checkersTimeRemaining--;
      this.updateCheckersTimerUI();

      if (this.state.checkersTimeRemaining <= 0) {
        this.clearCheckersTurnTimer();
        this.handleCheckersTurnTimeout();
      }
    }, 1000);
  }

  updateCheckersTimerUI() {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) {
      const color = this.state.checkersTimeRemaining <= 3 ? 'var(--error)' : 'var(--gold)';
      timerEl.innerHTML = `⏱️ Ход ${this.state.checkersTurn === 'user' ? 'Ваш' : 'соперника'}: <span style="color:${color}; font-weight:800;">${this.state.checkersTimeRemaining} сек</span>`;
    }
    const badgeEl = document.getElementById('checkers-board-timer-badge');
    if (badgeEl) {
      badgeEl.innerText = this.state.checkersTimeRemaining;
      const color = this.state.checkersTimeRemaining <= 3 ? 'var(--error)' : 'var(--gold)';
      const shadow = this.state.checkersTimeRemaining <= 3 ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)';
      badgeEl.style.borderColor = color;
      badgeEl.style.boxShadow = `0 0 10px ${shadow}`;
    }
  }

  handleCheckersTurnTimeout() {
    if (this.state.visitorActiveView !== 'game') return;
    this.playAudioTone('incorrect');

    this.clearCheckersTurnTimer();

    if (this.state.checkersTurn === 'user') {
      this.showVisitorToast("⚠️ Техническое поражение! Превышено время на ход.", true);
      this.handleCheckersMatchEnd(false);
    } else {
      this.showVisitorToast("⚠️ Техническая победа! Соперник превысил время на ход.", false);
      this.handleCheckersMatchEnd(true);
    }
  }

  getCheckersValidMoves(board, cellIdx) {
    const moves = [];
    const p = board[cellIdx];
    if (!p) return moves;

    const r = Math.floor(cellIdx / 8);
    const c = cellIdx % 8;

    const isKing = (p === 'W' || p === 'B');
    const isWhite = (p === 'w' || p === 'W');

    const drow = [-1, -1, 1, 1];
    const dcol = [-1, 1, -1, 1];

    // 1. Simple moves (diagonal 1 step)
    if (isKing) {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];
        let step = 1;
        while (true) {
          const nr = r + step * dr;
          const nc = c + step * dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const targetIdx = nr * 8 + nc;
            if (board[targetIdx] === null) {
              moves.push({
                type: 'move',
                from: cellIdx,
                to: targetIdx,
                captured: null
              });
              step++;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];
        const isUserPiece = (this.state.checkersUserColor === 'w') ? (p === 'w' || p === 'W') : (p === 'b' || p === 'B');
        if (isUserPiece && dr > 0) continue;
        if (!isUserPiece && dr < 0) continue;

        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const targetIdx = nr * 8 + nc;
          if (board[targetIdx] === null) {
            moves.push({
              type: 'move',
              from: cellIdx,
              to: targetIdx,
              captured: null
            });
          }
        }
      }
    }

    // 2. Capture moves (jumping over opponent)
    if (isKing) {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];
        let step = 1;
        let opponentFoundIdx = null;
        while (true) {
          const nr = r + step * dr;
          const nc = c + step * dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const currIdx = nr * 8 + nc;
            const piece = board[currIdx];
            if (piece === null) {
              if (opponentFoundIdx !== null) {
                moves.push({
                  type: 'capture',
                  from: cellIdx,
                  to: currIdx,
                  captured: opponentFoundIdx
                });
              }
            step++;
            } else {
              const isPieceWhite = (piece === 'w' || piece === 'W');
              if (isWhite !== isPieceWhite) {
                if (opponentFoundIdx === null) {
                  opponentFoundIdx = currIdx;
                  step++;
                } else {
                  break; // Can't jump multiple
                }
              } else {
                break; // Friend blocker
              }
            }
          } else {
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const dr = drow[i];
        const dc = dcol[i];

        const nr = r + dr;
        const nc = c + dc;
        const jr = r + 2 * dr;
        const jc = c + 2 * dc;

        if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8) {
          const midIdx = nr * 8 + nc;
          const jumpIdx = jr * 8 + jc;
          const midPiece = board[midIdx];
          const jumpPiece = board[jumpIdx];

          if (jumpPiece === null && midPiece !== null) {
            const isMidWhite = (midPiece === 'w' || midPiece === 'W');
            if (isWhite !== isMidWhite) {
              moves.push({
                type: 'capture',
                from: cellIdx,
                to: jumpIdx,
                captured: midIdx
              });
            }
          }
        }
      }
    }

    return moves;
  }

  getCheckersValidMovesForPlayer(board, color) {
    let allMoves = [];
    for (let i = 0; i < 64; i++) {
      const p = board[i];
      if (p !== null) {
        const isPieceWhite = (p === 'w' || p === 'W');
        const isPlayerWhite = (color === 'w');
        if (isPieceWhite === isPlayerWhite) {
          const pieceMoves = this.getCheckersValidMoves(board, i);
          allMoves.push(...pieceMoves);
        }
      }
    }

    const captures = allMoves.filter(m => m.type === 'capture');
    if (captures.length > 0) {
      return captures;
    }
    return allMoves;
  }

  renderVisitorCheckers() {
    try {
      const optionsBox = document.getElementById('visitor-game-options');
      const textLabel = document.getElementById('visitor-game-question-text');
      const typeLabel = document.getElementById('visitor-game-type-label');
      if (!optionsBox || !textLabel) return;

      if (typeLabel) typeLabel.innerText = "ИГРА ШАШКИ 🏁";
      
      const turnLimit = this.state.checkersTimeRemaining;
      if (turnLimit === null) {
        const timerEl = document.getElementById('visitor-game-q-index');
        if (timerEl) {
          timerEl.innerText = `Ход: ${this.state.checkersTurn === 'user' ? 'Ваш' : 'соперника'}`;
        }
      }

      textLabel.style.display = 'block';
      if (this.state.checkersTurn === 'user') {
        textLabel.innerText = "Ваш ход (Белые). Выберите шашку и укажите клетку для перемещения.";
      } else {
        textLabel.innerText = `Ожидание хода соперника (${this.state.checkersOpponent.avatar} ${this.state.checkersOpponent.name})...`;
      }

      optionsBox.style.display = 'block';
      optionsBox.innerHTML = '';

      const gridWrapper = document.createElement('div');
      gridWrapper.style.cssText = 'display:flex; flex-direction:column; gap:10px; width:100%; box-sizing:border-box; margin-top:10px;';

      const grid = document.createElement('div');
      grid.className = 'checkers-grid';
      grid.style.cssText = 'display:grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr); gap:1px; width:100%; max-width:280px; aspect-ratio: 1; margin:0 auto; background:#1e1b4b; border:4px solid #110e1f; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.5); overflow:hidden; box-sizing:border-box;';

      const board = this.state.checkersBoard;
      const validMoves = this.state.checkersValidMoves;
      const selectedCell = this.state.checkersSelectedCell;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const idx = r * 8 + c;
          const piece = board[idx];
          
          const cellBtn = document.createElement('button');
          cellBtn.style.cssText = `
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: none;
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: default;
            aspect-ratio: 1;
            position: relative;
          `;

          const isDark = (r + c) % 2 === 1;
          cellBtn.style.background = isDark ? '#2e2547' : '#e0d8f0';

          const validMove = validMoves.find(m => m.to === idx);

          if (piece !== null) {
            const checker = document.createElement('div');
            const isPieceWhite = (piece === 'w' || piece === 'W');
            const isPieceKing = (piece === 'W' || piece === 'B');

            checker.style.cssText = `
              width: 80%;
              height: 80%;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              transition: all 0.25s;
            `;

            if (isPieceWhite) {
              checker.style.background = 'linear-gradient(135deg, #ffffff, #d1d5db)';
              checker.style.border = '2px solid var(--primary)';
              if (selectedCell === idx) {
                checker.style.boxShadow = '0 0 12px var(--primary-light), inset 0 0 4px var(--primary)';
                checker.style.transform = 'scale(1.1)';
              }
            } else {
              checker.style.background = 'linear-gradient(135deg, #374151, #111827)';
              checker.style.border = '2px solid #ef4444';
            }

            if (isPieceKing) {
              checker.innerText = '👑';
            }

            const isUserPiece = (this.state.checkersUserColor === 'w') ? isPieceWhite : !isPieceWhite;
            if (this.state.checkersTurn === 'user' && isUserPiece) {
              cellBtn.style.cursor = 'pointer';
              cellBtn.onclick = () => this.handleVisitorCheckersCellClick(idx);
            }

            cellBtn.appendChild(checker);
          } else if (validMove) {
            cellBtn.style.cursor = 'pointer';
            cellBtn.onclick = () => this.handleVisitorCheckersCellClick(idx);
            
            const dot = document.createElement('div');
            dot.style.cssText = `
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: var(--success);
              box-shadow: 0 0 8px var(--success-light);
            `;
            cellBtn.appendChild(dot);
          }

          grid.appendChild(cellBtn);
        }
      }

      const boardContainer = document.createElement('div');
      boardContainer.style.cssText = 'position:relative; width:100%; max-width:280px; margin:0 auto;';
      boardContainer.appendChild(grid);

      if (turnLimit !== null && turnLimit !== undefined) {
        const timerBadge = document.createElement('div');
        timerBadge.id = 'checkers-board-timer-badge';
        timerBadge.style.cssText = `
          position: absolute;
          top: -12px;
          right: -12px;
          background: #110e1f;
          border: 2px solid ${this.state.checkersTimeRemaining <= 3 ? 'var(--error)' : 'var(--gold)'};
          box-shadow: 0 0 10px ${this.state.checkersTimeRemaining <= 3 ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'};
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          z-index: 10;
          font-family: monospace;
        `;
        timerBadge.innerText = this.state.checkersTimeRemaining;
        boardContainer.appendChild(timerBadge);
      }

      gridWrapper.appendChild(boardContainer);
      optionsBox.appendChild(gridWrapper);

      this.renderSimulatedPlayersList();
    } catch (e) {
      console.error("Error in renderVisitorCheckers:", e);
    }
  }

  handleVisitorCheckersCellClick(idx) {
    try {
      if (this.state.visitorActiveView !== 'game' || this.state.checkersTurn !== 'user') return;

      const board = this.state.checkersBoard;
      const piece = board[idx];

      // 1. Click on own piece to select
      const isUserPiece = (this.state.checkersUserColor === 'w') ? (piece === 'w' || piece === 'W') : (piece === 'b' || piece === 'B');
      if (piece !== null && isUserPiece) {
        if (this.state.checkersActiveCapturePieceIdx !== null) {
          if (idx !== this.state.checkersActiveCapturePieceIdx) {
            this.showVisitorToast("⚠️ Вы должны продолжить взятие этой же шашкой!", true);
            return;
          }
        }

        this.state.checkersSelectedCell = idx;
        const allValid = this.getCheckersValidMovesForPlayer(board, this.state.checkersUserColor);
        this.state.checkersValidMoves = allValid.filter(m => m.from === idx);
        
        this.playAudioTone('click');
        this.renderVisitorCheckers();
        return;
      }

      // 2. Click on a valid move target cell to execute move
      const validMove = this.state.checkersValidMoves.find(m => m.to === idx);
      if (validMove) {
        const fromIdx = validMove.from;
        const toIdx = validMove.to;
        const movedPiece = board[fromIdx];

        board[toIdx] = movedPiece;
        board[fromIdx] = null;

        if (validMove.type === 'capture') {
          board[validMove.captured] = null;
          this.state.activeGameScore++;
          this.playAudioTone('correct');
          this.showVisitorToast("💥 Срубили шашку!", false);
        } else {
          this.playAudioTone('click');
        }

        const toRow = Math.floor(toIdx / 8);
        const isUserColorWhite = (this.state.checkersUserColor === 'w');
        const isPromotionRow = isUserColorWhite ? (toRow === 0) : (toRow === 7);
        const promotedType = isUserColorWhite ? 'W' : 'B';
        const isNormalUserPiece = isUserColorWhite ? (movedPiece === 'w') : (movedPiece === 'b');
        if (isNormalUserPiece && isPromotionRow) {
          board[toIdx] = promotedType;
          this.showVisitorToast("👑 Дамка!", false);
          this.playAudioTone('success');
        }

        document.getElementById('visitor-game-score').innerText = `Срублено: ${this.state.activeGameScore}`;

        this.state.checkersSelectedCell = null;
        this.state.checkersValidMoves = [];
        this.renderVisitorCheckers();

        if (this.checkCheckersGameOver()) {
          return;
        }

        // If it was a capture, check if this piece can capture again
        if (validMove.type === 'capture') {
          const nextMoves = this.getCheckersValidMoves(board, toIdx);
          const nextCaptures = nextMoves.filter(m => m.type === 'capture');
          if (nextCaptures.length > 0) {
            this.state.checkersActiveCapturePieceIdx = toIdx;
            this.state.checkersSelectedCell = toIdx;
            this.state.checkersValidMoves = nextCaptures;
            this.renderVisitorCheckers();
            this.resetCheckersTurnTimer();
            return;
          }
        }

        // End of user turn
        this.state.checkersActiveCapturePieceIdx = null;
        this.state.checkersTurn = 'bot';
        this.resetCheckersTurnTimer();
        this.renderVisitorCheckers();

        setTimeout(() => this.executeCheckersBotMove(), 1200);
      }
    } catch (e) {
      console.error("Error in handleVisitorCheckersCellClick:", e);
    }
  }

  executeCheckersBotMove() {
    try {
      if (this.state.visitorActiveView !== 'game' || this.state.checkersTurn !== 'bot') return;

      const board = this.state.checkersBoard;
      const botColor = this.state.checkersUserColor === 'w' ? 'b' : 'w';
      const allValid = this.getCheckersValidMovesForPlayer(board, botColor);

      if (allValid.length === 0) {
        this.handleCheckersMatchEnd(true);
        return;
      }

      // Bot acted, reset consecutive timeout count
      this.state.checkersBotTimeoutCount = 0;

      const chosenMove = allValid[Math.floor(Math.random() * allValid.length)];
      const fromIdx = chosenMove.from;
      const toIdx = chosenMove.to;
      const movedPiece = board[fromIdx];

      board[toIdx] = movedPiece;
      board[fromIdx] = null;

      if (chosenMove.type === 'capture') {
        board[chosenMove.captured] = null;
        this.state.simulatedPlayers[0].score++;
        this.renderSimulatedPlayersList();
        this.playAudioTone('incorrect');
        this.showVisitorToast(`${this.state.checkersOpponent.avatar} ${this.state.checkersOpponent.name} срубил вашу шашку!`, false);
      } else {
        this.playAudioTone('click');
      }

      const toRow = Math.floor(toIdx / 8);
      const isBotColorWhite = (this.state.checkersUserColor === 'b');
      const isPromotionRow = isBotColorWhite ? (toRow === 0) : (toRow === 7);
      const promotedType = isBotColorWhite ? 'W' : 'B';
      const isNormalBotPiece = isBotColorWhite ? (movedPiece === 'w') : (movedPiece === 'b');
      if (isNormalBotPiece && isPromotionRow) {
        board[toIdx] = promotedType;
        this.showVisitorToast(`${this.state.checkersOpponent.name} получил Дамку! 👑`, false);
        this.playAudioTone('error');
      }

      this.renderVisitorCheckers();

      if (this.checkCheckersGameOver()) {
        return;
      }

      if (chosenMove.type === 'capture') {
        const nextMoves = this.getCheckersValidMoves(board, toIdx);
        const nextCaptures = nextMoves.filter(m => m.type === 'capture');
        if (nextCaptures.length > 0) {
          setTimeout(() => this.executeCheckersBotMultiJump(toIdx), 800);
          return;
        }
      }

      this.state.checkersTurn = 'user';
      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();
    } catch (e) {
      console.error("Error in executeCheckersBotMove:", e);
      this.state.checkersTurn = 'user';
      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();
    }
  }

  executeCheckersBotMultiJump(activeBotPieceIdx) {
    try {
      if (this.state.visitorActiveView !== 'game' || this.state.checkersTurn !== 'bot') return;

      const board = this.state.checkersBoard;
      const pieceMoves = this.getCheckersValidMoves(board, activeBotPieceIdx);
      const captures = pieceMoves.filter(m => m.type === 'capture');

      if (captures.length === 0) {
        this.state.checkersTurn = 'user';
        this.resetCheckersTurnTimer();
        this.renderVisitorCheckers();
        return;
      }

      // Reset timeout
      this.state.checkersBotTimeoutCount = 0;

      const chosenMove = captures[Math.floor(Math.random() * captures.length)];
      const fromIdx = chosenMove.from;
      const toIdx = chosenMove.to;
      const movedPiece = board[fromIdx];

      board[toIdx] = movedPiece;
      board[fromIdx] = null;
      board[chosenMove.captured] = null;

      this.state.simulatedPlayers[0].score++;
      this.renderSimulatedPlayersList();
      this.playAudioTone('incorrect');
      this.showVisitorToast(`${this.state.checkersOpponent.avatar} ${this.state.checkersOpponent.name} продолжает серию взятий!`, false);

      const toRow = Math.floor(toIdx / 8);
      const isBotColorWhite = (this.state.checkersUserColor === 'b');
      const isPromotionRow = isBotColorWhite ? (toRow === 0) : (toRow === 7);
      const promotedType = isBotColorWhite ? 'W' : 'B';
      const isNormalBotPiece = isBotColorWhite ? (movedPiece === 'w') : (movedPiece === 'b');
      if (isNormalBotPiece && isPromotionRow) {
        board[toIdx] = promotedType;
        this.showVisitorToast(`${this.state.checkersOpponent.name} получил Дамку! 👑`, false);
        this.playAudioTone('error');
      }

      this.renderVisitorCheckers();

      if (this.checkCheckersGameOver()) {
        return;
      }

      const nextMoves = this.getCheckersValidMoves(board, toIdx);
      const nextCaptures = nextMoves.filter(m => m.type === 'capture');

      if (nextCaptures.length > 0) {
        setTimeout(() => this.executeCheckersBotMultiJump(toIdx), 800);
      } else {
        this.state.checkersTurn = 'user';
        this.resetCheckersTurnTimer();
        this.renderVisitorCheckers();
      }
    } catch (e) {
      console.error("Error in executeCheckersBotMultiJump:", e);
      this.state.checkersTurn = 'user';
      this.resetCheckersTurnTimer();
      this.renderVisitorCheckers();
    }
  }

  checkCheckersGameOver() {
    try {
      const board = this.state.checkersBoard;
      let whiteCount = 0;
      let blackCount = 0;
      for (let i = 0; i < 64; i++) {
        const p = board[i];
        if (p === 'w' || p === 'W') whiteCount++;
        if (p === 'b' || p === 'B') blackCount++;
      }

      const userColor = this.state.checkersUserColor;
      if (userColor === 'w') {
        if (whiteCount === 0) {
          this.handleCheckersMatchEnd(false);
          return true;
        }
        if (blackCount === 0) {
          this.handleCheckersMatchEnd(true);
          return true;
        }
      } else {
        if (blackCount === 0) {
          this.handleCheckersMatchEnd(false);
          return true;
        }
        if (whiteCount === 0) {
          this.handleCheckersMatchEnd(true);
          return true;
        }
      }

      const nextTurn = this.state.checkersTurn;
      const activeColor = nextTurn === 'user' ? userColor : (userColor === 'w' ? 'b' : 'w');
      const activeMoves = this.getCheckersValidMovesForPlayer(board, activeColor);
      if (activeMoves.length === 0) {
        this.handleCheckersMatchEnd(nextTurn === 'bot');
        return true;
      }

      return false;
    } catch (e) {
      console.error("Error in checkCheckersGameOver:", e);
      return false;
    }
  }

  handleCheckersMatchEnd(isUserWinner) {
    try {
      this.clearCheckersTurnTimer();
      clearInterval(this.state.gameRunningInterval);

      if (isUserWinner) {
        this.state.activeGameScore = 12;
        this.state.simulatedPlayers[0].score = 0;
      } else {
        this.state.activeGameScore = 0;
        this.state.simulatedPlayers[0].score = 12;
      }

      let winner = {
        name: isUserWinner ? "Вы" : this.state.checkersOpponent.name,
        avatar: isUserWinner ? "👤" : this.state.checkersOpponent.avatar,
        score: 12,
        isUser: isUserWinner
      };

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "МАТЧ ОКОНЧЕН 🏁";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">🏁</div>
            <div style="font-size:14px; font-weight:800; color:var(--gold);">ИГРА ЗАВЕРШЕНА!</div>
            <div style="font-size:11px; color:#fff; margin-top:4px;">Победитель: <b>${winner.avatar} ${winner.name}</b></div>
          </div>
        `;
      }

      this.playAudioTone(isUserWinner ? 'victory' : 'incorrect');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in handleCheckersMatchEnd:", e);
      this.finishVisitorGame();
    }
  }

  initGuestStickmanRace(totalPlayers) {
    try {
      const branch = this.getVisitorConnectedBranch();
      const len = branch && branch.stickmanRaceLength ? branch.stickmanRaceLength : (this.state.stickmanRaceLength || 50);
      const obs = branch && branch.stickmanRaceObstacles ? branch.stickmanRaceObstacles : (this.state.stickmanRaceObstacles || 'medium');
      const limit = branch && branch.stickmanRaceTimeLimit ? branch.stickmanRaceTimeLimit : (this.state.stickmanRaceTimeLimit || 'none');

      this.state.raceLength = len;
      this.state.raceObstacles = obs;
      this.state.raceFinished = false;
      this.state.raceTimeRemaining = limit !== 'none' ? parseInt(limit) : null;
      this.state.raceWinner = null;
      
      this.state.raceCountdown = 3;
      this.state.raceObstaclesList = [];
      this.lastObstacleSpawnTime = 0;

      // Populate players
      const botPoolNames = ["Панда", "Лиса", "Медведь", "Тигр", "Лев", "Зайка", "Обезьянка", "Коала", "Лягушка", "Котёнок", "Щенок", "Цыплёнок"];
      const botPoolEmojis = ["🐼", "🦊", "🐻", "🐯", "🦁", "🐰", "🐵", "🐨", "🐸", "🐱", "🐶", "🐔"];
      const shuffledBots = [];
      for (let i = 0; i < botPoolNames.length; i++) {
        shuffledBots.push({ name: botPoolNames[i], avatar: botPoolEmojis[i] });
      }
      shuffledBots.sort(() => Math.random() - 0.5);

      const players = [];
      const lanesOrder = [1, 2, 4, 5, 3];

      // 1. User
      players.push({
        id: 'user',
        name: 'Вы',
        avatar: '👨‍💻',
        progress: 0,
        maxProgress: 0,
        eliminated: false,
        stumbleTime: 0,
        lane: 3,
        lastFoot: 'L',
        finished: false
      });

      // 2. Bots
      const countBots = totalPlayers - 1;
      for (let i = 0; i < countBots; i++) {
        const botTemplate = shuffledBots[i % shuffledBots.length];
        const assignedLane = lanesOrder[i % lanesOrder.length];
        players.push({
          id: 'bot_' + i,
          name: botTemplate.name,
          avatar: botTemplate.avatar,
          progress: 0,
          maxProgress: 0,
          eliminated: false,
          stumbleTime: 0,
          lane: assignedLane,
          animFoot: 'L',
          speedFactor: -0.012 + Math.random() * 0.024,
          finished: false
        });
      }

      this.state.racePlayers = players;
      
      this.state.simulatedPlayers = players.slice(1).map(p => ({
        name: p.name,
        avatar: p.avatar,
        score: 0
      }));

      this.clearRaceTimers();
      this.resetRaceTimer();

      // Main loop every 50ms
      this.raceGameInterval = setInterval(() => this.tickRaceGame(), 50);

      // Countdown
      this.playAudioTone('click');
      const cdInterval = setInterval(() => {
        if (this.state.visitorActiveView !== 'game' || this.state.raceFinished) {
          clearInterval(cdInterval);
          return;
        }
        
        if (this.state.raceCountdown === 3) {
          this.state.raceCountdown = 2;
          this.playAudioTone('click');
        } else if (this.state.raceCountdown === 2) {
          this.state.raceCountdown = 1;
          this.playAudioTone('click');
        } else if (this.state.raceCountdown === 1) {
          this.state.raceCountdown = "СТАРТ! 🏁";
          this.playAudioTone('correct');
          this.state.raceStartTime = Date.now();
        } else {
          this.state.raceCountdown = null;
          clearInterval(cdInterval);
        }
        this.renderVisitorStickmanRace();
      }, 1000);

      this.renderVisitorStickmanRace();
    } catch(e) {
      console.error("Error in initGuestStickmanRace:", e);
    }
  }

  tickRaceGame() {
    try {
      if (this.state.raceFinished || this.state.visitorActiveView !== 'game') {
        this.clearRaceTimers();
        return;
      }

      if (typeof this.state.raceCountdown === 'number') {
        return;
      }

      const len = this.state.raceLength;
      let stateChanged = false;

      // 1. Move players automatically
      this.state.racePlayers.forEach(p => {
        if (p.finished || p.eliminated) return;

        if (p.stumbleTime > 0) {
          p.stumbleTime = Math.max(0, p.stumbleTime - 0.05);
          stateChanged = true;
          return;
        }

        let speed = 0.09 + (p.speedFactor || 0.0);
        
        if (Math.random() < 0.25) {
          if (p.id === 'user') {
            p.lastFoot = p.lastFoot === 'L' ? 'R' : 'L';
          } else {
            p.animFoot = p.animFoot === 'L' ? 'R' : 'L';
          }
        }

        p.progress += speed;
        p.maxProgress = Math.max(p.maxProgress || 0, p.progress);
        stateChanged = true;

        if (p.progress >= len) {
          p.progress = len;
          if (!p.finished) {
            p.finished = true;
            p.finishTime = Date.now() - this.state.raceStartTime;

            const standingsEntry = this.state.simulatedPlayers.find(sp => sp.name === p.name);
            if (standingsEntry) standingsEntry.score = 100;
          }
        }
      });

      // Check finish: collect everyone who crossed this tick
      if (!this.state.raceFinished) {
        const justFinished = this.state.racePlayers.filter(p => p.finished && !p.eliminated);
        if (justFinished.length >= 2) {
          // Check if 2+ finished within the same ~100ms window (draw)
          const times = justFinished.map(p => p.finishTime);
          const minTime = Math.min(...times);
          const simultaneous = justFinished.filter(p => (p.finishTime - minTime) < 150);
          if (simultaneous.length >= 2) {
            this.handleRaceDraw(simultaneous);
          } else {
            // Single winner — earliest finishTime
            const winner = justFinished.reduce((a, b) => a.finishTime < b.finishTime ? a : b);
            if (!this.state.raceWinner) {
              this.state.raceWinner = winner;
              this.handleRaceMatchEnd(winner.id);
            }
          }
        } else if (justFinished.length === 1 && !this.state.raceWinner) {
          this.state.raceWinner = justFinished[0];
          this.handleRaceMatchEnd(justFinished[0].id);
        }

        // All eliminated / finished with no winner? → draw
        const allDone = this.state.racePlayers.every(p => p.finished || p.eliminated);
        if (allDone && !this.state.raceFinished) {
          this.handleRaceDraw(this.state.racePlayers.filter(p => !p.eliminated));
        }
      }

      // 2. Move obstacles down
      this.state.raceObstaclesList.forEach(obs => {
        obs.y += 8;
      });

      this.state.raceObstaclesList = this.state.raceObstaclesList.filter(obs => obs.y <= 320);

      // 3. Spawn obstacles
      const now = Date.now();
      if (!this.lastObstacleSpawnTime) this.lastObstacleSpawnTime = 0;

      let spawnCooldown = 1400;
      if (this.state.raceObstacles === 'high') {
        spawnCooldown = 850;
      } else if (this.state.raceObstacles === 'extreme') {
        spawnCooldown = 500;
      } else if (this.state.raceObstacles === 'none') {
        spawnCooldown = 9999999;
      }

      if (now - this.lastObstacleSpawnTime > spawnCooldown) {
        this.lastObstacleSpawnTime = now;
        
        // Spawn 2-3 barriers simultaneously on different lanes
        const numBarriers = this.state.raceObstacles === 'extreme' ? 3 : (this.state.raceObstacles === 'high' ? 2 : 2);
        const allLanes = [1, 2, 3, 4, 5];
        const shuffledLanes = allLanes.sort(() => Math.random() - 0.5);
        let spawned = 0;
        
        for (const lane of shuffledLanes) {
          if (spawned >= numBarriers) break;
          const blockExists = this.state.raceObstaclesList.some(o => o.lane === lane && o.y < 70);
          if (!blockExists) {
            this.state.raceObstaclesList.push({
              id: 'obs_' + Date.now() + '_' + lane + '_' + Math.random(),
              lane: lane,
              y: 0
            });
            spawned++;
          }
        }
      }

      // 4. Calculate Screen Y and Check Collisions
      this.state.racePlayers.forEach(p => {
        const bottomPercent = p.eliminated ? 8 : (8 + (p.progress / len) * 80);
        p.screenY = 320 * (bottomPercent / 100);
        p.screenY = Math.max(20, Math.min(290, p.screenY));

        if (p.finished && !p.eliminated) {
          p.screenY = 290;
        }

        if (!p.finished && p.stumbleTime <= 0) {
          const playerYFromTop = 320 - p.screenY;

          this.state.raceObstaclesList.forEach(obs => {
            if (obs.lane === p.lane && Math.abs(obs.y - playerYFromTop) < 16) {
              p.stumbleTime = 1.5;
              p.progress = Math.max(0, p.progress - (len * 0.08));
              
              if (p.id === 'user') {
                this.playAudioTone('error');
                this.showVisitorToast("💥 Врезались в барьер!", true);
              }

              // Check for elimination
              if (p.progress <= 0 && (p.maxProgress || 0) > len * 0.15) {
                p.eliminated = true;
                p.finished = true;
                p.stumbleTime = 99999;
                
                if (p.id === 'user') {
                  this.playAudioTone('error');
                  this.showVisitorToast("💀 Вы выбыли из гонки!", true);
                  
                  // End game immediately with lead bot as winner
                  const leadBot = this.state.racePlayers.slice(1).filter(bp => !bp.eliminated).sort((a, b) => b.progress - a.progress)[0];
                  this.handleRaceMatchEnd(leadBot ? leadBot.id : 'user');
                  return;
                } else {
                  this.showVisitorToast(`💀 ${p.avatar} ${p.name} выбыл!`, false);
                }
              }

              this.state.raceObstaclesList = this.state.raceObstaclesList.filter(o => o.id !== obs.id);
            }
          });
        }
      });

      // 5. Bot AI Dodging
      this.state.racePlayers.forEach(p => {
        if (p.id === 'user' || p.finished || p.eliminated || p.stumbleTime > 0) return;

        const playerYFromTop = 320 - p.screenY;
        const approachingObs = this.state.raceObstaclesList.find(obs => 
          obs.lane === p.lane && 
          obs.y < playerYFromTop && 
          (playerYFromTop - obs.y) < 70
        );

        if (approachingObs) {
          // Reduced dodge chance (7% per tick ~= 50ms) so bots sometimes get hit
          const dodgeChance = this.state.raceObstacles === 'extreme' ? 0.04 : (this.state.raceObstacles === 'high' ? 0.06 : 0.08);
          if (Math.random() < dodgeChance) {
            const options = [];
            if (p.lane > 1) options.push(p.lane - 1);
            if (p.lane < 5) options.push(p.lane + 1);

            // Only move to adjacent lane if it's clear — otherwise stay and get hit
            const safeOptions = options.filter(laneOpt => {
              return !this.state.raceObstaclesList.some(o => 
                o.lane === laneOpt && 
                Math.abs(o.y - playerYFromTop) < 70
              );
            });

            if (safeOptions.length > 0) {
              const targetLane = safeOptions[Math.floor(Math.random() * safeOptions.length)];
              p.lane = targetLane;
            }
            // If no safe lane, bots stay and take the hit — just like players
          }
        }
      });

      this.renderVisitorStickmanRace();
    } catch(e) {
      console.error("Error in tickRaceGame:", e);
    }
  }

  handleStickmanRaceMove(dir) {
    try {
      if (this.state.raceFinished || this.state.raceCountdown || this.state.visitorActiveView !== 'game') return;

      const user = this.state.racePlayers[0];
      if (user.stumbleTime > 0) return;

      if (dir === 'left' && user.lane > 1) {
        user.lane--;
        this.playAudioTone('click');
      } else if (dir === 'right' && user.lane < 5) {
        user.lane++;
        this.playAudioTone('click');
      }
      this.renderVisitorStickmanRace();
    } catch(e) {
      console.error("Error in handleStickmanRaceMove:", e);
    }
  }

  handleRaceMatchEnd(winnerId) {
    try {
      this.state.raceFinished = true;
      this.clearRaceTimers();

      const user = this.state.racePlayers[0];
      const isUserWinner = winnerId === 'user';
      const len = this.state.raceLength;

      if (isUserWinner) {
        this.state.activeGameScore = 100;
      } else {
        this.state.activeGameScore = Math.floor((user.progress / len) * 100);
      }

      this.state.racePlayers.forEach(p => {
        if (p.id === 'user') return;
        const botStandings = this.state.simulatedPlayers.find(sp => sp.name === p.name);
        if (botStandings) {
          if (p.finished) {
            botStandings.score = 100;
          } else {
            botStandings.score = Math.floor((p.progress / len) * 100);
          }
        }
      });

      const winnerPlayer = this.state.racePlayers.find(p => p.id === winnerId);
      const winnerName = isUserWinner ? "Вы" : winnerPlayer.name;
      const winnerAvatar = isUserWinner ? "👨‍💻" : winnerPlayer.avatar;

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = user.eliminated ? "ВЫ ВЫБЫЛИ! 💀" : "ФИНИШ! 🏁";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        const resultTitle = user.eliminated ? "ВЫ ВЫБЫЛИ! 💀" : "ЗАБЕГ ЗАВЕРШЕН!";
        const resultColor = user.eliminated ? "var(--error)" : "var(--gold)";
        const resultIcon = user.eliminated ? "💀" : "🏁";
        
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">${resultIcon}</div>
            <div style="font-size:14px; font-weight:800; color:${resultColor};">${resultTitle}</div>
            <div style="font-size:11px; color:#fff; margin-top:4px;">Победитель гонки: <b>${winnerAvatar} ${winnerName}</b></div>
          </div>
        `;
      }

      this.playAudioTone(isUserWinner ? 'victory' : 'incorrect');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in handleRaceMatchEnd:", e);
      this.finishVisitorGame();
    }
  }

  handleRaceDraw(finishers) {
    try {
      if (this.state.raceFinished) return;
      this.state.raceFinished = true;
      this.clearRaceTimers();

      const user = this.state.racePlayers[0];
      const allEliminated = this.state.racePlayers.every(p => p.eliminated);
      const userFinished = finishers && finishers.some(p => p.id === 'user');

      // Score: 50 for draw, 0 if all eliminated
      this.state.activeGameScore = allEliminated ? 0 : 50;

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = allEliminated ? "ВСЕ ВЫБЫЛИ! 💀" : "НИЧЬЯ! 🤝";

      const textLabel = document.getElementById('visitor-game-question-text');
      if (textLabel) {
        const title = allEliminated ? "ВСЕ ВЫБЫЛИ!" : "НИЧЬЯ!";
        const icon = allEliminated ? "💀" : "🤝";
        const color = allEliminated ? "var(--error)" : "#a78bfa";
        const subtitle = allEliminated 
          ? "Все игроки выбыли из гонки до финиша." 
          : "Несколько игроков пересекли финиш одновременно!";
        
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:36px; margin-bottom:8px;">${icon}</div>
            <div style="font-size:15px; font-weight:900; color:${color};">${title}</div>
            <div style="font-size:10px; color:var(--text-muted); margin-top:5px;">${subtitle}</div>
          </div>
        `;
      }

      this.playAudioTone(allEliminated ? 'error' : 'click');

      this.setVisitorTimeout(() => {
        this.finishVisitorGame();
      }, 3000);
    } catch(e) {
      console.error("Error in handleRaceDraw:", e);
      this.finishVisitorGame();
    }
  }

  clearRaceTimers() {
    if (this.raceBotInterval) {
      clearInterval(this.raceBotInterval);
      this.raceBotInterval = null;
    }
    if (this.raceTimerInterval) {
      clearInterval(this.raceTimerInterval);
      this.raceTimerInterval = null;
    }
    if (this.raceGameInterval) {
      clearInterval(this.raceGameInterval);
      this.raceGameInterval = null;
    }
  }

  resetRaceTimer() {
    if (this.state.raceTimeRemaining === null) {
      const timerEl = document.getElementById('visitor-game-q-index');
      if (timerEl) timerEl.innerText = "Гонка Стикменов";
      return;
    }

    this.updateRaceTimerUI();

    this.raceTimerInterval = setInterval(() => {
      if (this.state.visitorActiveView !== 'game' || this.state.raceFinished || this.state.raceCountdown) {
        return;
      }
      this.state.raceTimeRemaining--;
      this.updateRaceTimerUI();

      if (this.state.raceTimeRemaining <= 0) {
        this.clearRaceTimers();
        this.handleRaceTimeout();
      }
    }, 1000);
  }

  updateRaceTimerUI() {
    const timerEl = document.getElementById('visitor-game-q-index');
    if (timerEl) {
      const color = this.state.raceTimeRemaining <= 5 ? 'var(--error)' : 'var(--gold)';
      timerEl.innerHTML = `⏱️ Время: <span style="color:${color}; font-weight:800;">${this.state.raceTimeRemaining} сек</span>`;
    }
  }

  handleRaceTimeout() {
    this.state.racePlayers.sort((a, b) => b.progress - a.progress);
    const leader = this.state.racePlayers[0];
    this.handleRaceMatchEnd(leader.id);
  }

  getStickmanSVG(isMe, stumbleTime, lastFoot, obstacleActive) {
    const strokeColor = isMe ? '#fbbf24' : '#e2e8f0'; // Gold for user, silver/white for bots
    
    // Rotate legs based on lastFoot or stumble
    let leftLegTransform = '';
    let rightLegTransform = '';
    let bodyTransform = '';
    let headOffset = 0;
    
    if (stumbleTime > 0) {
      // Stumbled/fell: body is rotated horizontally, legs are bent
      bodyTransform = 'rotate(90 10 15)';
      leftLegTransform = 'rotate(45 10 15)';
      rightLegTransform = 'rotate(-45 10 15)';
    } else {
      // Walking/running leg swing based on step
      if (lastFoot === 'L') {
        leftLegTransform = 'rotate(35 10 15)';
        rightLegTransform = 'rotate(-35 10 15)';
        headOffset = -1; // Bob head
      } else if (lastFoot === 'R') {
        leftLegTransform = 'rotate(-35 10 15)';
        rightLegTransform = 'rotate(35 10 15)';
        headOffset = -1; // Bob head
      } else {
        // Neutral stance
        leftLegTransform = 'rotate(5 10 15)';
        rightLegTransform = 'rotate(-5 10 15)';
      }
    }
    
    return `
      <svg viewBox="0 0 20 26" style="width:20px; height:26px; overflow:visible; transition: transform 0.15s ease;">
        <g style="transform: ${bodyTransform}; transform-origin: 10px 15px; transition: transform 0.2s ease;">
          <!-- Head -->
          <circle cx="10" cy="${5 + headOffset}" r="3.5" fill="${strokeColor}" />
          <!-- Torso -->
          <line x1="10" y1="8.5" x2="10" y2="15" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" />
          <!-- Left Leg -->
          <line x1="10" y1="15" x2="6" y2="23" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" style="transform: ${leftLegTransform}; transform-origin: 10px 15px; transition: transform 0.15s ease;" />
          <!-- Right Leg -->
          <line x1="10" y1="15" x2="14" y2="23" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" style="transform: ${rightLegTransform}; transform-origin: 10px 15px; transition: transform 0.15s ease;" />
          <!-- Left Arm -->
          <line x1="10" y1="10" x2="4" y2="14" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" style="transform: ${rightLegTransform}; transform-origin: 10px 10px; transition: transform 0.15s ease;" />
          <!-- Right Arm -->
          <line x1="10" y1="10" x2="16" y2="14" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" style="transform: ${leftLegTransform}; transform-origin: 10px 10px; transition: transform 0.15s ease;" />
        </g>
      </svg>
    `;
  }

  renderVisitorStickmanRace() {
    try {
      const textLabel = document.getElementById('visitor-game-question-text');
      const optionsBox = document.getElementById('visitor-game-options');
      if (!textLabel || !optionsBox) return;

      const typeLabel = document.getElementById('visitor-game-type-label');
      if (typeLabel) typeLabel.innerText = "ГОНКА СТИКМЕНОВ";

      // Fix h2 and container to allow race track full height
      textLabel.style.cssText = 'width:100%; margin:0; padding:0; font-size:13px; font-weight:700; line-height:1.4; overflow:visible;';
      const playingBox = textLabel.closest('.game-playing-box');
      if (playingBox) {
        playingBox.style.justifyContent = 'flex-start';
        playingBox.style.padding = '8px';
        playingBox.style.gap = '6px';
        playingBox.style.overflow = 'hidden';
      }

      const user = this.state.racePlayers[0];
      const len = this.state.raceLength;

      const userPercent = Math.min(100, Math.floor((user.progress / len) * 100));
      const scoreEl = document.getElementById('visitor-game-score');
      if (scoreEl) scoreEl.innerText = `Прогресс: ${userPercent}%`;

      const obstaclesHTML = this.state.raceObstaclesList.map(obs => {
        const topPct = (obs.y / 280) * 100;
        const laneLeft = (obs.lane - 1) * 20;
        return `<div style="position:absolute;top:${topPct}%;left:${laneLeft}%;width:20%;height:16px;display:flex;justify-content:center;align-items:center;z-index:4;"><span style="font-size:11px;">🚧</span></div>`;
      }).join('');

      const runnersHTML = this.state.racePlayers.map((p) => {
        const laneLeft = (p.lane - 1) * 20;
        const percent = p.eliminated ? 0 : (p.progress / len);
        const bottomPct = p.eliminated ? 8 : (8 + (percent * 80));
        const isMe = p.id === 'user';
        const stepFoot = isMe ? p.lastFoot : p.animFoot;
        const stickmanSVG = this.getStickmanSVG(isMe, p.eliminated ? 99 : p.stumbleTime, stepFoot, false);
        const opacity = p.eliminated ? '0.5' : '1';
        let bubble = '';
        if (p.eliminated) bubble = `<div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:8px;background:rgba(239,68,68,0.9);color:#fff;border-radius:4px;padding:1px 4px;white-space:nowrap;font-weight:900;z-index:15;">💀 Выбыл</div>`;
        else if (p.stumbleTime > 0) bubble = `<div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:10px;z-index:15;">🥴</div>`;
        const tagBg = p.eliminated ? 'rgba(80,80,80,0.8)' : (isMe ? 'var(--primary)' : 'rgba(15,23,42,0.8)');
        const tagBorder = isMe ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.15)';
        const tagColor = p.eliminated ? '#999' : (isMe ? 'var(--gold)' : '#fff');
        return `<div style="position:absolute;left:${laneLeft}%;width:20%;bottom:${bottomPct}%;height:45px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;transition:left 0.12s ease-out,bottom 0.15s linear;z-index:10;opacity:${opacity};">${bubble}<div style="margin-bottom:2px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 3px rgba(0,0,0,0.55)) ${p.eliminated ? 'grayscale(1)' : ''};transform:scale(${isMe ? 1.25 : 1});">${stickmanSVG}</div><div style="background:${tagBg};border:${tagBorder};border-radius:4px;padding:1px 3px;font-size:6px;font-weight:800;color:${tagColor};white-space:nowrap;max-width:90%;overflow:hidden;text-overflow:ellipsis;">${p.avatar} ${p.name}</div></div>`;
      }).join('');

      const countdownOverlay = this.state.raceCountdown ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.75);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;"><div style="font-size:64px;font-weight:900;color:var(--gold);text-shadow:0 0 15px var(--gold);animation:pulse 0.5s infinite;">${this.state.raceCountdown}</div><div style="font-size:10px;font-weight:800;color:#fff;text-transform:uppercase;margin-top:8px;letter-spacing:1.5px;">Приготовьтесь!</div></div>` : '';

      textLabel.innerHTML = `
        <div style="width:100%;box-sizing:border-box;">
          <div style="position:relative;width:100%;height:280px;background:#1b4332;border-radius:14px;overflow:hidden;border:2px solid rgba(255,255,255,0.07);box-shadow:inset 0 0 20px rgba(0,0,0,0.6);">
            <div style="position:absolute;left:10%;width:80%;height:100%;background:linear-gradient(180deg,#991b1b,#7f1d1d);border-left:2px solid #fff;border-right:2px solid #fff;">
              <div style="position:absolute;left:20%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;left:40%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;left:60%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;left:80%;top:0;width:0;height:100%;border-left:1px dashed rgba(255,255,255,0.3);"></div>
              <div style="position:absolute;top:8%;left:0;width:100%;height:8px;background:repeating-conic-gradient(#000 0% 25%,#fff 0% 50%) 50%/8px 8px;z-index:2;"></div>
              <div style="position:absolute;top:2%;left:0;width:100%;text-align:center;font-size:7px;font-weight:900;color:var(--gold);letter-spacing:1.5px;z-index:3;">🏁 ФИНИШ 🏁</div>
              <div style="position:absolute;bottom:2%;left:0;width:100%;display:flex;justify-content:space-around;font-size:8px;font-weight:800;color:rgba(255,255,255,0.35);z-index:3;"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
              ${obstaclesHTML}
              ${runnersHTML}
            </div>
            ${countdownOverlay}
          </div>
        </div>
      `;

      // Controls — always visible, stumble shown as small bar above buttons
      optionsBox.style.display = 'block';
      optionsBox.style.gridTemplateColumns = '';

      if (user.eliminated) {
        optionsBox.innerHTML = `
          <div style="text-align:center;padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.4);border-radius:10px;">
            <div style="font-size:28px;margin-bottom:4px;">💀</div>
            <div style="font-size:13px;font-weight:900;color:var(--error);margin-bottom:3px;">ВЫ ВЫБЫЛИ!</div>
            <div style="font-size:10px;color:var(--text-muted);">Слишком много столкновений с барьерами.</div>
          </div>
        `;
      } else {
        let stumbleBar = '';
        if (user.stumbleTime > 0) {
          const stunSec = user.stumbleTime.toFixed(1);
          stumbleBar = `<div style="width:100%;padding:6px 10px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:8px;text-align:center;box-sizing:border-box;margin-bottom:4px;"><span style="font-size:12px;">🥴</span> <span style="font-size:11px;font-weight:800;color:var(--error);">Врезались в барьер!</span> <span style="font-size:10px;color:var(--text-muted);">Через <b style="color:#fff">${stunSec}с</b>...</span></div>`;
        }
        optionsBox.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:5px;width:100%;box-sizing:border-box;">
            ${stumbleBar}
            <div style="font-size:9px;color:var(--text-muted);text-align:center;">Управляйте аватаром (избегайте барьеров 🚧):</div>
            <div style="display:flex;gap:8px;width:100%;">
              <button onclick="app.handleStickmanRaceMove('left')" style="flex:1;padding:13px;font-size:14px;font-weight:800;background:#06b6d4;border:2px solid #06b6d4;border-radius:12px;color:#fff;cursor:pointer;">⬅️ ВЛЕВО</button>
              <button onclick="app.handleStickmanRaceMove('right')" style="flex:1;padding:13px;font-size:14px;font-weight:800;background:#ec4899;border:2px solid #ec4899;border-radius:12px;color:#fff;cursor:pointer;">ВПРАВО ➡️</button>
            </div>
          </div>
        `;
      }
    } catch(e) {
      console.error("Error in renderVisitorStickmanRace:", e);
    }
  }

  // ══════════════════════════════════════════════════════════
  //  GAME 8: НАРЕЗКА 🔪 — Tap to Slice
  // ══════════════════════════════════════════════════════════

  initSlicingGame(totalPlayers) {
    try {
      const branch = this.state.branches.find(b => b.id === this.state.visitorConnectedBranchId);
      const duration = (branch && branch.slicingDuration) || this.state.slicingDuration || 30;
      const item = (branch && branch.slicingItem) || this.state.slicingItem || 'bread';

      this.state.slicingDuration = duration;
      this.state.slicingItem = item;
      this.state.slicingTimeRemaining = duration;
      this.state.slicingCount = 0;
      this.state.slicingFinished = false;
      this.state.slicingStarted = true; // start immediately, no countdown
      this.state.slicingCountdown = 0;

      // Item metadata
      const items = {
        bread:    { emoji: '🍞', label: 'батон хлеба', color: '#f59e0b' },
        cucumber: { emoji: '🥒', label: 'огурец',      color: '#22c55e' },
        cake:     { emoji: '🎂', label: 'торт',        color: '#ec4899' },
        pizza:    { emoji: '🍕', label: 'пиццу',       color: '#ef4444' },
      };
      this.state.slicingItemMeta = items[item] || items.bread;

      // Generate simulated opponents with random scores
      const botNames = ['Панда', 'Лиса', 'Медведь', 'Тигр', 'Лев', 'Зайка', 'Обезьянка', 'Коала'];
      const botEmojis = ['🐼', '🦊', '🐻', '🐯', '🦁', '🐰', '🐵', '🐨'];
      this.state.slicingBots = [];
      for (let i = 0; i < totalPlayers - 1; i++) {
        const idx = i % botNames.length;
        // bots score range: duration * 2 to duration * 6 (taps)
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
  }

  startSlicingTimer() {
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
  }

  handleSliceTap() {
    if (!this.state.slicingStarted || this.state.slicingFinished) return;
    this.state.slicingCount++;
    const count = this.state.slicingCount;
    const meta = this.state.slicingItemMeta || { color: '#f59e0b' };

    // Update score badge (no full re-render to keep button stable)
    const scoreEl = document.getElementById('visitor-game-score');
    if (scoreEl) scoreEl.innerText = `Срезов: ${count}`;

    // Update counter text in-place
    const countEl = document.getElementById('slicing-count-display');
    if (countEl) countEl.innerText = count;

    // Animate bread emoji
    const breadEl = document.getElementById('slicing-bread-emoji');
    if (breadEl) {
      breadEl.style.transform = 'scale(0.82) rotate(-8deg)';
      breadEl.style.filter = `drop-shadow(0 2px 4px ${meta.color}88)`;
      setTimeout(() => {
        if (breadEl) {
          breadEl.style.transform = 'scale(1) rotate(0deg)';
          breadEl.style.filter = `drop-shadow(0 4px 8px ${meta.color}44)`;
        }
      }, 80);
    }

    // Update pieces row
    const piecesEl = document.getElementById('slicing-pieces-row');
    if (piecesEl && count <= 20) {
      const angle = (Math.random() * 30 - 15).toFixed(1);
      piecesEl.innerHTML += `<span style="font-size:13px;display:inline-block;transform:rotate(${angle}deg);margin:1px;">${meta.emoji || '🍞'}</span>`;
    }

    this.playAudioTone('click');
  }

  renderSlicingGame() {
    try {
      const textLabel = document.getElementById('visitor-game-question-text');
      const optionsBox = document.getElementById('visitor-game-options');
      if (!textLabel || !optionsBox) return;

      const meta = this.state.slicingItemMeta || { emoji: '🍞', label: 'батон', color: '#f59e0b' };
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

      // Active game screen — only render once (first time or timer tick)
      const timerPct = Math.max(0, (timeLeft / duration) * 100);
      const timerColor = timeLeft <= 5 ? 'var(--error)' : meta.color;

      textLabel.innerHTML = `
        <div style="text-align:center; padding:5px 0;">
          <!-- Timer bar -->
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-bottom:10px; overflow:hidden;">
            <div style="width:${timerPct}%; height:100%; background:${timerColor}; border-radius:3px; transition:width 0.9s linear;"></div>
          </div>

          <!-- Main item with id for animation -->
          <div id="slicing-bread-emoji" style="font-size:72px; margin:5px 0; filter: drop-shadow(0 4px 8px ${meta.color}44); transition: transform 0.08s, filter 0.08s; display:inline-block;">
            ${meta.emoji}
          </div>

          <!-- Slice count -->
          <div style="font-size:32px; font-weight:900; color:${meta.color}; text-shadow:0 0 10px ${meta.color}88; margin:4px 0;">
            <span id="slicing-count-display">${count}</span>
          </div>
          <div style="font-size:10px; color:var(--text-muted);">срезов</div>

          <!-- Cut pieces row -->
          <div id="slicing-pieces-row" style="margin-top:6px; line-height:1.3; min-height:18px;"></div>
        </div>
      `;

      // Only build the button once (avoid re-rendering every tap)
      if (!optionsBox.querySelector('#slice-tap-btn')) {
        optionsBox.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px; width:100%;">
            <button
              id="slice-tap-btn"
              onclick="app.handleSliceTap()"
              ontouchstart="app.handleSliceTap(); return false;"
              style="
                width:100%; padding:26px 0; font-size:26px; font-weight:900;
                background:linear-gradient(135deg, ${meta.color}, ${meta.color}bb);
                border:3px solid ${meta.color};
                border-radius:20px;
                box-shadow: 0 0 25px ${meta.color}55, 0 4px 15px rgba(0,0,0,0.4);
                color:#fff; cursor:pointer;
                transition: transform 0.06s, box-shadow 0.06s;
                user-select:none; -webkit-user-select:none; -webkit-tap-highlight-color:transparent;
              "
              onmousedown="this.style.transform='scale(0.93)'; this.style.boxShadow='0 0 8px ${meta.color}33';"
              onmouseup="this.style.transform='scale(1)'; this.style.boxShadow='0 0 25px ${meta.color}55, 0 4px 15px rgba(0,0,0,0.4)';"
              ontouchend="this.style.transform='scale(1)';"
            >
              🔪 РЕЗАТЬ!
            </button>
            <div style="font-size:9px; color:var(--text-muted);">Нажимай как можно быстрее!</div>
          </div>
        `;
      }
    } catch(e) {
      console.error('Error in renderSlicingGame:', e);
    }
  }

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

      // Compare scores after 1.5s
      this.setVisitorTimeout(() => {
        const typeLabel = document.getElementById('visitor-game-type-label');
        if (typeLabel) typeLabel.innerText = 'ИТОГ НАРЕЗКИ 🔪';

        const meta = this.state.slicingItemMeta || { emoji: '🍞', color: '#f59e0b' };
        const textLabel = document.getElementById('visitor-game-question-text');
        const optionsBox = document.getElementById('visitor-game-options');
        if (optionsBox) optionsBox.innerHTML = '';

        // Find winner
        const allScores = bots.map(b => b.score);
        const maxBotScore = allScores.length > 0 ? Math.max(...allScores) : 0;
        const ties = allScores.filter(s => s === userCount).length;
        const userWins = userCount > maxBotScore;
        const isDraw = !userWins && userCount === maxBotScore;
        const userLoses = !userWins && !isDraw;

        // Find top bot
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

        // Scoreboard rows
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

  saveSlicingConfig(key, value) {
    try {
      this.state[key] = value;
      const branch = this.state.branches.find(b => b.id === this.state.activeBranchId);
      if (branch) branch[key] = value;
};

