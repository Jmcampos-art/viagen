/* ============================================================
   AHGA TURISMO - Sistema de Compra + QR Code de Embarque
   ============================================================ */

const API_URL_COMPRA = window.API_URL || 'http://localhost:3000';

// 📱 NÚMERO DO WHATSAPP DA AGÊNCIA (troque pelo real)
const WHATSAPP_AGENCIA = '5514999999999'; // formato: 55 + DDD + número

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

    // Pré-preenche com dados do usuário logado (se houver)
    const sessao = getSessao();
    if (sessao) {
      document.getElementById('compraNome').value = sessao.nome || '';
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
   ENVIO PARA WHATSAPP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Máscaras
  const cpfInput = document.getElementById('compraCPF');
  const rgInput = document.getElementById('compraRG');
  const telInput = document.getElementById('compraTelefone');
  const qtdInput = document.getElementById('compraQtd');

  if (cpfInput) cpfInput.addEventListener('input', e => e.target.value = mascaraCPF(e.target.value));
  if (rgInput) rgInput.addEventListener('input', e => e.target.value = mascaraRG(e.target.value));
  if (telInput) telInput.addEventListener('input', e => e.target.value = mascaraTelefone(e.target.value));
  if (qtdInput) qtdInput.addEventListener('input', atualizarResumo);

  // Submit do form de compra
  document.getElementById('formCompra')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('compraNome').value.trim();
    const rg = document.getElementById('compraRG').value.trim();
    const cpf = document.getElementById('compraCPF').value.trim();
    const telefone = document.getElementById('compraTelefone').value.trim();
    const qtd = parseInt(document.getElementById('compraQtd').value) || 1;
    const email = document.getElementById('compraEmail').value.trim();
    const obs = document.getElementById('compraObs').value.trim();

    if (!nome || !rg || !cpf || !telefone) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!validarCPF(cpf)) {
      alert('CPF inválido. Verifique e tente novamente.');
      return;
    }

    if (!excursaoSelecionada) {
      alert('Excursão não selecionada');
      return;
    }

    // Gera código único de embarque
    const codigo = gerarCodigoEmbarque();

    // Salva a compra no backend (para admin poder validar depois)
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

      // Monta mensagem do WhatsApp
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

      const url = `https://wa.me/${WHATSAPP_AGENCIA}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');

      // Guarda a compra para gerar cartão depois
      localStorage.setItem('ahga_ultima_compra', JSON.stringify(compra));

      // Pergunta se quer ver o cartão
      setTimeout(() => {
        if (confirm('Compra enviada! Deseja visualizar seu cartão de embarque agora?')) {
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

  // Gera o QR Code com os dados essenciais
  const qrData = JSON.stringify({
    codigo: compra.codigo,
    nome: compra.nome,
    cpf: compra.cpf,
    excursao: compra.excursaoTitulo,
    qtd: compra.qtd,
    total: compra.total
  });

  const canvas = document.getElementById('qrcodeCanvas');
  QRCode.toCanvas(canvas, qrData, {
    width: 200,
    margin: 1,
    color: { dark: '#1e2b3c', light: '#ffffff' }
  }, (err) => {
    if (err) console.error('Erro QR Code:', err);
  });

  document.getElementById('embarqueModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharEmbarque() {
  document.getElementById('embarqueModal').classList.remove('active');
  document.body.style.overflow = '';
}

function baixarCartao() {
  const canvas = document.getElementById('qrcodeCanvas');
  const card = document.getElementById('embarqueCard');

  // Baixa só o QR Code como PNG
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

    html5QrScanner = new Html5Qrcode("leitorQR");

    try {
      await html5QrScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // QR lido com sucesso
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

  // Busca no backend para confirmar
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

    // Marca como utilizado
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