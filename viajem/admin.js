/* ============================================================
   AHGA TURISMO - Painel Admin
   ============================================================ */

const API_URL_ADMIN = window.API_URL || 'http://localhost:3000';
const URL_SITE_PUBLICO = 'https://ahgaturismo.netlify.app';

/* ============================================================
   USUÁRIOS AUTORIZADOS
   ============================================================ */
const USUARIOS_AUTORIZADOS = {
  'tecnologia': {
    senha: 'ahga@tec.2025',
    nome: 'Tecnologia',
    cargo: 'Administrador',
    role: 'admin',
    podeCriar: true,
    podeEditar: true,
    podeExcluir: true
  },
  'gabriela bastos': {
    senha: 'ahga@gabi.2025',
    nome: 'Gabriela Bastos',
    cargo: 'Vendedora',
    role: 'vendedor',
    podeCriar: true,
    podeEditar: false,
    podeExcluir: true
  },
  'hiago lippi': {
    senha: 'ahga@hiago.2025',
    nome: 'Hiago Lippi',
    cargo: 'Vendedor',
    role: 'vendedor',
    podeCriar: true,
    podeEditar: false,
    podeExcluir: true
  }
};

/* ============================================================
   SESSÃO
   ============================================================ */
const SESSION_KEY = 'ahga_sessao';

function getSessao() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setSessao(dados) {
  if (dados) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(dados));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function isLogado() {
  return !!getSessao();
}

/* ============================================================
   UTILITÁRIO — Converte preço BR em número puro
   ============================================================ */
function parsePrecoBR(valor) {
  if (valor === null || valor === undefined || valor === '') return 0;
  const apenasDigitos = String(valor).replace(/\D/g, '');
  return parseInt(apenasDigitos, 10) || 0;
}

/* ============================================================
   UTILITÁRIO — Analisa vagas
   ✅ REGRA: vagas vazio/0/null = ILIMITADO
   ============================================================ */
function analisarVagas(exc) {
  const vagasNum = Number(exc.vagas);
  const temControleVagas = Number.isFinite(vagasNum) && vagasNum > 0;
  const semVagas = temControleVagas && vagasNum <= 0;

  let textoCurto = 'Vagas disponíveis';
  let textoLongo = 'Vagas disponíveis';
  let textoAdmin = 'Ilimitado';

  if (temControleVagas) {
    textoCurto = vagasNum > 0 ? vagasNum + ' vagas' : 'Vagas esgotadas';
    textoLongo = vagasNum > 0 ? vagasNum + ' vagas disponíveis' : 'Vagas esgotadas';
    textoAdmin = String(vagasNum);
  }

  return { temControleVagas, semVagas, textoCurto, textoLongo, textoAdmin };
}

/* ============================================================
   HEADER
   ============================================================ */
function atualizarHeader() {
  const sessao = getSessao();
  const btnLogin = document.getElementById('btnLogin');
  const userInfo = document.getElementById('userInfo');
  const adminLinks = document.querySelectorAll('.admin-only');
  const nomeEl = document.getElementById('userNameDisplay');
  const cargoEl = document.getElementById('userCargoDisplay');
  const avatarEl = document.getElementById('userAvatar');

  if (sessao) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    adminLinks.forEach(function(el) { el.style.display = ''; });

    if (nomeEl) nomeEl.textContent = sessao.nome;
    if (cargoEl) cargoEl.textContent = sessao.cargo;

    if (avatarEl) {
      const inicial = (sessao.nome || 'A').charAt(0).toUpperCase();
      avatarEl.textContent = inicial;
    }
  } else {
    if (btnLogin) btnLogin.style.display = '';
    if (userInfo) userInfo.style.display = 'none';
    adminLinks.forEach(function(el) { el.style.display = 'none'; });
  }

  aplicarPermissoes();
}

function aplicarPermissoes() {
  const sessao = getSessao();
  if (!sessao) return;

  const btnNova = document.querySelector('.admin-actions .btn-primary');
  if (btnNova) btnNova.style.display = sessao.podeCriar ? '' : 'none';
}

/* ============================================================
   ABAS
   ============================================================ */
function mudarAba(e, aba) {
  if (e) e.preventDefault();

  const sessao = getSessao();

  if (!sessao && aba !== 'excursoes') {
    aba = 'excursoes';
  }

  if (aba === 'gerenciar' && !sessao) {
    abrirLogin();
    return;
  }

  document.querySelectorAll('.tab-content').forEach(function(t) {
    t.style.display = 'none';
    t.classList.remove('tab-fade-in');
  });

  document.querySelectorAll('.app-nav-link').forEach(function(l) {
    l.classList.remove('active');
  });

  const tab = document.getElementById('tab-' + aba);
  const link = document.querySelector('.app-nav-link[data-tab="' + aba + '"]');

  if (tab) {
    tab.style.display = 'block';
    setTimeout(function() { tab.classList.add('tab-fade-in'); }, 10);
  }
  if (link) link.classList.add('active');

  if (aba === 'excursoes') carregarExcursoesPublicas();
  if (aba === 'gerenciar') {
    carregarExcursoesAdmin();
    carregarComprasAdmin();
  }
}

function irParaHome(e) {
  if (e) e.preventDefault();
  mudarAba(null, isLogado() ? 'buscar' : 'excursoes');
}

/* ============================================================
   LOGIN MODAL
   ============================================================ */
function abrirLogin() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  esconderErro();
  setTimeout(function() {
    const input = document.getElementById('adminUser');
    if (input) input.focus();
  }, 100);
}

function fecharLogin() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  esconderErro();
  const form = document.getElementById('formLoginAdmin');
  if (form) form.reset();
}

function toggleSenha(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function mostrarErro(msg) {
  const el = document.getElementById('authErro');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function esconderErro() {
  const el = document.getElementById('authErro');
  if (el) el.style.display = 'none';
}

/* ============================================================
   EXCURSÕES - PÚBLICO
   ============================================================ */
async function carregarExcursoesPublicas() {
  const container = document.getElementById('excursoesPublicas');
  if (!container) return;

  container.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-circle-notch fa-spin"></i><p>Carregando excursões...</p></div>';

  try {
    const r = await fetch(API_URL_ADMIN + '/api/excursoes');
    const data = await r.json();
    const lista = data.excursoes || [];

    if (!lista.length) {
      container.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-suitcase-rolling"></i><p>Nenhuma excursão publicada ainda.</p><span>Volte em breve!</span></div>';
      return;
    }

    container.innerHTML = lista.map(function(exc) {
      return renderExcursaoCard(exc);
    }).join('');
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar excursões.</p></div>';
  }
}

function renderExcursaoCard(exc) {
  const img = exc.imagem || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80';
  const dataIda = formatarData(exc.dataIda);
  const dataVolta = exc.dataVolta ? formatarData(exc.dataVolta) : null;
  const preco = Number(exc.preco || 0).toLocaleString('pt-BR');

  const v = analisarVagas(exc);

  return '<div class="excursao-card">' +
    '<div class="excursao-img" style="background-image: linear-gradient(0deg, rgba(15,43,75,0.5), rgba(15,43,75,0.1)), url(\'' + img + '\');">' +
      '<span class="excursao-categoria">' + (exc.categoria || 'Geral') + '</span>' +
    '</div>' +
    '<div class="excursao-body">' +
      '<h3 class="excursao-titulo">' + exc.titulo + '</h3>' +
      '<div class="excursao-meta">' +
        '<span><i class="fas fa-map-pin"></i> ' + exc.destino + '</span>' +
        '<span><i class="fas fa-calendar"></i> ' + dataIda + (dataVolta ? ' – ' + dataVolta : '') + '</span>' +
      '</div>' +
      (exc.descricao ? '<p class="excursao-desc">' + exc.descricao + '</p>' : '') +
      '<div class="excursao-footer">' +
        '<div class="excursao-preco">' +
          '<span class="preco-label">A partir de</span>' +
          '<strong>R$ ' + preco + '</strong>' +
          '<span class="preco-por">por pessoa</span>' +
        '</div>' +
        '<div class="excursao-acoes">' +
          '<span class="excursao-vagas">' + v.textoCurto + '</span>' +
          '<div style="display:flex; gap:0.4rem; flex-wrap:wrap; justify-content:flex-end;">' +
            '<button class="btn-secondary small" onclick=\'verDetalhesExcursao("' + exc.id + '")\' type="button">' +
              '<i class="fas fa-info-circle"></i> Detalhes' +
            '</button>' +
            '<button class="btn-primary small" onclick=\'abrirCompra("' + exc.id + '")\' type="button"' + (v.semVagas ? ' disabled style="opacity:0.5;cursor:not-allowed;"' : '') + '>' +
              '<i class="fas fa-ticket-alt"></i> ' + (v.semVagas ? 'Esgotado' : 'Comprar') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

async function verDetalhesExcursao(id) {
  try {
    const r = await fetch(API_URL_ADMIN + '/api/excursoes/' + id);
    const data = await r.json();
    const exc = data.excursao;
    if (!exc) return;

    const img = exc.imagem || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80';
    const inclui = (exc.inclui || []).map(function(i) {
      return '<li><i class="fas fa-check"></i> ' + i + '</li>';
    }).join('');
    const roteiro = (exc.roteiro || []).map(function(r) {
      return '<li><i class="fas fa-circle-dot"></i> ' + r + '</li>';
    }).join('');

    const v = analisarVagas(exc);

    document.getElementById('modalContent').innerHTML =
      '<button class="modal-close" onclick="closeModal()" type="button"><i class="fas fa-times"></i></button>' +
      '<div class="modal-hero-img" style="background-image: url(\'' + img + '\');"></div>' +
      '<h3><i class="fas fa-suitcase-rolling"></i> ' + exc.titulo + '</h3>' +
      '<p class="modal-sub">' + exc.destino + ' · ' + formatarData(exc.dataIda) + (exc.dataVolta ? ' – ' + formatarData(exc.dataVolta) : '') + '</p>' +
      (exc.descricao ? '<div class="modal-section"><h4><i class="fas fa-align-left"></i> Descrição</h4><p style="font-size:0.9rem;color:#6b7d98;line-height:1.6;">' + exc.descricao + '</p></div>' : '') +
      (inclui ? '<div class="modal-section"><h4><i class="fas fa-check-circle"></i> O que está incluso</h4><ul class="included-list">' + inclui + '</ul></div>' : '') +
      (roteiro ? '<div class="modal-section"><h4><i class="fas fa-route"></i> Roteiro</h4><ul class="included-list">' + roteiro + '</ul></div>' : '') +
      '<div class="modal-total">' +
        '<span>Valor por pessoa</span>' +
        '<strong>R$ ' + Number(exc.preco || 0).toLocaleString('pt-BR') + '</strong>' +
        '<small>' + v.textoLongo + '</small>' +
      '</div>' +
      '<div class="modal-actions" style="display:flex; gap:0.6rem; margin-top:1rem;">' +
        '<button class="btn-secondary" style="flex:1;" onclick="closeModal()" type="button"><i class="fas fa-times"></i> Fechar</button>' +
        '<button class="btn-primary" style="flex:2;" onclick=\'closeModal(); abrirCompra("' + exc.id + '")\' type="button"' + (v.semVagas ? ' disabled' : '') + '>' +
          '<i class="fas fa-ticket-alt"></i> ' + (v.semVagas ? 'Vagas esgotadas' : 'Comprar agora') +
        '</button>' +
      '</div>';

    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar detalhes');
  }
}

/* ============================================================
   EXCURSÕES - ADMIN
   ============================================================ */
async function carregarExcursoesAdmin() {
  const container = document.getElementById('adminExcursoesList');
  const sessao = getSessao();
  if (!sessao || !container) return;

  container.innerHTML = '<div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i><p>Carregando...</p></div>';

  try {
    const r = await fetch(API_URL_ADMIN + '/api/excursoes');
    const data = await r.json();
    const lista = data.excursoes || [];

    if (!lista.length) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhuma excursão cadastrada.</p>' + (sessao.podeCriar ? '<span>Clique em "Nova excursão" para começar.</span>' : '') + '</div>';
      return;
    }

    let linhas = '';
    lista.forEach(function(exc) {
      const v = analisarVagas(exc);

      linhas += '<tr>' +
        '<td><strong>' + exc.titulo + '</strong></td>' +
        '<td>' + exc.destino + '</td>' +
        '<td>' + formatarData(exc.dataIda) + '</td>' +
        '<td>R$ ' + Number(exc.preco || 0).toLocaleString('pt-BR') + '</td>' +
        '<td>' + (
          v.temControleVagas
            ? v.textoAdmin
            : '<span style="color:#64748b;font-size:0.85rem;font-style:italic;">Ilimitado</span>'
        ) + '</td>' +
        '<td><span class="autor-badge">' + (exc.criadoPor || '—') + '</span></td>' +
        '<td class="admin-actions-cell">' +
          '<button class="icon-btn" onclick=\'abrirListaExcursao("' + exc.id + '")\' type="button" title="Ver lista de passageiros" style="background:linear-gradient(135deg,#e91e63,#f5a623);color:white;">' +
            '<i class="fas fa-users"></i>' +
          '</button>' +
          '<button class="icon-btn" onclick=\'notificarExcursao("' + exc.id + '")\' type="button" title="Notificar passageiros" style="background:linear-gradient(135deg,#25D366,#128C7E);color:white;">' +
            '<i class="fab fa-whatsapp"></i>' +
          '</button>' +
          (sessao.podeEditar ? '<button class="icon-btn edit" onclick=\'editarExcursao("' + exc.id + '")\' type="button" title="Editar"><i class="fas fa-pen"></i></button>' : '') +
          (sessao.podeExcluir ? '<button class="icon-btn delete" onclick=\'excluirExcursao("' + exc.id + '", "' + exc.titulo.replace(/"/g, '&quot;') + '")\' type="button" title="Excluir"><i class="fas fa-trash"></i></button>' : '') +
        '</td>' +
      '</tr>';
    });

    container.innerHTML = '<table class="admin-table">' +
      '<thead><tr><th>Título</th><th>Destino</th><th>Data ida</th><th>Preço</th><th>Vagas</th><th>Criado por</th><th>Ações</th></tr></thead>' +
      '<tbody>' + linhas + '</tbody>' +
    '</table>';
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar.</p></div>';
  }
}

/* ============================================================
   NOTIFICAR EXCURSÃO (atalho direto da tabela)
   ============================================================ */
function notificarExcursao(excursaoId) {
  // Abre o painel de notificações
  if (typeof abrirPainelNotificacoes === 'function') {
    abrirPainelNotificacoes();
  } else {
    alert('Sistema de notificações não carregado. Recarregue a página.');
  }
}

/* ============================================================
   COMPRAS - ADMIN
   ============================================================ */
async function carregarComprasAdmin() {
  const container = document.getElementById('adminComprasList');
  const sessao = getSessao();
  if (!sessao || !container) return;

  container.innerHTML = '<div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i><p>Carregando compras...</p></div>';

  try {
    const r = await fetch(API_URL_ADMIN + '/api/compras');
    const data = await r.json();
    const lista = data.compras || [];

    if (!lista.length) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhuma compra registrada ainda.</p></div>';
      return;
    }

    let linhas = '';
    lista.forEach(function(c) {
      const statusBadge = c.status === 'utilizado'
        ? '<span style="background:#d4f5e5;color:#0d7a4a;padding:0.2rem 0.6rem;border-radius:1rem;font-size:0.75rem;font-weight:700;">Utilizado</span>'
        : (c.status === 'aprovado'
          ? '<span style="background:#d4f5e5;color:#0d7a4a;padding:0.2rem 0.6rem;border-radius:1rem;font-size:0.75rem;font-weight:700;">Aprovado</span>'
          : (c.status === 'cancelado'
            ? '<span style="background:#ffe0e0;color:#a13030;padding:0.2rem 0.6rem;border-radius:1rem;font-size:0.75rem;font-weight:700;">Cancelado</span>'
            : '<span style="background:#fff3cd;color:#7a5b1a;padding:0.2rem 0.6rem;border-radius:1rem;font-size:0.75rem;font-weight:700;">Pendente</span>'
          )
        );

      const notifBadge = c.notificadoEm
        ? `<span style="background:#e8fff1;color:#0d7a4a;padding:0.15rem 0.45rem;border-radius:0.8rem;font-size:0.68rem;font-weight:700;margin-left:0.3rem;" title="${new Date(c.notificadoEm).toLocaleString('pt-BR')}">📲 notificado</span>`
        : '';

      const telLimpo = (c.telefone || '').replace(/\D/g, '');
      const msgWhats = encodeURIComponent(
        `Olá ${c.nome}! Aqui está o link do seu cartão de embarque da AHGA Turismo:\n\n${URL_SITE_PUBLICO}/cartao.html?codigo=${c.codigo}\n\nApresente o QR Code no dia da excursão. Boa viagem! 🚌`
      );

      linhas += '<tr>' +
        '<td><strong>' + (c.nome || '—') + '</strong>' + notifBadge + '<br><span style="font-size:0.72rem;color:#64748b;">' + (c.telefone || '') + '</span></td>' +
        '<td>' + (c.cpf || '—') + '</td>' +
        '<td>' + (c.excursaoTitulo || '—') + '</td>' +
        '<td>' + (c.qtd || 1) + '</td>' +
        '<td><strong style="color:var(--ahga-rosa);">R$ ' + Number(c.total || 0).toLocaleString('pt-BR') + '</strong></td>' +
        '<td><code style="font-size:0.75rem;">' + (c.codigo || '—') + '</code></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td class="admin-actions-cell">' +
          '<button class="icon-btn" title="Copiar link do cartão" onclick=\'copiarLinkCartao("' + c.codigo + '")\' type="button">' +
            '<i class="fas fa-link"></i>' +
          '</button>' +
          (telLimpo ? '<a class="icon-btn" title="Enviar por WhatsApp" target="_blank" rel="noopener noreferrer" href="https://wa.me/55' + telLimpo + '?text=' + msgWhats + '">' +
            '<i class="fab fa-whatsapp"></i>' +
          '</a>' : '') +
          '<button class="icon-btn" title="Excluir passageiro" onclick=\'excluirCompra("' + c.codigo + '", "' + (c.nome || '').replace(/"/g, '&quot;') + '")\' type="button" style="background:#ffe0e0;color:#a13030;">' +
            '<i class="fas fa-trash"></i>' +
          '</button>' +
        '</td>' +
      '</tr>';
    });

    container.innerHTML = '<table class="admin-table">' +
      '<thead><tr><th>Passageiro</th><th>CPF</th><th>Excursão</th><th>Qtd</th><th>Valor</th><th>Código</th><th>Status</th><th>Ações</th></tr></thead>' +
      '<tbody>' + linhas + '</tbody>' +
    '</table>';
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar compras.</p></div>';
  }
}

/* ============================================================
   EXCLUIR COMPRA
   ============================================================ */
async function excluirCompra(codigo, nomePassageiro) {
  const confirmacao1 = confirm(
    '🗑️ EXCLUIR PASSAGEIRO?\n\n' +
    'Passageiro: ' + (nomePassageiro || 'Sem nome') + '\n' +
    'Código: ' + codigo + '\n\n' +
    '⚠️ Isso vai remover o passageiro do sistema.\n' +
    'Deseja continuar?'
  );

  if (!confirmacao1) return;

  const confirmacao2 = prompt(
    '⚠️ CONFIRMAÇÃO FINAL ⚠️\n\n' +
    'Esta ação NÃO pode ser desfeita!\n\n' +
    'Digite o código "' + codigo + '" para confirmar:'
  );

  if (!confirmacao2 || confirmacao2.trim() !== codigo) {
    alert('❌ Exclusão cancelada. Código não confere.');
    return;
  }

  try {
    const r = await fetch(API_URL_ADMIN + '/api/compras/' + codigo, {
      method: 'DELETE',
      headers: { 'X-Admin-Auth': 'true' }
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Erro ao excluir');

    alert('✅ Passageiro excluído com sucesso!\n\nAs vagas foram devolvidas para a excursão.');
    carregarComprasAdmin();
    carregarExcursoesAdmin();

  } catch (err) {
    console.error(err);
    alert('❌ Erro ao excluir: ' + err.message);
  }
}

function copiarLinkCartao(codigo) {
  const url = URL_SITE_PUBLICO + '/cartao.html?codigo=' + codigo;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function() {
      alert('✅ Link copiado!\n\n' + url + '\n\nAgora é só colar no WhatsApp do cliente.');
    }).catch(function() {
      prompt('Copie o link abaixo:', url);
    });
  } else {
    prompt('Copie o link abaixo:', url);
  }
}

/* ============================================================
   FORM EXCURSÃO
   ============================================================ */
function abrirFormExcursao(exc) {
  const modal = document.getElementById('excursaoModal');
  const title = document.getElementById('excursaoFormTitle');
  const form = document.getElementById('formExcursao');
  if (!modal || !form) return;

  form.reset();

  if (exc) {
    title.textContent = 'Editar excursão';
    document.getElementById('excursaoId').value = exc.id;
    document.getElementById('excTitulo').value = exc.titulo || '';
    document.getElementById('excDestino').value = exc.destino || '';
    document.getElementById('excDataIda').value = exc.dataIda || '';
    document.getElementById('excDataVolta').value = exc.dataVolta || '';
    document.getElementById('excPreco').value = exc.preco
      ? Number(exc.preco).toLocaleString('pt-BR')
      : '';
    document.getElementById('excVagas').value = exc.vagas || '';
    document.getElementById('excCategoria').value = exc.categoria || 'Geral';
    document.getElementById('excImagem').value = exc.imagem || '';
    document.getElementById('excDescricao').value = exc.descricao || '';
    document.getElementById('excInclui').value = (exc.inclui || []).join('\n');
    document.getElementById('excRoteiro').value = (exc.roteiro || []).join('\n');
  } else {
    title.textContent = 'Nova excursão';
    document.getElementById('excursaoId').value = '';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharFormExcursao() {
  const modal = document.getElementById('excursaoModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

async function editarExcursao(id) {
  const sessao = getSessao();
  if (!sessao || !sessao.podeEditar) {
    alert('Você não tem permissão para editar excursões.');
    return;
  }
  try {
    const r = await fetch(API_URL_ADMIN + '/api/excursoes/' + id);
    const data = await r.json();
    if (data.excursao) abrirFormExcursao(data.excursao);
  } catch (err) {
    alert('Erro ao carregar excursão');
  }
}

async function excluirExcursao(id, titulo) {
  const sessao = getSessao();
  if (!sessao || !sessao.podeExcluir) {
    alert('Você não tem permissão para excluir excursões.');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir "' + titulo + '"?')) return;

  try {
    const r = await fetch(API_URL_ADMIN + '/api/excursoes/' + id, {
      method: 'DELETE',
      headers: { 'X-Admin-Auth': 'true' }
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error || 'Erro ao excluir');
    }
    carregarExcursoesAdmin();
  } catch (err) {
    alert(err.message);
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
function formatarData(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return d.getDate() + ' ' + meses[d.getMonth()] + ' ' + d.getFullYear();
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 admin.js inicializado');
  atualizarHeader();

  if (isLogado()) {
    mudarAba(null, 'buscar');
  } else {
    mudarAba(null, 'excursoes');
  }

  /* Máscara de moeda no campo de preço */
  const excPrecoInput = document.getElementById('excPreco');
  if (excPrecoInput) {
    excPrecoInput.addEventListener('input', function(e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v) {
        v = parseInt(v, 10).toLocaleString('pt-BR');
      }
      e.target.value = v;
    });
  }

  const formLogin = document.getElementById('formLoginAdmin');
  if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();

      esconderErro();

      const user = document.getElementById('adminUser').value.trim().toLowerCase();
      const senha = document.getElementById('adminSenha').value;

      const conta = USUARIOS_AUTORIZADOS[user];

      if (conta && conta.senha === senha) {
        setSessao({
          usuario: user,
          nome: conta.nome,
          cargo: conta.cargo,
          role: conta.role,
          podeCriar: conta.podeCriar,
          podeEditar: conta.podeEditar,
          podeExcluir: conta.podeExcluir
        });

        fecharLogin();
        atualizarHeader();

        setTimeout(function() {
          mudarAba(null, 'gerenciar');
        }, 200);
      } else {
        mostrarErro('Usuário ou senha incorretos.');
      }
    });
  }

  const formExc = document.getElementById('formExcursao');
  if (formExc) {
    formExc.addEventListener('submit', async function(e) {
      e.preventDefault();
      const sessao = getSessao();
      if (!sessao) {
        alert('Você precisa estar logado.');
        return;
      }

      const btn = document.getElementById('btnSalvarExcursao');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Salvando...';

      const id = document.getElementById('excursaoId').value;
      const payload = {
        titulo: document.getElementById('excTitulo').value.trim(),
        destino: document.getElementById('excDestino').value.trim(),
        dataIda: document.getElementById('excDataIda').value,
        dataVolta: document.getElementById('excDataVolta').value || '',
        preco: parsePrecoBR(document.getElementById('excPreco').value),
        vagas: Number(document.getElementById('excVagas').value) || 0,
        categoria: document.getElementById('excCategoria').value,
        imagem: document.getElementById('excImagem').value.trim(),
        descricao: document.getElementById('excDescricao').value.trim(),
        inclui: document.getElementById('excInclui').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean),
        roteiro: document.getElementById('excRoteiro').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean),
        criadoPor: sessao.nome
      };

      try {
        const url = id ? API_URL_ADMIN + '/api/excursoes/' + id : API_URL_ADMIN + '/api/excursoes';
        const method = id ? 'PUT' : 'POST';

        const r = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Auth': 'true'
          },
          body: JSON.stringify(payload)
        });

        if (!r.ok) {
          const err = await r.json();
          throw new Error(err.error || 'Erro ao salvar');
        }

        fecharFormExcursao();
        carregarExcursoesAdmin();
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Salvar';
      }
    });
  }

  const btnLogout = document.getElementById('logoutBtn');
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      setSessao(null);
      atualizarHeader();
      mudarAba(null, 'excursoes');
    });
  }

  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.addEventListener('click', function(e) {
      if (e.target.id === 'loginModal') fecharLogin();
    });
  }

  const excursaoModal = document.getElementById('excursaoModal');
  if (excursaoModal) {
    excursaoModal.addEventListener('click', function(e) {
      if (e.target.id === 'excursaoModal') fecharFormExcursao();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      fecharLogin();
      fecharFormExcursao();
    }
  });
});

/* ============================================================
   EXPÕE GLOBALMENTE
   ============================================================ */
window.abrirLogin = abrirLogin;
window.fecharLogin = fecharLogin;
window.toggleSenha = toggleSenha;
window.mudarAba = mudarAba;
window.irParaHome = irParaHome;
window.abrirFormExcursao = abrirFormExcursao;
window.fecharFormExcursao = fecharFormExcursao;
window.editarExcursao = editarExcursao;
window.excluirExcursao = excluirExcursao;
window.verDetalhesExcursao = verDetalhesExcursao;
window.carregarComprasAdmin = carregarComprasAdmin;
window.copiarLinkCartao = copiarLinkCartao;
window.excluirCompra = excluirCompra;
window.notificarExcursao = notificarExcursao;
window.getSessao = getSessao;
window.setSessao = setSessao;

console.log('✅ admin.js carregado com sucesso');