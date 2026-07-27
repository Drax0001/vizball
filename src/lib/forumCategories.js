// Forum topics/replies are always stored with French category values.
// This is the single source of truth for translating them for display.
export const FORUM_CATEGORIES = ['Tactiques', 'Règles', 'Rencontres', 'Général', 'Équipement'];

export const CATEGORY_LABELS = {
  'Tactiques': { fr: 'Tactiques', en: 'Tactics' },
  'Règles': { fr: 'Règles', en: 'Rules' },
  'Rencontres': { fr: 'Rencontres', en: 'Meetings' },
  'Général': { fr: 'Général', en: 'General' },
  'Équipement': { fr: 'Équipement', en: 'Equipment' },
};

export function translateCategory(category, lang) {
  return CATEGORY_LABELS[category]?.[lang] ?? category;
}
