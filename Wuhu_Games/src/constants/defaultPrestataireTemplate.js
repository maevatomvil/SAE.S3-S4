export const defaultVendorTemplate = {
  vendorForm: {
    name: 'La Pause des Champions',
    name_en: 'Champions Snack Corner',
    email: 'pause.champions@example.com',
    providerType: 'standard',
    image: null,
    shortDescription: 'Stand de restauration rapide avec plats chauds, encas maison et boissons fraîches pour toute la journée.',
    shortDescription_en: 'Quick food stand with hot dishes, homemade snacks and cold drinks all day long.',
    services: ['achat', 'planning', 'info'],
    hotelAvailability: [],
    locationNeeds: 'près de la zone restauration',
    zoneId: 'terrain'
  },
  achat: {
    pageTitleAchat: 'Commander à La Pause des Champions',
    pageDescriptionAchat:
      '<p>Retrouvez ici notre sélection de plats chauds, formules rapides et boissons préparées pour accompagner les visiteurs tout au long de l événement.</p><p>Les commandes se retirent directement au stand et notre équipe prépare les portions à l avance pour limiter l attente aux heures de pointe.</p>',
    articles: [
      {
        id: 'champ-burger',
        titre: 'Burger du champion',
        description: 'Burger généreux au steak grillé, cheddar affiné, pickles d oignon et sauce maison.',
        prix: 13,
        stock: 24,
        image: null
      },
      {
        id: 'champ-wrap',
        titre: 'Wrap poulet croustillant',
        description: 'Wrap chaud avec poulet croustillant, crudités fraîches et sauce légèrement épicée.',
        prix: 11,
        stock: 28,
        image: null
      },
      {
        id: 'champ-cookie',
        titre: 'Cookie noisette-chocolat',
        description: 'Grand cookie moelleux cuit sur place, parfait pour la pause de l après-midi.',
        prix: 4,
        stock: 35,
        image: null
      },
      {
        id: 'champ-citronnade',
        titre: 'Citronnade maison',
        description: 'Boisson fraîche au citron, menthe et eau pétillante.',
        prix: 3,
        stock: 40,
        image: null
      }
    ]
  },
  info: {
    pageTitle: 'Bienvenue à La Pause des Champions',
    templateContent:
      '<p>Bienvenue à La Pause des Champions, un stand pensé pour proposer une restauration simple, efficace et chaleureuse au cœur du site.</p><p>Nous préparons des plats rapides, quelques recettes maison et des boissons fraîches pour les visiteurs, les accompagnants et les équipes qui veulent manger sans perdre de temps entre deux animations.</p><p>Le stand est situé près de la zone restauration pour faciliter le retrait des commandes et fluidifier le service sur les périodes les plus fréquentées.</p>'
  },
  planning: [
    {
      id: 'planning-food-1',
      jour: 'Lundi',
      titre: 'Ouverture petit-déjeuner et boissons chaudes',
      heure: '08:30',
      lieu: 'Stand La Pause des Champions',
      joueurs: []
    },
    {
      id: 'planning-food-2',
      jour: 'Mardi',
      titre: 'Menu du midi spécial supporters',
      heure: '12:15',
      lieu: 'Stand La Pause des Champions',
      joueurs: []
    },
    {
      id: 'planning-food-3',
      jour: 'Jeudi',
      titre: 'Pause goûter : cookies et boissons fraîches',
      heure: '16:00',
      lieu: 'Zone restauration',
      joueurs: []
    },
    {
      id: 'planning-food-4',
      jour: 'Samedi',
      titre: 'Service continu après les finales',
      heure: '18:30',
      lieu: 'Stand La Pause des Champions',
      joueurs: []
    }
  ]
}
