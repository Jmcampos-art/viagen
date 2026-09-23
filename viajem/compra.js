/* ============================================================
   AHGA TURISMO - Sistema de Compra + QR Code + Solicitação
   ============================================================ */

const API_URL_COMPRA = window.API_URL || 'http://localhost:3000';

/* ============================================================
   📱 NÚMEROS DE WHATSAPP PARA COMPRA
   ============================================================ */
const WHATSAPP_NUMEROS = [
  {
    id: 'gabriela',
    nome: 'Gabriela Bastos',
    cargo: 'Vendedora',
    numero: '5514998126327' // ← troque pelo número real
  },
  {
    id: 'hiago',
    nome: 'Hiago Lippi',
    cargo: 'Vendedor',
    numero: '55149997727274' // ← troque pelo número real
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
   POPULA SELECT DE VENDEDORES
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

    const codigo = gerarCodigoEmbarque();

    const compra = {
      codigo,
      excursaoId: excursaoSelecionada.id,
      excursaoTitulo: excursaoSelecionada.titulo,
      excursaoDestino: excursaoSelecionada.destino,
      excursaoData: excursaoSelecionada.dataIda,
      nome, rg, cpf, telefone, email, obs,
      qtd,
      total: Number(excursaoSelecionada.preco) * qtd,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };

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
    }
  });
});

/* ============================================================
   SOLICITAR CARTÃO DE EMBARQUE (via WhatsApp do vendedor)
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
   CARTÃO DE EMBARQUE COM QR CODE
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

  const qrData = JSON.stringify({
    codigo: compra.codigo,
    nome: compra.nome,
    cpf: compra.cpf,
    excursao: compra.excursaoTitulo,
    qtd: compra.qtd,
    total: compra.total
  });

  const canvas = document.getElementById('qrcodeCanvas');
  if (typeof QRCode !== 'undefined') {
    QRCode.toCanvas(canvas, qrData, {
      width: 200,
      margin: 1,
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

function abrirLeitor() {
  document.getElementById('leitorModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('leitorResultado').style.display = 'none';
  document.getElementById('leitorResultado').innerHTML = '';
}

function fecharLeitor() {
  if (html5QrScanner) {
    html5QrScanner.stop().then(() => {
      html5QrScanner.clear();
      html5QrScanner = null;
    }).catch(() => {});
  }
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

  // Máscara no campo de CPF da solicitação
  const cpfSolic = document.getElementById('solicitarCPF');
  if (cpfSolic) {
    cpfSolic.addEventListener('input', e => e.target.value = mascaraCPF(e.target.value));
    cpfSolic.addEventListener('keypress', e => {
      if (e.key === 'Enter') { e.preventDefault(); enviarSolicitacaoCartao(); }
    });
  }
});

async function processarQRCode(texto) {
  const resultado = document.getElementById('leitorResultado');
  resultado.style.display = 'block';

  let dados;
  try {
    dados = JSON.parse(texto);
  } catch {
    resultado.innerHTML = `
      <div class="leitor-erro">
        <i class="fas fa-times-circle"></i>
        <h4>QR Code inválido</h4>
        <p>Este código não pertence à AHGA Turismo.</p>
      </div>`;
    return;
  }

  if (!dados.codigo) {
    resultado.innerHTML = `
      <div class="leitor-erro">
        <i class="fas fa-times-circle"></i>
        <h4>QR Code inválido</h4>
        <p>Código de embarque ausente.</p>
      </div>`;
    return;
  }

  try {
    const r = await fetch(`${API_URL_COMPRA}/api/compras/${dados.codigo}`);
    const data = await r.json();

    if (!r.ok || !data.compra) {
      resultado.innerHTML = `
        <div class="leitor-erro">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>Código não encontrado</h4>
          <p>Código: <strong>${dados.codigo}</strong></p>
          <p>Verifique se a compra foi registrada no sistema.</p>
        </div>`;
      return;
    }

    const c = data.compra;

    if (c.status === 'utilizado') {
      resultado.innerHTML = `
        <div class="leitor-aviso">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>⚠️ Já utilizado</h4>
          <p><strong>${c.nome}</strong></p>
          <p>CPF: ${c.cpf}</p>
          <p>Utilizado em: ${new Date(c.utilizadoEm).toLocaleString('pt-BR')}</p>
        </div>`;
      return;
    }

    await fetch(`${API_URL_COMPRA}/api/compras/${dados.codigo}/validar`, {
      method: 'POST'
    });

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

console.log('✅ compra.js carregado com sucesso');