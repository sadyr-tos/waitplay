// games/pro/33_ai_generator_core.js - AI Generator Core

export const aiGeneratorMethods = {
    this.saveState();
    this.setVisitorViewPanel('lobby');
    this.initVisitorLobby();
    this.showVisitorToast("Сессия гостя сброшена.", false);
  }

  registerVisitorTimeout(tId) {
    if (!tId) return;
    this.state.visitorTimeouts = this.state.visitorTimeouts || [];
    this.state.visitorTimeouts.push(tId);
  }

  setVisitorTimeout(callback, delay) {
    const t = setTimeout(() => {
      if (this.state.visitorActiveView !== 'game') return;
      callback();
    }, delay);
    this.registerVisitorTimeout(t);
    return t;
  }

  clearAllVisitorGameTimers() {
    try {
      if (this.state.visitorTimeouts && Array.isArray(this.state.visitorTimeouts)) {
        this.state.visitorTimeouts.forEach(tId => clearTimeout(tId));
        this.state.visitorTimeouts = [];
      }
      clearInterval(this.state.guessWordTimer);
      clearInterval(this.state.gameRunningInterval);
      clearTimeout(this.state.demoTimer);
      clearInterval(this.state.lobbyCountdown);
      clearInterval(this.state.lobbyJoinInterval);
      if (typeof this.clearTTTTurnTimer === 'function') {
        this.clearTTTTurnTimer();
      }
      if (typeof this.clearRaceTimers === 'function') {
        this.clearRaceTimers();
      }
      this.state.guessWordPlayers = [];
      this.state.tttTournament = null;
    } catch(e) {
      console.error("Error in clearAllVisitorGameTimers:", e);
    }
  }

  visitorDisconnect() {
    this.clearAllVisitorGameTimers();
    const titleEl = document.getElementById('visitor-venue-title');
    if (titleEl) titleEl.innerText = "WaitPlay";
};

