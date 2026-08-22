// admin/15_admin_core.js - Admin Core Controller

export const adminCoreMethods = {
  initDOM() {
    // Global keyboard listener for Stickman Race lane dodging
    window.addEventListener('keydown', (e) => {
      if (this.state.visitorActiveView === 'game' && this.state.visitorSelectedGameId === 3 && !this.state.raceCountdown && !this.state.raceFinished) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
          this.handleStickmanRaceMove('left');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
          this.handleStickmanRaceMove('right');
        }
      }
    });

    // Close suggestions box on outside click
    document.addEventListener('click', (e) => {
      const suggestions = document.getElementById('creator-search-suggestions');
      const input = document.getElementById('creator-search-input');
      if (suggestions && input && e.target !== input && !suggestions.contains(e.target)) {
        suggestions.style.display = 'none';
      }
    });

    const venueCoordsEl = document.getElementById('db-venue-coords');
    if (venueCoordsEl) venueCoordsEl.value = `${this.state.venueCoords.lat}, ${this.state.venueCoords.lng}`;
    document.getElementById('admin-venue-welcome').value = this.state.welcomeMsg || '';
    const prizeEl = document.getElementById('admin-venue-prize');
    if (prizeEl) prizeEl.value = this.state.prizeMsg || "";

    // Sync settings view controls
    const maintenanceToggle = document.getElementById('settings-maintenance-toggle');
    if (maintenanceToggle) maintenanceToggle.checked = this.state.maintenanceMode;

    const generatorToggle = document.getElementById('settings-generator-toggle');
    if (generatorToggle) generatorToggle.checked = this.state.backupGenerator;

    const aiEngineSelect = document.getElementById('settings-ai-engine');
    if (aiEngineSelect) aiEngineSelect.value = this.state.aiEngine || 'waitplay-v2';

    const filterStrictnessSelect = document.getElementById('settings-filter-strictness');
    if (filterStrictnessSelect) filterStrictnessSelect.value = this.state.filterStrictness || 'normal';

    this.renderAdminGamesGrid();
    this.renderQuizQuestionsEditor();

    const debugBtnRow = document.querySelector('.debug-bar .debug-btn-row');
    if (debugBtnRow) {
      const limitResetBtn = document.createElement('button');
      limitResetBtn.className = 'debug-btn-mini';
      limitResetBtn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      limitResetBtn.style.color = '#ef4444';
      limitResetBtn.innerText = '🔄 Сбросить лимит гостя';
      limitResetBtn.onclick = () => {
        this.state.visitorGamesPlayed = 0;
        this.state.visitorLockoutUntil = 0;
        this.saveState();
        this.setVisitorViewPanel('lobby');
        this.initVisitorLobby();
        this.showToast("Лимит гостя успешно сброшен для тестирования! 🔄", false);
      };
      debugBtnRow.insertBefore(limitResetBtn, debugBtnRow.firstChild);

      const migBtn = document.createElement('button');
      migBtn.className = 'debug-btn-mini';
      migBtn.style.borderColor = 'rgba(167, 139, 250, 0.4)';
      migBtn.style.color = '#a78bfa';
      migBtn.innerText = '📱 Тест смены устройства';
      migBtn.onclick = () => this.simulateDeviceMigration();
      debugBtnRow.insertBefore(migBtn, debugBtnRow.firstChild);

      const aiResetBtn = document.createElement('button');
      aiResetBtn.className = 'debug-btn-mini';
      aiResetBtn.style.borderColor = 'rgba(253, 224, 71, 0.3)';
      aiResetBtn.style.color = '#fde047';
      aiResetBtn.innerText = '⚡ Сбросить ИИ кулдаун';
      aiResetBtn.onclick = () => this.resetAICooldown();
      debugBtnRow.insertBefore(aiResetBtn, debugBtnRow.firstChild);
    }

    const searchInput = document.getElementById('creator-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.creatorSearchSuggestions());
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.emoji-picker-btn') && !e.target.closest('.emoji-picker-popover')) {
        this.closeEmojiPicker();
      }
    });
  }

};

