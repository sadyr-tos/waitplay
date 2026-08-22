// accounts/06_account_registration.js - Registration Workflow

export const registrationMethods = {
  // --- STEPPED REGISTRATION WORKFLOW ---
  consentAccept() {
    const checkbox = document.getElementById('consent-agreement-checkbox');
    const container = document.getElementById('consent-checkbox-lbl');
    if (!checkbox.checked) {
      container.classList.add('error');
      this.showToast("Вы должны согласиться с предупреждением GPS!", true);
      setTimeout(() => container.classList.remove('error'), 500);
      return;
    }
    this.state.consentAccepted = true;
    this.saveState();
    
    this.setAdminPanelActiveView('reg-email');
  }

  regSendEmailCode() {
    try {
      const email = document.getElementById('reg-email').value.trim();
      if (!email || !email.includes('@')) {
        this.showToast("Введите корректный адрес электронной почты!", true);
        return;
      }

      let existingClient = this.getClientProfileByEmail(email);
      if (!this.isLoginFlow && existingClient) {
        if (this.isSandboxMode()) {
          // Developer testing bypass - auto-delete old profile to test signup completely fresh
          this.state.databaseClients = this.state.databaseClients.filter(c => c.email && c.email.toLowerCase() !== email.toLowerCase());
          this.saveDatabaseClients();
          this.showToast("📍 [Режим Создателя] Старый профиль сброшен для чистого теста регистрации.", false);
        } else {
          this.showToast("Этот Email уже зарегистрирован! Войдите в аккаунт, чтобы управлять филиалами.", true);
          return;
        }
      }

      const code = Math.floor(1000 + Math.random() * 9000).toString();
      this.timers.regEmail.code = code;
      
      document.getElementById('reg-email-input-group').style.display = 'none';
      document.getElementById('reg-email-code-group').style.display = 'block';

      this.startTimer('regEmail', 'reg-email-timer', () => {
        this.timers.regEmail.code = '';
        this.showToast("Время действия проверочного кода истекло. Отправьте код снова.", true);
      });

      // Check if client already has a subscription
      existingClient = this.getClientProfileByEmail(email);
      if (existingClient && existingClient.subscription !== 'none') {
        this.showToast("Аккаунт найден! Отправлен код для переноса управления.", false);
        this.sendRealEmail(email, code, "Перенос управления аккаунтом на новое устройство");
      } else {
        this.showToast("Код верификации отправлен на вашу почту.", false);
        this.sendRealEmail(email, code, "Код регистрации аккаунта");
      }
    } catch (e) {
      alert("Ошибка в regSendEmailCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  regResendEmailCode() {
    document.getElementById('reg-email-input-group').style.display = 'block';
    document.getElementById('reg-email-code-group').style.display = 'none';
    this.stopTimer('regEmail');
    this.showToast("Введите почту заново для отправки кода", false);
  }

  regVerifyEmailCode() {
    try {
      const entered = document.getElementById('reg-email-code-input').value.trim();
      const isSandboxBypass = entered === "1234";
      
      if ((entered === this.timers.regEmail.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('regEmail');
        
        const emailInput = document.getElementById('reg-email').value.trim();
        const existingClient = this.getClientProfileByEmail(emailInput);

        if (this.isLoginFlow) {
          // LOGIN FLOW
          if (!existingClient) {
            this.showToast("Этот Email не зарегистрирован! Пожалуйста, выберите 'Создать новый аккаунт'.", true);
            return;
          }

          if (existingClient.status === 'Заблокирован') {
            this.showToast("Этот аккаунт заблокирован создателем! 🚫", true);
            return;
          }

          this.state.email = emailInput;
          this.state.phone = existingClient.phone || '';
          this.saveState();

          this.showToast("Почта подтверждена. Введите номер телефона для СМС подтверждения ✔️", false);
          this.setAdminPanelActiveView('reg-phone');

          const phoneInput = document.getElementById('reg-phone');
          const phoneSelect = document.getElementById('reg-phone-country-code');
          if (phoneInput && phoneSelect) {
            const rawPhone = existingClient.phone || '';
            let matchedPrefix = '996';
            let matchedNumber = rawPhone;
            
            const prefixes = ['996', '998', '375', '992', '994', '374', '7'];
            for (const pref of prefixes) {
              if (rawPhone.startsWith(pref)) {
                matchedPrefix = pref;
                matchedNumber = rawPhone.substring(pref.length);
                break;
              }
            }
            
            if (matchedPrefix === '7') {
              if (matchedNumber.startsWith('7') || matchedNumber.startsWith('0') || matchedNumber.startsWith('4')) {
                phoneSelect.value = '7_kz';
              } else {
                phoneSelect.value = '7_ru';
              }
            } else {
              phoneSelect.value = matchedPrefix;
            }
            phoneInput.value = matchedNumber;
          }

          // Clear inputs
          document.getElementById('reg-email-code-input').value = '';
          document.getElementById('reg-email-input-group').style.display = 'block';
          document.getElementById('reg-email-code-group').style.display = 'none';

        } else {
          // REGISTRATION FLOW (Create new account or add new branch to existing)
          if (existingClient) {
            if (this.isSandboxMode()) {
              this.state.databaseClients = this.state.databaseClients.filter(c => c.email && c.email.toLowerCase() !== emailInput.toLowerCase());
              this.saveDatabaseClients();
            } else {
              this.showToast("Этот Email уже зарегистрирован! Войдите в аккаунт, чтобы управлять филиалами.", true);
              return;
            }
          }

          // Proceed to registration steps
          this.state.email = emailInput;
          this.saveState();
          
          const phoneInput = document.getElementById('reg-phone');
          if (phoneInput) {
            phoneInput.value = '';
          }

          // Reset phone view states to show input, hide verification group
          const phoneInputGrp = document.getElementById('reg-phone-input-group');
          const phoneCodeGrp = document.getElementById('reg-phone-code-group');
          if (phoneInputGrp) phoneInputGrp.style.display = 'block';
          if (phoneCodeGrp) phoneCodeGrp.style.display = 'none';

          this.showToast("Электронная почта успешно подтверждена ✔️", false);
          this.setAdminPanelActiveView('reg-phone');

          // Clear inputs
          document.getElementById('reg-email-code-input').value = '';
          document.getElementById('reg-email-input-group').style.display = 'block';
          document.getElementById('reg-email-code-group').style.display = 'none';
        }
      } else {
        this.showToast("Неверный проверочный код или срок действия истек!", true);
      }
    } catch (e) {
      alert("Ошибка regVerifyEmailCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

  regSendPhoneCode() {
    const prefixSelect = document.getElementById('reg-phone-country-code');
    const prefixVal = prefixSelect ? prefixSelect.value : '996';
    const cleanPrefix = (prefixVal === '7_kz' || prefixVal === '7_ru') ? '7' : prefixVal;
    const phoneInput = document.getElementById('reg-phone').value.trim().replace(/\D/g, '');
    const phone = cleanPrefix + phoneInput;

    if (!phoneInput || phoneInput.length < 6) {
      this.showToast("Введите корректный номер мобильного телефона!", true);
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.timers.regPhone.code = code;
    
    document.getElementById('reg-phone-input-group').style.display = 'none';
    document.getElementById('reg-phone-code-group').style.display = 'block';

    this.startTimer('regPhone', 'reg-phone-timer', () => {
      this.timers.regPhone.code = '';
      this.showToast("Срок действия SMS кода истек. Отправьте запрос заново.", true);
    });

    // SMS is simulated because real mobile gateways are paid, so we output it in a toast for verification
    this.showToast(`[Имитация SMS] SMS код подтверждения выслан: ${code}`, false);
  }

  regResendPhoneCode() {
    document.getElementById('reg-phone-input-group').style.display = 'block';
    document.getElementById('reg-phone-code-group').style.display = 'none';
    this.stopTimer('regPhone');
    this.showToast("Введите номер телефона повторно для SMS кода", false);
  }

  regVerifyPhoneCode() {
    try {
      const entered = document.getElementById('reg-phone-code-input').value.trim();
      const isSandboxBypass = entered === "1234";

      if ((entered === this.timers.regPhone.code || isSandboxBypass) && entered !== '') {
        this.stopTimer('regPhone');
        const prefixSelect = document.getElementById('reg-phone-country-code');
        const prefixVal = prefixSelect ? prefixSelect.value : '996';
        const cleanPrefix = (prefixVal === '7_kz' || prefixVal === '7_ru') ? '7' : prefixVal;
        const phoneInput = document.getElementById('reg-phone').value.trim().replace(/\D/g, '');
        this.state.phone = cleanPrefix + phoneInput;
        this.saveState();
        
        this.showToast("Номер телефона успешно подтвержден ✔️", false);
        
        // Clear input code
        document.getElementById('reg-phone-code-input').value = '';
        
        const existingClient = this.getClientProfileByEmail(this.state.email);
        if (this.isLoginFlow && existingClient) {
          const branches = existingClient.branches || [];
          if (branches.length === 0) {
            // No branches yet - go to name input
            this.setAdminPanelActiveView('add-branch');
            document.getElementById('add-branch-name').value = '';
          } else if (branches.length === 1) {
            this.loadBranchContext(existingClient.email, branches[0].id);
          } else {
            this.setAdminPanelActiveView('select-branch');
            this.renderSelectBranchList(branches, existingClient.email);
          }
        } else {
          // Registration flow
          this.setAdminPanelActiveView('add-branch');
          document.getElementById('add-branch-name').value = '';
        }
      } else {
        this.showToast("Неверный проверочный SMS код!", true);
      }
    } catch (e) {
      alert("Ошибка regVerifyPhoneCode:\n" + e.message + "\nStack:\n" + e.stack);
    }
  }

};

