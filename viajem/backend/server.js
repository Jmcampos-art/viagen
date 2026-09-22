import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import {
  CIDADES_POR_PAIS,
  getCidadesDoPais,
  getPaisesDisponiveis,
  cidadePertenceAoPais,
  filtrarDuplicatas,
  sortearCidades
} from './cidades.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ============================================================
   CACHE DE IMAGENS
   ============================================================ */
const imageCache = new Map();

async function buscarImagemCidade(nomeCidade, pontoTuristico = '') {
  const cacheKey = `${nomeCidade}_${pontoTuristico}`.toLowerCase();

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const FALLBACKS = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1600&q=80'
  ];

  const getFallback = () => FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

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

  const fallback = getFallback();
  imageCache.set(cacheKey, fallback);
  return fallback;
}

/* ============================================================
   BANCO DE CIDADES BRASILEIRAS
   ============================================================ */
const CIDADES_BR = {
  "sao paulo": "SP", "são paulo": "SP", "botucatu": "SP", "itu": "SP", "santos": "SP",
  "campinas": "SP", "bauru": "SP", "ribeirao preto": "SP", "sao jose dos campos": "SP",
  "sorocaba": "SP", "osasco": "SP", "santo andre": "SP", "guarulhos": "SP",
  "piracicaba": "SP", "franca": "SP", "marilia": "SP", "presidente prudente": "SP",
  "aracatuba": "SP", "limeira": "SP", "taubate": "SP", "suzano": "SP",
  "mogi das cruzes": "SP", "jundiai": "SP", "americana": "SP", "indaiatuba": "SP",
  "hortolandia": "SP", "sumare": "SP", "valinhos": "SP", "vinhedo": "SP",
  "atibaia": "SP", "braganca paulista": "SP", "pindamonhangaba": "SP",
  "guaratingueta": "SP", "lorena": "SP", "aparecida": "SP", "cruzeiro": "SP",
  "registro": "SP", "itanhaem": "SP", "praia grande": "SP", "guaruja": "SP",
  "bertioga": "SP", "sao vicente": "SP", "mongagua": "SP", "peruibe": "SP",
  "ilhabela": "SP", "caraguatatuba": "SP", "ubatuba": "SP", "sao sebastiao": "SP",
  "cacapava": "SP", "jacarei": "SP", "sertaozinho": "SP", "jaboticabal": "SP",
  "araraquara": "SP", "sao carlos": "SP", "rio claro": "SP",

  "rio de janeiro": "RJ", "niteroi": "RJ", "nova iguacu": "RJ", "duque de caxias": "RJ",
  "sao goncalo": "RJ", "belford roxo": "RJ", "campos dos goytacazes": "RJ",
  "petropolis": "RJ", "volta redonda": "RJ", "barra mansa": "RJ", "resende": "RJ",
  "angra dos reis": "RJ", "cabo frio": "RJ", "buzios": "RJ", "arraial do cabo": "RJ",
  "teresopolis": "RJ", "macae": "RJ", "nova friburgo": "RJ", "itaborai": "RJ",
  "mage": "RJ", "queimados": "RJ", "nilopolis": "RJ", "marica": "RJ",
  "saquarema": "RJ", "rio das ostras": "RJ",

  "belo horizonte": "MG", "uberlandia": "MG", "contagem": "MG", "betim": "MG",
  "juiz de fora": "MG", "montes claros": "MG", "uberaba": "MG",
  "governador valadares": "MG", "ipatinga": "MG", "sete lagoas": "MG",
  "divinopolis": "MG", "santa luzia": "MG", "pocos de caldas": "MG",
  "ouro preto": "MG", "mariana": "MG", "tiradentes": "MG", "sao joao del rei": "MG",
  "congonhas": "MG", "sabara": "MG", "nova lima": "MG", "vespasiano": "MG",
  "araxa": "MG", "patos de minas": "MG", "lavras": "MG", "varginha": "MG",
  "pouso alegre": "MG", "alfenas": "MG", "passos": "MG", "itajuba": "MG",
  "barbacena": "MG", "caratinga": "MG", "teofilo otoni": "MG", "curvelo": "MG",

  "vitoria": "ES", "vila velha": "ES", "cariacica": "ES", "serra": "ES",
  "guarapari": "ES", "linhares": "ES", "colatina": "ES", "sao mateus": "ES",
  "aracruz": "ES", "cachoeiro de itapemirim": "ES", "venda nova do imigrante": "ES",

  "curitiba": "PR", "londrina": "PR", "maringa": "PR", "ponta grossa": "PR",
  "cascavel": "PR", "sao jose dos pinhais": "PR", "foz do iguacu": "PR",
  "colombo": "PR", "guarapuava": "PR", "paranagua": "PR", "araucaria": "PR",
  "toledo": "PR", "apucarana": "PR", "pinhais": "PR", "campo largo": "PR",
  "campo mourao": "PR", "umuarama": "PR", "cianorte": "PR", "pato branco": "PR",
  "francisco beltrao": "PR", "castro": "PR", "uniao da vitoria": "PR",

  "florianopolis": "SC", "joinville": "SC", "blumenau": "SC", "sao jose": "SC",
  "criciuma": "SC", "chapeco": "SC", "itajai": "SC", "jaragua do sul": "SC",
  "palhoca": "SC", "lages": "SC", "balneario camboriu": "SC", "camboriu": "SC",
  "brusque": "SC", "tubarao": "SC", "cacador": "SC", "concordia": "SC",
  "rio do sul": "SC", "navegantes": "SC", "penha": "SC", "bombinhas": "SC",
  "porto belo": "SC", "itapema": "SC", "garopaba": "SC", "imbituba": "SC", "laguna": "SC",

  "porto alegre": "RS", "caxias do sul": "RS", "pelotas": "RS", "canoas": "RS",
  "santa maria": "RS", "gravatai": "RS", "viamao": "RS", "novo hamburgo": "RS",
  "sao leopoldo": "RS", "rio grande": "RS", "alvorada": "RS", "passo fundo": "RS",
  "sapucaia do sul": "RS", "santa cruz do sul": "RS", "cachoeirinha": "RS",
  "bage": "RS", "bento goncalves": "RS", "gramado": "RS", "canela": "RS",
  "uruguaiana": "RS", "santa rosa": "RS", "santo angelo": "RS", "erechim": "RS",
  "ijui": "RS", "cruz alta": "RS", "lajeado": "RS", "cachoeira do sul": "RS",
  "farroupilha": "RS", "flores da cunha": "RS", "torres": "RS", "tramandai": "RS",
  "capao da canoa": "RS",

  "salvador": "BA", "feira de santana": "BA", "vitoria da conquista": "BA",
  "camacari": "BA", "itabuna": "BA", "ilheus": "BA", "juazeiro": "BA",
  "lauro de freitas": "BA", "barreiras": "BA", "porto seguro": "BA",
  "alagoinhas": "BA", "teixeira de freitas": "BA", "paulo afonso": "BA",
  "eunapolis": "BA", "jequie": "BA",

  "aracaju": "SE", "sao cristovao": "SE", "nossa senhora do socorro": "SE",
  "lagarto": "SE", "itabaiana": "SE", "estancia": "SE",

  "recife": "PE", "jaboatao dos guararapes": "PE", "olinda": "PE", "caruaru": "PE",
  "paulista": "PE", "petrolina": "PE", "cabo de santo agostinho": "PE",
  "camaragibe": "PE", "garanhuns": "PE", "igarassu": "PE", "serra talhada": "PE",
  "arcoverde": "PE", "porto de galinhas": "PE", "ipojuca": "PE", "tamandare": "PE",

  "fortaleza": "CE", "caucaia": "CE", "juazeiro do norte": "CE", "maracanau": "CE",
  "sobral": "CE", "crato": "CE", "itapipoca": "CE", "maranguape": "CE",
  "iguatu": "CE", "quixada": "CE", "pacatuba": "CE", "aquiraz": "CE",
  "eusebio": "CE", "horizonte": "CE", "canoa quebrada": "CE", "arica": "CE",
  "jericoacoara": "CE", "cumbuco": "CE", "paracuru": "CE",

  "natal": "RN", "mossoro": "RN", "parnamirim": "RN",
  "sao goncalo do amarante": "RN", "macaiba": "RN", "ceara-mirim": "RN",
  "extremoz": "RN", "pipa": "RN", "tibau do sul": "RN", "arerias": "RN",

  "joao pessoa": "PB", "campina grande": "PB", "santa rita": "PB", "patos": "PB",
  "bayeux": "PB", "cabedelo": "PB", "cajazeiras": "PB", "sousa": "PB", "guarabira": "PB",

  "maceio": "AL", "arapiraca": "AL", "palmeira dos indios": "AL", "rio largo": "AL",
  "marechal deodoro": "AL", "penedo": "AL", "coruripe": "AL", "maragogi": "AL",

  "sao luis": "MA", "imperatriz": "MA", "timon": "MA", "caxias": "MA", "codo": "MA",
  "paco do lumiar": "MA", "bacabal": "MA", "balsas": "MA", "santa ines": "MA",
  "barreirinhas": "MA", "tutoia": "MA",

  "teresina": "PI", "parnaiba": "PI", "picos": "PI", "floriano": "PI",
  "piripiri": "PI", "campo maior": "PI", "barras": "PI",

  "palmas": "TO", "araguaina": "TO", "gurupi": "TO", "porto nacional": "TO",
  "paraiso do tocantins": "TO",

  "belem": "PA", "ananindeua": "PA", "santarem": "PA", "maraba": "PA",
  "castanhal": "PA", "abaetetuba": "PA", "cameta": "PA", "altamira": "PA",
  "tucurui": "PA", "parauapebas": "PA", "paragominas": "PA", "barcarena": "PA",

  "manaus": "AM", "parintins": "AM", "itacoatiara": "AM", "manacapuru": "AM",
  "coari": "AM", "tabatinga": "AM", "maues": "AM",

  "rio branco": "AC", "cruzeiro do sul": "AC", "senador guiomard": "AC",
  "sena madureira": "AC", "tarauaca": "AC",

  "porto velho": "RO", "ji-parana": "RO", "ariquemes": "RO", "cacoal": "RO",
  "vilhena": "RO", "rolim de moura": "RO",

  "boa vista": "RR", "rorainopolis": "RR",

  "macapa": "AP", "santana": "AP", "laranjal do jari": "AP",

  "cuiaba": "MT", "varzea grande": "MT", "rondonopolis": "MT", "sinop": "MT",
  "tangara da serra": "MT", "caceres": "MT", "barra do garcas": "MT",
  "alta floresta": "MT", "primavera do leste": "MT", "lucas do rio verde": "MT",
  "chapada dos guimaraes": "MT", "pocone": "MT",

  "campo grande": "MS", "dourados": "MS", "tres lagoas": "MS", "corumba": "MS",
  "ponta pora": "MS", "navirai": "MS", "aquidauana": "MS", "nova andradina": "MS",
  "sidrolandia": "MS", "paranaiba": "MS", "coxim": "MS", "bonito": "MS", "jardim": "MS",

  "goiania": "GO", "aparecida de goiania": "GO", "anapolis": "GO", "rio verde": "GO",
  "luziania": "GO", "senador canedo": "GO", "trindade": "GO", "formosa": "GO",
  "catalao": "GO", "itumbiara": "GO", "jatai": "GO", "mineiros": "GO",
  "caldas novas": "GO", "goias": "GO", "pirenopolis": "GO",

  "brasilia": "DF", "ceilandia": "DF", "taguatinga": "DF", "samambaia": "DF",
  "planaltina": "DF", "guara": "DF", "sobradinho": "DF", "recanto das emas": "DF",
  "gama": "DF"
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
   ✅ VALORES REAIS DE ÔNIBUS (ida/volta)
   ============================================================ */

const PAISES_INTERNACIONAIS = [
  'argentina', 'chile', 'uruguai', 'paraguai', 'peru', 'bolivia',
  'equador', 'colombia', 'venezuela', 'guiana', 'suriname', 'guiana francesa'
];

const TABELA_ONIBUS = {
  mesmo_estado:    { min: 60,  max: 180 },
  curta_distancia: { min: 150, max: 350 },
  media_distancia: { min: 300, max: 600 },
  longa_distancia: { min: 500, max: 900 },
  internacional:   { min: 700, max: 1200 }
};

function isDestinoInternacional(paisOuNome) {
  if (!paisOuNome) return false;
  const texto = paisOuNome.toLowerCase();
  return PAISES_INTERNACIONAIS.some(p => texto.includes(p));
}

function calcularPrecoOnibusReal(origem, destino, paisDestino = '') {
  // Internacional
  if (isDestinoInternacional(paisDestino) || isDestinoInternacional(destino)) {
    const { min, max } = TABELA_ONIBUS.internacional;
    return Math.round(min + Math.random() * (max - min));
  }

  const ufOrigem = getEstado(origem);
  const ufDestino = getEstado(destino);

  // Mesmo estado
  if (ufOrigem && ufDestino && ufOrigem === ufDestino) {
    const { min, max } = TABELA_ONIBUS.mesmo_estado;
    return Math.round(min + Math.random() * (max - min));
  }

  // Regiões vizinhas
  const regioesProximas = {
    'SP': ['RJ', 'MG', 'PR', 'MS'],
    'RJ': ['SP', 'MG', 'ES'],
    'MG': ['SP', 'RJ', 'ES', 'GO', 'DF', 'BA'],
    'ES': ['RJ', 'MG', 'BA'],
    'PR': ['SP', 'SC', 'MS'],
    'SC': ['PR', 'RS'],
    'RS': ['SC'],
    'BA': ['SE', 'PE', 'MG', 'GO', 'TO', 'PI'],
    'SE': ['BA', 'AL', 'PE'],
    'PE': ['SE', 'AL', 'PB', 'CE', 'PI', 'BA'],
    'AL': ['SE', 'PE', 'BA'],
    'PB': ['PE', 'RN', 'CE'],
    'RN': ['PB', 'CE'],
    'CE': ['RN', 'PB', 'PE', 'PI'],
    'PI': ['CE', 'PE', 'BA', 'MA', 'TO'],
    'MA': ['PI', 'TO', 'PA'],
    'TO': ['MA', 'PI', 'BA', 'GO', 'PA', 'MT'],
    'PA': ['MA', 'TO', 'AM', 'MT', 'AP', 'RR'],
    'AM': ['PA', 'RO', 'AC', 'RR'],
    'AC': ['AM', 'RO'],
    'RO': ['AM', 'AC', 'MT'],
    'RR': ['AM', 'PA'],
    'AP': ['PA'],
    'MT': ['MS', 'GO', 'TO', 'PA', 'RO'],
    'MS': ['MT', 'GO', 'SP', 'PR'],
    'GO': ['DF', 'MT', 'MS', 'MG', 'BA', 'TO'],
    'DF': ['GO', 'MG']
  };

  if (ufOrigem && ufDestino && regioesProximas[ufOrigem]?.includes(ufDestino)) {
    const { min, max } = TABELA_ONIBUS.curta_distancia;
    return Math.round(min + Math.random() * (max - min));
  }

  // Longa distância nacional
  const regioesDistantes = [
    ['SP', 'BA'], ['SP', 'PE'], ['SP', 'CE'], ['SP', 'AM'], ['SP', 'PA'],
    ['RJ', 'BA'], ['RJ', 'PE'], ['RJ', 'CE'], ['RJ', 'AM'], ['RJ', 'PA'],
    ['MG', 'CE'], ['MG', 'AM'], ['MG', 'PA'], ['MG', 'PE'],
    ['RS', 'BA'], ['RS', 'PE'], ['RS', 'CE'], ['RS', 'AM'], ['RS', 'PA'],
    ['SC', 'BA'], ['SC', 'PE'], ['SC', 'CE'], ['SC', 'AM'], ['SC', 'PA'],
    ['PR', 'BA'], ['PR', 'PE'], ['PR', 'CE'], ['PR', 'AM'], ['PR', 'PA']
  ];

  const par = [ufOrigem, ufDestino];
  const ehDistante = regioesDistantes.some(([a, b]) =>
    (par[0] === a && par[1] === b) || (par[0] === b && par[1] === a)
  );

  if (ehDistante) {
    const { min, max } = TABELA_ONIBUS.longa_distancia;
    return Math.round(min + Math.random() * (max - min));
  }

  // Fallback
  const { min, max } = TABELA_ONIBUS.media_distancia;
  return Math.round(min + Math.random() * (max - min));
}

/* ============================================================
   ✅ VALORES REAIS DE VOOS (ida/volta por região)
   ============================================================ */

const REGIOES_PAISES = {
  america_sul: [
    'argentina', 'chile', 'uruguai', 'paraguai', 'peru', 'bolivia',
    'equador', 'colombia', 'venezuela', 'guiana', 'suriname'
  ],
  america_central: [
    'panama', 'panamá', 'costa rica', 'nicarágua', 'honduras', 'guatemala',
    'el salvador', 'belize', 'méxico', 'mexico', 'cuba', 'república dominicana',
    'jamaica', 'porto rico', 'bahamas', 'cancún', 'cancun'
  ],
  america_norte: ['estados unidos', 'eua', 'canadá', 'canada'],
  europa: [
    'portugal', 'espanha', 'frança', 'franca', 'itália', 'italia', 'alemanha',
    'inglaterra', 'reino unido', 'irlanda', 'holanda', 'bélgica', 'belgica',
    'suíça', 'suica', 'áustria', 'austria', 'grécia', 'grecia', 'noruega',
    'suécia', 'suecia', 'dinamarca', 'finlândia', 'finlandia', 'polônia',
    'polonia', 'república tcheca', 'hungria', 'croácia', 'croacia', 'romênia',
    'romenia', 'bulgária', 'bulgaria', 'rússia', 'russia', 'ucrânia', 'ucrania',
    'turquia', 'islandia', 'islândia', 'escócia', 'escocia', 'país de gales',
    'malta', 'chipre', 'estônia', 'estonia', 'letônia', 'letonia', 'lituânia',
    'lituania', 'eslovênia', 'eslovenia', 'eslováquia', 'eslovaquia', 'sérvia',
    'servia', 'bósnia', 'bosnia', 'albania', 'albânia'
  ],
  africa: [
    'marrocos', 'egito', 'áfrica do sul', 'africa do sul', 'tunísia', 'tunisia',
    'argélia', 'argelia', 'quênia', 'quenia', 'tanzânia', 'tanzania', 'nigéria',
    'nigeria', 'gana', 'senegal', 'etiópia', 'etiopia', 'ruanda', 'uganda',
    'zâmbia', 'zambia', 'zimbábue', 'zimbabue', 'moçambique', 'mocambique',
    'namíbia', 'namibia', 'botsuana', 'madagascar', 'maurício', 'mauricio',
    'seicheles', 'cabo verde'
  ],
  asia: [
    'japão', 'japao', 'china', 'coreia do sul', 'coreia do norte', 'tailândia',
    'tailandia', 'vietnã', 'vietna', 'indonésia', 'indonesia', 'índia', 'india',
    'malásia', 'malasia', 'singapura', 'filipinas', 'emirados árabes',
    'emirados árabes unidos', 'emirados', 'israel', 'catar', 'qatar',
    'arábia saudita', 'arabia saudita', 'jordânia', 'jordania', 'líbano',
    'libano', 'sri lanka', 'nepal', 'paquistão', 'paquistao', 'bangladesh',
    'myanmar', 'camboja', 'laos', 'mongólia', 'mongolia', 'cazaquistão',
    'cazaquistao', 'uzbequistão', 'uzbequistao', 'armênia', 'armenia',
    'geórgia', 'georgia', 'azerbaijão', 'azerbaijao', 'bahrein', 'kuwait',
    'omã', 'oma', 'maldivas'
  ],
  oceania: [
    'austrália', 'australia', 'nova zelândia', 'nova zelandia', 'fiji',
    'papua nova guiné', 'papua nova guine', 'samoa', 'tonga', 'taiti',
    'nova caledônia', 'nova caledonia'
  ]
};

/* Tabela de preços reais de voo (ida/volta) por região */
const TABELA_VOO = {
  brasil:           { min: 400,  max: 1600 },    // nacional
  america_sul:      { min: 1600, max: 3200 },    // Argentina, Chile
  america_central:  { min: 2200, max: 4200 },    // México, Caribe
  america_norte:    { min: 3200, max: 6500 },    // EUA, Canadá
  europa:           { min: 3800, max: 7500 },    // Portugal, França
  africa:           { min: 4200, max: 8500 },    // Marrocos, Egito
  asia:             { min: 5000, max: 9500 },    // Japão, Tailândia
  oceania:          { min: 6500, max: 12000 }    // Austrália, NZ
};

/**
 * ✅ Detecta a região do país
 */
function getRegiaoPais(paisOuNome) {
  if (!paisOuNome) return 'brasil';
  const texto = paisOuNome.toLowerCase();

  // Verifica se é Brasil
  if (texto.includes('brasil') || texto === 'br') return 'brasil';

  // Verifica em cada região
  for (const [regiao, paises] of Object.entries(REGIOES_PAISES)) {
    if (paises.some(p => texto.includes(p))) {
      return regiao;
    }
  }

  // Fallback: europa (mais comum para turismo)
  return 'europa';
}

/**
 * ✅ Retorna o preço REAL do voo (ida/volta) baseado na região
 */
function calcularPrecoVooReal(origem, destino, paisDestino = '', ufDestino = null) {
  const ufOrigem = getEstado(origem);

  // 1️⃣ Nacional (mesmo país)
  if (!paisDestino || paisDestino.toLowerCase().includes('brasil')) {
    // Mesmo estado → voo curto (mas geralmente é ônibus)
    if (ufOrigem && ufDestino && ufOrigem === ufDestino) {
      return Math.round(700 + Math.random() * 500);
    }

    // Voo nacional
    const { min, max } = TABELA_VOO.brasil;
    return Math.round(min + Math.random() * (max - min));
  }

  // 2️⃣ Internacional → pela região
  const regiao = getRegiaoPais(paisDestino);
  const { min, max } = TABELA_VOO[regiao] || TABELA_VOO.europa;

  console.log(`✈️ Voo ${origem} → ${destino} (${paisDestino}) | Região: ${regiao} | R$ ${min}–${max}`);

  return Math.round(min + Math.random() * (max - min));
}

/* ============================================================
   ✅ FORÇA preços REAIS (ônibus E voo) em um destino
   ============================================================ */
function corrigirPrecosReais(dest, origem) {
  if (!dest || !dest.pricing) return dest;

  const pais = dest.country || '';
  const nome = dest.name || '';
  const ufDestino = getEstado(nome);

  // 🚌 Corrige ônibus (se existir)
  if (dest.pricing.bus !== null && dest.pricing.bus !== undefined) {
    dest.pricing.bus = calcularPrecoOnibusReal(origem, nome, pais);
  }

  // ✈️ Corrige voo (se existir)
  if (dest.pricing.flight !== null && dest.pricing.flight !== undefined) {
    dest.pricing.flight = calcularPrecoVooReal(origem, nome, pais, ufDestino);
  }

  return dest;
}

/* ============================================================
   💰 CUSTO TOTAL E FILTRO POR ORÇAMENTO
   ============================================================ */
function calcularCustoTotal(dest, nights = 4, usarVoo = true, origem = '') {
  const pricing = dest.pricing || {};
  let transporte;

  if (usarVoo) {
    transporte = calcularPrecoVooReal(
      origem,
      dest.name || '',
      dest.country || '',
      getEstado(dest.name || '')
    );
  } else {
    transporte = calcularPrecoOnibusReal(
      origem,
      dest.name || '',
      dest.country || ''
    );
  }

  const hotel = (pricing.hotelPerNight || 0) * nights;
  const tours = pricing.tours || 0;
  return transporte + hotel + tours;
}

function filtrarPorOrcamento(destinos, budgetRaw, nights = 4, origem = '') {
  if (!budgetRaw || budgetRaw <= 0) {
    return destinos.map(d => ({
      ...d,
      cabeNoOrcamento: true,
      cabeComVoo: true,
      cabeComOnibus: true,
      custoVoo: calcularCustoTotal(d, nights, true, origem),
      custoOnibus: calcularCustoTotal(d, nights, false, origem)
    }));
  }

  const TOLERANCIA = 1.2;
  const limite = budgetRaw * TOLERANCIA;

  const comCusto = destinos.map(d => {
    const custoVoo = calcularCustoTotal(d, nights, true, origem);
    const custoOnibus = calcularCustoTotal(d, nights, false, origem);
    const melhorCusto = Math.min(
      custoVoo > 0 ? custoVoo : Infinity,
      custoOnibus > 0 ? custoOnibus : Infinity
    );

    return {
      ...d,
      custoVoo,
      custoOnibus,
      melhorCusto,
      cabeComVoo: custoVoo > 0 && custoVoo <= limite,
      cabeComOnibus: custoOnibus > 0 && custoOnibus <= limite,
      cabeNoOrcamento: melhorCusto <= limite
    };
  });

  let filtrados = comCusto.filter(d => d.cabeNoOrcamento);

  if (filtrados.length === 0) {
    filtrados = [...comCusto].sort((a, b) => a.melhorCusto - b.melhorCusto).slice(0, 3);
  }

  filtrados.sort((a, b) => a.melhorCusto - b.melhorCusto);

  return filtrados;
}

/* ============================================================
   ✅ Validação e preenchimento
   ============================================================ */
function validarECompletarRecomendacoes(recommendations, exclude, count, nights = 4) {
  const jaUsadosSet = new Set((exclude || []).map(n => n.toLowerCase().trim()));
  const unicos = [];
  const vistos = new Set();

  for (const rec of recommendations) {
    const nomeNorm = (rec.name || '').toLowerCase().trim();
    if (!nomeNorm) continue;
    if (jaUsadosSet.has(nomeNorm)) continue;
    if (vistos.has(nomeNorm)) continue;

    vistos.add(nomeNorm);
    unicos.push(rec);
  }

  if (unicos.length >= count) return unicos.slice(0, count);

  const paisesUsados = [...new Set(unicos.map(r => r.country).filter(Boolean))];
  const todosPaises = getPaisesDisponiveis();

  const paisesCandidatos = [
    ...paisesUsados,
    ...todosPaises.filter(p => !paisesUsados.includes(p))
  ];

  const jaTemNome = unicos.map(r => r.name);

  for (const pais of paisesCandidatos) {
    if (unicos.length >= count) break;

    const faltam = count - unicos.length;
    const cidadesExtras = sortearCidades(pais, faltam + 5, [...(exclude || []), ...jaTemNome]);

    for (const cidade of cidadesExtras) {
      if (unicos.length >= count) break;
      const nomeNorm = cidade.toLowerCase().trim();
      if (vistos.has(nomeNorm)) continue;

      vistos.add(nomeNorm);
      jaTemNome.push(cidade);

      unicos.push({
        name: cidade,
        country: pais,
        state: '',
        region: 'Mundo',
        climate: 'ameno',
        climateLabel: 'Ameno',
        bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
        pricing: { flight: 1200, bus: 300, hotelPerNight: 300, tours: 300 },
        transport: { recommended: 'both', flightAvailable: true, busAvailable: true },
        attractions: [],
        description: 'Destino sugerido pelo catálogo ViaGen.',
        rating: 8.0,
        idealDays: nights,
        tips: 'Verifique atrações e melhores épocas antes de viajar.',
        whyRecommend: 'Sugestão baseada no catálogo de cidades reais.',
        activities: [
          { day: 1, title: 'Chegada', desc: 'Conheça o centro da cidade.' },
          { day: 2, title: 'Passeio local', desc: 'Explore pontos turísticos.' },
          { day: 3, title: 'Cultura', desc: 'Museus e gastronomia.' },
          { day: 4, title: 'Despedida', desc: 'Últimas compras e retorno.' }
        ],
        fromCatalog: true
      });
    }
  }

  return unicos.slice(0, count);
}

function validarECompletarPorClima(destinations, climate, count, nights = 4) {
  const unicos = [];
  const vistos = new Set();

  for (const dest of destinations) {
    const nomeNorm = (dest.name || '').toLowerCase().trim();
    if (!nomeNorm) continue;
    if (vistos.has(nomeNorm)) continue;
    vistos.add(nomeNorm);
    unicos.push(dest);
  }

  if (unicos.length >= count) return unicos.slice(0, count);

  const paises = getPaisesDisponiveis();

  for (const pais of paises) {
    if (unicos.length >= count) break;
    const faltam = count - unicos.length;
    const cidades = getCidadesDoPais(pais);
    const disponiveis = cidades.filter(c => !vistos.has(c.toLowerCase()));
    const embaralhadas = [...disponiveis].sort(() => Math.random() - 0.5).slice(0, faltam);

    for (const cidade of embaralhadas) {
      if (unicos.length >= count) break;
      const nomeNorm = cidade.toLowerCase();
      if (vistos.has(nomeNorm)) continue;

      vistos.add(nomeNorm);
      unicos.push({
        name: cidade,
        country: pais,
        state: '',
        region: 'Mundo',
        climate: climate,
        climateLabel: climate,
        bestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
        pricing: { flight: 1200, bus: 300, hotelPerNight: 300, tours: 300 },
        transport: { recommended: 'both', flightAvailable: true, busAvailable: true },
        attractions: [],
        description: 'Destino sugerido pelo catálogo ViaGen.',
        rating: 8.0,
        idealDays: nights,
        tips: 'Verifique atrações e melhores épocas antes de viajar.',
        activities: [
          { day: 1, title: 'Chegada', desc: 'Conheça o centro.' },
          { day: 2, title: 'Passeio', desc: 'Explore pontos turísticos.' },
          { day: 3, title: 'Cultura', desc: 'Museus e gastronomia.' },
          { day: 4, title: 'Despedida', desc: 'Retorno.' }
        ],
        fromCatalog: true
      });
    }
  }

  return unicos.slice(0, count);
}

/* ============================================================
   ROTAS DE TESTE
   ============================================================ */
app.get('/', (req, res) => {
  res.json({
    status: 'Backend ViaGen AI + Groq funcionando! 🚀',
    modelo: 'openai/gpt-oss-120b',
    cidadesBR: Object.keys(CIDADES_BR).length,
    paises: getPaisesDisponiveis().length,
    imagensCache: imageCache.size,
    tabelaOnibus: TABELA_ONIBUS,
    tabelaVoo: TABELA_VOO
  });
});

app.get('/test-estado', (req, res) => {
  const cidade = req.query.cidade || 'botucatu';
  res.json({ cidade, estado: getEstado(cidade) });
});

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

app.get('/test-cidades', (req, res) => {
  const pais = req.query.pais || 'Brasil';
  const qtd = parseInt(req.query.qtd) || 5;
  const cidades = sortearCidades(pais, qtd);
  res.json({
    pais,
    totalDisponivel: getCidadesDoPais(pais).length,
    cidadesSorteadas: cidades,
    paisesDisponiveis: getPaisesDisponiveis()
  });
});

/* 🧪 ROTA: Testar preços REAIS de ônibus E voos */
app.get('/test-precos', (req, res) => {
  const origem = req.query.origem || 'Botucatu';
  const destino = req.query.destino || 'Buenos Aires';
  const pais = req.query.pais || 'Argentina';

  const precoOnibus = calcularPrecoOnibusReal(origem, destino, pais);
  const precoVoo = calcularPrecoVooReal(origem, destino, pais);

  res.json({
    origem,
    destino,
    pais,
    regiao: getRegiaoPais(pais),
    internacional: isDestinoInternacional(pais),
    precoOnibusIdaVolta: `R$ ${precoOnibus.toLocaleString('pt-BR')}`,
    precoVooIdaVolta: `R$ ${precoVoo.toLocaleString('pt-BR')}`,
    tabelaOnibus: TABELA_ONIBUS,
    tabelaVoo: TABELA_VOO
  });
});

/* ============================================================
   ROTA: /api/search-destination
   ============================================================ */
app.post('/api/search-destination', async (req, res) => {
  try {
    const { query, origin, date, climate, budget, budgetRaw, nights } = req.body;
    const orcamento = parseInt(budgetRaw) || 0;
    const noites = parseInt(nights) || 4;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query muito curta' });
    }

    const transporte = decidirTransporte(origin, query);
    console.log(`🔍 "${origin}" → "${query}" | ${transporte.motivo}`);

    let instrucaoTransporte = '';
    if (transporte.recomendado === 'bus') {
      instrucaoTransporte = `⚠️ Mesmo estado (${transporte.ufOrigem}) - APENAS ÔNIBUS.`;
    } else {
      instrucaoTransporte = `⚠️ Estados diferentes - use AMBOS (avião E ônibus).`;
    }

    const prompt = `
Você é um especialista em viagens brasileiro. Crie um perfil COMPLETO de destino em português do Brasil.

DADOS:
- Destino: "${query}"
- Origem: "${origin || 'Não informada'}"
- Noites: ${noites}

${instrucaoTransporte}

⚠️ REGRAS SOBRE ATRAÇÕES (NÃO INVENTE):
1. NUNCA invente atrações
2. Se não souber atrações REAIS, use termos GENÉRICOS: "Centro Histórico", "Praça Central", "Igreja Matriz"

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
  "idealDays": ${noites},
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

    // ✅ FORÇA os preços REAIS (ônibus E voo)
    corrigirPrecosReais(destination, origin);

    const primeiroPonto = destination.attractions?.[0] || '';
    const imagemReal = await buscarImagemCidade(destination.name, primeiroPonto);
    destination.image = imagemReal;

    console.log(`✅ ${destination.name} | Voo: R$ ${destination.pricing.flight} | Ônibus: R$ ${destination.pricing.bus}`);
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
    const { origin, month, climate, budget, budgetRaw, count, exclude, nights } = req.body;
    const total = count || 4;
    const orcamento = parseInt(budgetRaw) || 0;
    const noites = parseInt(nights) || 4;

    console.log(`🤖 IA recomendando ${total} destinos | Origem: ${origin} | Orçamento: ${orcamento ? 'R$ ' + orcamento : 'livre'}`);

    const prompt = `
Você é um especialista em viagens. Recomende ${total} destinos DIFERENTES em português do Brasil.

PERFIL:
- Saindo de: ${origin || 'Não informado (assuma São Paulo)'}
- Mês: ${month || 'Flexível'}
- Clima: ${climate || 'Variado'}
- Orçamento TOTAL: ${orcamento > 0 ? 'R$ ' + orcamento.toLocaleString('pt-BR') : 'Sem restrição'}
- Noites: ${noites}

${exclude?.length ? `🚫 NÃO RECOMENDE: ${exclude.join(', ')}` : ''}

REGRAS OBRIGATÓRIAS:
1. Destinos REAIS que existem
2. CADA destino em um PAÍS DIFERENTE
3. NÃO repita cidades

FORMATO (JSON puro):
{
  "recommendations": [
    {
      "name": "Nome da Cidade",
      "country": "País",
      "state": "Estado (se aplicável)",
      "region": "Região",
      "climate": "ameno",
      "climateLabel": "Ameno",
      "bestMonths": [1,2,3,4,5,6,7,8,9,10,11,12],
      "pricing": { "flight": 1200, "bus": 700, "hotelPerNight": 350, "tours": 400 },
      "transport": { "recommended": "both", "flightAvailable": true, "busAvailable": true },
      "attractions": ["Atração 1", "Atração 2", "Atração 3", "Atração 4"],
      "description": "Descrição curta",
      "rating": 9.0,
      "idealDays": ${noites},
      "tips": "Dica prática",
      "whyRecommend": "Por que recomendo (1 frase)",
      "activities": [
        { "day": 1, "title": "Chegada", "desc": "Descrição" },
        { "day": 2, "title": "Atração", "desc": "Descrição" },
        { "day": 3, "title": "Passeio", "desc": "Descrição" },
        { "day": 4, "title": "Despedida", "desc": "Descrição" }
      ]
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "Você é um especialista em viagens. Responda APENAS em JSON válido." },
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

    // ✅ CORRIGE preços REAIS (ônibus E voo) em cada recomendação
    recommendations.forEach(rec => corrigirPrecosReais(rec, origin));

    console.log(`✅ ${recommendations.length} destinos. Preços REAIS aplicados.`);

    let recomendacoesValidadas = validarECompletarRecomendacoes(recommendations, exclude, total * 2, noites);
    recomendacoesValidadas.forEach(rec => corrigirPrecosReais(rec, origin));

    recomendacoesValidadas = filtrarPorOrcamento(recomendacoesValidadas, orcamento, noites, origin);
    recomendacoesValidadas = recomendacoesValidadas.slice(0, total);

    const recommendationsComImagens = await Promise.all(
      recomendacoesValidadas.map(async (rec) => {
        const primeiroPonto = rec.attractions?.[0] || '';
        const imagemReal = await buscarImagemCidade(rec.name, primeiroPonto);
        rec.image = imagemReal;
        return rec;
      })
    );

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
    const { climate, origin, count, budgetRaw, nights } = req.body;
    const total = count || 8;
    const orcamento = parseInt(budgetRaw) || 0;
    const noites = parseInt(nights) || 4;

    if (!climate) {
      return res.status(400).json({ error: 'Clima não informado' });
    }

    const climateMap = {
      calor: 'Quente / Tropical',
      frio: 'Frio / Neve',
      ameno: 'Ameno',
      tropical: 'Tropical',
      seco: 'Seco / Desértico'
    };

    const climaTexto = climateMap[climate] || climate;

    console.log(`🌡️ IA gerando ${total} destinos de clima "${climate}"`);

    const prompt = `
Gere ${total} destinos com CLIMA: ${climaTexto}
- Saindo de: ${origin || 'São Paulo'}
- Noites: ${noites}

REGRAS:
1. TODOS os destinos DEVEM ter clima "${climate}"
2. CADA destino em PAÍS ou ESTADO DIFERENTE
3. NUNCA invente cidades

FORMATO (JSON puro):
{
  "destinations": [
    {
      "name": "Nome da Cidade",
      "country": "País",
      "state": "Estado",
      "region": "Região",
      "climate": "${climate}",
      "climateLabel": "Ex: Quente / Tropical",
      "bestMonths": [1,2,3,4,5,6,7,8,9,10,11,12],
      "pricing": { "flight": 1200, "bus": 700, "hotelPerNight": 350, "tours": 400 },
      "transport": { "recommended": "both", "flightAvailable": true, "busAvailable": true },
      "attractions": ["Atração 1", "Atração 2", "Atração 3", "Atração 4"],
      "description": "Descrição curta",
      "rating": 9.0,
      "idealDays": ${noites},
      "tips": "Dica",
      "activities": [
        { "day": 1, "title": "Chegada", "desc": "Descrição" },
        { "day": 2, "title": "Atração", "desc": "Descrição" },
        { "day": 3, "title": "Passeio", "desc": "Descrição" },
        { "day": 4, "title": "Despedida", "desc": "Descrição" }
      ]
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "Você gera destinos REAIS. Responda APENAS em JSON." },
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

    // ✅ CORRIGE preços REAIS em cada destino
    generated.forEach(dest => corrigirPrecosReais(dest, origin));

    console.log(`✅ ${generated.length} destinos. Preços REAIS aplicados.`);

    let destinosValidados = validarECompletarPorClima(generated, climate, total * 2, noites);
    destinosValidados.forEach(dest => corrigirPrecosReais(dest, origin));

    destinosValidados = filtrarPorOrcamento(destinosValidados, orcamento, noites, origin).slice(0, total);

    const generatedComImagens = await Promise.all(
      destinosValidados.map(async (dest) => {
        const primeiroPonto = dest.attractions?.[0] || '';
        const imagemReal = await buscarImagemCidade(dest.name, primeiroPonto);
        dest.image = imagemReal;
        return dest;
      })
    );

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
Crie um ROTEIRO em português do Brasil.
Destinos: ${destinations.map(d => `${d.name}, ${d.country}`).join(' → ')}
Mês: ${month || 'Flexível'}

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
        { role: "system", content: "Responda SEMPRE em JSON." },
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
    res.status(500).json({ error: 'Erro ao gerar roteiro', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`🗺️  Cidades BR: ${Object.keys(CIDADES_BR).length}`);
  console.log(`🌍 Países: ${getPaisesDisponiveis().length}`);
  console.log(`\n🚌 TABELA DE ÔNIBUS (ida/volta):`);
  console.log(`   Mesmo estado:    R$ ${TABELA_ONIBUS.mesmo_estado.min}–${TABELA_ONIBUS.mesmo_estado.max}`);
  console.log(`   Curta distância: R$ ${TABELA_ONIBUS.curta_distancia.min}–${TABELA_ONIBUS.curta_distancia.max}`);
  console.log(`   Média distância: R$ ${TABELA_ONIBUS.media_distancia.min}–${TABELA_ONIBUS.media_distancia.max}`);
  console.log(`   Longa distância: R$ ${TABELA_ONIBUS.longa_distancia.min}–${TABELA_ONIBUS.longa_distancia.max}`);
  console.log(`   INTERNACIONAL:   R$ ${TABELA_ONIBUS.internacional.min}–${TABELA_ONIBUS.internacional.max}`);
  console.log(`\n✈️  TABELA DE VOOS (ida/volta):`);
  console.log(`   Brasil:           R$ ${TABELA_VOO.brasil.min}–${TABELA_VOO.brasil.max}`);
  console.log(`   América do Sul:   R$ ${TABELA_VOO.america_sul.min}–${TABELA_VOO.america_sul.max}`);
  console.log(`   América Central:  R$ ${TABELA_VOO.america_central.min}–${TABELA_VOO.america_central.max}`);
  console.log(`   América do Norte: R$ ${TABELA_VOO.america_norte.min}–${TABELA_VOO.america_norte.max}`);
  console.log(`   Europa:           R$ ${TABELA_VOO.europa.min}–${TABELA_VOO.europa.max}`);
  console.log(`   África:           R$ ${TABELA_VOO.africa.min}–${TABELA_VOO.africa.max}`);
  console.log(`   Ásia:             R$ ${TABELA_VOO.asia.min}–${TABELA_VOO.asia.max}`);
  console.log(`   Oceania:          R$ ${TABELA_VOO.oceania.min}–${TABELA_VOO.oceania.max}`);
  console.log(`\n🧪 Teste: GET /test-precos?origem=Botucatu&destino=Buenos Aires&pais=Argentina`);
});