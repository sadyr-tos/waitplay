// security/03_security_2fa.js - 2FA & Countdown Timers

export const timer2FAMethods = {
  // --- 2FA COUNTDOWN TIMERS UTILITY ---
  startTimer(type, displayId, onExpire) {
    clearInterval(this.timers[type].interval);
    this.timers[type].value = 180; // 3 minutes
    
    const display = document.getElementById(displayId);
    const tick = () => {
      const mins = Math.floor(this.timers[type].value / 60);
      const secs = this.timers[type].value % 60;
      if (display) {
        display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
      if (this.timers[type].value <= 0) {
        clearInterval(this.timers[type].interval);
        if (onExpire) onExpire();
      }
      this.timers[type].value--;
    };
    tick();
    this.timers[type].interval = setInterval(tick, 1000);
  }

  stopTimer(type) {
    clearInterval(this.timers[type].interval);
  }

};

