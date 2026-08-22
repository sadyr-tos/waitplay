// games/base/26_game_guessword.js - Guess Word Game

export const guesswordMethods = {
  // --- GUESS WORD ADMIN CONTROLLER LOGIC ---
  editGuessWord() {
    this.setAdminPanelActiveView('edit-guessword');
    
    const diffEl = document.getElementById('settings-guessword-difficulty');
    if (diffEl) diffEl.value = this.state.guessWordDifficulty || 'normal';
    
    const wordInput = document.getElementById('settings-guessword-custom-word');
    if (wordInput) wordInput.value = this.state.guessWordCustomWord || '';
    
    const clueInput = document.getElementById('settings-guessword-custom-clue');
    if (clueInput) clueInput.value = this.state.guessWordCustomClue || '';
    
    this.updateGuessWordPlayersUI();
  }

  saveGuessWordConfigField(field, value) {
    this.state[field] = value;
    this.saveState();
    this.syncActiveBranchToDatabase();
  }

  adjustGuessWordPlayersLimit(type, delta) {
    try {
      const game = this.state.games.find(g => g.id === 10);
      if (!game) return;

      if (type === 'min') {
        let val = (game.minPlayers || 2) + delta;
        val = Math.max(2, Math.min(5, val));
        if (val > (game.maxPlayers || 5)) {
          game.maxPlayers = val;
        }
        game.minPlayers = val;
      } else {
        let val = (game.maxPlayers || 5) + delta;
        val = Math.max(2, Math.min(5, val));
        if (val < (game.minPlayers || 2)) {
          game.minPlayers = val;
        }
        game.maxPlayers = val;
      }
      
      this.updateGuessWordPlayersUI();
      this.saveState();
      this.syncActiveBranchToDatabase();
    } catch(e) {
      console.error(e);
    }
};

