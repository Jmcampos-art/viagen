import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ============================================================
   CACHE DE IMAGENS (evita requisições repetidas)
   ============================================================ */
const imageCache = new Map();

/* ============================================================
   BUSCAR IMAGEM VIA WIKIMEDIA COMMONS (grátis, sem chave)
   ============================================================ */
async function buscarImagemCidade(nomeCidade, pontoTuristico = '') {
  const cacheKey = `${nomeCidade}_${pontoTuristico}`.toLowerCase();
  
  // ✅ Cache em memória
  if (imageCache.has(cacheKey)) {
    console.log(`💾 Imagem em cache: ${cacheKey}`);
    return imageCache.get(cacheKey);
  }

  // ✅ Fallbacks de imagem (nunca fica em branco)
  const FALLBACKS = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1600&q=80'
  ];

  const getFallback = () => FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

  // Ordem de tentativas
  const queries = [
    pontoTuristico ? `${nomeCidade} ${pontoTuristico}` : null,
    `${nomeCidade} city`,
    `${nomeCidade} skyline`,
    `${nomeCidade} tourism`,
    nomeCidade
  ].filter(Boolean);

  for (const query of queries) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1600&format=json&origin=*`;
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'ViaGenAI/1.0 (travel-planner)' }
      });

      if (!response.ok) continue;

      const data = await response.json();
      
      if (data.query?.pages) {
        const pages = Object.values(data.query.pages);
        
        for (const page of pages) {
          const imageInfo = page.imageinfo?.[0];
          if (imageInfo?.thumburl) {
            const imgUrl = imageInfo.thumburl;
            // Filtra imagens válidas (não SVG/ícones)
            if (imgUrl.match(/\.(jpg|jpeg|png|webp)/i) || imgUrl.includes('/thumb/')) {
              console.log(`✅ Wikimedia: "${query}" → ${imgUrl.substring(0, 80)}...`);
              imageCache.set(cacheKey, imgUrl);
              return imgUrl;
            }
          }
        }
      }
    } catch (error) {
      console.log(`⚠️ Erro Wikimedia ("${query}"):`, error.message);
      continue;
    }
  }

  // Se não achou nada, usa fallback genérico
  console.log(`❌ Nenhuma imagem encontrada para "${nomeCidade}". Usando fallback.`);
  const fallback = getFallback();
  imageCache.set(cacheKey, fallback);
  return fallback;
}

/* ============================================================
   BANCO DE CIDADES BRASILEIRAS
   ============================================================ */
const CIDADES_BR = {
  "sao paulo": "SP", "são paulo": "SP", "capital sp": "SP",
  "botucatu": "SP", "itu": "SP", "santos": "SP", "campinas": "SP",
  "bauru": "SP", "ribeirao preto": "SP", "ribeirão preto": "SP",
  "sao jose dos campos": "SP", "são josé dos campos": "SP",
  "sorocaba": "SP", "osasco": "SP", "santo andre": "SP", "santo andré": "SP",
  "sao bernardo do campo": "SP", "são bernardo do campo": "SP",
  "guarulhos": "SP", "piracicaba": "SP", "franca": "SP", "marilia": "SP", "marília": "SP",
  "presidente prudente": "SP", "aracatuba": "SP", "limeira": "SP", "taubate": "SP", "taubaté": "SP",
  "suzano": "SP", "mogi das cruzes": "SP", "jundiai": "SP", "jundiaí": "SP",
  "americana": "SP", "indaiatuba": "SP", "hortolandia": "SP", "hortolândia": "SP",
  "sumare": "SP", "sumaré": "SP", "valinhos": "SP", "vinhedo": "SP",
  "atibaia": "SP", "braganca paulista": "SP", "bragança paulista": "SP",
  "pindamonhangaba": "SP", "guaratingueta": "SP", "guaratinguetá": "SP",
  "lorena": "SP", "aparecida": "SP", "cruzeiro": "SP", "cachoeira paulista": "SP",
  "registro": "SP", "itanhaem": "SP", "itanhaém": "SP", "praia grande": "SP",
  "guaruja": "SP", "guarujá": "SP", "bertioga": "SP", "sao vicente": "SP", "são vicente": "SP",
  "mongagua": "SP", "mongaguá": "SP", "peruibe": "SP", "peruíbe": "SP",
  "ilha bela": "SP", "ilhabela": "SP", "caraguatatuba": "SP", "ubatuba": "SP",
  "sao sebastiao": "SP", "são sebastião": "SP",
  "cacapava": "SP", "caçapava": "SP", "jacarei": "SP", "jacareí": "SP",
  "sertaozinho": "SP", "sertãozinho": "SP", "jaboticabal": "SP",
  "araraquara": "SP", "sao carlos": "SP", "são carlos": "SP",
  "rio claro": "SP", "piraciaba": "SP",

  "rio de janeiro": "RJ", "niteroi": "RJ", "niterói": "RJ", "nova iguacu": "RJ", "nova iguaçu": "RJ",
  "duque de caxias": "RJ", "sao goncalo": "RJ", "são gonçalo": "RJ",
  "belford roxo": "RJ", "campos dos goytacazes": "RJ", "petropolis": "RJ", "petrópolis": "RJ",
  "volta redonda": "RJ", "barra mansa": "RJ", "resende": "RJ", "angra dos reis": "RJ",
  "cabo frio": "RJ", "buzios": "RJ", "búzios": "RJ", "armacao dos buzios": "RJ", "arraial do cabo": "RJ",
  "teresopolis": "RJ", "teresópolis": "RJ", "macae": "RJ", "macaé": "RJ",
  "nova friburgo": "RJ", "itaborai": "RJ", "itaboraí": "RJ",
  "mage": "RJ", "magé": "RJ", "queimados": "RJ", "nilopolis": "RJ", "nilópolis": "RJ",
  "marica": "RJ", "maricá": "RJ", "saquarema": "RJ", "rio das ostras": "RJ",

  "belo horizonte": "MG", "bh": "MG", "uberlandia": "MG", "uberlândia": "MG",
  "contagem": "MG", "betim": "MG", "juiz de fora": "MG", "montes claros": "MG",
  "uberaba": "MG", "governador valadares": "MG", "ipatinga": "MG", "sete lagoas": "MG",
  "divinopolis": "MG", "divinópolis": "MG", "santa luzia": "MG",
  "pocos de caldas": "MG", "poços de caldas": "MG",
  "ouro preto": "MG", "mariana": "MG", "tiradentes": "MG", "sao joao del rei": "MG",
  "congonhas": "MG", "sabara": "MG", "nova lima": "MG", "vespasiano": "MG",
  "araxa": "MG", "patos de minas": "MG", "lavras": "MG", "varginha": "MG",
  "pouso alegre": "MG", "alfenas": "MG", "passos": "MG", "itajuba": "MG",
  "barbacena": "MG", "caratinga": "MG", "teofilo otoni": "MG", "curvelo": "MG",

  "vitoria": "ES", "vitória": "ES", "vila velha": "ES", "cariacica": "ES",
  "serra": "ES", "guarapari": "ES", "linhares": "ES", "colatina": "ES",
  "sao mateus": "ES", "são mateus": "ES", "aracruz": "ES",
  "cachoeiro de itapemirim": "ES", "venda nova do imigrante": "ES",

  "curitiba": "PR", "londrina": "PR", "maringa": "PR", "maringá": "PR",
  "ponta grossa": "PR", "cascavel": "PR", "sao jose dos pinhais": "PR",
  "foz do iguacu": "PR", "foz do iguaçu": "PR", "colombo": "PR", "guarapuava": "PR",
  "paranagua": "PR", "paranaguá": "PR", "araucaria": "PR", "toledo": "PR",
  "apucarana": "PR", "pinhais": "PR", "campo largo": "PR",
  "campo mourao": "PR", "umuarama": "PR", "cianorte": "PR",
  "pato branco": "PR", "francisco beltrao": "PR", "castro": "PR",
  "uniao da vitoria": "PR", "união da vitória": "PR",

  "florianopolis": "SC", "florianópolis": "SC", "joinville": "SC", "blumenau": "SC",
  "sao jose": "SC", "são josé": "SC", "criciuma": "SC", "criciúma": "SC",
  "chapeco": "SC", "chapecó": "SC", "itajai": "SC", "itajaí": "SC",
  "jaragua do sul": "SC", "jaraguá do sul": "SC", "palhoca": "SC", "palhoça": "SC",
  "lages": "SC", "balneario camboriu": "SC", "balneário camboriú": "SC",
  "camboriu": "SC", "camboriú": "SC", "brusque": "SC", "tubarao": "SC", "tubarão": "SC",
  "cacador": "SC", "caçador": "SC", "concordia": "SC", "concórdia": "SC",
  "rio do sul": "SC", "navegantes": "SC", "penha": "SC", "bombinhas": "SC",
  "porto belo": "SC", "itapema": "SC", "garopaba": "SC", "imbituba": "SC", "laguna": "SC",

  "porto alegre": "RS", "caxias do sul": "RS", "pelotas": "RS", "canoas": "RS",
  "santa maria": "RS", "gravatai": "RS", "gravataí": "RS", "viamao": "RS", "viamão": "RS",
  "novo hamburgo": "RS", "sao leopoldo": "RS", "são leopoldo": "RS",
  "rio grande": "RS", "alvorada": "RS", "passo fundo": "RS", "sapucaia do sul": "RS",
  "santa cruz do sul": "RS", "cachoeirinha": "RS", "bage": "RS",
  "bento goncalves": "RS", "bento gonçalves": "RS", "gramado": "RS", "canela": "RS",
  "uruguaiana": "RS", "santa rosa": "RS", "santo angelo": "RS", "erechim": "RS",
  "ijui": "RS", "cruz alta": "RS", "lajeado": "RS", "cachoeira do sul": "RS",
  "farroupilha": "RS", "flores da cunha": "RS",
  "torres": "RS", "tramandai": "RS", "tramandaí": "RS", "capao da canoa": "RS",

  "salvador": "BA", "feira de santana": "BA", "vitoria da conquista": "BA",
  "camacari": "BA", "camaçari": "BA", "itabuna": "BA", "ilheus": "BA", "ilhéus": "BA",
  "juazeiro": "BA", "lauro de freitas": "BA", "barreiras": "BA", "porto seguro": "BA",
  "alagoinhas": "BA", "teixeira de freitas": "BA", "paulo afonso": "BA",
  "eunapolis": "BA", "eunápolis": "BA", "jequie": "BA", "jequié": "BA",

  "aracaju": "SE", "sao cristovao": "SE", "são cristóvão": "SE",
  "nossa senhora do socorro": "SE", "lagarto": "SE", "itabaiana": "SE",
  "estancia": "SE", "estância": "SE",

  "recife": "PE", "jaboatao dos guararapes": "PE", "jaboatão dos guararapes": "PE",
  "olinda": "PE", "caruaru": "PE", "paulista": "PE", "petrolina": "PE",
  "cabo de santo agostinho": "PE", "camaragibe": "PE", "garanhuns": "PE",
  "igarassu": "PE", "serra talhada": "PE", "arcoverde": "PE",
  "porto de galinhas": "PE", "ipojuca": "PE", "tamandare": "PE",

  "fortaleza": "CE", "caucaia": "CE", "juazeiro do norte": "CE", "maracanau": "CE",
  "sobral": "CE", "crato": "CE", "itapipoca": "CE", "maranguape": "CE",
  "iguatu": "CE", "quixada": "CE", "pacatuba": "CE", "aquiraz": "CE",
  "eusebio": "CE", "horizonte": "CE", "canoa quebrada": "CE", "arica": "CE",
  "jericoacoara": "CE", "cumbuco": "CE", "paracuru": "CE",

  "natal": "RN", "mossoro": "RN", "parnamirim": "RN",
  "sao goncalo do amarante": "RN", "são gonçalo do amarante": "RN",
  "macaiba": "RN", "ceara-mirim": "RN", "extremoz": "RN",
  "pipa": "RN", "tibau do sul": "RN", "arerias": "RN",

  "joao pessoa": "PB", "joão pessoa": "PB", "campina grande": "PB",
  "santa rita": "PB", "patos": "PB", "bayeux": "PB",
  "cabedelo": "PB", "cajazeiras": "PB", "sousa": "PB", "guarabira": "PB",

  "maceio": "AL", "maceió": "AL", "arapiraca": "AL",
  "palmeira dos indios": "AL", "rio largo": "AL",
  "marechal deodoro": "AL", "penedo": "AL", "coruripe": "AL", "maragogi": "AL",

  "sao luis": "MA", "são luís": "MA", "imperatriz": "MA", "timon": "MA",
  "caxias": "MA", "codo": "MA", "paco do lumiar": "MA",
  "bacabal": "MA", "balsas": "MA", "santa ines": "MA",
  "barreirinhas": "MA", "tutoia": "MA",

  "teresina": "PI", "parnaiba": "PI", "picos": "PI",
  "floriano": "PI", "piripiri": "PI", "campo maior": "PI", "barras": "PI",

  "palmas": "TO", "araguaina": "TO", "gurupi": "TO",
  "porto nacional": "TO", "paraiso do tocantins": "TO",

  "belem": "PA", "belém": "PA", "ananindeua": "PA", "santarem": "PA",
  "maraba": "PA", "castanhal": "PA", "abaetetuba": "PA",
  "cameta": "PA", "altamira": "PA", "tucurui": "PA",
  "parauapebas": "PA", "paragominas": "PA", "barcarena": "PA",

  "manaus": "AM", "parintins": "AM", "itacoatiara": "AM", "manacapuru": "AM",
  "coari": "AM", "tabatinga": "AM", "maues": "AM",

  "rio branco": "AC", "cruzeiro do sul": "AC", "senador guiomard": "AC",
  "sena madureira": "AC", "tarauaca": "AC",

  "porto velho": "RO", "ji-parana": "RO", "ariquemes": "RO",
  "cacoal": "RO", "vilhena": "RO", "rolim de moura": "RO",

  "boa vista": "RR", "rorainopolis": "RR",

  "macapa": "AP", "santana": "AP", "laranjal do jari": "AP",

  "cuiaba": "MT", "cuiabá": "MT", "varzea grande": "MT", "várzea grande": "MT",
  "rondonopolis": "MT", "sinop": "MT", "tangara da serra": "MT",
  "caceres": "MT", "barra do garcas": "MT", "alta floresta": "MT",
  "primavera do leste": "MT", "lucas do rio verde": "MT",
  "chapada dos guimaraes": "MT", "pocone": "MT",

  "campo grande": "MS", "dourados": "MS", "tres lagoas": "MS",
  "corumba": "MS", "ponta pora": "MS", "navirai": "MS",
  "aquidauana": "MS", "nova andradina": "MS", "sidrolandia": "MS",
  "paranaiba": "MS", "coxim": "MS", "bonito": "MS", "jardim": "MS",

  "goiania": "GO", "aparecida de goiania": "GO", "anapolis": "GO",
  "rio verde": "GO", "luziania": "GO", "senador canedo": "GO",
  "trindade": "GO", "formosa": "GO", "catalao": "GO",
  "itumbiara": "GO", "jatai": "GO", "mineiros": "GO",
  "caldas novas": "GO", "goias": "GO", "pirenopolis": "GO",

  "brasilia": "DF", "ceilandia": "DF", "taguatinga": "DF",
  "samambaia": "DF", "planaltina": "DF", "guara": "DF",
  "sobradinho": "DF", "recanto das emas": "DF", "gama": "DF",

  "lisboa": "PT", "porto": "PT", "paris": "FR", "roma": "IT",
  "barcelona": "ES", "madri": "ES", "londres": "UK",
  "nova york": "US", "miami": "US", "orlando": "US",
  "buenos aires": "AR", "santiago": "CL", "montevideu": "UY",
  "toquio": "JP", "cancun": "MX", "dubai": "AE",
  "cairo": "EG", "bali": "ID", "sydney": "AU"
};

/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */
function getEstado(cidade) {
  if (!cidade) return null;
  const nome = cidade.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  if (CIDADES_BR[nome]) return CIDADES_BR[nome];
  
  for (const [key, uf] of Object.entries(CIDADES_BR)) {
    const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (keyNorm === nome) return uf;
  }
  
  for (const [key, uf] of Object.entries(CIDADES_BR)) {
    const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (keyNorm.includes(nome) || nome.includes(keyNorm)) {
      if (nome.length >= 4) return uf;
    }
  }
  
  return null;
}

function decidirTransporte(origem, destino) {
  const ufOrigem = getEstado(origem);
  const ufDestino = getEstado(destino);

  if (!ufOrigem || !ufDestino) {
    return {
      recomendado: 'both',
      disponivel: { flight: true, bus: true },
      motivo: 'Estados não identificados',
      ufOrigem, ufDestino
    };
  }

  if (ufOrigem === ufDestino) {
    return {
      recomendado: 'bus',
      disponivel: { flight: false, bus: true },
      motivo: `Mesmo estado (${ufOrigem})`,
      ufOrigem, ufDestino
    };
  }

  return {
    recomendado: 'both',
    disponivel: { flight: true, bus: true },
    motivo: `Estados diferentes (${ufOrigem} → ${ufDestino})`,
    ufOrigem, ufDestino
  };
}

function destinoUFNome(uf) {
  const map = {
    "SP": "São Paulo", "RJ": "Rio de Janeiro", "MG": "Minas Gerais",
    "ES": "Espírito Santo", "PR": "Paraná", "SC": "Santa Catarina",
    "RS": "Rio Grande do Sul", "BA": "Bahia", "SE": "Sergipe",
    "PE": "Pernambuco", "CE": "Ceará", "RN": "Rio Grande do Norte",
    "PB": "Paraíba", "AL": "Alagoas", "MA": "Maranhão", "PI": "Piauí",
    "TO": "Tocantins", "PA": "Pará", "AM": "Amazonas", "AC": "Acre",
    "RO": "Rondônia", "RR": "Roraima", "AP": "Amapá", "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul", "GO": "Goiás", "DF": "Distrito Federal"
  };
  return map[uf] || uf;
}

/* ============================================================
   ROTA RAIZ
   ============================================================ */
app.get('/', (req, res) => {
  res.json({
    status: 'Backend ViaGen AI + Groq funcionando! 🚀',
    modelo: 'openai/gpt-oss-120b',
    cidades: Object.keys(CIDADES_BR).length,
    imagensCache: imageCache.size,
    rotas: [
      'GET /', 
      'GET /test-ai', 
      'GET /test-estado', 
      'GET /test-image?cidade=Rio',
      'POST /api/search-destination', 
      'POST /api/recommend-destinations',
      'POST /api/generate-by-climate',
      'POST /api/itinerary'
    ]
  });
});

app.get('/test-estado', (req, res) => {
  const cidade = req.query.cidade || 'botucatu';
  res.json({ cidade, estado: getEstado(cidade) });
});

/* Rota de teste de imagem */
app.get('/test-image', async (req, res) => {
  const cidade = req.query.cidade || 'Rio de Janeiro';
  const ponto = req.query.ponto || '';
  
  const imagem = await buscarImagemCidade(cidade, ponto);
  res.json({ cidade, ponto, imagem });
});

app.get('/test-ai', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: "Responda apenas: FUNCIONANDO" }],
      max_tokens: 50
    });
    res.json({
      status: "✅ IA funcionando!",
      resposta: completion.choices[0]?.message?.content?.trim() || "(vazio)",
      chaveGroq: process.env.GROQ_API_KEY ? "✅ Configurada" : "❌ NÃO CONFIGURADA"
    });
  } catch (error) {
    res.status(500).json({ status: "❌ IA com erro", erro: error.message });
  }
});

/* ============================================================
   ROTA: /api/search-destination
   ============================================================ */
app.post('/api/search-destination', async (req, res) => {
  try {
    const { query, origin, date, climate, budget } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query muito curta' });
    }

    const transporte = decidirTransporte(origin, query);
    console.log(`🔍 "${origin}" → "${query}" | ${transporte.motivo}`);

    let instrucaoTransporte = '';
    if (transporte.recomendado === 'bus') {
      instrucaoTransporte = `
⚠️ REGRA DE TRANSPORTE:
- Origem e destino estão no MESMO ESTADO (${transporte.ufOrigem})
- APENAS ÔNIBUS. Defina "pricing.flight": null, "pricing.bus": valor
- "transport.recommended": "bus", "transport.flightAvailable": false
`;
    } else if (transporte.ufOrigem && transporte.ufDestino) {
      instrucaoTransporte = `
⚠️ REGRA DE TRANSPORTE:
- Estados diferentes (${transporte.ufOrigem} → ${transporte.ufDestino})
- Mostre AMBOS (avião E ônibus)
`;
    } else {
      instrucaoTransporte = `⚠️ Estados não identificados - use ambos os transportes.`;
    }

    const prompt = `
Você é um especialista em viagens brasileiro. Crie um perfil COMPLETO de destino em português do Brasil.

DADOS:
- Destino: "${query}"
- Origem: "${origin || 'Não informada'}"
- Data: ${date || 'Flexível'}
- Clima: ${climate || 'Variado'}
- Orçamento: ${budget || 'Sem restrição'}

${instrucaoTransporte}

⚠️ REGRAS SOBRE ATRAÇÕES (NÃO INVENTE):
1. NUNCA invente atrações, parques, museus ou pontos turísticos
2. Se não souber atrações REAIS de "${query}", use termos GENÉRICOS: "Centro Histórico", "Praça Central", "Igreja Matriz", "Mercado Municipal"
3. Para cidades pequenas/médias, use ATRAÇÕES GENÉRICAS

FORMATO (JSON puro):
{
  "id": 9999,
  "name": "Nome da Cidade",
  "country": "Brasil",
  "state": "Estado",
  "region": "Região",
  "climate": "ameno",
  "climateLabel": "Ameno / Subtropical",
  "bestMonths": [1,2,3,4,5,6,7,8,9,10,11,12],
  "pricing": { "flight": null, "bus": 90, "hotelPerNight": 180, "tours": 200 },
  "transport": { "recommended": "bus", "flightAvailable": false, "busAvailable": true },
  "currency": "R$",
  "attractions": ["Praça Central", "Igreja Matriz", "Museu Municipal"],
  "description": "Descrição curta e realista",
  "rating": 8.5,
  "idealDays": 3,
  "tips": "Dica genérica mas útil",
  "activities": [
    { "day": 1, "title": "Chegada e Centro", "desc": "Conheça o centro histórico." },
    { "day": 2, "title": "Cultura Local", "desc": "Visite museus locais." },
    { "day": 3, "title": "Gastronomia", "desc": "Experimente a culinária típica." }
  ]
}

O campo "climate" DEVE ser: "calor", "frio", "ameno", "tropical" ou "seco"
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "Você é um especialista em viagens. SIGA AS INSTRUÇÕES. Responda em JSON válido." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 4000
    });

    let text = completion.choices[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const destination = JSON.parse(text);

    destination.transport = {
      recommended: transporte.recomendado,
      flightAvailable: transporte.disponivel.flight,
      busAvailable: transporte.disponivel.bus,
      distanceKm: destination.transport?.distanceKm || null
    };
    if (!transporte.disponivel.flight) destination.pricing.flight = null;
    if (!transporte.disponivel.bus) destination.pricing.bus = null;
    destination.state = destinoUFNome(transporte.ufDestino) || destination.state;

    // 🖼️ BUSCA IMAGEM REAL VIA WIKIMEDIA
    const primeiroPonto = destination.attractions?.[0] || '';
    const imagemReal = await buscarImagemCidade(destination.name, primeiroPonto);
    destination.image = imagemReal;

    console.log(`✅ ${destination.name} | Imagem: ${imagemReal.substring(0, 70)}...`);
    res.json(destination);
  } catch (error) {
    console.error('❌ Erro IA:', error);
    res.status(500).json({ error: 'Erro ao buscar destino', details: error.message });
  }
});

/* ============================================================
   ROTA: /api/recommend-destinations
   ============================================================ */
app.post('/api/recommend-destinations', async (req, res) => {
  try {
    const { origin, month, climate, budget, count, exclude } = req.body;

    console.log(`🤖 IA recomendando ${count || 4} destinos | Origem: ${origin || '?'} | Excluir: ${exclude?.length || 0}`);

    const prompt = `
Você é um especialista em viagens. Recomende ${count || 4} destinos de viagem DIFERENTES em português do Brasil.

PERFIL DO VIAJANTE:
- Saindo de: ${origin || 'Não informado (assuma São Paulo)'}
- Mês: ${month || 'Flexível'}
- Clima preferido: ${climate || 'Variado'}
- Orçamento: ${budget || 'Sem restrição'}

${exclude?.length ? `
🚫⚠️ NÃO RECOMENDE ESTES DESTINOS (já foram sugeridos):
${exclude.map(n => `- ${n}`).join('\n')}
` : ''}

REGRAS:
1. Recomende destinos REAIS que existem
2. Varie países/estados (NÃO repita o mesmo local)
3. Considere o mês, clima e orçamento
4. Misture destinos famosos e menos conhecidos

FORMATO (JSON puro):
{
  "recommendations": [
    {
      "name": "Nome da Cidade",
      "country": "País",
      "state": "Estado (se aplicável)",
      "region": "Região",
      "climate": "ameno",
      "climateLabel": "Ameno / Subtropical",
      "bestMonths": [1,2,3,4,5,6,7,8,9,10,11,12],
      "pricing": { "flight": 1200, "bus": 250, "hotelPerNight": 350, "tours": 400 },
      "transport": { "recommended": "both", "flightAvailable": true, "busAvailable": true },
      "attractions": ["Atração 1", "Atração 2", "Atração 3", "Atração 4"],
      "description": "Descrição curta em 1 frase",
      "rating": 9.0,
      "idealDays": 4,
      "tips": "Dica prática",
      "whyRecommend": "Por que estou recomendando (1 frase)",
      "activities": [
        { "day": 1, "title": "Chegada", "desc": "Descrição" },
        { "day": 2, "title": "Atração", "desc": "Descrição" },
        { "day": 3, "title": "Passeio", "desc": "Descrição" },
        { "day": 4, "title": "Despedida", "desc": "Descrição" }
      ]
    }
  ]
}

⚠️ SOBRE PREÇOS:
- Valores realistas em R$
- Voo: considere distância de ${origin || 'São Paulo'}
- Se mesmo estado: "flight": null
- Se longe (>1500km): "bus": null

O campo "climate" DEVE ser: "calor", "frio", "ameno", "tropical" ou "seco"
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "Você é um especialista em viagens que SEMPRE recomenda destinos REAIS. Nunca invente cidades. Responda APENAS em JSON válido." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 6000
    });

    let text = completion.choices[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const data = JSON.parse(text);
    const recommendations = data.recommendations || [];
    console.log(`✅ IA recomendou ${recommendations.length} destinos. Buscando imagens...`);

    // 🖼️ BUSCA IMAGENS PARA CADA RECOMENDAÇÃO
    const recommendationsComImagens = await Promise.all(
      recommendations.map(async (rec) => {
        const primeiroPonto = rec.attractions?.[0] || '';
        const imagemReal = await buscarImagemCidade(rec.name, primeiroPonto);
        rec.image = imagemReal;
        return rec;
      })
    );

    console.log(`✅ Todas as imagens prontas!`);
    res.json({ recommendations: recommendationsComImagens });
  } catch (error) {
    console.error('❌ Erro IA recomendação:', error);
    res.status(500).json({ error: 'Erro ao recomendar destinos', details: error.message });
  }
});

/* ============================================================
   ROTA: /api/generate-by-climate
   ============================================================ */
app.post('/api/generate-by-climate', async (req, res) => {
  try {
    const { climate, origin, count } = req.body;

    if (!climate) {
      return res.status(400).json({ error: 'Clima não informado' });
    }

    const climateMap = {
      calor: 'Quente / Tropical (temperaturas altas, praias, sol)',
      frio: 'Frio / Neve (temperaturas baixas, montanhas, neve)',
      ameno: 'Ameno (temperaturas agradáveis, primavera/outono)',
      tropical: 'Tropical (úmido, praias, florestas)',
      seco: 'Seco / Desértico (pouca chuva, deserto, árido)'
    };

    const climaTexto = climateMap[climate] || climate;

    console.log(`🌡️ IA gerando ${count || 8} destinos de clima "${climate}"`);

    const prompt = `
Você é um especialista em viagens. Gere ${count || 8} destinos de viagem com o seguinte CLIMA:

🌡️ CLIMA: ${climaTexto}
- Saindo de: ${origin || 'Não informado (assuma São Paulo)'}

REGRAS:
1. TODOS os destinos DEVEM ter esse clima (${climate})
2. Misture destinos brasileiros E internacionais
3. Varie os países/estados (não repita)
4. Inclua destinos conhecidos e alguns menos explorados
5. NUNCA invente cidades — use destinos REAIS

Para o clima "${climate}", exemplos:
- calor: Cancún, Miami, Natal, Maceió, Jericoacoara, Rio, Salvador, Fortaleza, Recife, Porto de Galinhas
- frio: Gramado, Canela, Campos do Jordão, Ushuaia, Bariloche, Reykjavik, Monte Verde
- tropical: Bali, Fernando de Noronha, Bonito, Chapada dos Guimarães, Alter do Chão
- ameno: Lisboa, Paris, Roma, Santiago, Buenos Aires
- seco: Cairo, Dubai, Marrakech, Atacama, Chapada Diamantina

FORMATO (JSON puro):
{
  "destinations": [
    {
      "name": "Nome da Cidade",
      "country": "País",
      "state": "Estado (se aplicável)",
      "region": "Região",
      "climate": "${climate}",
      "climateLabel": "Ex: Quente / Tropical",
      "bestMonths": [1,2,3,4,5,6,7,8,9,10,11,12],
      "pricing": { "flight": 1200, "bus": 250, "hotelPerNight": 350, "tours": 400 },
      "transport": { "recommended": "both", "flightAvailable": true, "busAvailable": true },
      "attractions": ["Atração 1", "Atração 2", "Atração 3", "Atração 4"],
      "description": "Descrição curta em 1 frase",
      "rating": 9.0,
      "idealDays": 4,
      "tips": "Dica prática",
      "activities": [
        { "day": 1, "title": "Chegada", "desc": "Descrição" },
        { "day": 2, "title": "Atração", "desc": "Descrição" },
        { "day": 3, "title": "Passeio", "desc": "Descrição" },
        { "day": 4, "title": "Despedida", "desc": "Descrição" }
      ]
    }
  ]
}

O campo "climate" DEVE ser exatamente: "${climate}"
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "Você é um especialista em viagens que SEMPRE gera destinos REAIS com o clima correto. Responda APENAS em JSON válido." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 8000
    });

    let text = completion.choices[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const data = JSON.parse(text);
    const generated = data.destinations || [];
    console.log(`✅ IA gerou ${generated.length} destinos de "${climate}". Buscando imagens...`);

    // 🖼️ BUSCA IMAGENS PARA CADA DESTINO
    const generatedComImagens = await Promise.all(
      generated.map(async (dest) => {
        const primeiroPonto = dest.attractions?.[0] || '';
        const imagemReal = await buscarImagemCidade(dest.name, primeiroPonto);
        dest.image = imagemReal;
        return dest;
      })
    );

    console.log(`✅ Todas as imagens prontas!`);
    res.json({ destinations: generatedComImagens });
  } catch (error) {
    console.error('❌ Erro IA gerar por clima:', error);
    res.status(500).json({ error: 'Erro ao gerar destinos', details: error.message });
  }
});

/* ============================================================
   ROTA: /api/itinerary
   ============================================================ */
app.post('/api/itinerary', async (req, res) => {
  try {
    const { destinations, month, climate, budget } = req.body;

    const prompt = `
Você é um agente de viagens. Crie um ROTEIRO DE VIAGEM em português do Brasil.

PERFIL:
- Destinos: ${destinations.map(d => `${d.name}, ${d.country}`).join(' → ')}
- Mês: ${month || 'Flexível'}
- Clima: ${climate || 'Variado'}
- Orçamento: ${budget || 'Sem restrição'}

Retorne JSON puro:
{
  "titulo": "Título",
  "resumo": "Resumo",
  "duracaoTotal": 14,
  "destinos": [
    {
      "nome": "Nome",
      "pais": "País",
      "dias": 4,
      "porQueVisitar": "Frase",
      "dicas": ["Dica 1"],
      "custoEstimado": 3500,
      "roteiro": [
        { "dia": 1, "titulo": "Título", "manha": "Ativ", "tarde": "Ativ", "noite": "Ativ", "refeicao": "Rest", "custoDia": 400 }
      ]
    }
  ],
  "custoTotal": 12000
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "Responda SEMPRE em JSON válido." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    let text = completion.choices[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Erro IA roteiro:', error);
    res.status(500).json({ error: 'Erro ao gerar roteiro', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`🗺️  Cidades: ${Object.keys(CIDADES_BR).length}`);
  console.log(`🖼️  Cache de imagens ativo`);
  console.log(`📋 Rotas: /api/search-destination, /api/recommend-destinations, /api/generate-by-climate, /api/itinerary`);
});