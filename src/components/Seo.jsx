import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_ORIGIN = 'https://vizball.org';
const SITE_NAME = 'Vizball';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/src/assets/images/LOGO-VIZBALL-ASSOCIATION-blanc.png`;

// Centralizes per-page <title>/meta description/canonical/OG/Twitter tags,
// plus an optional JSON-LD structured data block, so each page just passes
// its own values instead of repeating this boilerplate.
export default function Seo({ title, description, canonicalPath = '/', image, noindex = false, jsonLd }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Sport Innovant Né au Cameroun`;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
