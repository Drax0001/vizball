import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, useInView } from 'framer-motion';
import { MapPin, Users, Search, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../../api/client';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

// Fix Leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const STATUS_COLORS = {
  'actif': 'text-green-400 bg-green-400/10 border-green-400/20',
  'en formation': 'text-accent bg-accent/10 border-accent/20',
  'inactif': 'text-white/40 bg-white/5 border-white/10'
};

const STATUS_LABELS = {
  'actif': { fr: 'actif', en: 'active' },
  'en formation': { fr: 'en formation', en: 'forming' },
  'inactif': { fr: 'inactif', en: 'inactive' },
};

function ClubCard({ club, active, onClick, lang }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
      active ?
      'bg-accent/10 border-accent/40' :
      'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'}`
      }>
      
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className={`font-heading text-lg leading-tight ${active ? 'text-accent' : 'text-white'}`}>
          {club.name}
        </h3>
        <span className={`shrink-0 text-xs font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLORS[club.status] || STATUS_COLORS['actif']}`}>
          {STATUS_LABELS[club.status]?.[lang] || club.status}
        </span>
      </div>
      <p className="font-body text-sm text-white/50 flex items-center gap-1">
        <MapPin size={11} className="shrink-0" />
        {club.city}{club.country ? `, ${club.country}` : ''}
      </p>
      {club.address &&
      <p className="font-body text-xs text-white/30 mt-1 truncate">{club.address}</p>
      }
    </button>);

}

export default function ClubsMap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { lang } = useLang();
  const tr = t[lang];
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeClub, setActiveClub] = useState(null);
  const [search, setSearch] = useState('');

  const loadClubs = async () => {
    setLoading(true);
    try {
      const data = await api.clubs.list();
      setClubs(data);
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const filteredClubs = clubs.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q));

  });

  const center = clubs.length > 0 ?
  [clubs[0].latitude, clubs[0].longitude] :
  [3.848, 11.502]; // Yaoundé par défaut

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12">
          
          <span className="font-body text-sm font-bold uppercase tracking-widest text-secondary">
            {tr.clubs_badge}
          </span>
          <h2 className="font-heading text-5xl sm:text-6xl mt-2 text-[hsl(var(--chart-3))]">{tr.clubs_title} {tr.clubs_title2}</h2>
          <p className="font-body text-muted-foreground mt-3 max-w-xl">
            {tr.clubs_subtitle}
          </p>
        </motion.div>

        {loading ?
        <div className="h-[320px] sm:h-[420px] lg:h-[500px] bg-muted rounded-2xl animate-pulse" /> :

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid lg:grid-cols-3 gap-6">
          
            {/* Liste des clubs */}
            <div className="lg:col-span-1 bg-primary rounded-2xl p-4 flex flex-col gap-2 max-h-[300px] sm:max-h-[400px] lg:max-h-[520px]">
              {/* Header */}
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/10 mb-1 shrink-0">
                <Users size={16} className="text-accent" />
                <span className="font-heading text-lg text-white">{filteredClubs.length} {tr.clubs_word}{filteredClubs.length > 1 ? 'S' : ''}</span>
              </div>

              {/* Barre de recherche */}
              <div className="relative shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.clubs_search_placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-2 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors" />
              
                {search &&
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                    <X size={13} />
                  </button>
              }
              </div>

              {/* Liste scrollable */}
              <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-0.5">
                {filteredClubs.length === 0 ?
              <div className="text-center py-10">
                    <MapPin size={32} className="text-white/20 mx-auto mb-3" />
                    <p className="font-body text-sm text-white/30">
                      {search ? tr.clubs_no_results : tr.clubs_none_registered}
                    </p>
                  </div> :

              filteredClubs.map((club) =>
              <ClubCard
                key={club.id}
                club={club}
                active={activeClub?.id === club.id}
                onClick={() => setActiveClub(activeClub?.id === club.id ? null : club)}
                lang={lang} />

              )
              }
              </div>
            </div>

            {/* Carte */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-border h-[320px] sm:h-[420px] lg:h-[520px]">
              <MapContainer
              center={center}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}>
              
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
                {clubs.map((club) =>
              <Marker
                key={club.id}
                position={[club.latitude, club.longitude]}
                icon={customIcon}
                eventHandlers={{ click: () => setActiveClub(club) }}>
                
                    <Popup>
                      <div className="min-w-[140px] sm:min-w-[180px] max-w-[220px]">
                        <p className="font-bold text-sm mb-1">{club.name}</p>
                        <p className="text-xs text-gray-600 mb-1">{club.city}{club.country ? `, ${club.country}` : ''}</p>
                        {club.address && <p className="text-xs text-gray-500 mb-2">{club.address}</p>}
                        {club.contact_phone &&
                    <p className="text-xs flex items-center gap-1">
                            <span>📞</span> {club.contact_phone}
                          </p>
                    }
                        {club.contact_email &&
                    <p className="text-xs flex items-center gap-1 mt-0.5">
                            <span>✉️</span> {club.contact_email}
                          </p>
                    }
                      </div>
                    </Popup>
                  </Marker>
              )}
              </MapContainer>
            </div>
          </motion.div>
        }
      </div>
    </section>);

}