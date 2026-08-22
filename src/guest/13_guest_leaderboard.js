// guest/13_guest_leaderboard.js - Guest Leaderboard

export const leaderboardMethods = {
      this.showToast(`Минимум участников для "${game.name}" изменен на ${minVal} чел.`, false);
    }
  }

  triggerVisitorDisconnectMessage(reason, redirectToLobby = true) {
    try {
      clearInterval(this.state.gameRunningInterval);
      this.state.gameRunningInterval = null;
      clearTimeout(this.state.demoTimer);
      clearInterval(this.state.lobbyCountdown);
      clearInterval(this.state.lobbyJoinInterval);
      
      const queueOverlay = document.getElementById('lobby-queue-overlay');
      if (queueOverlay) queueOverlay.style.display = 'none';

      const reasonEl = document.getElementById('visitor-disconnect-reason-txt');
      if (reasonEl) {
        reasonEl.innerText = reason || "Выбранная игра временно недоступна.";
      }
      
      this.setVisitorViewPanel('disconnected');
      this.showVisitorToast("🔌 Связь прервана", true);
      
      clearTimeout(this.state.visitorRedirectTimer);
      this.state.visitorRedirectTimer = setTimeout(() => {
        if (this.state.visitorActiveView === 'disconnected') {
          if (redirectToLobby) {
            this.setVisitorViewPanel('lobby');
            this.initVisitorLobby();
          } else {
            this.resetVisitorSession();
          }
        }
      }, 3000);
    } catch(e) {
      console.error("Error in triggerVisitorDisconnectMessage:", e);
    }
  }

  resetAdminDevice() {
    try {
      this.state.email = '';
      this.state.phone = '';
      this.state.subscription = 'none';
      this.state.consentAccepted = false;
      this.state.activeBranchId = '';
      this.state.activeBranchName = '';
      this.state.welcomeMsg = '';
      this.saveState();
      
      this.setAdminPanelActiveView('welcome-choice');
      this.updateAdminView();
      this.showToast("Вы успешно вышли из учетной записи. 🚪", false);
    } catch (e) {
      console.error("Error in resetAdminDevice:", e);
    }
  }

  openVenueSettingsModal() {
    try {
      document.getElementById('settings-branch-name').innerText = this.state.activeBranchName || 'Мой филиал';
      document.getElementById('settings-email').innerText = this.state.email || '-';
      document.getElementById('settings-phone').innerText = this.state.phone || '-';
      
      const badge = document.getElementById('settings-tariff');
      if (badge) {
        const isPro = this.state.subscription.includes('pro');
        badge.innerText = isPro ? 'PRO' : 'BASE';
        badge.className = isPro ? 'badge badge-pro' : 'badge badge-base';
      }
      
      document.getElementById('venue-settings-modal').classList.add('active');
      
      const limitGamesEl = document.getElementById('settings-limit-games');
      if (limitGamesEl) limitGamesEl.value = this.state.limitGames !== undefined ? this.state.limitGames : 2;
      const limitHoursEl = document.getElementById('settings-limit-hours');
      if (limitHoursEl) limitHoursEl.value = this.state.limitHours !== undefined ? this.state.limitHours : 3;
    } catch (e) {
      console.error("Error in openVenueSettingsModal:", e);
    }
  }

  saveBranchLimits() {
    try {
      const gamesVal = parseInt(document.getElementById('settings-limit-games').value);
      const hoursVal = parseInt(document.getElementById('settings-limit-hours').value);
      const tieVal = document.getElementById('settings-quiz-tie').value;
      
      this.state.limitGames = gamesVal;
      this.state.limitHours = hoursVal;
      this.state.quizTieWinnerBehavior = tieVal;
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.showToast("Настройки заведения успешно изменены! ⚙️", false);
    } catch (e) {
      console.error("Error in saveBranchLimits:", e);
    }
  }

};

