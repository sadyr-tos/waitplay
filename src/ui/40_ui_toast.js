// ui/40_ui_toast.js - UI Toast Notifications

export const toastMethods = {
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
};

