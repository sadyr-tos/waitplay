$path = "app.js"
$code = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Find boundaries by IndexOf
$startStr = "  finishVisitorGame() {"
$startIdx = $code.IndexOf($startStr)

$endStr = "  visitorCollectPrize() {"
$endIdx = $code.IndexOf($endStr)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $before = $code.Substring(0, $startIdx)
    $after = $code.Substring($endIdx)
    
    $newMethod = @'
  finishVisitorGame() {
    clearInterval(this.state.gameRunningInterval);
    clearTimeout(this.state.demoTimer);
    this.playAudioTone('victory');
    
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
          answersWord = '\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0445 \u043e\u0442\u0432\u0435\u0442\u043e\u0432';
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
    
    $code = $before + $newMethod + $after
    Write-Host "Fixed visitor game results mojibake successfully!"
} else {
    Write-Host "Indices not found! start: $startIdx, end: $endIdx"
}

[System.IO.File]::WriteAllText($path, $code, [System.Text.Encoding]::UTF8)
