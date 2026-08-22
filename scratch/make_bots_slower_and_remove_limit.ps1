$path = "app.js"
$code = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Remove the 10-second demo-test lockout timer in startActiveGame()
$oldDemoTimer = @'
    if (this.state.isDemoTest) {
      clearTimeout(this.state.demoTimer);
      this.state.demoTimer = setTimeout(() => {
        if (this.state.visitorActiveView === 'game') {
          clearInterval(this.state.gameRunningInterval);
          this.setVisitorViewPanel('lobby');
          this.initVisitorLobby();
          this.showVisitorToast("⏱️ Демо-режим завершен (10 сек). Для полной игры посетите заведение.", true);
        }
      }, 10000);
    }
'@

$newDemoTimer = @'
    if (this.state.isDemoTest) {
      clearTimeout(this.state.demoTimer);
      // Removed the 10-second demo kickout timer so administrators can test without restrictions
    }
'@

$code = $code.Replace($oldDemoTimer, $newDemoTimer)

# 2. Slow down bots in simulateBotsAnswering() (6-second delay + 15% probability afterwards)
$oldBotsAnswering = @'
  simulateBotsAnswering() {
    clearInterval(this.state.gameRunningInterval);

    this.state.gameRunningInterval = setInterval(() => {
      if (this.state.firstAnsweredThisRound) {
        clearInterval(this.state.gameRunningInterval);
        return;
      }
      
      // Bots now take longer to react (average 4-8 seconds)
      if (Math.random() > 0.65) {
        const randomBot = this.state.simulatedPlayers[Math.floor(Math.random() * this.state.simulatedPlayers.length)];
        this.state.firstAnsweredThisRound = true;
        clearInterval(this.state.gameRunningInterval);
        
        randomBot.score += 1;
        this.renderSimulatedPlayersList();
        
        const buttons = document.getElementById('visitor-game-options').querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        this.showVisitorToast(`${randomBot.avatar} ${randomBot.name} 🏆`, false);
        this.playAudioTone('wrong');
        
        setTimeout(() => {
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
'@

$newBotsAnswering = @'
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
        
        setTimeout(() => {
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
'@

$code = $code.Replace($oldBotsAnswering, $newBotsAnswering)

# 3. Update the toast in verifyVisitorGPS() to reflect unlimited play time
$oldGPSToast = 'this.showVisitorToast("🛠️ Запущен демо-режим администратора вне заведения (10 сек на игру).", false);'
$newGPSToast = 'this.showVisitorToast("\ud83d\udee0\ufe0f \u041a\u0430\u0431\u0438\u043d\u0435\u0442 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430: \u0437\u0430\u043f\u0443\u0449\u0435\u043d \u0442\u0435\u0441\u0442\u043e\u0432\u044b\u0439 \u0440\u0435\u0436\u0438\u043c \u0431\u0435\u0437 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0439.", false);'
$code = $code.Replace($oldGPSToast, $newGPSToast)

[System.IO.File]::WriteAllText($path, $code, [System.Text.Encoding]::UTF8)
Write-Host "Slower bots and unlimited play time applied successfully!"
