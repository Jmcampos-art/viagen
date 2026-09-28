/* ============================================================
   AHGA TURISMO — Sistema de Clima e Eventos
   Busca previsão do tempo (7 dias) + eventos na cidade
   ============================================================ */

   const API_URL_CLIMA = window.API_URL || 'http://localhost:3000';

   /* ============================================================
      CACHE LOCAL (evita requisições repetidas)
      ============================================================ */
   const cacheClima = new Map();
   const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
   
   /* ============================================================
      BUSCAR CLIMA DA CIDADE (via backend)
      ============================================================ */
   async function buscarClimaCidade(cidade, dataIda = null) {
     if (!cidade) return null;
   
     const cacheKey = `${cidade.toLowerCase()}_${dataIda || 'hoje'}`;
     const cached = cacheClima.get(cacheKey);
   
     if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
       return cached.data;
     }
   
     try {
       const params = new URLSearchParams({ cidade });
       if (dataIda) params.append('data', dataIda);
   
       const r = await fetch(`${API_URL_CLIMA}/api/clima?${params.toString()}`);
       const data = await r.json();
   
       if (!r.ok) throw new Error(data.error || 'Erro ao buscar clima');
   
       cacheClima.set(cacheKey, { data, timestamp: Date.now() });
       return data;
   
     } catch (err) {
       console.warn('⚠️ Erro ao buscar clima:', err.message);
       return null;
     }
   }
   
   /* ============================================================
      BUSCAR EVENTOS NA CIDADE
      ============================================================ */
   async function buscarEventosCidade(cidade, dataInicio = null, dataFim = null) {
     if (!cidade) return [];
   
     const cacheKey = `eventos_${cidade.toLowerCase()}_${dataInicio || ''}_${dataFim || ''}`;
     const cached = cacheClima.get(cacheKey);
   
     if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
       return cached.data;
     }
   
     try {
       const params = new URLSearchParams({ cidade });
       if (dataInicio) params.append('dataInicio', dataInicio);
       if (dataFim) params.append('dataFim', dataFim);
   
       const r = await fetch(`${API_URL_CLIMA}/api/eventos?${params.toString()}`);
       const data = await r.json();
   
       if (!r.ok) throw new Error(data.error || 'Erro ao buscar eventos');
   
       const eventos = data.eventos || [];
       cacheClima.set(cacheKey, { data: eventos, timestamp: Date.now() });
       return eventos;
   
     } catch (err) {
       console.warn('⚠️ Erro ao buscar eventos:', err.message);
       return [];
     }
   }
   
   /* ============================================================
      ÍCONES E CORES POR TIPO DE CLIMA
      ============================================================ */
   function getIconeClima(codigo, descricao = '') {
     const desc = descricao.toLowerCase();
   
     if (desc.includes('trovoada') || desc.includes('tempestade')) return 'fa-cloud-bolt';
     if (desc.includes('neve')) return 'fa-snowflake';
     if (desc.includes('chuva forte') || desc.includes('chuva intensa')) return 'fa-cloud-showers-heavy';
     if (desc.includes('chuva') || desc.includes('garoa') || desc.includes('chuvisc')) return 'fa-cloud-rain';
     if (desc.includes('nublado') || desc.includes('encoberto')) return 'fa-cloud';
     if (desc.includes('parcialmente') || desc.includes('poucas nuvens')) return 'fa-cloud-sun';
     if (desc.includes('limpo') || desc.includes('céu claro') || desc.includes('ensolarado')) return 'fa-sun';
     if (desc.includes('névoa') || desc.includes('neblina') || desc.includes('cerração')) return 'fa-smog';
     if (desc.includes('vento')) return 'fa-wind';
   
     // Fallback por código
     if (codigo >= 200 && codigo < 300) return 'fa-cloud-bolt';
     if (codigo >= 300 && codigo < 600) return 'fa-cloud-rain';
     if (codigo >= 600 && codigo < 700) return 'fa-snowflake';
     if (codigo >= 700 && codigo < 800) return 'fa-smog';
     if (codigo === 800) return 'fa-sun';
     if (codigo === 801 || codigo === 802) return 'fa-cloud-sun';
     if (codigo >= 803) return 'fa-cloud';
   
     return 'fa-cloud-sun';
   }
   
   function getCorClima(codigo, descricao = '') {
     const desc = descricao.toLowerCase();
   
     if (desc.includes('trovoada') || desc.includes('tempestade')) return '#5c3ec9';
     if (desc.includes('neve')) return '#29a3d4';
     if (desc.includes('chuva')) return '#3b82f6';
     if (desc.includes('nublado') || desc.includes('encoberto')) return '#64748b';
     if (desc.includes('parcialmente')) return '#f5a623';
     if (desc.includes('limpo') || desc.includes('ensolarado')) return '#f5a623';
     if (desc.includes('névoa') || desc.includes('neblina')) return '#94a3b8';
   
     if (codigo >= 200 && codigo < 300) return '#5c3ec9';
     if (codigo >= 300 && codigo < 600) return '#3b82f6';
     if (codigo >= 600 && codigo < 700) return '#29a3d4';
     if (codigo === 800) return '#f5a623';
     if (codigo === 801 || codigo === 802) return '#f5a623';
     if (codigo >= 803) return '#64748b';
   
     return '#64748b';
   }
   
   function getIconeEvento(tipo) {
     const mapa = {
       'show': 'fa-music',
       'festival': 'fa-star',
       'feira': 'fa-store',
       'exposicao': 'fa-palette',
       'teatro': 'fa-theater-masks',
       'esporte': 'fa-futbol',
       'religioso': 'fa-church',
       'gastronomico': 'fa-utensils',
       'cultural': 'fa-landmark',
       'outro': 'fa-calendar-check'
     };
     return mapa[tipo] || 'fa-calendar-check';
   }
   
   /* ============================================================
      RENDERIZAR PREVISÃO DO TEMPO (CARD)
      ============================================================ */
   function renderPrevisaoClima(clima) {
     if (!clima || !clima.previsao || clima.previsao.length === 0) {
       return `
         <div class="clima-indisponivel">
           <i class="fas fa-cloud-question"></i>
           <span>Previsão do tempo não disponível</span>
         </div>
       `;
     }
   
     const previsao = clima.previsao.slice(0, 7);
     const atual = clima.atual;
   
     let html = `
       <div class="clima-container">
         <div class="clima-titulo">
           <i class="fas fa-cloud-sun"></i>
           <span>Previsão do Tempo · ${clima.cidade || ''}</span>
         </div>
     `;
   
     // Clima atual
     if (atual) {
       const icone = getIconeClima(atual.codigo, atual.descricao);
       const cor = getCorClima(atual.codigo, atual.descricao);
   
       html += `
         <div class="clima-atual" style="background: linear-gradient(135deg, ${cor}22, ${cor}11); border: 1.5px solid ${cor}44;">
           <div class="clima-atual-esq">
             <div class="clima-atual-icone" style="color: ${cor};">
               <i class="fas ${icone}"></i>
             </div>
             <div class="clima-atual-info">
               <span class="clima-atual-temp">${Math.round(atual.temperatura)}°C</span>
               <span class="clima-atual-desc">${atual.descricao}</span>
               <span class="clima-atual-sensacao">Sensação: ${Math.round(atual.sensacao)}°C</span>
             </div>
           </div>
           <div class="clima-atual-detalhes">
             <div><i class="fas fa-droplet"></i> ${atual.umidade}%</div>
             <div><i class="fas fa-wind"></i> ${atual.vento} km/h</div>
             <div><i class="fas fa-temperature-high"></i> Máx ${Math.round(atual.max)}°</div>
             <div><i class="fas fa-temperature-low"></i> Mín ${Math.round(atual.min)}°</div>
           </div>
         </div>
       `;
     }
   
     // Previsão próximos dias
     html += `<div class="clima-previsao">`;
   
     previsao.forEach(dia => {
       const icone = getIconeClima(dia.codigo, dia.descricao);
       const cor = getCorClima(dia.codigo, dia.descricao);
       const dataFormatada = formatarDiaSemanaClima(dia.data);
   
       html += `
         <div class="clima-dia">
           <span class="clima-dia-nome">${dataFormatada}</span>
           <i class="fas ${icone}" style="color: ${cor};"></i>
           <div class="clima-dia-temp">
             <span class="max">${Math.round(dia.max)}°</span>
             <span class="min">${Math.round(dia.min)}°</span>
           </div>
           <span class="clima-dia-chuva">
             <i class="fas fa-droplet"></i> ${dia.chuva || 0}%
           </span>
         </div>
       `;
     });
   
     html += `</div></div>`;
   
     return html;
   }
   
   /* ============================================================
      RENDERIZAR EVENTOS
      ============================================================ */
   function renderEventos(eventos, cidade) {
     if (!eventos || eventos.length === 0) {
       return `
         <div class="eventos-vazio">
           <i class="fas fa-calendar-times"></i>
           <span>Nenhum evento programado para o período</span>
         </div>
       `;
     }
   
     let html = `
       <div class="eventos-container">
         <div class="eventos-titulo">
           <i class="fas fa-calendar-star"></i>
           <span>Eventos em ${cidade}</span>
           <span class="eventos-badge">${eventos.length}</span>
         </div>
         <div class="eventos-lista">
     `;
   
     eventos.slice(0, 6).forEach(evento => {
       const icone = getIconeEvento(evento.tipo);
       const dataFormatada = formatarDataEvento(evento.dataInicio, evento.dataFim);
   
       html += `
         <div class="evento-card">
           <div class="evento-icone">
             <i class="fas ${icone}"></i>
           </div>
           <div class="evento-info">
             <div class="evento-nome">${evento.nome || 'Evento'}</div>
             <div class="evento-data">
               <i class="fas fa-calendar"></i> ${dataFormatada}
             </div>
             ${evento.local ? `<div class="evento-local"><i class="fas fa-map-marker-alt"></i> ${evento.local}</div>` : ''}
             ${evento.descricao ? `<div class="evento-desc">${evento.descricao.substring(0, 100)}${evento.descricao.length > 100 ? '...' : ''}</div>` : ''}
           </div>
           ${evento.link ? `
             <a href="${evento.link}" target="_blank" rel="noopener noreferrer" class="evento-link" title="Mais informações">
               <i class="fas fa-external-link-alt"></i>
             </a>
           ` : ''}
         </div>
       `;
     });
   
     html += `</div></div>`;
   
     return html;
   }
   
   /* ============================================================
      HELPERS DE DATA
      ============================================================ */
   function formatarDiaSemanaClima(dataISO) {
     if (!dataISO) return '—';
     const d = new Date(dataISO + 'T00:00:00');
     if (isNaN(d)) return '—';
   
     const hoje = new Date();
     hoje.setHours(0, 0, 0, 0);
   
     const diff = Math.round((d - hoje) / (1000 * 60 * 60 * 24));
   
     if (diff === 0) return 'Hoje';
     if (diff === 1) return 'Amanhã';
   
     const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
     return dias[d.getDay()];
   }
   
   function formatarDataEvento(inicio, fim) {
     if (!inicio) return 'Data a definir';
   
     const dInicio = new Date(inicio + 'T00:00:00');
     const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
   
     let texto = `${dInicio.getDate()} ${meses[dInicio.getMonth()]}`;
   
     if (fim && fim !== inicio) {
       const dFim = new Date(fim + 'T00:00:00');
       texto += ` – ${dFim.getDate()} ${meses[dFim.getMonth()]}`;
     }
   
     return texto;
   }
   
   /* ============================================================
      CARREGAR E RENDERIZAR TUDO (para detalhes de excursão)
      ============================================================ */
   async function carregarClimaEEventos(excursao) {
     if (!excursao || !excursao.destino) return;
   
     const cidade = excursao.destino.split(',')[0].trim();
     const dataIda = excursao.dataIda;
     const dataVolta = excursao.dataVolta || dataIda;
   
     // Mostra loading
     const climaContainer = document.getElementById('detalhesClima');
     const eventosContainer = document.getElementById('detalhesEventos');
   
     if (climaContainer) {
       climaContainer.innerHTML = `
         <div class="clima-loading">
           <i class="fas fa-circle-notch fa-spin"></i>
           <span>Carregando previsão do tempo...</span>
         </div>
       `;
     }
   
     if (eventosContainer) {
       eventosContainer.innerHTML = `
         <div class="clima-loading">
           <i class="fas fa-circle-notch fa-spin"></i>
           <span>Buscando eventos na cidade...</span>
         </div>
       `;
     }
   
     // Busca em paralelo
     const [clima, eventos] = await Promise.all([
       buscarClimaCidade(cidade, dataIda),
       buscarEventosCidade(cidade, dataIda, dataVolta)
     ]);
   
     if (climaContainer) {
       climaContainer.innerHTML = renderPrevisaoClima(clima);
     }
   
     if (eventosContainer) {
       eventosContainer.innerHTML = renderEventos(eventos, cidade);
     }
   }
   
   /* ============================================================
      EXPÕE GLOBALMENTE
      ============================================================ */
   window.buscarClimaCidade = buscarClimaCidade;
   window.buscarEventosCidade = buscarEventosCidade;
   window.renderPrevisaoClima = renderPrevisaoClima;
   window.renderEventos = renderEventos;
   window.carregarClimaEEventos = carregarClimaEEventos;
   window.getIconeClima = getIconeClima;
   
   console.log('✅ clima.js carregado');