// admin/19_admin_qr_manager.js - Admin QR Manager

export const adminQRMethods = {
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
};

