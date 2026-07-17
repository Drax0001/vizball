export const PRODUCTS = [];

export const CATEGORIES = ['Tous', 'Équipements de Jeu', 'Tenues & Équipements', 'Infrastructure', 'Packs Club'];

export const CATEGORY_LABELS = {
  'Tous': { fr: 'Tous', en: 'All' },
  'Équipements de Jeu': { fr: 'Équipements de Jeu', en: 'Game Equipment' },
  'Tenues & Équipements': { fr: 'Tenues & Équipements', en: 'Apparel & Gear' },
  'Infrastructure': { fr: 'Infrastructure', en: 'Infrastructure' },
  'Packs Club': { fr: 'Packs Club', en: 'Club Packs' },
};

export function formatPrice(price, lang = 'fr') {
  return price.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR') + ' FCFA';
}