/* ============================================================
   AHGA TURISMO — Sistema de Notificações WhatsApp
   Notifica clientes 1 dia antes da excursão
   ============================================================ */

const API_URL_NOTIF = window.API_URL || 'http://localhost:3000';

/* ============================================================
   ABRIR PAINEL DE NOTIFICAÇÕES
   ============================================================ */
async function abrirPainelNotificacoes() {
  const modal = document.getElementById('notificacoesModal');
  if (!modal) {
    console.warn('Modal notificacoesModal não encontrado');
    return;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  document.getElementById('notificacoesConteudo').innerHTML = `
    <div class="empty-state">
      <i class="fas fa-circle-notch fa-spin"></i>
      <p>Analisando excursões...</p>
    </div>`;

  await carregarNotificacoes();
}

function fecharPainelNotificacoes() {
  const modal = document.getElementById('notificacoesModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   CARREGAR EXCURSÕES QUE PRECISAM DE NOTIFICAÇÃO
   ============================================================ */
async function carregarNotificacoes() {
  try {
    const r = await fetch(`${API_URL_NOTIF}/api/notificacoes/pendentes`);
    const data = await r.json();

    if (!r.ok) throw new Error(data.error || 'Erro ao carregar notificações');

    const { amanha, hoje, atrasadas } = data;

    renderizarNotificacoes({ amanha, hoje, atrasadas });

  } catch (err) {
    console.error(err);
    document.getElementById('notificacoesConteudo').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Erro ao carregar notificações</p>
        <span>${err.message}</span>
      </div>`;
  }
}

/* ============================================================
   RENDERIZAR PAINEL
   ============================================================ */
function renderizarNotificacoes({ amanha = [], hoje = [], atrasadas = [] }) {
  const totalAmanha = amanha.reduce((s, e) => s + (e.passageiros?.length || 0), 0);
  const totalHoje = hoje.reduce((s, e) => s + (e.passageiros?.length || 0), 0);

  let html = `
    <div class="notif-resumo">
      <div class="notif-resumo-card amanha">
        <i class="fas fa-bell"></i>
        <div>
          <span class="label">Excursões amanhã</span>
          <strong class="value">${amanha.length}</strong>
          <small>${totalAmanha} passageiro(s) para notificar</small>
        </div>
      </div>
      <div class="notif-resumo-card hoje">
        <i class="fas fa-bus"></i>
        <div>
          <span class="label">Excursões hoje</span>
          <strong class="value">${hoje.length}</strong>
          <small>${totalHoje} passageiro(s) já embarcando</small>
        </div>
      </div>
      ${atrasadas.length > 0 ? `
      <div class="notif-resumo-card atrasada">
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <span class="label">Atrasadas</span>
          <strong class="value">${atrasadas.length}</strong>
          <small>Excursões que já passaram</small>
        </div>
      </div>` : ''}
    </div>
  `;

  if (amanha.length === 0 && hoje.length === 0) {
    html += `
      <div class="empty-state" style="margin-top:1.5rem;">
        <i class="fas fa-check-circle" style="color:#22b573;"></i>
        <p>Nenhuma excursão para notificar</p>
        <span>Quando houver excursões para amanhã, elas aparecerão aqui</span>
      </div>`;
    document.getElementById('notificacoesConteudo').innerHTML = html;
    return;
  }

  // ✅ SEÇÃO: EXCURSÕES DE AMANHÃ (principal)
  if (amanha.length > 0) {
    html += `
      <h3 class="notif-secao-titulo">
        <i class="fas fa-bell" style="color:#e91e63;"></i>
        Excursões de amanhã
        <span class="notif-secao-badge">${totalAmanha} passageiro(s)</span>
      </h3>
    `;
    amanha.forEach(exc => {
      html += renderExcursaoNotificacao(exc, 'amanha');
    });
  }

  // ✅ SEÇÃO: EXCURSÕES DE HOJE (informativo)
  if (hoje.length > 0) {
    html += `
      <h3 class="notif-secao-titulo" style="margin-top:2rem;">
        <i class="fas fa-bus" style="color:#f5a623;"></i>
        Excursões de hoje
        <span class="notif-secao-badge" style="background:#f5a623;">${totalHoje} passageiro(s)</span>
      </h3>
    `;
    hoje.forEach(exc => {
      html += renderExcursaoNotificacao(exc, 'hoje');
    });
  }

  // ✅ SEÇÃO: ATRASADAS (opcional)
  if (atrasadas.length > 0) {
    html += `
      <h3 class="notif-secao-titulo" style="margin-top:2rem;">
        <i class="fas fa-exclamation-triangle" style="color:#e74c3c;"></i>
        Excursões que já passaram
      </h3>
    `;
    atrasadas.slice(0, 5).forEach(exc => {
      html += renderExcursaoNotificacao(exc, 'atrasada');
    });
  }

  document.getElementById('notificacoesConteudo').innerHTML = html;
}

/* ============================================================
   RENDERIZAR CARD DE UMA EXCURSÃO
   ============================================================ */
function renderExcursaoNotificacao(exc, tipo) {
  const dataIda = formatarDataNotif(exc.dataIda);
  const passageiros = exc.passageiros || [];
  const totalPessoas = passageiros.reduce((s, p) => s + (Number(p.qtd) || 1), 0);

  const cor = tipo === 'amanha' ? '#e91e63'
            : tipo === 'hoje' ? '#f5a623'
            : '#e74c3c';

  return `
    <div class="notif-card" style="border-left: 4px solid ${cor};">
      <div class="notif-card-header">
        <div>
          <h4><i class="fas fa-suitcase-rolling"></i> ${exc.titulo}</h4>
          <p class="notif-card-meta">
            <span><i class="fas fa-map-pin"></i> ${exc.destino}</span>
            <span><i class="fas fa-calendar"></i> ${dataIda}</span>
            <span><i class="fas fa-users"></i> ${passageiros.length} compra(s) · ${totalPessoas} pessoa(s)</span>
          </p>
        </div>
        ${tipo === 'amanha' ? `
          <button class="btn-primary small" onclick="notificarTodosPassageiros('${exc.id}')" type="button">
            <i class="fab fa-whatsapp"></i> Notificar todos
          </button>
        ` : ''}
      </div>

      ${passageiros.length === 0 ? `
        <div class="empty-state" style="padding:1.5rem;">
          <i class="fas fa-user-slash"></i>
          <p>Nenhum passageiro cadastrado</p>
        </div>
      ` : `
        <div class="notif-tabela-wrapper">
          <table class="notif-tabela">
            <thead>
              <tr>
                <th>#</th>
                <th>Passageiro</th>
                <th>Telefone</th>
                <th>Qtd</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              ${passageiros.map((p, i) => {
                const telLimpo = (p.telefone || '').replace(/\D/g, '');
                const telFormatado = formatarTelefoneBR(p.telefone);
                const notificado = p.notificadoEm ? new Date(p.notificadoEm).toLocaleString('pt-BR', {
                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                }) : null;

                return `
                  <tr>
                    <td>${i + 1}</td>
                    <td><strong>${p.nome || '—'}</strong></td>
                    <td>${telFormatado || '—'}</td>
                    <td>${p.qtd || 1}</td>
                    <td>
                      ${notificado
                        ? `<span class="notif-status ok" title="${notificado}">✅ Notificado</span>`
                        : `<span class="notif-status pendente">⏳ Pendente</span>`}
                    </td>
                    <td>
                      ${telLimpo ? `
                        <div class="notif-acoes">
                          <button class="icon-btn notif-btn" 
                                  onclick="notificarPassageiro('${p.codigo}', '${exc.id}')"
                                  title="Enviar notificação pelo WhatsApp"
                                  type="button">
                            <i class="fab fa-whatsapp"></i>
                          </button>
                          <button class="icon-btn" 
                                  onclick="copiarMensagemPassageiro('${p.codigo}', '${exc.id}')"
                                  title="Copiar mensagem"
                                  type="button">
                            <i class="fas fa-copy"></i>
                          </button>
                        </div>
                      ` : '<span style="font-size:0.75rem;color:#94a3b8;">Sem telefone</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

/* ============================================================
   GERAR MENSAGEM PERSONALIZADA
   ============================================================ */
function gerarMensagemNotificacao(compra, excursao) {
  const primeiroNome = (compra.nome || '').split(' ')[0] || 'Cliente';
  const dataIda = formatarDataNotif(excursao.dataIda);
  const dataVolta = excursao.dataVolta ? formatarDataNotif(excursao.dataVolta) : null;

  let msg = `🚌 *AHGA TURISMO — Lembrete de Excursão*\n\n`;
  msg += `Olá, *${primeiroNome}*! Tudo bem? 😊\n\n`;
  msg += `Passando para lembrar que sua excursão é *AMANHÃ*!\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  msg += `📍 *Destino:* ${excursao.destino}\n`;
  msg += `📅 *Data de ida:* ${dataIda}\n`;
  if (dataVolta) msg += `📅 *Data de volta:* ${dataVolta}\n`;
  msg += `👥 *Pessoas:* ${compra.qtd || 1}\n`;
  msg += `🎫 *Código:* ${compra.codigo}\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `*📋 O que levar:*\n`;
  msg += `• Documento com foto (RG ou CNH)\n`;
  msg += `• Cartão de embarque (QR Code)\n`;
  msg += `• Roupas confortáveis\n`;
  msg += `• Protetor solar e boné\n`;
  msg += `• Dinheiro para despesas extras\n\n`;

  msg += `*⏰ Chegue com 30 minutos de antecedência* no ponto de encontro.\n\n`;

  msg += `Qualquer dúvida, é só chamar! Boa viagem! 🎉\n\n`;
  msg += `_AHGA Turismo · Excursões Botucatu_`;

  return msg;
}

/* ============================================================
   NOTIFICAR UM PASSAGEIRO
   ============================================================ */
async function notificarPassageiro(codigoCompra, excursaoId) {
  try {
    // Busca a compra
    const rCompra = await fetch(`${API_URL_NOTIF}/api/compras/${codigoCompra}`);
    const dataCompra = await rCompra.json();
    const compra = dataCompra.compra;

    if (!compra) {
      alert('Compra não encontrada');
      return;
    }

    const telLimpo = (compra.telefone || '').replace(/\D/g, '');
    if (!telLimpo) {
      alert('Este passageiro não tem telefone cadastrado');
      return;
    }

    // Busca a excursão
    const rExc = await fetch(`${API_URL_NOTIF}/api/excursoes/${excursaoId}`);
    const dataExc = await rExc.json();
    const excursao = dataExc.excursao;

    if (!excursao) {
      alert('Excursão não encontrada');
      return;
    }

    // Gera mensagem
    const msg = gerarMensagemNotificacao(compra, excursao);

    // Abre WhatsApp
    const numeroWhats = telLimpo.startsWith('55') ? telLimpo : `55${telLimpo}`;
    const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    // Marca como notificado no servidor
    await fetch(`${API_URL_NOTIF}/api/notificacoes/marcar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo: codigoCompra,
        excursaoId,
        canal: 'whatsapp'
      })
    });

    // Atualiza a interface
    setTimeout(() => carregarNotificacoes(), 1000);

  } catch (err) {
    console.error(err);
    alert('Erro ao notificar: ' + err.message);
  }
}

/* ============================================================
   NOTIFICAR TODOS OS PASSAGEIROS DE UMA EXCURSÃO
   (abre uma janela de cada vez)
   ============================================================ */
async function notificarTodosPassageiros(excursaoId) {
  try {
    const r = await fetch(`${API_URL_NOTIF}/api/notificacoes/pendentes`);
    const data = await r.json();
    const exc = (data.amanha || []).find(e => e.id === excursaoId);

    if (!exc || !exc.passageiros || exc.passageiros.length === 0) {
      alert('Nenhum passageiro para notificar');
      return;
    }

    const pendentes = exc.passageiros.filter(p => !p.notificadoEm);
    const jaNotificados = exc.passageiros.length - pendentes.length;

    if (pendentes.length === 0) {
      alert('Todos os passageiros já foram notificados!');
      return;
    }

    const confirmar = confirm(
      `📲 Notificar ${pendentes.length} passageiro(s)?\n\n` +
      (jaNotificados > 0 ? `(${jaNotificados} já foram notificados antes)\n\n` : '') +
      `⚠️ O WhatsApp abrirá uma janela para cada passageiro.\n` +
      `Certifique-se de permitir pop-ups do site.\n\n` +
      `Deseja continuar?`
    );

    if (!confirmar) return;

    let enviados = 0;
    for (const p of pendentes) {
      const telLimpo = (p.telefone || '').replace(/\D/g, '');
      if (!telLimpo) continue;

      const msg = gerarMensagemNotificacao(p, exc);
      const numeroWhats = telLimpo.startsWith('55') ? telLimpo : `55${telLimpo}`;
      const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(msg)}`;

      window.open(url, '_blank');
      enviados++;

      // Marca no servidor
      await fetch(`${API_URL_NOTIF}/api/notificacoes/marcar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: p.codigo,
          excursaoId,
          canal: 'whatsapp'
        })
      });

      // Pequeno delay para não travar o navegador
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setTimeout(() => {
      alert(`✅ ${enviados} notificação(ões) enviada(s)!`);
      carregarNotificacoes();
    }, 800);

  } catch (err) {
    console.error(err);
    alert('Erro: ' + err.message);
  }
}

/* ============================================================
   COPIAR MENSAGEM (para colar manualmente)
   ============================================================ */
async function copiarMensagemPassageiro(codigoCompra, excursaoId) {
  try {
    const rCompra = await fetch(`${API_URL_NOTIF}/api/compras/${codigoCompra}`);
    const dataCompra = await rCompra.json();
    const compra = dataCompra.compra;
    if (!compra) return alert('Compra não encontrada');

    const rExc = await fetch(`${API_URL_NOTIF}/api/excursoes/${excursaoId}`);
    const dataExc = await rExc.json();
    const excursao = dataExc.excursao;
    if (!excursao) return alert('Excursão não encontrada');

    const msg = gerarMensagemNotificacao(compra, excursao);

    navigator.clipboard.writeText(msg).then(() => {
      alert('✅ Mensagem copiada!\n\nAgora é só colar no WhatsApp do cliente.');
    }).catch(() => {
      prompt('Copie a mensagem abaixo:', msg);
    });
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
function formatarDataNotif(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${diasSemana[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatarTelefoneBR(tel) {
  if (!tel) return '—';
  const limpo = String(tel).replace(/\D/g, '');
  if (limpo.length === 11) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
  }
  if (limpo.length === 10) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 6)}-${limpo.slice(6)}`;
  }
  return tel;
}

/* ============================================================
   EXPÕE GLOBALMENTE
   ============================================================ */
window.abrirPainelNotificacoes = abrirPainelNotificacoes;
window.fecharPainelNotificacoes = fecharPainelNotificacoes;
window.carregarNotificacoes = carregarNotificacoes;
window.notificarPassageiro = notificarPassageiro;
window.notificarTodosPassageiros = notificarTodosPassageiros;
window.copiarMensagemPassageiro = copiarMensagemPassageiro;

console.log('✅ notificacoes.js carregado');