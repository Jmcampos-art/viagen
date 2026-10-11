/* ============================================================
   AHGA TURISMO — Sistema de Leads (Notificações WhatsApp)
   ============================================================ */

const API_URL_LEADS = window.API_URL || 'http://localhost:3000';

/* ============================================================
   MÁSCARA DE TELEFONE
   ============================================================ */
function mascaraTelefoneLead(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

/* ============================================================
   MOSTRAR MENSAGEM
   ============================================================ */
function mostrarMensagemLead(tipo, texto) {
  const el = document.getElementById('leadMensagem');
  if (!el) return;

  const icones = {
    sucesso: 'fa-check-circle',
    erro: 'fa-times-circle',
    aviso: 'fa-info-circle'
  };

  el.className = `notif-lead-mensagem ${tipo}`;
  el.innerHTML = `<i class="fas ${icones[tipo]}"></i> <span>${texto}</span>`;
  el.style.display = 'flex';

  setTimeout(() => {
    el.style.display = 'none';
  }, 6000);
}

/* ============================================================
   CADASTRAR LEAD
   ============================================================ */
async function cadastrarLead(event) {
  event.preventDefault();

  const nome = document.getElementById('leadNome').value.trim();
  const telefone = document.getElementById('leadTelefone').value.trim();
  const btn = document.getElementById('btnCadastrarLead');

  if (!nome || nome.length < 3) {
    mostrarMensagemLead('erro', 'Por favor, informe seu nome completo.');
    return;
  }

  const telLimpo = telefone.replace(/\D/g, '');
  if (telLimpo.length < 10) {
    mostrarMensagemLead('erro', 'Telefone inválido. Use o formato (14) 99999-9999.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Cadastrando...';

  try {
    const r = await fetch(`${API_URL_LEADS}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefone: telLimpo })
    });

    const data = await r.json();

    if (!r.ok) throw new Error(data.error || 'Erro ao cadastrar');

    if (data.jaCadastrado) {
      mostrarMensagemLead('aviso', 'Você já está na nossa lista! Vamos te avisar. 😉');
    } else {
      mostrarMensagemLead('sucesso', 'Cadastro feito! Você vai receber nossas novidades. 🎉');
      document.getElementById('formLead').reset();
    }

    // Salva localmente também (pra não pedir de novo)
    localStorage.setItem('ahga_lead', JSON.stringify({ nome, telefone: telLimpo }));

  } catch (err) {
    console.error(err);
    mostrarMensagemLead('erro', 'Erro ao cadastrar: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Quero receber notificações';
  }
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLead');
  const telInput = document.getElementById('leadTelefone');

  if (telInput) {
    telInput.addEventListener('input', e => {
      e.target.value = mascaraTelefoneLead(e.target.value);
    });
  }

  if (form) {
    form.addEventListener('submit', cadastrarLead);
  }

  // Se já cadastrou antes, pré-preenche
  const leadSalvo = localStorage.getItem('ahga_lead');
  if (leadSalvo) {
    try {
      const lead = JSON.parse(leadSalvo);
      const nomeInput = document.getElementById('leadNome');
      const telInput2 = document.getElementById('leadTelefone');
      if (nomeInput && !nomeInput.value) nomeInput.value = lead.nome || '';
      if (telInput2 && !telInput2.value) telInput2.value = mascaraTelefoneLead(lead.telefone || '');
    } catch (e) { /* ignora */ }
  }

  console.log('✅ leads.js carregado');
});

window.cadastrarLead = cadastrarLead;