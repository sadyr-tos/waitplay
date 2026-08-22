// ui/39_ui_modal.js - UI Modal Manager

export const modalMethods = {
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
};

