// store/38_store_backup.js - Backup JSON Export/Import

export const backupMethods = {
  // --- DYNAMIC BANKS GRID RENDERER ---
  detectBankingApps() {
    const mbankChecked = document.getElementById('sim-app-mbank')?.checked ?? true;
    const kaspiChecked = document.getElementById('sim-app-kaspi')?.checked ?? true;
    const halykChecked = document.getElementById('sim-app-halyk')?.checked ?? true;
    const tbankChecked = document.getElementById('sim-app-tbank')?.checked ?? true;

    const detectedGrid = document.getElementById('detected-banks-grid');
    const container = document.getElementById('detected-banks-container');
    const noBanksAlert = document.getElementById('no-banks-detected-alert');

    if (!detectedGrid) return;
    detectedGrid.innerHTML = '';

    const list = [];
    if (mbankChecked) list.push({ key: 'mbank', name: '💚 MBank', class: 'mbank' });
    if (kaspiChecked) list.push({ key: 'kaspi', name: '❤️ Kaspi', class: 'kaspi' });
    if (halykChecked) list.push({ key: 'halyk', name: '💙 Halyk', class: 'halyk' });
    if (tbankChecked) list.push({ key: 'tbank', name: '💛 T-Bank', class: 'tbank' });

    if (list.length > 0) {
      container.style.display = 'block';
      noBanksAlert.style.display = 'none';

      list.forEach(bank => {
        const btn = document.createElement('button');
        btn.className = `bank-btn ${bank.class}`;
        btn.id = `bank-${bank.key}`;
        btn.innerText = bank.name;
        btn.onclick = () => this.selectPaymentMethod('bank', bank.key);
        detectedGrid.appendChild(btn);
      });

      const stillAvailable = list.some(b => b.key === this.selectedBank);
      if (stillAvailable && this.selectedPaymentType === 'bank') {
        this.selectPaymentMethod('bank', this.selectedBank);
      } else {
        this.selectPaymentMethod('bank', list[0].key);
      }
    } else {
      container.style.display = 'none';
      noBanksAlert.style.display = 'block';
      this.selectPaymentMethod('card');
    }
  }

  selectPaymentMethod(type, bankName = null) {
    this.selectedPaymentType = type;
    const cardForm = document.getElementById('visa-card-form');
    const bankButtons = document.querySelectorAll('.bank-btn');

    if (type === 'card') {
      this.selectedBank = null;
      if (cardForm) {
        cardForm.style.outline = '2px solid var(--primary)';
        cardForm.style.background = 'rgba(139, 92, 246, 0.05)';
      }
      bankButtons.forEach(btn => btn.classList.remove('selected'));
    } else {
      this.selectedBank = bankName;
      if (cardForm) {
        cardForm.style.outline = 'none';
        cardForm.style.background = 'rgba(0, 0, 0, 0.25)';
      }
      bankButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.id === `bank-${bankName}`);
      });
      document.getElementById('pay-card-number').value = '';
      document.getElementById('pay-card-expiry').value = '';
      document.getElementById('pay-card-cvc').value = '';
    }
  }

};

