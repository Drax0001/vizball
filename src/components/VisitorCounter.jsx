import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
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
    <div className="flex items-center gap-2 text-white/40">
      <Users size={13} className="text-brand-red" />
      <span className="font-body text-xs">
        {count.toLocaleString()} {lang === 'en' ? 'visitor' : 'visiteur'}{count > 1 ? 's' : ''}
      </span>
    </div>
  );
}