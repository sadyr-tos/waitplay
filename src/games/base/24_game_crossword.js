// games/base/24_game_crossword.js - Crossword Game

export const crosswordMethods = {
  // --- CROSSWORD ADMIN CONTROLLER LOGIC ---
  editCrossword() {
    this.setAdminPanelActiveView('edit-crossword');
    
    const diffEl = document.getElementById('settings-crossword-difficulty');
    if (diffEl) diffEl.value = this.state.crosswordDifficulty || 'normal';
    
    const timeEl = document.getElementById('settings-crossword-time-limit');
    if (timeEl) timeEl.value = this.state.crosswordTimeLimit || 5;
    
    this.renderCrosswordPreview();
    this.renderCrosswordWordsEditor();
  }

  shuffleCrosswordLayout() {
    try {
      const diff = this.state.crosswordDifficulty || 'normal';
      const totalLayouts = CROSSWORD_PRESETS[diff].layouts.length;
      this.state.crosswordLayoutIndex = (this.state.crosswordLayoutIndex + 1) % totalLayouts;
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      
      this.renderCrosswordPreview();
      this.renderCrosswordWordsEditor();
      this.showToast("Форма сетки кроссворда изменена!", false);
    } catch(e) {
      console.error("Error in shuffleCrosswordLayout:", e);
    }
  }

};

