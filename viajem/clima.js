/* ============================================================
   🌤️ CLIMA — Open-Meteo (gratuito, sem API key)
   ============================================================ */

   const geoCache = new Map();

   async function geocodificarCidade(nomeCidade) {
     const key = nomeCidade.toLowerCase().trim();
     if (geoCache.has(key)) return geoCache.get(key);
   
     try {
       const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`;
       const r = await fetch(url);
       const data = await r.json();
   
       if (data.results && data.results.length > 0) {
         const local = data.results[0];
         const resultado = {
           nome: local.name,
           pais: local.country,
           estado: local.admin1 || '',
           lat: local.latitude,
           lon: local.longitude,
           timezone: local.timezone || 'America/Sao_Paulo'
         };
         geoCache.set(key, resultado);
         return resultado;
       }
   
       return null;
     } catch (err) {
       console.error('Erro geocodificação:', err.message);
       return null;
     }
   }
   
   function getDescricaoClimaPT(codigo) {
     const mapa = {
       0: 'Céu limpo', 1: 'Principalmente limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
       45: 'Névoa', 48: 'Névoa com geada',
       51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa densa',
       56: 'Garoa congelante leve', 57: 'Garoa congelante densa',
       61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
       66: 'Chuva congelante leve', 67: 'Chuva congelante forte',
       71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte', 77: 'Grãos de neve',
       80: 'Pancadas de chuva leves', 81: 'Pancadas de chuva moderadas', 82: 'Pancadas de chuva violentas',
       85: 'Pancadas de neve leves', 86: 'Pancadas de neve fortes',
       95: 'Trovoada', 96: 'Trovoada com granizo leve', 99: 'Trovoada com granizo forte'
     };
     return mapa[codigo] || 'Tempo variável';
   }
   
   app.get('/api/clima', async (req, res) => {
     try {
       const cidade = req.query.cidade;
       const dataIda = req.query.data;
   
       if (!cidade) {
         return res.status(400).json({ error: 'Cidade não informada' });
       }
   
       console.log(`🌤️ [CLIMA] Buscando para: "${cidade}"`);
   
       const geo = await geocodificarCidade(cidade);
   
       if (!geo || !geo.lat || !geo.lon) {
         console.warn(`⚠️ [CLIMA] Geocoding falhou para "${cidade}"`);
         return res.status(404).json({
           error: 'Cidade não encontrada',
           cidade_original: cidade
         });
       }
   
       console.log(`📍 [CLIMA] Geocodificado: ${geo.nome}, ${geo.estado} (lat: ${geo.lat}, lon: ${geo.lon})`);
   
       const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=${encodeURIComponent(geo.timezone || 'America/Sao_Paulo')}&forecast_days=14`;
   
       console.log(`🌐 [CLIMA] URL: ${url}`);
   
       const r = await fetch(url);
   
       if (!r.ok) {
         const textoErro = await r.text();
         console.error(`❌ [CLIMA] Open-Meteo HTTP ${r.status}:`, textoErro.substring(0, 300));
         return res.status(500).json({
           error: 'Open-Meteo retornou erro',
           status: r.status,
           detalhes: textoErro.substring(0, 200)
         });
       }
   
       const data = await r.json();
   
       console.log(`📦 [CLIMA] Resposta:`, {
         temCurrent: !!data.current,
         temDaily: !!data.daily,
         temTime: !!(data.daily && data.daily.time),
         erro: data.reason || data.error || null,
         chaves: Object.keys(data).slice(0, 10)
       });
   
       if (data.error) {
         console.error(`❌ [CLIMA] Open-Meteo erro:`, data.reason);
         return res.status(500).json({
           error: 'Open-Meteo retornou erro',
           detalhes: data.reason || data.error
         });
       }
   
       if (!data.current || !data.daily || !data.daily.time) {
         console.error(`❌ [CLIMA] Estrutura inesperada. Recebido:`, JSON.stringify(data).substring(0, 500));
         return res.status(500).json({
           error: 'Dados de clima indisponíveis',
           motivo: 'estrutura_invalida',
           chaves_recebidas: Object.keys(data)
         });
       }
   
       const atual = {
         temperatura: data.current.temperature_2m ?? 0,
         sensacao: data.current.apparent_temperature ?? 0,
         umidade: data.current.relative_humidity_2m ?? 0,
         vento: data.current.wind_speed_10m ?? 0,
         codigo: data.current.weather_code ?? 0,
         descricao: getDescricaoClimaPT(data.current.weather_code ?? 0),
         max: data.daily.temperature_2m_max?.[0] ?? 0,
         min: data.daily.temperature_2m_min?.[0] ?? 0
       };
   
       const previsao = data.daily.time.map((dataStr, i) => ({
         data: dataStr,
         max: data.daily.temperature_2m_max?.[i] ?? 0,
         min: data.daily.temperature_2m_min?.[i] ?? 0,
         codigo: data.daily.weather_code?.[i] ?? 0,
         descricao: getDescricaoClimaPT(data.daily.weather_code?.[i] ?? 0),
         chuva: data.daily.precipitation_probability_max?.[i] ?? 0
       }));
   
       console.log(`✅ [CLIMA] Sucesso: ${geo.nome} - ${atual.temperatura}°C (${atual.descricao})`);
   
       res.json({
         cidade: geo.nome,
         estado: geo.estado,
         pais: geo.pais,
         atual,
         previsao
       });
   
     } catch (err) {
       console.error('❌ [CLIMA] Erro fatal:', err);
       res.status(500).json({
         error: 'Erro ao buscar clima',
         details: err.message,
         stack: err.stack?.substring(0, 300)
       });
     }
   });