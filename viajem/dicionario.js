/* ============================================================
   AHGA TURISMO — Dicionário de Viagem por País
   Mostra palavras úteis no idioma do destino
   ============================================================ */

/* ============================================================
   MAPA: PAÍS → IDIOMA + PALAVRAS
   ============================================================ */
const DICIONARIOS_POR_PAIS = {
  /* ---------- ESPANHOL ---------- */
  'Chile': {
    idioma: 'Espanhol',
    bandeira: '🇨🇱',
    palavras: [
      { pt: 'Olá', es: 'Hola' },
      { pt: 'Bom dia', es: 'Buenos días' },
      { pt: 'Boa noite', es: 'Buenas noches' },
      { pt: 'Obrigado', es: 'Gracias' },
      { pt: 'Por favor', es: 'Por favor' },
      { pt: 'Desculpa', es: 'Perdón' },
      { pt: 'Quanto custa?', es: '¿Cuánto cuesta?' },
      { pt: 'Onde fica o banheiro?', es: '¿Dónde está el baño?' },
      { pt: 'Água', es: 'Agua' },
      { pt: 'Comida', es: 'Comida' },
      { pt: 'Conta, por favor', es: 'La cuenta, por favor' },
      { pt: 'Não entendo', es: 'No entiendo' },
      { pt: 'Você fala português?', es: '¿Habla portugués?' },
      { pt: 'Socorro!', es: '¡Ayuda!' },
      { pt: 'Hotel', es: 'Hotel' },
      { pt: 'Aeroporto', es: 'Aeropuerto' },
      { pt: 'Táxi', es: 'Taxi' },
      { pt: 'Bom', es: 'Bueno' },
      { pt: 'Ruim', es: 'Malo' },
      { pt: 'Sim / Não', es: 'Sí / No' }
    ]
  },
  'Argentina': { /* mesma base do Chile */ },
  'Peru': { /* ... */ },
  'Colômbia': { /* ... */ },
  'México': { /* ... */ },
  'Espanha': { /* ... */ },
  'Uruguai': { /* ... */ },

  /* ---------- INGLÊS ---------- */
  'Estados Unidos': {
    idioma: 'Inglês',
    bandeira: '🇺🇸',
    palavras: [
      { pt: 'Olá', en: 'Hello' },
      { pt: 'Bom dia', en: 'Good morning' },
      { pt: 'Boa noite', en: 'Good night' },
      { pt: 'Obrigado', en: 'Thank you' },
      { pt: 'Por favor', en: 'Please' },
      { pt: 'Desculpa', en: 'Sorry' },
      { pt: 'Quanto custa?', en: 'How much is it?' },
      { pt: 'Onde fica o banheiro?', en: 'Where is the bathroom?' },
      { pt: 'Água', en: 'Water' },
      { pt: 'Comida', en: 'Food' },
      { pt: 'A conta, por favor', en: 'The check, please' },
      { pt: 'Não entendo', en: 'I don\'t understand' },
      { pt: 'Você fala português?', en: 'Do you speak Portuguese?' },
      { pt: 'Socorro!', en: 'Help!' },
      { pt: 'Hotel', en: 'Hotel' },
      { pt: 'Aeroporto', en: 'Airport' },
      { pt: 'Táxi', en: 'Taxi' },
      { pt: 'Sim / Não', en: 'Yes / No' }
    ]
  },
  'Inglaterra': { /* mesma base */ },
  'Canadá': { /* mesma base */ },
  'Austrália': { /* mesma base */ },
  'Nova Zelândia': { /* mesma base */ },
  'Irlanda': { /* mesma base */ },

  /* ---------- FRANCÊS ---------- */
  'França': {
    idioma: 'Francês',
    bandeira: '🇫🇷',
    palavras: [
      { pt: 'Olá', fr: 'Bonjour' },
      { pt: 'Boa noite', fr: 'Bonsoir' },
      { pt: 'Obrigado', fr: 'Merci' },
      { pt: 'Por favor', fr: 'S\'il vous plaît' },
      { pt: 'Desculpa', fr: 'Pardon' },
      { pt: 'Quanto custa?', fr: 'Combien ça coûte ?' },
      { pt: 'Onde fica o banheiro?', fr: 'Où sont les toilettes ?' },
      { pt: 'Água', fr: 'Eau' },
      { pt: 'Comida', fr: 'Nourriture' },
      { pt: 'A conta, por favor', fr: 'L\'addition, s\'il vous plaît' },
      { pt: 'Não entendo', fr: 'Je ne comprends pas' },
      { pt: 'Você fala português?', fr: 'Parlez-vous portugais ?' },
      { pt: 'Socorro!', fr: 'Au secours !' },
      { pt: 'Hotel', fr: 'Hôtel' },
      { pt: 'Aeroporto', fr: 'Aéroport' },
      { pt: 'Táxi', fr: 'Taxi' },
      { pt: 'Sim / Não', fr: 'Oui / Non' }
    ]
  },

  /* ---------- ITALIANO ---------- */
  'Itália': {
    idioma: 'Italiano',
    bandeira: '🇮🇹',
    palavras: [
      { pt: 'Olá', it: 'Ciao' },
      { pt: 'Bom dia', it: 'Buongiorno' },
      { pt: 'Boa noite', it: 'Buonasera' },
      { pt: 'Obrigado', it: 'Grazie' },
      { pt: 'Por favor', it: 'Per favore' },
      { pt: 'Desculpa', it: 'Scusa' },
      { pt: 'Quanto custa?', it: 'Quanto costa?' },
      { pt: 'Onde fica o banheiro?', it: 'Dov\'è il bagno?' },
      { pt: 'Água', it: 'Acqua' },
      { pt: 'Comida', it: 'Cibo' },
      { pt: 'A conta, por favor', it: 'Il conto, per favore' },
      { pt: 'Não entendo', it: 'Non capisco' },
      { pt: 'Socorro!', it: 'Aiuto!' },
      { pt: 'Hotel', it: 'Albergo' },
      { pt: 'Aeroporto', it: 'Aeroporto' },
      { pt: 'Táxi', it: 'Taxi' },
      { pt: 'Sim / Não', it: 'Sì / No' }
    ]
  },

  /* ---------- ALEMÃO ---------- */
  'Alemanha': {
    idioma: 'Alemão',
    bandeira: '🇩🇪',
    palavras: [
      { pt: 'Olá', de: 'Hallo' },
      { pt: 'Bom dia', de: 'Guten Morgen' },
      { pt: 'Boa noite', de: 'Gute Nacht' },
      { pt: 'Obrigado', de: 'Danke' },
      { pt: 'Por favor', de: 'Bitte' },
      { pt: 'Desculpa', de: 'Entschuldigung' },
      { pt: 'Quanto custa?', de: 'Wie viel kostet das?' },
      { pt: 'Onde fica o banheiro?', de: 'Wo ist die Toilette?' },
      { pt: 'Água', de: 'Wasser' },
      { pt: 'Comida', de: 'Essen' },
      { pt: 'A conta, por favor', de: 'Die Rechnung, bitte' },
      { pt: 'Não entendo', de: 'Ich verstehe nicht' },
      { pt: 'Socorro!', de: 'Hilfe!' },
      { pt: 'Hotel', de: 'Hotel' },
      { pt: 'Aeroporto', de: 'Flughafen' },
      { pt: 'Táxi', de: 'Taxi' },
      { pt: 'Sim / Não', de: 'Ja / Nein' }
    ]
  },

  /* ---------- JAPONÊS ---------- */
  'Japão': {
    idioma: 'Japonês',
    bandeira: '🇯🇵',
    palavras: [
      { pt: 'Olá', ja: 'こんにちは (Konnichiwa)' },
      { pt: 'Bom dia', ja: 'おはよう (Ohayou)' },
      { pt: 'Obrigado', ja: 'ありがとう (Arigatou)' },
      { pt: 'Por favor', ja: 'お願いします (Onegaishimasu)' },
      { pt: 'Desculpa', ja: 'すみません (Sumimasen)' },
      { pt: 'Quanto custa?', ja: 'いくらですか？ (Ikura desu ka?)' },
      { pt: 'Onde fica o banheiro?', ja: 'トイレはどこですか？ (Toire wa doko desu ka?)' },
      { pt: 'Água', ja: '水 (Mizu)' },
      { pt: 'Comida', ja: '食べ物 (Tabemono)' },
      { pt: 'Não entendo', ja: 'わかりません (Wakarimasen)' },
      { pt: 'Socorro!', ja: '助けて！ (Tasukete!)' },
      { pt: 'Hotel', ja: 'ホテル (Hoteru)' },
      { pt: 'Aeroporto', ja: '空港 (Kuukou)' },
      { pt: 'Sim / Não', ja: 'はい / いいえ (Hai / Iie)' }
    ]
  },

  /* ---------- CHINÊS ---------- */
  'China': {
    idioma: 'Mandarim',
    bandeira: '🇨🇳',
    palavras: [
      { pt: 'Olá', zh: '你好 (Nǐ hǎo)' },
      { pt: 'Obrigado', zh: '谢谢 (Xièxiè)' },
      { pt: 'Por favor', zh: '请 (Qǐng)' },
      { pt: 'Desculpa', zh: '对不起 (Duìbùqǐ)' },
      { pt: 'Quanto custa?', zh: '多少钱？ (Duōshǎo qián?)' },
      { pt: 'Onde fica o banheiro?', zh: '洗手间在哪里？ (Xǐshǒujiān zài nǎlǐ?)' },
      { pt: 'Água', zh: '水 (Shuǐ)' },
      { pt: 'Comida', zh: '食物 (Shíwù)' },
      { pt: 'Não entendo', zh: '我不懂 (Wǒ bù dǒng)' },
      { pt: 'Socorro!', zh: '救命！ (Jiùmìng!)' },
      { pt: 'Hotel', zh: '酒店 (Jiǔdiàn)' },
      { pt: 'Aeroporto', zh: '机场 (Jīchǎng)' },
      { pt: 'Sim / Não', zh: '是 / 不是 (Shì / Bùshì)' }
    ]
  },

  /* ---------- PORTUGAL (português de Portugal) ---------- */
  'Portugal': {
    idioma: 'Português (Portugal)',
    bandeira: '🇵🇹',
    palavras: [
      { pt: 'Olá (Brasil)', 'pt-PT': 'Olá' },
      { pt: 'Celular', 'pt-PT': 'Telemóvel' },
      { pt: 'Ônibus', 'pt-PT': 'Autocarro' },
      { pt: 'Geladeira', 'pt-PT': 'Frigorífico' },
      { pt: 'Banheiro', 'pt-PT': 'Casa de banho' },
      { pt: 'Sorvete', 'pt-PT': 'Gelado' },
      { pt: 'Café da manhã', 'pt-PT': 'Pequeno-almoço' },
      { pt: 'Bala', 'pt-PT': 'Rebuçado' },
      { pt: 'Trem', 'pt-PT': 'Comboio' },
      { pt: 'Suco', 'pt-PT': 'Sumo' },
      { pt: 'Time', 'pt-PT': 'Equipa' },
      { pt: 'Legais', 'pt-PT': 'Fixe / Porreiro' }
    ]
  }
};

/* ============================================================
   ALIASES: nomes alternativos de países
   ============================================================ */
const ALIASES_PAISES = {
  'eua': 'Estados Unidos',
  'usa': 'Estados Unidos',
  'united states': 'Estados Unidos',
  'reino unido': 'Inglaterra',
  'uk': 'Inglaterra',
  'england': 'Inglaterra',
  'espanha': 'Espanha',
  'franca': 'França',
  'frança': 'França',
  'italia': 'Itália',
  'itália': 'Itália',
  'alemanha': 'Alemanha',
  'japao': 'Japão',
  'japão': 'Japão',
  'china': 'China',
  'portugal': 'Portugal',
  'chile': 'Chile',
  'argentina': 'Argentina',
  'peru': 'Peru',
  'colombia': 'Colômbia',
  'colômbia': 'Colômbia',
  'mexico': 'México',
  'méxico': 'México',
  'uruguai': 'Uruguai'
};

/* ============================================================
   DETECTA O PAÍS A PARTIR DO DESTINO
   ============================================================ */
function detectarPais(destino) {
  if (!destino) return null;

  const texto = destino.toLowerCase();

  // 1) Procura o nome do país no texto (ex: "Santiago, Chile" → "Chile")
  for (const pais of Object.keys(DICIONARIOS_POR_PAIS)) {
    if (texto.includes(pais.toLowerCase())) return pais;
  }

  // 2) Procura por aliases (ex: "EUA" → "Estados Unidos")
  for (const [alias, pais] of Object.entries(ALIASES_PAISES)) {
    if (texto.includes(alias)) return pais;
  }

  // 3) Se não achou, retorna null (é Brasil ou não tem dicionário)
  return null;
}

/* ============================================================
   RENDERIZA O DICIONÁRIO NO MODAL
   ============================================================ */
function renderDicionarioViagem(destino) {
  const pais = detectarPais(destino);

  if (!pais) {
    return `
      <div class="dic-indisponivel">
        <i class="fas fa-map-marked-alt"></i>
        <span>Destino nacional — dicionário não necessário</span>
      </div>
    `;
  }

  const dic = DICIONARIOS_POR_PAIS[pais];
  if (!dic || !dic.palavras || dic.palavras.length === 0) {
    return `
      <div class="dic-indisponivel">
        <i class="fas fa-book"></i>
        <span>Dicionário em breve para ${pais}</span>
      </div>
    `;
  }

  // Descobre a chave do idioma (ex: 'es', 'en', 'fr', 'it', 'de', 'ja', 'zh')
  const chaveIdioma = Object.keys(dic.palavras[0]).find(k => k !== 'pt');

  let linhas = '';
  dic.palavras.forEach(p => {
    const traducao = p[chaveIdioma] || '';
    linhas += `
      <div class="dic-linha">
        <span class="dic-pt">${p.pt}</span>
        <i class="fas fa-arrow-right dic-seta"></i>
        <span class="dic-estrangeiro">${traducao}</span>
      </div>
    `;
  });

  return `
    <div class="dic-container">
      <div class="dic-header">
        <span class="dic-bandeira">${dic.bandeira}</span>
        <div>
          <strong>${dic.idioma}</strong>
          <small>${dic.palavras.length} palavras úteis</small>
        </div>
      </div>
      <div class="dic-lista">
        ${linhas}
      </div>
    </div>
  `;
}

/* ============================================================
   EXPÕE GLOBALMENTE
   ============================================================ */
window.renderDicionarioViagem = renderDicionarioViagem;
window.detectarPais = detectarPais;

console.log('✅ dicionario.js carregado —', Object.keys(DICIONARIOS_POR_PAIS).length, 'países disponíveis');