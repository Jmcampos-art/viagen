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
   BANCO DE CIDADES BRASILEIRAS (nome → estado)
   Usado para decidir o transporte automaticamente
   ============================================================ */
const CIDADES_BR = {
  // ===== SÃO PAULO =====
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
  "rio claro": "SP", "piraciaba": "SP", "botucatu": "SP",

  // ===== RIO DE JANEIRO =====
  "rio de janeiro": "RJ", "niteroi": "RJ", "niterói": "RJ", "nova iguacu": "RJ", "nova iguaçu": "RJ",
  "duque de caxias": "RJ", "sao goncalo": "RJ", "são gonçalo": "RJ",
  "belford roxo": "RJ", "campos dos goytacazes": "RJ", "petropolis": "RJ", "petrópolis": "RJ",
  "volta redonda": "RJ", "barra mansa": "RJ", "resende": "RJ", "angra dos reis": "RJ",
  "cabo frio": "RJ", "buzios": "RJ", "búzios": "RJ", "armacao dos buzios": "RJ", "arraial do cabo": "RJ",
  "teresopolis": "RJ", "teresópolis": "RJ", "macae": "RJ", "macaé": "RJ",
  "cachoeiras de macacu": "RJ", "nova friburgo": "RJ", "itaborai": "RJ", "itaboraí": "RJ",
  "mage": "RJ", "magé": "RJ", "queimados": "RJ", "nilopolis": "RJ", "nilópolis": "RJ",
  "marica": "RJ", "maricá": "RJ", "saquarema": "RJ", "rio das ostras": "RJ",

  // ===== MINAS GERAIS =====
  "belo horizonte": "MG", "bh": "MG", "uberlandia": "MG", "uberlândia": "MG",
  "contagem": "MG", "betim": "MG", "juiz de fora": "MG", "montes claros": "MG",
  "ribeirao das neves": "MG", "ribeirão das neves": "MG", "uberaba": "MG",
  "governador valadares": "MG", "ipatinga": "MG", "sete lagoas": "MG",
  "divinopolis": "MG", "divinópolis": "MG", "santa luzia": "MG",
  "ibirité": "MG", "ibirite": "MG", "pocos de caldas": "MG", "poços de caldas": "MG",
  "ouro preto": "MG", "mariana": "MG", "tiradentes": "MG", "sao joao del rei": "MG", "são joão del rei": "MG",
  "congonhas": "MG", "sabara": "MG", "sabarÁ": "MG", "sabarÃ¡": "MG",
  "nova lima": "MG", "vespasiano": "MG", "lagoa santa": "MG", "pedro leopoldo": "MG",
  "araxa": "MG", "araXÁ": "MG", "araxÁ": "MG", "patos de minas": "MG",
  "lavras": "MG", "varginha": "MG", "pouso alegre": "MG", "alfenas": "MG",
  "passos": "MG", "itajuba": "MG", "itajubá": "MG", "barbacena": "MG",
  "caratinga": "MG", "teofilo otoni": "MG", "teófilo otoni": "MG",
  "curvelo": "MG", "tres coracoes": "MG", "três corações": "MG",

  // ===== ESPÍRITO SANTO =====
  "vitoria": "ES", "vitória": "ES", "vila velha": "ES", "cariacica": "ES",
  "serra": "ES", "guarapari": "ES", "linhares": "ES", "colatina": "ES",
  "sao mateus": "ES", "são mateus": "ES", "aracruz": "ES", "barra de sao francisco": "ES",
  "cachoeiro de itapemirim": "ES", "domingos martins": "ES", "venda nova do imigrante": "ES",

  // ===== PARANÁ =====
  "curitiba": "PR", "londrina": "PR", "maringa": "PR", "maringá": "PR",
  "ponta grossa": "PR", "cascavel": "PR", "sao jose dos pinhais": "PR", "são josé dos pinhais": "PR",
  "foz do iguacu": "PR", "foz do iguaçu": "PR", "colombo": "PR", "guarapuava": "PR",
  "paranagua": "PR", "paranaguá": "PR", "araucaria": "PR", "araucária": "PR",
  "toledo": "PR", "apucarana": "PR", "pinhais": "PR", "campo largo": "PR",
  "almirante tamandare": "PR", "almirante tamandaré": "PR", "fazenda rio grande": "PR",
  "campo mourao": "PR", "campo mourão": "PR", "umuarama": "PR", "cianorte": "PR",
  "maringa": "PR", "maringÁ": "PR", "pato branco": "PR", "francisco beltrao": "PR", "francisco beltrão": "PR",
  "castro": "PR", "telemaco borba": "PR", "telêmaco borba": "PR",
  "ponta grossa": "PR", "uniao da vitoria": "PR", "união da vitória": "PR",

  // ===== SANTA CATARINA =====
  "florianopolis": "SC", "florianópolis": "SC", "joinville": "SC", "blumenau": "SC",
  "sao jose": "SC", "são josé": "SC", "criciuma": "SC", "criciúma": "SC",
  "chapeco": "SC", "chapecó": "SC", "itajai": "SC", "itajaí": "SC",
  "jaragua do sul": "SC", "jaraguá do sul": "SC", "palhoca": "SC", "palhoça": "SC",
  "lages": "SC", "balneario camboriu": "SC", "balneário camboriú": "SC",
  "camboriu": "SC", "camboriú": "SC", "brusque": "SC", "tubarao": "SC", "tubarão": "SC",
  "sao bento do sul": "SC", "são bento do sul": "SC", "cacador": "SC", "caçador": "SC",
  "concordia": "SC", "concórdia": "SC", "rio do sul": "SC", "navegantes": "SC",
  "penha": "SC", "bombinhas": "SC", "porto belo": "SC", "itapema": "SC",
  "garopaba": "SC", "imbituba": "SC", "laguna": "SC", "tubarao": "SC",

  // ===== RIO GRANDE DO SUL =====
  "porto alegre": "RS", "caxias do sul": "RS", "pelotas": "RS", "canoas": "RS",
  "santa maria": "RS", "gravatai": "RS", "gravataí": "RS", "viamao": "RS", "viamão": "RS",
  "novo hamburgo": "RS", "sao leopoldo": "RS", "são leopoldo": "RS",
  "rio grande": "RS", "alvorada": "RS", "passo fundo": "RS", "sapucaia do sul": "RS",
  "santa cruz do sul": "RS", "cachoeirinha": "RS", "bagé": "RS", "bage": "RS",
  "bento goncalves": "RS", "bento gonçalves": "RS", "gramado": "RS", "canela": "RS",
  "uruguaiana": "RS", "santa rosa": "RS", "santo angelo": "RS", "santo ângelo": "RS",
  "erechim": "RS", "ijui": "RS", "ijuí": "RS", "cruz alta": "RS",
  "lajeado": "RS", "santa cruz do sul": "RS", "cachoeira do sul": "RS",
  "farroupilha": "RS", "flores da cunha": "RS", "novo hamburgo": "RS",
  "torres": "RS", "tramandai": "RS", "tramandaí": "RS", "capao da canoa": "RS", "capão da canoa": "RS",

  // ===== BAHIA =====
  "salvador": "BA", "feira de santana": "BA", "vitoria da conquista": "BA", "vitória da conquista": "BA",
  "camacari": "BA", "camaçari": "BA", "itabuna": "BA", "ilheus": "BA", "ilhéus": "BA",
  "juazeiro": "BA", "lauro de freitas": "BA", "barreiras": "BA", "porto seguro": "BA",
  "alagoinhas": "BA", "teixeira de freitas": "BA", "simões filho": "BA", "simões filho": "BA",
  "paulo afonso": "BA", "eunapolis": "BA", "eunápolis": "BA", "jequie": "BA", "jequié": "BA",
  "aracaju": "SE", "sao cristovao": "SE", "são cristóvão": "SE", "nossa senhora do socorro": "SE",
  "lagarto": "SE", "itabaiana": "SE", "estancia": "SE", "estância": "SE",

  // ===== PERNAMBUCO =====
  "recife": "PE", "jaboatao dos guararapes": "PE", "jaboatão dos guararapes": "PE",
  "olinda": "PE", "caruaru": "PE", "paulista": "PE", "petrolina": "PE",
  "cabo de santo agostinho": "PE", "camaragibe": "PE", "garanhuns": "PE",
  "vitoria de santo antao": "PE", "vitória de santo antão": "PE",
  "sao lourenco da mata": "PE", "são lourenço da mata": "PE",
  "igarassu": "PE", "serra talhada": "PE", "arcoverde": "PE",
  "porto de galinhas": "PE", "ipojuca": "PE", "tamandare": "PE", "tamandaré": "PE",

  // ===== CEARÁ =====
  "fortaleza": "CE", "caucaia": "CE", "juazeiro do norte": "CE", "maracanau": "CE", "maracanaú": "CE",
  "sobral": "CE", "crato": "CE", "itapipoca": "CE", "maranguape": "CE",
  "iguatu": "CE", "quixada": "CE", "quixadá": "CE", "pacatuba": "CE",
  "aquiraz": "CE", "eusebio": "CE", "eusébio": "CE", "horizonte": "CE",
  "canoa quebrada": "CE", "aricá": "CE", "arica": "CE", "jijoca de jericoacoara": "CE",
  "jericoacoara": "CE", "cumbuco": "CE", "paracuru": "CE",

  // ===== RIO GRANDE DO NORTE =====
  "natal": "RN", "mossoro": "RN", "mossoró": "RN", "parnamirim": "RN",
  "sao goncalo do amarante": "RN", "são gonçalo do amarante": "RN",
  "macaiba": "RN", "macaíba": "RN", "ceara-mirim": "RN", "extremoz": "RN",
  "pipa": "RN", "tibau do sul": "RN", "arerias": "RN",

  // ===== PARAÍBA =====
  "joao pessoa": "PB", "joão pessoa": "PB", "campina grande": "PB",
  "santa rita": "PB", "patos": "PB", "bayuex": "PB", "bayeux": "PB",
  "cabedelo": "PB", "cajazeiras": "PB", "sousa": "PB", "guarabira": "PB",

  // ===== ALAGOAS =====
  "maceio": "AL", "maceió": "AL", "arapiraca": "AL", "arapiraca": "AL",
  "palmeira dos indios": "AL", "palmeira dos índios": "AL", "rio largo": "AL",
  "marechal deodoro": "AL", "penedo": "AL", "coruripe": "AL", "maragogi": "AL",

  // ===== SERGIPE =====
  "aracaju": "SE", "nossa senhora do socorro": "SE", "lagarto": "SE",
  "itabaiana": "SE", "sao cristovao": "SE", "são cristóvão": "SE",

  // ===== MARANHÃO =====
  "sao luis": "MA", "são luís": "MA", "imperatriz": "MA", "timon": "MA",
  "caxias": "MA", "codó": "MA", "codo": "MA", "paco do lumiar": "MA", "paço do lumiar": "MA",
  "bacabal": "MA", "balsas": "MA", "santa ines": "MA", "santa inês": "MA",
  "barreirinhas": "MA", "tutoia": "MA", "tutóia": "MA",

  // ===== PIAUÍ =====
  "teresina": "PI", "parnaiba": "PI", "parnaíba": "PI", "picos": "PI",
  "floriano": "PI", "piripiri": "PI", "campo maior": "PI", "barras": "PI",

  // ===== TOCANTINS =====
  "palmas": "TO", "araguaina": "TO", "araguína": "TO", "gurupi": "TO",
  "porto nacional": "TO", "paraiso do tocantins": "TO", "paraíso do tocantins": "TO",

  // ===== PARÁ =====
  "belem": "PA", "belém": "PA", "ananindeua": "PA", "santarem": "PA", "santarém": "PA",
  "maraba": "PA", "marabá": "PA", "castanhal": "PA", "abaetetuba": "PA",
  "cameta": "PA", "cametá": "PA", "altamira": "PA", "tucurui": "PA", "tucuruí": "PA",
  "parauapebas": "PA", "paragominas": "PA", "barcarena": "PA",

  // ===== AMAZONAS =====
  "manaus": "AM", "parintins": "AM", "itacoatiara": "AM", "manacapuru": "AM",
  "coari": "AM", "tabatinga": "AM", "maues": "AM", "maués": "AM",

  // ===== ACRE =====
  "rio branco": "AC", "cruzeiro do sul": "AC", "senador guiomard": "AC",
  "sena madureira": "AC", "tarauaca": "AC", "tarauacá": "AC",

  // ===== RONDÔNIA =====
  "porto velho": "RO", "ji-parana": "RO", "ji-paraná": "RO", "ariquemes": "RO",
  "cacoal": "RO", "vilhena": "RO", "rolim de moura": "RO",

  // ===== RORAIMA =====
  "boa vista": "RR", "rorainopolis": "RR", "rorainópolis": "RR",

  // ===== AMAPÁ =====
  "macapa": "AP", "macapá": "AP", "santana": "AP", "laranjal do jari": "AP",

  // ===== MATO GROSSO =====
  "cuiaba": "MT", "cuiabá": "MT", "varzea grande": "MT", "várzea grande": "MT",
  "rondonopolis": "MT", "rondonópolis": "MT", "sinop": "MT", "tangara da serra": "MT", "tangará da serra": "MT",
  "caceres": "MT", "cáceres": "MT", "barra do garcas": "MT", "barra do garças": "MT",
  "alta floresta": "MT", "primavera do leste": "MT", "lucas do rio verde": "MT",
  "chapada dos guimaraes": "MT", "chapada dos guimarães": "MT", "pocone": "MT", "poconé": "MT",

  // ===== MATO GROSSO DO SUL =====
  "campo grande": "MS", "dourados": "MS", "tres lagoas": "MS", "três lagoas": "MS",
  "corumba": "MS", "corumbá": "MS", "ponta pora": "MS", "ponta porã": "MS",
  "navirai": "MS", "naviraí": "MS", "aquidauana": "MS", "nova andradina": "MS",
  "sidrolandia": "MS", "sidrolândia": "MS", "paranaiba": "MS", "paranaíba": "MS",
  "coxhim": "MS", "coxins": "MS", "coxim": "MS", "bonito": "MS", "jardim": "MS",

  // ===== GOIÁS =====
  "goiania": "GO", "goiânia": "GO", "aparecida de goiania": "GO", "aparecida de goiânia": "GO",
  "anapolis": "GO", "anápolis": "GO", "rio verde": "GO", "luziania": "GO", "luziânia": "GO",
  "aguas lindas de goias": "GO", "águas lindas de goiás": "GO",
  "senador canedo": "GO", "trindade": "GO", "formosa": "GO", "catalao": "GO", "catalão": "GO",
  "itumbiara": "GO", "jatai": "GO", "jataí": "GO", "mineiros": "GO",
  "caldas novas": "GO", "goias": "GO", "goiás": "GO", "pirenopolis": "GO", "pirenópolis": "GO",
  "cidade de goias": "GO", "cidade de goiás": "GO", "santa helena de goias": "GO",

  // ===== DISTRITO FEDERAL =====
  "brasilia": "DF", "brasília": "DF", "brasilia df": "DF", "ceilandia": "DF", "ceilandia": "DF",
  "taguatinga": "DF", "samambaia": "DF", "planaltina": "DF", "guara": "DF", "guará": "DF",
  "sobradinho": "DF", "recanto das emas": "DF", "gama": "DF", "santa maria": "DF",

  // ===== INTERNACIONAIS (para referência) =====
  "lisboa": "PT", "porto": "PT", "paris": "FR", "roma": "IT", "barcelona": "ES",
  "madri": "ES", "londres": "UK", "nova york": "US", "miami": "US", "orlando": "US",
  "buenos aires": "AR", "santiago": "CL", "montevideu": "UY", "montevideo": "UY",
  "toquio": "JP", "tóquio": "JP", "cancun": "MX", "cancún": "MX",
  "dubai": "AE", "cairo": "EG", "bali": "ID", "sydney": "AU"
};

/* ============================================================
   FUNÇÃO: detectar estado de uma cidade
   ============================================================ */
function getEstado(cidade) {
  if (!cidade) return null;
  const nome = cidade.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos
  
  // Busca exata
  if (CIDADES_BR[nome]) return CIDADES_BR[nome];
  
  // Busca com acento (variação)
  for (const [key, uf] of Object.entries(CIDADES_BR)) {
    const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (keyNorm === nome) return uf;
  }
  
  // Busca parcial (contém)
  for (const [key, uf] of Object.entries(CIDADES_BR)) {
    const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (keyNorm.includes(nome) || nome.includes(keyNorm)) {
      if (nome.length >= 4) return uf;
    }
  }
  
  return null;
}

/* ============================================================
   FUNÇÃO: decidir transporte baseado nos estados
   ============================================================ */
function decidirTransporte(origem, destino) {
  const ufOrigem = getEstado(origem);
  const ufDestino = getEstado(destino);

  // Se não sabemos o estado de algum, deixa IA decidir
  if (!ufOrigem || !ufDestino) {
    return {
      recomendado: 'both',
      disponivel: { flight: true, bus: true },
      motivo: 'Estados não identificados - mostrando ambos',
      ufOrigem, ufDestino
    };
  }

  // Mesmo estado → APENAS ÔNIBUS
  if (ufOrigem === ufDestino) {
    return {
      recomendado: 'bus',
      disponivel: { flight: false, bus: true },
      motivo: `Mesmo estado (${ufOrigem}) → apenas ônibus`,
      ufOrigem, ufDestino
    };
  }

  // Estados diferentes → AMBOS (avião + ônibus)
  return {
    recomendado: 'both',
    disponivel: { flight: true, bus: true },
    motivo: `Estados diferentes (${ufOrigem} → ${ufDestino}) → avião + ônibus`,
    ufOrigem, ufDestino
  };
}

/* ============================================================
   ROTA RAIZ
   ============================================================ */
app.get('/', (req, res) => {
  res.json({
    status: 'Backend ViaGen AI + Groq funcionando! 🚀',
    modelo: 'openai/gpt-oss-120b',
    cidades: Object.keys(CIDADES_BR).length,
    rotas: [
      'GET  /',
      'GET  /test-ai',
      'GET  /test-estado?cidade=botucatu',
      'POST /api/search-destination',
      'POST /api/itinerary'
    ]
  });
});

/* ============================================================
   ROTA DE TESTE - ESTADO
   ============================================================ */
app.get('/test-estado', (req, res) => {
  const cidade = req.query.cidade || 'botucatu';
  const uf = getEstado(cidade);
  res.json({ cidade, estado: uf });
});

/* ============================================================
   ROTA DE TESTE IA
   ============================================================ */
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
      chaveGroq: process.env.GROQ_API_KEY ? "✅ Configurada" : "❌ NÃO CONFIGURADA",
      modelo: "openai/gpt-oss-120b"
    });
  } catch (error) {
    res.status(500).json({
      status: "❌ IA com erro",
      erro: error.message
    });
  }
});

/* ============================================================
   ROTA: /api/search-destination
   ============================================================ */
app.post('/api/search-destination', async (req, res) => {
  try {
    const { query, origin, month, climate, budget } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query muito curta' });
    }

    // ⚡ DECIDE O TRANSPORTE SEM IA
    const transporte = decidirTransporte(origin, query);

    console.log(`🔍 "${origin}" → "${query}" | UF: ${transporte.ufOrigem} → ${transporte.ufDestino} | ${transporte.motivo}`);

    // Monta a instrução sobre transporte (o backend DECIDE, a IA apenas obedece)
    let instrucaoTransporte = '';
    if (transporte.recomendado === 'bus') {
      instrucaoTransporte = `
⚠️ REGRA DE TRANSPORTE JÁ DECIDIDA PELO SISTEMA:
- Origem (${origin || '?'}) e destino (${query}) estão no MESMO ESTADO (${transporte.ufOrigem})
- PORTANTO: APENAS ÔNIBUS
- Defina "pricing.flight": null
- Defina "pricing.bus": valor realista (R$ 50-250 para cidades próximas)
- "transport.recommended": "bus"
- "transport.flightAvailable": false
- "transport.busAvailable": true
- NUNCA inclua voo! NÃO mostre opção de avião!
`;
    } else if (transporte.ufOrigem && transporte.ufDestino) {
      instrucaoTransporte = `
⚠️ REGRA DE TRANSPORTE JÁ DECIDIDA PELO SISTEMA:
- Origem (${origin}) está em ${transporte.ufOrigem} e destino (${query}) em ${transporte.ufDestino}
- ESTADOS DIFERENTES → mostre AMBOS (avião E ônibus)
- "pricing.flight": valor realista
- "pricing.bus": valor realista
- "transport.recommended": "both"
- "transport.flightAvailable": true
- "transport.busAvailable": true
`;
    } else {
      instrucaoTransporte = `
⚠️ Não foi possível identificar o estado. Use valores realistas para ambos os transportes.
`;
    }

    const prompt = `
Você é um especialista em viagens brasileiro. Crie um perfil COMPLETO de destino em português do Brasil.

DADOS:
- Destino: "${query}"
- Origem: "${origin || 'Não informada'}"
- Mês: ${month || 'Flexível'}
- Clima: ${climate || 'Variado'}
- Orçamento: ${budget || 'Sem restrição'}

${instrucaoTransporte}

⚠️ REGRAS SOBRE ATRAÇÕES (NÃO INVENTE):
1. NUNCA invente atrações, parques, museus ou pontos turísticos
2. Se não souber atrações REAIS de "${query}", use termos GENÉRICOS mas verdadeiros:
   - "Centro Histórico", "Praça Central", "Igreja Matriz", "Mercado Municipal"
   - "Museu Municipal", "Parque Municipal", "Catedral"
3. NUNCA invente "Parque Zoológico", "Parque da Lapa" ou atrações específicas que você não tem certeza
4. Para cidades pequenas/médias, use ATRAÇÕES GENÉRICAS que geralmente existem
5. Para cidades conhecidas, use as atrações FAMOSAS reais

⚠️ SOBRE PREÇOS:
- Use valores realistas em R$
- Hotel: R$ 120-300/noite (cidades médias) | R$ 300-800 (capitais/turísticas)
- Passeios: R$ 150-400

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
  "pricing": {
    "flight": null,
    "bus": 90,
    "hotelPerNight": 180,
    "tours": 200
  },
  "transport": {
    "recommended": "bus",
    "flightAvailable": false,
    "busAvailable": true,
    "distanceKm": 80
  },
  "currency": "R$",
  "attractions": ["Praça Central", "Igreja Matriz", "Museu Municipal", "Parque Municipal"],
  "image": "https://source.unsplash.com/featured/?NOMEDACIDADE,brazil,travel",
  "description": "Descrição curta e realista",
  "rating": 8.5,
  "idealDays": 3,
  "tips": "Dica genérica mas útil",
  "activities": [
    { "day": 1, "title": "Chegada e Centro", "desc": "Conheça o centro histórico e a praça principal." },
    { "day": 2, "title": "Cultura Local", "desc": "Visite museus e pontos culturais da cidade." },
    { "day": 3, "title": "Gastronomia", "desc": "Experimente a culinária típica da região." }
  ]
}

⚠️ ATENÇÃO FINAL:
- Se a instrução acima diz "APENAS ÔNIBUS", então "pricing.flight" DEVE ser null
- Se a instrução diz "AMBOS", então ambos devem ter valor
- NUNCA inclua atrações que você não tem certeza que existem
- "climate" DEVE ser: "calor", "frio", "ameno", "tropical" ou "seco"
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em viagens. SIGA AS INSTRUÇÕES DE TRANSPORTE À RISCA. NUNCA invente atrações. Responda em JSON válido."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 4000
    });

    let text = completion.choices[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const destination = JSON.parse(text);

    // ⚡ FORÇA o transporte correto mesmo se a IA errar
    destination.transport = {
      recommended: transporte.recomendado,
      flightAvailable: transporte.disponivel.flight,
      busAvailable: transporte.disponivel.bus,
      distanceKm: destination.transport?.distanceKm || null
    };
    if (!transporte.disponivel.flight) destination.pricing.flight = null;
    if (!transporte.disponivel.bus) destination.pricing.bus = null;

    // Adiciona UF real
    destination.state = destinoUFNome(transporte.ufDestino) || destination.state;

    console.log(`✅ ${destination.name} (${destination.state}) | Transporte: ${transporte.recomendado}`);
    res.json(destination);
  } catch (error) {
    console.error('❌ Erro IA:', error);
    res.status(500).json({ error: 'Erro ao buscar destino', details: error.message });
  }
});

/* ============================================================
   MAPA DE UF PARA NOME
   ============================================================ */
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
        {
          "dia": 1,
          "titulo": "Título do dia",
          "manha": "Atividade",
          "tarde": "Atividade",
          "noite": "Atividade",
          "refeicao": "Restaurante",
          "custoDia": 400
        }
      ]
    }
  ],
  "custoTotal": 12000
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "Responda SEMPRE em JSON válido, sem markdown." },
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
  console.log(`🤖 IA: Groq (openai/gpt-oss-120b)`);
  console.log(`🗺️  Cidades cadastradas: ${Object.keys(CIDADES_BR).length}`);
  console.log(`📋 Rotas disponíveis:`);
  console.log(`   GET  /`);
  console.log(`   GET  /test-ai`);
  console.log(`   GET  /test-estado?cidade=botucatu`);
  console.log(`   POST /api/search-destination`);
  console.log(`   POST /api/itinerary`);
});