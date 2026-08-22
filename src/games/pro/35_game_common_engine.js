// games/pro/35_game_common_engine.js - Common Game Engine

export const commonEngineMethods = {
      this.recalculateDistances();
      this.updateAdminView();
      this.updateVisitorView();
      
      const roleText = role === 'admin' ? 'Администратора' : 'Посетителя';
      const typeText = type === 'venue' ? 'в ресторане' : 'дома';
      this.showToast(`Координаты ${roleText} изменены на "${typeText}"`, false);
    } catch (e) {
      console.error("Error setting coordinates:", e);
    }
  }

  updateAdminLocationStatus(distance) {
    const statusText = document.getElementById('admin-loc-status');
    const sandboxAlert = document.getElementById('sandbox-alert');
    if (!statusText) return;
    if (distance <= 180) {
      statusText.innerText = "В заведении (Боевой)";
      statusText.style.color = "var(--success)";
      if (sandboxAlert) sandboxAlert.style.display = "none";
    } else {
      statusText.innerText = "Дома (Песочница)";
      statusText.style.color = "var(--gold)";
      if (sandboxAlert) sandboxAlert.style.display = (this.state.subscription !== 'none') ? "block" : "none";
    }
  }

  resetAICooldown() {
    this.state.lastAIGenTime = 0;
    this.saveState();
    this.updateAIGeneratorBox();
    this.showToast("Кулдаун ИИ генерации сброшен разработчиком.", false);
  }

};

