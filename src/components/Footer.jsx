import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Globe,
  X as XIcon,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { useLang } from "../lib/LanguageContext";
import t from "../lib/translations";
import VisitorCounter from "./VisitorCounter";

const SOCIAL_LINKS = [
  { icon: XIcon, label: "X (Twitter)", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="font-heading text-4xl tracking-wider text-accent mb-4">
              VIZBALL
            </h3>
            <p className="font-body text-sm text-white/70 leading-relaxed">
              {tr.footer_desc}
            </p>
          </div>

          <div>
            <h4 className="font-body text-sm font-bold uppercase tracking-wider text-accent mb-6">
              {tr.footer_nav}
            </h4>
            <div className="space-y-3">
              <Link
                to="/"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_home}
              </Link>
              <Link
                to="/le-sport"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_sport}
              </Link>
              <Link
                to="/le-sport"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.footer_rules}
              </Link>
              <Link
                to="/actualites"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_news}
              </Link>
              <Link
                to="/forum"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_forum}
              </Link>
              <Link
                to="/boutique"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_shop}
              </Link>
              <Link
                to="/gouvernance"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_governance}
              </Link>
              <Link
                to="/association"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_association}
              </Link>
              <Link
                to="/contact"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.nav_contact}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-body text-sm font-bold uppercase tracking-wider text-accent mb-6">
              {tr.footer_sport}
            </h4>
            <div className="space-y-3">
              <Link
                to="/le-sport"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.footer_rules}
              </Link>
              <Link
                to="/le-sport"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.footer_positions}
              </Link>
              <Link
                to="/le-sport"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.footer_field}
              </Link>
              <Link
                to="/association"
                className="block font-body text-sm text-white/70 hover:text-white transition-colors"
              >
                {tr.footer_hcv}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-body text-sm font-bold uppercase tracking-wider text-accent mb-6">
              {tr.footer_contact}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-1 shrink-0" />
                <span className="font-body text-sm text-white/70">
                  Cameroun
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-accent mt-1 shrink-0" />
                <span className="font-body text-sm text-white/70">
                  contact@vizball.org
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={16} className="text-accent mt-1 shrink-0" />
                <a
                  href="https://vizball.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/70 hover:text-white transition-colors"
                >
                  vizball.org
                </a>
              </div>
            </div>

            <div className="mt-6">
              <span className="font-body text-xs text-white/40 uppercase tracking-wider block mb-3">
                {tr.footer_follow_us}
              </span>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-colors"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          <p className="font-body text-xs text-white/50 text-center md:text-left">
            © {new Date().getFullYear()} Vizball Association. {tr.footer_rights}
          </p>

          <div className="flex justify-center">
            <VisitorCounter />
          </div>

          <p className="font-body text-xs text-white/50 text-center md:text-right">
            {tr.footer_created}
          </p>
        </div>
      </div>
    </footer>
  );
}
