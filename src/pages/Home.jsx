import React from 'react';
import HeroSection from '../components/home/HeroSection';
import SloganBand from '../components/home/SloganBand';
import Manifesto from '../components/home/Manifesto';
import PlayLoop from '../components/home/PlayLoop';
import MatchSheet from '../components/home/MatchSheet';
import GallerySection from '../components/home/GallerySection';
import Explore from '../components/home/Explore';
import CTASection from '../components/home/CTASection';
import Seo from '../components/Seo';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Vizball Association',
  url: 'https://vizball.org',
  sport: 'Vizball',
  foundingDate: '2007',
  foundingLocation: 'Cameroun',
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
        jsonLd={ORGANIZATION_JSON_LD}
      />
      <HeroSection />
      <SloganBand />
      <Manifesto />
      <PlayLoop />
      <MatchSheet />
      <GallerySection />
      <Explore />
      <CTASection />
    </div>
  );
}
