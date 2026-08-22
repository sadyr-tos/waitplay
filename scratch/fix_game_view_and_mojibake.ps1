$path = "app.js"
$code = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Replace renderActiveGameQuestion() by IndexOf
$startStr1 = "  renderActiveGameQuestion() {"
$startIdx1 = $code.IndexOf($startStr1)

$endStr1 = "  renderSimulatedPlayersList() {"
$endIdx1 = $code.IndexOf($endStr1)

if ($startIdx1 -ge 0 -and $endIdx1 -gt $startIdx1) {
    $before = $code.Substring(0, $startIdx1)
    $after = $code.Substring($endIdx1)
    
    $newMethod1 = @'
  renderActiveGameQuestion() {
    const qIndex = this.state.activeGameQIndex;
    const gameId = this.state.visitorSelectedGameId;
    const game = this.state.games.find(g => g.id === gameId);
    const gameName = game ? game.name : "\u0418\u0433\u0440\u0430";
    
    const isQuiz = gameId === 1 || (game && game.isAIGenerated);
    
    const textLabel = document.getElementById('visitor-game-question-text');
    const optionsBox = document.getElementById('visitor-game-options');
    if (!textLabel || !optionsBox) return;

    if (isQuiz) {
      const branch = this.getVisitorConnectedBranch();
      const branchTemplates = branch && branch.templates ? branch.templates : this.state.templates;
      const questionsCount = branchTemplates.length;
      
      this.state.firstAnsweredThisRound = false;
      document.getElementById('visitor-game-q-index').innerText = `\u0412\u043e\u043f\u0440\u043e\u0441 ${qIndex + 1} \u0438\u0437 ${questionsCount}`;

      const tpl = branchTemplates[qIndex] || { text: "\u0412\u043e\u043f\u0440\u043e\u0441 \u0432\u0438\u043a\u0442\u043e\u0440\u0438\u043d\u044b", options: ["\u0414\u0430", "\u041d\u0435\u0442"], emojis: ["\ud83d\udc4d", "\ud83d\udc4e"], correct: 0 };
      textLabel.innerText = tpl.text;
      optionsBox.innerHTML = '';

      tpl.options.forEach((opt, optIdx) => {
        const curEmoji = tpl.emojis[optIdx] || "\u2753";
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
          <span class="option-btn-emoji">${curEmoji}</span>
          <span class="option-btn-text">${opt}</span>
        `;
        btn.onclick = () => this.handleVisitorAnswer(optIdx, tpl.correct);
        optionsBox.appendChild(btn);
      });
    } else if (gameId === 2) {
      const t = this.state.tttTournament;
      if (!t) {
        this.initTTFTournament();
        return;
      }
      
      const roundsCount = t.size === 8 ? 3 : 4;
      const roundNames = t.size === 8 
        ? ["1/4 \u0444\u0438\u043d\u0430\u043b\u0430", "1/2 \u0444\u0438\u043d\u0430\u043b\u0430", "\u0424\u0438\u043d\u0430\u043b"] 
        : ["1/8 \u0444\u0438\u043d\u0430\u043b\u0430", "1/4 \u0444\u0438\u043d\u0430\u043b\u0430", "1/2 \u0444\u0438\u043d\u0430\u043b\u0430", "\u0424\u0438\u043d\u0430\u043b"];
      const roundName = roundNames[t.round] || "\u041c\u0430\u0442\u0447";
      
      document.getElementById('visitor-game-q-index').innerText = `${roundName} (\u0422\u0443\u0440\u043d\u0438\u0440)`;
      
      if (t.matchStatus === 'bracket') {
        const opp = t.bracket[`round${t.round + 1}`].find(m => m.p1.isUser || m.p2.isUser);
        const opponent = opp.p1.isUser ? opp.p2 : opp.p1;
        
        textLabel.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:11px; font-weight:800; color:var(--gold); margin-bottom:5px; text-transform:uppercase;">\ud83c\udfc6 \u0422\u0423\u0420\u041d\u0418\u0420\u041d\u0410\u042f \u0421\u0415\u0422\u041a\u0410 (${t.size} \u0438\u0433\u0440\u043e\u043a\u043e\u0432)</div>
            <div style="font-size:10px; color:#fff; margin-bottom:10px;">\u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u043a\u0440\u0443\u0433: <b>${roundName}</b></div>
            
            <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-light); border-radius:10px; padding:10px; margin-bottom:12px; display:inline-block; width:100%; box-sizing:border-box;">
              <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
                <div style="font-size:16px;">\ud83d\udcbb \u0412\u044b</div>
                <div style="font-size:12px; color:var(--primary); font-weight:800;">VS</div>
                <div style="font-size:16px;">${opponent.avatar} ${opponent.name}</div>
              </div>
              <div style="font-size:9px; color:var(--text-muted); margin-top:6px;">\u041f\u043e\u0431\u0435\u0434\u0438\u0442\u0435 \u0432 \u043c\u0430\u0442\u0447\u0435, \u0447\u0442\u043e\u0431\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043f\u0440\u0438\u0437, \u043d\u0443\u0436\u043d\u043e \u0437\u0430\u043d\u044f\u0442\u044c 1-\u0435 \u043c\u0435\u0441\u0442\u043e!</div>
            </div>
          </div>
        `;
        
        optionsBox.innerHTML = '';
        const playBtn = document.createElement('button');
        playBtn.className = 'btn btn-primary';
        playBtn.style.width = '100%';
        playBtn.style.padding = '12px';
        playBtn.style.fontWeight = '800';
        playBtn.innerHTML = `\u2694\ufe0f \u041d\u0410\u0427\u0410\u0422\u042c \u041c\u0410\u0422\u0427`;
        playBtn.onclick = () => {
          t.matchStatus = 'playing';
          t.board.fill(null);
          t.playerTurn = Math.random() > 0.5;
          this.renderActiveGameQuestion();
          if (!t.playerTurn) {
            setTimeout(() => this.executeTTTBotMove(), 800);
          }
        };
        optionsBox.appendChild(playBtn);
        
      } else if (t.matchStatus === 'playing') {
        const opp = t.bracket[`round${t.round + 1}`].find(m => m.p1.isUser || m.p2.isUser);
        const opponent = opp.p1.isUser ? opp.p2 : opp.p1;
        
        textLabel.innerHTML = `
          <div style="text-align:center; font-size:11px;">
            <div style="margin-bottom:6px; font-weight:700; color:var(--text-muted);">
              \u041c\u0430\u0442\u0447: <b>\u0412\u044b \u274c</b> vs <b>${opponent.name} \u2b55</b>
            </div>
            <div style="font-size:12px; color:${t.playerTurn ? 'var(--success)' : 'var(--gold)'}; font-weight:800;">
              ${t.playerTurn ? '\ud83d\udc49 \u0412\u0430\u0448 \u0445\u043e\u0434 (\u041a\u0440\u0435\u0441\u0442\u0438\u043a)' : `\u270d\ufe0f ${opponent.name} \u0434\u0443\u043c\u0430\u0435\u0442...`}
            </div>
          </div>
        `;
        
        optionsBox.innerHTML = '';
        const boardEl = document.createElement('div');
        boardEl.className = 'ttt-board';
        
        t.board.forEach((cell, cellIdx) => {
          const btn = document.createElement('button');
          btn.className = `ttt-cell ${cell ? cell.toLowerCase() : ''}`;
          btn.innerHTML = cell || '';
          
          if (cell || !t.playerTurn || t.matchStatus !== 'playing') {
            btn.disabled = true;
          } else {
            btn.onclick = () => this.handleTTTCellClick(cellIdx);
          }
          boardEl.appendChild(btn);
        });
        optionsBox.appendChild(boardEl);
        
      } else if (t.matchStatus === 'finished') {
        optionsBox.innerHTML = '';
        
        if (t.winner === 'user') {
          textLabel.innerHTML = `
            <div style="text-align:center;">
              <div style="font-size:36px; margin-bottom:10px; animation: pulse 1s infinite;">\ud83c\udfc6</div>
              <div style="font-size:15px; font-weight:800; color:var(--gold);">\u0412\u042b \u0427\u0415\u041c\u041f\u0418\u041e\u041d \u0422\u0423\u0420\u041d\u0418\u0420\u0410!</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:5px; line-height:1.4;">
                \u0412\u044b \u043e\u0431\u044b\u0433\u0440\u0430\u043b\u0438 \u0432\u0441\u0435\u0445 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u043e\u0432 \u0438 \u0437\u0430\u043d\u044f\u043b\u0438 \u043f\u0435\u0440\u0432\u043e\u0435 \u043c\u0435\u0441\u0442\u043e!
              </div>
            </div>
          `;
        } else {
          const roundText = roundName === "\u0424\u0438\u043d\u0430\u043b" ? "\u0432 \u0424\u0438\u043d\u0430\u043b\u0435" : `\u0432 ${roundName}`;
          textLabel.innerHTML = `
            <div style="text-align:center;">
              <div style="font-size:36px; margin-bottom:10px; filter: grayscale(1);">\ud83d\udc80</div>
              <div style="font-size:14px; font-weight:800; color:var(--error);">\u0412\u042b \u0412\u042b\u0411\u042b\u041b\u0418 \u0418\u0417 \u0422\u0423\u0420\u041d\u0418\u0420\u0410</div>
              <div style="font-size:10px; color:var(--text-muted); margin-top:5px; line-height:1.4;">
                \u0412\u044b \u043f\u0440\u043e\u0438\u0433\u0440\u0430\u043b\u0438 ${roundText}. \u0422\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u0431\u0435\u0434\u0438\u0442\u0435\u043b\u044c \u0424\u0438\u043d\u0430\u043b\u0430 \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u043a\u0443\u0431\u043e\u043a \u0438 \u043f\u0440\u0438\u0437!
              </div>
            </div>
          `;
          
          const backBtn = document.createElement('button');
          backBtn.className = 'btn btn-secondary';
          backBtn.style.width = '100%';
          backBtn.style.padding = '12px';
          backBtn.style.fontWeight = '800';
          backBtn.innerText = `\ud83d\udd19 \u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u0432\u044b\u0431\u043e\u0440\u0443 \u0438\u0433\u0440`;
          backBtn.onclick = () => this.visitorExitActiveGameToLobby();
          optionsBox.appendChild(backBtn);
        }
      }
      
      this.renderSimulatedPlayersList();
      
    } else {
      document.getElementById('visitor-game-q-index').innerText = `\u0418\u0433\u0440\u0430: ${gameName}`;
      
      textLabel.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:32px; margin-bottom:10px; animation: pulse 1s infinite;">${game ? game.icon : '\ud83c\udfae'}</div>
          <div style="font-size:10px; color:var(--text-muted); margin-bottom:10px;">\u0411\u044b\u0441\u0442\u0440\u0435\u0435 \u043d\u0430\u0436\u0438\u043c\u0430\u0439\u0442\u0435 \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443 \u043d\u0438\u0436\u0435, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0431\u0440\u0430\u0442\u044c \u043e\u0447\u043a\u043e\u0432 \u0438 \u043e\u0431\u043e\u0439\u0442\u0438 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u043e\u0432!</div>
          
          <div style="margin: 15px 0; background: rgba(0,0,0,0.4); height: 40px; border-radius: 8px; border:1px solid var(--border-light); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: flex-start; padding: 0 10px;">
            <div id="stickman-track-runner" style="font-size: 20px; position: absolute; left: 10px; transition: left 0.2s ease;">\ud83c\udfc3</div>
            <div style="position: absolute; right: 10px; font-size: 16px;">\ud83c\udfc1</div>
            <div style="font-size:8px; color:var(--text-muted); position:absolute; width:100%; text-align:center; left:0; pointer-events:none;">\u0422\u0420\u0415\u041a \u0421\u041e\u0420\u0415\u0412\u041d\u041e\u0412\u0410\u041d\u0418\u042f</div>
          </div>
        </div>
      `;
      
      optionsBox.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.style.width = '100%';
      btn.style.padding = '12px';
      btn.style.fontWeight = '800';
      btn.innerText = `\u26a1 \u041a\u041b\u0418\u041a\u041d\u0423\u0422\u042c \u0414\u041b\u042f \u0423\u0421\u041a\u041e\u0420\u0415\u041d\u0418\u042f!`;
      
      let clickCount = 0;
      btn.onclick = () => {
        clickCount++;
        this.state.activeGameScore += 25;
        document.getElementById('visitor-game-score').innerText = `\u041e\u0447\u043a\u0438: ${this.state.activeGameScore}`;
        
        const runner = document.getElementById('stickman-track-runner');
        if (runner) {
          const percentage = Math.min(85, 10 + (clickCount * 3));
          runner.style.left = `${percentage}%`;
        }
      };
      optionsBox.appendChild(btn);

      if (!this.state.gameRunningInterval) {
        let elapsed = 0;
        this.state.gameRunningInterval = setInterval(() => {
          elapsed++;
          this.state.simulatedPlayers.forEach(p => {
            p.score += Math.floor(Math.random() * 4) * 20;
          });
          this.renderSimulatedPlayersList();
          
          if (elapsed >= 8) {
            clearInterval(this.state.gameRunningInterval);
            this.state.gameRunningInterval = null;
            this.finishVisitorGame();
          }
        }, 1000);
      }
      
      this.renderSimulatedPlayersList();
      this.simulateBotsAnswering();
    }

    this.renderSimulatedPlayersList();
    this.simulateBotsAnswering();
  }

'@
    
    $code = $before + $newMethod1 + $after
    Write-Host "Injected renderActiveGameQuestion successfully!"
} else {
    Write-Host "Indices for renderActiveGameQuestion not found!"
}

# 2. Replace finishVisitorGame() by IndexOf
$startStr2 = "  finishVisitorGame() {"
$startIdx2 = $code.IndexOf($startStr2)

$endStr2 = "  visitorCollectPrize() {"
$endIdx2 = $code.IndexOf($endStr2)

if ($startIdx2 -ge 0 -and $endIdx2 -gt $startIdx2) {
    $before = $code.Substring(0, $startIdx2)
    $after = $code.Substring($endIdx2)
    
    $newMethod2 = @'
  finishVisitorGame() {
    clearInterval(this.state.gameRunningInterval);
    clearTimeout(this.state.demoTimer);
    this.playAudioTone('victory');
    
    // Switch to B2C results view panel (crucial to prevent freeze after last question!)
    this.setVisitorViewPanel('results');
    
    const visitorScore = this.state.activeGameScore;
    const branch = this.getVisitorConnectedBranch();
    const branchName = branch ? branch.name : (this.state.activeBranchName || "WaitPlay");
    
    // Determine player podium rankings
    let standings = [];
    if (this.state.visitorSelectedGameId === 2) {
      standings = [
        { name: "\u0412\u044b (\u0413\u043e\u0441\u0442\u044c)", avatar: "\ud83d\udc64", score: 3, isGuest: true }
      ];
    } else {
      standings = [
        { name: "\u0412\u044b (\u0413\u043e\u0441\u0442\u044c)", avatar: "\ud83d\udc64", score: visitorScore, isGuest: true },
        ...this.state.simulatedPlayers
      ];
      standings.sort((a, b) => b.score - a.score);
    }
    
    // Render Single Winner Pedestal (no 2nd and 3rd places)
    const podiumBox = document.getElementById('visitor-podium-box');
    if (podiumBox) {
      podiumBox.innerHTML = '';
      
      const winner = standings[0];
      const isWinnerGuest = winner.isGuest;
      const winnerName = isWinnerGuest ? "\u0412\u044b" : winner.name;
      
      let answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u043e\u0432';
      if (this.state.visitorSelectedGameId === 2) {
        answersWord = '\u0427\u0435\u043c\u043f\u0438\u043e\u043d \u0442\u0443\u0440\u043d\u0438\u0440\u0430 \ud83c\udfc6';
      } else {
        const lastDigit = winner.score % 10;
        const lastTwoDigits = winner.score % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u043e\u0432';
        } else if (lastDigit === 1) {
          answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u043e\u0442\u0432\u0435\u0442';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u0430';
        }
      }
      
      podiumBox.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px; margin: 15px 0;">
          <div style="font-size:36px; filter: drop-shadow(0 0 8px rgba(245,158,11,0.4)); line-height:1.1; margin-bottom:4px;">${winner.avatar}</div>
          <div style="font-size:13px; font-weight:800; color:${isWinnerGuest ? 'var(--gold)' : '#fff'};">${winnerName}</div>
          <div style="font-size:9px; color:var(--text-muted); font-weight:600;">${this.state.visitorSelectedGameId === 2 ? answersWord : `${winner.score} ${answersWord}`}</div>
          <div style="width:45px; height:40px; background:linear-gradient(180deg, var(--gold), #854d0e); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:#fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-top:6px;">\ud83e\udd47</div>
        </div>
      `;
    }
    
    // Render Dotted Prize Ticket based on Leaderboard Rank
    const ticketBox = document.getElementById('visitor-results-ticket');
    if (ticketBox) {
      ticketBox.innerHTML = '';
      
      let guestRank = standings.findIndex(p => p.isGuest) + 1;
      let isQuizTieDeny = false;

      // Handle B2B Settings for Quiz Draw/Tie Behavior
      if (this.state.visitorSelectedGameId !== 2) {
        const highestScore = standings[0].score;
        const topScorers = standings.filter(p => p.score === highestScore);
        if (topScorers.length > 1) {
          const tieBehavior = branch && branch.quizTieWinnerBehavior ? branch.quizTieWinnerBehavior : (this.state.quizTieWinnerBehavior || 'give');
          if (tieBehavior === 'deny') {
            guestRank = 2; // Demote guest so they do not win 1st place
            isQuizTieDeny = true;
          }
        }
      }
      
      let prizeName = '';
      let prizeDesc = '';
      let badgeText = '';
      let badgeClass = '';
      let hasPrize = true;
      
      const branchTemplates = branch && branch.templates ? branch.templates : this.state.templates;
      const questionsCount = branchTemplates.length;
 
      if (guestRank === 1) {
        badgeText = '\ud83c\udfc6 \u041a\u0423\u041f\u041e\u041d \u041f\u041e\u0411\u0415\u0414\u0418\u0422\u0415\u041b\u042f';
        badgeClass = 'badge-pro';
        prizeName = branch && branch.prizeMsg ? branch.prizeMsg : (this.state.prizeMsg || "\u0421\u043a\u0438\u0434\u043a\u0430 5%");
        prizeDesc = this.state.visitorSelectedGameId === 2 
          ? '\u041f\u043e\u0437\u0434\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u0441 \u043f\u043e\u0431\u0435\u0434\u043e\u0439! \u0412\u044b \u0432\u0438\u0438\u0433\u0440\u0430\u043b\u0438 \u0432\u0441\u0435 \u0440\u0430\u0443\u043d\u0434\u044b \u0432 \u0442\u0443\u0440\u043d\u0438\u0440\u0435 \u043f\u043e \u041a\u0440\u0435\u0441\u0442\u0438\u043a\u0430\u043c-\u041d\u043e\u043b\u0438\u043a\u0430\u043c. \u041f\u043e\u043a\u0430\u0436\u0438\u0442\u0435 \u044d\u0442\u043e\u0442 \u043a\u0443\u043f\u043e\u043d \u043e\u0444\u0438\u0446\u0438\u0430\u043d\u0442\u0443.'
          : '\u041f\u043e\u0437\u0434\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u0441 \u043f\u043e\u0431\u0435\u0434\u043e\u0439! \u0412\u044b \u0437\u0430\u043d\u044f\u043b\u0438 1-\u0435 \u043c\u0435\u0441\u0442\u043e \u0432 \u0437\u0430\u0432\u0435\u0434\u0435\u043d\u0438\u0438. \u041f\u043e\u043a\u0430\u0436\u0438\u0442\u0435 \u044d\u0442\u043e\u0442 \u043a\u0443\u043f\u043e\u043d \u043e\u0444\u0438\u0446\u0438\u0430\u043d\u0442\u0443.';
      } else {
        badgeText = '\ud83c\udf97\ufe0f \u0423\u0427\u0410\u0421\u0422\u041d\u0418\u041a \u0418\u0413\u0420\u042b';
        badgeClass = 'badge-secondary';
        if (isQuizTieDeny) {
          prizeName = '\u041d\u0438\u0447\u044c\u044f \u043d\u0430 1-\u043c \u043c\u0435\u0441\u0442\u043e!';
          prizeDesc = `\u0412\u044b \u043d\u0430\u0431\u0440\u0430\u043b\u0438 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043e\u0447\u043a\u043e\u0432 (${visitorScore}) \u0441 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u043e\u043c. \u041f\u043e \u0440\u0435\u0448\u0435\u043d\u0438\u044e \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438, \u043f\u0440\u0438 \u043d\u0438\u0447\u044c\u0435\u0439 \u043f\u0440\u0438\u0437\u044b \u043d\u0435 \u0432\u044b\u0434\u0430\u044e\u0442\u0441\u044f!`;
        } else {
          prizeName = '\u0421\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u0443\u0447\u0430\u0441\u0442\u0438\u0435!';
          prizeDesc = `\u0412\u044b \u043e\u0442\u0432\u0435\u0442\u0438\u043b\u0438 \u043f\u0435\u0440\u0432\u044b\u043c\u0438 \u043d\u0430 ${visitorScore} \u0438\u0437 ${questionsCount} \u0432\u043e\u043f\u0440. \u0427\u0442\u043e\u0431\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043f\u0440\u0438\u0437, \u043d\u0443\u0436\u043d\u043e \u0437\u0430\u043d\u044f\u0442\u044c 1-\u0435 \u043c\u0435\u0441\u0442\u043e!`;
        }
        hasPrize = false;
      }
      
      const uniqueCode = 'WP-' + Math.floor(100000 + Math.random() * 900000);
      
      ticketBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed var(--border-light); padding-bottom:4px; margin-bottom:4px;">
          <span class="badge ${badgeClass}" style="font-size:8px; padding:2px 6px;">${badgeText}</span>
          ${hasPrize ? `<span style="font-size:9px; font-family:monospace; color:var(--text-muted);">${uniqueCode}</span>` : ''}
        </div>
        <div style="text-align:left; padding: 2px 0;">
          <div style="font-size:8px; color:var(--text-muted); text-transform:uppercase;">${hasPrize ? '\u0412\u0430\u0448\u0430 \u043d\u0430\u0433\u0440\u0430\u0434\u0430:' : '\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442:'}</div>
          <div style="font-size:12px; font-weight:800; color:#fff; margin-bottom:2px;">${hasPrize ? '\ud83c\udf89 ' : ''}${prizeName}</div>
          <div style="font-size:9px; color:var(--text-muted); line-height:1.3;">${prizeDesc}</div>
        </div>
        ${hasPrize ? '<div class="prize-barcode"></div>' : ''}
        <div style="font-size:7px; color:var(--text-muted); text-align:center; font-family:monospace;">${hasPrize ? `\u041f\u0440\u0435\u0434\u044a\u044f\u0432\u0438\u0442\u0435 \u043e\u0444\u0438\u0446\u0438\u0430\u043d\u0442\u0443 \u043f\u0440\u0438 \u0440\u0430\u0441\u0447\u0435\u0442\u0435 \u0432 \u0437\u0430\u0432\u0435\u0434\u0435\u043d\u0438\u0438 ${branchName}` : '\u0421\u043f\u0430\u0441\u0438\u0431\u043e, \u0447\u0442\u043e \u0438\u0433\u0440\u0430\u0435\u0442\u0435 \u0441 \u043d\u0430\u043c\u0438!'}</div>
      `;

      const collectBtn = document.getElementById('btn-collect-prize');
      if (collectBtn) {
        if (guestRank === 1) {
          collectBtn.innerHTML = '\ud83c\udf81 \u0417\u0430\u0431\u0440\u0430\u0442\u044c \u043d\u0430\u0433\u0440\u0430\u0434\u0443 \u0438 \u0432\u044b\u0439\u0442\u0438';
          collectBtn.onclick = () => this.visitorCollectPrize();
          collectBtn.className = 'btn btn-pro';
        } else {
          collectBtn.innerHTML = '\ud83d\udd19 \u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u0432\u044b\u0431\u043e\u0440\u0443 \u0438\u0433\u0440';
          collectBtn.onclick = () => this.visitorExitActiveGameToLobby();
          collectBtn.className = 'btn btn-secondary';
        }
      }
    }
  }

'@
    
    $code = $code.Replace($code.Substring($startIdx2, $endIdx2 - $startIdx2), $newMethod2)
    Write-Host "Injected finishVisitorGame successfully!"
} else {
    Write-Host "Indices for finishVisitorGame not found!"
}

[System.IO.File]::WriteAllText($path, $code, [System.Text.Encoding]::UTF8)
