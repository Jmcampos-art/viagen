/* ============================================================
   AHGA TURISMO — Painel de Notificação de Leads (Admin)
   ============================================================ */

const API_URL_NOTIF_LEADS = window.API_URL || 'http://localhost:3000';
const URL_SITE = 'https://ahgaturismo.netlify.app';

let leadsCarregados = [];

/* ============================================================
   ABRIR PAINEL
   ============================================================ */
async function abrirPainelLeads() {
  let modal = document.getElementById('leadsModal');
  
  // Cria o modal se não existir
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'leadsModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal leads-modal">
        <button class="modal-close" onclick="fecharPainelLeads()" type="button">
          <i class="fas fa-times"></i>
        </button>
        <h3><i class="fab fa-whatsapp" style="color:#25D366;"></i> Notificar Leads</h3>
        <p class="modal-sub">Pessoas cadastradas para receber avisos de novas excursões</p>
        <div id="leadsConteudo" class="leads-conteudo">
          <div class="empty-state">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Carregando leads...</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  await carregarLeads();
}

function fecharPainelLeads() {
  const modal = document.getElementById('leadsModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   CARREGAR LEADS
   ============================================================ */
async function carregarLeads() {
  const container = document.getElementById('leadsConteudo');
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-circle-notch fa-spin"></i>
      <p>Carregando leads...</p>
    </div>
  `;

  try {
    const r = await fetch(`${API_URL_NOTIF_LEADS}/api/leads`, {
      headers: { 'X-Admin-Auth': 'true' }
    });
    const data = await r.json();
    leadsCarregados = data.leads || [];

    renderizarLeads();
  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Erro ao carregar leads</p>
        <span>${err.message}</span>
      </div>
    `;
  }
}

/* ============================================================
   RENDERIZAR
   ============================================================ */
function renderizarLeads() {
  const container = document.getElementById('leadsConteudo');
  if (!container) return;

  if (leadsCarregados.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-user-plus"></i>
        <p>Nenhum lead cadastrado ainda</p>
        <span>Quando alguém se cadastrar no site, aparecerá aqui</span>
      </div>
    `;
    return;
  }

  let html = `
    <div class="leads-stats">
      <div class="leads-stat">
        <i class="fas fa-users" style="color:#5c3ec9;"></i>
        <div>
          <span class="label">Total</span>
          <strong class="value">${leadsCarregados.length}</strong>
        </div>
      </div>
      <div class="leads-stat">
        <i class="fas fa-check-circle" style="color:#22b573;"></i>
        <div>
          <span class="label">Ativos</span>
          <strong class="value">${leadsCarregados.filter(l => l.ativo).length}</strong>
        </div>
      </div>
    </div>

    <div class="leads-acoes-topo">
      <button class="btn-primary small" onclick="notificarTodosLeads()" type="button">
        <i class="fab fa-whatsapp"></i> Notificar todos
      </button>
      <button class="btn-secondary small" onclick="copiarListaLeads()" type="button">
        <i class="fas fa-copy"></i> Copiar lista
      </button>
      <button class="btn-secondary small" onclick="carregarLeads()" type="button">
        <i class="fas fa-sync"></i> Atualizar
      </button>
    </div>

    <div class="leads-lista">
  `;

  leadsCarregados.forEach(lead => {
    const telLimpo = lead.telefone;
    const telWhats = telLimpo.startsWith('55') ? telLimpo : `55${telLimpo}`;
    const dataCad = lead.criadoEm
      ? new Date(lead.criadoEm).toLocaleDateString('pt-BR')
      : '—';
    const notifCount = lead.notificacoesEnviadas || 0;

    html += `
      <div class="lead-card">
        <div class="lead-avatar">${(lead.nome || 'A').charAt(0).toUpperCase()}</div>
        <div class="lead-info">
          <strong>${lead.nome || '—'}</strong>
          <span><i class="fas fa-phone"></i> ${lead.telefoneFormatado || lead.telefone}</span>
          <span class="lead-data">
            <i class="fas fa-calendar"></i> Cadastrado em ${dataCad}
            ${notifCount > 0 ? ` · <span style="color:#22b573;">${notifCount} notif. enviada(s)</span>` : ''}
          </span>
        </div>
        <div class="lead-acoes">
          <a 
            class="icon-btn" 
            href="https://wa.me/${telWhats}?text=${encodeURIComponent('Olá ' + lead.nome + '! Temos uma nova excursão na AHGA Turismo. Confira: ' + URL_SITE)}" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Enviar WhatsApp"
            onclick="marcarLeadNotificado('${lead.id}')">
            <i class="fab fa-whatsapp" style="color:#25D366;"></i>
          </a>
          <button 
            class="icon-btn" 
            title="Remover" 
            onclick="removerLead('${lead.id}', '${(lead.nome || '').replace(/'/g, "\\'")}')"
            style="background:#ffe0e0;color:#a13030;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

/* ============================================================
   NOTIFICAR TODOS OS LEADS
   ============================================================ */
async function notificarTodosLeads() {
  if (leadsCarregados.length === 0) {
    alert('Nenhum lead cadastrado');
    return;
  }

  // Pega a excursão mais recente
  let excursaoTexto = '';
  try {
    const r = await fetch(`${API_URL_NOTIF_LEADS}/api/excursoes`);
    const data = await r.json();
    const lista = data.excursoes || [];
    if (lista.length > 0) {
      const ultima = lista[0];
      excursaoTexto = `\n\n*${ultima.titulo}*\n📍 ${ultima.destino}\n📅 ${formatarDataLead(ultima.dataIda)}\n💰 R$ ${Number(ultima.preco || 0).toLocaleString('pt-BR')}`;
    }
  } catch (err) {
    console.warn('Erro ao buscar excursão:', err);
  }

  const confirmar = confirm(
    `📢 NOTIFICAR TODOS OS LEADS?\n\n` +
    `Total: ${leadsCarregados.length} pessoa(s)\n\n` +
    `⚠️ O WhatsApp abrirá uma aba para cada pessoa.\n` +
    `Permita pop-ups no navegador.\n\n` +
    `Deseja continuar?`
  );

  if (!confirmar) return;

  const msgBase = 
    `🎉 *AHGA TURISMO — Novidade!*\n\n` +
    `Olá! Temos uma nova excursão disponível:` +
    excursaoTexto + `\n\n` +
    `👉 Confira todos os detalhes: ${URL_SITE}\n\n` +
    `_AHGA Turismo · Excursões Botucatu_`;

  let enviados = 0;

  for (const lead of leadsCarregados) {
    const telLimpo = lead.telefone.replace(/\D/g, '');
    if (!telLimpo) continue;

    const telWhats = telLimpo.startsWith('55') ? telLimpo : `55${telLimpo}`;
    const url = `https://wa.me/${telWhats}?text=${encodeURIComponent(msgBase)}`;

    window.open(url, '_blank');
    enviados++;

    // Marca como notificado no servidor
    await fetch(`${API_URL_NOTIF_LEADS}/api/leads/${lead.id}/notificado`, {
      method: 'POST',
      headers: { 'X-Admin-Auth': 'true' }
    });

    // Delay entre aberturas
    await new Promise(r => setTimeout(r, 600));
  }

  setTimeout(() => {
    alert(`✅ ${enviados} notificação(ões) enviada(s)!`);
    carregarLeads();
  }, 800);
}

/* ============================================================
   MARCAR LEAD COMO NOTIFICADO
   ============================================================ */
async function marcarLeadNotificado(id) {
  try {
    await fetch(`${API_URL_NOTIF_LEADS}/api/leads/${id}/notificado`, {
      method: 'POST',
      headers: { 'X-Admin-Auth': 'true' }
    });
  } catch (err) {
    console.warn('Erro ao marcar notificado:', err);
  }
}

/* ============================================================
   REMOVER LEAD
   ============================================================ */
async function removerLead(id, nome) {
  if (!confirm(`Remover "${nome}" da lista de notificações?`)) return;

  try {
    await fetch(`${API_URL_NOTIF_LEADS}/api/leads/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Auth': 'true' }
    });

    carregarLeads();
  } catch (err) {
    alert('Erro ao remover: ' + err.message);
  }
}

/* ============================================================
   COPIAR LISTA DE LEADS
   ============================================================ */
function copiarListaLeads() {
  if (leadsCarregados.length === 0) {
    alert('Nenhum lead para copiar');
    return;
  }

  let texto = `📋 *LISTA DE LEADS — AHGA TURISMO*\n\n`;
  leadsCarregados.forEach((l, i) => {
    texto += `${i + 1}. ${l.nome} — ${l.telefoneFormatado || l.telefone}\n`;
  });
  texto += `\nTotal: ${leadsCarregados.length} lead(s)`;

  navigator.clipboard.writeText(texto).then(() => {
    alert('✅ Lista copiada!');
  }).catch(() => {
    prompt('Copie a lista:', texto);
  });
}

/* ============================================================
   HELPER
   ============================================================ */
function formatarDataLead(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${d.getDate()} ${meses[d.getMonth()]}`;
}

/* ============================================================
   EXPÕE
   ============================================================ */
window.abrirPainelLeads = abrirPainelLeads;
window.fecharPainelLeads = fecharPainelLeads;
window.carregarLeads = carregarLeads;
window.notificarTodosLeads = notificarTodosLeads;
window.removerLead = removerLead;
window.marcarLeadNotificado = marcarLeadNotificado;
window.copiarListaLeads = copiarListaLeads;

console.log('✅ notificar-leads.js carregado');