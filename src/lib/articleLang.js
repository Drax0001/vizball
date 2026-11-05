// Articles carry a French version (title/excerpt/content) and an English one
// (title_en/excerpt_en/content_en). A version exists when its title is set.
// Visitors only see the version in their selected language; an article
// without that version is hidden from them.

export function hasVersion(article, lang) {
  const title = lang === 'en' ? article?.title_en : article?.title;
  return Boolean(title && title.trim());
}

// The article with title/excerpt/content set to the visitor's language,
// or null when that version does not exist.
export function localizeArticle(article, lang) {
  if (!hasVersion(article, lang)) return null;
  if (lang !== 'en') return article;
  return { ...article, title: article.title_en, excerpt: article.excerpt_en || '', content: article.content_en || '' };
}

export function localizeArticles(articles, lang) {
  return (articles || []).map((a) => localizeArticle(a, lang)).filter(Boolean);
}

// Categories are stored in French; visitors see them in their language.
export const ARTICLE_CATEGORIES = ['Événement', 'Tournoi', 'Portrait', 'Actualité', 'Communiqué'];
const CATEGORY_LABELS = {
  'Tous': { fr: 'Tous', en: 'All' },
  'Événement': { fr: 'Événement', en: 'Event' },
  'Tournoi': { fr: 'Tournoi', en: 'Tournament' },
  'Portrait': { fr: 'Portrait', en: 'Portrait' },
  'Actualité': { fr: 'Actualité', en: 'News' },
  'Communiqué': { fr: 'Communiqué', en: 'Press release' },
};

export function categoryLabel(category, lang) {
  return CATEGORY_LABELS[category]?.[lang] || category;
}
