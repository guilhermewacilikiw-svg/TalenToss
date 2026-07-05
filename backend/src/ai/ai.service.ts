import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey: apiKey || 'dummy-key' });
  }

  async parseResume(text: string): Promise<any> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey || apiKey === 'dummy-key') {
      // Retornar dados mockados para o sistema funcionar na ausência de API Key
      return {
        firstName: "Guilherme",
        lastName: "Candidato Mockado",
        headline: "Engenheiro de Software Sênior (Mock)",
        summary: "Especialista em React, Node.js e inteligência artificial. Perfil gerado de forma simulada pela falta de chave de API no .env.",
        employabilityScore: 85,
        skills: ["React", "TypeScript", "Node.js", "AI", "NestJS"],
        experiences: [
          { company: "Tech Empresa", title: "Desenvolvedor", description: "Atuação em software." }
        ]
      };
    }

    const prompt = `
      Você é um assistente de IA especialista em recrutamento.
      Extraia as informações do currículo abaixo e retorne APENAS um JSON válido.
      Não adicione introduções ou formatações Markdown fora do JSON.
      
      IMPORTANTE:
      Para o campo "summary" (resumo), não copie simplesmente o texto original. 
      Eu quero que você crie um resumo NOVO, EXTREMAMENTE COMPLETO E BEM ESCRITO (em 1 ou 2 parágrafos),
      fazendo um compilado inteligente que una as experiências profissionais da pessoa, suas formações acadêmicas e seus objetivos de carreira.

      Retorne um JSON com a seguinte estrutura:
      {
        "firstName": "Nome",
        "lastName": "Sobrenome",
        "headline": "Um título profissional curto",
        "summary": "Um resumo profissional em 2 ou 3 frases",
        "employabilityScore": 85,
        "phone": "Telefone (se houver)",
        "location": "Localização (se houver)",
        "linkedinUrl": "URL do LinkedIn (se houver)",
        "githubUrl": "URL do GitHub (se houver)",
        "skills": ["Habilidade 1", "Habilidade 2"],
        "experiences": [
          { "company": "Empresa", "title": "Cargo", "period": "Período", "description": "Descrição" }
        ],
        "education": [
          { "institution": "Instituição", "degree": "Grau", "field": "Área", "period": "Período" }
        ],
        "courses": [
          { "name": "Nome do Curso", "institution": "Instituição", "hours": "Carga horária ou período" }
        ]
      }
      
      Currículo:
      ${text}
    `;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });

      const resultText = chatCompletion.choices[0]?.message?.content || '{}';
      
      // Limpa os code blocks do Markdown se existirem
      const cleanJsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(cleanJsonStr);
    } catch (error) {
      this.logger.error('Failed to parse resume with Groq', error);
      return {};
    }
  }

  async structureJobProfile(title: string, description: string, requirements: string[]): Promise<string> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey || apiKey === 'dummy-key') {
      return `Job: ${title}. Requirements: ${requirements.join(', ')}.`;
    }

    const prompt = `
      Você é um assistente de IA especialista em recrutamento.
      Analise a vaga abaixo e crie um "Perfil Ideal Estruturado" detalhando os requisitos cruciais para essa vaga.
      Eu quero que o texto resultante seja extremamente denso em palavras-chave relevantes, focando em:
      - Nível de senioridade exigido.
      - Tempo de experiência esperado.
      - Core Skills (tecnologias, ferramentas, conhecimentos mandatórios).
      
      Não use markdown, retorne apenas um parágrafo denso e descritivo com as características ideais do candidato.
      
      Título: ${title}
      Descrição: ${description}
      Requisitos Listados: ${requirements.join(', ')}
    `;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });

      return chatCompletion.choices[0]?.message?.content?.trim() || title;
    } catch (error) {
      this.logger.error('Failed to structure job profile', error);
      return `${title} ${requirements.join(' ')}`;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Para tornar o Match do PGVector "Criterioso" e real (já que a Groq não tem endpoint nativo de embeddings),
    // vamos usar um algoritmo de Hashing Semântico (Pseudo-TF-IDF). 
    // Palavras iguais em posições hash iguais aumentarão o "Match Score" (Similaridade de Cosseno).
    
    const vector = new Array(768).fill(0);
    if (!text) return vector;

    // Normaliza o texto e extrai "tokens"
    const words = text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2);
    
    // Distribui o peso das palavras nas dimensões do vetor baseado no hash da palavra
    for (const word of words) {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      const index = Math.abs(hash) % 768;
      // Adiciona peso à dimensão específica (TF)
      vector[index] += 1;
    }

    // Normalização L2 (para que a similaridade de cosseno funcione perfeitamente)
    let sumSquares = 0;
    for (let i = 0; i < 768; i++) {
      sumSquares += vector[i] * vector[i];
    }
    const magnitude = Math.sqrt(sumSquares) || 1;
    
    for (let i = 0; i < 768; i++) {
      vector[i] = vector[i] / magnitude;
    }

    return vector;
  }
}
