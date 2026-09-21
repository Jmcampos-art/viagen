/* ============================================================
   VIAGEN AI - SCRIPT COMPLETO COM IA RECOMENDANDO
   ============================================================ */

   const API_URL = 'https://viagen.onrender.com';

   /* ---------- BASE DE DESTINOS (fallback) ---------- */
   const destinations = [
     { id: 1, name: "Rio de Janeiro", country: "Brasil", state: "Rio de Janeiro", region: "Sudeste", climate: "tropical", climateLabel: "Tropical / Quente", bestMonths: [12,1,2,3], pricing: { flight: 1200, bus: 250, hotelPerNight: 350, tours: 400 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 430 }, attractions: ["Cristo Redentor", "Pão de Açúcar", "Copacabana", "Maracanã", "Escadaria Selarón"], image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1470&auto=format&fit=crop", description: "Praias icônicas, montanhas e energia contagiante.", rating: 9.4, idealDays: 4, tips: "Leve protetor solar.", activities: [
       { day: 1, title: "Chegada + Copacabana", desc: "Check-in e praia." },
       { day: 2, title: "Cristo + Santa Teresa", desc: "Corcovado e bondinho." },
       { day: 3, title: "Pão de Açúcar", desc: "Bondinho e Urca." },
       { day: 4, title: "Maracanã + Lapa", desc: "Estádio e samba." }
     ]},
     { id: 2, name: "Gramado", country: "Brasil", state: "Rio Grande do Sul", region: "Sul", climate: "frio", climateLabel: "Frio / Europeu", bestMonths: [6,7,8], pricing: { flight: 1400, bus: 500, hotelPerNight: 480, tours: 350 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 900 }, attractions: ["Lago Negro", "Rua Coberta", "Snowland", "Mini Mundo", "Catedral de Pedra"], image: "https://images.unsplash.com/photo-1596489772924-6d6d6f9c2e1b?q=80&w=1470&auto=format&fit=crop", description: "Clima europeu e chocolate quente.", rating: 9.1, idealDays: 3, tips: "Leve casaco pesado.", activities: [
       { day: 1, title: "Lago Negro", desc: "Pedalinho e chocolate." },
       { day: 2, title: "Snowland", desc: "Neve artificial." },
       { day: 3, title: "Mini Mundo", desc: "Miniaturas e centro." }
     ]},
     { id: 3, name: "Santos", country: "Brasil", state: "São Paulo", region: "Sudeste", climate: "tropical", climateLabel: "Tropical / Litorâneo", bestMonths: [12,1,2,3,4], pricing: { flight: null, bus: 90, hotelPerNight: 300, tours: 300 }, transport: { recommended: "bus", flightAvailable: false, busAvailable: true, distanceKm: 80 }, attractions: ["Praia do Gonzaga", "Monte Serrat", "Museu do Café", "Aquário Municipal", "Bolsa Oficial do Café"], image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1470&auto=format&fit=crop", description: "Maior porto do Brasil, praias e história do café.", rating: 8.5, idealDays: 3, tips: "Prove o café na Bolsa Oficial.", activities: [
       { day: 1, title: "Praias", desc: "Gonzaga e Boqueirão." },
       { day: 2, title: "Monte Serrat", desc: "Bondinho e vista." },
       { day: 3, title: "Museu do Café", desc: "História e centro." }
     ]},
     { id: 4, name: "São Paulo", country: "Brasil", state: "São Paulo", region: "Sudeste", climate: "ameno", climateLabel: "Ameno / Tropical de Altitude", bestMonths: [4,5,6,7,8,9], pricing: { flight: 900, bus: 150, hotelPerNight: 300, tours: 350 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 0 }, attractions: ["MASP", "Ibirapuera", "Av. Paulista", "Mercado Municipal", "Theatro Municipal"], image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?q=80&w=1470&auto=format&fit=crop", description: "A maior cidade do Brasil.", rating: 9.0, idealDays: 3, tips: "Use o metrô.", activities: [
       { day: 1, title: "Av. Paulista", desc: "MASP e Ibirapuera." },
       { day: 2, title: "Centro", desc: "Mercado e Theatro." },
       { day: 3, title: "Vila Madalena", desc: "Bares e grafite." }
     ]},
     { id: 5, name: "Salvador", country: "Brasil", state: "Bahia", region: "Nordeste", climate: "tropical", climateLabel: "Tropical / Quente", bestMonths: [1,2,3,9,10], pricing: { flight: 1100, bus: 700, hotelPerNight: 280, tours: 300 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 1950 }, attractions: ["Pelourinho", "Elevador Lacerda", "Farol da Barra", "Mercado Modelo"], image: "https://images.unsplash.com/photo-1583536190222-8d9d1f4b4e5e?q=80&w=1470&auto=format&fit=crop", description: "Cultura afro-brasileira.", rating: 8.9, idealDays: 4, tips: "Prove o acarajé.", activities: [
       { day: 1, title: "Pelourinho", desc: "Centro histórico." },
       { day: 2, title: "Farol da Barra", desc: "Praias e museu." },
       { day: 3, title: "Bonfim", desc: "Fita e Ribeira." },
       { day: 4, title: "Mercado Modelo", desc: "Artesanato." }
     ]},
     { id: 6, name: "Fortaleza", country: "Brasil", state: "Ceará", region: "Nordeste", climate: "calor", climateLabel: "Quente / Tropical", bestMonths: [8,9,10,11], pricing: { flight: 1100, bus: 800, hotelPerNight: 250, tours: 300 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 3100 }, attractions: ["Praia do Futuro", "Beach Park", "Dragão do Mar"], image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1470&auto=format&fit=crop", description: "Dunas e praias mornas.", rating: 8.7, idealDays: 4, tips: "Vá ao Beach Park em dia de semana.", activities: [
       { day: 1, title: "Praia do Futuro", desc: "Barracas." },
       { day: 2, title: "Beach Park", desc: "Aquático." },
       { day: 3, title: "Dragão do Mar", desc: "Cultura." },
       { day: 4, title: "Canoa Quebrada", desc: "Falésias." }
     ]},
     { id: 7, name: "Lisboa", country: "Portugal", state: "Lisboa", region: "Europa", climate: "ameno", climateLabel: "Ameno / Mediterrâneo", bestMonths: [3,4,5,9,10], pricing: { flight: 3200, bus: null, hotelPerNight: 420, tours: 500 }, transport: { recommended: "flight", flightAvailable: true, busAvailable: false, distanceKm: 7800 }, attractions: ["Torre de Belém", "Mosteiro dos Jerónimos", "Alfama", "Sintra"], image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1470&auto=format&fit=crop", description: "História e pastéis de nata.", rating: 9.5, idealDays: 5, tips: "Compre o Lisboa Card.", activities: [
       { day: 1, title: "Baixa", desc: "Praça do Comércio." },
       { day: 2, title: "Belém", desc: "Torre e pastéis." },
       { day: 3, title: "Alfama", desc: "Castelo São Jorge." },
       { day: 4, title: "Sintra", desc: "Palácio da Pena." },
       { day: 5, title: "Chiado", desc: "Time Out Market." }
     ]},
     { id: 8, name: "Paris", country: "França", state: "Île-de-France", region: "Europa", climate: "ameno", climateLabel: "Ameno / Continental", bestMonths: [4,5,6,9,10], pricing: { flight: 4500, bus: null, hotelPerNight: 650, tours: 700 }, transport: { recommended: "flight", flightAvailable: true, busAvailable: false, distanceKm: 9400 }, attractions: ["Torre Eiffel", "Louvre", "Montmartre"], image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1470&auto=format&fit=crop", description: "Romance e arte.", rating: 9.6, idealDays: 6, tips: "Compre ingressos online.", activities: [
       { day: 1, title: "Torre Eiffel", desc: "Trocadéro." },
       { day: 2, title: "Louvre", desc: "Mona Lisa." },
       { day: 3, title: "Champs-Élysées", desc: "Compras." },
       { day: 4, title: "Montmartre", desc: "Sacré-Cœur." },
       { day: 5, title: "Versalhes", desc: "Palácio." },
       { day: 6, title: "Marais", desc: "Notre-Dame." }
     ]},
     { id: 9, name: "Nova York", country: "Estados Unidos", state: "Nova York", region: "América do Norte", climate: "ameno", climateLabel: "Ameno / Continental", bestMonths: [4,5,6,9,10,11], pricing: { flight: 4800, bus: null, hotelPerNight: 750, tours: 600 }, transport: { recommended: "flight", flightAvailable: true, busAvailable: false, distanceKm: 7700 }, attractions: ["Times Square", "Central Park", "Estatua da Liberdade"], image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1470&auto=format&fit=crop", description: "A cidade que nunca dorme.", rating: 9.5, idealDays: 6, tips: "MetroCard ilimitado.", activities: [
       { day: 1, title: "Times Square", desc: "Broadway." },
       { day: 2, title: "Liberdade", desc: "Wall St." },
       { day: 3, title: "Central Park", desc: "MET." },
       { day: 4, title: "Brooklyn", desc: "Ponte." },
       { day: 5, title: "MoMA", desc: "5th Ave." },
       { day: 6, title: "Empire State", desc: "SoHo." }
     ]},
     { id: 10, name: "Buenos Aires", country: "Argentina", state: "Buenos Aires", region: "América do Sul", climate: "ameno", climateLabel: "Ameno / Temperado", bestMonths: [3,4,5,9,10,11], pricing: { flight: 1800, bus: 900, hotelPerNight: 300, tours: 350 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 1700 }, attractions: ["Caminito", "Teatro Colón", "Recoleta", "San Telmo"], image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=1470&auto=format&fit=crop", description: "Tango e steak.", rating: 9.0, idealDays: 4, tips: "Prove o assado.", activities: [
       { day: 1, title: "Caminito", desc: "La Boca." },
       { day: 2, title: "Recoleta", desc: "Cemitério e feira." },
       { day: 3, title: "San Telmo", desc: "Antiguidades." },
       { day: 4, title: "Palermo", desc: "Bares e tango." }
     ]},
     { id: 11, name: "Santiago", country: "Chile", state: "Santiago", region: "América do Sul", climate: "ameno", climateLabel: "Ameno / Andino", bestMonths: [3,4,5,9,10,11], pricing: { flight: 2200, bus: 1400, hotelPerNight: 350, tours: 400 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 2600 }, attractions: ["Cerro San Cristóbal", "Valparaíso", "Vinícolas"], image: "https://images.unsplash.com/photo-1518659526054-190340b32735?q=80&w=1470&auto=format&fit=crop", description: "Andes e vinhos.", rating: 8.9, idealDays: 4, tips: "Visite vinícolas.", activities: [
       { day: 1, title: "Centro", desc: "Plaza de Armas." },
       { day: 2, title: "San Cristóbal", desc: "Teleférico." },
       { day: 3, title: "Valparaíso", desc: "Cores e mar." },
       { day: 4, title: "Vinícolas", desc: "Degustação." }
     ]},
     { id: 12, name: "Gramado", country: "Brasil", state: "Rio Grande do Sul", region: "Sul", climate: "frio", climateLabel: "Frio / Serrano", bestMonths: [6,7,8], pricing: { flight: 1400, bus: 500, hotelPerNight: 480, tours: 350 }, transport: { recommended: "both", flightAvailable: true, busAvailable: true, distanceKm: 900 }, attractions: ["Lago Negro", "Rua Coberta", "Snowland"], image: "https://images.unsplash.com/photo-1596489772924-6d6d6f9c2e1b?q=80&w=1470&auto=format&fit=crop", description: "Clima europeu.", rating: 9.1, idealDays: 3, tips: "Leve casaco.", activities: [
       { day: 1, title: "Lago Negro", desc: "Pedalinho." },
       { day: 2, title: "Snowland", desc: "Neve." },
       { day: 3, title: "Mini Mundo", desc: "Miniaturas." }
     ]}
   ];
   
   const aiCache = new Map();
   let nextAIId = 1000;
   let sessionUsedDestinations = new Set();
   
   /* ---------- COMPANHIAS ---------- */
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
     { code: "AV", name: "Avianca", logo: "AV", color: "#e30613", rating: 7.9, perks: ["Bagagem 23kg", "Lanches"], url: "https://www.avianca.com/br/" }
   ];
   
   const busCompanies = [
     { name: "FlixBus", logo: "F", color: "#73d700", rating: 8.3, perks: ["Wi-Fi", "Tomada", "Ar-condicionado"], url: "https://www.flixbus.com.br/" },
     { name: "Cometa", logo: "C", color: "#c8102e", rating: 8.0, perks: ["Wi-Fi", "Poltrona leito"], url: "https://www.cometa.com.br/" },
     { name: "Águia Branca", logo: "AB", color: "#ff6b00", rating: 8.1, perks: ["Wi-Fi", "Leito cama"], url: "https://www.aguiabranca.com.br/" },
     { name: "Gontijo", logo: "G", color: "#1a5c2e", rating: 8.2, perks: ["Wi-Fi", "Leito cama"], url: "https://www.gontijo.com.br/" },
     { name: "ClickBus", logo: "CB", color: "#ff5722", rating: 8.5, perks: ["Comparador", "Compra online"], url: "https://www.clickbus.com.br/" },
     { name: "Buser", logo: "B", color: "#7b5cff", rating: 8.4, perks: ["Fretamento", "Barato"], url: "https://www.buser.com.br/" }
   ];
   
   const hotelChains = [
     { name: "Booking.com", logo: "B.", color: "#003580", rating: 8.5, type: "Reserva", urlTemplate: "https://www.booking.com/searchresults.pt-br.html?ss={dest}&checkin={checkin}&checkout={checkout}&group_adults=2" },
     { name: "Trivago", logo: "T", color: "#ff6f00", rating: 8.3, type: "Comparador", urlTemplate: "https://www.trivago.com.br/pt-BR/srl?query={dest}" },
     { name: "Airbnb", logo: "A", color: "#ff5a5f", rating: 8.7, type: "Casa", urlTemplate: "https://www.airbnb.com.br/s/{dest}/homes?checkin={checkin}&checkout={checkout}&adults=2" },
     { name: "Hilton Hotels", logo: "H", color: "#00205b", rating: 8.9, type: "Luxo", urlTemplate: "https://www.hilton.com/en/search/?q={dest}" },
     { name: "Marriott", logo: "M", color: "#a11e2a", rating: 8.8, type: "Luxo", urlTemplate: "https://www.marriott.com/search/findHotels.mi?destinationAddress={dest}" },
     { name: "Accor (Ibis)", logo: "A", color: "#001e5f", rating: 8.0, type: "Econômico", urlTemplate: "https://all.accor.com/ssr/app/ibis/rates/offer/index.pt-br.shtml?destination={dest}" },
     { name: "Decolar", logo: "D", color: "#ff6b00", rating: 8.2, type: "Agência", urlTemplate: "https://www.decolar.com/hoteis/" },
     { name: "Expedia", logo: "E", color: "#00355f", rating: 8.4, type: "Agência", urlTemplate: "https://www.expedia.com.br/Hoteis" }
   ];
   
   /* ---------- UTILITÁRIOS ---------- */
   function getMonthName(m) {
     const months = ["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
     return months[m] || "";
   }
   
   function getClimateIcon(c) {
     return { calor:"fa-fire", frio:"fa-snowflake", ameno:"fa-cloud-sun", tropical:"fa-umbrella-beach", seco:"fa-mountain" }[c] || "fa-sun";
   }
   
   function calculateHotelTotal(pricing, nights) {
     return pricing.hotelPerNight * nights;
   }
   
   function getAirlineByCountry(country) {
     const map = {
       "Brasil": ["LA", "G3", "AD"],
       "Portugal": ["TP", "LA", "IB"],
       "Argentina": ["LA", "G3", "AV"],
       "França": ["AF", "KL", "TP"],
       "Estados Unidos": ["AA", "LA", "EK"],
       "EUA": ["AA", "LA", "EK"],
       "Chile": ["LA", "AV", "AA"]
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
   
     if (offer.type === 'flight' && offer.airline?.url) return offer.airline.url;
     if (offer.type === 'bus' && offer.company?.url) return offer.company.url;
   
     if (offer.type === 'hotel' && offer.chain?.urlTemplate) {
       return offer.chain.urlTemplate
         .replace('{dest}', destQuery)
         .replace('{checkin}', dates.checkin)
         .replace('{checkout}', dates.checkout);
     }
   
     if (offer.type === 'package') {
       const urls = {
         "Booking": "https://www.booking.com/",
         "Trivago": "https://www.trivago.com.br/",
         "Decolar": "https://www.decolar.com/pacotes/",
         "Expedia": "https://www.expedia.com.br/Pacotes"
       };
       return urls[offer.chain?.name] || "https://www.decolar.com/pacotes/";
     }
   
     return '#';
   }
   
   function formatDateLabel(dateValue) {
     if (!dateValue) return '';
     const d = new Date(dateValue + 'T00:00:00');
     const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
     return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
   }
   
   /* ---------- NAVEGAÇÃO ---------- */
   function showScreen(screenId) {
     document.querySelectorAll('.fullscreen-results').forEach(s => s.classList.remove('active'));
     if (screenId) {
       document.getElementById(screenId).classList.add('active');
       document.body.style.overflow = 'hidden';
     } else {
       document.body.style.overflow = '';
     }
   }
   
/* ---------- BUSCA MANUAL ---------- */
async function filterDestinations() {
  const dateValue = document.getElementById('dateInput').value;
  const month = dateValue ? new Date(dateValue + 'T00:00:00').getMonth() + 1 : null;
  const climate = document.getElementById('climateSelect').value;
  const destinationText = document.getElementById('destinationInput').value.trim();
  const originText = document.getElementById('originInput').value.trim();

  const cardsContainer = document.getElementById('cardsContainer');
  const resultCountSpan = document.getElementById('resultCount');
  const title = document.getElementById('resultsScreenTitle');

  title.innerHTML = '<i class="fas fa-search"></i> Buscando...';
  resultCountSpan.textContent = 'Buscando...';
  cardsContainer.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-circle-notch fa-spin"></i><br>Buscando destinos...</div>`;
  showScreen('resultsScreen');

  // 1️⃣ Filtra na base local
  let filtered = destinations.filter(dest => {
    if (month && !dest.bestMonths.includes(Number(month))) return false;
    if (climate && dest.climate !== climate) return false;
    if (destinationText) {
      const s = destinationText.toLowerCase();
      if (!dest.name.toLowerCase().includes(s) && !dest.country.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  // 2️⃣ Se digitou destino específico e não achou, busca pela IA
  if (destinationText && filtered.length === 0) {
    try {
      title.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Buscando com IA...';
      resultCountSpan.textContent = 'IA trabalhando (10-15s)...';
      const aiDestination = await searchWithAI(destinationText);
      filtered = [aiDestination];
    } catch (error) {
      console.error('Erro busca IA:', error);
      cardsContainer.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <i class="fas fa-exclamation-triangle"></i><br>
          Não encontramos "${destinationText}".<br>
        </div>`;
      resultCountSpan.textContent = '0 destinos';
      title.innerHTML = '<i class="fas fa-suitcase-rolling"></i> Resultados da busca';
      return;
    }
  }

  // 3️⃣ ✅ SE ESCOLHEU CLIMA E TEM POUCAS CIDADES, IA GERA MAIS
  if (!destinationText && climate && filtered.length < 5) {
    try {
      title.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> IA gerando mais destinos de "${climate}"...`;
      resultCountSpan.textContent = 'IA trabalhando (10-15s)...';

      console.log(`🌡️ Poucas cidades com clima "${climate}" (${filtered.length}). Pedindo para IA...`);

      // Nomes já existentes (para não duplicar)
      const nomesExistentes = destinations.map(d => d.name.toLowerCase());

      const response = await fetch(`${API_URL}/api/generate-by-climate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          climate,
          origin: originText,
          count: 8
        })
      });

      if (!response.ok) throw new Error('Falha ao gerar destinos por clima');

      const data = await response.json();
      const novos = data.destinations || [];

      console.log(`✅ IA gerou ${novos.length} novos destinos`);

      // Adiciona só os que ainda não existem
      const adicionados = [];
      novos.forEach(r => {
        const nomeLower = r.name.toLowerCase();
        if (nomesExistentes.includes(nomeLower)) return;

        nextAIId++;
        const nova = {
          id: nextAIId,
          name: r.name,
          country: r.country || 'Brasil',
          state: r.state || '',
          region: r.region || 'Mundo',
          climate: climate,
          climateLabel: r.climateLabel || climate,
          bestMonths: r.bestMonths || [1,2,3,4,5,6,7,8,9,10,11,12],
          pricing: {
            flight: r.pricing?.flight ?? null,
            bus: r.pricing?.bus ?? null,
            hotelPerNight: r.pricing?.hotelPerNight || 300,
            tours: r.pricing?.tours || 300
          },
          transport: r.transport || {
            recommended: r.pricing?.flight ? 'both' : 'bus',
            flightAvailable: !!r.pricing?.flight,
            busAvailable: !!r.pricing?.bus
          },
          attractions: r.attractions || [],
          image: r.image || 'https://images.unsplash.com/photo-1488646953014-85cf1c14a9f?w=1600&q=80',
          description: r.description || '',
          rating: r.rating || 8.5,
          idealDays: r.idealDays || 3,
          tips: r.tips || '',
          activities: r.activities || [],
          fromAI: true,
          origin: originText
        };

        destinations.push(nova);
        filtered.push(nova);
        adicionados.push(nova.name);
      });

      console.log(`✅ ${adicionados.length} destinos adicionados: ${adicionados.join(', ')}`);

      // Aviso de que veio da IA
      if (adicionados.length > 0) {
        setTimeout(() => {
          const aviso = document.createElement('div');
          aviso.className = 'ai-notice';
          aviso.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> IA adicionou <strong>${adicionados.length}</strong> novos destinos de clima "${climate}"`;
          cardsContainer.parentNode.insertBefore(aviso, cardsContainer);
        }, 100);
      }

    } catch (error) {
      console.warn('⚠️ IA falhou em gerar por clima:', error.message);
      // Continua com o que já tem
    }
  }

  // 4️⃣ Ordena e renderiza
  filtered.sort((a, b) => {
    const totalA = Math.min(a.pricing.flight || Infinity, a.pricing.bus || Infinity);
    const totalB = Math.min(b.pricing.flight || Infinity, b.pricing.bus || Infinity);
    return totalA - totalB;
  });

  renderCards(filtered, false, originText);
}
   
   /* ---------- RENDERIZAÇÃO DOS CARDS ---------- */
   function renderCards(list, isAIPick = false, originText = '') {
     const container = document.getElementById('cardsContainer');
     const resultCountSpan = document.getElementById('resultCount');
     const title = document.getElementById('resultsScreenTitle');
   
     if (!list.length) {
       container.innerHTML = `<div class="empty-state"><i class="fas fa-map-pin"></i><br>Nenhum destino encontrado.</div>`;
       resultCountSpan.textContent = "0 destinos";
       return;
     }
   
     resultCountSpan.textContent = `${list.length} ${list.length === 1 ? 'destino' : 'destinos'}`;
     
     const dateValue = document.getElementById('dateInput').value;
     const dateLabel = formatDateLabel(dateValue);
     
     const baseTitle = isAIPick
       ? '<i class="fas fa-wand-magic-sparkles"></i> Escolhas da IA'
       : '<i class="fas fa-suitcase-rolling"></i> Resultados da busca';
     
     title.innerHTML = dateLabel 
       ? `${baseTitle} <span class="date-badge">📅 ${dateLabel}</span>` 
       : baseTitle;
   
     let html = '';
     list.forEach(dest => {
       const attractionsList = dest.attractions.slice(0, 5)
         .map(a => `<li><i class="fas fa-check-circle"></i> ${a}</li>`).join('');
   
       const climateIcon = getClimateIcon(dest.climate);
       const nights = dest.idealDays;
       const hotelTotal = calculateHotelTotal(dest.pricing, nights);
       const aiBadge = dest.fromAI ? '<span class="ai-badge">✨ IA</span>' : '';
       const originDisplay = originText || dest.origin || '';
   
       const hasFlight = dest.pricing.flight !== null && dest.pricing.flight !== undefined;
       const hasBus = dest.pricing.bus !== null && dest.pricing.bus !== undefined;
       const totalFlight = hasFlight ? dest.pricing.flight + hotelTotal + dest.pricing.tours : null;
       const totalBus = hasBus ? dest.pricing.bus + hotelTotal + dest.pricing.tours : null;
   
       const safeName = dest.name.replace(/'/g, "\\'");
   
       html += `
         <div class="card">
           <div class="card-img" style="background-image: linear-gradient(0deg,#00000060,#00000020), url('${dest.image}');">
             <span class="climate-badge"><i class="fas ${climateIcon}"></i> ${dest.climateLabel}</span>
             ${aiBadge}
           </div>
           <div class="card-content">
             <div class="card-title"><i class="fas fa-map-pin"></i> ${dest.name}${dest.state ? ', ' + dest.state : ', ' + dest.country}</div>
             ${originDisplay ? `<div class="detail-item origin-item"><i class="fas fa-plane-departure"></i> Saindo de: <strong>${originDisplay}</strong></div>` : ''}
             <div class="details">
               <div class="detail-item"><i class="fas fa-calendar-check"></i> Melhores meses: ${dest.bestMonths.map(m => getMonthName(m)).join(', ')}</div>
               <div class="detail-item"><i class="fas fa-clock"></i> ${dest.idealDays} dias ideais</div>
               <div class="detail-item"><i class="fas fa-star"></i> ${dest.rating}/10</div>
             </div>
   
             <div class="price-breakdown">
               ${hasFlight ? `
               <div class="price-row">
                 <span><i class="fas fa-plane"></i> Voo ida/volta</span>
                 <strong>R$ ${dest.pricing.flight.toLocaleString('pt-BR')}</strong>
               </div>` : ''}
               ${hasBus ? `
               <div class="price-row">
                 <span><i class="fas fa-bus"></i> Ônibus ida/volta</span>
                 <strong>R$ ${dest.pricing.bus.toLocaleString('pt-BR')}</strong>
               </div>` : ''}
               <div class="price-row">
                 <span><i class="fas fa-hotel"></i> ${nights} noites</span>
                 <strong>R$ ${hotelTotal.toLocaleString('pt-BR')}</strong>
               </div>
               <div class="price-row">
                 <span><i class="fas fa-ticket"></i> Passeios</span>
                 <strong>R$ ${dest.pricing.tours.toLocaleString('pt-BR')}</strong>
               </div>
               ${totalFlight ? `
               <div class="price-row total">
                 <span><i class="fas fa-plane"></i> Total com avião</span>
                 <strong>R$ ${totalFlight.toLocaleString('pt-BR')}</strong>
               </div>` : ''}
               ${totalBus ? `
               <div class="price-row total bus-total">
                 <span><i class="fas fa-bus"></i> Total com ônibus</span>
                 <strong>R$ ${totalBus.toLocaleString('pt-BR')}</strong>
               </div>` : ''}
             </div>
   
             ${dest.fromAI ? `
             <div class="ai-warning">
               <i class="fas fa-info-circle"></i>
               <span>Informações geradas por IA. Confirme atrações e preços antes de viajar.</span>
             </div>` : ''}
   
             <div class="attractions">
               <h4><i class="fas fa-binoculars"></i> Lugares para conhecer</h4>
               <ul>${attractionsList}</ul>
             </div>
   
             <div class="card-actions">
               <button class="details-btn" data-action="details" data-name="${safeName}">
                 <i class="fas fa-info-circle"></i> Detalhes
               </button>
               <button class="packages-btn" data-action="packages" data-name="${safeName}">
                 <i class="fas fa-tags"></i> Ver pacotes
               </button>
             </div>
           </div>
         </div>`;
     });
     container.innerHTML = html;
   
     container.querySelectorAll('[data-action]').forEach(btn => {
       btn.addEventListener('click', (e) => {
         const action = e.currentTarget.dataset.action;
         const name = e.currentTarget.dataset.name;
         console.log('🖱️ Clique:', action, '| Nome:', name);
         
         if (action === 'details') {
           openModalByName(name);
         } else if (action === 'packages') {
           openPackagesByName(name);
         }
       });
     });
   }
   
   /* ---------- PACOTES ---------- */
   let currentDestination = null;
   let currentOffers = [];
   
   function openPackagesByName(name) {
     console.log('🔍 [openPackagesByName] Nome:', name);
     const dest = destinations.find(d => d.name === name);
     if (!dest) {
       alert('Destino não encontrado: ' + name);
       return;
     }
     openPackages(dest.id);
   }
   
   function openModalByName(name) {
     console.log('🔍 [openModalByName] Nome:', name);
     const dest = destinations.find(d => d.name === name);
     if (!dest) {
       alert('Destino não encontrado: ' + name);
       return;
     }
     openModal(dest.id);
   }
   
   function openPackages(destId) {
     const idNum = parseInt(destId, 10);
     const dest = destinations.find(d => d.id === idNum);
     
     if (!dest) {
       alert('Erro: destino não encontrado.');
       return;
     }
   
     currentDestination = dest;
   
     try {
       const offers = generateOffers(dest);
       currentOffers = offers;
   
       document.getElementById('packagesDestName').textContent = `${dest.name}${dest.state ? ', ' + dest.state : ''}`;
       document.getElementById('packagesCount').textContent = `${offers.length} ofertas`;
   
       const nights = dest.idealDays;
       const flightOffers = offers.filter(o => o.type === 'flight');
       const busOffers = offers.filter(o => o.type === 'bus');
       const hotelOffers = offers.filter(o => o.type === 'hotel');
       const packageOffers = offers.filter(o => o.type === 'package');
   
       const cheapestFlight = flightOffers.length ? Math.min(...flightOffers.map(o => o.price)) : null;
       const cheapestBus = busOffers.length ? Math.min(...busOffers.map(o => o.price)) : null;
       const cheapestHotel = hotelOffers.length ? Math.min(...hotelOffers.map(o => o.price)) : null;
       const cheapestPackage = packageOffers.length ? Math.min(...packageOffers.map(o => o.price)) : null;
   
       document.getElementById('packagesSummary').innerHTML = `
         ${cheapestFlight ? `<div class="summary-card"><i class="fas fa-plane"></i><div class="info"><span class="label">Voo mais barato</span><span class="value">R$ ${cheapestFlight.toLocaleString('pt-BR')}</span></div></div>` : ''}
         ${cheapestBus ? `<div class="summary-card"><i class="fas fa-bus"></i><div class="info"><span class="label">Ônibus mais barato</span><span class="value">R$ ${cheapestBus.toLocaleString('pt-BR')}</span></div></div>` : ''}
         ${cheapestHotel ? `<div class="summary-card"><i class="fas fa-hotel"></i><div class="info"><span class="label">Hotel mais barato (${nights}n)</span><span class="value">R$ ${(cheapestHotel * nights).toLocaleString('pt-BR')}</span></div></div>` : ''}
         ${cheapestPackage ? `<div class="summary-card"><i class="fas fa-box-open"></i><div class="info"><span class="label">Pacote completo</span><span class="value">R$ ${cheapestPackage.toLocaleString('pt-BR')}</span></div></div>` : ''}
       `;
   
       document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
       document.querySelector('.tab-btn[data-tab="all"]')?.classList.add('active');
   
       renderOffers(offers, 'all');
       showScreen('packagesScreen');
     } catch (error) {
       console.error('❌ Erro:', error);
       alert('Erro: ' + error.message);
     }
   }
   
   function generateOffers(dest) {
     const offers = [];
     const nights = dest.idealDays;
     let counter = 0;
   
     if (dest.pricing.flight !== null && dest.pricing.flight !== undefined) {
       const airlinesList = getAirlineByCountry(dest.country);
       airlinesList.forEach(airline => {
         const variation = 1 + (Math.random() * 0.4 - 0.1);
         const price = Math.round(dest.pricing.flight * variation);
         const oldPrice = Math.round(price * 1.25);
         const duration = Math.round(2 + Math.random() * 10);
         const stops = Math.floor(Math.random() * 3);
   
         offers.push({
           id: ++counter,
           type: 'flight',
           airline,
           name: `${airline.name} · ${dest.name}`,
           price, oldPrice, duration, stops,
           tags: [stops === 0 ? "Voo direto" : `${stops} ${stops === 1 ? 'parada' : 'paradas'}`, `${duration}h de voo`, airline.perks[0]],
           rating: airline.rating,
           isBestPrice: false
         });
       });
     }
   
     if (dest.pricing.bus !== null && dest.pricing.bus !== undefined) {
       const shuffledBus = [...busCompanies].sort(() => Math.random() - 0.5).slice(0, 5);
       shuffledBus.forEach(company => {
         const variation = 0.85 + Math.random() * 0.3;
         const price = Math.round(dest.pricing.bus * variation);
         const oldPrice = Math.round(price * 1.2);
         const duration = Math.round(2 + Math.random() * 12);
   
         offers.push({
           id: ++counter,
           type: 'bus',
           company,
           name: `${company.name} · ${dest.name}`,
           price, oldPrice, duration,
           tags: [`${duration}h de viagem`, "Wi-Fi a bordo", company.perks[0]],
           rating: company.rating,
           isBestPrice: false
         });
       });
     }
   
     const shuffledHotels = [...hotelChains].sort(() => Math.random() - 0.5).slice(0, 8);
     shuffledHotels.forEach(hotel => {
       const variation = 0.7 + Math.random() * 0.9;
       const pricePerNight = Math.round(dest.pricing.hotelPerNight * variation);
       const oldPrice = Math.round(pricePerNight * 1.3);
   
       offers.push({
         id: ++counter,
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
       if (dest.pricing.flight !== null && dest.pricing.flight !== undefined) {
         const variation = 0.85 + Math.random() * 0.4;
         const price = Math.round((dest.pricing.flight + dest.pricing.hotelPerNight * nights + dest.pricing.tours) * variation);
         const oldPrice = Math.round(price * 1.3);
   
         offers.push({
           id: ++counter,
           type: 'package',
           chain: { name: provider.name, color: provider.color, logo: provider.logo },
           name: `Pacote ${provider.name} (avião) · ${dest.name}`,
           price, oldPrice,
           tags: ["Voo + Hotel", `${nights} noites`, "Café incluso", "Cancelamento grátis"],
           rating: (7.5 + Math.random() * 2).toFixed(1),
           isBestPrice: false
         });
       }
   
       if (dest.pricing.bus !== null && dest.pricing.bus !== undefined) {
         const variation = 0.85 + Math.random() * 0.3;
         const price = Math.round((dest.pricing.bus + dest.pricing.hotelPerNight * nights + dest.pricing.tours) * variation);
         const oldPrice = Math.round(price * 1.25);
   
         offers.push({
           id: ++counter,
           type: 'package',
           chain: { name: provider.name, color: provider.color, logo: provider.logo },
           name: `Pacote ${provider.name} (ônibus) · ${dest.name}`,
           price, oldPrice,
           tags: ["Ônibus + Hotel", `${nights} noites`, "Econômico", "Cancelamento grátis"],
           rating: (7.5 + Math.random() * 2).toFixed(1),
           isBestPrice: false
         });
       }
     });
   
     ['flight', 'bus', 'hotel', 'package'].forEach(type => {
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
       const typeLabel = { flight: 'Voo', bus: 'Ônibus', hotel: 'Hotel', package: 'Pacote' }[offer.type];
       const color = offer.airline?.color || offer.company?.color || offer.chain?.color || "#7b5cff";
       const logo = offer.airline?.logo || offer.company?.logo || offer.chain?.logo || "?";
       const bookingUrl = generateBookingUrl(offer, currentDestination);
   
       let actionButtons = '';
       if (offer.type === 'flight') {
         actionButtons = `
           <button class="offer-buy" data-offer-action="flight-details" data-offer-id="${offer.id}">
             <i class="fas fa-info-circle"></i> Detalhes
           </button>
           <a href="${bookingUrl}" target="_blank" rel="noopener noreferrer" class="offer-buy secondary">
             <i class="fas fa-external-link-alt"></i> Reservar
           </a>`;
       } else if (offer.type === 'hotel') {
         actionButtons = `
           <button class="offer-buy" data-offer-action="hotel-details" data-offer-id="${offer.id}">
             <i class="fas fa-info-circle"></i> Detalhes
           </button>
           <a href="${bookingUrl}" target="_blank" rel="noopener noreferrer" class="offer-buy secondary">
             <i class="fas fa-external-link-alt"></i> Reservar
           </a>`;
       } else {
         actionButtons = `
           <a href="${bookingUrl}" target="_blank" rel="noopener noreferrer" class="offer-buy">
             <i class="fas fa-external-link-alt"></i> Reservar
           </a>`;
       }
   
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
             ${actionButtons}
           </div>
         </div>
       `;
     }).join('');
   
     container.querySelectorAll('[data-offer-action]').forEach(btn => {
       btn.addEventListener('click', (e) => {
         const action = e.currentTarget.dataset.offerAction;
         const offerId = parseInt(e.currentTarget.dataset.offerId, 10);
         if (action === 'flight-details') openFlightModal(offerId);
         if (action === 'hotel-details') openHotelModal(offerId);
       });
     });
   }
   
   /* ---------- MODAL DE VOO ---------- */
   function openFlightModal(offerId) {
     const offer = currentOffers.find(o => o.id === offerId);
     if (!offer || !offer.airline) return;
   
     const airline = offer.airline;
     const dest = currentDestination;
   
     const departureHour = 6 + Math.floor(Math.random() * 14);
     const departureMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
     const arrivalHour = (departureHour + offer.duration) % 24;
     const arrivalMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
   
     const pad = (n) => String(n).padStart(2, '0');
   
     const stopsList = offer.stops === 0
       ? ['Voo direto ✈️']
       : Array.from({ length: offer.stops }, () => 
           `${['Guarulhos', 'Brasília', 'Confins', 'Recife', 'Salvador', 'Curitiba'][Math.floor(Math.random() * 6)]} (${1 + Math.floor(Math.random() * 2)}h de conexão)`
         );
   
     document.getElementById('modalContent').innerHTML = `
       <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
       <div class="modal-flight-header" style="background: linear-gradient(135deg, ${airline.color}, #001a4d);">
         <div class="modal-flight-logo" style="background: white; color: ${airline.color};">${airline.logo}</div>
         <div style="flex:1;">
           <h3 style="color:white; margin:0;">${airline.name}</h3>
           <p style="color:#ffffffcc; margin:0.3rem 0 0; font-size:0.9rem;">
             <i class="fas fa-star"></i> ${airline.rating}/10 · ${offer.stops === 0 ? 'Voo direto' : offer.stops + ' parada(s)'}
           </p>
         </div>
         <div class="modal-flight-price">
           <span style="color:#ffffffcc; font-size:0.7rem;">POR PESSOA</span>
           <strong style="color:white;">R$ ${offer.price.toLocaleString('pt-BR')}</strong>
         </div>
       </div>
   
       <div class="modal-section">
         <h4><i class="fas fa-route"></i> Trajeto</h4>
         <div class="flight-route">
           <div class="flight-point">
             <div class="flight-time">${pad(departureHour)}:${pad(departureMin)}</div>
             <div class="flight-city">Origem</div>
           </div>
           <div class="flight-line">
             <i class="fas fa-plane"></i>
             <span>${offer.duration}h</span>
           </div>
           <div class="flight-point">
             <div class="flight-time">${pad(arrivalHour)}:${pad(arrivalMin)}</div>
             <div class="flight-city">${dest.name}</div>
           </div>
         </div>
       </div>
   
       <div class="modal-section">
         <h4><i class="fas fa-exchange-alt"></i> Escalas</h4>
         <ul class="included-list">
           ${stopsList.map(s => `<li><i class="fas fa-circle-dot"></i> ${s}</li>`).join('')}
         </ul>
       </div>
   
       <div class="modal-section">
         <h4><i class="fas fa-suitcase"></i> Bagagem inclusa</h4>
         <ul class="included-list">
           <li><i class="fas fa-check"></i> Mochila ou bolsa (10kg)</li>
           <li><i class="fas fa-check"></i> ${airline.perks[0] || 'Bagagem 23kg'}</li>
           <li><i class="fas fa-check"></i> ${airline.perks[1] || 'Assento padrão'}</li>
         </ul>
       </div>
   
       <div class="modal-total">
         <span>Total (ida e volta)</span>
         <strong>R$ ${(offer.price * 2).toLocaleString('pt-BR')}</strong>
         <small>por pessoa</small>
       </div>
   
       <a href="${airline.url}" target="_blank" rel="noopener noreferrer" class="offer-buy" style="width:100%;margin-top:1rem;padding:1rem;text-align:center;text-decoration:none;">
         <i class="fas fa-external-link-alt"></i> Reservar no site da ${airline.name}
       </a>
     `;
   
     document.getElementById('modalOverlay').classList.add('active');
     document.body.style.overflow = 'hidden';
   }
   
   /* ---------- MODAL DE HOTEL ---------- */
   function openHotelModal(offerId) {
     const offer = currentOffers.find(o => o.id === offerId);
     if (!offer || !offer.chain) return;
   
     const hotel = offer.chain;
     const dest = currentDestination;
     const nights = offer.nights;
   
     const hotelPhotos = [
       `https://source.unsplash.com/featured/?hotel,room,luxury,${encodeURIComponent(dest.name)}`,
       `https://source.unsplash.com/featured/?hotel,lobby,interior`,
       `https://source.unsplash.com/featured/?hotel,pool,resort`,
       `https://source.unsplash.com/featured/?hotel,bedroom,modern`
     ];
   
     document.getElementById('modalContent').innerHTML = `
       <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
       <div class="modal-hotel-gallery">
         <div class="hotel-main-photo" style="background-image: url('${hotelPhotos[0]}');"></div>
         <div class="hotel-thumbs">
           ${hotelPhotos.slice(1).map(p => `<div class="hotel-thumb" style="background-image: url('${p}');"></div>`).join('')}
         </div>
       </div>
   
       <div class="modal-hotel-header">
         <div class="modal-hotel-logo" style="background: ${hotel.color};">${hotel.logo}</div>
         <div style="flex:1;">
           <h3 style="margin:0;font-size:1.3rem;"><i class="fas fa-hotel" style="color:#ff7b2c"></i> ${hotel.name}</h3>
           <p style="color:#7a8ba8; margin:0.3rem 0 0; font-size:0.9rem;">${dest.name}${dest.state ? ', ' + dest.state : ''}</p>
           <div style="margin-top:0.5rem;">
             <span class="hotel-stars">${'⭐'.repeat(Math.max(3, Math.round(hotel.rating / 2)))}</span>
             <span style="color:#7a8ba8; font-size:0.85rem;"> ${hotel.rating}/10 · ${hotel.type}</span>
           </div>
         </div>
       </div>
   
       <div class="modal-section">
         <h4><i class="fas fa-bed"></i> Quartos disponíveis</h4>
         <div class="room-options">
           <div class="room-option">
             <div class="room-info"><strong>Quarto Standard</strong><span>1 cama de casal · 20m² · Café incluso</span></div>
             <div class="room-price">R$ ${Math.round(offer.price * 0.9).toLocaleString('pt-BR')}</div>
           </div>
           <div class="room-option">
             <div class="room-info"><strong>Quarto Superior</strong><span>1 cama king · 28m² · Café + Wi-Fi</span></div>
             <div class="room-price">R$ ${offer.price.toLocaleString('pt-BR')}</div>
           </div>
           <div class="room-option">
             <div class="room-info"><strong>Suíte Master</strong><span>1 cama king + sala · 45m² · Café + Spa</span></div>
             <div class="room-price">R$ ${Math.round(offer.price * 1.6).toLocaleString('pt-BR')}</div>
           </div>
         </div>
       </div>
   
       <div class="modal-section">
         <h4><i class="fas fa-concierge-bell"></i> Comodidades</h4>
         <div class="amenities-grid">
           <div class="amenity"><i class="fas fa-wifi"></i> Wi-Fi grátis</div>
           <div class="amenity"><i class="fas fa-swimming-pool"></i> Piscina</div>
           <div class="amenity"><i class="fas fa-utensils"></i> Restaurante</div>
           <div class="amenity"><i class="fas fa-dumbbell"></i> Academia</div>
           <div class="amenity"><i class="fas fa-spa"></i> Spa</div>
           <div class="amenity"><i class="fas fa-parking"></i> Estacionamento</div>
         </div>
       </div>
   
       <div class="modal-total">
         <span>${nights} noites</span>
         <strong>R$ ${(offer.price * nights).toLocaleString('pt-BR')}</strong>
         <small>R$ ${offer.price.toLocaleString('pt-BR')}/noite · 2 hóspedes</small>
       </div>
   
       <a href="${generateBookingUrl(offer, dest)}" target="_blank" rel="noopener noreferrer" class="offer-buy" style="width:100%;margin-top:1rem;padding:1rem;text-align:center;background:${hotel.color};text-decoration:none;">
         <i class="fas fa-external-link-alt"></i> Reservar no ${hotel.name}
       </a>
     `;
   
     document.getElementById('modalOverlay').classList.add('active');
     document.body.style.overflow = 'hidden';
   }
   
   /* ---------- IA - ROTEIRO (COM IA RECOMENDANDO) ---------- */
   async function aiGenerateItinerary() {
     const dateValue = document.getElementById('dateInput').value;
     const month = dateValue ? new Date(dateValue + 'T00:00:00').getMonth() + 1 : null;
     const monthName = month ? getMonthName(month) : '';
     const climate = document.getElementById('climateSelect').value;
     const destinationText = document.getElementById('destinationInput').value.trim();
     const originText = document.getElementById('originInput').value.trim();
     const budget = document.getElementById('budgetSelect').value;
   
     // Se tem destino específico, usa busca direta
     if (destinationText) {
       console.log(`🎯 Destino específico: ${destinationText}`);
       return await generateLocalItinerary(dateValue, month, climate, destinationText, budget);
     }
   
     // Senão, pede para a IA recomendar
     try {
       console.log('🤖 Pedindo recomendações para a IA...');
       
       const excludeList = Array.from(sessionUsedDestinations);
       const response = await fetch(`${API_URL}/api/recommend-destinations`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           origin: originText,
           month: monthName,
           climate: climate,
           budget: budget,
           count: 4,
           exclude: excludeList
         })
       });
   
       if (!response.ok) throw new Error('Falha ao buscar recomendações');
   
       const data = await response.json();
       const recommendations = data.recommendations || [];
   
       if (!recommendations.length) throw new Error('Nenhuma recomendação recebida');
   
       console.log(`✅ IA recomendou ${recommendations.length} destinos`);
   
       const chosen = recommendations.map((r) => {
         nextAIId++;
         return {
           id: nextAIId,
           name: r.name || 'Destino',
           country: r.country || 'Brasil',
           state: r.state || '',
           region: r.region || 'Mundo',
           climate: ['calor', 'frio', 'ameno', 'tropical', 'seco'].includes(r.climate) ? r.climate : 'ameno',
           climateLabel: r.climateLabel || 'Ameno',
           bestMonths: r.bestMonths || [1,2,3,4,5,6,7,8,9,10,11,12],
           pricing: {
             flight: r.pricing?.flight ?? null,
             bus: r.pricing?.bus ?? null,
             hotelPerNight: r.pricing?.hotelPerNight || 300,
             tours: r.pricing?.tours || 300
           },
           transport: r.transport || {
             recommended: r.pricing?.flight ? 'both' : 'bus',
             flightAvailable: !!r.pricing?.flight,
             busAvailable: !!r.pricing?.bus
           },
           attractions: r.attractions || [],
           image: r.image || `https://source.unsplash.com/featured/?${encodeURIComponent(r.name)},city,travel`,
           description: r.description || '',
           rating: r.rating || 8.5,
           idealDays: r.idealDays || 3,
           tips: r.tips || '',
           whyRecommend: r.whyRecommend || '',
           activities: r.activities || [],
           fromAI: true,
           origin: originText
         };
       });
   
       chosen.forEach(d => sessionUsedDestinations.add(d.name));
   
       chosen.forEach(d => {
         if (!destinations.find(x => x.name.toLowerCase() === d.name.toLowerCase())) {
           destinations.push(d);
           console.log(`✅ Adicionado: ${d.name} (ID ${d.id})`);
         }
       });
   
       let totalDays = 0, totalFlight = 0, totalBus = 0, totalHotel = 0, totalTours = 0;
       chosen.forEach(d => {
         totalDays += d.idealDays;
         totalFlight += d.pricing.flight || 0;
         totalBus += d.pricing.bus || 0;
         totalHotel += d.pricing.hotelPerNight * d.idealDays;
         totalTours += d.pricing.tours;
       });
   
       return {
         destinations: chosen,
         totalDays, totalFlight, totalBus, totalHotel, totalTours,
         grandTotalFlight: totalFlight + totalHotel + totalTours,
         grandTotalBus: totalBus + totalHotel + totalTours,
         dateValue, month, climate, budget
       };
   
     } catch (error) {
       console.warn('⚠️ IA falhou, usando base local:', error.message);
       return await generateLocalItinerary(dateValue, month, climate, '', budget);
     }
   }
   
   /* Fallback: gera roteiro da base local */
   async function generateLocalItinerary(dateValue, month, climate, destinationText, budget) {
     let pool = destinations.filter(dest => {
       if (climate && dest.climate !== climate) return false;
       if (destinationText) {
         const s = destinationText.toLowerCase();
         if (!dest.name.toLowerCase().includes(s) && !dest.country.toLowerCase().includes(s)) return false;
       }
       return true;
     });
     if (!pool.length) pool = [...destinations];
   
     const poolFiltrado = pool.filter(d => !sessionUsedDestinations.has(d.name));
     if (poolFiltrado.length >= 4) {
       pool = poolFiltrado;
     } else {
       sessionUsedDestinations.clear();
     }
   
     const scored = pool.map(dest => {
       const ratingScore = dest.rating * 10;
       const monthBonus = (month && dest.bestMonths.includes(Number(month))) ? 20 : 0;
       const attractionsBonus = dest.attractions.length * 1.5;
       const randomFactor = Math.random() * 25;
       return { ...dest, _score: ratingScore + monthBonus + attractionsBonus + randomFactor };
     });
   
     scored.sort((a, b) => b._score - a._score);
   
     const numDestinos = Math.min(6, Math.max(3, 3 + Math.floor(Math.random() * 4)));
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
   
     chosen.sort(() => Math.random() - 0.5);
     chosen.forEach(d => sessionUsedDestinations.add(d.name));
   
     let totalDays = 0, totalFlight = 0, totalBus = 0, totalHotel = 0, totalTours = 0;
     chosen.forEach(d => {
       totalDays += d.idealDays;
       totalFlight += d.pricing.flight || 0;
       totalBus += d.pricing.bus || 0;
       totalHotel += d.pricing.hotelPerNight * d.idealDays;
       totalTours += d.pricing.tours;
     });
   
     return {
       destinations: chosen,
       totalDays, totalFlight, totalBus, totalHotel, totalTours,
       grandTotalFlight: totalFlight + totalHotel + totalTours,
       grandTotalBus: totalBus + totalHotel + totalTours,
       dateValue, month, climate, budget
     };
   }
   
   function resetSessionMemory() {
     sessionUsedDestinations.clear();
     console.log('🔄 Memória de sessão resetada');
   }
   
   /* ---------- RENDERIZAÇÃO DO ROTEIRO ---------- */
   function renderItinerary(itinerary) {
     const summary = document.getElementById('itinerarySummary');
     const timeline = document.getElementById('itineraryTimeline');
   
     let monthLabel = "Flexível";
     if (itinerary.dateValue) {
       const d = new Date(itinerary.dateValue + 'T00:00:00');
       const monthsFull = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
       monthLabel = `${d.getDate()} de ${monthsFull[d.getMonth()]} de ${d.getFullYear()}`;
     } else if (itinerary.month) {
       monthLabel = getMonthName(Number(itinerary.month));
     }
     
     const climateLabel = itinerary.climate ? { calor:"Quente", frio:"Frio", ameno:"Ameno", tropical:"Tropical", seco:"Seco" }[itinerary.climate] : "Variado";
   
     summary.innerHTML = `
       <div class="summary-card"><i class="fas fa-map-marked-alt"></i><span class="label">Destinos</span><span class="value">${itinerary.destinations.length}</span><span class="sub">${itinerary.destinations.map(d => d.name).join(' → ')}</span></div>
       <div class="summary-card"><i class="fas fa-clock"></i><span class="label">Duração</span><span class="value">${itinerary.totalDays} dias</span><span class="sub">Roteiro dia a dia</span></div>
       <div class="summary-card"><i class="fas fa-calendar-alt"></i><span class="label">Época</span><span class="value">${monthLabel}</span><span class="sub">Clima: ${climateLabel}</span></div>
       <div class="summary-card"><i class="fas fa-wallet"></i><span class="label">Total (avião)</span><span class="value">R$ ${itinerary.grandTotalFlight.toLocaleString('pt-BR')}</span><span class="sub">por pessoa</span></div>
       ${itinerary.totalBus > 0 ? `<div class="summary-card"><i class="fas fa-bus"></i><span class="label">Total (ônibus)</span><span class="value">R$ ${itinerary.grandTotalBus.toLocaleString('pt-BR')}</span><span class="sub">por pessoa</span></div>` : ''}
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
   
       const hasFlight = dest.pricing.flight !== null && dest.pricing.flight !== undefined;
       const hasBus = dest.pricing.bus !== null && dest.pricing.bus !== undefined;
       const destTotalFlight = hasFlight ? dest.pricing.flight + (dest.pricing.hotelPerNight * dest.idealDays) + dest.pricing.tours : null;
       const destTotalBus = hasBus ? dest.pricing.bus + (dest.pricing.hotelPerNight * dest.idealDays) + dest.pricing.tours : null;
   
       const destQuery = encodeURIComponent(`${dest.name}, ${dest.country}`);
       const dates = getBookingDates(dest.idealDays);
       const hotelsUrl = `https://www.booking.com/searchresults.pt-br.html?ss=${destQuery}&checkin=${dates.checkin}&checkout=${dates.checkout}&group_adults=2`;
       const flightsUrl = `https://www.google.com/travel/flights?q=voos+para+${encodeURIComponent(dest.name)}`;
       const busUrl = `https://www.clickbus.com.br/`;
       const packagesUrl = `https://www.decolar.com/pacotes/`;
   
       html += `
         <div class="timeline-item">
           <div class="timeline-item-img" style="background-image: linear-gradient(0deg,#00000070,#00000020), url('${dest.image}');">
             <span class="timeline-day-badge"><i class="fas fa-calendar-day"></i> Dias ${startDay}–${endDay}</span>
           </div>
           <div class="timeline-item-content">
             <div class="timeline-dest-name"><i class="fas fa-map-pin"></i> ${dest.name}${dest.state ? ', ' + dest.state : ', ' + dest.country}</div>
             <div class="timeline-meta">
               <span><i class="fas fa-sun"></i> ${dest.climateLabel}</span>
               <span><i class="fas fa-clock"></i> ${dest.idealDays} dias</span>
               <span><i class="fas fa-star"></i> ${dest.rating}/10</span>
             </div>
             ${dest.whyRecommend ? `
             <div style="background:linear-gradient(135deg,#f0ecff,#ffe8d9); padding:0.7rem 1rem; border-radius:0.8rem; font-size:0.85rem; color:#5c3ec9; font-weight:600;">
               <i class="fas fa-wand-magic-sparkles"></i> ${dest.whyRecommend}
             </div>` : ''}
             <div class="timeline-activities">
               <h5><i class="fas fa-list-check"></i> Roteiro dia a dia</h5>
               <div class="day-plan">${dayPlan}</div>
             </div>
             ${destTotalFlight !== null ? `
             <div class="timeline-price">
               <span><i class="fas fa-plane"></i> Custo com avião</span>
               <strong>R$ ${destTotalFlight.toLocaleString('pt-BR')}</strong>
             </div>` : ''}
             ${destTotalBus !== null ? `
             <div class="timeline-price" style="background:linear-gradient(135deg,#e8f5e0,#d4ecc4);">
               <span><i class="fas fa-bus"></i> Custo com ônibus</span>
               <strong style="color:#0d7a4a;">R$ ${destTotalBus.toLocaleString('pt-BR')}</strong>
             </div>` : ''}
             <div class="timeline-actions">
               <a href="${hotelsUrl}" target="_blank" rel="noopener noreferrer" class="timeline-btn hotels"><i class="fas fa-hotel"></i> Ver Hotéis</a>
               ${hasFlight ? `<a href="${flightsUrl}" target="_blank" rel="noopener noreferrer" class="timeline-btn flights"><i class="fas fa-plane"></i> Ver Voos</a>` : ''}
               ${hasBus ? `<a href="${busUrl}" target="_blank" rel="noopener noreferrer" class="timeline-btn bus"><i class="fas fa-bus"></i> Ver Ônibus</a>` : ''}
               <a href="${packagesUrl}" target="_blank" rel="noopener noreferrer" class="timeline-btn packages"><i class="fas fa-box-open"></i> Pacotes</a>
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
             ${itinerary.totalFlight > 0 ? `<span><i class="fas fa-plane"></i> Voos: R$ ${itinerary.totalFlight.toLocaleString('pt-BR')}</span>` : ''}
             ${itinerary.totalBus > 0 ? `<span><i class="fas fa-bus"></i> Ônibus: R$ ${itinerary.totalBus.toLocaleString('pt-BR')}</span>` : ''}
             <span><i class="fas fa-hotel"></i> Hotéis: R$ ${itinerary.totalHotel.toLocaleString('pt-BR')}</span>
             <span><i class="fas fa-ticket"></i> Passeios: R$ ${itinerary.totalTours.toLocaleString('pt-BR')}</span>
           </div>
           ${itinerary.totalFlight > 0 ? `
           <div class="timeline-price" style="background:white;margin-top:0.8rem;">
             <span style="font-size:1rem;"><i class="fas fa-plane"></i> Total com avião</span>
             <strong style="font-size:1.6rem;">R$ ${itinerary.grandTotalFlight.toLocaleString('pt-BR')}</strong>
           </div>` : ''}
           ${itinerary.totalBus > 0 ? `
           <div class="timeline-price" style="background:white;margin-top:0.5rem;">
             <span style="font-size:1rem;"><i class="fas fa-bus"></i> Total com ônibus</span>
             <strong style="font-size:1.6rem;color:#0d7a4a;">R$ ${itinerary.grandTotalBus.toLocaleString('pt-BR')}</strong>
           </div>` : ''}
         </div>
       </div>
     `;
     timeline.innerHTML = html;
   }
   
   async function runAISearch() {
     const loading = document.getElementById('aiLoading');
     const summary = document.getElementById('itinerarySummary');
     const timeline = document.getElementById('itineraryTimeline');
   
     const loadingMessages = [
       'IA analisando seu perfil...',
       'Consultando destinos pelo mundo...',
       'Escolhendo as melhores opções para você...',
       'Calculando preços e roteiro...',
       'Montando sua viagem dos sonhos...'
     ];
     const msg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
     
     summary.innerHTML = '';
     timeline.innerHTML = '';
     loading.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i><span>${msg}</span>`;
     loading.style.display = 'block';
     showScreen('itineraryScreen');
   
     try {
       const itinerary = await aiGenerateItinerary();
       loading.style.display = 'none';
       renderItinerary(itinerary);
     } catch (error) {
       console.error('❌ Erro ao gerar roteiro:', error);
       loading.style.display = 'none';
       summary.innerHTML = `
         <div class="empty-state" style="grid-column:1/-1;">
           <i class="fas fa-exclamation-triangle"></i><br>
           Erro ao gerar roteiro.<br>
           <span style="font-size:0.9rem;">${error.message}</span>
         </div>`;
     }
   }
   
   /* ---------- MODAL PRINCIPAL ---------- */
   function openModal(id) {
     const idNum = parseInt(id, 10);
     const dest = destinations.find(d => d.id === idNum);
     
     if (!dest) {
       alert('Destino não encontrado.');
       return;
     }
   
     const nights = dest.idealDays;
     const hotelTotal = calculateHotelTotal(dest.pricing, nights);
     const hasFlight = dest.pricing.flight !== null && dest.pricing.flight !== undefined;
     const hasBus = dest.pricing.bus !== null && dest.pricing.bus !== undefined;
     const totalFlight = hasFlight ? dest.pricing.flight + hotelTotal + dest.pricing.tours : null;
     const totalBus = hasBus ? dest.pricing.bus + hotelTotal + dest.pricing.tours : null;
   
     const destQuery = encodeURIComponent(`${dest.name}, ${dest.country}`);
     const dates = getBookingDates(nights);
     const hotelsUrl = `https://www.booking.com/searchresults.pt-br.html?ss=${destQuery}&checkin=${dates.checkin}&checkout=${dates.checkout}&group_adults=2`;
     const flightsUrl = `https://www.google.com/travel/flights?q=voos+para+${encodeURIComponent(dest.name)}`;
     const busUrl = `https://www.clickbus.com.br/`;
   
     document.getElementById('modalContent').innerHTML = `
       <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
       <h3><i class="fas fa-map-pin" style="color:#ff7b2c"></i> ${dest.name}</h3>
       <p class="modal-sub">${dest.state ? dest.state + ' · ' : ''}${dest.country} · ${dest.region} · ${dest.climateLabel}</p>
   
       <div class="modal-section">
         <h4><i class="fas fa-check-circle"></i> O que está incluso</h4>
         <ul class="included-list">
           ${hasFlight ? `<li><i class="fas fa-plane"></i> Voo ida/volta (R$ ${dest.pricing.flight.toLocaleString('pt-BR')})</li>` : ''}
           ${hasBus ? `<li><i class="fas fa-bus"></i> Ônibus ida/volta (R$ ${dest.pricing.bus.toLocaleString('pt-BR')})</li>` : ''}
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
         <h4><i class="fas fa-lightbulb"></i> Dica</h4>
         <p style="font-size:0.9rem;color:#2f405c;line-height:1.5;">${dest.tips}</p>
       </div>
   
       ${dest.fromAI ? `
       <div class="ai-warning">
         <i class="fas fa-info-circle"></i>
         <span>Informações geradas por IA. Confirme atrações e preços antes de viajar.</span>
       </div>` : ''}
   
       ${totalFlight !== null ? `
       <div class="modal-total">
         <span>Total com avião</span>
         <strong>R$ ${totalFlight.toLocaleString('pt-BR')}</strong>
         <small>por pessoa</small>
       </div>` : ''}
   
       ${totalBus !== null ? `
       <div class="modal-total" style="background:linear-gradient(135deg,#e8f5e0,#d4ecc4);">
         <span>Total com ônibus</span>
         <strong style="color:#0d7a4a;">R$ ${totalBus.toLocaleString('pt-BR')}</strong>
         <small>por pessoa</small>
       </div>` : ''}
   
       <div class="modal-actions">
         <a href="${hotelsUrl}" target="_blank" rel="noopener noreferrer" class="modal-btn hotels"><i class="fas fa-hotel"></i> Hotéis</a>
         ${hasFlight ? `<a href="${flightsUrl}" target="_blank" rel="noopener noreferrer" class="modal-btn flights"><i class="fas fa-plane"></i> Voos</a>` : ''}
         ${hasBus ? `<a href="${busUrl}" target="_blank" rel="noopener noreferrer" class="modal-btn bus"><i class="fas fa-bus"></i> Ônibus</a>` : ''}
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
   
   /* ---------- INICIALIZAÇÃO ---------- */
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
         document.querySelectorAll('#cardsContainer .card').forEach(card => {
           const badge = card.querySelector('.climate-badge')?.textContent.toLowerCase() || '';
           card.style.display = (filter === 'all' || badge.includes(filter)) ? '' : 'none';
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
   
   /* ---------- EXPÕE GLOBALMENTE ---------- */
   window.openModal = openModal;
   window.openPackages = openPackages;
   window.openModalByName = openModalByName;
   window.openPackagesByName = openPackagesByName;
   window.openFlightModal = openFlightModal;
   window.openHotelModal = openHotelModal;
   window.closeModal = closeModal;
   window.resetSessionMemory = resetSessionMemory;
   
   console.log('✅ ViaGen AI carregado. IA está recomendando destinos!');
