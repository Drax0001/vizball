import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Globe,
  ArrowUp,
} from "lucide-react";
import { useLang } from "../lib/LanguageContext";
import t from "../lib/translations";
import VisitorCounter from "./VisitorCounter";
import { SOCIALS } from "../lib/socials";
import vizballLogo from "../assets/images/LOGO-VIZBALL-ASSOCIATION-blanc.png";


function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="meta text-accent">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-white/75 transition-colors hover:text-white hover:underline hover:decoration-accent hover:underline-offset-4">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <footer className="bg-primary text-white">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20">
        <div className="max-w-sm">
          <img src={vizballLogo} alt="Vizball Association" className="h-20 w-auto" loading="lazy" width="88" height="80" />
          <p className="mt-6 text-sm leading-relaxed text-white/70">{tr.footer_desc}</p>
          <p className="font-subtitle mt-5 text-accent">Justice - Volonté - Succès</p>
        </div>

        <FooterColumn
          title={tr.footer_nav}
          links={[
            { label: tr.nav_home, to: "/" },
            { label: tr.nav_news, to: "/actualites" },
            { label: tr.nav_forum, to: "/forum" },
            { label: tr.nav_shop, to: "/boutique" },
            { label: tr.nav_governance, to: "/gouvernance" },
            { label: tr.nav_contact, to: "/contact" },
          ]}
        />

        <FooterColumn
          title={tr.footer_sport}
          links={[
            { label: tr.footer_rules, to: "/le-sport" },
            { label: tr.footer_positions, to: "/le-sport" },
            { label: tr.footer_field, to: "/le-sport" },
            { label: tr.nav_tutorials, to: "/tutoriels" },
            { label: tr.footer_hcv, to: "/gouvernance" },
          ]}
        />

        <div>
          <h2 className="meta text-accent">{tr.footer_contact}</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="shrink-0 text-accent" />
              {tr.country_name}
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-accent" />
              <a href="mailto:contact@vizball.org" className="hover:text-white">contact@vizball.org</a>
            </li>
            <li className="flex items-center gap-3">
              <Globe size={16} className="shrink-0 text-accent" />
              <a href="https://vizball.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                vizball.org
              </a>
            </li>
          </ul>
          <h2 className="meta mt-8 text-accent">{tr.footer_follow_us}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SOCIALS.map(({ icon: Icon, name, href }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/85 transition-colors hover:bg-accent hover:text-primary"
                >
                  <Icon size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[hsl(var(--brand-red))]">
        <div className="shell flex flex-col gap-3 py-4 text-sm text-white/90 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Vizball Association. {tr.footer_rights}</p>
          <VisitorCounter />
          <p className="hidden lg:block">{tr.footer_created}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 self-start font-heading text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent md:self-auto"
          >
            {tr.footer_back_top}
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
