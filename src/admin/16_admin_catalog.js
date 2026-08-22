// admin/16_admin_catalog.js - Admin Games Catalog Grid

export const adminCatalogMethods = {
      }
      this.state.subscription = 'pro_yearly';
      this.saveState();
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorClientsList();
      this.showToast("PRO подписка успешно выдана администратору! ⚡", false);
    } catch (e) {
      console.error("Error in quickGivePro:", e);
    }
  }

  creatorSearchAction(actionType, email) {
    try {
      const activeEmail = (this.state.email || '').toLowerCase();
      const isActive = activeEmail && email.toLowerCase() === activeEmail;

      if (isActive) {
        if (actionType === 'give_pro') {
          this.quickGivePro();
        } else if (actionType === 'reset_gps') {
          this.state.venueCoords = { lat: 0, lng: 0 };
          this.saveState();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("GPS координаты заведения сброшены! Требуется новая привязка.", false);
        } else if (actionType === 'reset_device') {
          this.state.deviceModel = 'iPhone 15 Pro';
          this.state.deviceHistory = ['15.06.2026: Первичная регистрация: iPhone 15 Pro'];
          this.saveState();
          this.showToast("Привязка устройства сброшена! Установлен iPhone по умолчанию.", false);
        } else if (actionType === 'reset_sub') {
          this.state.subscription = 'none';
          this.saveState();
          this.updateAdminView();
          this.renderAdminGamesGrid();
          this.showToast("Подписка аннулирована.", false);
        } else if (actionType === 'delete_account') {
          this.state.subscription = 'none';
          this.state.consentAccepted = false;
          this.state.email = '';
          this.state.phone = '';
          this.state.visitorGamesPlayed = 0;
          this.state.visitorLockoutUntil = 0;
          this.state.supportTickets = [];
          this.saveState();
          window.location.reload();
          return;
        }
        this.creatorSearchDatabase(); // Refresh display
      } else {
        this.showToast(`Действие "${actionType}" успешно применено в БД к аккаунту: ${email} ✔️`, false);
      }
    } catch (e) {
      console.error("Error executing search action:", e);
    }
  }

  logAIRequest(promptText, status) {
    try {
      this.state.aiLogs = this.state.aiLogs || [];
      const newLog = {
        id: Date.now(),
        email: this.state.email || 'guest@waitplay.com',
        phone: this.state.phone || '996555123456',
        prompt: promptText,
        timestamp: new Date().toLocaleTimeString(),
        status: status
      };
      this.state.aiLogs.push(newLog);
      this.saveState();
      this.renderCreatorAILogs();
    } catch (e) {
      console.error("Error logging AI request:", e);
    }
  }

  checkBannedStatus() {
    if (!this.state.bannedUsers) return false;
    const email = (this.state.email || '').toLowerCase();
    const phone = (this.state.phone || '').trim();
    if (!email && !phone) return false;
    
    return this.state.bannedUsers.some(user => {
      const banEmail = (user.email || '').toLowerCase();
      const banPhone = (user.phone || '').trim();
      return (email && banEmail === email) || (phone && banPhone === phone);
    });
  }

  creatorBlockUser(email, phone, reason = 'Нарушение правил ИИ-генератора (18+ контент)') {
    try {
      if (!email && !phone) {
        this.showToast("Не удалось заблокировать: отсутствуют данные пользователя.", true);
        return;
      }
      
      this.state.bannedUsers = this.state.bannedUsers || [];
      
      const isAlreadyBanned = this.state.bannedUsers.some(u => 
        (email && u.email.toLowerCase() === email.toLowerCase()) || 
        (phone && u.phone.trim() === phone.trim())
      );
      
      if (isAlreadyBanned) {
        this.showToast("Этот пользователь уже заблокирован!", true);
        return;
      }
      
      const banRecord = {
        email: email || '',
        phone: phone || '',
        reason: reason,
        timestamp: new Date().toLocaleDateString()
      };
      
      this.state.bannedUsers.push(banRecord);
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorTicketsList();
      this.renderCreatorAILogs();
      this.renderCreatorClientsList();
      
      this.showToast(`Пользователь ${email || phone} успешно заблокирован! 🚫`, false);
    } catch (e) {
      console.error("Error blocking user:", e);
    }
  }

  renderCreatorAILogs() {
    try {
      const container = document.getElementById('creator-ailogs-list-only');
      const badgeAILogs = document.getElementById('creator-badge-ailogs');
      if (!container) return;
      container.innerHTML = '';
      
      const logs = this.state.aiLogs || [];
      
      if (badgeAILogs) {
        badgeAILogs.innerText = logs.length;
        badgeAILogs.style.display = logs.length > 0 ? 'inline-block' : 'none';
      }

      if (logs.length === 0) {
        container.innerHTML = `<div style="font-size:9px; color:var(--text-muted); font-style:italic; padding: 10px 0;">Запросы к ИИ отсутствуют.</div>`;
        return;
      }

      // Show latest logs first
      const reversedLogs = [...logs].reverse();
      
      reversedLogs.forEach(log => {
        const item = document.createElement('div');
        const isBannedWord = log.status.includes('Отклонено');
        
        item.style.background = isBannedWord ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)';
        item.style.border = isBannedWord ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-light)';
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
              <span style="font-weight:700; color:${isBannedWord ? 'var(--error)' : '#34d399'}; font-size:9px;">
                ${isBannedWord ? '🛑 ОТКЛОНЕНО' : '✅ ВЫПОЛНЕНО'}
              </span>
              <span style="font-size:8px; color:var(--text-muted);">${log.timestamp}</span>
            </div>
            <div style="color:#fff; margin-top:2px; font-weight:500;">"${log.prompt}"</div>
            <div style="font-size:8px; color:var(--text-muted); margin-top:2px;">Почта: ${log.email} (${log.phone})</div>
          </div>
          <button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); padding:2px 6px; font-size:9px;" onclick="app.creatorBlockUser('${log.email}', '${log.phone}', 'Нарушение правил ИИ')">
            🚫 Блокировать
          </button>
        `;
        container.appendChild(item);
      });
    } catch (e) {
      console.error("Error rendering creator AI logs:", e);
    }
  }

  renderCreatorClientsList() {
    try {
      const container = document.getElementById('creator-clients-list-table');
      const badgeClients = document.getElementById('creator-badge-clients');
      const totalEl = document.getElementById('creator-total-clients-count');
      if (!container) return;
      container.innerHTML = '';

      const clientsList = this.getAllClientsList();

      if (totalEl) totalEl.innerText = clientsList.length;
      if (badgeClients) {
        badgeClients.innerText = clientsList.length;
        badgeClients.style.display = 'inline-block';
      }

      clientsList.forEach(client => {
        const item = document.createElement('div');
        const isPro = client.subscription && client.subscription.includes('pro');
        const hasSub = client.subscription && client.subscription !== 'none';
        const isBanned = this.state.bannedUsers && this.state.bannedUsers.some(u => u.email && client.email && u.email.toLowerCase() === client.email.toLowerCase());
        
        item.style.background = isBanned ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)';
        item.style.border = isBanned ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-light)';
        item.style.borderRadius = '8px';
        item.style.padding = '6px 10px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.fontSize = '10px';
        item.style.marginBottom = '4px';

        const subBadgeText = isBanned ? 'БАН' : (isPro ? 'PRO' : (hasSub ? 'BASE' : 'НЕТ'));
        const subBadgeClass = isBanned ? 'badge-danger' : (isPro ? 'badge-pro' : (hasSub ? 'badge-base' : 'badge-secondary'));

        item.innerHTML = `
          <div style="text-align: left; flex:1;">
            <div style="font-weight:700; color:#fff;">${client.email || 'Нет почты'}</div>
            <div style="font-size:8px; color:var(--text-muted);">Тел: ${client.phone || 'Нет телефона'}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge ${subBadgeClass}" style="font-size:8px; padding:2px 5px;">${subBadgeText}</span>
            <button class="debug-btn-mini" style="border-color:var(--gold); color:var(--gold); font-size:9px; padding:2px 6px;" onclick="app.creatorSelectAndManageClient('${client.index}')">
              🔍 Управлять
            </button>
          </div>
        `;
        container.appendChild(item);
      });
    } catch (e) {
      console.error("Error rendering creator clients list:", e);
    }
  }

  creatorUnbanUser(email, phone) {
    try {
      this.state.databaseClients = this.state.databaseClients || [];
      const client = this.state.databaseClients.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
      if (client) {
        client.status = 'Активен';
        this.saveDatabaseClients();
      }

      this.state.bannedUsers = this.state.bannedUsers || [];
      this.state.bannedUsers = this.state.bannedUsers.filter(u => u.email && u.email.toLowerCase() !== email.toLowerCase());
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorClientsList();
      this.showToast(`Аккаунт ${email} разблокирован. 🔓`, false);
    } catch (e) {
      console.error("Error unbanning user:", e);
    }
  }

  toggleClientDatabaseDetails(email, index) {
    try {
      const drawer = document.getElementById(`client-db-detail-${index}`);
      if (!drawer) return;

      const isOpen = drawer.style.display === 'block';

      // First close all drawers
      const allDrawers = document.querySelectorAll('[id^="client-db-detail-"]');
      allDrawers.forEach(d => {
        d.style.display = 'none';
        d.innerHTML = '';
      });

      if (isOpen) {
        return;
      }

      const client = this.getClientProfileByEmail(email);
      if (!client) return;

      const isBanned = this.state.bannedUsers.some(u => u.email && u.email.toLowerCase() === client.email.toLowerCase());
      const badgeClass = isBanned ? 'badge-danger' : 'badge-pro';
      const badgeText = isBanned ? 'ЗАБЛОКИРОВАН' : 'АКТИВЕН';

      let feedbacksHTML = '';
      if (client.feedbacks.length === 0) {
        feedbacksHTML = '<span style="font-style:italic;">Отзывы отсутствуют.</span>';
      } else {
        feedbacksHTML = client.feedbacks.map(f => {
          const isTicket = f.type !== 'FEEDBACK';
          return `<div style="margin-bottom:4px; padding:3px; background:rgba(255,255,255,0.02); border-radius:4px;">
            <span style="color:${isTicket ? 'var(--error)' : 'var(--gold)'}; font-weight:700;">[${isTicket ? 'ЗАЯВКА' : 'ОТЗЫВ'}]</span>
            <span style="color:#fff;">"${f.content || f.status}"</span>
          </div>`;
        }).join('');
      }

      let aiLogsHTML = '';
      if (client.aiLogs.length === 0) {
        aiLogsHTML = '<span style="font-style:italic;">Запросы к ИИ отсутствуют.</span>';
      } else {
        aiLogsHTML = client.aiLogs.map(l => {
          const isBlocked = l.status.includes('Отклонено');
          return `<div style="margin-bottom:4px; padding:3px; background:rgba(255,255,255,0.02); border-radius:4px;">
            <span style="color:${isBlocked ? 'var(--error)' : '#34d399'}; font-weight:700;">[${isBlocked ? 'ФИЛЬТР' : 'УСПЕХ'}]</span>
            <span style="color:#fff;">"${l.prompt}"</span>
          </div>`;
        }).join('');
      }

      // Build branches section (Instagram multi-account details)
      let branchesHTML = '';
      const branches = client.branches || [];
      if (branches.length === 0) {
        branchesHTML = '<div style="font-style:italic; color:var(--text-muted); font-size:9px;">Нет зарегистрированных филиалов.</div>';
      } else {
        branches.forEach(br => {
          const isBrPro = br.subscription.includes('pro');
          const isBrBanned = br.status === 'Заблокирован';
          const brBadgeText = isBrBanned ? 'БАН 🚫' : (isBrPro ? 'PRO ⚡' : (br.subscription !== 'none' ? 'BASE' : 'НЕТ'));
          const brBadgeClass = isBrBanned ? 'badge-danger' : (isBrPro ? 'badge-pro' : (br.subscription !== 'none' ? 'badge-base' : 'badge-secondary'));

          const brAdminDist = this.getDistance(this.state.adminCoords.lat, this.state.adminCoords.lng, br.lat || 0, br.lng || 0);
          const brVisitorDist = this.getDistance(this.state.visitorCoords.lat, this.state.visitorCoords.lng, br.lat || 0, br.lng || 0);
          const brDeviceHistoryHTML = (br.deviceHistory || []).map(h => `• ${h}`).join('<br>');

          const brBanBtnHTML = isBrBanned
            ? `<button class="debug-btn-mini" style="border-color:#34d399; color:#34d399; font-size:8px; padding:1px 3px;" onclick="event.stopPropagation(); app.creatorBranchAction('unban', '${client.email}', '${br.id}')">🔓 Разблокировать филиал</button>`
            : `<button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-size:8px; padding:1px 3px;" onclick="event.stopPropagation(); app.creatorBranchAction('ban', '${client.email}', '${br.id}')">🚫 Заблокировать филиал</button>`;

          branchesHTML += `
            <div style="border: 1px solid rgba(255,255,255,0.06); border-radius:6px; margin-bottom:5px; background:rgba(255,255,255,0.01); overflow:hidden;">
              <!-- Branch Expandable Header -->
              <div style="padding:5px 8px; background:rgba(255,255,255,0.03); display:flex; justify-content:space-between; align-items:center; font-weight:700; cursor:pointer;" onclick="const el = document.getElementById('br-drawer-${br.id}'); el.style.display = el.style.display === 'block' ? 'none' : 'block'; event.stopPropagation();">
                <span style="color:#fff; font-size:9.5px;">🏢 ${br.name}</span>
                <div style="display:flex; align-items:center; gap:5px;">
                  <span class="badge ${brBadgeClass}" style="font-size:7.5px; padding:1px 4px;">${brBadgeText}</span>
                  <span style="font-size:8px; color:var(--text-muted);">▼</span>
                </div>
              </div>
              <!-- Branch expand drawer -->
              <div id="br-drawer-${br.id}" style="display:none; padding:8px; font-size:9px; border-top:1px solid rgba(255,255,255,0.06); background:rgba(0,0,0,0.15); line-height:1.35;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div>
                    <strong style="color:var(--primary); font-size:7.5px; text-transform:uppercase;">📱 Устройство</strong><br>
                    Модель: <strong style="color:#fff;">${br.deviceModel || 'iPhone'}</strong>
                    <div style="font-size:7.5px; color:var(--text-muted); max-height:30px; overflow-y:auto; line-height:1.2; margin-top:2.5px;">
                      ${brDeviceHistoryHTML}
                    </div>
                  </div>
                  <div>
                    <strong style="color:var(--primary); font-size:7.5px; text-transform:uppercase;">📍 GPS Координаты</strong><br>
                    Координаты: <strong style="color:#fff;">${br.lat ? br.lat.toFixed(4) : '0.0000'}, ${br.lng ? br.lng.toFixed(4) : '0.0000'}</strong><br>
                    Админ до ресторана: <strong style="color:#fff;">${brAdminDist}м</strong><br>
                    Гость до ресторана: <strong style="color:#fff;">${brVisitorDist}м</strong>
                  </div>
                </div>
                <div style="margin-top:6px; display:flex; gap:3px; flex-wrap:wrap; border-top:1px dashed rgba(255,255,255,0.06); padding-top:4px;">
                  <button class="debug-btn-mini" style="border-color:var(--gold); color:var(--gold); font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('give_pro', '${client.email}', '${br.id}'); event.stopPropagation();">⚡ Дать PRO</button>
                  <button class="debug-btn-mini" style="border-color:#34d399; color:#34d399; font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('reset_gps', '${client.email}', '${br.id}'); event.stopPropagation();">📍 Сбросить GPS</button>
                  <button class="debug-btn-mini" style="border-color:#a78bfa; color:#a78bfa; font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('reset_device', '${client.email}', '${br.id}'); event.stopPropagation();">📱 Сбросить устройство</button>
                  <button class="debug-btn-mini" style="border-color:#fbbf24; color:#fbbf24; font-size:8px; padding:1px 3px;" onclick="app.creatorBranchAction('reset_sub', '${client.email}', '${br.id}'); event.stopPropagation();">❌ Аннулировать подписку</button>
                  ${brBanBtnHTML}
                </div>
              </div>
            </div>
          `;
        });
      }

      const banButtonHTML = isBanned 
        ? `<button class="debug-btn-mini" style="border-color:#34d399; color:#34d399; font-size:8px; padding:2px 5px;" onclick="event.stopPropagation(); app.creatorUnbanUser('${client.email}', '${client.phone}')">🔓 Разблокировать аккаунт</button>`
        : `<button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-size:8px; padding:2px 5px;" onclick="event.stopPropagation(); app.creatorBlockUser('${client.email}', '${client.phone}', 'Блокировка через базу данных')">🚫 Заблокировать аккаунт</button>`;

      drawer.innerHTML = `
        <div style="text-align: left; font-size:10px;" onclick="event.stopPropagation()">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-light); padding-bottom:6px; margin-bottom:8px;">
            <strong style="color:var(--gold);">Досье клиента #${client.index}</strong>
            <span class="badge ${badgeClass}" style="font-size:8px; padding:2px 5px;">${badgeText}</span>
          </div>

          <!-- General Account Stats -->
          <div style="margin-bottom:8px; background:rgba(255,255,255,0.02); padding:5px 8px; border-radius:6px; border:1px solid var(--border-light); font-size:9.5px;">
            Email: <strong style="color:#fff;">${client.email}</strong> | Телефон: <strong style="color:#fff;">${client.phone}</strong>
          </div>

          <!-- Section: Branches -->
          <div style="margin-bottom: 8px;">
            <strong style="color:var(--primary); font-size:8px; text-transform:uppercase; display:block; margin-bottom:4px;">🏢 Зарегистрированные филиалы (${branches.length} из 4)</strong>
            ${branchesHTML}
          </div>

          <!-- Support & logs -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px solid var(--border-light); padding-top: 6px; margin-bottom: 8px;">
            <div>
              <strong style="color:var(--primary); font-size:8px;">ОТЗЫВЫ И ЗАЯВКИ</strong>
              <div style="max-height: 50px; overflow-y: auto; font-size: 8px; color: var(--text-muted); margin-top:2px;">
                ${feedbacksHTML}
              </div>
            </div>
            <div>
              <strong style="color:var(--primary); font-size:8px;">ИСТОРИЯ ЗАПРОСОВ К ИИ</strong>
              <div style="max-height: 50px; overflow-y: auto; font-size: 8px; color: var(--text-muted); margin-top:2px;">
                ${aiLogsHTML}
              </div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-light); padding-top: 6px; display:flex; gap:4px; flex-wrap:wrap;">
            ${banButtonHTML}
            <button class="debug-btn-mini" style="border-color:var(--error); color:var(--error); font-size:8px; padding:2px 5px;" onclick="app.creatorSearchAction('delete_account', '${client.email}');">🗑️ Удалить аккаунт</button>
          </div>
        </div>
      `;

      drawer.style.display = 'block';
    } catch (e) {
      console.error("Error in toggleClientDatabaseDetails:", e);
    }
  }

  creatorSearchSuggestions() {
    try {
      const input = document.getElementById('creator-search-input');
      const suggestionsBox = document.getElementById('creator-search-suggestions');
      if (!input || !suggestionsBox) return;

      const q = input.value.trim().toLowerCase();

      if (!q) {
        suggestionsBox.style.display = 'none';
        suggestionsBox.innerHTML = '';
        return;
      }

      const clients = this.getAllClientsList();
      
      const matches = clients.filter(c => {
        const matchesEmail = (c.email && c.email.toLowerCase().includes(q));
        const matchesPhone = c.phone.includes(q);
        const matchesIndex = c.index.toString() === q;
        return matchesEmail || matchesPhone || matchesIndex;
      });

      if (matches.length === 0) {
        suggestionsBox.style.display = 'block';
        suggestionsBox.innerHTML = `<div style="font-size:9px; color:var(--text-muted); padding:6px 10px; text-align:center;">Совпадений не найдено</div>`;
        return;
      }

      suggestionsBox.innerHTML = '';
      matches.slice(0, 5).forEach(c => {
        const item = document.createElement('div');
        item.style.padding = '6px 10px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.fontSize = '10px';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
        
        item.onmouseenter = () => { item.style.background = 'rgba(255, 255, 255, 0.05)'; };
        item.onmouseleave = () => { item.style.background = 'transparent'; };

        const isBanned = this.state.bannedUsers.some(u => u.email && (u.email && u.email.toLowerCase()) === (c.email && c.email.toLowerCase()));
        const isPro = c.subscription.includes('pro');
        const badgeColor = isBanned ? 'var(--error)' : (isPro ? 'var(--gold)' : 'var(--primary)');
        const badgeLabel = isBanned ? 'БАН' : (isPro ? 'PRO' : 'BASE');

        item.innerHTML = `
          <div style="text-align:left;">
            <strong style="color:#fff;">#${this.abbreviateNumber(c.index)}. ${c.email}</strong>
            <div style="font-size:8px; color:var(--text-muted);">Тел: ${c.phone} | Устройство: ${c.deviceModel}</div>
          </div>
          <span style="font-size:8px; font-weight:700; color:${badgeColor}; background:rgba(255,255,255,0.03); padding:1px 4px; border-radius:4px;">
            ${badgeLabel}
          </span>
        `;

        item.onclick = () => {
          input.value = c.email;
          suggestionsBox.style.display = 'none';
          this.creatorSearchDatabase();
        };

        suggestionsBox.appendChild(item);
      });

      suggestionsBox.style.display = 'block';
    } catch (e) {
      console.error("Error generating search suggestions:", e);
    }
  }

  creatorSelectAndManageClient(clientIndex) {
    try {
      this.setCreatorTab('search');
      
      const searchInput = document.getElementById('creator-search-input');
      if (searchInput) searchInput.value = clientIndex;
      
      this.creatorSearchDatabase();
      this.showToast(`Загружен профиль клиента по индексу #${clientIndex}`, false);
    } catch (e) {
      console.error("Error selecting client for management:", e);
    }
  }

  creatorBlockAndResetAccount(ticketId) {
    const ticket = this.state.supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      this.state.supportTickets = this.state.supportTickets.filter(t => t.id !== ticketId);
      
      this.state.subscription = 'none';
      this.state.consentAccepted = false;
      this.state.email = '';
      this.state.phone = '';
      this.state.visitorGamesPlayed = 0;
      this.state.visitorLockoutUntil = 0;
      
      this.saveState();
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorTicketsList();
      this.renderCreatorClientsList();
      
      this.showToast("Аккаунт успешно УДАЛЕН из базы данных создателем! Подписка аннулирована.", false);
    }
  }

};

