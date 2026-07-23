import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../lib/LanguageContext";
import { useAuth } from "../lib/AuthContext";
import t from "../lib/translations";
import LanguageSwitcher from "./LanguageSwitcher";
import vizballLogo from "../assets/images/LOGO-VIZBALL-ASSOCIATION-blanc.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [slogan, setSlogan] = useState("Rise Above The Game");
  const location = useLocation();
  const { lang } = useLang();
  const tr = t[lang];
  const { isAuthenticated, user, logout } = useAuth();

  const NAV_LINKS = [
    { label: tr.nav_home, path: "/" },
    { label: tr.nav_sport, path: "/le-sport" },
    { label: tr.nav_tutorials, path: "/tutoriels" },
    { label: tr.nav_news, path: "/actualites" },
    { label: tr.nav_forum, path: "/forum" },
    { label: tr.nav_shop, path: "/boutique" },
    { label: tr.nav_governance, path: "/gouvernance" },
    { label: tr.nav_association, path: "/association" },
    { label: tr.nav_contact, path: "/contact" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlogan((prev) =>
        prev === "Rise Above The Game"
          ? "Justice - Volonté - Succès"
          : "Rise Above The Game",
      );
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-primary/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="bg-[hsl(var(--brand-red))] mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 h-20">
            <Link
              to="/"
              className="flex items-center justify-center px-4 py-2 rounded-lg transition-opacity duration-300 hover:opacity-80"
            >
              <img src={vizballLogo} className="h-14 w-auto object-contain" />
            </Link>

            <div className="hidden lg:flex items-center gap-2 xl:gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 xl:px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all duration-300 hover:text-accent whitespace-nowrap ${
                    location.pathname === link.path
                      ? "text-accent"
                      : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="ml-2 pl-2 border-l border-white/20 flex items-center gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 hover:text-accent transition-colors whitespace-nowrap"
                    title={user?.username}
                  >
                    <LogOut size={14} />
                    {tr.nav_logout}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 hover:text-accent transition-colors whitespace-nowrap"
                  >
                    <LogIn size={14} />
                    {tr.nav_login}
                  </Link>
                )}
                <LanguageSwitcher />
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-white p-2"
              >
                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        <div className="min-h-[17px] bg-accent w-full flex items-center justify-center px-2 py-0.5 overflow-hidden">
          <p className="text-center">
            {" "}
            <AnimatePresence mode="wait">
              <motion.em
                key={slogan}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block text-[12px] font-bold text-[#143D2B]"
              >
                {slogan}
              </motion.em>
            </AnimatePresence>{" "}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary/98 backdrop-blur-md border-t border-secondary/20"
          >
            <div className="px-4 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 font-body text-sm font-semibold uppercase tracking-wider transition-colors rounded ${
                    location.pathname === link.path
                      ? "text-accent bg-white/5"
                      : "text-white/90 hover:text-accent hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 w-full px-4 py-3 font-body text-sm font-semibold uppercase tracking-wider text-white/90 hover:text-accent hover:bg-white/5 transition-colors rounded"
                >
                  <LogOut size={16} />
                  {tr.nav_logout}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-3 font-body text-sm font-semibold uppercase tracking-wider text-white/90 hover:text-accent hover:bg-white/5 transition-colors rounded"
                >
                  <LogIn size={16} />
                  {tr.nav_login}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
