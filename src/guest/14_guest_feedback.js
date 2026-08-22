// guest/14_guest_feedback.js - Guest Feedback & Tips

export const feedbackMethods = {
  openDeviceMigrationPanelFromSettings() {
    document.getElementById('venue-settings-modal').classList.remove('active');
    this.openDeviceMigrationPanel();
  }

  resetAdminDeviceConfirm() {
    if (confirm("Вы действительно хотите выйти из текущего аккаунта?")) {
      document.getElementById('venue-settings-modal').classList.remove('active');
      this.resetAdminDevice();
    }
  }

  deleteActiveBranch() {
    try {
      document.getElementById('venue-settings-modal').classList.remove('active');
      
      if (!confirm("⚠️ ВНИМАНИЕ: Вы действительно хотите НАВСЕГДА УДАЛИТЬ этот филиал из вашей учетной записи? Все данные, настройки и игры будут стерты!")) return;
      
      if (this.state.visitorActiveView !== 'locked' && this.state.visitorActiveView !== 'disclaimer' && this.state.visitorActiveView !== 'gps-check' && this.state.visitorActiveView !== 'disconnected') {
        this.triggerVisitorDisconnectMessage("Заведение удалено администратором.", false);
      }

      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === this.state.email.toLowerCase());
      if (client) {
        client.branches = (client.branches || []).filter(b => b.id !== this.state.activeBranchId);
        this.saveDatabaseClients();
        
        // Remove from logged accounts list
        this.state.loggedAccounts = (this.state.loggedAccounts || []).filter(acc => acc.email.toLowerCase() !== this.state.email.toLowerCase() || acc.subscription === 'none');
        
        if (client.branches.length > 0) {
          // Switch to first remaining branch
          const nextBranch = client.branches[0];
          this.loadBranchContext(client.email, nextBranch.id);
          this.showToast(`Филиал успешно удален. Переключено на другой филиал: "${nextBranch.name}"`, false);
        } else {
          // No branches left - perform complete logout
          this.state.email = '';
          this.state.phone = '';
          this.state.subscription = 'none';
          this.state.consentAccepted = false;
          this.state.activeBranchId = '';
          this.state.activeBranchName = '';
          this.saveState();
          
          this.setAdminPanelActiveView('welcome-choice');
          this.updateAdminView();
          this.showToast("Филиал удален. Активных заведений больше нет.", false);
        }
      }
    } catch (e) {
      console.error("Error in deleteActiveBranch:", e);
    }
  }

  resetAllStates() {
    try {
      localStorage.removeItem('waitplay_state_v26');
      localStorage.removeItem('waitplay_db_clients_v26');
      sessionStorage.removeItem('waitplay_visitor_state');
    } catch (e) {
      console.warn("LocalStorage/SessionStorage remove failed:", e);
    }
    window.location.reload();
  }

  startLockoutTicker() {
    if (this.state.visitorActiveView === 'lockout') {
      this.updateVisitorLockout();
    }
  }

  recalculateDistances() {
    const adminDist = this.getDistance(
      this.state.adminCoords.lat, this.state.adminCoords.lng,
      this.state.venueCoords.lat, this.state.venueCoords.lng
    );
    const visitorDist = this.getDistance(
      this.state.visitorCoords.lat, this.state.visitorCoords.lng,
      this.state.venueCoords.lat, this.state.venueCoords.lng
    );

    const adminEl = document.getElementById('db-admin-dist');
    const visitorEl = document.getElementById('db-visitor-dist');
    if (adminEl) adminEl.innerText = `${adminDist}м`;
    if (visitorEl) visitorEl.innerText = `${visitorDist}м`;

    const gpsIndicator = document.getElementById('visitor-gps-indicator');
    if (gpsIndicator) {
      const ok = visitorDist <= 180;
      gpsIndicator.innerText = ok ? `GPS: Ok (${visitorDist}m)` : `GPS: Out (${visitorDist}m)`;
      gpsIndicator.style.background = ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      gpsIndicator.style.borderColor = ok ? 'var(--success)' : 'var(--error)';
      gpsIndicator.style.color = ok ? 'var(--success)' : 'var(--error)';
    }

    this.updateAdminLocationStatus(adminDist);
  }

  setCoords(role, type) {
    try {
      const coords = PRESETS[type];
      if (!coords) return;
      
      if (role === 'admin') {
        this.state.adminCoords = { ...coords };
      } else if (role === 'visitor') {
        this.state.visitorCoords = { ...coords };
      }
      
      this.saveState();
      this.recalculateDistances();
      this.updateAdminView();
      this.updateVisitorView();
      
      const roleText = role === 'admin' ? 'Администратора' : 'Посетителя';
      const typeText = type === 'venue' ? 'в ресторане' : 'дома';
      this.showToast(`Координаты ${roleText} изменены на "${typeText}"`, false);
    } catch (e) {
      console.error("Error setting coordinates:", e);
    }
  }

  updateAdminLocationStatus(distance) {
    const statusText = document.getElementById('admin-loc-status');
    const sandboxAlert = document.getElementById('sandbox-alert');
    if (!statusText) return;
    if (distance <= 180) {
      statusText.innerText = "В заведении (Боевой)";
      statusText.style.color = "var(--success)";
      if (sandboxAlert) sandboxAlert.style.display = "none";
    } else {
      statusText.innerText = "Дома (Песочница)";
      statusText.style.color = "var(--gold)";
      if (sandboxAlert) sandboxAlert.style.display = (this.state.subscription !== 'none') ? "block" : "none";
    }
  }

  resetAICooldown() {
    this.state.lastAIGenTime = 0;
    this.saveState();
    this.updateAIGeneratorBox();
    this.showToast("Кулдаун ИИ генерации сброшен разработчиком.", false);
  }

};

