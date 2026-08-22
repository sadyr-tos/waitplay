// guest/12_guest_game_runner.js - Guest Game Runner

export const guestRunnerMethods = {
      }
      this.saveState();
    } catch(e) {
      console.error("Error in visitorExitActiveGameToLobby:", e);
    }
  }

  toggleWelcomeTextCollapse() {
    const textEl = document.getElementById('visitor-lobby-welcome-text');
    const toggleEl = document.getElementById('visitor-lobby-welcome-toggle');
    const arrowEl = document.getElementById('visitor-lobby-welcome-arrow');
    if (!textEl || !toggleEl) return;
    
    const isCollapsed = textEl.style.maxHeight === '32px';
    if (isCollapsed) {
      textEl.style.maxHeight = '300px'; // expand
      toggleEl.querySelector('span').innerText = 'Свернуть';
      if (arrowEl) arrowEl.innerText = '▲';
    } else {
      textEl.style.maxHeight = '32px'; // collapse
      toggleEl.querySelector('span').innerText = 'Читать полностью';
      if (arrowEl) arrowEl.innerText = '▼';
    }
  }

  adminDownloadPrintPDF() {
    const branchName = this.state.activeBranchName || "WaitPlay";
    this.showToast(`Генерация печатного макета QR-кода для заведения "${branchName}"...`, false);
    
    setTimeout(() => {
      this.showToast(`Успешно скачан PDF-файл с уникальным QR-кодом для "${branchName}"!`, false);
    }, 1200);
  }

  changeGameMinPlayers(gameId, value) {
    if (!this.state.manualTestingMode) {
      this.showToast("Пожалуйста, включите Тест-режим для настройки игры!", true);
      this.renderAdminGamesGrid();
      return;
    }
    
    const minVal = Math.max(2, parseInt(value) || 2);
    const game = this.state.games.find(g => g.id === gameId);
    if (game) {
      game.minPlayers = minVal;
      if (game.minPlayers > game.maxPlayers) {
        game.maxPlayers = game.minPlayers;
      }
      this.saveState();
      this.syncActiveBranchToDatabase(); // Sync back to database branch games
      this.renderAdminGamesGrid();
};

