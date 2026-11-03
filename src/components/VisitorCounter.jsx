import React, { useEffect, useState } from 'react';
import { useLang } from '../lib/LanguageContext';
import { api } from '../api/client';

export default function VisitorCounter() {
  const { lang } = useLang();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const tracked = sessionStorage.getItem('vizball_visitor_tracked');
        let data;
        if (!tracked) {
          data = await api.visitors.track();
          sessionStorage.setItem('vizball_visitor_tracked', 'true');
        } else {
          data = await api.visitors.get();
        }
        if (data && typeof data.count === 'number') {
          setCount(data.count);
        }
      } catch (err) {
        console.error('Failed to load visitor counter:', err);
      }
    };
    fetchVisitorCount();
  }, []);

  if (count === null || count === 0) return null;

  return (
    <p className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
      </span>
      <span className="tabular">
        {count.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} {lang === 'en' ? 'visitor' : 'visiteur'}{count > 1 ? 's' : ''}
      </span>
    </p>
  );
}
