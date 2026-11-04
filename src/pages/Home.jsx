import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FactsBar from '../components/home/FactsBar';
import AnnouncementPoster from '../components/home/AnnouncementPoster';
import AboutSection from '../components/home/AboutSection';
import LatestNews from '../components/home/LatestNews';
import CalendarSection from '../components/home/CalendarSection';
import FeatureCards from '../components/home/FeatureCards';
import GallerySection from '../components/home/GallerySection';
import CTASection from '../components/home/CTASection';
import Seo from '../components/Seo';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  '@id': 'https://vizball.org/#organization',
  name: 'Vizball Association',
  alternateName: 'Vizball',
  url: 'https://vizball.org/',
  logo: 'https://vizball.org/icon-512.png',
  image: 'https://vizball.org/og-image.jpg',
  description: "Le Vizball est un sport collectif innovant créé au Cameroun en 2007, joué avec les mains et parfois les pieds.",
  sport: 'Vizball',
  foundingDate: '2007',
  founder: { '@type': 'Person', name: 'MIAFFO NKENGNI Yannick Joël' },
  foundingLocation: { '@type': 'Place', name: 'Cameroun' },
  areaServed: 'Cameroun',
  email: 'contact@vizball.org',
  sameAs: ['https://www.facebook.com/search/top/?q=vizball%20association'],
};

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://vizball.org/#website',
  name: 'Vizball',
  url: 'https://vizball.org/',
  inLanguage: ['fr', 'en'],
  publisher: { '@id': 'https://vizball.org/#organization' },
};

export default function Home() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <div>
      <Seo
        title={lang === 'en' ? 'Home' : 'Accueil'}
        description={tr.hero_subtitle}
        canonicalPath="/"
        jsonLd={[ORGANIZATION_JSON_LD, WEBSITE_JSON_LD]}
      />
      <HeroSection />
      <FactsBar />
      <AnnouncementPoster />
      <AboutSection />
      <LatestNews />
      <CalendarSection />
      <FeatureCards />
      <GallerySection />
      <CTASection />
    </div>
  );
}