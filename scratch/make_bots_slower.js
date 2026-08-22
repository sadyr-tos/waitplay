const fs = require('fs');
const path = 'app.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove the 10-second demo-test timer in startActiveGame()
const oldTimer = `    if (this.state.isDemoTest) {
      clearTimeout(this.state.demoTimer);
      this.state.demoTimer = setTimeout(() => {
        if (this.state.visitorActiveView === 'game') {
          clearInterval(this.state.gameRunningInterval);
          this.setVisitorViewPanel('lobby');
          this.initVisitorLobby();
          this.showVisitorToast("⏱️ Демо-режим завершен (10 сек). Для полной игры посетите заведение.", true);
        }
      }, 10000);
    }`;

const newTimer = `    if (this.state.isDemoTest) {
      clearTimeout(this.state.demoTimer);
      // Removed the 10-second demo kickout timer so administrators can test without restrictions
    }`;

code = code.replace(oldTimer, newTimer);

// 2. Slow down bots in simulateBotsAnswering() (6-second delay + 15% probability afterwards)
const oldBots = `  simulateBotsAnswering() {
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
        
        this.showVisitorToast(\`\${randomBot.avatar} \${randomBot.name} 🏆\`, false);
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
  }`;

const newBots = `  simulateBotsAnswering() {
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
        
        this.showVisitorToast(\`\${randomBot.avatar} \${randomBot.name} 🏆\`, false);
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
  }`;

code = code.replace(oldBots, newBots);

// 3. Replace the GPS toast
const oldGpsToast = 'this.showVisitorToast("🛠️ Запущен демо-режим администратора вне заведения (10 сек на игру).", false);';
const newGpsToast = 'this.showVisitorToast("🛠️ Кабинет администратора: запущен тестовый режим без ограничений.", false);';
code = code.replace(oldGpsToast, newGpsToast);

fs.writeFileSync(path, code, 'utf8');
console.log("Modified app.js successfully via Node.js!");
