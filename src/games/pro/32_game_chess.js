// games/pro/32_game_chess.js - Chess Game (PRO)

export const chessMethods = {
    } else if (gameId === 6) {
      icon = "🧠";
      title = "Мемори";
      
      const theme = branch && branch.memoryTheme ? branch.memoryTheme : (this.state.memoryTheme || 'restaurant');
      const diff = branch && branch.memoryDifficulty ? branch.memoryDifficulty : (this.state.memoryDifficulty || 'normal');
      const themeText = theme === 'restaurant' ? 'Ресторан 🍕' : (theme === 'animals' ? 'Животные 🐼' : 'Смешанная 🔮');
      const diffText = diff === 'easy' ? 'Легко (сетка 3x4, 12 карт)' : (diff === 'hard' ? 'Сложно (сетка 4x5, 20 карт)' : 'Средне (сетка 4x4, 16 карт)');
      const timeLimitText = branch && branch.memoryTimeLimit ? branch.memoryTimeLimit : (this.state.memoryTimeLimit || 60);

      content = `🧠 <b>Мемори:</b> увлекательная битва ума на тренировку памяти!<br><br>• Уровень сложности: <b>${diffText}</b>.<br>• Тематика: <b>${themeText}</b>.<br>• Лимит времени: <b>${timeLimitText} секунд</b>.<br>• Переворачивайте карточки по две штуки и находите одинаковые пары.<br>• Если карточки совпали — они остаются открытыми, и вы получаете 1 пару в свой актив.<br>• Вы соревнуетесь с другими гостями в реальном времени.<br>• Победителем признается тот, кто найдет больше всего пар!`;
    } else if (gameId === 10) {
      icon = "🗣️";
      title = "Поле Чудес";
      content = `🗣️ <b>Поле Чудес:</b> классическая игра-угадайка слов по буквам против ботов-посетителей!<br><br>• Вы и соперники ходите по очереди.<br>• В свой ход вы должны ввести одну букву. На это дается ровно <b>10 секунд</b>.<br>• При правильном ответе вы ходите снова, а таймер сбрасывается.<br>• При промахе или тайм-ауте ход переходит следующему.<br>• ⚠️ Клавиши названных букв <b>не блокируются</b>. Будьте внимательны и не повторяйте названные буквы, иначе ход сгорит!<br>• Вы можете назвать слово целиком в свой ход, нажав соответствующую кнопку. Но будьте аккуратны — при ошибке ход сгорит.`;
    } else if (gameId === 11) {
      icon = "🏁";
      title = "Шашки";
      const turnLimitText = branch && branch.checkersTurnLimit !== undefined ? branch.checkersTurnLimit : (this.state.checkersTurnLimit || 'none');
      const limitDesc = turnLimitText === 'none' ? 'Без лимита' : `${turnLimitText} секунд`;

      content = `🏁 <b>Русские Шашки:</b> классическая настольная битва умов 1 на 1!<br><br>• Вы играете белыми фигурами и ходите первыми.<br>• Лимит времени на ход: <b>${limitDesc}</b>.<br>• Обычные шашки ходят по диагонали вперед, а бьют <b>вперед и назад</b>, перепрыгивая через шашку соперника.<br>• ⚠️ <b>Взятие обязательно!</b> Если вы можете срубить шашку противника, обычные ходы блокируются.<br>• При достижении края доски шашка превращается в Дамку.<br>• 👑 <b>Летающая дамка</b> ходит и бьет на любое расстояние по свободным диагоналям.<br>• Игра заканчивается, когда у одного из игроков закончатся шашки или ходы.`;
    } else if (gameId === 12) {
      icon = "♟️";
      title = "Шахматы";
      content = `♟️ <b>Шахматы:</b> классическая дуэль королей 1 на 1!<br><br>• Уровень сложности: <b>PRO</b>.<br>• Игра временно находится в режиме разработки.<br>• Совсем скоро здесь появится полноценная шахматная партия с умным ботом и PvP!`;
    } else {
      icon = "🎮";
      title = "Игровой шаблон";
      content = `🔧 <b>Скоро открытие:</b> эта игра временно находится в режиме разработки.<br><br>• Совсем скоро здесь появится новое увлекательное соревнование для гостей заведения!`;
    }
    
    // Add technical works banner if testing mode is active
    const isTesting = this.state.manualTestingMode || (branch && branch.manualTestingMode);
    if (isTesting) {
      content = `<div style="background:rgba(239, 68, 68, 0.15); border:1.5px solid #ef4444; border-radius:10px; padding:10px; margin-bottom:12px; font-size:10px; color:#f87171; font-weight:700; text-align:center; display:flex; align-items:center; justify-content:center; gap:6px;">
        🛠️ Идут технические работы. Игра временно недоступна!
      </div>` + content;
    }
    
    const modal = document.getElementById('visitor-rules-modal');
    const iconEl = document.getElementById('visitor-rules-icon');
    const titleEl = document.getElementById('visitor-rules-title');
    const contentEl = document.getElementById('visitor-rules-content');
    
    if (modal && iconEl && titleEl && contentEl) {
      iconEl.innerText = icon;
      titleEl.innerText = title;
      contentEl.innerHTML = content;
      modal.classList.add('active');
    }
  }

  closeVisitorRulesModal() {
    const modal = document.getElementById('visitor-rules-modal');
    if (modal) modal.classList.remove('active');
  }

  resetVisitorSession() {
    this.state.visitorGamesPlayed = 0;
    this.state.visitorLockoutUntil = 0;
};

