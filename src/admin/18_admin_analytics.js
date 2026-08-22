// admin/18_admin_analytics.js - Admin Analytics

export const adminAnalyticsMethods = {
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
};

