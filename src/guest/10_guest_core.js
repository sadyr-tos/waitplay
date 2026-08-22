// guest/10_guest_core.js - Guest View Core

export const guestCoreMethods = {
  // --- CREATOR DATABASE TICKETS LOG RENDERER ---
  renderCreatorTicketsList() {
    try {
      const ticketsContainer = document.getElementById('creator-tickets-list-only');
      const feedbacksContainer = document.getElementById('creator-feedbacks-list-only');
      
      const badgeTickets = document.getElementById('creator-badge-tickets');
      const badgeFeedbacks = document.getElementById('creator-badge-feedbacks');

      if (!ticketsContainer || !feedbacksContainer) return;
      
      ticketsContainer.innerHTML = '';
      feedbacksContainer.innerHTML = '';

      const tickets = this.state.supportTickets.filter(t => t.type !== 'FEEDBACK');
      const feedbacks = this.state.supportTickets.filter(t => t.type === 'FEEDBACK');

      // Update badges
      if (badgeTickets) {
        badgeTickets.innerText = tickets.length;
        badgeTickets.style.display = tickets.length > 0 ? 'inline-block' : 'none';
      }
      if (badgeFeedbacks) {
        badgeFeedbacks.innerText = feedbacks.length;
        badgeFeedbacks.style.display = feedbacks.length > 0 ? 'inline-block' : 'none';
      }

      // Render recovery tickets
      if (tickets.length === 0) {
        ticketsContainer.innerHTML = `<div style="font-size:9px; color:var(--text-muted); font-style:italic; padding: 10px 0;">Заявки на сброс отсутствуют.</div>`;
      } else {
        tickets.forEach(ticket => {
          const item = document.createElement('div');
          item.style.background = 'rgba(239, 68, 68, 0.05)';
          item.style.border = '1px solid rgba(239, 68, 68, 0.2)';
          item.style.borderRadius = '8px';
          item.style.padding = '6px 10px';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.fontSize = '10px';
          item.style.marginBottom = '4px';

          item.innerHTML = `
            <div style="text-align: left;">
              <div>Email: <strong style="color:#fff;">${ticket.email}</strong></div>
              <div style="font-size:8px; color:var(--success); font-weight:700;">${ticket.status}</div>
            </div>
            <button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-weight:700; padding:2px 6px;" onclick="app.creatorBlockAndResetAccount(${ticket.id})">
              🗑️ Удалить аккаунт
            </button>
          `;
          ticketsContainer.appendChild(item);
        });
      }

      // Render feedback suggestions
      if (feedbacks.length === 0) {
        feedbacksContainer.innerHTML = `<div style="font-size:9px; color:var(--text-muted); font-style:italic; padding: 10px 0;">Отзывы и предложения отсутствуют.</div>`;
      } else {
        feedbacks.forEach(ticket => {
          const item = document.createElement('div');
          item.style.background = 'rgba(139, 92, 246, 0.05)';
          item.style.border = '1px solid rgba(139, 92, 246, 0.2)';
          item.style.borderRadius = '8px';
          item.style.padding = '6px 10px';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.fontSize = '10px';
          item.style.marginBottom = '4px';

          item.innerHTML = `
            <div style="flex:1; margin-right:10px; text-align: left;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:var(--gold); font-size:9px;">💡 ИДЕЯ / ОТЗЫВ</span>
                <span style="font-size:8px; color:var(--text-muted);">${ticket.timestamp}</span>
              </div>
              <div style="color:#fff; margin-top:2px; font-style:italic; font-size:10px;">"${ticket.content}"</div>
              <div style="font-size:8px; color:var(--text-muted); margin-top:2px;">От: ${ticket.email}</div>
            </div>
            <button class="debug-btn-mini" style="border-color:var(--text-muted); color:var(--text-muted); padding:2px 6px; font-size:9px;" onclick="app.creatorArchiveFeedback(${ticket.id})">
              ✕ Убрать
            </button>
          `;
          feedbacksContainer.appendChild(item);
        });
      }
    } catch (e) {
      console.error("Error in renderCreatorTicketsList:", e);
    }
  }

  getAllClientsList() {
    const list = [];
    let idx = 1;

    (this.state.databaseClients || []).forEach(client => {
      const firstBranch = client.branches[0] || {};
      list.push({
        index: idx++,
        email: client.email,
        phone: client.phone,
        subscription: firstBranch.subscription || 'none',
        deviceModel: firstBranch.deviceModel || 'Нет устройства',
        status: client.status,
        branches: client.branches
      });
    });

    return list;
  }

  getClientProfileByEmail(email) {
    if (!email) return null;
    const emailLower = email.trim().toLowerCase();
    const client = (this.state.databaseClients || []).find(c => c.email && c.email.toLowerCase() === emailLower);
    if (!client) return null;

    const feedbacks = (this.state.supportTickets || []).filter(t => t && t.email && t.email.toLowerCase() === emailLower);
    const aiLogs = (this.state.aiLogs || []).filter(l => l && l.email && l.email.toLowerCase() === emailLower);

    return {
      index: (this.state.databaseClients || []).indexOf(client) + 1,
      email: client.email,
      phone: client.phone,
      status: client.status,
      branches: client.branches,
      feedbacks: feedbacks,
      aiLogs: aiLogs
    };
  }

  getClientProfile(query) {
    const q = query.trim().toLowerCase();
    const isNum = !isNaN(q) && q !== '';
    const searchIdx = isNum ? parseInt(q) : -1;

    const clientsList = this.getAllClientsList();
    
    if (isNum) {
      const found = clientsList.find(c => c.index === searchIdx);
      if (found) {
        return this.getClientProfileByEmail(found.email);
      }
      return null;
    }

    const found = clientsList.find(c => c.email && (c.email && c.email.toLowerCase().includes(q)) || c.phone.includes(q)
    );
    if (found) {
      return this.getClientProfileByEmail(found.email);
    }
    return null;
  }

  creatorArchiveFeedback(ticketId) {
    try {
      this.state.supportTickets = this.state.supportTickets.filter(t => t.id !== ticketId);
      this.saveState();
      this.renderCreatorTicketsList();
      this.showToast("Отзыв/предложение архивировано Создателем.", false);
    } catch (e) {
      alert("Ошибка в creatorArchiveFeedback:\n" + e.message);
    }
  }

  setCreatorTab(tabId) {
    try {
      const tabs = ['tickets', 'feedbacks', 'ailogs', 'clients', 'search', 'settings'];
      tabs.forEach(t => {
        const btn = document.getElementById(`btn-creator-tab-${t}`);
        if (btn) {
          const isActive = t === tabId;
          btn.style.color = isActive ? 'var(--gold)' : 'var(--text-muted)';
          btn.style.borderBottom = isActive ? '2px solid var(--gold)' : 'none';
        }
        
        const view = document.getElementById(`creator-view-${t}`);
        if (view) {
          view.style.display = t === tabId ? 'block' : 'none';
        }
      });
    } catch (e) {
      console.error("Error setting creator tab:", e);
    }
  }

  setCreatorScale(scale) {
    try {
      const panel = document.getElementById('creator-console-block');
      if (!panel) return;
      if (scale === '100%') {
        panel.style.fontSize = '11px';
      } else if (scale === '115%') {
        panel.style.fontSize = '12.5px';
      } else if (scale === '130%') {
        panel.style.fontSize = '14px';
      } else if (scale === '150%') {
        panel.style.fontSize = '16px';
      }
      this.state.creatorScale = scale;
      this.saveState();
    } catch (e) {
      console.error("Error setting creator scale:", e);
    }
  }

  toggleCreatorFullscreen() {
    try {
      const workspace = document.querySelector('.workspace');
      const panel = document.getElementById('creator-console-block');
      const btn = document.getElementById('btn-creator-fullscreen');
      if (!panel || !btn) return;

      const isFullscreen = panel.classList.toggle('creator-fullscreen-mode');

      if (isFullscreen) {
        if (workspace) workspace.style.display = 'none';
        panel.style.height = '100vh';
        panel.style.maxHeight = '100vh';
        panel.style.margin = '0';
        panel.style.borderRadius = '0';
        btn.innerText = '📱 Показать симуляторы';
      } else {
        if (workspace) workspace.style.display = 'flex';
        panel.style.height = 'auto';
        panel.style.maxHeight = 'none';
        panel.style.margin = '20px auto 0 auto';
        panel.style.borderRadius = '20px';
        btn.innerText = '🖥️ Развернуть во весь экран';
      }
      this.state.creatorFullscreen = isFullscreen;
      this.saveState();
    } catch (e) {
      console.error("Error toggling creator fullscreen:", e);
    }
  }

};

