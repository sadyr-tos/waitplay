// games/pro/34_ai_prompts.js - AI Prompts & Templates

export const aiPromptsMethods = {
    this.setVisitorViewPanel('locked');
    this.showVisitorToast("Сессия отключена. Отсканируйте QR-код заново.", false);
  }

  visitorExitActiveGame() {
    try {
      this.clearAllVisitorGameTimers();
      this.setVisitorViewPanel('lobby');
      this.initVisitorLobby();
      this.showVisitorToast("Вы вышли из игры.", false);
    } catch(e) {
      console.error("Error in visitorExitActiveGame:", e);
    }
  }

  visitorExitActiveGameToLobby() {
    try {
      this.clearAllVisitorGameTimers();
      
      const branch = this.getVisitorConnectedBranch();
      const maxGames = branch && branch.limitGames !== undefined ? branch.limitGames : 2;
      const lockoutHours = branch && branch.limitHours !== undefined ? branch.limitHours : 3;

      this.state.visitorGamesPlayed++;
      
      if (maxGames !== 999 && this.state.visitorGamesPlayed >= maxGames) {
        if (lockoutHours > 0) {
          this.state.visitorLockoutUntil = Date.now() + (lockoutHours * 60 * 60 * 1000);
          this.setVisitorViewPanel('lockout');
          this.showVisitorToast("Игра завершена. Лимит игр исчерпан.", false);
        } else {
          this.state.visitorGamesPlayed = 0;
          this.state.visitorLockoutUntil = 0;
          this.setVisitorViewPanel('lobby');
          this.initVisitorLobby();
        }
      } else {
        this.setVisitorViewPanel('lobby');
        this.initVisitorLobby();
};

