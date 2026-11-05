import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from './LanguageContext';
import t from './translations';
import Seo from '@/components/Seo';
import PageHeader from '@/components/PageHeader';
import headerImage from '../assets/images/ball-to-the-leg.webp';

// Rendered inside the site layout (navbar and footer stay), for any URL the
// app does not know. On the server, nginx answers the same URLs with a 404
// status so search engines do not index them (deploy/nginx.vizball.conf).
export default function PageNotFound({ title, message, action }) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);
    const { lang } = useLang();
    const tr = t[lang];

    const links = [
        { to: '/le-sport', label: tr.nav_sport },
        { to: '/tutoriels', label: tr.nav_tutorials },
        { to: '/actualites', label: tr.nav_news },
        { to: '/boutique', label: tr.nav_shop },
        { to: '/gouvernance', label: tr.nav_governance },
        { to: '/contact', label: tr.nav_contact },
    ];

    return (
        <div className="bg-background">
            <Seo title={title || tr.error_404_title} canonicalPath={location.pathname} noindex />
            <PageHeader title={title || tr.error_404_title} crumb="404" image={headerImage}>
                <p className="font-heading text-6xl font-black leading-none text-accent">404</p>
            </PageHeader>

            <section className="shell py-16 md:py-20">
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {message || (
                        <>
                            {tr.error_404_prefix} <span className="font-bold text-primary">« /{pageName} »</span> {tr.error_404_suffix}
                        </>
                    )}
                </p>
                {action}
                <Link to="/" className={`btn btn-green mt-8 ${action ? 'sm:ml-3' : ''}`}>
                    <ArrowLeft size={18} />
                    {tr.error_404_go_home}
                </Link>

                <h2 className="section-title mt-16 text-primary text-[clamp(1.6rem,3vw,2.2rem)]">
                    {lang === 'en' ? 'You might be looking for' : 'Vous cherchiez peut-être'}
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {links.map((l) => (
                        <li key={l.to}>
                            <Link
                                to={l.to}
                                className="group flex items-center justify-between rounded-lg bg-card px-5 py-4 font-heading font-bold uppercase tracking-wider text-primary ring-1 ring-border transition-shadow hover:shadow-md"
                            >
                                {l.label}
                                <ArrowRight size={18} className="text-[hsl(var(--brand-red))] transition-transform group-hover:translate-x-1" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
