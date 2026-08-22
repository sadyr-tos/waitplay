// games/base/21_game_quiz.js - Quiz Game

export const quizMethods = {
  renderQuizQuestionsEditor() {
    const container = document.getElementById('quiz-questions-cards-list');
    if (!container) return;
    container.innerHTML = '';

    // Update questions count in the B2B configuration toolbar
    const countBadge = document.getElementById('quiz-questions-count');
    if (countBadge) countBadge.innerText = this.state.templates.length;

    this.state.templates.forEach((q, qIdx) => {
      const card = document.createElement('div');
      card.className = 'question-edit-card';
      
      const isExpanded = this.expandedQuestions.has(q.id);
      
      let answersHTML = '';
      if (isExpanded) {
        q.options.forEach((opt, optIdx) => {
          answersHTML += `
            <div class="q-answer-row" style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
              <input type="radio" class="correct-radio-btn" name="q-${q.id}-correct" ${q.correct === optIdx ? 'checked' : ''} onchange="app.updateQuizCorrectAnswer(${qIdx}, ${optIdx})">
              <button id="opt-emoji-btn-${qIdx}-${optIdx}" class="emoji-picker-btn" style="padding:6px; font-size:12px; background:rgba(255,255,255,0.05); border:1px solid var(--border-light); border-radius:6px; cursor:pointer; width:30px; height:30px; display:flex; align-items:center; justify-content:center;" onclick="app.showEmojiPicker(${qIdx}, ${optIdx}, this)">${q.emojis[optIdx] || '❓'}</button>
              <input type="text" style="padding: 6px; font-size:11px; flex:1; margin-bottom:0;" value="${opt}" oninput="app.updateQuizAnswerText(${qIdx}, ${optIdx}, this.value)">
              <button class="btn-delete-option" onclick="app.deleteQuizOption(${qIdx}, ${optIdx})" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:12px; padding:4px;" ${q.options.length <= 2 ? 'disabled style="opacity:0.3;"' : ''}>✕</button>
            </div>
          `;
        });
      }

      card.innerHTML = `
        <div class="q-edit-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid var(--border-light); padding-bottom:6px;">
          <span style="font-weight:800; color:var(--primary);">Вопрос #${qIdx + 1}</span>
          <div style="display:flex; gap:10px; align-items:center;">
            <button class="btn-toggle-options" onclick="app.toggleQuestionExpand(${q.id})" style="background:none; border:none; color:var(--gold); font-size:11px; cursor:pointer; padding:4px 8px; border-radius:6px; border:1px solid var(--border-light);">
              ${isExpanded ? '📂 Скрыть' : `📁 Варианты (${q.options.length})`}
            </button>
            <button onclick="app.deleteQuizQuestion(${qIdx})" style="background:none; border:none; color:var(--error); cursor:pointer; font-size:14px; padding:0;" title="Удалить вопрос">🗑️</button>
          </div>
        </div>
        <textarea rows="2" style="padding: 8px; font-size:13px; margin-bottom:8px; width:100%; box-sizing:border-box;" oninput="app.updateQuizQuestionText(${qIdx}, this.value)">${q.text}</textarea>
        
        ${isExpanded ? `
          <div class="q-answers-list" style="margin-top:8px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px; border:1px solid var(--border-light);">
            <div style="font-size:9px; color:var(--text-muted); margin-bottom:6px;">Варианты ответов (отметьте верный радиокнопкой):</div>
            ${answersHTML}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
              <button class="btn" style="padding:4px 8px; width:auto; font-size:10px; border-radius:6px; background:rgba(255,255,255,0.05);" onclick="app.addQuizOption(${qIdx})" ${q.options.length >= 10 ? 'disabled style="opacity:0.3;"' : ''}>➕ Добавить вариант</button>
              <span style="font-size:9px; color:var(--text-muted);">Минимум 2, максимум 10</span>
            </div>
          </div>
        ` : ''}
      `;
      container.appendChild(card);
    });
  }

  toggleQuestionExpand(qId) {
    if (this.expandedQuestions.has(qId)) {
      this.expandedQuestions.delete(qId);
    } else {
      this.expandedQuestions.add(qId);
    }
    this.renderQuizQuestionsEditor();
  }

  adjustQuizQuestionsCount(diff) {
    try {
      const currentCount = this.state.templates.length;
      const targetCount = currentCount + diff;
      if (targetCount < 2 || targetCount > 20) return;
      
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          this.state.templates.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            text: "Новый вопрос викторины?",
            options: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
            emojis: ["❓", "❓", "❓", "❓"],
            correct: 0,
            minPlayers: 10,
            maxPlayers: 15
          });
        }
      } else {
        this.state.templates.splice(targetCount);
      }
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in adjustQuizQuestionsCount:", e);
    }
  }

  deleteQuizQuestion(qIdx) {
    try {
      if (this.state.templates.length <= 2) {
        this.showToast("Минимум 2 вопроса в викторине!", true);
        return;
      }
      this.state.templates.splice(qIdx, 1);
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in deleteQuizQuestion:", e);
    }
  }

  deleteQuizOption(qIdx, optIdx) {
    try {
      const q = this.state.templates[qIdx];
      if (q.options.length <= 2) return;
      
      q.options.splice(optIdx, 1);
      q.emojis.splice(optIdx, 1);
      
      // Adjust correct answer index
      if (q.correct === optIdx) {
        q.correct = 0;
      } else if (q.correct > optIdx) {
        q.correct--;
      }
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in deleteQuizOption:", e);
    }
  }

  addQuizOption(qIdx) {
    try {
      const q = this.state.templates[qIdx];
      if (q.options.length >= 10) return;
      
      const newIndex = q.options.length + 1;
      q.options.push(`Вариант ${newIndex}`);
      q.emojis.push("❓");
      
      this.saveState();
      this.syncActiveBranchToDatabase();
      this.renderQuizQuestionsEditor();
    } catch (e) {
      console.error("Error in addQuizOption:", e);
    }
  }

  updateQuizQuestionText(qIdx, text) {
    this.state.templates[qIdx].text = text;
    this.saveState();
    this.syncActiveBranchToDatabase();
  }

  guessEmoji(text) {
    if (!text) return "❓";
    const lower = text.toLowerCase();
    
    // Алкоголь и напитки
    if (lower.includes("водка") || lower.includes("ром") || lower.includes("виски") || lower.includes("джин") || lower.includes("коньяк") || lower.includes("текила") || lower.includes("алко")) return "🥃";
    if (lower.includes("вино") || lower.includes("шампан") || lower.includes("бокал") || lower.includes("бутыл")) return "🍷";
    if (lower.includes("коктейл") || lower.includes("мартини") || lower.includes("мохито") || lower.includes("аперол")) return "🍸";
    if (lower.includes("пиво") || lower.includes("сидр") || lower.includes("эль") || lower.includes("круж")) return "🍺";
    if (lower.includes("кофе") || lower.includes("капуч") || lower.includes("латте") || lower.includes("эспрес") || lower.includes("америк")) return "☕";
    if (lower.includes("чай") || lower.includes("матча")) return "🍵";
    if (lower.includes("сок") || lower.includes("кола") || lower.includes("лимонад") || lower.includes("вода") || lower.includes("пепси") || lower.includes("фанта") || lower.includes("напит")) return "🥤";
    
    // Еда и десерты
    if (lower.includes("торт") || lower.includes("пирог") || lower.includes("десерт") || lower.includes("сладост") || lower.includes("пирож")) return "🍰";
    if (lower.includes("морожен") || lower.includes("пломбир") || lower.includes("сорбет")) return "🍦";
    if (lower.includes("пицца")) return "🍕";
    if (lower.includes("бургер") || lower.includes("чизбургер") || lower.includes("гамбургер")) return "🍔";
    if (lower.includes("суши") || lower.includes("ролл")) return "🍣";
    if (lower.includes("стейк") || lower.includes("мясо") || lower.includes("говяд") || lower.includes("свин")) return "🥩";
    if (lower.includes("куриц") || lower.includes("крылыш") || lower.includes("наггет")) return "🍗";
    if (lower.includes("салат") || lower.includes("зелень")) return "🥗";
    if (lower.includes("сыр")) return "🧀";
    if (lower.includes("рыба") || lower.includes("морепрод")) return "🐟";
    if (lower.includes("шоколад") || lower.includes("конфет")) return "🍫";
    if (lower.includes("пончик")) return "🍩";
    
    // Развлечения и игры
    if (lower.includes("игра") || lower.includes("гейм")) return "🎮";
    if (lower.includes("футбол") || lower.includes("мяч")) return "⚽";
    if (lower.includes("кубок") || lower.includes("побед") || lower.includes("приз")) return "🏆";
    if (lower.includes("карта") || lower.includes("покер")) return "🃏";
    if (lower.includes("кино") || lower.includes("фильм")) return "🎬";
    if (lower.includes("музык") || lower.includes("песн") || lower.includes("караок")) return "🎵";
    
    return "❓";
  }

  updateQuizAnswerText(qIdx, optIdx, text) {
    const q = this.state.templates[qIdx];
    const prevText = q.options[optIdx];
    const prevGuessed = this.guessEmoji(prevText);
    const currentEmoji = q.emojis[optIdx];
    
    q.options[optIdx] = text;
    
    if (currentEmoji === "❓" || currentEmoji === prevGuessed) {
      const newGuessed = this.guessEmoji(text);
      q.emojis[optIdx] = newGuessed;
      
      const emojiBtn = document.getElementById(`opt-emoji-btn-${qIdx}-${optIdx}`);
      if (emojiBtn) emojiBtn.innerText = newGuessed;
    }
    
    this.saveState();
    this.syncActiveBranchToDatabase();
  }

  updateQuizCorrectAnswer(qIdx, optIdx) {
    this.state.templates[qIdx].correct = optIdx;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.showToast(`Для вопроса #${qIdx + 1} выбран вариант #${optIdx + 1} как верный.`, false);
  }

  editQuiz() {
    this.renderQuizQuestionsEditor();
    this.setAdminPanelActiveView('edit-quiz');
    this.updateQuizTestArenaUI();
  }

  editTicTacToe() {
    this.setAdminPanelActiveView('edit-ttt');
    const tttDifficultyEl = document.getElementById('settings-ttt-difficulty');
    if (tttDifficultyEl) tttDifficultyEl.value = this.state.tttDifficulty;
    const tttTurnLimitEl = document.getElementById('settings-ttt-turn-limit');
    if (tttTurnLimitEl) tttTurnLimitEl.value = this.state.tttTurnLimit || 'none';
    this.updateTTTSizeUI();
    this.updateTTTMaxDrawsUI();
    this.updateTTTTestArenaUI();
  }

  updateTTTTestArenaUI() {
    const isTest = !!this.state.manualTestingMode;
    const lockedEl = document.getElementById('admin-ttt-test-arena-locked');
    const unlockedEl = document.getElementById('admin-ttt-test-arena-unlocked');
    
    if (lockedEl) lockedEl.style.display = isTest ? 'none' : 'block';
    if (unlockedEl) unlockedEl.style.display = isTest ? 'block' : 'none';
    
    const boardCont = document.getElementById('admin-ttt-test-board-container');
    if (boardCont) boardCont.style.display = 'none';
    const statusEl = document.getElementById('admin-ttt-test-status');
    if (statusEl) {
      statusEl.innerText = "Нажмите кнопку ниже, чтобы начать тестовый матч.";
      statusEl.style.color = '#fff';
    }
    const startBtn = document.getElementById('btn-admin-ttt-test-start');
    if (startBtn) startBtn.innerText = "🎮 Начать тест-матч";
  }

  enableTestingModeFromSettings() {
    try {
      this.state.manualTestingMode = true;
      this.saveState();
      
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.syncActiveBranchToDatabase();
      
      this.updateTTTTestArenaUI();
      this.updateQuizTestArenaUI();
      this.updateDifferencesTestArenaUI();
      this.updateCrosswordTestArenaUI();
      this.handleTestingModeChange(true);
      
      this.showToast("🛠️ Тест-режим ВКЛ. Публикация игр заблокирована 🚫", false);
    } catch (e) {
      console.error("Error in enableTestingModeFromSettings:", e);
    }
  }

  saveQuizConfig(key, value) {
    this.state[key] = value;
    this.saveState();
    this.syncActiveBranchToDatabase();
    this.showToast("Настройки Викторины успешно сохранены!", false);
  }

  startAdminQuizTest() {
    const branchTemplates = this.state.templates;
    
    if (!branchTemplates || branchTemplates.length === 0) {
      this.showToast("Ошибка: Нет вопросов для тестирования!", true);
      return;
    }
    
    // Clear any active timer intervals before starting
    this.clearAdminQuizTimers();
    
    this.adminQuizQuestions = branchTemplates;
    this.adminQuizQIndex = 0;
    this.adminQuizPlayerScore = 0;
    this.adminQuizGameOver = false;
    this.adminQuizAnswered = false;
    
    document.getElementById('admin-quiz-test-game-container').style.display = 'flex';
    document.getElementById('btn-admin-quiz-test-start').innerText = "🔄 Сбросить матч";
    
    this.runAdminQuizStartCountdown();
  }

  clearAdminQuizTimers() {
    if (this.adminQuizCountdownInterval) {
      clearInterval(this.adminQuizCountdownInterval);
      this.adminQuizCountdownInterval = null;
    }
    if (this.adminQuizTurnInterval) {
      clearInterval(this.adminQuizTurnInterval);
      this.adminQuizTurnInterval = null;
    }
  }

  runAdminQuizStartCountdown() {
    let secondsLeft = 3;
    const statusEl = document.getElementById('admin-quiz-test-status');
    const optionsEl = document.getElementById('admin-quiz-test-options');
    if (optionsEl) optionsEl.innerHTML = '';
    
    if (statusEl) {
      statusEl.innerText = `Подготовка... ${secondsLeft}`;
      statusEl.style.color = 'var(--gold)';
    }
    
    this.playAudioTone('click');
    
    this.adminQuizCountdownInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(this.adminQuizCountdownInterval);
        this.adminQuizCountdownInterval = null;
        if (statusEl) {
          statusEl.innerText = "Викторина началась! 🚀";
          statusEl.style.color = 'var(--success)';
        }
        this.playAudioTone('success');
        setTimeout(() => this.renderAdminQuizQuestion(), 800);
      } else {
        if (statusEl) {
          statusEl.innerText = `Подготовка... ${secondsLeft}`;
        }
        this.playAudioTone('click');
      }
    }, 1000);
  }

  renderAdminQuizQuestion() {
    if (this.adminQuizGameOver) return;
    this.clearAdminQuizTimers();
    
    const qIndex = this.adminQuizQIndex;
    const questions = this.adminQuizQuestions;
    if (qIndex >= questions.length) {
      this.finishAdminQuizTest();
      return;
    }
    
    this.adminQuizAnswered = false;
    const tpl = questions[qIndex];
    
    const indexEl = document.getElementById('admin-quiz-test-q-index');
    const textEl = document.getElementById('admin-quiz-test-q-text');
    const optionsEl = document.getElementById('admin-quiz-test-options');
    const statusEl = document.getElementById('admin-quiz-test-status');
    
    if (indexEl) indexEl.innerText = `Вопрос ${qIndex + 1} из ${questions.length}`;
    if (textEl) textEl.innerText = tpl.q || tpl.text || "Текст вопроса";
    
    // Render option buttons
    if (optionsEl) {
      optionsEl.innerHTML = '';
      const options = tpl.options || ["Да", "Нет"];
      const correctIdx = tpl.correct !== undefined ? tpl.correct : 0;
      
      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.style.cssText = 'width:100%; padding:10px; font-size:11px; text-align:left; background:#110e1f; border:1px solid var(--border-light); border-radius:10px; color:#fff; cursor:pointer; outline:none; transition:all 0.15s; font-weight:600; display:flex; align-items:center; justify-content:space-between; box-sizing:border-box; font-family: Outfit, Inter, sans-serif;';
        btn.innerText = opt;
        btn.onclick = () => this.handleAdminQuizAnswer(idx, correctIdx, false);
        optionsEl.appendChild(btn);
      });
    }
    
    // Start 8-second turn timer
    this.adminQuizSecondsLeft = 8;
    if (statusEl) {
      statusEl.innerText = `⏱️ Время пошло: ${this.adminQuizSecondsLeft} сек.`;
      statusEl.style.color = 'var(--gold)';
    }
    
    this.adminQuizTurnInterval = setInterval(() => {
      this.adminQuizSecondsLeft--;
      if (this.adminQuizSecondsLeft <= 0) {
        clearInterval(this.adminQuizTurnInterval);
        this.adminQuizTurnInterval = null;
        
        // Timeout: auto-select correct answer
        const correctIdx = tpl.correct !== undefined ? tpl.correct : 0;
        this.handleAdminQuizAnswer(-1, correctIdx, true);
      } else {
        if (statusEl) {
          statusEl.innerText = `⏱️ Время пошло: ${this.adminQuizSecondsLeft} сек.`;
        }
      }
    }, 1000);
  }

  handleAdminQuizAnswer(optionIdx, correctIdx, autoSelected) {
    if (this.adminQuizAnswered || this.adminQuizGameOver) return;
    this.adminQuizAnswered = true;
    this.clearAdminQuizTimers();
    
    const optionsEl = document.getElementById('admin-quiz-test-options');
    const statusEl = document.getElementById('admin-quiz-test-status');
    
    if (autoSelected) {
      this.playAudioTone('incorrect');
      if (statusEl) {
        statusEl.innerText = "⏰ Время вышло! Бот показал ответ.";
        statusEl.style.color = 'var(--error)';
      }
    } else {
      const isCorrect = (optionIdx === correctIdx);
      if (isCorrect) {
        this.adminQuizPlayerScore++;
        this.playAudioTone('correct');
        if (statusEl) {
          statusEl.innerText = "Правильно! 🎉";
          statusEl.style.color = 'var(--success)';
        }
};

