/* ============================================================
   AHGA TURISMO — Sistema de Aprovação de Compras
   Aprovar / Recusar compras no painel admin
   ============================================================ */

   const API_URL_APROV = window.API_URL || 'http://localhost:3000';

   /* ============================================================
      ESTADO GLOBAL
      ============================================================ */
   let comprasAprovacao = [];
   let filtroStatusAtual = 'pendente';
   let contadorAtualizadoEm = 0;
   
   /* ============================================================
      ABRIR PAINEL DE APROVAÇÕES
      ============================================================ */
   async function abrirPainelAprovacoes() {
     const modal = document.getElementById('aprovacoesModal');
     if (!modal) {
       console.warn('Modal aprovacoesModal não encontrado');
       return;
     }
   
     modal.classList.add('active');
     document.body.style.overflow = 'hidden';
   
     await carregarComprasAprovacao();
   }
   
   function fecharPainelAprovacoes() {
     const modal = document.getElementById('aprovacoesModal');
     if (!modal) return;
     modal.classList.remove('active');
     document.body.style.overflow = '';
   }
   
   /* ============================================================
      CARREGAR COMPRAS
      ============================================================ */
   async function carregarComprasAprovacao() {
     const container = document.getElementById('aprovacoesConteudo');
     if (!container) return;
   
     container.innerHTML = `
       <div class="empty-state">
         <i class="fas fa-circle-notch fa-spin"></i>
         <p>Carregando compras...</p>
       </div>
     `;
   
     try {
       const r = await fetch(`${API_URL_APROV}/api/compras`);
       const data = await r.json();
       comprasAprovacao = data.compras || [];
   
       renderizarAprovacoes();
   
     } catch (err) {
       console.error(err);
       container.innerHTML = `
         <div class="empty-state">
           <i class="fas fa-exclamation-triangle"></i>
           <p>Erro ao carregar compras</p>
           <span>${err.message}</span>
         </div>
       `;
     }
   }
   
   /* ============================================================
      RENDERIZAR PAINEL
      ============================================================ */
   function renderizarAprovacoes() {
     const container = document.getElementById('aprovacoesConteudo');
     if (!container) return;
   
     const pendentes = comprasAprovacao.filter(c => c.status === 'pendente');
     const aprovadas = comprasAprovacao.filter(c => c.status === 'aprovado');
     const recusadas = comprasAprovacao.filter(c => c.status === 'recusado');
     const todas = comprasAprovacao;
   
     // Estatísticas
     const stats = {
       pendente: pendentes.length,
       aprovado: aprovadas.length,
       recusado: recusadas.length,
       total: todas.length
     };
   
     // Lista filtrada
     let listaFiltrada = comprasAprovacao;
     if (filtroStatusAtual === 'pendente') listaFiltrada = pendentes;
     else if (filtroStatusAtual === 'aprovado') listaFiltrada = aprovadas;
     else if (filtroStatusAtual === 'recusado') listaFiltrada = recusadas;
   
     // Ordenar: pendentes primeiro, depois por data
     listaFiltrada.sort((a, b) => {
       const ordem = { pendente: 0, aprovado: 1, recusado: 2, cancelado: 3, utilizado: 4 };
       const diff = (ordem[a.status] || 99) - (ordem[b.status] || 99);
       if (diff !== 0) return diff;
       return new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0);
     });
   
     let html = `
       <div class="aprov-stats">
         <div class="aprov-stat-card pendente">
           <i class="fas fa-clock"></i>
           <div>
             <span class="label">Pendentes</span>
             <strong class="value">${stats.pendente}</strong>
           </div>
         </div>
         <div class="aprov-stat-card aprovado">
           <i class="fas fa-check-circle"></i>
           <div>
             <span class="label">Aprovadas</span>
             <strong class="value">${stats.aprovado}</strong>
           </div>
         </div>
         <div class="aprov-stat-card recusado">
           <i class="fas fa-times-circle"></i>
           <div>
             <span class="label">Recusadas</span>
             <strong class="value">${stats.recusado}</strong>
           </div>
         </div>
         <div class="aprov-stat-card total">
           <i class="fas fa-list"></i>
           <div>
             <span class="label">Total</span>
             <strong class="value">${stats.total}</strong>
           </div>
         </div>
       </div>
   
       <div class="aprov-filtros">
         <button class="aprov-filtro ${filtroStatusAtual === 'pendente' ? 'ativo' : ''}"
                 onclick="mudarFiltroAprov('pendente')" type="button">
           <i class="fas fa-clock"></i> Pendentes (${stats.pendente})
         </button>
         <button class="aprov-filtro ${filtroStatusAtual === 'aprovado' ? 'ativo' : ''}"
                 onclick="mudarFiltroAprov('aprovado')" type="button">
           <i class="fas fa-check"></i> Aprovadas (${stats.aprovado})
         </button>
         <button class="aprov-filtro ${filtroStatusAtual === 'recusado' ? 'ativo' : ''}"
                 onclick="mudarFiltroAprov('recusado')" type="button">
           <i class="fas fa-times"></i> Recusadas (${stats.recusado})
         </button>
         <button class="aprov-filtro ${filtroStatusAtual === 'todas' ? 'ativo' : ''}"
                 onclick="mudarFiltroAprov('todas')" type="button">
           <i class="fas fa-list"></i> Todas
         </button>
         <button class="aprov-filtro atualizar" onclick="carregarComprasAprovacao()" type="button" title="Atualizar">
           <i class="fas fa-sync"></i>
         </button>
       </div>
     `;
   
     if (listaFiltrada.length === 0) {
       const msgVazio = {
         pendente: { icon: 'fa-check-circle', cor: '#22b573', texto: 'Nenhuma compra pendente!' },
         aprovado: { icon: 'fa-inbox', cor: '#94a3b8', texto: 'Nenhuma compra aprovada ainda' },
         recusado: { icon: 'fa-inbox', cor: '#94a3b8', texto: 'Nenhuma compra recusada' },
         todas: { icon: 'fa-inbox', cor: '#94a3b8', texto: 'Nenhuma compra registrada' }
       }[filtroStatusAtual] || { icon: 'fa-inbox', cor: '#94a3b8', texto: 'Nenhuma compra' };
   
       html += `
         <div class="empty-state" style="margin-top:1.5rem;">
           <i class="fas ${msgVazio.icon}" style="color:${msgVazio.cor};"></i>
           <p>${msgVazio.texto}</p>
         </div>
       `;
   
       container.innerHTML = html;
       return;
     }
   
     // Renderizar cards
     html += `<div class="aprov-lista">`;
   
     listaFiltrada.forEach(compra => {
       html += renderCardCompra(compra);
     });
   
     html += `</div>`;
   
     container.innerHTML = html;
   }
   
   /* ============================================================
      RENDERIZAR UM CARD DE COMPRA
      ============================================================ */
   function renderCardCompra(c) {
     const statusConfig = {
       pendente: { classe: 'pendente', icone: 'fa-clock', label: 'Pendente' },
       aprovado: { classe: 'aprovado', icone: 'fa-check-circle', label: 'Aprovado' },
       recusado: { classe: 'recusado', icone: 'fa-times-circle', label: 'Recusado' },
       cancelado: { classe: 'recusado', icone: 'fa-ban', label: 'Cancelado' },
       utilizado: { classe: 'utilizado', icone: 'fa-check-double', label: 'Utilizado' }
     }[c.status] || { classe: 'pendente', icone: 'fa-question', label: c.status };
   
     const telLimpo = (c.telefone || '').replace(/\D/g, '');
     const telWhats = telLimpo.startsWith('55') ? telLimpo : `55${telLimpo}`;
     const valorTotal = Number(c.total || 0).toLocaleString('pt-BR');
     const dataCriacao = c.criadoEm
       ? new Date(c.criadoEm).toLocaleString('pt-BR', {
           day: '2-digit', month: '2-digit', year: '2-digit',
           hour: '2-digit', minute: '2-digit'
         })
       : '—';
   
     const podeAprovar = c.status === 'pendente';
     const podeRecusar = c.status === 'pendente' || c.status === 'aprovado';
   
     return `
       <div class="aprov-card ${statusConfig.classe}">
         <div class="aprov-card-header">
           <div class="aprov-card-status">
             <span class="aprov-status-badge ${statusConfig.classe}">
               <i class="fas ${statusConfig.icone}"></i> ${statusConfig.label}
             </span>
             <span class="aprov-data">${dataCriacao}</span>
           </div>
           <code class="aprov-codigo">${c.codigo || '—'}</code>
         </div>
   
         <div class="aprov-card-body">
           <div class="aprov-info-principal">
             <div class="aprov-avatar">${(c.nome || 'A').charAt(0).toUpperCase()}</div>
             <div class="aprov-info-nome">
               <h4>${c.nome || '—'}</h4>
               <span class="aprov-telefone">
                 <i class="fas fa-phone"></i> ${c.telefone || 'Sem telefone'}
               </span>
             </div>
           </div>
   
           <div class="aprov-grid">
             <div class="aprov-grid-item">
               <span class="label">CPF</span>
               <strong>${c.cpf || '—'}</strong>
             </div>
             <div class="aprov-grid-item">
               <span class="label">RG</span>
               <strong>${c.rg || '—'}</strong>
             </div>
             <div class="aprov-grid-item">
               <span class="label">Pessoas</span>
               <strong>${c.qtd || 1}</strong>
             </div>
             <div class="aprov-grid-item destaque">
               <span class="label">Total</span>
               <strong>R$ ${valorTotal}</strong>
             </div>
           </div>
   
           <div class="aprov-excursao">
             <i class="fas fa-suitcase-rolling"></i>
             <div>
               <strong>${c.excursaoTitulo || 'Excursão'}</strong>
               <span>${c.excursaoDestino || '—'} · ${formatarDataAprov(c.excursaoData)}</span>
             </div>
           </div>
   
           <div class="aprov-vendedor">
             <i class="fas fa-user-tie"></i>
             Vendedor: <strong>${c.vendedorNome || 'Não informado'}</strong>
           </div>
   
           ${c.obs ? `
             <div class="aprov-obs">
               <i class="fas fa-comment"></i>
               <span>${c.obs}</span>
             </div>
           ` : ''}
   
           ${c.motivoRecusa ? `
             <div class="aprov-motivo-recusa">
               <i class="fas fa-exclamation-circle"></i>
               <div>
                 <strong>Motivo da recusa:</strong>
                 <span>${c.motivoRecusa}</span>
               </div>
             </div>
           ` : ''}
         </div>
   
         <div class="aprov-card-actions">
           ${podeAprovar ? `
             <button class="aprov-btn aprovar"
                     onclick="aprovarCompra('${c.codigo}')"
                     type="button">
               <i class="fas fa-check"></i> Aprovar
             </button>
           ` : ''}
   
           ${podeRecusar ? `
             <button class="aprov-btn recusar"
                     onclick="abrirModalRecusa('${c.codigo}', '${(c.nome || '').replace(/'/g, "\\'")}')"
                     type="button">
               <i class="fas fa-times"></i> Recusar
             </button>
           ` : ''}
   
           ${telLimpo ? `
             <a class="aprov-btn whatsapp"
                href="https://wa.me/${telWhats}?text=${encodeURIComponent('Olá ' + (c.nome || '') + '! Sobre sua compra na AHGA Turismo...')}"
                target="_blank" rel="noopener noreferrer">
               <i class="fab fa-whatsapp"></i> WhatsApp
             </a>
           ` : ''}
   
           ${c.status === 'aprovado' ? `
             <button class="aprov-btn cartao"
                     onclick="copiarLinkCartaoAprov('${c.codigo}')"
                     type="button">
               <i class="fas fa-link"></i> Copiar link
             </button>
           ` : ''}
   
           ${c.status === 'recusado' || c.status === 'cancelado' ? `
             <button class="aprov-btn excluir"
                     onclick="excluirCompraAprov('${c.codigo}', '${(c.nome || '').replace(/'/g, "\\'")}')"
                     type="button">
               <i class="fas fa-trash"></i> Excluir
             </button>
           ` : ''}
         </div>
       </div>
     `;
   }
   
   /* ============================================================
      MUDAR FILTRO
      ============================================================ */
   function mudarFiltroAprov(filtro) {
     filtroStatusAtual = filtro;
     renderizarAprovacoes();
   }
   
   /* ============================================================
      APROVAR COMPRA
      ============================================================ */
   async function aprovarCompra(codigo) {
     const confirmar = confirm(
       `✅ APROVAR COMPRA?\n\n` +
       `Código: ${codigo}\n\n` +
       `O cliente será notificado e o cartão de embarque ficará disponível.`
     );
   
     if (!confirmar) return;
   
     try {
       const r = await fetch(`${API_URL_APROV}/api/compras/${codigo}/aprovar`, {
         method: 'PUT',
         headers: { 'X-Admin-Auth': 'true' }
       });
   
       const data = await r.json();
       if (!r.ok) throw new Error(data.error || 'Erro ao aprovar');
   
       // Feedback visual
       mostrarToastAprov('✅ Compra aprovada com sucesso!', 'sucesso');
   
       // Atualiza lista
       await carregarComprasAprovacao();
       atualizarBadgePendentes();
   
     } catch (err) {
       console.error(err);
       mostrarToastAprov('❌ Erro ao aprovar: ' + err.message, 'erro');
     }
   }
   
   /* ============================================================
      MODAL DE RECUSA COM MOTIVO
      ============================================================ */
   function abrirModalRecusa(codigo, nome) {
     const modal = document.getElementById('recusaModal');
     if (!modal) return;
   
     document.getElementById('recusaCodigo').value = codigo;
     document.getElementById('recusaNome').textContent = nome || 'Cliente';
     document.getElementById('recusaMotivo').value = '';
   
     modal.classList.add('active');
     document.body.style.overflow = 'hidden';
   
     setTimeout(() => {
       const input = document.getElementById('recusaMotivo');
       if (input) input.focus();
     }, 100);
   }
   
   function fecharModalRecusa() {
     const modal = document.getElementById('recusaModal');
     if (!modal) return;
     modal.classList.remove('active');
     document.body.style.overflow = '';
   }
   
   async function confirmarRecusa() {
     const codigo = document.getElementById('recusaCodigo').value;
     const motivo = document.getElementById('recusaMotivo').value.trim() || 'Não informado';
   
     if (!codigo) return;
   
     const btn = document.getElementById('btnConfirmarRecusa');
     if (btn) {
       btn.disabled = true;
       btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processando...';
     }
   
     try {
       const r = await fetch(`${API_URL_APROV}/api/compras/${codigo}/recusar`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
           'X-Admin-Auth': 'true'
         },
         body: JSON.stringify({ motivo })
       });
   
       const data = await r.json();
       if (!r.ok) throw new Error(data.error || 'Erro ao recusar');
   
       fecharModalRecusa();
       mostrarToastAprov('❌ Compra recusada. Vagas devolvidas!', 'aviso');
   
       await carregarComprasAprovacao();
       atualizarBadgePendentes();
   
       // Se tiver compras carregadas na página, atualiza também
       if (typeof carregarComprasAdmin === 'function') {
         carregarComprasAdmin();
       }
       if (typeof carregarExcursoesAdmin === 'function') {
         carregarExcursoesAdmin();
       }
   
     } catch (err) {
       console.error(err);
       mostrarToastAprov('❌ Erro: ' + err.message, 'erro');
     } finally {
       if (btn) {
         btn.disabled = false;
         btn.innerHTML = '<i class="fas fa-times"></i> Confirmar recusa';
       }
     }
   }
   
   /* ============================================================
      EXCLUIR COMPRA
      ============================================================ */
   async function excluirCompraAprov(codigo, nome) {
     const confirmar = confirm(
       `🗑️ EXCLUIR PERMANENTEMENTE?\n\n` +
       `Cliente: ${nome}\n` +
       `Código: ${codigo}\n\n` +
       `⚠️ Esta ação NÃO pode ser desfeita!`
     );
   
     if (!confirmar) return;
   
     const confirmacao2 = prompt(
       `Digite o código "${codigo}" para confirmar:`
     );
   
     if (confirmacao2 !== codigo) {
       mostrarToastAprov('❌ Código incorreto. Exclusão cancelada.', 'erro');
       return;
     }
   
     try {
       const r = await fetch(`${API_URL_APROV}/api/compras/${codigo}`, {
         method: 'DELETE',
         headers: { 'X-Admin-Auth': 'true' }
       });
   
       const data = await r.json();
       if (!r.ok) throw new Error(data.error || 'Erro ao excluir');
   
       mostrarToastAprov('✅ Compra excluída!', 'sucesso');
       await carregarComprasAprovacao();
       atualizarBadgePendentes();
   
     } catch (err) {
       mostrarToastAprov('❌ Erro: ' + err.message, 'erro');
     }
   }
   
   /* ============================================================
      COPIAR LINK DO CARTÃO
      ============================================================ */
   function copiarLinkCartaoAprov(codigo) {
     const url = `https://ahgaturismo.netlify.app/cartao.html?codigo=${codigo}`;
   
     navigator.clipboard.writeText(url).then(() => {
       mostrarToastAprov('✅ Link copiado! Cole no WhatsApp do cliente.', 'sucesso');
     }).catch(() => {
       prompt('Copie o link abaixo:', url);
     });
   }
   
   /* ============================================================
      BADGE DE PENDENTES NO MENU
      ============================================================ */
   async function atualizarBadgePendentes() {
     try {
       const r = await fetch(`${API_URL_APROV}/api/compras/pendentes/contador`, {
         headers: { 'X-Admin-Auth': 'true' }
       });
       const data = await r.json();
       const total = data.total || 0;
   
       // Atualiza todos os badges que existirem
       document.querySelectorAll('.badge-pendentes').forEach(badge => {
         if (total > 0) {
           badge.textContent = total;
           badge.style.display = 'inline-flex';
         } else {
           badge.style.display = 'none';
         }
       });
   
       // Atualiza badge no botão de aprovações
       const btnAprov = document.getElementById('btnAprovacoes');
       if (btnAprov) {
         const badge = btnAprov.querySelector('.badge-pendentes');
         if (badge) {
           if (total > 0) {
             badge.textContent = total;
             badge.style.display = 'inline-flex';
           } else {
             badge.style.display = 'none';
           }
         }
       }
   
       return total;
     } catch (err) {
       console.warn('Erro ao atualizar badge:', err);
       return 0;
     }
   }
   
   /* ============================================================
      TOAST / NOTIFICAÇÃO
      ============================================================ */
   function mostrarToastAprov(mensagem, tipo = 'sucesso') {
     // Remove toasts antigos
     document.querySelectorAll('.aprov-toast').forEach(t => t.remove());
   
     const cores = {
       sucesso: '#22b573',
       erro: '#e74c3c',
       aviso: '#f5a623'
     };
   
     const icones = {
       sucesso: 'fa-check-circle',
       erro: 'fa-times-circle',
       aviso: 'fa-exclamation-triangle'
     };
   
     const toast = document.createElement('div');
     toast.className = `aprov-toast ${tipo}`;
     toast.innerHTML = `
       <i class="fas ${icones[tipo]}"></i>
       <span>${mensagem}</span>
     `;
   
     document.body.appendChild(toast);
   
     setTimeout(() => toast.classList.add('visivel'), 10);
   
     setTimeout(() => {
       toast.classList.remove('visivel');
       setTimeout(() => toast.remove(), 300);
     }, 3500);
   }
   
   /* ============================================================
      HELPER DATA
      ============================================================ */
   function formatarDataAprov(iso) {
     if (!iso) return '—';
     const d = new Date(iso + 'T00:00:00');
     if (isNaN(d)) return iso;
     const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
     return `${String(d.getDate()).padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
   }
   
   /* ============================================================
      INICIALIZAÇÃO
      ============================================================ */
   document.addEventListener('DOMContentLoaded', () => {
     // Atualiza badge ao carregar (só se estiver logado)
     if (typeof getSessao === 'function' && getSessao()) {
       atualizarBadgePendentes();
   
       // Atualiza a cada 60 segundos
       setInterval(atualizarBadgePendentes, 60000);
     }
   
     // Fecha modal de recusa clicando fora
     const recusaModal = document.getElementById('recusaModal');
     if (recusaModal) {
       recusaModal.addEventListener('click', (e) => {
         if (e.target.id === 'recusaModal') fecharModalRecusa();
       });
     }
   
     // Enter no campo de motivo
     const inputMotivo = document.getElementById('recusaMotivo');
     if (inputMotivo) {
       inputMotivo.addEventListener('keypress', (e) => {
         if (e.key === 'Enter' && !e.shiftKey) {
           e.preventDefault();
           confirmarRecusa();
         }
       });
     }
   
     // Esc fecha modais
     document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
         fecharModalRecusa();
         fecharPainelAprovacoes();
       }
     });
   });
   
   /* ============================================================
      EXPÕE GLOBALMENTE
      ============================================================ */
   window.abrirPainelAprovacoes = abrirPainelAprovacoes;
   window.fecharPainelAprovacoes = fecharPainelAprovacoes;
   window.carregarComprasAprovacao = carregarComprasAprovacao;
   window.mudarFiltroAprov = mudarFiltroAprov;
   window.aprovarCompra = aprovarCompra;
   window.abrirModalRecusa = abrirModalRecusa;
   window.fecharModalRecusa = fecharModalRecusa;
   window.confirmarRecusa = confirmarRecusa;
   window.excluirCompraAprov = excluirCompraAprov;
   window.copiarLinkCartaoAprov = copiarLinkCartaoAprov;
   window.atualizarBadgePendentes = atualizarBadgePendentes;
   window.mostrarToastAprov = mostrarToastAprov;
   
   console.log('✅ aprovacao.js carregado');