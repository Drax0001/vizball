// Tutorial category/level values are stored in French in the database (see
// server/seedData.ts) — these maps translate them for display only. Shared
// between Tutoriels.jsx, the tutorial card/player components, and LeSport.jsx's
// embedded tutorials section, to avoid circular imports between pages/components.

export const CATEGORY_LABELS = {
  'Tous': { fr: 'Tous', en: 'All' },
  'Gestes Techniques': { fr: 'Gestes Techniques', en: 'Technical Skills' },
  'Placements Tactiques': { fr: 'Placements Tactiques', en: 'Tactical Positioning' },
  'Entraînements': { fr: 'Entraînements', en: 'Training' },
  'Règles & Arbitrage': { fr: 'Règles & Arbitrage', en: 'Rules & Refereeing' },
};

export const LEVEL_LABELS = {
  'Tous les niveaux': { fr: 'Tous les niveaux', en: 'All levels' },
  'Débutant': { fr: 'Débutant', en: 'Beginner' },
  'Intermédiaire': { fr: 'Intermédiaire', en: 'Intermediate' },
  'Avancé': { fr: 'Avancé', en: 'Advanced' },
};
