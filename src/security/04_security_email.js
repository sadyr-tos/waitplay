// security/04_security_email.js - Email Dispatch (FormSubmit)

export const emailMethods = {
  // --- REAL EMAIL DISPATCH FUNCTION (FormSubmit.co API Integration) ---
  sendRealEmail(recipientEmail, code, subjectMessage) {
    console.log(`Sending real email to ${recipientEmail} with code ${code}...`);
    
    // Show code immediately in the toast so they are never locked out during testing
    this.showToast(`📡 Отправка на ${recipientEmail}... [Ваш код: ${code}]`, false);

    // Call FormSubmit.co AJAX API
    fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `WaitPlay Security: ${subjectMessage}`,
        "Название платформы": "WaitPlay Interactive",
        "Код подтверждения (4 цифры)": code,
        "Внимание": "Если это ваше первое письмо от FormSubmit, найдите первое входящее письмо и подтвердите адрес (Confirm Email), кликнув по ссылке. Все следующие письма будут приходить сразу."
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Real email sent successfully:", data);
      this.showToast(`Письмо ушло! Код: ${code} (Проверьте Спам/Входящие)`, false);
    })
    .catch(err => {
      console.error("Failed to send real email:", err);
      // Fallback show code on screen if network/CORS fails
      this.showToast(`Ошибка сети (CORS). Код для теста: ${code}`, true);
    });
  }

};

