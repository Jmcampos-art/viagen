import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Groq SDK — a chave vem do .env (nunca do código)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ============================================================
   ROTA: /api/itinerary
   Recebe: { destinations, month, climate, budget }
   Retorna: JSON com roteiro dia a dia gerado pela IA (Llama)
   ============================================================ */
app.post('/api/itinerary', async (req, res) => {
  try {
    const { destinations, month, climate, budget } = req.body;

    const prompt = `
Você é um agente de viagens especialista. Crie um ROTEIRO DE VIAGEM completo e detalhado em português do Brasil.

PERFIL DO VIAJANTE:
- Destinos desejados: ${destinations.map(d => `${d.name}, ${d.country}`).join(' → ')}
- Mês da viagem: ${month || 'Flexível'}
- Clima preferido: ${climate || 'Variado'}
- Orçamento: ${budget || 'Sem restrição'}

INSTRUÇÕES:
1. Crie um roteiro DIA A DIA para cada destino
2. Para cada dia, sugira 2-3 atividades específicas (com nomes reais de lugares)
3. Indique quanto tempo passar em cada destino
4. Inclua dicas práticas (transporte, melhor horário, o que levar)
5. Sugira restaurantes ou pratos típicos
6. Estime custos aproximados por dia em reais

FORMATO DE RESPOSTA (JSON puro, sem markdown):
{
  "titulo": "Título da viagem",
  "resumo": "Resumo de 2-3 frases sobre a viagem",
  "duracaoTotal": 14,
  "destinos": [
    {
      "nome": "Nome do destino",
      "pais": "País",
      "dias": 4,
      "porQueVisitar": "Frase curta",
      "dicas": ["Dica 1", "Dica 2"],
      "custoEstimado": 3500,
      "roteiro": [
        {
          "dia": 1,
          "titulo": "Chegada e centro histórico",
          "manha": "Atividade da manhã",
          "tarde": "Atividade da tarde",
          "noite": "Atividade da noite",
          "refeicao": "Sugestão de restaurante/prato",
          "custoDia": 400
        }
      ]
    }
  ],
  "custoTotal": 12000,
  "melhorEpoca": "Descrição da melhor época",
  "oQueLevar": ["item 1", "item 2"],
  "alertas": ["alerta 1"]
}
`;

    // Chamada à Groq (modelo Llama 3.3 70B — rápido e ótimo para JSON)
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Você é um agente de viagens especialista que responde SEMPRE em JSON válido, sem markdown, sem comentários."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000
    });

    let text = completion.choices[0]?.message?.content || '';

    // Limpa possíveis marcadores de código (por segurança)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const itinerary = JSON.parse(text);
    res.json(itinerary);
  } catch (error) {
    console.error('Erro IA Groq:', error);
    res.status(500).json({
      error: 'Erro ao gerar roteiro',
      details: error.message
    });
  }
});

/* Rota de teste */
app.get('/', (req, res) => {
  res.json({ status: 'Backend TravelMatch AI + Groq funcionando! 🚀' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`🤖 IA: Groq (Llama 3.3 70B)`);
});