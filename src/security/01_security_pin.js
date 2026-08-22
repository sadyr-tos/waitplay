// security/01_security_pin.js - Security PIN & Reset

export const pinMethods = {
  // --- HACKER LOGIN SIMULATOR ---
  debugTriggerHackerLoginSimulation() {
    if (this.state.subscription === 'none') {
      this.showToast("Сначала купите подписку владельцем, чтобы привязать почту!", true);
      return;
    }

    const emailBox = document.getElementById('owner-email-alert-modal');
    const emailBody = document.getElementById('owner-email-alert-body');

    emailBody.innerHTML = `
      Зафиксирована попытка входа с нового устройства вне заведения. 
      <br><br>
      Входящее устройство находится в <strong>1.5 км</strong> от ресторана (Дома). 
      Запрос заблокирован по умолчанию. 
      <br><br>
      Если это были вы, разрешите перенос управления кнопкой "Это я", или нажмите "Сменить пароль", чтобы немедленно защитить аккаунт.
    `;
    emailBox.classList.add('active');
  }

  ownerApproveMigrationMe() {
    document.getElementById('owner-email-alert-modal').classList.remove('active');
    this.showToast("Вы разрешили вход новому устройству (Перенос завершен) ✔️", false);
  }

  ownerTriggerPasswordReset() {
    document.getElementById('owner-email-alert-modal').classList.remove('active');
    this.openSupportPortal();
    
    document.getElementById('support-verify-email').value = this.state.email;
    document.getElementById('support-verify-phone').value = this.state.phone;
    this.supportSubmitCredentials();
  }

  // --- VISA CREDIT CARD AUTOFILL (Developer only) ---
  debugAutofillVisaCard() {
    const cardInput = document.getElementById('pay-card-number');
    const expiryInput = document.getElementById('pay-card-expiry');
    const cvcInput = document.getElementById('pay-card-cvc');

    if (cardInput && expiryInput && cvcInput) {
      cardInput.value = "4000 1234 5678 9010";
      expiryInput.value = "12/29";
      cvcInput.value = "123";
      this.formatCardNumber(cardInput);
      this.showToast("Реквизиты тестовой карты успешно заполнены ✔️", false);
    }
  }

};

