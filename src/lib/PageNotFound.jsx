import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLang } from './LanguageContext';
import t from './translations';
import vizballLogo from '../assets/images/LOGO-VIZBALL-ASSOCIATION-blanc.png';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);
    const { lang } = useLang();
    const tr = t[lang];

    return (
        <main className="flex min-h-screen flex-col bg-primary font-body text-white">
            <div className="bg-[hsl(var(--brand-red))]">
                <div className="shell flex h-20 items-center">
                    <Link to="/" aria-label="Vizball">
                        <img src={vizballLogo} alt="" className="h-14 w-auto" />
                    </Link>
                </div>
            </div>
            <div className="shell flex flex-1 flex-col justify-center py-16">
                <p className="font-heading text-[clamp(6rem,20vw,12rem)] font-black leading-none text-accent">404</p>
                <h1 className="section-title mt-4 text-white">{tr.error_404_title}</h1>
                <p className="mt-6 max-w-xl text-lg text-white/80">
                    {tr.error_404_prefix} <span className="font-bold text-white">"{pageName}"</span> {tr.error_404_suffix}
                </p>
                <div className="mt-10">
                    <Link to="/" className="btn btn-gold">
                        <ArrowLeft size={18} />
                        {tr.error_404_go_home}
                    </Link>
                </div>
            </div>
        </main>
    );
}
