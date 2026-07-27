// Governance documents are stored with French category/status values.
// This is the single source of truth for translating them for display.
export const CATEGORY_LABELS = {
  'Gouvernance': { fr: 'Gouvernance', en: 'Governance' },
  'Propriété Intellectuelle': { fr: 'Propriété Intellectuelle', en: 'Intellectual Property' },
  'Héritage & Pérennité': { fr: 'Héritage & Pérennité', en: 'Heritage & Sustainability' },
  'Règles du Jeu': { fr: 'Règles du Jeu', en: 'Rules of the Game' },
  'Ingénierie Sportive': { fr: 'Ingénierie Sportive', en: 'Sports Engineering' },
  'Compétition': { fr: 'Compétition', en: 'Competition' },
  'Protection & Sécurité': { fr: 'Protection & Sécurité', en: 'Protection & Safety' },
  'Intégrité': { fr: 'Intégrité', en: 'Integrity' },
  'Responsabilité Sociale': { fr: 'Responsabilité Sociale', en: 'Social Responsibility' },
  'Stratégie': { fr: 'Stratégie', en: 'Strategy' },
  'Impact & RSE': { fr: 'Impact & RSE', en: 'Impact & CSR' },
  'Partenariat': { fr: 'Partenariat', en: 'Partnership' },
};

export const STATUS_LABELS = {
  disponible: { fr: 'Disponible', en: 'Available' },
  'bientôt': { fr: 'Bientôt', en: 'Coming soon' },
  restreint: { fr: 'Restreint', en: 'Restricted' },
};

export function translateDocCategory(category, lang) {
  return CATEGORY_LABELS[category]?.[lang] ?? category;
}

export function translateDocStatus(status, lang) {
  return STATUS_LABELS[status]?.[lang] ?? status;
}
