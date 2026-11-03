import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpRight, LogIn, LogOut } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';
import t from '../lib/translations';
import LanguageSwitcher from './LanguageSwitcher';
import FieldLines from './field/FieldLines';
import { useLenis } from './motion/SmoothScroll';
import { SOCIAL_LINKS } from './site/social';
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion';
import vizballLogo from '../assets/images/vizball-logo-couleur.png';
import Tricolour from './site/Tricolour';

const PRIMARY = ['/le-sport', '/tutoriels', '/actualites', '/boutique'];

export default function Navbar() {
  const { lang } = useLang();
  const tr = t[lang];
  const location = useLocation();
  const lenis = useLenis();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuButton = useRef(null);
  const { scrollY } = useScroll();

  const links = [
    { label: tr.nav_home, path: '/' },
    { label: tr.nav_sport, path: '/le-sport' },
    { label: tr.nav_tutorials, path: '/tutoriels' },
    { label: tr.nav_news, path: '/actualites' },
    { label: tr.nav_forum, path: '/forum' },
    { label: tr.nav_shop, path: '/boutique' },
    { label: tr.nav_governance, path: '/gouvernance' },
    { label: tr.nav_contact, path: '/contact' },
    { label: tr.nav_game, url: 'https://game.vizball.org' },
  ];

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path) || (location.pathname === '/login' && location.state?.from === path);

  // Pages whose top is not on the dark pitch need a solid bar from the start.
  const lightTop = ['/login', '/register'].includes(location.pathname);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(!open && y > 320 && y > prev + 2);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    const onKey = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lenis]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-bold focus:text-night"
      >
        {tr.nav_skip}
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-[130]"
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            (solid || lightTop) && !open ? 'bg-night' : 'bg-transparent'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 transition-opacity duration-500 ${(solid || lightTop) && !open ? 'opacity-100' : 'opacity-0'}`}
        >
          <Tricolour />
        </div>
        <div className="shell relative flex h-[72px] items-center justify-between gap-6 lg:h-20">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Vizball, accueil">
            <img src={vizballLogo} alt="" className="h-14 w-auto lg:h-16" width="66" height="64" />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Principal">
            {links
              .filter((l) => PRIMARY.includes(l.path))
              .map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  aria-current={isActive(l.path) ? 'page' : undefined}
                  className={`link-draw relative py-1 font-heading text-[0.95rem] font-bold uppercase tracking-[0.08em] transition-colors ${
                    isActive(l.path) ? 'text-accent' : 'text-chalk/85 hover:text-chalk'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`group inline-flex h-10 items-center gap-3 rounded-full pl-4 pr-3 font-heading text-sm font-bold uppercase tracking-[0.1em] transition-colors duration-500 ${
                open ? 'bg-accent text-night' : 'bg-chalk text-night hover:bg-accent'
              }`}
            >
              <span className="relative block h-4 overflow-hidden">
                <motion.span className="block" animate={{ y: open ? '-50%' : '0%' }} transition={{ duration: 0.45, ease: EASE_OUT }}>
                  <span className="block leading-4">{tr.nav_menu}</span>
                  <span className="block leading-4">{tr.nav_close}</span>
                </motion.span>
              </span>
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 h-[2px] w-full rounded bg-current transition-all duration-500 ease-out-expo ${
                    open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] rounded bg-current transition-all duration-500 ease-out-expo ${
                    open ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'bottom-0 w-3/5'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <MenuOverlay
            links={links}
            isActive={isActive}
            tr={tr}
            isAuthenticated={isAuthenticated}
            user={user}
            logout={logout}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MenuOverlay({ links, isActive, tr, isAuthenticated, user, logout, onClose }) {
  const firstLink = useRef(null);
  useEffect(() => {
    const id = setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(id);
  }, []);

  const item = {
    hidden: { y: '110%' },
    shown: (i) => ({ y: '0%', transition: { duration: 0.9, ease: EASE_OUT, delay: 0.25 + i * 0.05 } }),
    exit: { y: '-110%', transition: { duration: 0.4, ease: EASE_IN_OUT } },
  };

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={tr.nav_menu}
      data-lenis-prevent
      className="pitch fixed inset-0 z-[120] overflow-y-auto"
      initial={{ clipPath: 'circle(0% at calc(100% - 64px) 40px)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 64px) 40px)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 64px) 40px)' }}
      transition={{ duration: 0.85, ease: EASE_IN_OUT }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden opacity-[0.12]">
        <FieldLines orient="v" draw="mount" delay={0.3} className="h-[130%] w-auto translate-x-[22%] text-chalk" />
      </div>

      <div className="shell relative grid min-h-full gap-12 pb-10 pt-28 lg:grid-cols-[1.5fr_1fr] lg:pt-32">
        <nav aria-label={tr.nav_menu}>
          <ul className="flex flex-col">
            {links.map((l, i) => {
              const active = l.path && isActive(l.path);
              const cls = `group flex items-baseline gap-4 py-1 display text-[clamp(2.2rem,min(7.2vw,9.2vh),5.75rem)] transition-colors duration-300 ${
                active ? 'text-accent' : 'text-chalk hover:text-accent'
              }`;
              const content = (
                <>
                  <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-3">{l.label}</span>
                  {l.url && <ArrowUpRight className="h-[0.5em] w-[0.5em] shrink-0 self-center" strokeWidth={2.5} />}
                </>
              );
              return (
                <li key={l.path || l.url} className="overflow-hidden">
                  <motion.div custom={i} variants={item} initial="hidden" animate="shown" exit="exit">
                    {l.url ? (
                      <a ref={i === 0 ? firstLink : undefined} href={l.url} target="_blank" rel="noopener noreferrer" className={cls}>
                        {content}
                      </a>
                    ) : (
                      <Link
                        ref={i === 0 ? firstLink : undefined}
                        to={l.path}
                        aria-current={active ? 'page' : undefined}
                        className={cls}
                        onClick={onClose}
                      >
                        {content}
                      </Link>
                    )}
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </nav>

        <motion.aside
          className="flex flex-col justify-end gap-10 lg:pb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.8, ease: EASE_OUT } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                title={user?.username}
                className="inline-flex h-10 items-center gap-2 rounded-full px-4 font-heading text-sm font-bold uppercase tracking-[0.1em] text-chalk ring-1 ring-inset ring-chalk/25 transition-colors hover:bg-chalk hover:text-night"
              >
                <LogOut size={15} />
                {tr.nav_logout}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                className="inline-flex h-10 items-center gap-2 rounded-full px-4 font-heading text-sm font-bold uppercase tracking-[0.1em] text-chalk ring-1 ring-inset ring-chalk/25 transition-colors hover:bg-chalk hover:text-night"
              >
                <LogIn size={15} />
                {tr.nav_login}
              </Link>
            )}
          </div>

          <div>
            <p className="label text-chalk/55">{tr.menu_write}</p>
            <a href="mailto:contact@vizball.org" className="link-draw mt-2 inline-block font-heading text-2xl font-bold text-chalk sm:text-3xl">
              contact@vizball.org
            </a>
          </div>

          <ul className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-inset ring-chalk/20 text-chalk/80 transition-colors hover:bg-accent hover:text-night hover:ring-accent"
                >
                  <Icon size={17} />
                </a>
              </li>
            ))}
          </ul>

          <p className="voice text-xl text-accent">“Rise Above The Game”</p>
        </motion.aside>
      </div>
    </motion.div>
  );
}
