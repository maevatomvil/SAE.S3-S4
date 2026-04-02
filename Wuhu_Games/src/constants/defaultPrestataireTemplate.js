export const defaultVendorTemplate = {
  vendorForm: {
    name: 'LocaSport Wuhu',
    name_en: 'Wuhu Sports Gear Rental',
    email: 'location.materiel@example.com',
    providerType: 'standard',
    image: null,
    shortDescription: 'Stand de location de matériel sportif pour profiter du site sans vous encombrer.',
    shortDescription_en: 'Sports equipment rental stand to enjoy the venue without carrying your own gear.',
    services: ['achat', 'planning', 'info'],
    hotelAvailability: [],
    locationNeeds: 'près du village',
    zoneId: 'terrain'
  },
  achat: {
    pageTitleAchat: 'Location de matériel sportif',
    pageDescriptionAchat:
      '<p>Retrouvez ici notre sélection de matériel sportif à louer pendant toute la durée de l événement. Les retraits se font directement au stand et notre équipe peut vous conseiller selon votre activité du jour.</p><p>Casques, kits de jeu, accessoires de récupération et petits équipements pratiques sont préparés à l avance pour faciliter votre visite.</p>',
    articles: [
      {
        id: 'location-velo-journee',
        titre: 'Location de vélo - journée',
        description: 'Vélo loisir avec antivol et casque inclus pour circuler facilement sur le site des Wuhu Games.',
        prix: 18,
        stock: 12,
        image: null
      },
      {
        id: 'kit-badminton',
        titre: 'Kit badminton - demi-journée',
        description: 'Deux raquettes, volants et sac de transport pour une session rapide entre deux compétitions.',
        prix: 10,
        stock: 20,
        image: null
      },
      {
        id: 'pack-recuperation',
        titre: 'Pack récupération sportive',
        description: 'Tapis, rouleau de massage et élastique léger pour l échauffement ou la récupération.',
        prix: 8,
        stock: 15,
        image: null
      }
    ]
  },
  info: {
    pageTitle: 'Comment louer votre matériel sportif',
    templateContent:
      '<p>Bienvenue chez LocaSport Wuhu, votre stand de location de matériel sportif installé près du village partenaires. Notre objectif est simple : permettre aux visiteurs, accompagnants et participants de profiter du site sans transporter tout leur équipement.</p><p>Nous proposons du matériel pratique pour la journée ou la demi-journée, un retrait rapide sur place et des conseils pour choisir l équipement adapté à votre activité. Les stocks affichés sur la page d achat sont mis à jour pour faciliter la démonstration.</p><p>Le stand est prévu près du village afin de rester facile d accès tout au long de l événement. Pensez à consulter le planning pour connaître nos temps forts et les créneaux d essai.</p>'
  },
  planning: [
    {
      id: 'planning-loc-1',
      jour: 'Lundi',
      titre: 'Ouverture du stand et retrait express',
      heure: '09:00',
      lieu: 'Stand LocaSport - village partenaires',
      joueurs: []
    },
    {
      id: 'planning-loc-2',
      jour: 'Mardi',
      titre: 'Essai libre de trottinettes et vélos',
      heure: '14:30',
      lieu: 'Allée centrale près du village',
      joueurs: []
    },
    {
      id: 'planning-loc-3',
      jour: 'Jeudi',
      titre: 'Atelier réglage et prise en main',
      heure: '11:00',
      lieu: 'Stand LocaSport - village partenaires',
      joueurs: []
    },
    {
      id: 'planning-loc-4',
      jour: 'Samedi',
      titre: 'Retours tardifs et assistance finale',
      heure: '17:00',
      lieu: 'Stand LocaSport - village partenaires',
      joueurs: []
    }
  ]
}
