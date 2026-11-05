import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import { SOCIALS } from '../../lib/socials';

// Shown at the end of every article: one card per official account, each with a Follow action.
export default function FollowUs() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section aria-labelledby="follow-title" className="mt-14 rounded-xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <h2 id="follow-title" className="font-heading text-2xl font-black uppercase leading-tight text-white sm:text-3xl">
        {tr.follow_title}
      </h2>
      <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-white/60">{tr.follow_desc}</p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {SOCIALS.map(({ name, handle, href, icon: Icon }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tr.follow_cta} Vizball ${tr.follow_on} ${name}`}
              className="group flex h-full flex-col gap-4 rounded-lg bg-white/5 p-4 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:ring-accent/50"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-sm font-bold uppercase tracking-wider text-white">{name}</span>
                  <span className="block truncate font-body text-xs text-white/50">{handle}</span>
                </span>
              </span>
              <span className="btn btn-gold min-h-0 w-full py-2.5 text-sm">
                {tr.follow_cta}
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
