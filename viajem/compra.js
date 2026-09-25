/* ============================================================
   AHGA TURISMO - Sistema de Compra + QR Code + Solicitação
   ============================================================ */

const API_URL_COMPRA = window.API_URL || 'http://localhost:3000';

/* ============================================================
   📱 NÚMEROS DE WHATSAPP DOS VENDEDORES
   ============================================================ */
const WHATSAPP_NUMEROS = [
  {
    id: 'gabriela',
    nome: 'Gabriela Bastos',
    cargo: 'Vendedora',
    numero: '5514998126327'
  },
  {
    id: 'hiago',
    nome: 'Hiago Lippi',
    cargo: 'Vendedor',
    numero: '5514997727274'
  }
];

/* ============================================================
   MÁSCARAS
   ============================================================ */
function mascaraCPF(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

function mascaraRG(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,1})$/, '$1-$2')
    .slice(0, 12);
}

function mascaraTelefone(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

/* ============================================================
   VALIDAÇÃO DE CPF
   ============================================================ */
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

/* ============================================================
   ABRIR / FECHAR MODAL DE COMPRA
   ============================================================ */
let excursaoSelecionada = null;

async function abrirCompra(excursaoId) {
  try {
    const r = await fetch(`${API_URL_COMPRA}/api/excursoes/${excursaoId}`);
    const data = await r.json();
    excursaoSelecionada = data.excursao;
    if (!excursaoSelecionada) {
      alert('Excursão não encontrada');
      return;
    }

    document.getElementById('compraExcursaoId').value = excursaoSelecionada.id;
    document.getElementById('compraExcursaoNome').textContent =
      `${excursaoSelecionada.titulo} · ${excursaoSelecionada.destino}`;

    atualizarResumo();
    document.getElementById('compraModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    const sessao = typeof getSessao === 'function' ? getSessao() : null;
    if (sessao && sessao.nome) {
      document.getElementById('compraNome').value = sessao.nome;
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao abrir compra');
  }
}

function fecharCompra() {
  document.getElementById('compraModal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('formCompra').reset();
  document.getElementById('compraResumo').innerHTML = '';
}

function atualizarResumo() {
  if (!excursaoSelecionada) return;
  const qtd = parseInt(document.getElementById('compraQtd').value) || 1;
  const preco = Number(excursaoSelecionada.preco) || 0;
  const total = preco * qtd;

  document.getElementById('compraResumo').innerHTML = `
    <div class="resumo-linha"><span>Valor unitário:</span><strong>R$ ${preco.toLocaleString('pt-BR')}</strong></div>
    <div class="resumo-linha"><span>Pessoas:</span><strong>${qtd}</strong></div>
    <div class="resumo-linha total"><span>TOTAL:</span><strong>R$ ${total.toLocaleString('pt-BR')}</strong></div>
  `;
}

/* ============================================================
   POPULA SELECT DE VENDEDORES (compra)
   ============================================================ */
function popularVendedores() {
  const select = document.getElementById('compraVendedor');
  if (!select) return;
  select.innerHTML = '<option value="">Escolha um vendedor...</option>';
  WHATSAPP_NUMEROS.forEach(function (v) {
    const opt = document.createElement('option');
    opt.value = v.numero;
    opt.textContent = v.nome + ' — ' + v.cargo;
    select.appendChild(opt);
  });
}

/* ============================================================
   ✅ FLAG ANTI-DUPLO-CLIQUE
   ============================================================ */
let enviandoCompra = false;

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.getElementById('compraCPF');
  const rgInput = document.getElementById('compraRG');
  const telInput = document.getElementById('compraTelefone');
  const qtdInput = document.getElementById('compraQtd');

  if (cpfInput) cpfInput.addEventListener('input', e => e.target.value = mascaraCPF(e.target.value));
  if (rgInput) rgInput.addEventListener('input', e => e.target.value = mascaraRG(e.target.value));
  if (telInput) telInput.addEventListener('input', e => e.target.value = mascaraTelefone(e.target.value));
  if (qtdInput) qtdInput.addEventListener('input', atualizarResumo);

  popularVendedores();

  document.getElementById('formCompra')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (enviandoCompra) {
      console.warn('⏳ Compra já sendo enviada...');
      return;
    }

    const nome = document.getElementById('compraNome').value.trim();
    const rg = document.getElementById('compraRG').value.trim();
    const cpf = document.getElementById('compraCPF').value.trim();
    const telefone = document.getElementById('compraTelefone').value.trim();
    const qtd = parseInt(document.getElementById('compraQtd').value) || 1;
    const email = document.getElementById('compraEmail').value.trim();
    const obs = document.getElementById('compraObs').value.trim();
    const vendedorNumero = document.getElementById('compraVendedor')?.value || '';

    if (!nome || !rg || !cpf || !telefone) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!validarCPF(cpf)) {
      alert('CPF inválido. Verifique e tente novamente.');
      return;
    }

    if (!vendedorNumero) {
      alert('Por favor, escolha um vendedor para enviar a mensagem.');
      return;
    }

    if (!excursaoSelecionada) {
      alert('Excursão não selecionada');
      return;
    }

    const vendedorSelecionado = WHATSAPP_NUMEROS.find(v => v.numero === vendedorNumero);
    const codigo = gerarCodigoEmbarque();

    const compra = {
      codigo,
      excursaoId: excursaoSelecionada.id,
      excursaoTitulo: excursaoSelecionada.titulo,
      excursaoDestino: excursaoSelecionada.destino,
      excursaoData: excursaoSelecionada.dataIda,
      categoria: excursaoSelecionada.categoria || 'Geral',
      nome, rg, cpf, telefone, email, obs,
      qtd,
      total: Number(excursaoSelecionada.preco) * qtd,
      status: 'pendente',
      criadoEm: new Date().toISOString(),
      vendedorNome: vendedorSelecionado ? vendedorSelecionado.nome : 'Não informado',
      vendedorId: vendedorSelecionado ? vendedorSelecionado.id : null,
      vendedorNumero: vendedorNumero
    };

    enviandoCompra = true;
    const btn = document.getElementById('btnEnviarCompra');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Enviando...';
    }

    try {
      const r = await fetch(`${API_URL_COMPRA}/api/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Erro ao registrar compra');

      const total = Number(excursaoSelecionada.preco) * qtd;
      const msg = `
🎫 *NOVA COMPRA - AHGA TURISMO*

*Excursão:* ${excursaoSelecionada.titulo}
*Destino:* ${excursaoSelecionada.destino}
*Data:* ${formatarDataBR(excursaoSelecionada.dataIda)}

*Passageiro:* ${nome}
*RG:* ${rg}
*CPF:* ${cpf}
*Telefone:* ${telefone}
${email ? `*E-mail:* ${email}` : ''}
*Pessoas:* ${qtd}

*Valor unitário:* R$ ${Number(excursaoSelecionada.preco).toLocaleString('pt-BR')}
*TOTAL:* R$ ${total.toLocaleString('pt-BR')}

*Código de embarque:* ${codigo}
${obs ? `\n*Observações:* ${obs}` : ''}

Aguardo as instruções para pagamento via PIX. 🙏
      `.trim();

      const url = `https://wa.me/${vendedorNumero}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');

      localStorage.setItem('ahga_ultima_compra', JSON.stringify(compra));

      setTimeout(() => {
        if (confirm('Compra enviada! O vendedor responderá com o link do seu cartão de embarque após confirmar o pagamento.\n\nDeseja visualizar uma prévia do cartão agora?')) {
          fecharCompra();
          mostrarCartaoEmbarque(compra);
        } else {
          fecharCompra();
        }
      }, 500);

    } catch (err) {
      console.error(err);
      alert('Erro ao registrar compra: ' + err.message);
    } finally {
      enviandoCompra = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar pelo WhatsApp';
      }
    }
  });
});

/* ============================================================
   SOLICITAR CARTÃO DE EMBARQUE
   ============================================================ */
function abrirSolicitarCartao() {
  const modal = document.getElementById('solicitarCartaoModal');
  if (!modal) return;

  const select = document.getElementById('solicitarVendedor');
  if (select && select.options.length <= 1) {
    WHATSAPP_NUMEROS.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.numero;
      opt.textContent = `${v.nome} — ${v.cargo}`;
      select.appendChild(opt);
    });
  }

  document.getElementById('solicitarCPF').value = '';
  document.getElementById('solicitarExcursao').value = '';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const input = document.getElementById('solicitarCPF');
    if (input) input.focus();
  }, 100);
}

function fecharSolicitarCartao() {
  const modal = document.getElementById('solicitarCartaoModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

async function enviarSolicitacaoCartao() {
  const cpf = document.getElementById('solicitarCPF').value.trim();
  const excursao = document.getElementById('solicitarExcursao').value.trim();
  const vendedorNumero = document.getElementById('solicitarVendedor').value;

  if (!cpf || cpf.length < 14) {
    alert('Digite um CPF válido');
    return;
  }
  if (!vendedorNumero) {
    alert('Escolha um vendedor para enviar a solicitação');
    return;
  }

  let infoExtra = '';
  try {
    const r = await fetch(`${API_URL_COMPRA}/api/compras?cpf=${encodeURIComponent(cpf)}`);
    const data = await r.json();
    const compras = data.compras || [];

    if (compras.length > 0) {
      infoExtra = `\n\n📋 *Compra(s) encontrada(s) no sistema:*`;
      compras.forEach(c => {
        infoExtra += `\n• ${c.excursaoTitulo} (${c.codigo}) — ${c.qtd} pessoa(s)`;
      });
    } else {
      infoExtra = `\n\n⚠️ *Nenhuma compra encontrada com esse CPF no sistema.* Verifique se o cadastro está correto.`;
    }
  } catch (err) {
    console.warn('Erro ao buscar compras:', err);
  }

  const msg = `
🎫 *SOLICITAÇÃO DE CARTÃO DE EMBARQUE*

*CPF:* ${cpf}
${excursao ? `*Excursão:* ${excursao}` : ''}
${infoExtra}

Por favor, envie o link do meu cartão de embarque.
Obrigado! 🙏
  `.trim();

  const url = `https://wa.me/${vendedorNumero}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  fecharSolicitarCartao();
}

/* ============================================================
   GERAÇÃO DE CÓDIGO ÚNICO
   ============================================================ */
function gerarCodigoEmbarque() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = 'AHGA-';
  for (let i = 0; i < 8; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

function formatarDataBR(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

/* ============================================================
   CARTÃO DE EMBARQUE (prévia dentro do modal)
   ============================================================ */
function mostrarCartaoEmbarque(compra) {
  document.getElementById('embNome').textContent = compra.nome;
  document.getElementById('embRG').textContent = compra.rg;
  document.getElementById('embCPF').textContent = compra.cpf;
  document.getElementById('embExcursao').textContent = compra.excursaoTitulo;
  document.getElementById('embDestino').textContent = compra.excursaoDestino;
  document.getElementById('embData').textContent = formatarDataBR(compra.excursaoData);
  document.getElementById('embQtd').textContent = compra.qtd + ' pessoa(s)';
  document.getElementById('embCodigo').textContent = compra.codigo;

  const qrData = compra.codigo;

  const canvas = document.getElementById('qrcodeCanvas');
  if (typeof QRCode !== 'undefined') {
    QRCode.toCanvas(canvas, qrData, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: 'L',
      color: { dark: '#1e2b3c', light: '#ffffff' }
    }, (err) => {
      if (err) console.error('Erro QR Code:', err);
    });
  } else {
    console.warn('QRCode library não carregada');
  }

  document.getElementById('embarqueModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharEmbarque() {
  document.getElementById('embarqueModal').classList.remove('active');
  document.body.style.overflow = '';
}

function baixarCartao() {
  const canvas = document.getElementById('qrcodeCanvas');
  const link = document.createElement('a');
  link.download = `cartao-embarque-${document.getElementById('embCodigo').textContent}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* ============================================================
   LEITOR DE QR CODE (ADMIN)
   ============================================================ */
let html5QrScanner = null;
let excursaoDoLeitor = null;

function abrirLeitor() {
  document.getElementById('leitorModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('leitorResultado').style.display = 'none';
  document.getElementById('leitorResultado').innerHTML = '';

  // ✅ Carrega excursões para seleção de check-in
  carregarExcursoesNoLeitor();
}

async function carregarExcursoesNoLeitor() {
  try {
    const r = await fetch(`${API_URL_COMPRA}/api/excursoes`);
    const data = await r.json();
    const excursoes = data.excursoes || [];

    const select = document.getElementById('leitorExcursaoSelect');
    if (!select) return;

    if (excursoes.length === 0) {
      select.innerHTML = '<option value="">Nenhuma excursão cadastrada</option>';
      return;
    }

    select.innerHTML = '<option value="">Selecione a excursão do embarque...</option>';
    excursoes.forEach(exc => {
      const opt = document.createElement('option');
      opt.value = exc.id;
      opt.textContent = `${exc.titulo} — ${exc.destino}`;
      select.appendChild(opt);
    });

    select.onchange = (e) => {
      excursaoDoLeitor = e.target.value || null;
      if (excursaoDoLeitor) {
        console.log('🚌 Excursão do leitor:', excursaoDoLeitor);
        iniciarMonitorCheckin(excursaoDoLeitor);
      } else {
        pararMonitorCheckin();
      }
    };
  } catch (err) {
    console.warn('Erro ao carregar excursões no leitor:', err);
  }
}

function fecharLeitor() {
  if (html5QrScanner) {
    html5QrScanner.stop().then(() => {
      html5QrScanner.clear();
      html5QrScanner = null;
    }).catch(() => {});
  }
  pararMonitorCheckin();
  document.getElementById('leitorModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnIniciarLeitor')?.addEventListener('click', async () => {
    if (html5QrScanner) return;

    const container = document.getElementById('leitorQR');
    container.innerHTML = '';

    if (typeof Html5Qrcode === 'undefined') {
      alert('Biblioteca do leitor QR não carregada. Recarregue a página.');
      return;
    }

    html5QrScanner = new Html5Qrcode("leitorQR");

    try {
      await html5QrScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrScanner.stop().then(() => {
            html5QrScanner.clear();
            html5QrScanner = null;
          });
          processarQRCode(decodedText);
        },
        () => { /* ignora erros de frame */ }
      );
    } catch (err) {
      console.error(err);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  });

  const cpfSolic = document.getElementById('solicitarCPF');
  if (cpfSolic) {
    cpfSolic.addEventListener('input', e => e.target.value = mascaraCPF(e.target.value));
    cpfSolic.addEventListener('keypress', e => {
      if (e.key === 'Enter') { e.preventDefault(); enviarSolicitacaoCartao(); }
    });
  }
});

/* ============================================================
   PROCESSA QR CODE LIDO (VERSÃO ROBUSTA - 4 tentativas)
   ============================================================ */
async function processarQRCode(texto) {
  const resultado = document.getElementById('leitorResultado');
  resultado.style.display = 'block';

  let textoLimpo = (texto || '').trim().replace(/^["']|["']$/g, '');

  console.log('🔍 QR LIDO (bruto):', JSON.stringify(texto));
  console.log('🔍 QR LIDO (limpo):', JSON.stringify(textoLimpo));

  let codigo = null;

  try {
    const dados = JSON.parse(textoLimpo);
    if (dados && dados.codigo) {
      codigo = String(dados.codigo).trim();
      console.log('✅ Formato JSON detectado:', codigo);
    }
  } catch (e) { /* não é JSON */ }

  if (!codigo) {
    codigo = textoLimpo;
    console.log('✅ Formato texto puro:', codigo);
  }

  if (!codigo || !codigo.includes('AHGA-')) {
    const match = textoLimpo.match(/AHGA-[A-Z0-9]{6,10}/);
    if (match) {
      codigo = match[0];
      console.log('✅ Código extraído via regex:', codigo);
    }
  }

  if (codigo) {
    codigo = codigo.replace(/[^A-Z0-9-]/gi, '').toUpperCase();
    console.log('✅ Código final normalizado:', codigo);
  }

  if (!codigo || !codigo.startsWith('AHGA-')) {
    resultado.innerHTML = `
      <div class="leitor-erro">
        <i class="fas fa-times-circle"></i>
        <h4>QR Code inválido</h4>
        <p>Este código não pertence à AHGA Turismo.</p>
        <details style="margin-top:0.6rem; text-align:left;">
          <summary style="cursor:pointer; font-size:0.78rem; opacity:0.7;">Ver detalhes técnicos</summary>
          <p style="font-size:0.72rem; margin-top:0.4rem; opacity:0.6; word-break:break-all;">
            <strong>Lido:</strong><br>
            <code>${textoLimpo.substring(0, 200)}</code>
          </p>
          <p style="font-size:0.72rem; margin-top:0.3rem; opacity:0.6;">
            <strong>Esperado:</strong> <code>AHGA-XXXXXXXX</code>
          </p>
        </details>
      </div>`;
    return;
  }

  try {
    const r = await fetch(`${API_URL_COMPRA}/api/compras/${codigo}`);
    const data = await r.json();

    if (!r.ok || !data.compra) {
      resultado.innerHTML = `
        <div class="leitor-erro">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>Código não encontrado</h4>
          <p>Código: <strong>${codigo}</strong></p>
          <p>Verifique se a compra foi registrada no sistema.</p>
        </div>`;
      return;
    }

    const c = data.compra;

    if (c.status === 'cancelado') {
      resultado.innerHTML = `
        <div class="leitor-erro">
          <i class="fas fa-ban"></i>
          <h4>❌ Compra cancelada</h4>
          <div class="leitor-info">
            <div><span>Passageiro:</span><strong>${c.nome}</strong></div>
            <div><span>Excursão:</span><strong>${c.excursaoTitulo}</strong></div>
            <div><span>CPF:</span><strong>${c.cpf}</strong></div>
          </div>
          <p style="margin-top:0.8rem;">Esta compra foi cancelada pelo vendedor.</p>
        </div>`;
      return;
    }

    if (c.status === 'pendente') {
      resultado.innerHTML = `
        <div class="leitor-aviso">
          <i class="fas fa-clock"></i>
          <h4>⏳ Pagamento pendente</h4>
          <div class="leitor-info">
            <div><span>Passageiro:</span><strong>${c.nome}</strong></div>
            <div><span>Excursão:</span><strong>${c.excursaoTitulo}</strong></div>
            <div><span>Valor:</span><strong>R$ ${Number(c.total || 0).toLocaleString('pt-BR')}</strong></div>
          </div>
          <p style="margin-top:0.8rem;">Aprove a compra no painel antes de liberar o embarque.</p>
        </div>`;
      return;
    }

    if (c.status === 'utilizado') {
      resultado.innerHTML = `
        <div class="leitor-aviso">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>⚠️ Já utilizado</h4>
          <div class="leitor-info">
            <div><span>Passageiro:</span><strong>${c.nome}</strong></div>
            <div><span>CPF:</span><strong>${c.cpf}</strong></div>
            <div><span>Utilizado em:</span><strong>${new Date(c.utilizadoEm).toLocaleString('pt-BR')}</strong></div>
          </div>
        </div>`;
      return;
    }

    // ✅ Sucesso — valida embarque
    await fetch(`${API_URL_COMPRA}/api/compras/${codigo}/validar`, {
      method: 'POST'
    });

    // ✅ Marca visual imediatamente se a lista estiver aberta
    marcarCheckinVisual(codigo);

    resultado.innerHTML = `
      <div class="leitor-sucesso">
        <i class="fas fa-check-circle"></i>
        <h4>✅ Embarque liberado!</h4>
        <div class="leitor-info">
          <div><span>Passageiro:</span><strong>${c.nome}</strong></div>
          <div><span>RG:</span><strong>${c.rg}</strong></div>
          <div><span>CPF:</span><strong>${c.cpf}</strong></div>
          <div><span>Excursão:</span><strong>${c.excursaoTitulo}</strong></div>
          <div><span>Pessoas:</span><strong>${c.qtd}</strong></div>
          <div><span>Total pago:</span><strong>R$ ${Number(c.total).toLocaleString('pt-BR')}</strong></div>
        </div>
      </div>`;

    // ✅ Adiciona ao histórico de check-ins recentes
    adicionarCheckinRecente(c);

  } catch (err) {
    console.error(err);
    resultado.innerHTML = `
      <div class="leitor-erro">
        <i class="fas fa-times-circle"></i>
        <h4>Erro ao validar</h4>
        <p>${err.message}</p>
      </div>`;
  }
}

/* ============================================================
   ✅ CHECK-IN VISUAL EM TEMPO REAL
   ============================================================ */
let excursaoCheckinAtual = null;
let checkinsDaExcursao = new Set();
let intervaloCheckin = null;

function iniciarMonitorCheckin(excursaoId) {
  if (intervaloCheckin) clearInterval(intervaloCheckin);
  excursaoCheckinAtual = excursaoId;
  checkinsDaExcursao.clear();

  const atualizar = async () => {
    try {
      const r = await fetch(`${API_URL_COMPRA}/api/compras/excursao/${excursaoId}/checkins`);
      const data = await r.json();
      const lista = data.checkins || [];

      const novos = new Set(lista.map(c => c.codigo));

      novos.forEach(codigo => {
        if (!checkinsDaExcursao.has(codigo)) {
          marcarCheckinVisual(codigo);
        }
      });

      checkinsDaExcursao = novos;

    } catch (err) {
      console.warn('Erro ao atualizar check-ins:', err);
    }
  };

  atualizar();
  intervaloCheckin = setInterval(atualizar, 3000);
}

function pararMonitorCheckin() {
  if (intervaloCheckin) {
    clearInterval(intervaloCheckin);
    intervaloCheckin = null;
  }
}

function marcarCheckinVisual(codigo) {
  const linhas = document.querySelectorAll(`[data-checkin-codigo="${codigo}"]`);
  linhas.forEach(linha => {
    linha.classList.add('passageiro-embarcado');
    const badge = linha.querySelector('.checkin-badge');
    if (badge) {
      badge.innerHTML = '<i class="fas fa-check"></i> Embarcado';
      badge.classList.add('ok');
      badge.classList.remove('pendente');
    }
  });

  tocarSomCheckin();
}

function tocarSomCheckin() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) { /* ignora */ }
}

/* ============================================================
   ✅ CHECK-INS RECENTES (histórico visual no modal do leitor)
   ============================================================ */
let checkinsRecentesSessao = [];

function adicionarCheckinRecente(compra) {
  checkinsRecentesSessao.unshift({
    nome: compra.nome,
    qtd: compra.qtd,
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  });

  if (checkinsRecentesSessao.length > 20) {
    checkinsRecentesSessao = checkinsRecentesSessao.slice(0, 20);
  }

  renderizarCheckinsRecentes();
}

function renderizarCheckinsRecentes() {
  const container = document.getElementById('checkinsRecentes');
  const lista = document.getElementById('checkinsLista');
  if (!container || !lista) return;

  if (checkinsRecentesSessao.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  lista.innerHTML = checkinsRecentesSessao.map(c => `
    <li>
      <i class="fas fa-check-circle"></i>
      <strong>${c.nome}</strong>
      <span style="margin-left:auto; opacity:0.7; font-size:0.75rem;">
        ${c.qtd}x · ${c.hora}
      </span>
    </li>
  `).join('');
}

/* ============================================================
   EXPÕE GLOBALMENTE
   ============================================================ */
window.abrirCompra = abrirCompra;
window.fecharCompra = fecharCompra;
window.mostrarCartaoEmbarque = mostrarCartaoEmbarque;
window.fecharEmbarque = fecharEmbarque;
window.baixarCartao = baixarCartao;
window.abrirLeitor = abrirLeitor;
window.fecharLeitor = fecharLeitor;
window.abrirSolicitarCartao = abrirSolicitarCartao;
window.fecharSolicitarCartao = fecharSolicitarCartao;
window.enviarSolicitacaoCartao = enviarSolicitacaoCartao;
window.processarQRCode = processarQRCode;
window.iniciarMonitorCheckin = iniciarMonitorCheckin;
window.pararMonitorCheckin = pararMonitorCheckin;
window.marcarCheckinVisual = marcarCheckinVisual;
window.adicionarCheckinRecente = adicionarCheckinRecente;

console.log('✅ compra.js carregado com sucesso (leitor robusto v2 + check-in visual)');