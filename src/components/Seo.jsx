import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLang } from '../lib/LanguageContext';

const SITE_ORIGIN = 'https://vizball.org';
const SITE_NAME = 'Vizball';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;
// Preview copies (new.vizball.org, classic.vizball.org) are built with
// VITE_NOINDEX=true so search engines only index vizball.org. Their
// canonical URLs still point at vizball.org.
const PREVIEW_BUILD = import.meta.env.VITE_NOINDEX === 'true';

// Centralizes per-page <title>/meta description/canonical/OG/Twitter tags,
// plus an optional JSON-LD structured data block, so each page just passes
// its own values instead of repeating this boilerplate.
// Page titles arrive in display caps ("LE SPORT"); search results read better in sentence case.
const sentenceCase = (text) =>
  text && text === text.toUpperCase() ? text.charAt(0) + text.slice(1).toLowerCase() : text;

export default function Seo({ title, description, canonicalPath = '/', image, imageAlt, noindex = false, jsonLd, type = 'website' }) {
  const { lang } = useLang();
  const fullTitle = title ? `${sentenceCase(title.trim())} | ${SITE_NAME}` : `${SITE_NAME} - Sport Innovant Né au Cameroun`;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
  const ogImage = image || DEFAULT_IMAGE;
  const blockIndexing = noindex || PREVIEW_BUILD;
  const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {blockIndexing && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'fr_FR'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>
      ))}
    </Helmet>
  );
}
