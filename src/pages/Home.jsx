import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeatureCards from '../components/home/FeatureCards';
import GallerySection from '../components/home/GallerySection';
import CTASection from '../components/home/CTASection';
import TestimonialsSection from '../components/home/TestimonialsSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <FeatureCards />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}