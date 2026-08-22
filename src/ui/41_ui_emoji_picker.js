// ui/41_ui_emoji_picker.js - UI Emoji Picker Popups

export const emojiPickerMethods = {
  // --- EMOJI PICKER POPUPS ---
  showEmojiPicker(qIdx, optIdx, buttonEl) {
    this.closeEmojiPicker();

    const popover = document.createElement('div');
    popover.className = 'emoji-picker-popover';
    popover.onclick = (e) => e.stopPropagation();

    // Поле поиска
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск...';
    searchInput.className = 'emoji-picker-search';
    
    // Сетка эмодзи
    const grid = document.createElement('div');
    grid.className = 'emoji-picker-grid';

    popover.appendChild(searchInput);
    popover.appendChild(grid);

    const emojiDb = [
      // Игры и развлечения
      { char: "🎲", tags: ["игры", "кубик", "кости", "dice"] },
      { char: "🎯", tags: ["игры", "мишень", "дартс", "target"] },
      { char: "🧩", tags: ["игры", "пазл", "puzzle"] },
      { char: "🎳", tags: ["игры", "боулинг", "кегли"] },
      { char: "🎮", tags: ["игры", "джойстик", "геймпад", "приставка", "gamepad"] },
      { char: "🏎️", tags: ["игры", "гонка", "машина", "авто"] },
      { char: "⚽", tags: ["спорт", "футбол", "мяч", "soccer"] },
      { char: "🏀", tags: ["спорт", "баскетбол", "мяч"] },
      { char: "🏐", tags: ["спорт", "волейбол", "мяч"] },
      { char: "🎾", tags: ["спорт", "теннис", "мяч"] },
      { char: "🏆", tags: ["победа", "кубок", "приз", "награда", "cup"] },
      { char: "🎈", tags: ["праздник", "шарик", "шар"] },
      { char: "🎉", tags: ["праздник", "хлопушка", "салют", "party"] },
      { char: "🔥", tags: ["огонь", "пламя", "пожар", "fire"] },
      { char: "✨", tags: ["звезды", "блеск", "блестки", "магия"] },
      { char: "💥", tags: ["взрыв", "бум", "удар"] },
      { char: "🔫", tags: ["пистолет", "оружие", "выстрел", "стрелять", "gun", "weapon"] },
      { char: "🌙", tags: ["луна", "месяц", "ночь", "космос", "moon", "night"] },
      { char: "🌕", tags: ["луна", "полнолуние", "космос", "moon"] },
      { char: "💊", tags: ["болею", "таблетка", "лекарство", "болезнь", "аптека", "pill", "medicine"] },
      { char: "💉", tags: ["болею", "укол", "лекарство", "вакцина", "аптека", "больница", "шприц", "syringe"] },
      { char: "🏥", tags: ["болею", "больница", "врач", "доктор", "аптека", "hospital"] },
      { char: "👨‍⚕️", tags: ["болею", "врач", "доктор", "медик", "doctor"] },
      { char: "👩‍⚕️", tags: ["болею", "врач", "доктор", "медик", "doctor"] },
      { char: "🦶", tags: ["нога", "стопа", "ступня", "foot", "leg"] },
      { char: "🦵", tags: ["нога", "колено", "мышцы", "leg"] },
      // Напитки
      { char: "🥤", tags: ["сок", "кола", "лимонад", "вода", "пепси", "фанта", "напиток", "soda"] },
      { char: "☕", tags: ["кофе", "капучино", "латте", "чай", "кружка", "coffee"] },
      { char: "🍵", tags: ["чай", "зеленый", "кружка", "tea"] },
      { char: "🍺", tags: ["пиво", "кружка", "бар", "алкоголь", "beer"] },
      { char: "🍻", tags: ["пиво", "кружки", "тост", "бар", "алкоголь", "beers"] },
      { char: "🍷", tags: ["вино", "бокал", "бутылка", "алкоголь", "wine"] },
      { char: "🍸", tags: ["коктейль", "мартини", "напиток", "cocktail"] },
      { char: "🍹", tags: ["коктейль", "тропический", "сок", "напиток"] },
      { char: "🥃", tags: ["водка", "виски", "ром", "джин", "коньяк", "текила", "алкоголь", "стакан", "vodka"] },
      { char: "🍾", tags: ["шампанское", "бутылка", "праздник", "wine", "champagne"] },
      { char: "🥛", tags: ["молоко", "стакан", "напиток"] },
      { char: "🧉", tags: ["мате", "напиток"] },
      // Еда
      { char: "🍔", tags: ["бургер", "чизбургер", "гамбургер", "еда", "burger"] },
      { char: "🍕", tags: ["пицца", "сыр", "еда", "pizza"] },
      { char: "🥩", tags: ["стейк", "мясо", "еда", "meat"] },
      { char: "🍖", tags: ["мясо", "ребрышко", "еда", "meat"] },
      { char: "🍗", tags: ["курица", "ножка", "еда", "chicken"] },
      { char: "🍟", tags: ["картошка", "фри", "еда", "fries"] },
      { char: "🥗", tags: ["салат", "зелень", "веган", "овощи", "salad"] },
      { char: "🍣", tags: ["суши", "роллы", "рыба", "еда", "sushi"] },
      { char: "🍰", tags: ["торт", "пирожное", "десерт", "сладкое", "cake"] },
      { char: "🎂", tags: ["торт", "день рождения", "свечи", "праздник", "cake"] },
      { char: "🧁", tags: ["кекс", "капкейк", "сладкое", "десерт"] },
      { char: "🍦", tags: ["мороженое", "сладкое", "десерт", "icecream"] },
      { char: "🍨", tags: ["мороженое", "сладкое", "десерт"] },
      { char: "🍩", tags: ["пончик", "сладкое", "десерт"] },
      { char: "🍫", tags: ["шоколад", "сладкое", "десерт"] }
    ];

    const renderGrid = (query = '') => {
      grid.innerHTML = '';
      const trimmed = query.trim().toLowerCase();
      
      const filtered = emojiDb.filter(item => {
        if (!trimmed) return true;
        return item.char.includes(trimmed) || item.tags.some(tag => tag.includes(trimmed));
      });

      if (filtered.length === 0) {
        const noResult = document.createElement('div');
        noResult.style.gridColumn = 'span 5';
        noResult.style.fontSize = '9px';
        noResult.style.color = 'var(--text-muted)';
        noResult.style.padding = '10px 0';
        noResult.innerText = 'Нет совпадений';
        grid.appendChild(noResult);
        return;
      }

      filtered.forEach(item => {
        const opt = document.createElement('div');
        opt.className = 'emoji-option';
        opt.innerText = item.char;
        opt.onclick = () => {
          this.state.templates[qIdx].emojis[optIdx] = item.char;
          this.saveState();
          this.syncActiveBranchToDatabase();
          buttonEl.innerText = item.char;
          this.closeEmojiPicker();
        };
        grid.appendChild(opt);
      });
    };

    searchInput.oninput = (e) => renderGrid(e.target.value);
    
    // Фокус на поле поиска при открытии
    setTimeout(() => searchInput.focus(), 50);

    renderGrid();

    buttonEl.parentNode.appendChild(popover);
    this.activeEmojiPicker = popover;
  }

  closeEmojiPicker() {
    if (this.activeEmojiPicker) {
      this.activeEmojiPicker.remove();
      this.activeEmojiPicker = null;
    }
  }

};

