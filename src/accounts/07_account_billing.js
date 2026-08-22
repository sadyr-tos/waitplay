// accounts/07_account_billing.js - Billing & Subscriptions

export const billingMethods = {
  // --- BILLING CYCLE & PAYMENT SELECTION ---
  setBillingCycle(cycle) {
    this.billingCycle = cycle;
    document.getElementById('toggle-monthly').classList.toggle('active', cycle === 'monthly');
    document.getElementById('toggle-yearly').classList.toggle('active', cycle === 'yearly');
    
    const baseAmount = document.getElementById('price-base-amount');
    const proAmount = document.getElementById('price-pro-amount');
    if (cycle === 'monthly') {
      baseAmount.innerHTML = "500 <span>сом / месяц</span>";
      proAmount.innerHTML = "1 000 <span>сом / месяц</span>";
    } else {
      baseAmount.innerHTML = "5 000 <span>сом / год</span>";
      proAmount.innerHTML = "10 000 <span>сом / год</span>";
    }
    this.updatePayButtonLabel();
  }

  selectPlan(plan) {
    this.selectedPlan = plan;
    document.getElementById('card-base').classList.toggle('selected', plan === 'base');
    document.getElementById('card-pro').classList.toggle('selected', plan === 'pro');
    
    const baseBtn = document.querySelector('#card-base .btn-select-plan');
    const proBtn = document.querySelector('#card-pro .btn-select-plan');
    if (plan === 'base') {
      baseBtn.innerText = "Выбран";
      proBtn.innerText = "Выбрать PRO";
    } else {
      baseBtn.innerText = "Выбрать Базовый";
      proBtn.innerText = "Выбран";
    }

    this.updatePayButtonLabel();
  }

  updatePayButtonLabel() {
    const btn = document.getElementById('btn-pay-execute');
    if (!btn) return;
    const price = (this.selectedPlan === 'base') 
      ? (this.billingCycle === 'monthly' ? "500 сом" : "5 000 сом")
      : (this.billingCycle === 'monthly' ? "1 000 сом" : "10 000 сом");
    
    btn.innerText = `💳 Оплатить ${this.selectedPlan === 'pro' ? 'PRO' : 'БАЗОВУЮ'} подписку (${price})`;
  }

  processPayment() {
    try {
      const isSandbox = this.isSandboxMode();
      const isPro = this.selectedPlan === 'pro';
      const price = isPro 
        ? (this.billingCycle === 'monthly' ? "1 000 \u0441\u043e\u043c" : "10 000 \u0441\u043e\u043c")
        : (this.billingCycle === 'monthly' ? "500 \u0441\u043e\u043c" : "5 000 \u0441\u043e\u043c");
      
      if (this.selectedPaymentType === 'card') {
        const cardNum = document.getElementById('pay-card-number').value.replace(/\s+/g, '');
        const expiry = document.getElementById('pay-card-expiry').value;
        const cvc = document.getElementById('pay-card-cvc').value;
        
        if (!isSandbox) {
          if (cardNum.length < 16) {
            this.showToast("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u043e\u043b\u043d\u044b\u0439 16-\u0437\u043d\u0430\u0447\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440 \u043a\u0430\u0440\u0442\u044b Visa!", true);
            return;
          }
          if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            this.showToast("\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0441\u0440\u043e\u043a \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u043a\u0430\u0440\u0442\u044b \u0432 \u0444\u043e\u0445\u043c\u0430\u0442\u0435 MM/YY!", true);
            return;
          }
          if (cvc.length < 3) {
            this.showToast("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 3-\u0437\u043d\u0430\u0447\u043d\u044b\u0439 CVC \u043a\u043e\u0434 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438!", true);
            return;
          }
        }
      } else if (this.selectedPaymentType === 'bank') {
        if (!this.selectedBank && !isSandbox) {
          this.showToast("\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0430\u043d\u043a \u0434\u043b\u044f \u043e\u043f\u043b\u0430\u0442\u044b!", true);
          return;
        }
      }

      const payBtn = document.getElementById('btn-pay-execute');
      payBtn.disabled = true;
      payBtn.innerText = `\u23f3 \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043f\u043b\u0430\u0442\u0435\u0436\u0430...`;

      setTimeout(() => {
        payBtn.disabled = false;
        
        if (this.isAddingBranch || this.state.subscription === 'none') {
          this.state.databaseClients = this.state.databaseClients || [];
          let client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === this.state.email.toLowerCase());
          if (!client) {
            client = {
              email: this.state.email,
              phone: this.state.phone,
              status: '\u0410\u043a\u0442\u0438\u0432\u0435\u043d',
              branches: []
            };
            this.state.databaseClients.push(client);
          }

          const branchId = 'br_' + Date.now();
          const newBranch = {
            id: branchId,
            name: this.pendingBranchName || "\u041c\u043e\u0439 \u0444\u0438\u043b\u0438\u0430\u043b",
            subscription: this.selectedPlan + '_' + this.billingCycle,
            lat: this.state.adminCoords.lat,
            lng: this.state.adminCoords.lng,
            welcomeMsg: `\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 ${this.pendingBranchName || "\u041c\u043e\u0439 \u0444\u0438\u043b\u0438\u0430\u043b"}`,
            deviceModel: "iPhone 15 Pro Max (\u041d\u043e\u0432\u043e\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e)",
            status: '\u0410\u043a\u0442\u0438\u0432\u0435\u043d',
            deviceHistory: [`${new Date().toLocaleDateString()}: \u041f\u0435\u0440\u0432\u0438\u0447\u043d\u0430\u044f \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f: iPhone 15 Pro Max`]
          };

          client.branches.push(newBranch);
          this.saveDatabaseClients();

          this.isAddingBranch = false;
          this.pendingBranchName = null;
          this.state.consentAccepted = true;
          this.saveState();

          this.loadBranchContext(this.state.email, branchId);
          this.renderCreatorClientsList();
          this.showToast(`\u0424\u0438\u043b\u0438\u0430\u043b "${newBranch.name}" \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d!`, false);
        } else {
          this.state.subscription = this.selectedPlan + '_' + this.billingCycle;
          this.saveState();
          this.syncActiveBranchToDatabase();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 \u043f\u0440\u043e\u0434\u043b\u0435\u043d\u0430!", false);
        }
      }, 1500);
    } catch (e) {
      alert("Error in processPayment: " + e.message);
    }
  }
  openRelocationModal(price) {
    try {
      this.pendingPriceText = price;
      const modal = document.getElementById('relocation-confirm-modal');
      if (!modal) return;

      document.getElementById('relocation-modal-text').innerText = 
        "Хотите ли вы обновить фиксированные координаты (GPS и Wi-Fi) вашего заведения на ваши текущие координаты?";
      document.getElementById('relocation-warning-detail').style.display = 'none';
      document.getElementById('relocation-step-1-buttons').style.display = 'flex';
      document.getElementById('relocation-step-2-buttons').style.display = 'none';

      modal.classList.add('active');
    } catch (e) {
      console.error("Error opening relocation modal:", e);
    }
  }

  relocationHandleStep1(wantChange) {
    try {
      const modal = document.getElementById('relocation-confirm-modal');
      if (!modal) return;

      if (!wantChange) {
        modal.classList.remove('active');
        this.updateAdminView();
        this.renderAdminGamesGrid();
        this.showToast(`Подписка продлена (${this.pendingPriceText || ''})! Координаты заведения сохранены прежними.`, false);
      } else {
        document.getElementById('relocation-modal-text').innerText = 
          "Вы выбрали смену геоданных заведения. Пожалуйста, подтвердите ваше местоположение:";
        document.getElementById('relocation-warning-detail').style.display = 'block';
        document.getElementById('relocation-step-1-buttons').style.display = 'none';
        document.getElementById('relocation-step-2-buttons').style.display = 'flex';
      }
    } catch (e) {
      console.error("Error in relocationHandleStep1:", e);
    }
  }

  relocationConfirmUpdate(confirmUpdate) {
    try {
      const modal = document.getElementById('relocation-confirm-modal');
      if (modal) modal.classList.remove('active');

      this.updateAdminView();
      this.renderAdminGamesGrid();

      if (confirmUpdate) {
        this.state.venueCoords = { ...this.state.adminCoords };
        this.saveState();
        this.showToast(`Переезд выполнен! Списано ${this.pendingPriceText || ''}. Координаты заведения обновлены на ваши текущие ✔️`, false);
      } else {
        this.showToast(`Подписка продлена (${this.pendingPriceText || ''})! Координаты заведения сохранены прежними.`, false);
      }
    } catch (e) {
      console.error("Error in relocationConfirmUpdate:", e);
    }
  }

  startSubscriptionChange() {
    try {
      const isPro = this.state.subscription && this.state.subscription.includes('pro');
      if (!isPro) {
        this.openGooglePlayBilling();
      } else {
        const expiry = this.state.subscriptionExpires || (Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (!this.state.subscriptionExpires) {
          this.state.subscriptionExpires = expiry;
          this.saveState();
          this.syncActiveBranchToDatabase();
        }
        const dateStr = new Date(expiry).toLocaleDateString('ru-RU');
        
        const confirmCancel = confirm(`⭐ Информация о подписке WaitPlay Premium:\n\n` +
          `• Период подписки: 1 месяц (продление через Google Play)\n` +
          `• Стоимость: 499,00 ₽/мес\n` +
          `• Активна до: ${dateStr}\n` +
          `• Статус автопродления: Активно\n\n` +
          `Вы хотите отменить автопродление подписки и вернуться к бесплатному Базовому тарифу?`);
          
        if (confirmCancel) {
          this.state.subscription = 'none';
          delete this.state.subscriptionExpires;
          this.saveState();
          this.syncActiveBranchToDatabase();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("Подписка отменена. Вы переведены на Базовый тариф.", false);
        }
      }
    } catch (e) {
      console.error("Error in startSubscriptionChange:", e);
    }
  }

  updateAdminView() {
    // Check if the current user is banned
    const isBanned = this.checkBannedStatus();
    if (isBanned) {
      const banRecord = this.state.bannedUsers.find(user => {
        const banEmail = (user.email || '').toLowerCase();
        const banPhone = (user.phone || '').trim();
        return (this.state.email && banEmail === this.state.email.toLowerCase()) || 
               (this.state.phone && banPhone === this.state.phone.trim());
      });
      
      const emailSpan = document.getElementById('banned-info-email');
      const phoneSpan = document.getElementById('banned-info-phone');
      const reasonSpan = document.getElementById('banned-info-reason');
      
      if (emailSpan) emailSpan.innerText = this.state.email || '\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d';
      if (phoneSpan) phoneSpan.innerText = this.state.phone || '\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d';
      if (reasonSpan) reasonSpan.innerText = banRecord ? banRecord.reason : '\u041d\u0430\u0440\u0443\u0448\u0435\u043d\u0438\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u0439';
      
      const badge = document.getElementById('admin-plan-badge');
      if (badge) {
        badge.innerText = "\u0411\u041b\u041e\u041a\u0418\u0420\u041e\u0412\u041a\u0410 \ud83d\udeab";
        badge.className = "badge badge-danger";
        badge.style.display = "inline-block";
      }
      this.setAdminPanelActiveView('banned');
      return;
    }

    if (this.state.maintenanceMode) {
      const badge = document.getElementById('admin-plan-badge');
      if (badge) {
        badge.innerText = "\u0422\u0415\u0425\u0420\u0410\u0411\u041e\u0422\u042b \ud83d\udee0\ufe0f";
        badge.className = "badge badge-danger";
        badge.style.display = "inline-block";
      }
      this.setAdminPanelActiveView('maintenance');
      return;
    }

    const badge = document.getElementById('admin-plan-badge');
    const isPro = this.state.subscription && this.state.subscription.includes('pro');
    const hasActiveBranch = this.state.activeBranchId && this.state.email;
    
    if (badge) {
      if (hasActiveBranch) {
        badge.style.display = 'inline-block';
        if (isPro) {
          const expiry = this.state.subscriptionExpires || (Date.now() + 30 * 24 * 60 * 60 * 1000);
          if (!this.state.subscriptionExpires) {
            this.state.subscriptionExpires = expiry;
            this.saveState();
            this.syncActiveBranchToDatabase();
          }
          const dateStr = new Date(expiry).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
          badge.innerText = `Premium 👑 (${dateStr})`;
          badge.className = "badge badge-pro";
        } else {
          badge.innerText = "\ud83d\udc51 \u0423\u0431\u0440\u0430\u0442\u044c \u0440\u0435\u043a\u043b\u0430\u043c\u0443";
          badge.className = "badge badge-pro";
        }
      } else {
        badge.style.display = 'none';
      }
    }

    const testModeBtn = document.getElementById('btn-admin-test-mode');
    if (testModeBtn) {
      if (hasActiveBranch) {
        testModeBtn.style.display = 'flex';
        if (this.state.manualTestingMode) {
          testModeBtn.style.opacity = '1';
          testModeBtn.style.backgroundColor = '#ffffff';
          testModeBtn.style.color = '#0b0a13';
          testModeBtn.style.borderColor = '#ffffff';
          testModeBtn.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
        } else {
          testModeBtn.style.opacity = '0.6';
          testModeBtn.style.backgroundColor = 'transparent';
          testModeBtn.style.color = 'var(--text-muted)';
          testModeBtn.style.borderColor = 'var(--border-light)';
          testModeBtn.style.boxShadow = 'none';
        }
      } else {
        testModeBtn.style.display = 'none';
      }
    }

    const activeEl = document.querySelector('.view-panel.active');
    const activeViewId = activeEl ? activeEl.id.replace('admin-', '').replace('-panel', '') : '';
    const adminViews = ['dashboard', 'edit-quiz', 'migration', 'edit-ttt', 'edit-memory', 'edit-differences', 'edit-crossword', 'edit-guessword'];
    const onboardingViews = ['welcome-choice', 'consent', 'reg-email', 'reg-phone', 'select-branch', 'add-branch', 'payment'];
    
    if (hasActiveBranch) {
      // If logged in and has active branch, force dashboard/admin panels
      if (onboardingViews.includes(activeViewId) || !adminViews.includes(activeViewId)) {
        this.setAdminPanelActiveView('dashboard');
      }
    } else {
      // If onboarding, force welcome-choice or other onboarding panels
      if (!onboardingViews.includes(activeViewId)) {
        this.setAdminPanelActiveView('welcome-choice');
      }
    }

    this.updateAIGeneratorBox();
    this.recalculateDistances();
    this.renderCreatorClientsList();
    this.updateAdminPanelSwitcherDropdown();
    this.renderRegQuickAccounts();
    this.renderAdminAccountSwitcher();
  }
  updateAdminPanelSwitcherDropdown() {
    const emailLower = (this.state.email || '').toLowerCase();
    const client = (this.state.databaseClients || []).find(c => c.email && c.email.toLowerCase() === emailLower);
    const dropdown = document.getElementById('admin-switch-account-dropdown');
    if (dropdown && client && client.branches) {
      dropdown.innerHTML = '';
      client.branches.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.innerText = b.name;
        if (b.id === this.state.activeBranchId) opt.selected = true;
        dropdown.appendChild(opt);
      });
    }
  }
  setAdminPanelActiveView(viewId) {
    let finalViewId = viewId;
    
    // Check if we need to show B2B ad based on 1-hour global and branch-specific cooldowns
    const isPro = this.state.subscription && this.state.subscription.includes('pro');
    const hasActiveBranch = this.state.activeBranchId && this.state.email;
    const now = Date.now();
    const lastAd = this.state.lastAdTime || 0;
    // 30 minutes (1800000 ms) in testing mode, 1 hour (3600000 ms) in live mode
    const cooldownPeriod = this.state.manualTestingMode ? 1800000 : 3600000;

    if (viewId === 'dashboard' && hasActiveBranch && !isPro && (now - lastAd >= cooldownPeriod)) {
      let branchCooldownPassed = true;
      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === this.state.email.toLowerCase());
      if (client && client.branches) {
        const br = client.branches.find(b => b.id === this.state.activeBranchId);
        if (br) {
          const brLastAd = br.lastAdTime || 0;
          if (now - brLastAd < cooldownPeriod) {
            branchCooldownPassed = false;
          }
        }
      }

      if (branchCooldownPassed) {
        this.triggerMockAd(() => {
          this.setAdminPanelActiveView('dashboard');
        });
        return;
      }
    }

    const isUserBanned = this.checkBannedStatus();
    const isMaintenance = this.state.maintenanceMode === true;
    
    if (isUserBanned) {
      finalViewId = 'banned';
    } else if (isMaintenance) {
      finalViewId = 'maintenance';
    }

    const panels = [
      'welcome-choice', 'consent', 'reg-email', 'reg-phone', 
      'select-branch', 'add-branch', 'payment', 
      'dashboard', 'edit-quiz', 'migration', 'banned', 'maintenance', 'edit-ttt', 'edit-memory', 'edit-differences', 'edit-crossword', 'edit-guessword', 'edit-checkers', 'edit-stickmanrace', 'edit-slicing'
    ];
    panels.forEach(p => {
      const el = document.getElementById(`admin-${p}-panel`);
      if (el) el.classList.toggle('active', p === finalViewId);
    });

    if (finalViewId === 'welcome-choice') {
      this.renderRegQuickAccounts();
    }

    if (viewId !== 'payment') {
      const backBtn = document.getElementById('btn-payment-back');
      const warningBox = document.getElementById('payment-relocation-warning');
      if (backBtn) backBtn.style.display = 'none';
      if (warningBox) warningBox.style.display = 'none';
    }
  }
  showToast(message, isError = false) {
    const el = document.getElementById('admin-toast');
    if (!el) return;
    el.innerText = message;
    el.classList.toggle('error', isError);
    el.style.display = 'flex';
    
    if (this.adminToastTimeout) {
      clearTimeout(this.adminToastTimeout);
    }
    this.adminToastTimeout = setTimeout(() => {
      el.style.display = 'none';
    }, 3500);
  }

  showVisitorToast(message, isError = false) {
    const el = document.getElementById('visitor-toast');
    if (!el) return;
    el.innerText = message;
    el.classList.toggle('error', isError);
    el.style.display = 'flex';
    
    if (this.visitorToastTimeout) {
      clearTimeout(this.visitorToastTimeout);
    }
    this.visitorToastTimeout = setTimeout(() => {
      el.style.display = 'none';
    }, 3500);
  }

  playAudioTone(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'victory') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gainNode.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.08);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.08 + 0.3);
          oscNode.start(ctx.currentTime + i * 0.08);
          oscNode.stop(ctx.currentTime + i * 0.08 + 0.35);
        });
      }
    } catch (e) {
      console.warn("AudioContext block/unsupported:", e);
    }
  }

  updateVisitorView() {
    this.setVisitorViewPanel(this.state.visitorActiveView);
    if (this.state.visitorActiveView === 'lobby') {
      this.initVisitorLobby();
    } else if (this.state.visitorActiveView === 'results') {
      this.finishVisitorGame(true);
    } else if (this.state.visitorActiveView === 'game') {
      const gid = this.state.visitorSelectedGameId;
      if (gid === 8 && this.state.slicingStarted && !this.state.slicingFinished) {
        this.renderSlicingGame();
      } else {
        this.renderActiveGameQuestion();
      }
    }
  }

  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const deltaPhi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c);
  }

  formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    input.value = formatted;
  }

  simulateDeviceMigration() {
    this.openDeviceMigrationPanel();
  }

  renderAdminGamesGrid() {
    this.sortGames();
    const container = document.getElementById('games-container');
    if (!container) return;
    container.innerHTML = '';

    const isPro = this.state.subscription.includes('pro');
    const isTest = !!this.state.manualTestingMode;

    this.state.games.forEach(g => {
      const card = document.createElement('div');
      
      const lockedByBase = g.isPro && !isPro;
      const isVisible = g.enabled && g.published;
      
      card.className = `game-card ${isVisible && !lockedByBase ? 'active-game' : 'blocked-game'}`;
      if (lockedByBase) {
        card.style.cursor = 'pointer';
        card.onclick = () => {
          this.showToast("Игра доступна только в Premium тарифе! Открываем Google Play...", false);
          this.openGooglePlayBilling();
        };
      }
      
      let actionsHTML = '';
      const btnStyle = isTest ? '' : 'opacity:0.5; cursor:not-allowed;';
      const btnAttr = isTest ? '' : 'disabled';
      
      if (g.id === 1) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editQuiz()">✏️ Вопросы</button>`;
      } else if (g.id === 2) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editDifferences()">⚙️ Настройки</button>`;
      } else if (g.id === 3) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editStickmanRace()">⚙️ Настройки</button>`;
      } else if (g.id === 4) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editTicTacToe()">⚙️ Настройки</button>`;
      } else if (g.id === 6) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editMemory()">⚙️ Настройки</button>`;
      } else if (g.id === 5) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editCrossword()">⚙️ Настройки</button>`;
      } else if (g.id === 10) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editGuessWord()">⚙️ Настройки</button>`;
      } else if (g.id === 11) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editCheckers()">⚙️ Настройки</button>`;
      } else if (g.id === 8) {
        actionsHTML = `<button class="btn btn-secondary" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.editSlicingGame()">⚙️ Настройки</button>`;
      } else if (g.isAIGenerated) {
        actionsHTML = `<button class="btn btn-danger" style="padding: 4px; font-size:10px; margin-top:4px; border-radius:6px; ${btnStyle}" ${btnAttr} onclick="app.deleteGame(${g.id})">🗑️ Удалить</button>`;
      }

      card.innerHTML = `
        <div class="game-card-header">
          <span class="game-card-icon">${g.icon}</span>
          ${lockedByBase ? '<span class="game-lock-overlay" style="color:var(--gold); font-size:9px; font-weight:700;">🔒 PRO</span>' : `
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:9px; color:${isVisible ? 'var(--success)' : 'var(--text-muted)'}; font-weight:700;">
              ${isVisible ? 'Опубликована' : 'Скрыта'}
            </span>
            <label class="switch" style="${isTest ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
              <input type="checkbox" ${isVisible ? 'checked' : ''} ${isTest ? 'disabled' : ''} onchange="app.toggleGamePublishState(${g.id}, this.checked)">
              <span class="slider"></span>
            </label>
          </div>
          `}
        </div>
        <div class="game-card-title">${g.name} ${g.isPro ? '<span style="color:var(--gold); font-size:8px; font-weight:800; margin-left:4px;">PRO</span>' : ''}</div>
        <div class="game-card-players" style="display:flex; align-items:center; gap:4px; font-size:10px; margin-top:3px; color:var(--text-muted);">
          <span>👥 Мин:</span>
          <input type="number" min="2" max="${g.maxPlayers}" value="${g.minPlayers}" ${isTest ? '' : 'disabled'} style="width: 32px; padding: 2px; font-size: 10px; text-align: center; background: rgba(0,0,0,0.4); border: 1px solid var(--border-light); border-radius: 4px; color: #fff; font-weight:700; margin:0;" onchange="app.changeGameMinPlayers(${g.id}, this.value)">
          <span>- ${g.maxPlayers} чел.</span>
        </div>
        ${actionsHTML}
      `;
      container.appendChild(card);
    });
  }

  toggleGamePublishState(id, checked) {
    if (this.state.manualTestingMode) {
      this.showToast("Включен тест-режим! Публикация заблокирована.", true);
      this.renderAdminGamesGrid();
      return;
    }
    
    const game = this.state.games.find(g => g.id === id);
    if (game) {
      game.enabled = checked;
      game.published = checked;
      this.saveState();
      this.syncActiveBranchToDatabase(); // Sync back to database branch games
      this.renderAdminGamesGrid();
      this.showToast(`Игра "${game.name}" ${checked ? 'опубликована для посетителей ✔️' : 'скрыта от посетителей ❌'}.`, false);
      
      if (!checked && this.state.visitorSelectedGameId === id && this.state.visitorConnectedBranchId === this.state.activeBranchId) {
        const isQueueActive = document.getElementById('lobby-queue-overlay')?.style.display === 'flex';
        if (isQueueActive || this.state.visitorActiveView === 'game') {
          this.triggerVisitorDisconnectMessage(`Администратор снял с публикации игру "${game.name}".`);
        }
      }
      
      if (this.state.visitorActiveView === 'lobby') {
        this.renderVisitorLobbyGames();
      }
    }
  }

  updateAIGeneratorBox() {
    try {
      const box = document.getElementById('ai-generator-admin-box');
      if (!box) return;
      
      const isPro = this.state.subscription.includes('pro');
      box.style.display = 'block';

      const promptInput = document.getElementById('ai-game-prompt');
      const btn = document.getElementById('btn-ai-generate');
      const badge = box.querySelector('.badge');

      if (isPro) {
        box.style.opacity = '1';
        box.style.border = '1px solid var(--border-glow)';
        if (promptInput) {
          promptInput.disabled = false;
          promptInput.placeholder = "Введите тему игры (например: Коктейли)...";
        }
        if (btn) {
          btn.disabled = false;
          btn.className = "btn btn-pro";
          btn.innerText = "✨ Сгенерировать игру с помощью ИИ";
          btn.onclick = () => this.generateAIGame();
        }
        if (badge) {
          badge.className = "badge badge-pro";
          badge.innerText = "PRO АКТИВЕН";
          badge.style.background = 'rgba(245, 158, 11, 0.15)';
          badge.style.color = 'var(--gold)';
        }
      } else {
        box.style.opacity = '0.55';
        box.style.border = '1px dashed var(--border-light)';
        if (promptInput) {
          promptInput.disabled = true;
          promptInput.placeholder = "🔒 Доступно только в PRO тарифе";
          promptInput.value = "";
        }
        if (btn) {
          btn.disabled = false;
          btn.className = "btn btn-secondary";
          btn.innerText = "🔒 Сгенерировать через ИИ (Нужен PRO)";
          btn.onclick = () => {
            this.showToast("ИИ-генератор доступен только в тарифе PRO! Пожалуйста, обновите вашу подписку.", true);
          };
        }
        if (badge) {
          badge.className = "badge badge-danger";
          badge.innerText = "ТРЕБУЕТСЯ PRO";
          badge.style.background = 'rgba(239, 68, 68, 0.15)';
          badge.style.color = 'var(--error)';
        }
      }
    } catch (e) {
      console.warn("Error updating AI generator box display:", e);
    }
  }

  generateAIGame() {
    try {
      if (this.state.subscription === 'none') {
        this.showToast("Сначала оплатите PRO подписку!", true);
        return;
      }

      const promptInput = document.getElementById('ai-game-prompt');
      const promptText = promptInput ? promptInput.value.trim() : '';

      if (!promptText) {
        this.showToast("Введите тему или описание игры!", true);
        return;
      }

      // 1. Limits validation check
      let forbiddenKeywords = [];
      const filterStrictness = this.state.filterStrictness || 'normal';
      
      if (filterStrictness === 'strict') {
        forbiddenKeywords = [
          'gta', 'pubg', '3d', 'shooter', 'шутер', 'minecraft', 'майнкрафт',
          'dota', 'дота', 'cs:go', 'cs', 'кс', 'cyberpunk', 'crazy', 'безумная',
          'heavy', 'action', 'fifa', 'фифа', 'войнушка', 'убийств', '18+', 'порно', 'секс',
          'алкоголь', 'пиво', 'водка', 'вино', 'кока-кола', 'cola', 'pepsi', 'бренд'
        ];
      } else if (filterStrictness === 'normal') {
        forbiddenKeywords = [
          'gta', 'pubg', '3d', 'shooter', 'шутер', 'minecraft', 'майнкрафт',
          'dota', 'дота', 'cs:go', 'cs', 'кс', 'cyberpunk', 'crazy', 'безумная',
          'heavy', 'action', 'fifa', 'фифа', 'войнушка', 'убийств', '18+', 'порно', 'секс'
        ];
      } else {
        forbiddenKeywords = ['18+', 'порно', 'секс'];
      }
      
      const promptLower = promptText.toLowerCase();
      const isOutOfBounds = forbiddenKeywords.some(keyword => promptLower.includes(keyword));

      if (isOutOfBounds) {
        const engineName = (this.state.aiEngine || 'waitplay-v2').toUpperCase();
        this.logAIRequest(promptText, `Отклонено ИИ (${filterStrictness.toUpperCase()} / ${engineName}) ❌`);
        
        const limitsModal = document.getElementById('ai-limits-modal');
        if (limitsModal) {
          limitsModal.classList.add('active');
        }
        return;
      }

      // 2. Cooldown check (1 week in simulated milliseconds)
      const now = Date.now();
      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      if (now - this.state.lastAIGenTime < oneWeekMs) {
        const diffMs = oneWeekMs - (now - this.state.lastAIGenTime);
        const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
        this.showToast(`Лимит: 1 генерация в неделю. Доступно через ${days} дн.`, true);
        return;
      }

      // 3. Max AI games limit check
      const aiGamesCount = this.state.games.filter(g => g.isAIGenerated).length;
      if (aiGamesCount >= 8) {
        this.showToast("Максимально 8 ИИ игр на сервере. Удалите старые игры для генерации новой.", true);
        return;
      }

      // 4. Generate the game
      const btn = document.getElementById('btn-ai-generate');
      const statusEl = document.getElementById('ai-generator-status');
      
      btn.disabled = true;
      btn.innerText = "⏳ Подключение к серверу ИИ...";
      if (statusEl) statusEl.innerText = "Формирование запроса...";

      const isBackup = this.state.backupGenerator === true;
      const delay1 = isBackup ? 200 : 800;
      const delay2 = isBackup ? 300 : 1500;

      setTimeout(() => {
        if (statusEl) statusEl.innerText = "Генерация викторины по теме...";
        
        setTimeout(() => {
          btn.disabled = false;
          btn.innerText = "✨ Сгенерировать игру с помощью ИИ";
          if (statusEl) statusEl.innerText = "";

          let emoji = "🧠";
          let name = `Квиз: ${promptText.substring(0, 18)}`;
          
          if (promptLower.includes('коктейл') || promptLower.includes('бар') || promptLower.includes('напит')) {
            emoji = "🍸";
            name = "Барная Викторина 🍸";
          } else if (promptLower.includes('еда') || promptLower.includes('кухн') || promptLower.includes('меню') || promptLower.includes('блюд')) {
            emoji = "🍔";
            name = "Кулинарный Квиз 🍔";
          } else if (promptLower.includes('кофе') || promptLower.includes('чай') || promptLower.includes('десерт')) {
            emoji = "☕";
            name = "Кофейный Гурман ☕";
          } else if (promptLower.includes('пив') || promptLower.includes('закуск')) {
            emoji = "🍺";
            name = "Пивной Квиз 🍺";
          } else if (promptLower.includes('вино') || promptLower.includes('сомелье')) {
            emoji = "🍷";
            name = "Квиз: Винный гид 🍷";
          }

          const newGame = {
            id: Date.now(),
            name: name,
            icon: emoji,
            minPlayers: 4,
            maxPlayers: 10,
            enabled: true,
            published: true,
            isPro: false,
            isAIGenerated: true
          };

          this.state.games.push(newGame);
          this.state.lastAIGenTime = Date.now();
          
          const engineName = (this.state.aiEngine || 'waitplay-v2').toUpperCase();
          const generatorType = isBackup ? 'Автономный' : 'Облако';
          this.logAIRequest(promptText, `Успешно (${engineName} / ${generatorType}) ✅`);
          
          this.sortGames();
          this.saveState();
          this.renderAdminGamesGrid();
          this.showToast(`Игра "${name}" успешно сгенерирована ИИ и добавлена!`, false);
          
          if (promptInput) promptInput.value = '';
          
          if (this.state.visitorActiveView === 'lobby') {
            this.renderVisitorLobbyGames();
          }
        }, delay2);
      }, delay1);
    } catch (e) {
      alert("Ошибка в generateAIGame:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }


  deleteGame(gameId) {
    try {
      this.state.games = this.state.games.filter(g => g.id !== gameId);
      this.saveState();
      this.renderAdminGamesGrid();
      this.showToast("ИИ игра успешно удалена.", false);
      if (this.state.visitorActiveView === 'lobby') {
        this.renderVisitorLobbyGames();
      }
    } catch (e) {
      alert("Ошибка в deleteGame:\n" + e.message);
    }
  }

};

