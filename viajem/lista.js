/* ============================================================
   AHGA TURISMO - Lista de Passageiros por Excursão
   DUAS VISUALIZAÇÕES:
   1. 🚌 Lista de Ônibus (Nome + RG)
   2. 💰 Lista de Fechamento (Nome, RG, Qtd, Valor, Vendedor)
   ============================================================ */

   const API_URL_LISTA = window.API_URL || 'http://localhost:3000';

   /* ============================================================
      VARIÁVEIS GLOBAIS
      ============================================================ */
   let excursaoAtualLista = null;
   let todasComprasLista = [];
   let comprasDaExcursaoAtual = [];
   let abaListaAtual = 'onibus'; // 'onibus' | 'fechamento'
   
   /* ============================================================
      ABRIR LISTA DE UMA EXCURSÃO
      ============================================================ */
   async function abrirListaExcursao(excursaoId) {
     const modal = document.getElementById('listaModal');
     if (!modal) {
       console.warn('Modal listaModal não encontrado');
       return;
     }
   
     modal.classList.add('active');
     document.body.style.overflow = 'hidden';
   
     document.getElementById('listaTitulo').innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Carregando...';
     document.getElementById('listaConteudo').innerHTML = `
       <div class="empty-state">
         <i class="fas fa-circle-notch fa-spin"></i>
         <p>Carregando passageiros...</p>
       </div>`;
   
     try {
       // Busca a excursão
       const rExc = await fetch(`${API_URL_LISTA}/api/excursoes/${excursaoId}`);
       const dataExc = await rExc.json();
       excursaoAtualLista = dataExc.excursao;
   
       if (!excursaoAtualLista) {
         throw new Error('Excursão não encontrada');
       }
   
       // Busca todas as compras
       const rCompras = await fetch(`${API_URL_LISTA}/api/compras`);
       const dataCompras = await rCompras.json();
       todasComprasLista = dataCompras.compras || [];
   
       // Filtra compras desta excursão
       comprasDaExcursaoAtual = todasComprasLista.filter(
         c => c.excursaoId === excursaoId
       );
   
       // Ordena alfabeticamente por nome
       comprasDaExcursaoAtual.sort((a, b) =>
         (a.nome || '').localeCompare(b.nome || '', 'pt-BR')
       );
   
       // Define aba inicial
       abaListaAtual = 'onibus';
   
       renderizarLista();
   
     } catch (err) {
       console.error(err);
       document.getElementById('listaConteudo').innerHTML = `
         <div class="empty-state">
           <i class="fas fa-exclamation-triangle"></i>
           <p>Erro ao carregar lista</p>
           <span>${err.message}</span>
         </div>`;
     }
   }
   
   /* ============================================================
      RENDERIZAR LISTA (com abas)
      ============================================================ */
   function renderizarLista() {
     const excursao = excursaoAtualLista;
     const compras = comprasDaExcursaoAtual;
   
     if (!excursao) return;
   
     // Cabeçalho da excursão
     const dataIda = formatarDataLista(excursao.dataIda);
     const dataVolta = excursao.dataVolta ? formatarDataLista(excursao.dataVolta) : null;
   
     const totalPessoas = compras.reduce((s, c) => s + (Number(c.qtd) || 1), 0);
     const totalValor = compras.reduce((s, c) => s + (Number(c.total) || 0), 0);
   
     document.getElementById('listaTitulo').innerHTML = `
       <i class="fas fa-suitcase-rolling"></i> ${excursao.titulo}
     `;
   
     // Cabeçalho comum (info da excursão)
     let html = `
       <div class="lista-header">
         <div class="lista-header-info">
           <span><i class="fas fa-map-pin"></i> ${excursao.destino}</span>
           <span><i class="fas fa-calendar"></i> ${dataIda}${dataVolta ? ' – ' + dataVolta : ''}</span>
         </div>
         <div class="lista-header-stats">
           <div class="stat-box">
             <span class="stat-label">Compradores</span>
             <strong class="stat-value">${compras.length}</strong>
           </div>
           <div class="stat-box">
             <span class="stat-label">Total pessoas</span>
             <strong class="stat-value">${totalPessoas}</strong>
           </div>
           <div class="stat-box">
             <span class="stat-label">Valor total</span>
             <strong class="stat-value">R$ ${totalValor.toLocaleString('pt-BR')}</strong>
           </div>
         </div>
       </div>
   
       <!-- ABAS -->
       <div class="lista-abas">
         <button class="lista-aba ${abaListaAtual === 'onibus' ? 'ativa' : ''}"
                 onclick="trocarAbaLista('onibus')" type="button">
           <i class="fas fa-bus"></i> Lista do Ônibus
         </button>
         <button class="lista-aba ${abaListaAtual === 'fechamento' ? 'ativa' : ''}"
                 onclick="trocarAbaLista('fechamento')" type="button">
           <i class="fas fa-dollar-sign"></i> Fechamento
         </button>
       </div>
   
       <div class="lista-aba-conteudo">
     `;
   
     // Estado vazio
     if (compras.length === 0) {
       html += `
         <div class="empty-state" style="margin-top:1.5rem;">
           <i class="fas fa-user-slash"></i>
           <p>Nenhum passageiro cadastrado ainda</p>
           <span>As compras aparecerão aqui automaticamente</span>
         </div>
       </div>`;
       document.getElementById('listaConteudo').innerHTML = html;
       return;
     }
   
     // Renderiza a aba ativa
     if (abaListaAtual === 'onibus') {
       html += renderAbaOnibus(compras);
     } else {
       html += renderAbaFechamento(compras);
     }
   
     html += `</div>`; // fecha .lista-aba-conteudo
   
     document.getElementById('listaConteudo').innerHTML = html;
   }
   
   /* ============================================================
      ABA 1: LISTA DO ÔNIBUS (Nome + RG apenas)
      ============================================================ */
   function renderAbaOnibus(compras) {
     let html = `
       <div class="lista-onibus-aviso">
         <i class="fas fa-bus"></i>
         Confira os passageiros no embarque. Total: <strong>${compras.length}</strong> comprador(es)
       </div>
   
       <table class="lista-tabela lista-tabela-onibus">
         <thead>
           <tr>
             <th style="width:60px;">#</th>
             <th>Nome</th>
             <th style="width:180px;">RG</th>
             <th style="width:90px;">Qtd</th>
           </tr>
         </thead>
         <tbody>
           ${compras.map((c, i) => `
             <tr>
               <td>${i + 1}</td>
               <td><strong>${c.nome || '—'}</strong></td>
               <td>${c.rg || '—'}</td>
               <td>${c.qtd || 1}</td>
             </tr>
           `).join('')}
         </tbody>
       </table>
   
       <div class="lista-acoes-finais">
         <button class="btn-secondary" onclick="window.print()">
           <i class="fas fa-print"></i> Imprimir lista do ônibus
         </button>
         <button class="btn-secondary" onclick="copiarListaOnibus()">
           <i class="fas fa-copy"></i> Copiar (Nome + RG)
         </button>
       </div>
     `;
     return html;
   }
   
   /* ============================================================
      ABA 2: LISTA DE FECHAMENTO (por vendedor, com valores)
      ============================================================ */
   function renderAbaFechamento(compras) {
     // Agrupa por vendedor
     const porVendedor = {};
     compras.forEach(c => {
       const v = c.vendedorNome || 'Não informado';
       if (!porVendedor[v]) porVendedor[v] = [];
       porVendedor[v].push(c);
     });
   
     const totalGeralPessoas = compras.reduce((s, c) => s + (Number(c.qtd) || 1), 0);
     const totalGeralValor = compras.reduce((s, c) => s + (Number(c.total) || 0), 0);
   
     let html = `
       <div class="lista-fechamento-aviso">
         <i class="fas fa-dollar-sign"></i>
         Fechamento financeiro separado por vendedor
       </div>
     `;
   
     const vendedoresOrdenados = Object.keys(porVendedor).sort();
   
     vendedoresOrdenados.forEach(vendedor => {
       const lista = porVendedor[vendedor];
       const totalVendPessoas = lista.reduce((s, c) => s + (Number(c.qtd) || 1), 0);
       const valorVend = lista.reduce((s, c) => s + (Number(c.total) || 0), 0);
   
       html += `
         <div class="lista-vendedor-bloco">
           <div class="lista-vendedor-header">
             <div class="lista-vendedor-nome">
               <i class="fas fa-user-tie"></i> ${vendedor}
             </div>
             <div class="lista-vendedor-stats">
               <span>${lista.length} compra(s)</span>
               <span>${totalVendPessoas} pessoa(s)</span>
               <span style="background:linear-gradient(135deg,#e91e63,#f5a623);color:white;border:none;">
                 R$ ${valorVend.toLocaleString('pt-BR')}
               </span>
             </div>
           </div>
   
           <table class="lista-tabela">
             <thead>
               <tr>
                 <th>#</th>
                 <th>Nome</th>
                 <th>RG</th>
                 <th>Qtd</th>
                 <th>Valor unit.</th>
                 <th>Total</th>
                 <th>Status</th>
               </tr>
             </thead>
             <tbody>
               ${lista.map((c, i) => {
                 const total = Number(c.total) || 0;
                 const qtd = Number(c.qtd) || 1;
                 const unitario = qtd > 0 ? total / qtd : 0;
                 return `
                   <tr>
                     <td>${i + 1}</td>
                     <td><strong>${c.nome || '—'}</strong></td>
                     <td>${c.rg || '—'}</td>
                     <td>${qtd}</td>
                     <td>R$ ${unitario.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                     <td><strong style="color:var(--ahga-rosa);">R$ ${total.toLocaleString('pt-BR')}</strong></td>
                     <td>
                       <span class="lista-status ${c.status === 'utilizado' ? 'ok' : 'pendente'}">
                         ${c.status === 'utilizado' ? '✅ Pago' : '⏳ Pendente'}
                       </span>
                     </td>
                   </tr>
                 `;
               }).join('')}
             </tbody>
             <tfoot>
               <tr style="background:#f7f9fe; font-weight:800;">
                 <td colspan="3" style="text-align:right;">Subtotal ${vendedor}:</td>
                 <td>${totalVendPessoas}</td>
                 <td colspan="3" style="color:var(--ahga-rosa);">
                   R$ ${valorVend.toLocaleString('pt-BR')}
                 </td>
               </tr>
             </tfoot>
           </table>
         </div>
       `;
     });
   
     // Rodapé com total geral
     html += `
       <div class="lista-total-geral">
         <div class="lista-total-geral-item">
           <span class="label">Total geral de pessoas</span>
           <strong class="value">${totalGeralPessoas}</strong>
         </div>
         <div class="lista-total-geral-item destaque">
           <span class="label">Valor total arrecadado</span>
           <strong class="value">R$ ${totalGeralValor.toLocaleString('pt-BR')}</strong>
         </div>
       </div>
   
       <div class="lista-acoes-finais">
         <button class="btn-secondary" onclick="window.print()">
           <i class="fas fa-print"></i> Imprimir fechamento
         </button>
         <button class="btn-secondary" onclick="copiarListaFechamento()">
           <i class="fas fa-copy"></i> Copiar fechamento
         </button>
       </div>
     `;
   
     return html;
   }
   
   /* ============================================================
      TROCAR ABA
      ============================================================ */
   function trocarAbaLista(aba) {
     abaListaAtual = aba;
     renderizarLista();
   }
   
   /* ============================================================
      COPIAR LISTA DO ÔNIBUS (Nome + RG)
      ============================================================ */
   function copiarListaOnibus() {
     const compras = comprasDaExcursaoAtual;
     if (compras.length === 0) {
       alert('Nenhum passageiro para copiar');
       return;
     }
   
     const exc = excursaoAtualLista;
     let texto = `🚌 *LISTA DO ÔNIBUS*\n`;
     texto += `*${exc.titulo}*\n`;
     texto += `📍 ${exc.destino}\n`;
     texto += `📅 ${formatarDataLista(exc.dataIda)}\n`;
     texto += `━━━━━━━━━━━━━━━━━━\n\n`;
   
     compras.forEach((c, i) => {
       texto += `${i + 1}. ${c.nome} | RG: ${c.rg} | Qtd: ${c.qtd || 1}\n`;
     });
   
     const totalPessoas = compras.reduce((s, c) => s + (Number(c.qtd) || 1), 0);
     texto += `\n━━━━━━━━━━━━━━━━━━\n`;
     texto += `✅ *Total: ${totalPessoas} passageiro(s)*`;
   
     navigator.clipboard.writeText(texto).then(() => {
       alert('✅ Lista do ônibus copiada!\n\nAgora é só colar no WhatsApp.');
     }).catch(() => {
       prompt('Copie o texto abaixo:', texto);
     });
   }
   
   /* ============================================================
      COPIAR LISTA DE FECHAMENTO (por vendedor, com valores)
      ============================================================ */
   function copiarListaFechamento() {
     const compras = comprasDaExcursaoAtual;
     if (compras.length === 0) {
       alert('Nenhum passageiro para copiar');
       return;
     }
   
     const exc = excursaoAtualLista;
   
     const porVendedor = {};
     compras.forEach(c => {
       const v = c.vendedorNome || 'Não informado';
       if (!porVendedor[v]) porVendedor[v] = [];
       porVendedor[v].push(c);
     });
   
     let texto = `💰 *FECHAMENTO DA EXCURSÃO*\n`;
     texto += `*${exc.titulo}*\n`;
     texto += `📍 ${exc.destino}\n`;
     texto += `📅 ${formatarDataLista(exc.dataIda)}\n`;
     texto += `━━━━━━━━━━━━━━━━━━\n\n`;
   
     Object.keys(porVendedor).sort().forEach(vendedor => {
       const lista = porVendedor[vendedor];
       const totalP = lista.reduce((s, c) => s + (Number(c.qtd) || 1), 0);
       const valorV = lista.reduce((s, c) => s + (Number(c.total) || 0), 0);
   
       texto += `👤 *Vendedor: ${vendedor}*\n`;
       lista.forEach((c, i) => {
         texto += `  ${i + 1}. ${c.nome} | RG: ${c.rg} | Qtd: ${c.qtd || 1} | R$ ${Number(c.total || 0).toLocaleString('pt-BR')}\n`;
       });
       texto += `  ➡️ Subtotal: ${totalP} pessoa(s) | R$ ${valorV.toLocaleString('pt-BR')}\n\n`;
     });
   
     const totalGeralP = compras.reduce((s, c) => s + (Number(c.qtd) || 1), 0);
     const totalGeralV = compras.reduce((s, c) => s + (Number(c.total) || 0), 0);
   
     texto += `━━━━━━━━━━━━━━━━━━\n`;
     texto += `✅ *TOTAL GERAL:* ${totalGeralP} pessoa(s)\n`;
     texto += `💰 *Valor total:* R$ ${totalGeralV.toLocaleString('pt-BR')}`;
   
     navigator.clipboard.writeText(texto).then(() => {
       alert('✅ Fechamento copiado!\n\nAgora é só colar no WhatsApp.');
     }).catch(() => {
       prompt('Copie o texto abaixo:', texto);
     });
   }
   
   /* ============================================================
      VER CARTÃO DO PASSAGEIRO
      ============================================================ */
   function verCartaoPassageiro(codigo) {
     const url = `${window.location.origin}/cartao.html?codigo=${codigo}`;
     window.open(url, '_blank');
   }
   
   /* ============================================================
      FECHAR MODAL
      ============================================================ */
   function fecharLista() {
     const modal = document.getElementById('listaModal');
     if (!modal) return;
     modal.classList.remove('active');
     document.body.style.overflow = '';
   }
   
   /* ============================================================
      HELPERS
      ============================================================ */
   function formatarDataLista(iso) {
     if (!iso) return '—';
     const d = new Date(iso + 'T00:00:00');
     if (isNaN(d)) return iso;
     const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
     return `${String(d.getDate()).padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
   }
   
   /* ============================================================
      FECHAR AO CLICAR FORA
      ============================================================ */
   document.addEventListener('DOMContentLoaded', () => {
     const listaModal = document.getElementById('listaModal');
     if (listaModal) {
       listaModal.addEventListener('click', (e) => {
         if (e.target.id === 'listaModal') fecharLista();
       });
     }
     document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') fecharLista();
     });
   });
   
   /* ============================================================
      EXPÕE GLOBALMENTE
      ============================================================ */
   window.abrirListaExcursao = abrirListaExcursao;
   window.fecharLista = fecharLista;
   window.trocarAbaLista = trocarAbaLista;
   window.verCartaoPassageiro = verCartaoPassageiro;
   window.copiarListaOnibus = copiarListaOnibus;
   window.copiarListaFechamento = copiarListaFechamento;
   
   console.log('✅ lista.js carregado (2 abas: ônibus + fechamento)');