// One-time seed data, inserted only when the database is created empty.
// Mirrors the content that used to live in db.json, plus tutorials/governance
// documents that were previously frontend-only mock arrays.

export const seedUsers = [
  {
    id: 'admin-id-1',
    username: 'admin',
    email: null,
    passwordHash: '$2a$10$gxQKpFjwQpM9snvSbhLqJesi7.3JI7.v6YJoAgKAQZjYoZZxmzdhq',
    role: 'admin',
  },
];

export const seedArticles = [
  {
    id: 'art-1',
    title: 'Lancement du Championnat National de Vizball 2026',
    category: 'Tournoi',
    status: 'publié',
    cover_image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    excerpt: "Le coup d'envoi du championnat national de Vizball aura lieu le mois prochain à Yaoundé, réunissant les 8 meilleures équipes du pays.",
    content: "C'est officiel ! L'Association Nationale de Vizball a annoncé ce matin les dates et le calendrier officiel du Championnat National de Vizball 2026. L'événement phare de la saison débutera le 15 août à Yaoundé au Complexe Sportif Moderne.\n\nCette année, huit équipes qualifiées s'affronteront pour le titre suprême dans une formule de poules suivie de phases éliminatoires très intenses. Les tenants du titre de Douala remettent leur couronne en jeu face à des challengers de taille venus de Bafoussam et de Garoua.\n\nLes billets seront en vente dès la semaine prochaine sur notre site officiel et chez nos partenaires agréés. Préparez-vous à vivre des moments exceptionnels de sport et de communion !",
    author_name: 'Jean-Pierre Nguene',
    published_at: '2026-07-10',
    featured: true,
  },
  {
    id: 'art-2',
    title: 'Comment bien choisir son ballon de Vizball',
    category: 'Actualité',
    status: 'publié',
    cover_image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Découvrez nos conseils techniques pour choisir le ballon idéal selon votre niveau de jeu et votre terrain.',
    content: "Le choix du ballon est crucial en Vizball. En tant que joueur, débutant ou confirmé, la taille, le poids et la texture du ballon influencent directement la précision de vos tirs et la qualité de vos passes.\n\nPour les débutants, nous conseillons le modèle Standard V1, qui offre une excellente prise en main grâce à son revêtement texturé antidérapant. Les clubs et compétiteurs confirmés s'orienteront plutôt vers le Vizball Match Pro, homologué pour les compétitions officielles, offrant un rebond plus régulier et une durabilité accrue sur tous types de surfaces.\n\nRetrouvez tous les ballons homologués dans notre boutique officielle !",
    author_name: 'Sarah Ndongo',
    published_at: '2026-07-05',
    featured: false,
  },
  {
    id: 'art-3',
    title: "Portrait d'un champion : Amadou Diallo",
    category: 'Portrait',
    status: 'publié',
    cover_image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Rencontre avec le tireur d\'élite du Vizball Club de Garoua, élu meilleur joueur de la saison dernière.',
    content: "À seulement 23 ans, Amadou Diallo s'est imposé comme le tireur le plus prolifique du circuit national. Avec un taux de réussite exceptionnel aux tirs de précision de 82% la saison dernière, il a porté son équipe de Garoua jusqu'en finale nationale.\n\nOriginaire de Garoua, Amadou a découvert le Vizball à l'âge de 14 ans lors d'une initiation scolaire. Depuis, il s'entraîne sans relâche, combinant physique athlétique et mental de fer. Dans cette interview exclusive, il nous parle de sa préparation quotidienne, de ses objectifs pour le prochain championnat et de son rêve de voir le Vizball s'exporter au-delà des frontières.",
    author_name: 'Marc Mbarga',
    published_at: '2026-06-28',
    featured: false,
  },
];

export const seedProducts = [
  {
    id: 'prod-1',
    name: 'Ballon Officiel Vizball Match Pro',
    category: 'Équipements de Jeu',
    price: 25000,
    description: 'Ballon de match officiel homologué par l\'Association. Revêtement en cuir synthétique de haute qualité, offrant un grip et une résistance de niveau professionnel sur terrains intérieurs et extérieurs.',
    image_url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400',
    in_stock: true,
  },
  {
    id: 'prod-2',
    name: 'Maillot Officiel Vizball 2026',
    category: 'Tenues & Équipements',
    price: 15000,
    description: 'Maillot officiel respirant de l\'association, modèle joueur. Tissu ultra-léger et technique évacuant la transpiration pour un confort de jeu optimal lors de vos matchs de compétition.',
    image_url: 'https://images.unsplash.com/photo-1578269174936-2709b5a8c0e6?auto=format&fit=crop&q=80&w=400',
    in_stock: true,
  },
  {
    id: 'prod-3',
    name: 'Kit Poteaux et Filets Transportables',
    category: 'Infrastructure',
    price: 120000,
    description: 'Système de buts de Vizball autoportants et transportables. Montage rapide en 15 minutes, parfait pour les entraînements en club ou la pratique sur terrains temporaires. Sac de transport inclus.',
    image_url: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=400',
    in_stock: true,
  },
  {
    id: 'prod-4',
    name: 'Pack Club Découverte (10 Ballons + Sac)',
    category: 'Packs Club',
    price: 180000,
    description: 'L\'équipement idéal pour lancer une section de Vizball dans votre école ou club. Comprend 10 ballons d\'entraînement robustes, un gonfleur à pied et un grand sac de transport résistant.',
    image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400',
    in_stock: false,
  },
];

export const seedClubs = [
  { id: 'club-1', name: 'Vizball Club de Yaoundé (VCY)', city: 'Yaoundé', address: 'Complexe Sportif de Tsinga, Rue du Stade', latitude: 3.864, longitude: 11.502, status: 'actif', members: 45 },
  { id: 'club-2', name: 'Association Vizball Littoral', city: 'Douala', address: 'Parcours Vita de Douala, Bonamoussadi', latitude: 4.051, longitude: 9.767, status: 'actif', members: 60 },
  { id: 'club-3', name: 'Vizball Sahel Club', city: 'Garoua', address: 'Stade Omnisports de Garoua, Secteur Ouest', latitude: 9.301, longitude: 13.395, status: 'actif', members: 30 },
  { id: 'club-4', name: 'Club de Vizball de l\'Ouest', city: 'Bafoussam', address: 'Plateau Multisports de Tamdja', latitude: 5.473, longitude: 10.418, status: 'en formation', members: 15 },
];

export const seedEvents = [
  { id: 'evt-1', title: 'Match d\'ouverture : Yaoundé vs Douala', type: 'Rencontre', date: '2026-08-15', time: '16:00', location: 'Complexe Sportif de Tsinga', city: 'Yaoundé', teams: 'VCY vs Vizball Littoral', status: 'confirmé' },
  { id: 'evt-2', title: 'Tournoi National de Détection Jeunes', type: 'Tournoi', date: '2026-09-05', time: '09:00', location: 'Parcours Vita de Douala', city: 'Douala', teams: 'Catégories U17 et U20', status: 'confirmé' },
  { id: 'evt-3', title: 'Stage National d\'Arbitrage et Coaching', type: 'Entraînement', date: '2026-08-01', time: '08:30', location: 'Complexe National, Bafoussam', city: 'Bafoussam', teams: 'Formation officielle', status: 'confirmé' },
];

export const seedForumTopics = [
  {
    id: 'topic-1',
    title: 'Conseils pour améliorer la précision des tirs de pénalité',
    category: 'Tactiques',
    author_name: 'Moussa Sani',
    user_id: null,
    created_date: '2026-07-09T14:23:00.000Z',
    content: "Bonjour à tous ! Je suis le tireur de mon équipe depuis 6 mois, mais j'ai des difficultés lors des tirs à longue distance. Quels exercices me conseillez-vous pour améliorer la régularité et la précision de ma trajectoire ?",
    pinned: true,
    closed: false,
  },
  {
    id: 'topic-2',
    title: 'Clarification sur la règle de contact physique au Vizball',
    category: 'Règles',
    author_name: 'Coach Franck',
    user_id: null,
    created_date: '2026-07-08T09:15:00.000Z',
    content: "Bonjour. Lors de notre dernier match amical, il y a eu un litige sur les contacts d'épaule à épaule en phase défensive. L'arbitre a sifflé faute systématiquement. La règle officielle stipule-t-elle un contact zéro ou le contact à l'épaule est-il toléré comme au football ?",
    pinned: false,
    closed: false,
  },
];

export const seedForumReplies = [
  {
    id: 'rep-1',
    topic_id: 'topic-1',
    author_name: 'Amadou Diallo',
    user_id: null,
    created_date: '2026-07-09T16:45:00.000Z',
    content: 'Salut Moussa ! Je te conseille de te concentrer sur l\'alignement de tes hanches au moment de l\'impact. Fais aussi des séries d\'échauffement avec les yeux fermés pour développer ta proprioception et ton geste mécanique réflexe. 50 lancers par jour à 8 mètres de distance font une énorme différence !',
  },
  {
    id: 'rep-2',
    topic_id: 'topic-2',
    author_name: 'Arbitre Principal Guy',
    user_id: null,
    created_date: '2026-07-08T11:30:00.000Z',
    content: 'Bonjour Coach Franck. Le règlement du Vizball interdit tout contact d\'épaule à épaule si le défenseur utilise son poids pour déstabiliser l\'adversaire. La règle de sécurité prévaut. Seul le contact léger sans élan est toléré si le défenseur a déjà une position fixe établie.',
  },
];

export const seedVisitorsCount = 128;

export const seedTutorials = [
  { id: 'tut-1', title: 'Introduction au Vizball', category: 'Gestes Techniques', description: "Découvrez les bases du Vizball : le terrain, les équipes, les postes et le déroulement général d'un match.", duration: '8:24', views: 2341, level: 'Débutant', featured: true, thumb: '', src: null },
  { id: 'tut-2', title: 'Maîtriser la Technique du Tireur', category: 'Gestes Techniques', description: 'Apprenez les mouvements essentiels du tireur : positionnement dans les cercles périphériques, précision du tir et déplacements après chaque tir.', duration: '12:10', views: 1890, level: 'Débutant', featured: false, thumb: '', src: null },
  { id: 'tut-3', title: 'Le Footplay — Contrôle de Balle avec les Pieds', category: 'Gestes Techniques', description: 'Maîtrisez le "footplay" : comment contrôler la balle avec les pieds en zone de duel et transition vers le tir en 3 pas maximum.', duration: '9:55', views: 3102, level: 'Intermédiaire', featured: false, thumb: '', src: null },
  { id: 'tut-4', title: 'La Crosspass — Passe de Traversée', category: 'Gestes Techniques', description: 'Technique de la crosspass effectuée par le passeur vers les attaquants. Exercices de précision et de timing pour réussir cette passe décisive.', duration: '7:30', views: 2670, level: 'Intermédiaire', featured: false, thumb: '', src: null },
  { id: 'tut-5', title: 'La Décharge — Geste de la Cible', category: 'Gestes Techniques', description: 'Exercices spécialisés pour le joueur en position de Cible : évitement de la balle de tir, ramassage sécurisé et décharge vers le passeur.', duration: '11:00', views: 1450, level: 'Avancé', featured: false, thumb: '', src: null },
  { id: 'tut-6', title: "Tactique d'Équipe en Zone de Duel", category: 'Placements Tactiques', description: "Stratégies collectives pour les 27 secondes en zone de duel : placement des attaquants, lecture de la défense et choix du bon angle de tir.", duration: '15:20', views: 4215, level: 'Intermédiaire', featured: false, thumb: '', src: null },
  { id: 'tut-7', title: 'Permutation de Postes — Réorganisation après But', category: 'Placements Tactiques', description: "Comprendre et exécuter les permutations entre équipes à chaque reprise de manche. Adaptez votre dispositif selon le score et l'adversaire.", duration: '10:45', views: 1780, level: 'Avancé', featured: false, thumb: '', src: null },
  { id: 'tut-8', title: 'Défense Collective en Zone de Duel', category: 'Placements Tactiques', description: 'Techniques défensives : blocage du passage, interception de la passe, défense du footplay. Comment récupérer la balle dans les 27 secondes.', duration: '13:15', views: 2905, level: 'Intermédiaire', featured: false, thumb: '', src: null },
  { id: 'tut-9', title: 'Entraînement Cardio-Spécifique Vizball', category: 'Entraînements', description: "Programme d'échauffement et de conditioning physique adapté aux exigences du Vizball : vitesse de réaction, explosivité et endurance sur 4 manches.", duration: '20:00', views: 3560, level: 'Débutant', featured: false, thumb: '', src: null },
  { id: 'tut-10', title: 'Circuit d\'Entraînement des Tireurs', category: 'Entraînements', description: 'Séance complète dédiée aux tireurs : exercices de précision sur cible mobile, déplacements inter-cercles et gestion des 3 balles de tir.', duration: '18:30', views: 2100, level: 'Intermédiaire', featured: false, thumb: '', src: null },
  { id: 'tut-11', title: 'Séance de Réflexes pour la Cible', category: 'Entraînements', description: "Entraînements intensifs de réflexes et d'agilité pour le joueur en position de Cible : esquiver, attraper et transmettre sous pression.", duration: '16:00', views: 1650, level: 'Avancé', featured: false, thumb: '', src: null },
  { id: 'tut-12', title: 'La Pénalité "CLAQUE" — Règles & Exécution', category: 'Règles & Arbitrage', description: 'Tout sur la pénalité CLAQUE : les fautes sanctionnées (T1, T4, C1, P1, A1, A3, G3), la technique d\'exécution à 8m de la plaque et l\'arbitrage.', duration: '6:40', views: 5430, level: 'Débutant', featured: false, thumb: '', src: null },
];

// icon fields from the old frontend-only DOCUMENTS array are intentionally
// dropped here — React icon components aren't serializable. The frontend
// re-attaches an icon by matching on `category` (see Gouvernance.jsx).
export const seedGovernanceDocuments = [
  { id: 'doc-1', pillarId: 'institutionnel', pillar: 'Pilier Institutionnel', title: 'Statuts & Cadre Normatif du HCV', category: 'Gouvernance', description: "Statuts et cadre normatif du Haut Conseil du Vizball (HCV), organe de supervision garant de l'éthique, de l'intégrité du sport et du respect de la vision du Fondateur.", content: ['Mission et composition du HCV', 'Pouvoirs de supervision et de veto', 'Cadre normatif du Vizball', 'Relations avec le Bureau Exécutif'], status: 'restreint', pages: 14, year: '2024', fileUrl: null },
  { id: 'doc-2', pillarId: 'institutionnel', pillar: 'Pilier Institutionnel', title: 'Charte CLTD — Convention de Licence', category: 'Propriété Intellectuelle', description: 'Convention de Licence avec le Titulaire des Droits (CLTD). Document crucial pour rassurer les partenaires sur la légalité de l\'exploitation de la marque et du concept Vizball.', content: ['Portée et limites de la licence accordée', 'Droits et obligations du licencié', 'Redevances et conditions financières', 'Durée, renouvellement et résiliation'], status: 'restreint', pages: 20, year: '2024', fileUrl: null },
  { id: 'doc-3', pillarId: 'institutionnel', pillar: 'Pilier Institutionnel', title: 'Charte de Gouvernance Patrimoniale', category: 'Héritage & Pérennité', description: "Charte définissant la gouvernance de la structure patrimoniale du Vizball, démontrant la pérennité du projet et la gestion de l'héritage du sport sur le long terme.", content: ['Structure de propriété et transmission', "Protection de l'héritage du Fondateur", 'Mécanismes de pérennisation', 'Gouvernance du patrimoine intellectuel'], status: 'restreint', pages: 16, year: '2024', fileUrl: null },
  { id: 'doc-4', pillarId: 'technique', pillar: 'Pilier Technique & Sportif', title: 'Manuel Pratique des Règles de Base', category: 'Règles du Jeu', description: 'La "Bible" du Vizball. Version originale enregistrée à la SOCILADRA sous le numéro 00872, le 07 octobre 2010. Garantit l\'authenticité et la codification officielle des règles.', content: ['Conditions de début de partie', 'Règles des Tireurs (T1 à T10)', 'Règles de la Cible (C1, C2)', 'Règles du Passeur (P1 à P4)', 'Règles des Attaquants et Défenseurs', 'Règles Générales et Pénalités — la CLAQUE'], status: 'disponible', pages: 7, year: '2010', fileUrl: '' },
  { id: 'doc-5', pillarId: 'technique', pillar: 'Pilier Technique & Sportif', title: "Cahier des Charges de l'Équipement", category: 'Ingénierie Sportive', description: 'Spécifications techniques officielles des équipements : ballons de tir et de catch, butoir, dimensions et marquage des zones. Atteste du sérieux de l\'ingénierie sportive du Vizball.', content: ['Spécifications des ballons de tir', 'Caractéristiques de la balle de catch', 'Standards du butoir (plaque)', 'Normes des zones et marquages au sol', 'Supports et équipements annexes'], status: 'disponible', pages: 12, year: '2024', fileUrl: null },
  { id: 'doc-6', pillarId: 'technique', pillar: 'Pilier Technique & Sportif', title: "Guide de l'Arbitrage", category: 'Compétition', description: 'Guide complet pour les arbitres Vizball : gestion du match, signaux officiels, application des règles, gestion des fautes et de la pénalité CLAQUE. Garantit l\'impartialité et la rigueur.', content: ["Rôle et positionnement de l'arbitre", 'Signaux officiels et communication', 'Gestion des fautes et sanctions', 'Procédure de la CLAQUE', 'Gestion des incidents de match'], status: 'disponible', pages: 22, year: '2024', fileUrl: null },
  { id: 'doc-7', pillarId: 'ethique', pillar: 'Pilier Éthique & Social', title: 'Politique de Protection des Mineurs', category: 'Protection & Sécurité', description: 'Document définissant les mesures de sécurité et de prévention pour les pratiquants mineurs. Absolument indispensable pour les partenariats institutionnels et les programmes jeunesse.', content: ['Cadre légal de protection des mineurs', "Procédures de signalement et d'urgence", 'Formation obligatoire des encadrants', 'Code de conduite des adultes', 'Mesures de prévention contre les abus'], status: 'disponible', pages: 16, year: '2024', fileUrl: null },
  { id: 'doc-8', pillarId: 'ethique', pillar: 'Pilier Éthique & Social', title: "Code d'Éthique et de Déontologie", category: 'Intégrité', description: 'Code complet incluant la lutte contre le dopage, la corruption, les paris illégaux et les discriminations. Fondement de la crédibilité du Vizball auprès des instances sportives internationales.', content: ['Lutte contre le dopage', 'Prévention de la corruption', 'Lutte contre les discriminations', "Règles sur les conflits d'intérêts", 'Procédures disciplinaires'], status: 'disponible', pages: 20, year: '2024', fileUrl: null },
  { id: 'doc-9', pillarId: 'ethique', pillar: 'Pilier Éthique & Social', title: 'Charte Égalité & Inclusion', category: 'Responsabilité Sociale', description: "Charte valorisant la mixité et l'accessibilité du Vizball à tous les profils. Souligne l'engagement pour le sport féminin, le sport inclusif et l'égalité des chances.", content: ["Engagement pour l'égalité hommes/femmes", 'Accessibilité aux personnes en situation de handicap', 'Lutte contre toutes les formes de discrimination', 'Programmes de sport inclusif', 'Objectifs chiffrés de représentation'], status: 'disponible', pages: 10, year: '2024', fileUrl: null },
  { id: 'doc-10', pillarId: 'vision', pillar: 'Pilier Vision & Développement', title: 'Plan Stratégique 2026–2030', category: 'Stratégie', description: 'Document de synthèse présentant les objectifs de croissance du Vizball sur 5 ans : nombre de licenciés cibles, expansion géographique, développement des compétitions et levée de fonds.', content: ['Diagnostic de la situation actuelle', 'Objectifs de licenciés par zone géographique', 'Feuille de route des compétitions nationales et internationales', 'Plan de financement et partenariats', 'Indicateurs de performance (KPIs)'], status: 'restreint', pages: 40, year: '2025', fileUrl: null },
  { id: 'doc-11', pillarId: 'vision', pillar: 'Pilier Vision & Développement', title: "Rapport d'Impact Social", category: 'Impact & RSE', description: 'Documentation de la contribution du Vizball au bien-être des communautés : santé physique, cohésion sociale, emploi des jeunes et développement économique local.', content: ['Nombre de bénéficiaires directs et indirects', 'Indicateurs de santé et bien-être', "Impact sur l'emploi et la formation", 'Contribution à la cohésion sociale', "Témoignages et études de cas"], status: 'restreint', pages: 28, year: '2025', fileUrl: null },
  { id: 'doc-12', pillarId: 'vision', pillar: 'Pilier Vision & Développement', title: 'Kit Média & Dossier de Partenariat', category: 'Partenariat', description: 'Document visuel et professionnel présentant les opportunités de sponsoring Vizball avec les codes graphiques officiels (Vert Forêt et Or). Destiné aux sponsors et partenaires potentiels.', content: ['Présentation de la marque Vizball', 'Chiffres clés et audience', 'Offres de sponsoring et visibilité', 'Retours sur investissement estimés', 'Procédure de contact et signature'], status: 'restreint', pages: 30, year: '2025', fileUrl: null },
];

export const seedTeamMembers = [
  { id: 'team-1', name: 'MIAFFO NKENGNI Yannick Joël', role: 'Fondateur & Président du HCV', bio: "Créateur du Vizball en 2007, Yannick Joël est le visionnaire fondateur du sport. Il préside le Haut Conseil du Vizball et détient les droits de propriété intellectuelle perpétuels sur le sport.", photo: '', displayOrder: 1 },
  { id: 'team-2', name: 'Membre du Bureau Exécutif', role: 'Secrétaire Général', bio: "Responsable de l'administration courante de l'Association, de la coordination entre les organes et de la communication officielle.", photo: '', displayOrder: 2 },
  { id: 'team-3', name: 'Membre du Bureau Exécutif', role: 'Trésorier Général', bio: "Garant de la transparence financière de l'Association, chargé de la gestion budgétaire et des relations avec la Commission des Finances.", photo: '', displayOrder: 3 },
  { id: 'team-4', name: 'Membre du Bureau Exécutif', role: 'Responsable Technique', bio: "En charge du développement sportif, de la formation des arbitres et des entraîneurs, et de l'organisation des compétitions officielles.", photo: '', displayOrder: 4 },
];

// No real event photography exists yet — deliberately empty rather than
// seeded with stock photos. Admins add real photos via /admin.
export const seedGalleryPhotos: { id: string; imageUrl: string; category: string; caption: string; featured: boolean }[] = [];
