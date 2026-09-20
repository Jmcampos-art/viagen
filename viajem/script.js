/// ✅ DEPOIS (correto - detecta automaticamente)
const API_URL = 'https://viagen.onrender.com';
/* ------------------------------------------------------------
   BASE DE DADOS DE DESTINOS (28 destinos)
   ------------------------------------------------------------ */
const destinations = [
  { id: 1, name: "Rio de Janeiro", country: "Brasil", region: "Sudeste", climate: "tropical", climateLabel: "Tropical / Quente", bestMonths: [12,1,2,3], pricing: { flight: 1200, hotelPerNight: 350, tours: 400 }, currency: "R$", attractions: ["Cristo Redentor", "Pão de Açúcar", "Copacabana", "Maracanã", "Escadaria Selarón"], image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1470&auto=format&fit=crop", description: "Praias icônicas, montanhas e energia contagiante.", rating: 9.4, idealDays: 4, tips: "Leve protetor solar.", activities: [
    { day: 1, title: "Chegada + Copacabana", desc: "Check-in e praia." },
    { day: 2, title: "Cristo + Santa Teresa", desc: "Corcovado e bondinho." },
    { day: 3, title: "Pão de Açúcar", desc: "Bondinho e Urca." },
    { day: 4, title: "Maracanã + Lapa", desc: "Estádio e samba." }
  ]},
  { id: 2, name: "Gramado", country: "Brasil", region: "Sul", climate: "frio", climateLabel: "Frio / Europeu", bestMonths: [6,7,8], pricing: { flight: 1400, hotelPerNight: 480, tours: 350 }, currency: "R$", attractions: ["Lago Negro", "Rua Coberta", "Snowland", "Mini Mundo", "Catedral de Pedra"], image: "https://images.unsplash.com/photo-1596489772924-6d6d6f9c2e1b?q=80&w=1470&auto=format&fit=crop", description: "Clima europeu e chocolate quente.", rating: 9.1, idealDays: 3, tips: "Leve casaco pesado.", activities: [
    { day: 1, title: "Lago Negro", desc: "Pedalinho e chocolate." },
    { day: 2, title: "Snowland", desc: "Neve artificial." },
    { day: 3, title: "Mini Mundo", desc: "Miniaturas e centro." }
  ]},
  { id: 3, name: "Salvador", country: "Brasil", region: "Nordeste", climate: "tropical", climateLabel: "Tropical / Quente", bestMonths: [1,2,3,9,10], pricing: { flight: 1100, hotelPerNight: 280, tours: 300 }, currency: "R$", attractions: ["Pelourinho", "Elevador Lacerda", "Farol da Barra", "Mercado Modelo"], image: "https://images.unsplash.com/photo-1583536190222-8d9d1f4b4e5e?q=80&w=1470&auto=format&fit=crop", description: "Cultura afro-brasileira.", rating: 8.9, idealDays: 4, tips: "Prove o acarajé.", activities: [
    { day: 1, title: "Pelourinho", desc: "Centro histórico." },
    { day: 2, title: "Farol da Barra", desc: "Praias e museu." },
    { day: 3, title: "Bonfim", desc: "Fita e Ribeira." },
    { day: 4, title: "Mercado Modelo", desc: "Artesanato." }
  ]},
  { id: 4, name: "Lisboa", country: "Portugal", region: "Europa", climate: "ameno", climateLabel: "Ameno / Mediterrâneo", bestMonths: [3,4,5,9,10], pricing: { flight: 3200, hotelPerNight: 420, tours: 500 }, currency: "R$", attractions: ["Torre de Belém", "Mosteiro dos Jerónimos", "Alfama", "Sintra"], image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1470&auto=format&fit=crop", description: "História e pastéis de nata.", rating: 9.5, idealDays: 5, tips: "Compre o Lisboa Card.", activities: [
    { day: 1, title: "Baixa", desc: "Praça do Comércio." },
    { day: 2, title: "Belém", desc: "Torre e pastéis." },
    { day: 3, title: "Alfama", desc: "Castelo São Jorge." },
    { day: 4, title: "Sintra", desc: "Palácio da Pena." },
    { day: 5, title: "Chiado", desc: "Time Out Market." }
  ]},
  { id: 5, name: "Bariloche", country: "Argentina", region: "Patagônia", climate: "frio", climateLabel: "Frio / Neve", bestMonths: [6,7,8], pricing: { flight: 2400, hotelPerNight: 380, tours: 600 }, currency: "R$", attractions: ["Cerro Catedral", "Circuito Chico", "Lago Nahuel Huapi"], image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=1470&auto=format&fit=crop", description: "Neve e lagos na Patagônia.", rating: 9.3, idealDays: 5, tips: "Alugue equipamento.", activities: [
    { day: 1, title: "Centro Cívico", desc: "Chocolate quente." },
    { day: 2, title: "Cerro Catedral", desc: "Esqui." },
    { day: 3, title: "Circuito Chico", desc: "Lagos." },
    { day: 4, title: "Villa La Angostura", desc: "Bate-volta." },
    { day: 5, title: "Refúgio Frey", desc: "Trilha." }
  ]},
  { id: 6, name: "Cairo", country: "Egito", region: "África", climate: "seco", climateLabel: "Seco / Desértico", bestMonths: [10,11,2,3,4], pricing: { flight: 4200, hotelPerNight: 300, tours: 700 }, currency: "R$", attractions: ["Pirâmides de Gizé", "Museu Egípcio", "Rio Nilo"], image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=1470&auto=format&fit=crop", description: "História milenar.", rating: 9.0, idealDays: 4, tips: "Respeite a cultura.", activities: [
    { day: 1, title: "Rio Nilo", desc: "Cruzeiro." },
    { day: 2, title: "Pirâmides", desc: "Gizé." },
    { day: 3, title: "Museu", desc: "Tutankhamon." },
    { day: 4, title: "Vale dos Reis", desc: "Luxor." }
  ]},
  { id: 7, name: "Ushuaia", country: "Argentina", region: "Patagônia", climate: "frio", climateLabel: "Frio / Subpolar", bestMonths: [11,12,1,2,3], pricing: { flight: 3100, hotelPerNight: 450, tours: 800 }, currency: "R$", attractions: ["Canal Beagle", "Parque Nacional", "Trem do Fim do Mundo"], image: "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?q=80&w=1470&auto=format&fit=crop", description: "Fim do mundo.", rating: 9.2, idealDays: 3, tips: "Reserve o Trem.", activities: [
    { day: 1, title: "Centro", desc: "Presídio." },
    { day: 2, title: "Parque Nacional", desc: "Trem." },
    { day: 3, title: "Canal Beagle", desc: "Navegação." }
  ]},
  { id: 8, name: "Fortaleza", country: "Brasil", region: "Nordeste", climate: "calor", climateLabel: "Quente / Tropical", bestMonths: [8,9,10,11], pricing: { flight: 1100, hotelPerNight: 250, tours: 300 }, currency: "R$", attractions: ["Praia do Futuro", "Beach Park", "Dragão do Mar"], image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1470&auto=format&fit=crop", description: "Dunas e praias mornas.", rating: 8.7, idealDays: 4, tips: "Vá ao Beach Park em dia de semana.", activities: [
    { day: 1, title: "Praia do Futuro", desc: "Barracas." },
    { day: 2, title: "Beach Park", desc: "Aquático." },
    { day: 3, title: "Dragão do Mar", desc: "Cultura." },
    { day: 4, title: "Canoa Quebrada", desc: "Falésias." }
  ]},
  { id: 9, name: "Paris", country: "França", region: "Europa", climate: "ameno", climateLabel: "Ameno / Continental", bestMonths: [4,5,6,9,10], pricing: { flight: 4500, hotelPerNight: 650, tours: 700 }, currency: "R$", attractions: ["Torre Eiffel", "Louvre", "Montmartre"], image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1470&auto=format&fit=crop", description: "Romance e arte.", rating: 9.6, idealDays: 6, tips: "Compre ingressos online.", activities: [
    { day: 1, title: "Torre Eiffel", desc: "Trocadéro." },
    { day: 2, title: "Louvre", desc: "Mona Lisa." },
    { day: 3, title: "Champs-Élysées", desc: "Compras." },
    { day: 4, title: "Montmartre", desc: "Sacré-Cœur." },
    { day: 5, title: "Versalhes", desc: "Palácio." },
    { day: 6, title: "Marais", desc: "Notre-Dame." }
  ]},
  { id: 10, name: "Tóquio", country: "Japão", region: "Ásia", climate: "ameno", climateLabel: "Ameno / Temperado", bestMonths: [3,4,10,11], pricing: { flight: 5200, hotelPerNight: 550, tours: 800 }, currency: "R$", attractions: ["Shibuya", "Senso-ji", "Monte Fuji"], image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1470&auto=format&fit=crop", description: "Tecnologia e tradição.", rating: 9.7, idealDays: 7, tips: "Compre o JR Pass.", activities: [
    { day: 1, title: "Shinjuku", desc: "Noite." },
    { day: 2, title: "Shibuya", desc: "Harajuku." },
    { day: 3, title: "Asakusa", desc: "Skytree." },
    { day: 4, title: "Akihabara", desc: "Otaku." },
    { day: 5, title: "Monte Fuji", desc: "Bate-volta." },
    { day: 6, title: "Ueno", desc: "Museus." },
    { day: 7, title: "Odaiba", desc: "Sushi." }
  ]},
  { id: 11, name: "Cancún", country: "México", region: "Caribe", climate: "calor", climateLabel: "Quente / Caribe", bestMonths: [12,1,2,3,4], pricing: { flight: 3400, hotelPerNight: 600, tours: 500 }, currency: "R$", attractions: ["Praia Delfines", "Chichén Itzá", "Tulum"], image: "https://images.unsplash.com/photo-1510097467424-192d713fd1b4?q=80&w=1470&auto=format&fit=crop", description: "Caribe cristalino.", rating: 9.3, idealDays: 5, tips: "Protetor biodegradável.", activities: [
    { day: 1, title: "Praia Delfines", desc: "Relaxar." },
    { day: 2, title: "Chichén Itzá", desc: "Ruínas." },
    { day: 3, title: "Isla Mujeres", desc: "Snorkel." },
    { day: 4, title: "Xcaret", desc: "Parque." },
    { day: 5, title: "Tulum", desc: "Ruínas à beira-mar." }
  ]},
  { id: 12, name: "Nova York", country: "EUA", region: "América do Norte", climate: "ameno", climateLabel: "Ameno / Continental", bestMonths: [4,5,6,9,10,11], pricing: { flight: 4800, hotelPerNight: 750, tours: 600 }, currency: "R$", attractions: ["Times Square", "Central Park", "Estatua da Liberdade"], image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1470&auto=format&fit=crop", description: "A cidade que nunca dorme.", rating: 9.5, idealDays: 6, tips: "MetroCard ilimitado.", activities: [
    { day: 1, title: "Times Square", desc: "Broadway." },
    { day: 2, title: "Liberdade", desc: "Wall St." },
    { day: 3, title: "Central Park", desc: "MET." },
    { day: 4, title: "Brooklyn", desc: "Ponte." },
    { day: 5, title: "MoMA", desc: "5th Ave." },
    { day: 6, title: "Empire State", desc: "SoHo." }
  ]},
  { id: 13, name: "Santorini", country: "Grécia", region: "Europa", climate: "ameno", climateLabel: "Ameno / Mediterrâneo", bestMonths: [5,6,9,10], pricing: { flight: 4200, hotelPerNight: 800, tours: 600 }, currency: "R$", attractions: ["Oia", "Fira", "Caldeira"], image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1470&auto=format&fit=crop", description: "Pôr do sol famoso.", rating: 9.6, idealDays: 4, tips: "Chegue cedo em Oia.", activities: [
    { day: 1, title: "Fira", desc: "Caldeira." },
    { day: 2, title: "Oia", desc: "Pôr do sol." },
    { day: 3, title: "Praia Vermelha", desc: "Akrotiri." },
    { day: 4, title: "Barco", desc: "Navegação." }
  ]},
  { id: 14, name: "Cusco", country: "Peru", region: "América do Sul", climate: "ameno", climateLabel: "Ameno / Andino", bestMonths: [5,6,7,8,9], pricing: { flight: 2600, hotelPerNight: 320, tours: 700 }, currency: "R$", attractions: ["Machu Picchu", "Vale Sagrado"], image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1470&auto=format&fit=crop", description: "História inca.", rating: 9.7, idealDays: 5, tips: "Aclimatize antes.", activities: [
    { day: 1, title: "Plaza de Armas", desc: "Aclimatação." },
    { day: 2, title: "Vale Sagrado", desc: "Pisac." },
    { day: 3, title: "Machu Picchu", desc: "Trem." },
    { day: 4, title: "Sacsayhuamán", desc: "Ruínas." },
    { day: 5, title: "San Pedro", desc: "Mercado." }
  ]},
  { id: 15, name: "Dubai", country: "Emirados Árabes", region: "Oriente Médio", climate: "seco", climateLabel: "Seco / Desértico", bestMonths: [11,12,1,2,3], pricing: { flight: 4600, hotelPerNight: 700, tours: 600 }, currency: "R$", attractions: ["Burj Khalifa", "Palm Jumeirah", "Deserto Safari"], image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1470&auto=format&fit=crop", description: "Luxo e arranha-céus.", rating: 9.2, idealDays: 4, tips: "Respeite costumes locais.", activities: [
    { day: 1, title: "Burj Khalifa", desc: "Dubai Mall." },
    { day: 2, title: "Deserto Safari", desc: "Dunas." },
    { day: 3, title: "Palm Jumeirah", desc: "Marina." },
    { day: 4, title: "Museu do Futuro", desc: "Souks." }
  ]},
  { id: 16, name: "Reykjavik", country: "Islândia", region: "Europa", climate: "frio", climateLabel: "Frio / Subártico", bestMonths: [6,7,8,12,1,2], pricing: { flight: 5100, hotelPerNight: 680, tours: 900 }, currency: "R$", attractions: ["Aurora Boreal", "Blue Lagoon", "Golden Circle"], image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?q=80&w=1470&auto=format&fit=crop", description: "Aurora e gêiseres.", rating: 9.4, idealDays: 5, tips: "Alugue carro 4x4.", activities: [
    { day: 1, title: "Reykjavik", desc: "Hallgrímskirkja." },
    { day: 2, title: "Golden Circle", desc: "Geysir." },
    { day: 3, title: "Blue Lagoon", desc: "Termas." },
    { day: 4, title: "Costa Sul", desc: "Cachoeiras." },
    { day: 5, title: "Aurora", desc: "Tour noturno." }
  ]},
  { id: 17, name: "Bali", country: "Indonésia", region: "Ásia", climate: "tropical", climateLabel: "Tropical / Úmido", bestMonths: [4,5,6,7,8,9], pricing: { flight: 5000, hotelPerNight: 280, tours: 400 }, currency: "R$", attractions: ["Tanah Lot", "Ubud", "Uluwatu"], image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1470&auto=format&fit=crop", description: "Praias e templos.", rating: 9.5, idealDays: 6, tips: "Alugue scooter.", activities: [
    { day: 1, title: "Seminyak", desc: "Beach clubs." },
    { day: 2, title: "Ubud", desc: "Arrozales." },
    { day: 3, title: "Tanah Lot", desc: "Templo." },
    { day: 4, title: "Uluwatu", desc: "Dança Kecak." },
    { day: 5, title: "Nusa Penida", desc: "Bate-volta." },
    { day: 6, title: "SPA", desc: "Yoga." }
  ]},
  { id: 18, name: "Cidade do Cabo", country: "África do Sul", region: "África", climate: "ameno", climateLabel: "Ameno / Mediterrâneo", bestMonths: [11,12,1,2,3], pricing: { flight: 4400, hotelPerNight: 400, tours: 600 }, currency: "R$", attractions: ["Table Mountain", "Cabo da Boa Esperança", "Boulders Beach"], image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1470&auto=format&fit=crop", description: "Montanhas e pinguins.", rating: 9.3, idealDays: 5, tips: "Alugue carro para vinhos.", activities: [
    { day: 1, title: "V&A Waterfront", desc: "Porto." },
    { day: 2, title: "Table Mountain", desc: "Teleférico." },
    { day: 3, title: "Cabo", desc: "Península." },
    { day: 4, title: "Vinhos", desc: "Stellenbosch." },
    { day: 5, title: "Robben Island", desc: "Histórico." }
  ]},
  { id: 19, name: "Marrakech", country: "Marrocos", region: "África", climate: "seco", climateLabel: "Seco / Semiárido", bestMonths: [3,4,5,10,11], pricing: { flight: 3800, hotelPerNight: 350, tours: 500 }, currency: "R$", attractions: ["Jemaa el-Fnaa", "Majorelle", "Medina"], image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1470&auto=format&fit=crop", description: "Souks coloridos.", rating: 9.1, idealDays: 4, tips: "Peça desconto nos souks.", activities: [
    { day: 1, title: "Medina", desc: "Jemaa el-Fnaa." },
    { day: 2, title: "Majorelle", desc: "Palácio Bahia." },
    { day: 3, title: "Agafay", desc: "Deserto." },
    { day: 4, title: "Hammam", desc: "SPA." }
  ]},
  { id: 20, name: "Sydney", country: "Austrália", region: "Oceania", climate: "ameno", climateLabel: "Ameno / Oceânico", bestMonths: [10,11,12,1,2,3], pricing: { flight: 6200, hotelPerNight: 700, tours: 800 }, currency: "R$", attractions: ["Opera House", "Harbour Bridge", "Bondi Beach"], image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1470&auto=format&fit=crop", description: "Praias urbanas.", rating: 9.4, idealDays: 6, tips: "Use o Opal Card.", activities: [
    { day: 1, title: "Opera House", desc: "Circular Quay." },
    { day: 2, title: "Harbour Bridge", desc: "The Rocks." },
    { day: 3, title: "Bondi", desc: "Coastal walk." },
    { day: 4, title: "Taronga Zoo", desc: "Manly." },
    { day: 5, title: "Blue Mountains", desc: "Bate-volta." },
    { day: 6, title: "Darling Harbour", desc: "Aquário." }
  ]},
  { id: 21, name: "Roma", country: "Itália", region: "Europa", climate: "ameno", climateLabel: "Ameno / Mediterrâneo", bestMonths: [4,5,6,9,10], pricing: { flight: 4300, hotelPerNight: 550, tours: 650 }, currency: "R$", attractions: ["Coliseu", "Vaticano", "Fontana di Trevi", "Pantheon", "Fórum Romano"], image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1470&auto=format&fit=crop", description: "A cidade eterna.", rating: 9.5, idealDays: 5, tips: "Compre ingressos com antecedência.", activities: [
    { day: 1, title: "Coliseu", desc: "Fórum e Palatino." },
    { day: 2, title: "Vaticano", desc: "Basílica e Museus." },
    { day: 3, title: "Centro Histórico", desc: "Pantheon e Trevi." },
    { day: 4, title: "Trastevere", desc: "Gastronomia." },
    { day: 5, title: "Villa Borghese", desc: "Galeria e jardins." }
  ]},
  { id: 22, name: "Barcelona", country: "Espanha", region: "Europa", climate: "ameno", climateLabel: "Ameno / Mediterrâneo", bestMonths: [4,5,6,9,10], pricing: { flight: 4100, hotelPerNight: 520, tours: 600 }, currency: "R$", attractions: ["Sagrada Família", "Park Güell", "La Rambla", "Casa Batlló"], image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1470&auto=format&fit=crop", description: "Arte e praias.", rating: 9.4, idealDays: 4, tips: "Compre ingressos online.", activities: [
    { day: 1, title: "Sagrada Família", desc: "Gaudí." },
    { day: 2, title: "Park Güell", desc: "Vista panorâmica." },
    { day: 3, title: "Gótico", desc: "Catedral e Rambla." },
    { day: 4, title: "Barceloneta", desc: "Praia e tapas." }
  ]},
  { id: 23, name: "Amsterdã", country: "Holanda", region: "Europa", climate: "ameno", climateLabel: "Ameno / Oceânico", bestMonths: [4,5,6,9], pricing: { flight: 4400, hotelPerNight: 600, tours: 550 }, currency: "R$", attractions: ["Rijksmuseum", "Van Gogh", "Canais", "Anne Frank"], image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1470&auto=format&fit=crop", description: "Canais e bicicletas.", rating: 9.3, idealDays: 4, tips: "Alugue bicicleta.", activities: [
    { day: 1, title: "Canais", desc: "Cruzeiro." },
    { day: 2, title: "Museus", desc: "Van Gogh e Rijks." },
    { day: 3, title: "Anne Frank", desc: "Casa e Jordaan." },
    { day: 4, title: "Keukenhof", desc: "Tulipas." }
  ]},
  { id: 24, name: "Berlim", country: "Alemanha", region: "Europa", climate: "ameno", climateLabel: "Ameno / Continental", bestMonths: [5,6,7,8,9], pricing: { flight: 4200, hotelPerNight: 480, tours: 500 }, currency: "R$", attractions: ["Muro de Berlim", "Portão de Brandemburgo", "Museu de Pergamon"], image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=1470&auto=format&fit=crop", description: "História e cultura.", rating: 9.2, idealDays: 4, tips: "Ande de metrô.", activities: [
    { day: 1, title: "Portão", desc: "Reichstag." },
    { day: 2, title: "Muro", desc: "East Side Gallery." },
    { day: 3, title: "Museus", desc: "Ilha dos Museus." },
    { day: 4, title: "Kreuzberg", desc: "Street art." }
  ]},
  { id: 25, name: "Buenos Aires", country: "Argentina", region: "América do Sul", climate: "ameno", climateLabel: "Ameno / Temperado", bestMonths: [3,4,5,9,10,11], pricing: { flight: 1800, hotelPerNight: 300, tours: 350 }, currency: "R$", attractions: ["Caminito", "Teatro Colón", "Recoleta", "San Telmo"], image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=1470&auto=format&fit=crop", description: "Tango e steak.", rating: 9.0, idealDays: 4, tips: "Prove o assado.", activities: [
    { day: 1, title: "Caminito", desc: "La Boca." },
    { day: 2, title: "Recoleta", desc: "Cemitério e feira." },
    { day: 3, title: "San Telmo", desc: "Antiguidades." },
    { day: 4, title: "Palermo", desc: "Bares e tango." }
  ]},
  { id: 26, name: "Santiago", country: "Chile", region: "América do Sul", climate: "ameno", climateLabel: "Ameno / Andino", bestMonths: [3,4,5,9,10,11], pricing: { flight: 2200, hotelPerNight: 350, tours: 400 }, currency: "R$", attractions: ["Cerro San Cristóbal", "Valparaíso", "Vinícolas"], image: "https://images.unsplash.com/photo-1518659526054-190340b32735?q=80&w=1470&auto=format&fit=crop", description: "Andes e vinhos.", rating: 8.9, idealDays: 4, tips: "Visite vinícolas.", activities: [
    { day: 1, title: "Centro", desc: "Plaza de Armas." },
    { day: 2, title: "San Cristóbal", desc: "Teleférico." },
    { day: 3, title: "Valparaíso", desc: "Cores e mar." },
    { day: 4, title: "Vinícolas", desc: "Degustação." }
  ]},
  { id: 27, name: "Cartagena", country: "Colômbia", region: "Caribe", climate: "calor", climateLabel: "Quente / Caribe", bestMonths: [12,1,2,3,4], pricing: { flight: 2800, hotelPerNight: 400, tours: 450 }, currency: "R$", attractions: ["Cidade Murada", "Castelo San Felipe", "Ilhas del Rosario"], image: "https://images.unsplash.com/photo-1583531352913-0f2e1e0c0c1e?q=80&w=1470&auto=format&fit=crop", description: "Caribe colonial.", rating: 9.2, idealDays: 4, tips: "Leve protetor solar.", activities: [
    { day: 1, title: "Cidade Murada", desc: "Centro histórico." },
    { day: 2, title: "Castelo", desc: "San Felipe." },
    { day: 3, title: "Ilhas", desc: "Barco e snorkel." },
    { day: 4, title: "Getsemaní", desc: "Arte e bares." }
  ]},
  { id: 28, name: "Medellín", country: "Colômbia", region: "América do Sul", climate: "ameno", climateLabel: "Ameno / Tropical", bestMonths: [12,1,2,3,7,8], pricing: { flight: 2600, hotelPerNight: 320, tours: 400 }, currency: "R$", attractions: ["Comuna 13", "Metrocable", "Jardim Botânico"], image: "https://images.unsplash.com/photo-1597238307393-4c1c0e6c1e1e?q=80&w=1470&auto=format&fit=crop", description: "Cidade da eterna primavera.", rating: 9.1, idealDays: 4, tips: "Use o metrô.", activities: [
    { day: 1, title: "Comuna 13", desc: "Grafite e história." },
    { day: 2, title: "Metrocable", desc: "Vista da cidade." },
    { day: 3, title: "Botânico", desc: "Jardins." },
    { day: 4, title: "Guatapé", desc: "Pedra e lago." }
  ]}
];

/* ------------------------------------------------------------
   CACHE DE DESTINOS BUSCADOS POR IA
   ------------------------------------------------------------ */
const aiCache = new Map(); // cache para não buscar 2x o mesmo

/* ------------------------------------------------------------
   BASE DE DADOS DE COMPANHIAS AÉREAS
   ------------------------------------------------------------ */
const airlines = [
  { code: "LA", name: "LATAM Airlines", logo: "LA", color: "#1c2c5b", rating: 8.4, perks: ["Bagagem 23kg", "Wi-Fi"], url: "https://www.latamairlines.com/br/pt" },
  { code: "G3", name: "Gol Linhas Aéreas", logo: "G3", color: "#ff6b00", rating: 8.0, perks: ["Bagagem 23kg", "Lanches"], url: "https://www.voegol.com.br/" },
  { code: "AD", name: "Azul Linhas Aéreas", logo: "AD", color: "#0055a4", rating: 8.6, perks: ["TV ao vivo", "Bagagem 23kg"], url: "https://www.voeazul.com.br/" },
  { code: "AA", name: "American Airlines", logo: "AA", color: "#0c3b6b", rating: 8.2, perks: ["Bagagem 23kg", "Entretenimento"], url: "https://www.aa.com/" },
  { code: "TP", name: "TAP Air Portugal", logo: "TP", color: "#00804d", rating: 8.3, perks: ["Bagagem 23kg", "Refeição"], url: "https://www.flytap.com/" },
  { code: "IB", name: "Iberia", logo: "IB", color: "#d42027", rating: 8.1, perks: ["Bagagem 23kg", "Refeição"], url: "https://www.iberia.com/" },
  { code: "AF", name: "Air France", logo: "AF", color: "#002157", rating: 8.5, perks: ["Bagagem 23kg", "Champagne"], url: "https://www.airfrance.com.br/" },
  { code: "KL", name: "KLM", logo: "KL", color: "#00a1de", rating: 8.5, perks: ["Bagagem 23kg", "Entretenimento"], url: "https://www.klm.com.br/" },
  { code: "EK", name: "Emirates", logo: "EK", color: "#d71920", rating: 9.0, perks: ["Bagagem 30kg", "ICE TV"], url: "https://www.emirates.com/br/" },
  { code: "QR", name: "Qatar Airways", logo: "QR", color: "#5c0632", rating: 9.1, perks: ["Bagagem 30kg", "Qsuite"], url: "https://www.qatarairways.com/pt-br/" },
  { code: "TK", name: "Turkish Airlines", logo: "TK", color: "#c8102e", rating: 8.8, perks: ["Bagagem 30kg", "Chef a bordo"], url: "https://www.turkishairlines.com/pt-br/" },
  { code: "AV", name: "Avianca", logo: "AV", color: "#e30613", rating: 7.9, perks: ["Bagagem 23kg", "Lanches"], url: "https://www.avianca.com/br/" },
  { code: "UA", name: "United Airlines", logo: "UA", color: "#0033a0", rating: 8.0, perks: ["Bagagem 23kg", "Wi-Fi"], url: "https://www.united.com/pt/br/" },
  { code: "DL", name: "Delta Airlines", logo: "DL", color: "#003366", rating: 8.3, perks: ["Bagagem 23kg", "Entretenimento"], url: "https://www.delta.com/br/pt/" },
  { code: "LH", name: "Lufthansa", logo: "LH", color: "#05164d", rating: 8.6, perks: ["Bagagem 23kg", "Refeição"], url: "https://www.lufthansa.com/br/pt/" },
  { code: "BA", name: "British Airways", logo: "BA", color: "#075aaa", rating: 8.2, perks: ["Bagagem 23kg", "Refeição"], url: "https://www.britishairways.com/pt-br/" },
  { code: "AC", name: "Air Canada", logo: "AC", color: "#f01428", rating: 8.1, perks: ["Bagagem 23kg", "Entretenimento"], url: "https://www.aircanada.com/br/pt/" },
  { code: "AM", name: "Aeromexico", logo: "AM", color: "#0b2343", rating: 7.8, perks: ["Bagagem 23kg", "Lanches"], url: "https://www.aeromexico.com/br/pt/" },
  { code: "CM", name: "Copa Airlines", logo: "CM", color: "#003da5", rating: 8.4, perks: ["Bagagem 23kg", "Refeição"], url: "https://www.copaair.com/pt-br/" },
  { code: "ET", name: "Ethiopian Airlines", logo: "ET", color: "#6c8c1e", rating: 8.0, perks: ["Bagagem 30kg", "Refeição"], url: "https://www.ethiopianairlines.com/br/" },
  { code: "SQ", name: "Singapore Airlines", logo: "SQ", color: "#f9a01b", rating: 9.2, perks: ["Bagagem 30kg", "Excelente serviço"], url: "https://www.singaporeair.com/pt_BR/" },
  { code: "CX", name: "Cathay Pacific", logo: "CX", color: "#006564", rating: 8.8, perks: ["Bagagem 30kg", "Entretenimento"], url: "https://www.cathaypacific.com/br/pt/" }
];

/* ------------------------------------------------------------
   BASE DE DADOS DE HOTÉIS
   ------------------------------------------------------------ */
const hotelChains = [
  { name: "Booking.com", logo: "B.", color: "#003580", rating: 8.5, type: "Reserva", urlTemplate: "https://www.booking.com/searchresults.pt-br.html?ss={dest}&checkin={checkin}&checkout={checkout}&group_adults=2" },
  { name: "Trivago", logo: "T", color: "#ff6f00", rating: 8.3, type: "Comparador", urlTemplate: "https://www.trivago.com.br/pt-BR/srl?query={dest}" },
  { name: "Airbnb", logo: "A", color: "#ff5a5f", rating: 8.7, type: "Casa", urlTemplate: "https://www.airbnb.com.br/s/{dest}/homes?checkin={checkin}&checkout={checkout}&adults=2" },
  { name: "Hilton Hotels", logo: "H", color: "#00205b", rating: 8.9, type: "Luxo", urlTemplate: "https://www.hilton.com/en/search/?q={dest}" },
  { name: "Marriott", logo: "M", color: "#a11e2a", rating: 8.8, type: "Luxo", urlTemplate: "https://www.marriott.com/search/findHotels.mi?destinationAddress={dest}" },
  { name: "Accor (Ibis)", logo: "A", color: "#001e5f", rating: 8.0, type: "Econômico", urlTemplate: "https://all.accor.com/ssr/app/ibis/rates/offer/index.pt-br.shtml?destination={dest}" },
  { name: "Decolar", logo: "D", color: "#ff6b00", rating: 8.2, type: "Agência", urlTemplate: "https://www.decolar.com/hoteis/" },
  { name: "Expedia", logo: "E", color: "#00355f", rating: 8.4, type: "Agência", urlTemplate: "https://www.expedia.com.br/Hoteis" },
  { name: "Hostelworld", logo: "H", color: "#f26722", rating: 8.1, type: "Hostel", urlTemplate: "https://www.hostelworld.com/s?q={dest}" },
  { name: "Agoda", logo: "A", color: "#5c2d91", rating: 8.3, type: "Reserva", urlTemplate: "https://www.agoda.com/pt-br/search?city={dest}" },
  { name: "Hotels.com", logo: "H", color: "#d32f2f", rating: 8.2, type: "Reserva", urlTemplate: "https://www.hotels.com/Hotel-Search?destination={dest}" },
  { name: "Kayak", logo: "K", color: "#ff690f", rating: 8.4, type: "Comparador", urlTemplate: "https://www.kayak.com.br/hotels/{dest}" }
];

/* ------------------------------------------------------------
   UTILITÁRIOS
   ------------------------------------------------------------ */
function getMonthName(m) {
  const months = ["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  return months[m] || "";
}

function getClimateIcon(c) {
  return { calor:"fa-fire", frio:"fa-snowflake", ameno:"fa-cloud-sun", tropical:"fa-umbrella-beach", seco:"fa-mountain" }[c] || "fa-sun";
}

function calculateTotal(pricing, nights) {
  return pricing.flight + (pricing.hotelPerNight * nights) + pricing.tours;
}

function calculateHotelTotal(pricing, nights) {
  return pricing.hotelPerNight * nights;
}

function getAirlineByCountry(country) {
  const map = {
    "Brasil": ["LA", "G3", "AD"],
    "Portugal": ["TP", "LA", "IB"],
    "Argentina": ["LA", "G3", "AV"],
    "Egito": ["EK", "QR", "TK"],
    "França": ["AF", "KL", "TP"],
    "Japão": ["EK", "QR", "TK"],
    "México": ["AA", "LA", "AV"],
    "EUA": ["AA", "LA", "EK"],
    "Grécia": ["TP", "AF", "KL"],
    "Peru": ["LA", "AV", "AA"],
    "Emirados Árabes": ["EK", "QR", "TK"],
    "Islândia": ["KL", "AF", "TP"],
    "Indonésia": ["EK", "QR", "TK"],
    "África do Sul": ["EK", "QR", "KL"],
    "Marrocos": ["IB", "AF", "TK"],
    "Austrália": ["EK", "QR", "AA"],
    "Itália": ["TP", "AF", "LH"],
    "Espanha": ["IB", "TP", "AF"],
    "Holanda": ["KL", "AF", "TP"],
    "Alemanha": ["LH", "AF", "KL"],
    "Chile": ["LA", "AV", "AA"],
    "Colômbia": ["AV", "LA", "CM"]
  };
  const codes = map[country] || ["LA", "AA", "EK"];
  return codes.map(c => airlines.find(a => a.code === c)).filter(Boolean);
}

function getBookingDates(nights = 3) {
  const checkin = new Date();
  checkin.setMonth(checkin.getMonth() + 1);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + nights);
  return {
    checkin: checkin.toISOString().split('T')[0],
    checkout: checkout.toISOString().split('T')[0]
  };
}

function generateBookingUrl(offer, dest) {
  const nights = dest?.idealDays || 3;
  const dates = getBookingDates(nights);
  const destQuery = encodeURIComponent(`${dest?.name || ''}, ${dest?.country || ''}`);

  if (offer.type === 'flight') {
    if (offer.airline?.url) return offer.airline.url;
    return `https://www.google.com/travel/flights?q=voos+para+${destQuery}`;
  }

  if (offer.type === 'hotel') {
    if (offer.chain?.urlTemplate) {
      return offer.chain.urlTemplate
        .replace('{dest}', destQuery)
        .replace('{checkin}', dates.checkin)
        .replace('{checkout}', dates.checkout);
    }
    return `https://www.booking.com/searchresults.pt-br.html?ss=${destQuery}`;
  }

  if (offer.type === 'package') {
    const packageUrls = {
      "Booking": `https://www.booking.com/`,
      "Trivago": `https://www.trivago.com.br/`,
      "Decolar": `https://www.decolar.com/pacotes/`,
      "Expedia": `https://www.expedia.com.br/Pacotes`
    };
    return packageUrls[offer.chain?.name] || `https://www.decolar.com/pacotes/`;
  }

  return '#';
}

/* ------------------------------------------------------------
   NAVEGAÇÃO
   ------------------------------------------------------------ */
function showScreen(screenId) {
  document.querySelectorAll('.fullscreen-results').forEach(s => s.classList.remove('active'));
  if (screenId) {
    document.getElementById(screenId).classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

/* ------------------------------------------------------------
   BUSCA INTELIGENTE COM IA
   ------------------------------------------------------------ */
async function searchWithAI(query) {
  // Normaliza query
  const normalized = query.trim().toLowerCase();
  
  // Verifica cache
  if (aiCache.has(normalized)) {
    return aiCache.get(normalized);
  }

  // Chama API
  const response = await fetch(`${API_URL}/api/search-destination`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      month: document.getElementById('monthSelect')?.value || '',
      climate: document.getElementById('climateSelect')?.value || '',
      budget: document.getElementById('budgetSelect')?.value || ''
    })
  });

  if (!response.ok) {
    throw new Error('Falha ao buscar destino');
  }

  const data = await response.json();
  
  // Valida campos obrigatórios
  if (!data.name || !data.country) {
    throw new Error('Resposta inválida da IA');
  }

  // Garante campos padrão
  const destination = {
    id: data.id || Date.now(),
    name: data.name,
    country: data.country,
    region: data.region || 'Mundo',
    climate: ['calor', 'frio', 'ameno', 'tropical', 'seco'].includes(data.climate) ? data.climate : 'ameno',
    climateLabel: data.climateLabel || 'Ameno',
    bestMonths: data.bestMonths || [1,2,3,4,5,6,7,8,9,10,11,12],
    pricing: {
      flight: data.pricing?.flight || 3500,
      hotelPerNight: data.pricing?.hotelPerNight || 400,
      tours: data.pricing?.tours || 500
    },
    currency: 'R$',
    attractions: data.attractions || [],
    image: data.image || `https://source.unsplash.com/featured/?${encodeURIComponent(data.name)},travel`,
    description: data.description || '',
    rating: data.rating || 9.0,
    idealDays: data.idealDays || 4,
    tips: data.tips || '',
    activities: data.activities || [],
    fromAI: true // marca que veio da IA
  };

  // Adiciona ao cache e à base local (para uso futuro)
  aiCache.set(normalized, destination);
  if (!destinations.find(d => d.name.toLowerCase() === destination.name.toLowerCase())) {
    destinations.push(destination);
  }

  return destination;
}

/* ------------------------------------------------------------
   BUSCA MANUAL (com fallback para IA)
   ------------------------------------------------------------ */
async function filterDestinations() {
  const month = document.getElementById('monthSelect').value;
  const climate = document.getElementById('climateSelect').value;
  const destinationText = document.getElementById('destinationInput').value.trim();
  const budget = document.getElementById('budgetSelect').value;

  const resultsScreen = document.getElementById('resultsScreen');
  const cardsContainer = document.getElementById('cardsContainer');
  const resultCountSpan = document.getElementById('resultCount');
  const title = document.getElementById('resultsScreenTitle');

  // MOSTRA TELA DE RESULTADOS COM LOADING
  title.innerHTML = '<i class="fas fa-search"></i> Buscando...';
  resultCountSpan.textContent = 'Buscando...';
  cardsContainer.innerHTML = `
    <div class="empty-state" style="grid-column: 1/-1;">
      <i class="fas fa-circle-notch fa-spin"></i><br>
      Buscando destinos...
    </div>
  `;
  showScreen('resultsScreen');

  // FILTRA BASE LOCAL
  let filtered = destinations.filter(dest => {
    if (month && !dest.bestMonths.includes(Number(month))) return false;
    if (climate && dest.climate !== climate) return false;
    if (destinationText) {
      const s = destinationText.toLowerCase();
      if (!dest.name.toLowerCase().includes(s) && !dest.country.toLowerCase().includes(s)) return false;
    }
    if (budget) {
      const total = calculateTotal(dest.pricing, dest.idealDays);
      if (budget === "baixo" && total > 4000) return false;
      if (budget === "medio" && (total <= 4000 || total > 8000)) return false;
      if (budget === "alto" && total <= 8000) return false;
    }
    return true;
  });

  // SE TEM TEXTO E NÃO ACHOU NADA, USA IA
  if (destinationText && filtered.length === 0) {
    try {
      title.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Buscando com IA...';
      resultCountSpan.textContent = 'IA trabalhando...';

      const aiDestination = await searchWithAI(destinationText);
      filtered = [aiDestination];

      // Mostra aviso de que veio da IA
      setTimeout(() => {
        const notice = document.createElement('div');
        notice.className = 'ai-notice';
        notice.innerHTML = `<i class="fas fa-info-circle"></i> Este destino foi encontrado pela IA em tempo real`;
        cardsContainer.parentNode.insertBefore(notice, cardsContainer);
      }, 100);
    } catch (error) {
      console.error('Erro busca IA:', error);
      cardsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <i class="fas fa-exclamation-triangle"></i><br>
          Não encontramos "${destinationText}".<br>
          <span style="font-size:0.95rem;">A IA também não conseguiu identificar. Tente outro nome.</span>
        </div>
      `;
      resultCountSpan.textContent = '0 destinos';
      title.innerHTML = '<i class="fas fa-suitcase-rolling"></i> Resultados da busca';
      return;
    }
  }

  // Ordena e renderiza
  filtered.sort((a, b) => calculateTotal(a.pricing, a.idealDays) - calculateTotal(b.pricing, b.idealDays));
  renderCards(filtered, false);
}

/* ------------------------------------------------------------
   RENDERIZAÇÃO DOS CARDS
   ------------------------------------------------------------ */
function renderCards(list, isAIPick = false) {
  const container = document.getElementById('cardsContainer');
  const resultCountSpan = document.getElementById('resultCount');
  const title = document.getElementById('resultsScreenTitle');

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-map-pin"></i><br>
        Nenhum destino encontrado.<br>
        <span style="font-size:0.95rem;">Ajuste os filtros e tente novamente.</span>
      </div>`;
    resultCountSpan.textContent = "0 destinos";
    return;
  }

  resultCountSpan.textContent = `${list.length} ${list.length === 1 ? 'destino' : 'destinos'}`;
  if (title) {
    title.innerHTML = isAIPick
      ? '<i class="fas fa-wand-magic-sparkles"></i> Escolhas da IA'
      : '<i class="fas fa-suitcase-rolling"></i> Resultados da busca';
  }

  let html = '';
  list.forEach(dest => {
    const attractionsList = dest.attractions.slice(0, 4)
      .map(a => `<li><i class="fas fa-check-circle"></i> ${a}</li>`).join('');

    const climateIcon = getClimateIcon(dest.climate);
    const nights = dest.idealDays;
    const hotelTotal = calculateHotelTotal(dest.pricing, nights);
    const total = calculateTotal(dest.pricing, nights);
    const aiBadge = dest.fromAI ? '<span class="ai-badge">✨ IA</span>' : '';

    html += `
      <div class="card">
        <div class="card-img" style="background-image: linear-gradient(0deg,#00000060,#00000020), url('${dest.image}');">
          <span class="climate-badge">
            <i class="fas ${climateIcon}"></i> ${dest.climateLabel}
          </span>
          ${aiBadge}
        </div>
        <div class="card-content">
          <div class="card-title">
            <i class="fas fa-map-pin"></i> ${dest.name}, ${dest.country}
          </div>
          <div class="details">
            <div class="detail-item">
              <i class="fas fa-calendar-check"></i>
              Melhores meses: ${dest.bestMonths.map(m => getMonthName(m)).join(', ')}
            </div>
            <div class="detail-item">
              <i class="fas fa-clock"></i> ${dest.idealDays} dias ideais
            </div>
            <div class="detail-item">
              <i class="fas fa-star"></i> ${dest.rating}/10
            </div>
          </div>

          <div class="price-breakdown">
            <div class="price-row">
              <span><i class="fas fa-plane"></i> Voo ida/volta</span>
              <strong>R$ ${dest.pricing.flight.toLocaleString('pt-BR')}</strong>
            </div>
            <div class="price-row">
              <span><i class="fas fa-hotel"></i> ${nights} noites</span>
              <strong>R$ ${hotelTotal.toLocaleString('pt-BR')}</strong>
            </div>
            <div class="price-row">
              <span><i class="fas fa-ticket"></i> Passeios</span>
              <strong>R$ ${dest.pricing.tours.toLocaleString('pt-BR')}</strong>
            </div>
            <div class="price-row total">
              <span><i class="fas fa-calculator"></i> Total</span>
              <strong>R$ ${total.toLocaleString('pt-BR')}</strong>
            </div>
          </div>

          <div class="attractions">
            <h4><i class="fas fa-binoculars"></i> Lugares para conhecer</h4>
            <ul>${attractionsList}</ul>
          </div>

          <div class="card-actions">
            <button class="details-btn" onclick="openModal(${dest.id})">
              <i class="fas fa-info-circle"></i> Detalhes
            </button>
            <button class="packages-btn" onclick="openPackages(${dest.id})">
              <i class="fas fa-tags"></i> Ver pacotes
            </button>
          </div>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

/* ------------------------------------------------------------
   PACOTES
   ------------------------------------------------------------ */
let currentDestination = null;
let currentOffers = [];

function openPackages(destId) {
  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;
  currentDestination = dest;

  const offers = generateOffers(dest);
  currentOffers = offers;

  document.getElementById('packagesDestName').textContent = `${dest.name}, ${dest.country}`;
  document.getElementById('packagesCount').textContent = `${offers.length} ofertas`;

  const nights = dest.idealDays;
  const cheapestFlight = Math.min(...offers.filter(o => o.type === 'flight').map(o => o.price));
  const cheapestHotel = Math.min(...offers.filter(o => o.type === 'hotel').map(o => o.price));
  const cheapestPackage = Math.min(...offers.filter(o => o.type === 'package').map(o => o.price));

  document.getElementById('packagesSummary').innerHTML = `
    <div class="summary-card">
      <i class="fas fa-plane"></i>
      <div class="info">
        <span class="label">Voo mais barato</span>
        <span class="value">R$ ${cheapestFlight.toLocaleString('pt-BR')}</span>
      </div>
    </div>
    <div class="summary-card">
      <i class="fas fa-hotel"></i>
      <div class="info">
        <span class="label">Hotel mais barato (${nights}n)</span>
        <span class="value">R$ ${(cheapestHotel * nights).toLocaleString('pt-BR')}</span>
      </div>
    </div>
    <div class="summary-card">
      <i class="fas fa-box-open"></i>
      <div class="info">
        <span class="label">Pacote completo</span>
        <span class="value">R$ ${cheapestPackage.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  `;

  renderOffers(offers, 'all');
  showScreen('packagesScreen');
}

function generateOffers(dest) {
  const offers = [];
  const nights = dest.idealDays;
  const airlinesList = getAirlineByCountry(dest.country);

  airlinesList.forEach((airline) => {
    const variation = 1 + (Math.random() * 0.4 - 0.1);
    const price = Math.round(dest.pricing.flight * variation);
    const oldPrice = Math.round(price * 1.25);
    const duration = Math.round(8 + Math.random() * 14);
    const stops = Math.floor(Math.random() * 3);

    offers.push({
      type: 'flight',
      airline: airline,
      name: `${airline.name} · ${dest.name}`,
      price, oldPrice, duration, stops,
      tags: [
        stops === 0 ? "Voo direto" : `${stops} ${stops === 1 ? 'parada' : 'paradas'}`,
        `${duration}h de voo`,
        airline.perks[0]
      ],
      rating: airline.rating,
      isBestPrice: false
    });
  });

  const shuffledHotels = [...hotelChains].sort(() => Math.random() - 0.5).slice(0, 8);
  shuffledHotels.forEach(hotel => {
    const variation = 0.7 + Math.random() * 0.9;
    const pricePerNight = Math.round(dest.pricing.hotelPerNight * variation);
    const oldPrice = Math.round(pricePerNight * 1.3);

    offers.push({
      type: 'hotel',
      chain: hotel,
      name: `${hotel.name} · ${dest.name}`,
      price: pricePerNight,
      oldPrice,
      nights,
      tags: [`${nights} noites`, `R$ ${pricePerNight.toLocaleString('pt-BR')}/noite`, hotel.type],
      rating: hotel.rating,
      isBestPrice: false
    });
  });

  const packageProviders = [
    { name: "Booking", color: "#003580", logo: "B." },
    { name: "Trivago", color: "#ff6f00", logo: "T" },
    { name: "Decolar", color: "#ff6b00", logo: "D" },
    { name: "Expedia", color: "#00355f", logo: "E" }
  ];

  packageProviders.forEach(provider => {
    const variation = 0.85 + Math.random() * 0.4;
    const price = Math.round(calculateTotal(dest.pricing, nights) * variation);
    const oldPrice = Math.round(price * 1.3);

    offers.push({
      type: 'package',
      chain: { name: provider.name, color: provider.color, logo: provider.logo },
      name: `Pacote ${provider.name} · ${dest.name}`,
      price, oldPrice,
      tags: ["Voo + Hotel", `${nights} noites`, "Café da manhã incluso", "Cancelamento grátis"],
      rating: (7.5 + Math.random() * 2).toFixed(1),
      isBestPrice: false
    });
  });

  ['flight', 'hotel', 'package'].forEach(type => {
    const items = offers.filter(o => o.type === type);
    if (items.length) {
      const cheapest = items.reduce((min, o) => o.price < min.price ? o : min, items[0]);
      cheapest.isBestPrice = true;
    }
  });

  return offers;
}

function renderOffers(offers, filter) {
  const container = document.getElementById('offersContainer');
  const filtered = filter === 'all' ? offers : offers.filter(o => o.type === filter);

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><br>Nenhuma oferta nesta categoria.</div>`;
    return;
  }

  filtered.sort((a, b) => a.price - b.price);

  container.innerHTML = filtered.map(offer => {
    const typeLabel = offer.type === 'flight' ? 'Voo' : offer.type === 'hotel' ? 'Hotel' : 'Pacote';
    const color = offer.airline?.color || offer.chain?.color || "#7b5cff";
    const logo = offer.airline?.logo || offer.chain?.logo || "?";
    const bookingUrl = generateBookingUrl(offer, currentDestination);

    return `
      <div class="offer-card">
        <div class="offer-logo" style="background: ${color}">${logo}</div>
        <div class="offer-info">
          <div class="offer-name">
            ${offer.name}
            ${offer.isBestPrice ? '<span class="best-price-badge">🔥 MELHOR PREÇO</span>' : ''}
          </div>
          <div class="offer-details">
            <span><i class="fas fa-tag"></i> ${typeLabel}</span>
            <span><i class="fas fa-star" style="color:#f5b400"></i> ${offer.rating}</span>
            ${offer.duration ? `<span><i class="fas fa-clock"></i> ${offer.duration}h</span>` : ''}
            ${offer.nights ? `<span><i class="fas fa-moon"></i> ${offer.nights} noites</span>` : ''}
          </div>
          <div class="offer-tags">
            ${offer.tags.map(t => `<span class="offer-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="offer-price">
          ${offer.oldPrice ? `<span class="price-old">R$ ${offer.oldPrice.toLocaleString('pt-BR')}</span>` : ''}
          <span class="price-value">R$ ${offer.price.toLocaleString('pt-BR')}</span>
          <span class="price-label">${offer.type === 'hotel' ? 'por noite' : 'por pessoa'}</span>
          <a href="${bookingUrl}" target="_blank" rel="noopener noreferrer" class="offer-buy">
            <i class="fas fa-external-link-alt"></i> Reservar
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/* ------------------------------------------------------------
   IA — ROTEIRO
   ------------------------------------------------------------ */
function aiGenerateItinerary() {
  const month = document.getElementById('monthSelect').value;
  const climate = document.getElementById('climateSelect').value;
  const destinationText = document.getElementById('destinationInput').value.trim();
  const budget = document.getElementById('budgetSelect').value;

  let pool = destinations.filter(dest => {
    if (climate && dest.climate !== climate) return false;
    if (destinationText) {
      const s = destinationText.toLowerCase();
      if (!dest.name.toLowerCase().includes(s) && !dest.country.toLowerCase().includes(s)) return false;
    }
    if (budget) {
      const total = calculateTotal(dest.pricing, dest.idealDays);
      if (budget === "baixo" && total > 4000) return false;
      if (budget === "medio" && (total <= 4000 || total > 8000)) return false;
      if (budget === "alto" && total <= 8000) return false;
    }
    return true;
  });

  if (!pool.length) pool = [...destinations];

  const scored = pool.map(dest => {
    let score = dest.rating * 10;
    score -= calculateTotal(dest.pricing, dest.idealDays) / 5000;
    score += dest.attractions.length * 2;
    if (month && dest.bestMonths.includes(Number(month))) score += 15;
    return { ...dest, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);

  const numDestinos = Math.min(5, Math.max(3, 3 + Math.floor(Math.random() * 3)));
  const chosen = [];
  const usedClimates = new Set();

  for (const dest of scored) {
    if (chosen.length >= numDestinos) break;
    if (!usedClimates.has(dest.climate)) {
      chosen.push(dest);
      usedClimates.add(dest.climate);
    }
  }
  for (const dest of scored) {
    if (chosen.length >= numDestinos) break;
    if (!chosen.find(d => d.id === dest.id)) chosen.push(dest);
  }

  const regionOrder = { "Sudeste":1, "Sul":2, "Nordeste":3, "América do Sul":4, "América do Norte":5, "Europa":6, "Ásia":7, "Oceania":8, "África":9, "Oriente Médio":10, "Caribe":11, "Patagônia":12 };
  chosen.sort((a, b) => (regionOrder[a.region] || 99) - (regionOrder[b.region] || 99));

  let totalDays = 0, totalFlight = 0, totalHotel = 0, totalTours = 0;
  chosen.forEach(d => {
    totalDays += d.idealDays;
    totalFlight += d.pricing.flight;
    totalHotel += d.pricing.hotelPerNight * d.idealDays;
    totalTours += d.pricing.tours;
  });

  const interCityFlights = chosen.length > 1
    ? Math.round(totalFlight * 0.3 * (chosen.length - 1) / chosen.length)
    : 0;
  const grandTotal = totalFlight + totalHotel + totalTours + interCityFlights;

  return { destinations: chosen, totalDays, totalFlight, totalHotel, totalTours, interCityFlights, grandTotal, month, climate, budget };
}

function renderItinerary(itinerary) {
  const summary = document.getElementById('itinerarySummary');
  const timeline = document.getElementById('itineraryTimeline');

  const monthLabel = itinerary.month ? getMonthName(Number(itinerary.month)) : "Flexível";
  const climateLabel = itinerary.climate
    ? { calor:"Quente", frio:"Frio", ameno:"Ameno", tropical:"Tropical", seco:"Seco" }[itinerary.climate]
    : "Variado";

  summary.innerHTML = `
    <div class="summary-card">
      <i class="fas fa-map-marked-alt"></i>
      <span class="label">Destinos</span>
      <span class="value">${itinerary.destinations.length}</span>
      <span class="sub">${itinerary.destinations.map(d => d.name).join(' → ')}</span>
    </div>
    <div class="summary-card">
      <i class="fas fa-clock"></i>
      <span class="label">Duração</span>
      <span class="value">${itinerary.totalDays} dias</span>
      <span class="sub">Roteiro dia a dia</span>
    </div>
    <div class="summary-card">
      <i class="fas fa-calendar-alt"></i>
      <span class="label">Época</span>
      <span class="value">${monthLabel}</span>
      <span class="sub">Clima: ${climateLabel}</span>
    </div>
    <div class="summary-card">
      <i class="fas fa-wallet"></i>
      <span class="label">Custo total</span>
      <span class="value">R$ ${itinerary.grandTotal.toLocaleString('pt-BR')}</span>
      <span class="sub">por pessoa</span>
    </div>
  `;

  let html = '';
  let cumulativeDay = 1;

  itinerary.destinations.forEach(dest => {
    const startDay = cumulativeDay;
    const endDay = cumulativeDay + dest.idealDays - 1;

    const dayPlan = dest.activities.slice(0, dest.idealDays).map(act => `
      <div class="day-block">
        <i class="fas fa-circle-dot"></i>
        <strong>Dia ${startDay + act.day - 1}:</strong> ${act.title}
        <div style="font-size:0.82rem;color:#6b7d98;margin-top:0.2rem;margin-left:1.2rem;">${act.desc}</div>
      </div>
    `).join('');

    const destTotal = dest.pricing.flight + (dest.pricing.hotelPerNight * dest.idealDays) + dest.pricing.tours;
    const destQuery = encodeURIComponent(`${dest.name}, ${dest.country}`);
    const dates = getBookingDates(dest.idealDays);
    const hotelsUrl = `https://www.booking.com/searchresults.pt-br.html?ss=${destQuery}&checkin=${dates.checkin}&checkout=${dates.checkout}&group_adults=2`;
    const flightsUrl = `https://www.google.com/travel/flights?q=voos+para+${encodeURIComponent(dest.name)}`;
    const packagesUrl = `https://www.decolar.com/pacotes/`;

    html += `
      <div class="timeline-item">
        <div class="timeline-item-img" style="background-image: linear-gradient(0deg,#00000070,#00000020), url('${dest.image}');">
          <span class="timeline-day-badge"><i class="fas fa-calendar-day"></i> Dias ${startDay}–${endDay}</span>
        </div>
        <div class="timeline-item-content">
          <div class="timeline-dest-name"><i class="fas fa-map-pin"></i> ${dest.name}, ${dest.country}</div>
          <div class="timeline-meta">
            <span><i class="fas fa-sun"></i> ${dest.climateLabel}</span>
            <span><i class="fas fa-clock"></i> ${dest.idealDays} dias</span>
            <span><i class="fas fa-star"></i> ${dest.rating}/10</span>
          </div>
          <div class="timeline-activities">
            <h5><i class="fas fa-list-check"></i> Roteiro dia a dia</h5>
            <div class="day-plan">${dayPlan}</div>
          </div>
          <div class="timeline-price">
            <span><i class="fas fa-calculator"></i> Custo deste trecho</span>
            <strong>R$ ${destTotal.toLocaleString('pt-BR')}</strong>
          </div>
          <div class="timeline-actions">
            <a href="${hotelsUrl}" target="_blank" rel="noopener noreferrer" class="timeline-btn hotels">
              <i class="fas fa-hotel"></i> Ver Hotéis
            </a>
            <a href="${flightsUrl}" target="_blank" rel="noopener noreferrer" class="timeline-btn flights">
              <i class="fas fa-plane"></i> Ver Voos
            </a>
            <a href="${packagesUrl}" target="_blank" rel="noopener noreferrer" class="timeline-btn packages">
              <i class="fas fa-box-open"></i> Pacotes
            </a>
          </div>
        </div>
      </div>
    `;
    cumulativeDay += dest.idealDays;
  });

  html += `
    <div class="timeline-item" style="background: linear-gradient(135deg, #fff4ec, #ffe8d9); border:none;">
      <div class="timeline-item-content" style="grid-column: 1 / -1;">
        <div class="timeline-dest-name"><i class="fas fa-receipt"></i> Resumo financeiro</div>
        <div class="timeline-meta">
          <span><i class="fas fa-plane"></i> Voos: R$ ${itinerary.totalFlight.toLocaleString('pt-BR')}</span>
          <span><i class="fas fa-hotel"></i> Hotéis: R$ ${itinerary.totalHotel.toLocaleString('pt-BR')}</span>
          <span><i class="fas fa-ticket"></i> Passeios: R$ ${itinerary.totalTours.toLocaleString('pt-BR')}</span>
          ${itinerary.interCityFlights > 0 ? `<span><i class="fas fa-plane-departure"></i> Trechos: R$ ${itinerary.interCityFlights.toLocaleString('pt-BR')}</span>` : ''}
        </div>
        <div class="timeline-price" style="background:white;margin-top:0.8rem;">
          <span style="font-size:1rem;"><i class="fas fa-check-circle"></i> Total estimado</span>
          <strong style="font-size:1.6rem;">R$ ${itinerary.grandTotal.toLocaleString('pt-BR')}</strong>
        </div>
      </div>
    </div>
  `;
  timeline.innerHTML = html;
}

function runAISearch() {
  const loading = document.getElementById('aiLoading');
  const summary = document.getElementById('itinerarySummary');
  const timeline = document.getElementById('itineraryTimeline');

  summary.innerHTML = '';
  timeline.innerHTML = '';
  loading.style.display = 'block';
  showScreen('itineraryScreen');

  setTimeout(() => {
    const itinerary = aiGenerateItinerary();
    loading.style.display = 'none';
    renderItinerary(itinerary);
  }, 2200);
}

/* ------------------------------------------------------------
   MODAL
   ------------------------------------------------------------ */
function openModal(id) {
  const dest = destinations.find(d => d.id === id);
  if (!dest) return;

  const nights = dest.idealDays;
  const hotelTotal = calculateHotelTotal(dest.pricing, nights);
  const total = calculateTotal(dest.pricing, nights);

  const destQuery = encodeURIComponent(`${dest.name}, ${dest.country}`);
  const dates = getBookingDates(nights);
  const hotelsUrl = `https://www.booking.com/searchresults.pt-br.html?ss=${destQuery}&checkin=${dates.checkin}&checkout=${dates.checkout}&group_adults=2`;
  const flightsUrl = `https://www.google.com/travel/flights?q=voos+para+${encodeURIComponent(dest.name)}`;

  document.getElementById('modalContent').innerHTML = `
    <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <h3><i class="fas fa-map-pin" style="color:#ff7b2c"></i> ${dest.name}</h3>
    <p class="modal-sub">${dest.country} · ${dest.region} · ${dest.climateLabel}</p>

    <div class="modal-section">
      <h4><i class="fas fa-check-circle"></i> O que está incluso</h4>
      <ul class="included-list">
        <li><i class="fas fa-plane"></i> Passagem aérea (R$ ${dest.pricing.flight.toLocaleString('pt-BR')})</li>
        <li><i class="fas fa-hotel"></i> ${nights} noites (R$ ${hotelTotal.toLocaleString('pt-BR')})</li>
        <li><i class="fas fa-ticket"></i> Passeios (R$ ${dest.pricing.tours.toLocaleString('pt-BR')})</li>
      </ul>
    </div>

    <div class="modal-section">
      <h4><i class="fas fa-list-check"></i> Roteiro sugerido</h4>
      <ul class="included-list">
        ${dest.activities.map(a => `<li><i class="fas fa-circle-dot"></i> <strong>Dia ${a.day}:</strong> ${a.title}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <h4><i class="fas fa-lightbulb"></i> Dica da IA</h4>
      <p style="font-size:0.9rem;color:#2f405c;line-height:1.5;">${dest.tips}</p>
    </div>

    <div class="modal-total">
      <span>Total estimado</span>
      <strong>R$ ${total.toLocaleString('pt-BR')}</strong>
      <small>por pessoa</small>
    </div>

    <div class="modal-actions">
      <a href="${hotelsUrl}" target="_blank" rel="noopener noreferrer" class="modal-btn hotels">
        <i class="fas fa-hotel"></i> Buscar Hotéis
      </a>
      <a href="${flightsUrl}" target="_blank" rel="noopener noreferrer" class="modal-btn flights">
        <i class="fas fa-plane"></i> Buscar Voos
      </a>
    </div>

    <button class="offer-buy" style="width:100%;margin-top:1rem;padding:1rem;" onclick="closeModal(); openPackages(${dest.id});">
      <i class="fas fa-tags"></i> Ver pacotes e ofertas
    </button>
  `;

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

/* ------------------------------------------------------------
   INICIALIZAÇÃO
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchBtn').addEventListener('click', filterDestinations);
  document.getElementById('destinationInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); filterDestinations(); }
  });

  document.getElementById('aiBtn').addEventListener('click', runAISearch);
  document.getElementById('aiBtnFull').addEventListener('click', runAISearch);
  document.getElementById('regenerateBtn').addEventListener('click', runAISearch);

  document.getElementById('backBtn').addEventListener('click', () => showScreen(null));
  document.getElementById('backFromPackages').addEventListener('click', () => showScreen('resultsScreen'));
  document.getElementById('backFromItinerary').addEventListener('click', () => showScreen(null));

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      const cards = document.querySelectorAll('#cardsContainer .card');
      cards.forEach(card => {
        const badge = card.querySelector('.climate-badge')?.textContent.toLowerCase() || '';
        if (filter === 'all' || badge.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderOffers(currentOffers, tab.dataset.tab);
    });
  });

  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});