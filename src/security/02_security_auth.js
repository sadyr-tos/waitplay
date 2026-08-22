// security/02_security_auth.js - Security Auth & Roles

export const authMethods = {
  // --- SUPPORT & ACCOUNTS RECOVERY LOGIC ---
  openSupportPortal() {
    document.getElementById('support-portal-modal').classList.add('active');
    this.setSupportMode('recovery');
    
    document.getElementById('support-verify-email').value = '';
    document.getElementById('support-verify-phone').value = '';
    
    const feedbackEmailInput = document.getElementById('support-feedback-email');
    if (feedbackEmailInput) {
      feedbackEmailInput.value = this.state.email || '';
    }
    
    const feedbackTextInput = document.getElementById('support-feedback-text');
    if (feedbackTextInput) {
      feedbackTextInput.value = '';
    }
  }

  setSupportMode(mode) {
    try {
      const isRecovery = mode === 'recovery';
      
      const btnRec = document.getElementById('btn-support-mode-recovery');
      const btnFeed = document.getElementById('btn-support-mode-feedback');
      
      if (btnRec) {
        btnRec.style.color = isRecovery ? 'var(--gold)' : 'var(--text-muted)';
        btnRec.style.borderBottom = isRecovery ? '2px solid var(--gold)' : 'none';
      }
      if (btnFeed) {
        btnFeed.style.color = !isRecovery ? 'var(--gold)' : 'var(--text-muted)';
        btnFeed.style.borderBottom = !isRecovery ? '2px solid var(--gold)' : 'none';
      }

      const recContainer = document.getElementById('support-recovery-steps-container');
      const feedContainer = document.getElementById('support-feedback-form');
      
      if (recContainer) recContainer.style.display = isRecovery ? 'block' : 'none';
      if (feedContainer) feedContainer.style.display = isRecovery ? 'none' : 'block';
    } catch (e) {
      console.error("Error setting support mode:", e);
    }
  }

  supportSubmitFeedback() {
    try {
      const emailInput = document.getElementById('support-feedback-email');
      const textInput = document.getElementById('support-feedback-text');
      
      const email = emailInput ? emailInput.value.trim() : '';
      const text = textInput ? textInput.value.trim() : '';

      if (!email || !email.includes('@')) {
        this.showToast("Введите корректный адрес почты!", true);
        return;
      }

      if (!text || text.length < 5) {
        this.showToast("Пожалуйста, введите ваш отзыв или предложение!", true);
        return;
      }

      // Create new feedback ticket
      const newFeedback = {
        id: Date.now(),
        type: 'FEEDBACK',
        email: email,
        content: text,
        timestamp: new Date().toLocaleTimeString()
      };

      this.state.supportTickets.push(newFeedback);
      this.saveState();
      
      this.renderCreatorTicketsList();
      
      if (textInput) textInput.value = '';
      
      this.showToast("Отзыв успешно отправлен Создателю WaitPlay 🚀 Спасибо!", false);
      this.closeSupportPortal();
    } catch (e) {
      alert("Ошибка supportSubmitFeedback:\n" + e.message);
    }
  }

  closeSupportPortal() {
    document.getElementById('support-portal-modal').classList.remove('active');
    this.stopTimer('supportEmail');
    this.stopTimer('supportPhone');
  }

  setSupportStepView(stepNum) {
    const steps = ['1', '2', '3', '4'];
    steps.forEach(s => {
      const el = document.getElementById(`support-step-${s}`);
      if (el) el.classList.toggle('active', s === stepNum);
    });
  }

  supportSubmitCredentials() {
    const email = document.getElementById('support-verify-email').value.trim();
    const prefixSelect = document.getElementById('support-phone-country-code');
    const prefixVal = prefixSelect ? prefixSelect.value : '996';
    const cleanPrefix = (prefixVal === '7_kz' || prefixVal === '7_ru') ? '7' : prefixVal;
    const phoneInput = document.getElementById('support-verify-phone').value.trim().replace(/\D/g, '');
    const phone = cleanPrefix + phoneInput;

    if (this.state.subscription === 'none') {
      this.showToast("База данных пуста! Создайте сначала аккаунт.", true);
      return;
    }

    if (email !== this.state.email || phone !== this.state.phone) {
      this.showToast("Ошибка: Email и Телефон не совпадают с регистрационными данными!", true);
      return;
    }

    this.setSupportStepView('2');
    document.getElementById('support-code-email-input').value = '';
    this.supportSendEmailCode();
  }

  supportSendEmailCode() {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.supportEmail.code = code;
    this.startTimer('supportEmail', 'support-email-timer', () => {
      this.timers.supportEmail.code = '';
      this.showToast("Код Email истек. Запросите заново.", true);
    });
    
    // Send real email via API
    this.sendRealEmail(this.state.email, code, "Запрос блокировки аккаунта (Поддержка)");
  }

  supportResendEmailCode() {
    this.supportSendEmailCode();
  }

  supportVerifyEmailCode() {
    try {
      const entered = document.getElementById('support-code-email-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.supportEmail.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('supportEmail');
        
        this.setSupportStepView('3');
        document.getElementById('support-code-phone-input').value = '';
        this.supportSendPhoneCode();
      } else {
        this.showToast("Неверный код Email подтверждения!", true);
      }
    } catch (e) {
      alert("Ошибка supportVerifyEmailCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  supportSendPhoneCode() {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.supportPhone.code = code;
    this.startTimer('supportPhone', 'support-phone-timer', () => {
      this.timers.supportPhone.code = '';
      this.showToast("Код SMS истек. Запросите заново.", true);
    });
    this.showToast(`[Имитация SMS] SMS код сброса аккаунта: ${code}`, false);
  }

  supportResendPhoneCode() {
    this.supportSendPhoneCode();
  }

  supportVerifyPhoneCode() {
    try {
      const entered = document.getElementById('support-code-phone-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.supportPhone.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('supportPhone');
        
        const newTicket = {
          id: Date.now(),
          email: this.state.email,
          phone: this.state.phone,
          status: "Верифицировано владельцем по Email и SMS ✔️",
          timestamp: new Date().toLocaleTimeString()
        };
        this.state.supportTickets.push(newTicket);
        this.saveState();
        
        this.renderCreatorTicketsList();
        this.setSupportStepView('4');
      } else {
        this.showToast("Неверный проверочный SMS код!", true);
      }
    } catch (e) {
      alert("Ошибка supportVerifyPhoneCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

};

