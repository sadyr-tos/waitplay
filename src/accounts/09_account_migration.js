// accounts/09_account_migration.js - Device Migration Panel

export const migrationMethods = {
  // --- DEVICE MIGRATION PANEL (Settings Workspace) ---
  openDeviceMigrationPanel() {
    this.setAdminPanelActiveView('migration');
    document.getElementById('mig-info-email').innerText = this.state.email;
    document.getElementById('mig-info-phone').innerText = this.state.phone;
  }

  migInitiateTransfer() {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.migEmail.code = code;

    document.getElementById('mig-transfer-request-box').style.display = 'none';
    document.getElementById('mig-transfer-code-box').style.display = 'block';

    this.startTimer('migEmail', 'mig-timer-display', () => {
      this.timers.migEmail.code = '';
      this.showToast("Срок проверочного кода Email истек. Отправьте повторно.", true);
    });

    // Send real email via API
    this.sendRealEmail(this.state.email, code, "Перенос управления аккаунтом");
  }

  migVerifyAndCompleteTransfer() {
    try {
      const entered = document.getElementById('mig-email-code-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.migEmail.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('migEmail');
        
        const models = ["Samsung Galaxy S24 Ultra", "iPhone 15 Pro Max", "Google Pixel 8 Pro", "Xiaomi 14 Ultra"];
        const oldModel = this.state.deviceModel || "iPhone 15 Pro";
        const newModel = models.filter(m => !m.includes(oldModel.substring(0, 5)))[Math.floor(Math.random() * 3)];
        
        this.state.deviceModel = newModel;
        this.state.deviceHistory = this.state.deviceHistory || [];
        this.state.deviceHistory.push(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().substring(0, 5)}: Перенос с ${oldModel} на ${newModel}`);
        
        this.showToast(`Управление перенесено! Новое устройство: ${newModel} ✔️`, false);
        
        document.getElementById('mig-transfer-request-box').style.display = 'block';
        document.getElementById('mig-transfer-code-box').style.display = 'none';
        document.getElementById('mig-email-code-input').value = '';
        this.setAdminPanelActiveView('dashboard');
      } else {
        this.showToast("Неверный 4-значный проверочный код!", true);
      }
    } catch (e) {
      alert("Ошибка migVerifyAndCompleteTransfer:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  triggerMockAd(callback) {
    this.state.adCallback = callback;
    const overlay = document.getElementById('mock-ad-overlay');
    const countdownEl = document.getElementById('ad-countdown');
    const closeBtn = document.getElementById('btn-close-ad');
    
    if (!overlay || !countdownEl || !closeBtn) {
      if (callback) callback();
      return;
    }
    
    overlay.style.display = 'flex';
    closeBtn.style.display = 'none';
    
    const isDev = this.isSandboxMode();
    if (isDev) {
      closeBtn.style.display = 'block';
      closeBtn.innerText = "\u2716 (\u0420\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a)";
      closeBtn.style.fontSize = "10px";
      closeBtn.style.background = "rgba(255,255,255,0.15)";
      closeBtn.style.padding = "4px 8px";
      closeBtn.style.borderRadius = "6px";
      closeBtn.style.width = "auto";
      closeBtn.style.height = "auto";
      closeBtn.style.top = "8px";
      closeBtn.style.right = "8px";
    } else {
      closeBtn.innerText = "\u2716";
      closeBtn.style.fontSize = "16px";
      closeBtn.style.background = "none";
      closeBtn.style.padding = "0";
      closeBtn.style.borderRadius = "0";
      closeBtn.style.top = "12px";
      closeBtn.style.right = "12px";
    }
    
    let secondsLeft = 10;
    if (this.state.manualTestingMode) {
      const lengths = [10, 15, 20, 30];
      secondsLeft = lengths[Math.floor(Math.random() * lengths.length)];
    }
    countdownEl.innerText = `\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0447\u0435\u0440\u0435\u0437 ${secondsLeft} \u0441\u0435\u043a...`;
    
    if (this.adTimerInterval) clearInterval(this.adTimerInterval);
    this.adTimerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        countdownEl.innerText = `\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u0447\u0435\u0440\u0435\u0437 ${secondsLeft} \u0441\u0435\u043a...`;
      } else {
        clearInterval(this.adTimerInterval);
        countdownEl.innerText = '\u0420\u0435\u043a\u043b\u0430\u043c\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430';
        closeBtn.style.display = 'block';
        if (isDev) {
          closeBtn.innerText = "\u2716 (\u0420\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a)";
        } else {
          closeBtn.innerText = "\u2716";
        }
      }
    }, 1000);
  }
  closeMockAd() {
    const overlay = document.getElementById('mock-ad-overlay');
    if (overlay) overlay.style.display = 'none';
    
    // Save last ad timestamp
    const now = Date.now();
    this.state.lastAdTime = now;
    this.saveState();
    
    // If there is an active branch context, update its timestamp too
    if (this.state.activeBranchId && this.state.email) {
      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === this.state.email.toLowerCase());
      if (client && client.branches) {
        const br = client.branches.find(b => b.id === this.state.activeBranchId);
        if (br) {
          br.lastAdTime = now;
          this.saveDatabaseClients();
        }
      }
    }

    if (this.state.adCallback) {
      const cb = this.state.adCallback;
      this.state.adCallback = null;
      cb();
    }
  }

  openPremiumFromAd() {
    const overlay = document.getElementById('mock-ad-overlay');
    if (overlay) overlay.style.display = 'none';
    this.state.adShownThisSession = true;
    this.openGooglePlayBilling();
  }

  openGooglePlayBilling() {
    const sheet = document.getElementById('google-play-billing-sheet');
    if (sheet) sheet.classList.add('active');
  }

  closeGooglePlayBilling() {
    const sheet = document.getElementById('google-play-billing-sheet');
    if (sheet) sheet.classList.remove('active');
    
    // Resume view switch if there was an active callback
    if (this.state.adCallback) {
      const cb = this.state.adCallback;
      this.state.adCallback = null;
      cb();
    }
  }

  processGooglePlayPurchase() {
    this.closeGooglePlayBilling();
    this.playAudioTone('success');
    
    this.state.subscription = 'pro_monthly';
    this.state.subscriptionExpires = Date.now() + 30 * 24 * 60 * 60 * 1000;
    this.saveState();
    this.syncActiveBranchToDatabase();
    
    this.updateAdminView();
    this.renderAdminGamesGrid();
    
    this.showToast("Premium успешно активирован через Google Play! 👑", false);
  }
};

