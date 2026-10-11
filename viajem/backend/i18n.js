/* ============================================================
   AHGA TURISMO — Sistema de Tradução (i18n + Google Tradutor)
   ============================================================ */

/* ---------- DICIONÁRIO MANUAL (textos fixos) ---------- */
const TRADUCOES = {
  pt: {
    'nav.excursoes': 'Excursões',
    'nav.buscar': 'Buscar',
    'nav.gerenciar': 'Gerenciar',
    'nav.entrar': 'Entrar',
    'nav.sair': 'Sair',
    'home.subhead': 'Excursões e viagens planejadas com inteligência artificial',
    'home.subhead.excursoes': 'Excursões organizadas com roteiro, transporte e hospedagem',
    'busca.titulo': 'Conte seu perfil de viagem',
    'busca.origem': 'Saindo de',
    'busca.destino': 'Destino',
    'busca.noites': 'Quantas noites?',
    'busca.data': 'Data aproximada (opcional)',
    'busca.clima': 'Clima preferido',
    'busca.orcamento': 'Orçamento total (R$)',
    'busca.botao': 'Buscar viagens',
    'busca.ia': 'Gerar roteiro completo com IA',
    'busca.ia.hint': 'A IA cria uma viagem inteira: múltiplos destinos, dias em cada lugar e roteiro dia a dia.',
    'carta.titulo': 'Já comprou sua excursão?',
    'carta.sub': 'Solicite ao vendedor o link do seu cartão de embarque',
    'carta.botao': 'Solicitar Cartão de Embarque',
    'footer.copy': 'AHGA Turismo · Excursões Botucatu © 2025'
  },
  en: {
    'nav.excursoes': 'Tours',
    'nav.buscar': 'Search',
    'nav.gerenciar': 'Manage',
    'nav.entrar': 'Sign in',
    'nav.sair': 'Sign out',
    'home.subhead': 'Tours and trips planned with artificial intelligence',
    'home.subhead.excursoes': 'Organized tours with itinerary, transport and accommodation',
    'busca.titulo': 'Tell us your travel profile',
    'busca.origem': 'Departing from',
    'busca.destino': 'Destination',
    'busca.noites': 'How many nights?',
    'busca.data': 'Approximate date (optional)',
    'busca.clima': 'Preferred climate',
    'busca.orcamento': 'Total budget (R$)',
    'busca.botao': 'Search trips',
    'busca.ia': 'Generate full itinerary with AI',
    'busca.ia.hint': 'AI creates a whole trip: multiple destinations, days in each place and day-by-day itinerary.',
    'carta.titulo': 'Already bought your tour?',
    'carta.sub': 'Ask the seller for your boarding pass link',
    'carta.botao': 'Request Boarding Pass',
    'footer.copy': 'AHGA Turismo · Botucatu Tours © 2025'
  },
  es: {
    'nav.excursoes': 'Excursiones',
    'nav.buscar': 'Buscar',
    'nav.gerenciar': 'Gestionar',
    'nav.entrar': 'Entrar',
    'nav.sair': 'Salir',
    'home.subhead': 'Excursiones y viajes planeados con inteligencia artificial',
    'home.subhead.excursoes': 'Excursiones organizadas con itinerario, transporte y alojamiento',
    'busca.titulo': 'Cuéntanos tu perfil de viaje',
    'busca.origem': 'Saliendo de',
    'busca.destino': 'Destino',
    'busca.noites': '¿Cuántas noches?',
    'busca.data': 'Fecha aproximada (opcional)',
    'busca.clima': 'Clima preferido',
    'busca.orcamento': 'Presupuesto total (R$)',
    'busca.botao': 'Buscar viajes',
    'busca.ia': 'Generar itinerario completo con IA',
    'busca.ia.hint': 'La IA crea un viaje completo: múltiples destinos, días en cada lugar e itinerario día a día.',
    'carta.titulo': '¿Ya compraste tu excursión?',
    'carta.sub': 'Pide al vendedor el enlace de tu tarjeta de embarque',
    'carta.botao': 'Solicitar Tarjeta de Embarque',
    'footer.copy': 'AHGA Turismo · Excursiones Botucatu © 2025'
  }
};

/* ---------- IDIOMA ATUAL ---------- */
let idiomaAtual = localStorage.getItem('ahga_idioma') || 'pt';

/* ---------- FUNÇÃO: TRADUZIR A PÁGINA (dicionário) ---------- */
function aplicarTraducoes() {
  const dic = TRADUCOES[idiomaAtual] || TRADUCOES.pt;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const chave = el.getAttribute('data-i18n');
    const traducao = dic[chave];
    if (traducao) {
      // Se tiver ícone dentro, preserva
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = icon.outerHTML + ' ' + traducao;
      } else {
        el.textContent = traducao;
      }
    }
  });

  // Atualiza atributo lang
  document.documentElement.lang = idiomaAtual === 'pt' ? 'pt-BR' : idiomaAtual;

  // Atualiza botão ativo
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === idiomaAtual);
  });

  console.log(`🌐 Idioma aplicado: ${idiomaAtual}`);
}

/* ---------- FUNÇÃO: TROCAR IDIOMA ---------- */
function trocarIdioma(novoIdioma) {
  idiomaAtual = novoIdioma;
  localStorage.setItem('ahga_idioma', novoIdioma);
  aplicarTraducoes();

  // Se o Google Tradutor estiver ativo, muda também
  if (typeof google !== 'undefined' && google.translate) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = novoIdioma === 'pt' ? '' : novoIdioma;
      select.dispatchEvent(new Event('change'));
    }
  }
}

/* ---------- WIDGET DO GOOGLE TRADUTOR ---------- */
function initGoogleTranslate() {
  // Cria o elemento oculto que o Google exige
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  // Define a função de callback global
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'pt',
      includedLanguages: 'en,es,fr,de,it,ja,zh-CN',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');

    console.log('✅ Google Tradutor inicializado');
  };

  // Carrega o script do Google
  if (!document.querySelector('script[src*="translate_a/element.js"]')) {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }
}

/* ---------- CRIA O SELETOR DE IDIOMAS NA INTERFACE ---------- */
function criarSeletorIdiomas() {
  // Evita duplicar
  if (document.getElementById('ahgaLangSelector')) return;

  const container = document.createElement('div');
  container.id = 'ahgaLangSelector';
  container.className = 'ahga-lang-selector';
  container.innerHTML = `
    <button class="lang-btn" data-lang="pt" title="Português">🇧🇷</button>
    <button class="lang-btn" data-lang="en" title="English">🇺🇸</button>
    <button class="lang-btn" data-lang="es" title="Español">🇪🇸</button>
  `;

  // Insere no header, antes do botão de login
  const appUser = document.querySelector('.app-user');
  if (appUser) {
    appUser.parentNode.insertBefore(container, appUser);
  } else {
    document.body.appendChild(container);
  }

  // Eventos
  container.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => trocarIdioma(btn.dataset.lang));
  });

  // Marca o ativo
  aplicarTraducoes();
}

/* ---------- INICIALIZAÇÃO ---------- */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌐 i18n.js carregado');

  initGoogleTranslate();
  criarSeletorIdiomas();
  aplicarTraducoes();
});

/* ---------- EXPÕE GLOBALMENTE ---------- */
window.trocarIdioma = trocarIdioma;
window.aplicarTraducoes = aplicarTraducoes;