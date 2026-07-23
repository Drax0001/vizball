import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ShoppingBag, Newspaper, MapPin, Calendar,
  LogOut, Trash2, Pencil, Plus, Pin, Lock, Unlock,
  Settings, Check, X, ShieldAlert, BarChart3, MessageSquare, Upload,
  Video, FileText, UserCircle2, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../api/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ArticleEditor from '../components/news/ArticleEditor';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { CATEGORY_LABELS } from '../lib/shopData';
import { CATEGORY_LABELS as TUTORIAL_CATEGORY_LABELS, LEVEL_LABELS } from '../lib/tutorialLabels';

const TUTORIAL_CATEGORIES = ['Gestes Techniques', 'Placements Tactiques', 'Entraînements', 'Règles & Arbitrage'];
const TUTORIAL_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé'];
const GOVERNANCE_PILLARS = [
  { id: 'institutionnel', label: { fr: 'Institutionnel', en: 'Institutional' }, pillarText: 'Pilier Institutionnel' },
  { id: 'technique', label: { fr: 'Technique & Sportif', en: 'Technical & Sporting' }, pillarText: 'Pilier Technique & Sportif' },
  { id: 'ethique', label: { fr: 'Éthique & Social', en: 'Ethics & Social' }, pillarText: 'Pilier Éthique & Social' },
  { id: 'vision', label: { fr: 'Vision & Développement', en: 'Vision & Development' }, pillarText: 'Pilier Vision & Développement' },
];
const GOVERNANCE_STATUSES = ['disponible', 'restreint', 'bientôt'];
const GALLERY_CATEGORIES = ['Matchs', 'Joueurs', 'Équipements', 'Événements'];
const GALLERY_CATEGORY_KEYS = {
  'Matchs': 'media_cat_matches',
  'Joueurs': 'media_cat_players',
  'Équipements': 'media_cat_equipment',
  'Événements': 'media_cat_events',
};
const EVENT_TYPE_LABELS = {
  'Rencontre': { fr: 'Rencontre', en: 'Match' },
  'Tournoi': { fr: 'Tournoi', en: 'Tournament' },
  'Entraînement': { fr: 'Entraînement', en: 'Training' },
  'Autre': { fr: 'Autre', en: 'Other' },
};

export default function AdminDashboard() {
  const { user, login, logout, isLoadingAuth } = useAuth();
  const { lang } = useLang();
  const tr = t[lang];

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs state: overview, news, shop, clubs, events, forum
  const [activeTab, setActiveTab] = useState('overview');

  // DB entities state
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [governanceDocs, setGovernanceDocs] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [visitorsCount, setVisitorsCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  // Modal / Form state for edits
  const [articleEditorOpen, setArticleEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Équipements de Jeu', price: '', description: '', image_url: '', in_stock: true });
  const [productImageUploading, setProductImageUploading] = useState(false);

  const [clubFormOpen, setClubFormOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubForm, setClubForm] = useState({ name: '', city: 'Yaoundé', address: '', latitude: '', longitude: '', status: 'actif', members: '' });

  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', type: 'Rencontre', date: '', time: '', location: '', city: '', teams: '', status: 'confirmé' });

  const [tutorialFormOpen, setTutorialFormOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [tutorialForm, setTutorialForm] = useState({ title: '', category: TUTORIAL_CATEGORIES[0], level: TUTORIAL_LEVELS[0], duration: '0:00', desc: '', thumb: '', src: '', featured: false });
  const [tutorialThumbUploading, setTutorialThumbUploading] = useState(false);

  const [governanceFormOpen, setGovernanceFormOpen] = useState(false);
  const [editingGovernanceDoc, setEditingGovernanceDoc] = useState(null);
  const [governanceForm, setGovernanceForm] = useState({ pillarId: GOVERNANCE_PILLARS[0].id, title: '', category: '', status: 'restreint', pages: '', year: '', desc: '', content: '', fileUrl: '' });
  const [governanceFileUploading, setGovernanceFileUploading] = useState(false);

  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', bio: '', photo: '', displayOrder: 0 });
  const [teamPhotoUploading, setTeamPhotoUploading] = useState(false);

  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [editingGalleryPhoto, setEditingGalleryPhoto] = useState(null);
  const [galleryForm, setGalleryForm] = useState({ imageUrl: '', category: GALLERY_CATEGORIES[0], caption: '', featured: false });
  const [galleryPhotoUploading, setGalleryPhotoUploading] = useState(false);

  // Load all data from backend
  const loadAllData = async () => {
    if (!user || user.role !== 'admin') return;
    setLoadingData(true);
    try {
      const [artData, prodData, clubData, evData, topData, tutData, govData, teamData, galleryData, visData] = await Promise.all([
        api.articles.list(),
        api.products.list(),
        api.clubs.list(),
        api.events.list(),
        api.forum.listTopics(),
        api.tutorials.list(),
        api.governanceDocuments.list(),
        api.teamMembers.list(),
        api.gallery.list(),
        api.visitors.get()
      ]);
      setArticles(artData);
      setProducts(prodData);
      setClubs(clubData);
      setEvents(evData);
      setTopics(topData);
      setTutorials(tutData);
      setGovernanceDocs(govData);
      setTeamMembers(teamData);
      setGalleryPhotos(galleryData);
      setVisitorsCount(visData?.count || 0);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user]);

  // Auth Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await login(username, password);
    } catch (err) {
      setLoginError(err.message || tr.admin_login_error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Article Actions
  const handleEditArticle = (art) => {
    setEditingArticle(art);
    setArticleEditorOpen(true);
  };
  const handleNewArticle = () => {
    setEditingArticle(null);
    setArticleEditorOpen(true);
  };
  const handleDeleteArticle = async (id) => {
    if (!confirm(tr.admin_confirm_delete_article)) return;
    try {
      await api.articles.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Product Actions
  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      description: prod.description || '',
      image_url: prod.image_url || '',
      in_stock: prod.in_stock
    });
    setProductFormOpen(true);
  };
  const handleNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Équipements de Jeu', price: '', description: '', image_url: '', in_stock: true });
    setProductFormOpen(true);
  };
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...productForm, price: Number(productForm.price) };
      if (editingProduct) {
        await api.products.update(editingProduct.id, payload);
      } else {
        await api.products.create(payload);
      }
      setProductFormOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductImageUploading(true);
    try {
      const { url } = await api.uploads.upload(file);
      setProductForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      alert(tr.admin_upload_error + err.message);
    } finally {
      setProductImageUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm(tr.admin_confirm_delete_product)) return;
    try {
      await api.products.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Club Actions
  const handleEditClub = (club) => {
    setEditingClub(club);
    setClubForm({
      name: club.name,
      city: club.city,
      address: club.address || '',
      latitude: club.latitude,
      longitude: club.longitude,
      status: club.status,
      members: club.members || ''
    });
    setClubFormOpen(true);
  };
  const handleNewClub = () => {
    setEditingClub(null);
    setClubForm({ name: '', city: 'Yaoundé', address: '', latitude: '3.864', longitude: '11.502', status: 'actif', members: '' });
    setClubFormOpen(true);
  };
  const handleClubSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...clubForm,
        latitude: Number(clubForm.latitude),
        longitude: Number(clubForm.longitude),
        members: Number(clubForm.members)
      };
      if (editingClub) {
        await api.clubs.update(editingClub.id, payload);
      } else {
        await api.clubs.create(payload);
      }
      setClubFormOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteClub = async (id) => {
    if (!confirm(tr.admin_confirm_delete_club)) return;
    try {
      await api.clubs.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Event Actions
  const handleEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventForm({
      title: ev.title,
      type: ev.type,
      date: ev.date,
      time: ev.time,
      location: ev.location || '',
      city: ev.city || '',
      teams: ev.teams || '',
      status: ev.status
    });
    setEventFormOpen(true);
  };
  const handleNewEvent = () => {
    setEditingEvent(null);
    setEventForm({ title: '', type: 'Rencontre', date: new Date().toISOString().split('T')[0], time: '16:00', location: '', city: '', teams: '', status: 'confirmé' });
    setEventFormOpen(true);
  };
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.events.update(editingEvent.id, eventForm);
      } else {
        await api.events.create(eventForm);
      }
      setEventFormOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteEvent = async (id) => {
    if (!confirm(tr.admin_confirm_delete_event)) return;
    try {
      await api.events.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Forum Actions
  const handleTogglePinTopic = async (topic) => {
    try {
      await api.forum.updateTopic(topic.id, { pinned: !topic.pinned });
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleToggleCloseTopic = async (topic) => {
    try {
      await api.forum.updateTopic(topic.id, { closed: !topic.closed });
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteTopic = async (id) => {
    if (!confirm(tr.admin_confirm_delete_topic)) return;
    try {
      await api.forum.deleteTopic(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Tutorial Actions
  const handleEditTutorial = (tut) => {
    setEditingTutorial(tut);
    setTutorialForm({
      title: tut.title,
      category: tut.category,
      level: tut.level,
      duration: tut.duration || '0:00',
      desc: tut.desc || '',
      thumb: tut.thumb || '',
      src: tut.src || '',
      featured: tut.featured
    });
    setTutorialFormOpen(true);
  };
  const handleNewTutorial = () => {
    setEditingTutorial(null);
    setTutorialForm({ title: '', category: TUTORIAL_CATEGORIES[0], level: TUTORIAL_LEVELS[0], duration: '0:00', desc: '', thumb: '', src: '', featured: false });
    setTutorialFormOpen(true);
  };
  const handleTutorialSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTutorial) {
        await api.tutorials.update(editingTutorial.id, tutorialForm);
      } else {
        await api.tutorials.create(tutorialForm);
      }
      setTutorialFormOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteTutorial = async (id) => {
    if (!confirm(tr.admin_confirm_delete_tutorial)) return;
    try {
      await api.tutorials.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleTutorialThumbUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTutorialThumbUploading(true);
    try {
      const { url } = await api.uploads.upload(file);
      setTutorialForm((f) => ({ ...f, thumb: url }));
    } catch (err) {
      alert(tr.admin_upload_error + err.message);
    } finally {
      setTutorialThumbUploading(false);
    }
  };

  // Governance Document Actions
  const handleEditGovernanceDoc = (doc) => {
    setEditingGovernanceDoc(doc);
    setGovernanceForm({
      pillarId: doc.pillarId,
      title: doc.title,
      category: doc.category,
      status: doc.status,
      pages: doc.pages || '',
      year: doc.year || '',
      desc: doc.desc || '',
      content: (doc.content || []).join('\n'),
      fileUrl: doc.fileUrl || ''
    });
    setGovernanceFormOpen(true);
  };
  const handleNewGovernanceDoc = () => {
    setEditingGovernanceDoc(null);
    setGovernanceForm({ pillarId: GOVERNANCE_PILLARS[0].id, title: '', category: '', status: 'restreint', pages: '', year: '', desc: '', content: '', fileUrl: '' });
    setGovernanceFormOpen(true);
  };
  const handleGovernanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const pillar = GOVERNANCE_PILLARS.find((p) => p.id === governanceForm.pillarId);
      const payload = {
        ...governanceForm,
        pillar: pillar?.pillarText || '',
        pages: governanceForm.pages ? Number(governanceForm.pages) : null,
        content: governanceForm.content.split('\n').map((line) => line.trim()).filter(Boolean)
      };
      if (editingGovernanceDoc) {
        await api.governanceDocuments.update(editingGovernanceDoc.id, payload);
      } else {
        await api.governanceDocuments.create(payload);
      }
      setGovernanceFormOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteGovernanceDoc = async (id) => {
    if (!confirm(tr.admin_confirm_delete_doc)) return;
    try {
      await api.governanceDocuments.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleGovernanceFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGovernanceFileUploading(true);
    try {
      const { url } = await api.uploads.upload(file);
      setGovernanceForm((f) => ({ ...f, fileUrl: url }));
    } catch (err) {
      alert(tr.admin_upload_error + err.message);
    } finally {
      setGovernanceFileUploading(false);
    }
  };

  // Team Member Actions
  const handleEditTeamMember = (member) => {
    setEditingTeamMember(member);
    setTeamForm({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      photo: member.photo || '',
      displayOrder: member.display_order ?? 0
    });
    setTeamFormOpen(true);
  };
  const handleNewTeamMember = () => {
    setEditingTeamMember(null);
    setTeamForm({ name: '', role: '', bio: '', photo: '', displayOrder: teamMembers.length + 1 });
    setTeamFormOpen(true);
  };
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeamMember) {
        await api.teamMembers.update(editingTeamMember.id, teamForm);
      } else {
        await api.teamMembers.create(teamForm);
      }
      setTeamFormOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteTeamMember = async (id) => {
    if (!confirm(tr.admin_confirm_delete_team_member)) return;
    try {
      await api.teamMembers.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleTeamPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTeamPhotoUploading(true);
    try {
      const { url } = await api.uploads.upload(file);
      setTeamForm((f) => ({ ...f, photo: url }));
    } catch (err) {
      alert(tr.admin_upload_error + err.message);
    } finally {
      setTeamPhotoUploading(false);
    }
  };

  // Gallery Photo Actions
  const handleEditGalleryPhoto = (photo) => {
    setEditingGalleryPhoto(photo);
    setGalleryForm({
      imageUrl: photo.image_url,
      category: photo.category,
      caption: photo.caption || '',
      featured: !!photo.featured
    });
    setGalleryFormOpen(true);
  };
  const handleNewGalleryPhoto = () => {
    setEditingGalleryPhoto(null);
    setGalleryForm({ imageUrl: '', category: GALLERY_CATEGORIES[0], caption: '', featured: false });
    setGalleryFormOpen(true);
  };
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGalleryPhoto) {
        await api.gallery.update(editingGalleryPhoto.id, galleryForm);
      } else {
        await api.gallery.create(galleryForm);
      }
      setGalleryFormOpen(false);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteGalleryPhoto = async (id) => {
    if (!confirm(tr.admin_confirm_delete_photo)) return;
    try {
      await api.gallery.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleGalleryPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGalleryPhotoUploading(true);
    try {
      const { url } = await api.uploads.upload(file);
      setGalleryForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      alert(tr.admin_upload_error + err.message);
    } finally {
      setGalleryPhotoUploading(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Render Login Screen if not authenticated
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background visual styling */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(43,75%,49%) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-[#0f2c1e] border border-white/10 rounded-2xl p-8 shadow-2xl z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/15 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="text-accent" size={32} />
            </div>
            <h1 className="font-heading text-3xl text-white tracking-wide">VIZBALL PRO</h1>
            <p className="font-subtitle text-xs text-white/50 uppercase tracking-widest mt-1">{tr.admin_login_badge}</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 font-body text-sm rounded-lg p-3 text-center">
                {loginError}
              </div>
            )}
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.admin_login_username}</label>
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={tr.admin_login_username_placeholder}
                className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50"
              />
            </div>
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.admin_login_password}</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider py-3 rounded-lg transition-all duration-300 shadow-lg shadow-accent/10"
            >
              {isLoggingIn ? tr.admin_login_connecting : tr.admin_login_submit}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 2. Render Admin Dashboard if authenticated
  return (
    <div className="min-h-screen bg-primary text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <h1 className="font-heading text-4xl text-white">{tr.admin_panel_title}</h1>
            <p className="font-body text-sm text-white/50">{tr.admin_logged_in_as} <span className="text-accent font-semibold">{user.username}</span></p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-lg font-body text-sm font-semibold transition-all"
          >
            <LogOut size={16} /> {tr.admin_logout}
          </button>
        </div>

        {/* Tab Links */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-8">
          {[
            { id: 'overview', label: tr.admin_tab_overview, icon: BarChart3 },
            { id: 'news', label: tr.nav_news, icon: Newspaper },
            { id: 'shop', label: tr.nav_shop, icon: ShoppingBag },
            { id: 'clubs', label: tr.admin_tab_clubs, icon: MapPin },
            { id: 'events', label: tr.admin_tab_events, icon: Calendar },
            { id: 'forum', label: tr.admin_tab_forum, icon: MessageSquare },
            { id: 'tutorials', label: tr.nav_tutorials, icon: Video },
            { id: 'governance', label: tr.nav_governance, icon: FileText },
            { id: 'team', label: tr.admin_tab_team, icon: UserCircle2 },
            { id: 'gallery', label: tr.admin_tab_gallery, icon: ImageIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-body text-sm font-semibold transition-all ${
                  active 
                    ? 'bg-accent text-primary border-accent' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading overlay for tabs */}
        {loadingData && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          </div>
        )}

        {!loadingData && (
          <div className="space-y-6">
            
            {/* TABS 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Users size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{visitorsCount}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_visitors}</p>
                  </div>
                </div>
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Newspaper size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{articles.length}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_articles}</p>
                  </div>
                </div>
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{products.length}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_products}</p>
                  </div>
                </div>
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{clubs.length}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_clubs}</p>
                  </div>
                </div>
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <Video size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{tutorials.length}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_tutorials}</p>
                  </div>
                </div>
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{governanceDocs.length}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_gov_docs}</p>
                  </div>
                </div>
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <UserCircle2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{teamMembers.length}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_team}</p>
                  </div>
                </div>
                <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 bg-accent/15 border border-accent/30 rounded-xl flex items-center justify-center text-accent shrink-0">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl">{galleryPhotos.length}</h3>
                    <p className="font-body text-xs text-white/50 uppercase tracking-wider">{tr.admin_stat_gallery}</p>
                  </div>
                </div>

                {/* Information Callout */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-br from-accent/10 to-secondary/5 border border-accent/20 rounded-2xl p-6">
                  <h3 className="font-heading text-xl text-accent mb-2">{tr.admin_welcome_title}</h3>
                  <p className="font-body text-sm text-white/70 leading-relaxed mb-4">
                    {tr.admin_welcome_desc}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('news')} className="bg-[#0f2c1e] hover:bg-white/5 border border-white/10 px-4 py-2 rounded-lg font-body text-xs font-bold uppercase tracking-wider transition-colors">{tr.admin_manage_news}</button>
                    <button onClick={() => setActiveTab('shop')} className="bg-[#0f2c1e] hover:bg-white/5 border border-white/10 px-4 py-2 rounded-lg font-body text-xs font-bold uppercase tracking-wider transition-colors">{tr.admin_manage_shop}</button>
                    <button onClick={() => setActiveTab('clubs')} className="bg-[#0f2c1e] hover:bg-white/5 border border-white/10 px-4 py-2 rounded-lg font-body text-xs font-bold uppercase tracking-wider transition-colors">{tr.admin_manage_clubs}</button>
                  </div>
                </div>
              </div>
            )}

            {/* TABS 2: NEWS / ARTICLES */}
            {activeTab === 'news' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_news_title}</h2>
                  <button
                    onClick={handleNewArticle}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_news_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[880px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_title}</th>
                        <th className="py-3 px-4">{tr.admin_th_category}</th>
                        <th className="py-3 px-4">{tr.admin_th_author}</th>
                        <th className="py-3 px-4">{tr.admin_th_date}</th>
                        <th className="py-3 px-4">{tr.admin_th_views}</th>
                        <th className="py-3 px-4">{tr.admin_th_rating}</th>
                        <th className="py-3 px-4">{tr.admin_th_status}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((art) => (
                        <tr key={art.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold">{art.title} {art.featured && <span className="text-accent text-xs">★ {tr.admin_featured_short}</span>}</td>
                          <td className="py-3 px-4">{art.category}</td>
                          <td className="py-3 px-4">{art.author_name}</td>
                          <td className="py-3 px-4">{art.published_at}</td>
                          <td className="py-3 px-4">{(art.views || 0).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')}</td>
                          <td className="py-3 px-4">{art.rating_count ? `${(art.rating_avg || 0).toFixed(1)} (${art.rating_count})` : '—'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${art.status === 'publié' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                              {art.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditArticle(art)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteArticle(art.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 3: SHOP / BOUTIQUE */}
            {activeTab === 'shop' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_shop_title}</h2>
                  <button
                    onClick={handleNewProduct}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_shop_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_name}</th>
                        <th className="py-3 px-4">{tr.admin_th_category}</th>
                        <th className="py-3 px-4">{tr.admin_th_price}</th>
                        <th className="py-3 px-4">{tr.admin_th_stock}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold">{prod.name}</td>
                          <td className="py-3 px-4">{prod.category}</td>
                          <td className="py-3 px-4">{prod.price.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} FCFA</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${prod.in_stock ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                              {prod.in_stock ? tr.shop_in_stock : tr.admin_stock_out}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditProduct(prod)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteProduct(prod.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 4: CLUBS */}
            {activeTab === 'clubs' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_clubs_title}</h2>
                  <button
                    onClick={handleNewClub}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_clubs_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_club}</th>
                        <th className="py-3 px-4">{tr.admin_th_city}</th>
                        <th className="py-3 px-4">{tr.admin_th_members}</th>
                        <th className="py-3 px-4">{tr.admin_th_coords}</th>
                        <th className="py-3 px-4">{tr.admin_th_status}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs.map((club) => (
                        <tr key={club.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold">{club.name}</td>
                          <td className="py-3 px-4">{club.city}</td>
                          <td className="py-3 px-4">{club.members}</td>
                          <td className="py-3 px-4 text-xs font-mono">{club.latitude}, {club.longitude}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${club.status === 'actif' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                              {club.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditClub(club)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteClub(club.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 5: EVENTS / AGENDA */}
            {activeTab === 'events' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_events_title}</h2>
                  <button
                    onClick={handleNewEvent}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_events_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_event}</th>
                        <th className="py-3 px-4">{tr.admin_th_type}</th>
                        <th className="py-3 px-4">{tr.admin_th_datetime}</th>
                        <th className="py-3 px-4">{tr.admin_th_location}</th>
                        <th className="py-3 px-4">{tr.admin_th_teams}</th>
                        <th className="py-3 px-4">{tr.admin_th_status}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((ev) => (
                        <tr key={ev.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold">{ev.title}</td>
                          <td className="py-3 px-4">{EVENT_TYPE_LABELS[ev.type]?.[lang] || ev.type}</td>
                          <td className="py-3 px-4">{ev.date} @ {ev.time}</td>
                          <td className="py-3 px-4">{ev.location} ({ev.city})</td>
                          <td className="py-3 px-4">{ev.teams || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${ev.status === 'confirmé' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                              {ev.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditEvent(ev)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteEvent(ev.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 6: FORUM MODERATION */}
            {activeTab === 'forum' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_forum_title}</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_subject}</th>
                        <th className="py-3 px-4">{tr.admin_th_category}</th>
                        <th className="py-3 px-4">{tr.admin_th_author}</th>
                        <th className="py-3 px-4">{tr.admin_th_date}</th>
                        <th className="py-3 px-4">{tr.admin_th_state}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topics.map((tp) => (
                        <tr key={tp.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold">
                            {tp.title}
                          </td>
                          <td className="py-3 px-4">{tp.category}</td>
                          <td className="py-3 px-4">{tp.author_name}</td>
                          <td className="py-3 px-4 text-xs">{new Date(tp.created_date).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {tp.pinned && <span className="bg-accent/20 text-accent border border-accent/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{tr.forum_pinned}</span>}
                              {tp.closed && <span className="bg-white/10 text-white/60 border border-white/10 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{tr.forum_closed}</span>}
                              {!tp.pinned && !tp.closed && <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{tr.admin_badge_active}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleTogglePinTopic(tp)}
                                title={tp.pinned ? tr.forum_unpin : tr.forum_pin}
                                className={`p-1.5 rounded border transition-colors ${tp.pinned ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-white/5 border-white/10 hover:border-accent hover:text-accent'}`}
                              >
                                <Pin size={13} />
                              </button>
                              <button
                                onClick={() => handleToggleCloseTopic(tp)}
                                title={tp.closed ? tr.admin_title_reopen : tr.admin_title_close_topic}
                                className={`p-1.5 rounded border transition-colors ${tp.closed ? 'bg-white/10 border-white/20 text-white/60' : 'bg-white/5 border-white/10 hover:border-yellow-500 hover:text-yellow-500'}`}
                              >
                                {tp.closed ? <Unlock size={13} /> : <Lock size={13} />}
                              </button>
                              <button
                                onClick={() => handleDeleteTopic(tp.id)}
                                title={tr.admin_title_delete_topic}
                                className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 7: TUTORIALS */}
            {activeTab === 'tutorials' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_tutorials_title}</h2>
                  <button
                    onClick={handleNewTutorial}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_tutorials_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[880px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_title}</th>
                        <th className="py-3 px-4">{tr.admin_th_category}</th>
                        <th className="py-3 px-4">{tr.admin_th_level}</th>
                        <th className="py-3 px-4">{tr.admin_th_duration}</th>
                        <th className="py-3 px-4">{tr.admin_th_views}</th>
                        <th className="py-3 px-4">{tr.admin_th_rating}</th>
                        <th className="py-3 px-4">{tr.admin_th_featured}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tutorials.map((tut) => (
                        <tr key={tut.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold">{tut.title}</td>
                          <td className="py-3 px-4">{tut.category}</td>
                          <td className="py-3 px-4">{tut.level}</td>
                          <td className="py-3 px-4">{tut.duration}</td>
                          <td className="py-3 px-4">{(tut.views || 0).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')}</td>
                          <td className="py-3 px-4">{tut.rating_count ? `${(tut.rating_avg || 0).toFixed(1)} (${tut.rating_count})` : '—'}</td>
                          <td className="py-3 px-4">
                            {tut.featured && <span className="bg-accent/20 text-accent border border-accent/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{tr.admin_th_featured}</span>}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditTutorial(tut)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteTutorial(tut.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 8: GOVERNANCE DOCUMENTS */}
            {activeTab === 'governance' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_gov_title}</h2>
                  <button
                    onClick={handleNewGovernanceDoc}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_gov_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_title}</th>
                        <th className="py-3 px-4">{tr.admin_th_pillar}</th>
                        <th className="py-3 px-4">{tr.admin_th_category}</th>
                        <th className="py-3 px-4">{tr.admin_th_status}</th>
                        <th className="py-3 px-4">{tr.admin_th_year}</th>
                        <th className="py-3 px-4">{tr.admin_th_pages}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {governanceDocs.map((doc) => (
                        <tr key={doc.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold">{doc.title}</td>
                          <td className="py-3 px-4">{doc.pillar}</td>
                          <td className="py-3 px-4">{doc.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${doc.status === 'disponible' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : doc.status === 'bientôt' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-white/10 text-white/50 border border-white/20'}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{doc.year}</td>
                          <td className="py-3 px-4">{doc.pages}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditGovernanceDoc(doc)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteGovernanceDoc(doc.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 9: TEAM MEMBERS */}
            {activeTab === 'team' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_team_title}</h2>
                  <button
                    onClick={handleNewTeamMember}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_team_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_name}</th>
                        <th className="py-3 px-4">{tr.admin_th_role}</th>
                        <th className="py-3 px-4">{tr.admin_th_order}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4 font-bold flex items-center gap-3">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><UserCircle2 size={16} className="text-white/30" /></div>
                            )}
                            {member.name}
                          </td>
                          <td className="py-3 px-4">{member.role}</td>
                          <td className="py-3 px-4">{member.display_order}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditTeamMember(member)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteTeamMember(member.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS 10: GALLERY PHOTOS */}
            {activeTab === 'gallery' && (
              <div className="bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-2xl text-white">{tr.admin_gallery_title}</h2>
                  <button
                    onClick={handleNewGalleryPhoto}
                    className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus size={14} /> {tr.admin_gallery_new}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left font-body text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                        <th className="py-3 px-4">{tr.admin_th_preview}</th>
                        <th className="py-3 px-4">{tr.admin_th_category}</th>
                        <th className="py-3 px-4">{tr.admin_th_caption}</th>
                        <th className="py-3 px-4">{tr.admin_th_featured}</th>
                        <th className="py-3 px-4 text-right">{tr.admin_th_actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {galleryPhotos.map((photo) => (
                        <tr key={photo.id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-3 px-4">
                            {photo.image_url ? (
                              <img src={photo.image_url} alt={photo.caption} className="w-12 h-12 rounded object-cover" />
                            ) : (
                              <div className="w-12 h-12 rounded bg-gray-900" />
                            )}
                          </td>
                          <td className="py-3 px-4">{tr[GALLERY_CATEGORY_KEYS[photo.category]] || photo.category}</td>
                          <td className="py-3 px-4">{photo.caption}</td>
                          <td className="py-3 px-4">
                            {photo.featured && <span className="bg-accent/20 text-accent border border-accent/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{tr.admin_th_featured}</span>}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEditGalleryPhoto(photo)} className="p-1.5 bg-white/5 hover:bg-accent hover:text-primary rounded border border-white/10 hover:border-accent transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteGalleryPhoto(photo.id)} className="p-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded border border-white/10 hover:border-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ARTICLE EDITOR MODAL */}
      <AnimatePresence>
        {articleEditorOpen && (
          <ArticleEditor 
            article={editingArticle} 
            onSave={() => { setArticleEditorOpen(false); loadAllData(); }} 
            onClose={() => setArticleEditorOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* PRODUCT FORM MODAL */}
      <AnimatePresence>
        {productFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 className="font-heading text-2xl">{editingProduct ? tr.admin_product_edit : tr.admin_product_new}</h3>
                <button onClick={() => setProductFormOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleProductSubmit} className="space-y-4 font-body text-sm">
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_product_name}</label>
                  <Input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_th_category}</label>
                    <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                      {['Équipements de Jeu', 'Tenues & Équipements', 'Infrastructure', 'Packs Club'].map(cat => (
                        <option key={cat} value={cat} className="bg-[#0f2c1e]">{CATEGORY_LABELS[cat][lang]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_price_fcfa}</label>
                    <Input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_product_image}</label>
                  <div className="flex gap-3 items-start">
                    <Input value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} placeholder="https://..." className="bg-white/5 border-white/15 text-white flex-1" />
                    <label className={`flex items-center gap-2 px-4 py-2 border border-white/15 rounded-md text-xs text-white/60 hover:border-accent/40 hover:text-white transition-all cursor-pointer shrink-0 ${productImageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={14} />
                      {productImageUploading ? tr.admin_uploading : tr.admin_upload}
                      <input type="file" accept="image/*" className="hidden" onChange={handleProductImageUpload} />
                    </label>
                  </div>
                  {productForm.image_url && (
                    <div className="mt-3 rounded-lg overflow-hidden h-32 border border-white/10">
                      <img src={productForm.image_url} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-white/40 block mb-1">Description</label>
                  <Textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows={3} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="in_stock" checked={productForm.in_stock} onChange={e => setProductForm({...productForm, in_stock: e.target.checked})} className="w-4 h-4 accent-accent" />
                  <label htmlFor="in_stock" className="text-white/70 select-none cursor-pointer">{tr.admin_label_in_stock}</label>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setProductFormOpen(false)} className="text-white/40 hover:text-white px-4 py-2">{tr.admin_cancel}</button>
                  <button type="submit" className="bg-accent hover:bg-accent/90 text-primary px-6 py-2 rounded-lg font-bold">{tr.admin_save}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLUB FORM MODAL */}
      <AnimatePresence>
        {clubFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 className="font-heading text-2xl">{editingClub ? tr.admin_club_edit : tr.admin_club_new}</h3>
                <button onClick={() => setClubFormOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleClubSubmit} className="space-y-4 font-body text-sm">
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_club_name}</label>
                  <Input required value={clubForm.name} onChange={e => setClubForm({...clubForm, name: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_city_req}</label>
                    <Input required value={clubForm.city} onChange={e => setClubForm({...clubForm, city: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_members_count}</label>
                    <Input type="number" value={clubForm.members} onChange={e => setClubForm({...clubForm, members: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_latitude}</label>
                    <Input required type="number" step="any" value={clubForm.latitude} onChange={e => setClubForm({...clubForm, latitude: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_longitude}</label>
                    <Input required type="number" step="any" value={clubForm.longitude} onChange={e => setClubForm({...clubForm, longitude: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_address}</label>
                  <Input value={clubForm.address} onChange={e => setClubForm({...clubForm, address: e.target.value})} placeholder="Parcours Vita, Tsinga, etc." className="bg-white/5 border-white/15 text-white" />
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_status}</label>
                  <select value={clubForm.status} onChange={e => setClubForm({...clubForm, status: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                    <option value="actif" className="bg-[#0f2c1e]">{tr.admin_status_active}</option>
                    <option value="en formation" className="bg-[#0f2c1e]">{tr.admin_status_forming}</option>
                    <option value="inactif" className="bg-[#0f2c1e]">{tr.admin_status_inactive}</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setClubFormOpen(false)} className="text-white/40 hover:text-white px-4 py-2">{tr.admin_cancel}</button>
                  <button type="submit" className="bg-accent hover:bg-accent/90 text-primary px-6 py-2 rounded-lg font-bold">{tr.admin_save}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EVENT FORM MODAL */}
      <AnimatePresence>
        {eventFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 className="font-heading text-2xl">{editingEvent ? tr.admin_event_edit : tr.admin_event_new}</h3>
                <button onClick={() => setEventFormOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleEventSubmit} className="space-y-4 font-body text-sm">
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_event_title}</label>
                  <Input required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_event_type}</label>
                    <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                      {['Rencontre', 'Tournoi', 'Entraînement', 'Autre'].map(type => (
                        <option key={type} value={type} className="bg-[#0f2c1e]">{EVENT_TYPE_LABELS[type][lang]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_status}</label>
                    <select value={eventForm.status} onChange={e => setEventForm({...eventForm, status: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                      <option value="confirmé" className="bg-[#0f2c1e]">{tr.admin_status_confirmed}</option>
                      <option value="annulé" className="bg-[#0f2c1e]">{tr.admin_status_cancelled}</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_date}</label>
                    <Input required type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_time}</label>
                    <Input required type="time" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_location_precise}</label>
                    <Input required value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} placeholder="Stade Omnisport, etc." className="bg-white/5 border-white/15 text-white" />
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_city_req}</label>
                    <Input required value={eventForm.city} onChange={e => setEventForm({...eventForm, city: e.target.value})} placeholder="Yaoundé" className="bg-white/5 border-white/15 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_teams_optional}</label>
                  <Input value={eventForm.teams} onChange={e => setEventForm({...eventForm, teams: e.target.value})} placeholder="Yaoundé VC vs Douala VC" className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setEventFormOpen(false)} className="text-white/40 hover:text-white px-4 py-2">{tr.admin_cancel}</button>
                  <button type="submit" className="bg-accent hover:bg-accent/90 text-primary px-6 py-2 rounded-lg font-bold">{tr.admin_save}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TUTORIAL FORM MODAL */}
      <AnimatePresence>
        {tutorialFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 className="font-heading text-2xl">{editingTutorial ? tr.admin_tutorial_edit : tr.admin_tutorial_new}</h3>
                <button onClick={() => setTutorialFormOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleTutorialSubmit} className="space-y-4 font-body text-sm">
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_title_req}</label>
                  <Input required value={tutorialForm.title} onChange={e => setTutorialForm({...tutorialForm, title: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_th_category}</label>
                    <select value={tutorialForm.category} onChange={e => setTutorialForm({...tutorialForm, category: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                      {TUTORIAL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-[#0f2c1e]">{TUTORIAL_CATEGORY_LABELS[cat][lang]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_th_level}</label>
                    <select value={tutorialForm.level} onChange={e => setTutorialForm({...tutorialForm, level: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                      {TUTORIAL_LEVELS.map(lvl => (
                        <option key={lvl} value={lvl} className="bg-[#0f2c1e]">{LEVEL_LABELS[lvl][lang]}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_th_duration}</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={tutorialForm.duration.split(':')[0] || '0'}
                      onChange={e => {
                        const minutes = Math.max(0, Number(e.target.value) || 0);
                        const seconds = tutorialForm.duration.split(':')[1] || '00';
                        setTutorialForm({ ...tutorialForm, duration: `${minutes}:${seconds}` });
                      }}
                      className="bg-white/5 border-white/15 text-white w-20"
                    />
                    <span className="text-white/40 text-xs">{tr.admin_min_short}</span>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={tutorialForm.duration.split(':')[1] || '00'}
                      onChange={e => {
                        const minutes = tutorialForm.duration.split(':')[0] || '0';
                        const seconds = String(Math.min(59, Math.max(0, Number(e.target.value) || 0))).padStart(2, '0');
                        setTutorialForm({ ...tutorialForm, duration: `${minutes}:${seconds}` });
                      }}
                      className="bg-white/5 border-white/15 text-white w-20"
                    />
                    <span className="text-white/40 text-xs">{tr.admin_sec_short}</span>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">Description</label>
                  <Textarea value={tutorialForm.desc} onChange={e => setTutorialForm({...tutorialForm, desc: e.target.value})} rows={3} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_thumbnail}</label>
                  <div className="flex gap-3 items-start">
                    <Input value={tutorialForm.thumb} onChange={e => setTutorialForm({...tutorialForm, thumb: e.target.value})} placeholder="https://..." className="bg-white/5 border-white/15 text-white flex-1" />
                    <label className={`flex items-center gap-2 px-4 py-2 border border-white/15 rounded-md text-xs text-white/60 hover:border-accent/40 hover:text-white transition-all cursor-pointer shrink-0 ${tutorialThumbUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={14} />
                      {tutorialThumbUploading ? tr.admin_uploading : tr.admin_upload}
                      <input type="file" accept="image/*" className="hidden" onChange={handleTutorialThumbUpload} />
                    </label>
                  </div>
                  {tutorialForm.thumb && (
                    <div className="mt-3 rounded-lg overflow-hidden h-32 border border-white/10">
                      <img src={tutorialForm.thumb} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_video_link}</label>
                  <Input value={tutorialForm.src} onChange={e => setTutorialForm({...tutorialForm, src: e.target.value})} placeholder="https://..." className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setTutorialForm({...tutorialForm, featured: !tutorialForm.featured})} className={`w-12 h-6 rounded-full transition-colors relative ${tutorialForm.featured ? 'bg-accent' : 'bg-white/15'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${tutorialForm.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-white/60">{tr.admin_label_featured_tutorial}</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setTutorialFormOpen(false)} className="text-white/40 hover:text-white px-4 py-2">{tr.admin_cancel}</button>
                  <button type="submit" className="bg-accent hover:bg-accent/90 text-primary px-6 py-2 rounded-lg font-bold">{tr.admin_save}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GOVERNANCE DOCUMENT FORM MODAL */}
      <AnimatePresence>
        {governanceFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 className="font-heading text-2xl">{editingGovernanceDoc ? tr.admin_gov_doc_edit : tr.admin_gov_doc_new}</h3>
                <button onClick={() => setGovernanceFormOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleGovernanceSubmit} className="space-y-4 font-body text-sm">
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_title_req}</label>
                  <Input required value={governanceForm.title} onChange={e => setGovernanceForm({...governanceForm, title: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_th_pillar}</label>
                    <select value={governanceForm.pillarId} onChange={e => setGovernanceForm({...governanceForm, pillarId: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                      {GOVERNANCE_PILLARS.map(p => (
                        <option key={p.id} value={p.id} className="bg-[#0f2c1e]">{p.label[lang]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_status}</label>
                    <select value={governanceForm.status} onChange={e => setGovernanceForm({...governanceForm, status: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                      {GOVERNANCE_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-[#0f2c1e]">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_th_category}</label>
                  <Input value={governanceForm.category} onChange={e => setGovernanceForm({...governanceForm, category: e.target.value})} placeholder="Gouvernance, Règles du Jeu, ..." className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_th_year}</label>
                    <Input value={governanceForm.year} onChange={e => setGovernanceForm({...governanceForm, year: e.target.value})} placeholder="2024" className="bg-white/5 border-white/15 text-white" />
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_th_pages}</label>
                    <Input type="number" value={governanceForm.pages} onChange={e => setGovernanceForm({...governanceForm, pages: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">Description</label>
                  <Textarea value={governanceForm.desc} onChange={e => setGovernanceForm({...governanceForm, desc: e.target.value})} rows={3} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_content_lines}</label>
                  <Textarea value={governanceForm.content} onChange={e => setGovernanceForm({...governanceForm, content: e.target.value})} rows={4} placeholder={'Mission et composition du HCV\nPouvoirs de supervision et de veto'} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_file_pdf}</label>
                  <div className="flex gap-3 items-start">
                    <Input value={governanceForm.fileUrl} onChange={e => setGovernanceForm({...governanceForm, fileUrl: e.target.value})} placeholder="https://..." className="bg-white/5 border-white/15 text-white flex-1" />
                    <label className={`flex items-center gap-2 px-4 py-2 border border-white/15 rounded-md text-xs text-white/60 hover:border-accent/40 hover:text-white transition-all cursor-pointer shrink-0 ${governanceFileUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={14} />
                      {governanceFileUploading ? tr.admin_uploading : tr.admin_upload}
                      <input type="file" accept="application/pdf" className="hidden" onChange={handleGovernanceFileUpload} />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setGovernanceFormOpen(false)} className="text-white/40 hover:text-white px-4 py-2">{tr.admin_cancel}</button>
                  <button type="submit" className="bg-accent hover:bg-accent/90 text-primary px-6 py-2 rounded-lg font-bold">{tr.admin_save}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TEAM MEMBER FORM MODAL */}
      <AnimatePresence>
        {teamFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 className="font-heading text-2xl">{editingTeamMember ? tr.admin_team_edit : tr.admin_team_new_modal}</h3>
                <button onClick={() => setTeamFormOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleTeamSubmit} className="space-y-4 font-body text-sm">
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_title_req}</label>
                  <Input required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_role}</label>
                    <Input required value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                  <div>
                    <label className="text-white/40 block mb-1">{tr.admin_label_display_order}</label>
                    <Input type="number" value={teamForm.displayOrder} onChange={e => setTeamForm({...teamForm, displayOrder: Number(e.target.value)})} className="bg-white/5 border-white/15 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_bio}</label>
                  <Textarea value={teamForm.bio} onChange={e => setTeamForm({...teamForm, bio: e.target.value})} rows={3} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_photo}</label>
                  <div className="flex gap-3 items-start">
                    <Input value={teamForm.photo} onChange={e => setTeamForm({...teamForm, photo: e.target.value})} placeholder="https://..." className="bg-white/5 border-white/15 text-white flex-1" />
                    <label className={`flex items-center gap-2 px-4 py-2 border border-white/15 rounded-md text-xs text-white/60 hover:border-accent/40 hover:text-white transition-all cursor-pointer shrink-0 ${teamPhotoUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={14} />
                      {teamPhotoUploading ? tr.admin_uploading : tr.admin_upload}
                      <input type="file" accept="image/*" className="hidden" onChange={handleTeamPhotoUpload} />
                    </label>
                  </div>
                  {teamForm.photo && (
                    <div className="mt-3 rounded-lg overflow-hidden h-32 w-32 border border-white/10">
                      <img src={teamForm.photo} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setTeamFormOpen(false)} className="text-white/40 hover:text-white px-4 py-2">{tr.admin_cancel}</button>
                  <button type="submit" className="bg-accent hover:bg-accent/90 text-primary px-6 py-2 rounded-lg font-bold">{tr.admin_save}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GALLERY PHOTO FORM MODAL */}
      <AnimatePresence>
        {galleryFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg bg-[#0f2c1e] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 className="font-heading text-2xl">{editingGalleryPhoto ? tr.admin_gallery_edit : tr.admin_gallery_new_modal}</h3>
                <button onClick={() => setGalleryFormOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleGallerySubmit} className="space-y-4 font-body text-sm">
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_image_req}</label>
                  <div className="flex gap-3 items-start">
                    <Input required value={galleryForm.imageUrl} onChange={e => setGalleryForm({...galleryForm, imageUrl: e.target.value})} placeholder="https://..." className="bg-white/5 border-white/15 text-white flex-1" />
                    <label className={`flex items-center gap-2 px-4 py-2 border border-white/15 rounded-md text-xs text-white/60 hover:border-accent/40 hover:text-white transition-all cursor-pointer shrink-0 ${galleryPhotoUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={14} />
                      {galleryPhotoUploading ? tr.admin_uploading : tr.admin_upload}
                      <input type="file" accept="image/*" className="hidden" onChange={handleGalleryPhotoUpload} />
                    </label>
                  </div>
                  {galleryForm.imageUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden h-32 border border-white/10">
                      <img src={galleryForm.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_th_category}</label>
                  <select value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-[#0f2c1e]">{tr[GALLERY_CATEGORY_KEYS[cat]]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/40 block mb-1">{tr.admin_label_caption}</label>
                  <Input value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} className="bg-white/5 border-white/15 text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setGalleryForm({...galleryForm, featured: !galleryForm.featured})} className={`w-12 h-6 rounded-full transition-colors relative ${galleryForm.featured ? 'bg-accent' : 'bg-white/15'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${galleryForm.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-white/60">{tr.admin_th_featured}</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setGalleryFormOpen(false)} className="text-white/40 hover:text-white px-4 py-2">{tr.admin_cancel}</button>
                  <button type="submit" className="bg-accent hover:bg-accent/90 text-primary px-6 py-2 rounded-lg font-bold">{tr.admin_save}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
