import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, ChevronDown, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../lib/LanguageContext";
import { useAuth } from "../lib/AuthContext";
import t from "../lib/translations";
import LanguageSwitcher from "./LanguageSwitcher";
import vizballLogo from "../assets/images/LOGO-VIZBALL-ASSOCIATION-blanc.png";

const SLOGANS = ['"Rise Above The Game"', "Justice - Volonté - Succès"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const moreRef = useRef(null);
  const location = useLocation();
  const { lang } = useLang();
  const tr = t[lang];
  const { isAuthenticated, user, logout } = useAuth();

  // Primary links stay in the bar; the rest live under "Plus".
  const PRIMARY = [
    { label: tr.nav_home, path: "/" },
    { label: tr.nav_sport, path: "/le-sport" },
    { label: tr.nav_tutorials, path: "/tutoriels" },
    { label: tr.nav_news, path: "/actualites" },
    { label: tr.nav_shop, path: "/boutique" },
    { label: tr.nav_governance, path: "/gouvernance" },
  ];
  const MORE = [
    { label: tr.nav_forum, path: "/forum" },
    { label: tr.nav_media, path: "/media" },
    { label: tr.nav_contact, path: "/contact" },
    { label: tr.nav_game, url: "https://game.vizball.org" },
  ];

  // Keep a protected link (e.g. Forum) highlighted while sitting on the
  // /login redirect it was sent to, using the state ProtectedRoute threads
  // through — but not when /login was reached any other way.
  const isActiveLink = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path + "/")) ||
    (location.pathname === "/login" && location.state?.from === path);
  const moreActive = MORE.some((l) => l.path && isActiveLink(l.path));

  useEffect(() => {
    const timer = setInterval(() => setSloganIndex((i) => (i + 1) % SLOGANS.length), 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setMoreOpen(false);
      }
    };
    const onClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [mobileOpen]);

  const linkBase =
    "relative flex h-full items-center px-1 font-heading text-[0.95rem] font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap";
  const activeBar = (
    <span className="absolute inset-x-1 bottom-0 h-[3px] rounded-t bg-accent" aria-hidden="true" />
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-primary"
      >
        {tr.nav_skip}
      </a>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-500 ${scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.18)]" : ""}`}
        aria-label="Principal"
      >
        <div className="bg-[hsl(var(--brand-red))]">
          <div className="shell flex h-20 items-center justify-between gap-6">
            <Link to="/" className="flex shrink-0 items-center rounded transition-opacity duration-300 hover:opacity-85" aria-label="Vizball, accueil">
              <img src={vizballLogo} alt="" className="h-14 w-auto object-contain" width="61" height="56" />
            </Link>

            <div className="hidden h-full items-center gap-5 lg:flex xl:gap-7">
              {PRIMARY.map((link) => {
                const active = isActiveLink(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`${linkBase} ${active ? "text-accent" : "text-white/90 hover:text-accent"}`}
                  >
                    {link.label}
                    {active && activeBar}
                  </Link>
                );
              })}

              <div ref={moreRef} className="relative flex h-full items-center">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={`${linkBase} gap-1 ${moreActive ? "text-accent" : "text-white/90 hover:text-accent"}`}
                >
                  {tr.nav_more}
                  <ChevronDown size={16} className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`} />
                  {moreActive && activeBar}
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full w-56 overflow-hidden rounded-b-md border-t-[3px] border-accent bg-primary py-2 shadow-xl"
                    >
                      {MORE.map((link) => (
                        <li key={link.path || link.url}>
                          {link.url ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-5 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white/90 transition-colors hover:bg-white/5 hover:text-accent"
                            >
                              {link.label}
                              <ArrowUpRight size={15} />
                            </a>
                          ) : (
                            <Link
                              to={link.path}
                              aria-current={isActiveLink(link.path) ? "page" : undefined}
                              className={`block px-5 py-3 font-heading text-sm font-bold uppercase tracking-wider transition-colors hover:bg-white/5 ${
                                isActiveLink(link.path) ? "text-accent" : "text-white/90 hover:text-accent"
                              }`}
                            >
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {isAuthenticated ? (
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 font-heading text-sm font-bold uppercase tracking-wider text-white/90 transition-colors hover:text-accent"
                  title={user?.username}
                >
                  <LogOut size={15} />
                  {tr.nav_logout}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 font-heading text-sm font-bold uppercase tracking-wider text-white/90 transition-colors hover:text-accent"
                >
                  <LogIn size={15} />
                  {tr.nav_login}
                </Link>
              )}
              <span className="h-5 w-px bg-white/25" aria-hidden="true" />
              <LanguageSwitcher />
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? tr.nav_close : tr.nav_menu}
                className="grid h-11 w-11 place-items-center rounded text-white transition-colors hover:bg-white/10"
              >
                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Gold slogan strip: folds away once the page scrolls */}
        <div
          className={`overflow-hidden bg-accent transition-[height] duration-500 ${scrolled ? "h-0" : "h-7"}`}
          aria-hidden={scrolled}
        >
          <p className="flex h-7 items-center justify-center px-2 text-center">
            <AnimatePresence mode="wait">
              <motion.em
                key={sloganIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block font-subtitle text-[15px] text-primary"
              >
                {SLOGANS[sloganIndex]}
              </motion.em>
            </AnimatePresence>
          </p>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={tr.nav_menu}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 right-0 top-20 z-40 flex w-[min(22rem,100%)] flex-col overflow-y-auto bg-primary lg:hidden"
            >
              <ul className="flex-1 py-4">
                {[...PRIMARY, ...MORE].map((link) => {
                  const active = link.path && isActiveLink(link.path);
                  const cls = `flex items-center justify-between px-6 py-3.5 font-heading text-base font-bold uppercase tracking-wider transition-colors ${
                    active ? "bg-white/5 text-accent" : "text-white/90 hover:bg-white/5 hover:text-accent"
                  }`;
                  return (
                    <li key={link.path || link.url}>
                      {link.url ? (
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className={cls}>
                          {link.label}
                          <ArrowUpRight size={16} />
                        </a>
                      ) : (
                        <Link to={link.path} aria-current={active ? "page" : undefined} className={cls}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-white/10 p-6">
                {isAuthenticated ? (
                  <button onClick={() => logout()} className="btn btn-outline-light w-full">
                    <LogOut size={16} />
                    {tr.nav_logout}
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-gold w-full">
                    <LogIn size={16} />
                    {tr.nav_login}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
