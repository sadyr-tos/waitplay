// admin/20_admin_promos.js - Admin Promos & Discounts

export const adminPromosMethods = {
      
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
};

