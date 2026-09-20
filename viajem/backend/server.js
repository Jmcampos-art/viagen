import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ============================================================
   ROTA RAIZ - Teste
   ============================================================ */
app.get('/', (req, res) => {
  res.json({ 
    status: 'Backend ViaGen AI + Groq funcionando! 🚀',
    rotas: [
      'GET /',
      'GET /test-ai',
      'POST /api/search-destination',
      'POST /api/itinerary'
    ]
  });
});

/* ============================================================
   ROTA DE TESTE IA
   ============================================================ */
app.get('/test-ai', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Responda apenas: FUNCIONANDO" }],
      max_tokens: 20
    });
    
    res.json({
      status: "✅ IA funcionando!",
      resposta: completion.choices[0]?.message?.content,
      chaveGroq: process.env.GROQ_API_KEY ? "✅ Configurada" : "❌ NÃO CONFIGURADA"
    });
  } catch (error) {
    res.status(500).json({
      status: "❌ IA com erro",
      erro: error.message,
      chaveGroq: process.env.GROQ_API_KEY ? "✅ Configurada" : "❌ NÃO CONFIGURADA"
    });
  }
});

/* ============================================================
   ROTA: /api/search-destination
   Busca um destino QUALQUER usando IA
   ============================================================ */
app.post('/api/search-destination', async (req, res) => {
  try {
    const { query, month, climate, budget } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Query muito curta' });
    }

    console.log(`🔍 Buscando destino: "${query}"`);

    const prompt = `
Você é um especialista em viagens. O usuário buscou por: "${query}"

Crie um perfil COMPLETO de destino de viagem em português do Brasil.

INFORMAÇÕES DO USUÁRIO:
- Mês desejado: ${month || 'Flexível'}
- Clima preferido: ${climate || 'Variado'}
- Orçamento: ${budget || 'Sem restrição'}

INSTRUÇÕES:
1. Se "${query}" for uma cidade/país/região real, crie o perfil desse lugar
2. Se for ambíguo, escolha o destino mais provável
3. Use valores REALISTAS de preços em reais (R$)
4. Inclua atrações REAIS e famosas
5. Crie roteiro de 4-6 dias com atividades específicas

FORMATO DE RESPOSTA (JSON puro):
{
  "id": 9999,
  "name": "Nome da Cidade",
  "country": "País",
  "region": "Região",
  "climate": "ameno",
  "climateLabel": "Ameno / Mediterrâneo",
  "bestMonths": [1,2,3,4,5,6,7,8,9,10,11,12],
  "pricing": { "flight": 3500, "hotelPerNight": 450, "tours": 500 },
  "currency": "R$",
  "attractions": ["Atração 1", "Atração 2", "Atração 3", "Atração 4", "Atração 5"],
  "image": "https://source.unsplash.com/featured/?NOMEDACIDADE,travel",
  "description": "Descrição curta",
  "rating": 9.0,
  "idealDays": 5,
  "tips": "Dica prática",
  "activities": [
    { "day": 1, "title": "Chegada", "desc": "Descrição" },
    { "day": 2, "title": "Atração", "desc": "Descrição" },
    { "day": 3, "title": "Passeio", "desc": "Descrição" },
    { "day": 4, "title": "Bairro", "desc": "Descrição" },
    { "day": 5, "title": "Despedida", "desc": "Descrição" }
  ]
}

O campo "climate" DEVE ser: "calor", "frio", "ameno", "tropical" ou "seco"
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em viagens que responde SEMPRE em JSON válido, sem markdown."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 4000
    });

    let text = completion.choices[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const destination = JSON.parse(text);
    console.log(`✅ Destino encontrado: ${destination.name}`);
    res.json(destination);
  } catch (error) {
    console.error('❌ Erro IA busca destino:', error);
    res.status(500).json({
      error: 'Erro ao buscar destino',
      details: error.message
    });
  }
});

/* ============================================================
   ROTA: /api/itinerary
   ============================================================ */
app.post('/api/itinerary', async (req, res) => {
  try {
    const { destinations, month, climate, budget } = req.body;

    const prompt = `
Você é um agente de viagens. Crie um ROTEIRO DE VIAGEM em português do Brasil.

PERFIL:
- Destinos: ${destinations.map(d => `${d.name}, ${d.country}`).join(' → ')}
- Mês: ${month || 'Flexível'}
- Clima: ${climate || 'Variado'}
- Orçamento: ${budget || 'Sem restrição'}

Retorne JSON puro:
{
  "titulo": "Título",
  "resumo": "Resumo",
  "duracaoTotal": 14,
  "destinos": [
    {
      "nome": "Nome",
      "pais": "País",
      "dias": 4,
      "porQueVisitar": "Frase",
      "dicas": ["Dica 1"],
      "custoEstimado": 3500,
      "roteiro": [
        {
          "dia": 1,
          "titulo": "Título do dia",
          "manha": "Atividade",
          "tarde": "Atividade",
          "noite": "Atividade",
          "refeicao": "Restaurante",
          "custoDia": 400
        }
      ]
    }
  ],
  "custoTotal": 12000
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Responda SEMPRE em JSON válido, sem markdown." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    let text = completion.choices[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Erro IA roteiro:', error);
    res.status(500).json({ error: 'Erro ao gerar roteiro', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`🤖 IA: Groq (Llama 3.3 70B)`);
  console.log(`📋 Rotas disponíveis:`);
  console.log(`   GET  /`);
  console.log(`   GET  /test-ai`);
  console.log(`   POST /api/search-destination`);
  console.log(`   POST /api/itinerary`);
});