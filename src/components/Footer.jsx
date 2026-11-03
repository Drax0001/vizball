import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Mail, MapPin, Globe } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import VisitorCounter from './VisitorCounter';
import FieldLines from './field/FieldLines';
import { useLenis } from './motion/SmoothScroll';
import { SOCIAL_LINKS } from './site/social';
import seal from '../assets/images/Sceau-Vizball-2-web.png';
import Tricolour from './site/Tricolour';

export default function Footer() {
  const { lang } = useLang();
  const tr = t[lang];
  const lenis = useLenis();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      title: tr.footer_nav,
      links: [
        { label: tr.nav_home, to: '/' },
        { label: tr.nav_news, to: '/actualites' },
        { label: tr.nav_forum, to: '/forum' },
        { label: tr.nav_shop, to: '/boutique' },
        { label: tr.nav_governance, to: '/gouvernance' },
        { label: tr.nav_contact, to: '/contact' },
      ],
    },
    {
      title: tr.footer_sport,
      links: [
        { label: tr.footer_rules, to: '/le-sport' },
        { label: tr.footer_positions, to: '/le-sport' },
        { label: tr.footer_field, to: '/le-sport' },
        { label: tr.nav_tutorials, to: '/tutoriels' },
        { label: tr.footer_hcv, to: '/gouvernance' },
      ],
    },
  ];

  return (
    <footer className="pitch relative isolate overflow-hidden">
      <Tricolour className="h-1.5" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center opacity-[0.07]">
        <FieldLines className="w-[min(1600px,140vw)] text-chalk" strokeWidth={0.05} />
      </div>

      <div className="shell pt-24 lg:pt-32">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10">
          <div className="max-w-sm">
            <img src={seal} alt="Sceau Vizball" className="h-24 w-auto" loading="lazy" width="101" height="96" />
            <p className="mt-6 text-chalk/70 leading-relaxed">{tr.footer_desc}</p>
            <p className="voice mt-6 text-lg text-accent">Justice · Volonté · Succès</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="label text-chalk/50">{col.title}</h2>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="link-draw font-heading text-lg font-bold text-chalk/90 transition-colors hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="label text-chalk/50">{tr.footer_contact}</h2>
            <ul className="mt-6 space-y-4 text-chalk/80">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-accent" />
                {tr.country_name}
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-accent" />
                <a href="mailto:contact@vizball.org" className="link-draw hover:text-chalk">contact@vizball.org</a>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={16} className="shrink-0 text-accent" />
                <a href="https://vizball.org" target="_blank" rel="noopener noreferrer" className="link-draw hover:text-chalk">vizball.org</a>
              </li>
            </ul>
            <p className="label mt-10 text-chalk/50">{tr.footer_follow_us}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full text-chalk/80 ring-1 ring-inset ring-chalk/20 transition-colors hover:bg-accent hover:text-night hover:ring-accent"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-chalk/10 py-8 text-sm text-chalk/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Vizball Association. {tr.footer_rights}</p>
          <VisitorCounter />
          <p>{tr.footer_created}</p>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex items-center gap-2 self-start font-heading font-bold uppercase tracking-[0.1em] text-chalk transition-colors hover:text-accent md:self-auto"
          >
            {tr.footer_back_top}
            <span className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-inset ring-chalk/25 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
              <ArrowUp size={15} />
            </span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <p className="display translate-y-[6%] whitespace-nowrap text-center text-[21.5vw] leading-[0.78] text-chalk/[0.07]">
          VIZ<span className="text-accent/25">BALL</span>
        </p>
      </div>
    </footer>
  );
}
